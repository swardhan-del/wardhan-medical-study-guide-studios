import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { consentKey } from "../../src/lib/measurement-consent";

const config = { enabled: true, recipient: "Test measurement recipient", privacyUrl: "https://collector.example.invalid/privacy", consentVersion: "abcdef012345abcdef012345" };
type EventRecord = Record<string, unknown>;
async function mockMeasurement(page: Page, mode: "ok" | "blocked" = "ok") {
  const events: EventRecord[] = [];
  const headers: Record<string, string>[] = [];
  await page.route("**/api/measurement", async route => {
    if (route.request().method() === "GET") { await route.fulfill({ json: config }); return; }
    events.push(route.request().postDataJSON()); headers.push(route.request().headers());
    if (mode === "blocked") await route.abort("blockedbyclient");
    else await route.fulfill({ status: 204 });
  });
  return { events, headers };
}
async function allow(page: Page) {
  await page.goto("/privacy");
  await page.getByRole("button", { name: "Allow optional analytics", exact: true }).click();
  await expect(page.locator("#analytics-preference [role=status]")).toContainText("now allowed");
}
async function completeQuestion(page: Page) {
  const check = page.locator("#concept-check-title:visible");
  await check.getByRole("radio").first().check();
  await check.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(check.getByRole("status")).toBeVisible();
}

test("default environment exposes no provider or credentials and no optional SDK", async ({ page, request }) => {
  const response = await request.get("/api/measurement");
  expect(response.status()).toBe(200); expect(await response.json()).toEqual({ enabled: false });
  expect(response.headers()["cache-control"]).toContain("no-store");
  expect(response.headers()["x-robots-tag"]).toContain("noindex");
  const posts: string[] = [], scripts: string[] = [];
  page.on("request", req => { if(req.method()==="POST" && req.url().includes("/api/measurement"))posts.push(req.url());if(req.resourceType()==="script")scripts.push(req.url()); });
  await page.goto("/library/anatomy-foundations"); await completeQuestion(page);
  await page.goto("/privacy");
  await expect(page.getByText("Optional analytics is not configured or is unavailable. No learning events are sent.", { exact: true })).toBeVisible();
  expect(posts).toEqual([]); expect(scripts.some(url=>url.includes("vercel-insights")||url.includes("/_vercel/insights"))).toBe(false);
});

test("no events before consent, after refusal or from earlier activity; preference persists", async ({ page }) => {
  const { events } = await mockMeasurement(page);
  await page.goto("/library/anatomy-foundations");
  await expect(page.getByRole("complementary", { name: "Optional analytics" })).toBeVisible();
  await completeQuestion(page); expect(events).toEqual([]);
  await page.getByRole("button", { name: "Keep analytics off", exact: true }).click();
  await page.reload(); await expect(page.getByRole("button", { name: "Keep analytics off" })).toBeVisible();
  expect(events).toEqual([]);
  await allow(page); expect(events).toEqual([]);
  await page.reload(); await expect(page.getByRole("button", { name: "Withdraw analytics consent" })).toBeVisible();
  expect(events).toEqual([]);
});

test("only public event identifiers are sent for subjects, lessons, checked questions and complete saved summaries", async ({ page }) => {
  const { events, headers } = await mockMeasurement(page);
  await allow(page);
  await page.goto("/study/anatomy");
  await expect.poll(()=>events).toContainEqual({ version:1,event:"subject_selected",subject_id:"anatomy" });
  await page.goto("/library/anatomy-foundations?private=student%40example.com#private-answer");
  await expect.poll(()=>events).toContainEqual({version:1,event:"lesson_opened",lesson_id:"anatomy-foundations"});
  await completeQuestion(page);
  await expect.poll(()=>events).toContainEqual({version:1,event:"quiz_completed",quiz_id:"concept-anatomy-foundations"});
  await page.getByRole("textbox", { name: "My oral examination notes", exact: true }).fill("private student answer student@example.com");
  const checks=page.locator('section[aria-labelledby="summary-checklist-title"] input[type="checkbox"]:visible');
  const count=await checks.count();expect(count).toBeGreaterThan(1);
  for(let i=0;i<count-1;i++)await checks.nth(i).check();
  expect(events.filter(e=>e.event==="summary_saved")).toHaveLength(0);
  await checks.last().check();
  await expect.poll(()=>events.filter(e=>e.event==="summary_saved")).toEqual([{version:1,event:"summary_saved",lesson_id:"anatomy-foundations"}]);
  expect(JSON.stringify(events)).not.toMatch(/student@|private|answer|score|draft|email|referrer|url/);
  for(const event of events)expect(Object.keys(event).sort()).toEqual(["event",event.event==="subject_selected"?"subject_id":event.event==="quiz_completed"?"quiz_id":"lesson_id","version"].sort());
  for(const h of headers){expect(h.referer).toBeUndefined();expect(h.cookie).toBeUndefined();expect(h["x-measurement-consent"]).toBe(config.consentVersion);}
});

test("withdrawal stops new events and cross-tab withdrawal is honoured", async ({ page, context }) => {
  const { events }=await mockMeasurement(page);
  await allow(page);
  const other=await context.newPage(); const second=await mockMeasurement(other);
  await other.goto("/privacy");await expect(other.getByRole("button",{name:"Withdraw analytics consent"})).toBeVisible();
  await page.getByRole("button",{name:"Withdraw analytics consent"}).click();
  await expect(other.getByRole("button",{name:"Keep analytics off"})).toBeVisible();
  await page.goto("/library/anatomy-foundations");await completeQuestion(page);
  await other.goto("/library/epithelia");
  await expect(other.getByRole("heading",{level:1})).toBeVisible();
  expect(events).toEqual([]);expect(second.events).toEqual([]);
});

for(const signal of ["dnt","gpc","blocked-storage","expired","policy-change","legacy-allow"] as const)test(`${signal}: measurement stays off`,async({page})=>{
  const {events}=await mockMeasurement(page);
  await page.addInitScript(({signal,key,version})=>{
    if(signal==="dnt")Object.defineProperty(navigator,"doNotTrack",{value:"1"});
    if(signal==="gpc")Object.defineProperty(navigator,"globalPrivacyControl",{value:true});
    if(signal==="blocked-storage")Object.defineProperty(window,"localStorage",{get(){throw new Error("storage unavailable");}});
    else if(signal==="legacy-allow")localStorage.setItem("wardhan-analytics-optout","0");
    else localStorage.setItem(key,JSON.stringify({choice:"granted",version:signal==="policy-change"?"old":version,decidedAt:Date.now()-(signal==="expired"?181*86400000:0)}));
  },{signal,key:consentKey,version:config.consentVersion});
  await page.goto("/library/anatomy-foundations");await completeQuestion(page);
  await page.goto("/privacy");await expect(page.locator("#analytics-preference")).toBeVisible();
  if(signal === "blocked-storage")await expect(page.getByRole("button",{name:"Allow optional analytics"})).toBeDisabled();
  if(signal === "dnt" || signal === "gpc")await expect(page.getByText("Your browser privacy signal keeps analytics off.", {exact:true})).toBeVisible();
  expect(events).toEqual([]);
});

test("blocked configuration and blocked delivery leave learning usable without client exceptions",async({page})=>{
  const errors:string[]=[];page.on("pageerror",error=>errors.push(error.message));
  await page.route("**/api/measurement",route=>route.abort("blockedbyclient"));
  await page.goto("/library/anatomy-foundations");await completeQuestion(page);
  await page.unroute("**/api/measurement");
  const {events}=await mockMeasurement(page,"blocked");
  await allow(page);
  await page.goto("/library/epithelia");await completeQuestion(page);
  await expect.poll(()=>events.some(e=>e.event==="quiz_completed")).toBe(true);
  await page.goto("/study");await expect(page.getByRole("heading",{level:1})).toBeVisible();
  expect(errors).toEqual([]);
});

test("consent controls support keyboard use, clear feedback and mobile accessibility",async({page},info)=>{
  await mockMeasurement(page);
  await page.goto("/privacy");
  const refuse=page.getByRole("button",{name:"Keep analytics off",exact:true});
  await refuse.focus();await page.keyboard.press("Enter");
  await expect(page.locator("#analytics-preference [role=status]")).toContainText("off");
  await expect(page.locator("#analytics-preference [role=status]")).toBeFocused();
  const accept=page.getByRole("button",{name:"Allow optional analytics",exact:true});
  await accept.focus();await page.keyboard.press("Enter");
  await expect(page.getByRole("button",{name:"Withdraw analytics consent"})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();expect(result.violations).toEqual([]);
  await page.screenshot({path:info.outputPath("analytics-preferences.png"),fullPage:true});
});


test("integrated recap and successful starter-pack downloads use consented fixed events", async ({ page }) => {
  const { events } = await mockMeasurement(page);
  await allow(page);
  await page.goto("/library/physiology-membrane-foundations");
  await page.getByRole("button", { name: "Save summary to My Study", exact: true }).click();
  await expect.poll(() => events).toContainEqual({ version: 1, event: "summary_saved", lesson_id: "physiology-membrane-foundations" });
  await page.goto("/starter-pack");
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download starter pack (HTML)", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("wardhan-study-guide-starter-pack.html");
  await expect.poll(() => events).toContainEqual({ version: 1, event: "starter_pack_requested", asset_id: "study-guide-starter-pack" });
  expect(events.every(event => !JSON.stringify(event).includes("@"))).toBe(true);
});

test("failed downloads and demo signups never emit successful conversion events", async ({ page }) => {
  const { events } = await mockMeasurement(page);
  await allow(page);
  await page.route("**/starter-pack/download", route => route.fulfill({ status: 503 }));
  await page.goto("/starter-pack");
  await page.getByRole("link", { name: "Download starter pack (HTML)", exact: true }).click();
  await expect(page.getByRole("navigation", { name: "Starter pack actions" }).getByRole("status")).toContainText("could not be prepared");
  expect(events.some(event => event.event === "starter_pack_requested")).toBe(false);
  await page.goto("/waitlist");
  await page.getByLabel("Example email address (required)", { exact: true }).fill("student@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Try demo/ }).click();
  await expect(page.locator(".waitlist-panel")).toContainText("no email");
  expect(events.some(event => event.event === "waitlist_submitted")).toBe(false);
});

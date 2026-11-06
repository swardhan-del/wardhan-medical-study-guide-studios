import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import teaching from "../../src/content/library-lessons.json";
import practice from "../../src/content/transfer-practice.json";
import specimen from "../../src/content/lymphoid-specimen.json";

const route = "/library/lymphoid-organs";
const lesson = teaching.lessons.find(x => x.id === "lymphoid-organs")!;
const panelSelector = 'section[aria-labelledby="lymphoid-specimen-title"]';

test("First-time student finds, saves and returns from the lymphoid specimen lesson", async ({page}) => {
  await page.goto("/");
  await page.getByRole("navigation",{name:"Primary navigation"}).getByRole("link",{name:"Subjects",exact:true}).click();
  await page.locator('a[href="/subjects/histology"]').click();
  await page.getByRole("searchbox",{name:"Search resources",exact:true}).fill("lymphoid");
  const card=page.locator(".resource-card:visible").filter({has:page.locator('a[href="/library/lymphoid-organs"]')});await expect(card).toHaveCount(1);
  await card.getByRole("link",{name:"Read lesson",exact:true}).click();await expect(page.locator("h1")).toHaveText(lesson.title);
  await page.getByRole("link",{name:"Read the specimen",exact:true}).click();await expect(page.locator("#lymphoid-specimen-title")).toBeInViewport();
  const save=page.getByRole("button",{name:`Save to My Study: ${lesson.title}`,exact:true});await save.click();await page.reload();
  const saved=page.getByRole("button",{name:`Saved to My Study: ${lesson.title} (remove from saved resources)`,exact:true});await expect(saved).toHaveAttribute("aria-pressed","true");await saved.click();await page.reload();await expect(save).toBeVisible();
  await page.getByRole("navigation",{name:"Breadcrumb"}).locator('a[href="/subjects/histology"]').click();await expect(page.getByRole("searchbox",{name:"Search resources",exact:true})).toBeVisible();
});

test("Lymphoid explanation preserves full content, references and source boundaries", async ({page}) => {
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  expect((await page.goto(route))?.status()).toBe(200);
  const sections=page.locator(".concept-sequence > details"); await expect(sections).toHaveCount(23);
  for(const [i,step] of lesson.steps.entries()) {
    expect(await sections.nth(i).locator(":scope > p").allTextContents()).toEqual(step.body.split("\n\n"));
    expect(await sections.nth(i).locator('a[href^="https://"]').count()).toBeGreaterThan(0);
  }
  await expect(page.locator("main")).toContainText("lymphotoxin α1β2");
  await expect(page.locator("main")).toContainText("ICAM-1/VCAM-1");
  expect(await page.locator('main a[href*="dropbox"]').count()).toBe(0);
  expect(await page.locator("main").innerText()).not.toMatch(/\/Users\/|rlkey=|Library\/CloudStorage/);
  await expect(page.locator('img[src="/images/figures/normal-lymph-node-architecture.jpg"]')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("Specimen regions work with the keyboard and markers can be hidden", async ({page},info) => {
  await page.goto(route); await page.getByRole("link",{name:"Read the specimen",exact:true}).click();
  const panel=page.locator(panelSelector);
  for(const [i,region] of specimen.regions.entries()) {
    const control=panel.getByRole("button",{name:`${i+1}. ${region.label}`,exact:true}); await control.focus(); await page.keyboard.press("Enter");
    await expect(control).toHaveAttribute("aria-pressed","true");
    await expect(page.locator("#lymphoid-region-description")).toContainText(region.observation);
    await expect(page.locator("#lymphoid-region-description")).toContainText(region.interpretation);
    await expect(page.locator("#lymphoid-region-description")).toContainText(region.limit);
  }
  await expect(panel.locator('[aria-hidden="true"] span')).toHaveCount(4);
  await panel.getByRole("button",{name:"Hide region markers"}).click(); await expect(panel.locator('[aria-hidden="true"] span')).toHaveCount(0);
  await panel.getByRole("button",{name:"Show region markers"}).click();
  await panel.screenshot({path:info.outputPath("lymphoid-specimen.png")});
});

test("Typed comparison gives a model without grading, sending or persisting an answer", async ({page}) => {
  await page.goto(route); const panel=page.locator(panelSelector); const text=panel.locator("textarea");
  const sent: string[]=[]; page.on("request",r=>{if(r.method()==="POST")sent.push(r.postData()??"");});
  await text.fill("Two peripheral nodules and surrounding fat; I need a clearer inner boundary.");
  await panel.getByRole("button",{name:"Compare with model reasoning",exact:true}).click();
  await expect(panel.getByRole("status")).toContainText(specimen.model);
  await expect(panel).toContainText("does not grade your wording");
  expect(sent.some(x=>x.includes("Two peripheral nodules"))).toBe(false);
  expect(await page.evaluate(()=>JSON.stringify(localStorage))).not.toContain("Two peripheral nodules");
  await text.fill("Changed observation"); await expect(panel.getByRole("status")).toHaveCount(0);
  await panel.getByRole("button",{name:"Clear my response"}).click(); await expect(text).toHaveValue("");
  await text.fill("Transient response"); await page.reload(); await expect(text).toHaveValue("");
});

test("Lymphoid questions explain distractors, correct answers and retain practice progress", async ({page}) => {
  await page.goto(route); await page.getByRole("button",{name:"Show all questions",exact:true}).click();
  const questions=practice.questions.filter(q=>q.topic==="lymphoid-organs" && q.id.endsWith("20261106")); expect(questions).toHaveLength(12);
  for(const q of questions) {
    const block=page.locator(`#question-${q.id}`);const wrong=(q.answer+1)%q.options.length;
    await block.getByRole("radio",{name:q.options[wrong].text,exact:true}).check();await block.getByRole("button",{name:"Check answer",exact:true}).click();await expect(block).toContainText(q.options[wrong].explanation);
    await block.getByRole("button",{name:"Try without feedback",exact:true}).click();await block.getByRole("radio",{name:q.options[q.answer].text,exact:true}).check();await block.getByRole("button",{name:"Check answer",exact:true}).click();await expect(block).toContainText(q.options[q.answer].explanation);
  }
  await page.reload();await page.getByRole("button",{name:"Show all questions",exact:true}).click();
  for(const q of questions)await expect(page.locator(`#question-${q.id}`).getByRole("radio",{name:q.options[q.answer].text,exact:true})).toBeChecked();
});

test("Credited download preserves approved pixels and narrow text stays readable", async ({page,request},info) => {
  await page.goto(route);const panel=page.locator(panelSelector);
  await expect(panel.getByRole("link",{name:"CC BY 4.0 terms"})).toHaveAttribute("href","https://creativecommons.org/licenses/by/4.0/");
  const asset=await request.get("/images/figures/normal-lymph-node-architecture.jpg");expect(asset.status()).toBe(200);
  expect(createHash("sha256").update(await asset.body()).digest("hex")).toBe("12db8e92c4374ada54aead9b4aa878d03b104de48c52335f6b62a1c19f55f1f6");
  const downloadPromise=page.waitForEvent("download");await panel.getByRole("link",{name:"Download credited specimen image"}).click();expect((await downloadPromise).suggestedFilename()).toBe("normal-lymph-node-architecture.jpg");
  await expect(panel).toContainText("Stain, exact magnification and physical scale are not supplied");
  expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
  await page.setViewportSize({width:320,height:900});await page.addStyleTag({content:"html { font-size:200% !important; }"});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
  expect(await panel.evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);
  await panel.screenshot({path:info.outputPath("lymphoid-320px-200pct.png")});
  await page.locator("#lymphoid-specimen-title").scrollIntoViewIfNeeded();
  await page.screenshot({path:info.outputPath("lymphoid-enlarged-viewport.png")});
});

test("Image failure and JavaScript absence retain explanations", async ({page,browser,baseURL},info) => {
  await page.route("**/normal-lymph-node-architecture.jpg",r=>r.abort());await page.goto(route);const panel=page.locator(panelSelector);
  await expect(panel.getByRole("status")).toContainText("specimen image could not load");
  await panel.getByText("Read all four region explanations",{exact:true}).click();for(const r of specimen.regions)await expect(panel.getByText(r.interpretation,{exact:true}).last()).toBeVisible();
  const context=await browser.newContext({javaScriptEnabled:false,baseURL});const plain=await context.newPage();await plain.goto(route);
  await plain.getByText("Read all four region explanations",{exact:true}).click();for(const r of specimen.regions)await expect(plain.locator(panelSelector).getByText(r.interpretation,{exact:true}).last()).toBeVisible();
  await plain.getByText("Read the model without entering a response",{exact:true}).click();await expect(plain.getByText(specimen.model,{exact:true})).toBeVisible();
  await expect(plain.locator(`${panelSelector} noscript`)).toBeVisible();
  await plain.locator(panelSelector).screenshot({path:info.outputPath("lymphoid-no-javascript.png")});await context.close();
});

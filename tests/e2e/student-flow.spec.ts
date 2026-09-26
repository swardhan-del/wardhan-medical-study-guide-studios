import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import library from "../../src/content/library-lessons.json";
const id = "biochemistry-enzyme-foundations";
const lesson = library.lessons.find(item => item.id === id)!;

test("first session persists stages, completion and saved summaries, then recommends the next lesson", async ({ page }, info) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Choose my first subject", exact: true }).click();
  await page.getByRole("link", { name: "Start Biochemistry", exact: true }).click();
  const journey = page.getByRole("region", { name: "Your lesson journey" });
  await expect(journey.getByRole("progressbar")).toHaveAttribute("value", "0");
  await journey.getByRole("button", { name: "Mark explanation reviewed" }).click();
  await journey.getByRole("link", { name: "Practice", exact: true }).click();
  const check = page.locator("#concept-check-title");
  await check.getByRole("radio", { name: lesson.question.options[lesson.question.answer].text, exact: true }).check();
  await check.getByRole("button", { name: "Check answer", exact: true }).click();
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Resume lesson" })).toHaveAttribute("href", `/library/${id}#concept-check-title`);
  await page.getByRole("link", { name: "Resume lesson" }).click();
  await expect(check.getByRole("radio", { name: lesson.question.options[lesson.question.answer].text, exact: true })).toBeChecked();
  await journey.getByRole("link", { name: "Review summary", exact: true }).click();
  const review = page.getByRole("region", { name: "Review summary", exact: true });
  await expect(review.getByRole("button", { name: "Mark lesson complete", exact: true })).toBeDisabled();
  await review.getByRole("button", { name: "Save summary to My Study" }).click();
  await review.getByRole("button", { name: "Mark summary reviewed" }).click();
  await review.getByRole("button", { name: "Mark lesson complete", exact: true }).click();
  await page.reload();
  await expect(review.getByRole("button", { name: "Lesson complete — reopen" })).toHaveAttribute("aria-pressed", "true");
  await expect(journey.getByRole("progressbar")).toHaveAttribute("value", "3");
  await review.getByRole("button", { name: "Lesson complete — reopen" }).click();
  await expect(review.getByRole("button", { name: "Mark lesson complete", exact: true })).toBeEnabled();
  await review.getByRole("button", { name: "Mark lesson complete", exact: true }).click();
  await review.getByRole("button", { name: "Summary reviewed — undo" }).click();
  await expect(review.getByRole("button", { name: "Mark lesson complete", exact: true })).toBeDisabled();
  await review.getByRole("button", { name: "Mark summary reviewed" }).click();
  await review.getByRole("button", { name: "Mark lesson complete", exact: true }).click();
  await review.screenshot({ path: info.outputPath("lesson-summary.png") });
  await page.goto("/study");
  await page.locator("#saved-summaries summary").click();
  await expect(page.locator("#saved-summaries")).toContainText(lesson.recall.answer);
  await page.getByRole("link", { name: /^Next: Explain enzyme kinetics/ }).click();
  await expect(page).toHaveURL(/\/library\/enzyme-kinetics$/);
});

test("cross-tab updates, reopening, export/import and reset include new progress fields", async ({ page, context }) => {
  await page.goto(`/library/${id}#lesson-review`);
  await page.getByRole("button", { name: "Save summary to My Study" }).click();
  const other = await context.newPage();
  await other.goto("/study");
  await expect(other.locator("#saved-summaries summary")).toHaveCount(1);
  await page.getByRole("button", { name: "Summary saved — remove" }).click();
  await expect(other.locator("#saved-summaries")).toContainText("No summaries saved yet");
  await page.getByRole("button", { name: "Save summary to My Study" }).click();
  const transfer = other.waitForEvent("download");
  await other.getByRole("button", { name: "Export progress and saved resources" }).click();
  const download = await transfer;
  const raw = await readFile((await download.path())!, "utf8");
  expect(JSON.parse(raw).progress.journey[id].saved).toBe(true);
  await other.getByText("Manage study progress", { exact: true }).click();
  await other.getByRole("button", { name: "Clear learning progress", exact: true }).click();
  await other.getByRole("button", { name: "Yes, clear progress" }).click();
  await expect(other.locator("#saved-summaries")).toContainText("No summaries saved yet");
  await expect(page.getByRole("button", { name: "Save summary to My Study" })).toBeVisible();
  expect(await other.evaluate(() => JSON.parse(localStorage.getItem("wardhan-learning:v1")!).resume)).toBeNull();
  await other.getByLabel("Import a progress file").setInputFiles({ name: "progress.json", mimeType: "application/json", buffer: Buffer.from(raw) });
  await other.getByRole("button", { name: "Merge imported progress" }).click();
  await expect(other.locator("#saved-summaries summary")).toHaveCount(1);
  await other.close();
});

test("blocked storage and corrupt progress keep lessons usable with honest recovery states", async ({ page, context }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "getItem", { value: () => { throw new Error("Storage blocked"); } });
    Object.defineProperty(Storage.prototype, "setItem", { value: () => { throw new Error("Storage blocked"); } });
  });
  await page.goto(`/library/${id}`);
  await expect(page.getByRole("region", { name: "Your lesson journey" })).toContainText("Browser storage is unavailable");
  await page.getByRole("button", { name: "Mark explanation reviewed" }).click();
  await expect(page.getByRole("button", { name: "Explanation reviewed — undo" })).toHaveAttribute("aria-pressed", "true");
  const check = page.locator("#concept-check-title");
  await check.getByRole("radio").first().check();
  await check.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(page.getByRole("region", { name: "Your lesson journey" }).getByRole("progressbar")).toHaveAttribute("value", "2");
  const clean = await context.browser()!.newContext();
  try {
    const target = await clean.newPage();
    await target.addInitScript(() => localStorage.setItem("wardhan-learning:v1", "{broken"));
    await target.goto("http://127.0.0.1:3101/");
    await expect(target.getByRole("link", { name: "Choose my first subject" })).toBeVisible();
  } finally { await clean.close(); }
});

test("library progress filters combine with search and clearing restores keyboard focus", async ({ page }) => {
  await page.goto(`/library/${id}`);
  await page.goto("/library");
  await page.getByRole("combobox", { name: "Lesson progress", exact: true }).selectOption("started");
  await expect(page.locator(".resource-card")).toHaveCount(1);
  await expect(page.locator(".resource-card")).toContainText(lesson.title);
  await page.getByRole("searchbox", { name: "Search resources" }).fill("no-such-subject-zzzz");
  await expect(page.getByRole("heading", { name: "No matching resources." })).toBeVisible();
  await page.locator(".catalog-empty").getByRole("button", { name: "Clear filters" }).click();
  await expect(page.getByRole("searchbox", { name: "Search resources" })).toBeFocused();
  await expect(page.locator(".resource-card")).toHaveCount(18);
});

test("starter pack downloads a complete offline edition with matching answers and printable layout", async ({ page }, info) => {
  await page.goto("/starter-pack");
  await expect(page.locator(".pack-lesson")).toHaveCount(7);
  await expect(page.locator(".pack-answer")).toHaveCount(7);
  const downloading = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download starter pack (HTML)" }).click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe("wardhan-study-guide-starter-pack.html");
  const html = await readFile((await download.path())!, "utf8");
  expect(html).not.toMatch(/<script|<img|<iframe/);
  // The saved file works with no network; all content and CSS are embedded.
  await page.context().setOffline(true);
  await page.setContent(html);
  await expect(page.getByRole("heading", { name: "Study Guide starter pack", exact: true })).toBeVisible();
  await expect(page.locator(".pack-lesson")).toHaveCount(7);
  await expect(page.locator(".pack-key")).toContainText(lesson.question.options[lesson.question.answer].reason);
  await page.emulateMedia({ media: "print" });
  expect(await page.locator(".pack-lesson").first().evaluate(element => getComputedStyle(element).breakBefore)).toBe("page");
  await page.screenshot({ path: info.outputPath("starter-pack-print.png") });
  await page.context().setOffline(false);
});

test("new learning surfaces are accessible at mobile and desktop sizes with visible keyboard focus", async ({ page }, info) => {
  if (info.project.name === "mobile") await page.setViewportSize({ width: 320, height: 844 });
  for (const route of ["/", "/start", `/library/${id}`, "/study", "/library", "/starter-pack"]) {
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(results.violations, `${route}: ${JSON.stringify(results.violations.map(item => ({ id: item.id, nodes: item.nodes.map(node => node.target) })))}`).toEqual([]);
  }
  await page.goto(`/library/${id}`);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await page.getByRole("region", { name: "Your lesson journey" }).getByRole("link", { name: "Review summary", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#lesson-review$/);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Save summary to My Study" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Summary saved — remove" })).toHaveAttribute("aria-pressed", "true");
  await page.screenshot({ path: info.outputPath("keyboard-summary.png") });
});

test("analytics sends nothing by default and missing routes offer library recovery", async ({ page }) => {
  const analyticsRequests: string[] = [];
  page.on("request", request => { if (/\/insights\/|vitals\.vercel|va\.vercel/.test(request.url())) analyticsRequests.push(request.url()); });
  await page.goto(`/library/${id}`);
  await page.getByRole("button", { name: "Save summary to My Study" }).click();
  await page.goto("/privacy");
  await expect(page.getByText("Optional Vercel Web Analytics is disabled by default.", { exact: false })).toBeVisible();
  expect(analyticsRequests).toEqual([]);
  await page.getByRole("button", { name: "Allow analytics", exact: true }).click();
  expect(await page.evaluate(() => localStorage.getItem("wardhan-analytics-optout"))).toBe("0");
  await page.getByRole("button", { name: "Disable analytics in this browser" }).click();
  expect(await page.evaluate(() => localStorage.getItem("wardhan-analytics-optout"))).toBe("1");
  const response = await page.goto("/missing-student-lesson");
  expect(response?.status()).toBe(404);
  await page.getByRole("link", { name: "Search the library", exact: true }).click();
  await expect(page).toHaveURL(/\/library$/);
});


test("storage quota failures retain usable in-tab state and do not claim a saved summary", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(Storage.prototype, "setItem", { value: () => { throw new DOMException("Full", "QuotaExceededError"); } });
  });
  await page.goto(`/library/${id}#lesson-review`);
  await page.getByRole("button", { name: "Save summary to My Study" }).click();
  await expect(page.getByRole("region", { name: "Review summary", exact: true })).toContainText("Summary kept for this visit only");
  await page.getByRole("link", { name: "My saved summaries", exact: true }).click();
  await expect(page.locator("#saved-summaries summary")).toHaveCount(1);
  await page.reload();
  await expect(page.locator("#saved-summaries")).toContainText("No summaries saved yet");
});


test("the existing renal course participates in resume without replacing its completion controls", async ({ page }) => {
  await page.goto("/learn/renal/kidney-map");
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Resume lesson", exact: true })).toHaveAttribute("href", "/learn/renal/kidney-map");
  await page.getByRole("link", { name: "Resume lesson", exact: true }).click();
  await page.getByRole("link", { name: "Go to the questions ↓", exact: true }).click();
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Resume lesson", exact: true })).toHaveAttribute("href", "/learn/renal/kidney-map#lesson-quiz");
  await page.getByRole("link", { name: "Resume lesson", exact: true }).click();
  await page.getByRole("button", { name: "Mark lesson complete", exact: true }).click();
  await page.goto("/");
  await expect(page.getByRole("region", { name: "Continue where you left off" })).toContainText("Marked complete");
  await expect(page.getByRole("link", { name: /^Next:/ })).toHaveAttribute("href", /\/learn\/renal\//);
  await page.goto(`/library/${id}`);
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Resume lesson", exact: true })).toHaveAttribute("href", `/library/${id}#lesson-objectives`);
});

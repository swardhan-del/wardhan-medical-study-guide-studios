import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import data from "../../src/content/library-lessons.json";
import practice from "../../src/content/transfer-practice.json";
import cases from "../../src/content/blood-specimen-cases.json";
import type { LibraryLesson } from "../../src/lib/library-types";

const lesson = data.lessons.find(l => l.id === "blood-marrow")! as LibraryLesson;
const route = "/library/blood-marrow";

test("First-time student finds the expanded blood lesson and returns to its subject", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Subjects", exact: true }).click();
  await page.locator('a[href="/subjects/histology"]').click();
  await page.getByRole("searchbox", { name: "Search resources", exact: true }).fill("blood and bone marrow");
  const card = page.locator(".resource-card:visible").filter({ has: page.locator('a[href="/library/blood-marrow"]') });
  await expect(card).toHaveCount(1); await card.getByRole("link", { name: "Read lesson", exact: true }).click();
  await expect(page.locator("h1")).toHaveText(lesson.title);
  await page.getByRole("link", { name: "Choose a preparation", exact: true }).click();
  await expect(page.locator("#blood-specimen-title")).toBeInViewport();
  await page.getByRole("navigation", { name: "Breadcrumb" }).locator('a[href="/subjects/histology"]').click();
  await expect(page.getByRole("searchbox", { name: "Search resources", exact: true })).toBeVisible();
});

test("Blood lesson presents every explanation, prompt and section reference", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  expect((await page.goto(route))?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveText(lesson.title);
  const sections = page.locator(".concept-sequence > details");
  await expect(sections).toHaveCount(18);
  for (const [index, step] of lesson.steps.entries()) {
    const section = sections.nth(index);
    expect(await section.locator(":scope > p").allTextContents()).toEqual(step.body.split("\n\n"));
    await expect(section).toContainText(step.practice!.prompt);
    await section.getByText("Check the reasoning", { exact: true }).click();
    await expect(section).toContainText(step.practice!.feedback);
    expect(await section.locator('a[href^="https://"]').count()).toBeGreaterThan(0);
  }
  await expect(page.locator("main")).toContainText(lesson.recall.prompt);
  expect(await page.locator("main").innerText()).not.toMatch(/\/Users\/|rlkey=|Library\/CloudStorage/);
  expect(await page.locator('main a[href*="dropbox"]').count()).toBe(0);
  expect(errors).toEqual([]);
});

test("Blood questions explain wrong and correct choices and preserve saved answers", async ({ page }) => {
  await page.goto(route); await page.getByRole("button", { name: "Show all questions", exact: true }).click();
  const questions = practice.questions.filter(q => q.topic === "blood-marrow");
  expect(questions).toHaveLength(12);
  for (const q of questions) {
    const block = page.locator(`#question-${q.id}`); const wrong = (q.answer + 1) % q.options.length;
    await block.getByRole("radio", { name: q.options[wrong].text, exact: true }).check();
    await block.getByRole("button", { name: "Check answer", exact: true }).click();
    await expect(block).toContainText(q.options[wrong].explanation);
    await block.getByRole("button", { name: "Try without feedback", exact: true }).click();
    await block.getByRole("radio", { name: q.options[q.answer].text, exact: true }).check();
    await block.getByRole("button", { name: "Check answer", exact: true }).click();
    await expect(block).toContainText(q.options[q.answer].explanation);
  }
  await page.reload(); await page.getByRole("button", { name: "Show all questions", exact: true }).click();
  for (const q of questions) await expect(page.locator(`#question-${q.id}`).getByRole("radio", { name: q.options[q.answer].text, exact: true })).toBeChecked();
});

test("Specimen tasks support keyboard choices, correction and reset", async ({ page }, info) => {
  await page.goto(route); const panel = page.locator('section[aria-labelledby="blood-specimen-title"]');
  const choices = ["Peripheral blood smear", "Marrow aspirate smear", "Marrow tissue section"];
  for (const item of cases.cases) {
    const task = panel.getByRole("button", { name: item.label, exact: true }); await task.focus(); await page.keyboard.press("Enter");
    await expect(task).toHaveAttribute("aria-pressed", "true"); await expect(panel.getByRole("status")).toBeEmpty();
    const wrong = choices.find(p => p !== item.answer)!;
    await panel.getByRole("button", { name: wrong, exact: true }).click();
    await expect(panel.getByRole("status")).toContainText("Reconsider the readout.");
    const correct = panel.getByRole("button", { name: item.answer, exact: true }); await correct.focus(); await page.keyboard.press("Enter");
    await expect(panel.getByRole("status")).toContainText(item.reason);
    await expect(panel.getByRole("status")).toContainText("Good match.");
  }
  await panel.screenshot({ path: info.outputPath("specimen-task.png") });
  await page.reload(); await expect(panel.getByRole("status")).toBeEmpty();
});

test("Blood lesson save/remove, accessibility and 320px enlarged text", async ({ page }, info) => {
  await page.goto(route);
  const save = page.getByRole("button", { name: `Save to My Study: ${lesson.title}`, exact: true }); await save.click(); await page.reload();
  const saved = page.getByRole("button", { name: `Saved to My Study: ${lesson.title} (remove from saved resources)`, exact: true });
  await expect(saved).toHaveAttribute("aria-pressed", "true"); await saved.click(); await page.reload(); await expect(save).toBeVisible();
  await page.getByRole("button", { name: "Show all questions", exact: true }).click();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 320, height: 900 }); await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  const panel = page.locator('section[aria-labelledby="blood-specimen-title"]');
  expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  await panel.screenshot({ path: info.outputPath("specimen-320px-200pct.png") });
});

test("Blood teaching and preparation comparison remain available without JavaScript", async ({ browser, baseURL }, info) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL }); const page = await context.newPage();
  await page.goto(route); await expect(page.locator(".concept-sequence > details")).toHaveCount(18);
  await page.getByText("Compare all three preparations", { exact: true }).click();
  const panel = page.locator('section[aria-labelledby="blood-specimen-title"]');
  for (const item of cases.cases) await expect(panel.getByText(item.reason, { exact: true })).toBeVisible();
  await expect(panel.locator("noscript")).toBeVisible();
  expect(await panel.locator("noscript").textContent()).toContain("interactive buttons need JavaScript");
  await panel.screenshot({ path: info.outputPath("specimen-without-javascript.png") });
  await context.close();
});

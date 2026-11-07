import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import model from "../../src/content/pdh-mechanism-model.json";
import lessons from "../../src/content/library-lessons.json";
import practice from "../../src/content/transfer-practice.json";
import { showAllPractice } from "./helpers/practice-view";

const route = "/library/pdh-tca";
const lesson = lessons.lessons.find(x => x.id === "pdh-tca")!;
const questions = practice.questions.filter(x => /^pdh-mechanism-0[1-6]$/.test(x.id));

test("Student finds the deeper PDH lesson and keeps the existing saved-resource identity", async ({ page }) => {
  await page.goto("/subjects/biochemistry");
  await page.getByRole("searchbox", { name: "Search resources", exact: true }).fill("pyruvate");
  const card = page.locator(".resource-card:visible").filter({ has: page.locator(`a[href="${route}"]`) });
  await expect(card).toHaveCount(1);
  await card.getByRole("link", { name: "Read lesson", exact: true }).click();
  await expect(page.locator("h1")).toHaveText(lesson.title);
  await expect(page.locator(".concept-sequence > details")).toHaveCount(10);
  for (const step of lesson.steps) await expect(page.getByText(step.title, { exact: true }).first()).toBeVisible();
  await page.getByRole("link", { name: "Follow the catalytic cycle", exact: true }).click();
  await expect(page.locator("#pdh-mechanism-title")).toBeInViewport();
  const save = page.getByRole("button", { name: `Save to My Study: ${lesson.title}`, exact: true });
  await save.click(); await page.reload();await showAllPractice(page);
  const saved = page.getByRole("button", { name: `Saved to My Study: ${lesson.title} (remove from saved resources)`, exact: true });
  await expect(saved).toHaveAttribute("aria-pressed", "true"); await saved.click(); await page.reload();await showAllPractice(page); await expect(save).toBeVisible();
  await page.getByRole("navigation", { name: "Breadcrumb" }).locator('a[href="/subjects/biochemistry"]').click();
  await expect(page.getByRole("searchbox", { name: "Search resources", exact: true })).toBeVisible();
});

test("Each carrier stage has keyboard controls and conserves the three tracked carbons", async ({ page }) => {
  await page.goto(route);
  const panel = page.locator('section[aria-labelledby="pdh-mechanism-title"]');
  for (const [index, state] of model.states.entries()) {
    const button = panel.getByRole("button", { name: `${index + 1}. ${state.label}`, exact: true });
    await button.focus(); await page.keyboard.press("Space");
    await expect(button).toHaveAttribute("aria-pressed", "true");
    const current = panel.locator("#pdh-current-stage");
    for (const text of [state.carbon, state.lipoyl, state.electron]) await expect(current).toContainText(text);
    await expect(current.locator("[data-carbon-location] span")).toHaveCount(3);
    if (index === 0) await expect(current.locator('[data-carbon-location="pyruvate"] span')).toHaveCount(3);
    else {
      await expect(current.locator('[data-carbon-location="co2"] span')).toHaveCount(1);
      await expect(current.locator(`[data-carbon-location="${index === 1 ? "lipoyl" : "acetyl-coa"}"] span`)).toHaveCount(2);
    }
  }
});

test("Carbon ledger accepts valid counts, explains invalid counts and sends or saves nothing", async ({ page }) => {
  await page.goto(route);
  // The lesson records its resume position on mount, independently of the ledger.
  await expect.poll(() => page.evaluate(() => {
    const progress = JSON.parse(localStorage.getItem("wardhan-learning:v1") || "null");
    return progress?.resume?.lesson;
  })).toBe("pdh-tca");
  const before = await page.evaluate(() => JSON.stringify([localStorage, sessionStorage]));
  const posts: string[] = []; page.on("request", r => { if (r.method() === "POST") posts.push(r.url()); });
  const input = page.getByRole("spinbutton", { name: "Number of completed reactions (whole number, 1–12)", exact: true });
  const submit = page.getByRole("button", { name: "Check the carbon balance", exact: true });
  const balance = page.locator("#pdh-carbon-balance");
  for (let count = 1; count <= 12; count++) {
    await input.fill(String(count)); await submit.click();
    await expect(balance).toContainText(`${count * 3} = ${count * 2} + ${count}.`);
  }
  for (const bad of ["", "0", "13", "-1", "1.5"]) {
    await input.fill(bad); await submit.click();
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#pdh-ledger-error")).toContainText("last calculated balance below is unchanged");
    await expect(balance).toContainText("36 = 24 + 12.");
  }
  await input.fill("2"); await submit.click();
  await expect(input).toHaveAttribute("aria-invalid", "false");
  await expect(balance).toContainText("6 = 4 + 2.");
  expect(posts).toEqual([]);
  expect(await page.evaluate(() => JSON.stringify([localStorage, sessionStorage]))).toBe(before);
  await page.reload();await showAllPractice(page); await expect(balance).toContainText("12 = 8 + 4.");
});

for (const question of questions) test(`PDH ${question.id}: every answer has reasoning and the selection persists`, async ({ page }) => {
  expect(questions).toHaveLength(6);
  await page.goto(route); await showAllPractice(page);
  await expect(page.locator("#question-concept-pdh-tca")).toBeVisible();
  const card = page.locator("#question-" + question.id);
  await expect(card.getByRole("button", { name: /^Check (?:answer|Answer and Continue →)$/ })).toBeDisabled();
  for (const [index, option] of question.options!.entries()) {
    await card.getByRole("radio", { name: option.text, exact: true }).check();
    await card.getByRole("button", { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
    await expect(card.locator("[data-feedback]")).toHaveAttribute("data-feedback", index === question.answer ? "correct" : "incorrect");
    await expect(card).toContainText(option.explanation!);
    await card.getByRole("button", { name: "Try without feedback", exact: true }).click();
  }
  await card.getByRole("radio", { name: question.options![question.answer!].text, exact: true }).check();
  await card.getByRole("button", { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
  await page.reload();await showAllPractice(page); await showAllPractice(page);
  await expect(page.locator("#question-" + question.id).getByRole("radio", { name: question.options![question.answer!].text, exact: true })).toBeChecked();
});

test("The model and references remain readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false }); const page = await context.newPage();
  await page.goto(route);
  await page.getByText("Read all four stages without using the controls", { exact: true }).click();
  const allStages = page.locator('details').filter({ has: page.locator('summary').filter({ hasText: 'Read all four stages without using the controls' }) });
  for (const state of model.states) {
    const stage = allStages.locator('li').filter({ has: page.getByRole('heading', { name: state.label, exact: true }) });
    await expect(stage).toBeVisible();
    for (const text of [state.carbon, state.lipoyl, state.electron]) await expect(stage).toContainText(text);
  }
  for (const entry of model.sectionReferences) {
    const step = page.locator('.concept-sequence > details').filter({ has: page.locator('.concept-step-title').filter({ hasText: entry.title }) });
    if ((await step.getAttribute('open')) === null) await step.locator(':scope > summary').click();
    const summary = step.getByText(`References for ${entry.title.toLocaleLowerCase("en")}`, { exact: true });
    await summary.click();
    const details = summary.locator("..");
    for (const ref of entry.references) await expect(details.getByRole("link", { name: ref.title, exact: true })).toHaveAttribute("href", ref.url);
  }
  await context.close();
});

test("Enlarged-text mobile reading preserves controls, carbon labels and accessibility", async ({ browser, baseURL }, info) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 320, height: 1000 } }); const page = await context.newPage();
  await page.goto(route);
  const initial = await page.locator("body").evaluate(e => parseFloat(getComputedStyle(e).fontSize));
  const root = await page.locator("html").evaluate(e => parseFloat(getComputedStyle(e).fontSize));
  await page.locator("html").evaluate((e, n) => e.style.fontSize = `${n * 2}px`, root);
  expect(await page.locator("body").evaluate(e => parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(initial * 1.99);
  const panel = page.locator('section[aria-labelledby="pdh-mechanism-title"]');
  for (const [index, state] of model.states.entries()) {
    await panel.getByRole("button", { name: `${index + 1}. ${state.label}`, exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    expect(await panel.evaluate(e => e.scrollWidth <= e.clientWidth + 1)).toBe(true);
  }
  const narrowParagraph = panel.locator('[data-carbon-location="acetyl-coa"] p');
  expect((await narrowParagraph.boundingBox())!.width).toBeGreaterThanOrEqual(210);
  expect(await panel.locator('h2').evaluate(e => parseFloat(getComputedStyle(e).fontSize))).toBeLessThanOrEqual(40);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await panel.screenshot({ path: info.outputPath("pdh-320-double-text.png") });
  await context.close();
});

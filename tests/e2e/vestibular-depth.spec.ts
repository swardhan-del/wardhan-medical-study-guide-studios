import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import lessons from "../../src/content/library-lessons.json";
import transfer from "../../src/content/transfer-practice.json";
import structures from "../../src/content/vestibular-diagrams.json";
import activities from "../../src/content/vestibular-learning-activities.json";
import { showAllPractice } from "./helpers/practice-view";

const id = "vestibular-sensors-rotation-translation";
const route = `/library/${id}`;
const lesson = lessons.lessons.find(x => x.id === id)!;
const questions = [
  { id: `concept-${id}`, ...lesson.question, options: lesson.question.options.map(x => ({ text: x.text, explanation: x.reason })) },
  ...transfer.questions.filter(x => x.topic === id),
];

test("Student finds one vestibular lesson, reads its connected steps and returns with saved progress", async ({ page }) => {
  await page.goto("/subjects/histology");
  await page.getByRole("searchbox", { name: "Search resources", exact: true }).fill("vestibular");
  const card = page.locator(".resource-card:visible").filter({ has: page.locator(`a[href="${route}"]`) });
  await expect(card).toHaveCount(1);
  await card.getByRole("link", { name: "Read lesson", exact: true }).click();
  await expect(page.locator("h1")).toHaveText(lesson.title);
  await expect(page.locator(".concept-sequence > details")).toHaveCount(17);
  for (const step of lesson.steps) await expect(page.getByText(step.title, { exact: true }).first()).toBeVisible();
  await page.getByRole("link", { name: "Compare sensory architecture", exact: true }).click();
  await expect(page.locator("#vestibular-structure")).toBeInViewport();
  const save = page.getByRole("button", { name: `Save to My Study: ${lesson.title}`, exact: true });
  await save.click(); await page.reload();await showAllPractice(page);
  const saved = page.getByRole("button", { name: `Saved to My Study: ${lesson.title} (remove from saved resources)`, exact: true });
  await expect(saved).toHaveAttribute("aria-pressed", "true");
  await saved.click(); await page.reload();await showAllPractice(page); await expect(save).toBeVisible();
  await page.getByRole("navigation", { name: "Breadcrumb" }).locator('a[href="/subjects/histology"]').click();
  await expect(page.getByRole("searchbox", { name: "Search resources", exact: true })).toBeVisible();
});

test("Both sensory diagrams expose all feature explanations to keyboard users", async ({ page }) => {
  await page.goto(route);
  const panel = page.locator("#vestibular-structure");
  const both = panel.getByRole("button", { name: "Compare both", exact: true });
  await expect(both).toBeEnabled();
  await expect(panel.getByRole("img")).toHaveCount(2);
  for (const [index, structure] of structures.entries()) {
    const toggle = panel.getByRole("button", { name: index === 0 ? "Crista and cupula" : "Macula and otoconia", exact: true });
    await toggle.focus(); await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await expect(panel.getByRole("img")).toHaveCount(1);
    for (const [i, feature] of structure.features.entries()) {
      const button = panel.getByRole("button", { name: `${i + 1}. ${feature.title}`, exact: true });
      await button.focus(); await page.keyboard.press("Enter");
      await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(panel.getByRole("status")).toContainText(feature.description);
    }
  }
  await both.click(); await expect(panel.getByRole("img")).toHaveCount(2);
});

test("Motion comparison checks both components, validates inputs and preserves small differences", async ({ page }) => {
  await page.goto(route);
  const model = page.locator("#vestibular-motion");
  const a = model.getByRole("group", { name: "Scenario A", exact: true });
  const b = model.getByRole("group", { name: "Scenario B", exact: true });
  const result = model.locator("[data-difference]");
  await model.getByRole("button", { name: "Load the equal-input pair", exact: true }).click();
  await expect(result).toHaveAttribute("data-equal", "true");
  await expect(a.getByRole("status")).toContainText("q = (0.500, -0.866)");
  await expect(b.getByRole("status")).toContainText("q = (0.500, -0.866)");
  await b.getByLabel("Head acceleration along z (g)", { exact: true }).fill("0");
  await expect(result).toHaveAttribute("data-equal", "false");
  await expect(result).toContainText("Matching one component alone is insufficient");
  for (const [name, value] of [["Rightward head tilt (degrees)", "91"], ["Rightward head tilt (degrees)", ""], ["Head acceleration along x (g)", "2.1"], ["Head acceleration along z (g)", "-2.1"]]) {
    await model.getByRole("button", { name: "Reset both to upright rest", exact: true }).click();
    const input = b.getByLabel(name, { exact: true }); await input.fill(value);
    await expect(input).toHaveAttribute("aria-invalid", "true");
    await expect(b.getByRole("img")).toHaveCount(0);
    await expect(model).toContainText("Correct both scenarios before comparing");
  }
  await model.getByRole("button", { name: "Reset both to upright rest", exact: true }).click();
  await b.getByLabel("Head acceleration along x (g)", { exact: true }).fill("0.00001");
  await expect(result).toHaveAttribute("data-equal", "false");
  await expect(result).toContainText("1.00e-5");
});

test("Manual explanations reveal a rubric, send nothing and clear on reload", async ({ page }) => {
  await page.goto(route);
  const posts: string[] = []; page.on("request", request => { if (request.method() === "POST") posts.push(request.url()); });
  await expect.poll(() => page.evaluate(() => localStorage.getItem("wardhan-learning:v1"))).not.toBeNull();
  const before = await page.evaluate(() => JSON.stringify([localStorage, sessionStorage]));
  for (const activity of activities) {
    const card = page.locator(`section[aria-labelledby="${activity.id}-title"]`);
    const draft = card.getByRole("textbox");
    await draft.fill("I compare the visible relationship and state which evidence is missing.");
    await card.getByRole("button", { name: "Compare with the rubric", exact: true }).click();
    await expect(card.getByText(activity.model, { exact: true }).first()).toBeVisible();
    await card.getByRole("checkbox").first().check();
    await expect(card.getByRole("status").filter({ hasText: "You marked" })).toContainText("1 of");
    await expect(card).toContainText("No automated essay score is assigned");
  }
  expect(posts).toEqual([]);
  expect(await page.evaluate(() => JSON.stringify([localStorage, sessionStorage]))).toBe(before);
  await page.reload();await showAllPractice(page);
  for (const activity of activities) await expect(page.locator(`#${activity.id}-draft`)).toHaveValue("");
});

for (const question of questions) test(`Vestibular ${question.id}: every option has explicit feedback`, async ({ page }) => {
  expect(questions).toHaveLength(17);
  await page.goto(route); await showAllPractice(page);
  const card = page.locator(`#question-${question.id}`);
  await expect(card.getByRole("button", { name: /^Check (?:answer|Answer and Continue →)$/ })).toBeDisabled();
  for (const [i, option] of question.options.entries()) {
    await card.getByRole("radio", { name: option.text, exact: true }).check();
    await card.getByRole("button", { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
    await expect(card.locator("[data-feedback]")).toHaveAttribute("data-feedback", i === question.answer ? "correct" : "incorrect");
    await expect(card).toContainText(option.explanation);
    await card.getByRole("button", { name: "Try without feedback", exact: true }).click();
  }
});

test("Sections cite their evidence, including the atlas correction, without exposing private sources", async ({ page }) => {
  await page.goto(route);
  const sections = page.locator(".concept-sequence > details");
  await expect(sections).toHaveCount(17);
  for (const section of await sections.all()) {
    await section.getByText("References for this explanation", { exact: true }).click();
    expect(await section.locator('a[href^="https://"]').count()).toBeGreaterThan(0);
  }
  expect(await page.locator('a[href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10793866/"]').count()).toBeGreaterThan(0);
  const html = await page.content();
  expect(html).not.toMatch(/dropbox(?:usercontent)?\.com|\/Users\/|Library\/CloudStorage|rlkey=/i);
  await expect(page.locator('a[href$=".docx"],a[href$=".ppsx"]')).toHaveCount(0);
});

test("Teaching remains readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage(); await page.goto(route);
  await expect(page.locator("h1")).toHaveText(lesson.title);
  await expect(page.locator(".concept-sequence > details")).toHaveCount(17);
  await expect(page.locator("#vestibular-structure").getByRole("img")).toHaveCount(2);
  for (const summary of await page.locator("#vestibular-structure").getByText("Read all three feature explanations", { exact: true }).all()) await summary.click();
  await page.getByText("Read the worked pair and its limits", { exact: true }).click();
  await expect(page.getByText(/Scenario A: tilt 30°/)).toBeVisible();
  for (const activity of activities) {
    const card = page.locator(`section[aria-labelledby="${activity.id}-title"]`);
    await card.getByText("Read the rubric and model without entering a response", { exact: true }).click();
    await expect(card.locator("details")).toContainText(activity.model);
  }
  await context.close();
});

test("Native lesson passes accessibility, narrow reflow and runtime checks", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 320, height: 900 } });
  const page = await context.newPage(); const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(route);
  await page.locator("#vestibular-motion").getByRole("button", { name: "Load the equal-input pair", exact: true }).click();
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
  expect(errors).toEqual([]);
  await context.close();
});

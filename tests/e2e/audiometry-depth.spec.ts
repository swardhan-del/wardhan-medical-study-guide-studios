import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import chart from "../../src/content/audiometry-chart.json";
import lessons from "../../src/content/library-lessons.json";
import transfer from "../../src/content/transfer-practice.json";
import { showAllPractice } from "./helpers/practice-view";

const id = "biophysics-practical-audiometry";
const route = `/library/${id}`;
const lesson = lessons.lessons.find(item => item.id === id)!;
const questions = transfer.questions.filter(item => item.topic === id);

test("Student finds the existing audiometry page, saves it and returns to biophysics", async ({ page }) => {
  await page.goto("/subjects/biophysics");
  await page.getByRole("searchbox", { name: "Search resources", exact: true }).fill("audiogram");
  const card = page.locator(".resource-card:visible").filter({ has: page.locator(`a[href="${route}"]`) });
  await expect(card).toHaveCount(1); await card.getByRole("link", { name: "Read lesson", exact: true }).click();
  await expect(page.locator("h1")).toHaveText(lesson.title);
  await expect(page.locator(".concept-sequence > details")).toHaveCount(12);
  await page.getByRole("link", { name: "Compare audiograms", exact: true }).click();
  await expect(page.locator("#audiogram-explorer h2")).toBeInViewport();
  const save = page.getByRole("button", { name: `Save to My Study: ${lesson.title}`, exact: true });
  await save.click(); await page.reload();
  const saved = page.getByRole("button", { name: `Saved to My Study: ${lesson.title} (remove from saved resources)`, exact: true });
  await expect(saved).toHaveAttribute("aria-pressed", "true"); await saved.click(); await page.reload(); await expect(save).toBeVisible();
  await page.getByRole("navigation", { name: "Breadcrumb" }).locator('a[href="/subjects/biophysics"]').click();
  await expect(page.getByRole("searchbox", { name: "Search resources", exact: true })).toBeVisible();
});

test("Every fictional case and frequency distinguishes exact differences from missing or limited observations", async ({ page }) => {
  await page.goto(route); const panel = page.locator("#audiogram-explorer");
  for (const item of chart.cases) {
    const button = panel.getByRole("button", { name: item.title, exact: true });
    await button.focus(); await page.keyboard.press("Space"); await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(panel.getByRole("img")).toHaveAccessibleName(`${item.title}: ${item.ear}-side air and bone observations`);
    await expect(panel.getByRole("img")).toHaveAccessibleDescription(/Equal horizontal steps represent frequency doubling/);
    await expect(panel.locator("table tbody tr")).toHaveCount(6);
    for (const point of item.values) {
      await panel.getByLabel("Comparison frequency", { exact: true }).selectOption(String(point.frequencyHz));
      const row = panel.locator('tr[data-selected="true"]'); await expect(row).toContainText(point.frequencyHz.toLocaleString("en-US"));
      const finite = point.airDbHL !== null && point.boneDbHL !== null;
      if (finite) {
        await panel.getByLabel("Difference (dB)", { exact: true }).fill(String(point.airDbHL! - point.boneDbHL!));
      } else {
        await panel.getByRole("checkbox", { name: "No exact result", exact: true }).check();
      }
      await panel.getByRole("button", { name: "Check answer", exact: true }).click();
      await expect(panel.locator("[data-feedback]")).toHaveAttribute("data-feedback", "correct");
      if (finite && !item.earSpecificEstablished) await expect(panel.getByRole("status")).toContainText("Do not label this a confirmed same-ear air-bone gap");
      if (point.boneNoResponseAtDbHL !== null) await expect(panel.getByRole("status")).toContainText("not an exact bone-conduction threshold");
    }
  }
});

test("Axes, side symbols, bone placement and no-response arrow retain the stated convention", async ({ page }, info) => {
  await page.goto(route); const panel = page.locator("#audiogram-explorer");
  await panel.getByRole("button", { name: chart.cases[0].title, exact: true }).click();
  const points = panel.locator('[data-frequency="1000"]');
  const air = points.locator('[data-route="air"]'), bone = points.locator('[data-route="bone"]');
  await expect(air).toHaveText("△"); await expect(bone).toHaveText("[");
  expect(Number(await air.getAttribute("x")) - Number(await bone.getAttribute("x"))).toBe(10);
  expect(Number(await air.getAttribute("y")) - Number(await bone.getAttribute("y"))).toBe(175);
  await expect(panel.locator('line[data-zero="true"]')).toHaveCount(1);
  await panel.getByRole("button", { name: chart.cases[1].title, exact: true }).click();
  await expect(air).toHaveText("□"); await expect(bone).toHaveText("]");
  expect(Number(await bone.getAttribute("x")) - Number(await air.getAttribute("x"))).toBe(10);
  await panel.getByRole("button", { name: chart.cases[3].title, exact: true }).click();
  await expect(air).toHaveText("○"); await expect(bone).toHaveText("<");
  await panel.getByRole("button", { name: chart.cases[4].title, exact: true }).click();
  await expect(panel.locator('[data-route="bone"]')).toHaveCount(0);
  await expect(panel.locator('[data-route="bone-no-response"]')).toHaveCount(1);
  await expect(panel.locator('[data-route="air"]')).toHaveCount(1);
  await expect(panel.locator('[data-route="bone-no-response"] path')).toHaveAttribute("d", "M 265 453 l -16 20 m 0 -9 v 9 h 9");
  await panel.locator("svg").screenshot({ path: info.outputPath("audiometry-output-limit.png") });
  await panel.getByRole("button", { name: "Bone conduction", exact: true }).click();
  await expect(panel.locator('[data-route="bone-no-response"]')).toHaveCount(0);
  await expect(panel.locator("table")).toContainText("No response at 65 dB HL; exact threshold unknown");
  await panel.getByRole("button", { name: "Air conduction", exact: true }).click();
  await expect(panel.locator('[data-route="air"]')).toHaveCount(0);
});

test("Wrong and malformed answers get feedback without inventing an exact output-limit threshold", async ({ page }) => {
  await page.goto(route); const panel = page.locator("#audiogram-explorer");
  const input = panel.getByLabel("Difference (dB)", { exact: true });
  for (const value of ["", "NaN", "Infinity", "0x20", "35 dB", "36"]) {
    await input.fill(value); await panel.getByRole("button", { name: "Check answer", exact: true }).click();
    await expect(panel.locator("[data-feedback]")).toHaveAttribute("data-feedback", "incorrect");
  }
  await input.fill("35"); await panel.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(panel.locator("[data-feedback]")).toHaveAttribute("data-feedback", "correct");
  await panel.getByRole("button", { name: chart.cases[4].title, exact: true }).click();
  await expect(input).toHaveValue(""); await expect(panel.getByRole("status")).toBeEmpty();
  await input.fill("30"); await panel.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(panel.locator("[data-feedback]")).toHaveAttribute("data-feedback", "incorrect");
  await expect(panel.getByRole("status")).toContainText("not an exact bone-conduction threshold");
});

test("Calculation and diagram choices send nothing and are not retained", async ({ page }) => {
  await page.goto(route); const panel = page.locator("#audiogram-explorer");
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("wardhan-learning:v1") || "null")?.resume?.lesson)).toBe(id);
  const baseline = await page.evaluate(() => JSON.stringify([localStorage, sessionStorage]));
  const posts: string[] = []; page.on("request", request => { if (request.method() === "POST") posts.push(request.url()); });
  await panel.getByRole("button", { name: chart.cases[2].title, exact: true }).click();
  await panel.getByLabel("Difference (dB)", { exact: true }).fill("30");
  await panel.getByRole("button", { name: "Check answer", exact: true }).click();
  await panel.getByRole("button", { name: "Air conduction", exact: true }).click();
  expect(posts).toEqual([]); expect(await page.evaluate(() => JSON.stringify([localStorage, sessionStorage]))).toBe(baseline);
  await expect(panel.locator("audio,video,iframe")).toHaveCount(0);
  await page.reload(); await expect(panel.getByRole("button", { name: chart.cases[0].title, exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(panel.getByLabel("Difference (dB)", { exact: true })).toHaveValue("");
  await expect(panel.getByRole("status")).toBeEmpty();
});

for (const question of questions) test(`Audiometry ${question.id}: each option has reasoning`, async ({ page }) => {
  expect(questions).toHaveLength(7); await page.goto(route); await showAllPractice(page);
  const panel = page.locator(`#question-${question.id}`);
  await expect(panel.getByRole("button", { name: "Check answer", exact: true })).toBeDisabled();
  for (const [index, option] of question.options.entries()) {
    await panel.getByRole("radio", { name: option.text, exact: true }).check();
    await panel.getByRole("button", { name: "Check answer", exact: true }).click();
    await expect(panel.locator("[data-feedback]")).toHaveAttribute("data-feedback", index === question.answer ? "correct" : "incorrect");
    await expect(panel).toContainText(option.explanation);
    await panel.getByRole("button", { name: "Try without feedback", exact: true }).click();
  }
});

test("All explanations and fictional cases remain readable without JavaScript", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false }); const page = await context.newPage(); await page.goto(route);
  const sections = page.locator(".concept-sequence > details"); await expect(sections).toHaveCount(12);
  for (const section of await sections.all()) {
    await section.locator("details > summary").filter({ hasText: "References for" }).click();
    expect(await section.locator('a[href^="https://"]').count()).toBeGreaterThan(0);
  }
  const panel = page.locator("#audiogram-explorer");
  for (const item of chart.cases) {
    const fallback = panel.locator("noscript > section").filter({ has: page.getByRole("heading", { name: item.title, exact: true }) });
    await expect(fallback.getByText(item.explanation, { exact: true })).toBeVisible();
    await expect(fallback.locator("li")).toHaveCount(6);
  }
  await expect(panel.locator("noscript > p")).toBeVisible();
  await expect(panel.locator("noscript > p")).toContainText("Interactive selection requires JavaScript");
  expect(await page.content()).not.toMatch(/dropbox(?:usercontent)?\.com|\/Users\/|Library\/CloudStorage|rlkey=/i);
  await context.close();
});

test("Narrow doubled-text controls and data table remain accessible without runtime errors", async ({ browser, baseURL }, info) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 320, height: 1000 } }); const page = await context.newPage();
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message)); await page.goto(route);
  const panel = page.locator("#audiogram-explorer"); await panel.getByRole("button", { name: chart.cases[4].title, exact: true }).click();
  await page.addStyleTag({ content: "html{font-size:200% !important}" });
  await panel.getByRole("checkbox", { name: "No exact result", exact: true }).check();
  const button = panel.getByRole("button", { name: "Check answer", exact: true }); await button.focus(); await page.keyboard.press("Enter");
  await expect(panel.locator("[data-feedback]")).toHaveAttribute("data-feedback", "correct");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  for (const control of await panel.locator("button, label").all()) {
    expect(await control.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  }
  const tableRegion = panel.getByRole("region", { name: "All supplied values for this fictional audiogram", exact: true });
  await tableRegion.focus(); await page.keyboard.press("ArrowRight");
  await expect.poll(() => tableRegion.evaluate(el => el.scrollLeft)).toBeGreaterThan(0);
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze(); expect(result.violations).toEqual([]); expect(errors).toEqual([]);
  await panel.locator("table").screenshot({ path: info.outputPath("audiometry-narrow-table.png") });
  await button.scrollIntoViewIfNeeded(); await page.screenshot({ path: info.outputPath("audiometry-narrow-feedback.png") }); await context.close();
});

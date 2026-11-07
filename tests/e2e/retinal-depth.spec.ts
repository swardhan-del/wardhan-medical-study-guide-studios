import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import lessons from "../../src/content/library-lessons.json";
import transfer from "../../src/content/transfer-practice.json";
import layers from "../../src/content/retinal-layers.json";
import stages from "../../src/content/retinal-development.json";
import specimens from "../../src/content/retinal-specimens.json";
import activities from "../../src/content/retinal-learning-activities.json";
import { showAllPractice } from "./helpers/practice-view";

const id = "retinal-structure-light-signal-direction";
const route = `/library/${id}`;
const lesson = lessons.lessons.find(x => x.id === id)!;
const questions = [{ id: `concept-${id}`, ...lesson.question, options: lesson.question.options.map(x => ({ text: x.text, explanation: x.reason })) }, ...transfer.questions.filter(x => x.topic === id)];
const hashes: Record<string, string> = { "retinal-layer-detail": "805d54b308d42b68dfbe96f3d2a511e4bc556e7808be471f7602e64cdc72cd86", "optic-disc-overview": "0331a15108952a58b94a320241a7b72149b359856743cebed9f23fe6b0c6ef52" };

test("Student finds one retinal-structure lesson, saves it and returns to the subject", async ({ page }) => {
  await page.goto("/subjects/histology");
  await page.getByRole("searchbox", { name: "Search resources", exact: true }).fill("retinal");
  const card = page.locator(".resource-card:visible").filter({ has: page.locator(`a[href="${route}"]`) });
  await expect(card).toHaveCount(1); await card.getByRole("link", { name: "Read lesson", exact: true }).click();
  await expect(page.locator("h1")).toHaveText(lesson.title);
  await expect(page.locator(".concept-sequence > details")).toHaveCount(17);
  for (const step of lesson.steps) await expect(page.getByText(step.title, { exact: true }).first()).toBeVisible();
  await page.getByRole("link", { name: "Explore the layers", exact: true }).click();
  await expect(page.locator("#retinal-layers h2")).toBeInViewport();
  const save = page.getByRole("button", { name: `Save to My Study: ${lesson.title}`, exact: true });
  await save.click(); await page.reload();await showAllPractice(page);
  const saved = page.getByRole("button", { name: `Saved to My Study: ${lesson.title} (remove from saved resources)`, exact: true });
  await expect(saved).toHaveAttribute("aria-pressed", "true"); await saved.click(); await page.reload();await showAllPractice(page); await expect(save).toBeVisible();
  await page.getByRole("navigation", { name: "Breadcrumb" }).locator('a[href="/subjects/histology"]').click();
  await expect(page.getByRole("searchbox", { name: "Search resources", exact: true })).toBeVisible();
});

test("All forty layer, orientation and route states work with keyboard controls", async ({ page }, info) => {
  const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto(route); const panel = page.locator("#retinal-layers");
  for (const orientation of ["Choroidal side above", "Vitreous side above"]) {
    const toggle = panel.getByRole("button", { name: orientation, exact: true });
    await expect(toggle).toBeEnabled(); await toggle.focus(); await page.keyboard.press("Space");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    for (const direction of ["Incoming light", "Forward neural route"]) {
      const button = panel.getByRole("button", { name: direction, exact: true });
      await button.focus(); await page.keyboard.press("Enter"); await expect(button).toHaveAttribute("aria-pressed", "true");
      await expect(panel.getByRole("img")).toHaveAccessibleName(new RegExp(direction.toLowerCase()));
      const y = await panel.locator("[data-retinal-route]").getAttribute("d");
      const values = y!.match(/\d+/g)!.map(Number);
      const pointsDown = values[2] > values[1];
      expect(pointsDown).toBe((orientation === "Choroidal side above") === (direction === "Forward neural route"));
      for (const [i, layer] of layers.entries()) {
        const control = panel.getByRole("button", { name: `${i + 1}. ${layer.label}`, exact: true });
        await control.focus(); await page.keyboard.press("Space"); await expect(control).toHaveAttribute("aria-pressed", "true");
        await expect(panel.getByRole("status")).toContainText(layer.explanation);
      }
    }
  }
  await panel.screenshot({ path: info.outputPath("retinal-layer-map.png") });
  expect(errors).toEqual([]);
});

test("Development keeps both lineages and all four explanations accessible", async ({ page }, info) => {
  await page.goto(route); const panel = page.locator("#retinal-development");
  for (const [i, stage] of stages.entries()) {
    const button = panel.getByRole("button", { name: `${i + 1}. ${stage.title}`, exact: true });
    await button.focus(); await page.keyboard.press("Enter"); await expect(button).toHaveAttribute("aria-pressed", "true");
    await expect(panel.getByRole("status")).toContainText(stage.explanation);
    await expect(panel.locator('[data-stage="active"]')).toHaveCount(2);
  }
  await expect(panel).toContainText("does not become a neuroectodermal derivative");
  await panel.screenshot({ path: info.outputPath("retinal-development.png") });
});

for (const item of specimens) test(`The student explores and downloads credited ${item.scope}`, async ({ page }, info) => {
  await page.goto(route);
  const panel = page.locator(`section[aria-labelledby="${item.scope}-specimen-title"]`);
  await expect(page.locator(`img[src="/images/figures/${item.scope}.jpg"]`)).toHaveCount(1);
  await expect(panel.getByRole("link", { name: "CC BY-SA 3.0 terms", exact: true })).toHaveAttribute("href", "https://creativecommons.org/licenses/by-sa/3.0/");
  await expect(panel).toContainText("Clinical normality is not established");
  for (const level of [1, 2, 3]) {
    const zoom = panel.getByRole("button", { name: `${level}× view`, exact: true });
    await zoom.focus(); await page.keyboard.press("Space"); await expect(zoom).toHaveAttribute("aria-pressed", "true");
    for (const [i, region] of item.data.regions.entries()) {
      const button = panel.getByRole("button", { name: `${i + 1}. ${region.label}`, exact: true });
      await button.focus(); await page.keyboard.press("Enter"); await expect(button).toHaveAttribute("aria-pressed", "true");
      const description = panel.locator(`#${item.scope}-region-description`);
      for (const text of [region.observation, region.interpretation, region.limit]) await expect(description).toContainText(text);
      const viewport = panel.getByRole("region", { name: `${item.data.title}: scrollable specimen`, exact: true });
      await expect.poll(() => viewport.evaluate(el => {
        const marker = el.querySelector('[aria-hidden="true"] > span')!.getBoundingClientRect();
        const frame = el.getBoundingClientRect(); const x = marker.x + marker.width / 2, y = marker.y + marker.height / 2;
        return x >= frame.left && x <= frame.right && y >= frame.top && y <= frame.bottom;
      })).toBe(true);
    }
  }
  await panel.getByRole("button", { name: "Hide region markers", exact: true }).click();
  await expect(panel.locator('[aria-hidden="true"] > span')).toHaveCount(0);
  await panel.getByRole("button", { name: "Show region markers", exact: true }).click();
  await panel.getByRole("button", { name: "1× view", exact: true }).click();
  const pending = page.waitForEvent("download");
  await panel.getByRole("link", { name: "Download credited specimen image", exact: true }).click();
  const file = await pending; const path = await file.path(); expect(path).not.toBeNull();
  expect(createHash("sha256").update(await readFile(path!)).digest("hex")).toBe(hashes[item.scope]);
  await panel.screenshot({ path: info.outputPath(`${item.scope}.png`) });
});

test("Manual explanations have feedback without sending or retaining the student's text", async ({ page }) => {
  await page.goto(route); const posts: string[] = [];
  page.on("request", request => { if (request.method() === "POST") posts.push(request.url()); });
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem("wardhan-learning:v1") || "null")?.resume?.lesson)).toBe(id);
  const before = await page.evaluate(() => JSON.stringify([localStorage, sessionStorage]));
  for (const activity of activities) {
    const panel = page.locator(`section[aria-labelledby="${activity.id}-title"]`);
    await panel.getByRole("textbox").fill("I distinguish a visible relationship from ancestry and request the missing evidence.");
    await panel.getByRole("button", { name: "Compare with the rubric", exact: true }).click();
    await expect(panel.getByText(activity.model, { exact: true }).first()).toBeVisible();
    await panel.getByRole("checkbox").first().check();
    await expect(panel).toContainText("No automated essay score is assigned");
  }
  expect(posts).toEqual([]); expect(await page.evaluate(() => JSON.stringify([localStorage, sessionStorage]))).toBe(before);
  await page.reload();await showAllPractice(page); for (const activity of activities) await expect(page.locator(`#${activity.id}-draft`)).toHaveValue("");
});

for (const question of questions) test(`Retina ${question.id}: all options explain their reasoning`, async ({ page }) => {
  expect(questions).toHaveLength(16); await page.goto(route); await showAllPractice(page);
  const panel = page.locator(`#question-${question.id}`);
  await expect(panel.getByRole("button", { name: /^Check (?:answer|Answer and Continue →)$/ })).toBeDisabled();
  for (const [i, option] of question.options.entries()) {
    await panel.getByRole("radio", { name: option.text, exact: true }).check();
    await panel.getByRole("button", { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
    await expect(panel.locator("[data-feedback]")).toHaveAttribute("data-feedback", i === question.answer ? "correct" : "incorrect");
    await expect(panel).toContainText(option.explanation);
    await panel.getByRole("button", { name: "Try without feedback", exact: true }).click();
  }
});

test("References, private boundaries and no-JavaScript reading remain available", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage(); await page.goto(route);
  const sections = page.locator(".concept-sequence > details"); await expect(sections).toHaveCount(17);
  for (const section of await sections.all()) {
    await section.getByText("References for this explanation", { exact: true }).click();
    expect(await section.locator('a[href^="https://"]').count()).toBeGreaterThan(0);
  }
  await page.getByText("Read all ten layer explanations", { exact: true }).click();
  for (const layer of layers) await expect(page.locator("#retinal-layers details")).toContainText(layer.explanation);
  await page.getByText("Read all four developmental explanations", { exact: true }).click();
  for (const stage of stages) await expect(page.locator("#retinal-development details")).toContainText(stage.explanation);
  for (const item of specimens) {
    const panel = page.locator(`section[aria-labelledby="${item.scope}-specimen-title"]`);
    await panel.locator("details > summary").click();
    for (const region of item.data.regions) await expect(panel.locator("details")).toContainText(region.limit);
  }
  const html = await page.content(); expect(html).not.toMatch(/dropbox(?:usercontent)?\.com|\/Users\/|Library\/CloudStorage|rlkey=/i);
  await expect(page.locator('a[href$=".docx"],a[href$=".ppsx"]')).toHaveCount(0);
  await context.close();
});

test("Missing specimen images retain readable descriptions and source links", async ({ page }) => {
  await page.route("**/images/figures/retinal-layer-detail.jpg", r => r.abort());
  await page.goto(route); const panel = page.locator('section[aria-labelledby="retinal-layer-detail-specimen-title"]');
  await panel.scrollIntoViewIfNeeded(); await expect(panel.getByRole("status")).toContainText("could not load");
  await panel.locator("details > summary").click(); await expect(panel.locator("details")).toContainText("Pigmented border");
  await expect(panel.getByRole("link", { name: "Creator and source", exact: true })).toBeVisible();
});

test("Narrow doubled-text interactions pass accessibility and runtime checks", async ({ browser, baseURL }, info) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 320, height: 900 } });
  const page = await context.newPage(); const errors: string[] = []; page.on("pageerror", error => errors.push(error.message));
  await page.goto(route); await page.locator("#retinal-layers").getByRole("button", { name: "Forward neural route", exact: true }).click();
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  for (const id of ["retinal-layers", "retinal-development", "retinal-specimens"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  }
  const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(result.violations).toEqual([]); expect(errors).toEqual([]);
  await page.locator("#retinal-layers").screenshot({ path: info.outputPath("retinal-narrow-doubled-text.png") });
  await context.close();
});

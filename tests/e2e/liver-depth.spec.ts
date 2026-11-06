import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import teaching from "../../src/content/library-lessons.json";
import practice from "../../src/content/transfer-practice.json";

const lesson = teaching.lessons.find(l => l.id === "liver-pancreas")!;
const questions = practice.questions.filter(q => q.id.startsWith("liver-depth-"));
const asset = "/images/figures/human-pancreas-development-villalba-2024.png";
const imageSha = "b5ae8d08821f2d0f6dd11f043f527620c075012e0baccd6346cb2d6f91014388";

test("Liver first visit: search and Part 09 reach the expanded existing lesson", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Subjects", exact: true }).click();
  await page.locator('a[href="/subjects/histology"]').click();
  await page.getByRole("searchbox", { name: "Search resources", exact: true }).fill(lesson.title);
  const card = page.locator(".resource-card:visible").filter({ has: page.locator('a[href="/library/liver-pancreas"]') });
  await expect(card).toHaveCount(1); await card.getByRole("link", { name: "Read lesson", exact: true }).click();
  await expect(page.locator("h1")).toHaveText(lesson.title);
  await page.getByRole("link", { name: "Trace a route", exact: true }).click();
  await expect(page.locator("#system-relationships-title")).toBeInViewport();
  await page.goto("/study/histology/revision"); await page.getByRole("button", { name: "Clear selection", exact: true }).click();
  await page.getByRole("checkbox", { name: "09. Stomach Intestines Liver Gallbladder and Pancreas", exact: true }).check();
  await expect(page.locator(".revision-lesson")).toHaveCount(2);
  await expect(page.locator(".revision-lesson").filter({ hasText: lesson.title })).toContainText(lesson.steps[15].title);
});

test("Liver teaching: every explanation and section reference is present without private paths", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  const response = await page.goto("/library/liver-pancreas"); expect(response?.status()).toBe(200);
  const sections = page.locator(".concept-sequence > details"); await expect(sections).toHaveCount(18);
  for (const [i, step] of lesson.steps.entries()) {
    await expect(sections.nth(i).locator(".concept-step-title")).toHaveText(step.title);
    expect(await sections.nth(i).locator(":scope > p").allTextContents()).toEqual(step.body.split("\n\n"));
    await expect(sections.nth(i).locator(":scope > details")).toHaveCount(1);
  }
  await expect(page.locator("main")).not.toContainText("/Users/");
  expect(await page.locator('main a[href*="dropbox"]').count()).toBe(0);
  await expect(page.locator("main")).toContainText(lesson.recall.prompt);
  await expect(page.locator("main")).toContainText("independent"); expect(errors).toEqual([]);
});

test("Liver routes: keyboard selection separates blood, bile and both pancreatic exits", async ({ page }) => {
  await page.goto("/library/liver-pancreas"); const panel = page.locator('section[aria-labelledby="system-relationships-title"]');
  for (const [name, ending] of [["Liver blood route", "Larger hepatic venous outflow"], ["Bile route", "Larger biliary passages"], ["Pancreatic exocrine route", "Duodenal lumen"], ["Pancreatic endocrine route", "Responsive target tissues"]]) {
    const b = panel.getByRole("button", { name, exact: true }); await b.focus(); await page.keyboard.press("Enter");
    await expect(b).toHaveAttribute("aria-pressed", "true"); await expect(panel.locator("#system-relationship-answer")).toBeHidden();
    await expect(panel.getByRole("list", { name: "Selected relationship" })).toContainText(ending);
    await panel.getByRole("button", { name: "Reveal the reasoning", exact: true }).click();
    await expect(panel.locator("#system-relationship-answer")).toBeVisible();
  }
});

test("Liver application practice: all explained choices and answer persistence work", async ({ page }) => {
  await page.goto("/library/liver-pancreas"); await page.getByRole("button", { name: "Show all questions", exact: true }).click(); expect(questions).toHaveLength(18);
  for (const q of questions) {
    const block = page.locator(`#question-${q.id}`); const wrong = (q.answer + 1) % q.options.length;
    await block.getByRole("radio", { name: q.options[wrong].text, exact: true }).check(); await block.getByRole("button", { name: "Check answer", exact: true }).click();
    await expect(block).toContainText(q.options[wrong].explanation); await block.getByRole("button", { name: "Try without feedback", exact: true }).click();
    await block.getByRole("radio", { name: q.options[q.answer].text, exact: true }).check(); await block.getByRole("button", { name: "Check answer", exact: true }).click();
    await expect(block).toContainText(q.options[q.answer].explanation);
  }
  await page.reload(); await page.getByRole("button", { name: "Show all questions", exact: true }).click();
  for (const q of questions) await expect(page.locator(`#question-${q.id}`).getByRole("radio", { name: q.options[q.answer].text, exact: true })).toBeChecked();
});

test("Liver research figure: panel guide, keyboard zoom, exact download and focus return", async ({ page }, info) => {
  await page.goto("/library/liver-pancreas"); const figure = page.locator("#figure-human-pancreas-development");
  await figure.getByText("Read the figure panel by panel", { exact: true }).click();
  await expect(figure.locator("dt")).toHaveCount(5); await expect(figure).toContainText("Scale bars: 200 µm");
  await expect(figure.getByRole("link", { name: "Image reuse licence: CC BY 4.0", exact: true })).toHaveAttribute("href", "https://creativecommons.org/licenses/by/4.0/");
  const trigger = figure.getByRole("button", { name: "Enlarge Human pancreatic development: buds, position and growth", exact: true });
  await trigger.focus(); await page.keyboard.press("Enter"); const dialog = page.getByRole("dialog"); await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Close image", exact: true })).toBeFocused();
  await expect(dialog.locator("img")).toHaveJSProperty("naturalWidth", 1830, { timeout: 30000 });
  await dialog.getByLabel("Image zoom").selectOption("3");
  const viewport = dialog.getByRole("region", { name: "Scrollable enlarged image" }); await viewport.focus(); await page.keyboard.press("ArrowRight");
  expect(await viewport.evaluate(el => el.scrollWidth > el.clientWidth)).toBe(true);
  await dialog.screenshot({ path: info.outputPath("pancreas-figure-zoom.png") });
  const pending = page.waitForEvent("download"); await dialog.getByRole("link", { name: "Download image", exact: true }).click(); const download = await pending;
  expect(download.suggestedFilename()).toBe(asset.split("/").at(-1));
  const path = await download.path(); expect(path).toBeTruthy(); expect(createHash("sha256").update(await readFile(path!)).digest("hex")).toBe(imageSha);
  await page.keyboard.press("Escape"); await expect(dialog).not.toBeVisible(); await expect(trigger).toBeFocused();
});

test("Liver figure failure retains descriptions and a recovery control", async ({ page }) => {
  await page.route(`**${asset}`, route => route.abort()); await page.goto("/library/liver-pancreas"); const figure = page.locator("#figure-human-pancreas-development"); await figure.scrollIntoViewIfNeeded();
  await expect(figure).toContainText("Image unavailable."); await figure.getByText("Read the figure panel by panel", { exact: true }).click(); await expect(figure).toContainText("PCW 5.7");
  await figure.getByRole("button", { name: "Try the full-size image", exact: true }).click(); await expect(page.getByRole("dialog")).toContainText("Full-size image unavailable.");
  await page.keyboard.press("Escape");
});

test("Liver accessibility: save/remove, mobile, enlarged text and automated checks", async ({ page }, info) => {
  await page.goto("/library/liver-pancreas");
  const save = page.getByRole("button", { name: `Save to My Study: ${lesson.title}`, exact: true }); await save.click(); await page.reload();
  const saved = page.getByRole("button", { name: `Saved to My Study: ${lesson.title} (remove from saved resources)`, exact: true }); await expect(saved).toHaveAttribute("aria-pressed", "true"); await saved.click(); await page.reload(); await expect(save).toBeVisible();
  await page.getByRole("button", { name: "Show all questions", exact: true }).click(); await page.getByText("Read the figure panel by panel", { exact: true }).click();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 320, height: 900 }); await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  const figure = page.locator("#figure-human-pancreas-development"); expect(await figure.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  await figure.screenshot({ path: info.outputPath("pancreas-figure-enlarged-text.png") });
  await page.locator('section[aria-labelledby="system-relationships-title"]').screenshot({ path: info.outputPath("liver-routes-enlarged-text.png") });
  await figure.getByRole("button", { name: "Enlarge Human pancreatic development: buds, position and growth", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog.getByRole("button", { name: "Close image", exact: true })).toBeInViewport();
  expect(await dialog.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  await page.screenshot({ path: info.outputPath("pancreas-dialog-320-text-200.png") });
  await dialog.getByLabel("Image zoom").selectOption("2");
  await dialog.getByRole("region", { name: "Scrollable enlarged image" }).focus();
  await page.keyboard.press("Escape"); await expect(dialog).not.toBeVisible();
});

test("Liver without JavaScript retains teaching, image and panel explanations", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL }); const page = await context.newPage(); await page.goto("/library/liver-pancreas");
  await expect(page.locator(".concept-sequence > details")).toHaveCount(18); await expect(page.locator(".concept-sequence > details > details")).toHaveCount(18);
  await page.getByText("Read the figure panel by panel", { exact: true }).click(); await expect(page.locator("#figure-human-pancreas-development")).toContainText("PCW 5.7");
  await expect(page.locator("#figure-human-pancreas-development img").first()).toHaveAttribute("src", asset);
  await context.close();
});

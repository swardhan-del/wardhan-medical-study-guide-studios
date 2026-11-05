import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import teaching from "../../src/content/library-lessons.json";
import practice from "../../src/content/transfer-practice.json";

const lesson = teaching.lessons.find(l => l.id === "gi-histology")!;
const questions = practice.questions.filter(q => q.topic === lesson.id && q.id.startsWith("gi-depth-"));

test("GI first visit: subject search reaches the expanded lesson and printable Part 09", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Subjects", exact: true }).click();
  await page.locator('a[href="/subjects/histology"]').click();
  await page.getByRole("searchbox", { name: "Search resources", exact: true }).fill(lesson.title);
  const card = page.locator(".resource-card:visible").filter({ has: page.locator('a[href="/library/gi-histology"]') });
  await expect(card).toHaveCount(1); await card.getByRole("link", { name: "Read lesson", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1, name: lesson.title, exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Compare villus and crypt", exact: true }).click();
  await expect(page.locator("#gi-profile-explorer-title")).toBeInViewport();
  await page.goto("/study/histology/revision"); await page.getByRole("button", { name: "Clear selection", exact: true }).click();
  await page.getByRole("checkbox", { name: "09. Stomach Intestines Liver Gallbladder and Pancreas", exact: true }).check();
  await expect(page.locator(".revision-lesson")).toHaveCount(2);
  await expect(page.locator(".revision-lesson").filter({ hasText: lesson.title })).toContainText(lesson.steps[16].title);
  await page.goto("/library?subject=histology"); await page.getByRole("searchbox").fill("no-gi-depth-result-591823");
  await expect(page.locator(".catalog-empty")).toBeVisible(); await page.locator(".catalog-empty").getByRole("button", { name: "Clear filters", exact: true }).click();
  await expect(page.locator(".resource-card:visible").first()).toBeVisible();
});

test("GI teaching: every section, reference and existing recall remains readable", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  const response = await page.goto("/library/gi-histology"); expect(response?.status()).toBe(200);
  const sections = page.locator(".concept-sequence > details"); await expect(sections).toHaveCount(18);
  for (const [i, step] of lesson.steps.entries()) {
    await expect(sections.nth(i).locator(".concept-step-title")).toHaveText(step.title);
    expect(await sections.nth(i).locator(":scope > p").allTextContents()).toEqual(step.body.split("\n\n"));
    await expect(sections.nth(i).locator(":scope > details")).toHaveCount(1);
  }
  await expect(page.locator("#lesson-source")).not.toContainText("controlled library");
  await expect(page.locator("main")).not.toContainText("/Users/");
  expect(await page.locator('main a[href*="dropbox"]').count()).toBe(0);
  await expect(page.locator("main")).toContainText(lesson.recall.prompt);
  await expect(page.locator("main")).toContainText("independent"); expect(errors).toEqual([]);
});

test("GI profile comparison: keyboard selection, feedback and stale-answer reset", async ({ page }, testInfo) => {
  await page.goto("/library/gi-histology"); const panel = page.locator('section[aria-labelledby="gi-profile-explorer-title"]');
  for (const [name, correct, wrong, centre] of [
    ["Cross-cut villus", "Connective tissue inside the epithelial ring", "A lumen inside the epithelial ring", "Connective-tissue core"],
    ["Cross-cut crypt", "A lumen inside the epithelial ring", "Connective tissue inside the epithelial ring", "Crypt lumen"],
  ]) {
    const button = panel.getByRole("button", { name, exact: true }); await button.focus(); await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-pressed", "true"); await expect(panel.locator('[role="status"]')).toBeEmpty();
    await expect(panel.getByRole("button", { name: "Check the profile", exact: true })).toBeDisabled();
    await expect(panel.locator("#gi-profile-labels")).toBeHidden();
    await panel.getByRole("radio", { name: wrong, exact: true }).check(); await panel.getByRole("button", { name: "Check the profile", exact: true }).click();
    await expect(panel.getByRole("status")).toContainText("Recheck the centre");
    await panel.getByRole("radio", { name: correct, exact: true }).check(); await expect(panel.locator('[role="status"]')).toBeEmpty();
    await panel.getByRole("button", { name: "Check the profile", exact: true }).click(); await expect(panel.getByRole("status")).toContainText("Correct relationship");
    const reveal = panel.getByRole("button", { name: "Reveal compartment labels", exact: true }); await reveal.focus(); await page.keyboard.press("Enter");
    await expect(panel.locator("#gi-profile-labels")).toContainText(centre);
    await expect(panel.getByRole("img")).toHaveAccessibleName(`${name}: original conceptual cross-section`);
    await panel.screenshot({ path: testInfo.outputPath(`${name.replaceAll(" ", "-")}.png`) });
  }
  await panel.getByRole("link", { name: "visit the Visual Study Studio", exact: true }).click();
  await expect(page).toHaveURL(/\/learn\/visual-studio$/); await expect(page.locator("h1")).toHaveText("See it.Explore it.Explain it.");
});

test("GI application practice: 18 explained questions save answers across reload", async ({ page }) => {
  await page.goto("/library/gi-histology"); await page.getByRole("button", { name: "Show all questions", exact: true }).click(); expect(questions).toHaveLength(18);
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

test("GI accessibility: save/remove, automated checks, 320px and 200-percent text", async ({ page }, testInfo) => {
  await page.goto("/library/gi-histology");
  const save = page.getByRole("button", { name: `Save to My Study: ${lesson.title}`, exact: true }); await save.click(); await page.reload();
  const saved = page.getByRole("button", { name: `Saved to My Study: ${lesson.title} (remove from saved resources)`, exact: true }); await expect(saved).toHaveAttribute("aria-pressed", "true"); await saved.click(); await page.reload(); await expect(save).toBeVisible();
  await page.getByRole("button", { name: "Show all questions", exact: true }).click();
  await page.getByRole("button", { name: "Reveal compartment labels", exact: true }).click();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  const panel = page.locator('section[aria-labelledby="gi-profile-explorer-title"]');
  await panel.screenshot({ path: testInfo.outputPath("gi-profile.png") });
  await page.setViewportSize({ width: 320, height: 900 }); await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
  expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
  await panel.screenshot({ path: testInfo.outputPath("gi-profile-enlarged.png") });
});

test("GI without JavaScript: descriptions, section references and printable teaching remain available", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL }); const page = await context.newPage(); await page.goto("/library/gi-histology");
  await expect(page.locator(".concept-sequence > details")).toHaveCount(18);
  await expect(page.locator(".concept-sequence > details > details")).toHaveCount(18);
  await page.getByText("Read both profiles without the controls", { exact: true }).click();
  await expect(page.getByText("A cross-cut villus has connective tissue inside", { exact: false })).toBeVisible();
  await expect(page.locator("#worked-example-heading")).toBeVisible(); await context.close();
});

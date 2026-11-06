import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import teaching from "../../src/content/library-lessons.json";
import practice from "../../src/content/transfer-practice.json";
import type { LibraryLesson } from "../../src/lib/library-types";

for (const id of ["epithelia", "cell-junctions"]) {
  const lesson = teaching.lessons.find(l => l.id === id)! as LibraryLesson;
  const questions = practice.questions.filter(q => q.topic === id && /^(epithelial|junction)-depth-/.test(q.id));
  test(`${id}: first visit reaches the expanded existing route`, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Subjects", exact: true }).click();
    await page.locator('a[href="/subjects/histology"]').click();
    await page.getByRole("searchbox", { name: "Search resources", exact: true }).fill(lesson.title);
    const card = page.locator(".resource-card:visible").filter({ has: page.locator(`a[href="/library/${id}"]`) });
    await expect(card).toHaveCount(1); await card.getByRole("link", { name: "Read lesson", exact: true }).click();
    await expect(page.locator("h1")).toHaveText(lesson.title);
    await page.getByRole("link", { name: id === "epithelia" ? "Gland comparison" : "Barrier exercise", exact: true }).click();
    await expect(page.locator(id === "epithelia" ? "#gland-explorer-title" : "#barrier-explorer-title")).toBeInViewport();
  });
  test(`${id}: every explanation, reference and reasoning prompt works`, async ({ page }) => {
    const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
    expect((await page.goto(`/library/${id}`))?.status()).toBe(200);
    const steps = page.locator(".concept-sequence > details"); await expect(steps).toHaveCount(id === "epithelia" ? 18 : 17);
    for (const [i, step] of lesson.steps.entries()) {
      const section = steps.nth(i);
      if (!(await section.evaluate(el => (el as HTMLDetailsElement).open))) await section.locator(":scope > summary").click();
      expect(await section.locator(":scope > p").allTextContents()).toEqual(step.body.split("\n\n"));
      await expect(section).toContainText(step.practice!.prompt);
      const answer = section.getByText(step.practice!.feedback, { exact: true }); await expect(answer).toBeHidden();
      await section.getByText("Check the reasoning", { exact: true }).click(); await expect(answer).toBeVisible();
      expect(await section.locator('a[href^="https://"]').count()).toBeGreaterThan(0);
    }
    await expect(page.locator("main")).not.toContainText("/Users/"); expect(await page.locator('main a[href*="dropbox"]').count()).toBe(0);
    await expect(page.locator("main")).toContainText("independent"); expect(errors).toEqual([]);
  });
  test(`${id}: new application feedback and answer persistence`, async ({ page }) => {
    await page.goto(`/library/${id}`); await page.getByRole("button", { name: "Show all questions", exact: true }).click();
    expect(questions).toHaveLength(id === "epithelia" ? 12 : 9);
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
  test(`${id}: accessibility, saved resource persistence and enlarged-text reflow`, async ({ page }, info) => {
    await page.goto(`/library/${id}`);
    const save = page.getByRole("button", { name: `Save to My Study: ${lesson.title}`, exact: true }); await save.click(); await page.reload();
    const saved = page.getByRole("button", { name: `Saved to My Study: ${lesson.title} (remove from saved resources)`, exact: true }); await expect(saved).toHaveAttribute("aria-pressed", "true"); await saved.click(); await page.reload(); await expect(save).toBeVisible();
    await page.getByRole("button", { name: "Show all questions", exact: true }).click();
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    await page.setViewportSize({ width: 320, height: 900 }); await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    const panel = page.locator(`section[aria-labelledby="${id === "epithelia" ? "gland" : "barrier"}-explorer-title"]`);
    expect(await panel.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    await panel.screenshot({ path: info.outputPath(`${id}-enlarged-text.png`) });
    if (id === "cell-junctions") {
      const map = page.locator('section[aria-labelledby="junction-map-title"]');
      expect(await map.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
      await map.screenshot({ path: info.outputPath("junction-map-enlarged-text.png") });
    }
  });
  test(`${id}: core teaching and explanations remain without JavaScript`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL }); const page = await context.newPage();
    await page.goto(`/library/${id}`); await expect(page.locator("h1")).toHaveText(lesson.title);
    const steps = page.locator(".concept-sequence > details"); await expect(steps).toHaveCount(lesson.steps.length);
    if (!(await steps.last().evaluate(el => (el as HTMLDetailsElement).open))) await steps.last().locator(":scope > summary").click(); await expect(steps.last()).toContainText(lesson.steps.at(-1)!.body.split("\n\n")[0]);
    await steps.last().getByText("Check the reasoning", { exact: true }).click(); await expect(steps.last()).toContainText(lesson.steps.at(-1)!.practice!.feedback);
    await context.close();
  });
}

test("Gland explorer: keyboard comparison distinguishes the two kinds of branching", async ({ page }) => {
  await page.goto("/library/epithelia"); const panel = page.locator('section[aria-labelledby="gland-explorer-title"]');
  for (const [name, clue] of [["Simple unbranched", "Neither the duct"], ["Simple branched", "Several end pieces alone"], ["Compound", "classifies the duct tree"]]) {
    const b = panel.getByRole("button", { name, exact: true }); await b.focus(); await page.keyboard.press("Enter"); await expect(b).toHaveAttribute("aria-pressed", "true");
    await expect(panel.locator("#gland-reasoning")).toBeHidden(); await panel.getByRole("button", { name: "Reveal gland reasoning", exact: true }).click();
    await expect(panel.locator("#gland-reasoning")).toContainText(clue);
  }
});

test("Barrier explorer: all four conditions, calculation and reset behaviour", async ({ page }) => {
  await page.goto("/library/cell-junctions"); const panel = page.locator('section[aria-labelledby="barrier-explorer-title"]');
  for (const [name, value, clue] of [["A: reference comparison", "0.25", "not an assertion of normal health"], ["B: resistance changes", "0.5", "tracer index is unchanged"], ["C: tracer changes", "0.25", "tracer index doubles"], ["D: both readouts change", "0.5", "both double"]]) {
    const b = panel.getByRole("button", { name, exact: true }); await b.focus(); await page.keyboard.press("Enter"); await expect(b).toHaveAttribute("aria-pressed", "true");
    await expect(panel.locator("#barrier-reasoning")).toBeHidden(); await panel.getByRole("button", { name: "Reveal barrier reasoning", exact: true }).click();
    await expect(panel.locator("#barrier-reasoning")).toContainText(`Relative conductance g = ${value}`); await expect(panel.locator("#barrier-reasoning")).toContainText(clue);
  }
});

test("Junction map: keyboard selection separates matrix attachment from cell communication", async ({ page }) => {
  await page.goto("/library/cell-junctions"); const panel = page.locator('section[aria-labelledby="junction-map-title"]');
  for (const [name, partner] of [["Tight junction", "Neighbouring cell near the apical boundary"], ["Adherens junction", "Neighbouring cell"], ["Desmosome", "Neighbouring cell"], ["Gap junction", "Neighbouring cytoplasm through paired channels"], ["Hemidesmosome", "Extracellular matrix below the cell"], ["Focal adhesion", "Extracellular matrix"]]) {
    const button = panel.getByRole("button", { name, exact: true }); await button.focus(); await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-pressed", "true"); await expect(panel.locator("dd").first()).toHaveText(partner);
    expect(await button.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe("none");
  }
});

test("Part 02 revision selects both expanded lessons with current coverage", async ({ page }) => {
  await page.goto("/study/histology/revision"); await page.getByRole("button", { name: "Clear selection", exact: true }).click();
  await page.getByRole("checkbox", { name: "02. Epithelial Tissues Glands and Cell Junctions", exact: true }).check();
  await expect(page.locator(".revision-lesson")).toHaveCount(2);
  for (const id of ["epithelia", "cell-junctions"]) {
    const lesson = teaching.lessons.find(l => l.id === id)!;
    const section = page.locator(".revision-lesson").filter({ hasText: lesson.title });
    await expect(section).toHaveCount(1); await expect(section).toContainText(lesson.steps.at(-1)!.title);
  }
});

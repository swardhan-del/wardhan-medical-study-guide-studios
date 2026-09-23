import { test, expect } from "@playwright/test";
import lessons from "../../src/content/library-lessons.json";
import studio from "../../src/content/study-questions.json";
import transfer from "../../src/content/transfer-practice.json";
import references from "../../src/content/lesson-references.json";
test("histology course views preserve useful lessons and exclude candidate files", async ({
  page,
}) => {
  for (const slug of ["histology", "histology-i", "histology-ii"]) {
    await page.goto("/subjects/" + slug);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('a[href*="dropbox"]')).toHaveCount(0);
    await expect(page.locator(".resource-card:visible").first()).toBeVisible();
  }
});

test("histology foundations exposes sourced teaching, hidden feedback and persistent retrieval/application answers", async ({ page }) => {
  const id = "histology-foundations-tissues";
  const lesson = lessons.lessons.find(l => l.id === id)!;
  const errors: string[] = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(`/library/${id}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(lesson.title);
  await expect(page.locator("[data-study-diagram]:visible")).toHaveCount(6);
  const worked = page.locator('section[aria-labelledby="worked-example-heading"]:visible');
  await expect(worked.locator("ol")).toBeHidden();
  await worked.getByText("Show the reasoning", { exact: true }).click();
  await expect(worked).toContainText("an exact organ is not");
  await expect(page.locator(".concept-recall:visible")).toContainText("Oral Examination Prompts");
  await expect(page.getByRole("region", { name: /^Question [2-6]$/ })).toHaveCount(5);
  await expect(page.getByRole("region", { name: /^Application Question [1-3]$/ })).toHaveCount(3);
  const questions = [...studio.questions, ...transfer.questions].filter(q => q.topic === id);
  for (const q of questions) {
    const panel = page.locator(".practice-question:visible").filter({ hasText: q.prompt });
    await expect(panel.getByRole("status")).toHaveCount(0);
    await panel.getByRole("radio", { name: q.options[q.answer].text, exact: true }).check();
    await panel.getByRole("button", { name: "Check answer", exact: true }).click();
    await expect(panel.getByRole("status")).toContainText("Correct.");
    await expect(panel.getByRole("status")).toContainText(q.options[q.answer].explanation);
  }
  await page.reload();
  for (const q of questions) {
    const panel = page.locator(".practice-question:visible").filter({ hasText: q.prompt });
    await expect(panel.getByRole("radio", { name: q.options[q.answer].text, exact: true })).toBeChecked();
  }
  const refs = references as Record<string, { url: string }>;
  for (const key of [id, "connective-tissue", "muscle-histology", "myelin-and-glial-cells"])
    await expect(page.locator(`#lesson-source:visible a[href="${refs[key].url}"]`)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test("histology foundations is reachable through the beginner path, library search and printable collection", async ({ page }) => {
  const title = "Histology Foundations: The Four Basic Tissues";
  await page.goto("/study/histology");
  await page.getByRole("link", { name: /^Start with/ }).click();
  await expect(page).toHaveURL(/\/library\/histology-foundations-tissues$/);
  await page.goto("/library?q=four%20basic%20tissues");
  await expect(page.getByRole("link", { name: title, exact: true })).toBeVisible();
  await page.goto("/study/histology/revision");
  const lesson = page.locator(".revision-lesson:visible").filter({ has: page.getByRole("heading", { name: title, exact: true }) });
  await expect(lesson).toContainText("Question 6.");
  await expect(lesson).toContainText("Selective myelin injury");
  await expect(lesson.getByRole("link", { name: "NCBI Neuroscience: Neuroglial Cells", exact: true })).toBeVisible();
});

 test("flagship visual support is labelled, responsive and keyboard accessible", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/library/histology-foundations-tissues");
  for (const title of ["Learning Objectives", "Core Concepts", "Guided Explanation", "Visual Study Prompts", "Worked Identification Example", "Knowledge Check", "Clinical and Applied Questions", "Oral Examination Prompts", "Summary Checklist", "Sources and Further Reading"])
    await expect(page.getByRole("heading", { name: title, exact: true })).toBeVisible();
  const diagrams = page.locator("[data-study-diagram]:visible");
  for (const figure of await diagrams.all()) {
    await expect(figure.locator("figcaption")).toContainText("Observe and explain:");
    await expect(figure.locator("figcaption")).toContainText("Not a micrograph");
    expect(await figure.locator('a[href^="https:"]').count()).toBeGreaterThan(0);
    for (const drawing of await figure.locator('svg[role="img"]').all())
      expect((await drawing.getAttribute("aria-label"))!.length).toBeGreaterThan(40);
  }
  const images = page.locator(".educational-figure:visible img");
  await expect(images).toHaveCount(2);
  for (const img of await images.all()) {
    await img.scrollIntoViewIfNeeded();
    await expect.poll(() => img.evaluate(node => (node as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    expect((await img.getAttribute("alt"))!.length).toBeGreaterThan(30);
    await expect(img).toHaveAttribute("loading", "lazy");
  }
  const explanation = page.locator(".concept-explanations:visible details").first();
  await explanation.locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(explanation).not.toHaveAttribute("open", "");
  await page.keyboard.press("Space");
  await expect(explanation).toHaveAttribute("open", "");
  const enlarge = page.getByRole("button", { name: "Enlarge Simple cuboidal epithelium", exact: true });
  await enlarge.focus(); await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(enlarge).toBeFocused();
  const check = page.locator('input[type="checkbox"]:visible').first();
  await check.check();
  await page.reload();
  await expect(check).toBeChecked();
  await page.locator(".concept-recall:visible").getByLabel("My oral examination notes", { exact: true }).fill("Compare cells, matrix and orientation.");
  await page.reload();
  await expect(page.locator(".concept-recall:visible").getByLabel("My oral examination notes", { exact: true })).toHaveValue("Compare cells, matrix and orientation.");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator("article:visible").innerText()).not.toMatch(/retrieval|oral recall/i);
});

 test("flagship teaching remains usable when micrographs fail to load", async ({ page }) => {
  await page.route("**/images/figures/**", route => route.abort());
  await page.goto("/library/histology-foundations-tissues");
  await expect(page.locator("article:visible").getByText("If the images are unavailable:", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Knowledge Check", exact: true })).toBeVisible();
  await expect(page.locator("[data-study-diagram]:visible")).toHaveCount(6);
  await expect(page.locator(".educational-figure:visible figcaption")).toHaveCount(2);
});

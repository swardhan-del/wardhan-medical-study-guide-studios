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
  await expect(page.locator(".concept-explanations:visible p").filter({ hasText: /^Visual-learning prompt:/ })).toHaveCount(4);
  const worked = page.locator('section[aria-labelledby="worked-example-heading"]:visible');
  await expect(worked.locator("ol")).toBeHidden();
  await worked.getByText("Show the reasoning", { exact: true }).click();
  await expect(worked).toContainText("an exact organ is not");
  await expect(page.locator(".concept-recall:visible")).toContainText("Final recall checklist");
  await expect(page.getByRole("region", { name: "Retrieve the essentials", exact: true })).toHaveCount(5);
  await expect(page.getByRole("region", { name: "Apply the concept in a different setting", exact: true })).toHaveCount(3);
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
  await expect(lesson).toContainText("Retrieval 6:");
  await expect(lesson).toContainText("A model selectively damages myelin");
  await expect(lesson.getByRole("link", { name: "NCBI Neuroscience: Neuroglial Cells", exact: true })).toBeVisible();
});

import { expect, type Page } from "@playwright/test";

// Full answer-key/preservation audits deliberately use the student's revision view.
// Sequential progression has its own behavioural tests in first-visit.spec.ts.
export async function showAllPractice(page: Page) {
  for (const sequence of await page.locator(".practice-sequence:visible").all()) {
    const button = sequence.getByRole("button", { name: "Show all questions", exact: true });
    if (await button.count()) {
      await expect(button).toBeEnabled();
      await button.focus(); await button.press("Enter");
      await expect(sequence.getByRole("button", { name: "Show one question at a time", exact: true })).toBeVisible();
    }
  }
}

export async function compareAnatomyModels(page: Page, limit = 4) {
  await showAllPractice(page);
  const sequence = page.getByRole("region", { name: "Anatomical reasoning sequence", exact: true });
  const questions = sequence.locator(".practice-question");
  await expect(questions).toHaveCount(4);
  for (const question of (await questions.all()).slice(0, limit)) {
    const submit = question.getByRole("button", { name: "Check Answer and Continue →", exact: true });
    if (!(await question.locator("[data-feedback]").count())) {
      await question.getByRole("textbox", { name: "Your explanation", exact: true }).fill("My anatomical relationship explanation before comparing.");
      await submit.click();
    }
    await expect(question.locator('[data-feedback="self-review"]')).toBeVisible();
  }
  return sequence;
}

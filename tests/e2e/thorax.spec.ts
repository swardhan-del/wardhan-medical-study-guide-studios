import { test, expect } from "@playwright/test";

test("thorax image supports identification, keyboard control and breathing comparison", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/subjects/anatomy/regional-anatomy");
  const panel = page.locator("#lesson-chest");
  const map = panel.getByRole("region", { name: "Build a map of the chest." });
  await expect(map.getByRole("img", { name: "Front-view schematic of the thorax" })).toBeVisible();
  await map.getByRole("button", { name: "Marker 1: Right lung", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(map.getByRole("status")).toContainText("three lobes");
  await map.getByRole("button", { name: "Identify structures", exact: true }).click();
  await expect(map).toContainText("Find: Mediastinum");
  await map.getByRole("button", { name: "Marker 1", exact: true }).click();
  await expect(map.getByRole("status")).toContainText("Try another marker.");
  for (const [index, marker] of [3, 4, 1, 2, 5, 6].entries()) {
    await map.getByRole("button", { name: `Marker ${marker}`, exact: true }).click();
    await expect(map.getByRole("status")).toContainText("Correct.");
    if (index < 5) await map.getByRole("button", { name: "Next structure", exact: true }).click();
  }
  await expect(map).toContainText("All six structures identified.");
  await map.getByRole("button", { name: "Try the identification round again" }).click();
  await expect(map).toContainText("0 of 6 identified");
  await map.getByRole("button", { name: "Explore structures", exact: true }).click();
  await map.getByRole("button", { name: "Show diaphragm during inspiration" }).click();
  await expect(map.getByText(/^Inspiration:/)).toContainText("domes descend");
  await map.getByRole("button", { name: "Show relaxed diaphragm" }).click();
  await expect(map.getByText(/^Relaxed position:/)).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await map.screenshot({ path: testInfo.outputPath("thorax-map.png"), animations: "disabled" });
  expect(errors).toEqual([]);
});

test("thorax quiz explains distractors, reviews mistakes and retains answers across regions", async ({ page }) => {
  await page.goto("/subjects/anatomy/regional-anatomy");
  const quiz = page.getByRole("region", { name: "Twelve questions. Explain every answer." });
  const progress = page.locator(".learning-progress:visible");
  await expect(progress).toHaveCount(1);
  await expect(progress).toContainText("0 of 15");
  await expect(quiz.getByRole("button", { name: "Check thorax answer" })).toBeDisabled();
  await quiz.getByRole("radio", { name: "Peritoneal cavity", exact: true }).check();
  await quiz.getByRole("button", { name: "Check thorax answer" }).click();
  await expect(quiz.locator(".thorax-feedback")).toContainText("Correct answer: Mediastinum");
  await expect(quiz.locator(".thorax-feedback")).toContainText("Why the other answers do not fit");
  const correctOptions = [0, 1, 2, 0, 1, 2, 0, 1, 2, 1, 0, 2];
  for (let index = 1; index < 12; index++) {
    await quiz.getByRole("button", { name: "Next question", exact: false }).click();
    await quiz.getByRole("radio").nth(correctOptions[index]).check();
    await quiz.getByRole("button", { name: "Check thorax answer" }).click();
  }
  await expect(quiz.locator(".thorax-quiz-progress")).toHaveText("11 of 12 correct · 0 unanswered · 1 to review");
  await quiz.getByRole("button", { name: "Review missed questions (1)" }).click();
  await expect(quiz.locator(".thorax-question .eyebrow")).toHaveText("Review 1 of 1");
  await quiz.getByRole("radio", { name: "Mediastinum", exact: true }).check();
  await quiz.getByRole("button", { name: "Check thorax answer" }).click();
  await expect(quiz.locator(".thorax-quiz-progress")).toHaveText("12 of 12 correct · 0 unanswered · 0 to review");
  await quiz.getByRole("button", { name: "Return to all questions" }).click();
  await page.getByRole("button", { name: "Next topic", exact: false }).click();
  const abdomen = page.locator("#lesson-abdominal-region");
  await abdomen.getByRole("radio", { name: "Umbilical", exact: true }).check();
  await abdomen.getByRole("button", { name: "Check answer", exact: true }).click();
  await page.getByRole("button", { name: "Previous topic", exact: false }).click();
  await expect(quiz.getByRole("radio", { name: "Mediastinum", exact: true })).toBeChecked();
  await expect(progress).toContainText("13 of 15");
  await quiz.getByRole("button", { name: "Reset thorax practice" }).click();
  await expect(quiz.locator(".thorax-quiz-progress")).toHaveText("0 of 12 correct · 12 unanswered · 0 to review");
  await expect(progress).toContainText("1 of 15");
  await expect(quiz.getByRole("button", { name: "Check thorax answer" })).toBeDisabled();
});

test("short answers reveal models and retain self-checks after reloading the page", async ({ page }) => {
  await page.goto("/subjects/anatomy/regional-anatomy");
  const recall = page.getByRole("region", { name: "Four short-answer challenges" });
  const card = recall.locator(".thorax-recall-card").first();
  await card.locator(":scope > summary").click();
  await card.getByRole("textbox", { name: "Write your answer" }).fill("Sternum in front, vertebrae behind, diaphragm below; mediastinum between pleural sacs.");
  await expect(card.getByText(/^Name the sternum/)).not.toBeVisible();
  await card.getByText("Compare with the model answer", { exact: true }).click();
  await expect(card.getByText(/^Name the sternum/)).toBeVisible();
  await card.getByRole("checkbox").first().check();
  await page.getByRole("button", { name: "Next topic", exact: false }).click();
  await page.getByRole("button", { name: "Previous topic", exact: false }).click();
  await expect(card.getByRole("textbox", { name: "Write your answer" })).toHaveValue(/Sternum in front/);
  await expect(card.getByRole("checkbox").first()).toBeChecked();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.reload();
  await card.locator(":scope > summary").click();
  await expect(card.getByRole("textbox", { name: "Write your answer" })).toHaveValue(/Sternum in front/);
});

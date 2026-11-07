import practice from "../../src/content/thorax-practice.json";
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
    await expect(map.getByRole("status")).toContainText("Correct");
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
  await expect(progress).toContainText("0 of 15");
  await expect(quiz.getByRole("button", { name: /^Check Answer and Continue/ })).toBeDisabled();
  await quiz.getByRole("radio", { name: "Peritoneal cavity", exact: true }).check();
  await quiz.getByRole("button", { name: /^Check Answer and Continue/ }).click();
  await expect(quiz.locator('[data-feedback="incorrect"]')).toContainText("Correct answer: Mediastinum");
  await expect(quiz).toContainText("Question 2 of 12");
  for (const q of practice.questions.slice(1)) {
    const block = quiz.locator(`#question-${q.id}`);
    await block.getByRole("radio", { name: q.options[q.answer], exact: true }).check();
    await block.getByRole("button", { name: /^Check Answer and Continue/ }).click();
  }
  await expect(quiz.locator('.practice-results')).toContainText("11 correct");
  await expect(quiz.locator('.practice-results')).toContainText("1 incorrect");
  await quiz.locator('.practice-results').getByRole('button', {name:/^Review:/}).click();
  const first = quiz.locator(`#question-${practice.questions[0].id}`);
  await first.getByRole('button',{name:'Try without feedback',exact:true}).click();
  await first.getByRole("radio", { name: "Mediastinum", exact: true }).check();
  await first.getByRole("button", { name: /^Check Answer and Continue/ }).click();
  await expect(quiz.locator('.practice-results')).toContainText("12 correct");
  await page.getByRole("button", { name: "Next topic", exact: false }).click();
  const abdomen = page.locator("#lesson-abdominal-region");
  await abdomen.getByRole("radio", { name: "Umbilical", exact: true }).check();
  await abdomen.getByRole("button", { name: /^Check Answer and Continue/ }).click();
  await expect(progress).toContainText("13 of 15");
  await page.locator('button[aria-controls="lesson-chest"]').click();
  await quiz.getByRole('button',{name:'Show all questions',exact:true}).click();
  await expect(first.getByRole("radio", { name: "Mediastinum", exact: true })).toBeChecked();
  await quiz.locator('summary').filter({hasText:'Checkpoint history'}).click();
  await quiz.getByRole('button',{name:'See my results',exact:true}).click();
  await quiz.getByRole('button',{name:'Try this set again',exact:true}).click();
  await expect(quiz.locator('.concept-feedback:visible')).toHaveCount(0);
  await expect(quiz.getByRole('button',{name:/^Check Answer and Continue/})).toBeDisabled();
  // Starting a fresh round preserves the already saved first-attempt history.
  await expect(progress).toContainText("13 of 15");
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

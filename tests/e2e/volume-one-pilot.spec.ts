import { expect, test } from "@playwright/test";

test("a Volume I lesson withholds all five answers and diagram feedback until submission", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/library/diaphragm-openings");
  await expect(page.getByRole("heading", { name: "Diaphragmatic openings by vertebral level" })).toBeVisible();
  await page.getByText("Label the diagram", { exact: true }).focus();
  await page.keyboard.press("Enter");
  const labels = page.getByRole("group", { name: "Choose a label for each marker" });
  await expect(labels.getByText("Correct label:", { exact: false })).toHaveCount(0);
  await labels.getByLabel("Marker 1").selectOption("T8 · caval opening");
  await labels.getByLabel("Marker 2").selectOption("T10 · oesophageal hiatus");
  await labels.getByLabel("Marker 3").selectOption("T12 · aortic hiatus");
  await page.getByRole("button", { name: "Check labels" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByText("3 of 3 labels correct.")).toBeVisible();

  const practice = page.getByRole("region", { name: "Volume I multiple-choice practice" });
  await expect(practice.getByText("5 multiple-choice questions", { exact: true })).toBeVisible();
  await practice.getByRole("button", { name: "Show all questions", exact: true }).click();
  const questions = practice.locator("[data-sequence-question]");
  await expect(questions).toHaveCount(5);
  await expect(practice.locator("[data-feedback]")).toHaveCount(0);
  const first = questions.first();
  await first.getByRole("radio").first().focus();
  await page.keyboard.press("Space");
  await first.getByRole("button", { name: /^Check answer/i }).focus();
  await page.keyboard.press("Enter");
  await expect(first.locator("[data-feedback]")).toBeVisible();
  await expect(practice.locator("[data-feedback]")).toHaveCount(1);
});

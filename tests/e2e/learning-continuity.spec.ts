import data from "../../src/content/library-lessons.json";
import { test, expect } from "@playwright/test";
test("concept answers and written reasoning survive reload and enter shared review", async ({
  page,
}) => {
  await page.goto("/library/nitrogen-metabolism");
  const check = page.locator("#concept-check-title");
  await check.getByRole("radio", { name: data.lessons.find(l => l.id === "nitrogen-metabolism")!.question.options[1].text, exact: true }).check();
  await check
    .getByRole("button", { name: "Check answer", exact: true })
    .click();
  await page
    .getByRole("textbox", { name: "My explanation", exact: true })
    .fill("Transamination transfers nitrogen; it does not excrete it.");
  await page.reload();
  await expect(check.getByRole("radio", { name: data.lessons.find(l => l.id === "nitrogen-metabolism")!.question.options[1].text, exact: true })).toBeChecked();
  await expect(
    page.getByRole("textbox", { name: "My explanation", exact: true }),
  ).toHaveValue(/Transamination/);
  await expect(
    page.locator("#lesson-source a", { hasText: "Nitrogenous wastes" }),
  ).toHaveAttribute("href", /nitrogenous-wastes/);
  await page.goto("/study");
  await page.getByRole("button", { name: "Review my mistakes (1)" }).click();
  await expect(
    page.getByRole("region", { name: "Your review session" }),
  ).toContainText("urea handling");
});
test("canonical thorax restores a checked answer and uses the corrected dividing-plane image", async ({
  page,
  request,
}, info) => {
  const response = await request.get("/images/anatomy/volume-1.png");
  expect(response.url()).toContain("mediastinal-plane.svg");
  await page.goto("/subjects/anatomy/thorax");
  await page
    .locator(".learning-intro:visible")
    .screenshot({ path: info.outputPath("thorax-dividing-plane.png") });
  const quiz = page.getByRole("region", {
    name: "Twelve questions. Explain every answer.",
  });
  await quiz.getByRole("radio", { name: "Mediastinum", exact: true }).check();
  await quiz.getByRole("button", { name: "Check thorax answer" }).click();
  await page.reload();
  await expect(
    quiz.getByRole("radio", { name: "Mediastinum", exact: true }),
  ).toBeChecked();
  await expect(quiz.locator(".thorax-quiz-progress")).toContainText(
    "1 of 12 correct",
  );
  await page.goto("/subjects/anatomy/thorax?topic=pleura#explore");
  await expect(page.locator("#lesson-pleura")).toBeVisible();
});
test("histology progresses to licensed microscope sections and saves a transfer answer", async ({
  page,
}, info) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/practice/histology?case=2#detective-cases");
  await expect(
    page.getByRole("button", { name: "Specimen 2", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page
    .getByRole("combobox", { name: "My identification" })
    .selectOption("Distal convoluted tubule");
  await page.getByRole("button", { name: "Reveal the reasoning" }).click();
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "My identification" }),
  ).toHaveValue("Distal convoluted tubule");
  const sequence = page.locator("#microscope-sequence");
  await sequence
    .getByRole("button", { name: "4. Transfer to section B", exact: true })
    .click();
  await expect(sequence.locator("img")).toBeVisible();
  await expect
    .poll(() =>
      sequence
        .locator("img")
        .evaluate((img: HTMLImageElement) => img.naturalWidth),
    )
    .toBeGreaterThan(0);
  await sequence
    .getByRole("radio", { name: "Stratified squamous epithelium", exact: true })
    .check();
  await sequence
    .getByRole("button", { name: "Check answer", exact: true })
    .click();
  await sequence.screenshot({
    path: info.outputPath("histology-transfer.png"),
  });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/study");
  await expect(
    page
      .locator(".topic-progress")
      .filter({ hasText: "Microscope section practice" }),
  ).toContainText("Coverage: 1 of 2");
  expect(errors).toEqual([]);
});
test("ABG interpretation and renal experiment writing are restored", async ({
  page,
}) => {
  await page.goto("/practice/physiology?case=2#abg");
  await page.getByLabel("1. Describe the pH").selectOption("Acidemia");
  await page
    .getByLabel("2. Explain the pattern")
    .selectOption("Metabolic acidosis plus respiratory acidosis");
  await page.getByRole("button", { name: "Check interpretation" }).click();
  await page
    .getByRole("textbox", { name: "My prediction and reason" })
    .fill(
      "Efferent resistance raises upstream pressure but reduces circuit flow.",
    );
  await page.reload();
  await expect(page.getByLabel("2. Explain the pattern")).toHaveValue(
    "Metabolic acidosis plus respiratory acidosis",
  );
  await expect(
    page.getByText("Both steps correct.", { exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("textbox", { name: "My prediction and reason" }),
  ).toHaveValue(/Efferent resistance/);
});
test("histology lessons and native topics remain reachable on small screens", async ({
  page,
}) => {
  await page.goto("/subjects/histology");
  await expect(page.locator("#website-lessons:visible")).toBeVisible();
  await expect(page.locator("a[href*=dropbox]")).toHaveCount(0);
  await page.getByText("Browse the regional directory and suggested sequence", { exact: true }).filter({ visible: true }).click();
  await expect(page.locator(".taxonomy-grid:visible")).toBeVisible();
});

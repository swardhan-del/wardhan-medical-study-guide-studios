import data from "../../src/content/library-lessons.json";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("answer-first recall repeats only weaker cards without saving drafts or changing quiz history", async ({ page }) => {
  await page.goto("/library/dna-replication#recap");
  const recap = page.locator("#recap:visible");
  const lesson = data.lessons.find(lesson => lesson.id === "dna-replication")!;
  const total = lesson.steps.length + 1;
  const answersBefore = await page.evaluate(() => JSON.parse(localStorage.getItem("wardhan-learning:v1") ?? "{}").answers ?? {});
  await recap.getByRole("button", { name: "Practise these cards", exact: true }).press("Enter");
  await expect(recap.getByRole("heading", { level: 3 })).toBeFocused();
  await expect(recap.getByRole("button", { name: "Next card", exact: true })).toBeDisabled();
  for (let index = 0; index < total; index++) {
    await expect(recap.locator(".reel-counter")).toHaveText(`Prompt ${index + 1} of ${total}`);
    const draft = recap.getByRole("textbox", { name: "My answer, before comparing" });
    await expect(draft).toHaveValue("");
    await draft.fill(`PRIVATE_RECALL_RESPONSE_${index}`);
    await expect(recap.locator("p[hidden]")).toHaveCount(1);
    await expect(recap.getByRole("button", { name: "I can explain this", exact: true })).toHaveCount(0);
    await recap.getByRole("button", { name: "Reveal answer", exact: true }).click();
    await expect(recap.locator(".reel-frame")).toContainText(index < lesson.steps.length ? lesson.steps[index].body : lesson.recall.answer);
    await recap.getByRole("button", { name: index === 0 ? "Needs more practice" : "I can explain this", exact: true }).click();
    if (index === 1) {
      const accessibility = await new AxeBuilder({ page }).include("#recap").analyze();
      expect(accessibility.violations).toEqual([]);
      await recap.getByRole("button", { name: "Previous card", exact: true }).click();
      await expect(draft).toHaveValue("PRIVATE_RECALL_RESPONSE_0");
      await expect(recap.locator("p[hidden]")).toHaveCount(1);
      await recap.getByRole("button", { name: "Next card", exact: true }).click();
      await expect(draft).toHaveValue("PRIVATE_RECALL_RESPONSE_1");
    }
    await recap.getByRole("button", { name: index === total - 1 ? "Finish recall round" : "Next card", exact: true }).click();
  }
  await expect(recap.getByRole("heading", { name: "Your recall round", exact: true })).toBeFocused();
  await expect(recap).toContainText(`${total - 1} of ${total} prompts self-checked as explained; 1 need more practice.`);
  await recap.getByRole("button", { name: "Practise weaker cards", exact: true }).click();
  await expect(recap.locator(".reel-counter")).toHaveText("Prompt 1 of 1");
  await expect(recap.getByRole("heading", { level: 3 })).toHaveText(lesson.steps[0].title);
  await expect(recap.getByRole("textbox")).toHaveValue("");
  await recap.getByRole("button", { name: "Reveal answer", exact: true }).click();
  await recap.getByRole("button", { name: "I can explain this", exact: true }).click();
  await recap.getByRole("button", { name: "Finish recall round", exact: true }).click();
  await expect(recap).toContainText("1 of 1 prompts self-checked as explained; 0 need more practice.");
  await expect(recap.getByRole("button", { name: "Practise weaker cards", exact: true })).toHaveCount(0);
  await recap.getByRole("button", { name: "Try all cards again", exact: true }).click();
  await expect(recap.locator(".reel-counter")).toHaveText(`Prompt 1 of ${total}`);
  await expect(recap.getByRole("textbox")).toHaveValue("");
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain("PRIVATE_RECALL_RESPONSE");
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem("wardhan-learning:v1") ?? "{}").answers ?? {})).toEqual(answersBefore);
  await page.reload();
  await expect(recap.getByRole("button", { name: "Practise these cards", exact: true })).toBeVisible();
  await recap.getByRole("button", { name: "Practise these cards", exact: true }).click();
  await expect(recap.getByRole("textbox")).toHaveValue("");
});

test("foundation and renal lessons include the same keyboard-accessible recall practice", async ({ page }) => {
  for (const route of ["/library/anatomy-foundations", "/library/histology-foundations-tissues", "/learn/renal/kidney-map"]) {
    await page.goto(route);
    const recap = page.locator("#recap:visible");
    await expect(recap).toHaveCount(1);
    await page.getByRole("link", { name: /Recall practice/ }).click();
    await recap.getByRole("button", { name: "Practise these cards", exact: true }).press("Enter");
    await expect(recap.getByRole("heading", { level: 3 })).toBeFocused();
    await recap.getByRole("textbox").fill("Explain the relationship from memory.");
    await recap.getByRole("button", { name: "Reveal answer", exact: true }).press("Enter");
    await recap.getByRole("button", { name: "Needs more practice", exact: true }).press("Enter");
    await expect(recap).toContainText("Marked for another practice round");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
});
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
    page.getByRole("region", { name: "Your review session", exact: true }),
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
  const abg = page.getByRole("region", { name: "ABG interpretation exercise" });
  await abg.getByLabel("1. Describe the pH").selectOption("Acidemia");
  await abg
    .getByLabel("2. Explain the pattern")
    .selectOption("Metabolic acidosis plus respiratory acidosis");
  await page.getByRole("button", { name: "Check interpretation" }).click();
  await page
    .getByRole("textbox", { name: "My prediction and reason" })
    .fill(
      "Efferent resistance raises upstream pressure but reduces circuit flow.",
    );
  await page.reload();
  await expect(abg.getByLabel("2. Explain the pattern")).toHaveValue(
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

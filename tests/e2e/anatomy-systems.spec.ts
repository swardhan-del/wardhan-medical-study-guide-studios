import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { anatomySystems, anatomySystemHref } from "../../src/content/anatomy-systems";

test("home search accepts a readable query at 320 px with enlarged text", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto("/");
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  const search = page.getByRole("searchbox", { name: "What do you want to understand?" });
  const width = await search.evaluate(input => input.getBoundingClientRect().width);
  expect(width).toBeGreaterThanOrEqual(230);
  await search.fill("membrane transport");
  await search.press("Enter");
  await expect(page).toHaveURL(/\/library\?q=membrane\+transport$/);
  await expect(page.getByRole("link", { name: "Physiology Foundations: Membrane Transport and Resting Potential", exact: true })).toBeVisible();
});

test("the anatomy entry point offers all eleven models and links each to deeper teaching", async ({ page, request }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Explore anatomy models" }).click();
  await expect(page.getByRole("heading", { level: 1, name: "Explore the body systems" })).toBeVisible();
  const models = page.getByRole("list", { name: "Body systems" });
  await expect(models.getByRole("link")).toHaveCount(11);
  for (const system of anatomySystems) {
    const href = anatomySystemHref(system.id);
    await expect(models.getByRole("link", { name: system.name + " " + system.title, exact: true })).toHaveAttribute("href", href);
    const response = await request.get(href);
    expect(response.ok(), href).toBeTruthy();
    expect(await response.text()).toContain('/library/' + system.lesson.id);
  }
});

test("a diagram works with the keyboard and retains explained practice after reload", async ({ page }) => {
  await page.goto(anatomySystemHref("cardiovascular"));
  await page.getByRole("button", { name: "Select Left heart on the diagram" }).click();
  await expect(page.getByRole("button", { name: "Left heart", exact: true })).toHaveAttribute("aria-pressed", "true");
  const lungs = page.getByRole("button", { name: "Lungs", exact: true });
  await lungs.focus();
  await page.keyboard.press("Enter");
  await expect(lungs).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByText("Blood reaches the lungs via pulmonary arteries and returns to the left atrium via pulmonary veins.", { exact: true })).toBeVisible();

  const question = page.getByRole("region", { name: "Identify the relationship" });
  await question.getByRole("radio", { name: "Right heart" }).check();
  await question.getByRole("button", { name: "Check Answer and Continue →" }).click();
  await expect(question.getByRole("status")).toContainText("The right heart receives blood returning from the systemic circuit.");
  await page.reload();
  await expect(question.getByRole("status")).toContainText("Correct answer: Left heart");
  await page.goto("/study");
  await expect(page.getByRole("link", { name: "Two circuits through one heart" }).first()).toBeVisible();
});

test("model and practice reflow without page overflow at 320 px and 200% text", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto(anatomySystemHref("reproductive"));
  await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(321);
  expect((await new AxeBuilder({ page }).include("main").analyze()).violations).toEqual([]);
});

test("diagram text and model explanations are available without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  try {
    const page = await context.newPage();
    await page.goto("http://127.0.0.1:3101" + anatomySystemHref("cardiovascular"));
    await page.getByText("Read a text description", { exact: true }).click();
    await expect(page.getByText("The right atrium receives systemic venous blood", { exact: false }).first()).toBeVisible();
    const recall = page.getByRole("region", { name: "Explain it in your own words" });
    await recall.getByText("Model explanation", { exact: true }).click();
    const model = recall.locator("noscript details[open] p");
    await expect(model).toBeVisible();
    await expect(model).toContainText("The right ventricle sends blood to the lungs.");
  } finally {
    await context.close();
  }
});

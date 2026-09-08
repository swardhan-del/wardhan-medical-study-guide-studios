import { test, expect } from "@playwright/test";

test("saved renal and cross-subject lessons share My Study and survive reload", async ({
  page,
}) => {
  await page.goto("/learn/renal/kidney-map");
  await page.getByRole("button", { name: /Save to My Study: Follow the blood/ }).click();
  await page.goto("/library/epithelia");
  await page.getByRole("button", { name: /Save to My Study: Epithelia/ }).click();
  await page.goto("/reading-list");
  await expect(page).toHaveURL(/\/study#saved-learning$/);
  const saved = page.locator("#saved-learning");
  await expect(
    saved.getByRole("link", {
      name: "Follow the blood. Follow the filtrate.",
      exact: true,
    }),
  ).toBeVisible();
  await expect(
    saved.getByRole("link", {
      name: "Epithelia: layers, shape and function",
      exact: true,
    }),
  ).toBeVisible();
  await page.reload();
  await saved.getByRole("button", { name: /Saved to My Study: Follow the blood/ }).click();
  await expect(
    saved.getByRole("link", {
      name: "Follow the blood. Follow the filtrate.",
      exact: true,
    }),
  ).toHaveCount(0);
  await expect(
    saved.getByRole("link", {
      name: "Epithelia: layers, shape and function",
      exact: true,
    }),
  ).toBeVisible();
});

test("partial coverage remains partial after correcting a mistake", async ({ page }) => {
  await page.goto("/study");
  await expect(page.locator(".topic-progress")).toHaveCount(0);
  await page.getByLabel("Show topics I have not attempted").check();
  expect(await page.locator(".topic-progress").count()).toBeGreaterThan(8);
  await page.goto("/learn/renal/kidney-map");
  await page.getByRole("radio", { name: "Afferent arteriole", exact: true }).check();
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await page.goto("/study");
  const topic = page.locator(".topic-progress").filter({ has: page.getByRole("link", { name: "Follow the blood. Follow the filtrate.", exact: true }) });
  await expect(topic).toContainText("Needs review");
  await page.getByRole("button", { name: "Review my mistakes (1)" }).click();
  await page.getByRole("radio", { name: "Efferent arteriole", exact: true }).check();
  await page.getByRole("button", { name: "Check answer", exact: true }).click();
  await expect(topic).toContainText("In progress");
  await expect(topic).toContainText("First-attempt accuracy: 0 of 1");
  const coverage = topic.getByRole("progressbar");
  await expect(coverage).toHaveAttribute("value", "1");
  expect(Number(await coverage.getAttribute("max"))).toBeGreaterThan(1);
});

test("correction preserves lesson context and prepares a draft without submitting", async ({
  page,
}) => {
  await page.goto("/learn/renal/kidney-map");
  await page.getByRole("link", { name: "Report a correction" }).click();
  await expect(page).toHaveURL(/lesson=%2Flearn%2Frenal%2Fkidney-map/);
  await page.getByLabel("Page title, section or question").fill("Two paths, one organ");
  await page
    .getByLabel("Your feedback or correction")
    .fill("Please clarify the distinction in this explanation.");
  await page.getByRole("button", { name: "Prepare feedback email" }).click();
  await expect(page.getByRole("status")).toContainText("Nothing has been sent");
  const draft = page.getByRole("link", {
    name: /Review and submit on GitHub|Open email draft/,
  });
  const href = await draft.getAttribute("href");
  expect(href).toBeTruthy();
  const url = new URL(href!);
  expect(url.protocol).toBe("mailto:");
  expect(url.pathname).toBe("swardhan1@icloud.com");
  expect(url.searchParams.get("body")).toContain("/learn/renal/kidney-map");
  expect(url.searchParams.get("body")).toContain("Two paths, one organ");
});

test("nephron diagram supports recall and fits the page on small screens", async ({
  page,
}, testInfo) => {
  await page.goto("/learn/renal/kidney-map");
  await expect(
    page.getByRole("img", {
      name: "Nephron: blood and tubular-fluid pathways",
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Hide labels for recall" }).click();
  await expect(page.locator(".nephron-labels")).toHaveCount(0);
  await page.getByRole("button", { name: "Show labels" }).click();
  await expect(page.locator(".nephron-labels")).toHaveCount(1);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
  await page.mouse.move(0, 0);
  await page
    .locator(".nephron-panel")
    .screenshot({
      path: testInfo.outputPath("nephron-map.png"),
      animations: "disabled",
    });
});

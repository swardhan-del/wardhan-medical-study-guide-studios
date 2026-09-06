import { test, expect } from "@playwright/test";
test("curated records can be searched, filtered, reset and opened without source links", async ({
  page,
}) => {
  await page.goto("/review");
  const all = await page.locator(".resource-card:visible").count();
  expect(all).toBeGreaterThan(0);
  await page
    .getByRole("searchbox", { name: "Search resources" })
    .fill("zzzz-no-resource-zzzz");
  await expect(page.getByText("No matching resources.")).toBeVisible();
  await page
    .getByRole("button", { name: "Clear filters", exact: true })
    .first()
    .click();
  await expect(page.locator(".resource-card:visible")).toHaveCount(all);
  await page.getByRole("combobox", { name: "Format", exact: true }).selectOption("PDF");
  expect(await page.locator(".resource-card:visible").count()).toBeGreaterThan(0);
  const labels = await page.locator(".resource-topline").allTextContents();
  expect(labels.every((label) => label.startsWith("PDF"))).toBe(true);
  await page.getByRole("combobox", { name: "Sort by" }).selectOption("recent");
  await page.getByRole("link", { name: "View resource" }).first().click();
  await expect(page.locator("h1")).toBeVisible();
  await expect(
    page.getByText("Downloads have not been released.", { exact: false }),
  ).toBeVisible();
  const html = await page.content();
  expect(html).not.toContain("original_dropbox_path");
  expect(html).not.toContain("/study guide/");
  expect(await page.locator('a[href*="dropbox"]').count()).toBe(0);
});
test("review catalog fits a phone screen", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/review");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});

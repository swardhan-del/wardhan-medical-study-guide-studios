import { test, expect } from "@playwright/test";
test("histology course views preserve useful lessons and exclude candidate files", async ({
  page,
}) => {
  for (const slug of ["histology", "histology-i", "histology-ii"]) {
    await page.goto("/subjects/" + slug);
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator('a[href*="dropbox"]')).toHaveCount(0);
    await expect(page.locator(".resource-card").first()).toBeVisible();
  }
});

import { test, expect } from "@playwright/test";
test("genetics and immunology browse released resources without private guide links", async ({
  page,
}) => {
  for (const subject of ["genetics", "immunology"]) {
    await page.goto("/subjects/" + subject);
    await expect(page.locator('a[href*="dropbox"]')).toHaveCount(0);
    await expect(page.locator(".resource-card").first()).toBeVisible();
  }
  await page.goto("/videos");
  await expect(
    page.getByRole("heading", { name: "Video library", exact: true }),
  ).toBeVisible();
  await expect(page.getByText(/No videos have been released/)).toBeVisible();
});

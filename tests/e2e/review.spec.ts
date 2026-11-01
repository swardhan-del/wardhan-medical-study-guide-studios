import { test, expect } from "@playwright/test";
test("curated records can be searched, filtered, reset and opened without source links", async ({
  page,
}) => {
  await page.goto("/review");
  await expect(page.locator(".resource-card:visible").first()).toBeVisible();
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
  await page
    .getByRole("combobox", { name: "Format", exact: true })
    .selectOption("PDF");
  expect(await page.locator(".resource-card:visible").count()).toBeGreaterThan(
    0,
  );
  await expect
    .poll(async () => {
      const labels = await page
        .locator(".resource-card:visible .resource-topline")
        .allTextContents();
      return (
        labels.length > 0 &&
        labels.every((label) => label.trim().startsWith("PDF"))
      );
    })
    .toBe(true);
  await page.getByRole("combobox", { name: "Sort by" }).selectOption("recent");
  await page.getByRole("link", { name: "View resource" }).first().click();
  await expect(page).toHaveURL(/\/review\/[a-z0-9-]+$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(
    page.getByText("Downloads have not been released.", { exact: false }).filter({ visible: true }),
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

test("three existing Molecular Cell Biology diagrams render only in local lesson review", async ({ page, request }) => {
  for (const [lesson, diagram] of [["chromatin-access-and-topology", "chromatin-local-access"], ["er-protein-quality-control", "er-folding-decisions"], ["cell-signaling", "gpcr-versus-rtk"]]) {
    await page.goto(`/review/molecular-cell-biology/${lesson}#draft-visual-review`);
    const draft = page.locator("#draft-visual-review");
    await expect(draft.locator(`[data-original-diagram="${diagram}"]`)).toBeVisible();
    await expect(draft).toContainText("reviews remain pending");
    await expect(draft.getByRole("img")).toHaveAccessibleName(/.+/);
    await expect(draft.locator("figcaption")).toContainText("Observe and explain:");
    await draft.locator("details").last().locator("summary").press("Enter");
    await expect(draft.locator("details").last()).toHaveAttribute("open", "");
    if (lesson === "cell-signaling") await expect(draft.locator("svg")).toContainText("GDP leaves; GTP binds Gα");
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(draft.getByRole("region")).toHaveAttribute("tabindex", "0");
    const published = await request.get(`/library/${lesson}`);
    const html = await published.text();
    expect(published.status()).toBe(200);
    expect(html).not.toContain("data-original-diagram");
    expect(html).not.toContain("draft-visual-review");
    expect(html).not.toContain("private-source-links");
  }
  expect((await request.get("/review/molecular-cell-biology/not-a-lesson")).status()).toBe(404);
});

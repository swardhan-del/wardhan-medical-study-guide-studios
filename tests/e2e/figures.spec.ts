import { test, expect } from "@playwright/test";
test("approved figures retain proportions and enlarge with keyboard, zoom and download", async ({
  page,
}, info) => {
  await page.goto("/subjects");
  await expect(page.locator(".figure-thumbnail").first()).toBeVisible();
  await page.goto("/topics/topic-epithelia");
  await expect(
    page.getByRole("region", { name: "Study figures" }),
  ).toBeVisible();
  const trigger = page.getByRole("button", {
    name: "Enlarge Simple cuboidal epithelium",
  });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Close image" }),
  ).toBeFocused();
  await dialog.getByLabel("Image zoom").selectOption("2");
  expect(
    await dialog
      .locator(".figure-zoom-window")
      .evaluate((el) => el.scrollWidth > el.clientWidth),
  ).toBe(true);
  await expect(dialog.locator("img")).toHaveJSProperty("naturalWidth", 3264, {
    timeout: 20000,
  });
  const download = page.waitForEvent("download");
  await dialog
    .getByRole("link", { name: "Download image", exact: true })
    .click();
  expect((await download).suggestedFilename()).toContain("cuboidal-section");
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(trigger).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: info.outputPath("figure-comparison.png"),
    fullPage: true,
  });
  await page.goto("/library/microscopy");
  await expect(
    page.locator(".concept-sequence .educational-figure"),
  ).toBeVisible();
  for (const image of await page
    .locator(".educational-figure .figure-open img")
    .all()) {
    await expect(image).toHaveAttribute("loading", "lazy");
    await expect(image).toHaveAttribute("srcset", /320w/);
    expect(await image.getAttribute("alt")).toBeTruthy();
  }
});

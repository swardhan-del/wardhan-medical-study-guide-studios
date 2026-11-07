import { expect, type Locator } from "@playwright/test";

// Capture overlapping viewport slices of long panels. Chromium's element capture
// can stall on its stability wait even when the panel is already rendered (the
// retained CI traces show this). Keep all behavior assertions and the same test
// timeout, and preserve the complete panel as images rather than dropping capture.
export async function screenshotPanel(panel: Locator, path: string) {
  await expect(panel).toBeVisible();
  const page = panel.page();
  await expect.poll(() => panel.locator("img").evaluateAll(images => images.every(image => (image as HTMLImageElement).complete))).toBe(true);
  const bounds = await panel.evaluate(element => {
    const rect = element.getBoundingClientRect();
    return { top: rect.top + window.scrollY, height: rect.height, viewport: window.innerHeight };
  });
  const stride = Math.max(1, bounds.viewport - 160);
  const slices = Math.max(1, Math.ceil(bounds.height / stride));
  for (let slice = 0; slice < slices; slice++) {
    await page.evaluate(top => window.scrollTo({ top, behavior: "instant" }), Math.max(0, bounds.top + slice * stride - 80));
    await page.screenshot({ path: slice ? path.replace(/\.png$/, `-part-${slice + 1}.png`) : path, animations: "disabled" });
  }
}

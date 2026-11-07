import { expect, type Locator } from "@playwright/test";

// Bring long-page panels into the viewport before Chromium's screenshot stability
// check. The screenshot still captures the real panel and all preceding behavior
// assertions remain in place; no historical evidence paths are reused.
export async function screenshotPanel(panel: Locator, path: string) {
  await expect(panel).toBeVisible();
  await panel.evaluate(element => element.scrollIntoView({ block: "start", behavior: "instant" }));
  return panel.screenshot({ path, animations: "disabled" });
}

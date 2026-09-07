import { createRequire } from "node:module";
import { resolve } from "node:path";
import { mkdirSync, writeFileSync } from "node:fs";
const require = createRequire(import.meta.url),
  { chromium } = require("@playwright/test");
const browser = await chromium.launch();
const results = [];
mkdirSync(".private/accessibility-check", { recursive: true });
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 }, storageState: process.env.PREVIEW_STORAGE_STATE });
    for (const route of [
      "/library",
      "/subjects",
      "/subjects/physiology",
      "/topics/physiology-renal",
      "/topics/topic-renal-revision-sheet",
      "/library/renal-revision-sheet",
      "/library/epithelia",
      "/videos",
      "/topics/topic-epithelia",
      "/library/microscopy",
      "/library/renal-histology",
    ]) {
      await page.goto(
        (process.env.CHECK_BASE_URL || "http://127.0.0.1:3101") + route,
      );
      if (new URL(page.url()).origin !== new URL(process.env.CHECK_BASE_URL || "http://127.0.0.1:3101").origin) throw new Error("Check reached an authentication page instead of the website");
      await page.addScriptTag({
        path: resolve(
          ".private/verification-tools/node_modules/axe-core/axe.min.js",
        ),
      });
      const violations = await page.evaluate(async () =>
        (
          await window.axe.run(document, {
            runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21aa"] },
          })
        ).violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.map((n) => ({
            target: n.target,
            summary: n.failureSummary,
          })),
        })),
      );
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      );
      results.push({ width, route, overflow, violations });
      await page.screenshot({
        path:
          ".private/accessibility-check/" +
          width +
          route.replaceAll("/", "-") +
          ".png",
        fullPage: route === "/videos",
      });
    }
    await page.close();
  }
} finally {
  await browser.close();
}
writeFileSync(
  ".private/accessibility-check/results.json",
  JSON.stringify(results, null, 2),
);
const failed = results.filter((r) => r.violations.length || r.overflow);
console.log(
  JSON.stringify(
    failed.length
      ? failed
      : { pages: results.length, violations: 0, overflow: 0 },
  ),
);
if (failed.length) process.exitCode = 1;

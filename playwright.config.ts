import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  use: {
    browserName: "chromium",
    launchOptions: { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH },
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      testMatch:
        /(?:security|printable-guides|resource-access|biophysics|first-visit|figures|public|student-audit|learning-continuity|directory|authored-guides|histology-resources|thorax|study-depth)\.spec\.ts/,
      use: {
        baseURL: "http://127.0.0.1:3101",
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "mobile",
      testMatch:
        /(?:security|printable-guides|resource-access|biophysics|first-visit|figures|public|student-audit|learning-continuity|directory|authored-guides|histology-resources|thorax|study-depth)\.spec\.ts/,
      use: {
        baseURL: "http://127.0.0.1:3101",
        viewport: { width: 390, height: 844 },
      },
    },
    {
      name: "local-review",
      testMatch: /review\.spec\.ts/,
      use: {
        baseURL: "http://127.0.0.1:3102",
        viewport: { width: 1440, height: 1000 },
      },
    },
  ],
  webServer: [
    {
      command:
        "node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3101",
      url: "http://127.0.0.1:3101",
      reuseExistingServer: false,
      env: { LOCAL_CURATION_REVIEW: "0", VERCEL: "" },
    },
    {
      command:
        "node scripts/ensure-review-fixture.mjs && node node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port 3102",
      url: "http://127.0.0.1:3102",
      reuseExistingServer: false,
      env: { LOCAL_CURATION_REVIEW: "1", VERCEL: "" },
    },
  ],
});

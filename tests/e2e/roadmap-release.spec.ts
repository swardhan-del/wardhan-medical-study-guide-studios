import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { subjectHubs } from "../../src/content/subject-hubs";
import library from "../../src/content/library-lessons.json";

// Runs against the local production build and the exact hosted release.
for (const [subject, hub] of Object.entries(subjectHubs)) {
  test(`release journey: ${hub.name} hub, lesson, explained question and library`, async ({ page }) => {
    const response = await page.goto(`/study/${subject}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: "What you will study", exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Start learning", exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/library/${hub.firstLesson}$`));
    const lesson = library.lessons.find(item => item.id === hub.firstLesson)!;
    const question = page.locator("#concept-check-title:visible");
    await question.getByRole("radio", { name: lesson.question.options[lesson.question.answer].text, exact: true }).check();
    await question.getByRole("button", { name: "Check answer", exact: true }).click();
    await expect(question.getByRole("status")).toContainText("Correct.");
    await expect(page.locator(".clinical-review-notice:visible")).toContainText("peer review has not been completed");
    await page.getByRole("region", { name: "Your lesson journey" }).getByRole("link", { name: "Back to library", exact: true }).click();
    await expect(page).toHaveURL(/\/library$/);
  });
}

test("release homepage, starter pack, waitlist and legal notices are accessible", async ({ page }, info) => {
  test.setTimeout(90000);
  if (info.project.name === "mobile") await page.setViewportSize({ width: 320, height: 900 });
  for (const path of ["/", "/starter-pack", "/waitlist", "/terms", "/privacy"]) {
    const response = await page.goto(path); expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1:visible")).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), path).toBe(true);
    const audit = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
    expect(audit.violations, path).toEqual([]);
  }
  await expect(page.locator("#analytics-preference")).toContainText("No learning events are sent");
  await page.goto("/terms");
  await expect(page.getByRole("heading", { name: "Not medical advice", exact: true })).toBeVisible();
});

test("release providers fail closed and the browser-only demo makes no signup request", async ({ page, request }) => {
  expect(await (await request.get("/api/measurement")).json()).toEqual({ enabled: false });
  expect(await (await request.get("/api/waitlist")).json()).toEqual({ mode: "demo" });
  const submissions: string[] = [];
  page.on("request", req => { if (req.method() === "POST" && /\/api\/(waitlist|measurement)/.test(req.url())) submissions.push(req.url()); });
  await page.goto("/waitlist");
  await page.getByLabel("Example email address (required)", { exact: true }).fill("student@example.com");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: "Try demo — no signup", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("No address was transmitted or saved, and no email was sent.");
  expect(submissions).toEqual([]);
});

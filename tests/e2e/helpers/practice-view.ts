import type { Page } from "@playwright/test";

// Full answer-key/preservation audits deliberately use the student's revision view.
// Sequential progression has its own behavioural tests in first-visit.spec.ts.
export async function showAllPractice(page: Page) {
  for (const sequence of await page.locator(".practice-sequence:visible").all()) {
    const button = sequence.getByRole("button", { name: "Show all questions", exact: true });
    if (await button.count()) await button.click();
  }
}

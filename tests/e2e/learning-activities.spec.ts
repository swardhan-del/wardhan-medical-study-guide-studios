import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { learningActivities } from "../../src/content/learning-activities";

for (const lessonId of ["anatomy-foundations", "neural-tube-development"]) {
  test(`${lessonId}: activities support mistakes, correction and explicit self-review`, async ({ page }) => {
    await page.goto(`/library/${lessonId}`);
    for (const activity of learningActivities.filter(item => item.lessonId === lessonId)) {
      const panel = page.locator(`section[aria-labelledby="${activity.id}-title"]`);
      if (activity.kind === "name") {
        const input = panel.getByLabel("Short name", { exact: true });
        await input.fill(`not ${activity.accepted[0]}`);
        await panel.getByRole("button", { name: "Check name" }).click();
        await expect(panel.getByRole("status")).toContainText("unassessed");
        await input.fill(activity.accepted[0]);
        await input.press("Tab"); await page.keyboard.press("Enter");
        await expect(panel.getByRole("status")).toContainText("Name matched");
      } else if (activity.kind === "sequence") {
        await panel.getByRole("button", { name: "Check order" }).click();
        await expect(panel.getByRole("status")).toContainText("Choose every stage");
        for (const stage of [...activity.stages].reverse()) await panel.getByRole("button", { name: stage.label, exact: true }).click();
        await panel.getByRole("button", { name: "Check order" }).click();
        await expect(panel.getByRole("status")).toContainText("Revisit position");
        await panel.getByRole("button", { name: "Reset sequence" }).click();
        for (const stage of activity.stages) await panel.getByRole("button", { name: stage.label, exact: true }).click();
        await panel.getByRole("button", { name: "Check order" }).click();
        await expect(panel.getByRole("status")).toContainText("Order matched");
      } else {
        await panel.getByLabel("Write or outline your explanation").fill("My initial explanation");
        await panel.getByRole("button", { name: "Compare with the rubric" }).click();
        await panel.getByRole("checkbox").first().check();
        await expect(panel.getByRole("status").first()).toContainText("You marked 1");
        await expect(panel.getByText("One possible explanation")).toBeVisible();
      }
    }
  });

  test(`${lessonId}: reflow and accessible controls at 320px and 200 percent text`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(`/library/${lessonId}`);
    await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
    const collapsedRubrics = page.getByRole("button", { name: "Compare with the rubric" });
    while (await collapsedRubrics.count()) await collapsedRubrics.first().click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBeTruthy();
    const audit = await new AxeBuilder({ page }).include('section[aria-labelledby="reasoning-practice-title"]').analyze();
    expect(audit.violations).toEqual([]);
  });
}

test("neurulation slides update the visual and hide the previous revealed answer", async ({ page }) => {
  await page.goto("/library/neural-tube-development");
  const panel = page.locator('section[aria-labelledby="neurulation-slides-title"]');
  await panel.getByText("Which feature distinguishes", { exact: false }).click();
  await panel.getByRole("button", { name: "4. Surface and tube are distinct" }).click();
  await expect(panel.getByRole("img")).toHaveAccessibleName(/Surface and tube are distinct/);
  await expect(panel.getByText("No. Position and signalling influence", { exact: false })).not.toBeVisible();
  expect((await new AxeBuilder({ page }).include('section[aria-labelledby="neurulation-slides-title"]').analyze()).violations).toEqual([]);
});

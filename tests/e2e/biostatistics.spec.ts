import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import data from '../../src/content/library-lessons.json';

const lessons = data.lessons.filter(l => l.subject === 'biostatistics');
test('statistics directory, filters and full-text search reach the new lessons', async ({ page }) => {
  await page.goto('/subjects');
  await page.getByRole('link', { name: 'Explore Biostatistics', exact: true }).click();
  await expect(page.locator('.resource-card:visible')).toHaveCount(4);
  await expect(page.getByText('No public lessons yet', { exact: true })).toHaveCount(0);
  await page.goto('/library?subject=biostatistics');
  await expect(page.locator('.resource-card:visible')).toHaveCount(4);
  await page.getByRole('searchbox').fill('square-root relationship');
  await expect(page.locator('.resource-card:visible')).toHaveCount(1);
  await expect(page.locator('.resource-card:visible')).toContainText('Standard deviation and standard error');
});

for (const lesson of lessons) {
  test(`statistics explanation, feedback, persistence and keyboard: ${lesson.id}`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('/library/' + lesson.id);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(lesson.title);
    const worked = page.locator('section[aria-labelledby="worked-example-heading"]:visible');
    await worked.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(worked.locator('ol')).toBeVisible();
    const check = page.locator('#concept-check-title:visible');
    for (let i = 1; i >= 0; i--) {
      await check.getByRole('radio', { name: lesson.question.options[i].text, exact: true }).check();
      await check.getByRole('button', { name: 'Check answer', exact: true }).click();
      await expect(check).toContainText(lesson.question.options[i].reason);
      if (i > 0) await check.getByRole('button', { name: 'Try without feedback', exact: true }).click();
    }
    await page.reload();
    await expect(check.getByRole('radio', { name: lesson.question.options[0].text, exact: true })).toBeChecked();
    const save = page.getByRole('button', { name: `Save to My Study: ${lesson.title}`, exact: true });
    await save.click();
    await page.reload();
    const saved = page.getByRole('button', { name: `Saved to My Study: ${lesson.title} (remove from saved resources)`, exact: true });
    await expect(saved).toHaveAttribute('aria-pressed', 'true');
    await saved.click();
    await page.reload();
    await expect(save).toBeVisible();
    await expect(page.locator('#lesson-source a[href^="https://www.itl.nist.gov/"]')).toHaveCount(1);
    await expect(page.locator('main a[href="/study/biostatistics"], main a[href="/learn/foundations/biostatistics"]')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    expect(errors).toEqual([]);
    await page.screenshot({ path: info.outputPath('lesson.png'), fullPage: true });
    await page.setViewportSize({ width: 320, height: 844 });
    await page.evaluate(() => { document.documentElement.style.fontSize = '200%'; });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('link', { name: 'Biostatistics lessons →', exact: true }).click();
    await expect(page).toHaveURL(/\/subjects\/biostatistics$/);
    await expect(page.locator('.resource-card:visible')).toHaveCount(4);
  });
}

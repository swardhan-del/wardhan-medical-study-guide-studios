import { showAllPractice } from "./helpers/practice-view";
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import data from '../../src/content/library-lessons.json';

const lessons = data.lessons.filter(l => l.source === 'original-statistics-foundations');
test('statistics directory, filters and full-text search reach the new lessons', async ({ page }) => {
  await page.goto('/subjects');
  await page.getByRole('link', { name: 'Explore Biostatistics', exact: true }).click();
  await expect(page.locator('.resource-card:visible')).toHaveCount(7);
  await expect(page.getByText('No public lessons yet', { exact: true })).toHaveCount(0);
  await page.goto('/library?subject=biostatistics');
  await expect(page.locator('.resource-card:visible')).toHaveCount(7);
  await page.getByRole('searchbox').fill('square-root relationship');
  const results = page.locator('.resource-card:visible');
  await expect(results).toHaveCount(2);
  await expect(results.filter({ hasText: 'Standard deviation and standard error' })).toHaveCount(1);
  await expect(results.filter({ hasText: 'Paired differences' })).toHaveCount(1);
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
      await showAllPractice(page);await check.getByRole('radio', { name: lesson.question.options[i].text, exact: true }).check();
      await check.getByRole('button', { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
      await expect(check).toContainText(lesson.question.options[i].reason);
      if (i > 0) await check.getByRole('button', { name: 'Try without feedback', exact: true }).click();
    }
    await page.reload();await showAllPractice(page);
    await expect(check.getByRole('radio', { name: lesson.question.options[0].text, exact: true })).toBeChecked();
    const save = page.getByRole('button', { name: `Save to My Study: ${lesson.title}`, exact: true });
    await save.click();
    await page.reload();await showAllPractice(page);
    const saved = page.getByRole('button', { name: `Saved to My Study: ${lesson.title} (remove from saved resources)`, exact: true });
    await expect(saved).toHaveAttribute('aria-pressed', 'true');
    await saved.click();
    await page.reload();await showAllPractice(page);
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
    await check.scrollIntoViewIfNeeded();
    await page.screenshot({ path: info.outputPath('enlarged-question.png'), fullPage: false });
    await page.getByRole('link', { name: 'Biostatistics lessons →', exact: true }).click();
    await expect(page).toHaveURL(/\/subjects\/biostatistics$/);
    await expect(page.locator('.resource-card:visible')).toHaveCount(7);
  });
}

test('study design and cardiovascular navigation reach the new lessons with usable worked practice', async ({ page }) => {
  const cases = [
    { entry: '/subjects/biostatistics', id: 'experimental-unit-cell-reading-hierarchy', result: '24 readings' },
    { entry: '/subjects/biostatistics', id: 'paired-differences-marginals-covariance', result: '0.65 and 13.18 units' },
    { entry: '/learn/courses/physiology#exercise-and-splanchnic-circulation', id: 'splanchnic-flow-and-cardiac-output-share', result: '17 percentage points' },
  ];

  for (const { entry, id, result } of cases) {
    await page.goto(entry);
    const lesson = data.lessons.find(item => item.id === id)!;
    const links = entry.startsWith('/subjects')
      ? page.locator('.resource-card:visible')
      : page.locator('#exercise-and-splanchnic-circulation');
    await links.locator(`a[href="/library/${id}"]:visible`).first().click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(lesson.title);
    const worked = page.locator('[aria-labelledby="worked-example-heading"]:visible');
    await worked.locator('summary').press('Enter');
    await expect(worked.locator('ol')).toContainText(result);
    const figure = page.locator('[data-lesson-visuals]:visible figure');
    await figure.getByText('Read a text description', { exact: true }).press('Enter');
    await expect(figure.locator('details[open] p')).toBeVisible();

    const check = page.locator('#concept-check-title:visible');
    await check.getByRole('radio', { name: lesson.question.options[lesson.question.answer].text, exact: true }).check();
    await check.getByRole('button', { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
    await expect(check.getByRole('status')).toContainText('Correct');
    await page.setViewportSize({ width: 320, height: 844 });
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
    const axe = await new AxeBuilder({ page }).include('[data-lesson-visuals]').include('[aria-labelledby="worked-example-heading"]').analyze();
    expect(axe.violations).toEqual([]);
  }
});

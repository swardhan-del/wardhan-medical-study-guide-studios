import { mkdirSync } from "node:fs";
import { test, expect } from '@playwright/test';
const subjects = ['anatomy', 'histology', 'cell-biology', 'biochemistry', 'physiology', 'genetics', 'biophysics'];
for (const subject of subjects) {
  test(`${subject}: guide parts connect to printable notes without overflow`, async ({ page }, testInfo) => {
    await page.goto(`/study/${subject}/guide`);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('guide parts and visuals');
    expect(await page.locator('.guide-part').count()).toBeGreaterThan(0);
    const shots = process.env.GUIDE_SCREENSHOT_DIR;
    if (shots) { mkdirSync(shots, { recursive: true }); await page.screenshot({ path: `${shots}/${subject}-guide-${testInfo.project.name}.png`, fullPage: true }); }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.getByRole('link', { name: 'Choose parts and print notes' }).click();
    await expect(page.getByRole('group', { name: 'Choose the parts to print' })).toBeVisible();
    await expect(page.locator('.guide-divider').first()).toBeVisible();
    if (shots) await page.screenshot({ path: `${shots}/${subject}-revision-${testInfo.project.name}.png`, fullPage: false });
    await page.getByRole('checkbox', { name: 'Include answer key' }).uncheck();
    await expect(page.getByRole('heading', { name: 'Answer key and explanation prompts' })).toHaveCount(0);
    await page.getByRole('button', { name: 'Clear selection' }).click();
    await expect(page.locator('.revision-lesson')).toHaveCount(0);
    await expect(page.getByRole('status')).toContainText('0 of');
    await page.locator('.guide-options input').first().check();
    await expect(page.locator('.guide-divider')).toHaveCount(1);
    await page.emulateMedia({ media: 'print' });
    await expect(page.locator('.guide-selector')).toBeHidden();
    expect(await page.locator('.guide-divider').evaluate(el => getComputedStyle(el).breakBefore)).toBe('page');
    if (shots && testInfo.project.name === 'desktop') await page.pdf({ path: `${shots}/${subject}-selected-part.pdf`, format: 'A4', printBackground: true });
  });
}
test('histology source gaps remain explicit and lesson / answer selection stays aligned', async ({ page }) => {
  await page.goto('/study/histology/guide');
  await expect(page.locator('.guide-part')).toHaveCount(20);
  await expect(page.locator('#histology-part-16')).toContainText('does not yet have a dedicated web lesson');
  await page.goto('/study/histology/revision');
  await page.getByRole('button', { name: 'Clear selection' }).click();
  await page.locator('.guide-options input').first().check();
  await expect(page.locator('.revision-lesson')).toHaveCount(1);
  await expect(page.locator('.revision-answers')).toContainText('Reading a histology section');
  await expect(page.locator('.revision-answers')).not.toContainText('Myelin and glia');
});

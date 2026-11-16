import { mkdirSync } from "node:fs";
import { test, expect } from '@playwright/test';
import guide from '../../src/content/printable-guides.json';
import library from '../../src/content/library-lessons.json';
import { guideVisualPractice } from '../../src/content/guide-visual-practice';
const subjects = ['anatomy', 'histology', 'cell-biology', 'biochemistry', 'physiology', 'genetics', 'biophysics', 'biostatistics'];
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
  await expect(page.locator('#histology-part-16')).toContainText('Other ocular tissues, accessory structures and the complete eye-development syllabus remain outside these lessons');
  await expect(page.locator('#histology-part-16 a[href="/library/retinal-on-off-bipolar-response"]')).toHaveCount(1);
  await expect(page.locator('#histology-part-14').getByRole('link', { name: 'Start the spinal cord practical' })).toHaveAttribute('href', '/practice/spinal-cord');
  await page.goto('/study/histology/revision');
  await page.getByRole('button', { name: 'Clear selection' }).click();
  await page.locator('.guide-options input').first().check();
  await expect(page.locator('.revision-lesson')).toHaveCount(2);
  await expect(page.locator('.revision-answers')).toContainText('Histology Foundations: The Four Basic Tissues');
  await expect(page.locator('.revision-answers')).toContainText('Preparation, staining and defensible slide interpretation');
  await expect(page.locator('.revision-answers')).not.toContainText('Myelin and glia');
});

test('the histology sequence stops at the next numbered part even when no lesson is available', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/subjects/histology');
  await page.getByRole('link', { name: 'Ordered 20-part histology guide' }).click();
  await page.locator('#histology-part-07 ol').getByRole('link').first().click();
  await page.getByRole('link', { name: 'Review summary', exact: true }).click();
  const next = page.getByRole('navigation', { name: 'Ordered guide navigation' });
  await next.getByRole('link', { name: /^Next part: Oral cavity/ }).click();
  await expect(page).toHaveURL(/#histology-part-08$/);
  const empty = page.locator('#histology-part-08');
  await expect(empty).toContainText('Course materials');
  await expect(empty.getByRole('heading', {name: 'Lessons and questions'})).toHaveCount(0);
  await expect(empty.getByRole('link', { name: /^Previous part: Respiratory system/ })).toHaveAttribute('href', '/study/histology/guide#histology-part-07');
  await empty.getByRole('link', { name: /^Next part: Stomach/ }).click();
  await expect(page).toHaveURL(/#histology-part-09$/);
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
});

test('physiology guide, printable notes and answer key follow the same cardiovascular lesson order', async ({ page }) => {
  const part = guide.parts.find(part => part.id === 'physiology-cardiovascular')!;
  const expected = part.lessonIds.map(id => library.lessons.find(lesson => lesson.id === id)!.title);
  expect(part.lessonIds.slice(0, 3)).toEqual(['ecg-time-and-vectors', 'cardiac-cycle', 'cardiac-output']);
  await page.goto('/study/physiology/guide#physiology-cardiovascular');
  const section = page.locator('#physiology-cardiovascular');
  await expect(section.locator('ol a')).toHaveText(expected);
  await section.getByRole('link', { name: 'Open this part in the printable notes' }).click();
  await expect(page).toHaveURL(/\/revision#physiology-cardiovascular$/);
  await page.getByRole('button', { name: 'Clear selection' }).click();
  await page.getByRole('checkbox', { name: /^02\. Cardiovascular Physiology/ }).check();
  await expect(page.locator('.revision-lesson > h3')).toHaveText(expected);
  await expect(page.locator('.revision-answers h3')).toHaveText(expected);
});

test('Part 14 practical teaches orientation, motor region and withdrawal with explained feedback', async ({ page }) => {
  await page.goto('/study/histology/guide#histology-part-14');
  await page.getByRole('link', { name: 'Start the spinal cord practical' }).click();
  await expect(page.getByRole('heading', { name: 'Spinal cord practical', level: 1 })).toBeVisible();
  const section = page.getByRole('img', { name: /Spinal cord cross-section/ });
  await expect(section).toBeVisible();
  await expect.poll(() => section.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  const practical = page.getByRole('region', { name: 'From slide to signal' });
  await practical.getByRole('button', { name: /^A — the narrow horn/ }).click();
  await expect(practical.getByRole('status')).toContainText('away from the midline');
  await practical.getByRole('button', { name: /^C — the deep midline/ }).click();
  await expect(practical.getByRole('status')).toContainText('anterior median fissure');
  await practical.getByRole('button', { name: 'Next station' }).click();
  await expect(practical.getByRole('heading', { name: 'Where would you zoom in?' })).toBeFocused();
  await expect(practical.getByRole('img', { name: /large, purple-stained neuron/ })).toBeVisible();
  await practical.getByRole('button', { name: /^B — the broad ventral horn/ }).click();
  await practical.getByRole('button', { name: 'Next station' }).click();

  await page.setViewportSize({ width: 320, height: 900 });
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  await practical.getByRole('button', { name: 'Dorsal root → spinal grey matter → ventral root' }).click();
  await expect(practical.getByRole('list', { name: 'Withdrawal reflex in order' }).getByRole('listitem')).toHaveCount(3);
  await expect(practical).toContainText('Practical complete.');
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  await practical.getByRole('button', { name: 'Try the practical again' }).click();
  await expect(practical).toContainText('0 of 3 complete');
});

for (const subject of subjects) {
  test(`${subject}: visual practice has explained feedback at enlarged text`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 900 });
    const practice = guideVisualPractice[subject];
    await page.goto(`/study/${subject}/guide`);
    await page.getByRole('link', { name: 'Try a visual exercise', exact: true }).click();
    const panel = page.getByRole('region', { name: practice.title });
    await expect(panel.locator('figure')).toBeVisible();
    await expect(panel.getByText(practice.question, { exact: true })).toBeVisible();
    await expect(panel.getByText(practice.explanation, { exact: true })).toBeHidden();
    await panel.getByText('Check your reasoning', {exact: true}).click();
    await expect(panel.getByText(practice.explanation, { exact: true })).toBeVisible();
    await expect(panel.getByRole('link', { name: practice.action })).toHaveAttribute('href', practice.href);
    await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  });
}

test('Biostatistics and Immunology link to their published work', async ({ page }) => {
  await page.goto('/subjects/biostatistics');
  await page.getByRole('link', { name: 'Ordered guide', exact: true }).click();
  await expect(page).toHaveURL('/study/biostatistics/guide');
  await page.goto('/study/genetics/guide#study-immunology');
  const immunology = guideVisualPractice.immunology;
  const panel = page.getByRole('region', {name: immunology.title});
  await expect(panel.getByRole('link', {name: immunology.action})).toHaveAttribute('href', immunology.href);
});

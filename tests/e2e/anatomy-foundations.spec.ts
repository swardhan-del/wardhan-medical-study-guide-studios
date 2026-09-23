import { test, expect } from '@playwright/test';
import lessons from '../../src/content/library-lessons.json';
import studio from '../../src/content/study-questions.json';
import transfer from '../../src/content/transfer-practice.json';
import references from '../../src/content/lesson-references.json';
const id = 'anatomy-foundations';
const title = 'Anatomy Foundations: Position, Planes and Organisation';
const lesson = lessons.lessons.find(l => l.id === id)!;

test('Anatomy course map and flagship are reachable from home, subject hub and library', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Begin Anatomy Foundations', exact: true }).click();
  await expect(page).toHaveURL(/\/library\/anatomy-foundations$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
  await page.goto('/subjects/anatomy');
  const map = page.locator('#anatomy-course-map:visible');
  await expect(map.getByRole('heading', { name: 'Anatomy course map', exact: true })).toBeVisible();
  await expect(map.locator('ol > li')).toHaveCount(6);
  await map.getByRole('link', { name: 'Foundations →', exact: true }).click();
  await expect(page).toHaveURL(/\/library\/anatomy-foundations$/);
  await page.goto('/library?q=anatomy%20foundations');
  await page.getByRole('link', { name: title, exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
  await page.goto('/study/anatomy');
  await page.getByRole('link', { name: 'Start the first lesson', exact: true }).click();
  await expect(page).toHaveURL(/\/library\/anatomy-foundations$/);
});

test('all eleven Anatomy answers are hidden, explained and saved without runtime errors', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  await page.goto(`/library/${id}`);
  const concept = { ...lesson.question, options: lesson.question.options.map(o => ({ text: o.text, explanation: o.reason })) };
  const questions = [concept, ...studio.questions.filter(q => q.topic === id), ...transfer.questions.filter(q => q.topic === id)];
  for (const q of questions) {
    const panel = page.locator('.practice-question:visible').filter({ hasText: q.prompt });
    await expect(panel.getByRole('status')).toHaveCount(0);
    await panel.getByRole('radio', { name: q.options[q.answer].text, exact: true }).check();
    await panel.getByRole('button', { name: 'Check answer', exact: true }).click();
    await expect(panel.getByRole('status')).toContainText('Correct.');
    for (const option of q.options) await expect(panel.getByRole('status')).toContainText(option.explanation);
  }
  await page.reload();
  for (const q of questions) await expect(page.locator('.practice-question:visible').filter({ hasText: q.prompt }).getByRole('radio', { name: q.options[q.answer].text, exact: true })).toBeChecked();
  expect(errors).toEqual([]);
});

test('Anatomy figures, sources, keyboard disclosures and progress work at narrow widths', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`/library/${id}`);
  for (const heading of ['Learning Objectives','Core Concepts','Guided Explanation','Visual Study Prompts','Worked Identification Example','Knowledge Check','Clinical and Applied Questions','Oral Examination Prompts','Summary Checklist','Sources and Further Reading'])
    await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
  const figures = page.locator('[data-anatomy-diagram]:visible');
  await expect(figures).toHaveCount(5);
  for (const figure of await figures.all()) {
    await expect(figure.locator('figcaption')).toContainText('Observe and explain:');
    await expect(figure.locator('figcaption')).toContainText('Original teaching schematic');
    await expect(figure.locator('figcaption')).toContainText('Not to scale');
    await expect(figure.locator('figcaption a')).toHaveAttribute('href', /^https:\/\/openstax.org\//);
    for (const svg of await figure.getByRole('img').all()) expect((await svg.getAttribute('aria-label'))!.length).toBeGreaterThan(60);
  }
  const refs = references[id];
  for (const ref of [refs, ...refs.supportingReferences]) await expect(page.locator('#lesson-source:visible').getByRole('link', { name: ref.title, exact: false })).toHaveAttribute('href', ref.url);
  const explanation = page.locator('.concept-explanations:visible details').first();
  await explanation.locator('summary').focus(); await page.keyboard.press('Enter');
  await expect(explanation).not.toHaveAttribute('open', '');
  await page.keyboard.press('Space'); await expect(explanation).toHaveAttribute('open', '');
  const model = page.locator('section[aria-labelledby="worked-example-heading"]:visible');
  await expect(model.locator('ol')).toBeHidden();
  await model.locator('summary').focus(); await page.keyboard.press('Enter');
  await expect(model.locator('ol')).toBeVisible();
  const oral = page.locator('.concept-recall:visible');
  await expect(oral.locator('details').first().locator('p')).toBeHidden();
  await oral.getByLabel('My oral examination notes', { exact: true }).fill('Establish the viewing direction before assigning a side.');
  const checks = page.locator('section[aria-labelledby="summary-checklist-title"]:visible input[type="checkbox"]');
  await expect(checks).toHaveCount(7); await checks.first().focus(); await page.keyboard.press('Space');
  await page.reload(); await expect(checks.first()).toBeChecked();
  await expect(oral.getByLabel('My oral examination notes', { exact: true })).toHaveValue('Establish the viewing direction before assigning a side.');
  await page.setViewportSize({ width: 320, height: 800 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await page.locator('article:visible').innerText()).not.toMatch(/retrieval|oral recall/i);
});

test('Anatomy text remains sufficient without diagrams and revision includes the complete foundation', async ({ page }) => {
  await page.goto(`/library/${id}`);
  await page.addStyleTag({ content: '[data-anatomy-diagram] svg { display: none !important; }' });
  await expect(page.locator('[data-anatomy-diagram="serous-space"]:visible')).toContainText('potential space is exaggerated');
  await expect(page.getByRole('heading', { name: 'Knowledge Check', exact: true })).toBeVisible();
  await page.goto('/study/anatomy/revision');
  const foundation = page.locator('.revision-lesson:visible').filter({ has: page.getByRole('heading', { name: title, exact: true }) });
  await expect(foundation).toContainText('No previous Anatomy lesson is required');
  await expect(foundation).toContainText('Summary Checklist');
  await expect(foundation).toContainText('Oral Examination Prompts');
  await expect(foundation).toContainText('between the right visceral and parietal pleura');
  expect(await foundation.innerText()).not.toMatch(/retrieval|oral recall/i);
});

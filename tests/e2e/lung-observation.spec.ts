import { showAllPractice, compareAnatomyModels } from "./helpers/practice-view";
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import data from '../../src/content/library-lessons.json';
import studio from '../../src/content/study-questions.json';
import references from '../../src/content/lesson-references.json';
import anatomy from '../../src/content/anatomy-course.json';

const id = 'thoracic-development';
const lesson = data.lessons.find(l => l.id === id)!;
const added = studio.questions.filter(q => q.id.startsWith('studio-lung-'));
const record = anatomy.records.find(r => r.lessonId === id)!;
const refs = references[id];

test('lung-observation: histology guide, source map and search reach the same expanded lesson', async ({ page }) => {
  await page.goto('/subjects/histology');
  await page.getByRole('link', { name: 'Open subject lessons', exact: true }).click();
  await page.getByRole('link', { name: 'Guide parts and visuals', exact: true }).click();
  const part = page.locator('#histology-part-07');
  await expect(part.getByRole('heading', { name: 'Related learning', exact: true })).toBeVisible();
  await part.getByRole('link', { name: lesson.title, exact: true }).click();
  await expect(page).toHaveURL('/library/' + id);
  await expect(page.locator('.concept-sequence > details')).toHaveCount(12);
  await page.getByRole('navigation', { name: 'Anatomy volume navigation' }).getByRole('link', { name: 'Volume contents', exact: true }).click();
  await expect(page).toHaveURL(/\/study\/anatomy\/guide#anatomy-volume-1$/);
  await page.goto('/study/map');
  await page.getByRole('combobox', { name: 'Subject', exact: true }).selectOption('histology');
  await page.getByRole('searchbox', { name: 'Find a topic' }).fill('Fetal lung structure: observations and inference');
  const row = page.locator('.study-map-topics li').filter({ hasText: 'Fetal lung structure: observations and inference' });
  await expect(row).toContainText('Introduction available');
  await row.locator('a[href="/library/' + id + '"]').click();
  await expect(page).toHaveURL('/library/' + id);
  await page.goBack();
  await page.getByRole('searchbox', { name: 'Find a topic' }).fill('Alveoli and the blood–air interface');
  const planned = page.locator('.study-map-topics li').filter({ hasText: 'Alveoli and the blood–air interface' });
  await expect(planned).toContainText('Planned');
  await expect(planned.locator('a')).toHaveCount(0);
  await page.goto('/library?subject=anatomy');
  await page.getByRole('searchbox').fill('traced airway');
  const card = page.locator('.resource-card:visible');
  await expect(card).toHaveCount(1);
  await card.getByRole('link', { name: 'Read lesson', exact: true }).click();
  await expect(page).toHaveURL('/library/' + id);
});

test('lung-observation: direct fragments select each explained task and restore independent answers', async ({ page }) => {
  for (const app of added) {
    await page.goto(app.href);
    const q = page.locator('#question-' + app.id);
    await expect(q).toBeVisible();
    await expect(page.getByRole('heading', { name: /^Knowledge Check: question / })).toBeFocused();
    const wrong = (app.answer! + 1) % app.options!.length;
    await showAllPractice(page);await q.getByRole('radio', { name: app.options![wrong].text, exact: true }).check();
    await q.getByRole('button', { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
    await expect(q).toContainText(app.options![wrong].explanation!);
    await q.getByRole('button', { name: 'Try without feedback', exact: true }).click();
    await showAllPractice(page);await q.getByRole('radio', { name: app.options![app.answer!].text, exact: true }).check();
    await q.getByRole('button', { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
    await expect(q).toContainText(app.options![app.answer!].explanation!);
  }
  await page.reload();await showAllPractice(page);
  await showAllPractice(page);
  await expect(page.locator('.practice-question:visible:has(input[type=radio])')).toHaveCount(5);
  for (const app of added) await expect(page.locator('#question-' + app.id).getByRole('radio', { name: app.options![app.answer!].text, exact: true })).toBeChecked();
});

test('lung-observation: original anatomy history, worked reasoning and four core tasks survive', async ({ page }) => {
  await page.addInitScript(() => {
    if (localStorage.getItem('wardhan-learning:v1')) return;
    localStorage.setItem('wardhan-learning:v1', JSON.stringify({ version: 2, lessons: [], answers: { 'concept-thoracic-development': { attempts: 2, correct: 1, lastCorrect: false, streak: 0, dueAt: 0, firstCorrect: false, lastAt: 1000, lastChoice: 1, assisted: true } }, drafts: {}, visits: [], quizzes: 2, shares: 0, oral: [], plan: null, resume: null, journey: {} }));
  });
  await page.goto('/library/' + id);
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('wardhan-learning:v1')!).answers['concept-thoracic-development']);
  await showAllPractice(page);
  await expect(page.locator('#question-concept-' + id).getByRole('radio', { name: lesson.question.options[1].text, exact: true })).toBeChecked();
  const worked = page.locator('section[aria-labelledby="worked-example-heading"]');
  await worked.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(worked).toContainText(lesson.workedExample!.solution[0]);
  const sequence = page.getByRole('region', { name: 'Anatomical reasoning sequence', exact: true });
  await expect(sequence.locator('.practice-question')).toHaveCount(4);
  for (const q of record.practice) {
    const item = sequence.locator('#question-' + q.id);
    await item.getByRole('textbox', { name: 'Your explanation', exact: true }).fill('My anatomical reasoning before comparing.');
    await item.getByRole('button', { name: 'Check Answer and Continue →', exact: true }).click();
    await expect(item.locator('[data-feedback]')).toContainText(q.answer);
  }
  await expect(page.locator('.anatomy-identification')).toContainText(record.identification.prompt);
  const app = added[1];
  await page.goto(app.href);
  const q = page.locator('#question-' + app.id);
  await showAllPractice(page);await q.getByRole('radio', { name: app.options![app.answer!].text, exact: true }).check();
  await q.getByRole('button', { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('wardhan-learning:v1')!).answers['concept-thoracic-development'])).toEqual(before);
});

test('lung-observation: comparison, oral responses and saved checks work with keyboard and enlarged text', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/library/' + id);
  const fig = page.locator('#visual-lung-observation-units');
  await expect(fig.locator('tbody tr')).toHaveCount(4);
  await expect(fig.locator('a[href="https://pubmed.ncbi.nlm.nih.gov/41484334/"]')).toHaveCount(1);
  await fig.locator('summary').focus();
  await page.keyboard.press('Enter');
  await expect(fig.locator('.visual-description p')).toBeVisible();
  const oral = page.locator('section[aria-labelledby="oral-recall-title"]');
  await expect(oral.locator('details')).toHaveCount(7);
  for (const summary of await oral.locator('summary').all()) await summary.click();
  for (const item of lesson.oralExamination!) await expect(oral).toContainText(item.answer);
  for (const item of lesson.summaryChecklist!) await expect(page.getByRole('checkbox', { name: item, exact: true })).toBeVisible();
  const check = page.getByRole('checkbox', { name: lesson.summaryChecklist![0], exact: true });
  await check.check();
  await page.reload();await showAllPractice(page);
  await expect(check).toBeChecked();
  await check.uncheck();
  await showAllPractice(page);
  await compareAnatomyModels(page);
  for (const summary of await oral.locator('summary').all()) await summary.click();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 320, height: 844 });
  await page.evaluate(() => document.documentElement.style.fontSize = '200%');
  await expect(fig.locator('.visual-comparison-mobile section')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(await fig.locator('.visual-comparison-mobile h4').evaluateAll(xs => xs.every(x => x.scrollWidth <= x.clientWidth))).toBe(true);
  await page.goto('/library/serine-one-carbon-donor-carrier-cofactor');
  await page.evaluate(() => document.documentElement.style.fontSize = '200%');
  const oldLabel = page.locator('#visual-serine-reaction-roles .visual-comparison-mobile section').nth(1).locator('h4');
  await expect(oldLabel).toContainText('Tetrahydrofolate');
  expect(await oldLabel.evaluate(x => x.scrollWidth <= x.clientWidth)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect(errors).toEqual([]);
});

test('lung-observation: print keeps one Volume I chapter with questions, answers and references', async ({ page }) => {
  await page.goto('/study/anatomy/revision');
  await page.getByRole('button', { name: 'Clear selection', exact: true }).click();
  await page.getByRole('checkbox', { name: '01. Volume I · Thorax', exact: true }).check();
  await expect(page.locator('.revision-lesson')).toHaveCount(18);
  const item = page.locator('.revision-lesson').filter({ has: page.getByRole('heading', { level: 3, name: lesson.title, exact: true }) });
  await expect(item).toHaveCount(1);
  await expect(item).toContainText('Work a second fictional observation account');
  await expect(item).toContainText('Keep a traditional map distinct from a lineage experiment');
  for (const app of added) await expect(item).toContainText(app.prompt);
  for (const ref of [refs, ...refs.supportingReferences]) await expect(item.locator('a[href="' + ref.url + '"]')).toHaveCount(ref.url === 'https://pubmed.ncbi.nlm.nih.gov/41484334/' ? 2 : 1);
  await page.getByRole('checkbox', { name: 'Include answer key', exact: true }).uncheck();
  await expect(page.locator('.revision-answers')).toHaveCount(0);
  await page.getByRole('checkbox', { name: 'Include answer key', exact: true }).check();
  const answer = page.locator('.revision-answers section').filter({ has: page.getByRole('heading', { level: 3, name: lesson.title, exact: true }) });
  for (const app of added) await expect(answer).toContainText(app.options![app.answer!].explanation!);
  for (const oral of lesson.oralExamination!) await expect(answer).toContainText(oral.answer);
  await page.goto('/study/histology/revision');
  await page.getByRole('button', { name: 'Clear selection', exact: true }).click();
  await page.getByRole('checkbox', { name: '07. Respiratory System', exact: true }).check();
  await expect(page.locator('.revision-lesson')).toHaveCount(1);
  await expect(page.locator('.revision-lesson').getByRole('heading', { level: 3, name: lesson.title, exact: true })).toHaveCount(0);
});

test('lung-observation: save/remove, empty-search recovery and source boundaries remain usable', async ({ page }) => {
  await page.goto('/library/' + id);
  const save = page.getByRole('button', { name: 'Save to My Study: ' + lesson.title, exact: true });
  await save.click();
  await page.reload();await showAllPractice(page);
  const saved = page.getByRole('button', { name: 'Saved to My Study: ' + lesson.title + ' (remove from saved resources)', exact: true });
  await expect(saved).toHaveAttribute('aria-pressed', 'true');
  await saved.click();
  await page.reload();await showAllPractice(page);
  await expect(save).toBeVisible();
  for (const ref of [refs, ...refs.supportingReferences]) await expect(page.locator('#lesson-source a[href="' + ref.url + '"]')).toHaveCount(1);
  await expect(page.locator('main a[href*="dropbox"]')).toHaveCount(0);
  await expect(page.locator('main a[download]')).toHaveCount(0);
  await expect(page.locator('.concept-sequence img')).toHaveCount(0);
  for (const path of ['/review', '/.private/candidate-lessons.json', '/.env', '/library/human-lung-development-structure']) expect((await page.request.get(path)).status()).toBe(404);
  await page.goto('/library?subject=anatomy');
  await page.getByRole('searchbox').fill('no-lung-resource-987654');
  await expect(page.locator('.catalog-empty').getByRole('heading', { name: 'No matching resources.', exact: true })).toBeVisible();
  await page.locator('.catalog-empty').getByRole('button', { name: 'Clear filters', exact: true }).click();
  await expect(page.locator('.resource-card:visible').first()).toBeVisible();
  await expect(page.getByRole('searchbox')).toBeFocused();
});

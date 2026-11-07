import { showAllPractice } from "./helpers/practice-view";
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import path from '../../src/content/histology-guided-path.json';
import { practiceItems } from '../../src/content/practice-registry';

const route = `/library/${path.lessonId}`;
const panelSelector = 'section[aria-labelledby="histology-guided-path-title"]';

test('Guided histology: all canonical questions open in context and return to the path', async ({ page }) => {
  test.setTimeout(180000);
  for (const stage of path.stages) {
    for (const id of stage.questionIds) {
      await page.goto(`${route}#histology-path-${stage.id}`);
      const group = page.locator(`#histology-path-${stage.id}`);
      await group.locator('summary').click();
      const item = practiceItems.find(q => q.id === id)!;
      const link = group.getByRole('link', { name: item.prompt, exact: true });
      await link.click();
      await expect(page).toHaveURL(new RegExp(`/library/${item.topic}#question-${id}$`));
      await expect(page.locator(`#question-${id}`)).toBeVisible();
      await expect(page.locator(`#question-${id} legend`)).toHaveText(item.prompt);
      await expect(page.getByRole('link', { name: 'Return to the guided histology path', exact: true })).toBeVisible();
      await page.goBack();
      await expect(page.locator('#histology-guided-path-title')).toHaveText(path.title);
    }
  }
});

test('Guided histology: every explanation and visual link resolves to its labelled section', async ({ page }) => {
  for (const stage of path.stages) {
    for (const link of stage.links) {
      await page.goto(route);
      await page.locator(`#histology-path-${stage.id}`).getByRole('link', { name: link.label, exact: true }).click();
      await expect(page.locator(`#${link.href.split('#')[1]}`)).toBeVisible();
      await page.getByRole('link', { name: 'Return to the guided histology path', exact: true }).click();
      await expect(page.locator('#histology-guided-path-title')).toBeVisible();
    }
  }
});

test('Guided histology: canonical feedback and existing progress survive the round trip', async ({ page }) => {
  for (const stage of path.stages) {
    const id = stage.questionIds[0];
    const item = practiceItems.find(q => q.id === id)!;
    await page.goto(route);
    const group = page.locator(`#histology-path-${stage.id}`);
    await group.locator('summary').click();
    await group.getByRole('link', { name: item.prompt, exact: true }).click();
    const question = page.locator(`#question-${id}`);
    const wrong = (item.answer! + 1) % item.options!.length;
    await showAllPractice(page);await question.getByRole('radio', { name: item.options![wrong].text, exact: true }).check();
    await question.getByRole('button', { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
    await expect(question).toContainText(item.options![wrong].explanation);
    await question.getByRole('button', { name: 'Try without feedback', exact: true }).click();
    await showAllPractice(page);await question.getByRole('radio', { name: item.options![item.answer!].text, exact: true }).check();
    await question.getByRole('button', { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
    await expect(question).toContainText(item.options![item.answer!].explanation);
    await page.getByRole('link', { name: 'Return to the guided histology path', exact: true }).click();
    await expect(page.locator('#histology-guided-path-title')).toBeVisible();
    await page.goto(`/library/${item.topic}#question-${id}`);
    await expect(question.getByRole('radio', { name: item.options![item.answer!].text, exact: true })).toBeChecked();
  }
});

test('Guided histology: keyboard reasoning reveals, citations and existing notes work', async ({ page }) => {
  const sent: string[] = [];
  page.on('request', r => { if (r.url().includes('assay-reasoning-note') || r.postData()?.includes('assay-reasoning-note')) sent.push(r.url()); });
  await page.goto(route);
  await page.getByRole('link', { name: 'Go deeper: guided path', exact: true }).click();
  const panel = page.locator(panelSelector);
  await expect(panel).toContainText('24 existing practice questions');
  for (const prompt of path.researchCase.prompts) {
    const disclosure = panel.getByText(`Compare your reasoning: ${prompt.title.slice(3)}`, { exact: true });
    await disclosure.focus(); await page.keyboard.press('Enter');
    const details = disclosure.locator('..');
    await expect(details).toHaveAttribute('open', '');
    await expect(details).toContainText(prompt.reasoning);
    for (const id of prompt.referenceIds) {
      const ref = path.researchCase.references.find(r => r.id === id)!;
      await expect(details.getByRole('link', { name: ref.title, exact: true })).toHaveAttribute('href', ref.url);
    }
  }
  await panel.getByRole('link', { name: 'Write your explanation in your lesson notes', exact: true }).click();
  const notes = page.locator('#oral-histology-foundations-tissues');
  await notes.fill('assay-reasoning-note: test specificity in the actual application.');
  await page.reload();await showAllPractice(page);
  await expect(notes).toHaveValue('assay-reasoning-note: test specificity in the actual application.');
  expect(sent).toEqual([]);
});

test('Guided histology: 320px enlarged text, keyboard focus and accessibility', async ({ page, browser, baseURL }, info) => {
  const context = await browser.newContext({ baseURL });
  const audit = await context.newPage(); await audit.goto(route);
  const review = audit.locator('.lesson-transparency');
  await review.locator('summary').click();
  await expect(review).toContainText('Medical review pending. Independent clinical review has not been completed.');
  await expect(review.getByText('Last updated:', { exact: false }).last()).toContainText('Last updated: 2026-11-07');
  await expect(review.getByRole('link', { name: 'Edfors et al. (2018): Enhanced validation of antibodies for research applications', exact: true })).toHaveAttribute('href', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6175901/');
  expect((await new AxeBuilder({ page: audit }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await context.close();
  await page.setViewportSize({ width: 320, height: 900 }); await page.goto(route);
  await page.addStyleTag({ content: 'html { font-size: 200% !important; }' });
  await page.locator('.lesson-transparency summary').focus();
  await page.keyboard.press('Enter');
  expect(await page.locator('.lesson-transparency').evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBeTruthy();
  const panel = page.locator(panelSelector);
  for (const summary of await panel.locator('summary').all()) {
    await summary.focus();
    expect(await summary.evaluate(el => getComputedStyle(el).outlineStyle)).not.toBe('none');
    await page.keyboard.press('Enter');
  }
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBeTruthy();
  for (const id of path.stages.map(s => `histology-path-${s.id}`)) {
    const stage = page.locator(`#${id}`);
    expect(await stage.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBeTruthy();
  }
  await page.locator('#histology-path-preparation').screenshot({ path: info.outputPath('guided-path-320-enlarged.png') });
});

test('Guided histology: no-JavaScript retains stages, question routes and research explanations', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const page = await context.newPage(); await page.goto(route);
  const panel = page.locator(panelSelector);
  for (const summary of await panel.locator('summary').all()) await summary.click();
  await expect(panel.locator('a[href*="#question-"]')).toHaveCount(24);
  for (const prompt of path.researchCase.prompts) await expect(panel.getByText(prompt.reasoning, { exact: true })).toBeVisible();
  await expect(panel).toContainText('does not automatically grade');
  await context.close();
});

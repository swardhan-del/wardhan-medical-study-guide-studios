import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import teaching from '../../src/content/library-lessons.json';
import practice from '../../src/content/transfer-practice.json';
import specimens from '../../src/content/female-practical-specimens.json';
import guides from '../../src/content/printable-guides.json';

const route = '/library/female-tract-histology-and-development';
const lesson = teaching.lessons.find(l => l.id === 'female-tract-histology-and-development')!;
const examples = [
  {
    "scope": "female-proliferative",
    "data": specimens[0],
    "asset": "endometrium-proliferative-he",
    "width": 2848,
    "sha": "439dad24c1cedf4c12f155e8b8a5ee6c67e93adec8ce4b33ff4f6183ac90ded8",
    "license": "CC BY-SA 3.0 terms"
  },
  {
    "scope": "female-secretory",
    "data": specimens[1],
    "asset": "endometrium-secretory-he",
    "width": 2848,
    "sha": "30aa2781600ad7d1e4ff53f64b97f4515496a47049c05ffb742833eb20263c24",
    "license": "CC BY-SA 3.0 terms"
  },
  {
    "scope": "female-tubal-wall",
    "data": specimens[2],
    "asset": "tubal-folded-wall",
    "width": 1527,
    "sha": "546484541d06bb2e876514b7c26b1fa9890cceca4bcadf6aa86055986b9d2a97",
    "license": "CC BY 2.0 terms"
  },
  {
    "scope": "female-tubal-epithelium",
    "data": specimens[3],
    "asset": "tubal-ciliated-border",
    "width": 1219,
    "sha": "ccb366ec358d54f08251df655fcd39597302ae4d72952fc5d6535d38855e16c6",
    "license": "CC0 1.0 terms"
  }
];

test('Female practical: explanations retain sources and specimen context', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', e => errors.push(e.message));
  expect((await page.goto(route))?.status()).toBe(200);
  const sections = page.locator('.concept-sequence > details');
  await expect(sections).toHaveCount(19);
  for (const [i, s] of lesson.steps.entries()) {
    expect(await sections.nth(i).locator(':scope > p').allTextContents()).toEqual(s.body.split('\n\n'));
    expect(await sections.nth(i).locator('a[href^="https://"]').count()).toBeGreaterThan(0);
  }
  await expect(page.locator('main')).toContainText('The four practical photographs in this lesson are not paired PAS/diastase preparations');
  await expect(page.locator('main')).toContainText('separate source-labelled secretory specimen');
  expect(await page.locator('main').innerText()).not.toMatch(/\/Users\/|rlkey=|Library\/CloudStorage/);
  expect(await page.locator('main a[href*="dropbox"]').count()).toBe(0);
  expect(errors).toEqual([]);
});

test('Female practical: independent specimen controls, keyboard and temporary answers', async ({ page }, info) => {
  const sent: string[] = []; page.on('request', r => { if (r.url().includes('temporary-female-response') || r.postData()?.includes('temporary-female-response')) sent.push(r.url()); });
  await page.goto(route);
  for (const e of examples) {
    const panel = page.locator(`section[aria-labelledby="${e.scope}-specimen-title"]`);
    await panel.scrollIntoViewIfNeeded();
    await expect(panel.locator('img')).toHaveAttribute('loading', 'lazy');
    await expect.poll(() => panel.locator('img').evaluate(n => (n as HTMLImageElement).naturalWidth)).toBe(e.width);
    for (const [i, region] of e.data.regions.entries()) {
      const button = panel.getByRole('button', { name: `${i + 1}. ${region.label}`, exact: true });
      await button.focus(); await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      await expect(page.locator(`#${e.scope}-region-description`)).toContainText(region.observation);
    }
    await panel.getByRole('button', { name: 'Hide region markers', exact: true }).click();
    await expect(panel.locator('[class*="markers"]')).toHaveCount(0);
    await panel.getByRole('button', { name: 'Show region markers', exact: true }).click();
    await panel.locator('textarea').fill(`temporary-female-response-${e.scope}`);
    await panel.getByRole('button', { name: 'Compare with model reasoning', exact: true }).click();
    await expect(panel.getByRole('status')).toContainText(e.data.model);
    await panel.screenshot({ path: info.outputPath(`${e.scope}.png`) });
  }
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('temporary-female-response');
  expect(sent).toEqual([]);
  const first = page.locator('#female-proliferative-specimen-response');
  await page.locator('section[aria-labelledby="female-proliferative-specimen-title"]').getByRole('button', { name: 'Clear my response', exact: true }).click();
  await expect(first).toHaveValue('');
  await expect(page.locator('#female-secretory-specimen-response')).not.toHaveValue('');
  await page.reload();
  for (const e of examples) await expect(page.locator(`#${e.scope}-specimen-response`)).toHaveValue('');
});

test('Female practical: development stages expose usable explanations without JavaScript', async ({ page, browser, baseURL }) => {
  await page.goto(route); await page.getByRole('link', { name: 'Development map', exact: true }).click();
  const map = page.locator('section[aria-labelledby="endocrine-development-title"]');
  await expect(map.locator('details')).toHaveCount(6);
  for (const item of await map.locator('details').all()) {
    await item.locator('summary').focus(); await page.keyboard.press('Enter');
    await expect(item).toHaveAttribute('open', ''); await expect(item.locator('p').last()).toBeVisible();
  }
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const plain = await context.newPage(); await plain.goto(route);
  for (const e of examples) {
    const panel = plain.locator(`section[aria-labelledby="${e.scope}-specimen-title"]`);
    await panel.getByText('Read all four region explanations', { exact: true }).click();
    for (const r of e.data.regions) await expect(panel.getByText(r.interpretation, { exact: true }).last()).toBeVisible();
  }
  const stage = plain.locator('section[aria-labelledby="endocrine-development-title"] details').last();
  await stage.locator('summary').click(); await expect(stage.locator('p').last()).toContainText('Gland secretion, stromal response, muscular activity and ciliary transport are different outcomes');
  await context.close();
});

test('Female practical: every applied option gives feedback and answers persist', async ({ page }) => {
  test.setTimeout(180000); await page.goto(route);
  await page.getByRole('button', { name: 'Show all questions', exact: true }).click();
  const questions = practice.questions.filter(q => q.topic === 'female-tract-histology-and-development');
  expect(questions).toHaveLength(30);
  for (const q of questions) {
    const block = page.locator(`#question-${q.id}`);
    for (const [i, option] of q.options.entries()) {
      if (i === q.answer) continue;
      await block.getByRole('radio', { name: option.text, exact: true }).check();
      await block.getByRole('button', { name: 'Check answer', exact: true }).click();
      await expect(block).toContainText(option.explanation);
      await block.getByRole('button', { name: 'Try without feedback', exact: true }).click();
    }
    await block.getByRole('radio', { name: q.options[q.answer].text, exact: true }).check();
    await block.getByRole('button', { name: 'Check answer', exact: true }).click();
    await expect(block).toContainText(q.options[q.answer].explanation);
  }
  await page.reload(); await page.getByRole('button', { name: 'Show all questions', exact: true }).click();
  for (const q of questions) await expect(page.locator(`#question-${q.id}`).getByRole('radio', { name: q.options[q.answer].text, exact: true })).toBeChecked();
});

test('Female practical: credited downloads match all four audited image files', async ({ page, request }) => {
  await page.goto(route);
  for (const e of examples) {
    const response = await request.get(`/images/figures/${e.asset}.jpg`);
    expect(response.status()).toBe(200); expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(e.sha);
    const panel = page.locator(`section[aria-labelledby="${e.scope}-specimen-title"]`);
    await expect(panel.getByRole('link', { name: e.license, exact: true })).toBeVisible();
    const pending = page.waitForEvent('download');
    await panel.getByRole('link', { name: 'Download credited specimen image', exact: true }).click();
    const download = await pending; const stream = await download.createReadStream(); const chunks: Buffer[] = [];
    for await (const chunk of stream!) chunks.push(chunk);
    expect(createHash('sha256').update(Buffer.concat(chunks)).digest('hex')).toBe(e.sha);
  }
});

test('Female practical: accessibility, 320px text enlargement and image failure', async ({ page, browser, baseURL }, info) => {
  const context = await browser.newContext({ baseURL }); const audit = await context.newPage(); await audit.goto(route);
  expect((await new AxeBuilder({ page: audit }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  await context.close(); await page.goto(route); await page.setViewportSize({ width: 320, height: 900 });
  await page.addStyleTag({ content: 'html{font-size:200% !important}' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  for (const e of examples) {
    const panel = page.locator(`section[aria-labelledby="${e.scope}-specimen-title"]`);
    expect(await panel.evaluate(n => n.scrollWidth <= n.clientWidth + 1)).toBe(true);
    await panel.scrollIntoViewIfNeeded(); await page.screenshot({ path: info.outputPath(`${e.scope}-320-enlarged.png`) });
  }
  for (const e of examples) await page.route(`**/${e.asset}.jpg`, r => r.abort());
  await page.reload();
  for (const e of examples) {const panel=page.locator(`section[aria-labelledby="${e.scope}-specimen-title"]`);await panel.scrollIntoViewIfNeeded();await expect(panel.getByRole('status')).toContainText('specimen image could not load');}
});

test('Female practical: discover, save, return and print in its single course home', async ({ page }) => {
  await page.goto('/library?subject=histology'); await page.getByRole('searchbox').fill('female reproductive tract');
  const card = page.locator('.resource-card:visible').filter({ has: page.locator(`a[href="${route}"]`) });
  await expect(card).toHaveCount(1); await card.getByRole('link', { name: 'Read lesson', exact: true }).click();
  await expect(page.locator('h1')).toHaveText(lesson.title);
  const save = page.getByRole('button', { name: `Save to My Study: ${lesson.title}`, exact: true });
  await save.click(); await page.reload();
  await page.getByRole('button', { name: `Saved to My Study: ${lesson.title} (remove from saved resources)`, exact: true }).click();
  await expect(save).toBeVisible();
  await page.getByRole('navigation', { name: 'Breadcrumb' }).locator('a[href="/subjects/histology"]').click();
  await expect(page).toHaveURL(/\/subjects\/histology$/);
  await page.goto('/study/histology/revision'); await page.getByRole('button', { name: 'Clear selection', exact: true }).click();
  await page.getByRole('checkbox', { name: /Female Reproductive System Placenta and Mammary Gland/ }).check();
  const part = guides.parts.find(item => item.id === 'histology-part-12')!;
  expect(part.lessonIds).toEqual(['female-tract-histology-and-development', 'placenta', 'mammary-histology-and-development']);
  await expect(page.locator('.revision-lesson')).toHaveCount(part.lessonIds.length);
  await expect(page.locator('.revision-lesson').filter({ hasText: lesson.title })).toHaveCount(1);
  await page.emulateMedia({ media: 'print' });
  await expect(page.locator('.guide-selector')).toBeHidden();
  for (const e of examples) {
    const image = page.locator(`img[src="/images/figures/${e.asset}.jpg"]`);
    await expect(image).toHaveCount(1); await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate(n => (n as HTMLImageElement).naturalWidth)).toBe(e.width);
    await expect(image).toBeVisible();
  }
});

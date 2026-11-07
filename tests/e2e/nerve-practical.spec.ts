import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHash } from 'node:crypto';
import teaching from '../../src/content/library-lessons.json';
import practice from '../../src/content/transfer-practice.json';
import specimens from '../../src/content/nerve-practical-specimens.json';

const route = '/library/myelin-and-glial-cells';
const lesson = teaching.lessons.find(l => l.id === 'myelin-and-glial-cells')!;
const questions = practice.questions.filter(q => q.id.startsWith('nerve-practical-'));
const hashes = [
  '9cf6971c85f46001e7bf56e4a5d7f5b46ce774d2da045ddd0e5037b080852615',
  '385391d019395d8b653ce1d0489cf982b27f8dc0fcfbf588800394755b281ddc',
  '5687d93a57863b5d0620a6c82124be0df684f557484cf5fb3ad8ee03db964cf4',
];

test('Nerve practical: explanations and source links retain the existing ganglion teaching', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  expect((await page.goto(route))?.status()).toBe(200);
  const sections = page.locator('.concept-sequence > details'); await expect(sections).toHaveCount(17);
  for (const [index, step] of lesson.steps.entries()) {
    await expect(sections.nth(index)).toContainText(step.body);
    if ('highlight' in step && typeof step.highlight === 'string') await expect(sections.nth(index).locator(':scope > .lesson-reasoning strong')).toHaveText(step.highlight!);
    expect(await sections.nth(index).locator('a[href^="https://"]').count()).toBeGreaterThan(0);
  }
  await expect(page.locator('#visual-ganglia-branch-and-relay')).toBeVisible();
  await expect(page.locator('main')).toContainText('A space is not a cellular sheath');
  await expect(page.locator('main')).toContainText('An axon in the PNS does not make its entire neuron neural-crest derived');
  await expect(page.locator('main a[href*="dropbox"]')).toHaveCount(0);
  expect(await page.locator('main').innerText()).not.toMatch(/\/Users\/|rlkey=|Library\/CloudStorage/);
  expect(errors).toEqual([]);
});

test('Nerve practical: all regions have independent keyboard controls and temporary responses', async ({ page }) => {
  const sent: string[] = []; page.on('request', r => { if (r.url().includes('temporary-nerve-response') || r.postData()?.includes('temporary-nerve-response')) sent.push(r.url()); });
  await page.goto(route);
  for (const entry of specimens) {
    const panel = page.locator(`section[aria-labelledby="${entry.scope}-specimen-title"]`);
    await panel.scrollIntoViewIfNeeded();
    await expect.poll(() => panel.locator('img').evaluate(node => (node as HTMLImageElement).naturalWidth)).toBe(1280);
    await expect(panel.locator('img')).toHaveAttribute('loading', 'lazy');
    await expect(panel.locator('[class*="openTarget"]')).toHaveCount(3);
    for (const [i, region] of entry.data.regions.entries()) {
      const button = panel.getByRole('button', { name: `${i + 1}. ${region.label}`, exact: true });
      await button.focus(); await page.keyboard.press('Enter'); await expect(button).toHaveAttribute('aria-pressed', 'true');
      const description = panel.locator(`#${entry.scope}-region-description`);
      for (const text of [region.observation, region.interpretation, region.limit]) await expect(description).toContainText(text);
    }
    await panel.getByRole('button', { name: 'Hide region markers', exact: true }).click(); await expect(panel.locator('[class*="markers"]')).toHaveCount(0);
    await panel.getByRole('button', { name: 'Show region markers', exact: true }).click(); await expect(panel.locator('[class*="openTarget"]')).toHaveCount(3);
    await panel.locator('textarea').fill(`temporary-nerve-response-${entry.scope}`);
    await panel.getByRole('button', { name: 'Compare with model reasoning', exact: true }).click(); await expect(panel.getByRole('status')).toContainText(entry.data.model);
  }
  expect(sent).toEqual([]); expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('temporary-nerve-response');
  const first = page.locator(`section[aria-labelledby="${specimens[0].scope}-specimen-title"]`);
  await first.getByRole('button', { name: 'Clear my response', exact: true }).click(); await expect(first.locator('textarea')).toHaveValue('');
  await expect(page.locator(`#${specimens[1].scope}-specimen-response`)).not.toHaveValue('');
  await page.reload(); for (const entry of specimens) await expect(page.locator(`#${entry.scope}-specimen-response`)).toHaveValue('');
});

// Give each student task the normal deadline while retaining all four choices
// and its reload check. One 32-choice scenario can exhaust the entire deadline.
for (const app of questions) test(`Nerve practical: ${app.id} explains every choice and persists`, async ({ page }) => {
  expect(questions).toHaveLength(8); await page.goto(route); await page.getByRole('button', { name: 'Show all questions', exact: true }).click();
  await expect(page.locator('.practice-question:visible')).toHaveCount(13);
  const q = page.locator('#question-' + app.id); await expect(q.getByRole('button', { name: 'Check answer', exact: true })).toBeDisabled();
  for (const [i, option] of app.options!.entries()) {
    await q.getByRole('radio', { name: option.text, exact: true }).check(); await q.getByRole('button', { name: 'Check answer', exact: true }).click();
    await expect(q.locator('[data-feedback]')).toHaveAttribute('data-feedback', i === app.answer ? 'correct' : 'incorrect');
    await expect(q).toContainText(option.explanation!); await q.getByRole('button', { name: 'Try without feedback', exact: true }).click();
  }
  await q.getByRole('radio', { name: app.options![app.answer!].text, exact: true }).check(); await q.getByRole('button', { name: 'Check answer', exact: true }).click();
  await page.reload(); await page.getByRole('button', { name: 'Show all questions', exact: true }).click();
  await expect(page.locator('#question-' + app.id).getByRole('radio', { name: app.options![app.answer!].text, exact: true })).toBeChecked();
});

test('Nerve practical: answers to all eight tasks persist together', async ({ page }) => {
  expect(questions).toHaveLength(8);
  await page.goto(route); await page.getByRole('button', { name: 'Show all questions', exact: true }).click();
  for (const app of questions) {
    const q = page.locator('#question-' + app.id);
    await q.getByRole('radio', { name: app.options![app.answer!].text, exact: true }).check();
    await q.getByRole('button', { name: 'Check answer', exact: true }).click();
    await expect(q.locator('[data-feedback]')).toHaveAttribute('data-feedback', 'correct');
  }
  await page.reload(); await page.getByRole('button', { name: 'Show all questions', exact: true }).click();
  for (const app of questions) {
    await expect(page.locator('#question-' + app.id).getByRole('radio', { name: app.options![app.answer!].text, exact: true })).toBeChecked();
  }
});

test('Nerve practical: exact credited images download once and retain their source bytes', async ({ page, request }) => {
  await page.goto(route);
  for (const [index, entry] of specimens.entries()) {
    const panel = page.locator(`section[aria-labelledby="${entry.scope}-specimen-title"]`), asset = `/images/figures/${entry.data.figureId}.jpg`;
    await expect(page.locator(`main img[src="${asset}"]`)).toHaveCount(1);
    await expect(panel.getByRole('link', { name: entry.licenseLabel, exact: true })).toHaveAttribute('href', 'https://creativecommons.org/publicdomain/zero/1.0/');
    const response = await request.get(asset); expect(response.status()).toBe(200); expect(createHash('sha256').update(await response.body()).digest('hex')).toBe(hashes[index]);
    const pending = page.waitForEvent('download'); await panel.getByRole('link', { name: 'Download credited specimen image', exact: true }).click();
    const download = await pending; expect(download.suggestedFilename()).toBe(`${entry.data.figureId}.jpg`); expect(await download.failure()).toBeNull();
  }
});

test('Nerve practical: full reading survives no JavaScript and failed images', async ({ browser, baseURL, page }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false }); const plain = await context.newPage(); await plain.goto(route);
  for (const entry of specimens) {
    const panel = plain.locator(`section[aria-labelledby="${entry.scope}-specimen-title"]`);
    await panel.getByText('Read all three region explanations', { exact: true }).click();
    for (const region of entry.data.regions) await expect(panel.getByText(region.interpretation, { exact: true }).last()).toBeVisible();
    await panel.getByText('Read the model without entering a response', { exact: true }).click(); await expect(panel.getByText(entry.data.model, { exact: true })).toBeVisible();
  }
  await context.close();
  for (const entry of specimens) await page.route(`**/${entry.data.figureId}.jpg`, request => request.abort());
  await page.goto(route); for (const entry of specimens) {const panel=page.locator(`section[aria-labelledby="${entry.scope}-specimen-title"]`);await panel.scrollIntoViewIfNeeded();await expect(panel.getByRole('status')).toContainText('specimen image could not load');await expect(panel.locator(`#${entry.scope}-region-description`)).toBeVisible();}
});

test('Nerve practical: enlarged-text labels stay inside images without collisions', async ({ browser, baseURL }, info) => {
  const context = await browser.newContext({ baseURL }); const page = await context.newPage(); await page.goto(route);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);
  await page.setViewportSize({ width: 320, height: 900 }); await page.addStyleTag({ content: 'html{font-size:200% !important}' });
  expect(await page.locator('body').evaluate(n => parseFloat(getComputedStyle(n).fontSize))).toBe(32);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
  for (const entry of specimens) {
    const panel = page.locator(`section[aria-labelledby="${entry.scope}-specimen-title"]`); await panel.scrollIntoViewIfNeeded();
    const descriptionWidth = await panel.locator(`#${entry.scope}-region-description p`).first().evaluate(n => n.getBoundingClientRect().width);
    expect(descriptionWidth).toBeGreaterThanOrEqual(220);
    const firstWordRects = await panel.locator('h2').evaluate(n => {const text=n.firstChild!;const range=document.createRange();range.setStart(text,0);range.setEnd(text,'Peripheral'.length);return range.getClientRects().length;});
    expect(firstWordRects).toBe(1);
    const frame = await panel.locator('[class*="imageFrame"]').boundingBox(); expect(frame).not.toBeNull();
    const labels = await panel.locator('[class*="targetLabel"]').all(); expect(labels).toHaveLength(3);
    const boxes = await Promise.all(labels.map(label => label.boundingBox()));
    for (const b of boxes) {expect(b).not.toBeNull();expect(b!.x).toBeGreaterThanOrEqual(frame!.x-1);expect(b!.y).toBeGreaterThanOrEqual(frame!.y-1);expect(b!.x+b!.width).toBeLessThanOrEqual(frame!.x+frame!.width+1);expect(b!.y+b!.height).toBeLessThanOrEqual(frame!.y+frame!.height+1);}
    for(let i=0;i<3;i++)for(let j=i+1;j<3;j++){const a=boxes[i]!,b=boxes[j]!;expect(a.x+a.width<=b.x||b.x+b.width<=a.x||a.y+a.height<=b.y||b.y+b.height<=a.y).toBe(true);}
    await panel.screenshot({ path: info.outputPath(`${entry.scope}-320-enlarged.png`) });
  }
  await context.close();
});

test('Nerve practical: existing lymph-node explorer keeps its solid numbered markers', async ({ page }) => {
  await page.goto('/library/lymphoid-organs'); const panel=page.locator('section[aria-labelledby="lymphoid-specimen-title"]');
  await expect(panel.locator('[class*="openTarget"]')).toHaveCount(0);await expect(panel.locator('[class*="markers"] > span')).toHaveCount(4);
  const marker=panel.locator('[class*="markers"] > span').first();expect(await marker.evaluate(n=>getComputedStyle(n).backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
  await panel.getByRole('button',{name:'Hide region markers',exact:true}).click();await expect(panel.locator('[class*="markers"]')).toHaveCount(0);
  await panel.getByRole('button',{name:'Show region markers',exact:true}).click();await expect(panel.locator('[class*="markers"] > span')).toHaveCount(4);
});

test('Nerve practical: review scope, research references and date remain readable', async ({ browser, baseURL }, info) => {
  const context = await browser.newContext({ baseURL });
  const page = await context.newPage(); await page.goto(route);
  const review = page.locator('.lesson-transparency'); await review.locator('summary').focus(); await page.keyboard.press('Enter');
  await expect(review).toContainText('Medical review pending. Independent clinical review has not been completed.');
  await expect(review).toContainText('Last updated: 2026-11-07');
  for (const href of ['https://pubmed.ncbi.nlm.nih.gov/16129398/','https://discovery.ucl.ac.uk/id/eprint/1364750/','https://pubmed.ncbi.nlm.nih.gov/39152112/']) await expect(review.locator(`a[href="${href}"]`)).toHaveCount(1);
  expect((await new AxeBuilder({ page }).include('.lesson-transparency').analyze()).violations).toEqual([]);
  await page.setViewportSize({width:320,height:900}); await page.addStyleTag({content:'html{font-size:200% !important}'});
  expect(await page.locator('body').evaluate(n=>parseFloat(getComputedStyle(n).fontSize))).toBe(32);
  expect(await review.evaluate(n=>n.scrollWidth<=n.clientWidth+1)).toBe(true);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await review.screenshot({path:info.outputPath('nerve-review-320-enlarged.png')});await context.close();
});

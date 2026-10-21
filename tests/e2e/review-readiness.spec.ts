import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import quality from '../../src/content/lesson-quality.json';

// Technical evidence only: these checks do not complete human review or clear gates.
const ids = ['fluid-and-membrane-transport', 'membrane-potentials', 'biophysics-action-potentials', 'synaptic-integration', 'muscle-contraction', 'connective-tissue', 'somatosensory-pathways', 'genetics-genome-foundations', 'blood-and-haemostasis'];
for (const id of ids) {
  test(`review readiness: ${id} whole-page accessibility and reading layout`, async ({ page }, info) => {
    test.setTimeout(90000);
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.emulateMedia({ reducedMotion: 'reduce' });
    expect((await page.goto(`/library/${id}`))?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    await expect(page.locator('html')).toHaveAttribute('lang', /^en/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);

    const about = page.locator('.lesson-transparency');
    await about.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(about).toHaveAttribute('open', '');
    await page.keyboard.press('Tab');
    await expect(about.getByRole('link', { name: 'Read sources and further reading', exact: true })).toBeFocused();
    await expect(about).toContainText('Independent clinical review has not been completed');
    const record = quality.records.find(record => record.lessonId === id)!;
    for (const objective of record.objectives) await expect(about).toContainText(objective);

    const question = page.locator('.practice-question:visible').first();
    const choices = question.getByRole('radio');
    await choices.first().focus();
    await page.keyboard.press('Space');
    await expect(choices.first()).toBeChecked();
    await page.keyboard.press('ArrowDown');
    await expect(choices.nth(1)).toBeChecked();
    await question.getByRole('button', { name: 'Check answer', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(question.getByRole('status')).toBeVisible();

    // Open every visual text equivalent using the keyboard, including legacy SVGs.
    for (const figure of await page.locator('[data-visual-standard]:visible').all()) {
      await expect(figure.locator('figcaption')).toBeVisible();
      const summary = figure.locator('.visual-description summary');
      await summary.focus();
      await page.keyboard.press('Enter');
      await expect(figure.locator('.visual-description')).toHaveAttribute('open', '');
      await expect(figure.locator('.visual-description p')).not.toBeEmpty();
      await expect(figure.locator('.visual-credit')).not.toBeEmpty();
      expect(await figure.locator('.visual-sources a').count()).toBeGreaterThan(0);
    }
    const normal = await new AxeBuilder({ page }).analyze();
    expect(normal.violations).toEqual([]);

    // 320 CSS px reflow + 200% root text size + WCAG text-spacing overrides.
    // This is not a claim of browser zoom or human assistive-technology testing.
    await page.setViewportSize({ width: 320, height: 844 });
    await page.addStyleTag({ content: `html { font-size: 200% !important; }
      p, li, dt, dd, label, summary, button, a, th, td, h1, h2, h3, h4 {
        line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important;
      } p { margin-bottom: 2em !important; }` });
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    const clipped = await page.locator('article p, article h1, article h2, article h3, article summary, article button').evaluateAll(nodes => nodes.filter(node => {
      const el = node as HTMLElement, style = getComputedStyle(el);
      return el.getClientRects().length && ['hidden', 'clip'].includes(style.overflowY) && el.scrollHeight > el.clientHeight + 1;
    }).map(node => node.textContent?.trim()));
    expect(clipped).toEqual([]);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await about.screenshot({ path: info.outputPath(`${id}-expanded-reading.png`) });
    const inventory = await page.locator('[data-visual-standard]:visible').evaluateAll(nodes => nodes.map(node => ({
      id: node.id, title: node.getAttribute('aria-label'),
      credit: node.querySelector('.visual-credit')?.textContent,
      sources: [...node.querySelectorAll('.visual-sources a')].map(a => (a as HTMLAnchorElement).href),
    })));
    await info.attach('technical-visual-inventory', { body: JSON.stringify(inventory, null, 2), contentType: 'application/json' });
    expect(errors).toEqual([]);
  });
}

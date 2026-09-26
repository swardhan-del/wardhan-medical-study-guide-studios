import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function mockLive(page: Page) {
  await page.route('**/api/waitlist', route => route.request().method() === 'GET'
    ? route.fulfill({ json: { mode: 'live', siteKey: 'test-public-key' } }) : route.fallback());
  // Mock only the widget boundary: never make a real spam-provider request in tests.
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => route.fulfill({ contentType: 'text/javascript', body: `window.turnstile={render:(el,options)=>{const b=document.createElement('button');b.type='button';b.textContent='Complete test spam check';b.onclick=()=>options.callback('test-token');el.append(b);return 'test-widget'},remove:()=>{}};` }));
}
async function fillLive(page: Page) {
  await page.getByLabel('Email address (required)', { exact: true }).fill('student@example.com');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Start spam-protection check' }).click();
  await page.getByRole('button', { name: 'Complete test spam check' }).click();
}

test('demo validates with keyboard focus, transmits no address and saves nothing', async ({ page }) => {
  const posts: string[] = [], thirdParty: string[] = [];
  page.on('request', r => { if (r.method() === 'POST') posts.push(r.url()); if (/cloudflare|brevo|insights/.test(r.url())) thirdParty.push(r.url()); });
  await page.goto('/waitlist');
  const email = page.getByLabel('Example email address (required)', { exact: true });
  await expect(email).toBeVisible();
  await expect(page.getByText('Signups are not open yet.', { exact: false })).toBeVisible();
  const submit = page.getByRole('button', { name: 'Try demo — no signup' });
  await submit.focus(); await page.keyboard.press('Enter');
  await expect(email).toBeFocused(); await expect(email).toHaveAttribute('aria-invalid', 'true');
  await email.fill('student@private.test'); await submit.click();
  await expect(page.getByText('For this demo, use an example address', { exact: false })).toBeVisible();
  await email.fill('student@example.com'); await submit.click();
  await expect(page.getByRole('checkbox')).toBeFocused();
  await page.keyboard.press('Space'); await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'waitlist privacy notice' })).toBeFocused();
  await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
  await expect(submit).toBeFocused(); await page.keyboard.press('Enter');
  await expect(page.getByRole('status').filter({ hasText: 'Demo complete.' })).toBeFocused();
  await expect(page.getByText('No address was transmitted or saved', { exact: false })).toBeVisible();
  expect(posts).toEqual([]); expect(thirdParty).toEqual([]);
  expect(await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }))).not.toContain('student@');
  await page.reload(); await expect(email).toHaveValue('');
});

test('live pending state requires a spam check and blocks duplicate submission', async ({ page }) => {
  await mockLive(page);
  let postCount = 0, release: () => void = () => {};
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/api/waitlist', async route => {
    if (route.request().method() !== 'POST') return route.fallback();
    postCount++;
    expect(route.request().postDataJSON()).toMatchObject({ email: 'student@example.com', consent: true, token: 'test-token', website: '' });
    await gate; await route.fulfill({ status: 202, json: { status: 'pending' } });
  });
  await page.goto('/waitlist'); await fillLive(page);
  const submit = page.getByRole('button', { name: 'Request confirmation email' });
  await submit.click();
  await expect(page.getByRole('button', { name: 'Requesting confirmation…' })).toBeDisabled();
  expect(postCount).toBe(1); release();
  await expect(page.getByRole('status').filter({ hasText: 'Confirmation requested.' })).toBeFocused();
  await expect(page.getByText('You join only after confirming', { exact: false })).toBeVisible();
  expect(await page.evaluate(() => localStorage.getItem('wardhan-analytics-optout'))).toBeNull();
});

test('live provider failure and network loss are honest and allow retry', async ({ page }) => {
  await mockLive(page);
  let attempts = 0;
  await page.route('**/api/waitlist', async route => {
    if (route.request().method() !== 'POST') return route.fallback();
    attempts++;
    if (attempts === 1) return route.fulfill({ status: 503, json: { status: 'error', message: 'private provider detail' } });
    if (attempts === 2) return route.abort();
    return route.fulfill({ status: 202, json: { status: 'pending' } });
  });
  await page.goto('/waitlist'); await fillLive(page);
  await page.getByRole('button', { name: 'Request confirmation email' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('could not confirm');
  await expect(page.getByRole('main').getByRole('alert')).toBeFocused();
  await expect(page.getByText('private provider detail')).toHaveCount(0);
  await fillLive(page); await page.getByRole('button', { name: 'Request confirmation email' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('connection failed');
  await fillLive(page); await page.getByRole('button', { name: 'Request confirmation email' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Confirmation requested.' })).toBeVisible();
  expect(attempts).toBe(3);
});

test('unavailable configuration and blocked spam scripts fail accessibly without submission', async ({ page }) => {
  await page.route('**/api/waitlist', route => route.abort());
  await page.goto('/waitlist');
  await expect(page.getByRole('status').filter({ hasText: 'temporarily unavailable' })).toBeVisible();
  await expect(page.getByRole('textbox')).toHaveCount(0);
  await page.unroute('**/api/waitlist'); await mockLive(page);
  await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => route.abort());
  await page.reload();
  await page.getByLabel('Email address (required)', { exact: true }).fill('student@example.com');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Request confirmation email' }).click();
  await expect(page.getByRole('main').getByRole('alert')).toContainText('complete the spam-protection check');
  await page.getByRole('button', { name: 'Start spam-protection check' }).click();
  await expect(page.getByRole('status').filter({ hasText: 'Spam protection could not complete' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Start spam-protection check' })).toBeEnabled();
});

test('home, all subject hubs and starter pack expose the honest waitlist invitation', async ({ page }) => {
  for (const path of ['/', '/starter-pack', ...['anatomy', 'histology', 'physiology', 'biochemistry', 'genetics', 'biophysics', 'cell-biology'].flatMap(id => [`/subjects/${id}`, `/study/${id}`])]) {
    const response = await page.goto(path); expect(response?.status()).toBe(200);
    const cta = page.getByRole('complementary', { name: 'Pre-launch waitlist' });
    await expect(cta).toContainText('no confirmed launch date');
    await expect(cta.getByRole('link', { name: 'Explore the waitlist' })).toHaveAttribute('href', '/waitlist');
  }
  await page.getByRole('link', { name: 'Explore the waitlist' }).click();
  await expect(page.getByRole('heading', { name: 'Stay informed as Study Guide Studios develops' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try demo — no signup' })).toBeVisible();
});

test('waitlist, privacy, terms and starter resources pass accessibility and narrow-screen checks', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 850 });
  for (const path of ['/waitlist', '/privacy', '/terms', '/starter-pack', '/waitlist/confirmation']) {
    await page.goto(path);
    if (path === '/waitlist') {
      await page.getByRole('button', { name: 'Try demo — no signup' }).click();
      await expect(page.getByLabel('Example email address (required)', { exact: true })).toHaveAttribute('aria-invalid', 'true');
    }
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  }
});

test('privacy preference is explicit, revocable, and never enabled by viewing the waitlist', async ({ page }) => {
  const config = { enabled: true, recipient: "Test recipient", privacyUrl: "https://collector.example.invalid/privacy", consentVersion: "abcdef012345abcdef012345" };
  await page.route("**/api/measurement", route => route.fulfill({ json: config }));
  await page.goto('/privacy');
  await page.getByRole('button', { name: 'Allow optional analytics', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Withdraw analytics consent' })).toBeVisible();
  await page.getByRole('button', { name: 'Withdraw analytics consent' }).click();
  await page.goto('/waitlist');
  await expect(page.getByRole('button', { name: 'Keep analytics off', exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Keep analytics off', exact: true })).toBeVisible();
});

test('demo API does not accept an address as a real signup and is not cacheable', async ({ request }) => {
  const response = await request.post('/api/waitlist', { data: { email: 'student@example.com', consent: true } });
  expect(response.status()).toBe(200); expect(await response.json()).toEqual({ status: 'demo' });
  expect(response.headers()['cache-control']).toContain('no-store');
});

test('without JavaScript the page explains that signup has not happened', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage(); await page.goto('/waitlist');
  await expect(page.locator('noscript p')).toBeVisible();
  await expect(page.locator('noscript p')).toContainText('No signup has been submitted.');
  await expect(page.getByRole('button', { name: 'Request confirmation email' })).toHaveCount(0);
  await context.close();
});

import { test, expect } from '@playwright/test';
const auth = (name: string) => ({ Cookie: `__Host-wardhan-session=${name.padEnd(40, '-')}` });
const marker = /WARDHAN_SYNTHETIC_(FOUNDATION|DEEPER)_(BODY|ASSET)/;

test('membership copy and member navigation are usable without a fake sign-in or checkout', async ({ page }) => {
  await page.goto('/membership');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('A complete learning sequence, one membership');
  await expect(page.getByRole('heading', { name: 'Basic', exact: true })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Advanced', exact: true })).toBeVisible();
  await page.getByRole('link', { name: 'Account availability' }).click();
  await expect(page.getByRole('heading', { name: 'Sign-in is not open yet' })).toBeVisible();
  await expect(page.locator('input[type=password]')).toHaveCount(0);
  await page.getByRole('link', { name: 'Member dashboard', exact: true }).click();
  await expect(page.getByRole('navigation', { name: 'Member navigation' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'My modules', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

for (const [name, foundationStatus, deeperStatus] of [
  ['anonymous', 401, 401], ['basic', 200, 403], ['advanced', 200, 200],
  ['expired', 403, 403], ['revoked', 403, 403], ['past_due', 403, 403],
  ['unavailable', 503, 503], ['ambiguous', 503, 503], ['forged', 401, 401],
] as const) test(`${name}: server page, RSC and direct download enforce the same access`, async ({ request }) => {
  const headers = name === 'anonymous' ? {} : auth(name);
  for (const [module, status] of [['foundation', foundationStatus], ['deeper', deeperStatus]] as const) {
    const path = `/member/modules/synthetic-${module}`;
    const page = await request.get(path, { headers });
    expect(page.headers()['cache-control']).toContain('no-store');
    expect(page.headers()['x-robots-tag']).toContain('noindex');
    const html = await page.text();
    expect(marker.test(html)).toBe(status === 200);
    if (status !== 200) expect(html).toContain('Content locked');
    const rsc = await request.get(`${path}?_rsc`, { headers: { ...headers, RSC: '1' } });
    expect(marker.test(await rsc.text())).toBe(status === 200);
    const asset = await request.get(`/api/member/assets/synthetic-${module}-download`, { headers });
    expect(asset.status()).toBe(status);
    expect(asset.headers()['cache-control']).toContain('no-store');
    expect(asset.headers()['x-robots-tag']).toContain('noindex');
    expect(marker.test(await asset.text())).toBe(status === 200);
    if (status === 200) expect(asset.headers()['content-disposition']).toContain('attachment');
  }
});

test('slow verification denies access within the server timeout', async ({ request }) => {
  const response = await request.get('/api/member/assets/synthetic-foundation-download', { headers: auth('timeout') });
  expect(response.status()).toBe(503); expect(await response.text()).not.toMatch(marker);
});

test('authorized responses cannot be reused anonymously, and guessed static asset paths fail', async ({ request }) => {
  const asset = '/api/member/assets/synthetic-foundation-download';
  expect((await request.get(asset, { headers: auth('basic') })).status()).toBe(200);
  const anonymous = await request.get(asset, { headers: { Range: 'bytes=0-20' } });
  expect(anonymous.status()).toBe(401); expect(await anonymous.text()).not.toMatch(marker);
  expect((await request.head(asset)).status()).toBe(401);
  for (const path of ['/downloads/synthetic-foundation-download.txt', '/api/member/assets/unknown'])
    expect((await request.get(path, { headers: auth('advanced') })).status()).toBe(404);
  // Next streams the application 404 after the shared loading boundary with HTTP 200.
  const unknown = await request.get('/member/modules/unknown', { headers: auth('advanced') });
  expect(await unknown.text()).toContain('NEXT_HTTP_ERROR_FALLBACK;404');
  expect(await unknown.text()).not.toMatch(marker);
});

test('account session clearing requires same origin and deletes the secure cookie', async ({ request }) => {
  const path = '/api/account/sign-out';
  expect((await request.post(path, { headers: { Origin: 'https://untrusted.example' } })).status()).toBe(403);
  const response = await request.post(path, { headers: { Origin: 'http://127.0.0.1:3103' }, maxRedirects: 0 });
  expect(response.status()).toBe(303);
  expect(response.headers()['set-cookie']).toContain('__Host-wardhan-session=;');
  expect(response.headers()['set-cookie']).toMatch(/Secure/);
  expect(response.headers()['set-cookie']).toMatch(/HttpOnly/);
  expect(response.headers()['set-cookie']).toMatch(/Max-Age=0/);
});

test('client bundles and public search exclude protected synthetic payloads', async ({ page, request }) => {
  await page.goto('/member');
  const sources = await page.locator('script[src]').evaluateAll(scripts => scripts.map(s => (s as HTMLScriptElement).src));
  for (const source of sources) expect(await (await request.get(source)).text()).not.toMatch(marker);
  const sitemap = await (await request.get('/sitemap.xml')).text();
  expect(sitemap).not.toContain('/member/'); expect(sitemap).not.toContain('/account');
});

import { readFileSync } from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { waitlistConfig, publicWaitlistConfig, handleWaitlist } from '../src/lib/waitlist-server.ts';
import { validateWaitlist, WAITLIST_CONSENT_VERSION } from '../src/lib/waitlist.ts';


const env = { WAITLIST_MODE: 'brevo', WAITLIST_ORIGIN: 'https://study.example', BREVO_API_KEY: 'private-provider-key', BREVO_WAITLIST_LIST_ID: '23', BREVO_DOI_TEMPLATE_ID: '42', TURNSTILE_SITE_KEY: 'public-widget-key', TURNSTILE_SECRET_KEY: 'private-spam-key' };
const live = waitlistConfig(env);
const body = { email: 'student@example.com', consent: true, consentVersion: WAITLIST_CONSENT_VERSION, website: '', token: 'verified-token' };
const request = (data = body, headers = {}) => new Request('https://study.example/api/waitlist', { method: 'POST', headers: { origin: 'https://study.example', 'content-type': 'application/json', ...headers }, body: JSON.stringify(data) });
const verified = { success: true, hostname: 'study.example', action: 'waitlist' };
const noNetwork = () => { throw new Error('Unexpected network access'); };
const json = (data, status = 200) => Response.json(data, { status });

test('email validation rejects malformed, overlong and injection input; explicit consent is separate', () => {
  for (const email of ['', null, {}, 'a', 'a@b', '.a@example.com', 'a..b@example.com', 'a@example..com', 'a@-example.com', 'a@e_com.net', 'a\r\n@example.com', 'a'.repeat(65) + '@example.com', 'a@' + 'x'.repeat(250) + '.com']) assert(validateWaitlist(email, true).email, String(email));
  for (const email of ['student@example.com', '  student+notes@example.org  ', "o'neil@example.net"]) assert.deepEqual(validateWaitlist(email, true), {});
  for (const consent of [false, 'true', 1, undefined]) assert(validateWaitlist('student@example.com', consent).consent);
});

test('missing config is demo; incomplete live config fails closed; previews cannot collect', () => {
  assert.deepEqual(waitlistConfig({}), { mode: 'demo' });
  for (const key of Object.keys(env).filter(key => key !== 'WAITLIST_MODE')) assert.equal(waitlistConfig({ ...env, [key]: '' }).mode, 'unavailable', key);
  for (const origin of ['http://study.example', 'https://user:pass@study.example', 'https://study.example/path', 'https://study.example?key=x']) assert.equal(waitlistConfig({ ...env, WAITLIST_ORIGIN: origin }).mode, 'unavailable');
  assert.equal(waitlistConfig({ ...env, BREVO_WAITLIST_LIST_ID: '1.2' }).mode, 'unavailable');
  assert.equal(waitlistConfig({ ...env, VERCEL_ENV: 'preview' }).mode, 'demo');
  assert.deepEqual(publicWaitlistConfig(live), { mode: 'live', siteKey: 'public-widget-key' });
});

test('demo and unavailable modes never read submitted personal data or call providers', async () => {
  for (const mode of ['demo', 'unavailable']) {
    const req = request();
    const res = await handleWaitlist(req, { mode }, noNetwork);
    assert.equal(req.bodyUsed, false);
    assert.equal(res.status, mode === 'demo' ? 200 : 503);
    assert.equal(res.headers.get('cache-control'), 'private, no-store');
    assert.deepEqual(await res.json(), { status: mode });
  }
});

test('untrusted origins, cross-site requests and wrong content types fail before a provider call', async () => {
  for (const headers of [{ origin: '' }, { origin: 'https://attacker.example' }, { 'sec-fetch-site': 'cross-site' }]) assert.equal((await handleWaitlist(request(body, headers), live, noNetwork)).status, 403);
  assert.equal((await handleWaitlist(request(body, { 'content-type': 'text/plain' }), live, noNetwork)).status, 415);
});

test('malformed, oversized and invalid submissions fail before verification, without reflecting data', async () => {
  for (const raw of ['{', 'null', '[]', '"string"', JSON.stringify({ ...body, email: 'x'.repeat(5000) })]) {
    const req = new Request('https://study.example/api/waitlist', { method: 'POST', headers: { origin: env.WAITLIST_ORIGIN, 'content-type': 'application/json' }, body: raw });
    assert.equal((await handleWaitlist(req, live, noNetwork)).status, 400);
  }
  for (const change of [{ email: '<private>' }, { consent: false }, { website: 'bot' }, { token: '' }, { token: 'x'.repeat(2049) }]) {
    const response = await handleWaitlist(request({ ...body, ...change }), live, noNetwork);
    assert.equal(response.status, 422);
    assert(!JSON.stringify(await response.json()).includes('<private>'));
  }
  assert.equal((await handleWaitlist(request({ ...body, consentVersion: 'stale' }), live, noNetwork)).status, 409);
});

test('verification rejects expired tokens, hostname/action mismatch and upstream failure', async () => {
  for (const result of [{ success: false, 'error-codes': ['timeout-or-duplicate'] }, { ...verified, hostname: 'attacker.example' }, { ...verified, action: 'login' }, {}]) {
    let count = 0;
    const response = await handleWaitlist(request(), live, async () => { count++; return json(result); });
    assert.equal(response.status, 422); assert.equal(count, 1);
  }
  for (const send of [async () => json({}, 500), async () => { throw new Error('timeout'); }, async () => new Response('invalid json')]) {
    assert.equal((await handleWaitlist(request(), live, send)).status, 503);
  }
});

test('verified request uses only DOI API, records notice version, and reports pending not delivery', async () => {
  const calls = [];
  const response = await handleWaitlist(request(), live, async (url, options) => {
    calls.push({ url, options }); return calls.length === 1 ? json(verified) : json({}, 201);
  });
  assert.equal(response.status, 202); assert.deepEqual(await response.json(), { status: 'pending' });
  assert.equal(calls.length, 2);
  assert.equal(calls[0].url, 'https://challenges.cloudflare.com/turnstile/v0/siteverify');
  assert.deepEqual(JSON.parse(calls[0].options.body), { secret: env.TURNSTILE_SECRET_KEY, response: body.token });
  assert.equal(calls[1].url, 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation');
  const sent = JSON.parse(calls[1].options.body);
  assert.deepEqual(sent.includeListIds, [23]); assert.equal(sent.templateId, 42);
  assert.equal(sent.email, body.email); assert.equal(sent.redirectionUrl, 'https://study.example/waitlist/confirmation');
  assert.equal(sent.attributes.WAITLIST_CONSENT, WAITLIST_CONSENT_VERSION);
  assert(Number.isFinite(Date.parse(sent.attributes.WAITLIST_REQUESTED_AT)));
  for (const { options } of calls) { assert.equal(options.redirect, 'error'); assert.equal(options.cache, 'no-store'); assert(options.signal); }
});

test('provider errors, rate limits, unexpected success codes and timeouts never claim membership or reveal addresses', async () => {
  for (const status of [200, 400, 429, 500, 'timeout']) {
    const response = await handleWaitlist(request(), live, async url => {
      if (url.includes('siteverify')) return json(verified);
      if (status === 'timeout') throw new Error('provider secret error');
      return json({ private: body.email, key: env.BREVO_API_KEY }, status);
    });
    assert.equal(response.status, 503);
    const text = await response.text();
    assert.match(text, /could not confirm/); assert(!text.includes(body.email)); assert(!text.includes(env.BREVO_API_KEY));
  }
});

test('waitlist measurement uses only the consent-gated acceptance hook', () => {
  const form = readFileSync(new URL('../src/components/waitlist-form.tsx', import.meta.url), 'utf8');
  assert.match(form, /response.status === 202 && body.status === "pending"/);
  assert.match(form, /recordWaitlistSubmitted\(true\)/);
  assert(!form.includes('learningEvent('));
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { moduleAccess, parseVerification } from '../src/lib/membership/access.ts';
import { verifySession } from '../src/lib/membership/provider.ts';
import { deliverAsset } from '../src/lib/membership/delivery.ts';
const now = Date.now();
const foundation = 'synthetic-foundation';
const deeper = 'synthetic-deeper';
const token = 'a'.repeat(40);
const config = { origin: 'https://accounts.example.test', apiKey: 'k'.repeat(40) };
const payload = (patch = {}) => ({
  checkedAt: new Date(now).toISOString(),
  session: { userId: 'test-user', expiresAt: new Date(now + 60000).toISOString() },
  membership: { userId: 'test-user', tier: 'basic', status: 'active', validUntil: new Date(now + 60000).toISOString(), moduleIds: [foundation], ...patch },
});
const state = patch => parseVerification(payload(patch), now);
for (const [label, value, module, expected] of [
  ['anonymous', { kind: 'anonymous' }, foundation, 'sign-in'],
  ['Basic foundation', state(), foundation, true],
  ['Basic deeper with erroneous grant', state({ moduleIds: [deeper] }), deeper, 'not-included'],
  ['Advanced deeper', state({ tier: 'advanced', moduleIds: [deeper] }), deeper, true],
  ['Advanced does not imply Basic allocation', state({ tier: 'advanced', moduleIds: [deeper] }), foundation, 'not-included'],
  ['Advanced explicit foundation grant', state({ tier: 'advanced' }), foundation, true],
  ['expired period', state({ validUntil: new Date(now).toISOString() }), foundation, 'expired'],
  ['expired status', state({ status: 'expired' }), foundation, 'expired'],
  ['revoked', state({ status: 'revoked' }), foundation, 'inactive'],
  ['past due', state({ status: 'past_due' }), foundation, 'inactive'],
  ['canceled', state({ status: 'canceled' }), foundation, 'inactive'],
  ['unavailable', { kind: 'unavailable' }, foundation, 'unavailable'],
  ['unknown module', state(), '../../private', 'not-found'],
]) test(`access: ${label}`, () => {
  const result = moduleAccess(value, module, now);
  assert.equal(result.allowed ? true : result.reason, expected);
});
for (const [label, change] of [
  ['wrong subject', p => { p.membership.userId = 'other-user'; }],
  ['unknown tier', p => { p.membership.tier = 'complete'; }],
  ['array tier', p => { p.membership.tier = ['basic']; }],
  ['missing membership', p => { delete p.membership; }],
  ['invalid expiry', p => { p.membership.validUntil = 'invalid'; }],
  ['stale verification', p => { p.checkedAt = new Date(now - 31000).toISOString(); }],
  ['future verification', p => { p.checkedAt = new Date(now + 6000).toISOString(); }],
  ['bad grants', p => { p.membership.moduleIds = '*'; }],
]) test(`verification rejects ${label}`, () => {
  const p = payload(); change(p);
  assert.equal(parseVerification(p, now).kind, 'unavailable');
});
test('session expiry and later authorization checks cannot reuse expired verification', () => {
  const p = payload(); p.session.expiresAt = new Date(now).toISOString();
  assert.equal(parseVerification(p, now).kind, 'anonymous');
  assert.deepEqual(moduleAccess(state(), foundation, now + 31000), { allowed: false, reason: 'unavailable' });
});
test('provider sends opaque session only to fixed HTTPS origin, disables caching/redirects and sets timeout', async () => {
  let calls = 0;
  const result = await verifySession(token, config, async (url, init) => {
    calls++;
    assert.equal(String(url), 'https://accounts.example.test/v1/session/verify');
    assert.equal(init.method, 'POST'); assert.equal(init.redirect, 'error'); assert.equal(init.cache, 'no-store');
    assert.equal(init.headers.Authorization, `Bearer ${config.apiKey}`);
    assert.deepEqual(JSON.parse(init.body), { sessionToken: token }); assert.ok(init.signal instanceof AbortSignal);
    return Response.json(payload());
  }, () => now);
  assert.equal(calls, 1); assert.equal(result.kind, 'verified');
});
test('missing credentials and malformed cookies never call a service', async () => {
  const noFetch = () => { throw new Error('must not fetch'); };
  assert.equal((await verifySession(undefined, config, noFetch)).kind, 'anonymous');
  assert.equal((await verifySession('basic', config, noFetch)).kind, 'anonymous');
  for (const bad of [{}, { ...config, origin: 'http://example.test' }, { ...config, origin: 'https://example.test/path' }, { ...config, apiKey: 'short' }])
    assert.equal((await verifySession(token, bad, noFetch)).kind, 'unavailable');
});
for (const [label, request] of [
  ['network failure', async () => { throw new Error('offline'); }],
  ['timeout', async () => { throw new DOMException('timed out', 'TimeoutError'); }],
  ['service 401', async () => new Response('', { status: 401 })],
  ['service 500', async () => new Response('', { status: 500 })],
  ['malformed JSON', async () => new Response('{', { headers: { 'Content-Type': 'application/json' } })],
  ['oversized JSON', async () => Response.json({ text: 'x'.repeat(65000) })],
  ['HTML instead of JSON', async () => new Response('<html>sign in</html>')],
]) test(`provider fails closed on ${label}`, async () => {
  assert.equal((await verifySession(token, config, request)).kind, 'unavailable');
});
test('provider can explicitly invalidate a session', async () => {
  assert.equal((await verifySession(token, config, async () => Response.json({ state: 'anonymous' }))).kind, 'anonymous');
});
for (const [label, member, status] of [
  ['anonymous', { kind: 'anonymous' }, 401],
  ['Basic', state(), 200],
  ['Advanced grant', state({ tier: 'advanced' }), 200],
  ['expired', state({ status: 'expired' }), 403],
  ['unavailable', { kind: 'unavailable' }, 503],
  ['wrong module', state({ moduleIds: [deeper] }), 403],
]) test(`asset delivery: ${label}`, async () => {
  let reads = 0;
  const response = await deliverAsset('synthetic-foundation-download', async () => member, async () => { reads++; return 'protected asset marker'; });
  assert.equal(response.status, status);
  assert.equal(reads, status === 200 ? 1 : 0);
  assert.match(response.headers.get('Cache-Control'), /private, no-store/);
  assert.match(response.headers.get('X-Robots-Tag'), /noindex/);
  assert.equal((await response.text()).includes('protected asset marker'), status === 200);
});
test('asset IDs are allowlisted and storage failures never disclose exceptions', async () => {
  const response = await deliverAsset('../.env', async () => { throw new Error('should not verify'); }, async () => 'secret');
  assert.equal(response.status, 404);
  const failed = await deliverAsset('synthetic-foundation-download', async () => state(), async () => { throw new Error('/private/store/key'); });
  assert.equal(failed.status, 503); assert.doesNotMatch(await failed.text(), /private\/store/);
});

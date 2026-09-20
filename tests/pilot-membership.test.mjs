import assert from "node:assert/strict";
import test from "node:test";
import { authorizePilot, readPilotAsset, decideSnapshot } from "../src/lib/membership-core.ts";
import { pilotConfig } from "../src/lib/pilot-config.ts";
import { verifyPilotIdentity } from "../src/lib/pilot-identity.ts";

// Provider doubles test policy/orchestration; they are not evidence of hosted sign-in.
const identity = { userId: "10000000-0000-4000-8000-000000000001", sessionId: "20000000-0000-4000-8000-000000000001" };
const row = { user_id: identity.userId, session_id: identity.sessionId, session_active: true, membership_present: true,
  tier: "basic", status: "active", valid_until: "2030-01-02T00:00:00Z", db_now: "2030-01-01T00:00:00Z",
  module_id: "pilot-foundations", required_tier: "basic", synthetic_only: true, has_grant: true };
function provider(overrides = {}) {
  return { verifyIdentity: async () => identity, snapshot: async () => row,
    download: async () => new TextEncoder().encode("unit fixture only"), ...overrides };
}
test("anonymous request never queries entitlements or storage", async () => {
  const result = await readPilotAsset(provider({ verifyIdentity: async () => null, snapshot: () => assert.fail(), download: () => assert.fail() }), "pilot-foundations");
  assert.deepEqual(result, { allowed: false, status: 401 });
});
for (const tier of ["basic", "advanced"]) for (const required of ["basic", "advanced"]) {
  test(`${tier} on ${required} whole module`, async () => {
    const moduleId = required === "basic" ? "pilot-foundations" : "pilot-deep-dive";
    const expected = tier === "advanced" || required === "basic";
    const result = await readPilotAsset(provider({ snapshot: async () => ({ ...row, tier, module_id: moduleId, required_tier: required }) }), moduleId);
    assert.equal(result.allowed, expected); assert.equal(result.status, expected ? 200 : 403);
    assert.equal("bytes" in result, expected);
  });
}
for (const status of ["expired", "revoked", "past_due", "cancelled"]) {
  test(`${status} denies next request without bytes`, async () => {
    const current = { ...row }; const p = provider({ snapshot: async () => current });
    assert.equal((await readPilotAsset(p, "pilot-foundations")).status, 200);
    current.status = status;
    assert.deepEqual(await readPilotAsset(p, "pilot-foundations"), { allowed: false, status: 403 });
  });
}
for (const [label, change, status] of [
  ["time expiry", { valid_until: row.db_now }, 403], ["missing membership", { membership_present: false }, 403],
  ["missing grant", { has_grant: false }, 403], ["logout", { session_active: false }, 401],
  ["wrong identity", { user_id: "other" }, 503], ["wrong session", { session_id: "other" }, 503],
  ["malformed tier", { tier: "admin" }, 503], ["malformed status", { status: "trial" }, 503],
  ["malformed grant", { has_grant: "true" }, 503], ["malformed expiry", { valid_until: "bad" }, 503],
  ["wrong module", { module_id: "other" }, 503], ["real content", { synthetic_only: false }, 503],
]) test(`${label} fails closed`, async () => {
  const result = await readPilotAsset(provider({ snapshot: async () => ({ ...row, ...change }), download: () => assert.fail() }), "pilot-foundations");
  assert.deepEqual(result, { allowed: false, status });
});
for (const phase of ["verifyIdentity", "snapshot", "download"]) test(`${phase} outage exposes no bytes`, async () => {
  const result = await readPilotAsset(provider({ [phase]: async () => { throw new Error("sensitive provider details"); } }), "pilot-foundations");
  assert.deepEqual(result, { allowed: false, status: 503 });
});
test("malformed and oversized storage bodies fail before sending bytes", async () => {
  for (const bytes of [new Uint8Array(), new Uint8Array(4097), null, "not bytes"])
    assert.deepEqual(await readPilotAsset(provider({ download: async () => bytes }), "pilot-foundations"), { allowed: false, status: 503 });
});
test("no snapshot decision is cached across dashboard or asset requests", async () => {
  let calls = 0; const p = provider({ snapshot: async () => { calls++; return { ...row, has_grant: calls === 1 }; } });
  assert.equal((await authorizePilot(p, "pilot-foundations")).status, 200);
  assert.equal((await readPilotAsset(p, "pilot-foundations")).status, 403);
  assert.equal(calls, 2);
});
test("unknown or unavailable snapshot cannot authorize", () => {
  for (const bad of [null, [], "allowed", {}, { ...row, db_now: null }]) assert.equal(decideSnapshot(bad, identity, "pilot-foundations").status, 503);
});
const env = { MEMBERSHIP_PILOT_ENABLED: "1", MEMBERSHIP_PILOT_ORIGIN: "https://pilot-example.vercel.app",
  MEMBERSHIP_PILOT_EMAIL_ALLOWLIST: "basic@example.invalid,advanced@example.invalid",
  NEXT_PUBLIC_SUPABASE_URL: "https://syntheticproject.supabase.co", NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "unit-test-key",
  VERCEL: "1", VERCEL_ENV: "preview" };
test("configuration hard-disables production and unapproved targets", () => {
  assert.ok(pilotConfig(env));
  for (const change of [{ VERCEL_ENV: "production" }, { VERCEL_ENV: "development" }, { MEMBERSHIP_PILOT_ENABLED: "0" },
    { MEMBERSHIP_PILOT_ORIGIN: "https://attacker.invalid" }, { MEMBERSHIP_PILOT_ORIGIN: "http://pilot.vercel.app" },
    { NEXT_PUBLIC_SUPABASE_URL: "https://syntheticproject.supabase.co@evil.invalid" },
    { MEMBERSHIP_PILOT_EMAIL_ALLOWLIST: "" }, { MEMBERSHIP_PILOT_EMAIL_ALLOWLIST: "one@example.invalid" },
    { NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "" }]) assert.equal(pilotConfig({ ...env, ...change }), null);
});
function auth(overrides = {}) {
  return { auth: { getClaims: async () => ({ data: { claims: { sub: identity.userId, session_id: identity.sessionId } }, error: null }),
    getUser: async () => ({ data: { user: { id: identity.userId, email: "basic@example.invalid", email_confirmed_at: "2030-01-01" } }, error: null }), ...overrides } };
}
test("verified claims still require a live matching confirmed allowlisted user", async () => {
  assert.deepEqual(await verifyPilotIdentity(auth(), ["basic@example.invalid"]), identity);
  assert.equal(await verifyPilotIdentity(auth(), ["another@example.invalid"]), null);
  for (const user of [{ id: "other" }, { id: identity.userId, email: "basic@example.invalid" }])
    assert.equal(await verifyPilotIdentity(auth({ getUser: async () => ({ data: { user }, error: null }) }), ["basic@example.invalid"]), null);
});
test("cached valid JWT cannot authorize through an Auth outage", async () => {
  for (const method of ["getClaims", "getUser"]) await assert.rejects(verifyPilotIdentity(auth({ [method]: async () => ({ data: null, error: { status: 503 } }) }), ["basic@example.invalid"]));
});
test("invalid/revoked identity cannot reach database authority", async () => {
  assert.equal(await verifyPilotIdentity(auth({ getClaims: async () => ({ data: null, error: { status: 401 } }), getUser: () => assert.fail() }), ["basic@example.invalid"]), null);
  assert.equal(await verifyPilotIdentity(auth({ getUser: async () => ({ data: null, error: { status: 401 } }) }), ["basic@example.invalid"]), null);
});

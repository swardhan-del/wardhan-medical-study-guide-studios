import assert from "node:assert/strict";
import { createHmac, randomBytes } from "node:crypto";
import test from "node:test";
import { accessDecision, verifyMemberSession, MAX_SESSION_LIFETIME_MS } from "../src/lib/membership-core.ts";

const now = 1800000000000;
const secret = randomBytes(32).toString("base64url");
const session = { memberId: "synthetic-member", tier: "basic", membershipStatus: "active", expiresAt: now + 60000 };
// Test-process signing only. The application has no cookie issuer or demo login.
function sign(value, key = secret) {
  const payload = Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${payload}.${createHmac("sha256", key).update(payload).digest("base64url")}`;
}
const decide = (claims, requiredTier = "basic", clock = now) => accessDecision({ session: claims, requiredTier, now: clock });

test("anonymous access requires authentication", () => {
  assert.equal(decide(null).status, 401);
  assert.equal(decide(undefined).allowed, false);
});

for (const [tier, requiredTier, allowed] of [
  ["basic", "basic", true], ["basic", "advanced", false],
  ["advanced", "basic", true], ["advanced", "advanced", true],
]) {
  test(`${tier} membership requesting ${requiredTier}: ${allowed ? "allowed" : "denied"}`, () => {
    const claims = verifyMemberSession(sign({ ...session, tier }), secret);
    assert.equal(decide(claims, requiredTier).allowed, allowed);
    assert.equal(decide(claims, requiredTier).status, allowed ? 200 : 403);
  });
}

for (const status of ["expired", "cancelled", "past_due"]) {
  test(`${status} denies even a valid signature and future expiry`, () => {
    const claims = verifyMemberSession(sign({ ...session, membershipStatus: status }), secret);
    assert.equal(decide(claims).status, 403);
  });
}

test("expiry and maximum remaining lifetime are enforced on each request", () => {
  const claims = verifyMemberSession(sign(session), secret);
  assert.equal(decide(claims, "basic", session.expiresAt).allowed, false);
  assert.equal(decide(claims, "basic", session.expiresAt + 1).allowed, false);
  assert.equal(decide({ ...session, expiresAt: now + MAX_SESSION_LIFETIME_MS }).allowed, true);
  assert.equal(decide({ ...session, expiresAt: now + MAX_SESSION_LIFETIME_MS + 1 }).allowed, false);
  assert.equal(decide(claims, "basic", NaN).allowed, false);
});

for (const [label, value] of [
  ["empty", {}], ["null", null], ["array", []], ["string", "active"],
  ["unknown tier", { ...session, tier: "complete" }],
  ["unknown status", { ...session, membershipStatus: "trial" }],
  ["unavailable entitlement", { ...session, membershipStatus: null }],
  ["missing identity", { ...session, memberId: "" }],
  ["non-string identity", { ...session, memberId: 1 }],
  ["string expiry", { ...session, expiresAt: String(session.expiresAt) }],
  ["missing expiry", { ...session, expiresAt: undefined }],
  ["non-finite expiry", { ...session, expiresAt: Infinity }],
  ["fractional expiry", { ...session, expiresAt: now + 0.5 }],
  ["extra claims", { ...session, admin: true }],
]) {
  test(`malformed ${label} claims deny even when signed`, () => {
    assert.equal(verifyMemberSession(sign(value), secret), null);
    assert.equal(decide(value).allowed, false);
  });
}

test("unknown required tiers deny", () => assert.equal(decide(session, "complete").allowed, false));

test("missing, short, whitespace or wrong secret cannot authenticate", () => {
  for (const key of [undefined, "", "short", ` ${secret}`, randomBytes(32).toString("hex")])
    assert.equal(verifyMemberSession(sign(session), key), null);
});

test("forged tier, unsigned payload, malformed encoding and oversized cookie deny", () => {
  const token = sign(session);
  const [payload, signature] = token.split(".");
  const advanced = Buffer.from(JSON.stringify({ ...session, tier: "advanced" })).toString("base64url");
  for (const bad of [undefined, "", payload, `${advanced}.${signature}`, `${payload}.none`,
    `${payload}.${signature}.extra`, `${payload}=.${signature}`, `${payload}.${signature}=`,
    `${payload}.${"a".repeat(43)}`, "a".repeat(4097), JSON.stringify(session)])
    assert.equal(verifyMemberSession(bad, secret), null);
});

test("correctly signed malformed JSON and invalid UTF-8 deny without throwing", () => {
  for (const bytes of [Buffer.from("{broken"), Buffer.from([0xff, 0xfe])]) {
    const payload = bytes.toString("base64url");
    const signature = createHmac("sha256", secret).update(payload).digest("base64url");
    assert.equal(verifyMemberSession(`${payload}.${signature}`, secret), null);
  }
});

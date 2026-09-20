import { createHmac, timingSafeEqual } from "node:crypto";

export type MembershipTier = "basic" | "advanced";
export type MemberSession = {
  memberId: string;
  tier: MembershipTier;
  membershipStatus: "active" | "expired" | "cancelled" | "past_due";
  expiresAt: number;
};

// A future provider must recheck current entitlements before each issuance.
export const MAX_SESSION_LIFETIME_MS = 5 * 60 * 1000;

function isMemberSession(value: unknown): value is MemberSession {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const session = value as Record<string, unknown>;
  return (
    Object.keys(session).length === 4 &&
    typeof session.memberId === "string" &&
    /^[A-Za-z0-9_-]{1,128}$/.test(session.memberId) &&
    (session.tier === "basic" || session.tier === "advanced") &&
    typeof session.membershipStatus === "string" &&
    ["active", "expired", "cancelled", "past_due"].includes(session.membershipStatus) &&
    typeof session.expiresAt === "number" &&
    Number.isSafeInteger(session.expiresAt) &&
    session.expiresAt > 0
  );
}

/** Only call with claims returned by verifyMemberSession at a server boundary. */
export function accessDecision({
  session,
  requiredTier,
  now = Date.now(),
}: {
  session: unknown;
  requiredTier: MembershipTier;
  now?: number;
}): { allowed: boolean; status: 200 | 401 | 403; reason: string } {
  if (session == null) return { allowed: false, status: 401, reason: "authentication-required" };
  if (!isMemberSession(session) || !Number.isSafeInteger(now) || now < 0)
    return { allowed: false, status: 403, reason: "invalid-session" };
  if (session.membershipStatus !== "active")
    return { allowed: false, status: 403, reason: "membership-inactive" };
  if (session.expiresAt <= now)
    return { allowed: false, status: 403, reason: "membership-expired" };
  if (session.expiresAt - now > MAX_SESSION_LIFETIME_MS)
    return { allowed: false, status: 403, reason: "invalid-session" };
  if (!(requiredTier === "basic" || requiredTier === "advanced") ||
      (requiredTier === "advanced" && session.tier !== "advanced"))
    return { allowed: false, status: 403, reason: "tier-required" };
  return { allowed: true, status: 200, reason: "allowed" };
}

/** Fixed HMAC-SHA256 over canonical base64url(JSON); no client-selected algorithm. */
export function verifyMemberSession(token: unknown, secret: unknown): MemberSession | null {
  if (typeof secret !== "string" || Buffer.byteLength(secret) < 32 ||
      secret.trim() !== secret || typeof token !== "string" || token.length > 4096)
    return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  if (!/^[A-Za-z0-9_-]+$/.test(payload) || !/^[A-Za-z0-9_-]{43}$/.test(signature)) return null;
  try {
    const bytes = Buffer.from(payload, "base64url");
    const actual = Buffer.from(signature, "base64url");
    if (bytes.toString("base64url") !== payload || actual.toString("base64url") !== signature) return null;
    const expected = createHmac("sha256", secret).update(payload).digest();
    if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
    const session: unknown = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    return isMemberSession(session) ? session : null;
  } catch {
    return null;
  }
}

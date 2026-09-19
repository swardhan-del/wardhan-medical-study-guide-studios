import { findPilotModule } from "./catalog.ts";

export type VerifiedMember = {
  userId: string;
  tier: "basic" | "advanced";
  status: "active" | "expired" | "revoked" | "past_due" | "canceled";
  sessionExpiresAt: number;
  validUntil: number;
  checkedAt: number;
  moduleIds: string[];
};
export type MemberState =
  | { kind: "verified"; member: VerifiedMember }
  | { kind: "anonymous" }
  | { kind: "unavailable" };
export type AccessDecision = { allowed: true } | {
  allowed: false;
  reason: "sign-in" | "unavailable" | "expired" | "inactive" | "not-included" | "not-found";
};

// Parse unknown provider input. Client claims, tier names alone and ambiguous data grant nothing.
export function parseVerification(value: unknown, now = Date.now()): MemberState {
  if (!value || typeof value !== "object") return { kind: "unavailable" };
  const data = value as Record<string, unknown>;
  const session = data.session as Record<string, unknown> | undefined;
  const membership = data.membership as Record<string, unknown> | undefined;
  if (!session || !membership || typeof session.userId !== "string" || !session.userId ||
      session.userId.length > 200 || membership.userId !== session.userId ||
      typeof membership.tier !== "string" || !["basic", "advanced"].includes(membership.tier) ||
      typeof membership.status !== "string" || !["active", "expired", "revoked", "past_due", "canceled"].includes(membership.status) ||
      !Array.isArray(membership.moduleIds) || membership.moduleIds.length > 1000 ||
      !membership.moduleIds.every(id => typeof id === "string" && id.length <= 150)) {
    return { kind: "unavailable" };
  }
  const timestamp = (v: unknown) => typeof v === "string" ? Date.parse(v) : NaN;
  const sessionExpiresAt = timestamp(session.expiresAt);
  const validUntil = timestamp(membership.validUntil);
  const checkedAt = timestamp(data.checkedAt);
  if (![sessionExpiresAt, validUntil, checkedAt].every(Number.isFinite) ||
      checkedAt > now + 5000 || checkedAt < now - 30000) return { kind: "unavailable" };
  if (sessionExpiresAt <= now) return { kind: "anonymous" };
  return { kind: "verified", member: {
    userId: session.userId, tier: membership.tier as VerifiedMember["tier"],
    status: membership.status as VerifiedMember["status"], sessionExpiresAt, validUntil, checkedAt,
    moduleIds: membership.moduleIds as string[],
  } };
}

export function moduleAccess(state: MemberState, moduleId: string, now = Date.now()): AccessDecision {
  const entry = findPilotModule(moduleId);
  if (!entry) return { allowed: false, reason: "not-found" };
  if (state.kind === "anonymous") return { allowed: false, reason: "sign-in" };
  if (state.kind === "unavailable") return { allowed: false, reason: "unavailable" };
  const member = state.member;
  if (member.sessionExpiresAt <= now) return { allowed: false, reason: "sign-in" };
  if (member.checkedAt < now - 30000 || member.checkedAt > now + 5000)
    return { allowed: false, reason: "unavailable" };
  if (member.validUntil <= now || member.status === "expired") return { allowed: false, reason: "expired" };
  if (member.status !== "active") return { allowed: false, reason: "inactive" };
  if (!member.moduleIds.includes(moduleId) || (entry.tier === "advanced" && member.tier !== "advanced"))
    return { allowed: false, reason: "not-included" };
  return { allowed: true };
}

export const accessMessages = {
  "sign-in": "Sign in to check your membership and module access.",
  unavailable: "We cannot verify your membership right now. Your content stays locked. Please try again later.",
  expired: "Your membership access has ended. Review your membership before continuing.",
  inactive: "Your membership is not active. Review your account before continuing.",
  "not-included": "This complete module is not included in your current membership.",
  "not-found": "This module is not available.",
} as const;

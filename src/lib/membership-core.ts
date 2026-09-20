// Shared policy and provider contract. No browser state is an authority.
export const pilotModules = {
  "pilot-foundations": { label: "Pilot Foundations", tier: "basic", asset: "membership-foundation-pilot" },
  "pilot-deep-dive": { label: "Pilot Deep Dive", tier: "advanced", asset: "membership-deep-dive-pilot" },
} as const;
export type ModuleId = keyof typeof pilotModules;
export type Identity = { userId: string; sessionId: string };
export type Decision = { allowed: true; status: 200 } | { allowed: false; status: 401 | 403 | 503 };
export interface PilotProvider {
  verifyIdentity(): Promise<Identity | null>;
  snapshot(identity: Identity, moduleId: ModuleId | null): Promise<unknown>;
  download(): Promise<Uint8Array>;
}
export const privateHeaders = {
  "Cache-Control": "private, no-store", "CDN-Cache-Control": "no-store", "Vercel-CDN-Cache-Control": "no-store",
  Vary: "Cookie", "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer",
};
export function isModuleId(value: string): value is ModuleId { return Object.hasOwn(pilotModules, value); }
export function decideSnapshot(value: unknown, identity: Identity, moduleId: ModuleId | null): Decision {
  const unavailable: Decision = { allowed: false, status: 503 };
  if (!value || typeof value !== "object" || Array.isArray(value)) return unavailable;
  const row = value as Record<string, unknown>;
  if (row.user_id !== identity.userId || row.session_id !== identity.sessionId ||
      typeof row.session_active !== "boolean" || typeof row.membership_present !== "boolean") return unavailable;
  if (!row.session_active) return { allowed: false, status: 401 };
  if (!row.membership_present) return { allowed: false, status: 403 };
  if ((row.tier !== "basic" && row.tier !== "advanced") ||
      !["active", "expired", "revoked", "past_due", "cancelled"].includes(String(row.status)) ||
      typeof row.valid_until !== "string" || typeof row.db_now !== "string") return unavailable;
  const expiry = Date.parse(row.valid_until), now = Date.parse(row.db_now);
  if (!Number.isFinite(expiry) || !Number.isFinite(now)) return unavailable;
  if (row.status !== "active" || expiry <= now) return { allowed: false, status: 403 };
  if (moduleId !== null) {
    if (!isModuleId(moduleId) || row.module_id !== moduleId || row.required_tier !== pilotModules[moduleId].tier ||
        row.synthetic_only !== true || typeof row.has_grant !== "boolean") return unavailable;
    if (!row.has_grant || (row.required_tier === "advanced" && row.tier !== "advanced")) return { allowed: false, status: 403 };
  }
  return { allowed: true, status: 200 };
}
export async function authorizePilot(provider: PilotProvider, moduleId: ModuleId | null): Promise<Decision> {
  try {
    const identity = await provider.verifyIdentity();
    if (!identity) return { allowed: false, status: 401 };
    return decideSnapshot(await provider.snapshot(identity, moduleId), identity, moduleId);
  } catch { return { allowed: false, status: 503 }; }
}
export async function readPilotAsset(provider: PilotProvider, moduleId: ModuleId): Promise<
  { allowed: false; status: 401 | 403 | 503 } | { allowed: true; status: 200; bytes: Uint8Array }
> {
  const decision = await authorizePilot(provider, moduleId);
  if (!decision.allowed) return decision;
  try {
    // Buffer the tiny canary before headers: failed reads cannot leak partial bytes.
    const bytes = await provider.download();
    if (!(bytes instanceof Uint8Array) || bytes.length === 0 || bytes.length > 4096) throw new Error("Invalid canary");
    return { allowed: true, status: 200, bytes };
  } catch { return { allowed: false, status: 503 }; }
}

export const consentKey = "wardhan-measurement-consent:v1";
export const legacyOptOutKey = "wardhan-analytics-optout";
export const consentLifetime = 180 * 24 * 60 * 60 * 1000;
export type ConsentChoice = "undecided" | "granted" | "denied";
export type PublicMeasurementConfig = { enabled: false } | { enabled: true; recipient: string; privacyUrl: string; consentVersion: string };
export const disabledMeasurement: PublicMeasurementConfig = { enabled: false };

export function validPublicConfig(value: unknown): PublicMeasurementConfig {
  if (!value || typeof value !== "object") return disabledMeasurement;
  const v = value as Record<string, unknown>;
  if (v.enabled !== true || typeof v.recipient !== "string" || !v.recipient.trim() || v.recipient.length > 80 || typeof v.privacyUrl !== "string" || typeof v.consentVersion !== "string" || !/^[a-f0-9]{24}$/.test(v.consentVersion)) return disabledMeasurement;
  try {
    const url = new URL(v.privacyUrl);
    if (url.protocol !== "https:" || url.username || url.password || url.search || url.hash) return disabledMeasurement;
    return { enabled: true, recipient: v.recipient, privacyUrl: url.toString(), consentVersion: v.consentVersion };
  } catch { return disabledMeasurement; }
}
export function consentChoice(raw: string | null, config: PublicMeasurementConfig, now: number, legacyOptOut: boolean): ConsentChoice {
  if (legacyOptOut) return "denied";
  if (!config.enabled || !raw) return "undecided";
  try {
    const record = JSON.parse(raw);
    if (record.version !== config.consentVersion || !Number.isFinite(record.decidedAt) || record.decidedAt > now || now - record.decidedAt >= consentLifetime) return "undecided";
    return record.choice === "granted" || record.choice === "denied" ? record.choice : "undecided";
  } catch { return "undecided"; }
}
export function makeConsent(choice: "granted" | "denied", version: string, now: number): string {
  return JSON.stringify({ choice, version, decidedAt: now });
}

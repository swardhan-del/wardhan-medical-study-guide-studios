export const WAITLIST_CONSENT_VERSION = "2026-09-26";
export const waitlistConsent = "I want email updates about the Study Guide Studios launch and newly released free study resources. I can unsubscribe at any time.";
export type WaitlistPublicConfig = { mode: "demo" | "unavailable" } | { mode: "live"; siteKey: string };
export type WaitlistErrors = { email?: string; consent?: string };

// A conservative practical address format, not a claim that a mailbox exists.
export function validateWaitlist(email: unknown, consent: unknown): WaitlistErrors {
  const errors: WaitlistErrors = {};
  if (typeof email !== "string" || email.length > 254) errors.email = "Enter a valid email address.";
  else {
    const value = email.trim();
    const [local, domain, extra] = value.split("@");
    if (!local || !domain || extra !== undefined || local.length > 64 ||
      !/^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]+$/.test(local) || local.startsWith(".") || local.endsWith(".") || local.includes("..") ||
      !domain.includes(".") || domain.split(".").some(label => !/^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/.test(label))) {
      errors.email = "Enter a valid email address, such as student@example.com.";
    }
  }
  if (consent !== true) errors.consent = "Choose the email-updates checkbox to continue. It is optional to use the free lessons.";
  return errors;
}

export const demoMessage = "Demo complete. You have not joined the waitlist. No address was transmitted or saved, and no email was sent.";

"use client";
import { track } from "@vercel/analytics";
import type { BeforeSendEvent } from "@vercel/analytics";
export function analyticsAllowed() {
  if (
    typeof window === "undefined" ||
    process.env.NEXT_PUBLIC_LEARNING_ANALYTICS !== "1"
  )
    return false;
  if (
    navigator.doNotTrack === "1" ||
    ("globalPrivacyControl" in navigator && navigator.globalPrivacyControl)
  )
    return false;
  try {
    return localStorage.getItem("wardhan-analytics-optout") === "0";
  } catch {
    return false;
  }
}
export function filterAnalyticsEvent(event: BeforeSendEvent) {
  if (!analyticsAllowed()) return null;
  const url = new URL(event.url);
  if (/^\/(review|study|reading-list)(\/|$)/.test(url.pathname)) return null;
  if (event.type === "pageview" && /^\/waitlist(\/|$)/.test(url.pathname)) return null;
  url.search = "";
  url.hash = "";
  return { ...event, url: url.toString() };
}
export function learningEvent(
  name:
    | "lesson_started"
    | "lesson_completed"
    | "quiz_started"
    | "quiz_completed"
    | "challenge_shared"
    | "learning_day"
    | "waitlist_confirmation_requested",
  properties: Record<string, string | boolean> = {},
) {
  if (!analyticsAllowed()) return;
  // Only fixed curriculum identifiers or a returning-day flag, never student answers or scores.
  try {
    track(name, properties);
  } catch {
    /* Analytics must never interrupt learning. */
  }
}

"use client";
import { track } from "@vercel/analytics";
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
    return localStorage.getItem("wardhan-analytics-optout") !== "1";
  } catch {
    return false;
  }
}
export function learningEvent(
  name:
    | "lesson_started"
    | "lesson_completed"
    | "quiz_started"
    | "quiz_completed"
    | "challenge_shared"
    | "learning_day",
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

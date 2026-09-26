"use client";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { eventForPath } from "@/lib/measurement-events";
import { loadMeasurement, learningEvent, measurementSnapshot, measurementServerSnapshot, setMeasurementConsent, subscribeMeasurement } from "@/lib/learning-analytics";

function useMeasurement() { return useSyncExternalStore(subscribeMeasurement, measurementSnapshot, measurementServerSnapshot); }
export function LearningAnalytics() {
  const path = usePathname();
  const state = useMeasurement();
  useEffect(() => {
    if (path.startsWith("/review")) return;
    let cancelled = false;
    void loadMeasurement().then(() => {
      const event = eventForPath(path);
      if (!cancelled && event) learningEvent(event);
    });
    return () => { cancelled = true; };
  }, [path]);
  if (!state.ready || !state.config.enabled || state.privacySignal || path.startsWith("/privacy") || path.startsWith("/review")) return null;
  return <aside className="site-container study-panel measurement-notice" aria-label="Optional analytics">
    <h2>Optional analytics</h2>
    <AnalyticsPreference compact />
  </aside>;
}
export function AnalyticsPreference({ compact = false }: { compact?: boolean }) {
  const state = useMeasurement();
  const [message, setMessage] = useState("");
  const status = useRef<HTMLParagraphElement>(null);
  useEffect(() => { void loadMeasurement(); }, []);
  function choose(choice: "granted" | "denied") {
    const saved = setMeasurementConsent(choice);
    setMessage(saved ? choice === "granted" ? "Optional analytics is now allowed. Earlier activity is not sent." : "Optional analytics is off. Your study progress is unchanged." : "This preference could not be saved. Optional analytics is off for this visit.");
    requestAnimationFrame(() => status.current?.focus({ preventScroll: true }));
  }
  return <div id={compact ? undefined : "analytics-preference"}>
    {!state.ready ? <p>Checking whether optional analytics is configured…</p> : !state.config.enabled ? <p>Optional analytics is not configured or is unavailable. No learning events are sent.</p> : <>
      <p>With your permission, we send counts of subject visits, lesson openings, completed practice and saved summary checklists to {state.config.recipient}. Starter-pack requests and provider-accepted waitlist confirmation requests use the same permission. No answers, writing, email addresses, scores or student identifiers are included. <a href={state.config.privacyUrl} rel="noreferrer">Recipient privacy information</a>. <Link href="/privacy#analytics-preference">Privacy and analytics settings</Link>.</p>
      <p>{state.privacySignal ? "Your browser privacy signal keeps analytics off." : !state.storageAvailable ? "Browser storage is unavailable, so analytics stays off." : state.choice === "granted" ? "Optional analytics is on. You can withdraw permission at any time." : "Optional analytics is off. You can use all study features without allowing it."}</p>
      <div className="action-row">
        <button type="button" className="button button-secondary" onClick={() => choose("denied")}>{state.choice === "granted" ? "Withdraw analytics consent" : "Keep analytics off"}</button>
        {state.choice !== "granted" && <button type="button" className="button button-secondary" disabled={state.privacySignal || !state.storageAvailable} onClick={() => choose("granted")}>Allow optional analytics</button>}
      </div>
    </>}
    <p role="status" ref={status} tabIndex={-1}>{message}</p>
  </div>;
}

"use client";
import { consentChoice, consentKey, disabledMeasurement, legacyOptOutKey, makeConsent, validPublicConfig, type ConsentChoice, type PublicMeasurementConfig } from "./measurement-consent.ts";
import { validateMeasurement, type MeasurementEvent } from "./measurement-events.ts";

type Snapshot = { ready: boolean; config: PublicMeasurementConfig; choice: ConsentChoice; privacySignal: boolean; storageAvailable: boolean };
const server: Snapshot = { ready: false, config: disabledMeasurement, choice: "undecided", privacySignal: false, storageAvailable: true };
let snapshot = server;
let config: PublicMeasurementConfig = disabledMeasurement;
let ready = false;
let loading: Promise<void> | undefined;
let deniedInMemory = false;
const listeners = new Set<() => void>();
const pending = new Set<AbortController>();
const changeEvent = "wardhan-measurement-preference";

function privacySignal(): boolean {
  return navigator.doNotTrack === "1" || ("globalPrivacyControl" in navigator && navigator.globalPrivacyControl === true);
}
export function measurementSnapshot(): Snapshot {
  if (typeof window === "undefined") return server;
  let choice: ConsentChoice = "undecided", storageAvailable = true;
  try { choice = consentChoice(localStorage.getItem(consentKey), config, Date.now(), localStorage.getItem(legacyOptOutKey) === "1"); }
  catch { storageAvailable = false; }
  if (deniedInMemory) choice = "denied";
  const signal = privacySignal();
  if (snapshot.ready !== ready || snapshot.config !== config || snapshot.choice !== choice || snapshot.privacySignal !== signal || snapshot.storageAvailable !== storageAvailable) snapshot = { ready, config, choice, privacySignal: signal, storageAvailable };
  return snapshot;
}
export const measurementServerSnapshot = () => server;
function notify() {
  const state = measurementSnapshot();
  if (!state.storageAvailable || state.choice !== "granted" || state.privacySignal) {
    for (const request of pending) request.abort();
    pending.clear();
  }
  for (const listener of listeners) listener();
}
export function subscribeMeasurement(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => { if (event.key === consentKey || event.key === legacyOptOutKey || event.key === null) notify(); };
  const onChange = () => notify();
  window.addEventListener("storage", onStorage);
  window.addEventListener(changeEvent, onChange);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); window.removeEventListener(changeEvent, onChange); };
}
export function loadMeasurement(): Promise<void> {
  if (loading) return loading;
  loading = (async () => {
    try {
      const response = await fetch("/api/measurement", { credentials: "omit", referrerPolicy: "no-referrer", cache: "no-store", signal: AbortSignal.timeout(2000) });
      config = response.ok ? validPublicConfig(await response.json()) : disabledMeasurement;
    } catch { config = disabledMeasurement; }
    ready = true; notify();
  })();
  return loading;
}
export function setMeasurementConsent(choice: "granted" | "denied"): boolean {
  if (!config.enabled || (choice === "granted" && privacySignal())) return false;
  // Fail closed immediately, including if persistence subsequently fails.
  deniedInMemory = true; notify();
  try {
    localStorage.setItem(consentKey, makeConsent(choice, config.consentVersion, Date.now()));
    if (choice === "granted") localStorage.removeItem(legacyOptOutKey);
    deniedInMemory = false;
    window.dispatchEvent(new Event(changeEvent));
    return true;
  } catch { notify(); return false; }
}
export function analyticsAllowed(): boolean {
  const state = measurementSnapshot();
  return state.ready && state.config.enabled && state.choice === "granted" && state.storageAvailable && !state.privacySignal;
}
export function learningEvent(input: MeasurementEvent): void {
  const event = validateMeasurement(input);
  if (!event || !analyticsAllowed() || !config.enabled || /^\/(review|reading-list)(\/|$)/.test(location.pathname) || location.pathname === "/study" || location.pathname.startsWith("/study/planner")) return;
  const controller = new AbortController();
  pending.add(controller);
  const timeout = window.setTimeout(() => controller.abort(), 2500);
  // No persistent queue, retry, page URL, referrer, cookie, answer or identity fields.
  try {
    void fetch("/api/measurement", {
      method: "POST", credentials: "omit", referrerPolicy: "no-referrer", cache: "no-store",
      headers: { "Content-Type": "application/json", "X-Measurement-Consent": config.consentVersion },
      body: JSON.stringify(event), signal: controller.signal,
    }).catch(() => {}).finally(() => { clearTimeout(timeout); pending.delete(controller); });
  } catch { clearTimeout(timeout); pending.delete(controller); }
}
// Future integrations: invoke only after the real action succeeds, never on a CTA click or demo result.
export function recordStarterPackRequested(delivered: boolean): void {
  if (delivered === true) learningEvent({ version: 1, event: "starter_pack_requested", asset_id: "study-guide-starter-pack" });
}
export function recordWaitlistSubmitted(accepted: boolean): void {
  if (accepted === true) learningEvent({ version: 1, event: "waitlist_submitted" });
}

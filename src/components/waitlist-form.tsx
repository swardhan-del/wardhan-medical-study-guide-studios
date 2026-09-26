"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { WaitlistSpamCheck } from "./waitlist-spam-check";
import { learningEvent } from "@/lib/learning-analytics";
import { demoMessage, validateWaitlist, WAITLIST_CONSENT_VERSION, waitlistConsent } from "@/lib/waitlist";
import type { WaitlistErrors, WaitlistPublicConfig } from "@/lib/waitlist";

export function WaitlistForm() {
  const [config, setConfig] = useState<WaitlistPublicConfig | null>(null);
  const [email, setEmail] = useState(""), [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<WaitlistErrors>({});
  const [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false), [complete, setComplete] = useState(false);
  const [showCheck, setShowCheck] = useState(false), [token, setToken] = useState("");
  const [checkError, setCheckError] = useState("");
  const emailInput = useRef<HTMLInputElement>(null), consentInput = useRef<HTMLInputElement>(null);
  const website = useRef<HTMLInputElement>(null), result = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/waitlist", { cache: "no-store", signal: AbortSignal.any([controller.signal, AbortSignal.timeout(10000)]) })
      .then(async response => {
        if (!response.ok) throw new Error("config");
        const value = await response.json();
        if (value.mode !== "demo" && value.mode !== "unavailable" && !(value.mode === "live" && typeof value.siteKey === "string" && value.siteKey)) throw new Error("config");
        setConfig(value);
      }).catch(() => { if (!controller.signal.aborted) setConfig({ mode: "unavailable" }); });
    return () => controller.abort();
  }, []);
  useEffect(() => { if (message) result.current?.focus(); }, [message]);
  function checkFailed() {
    setToken(""); setShowCheck(false);
    setCheckError("Spam protection could not complete or has expired. Start a new check, or try again later.");
  }
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current || !config || config.mode === "unavailable") return;
    setMessage(""); setFailed(false);
    const nextErrors = validateWaitlist(email, consent);
    if (config.mode === "demo" && !nextErrors.email && !/@example\.(com|org|net)$/i.test(email.trim()))
      nextErrors.email = "For this demo, use an example address such as student@example.com. Do not enter your real address.";
    setErrors(nextErrors);
    if (nextErrors.email) { emailInput.current?.focus(); return; }
    if (nextErrors.consent) { consentInput.current?.focus(); return; }
    if (config.mode === "demo") {
      setEmail(""); setConsent(false); setComplete(true); setMessage(demoMessage); return;
    }
    if (!token) { setFailed(true); setMessage("Start and complete the spam-protection check before requesting confirmation."); return; }
    inFlight.current = true; setBusy(true);
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), consent, consentVersion: WAITLIST_CONSENT_VERSION, website: website.current?.value || "", token }),
        signal: AbortSignal.timeout(20000), cache: "no-store",
      });
      const body = await response.json();
      if (response.status === 202 && body.status === "pending") {
        setEmail(""); setConsent(false); setComplete(true);
        setMessage("Confirmation requested. Check your inbox and spam folder for an email from Study Guide Studios. You join only after confirming through that email. Delivery is not guaranteed.");
        // Fixed event only; never pass addresses, tokens, URLs, or form values.
        learningEvent("waitlist_confirmation_requested");
      } else if (body.status === "demo") {
        setFailed(true); setMessage("Signups are now in demo mode. You have not been added to the waitlist. Reload this page to try the demo.");
      } else {
        setFailed(true);
        // Display only our own messages, never arbitrary response text.
        setMessage(response.status === 409 ? "The privacy notice has changed. Reload this page before continuing." : response.status === 403 ? "Open the waitlist on the official site and try again." : response.status === 422 ? "Check your email address, consent and spam protection, then try again." : "We could not confirm that the request was accepted. If a confirmation email arrives, use its link; otherwise try again later.");
      }
    } catch {
      setFailed(true); setMessage("The connection failed. We could not confirm that the request was accepted. If a confirmation email arrives, use its link; otherwise try again later.");
    } finally { inFlight.current = false; setBusy(false); setToken(""); setShowCheck(false); }
  }
  return <section className="study-panel waitlist-panel" aria-labelledby="waitlist-form-heading">
    <h2 id="waitlist-form-heading">{config?.mode === "demo" ? "Try the waitlist demo" : "Request launch updates"}</h2>
    {!config && <p role="status">Checking signup availability…</p>}
    {config?.mode === "unavailable" && <p role="status">Signups are temporarily unavailable. No address is being collected. Please return later; the free lessons are still available.</p>}
    {config?.mode === "demo" && <p className="study-notice" id="waitlist-mode">Signups are not open yet. This is a browser-only demo: use student@example.com to try it. Nothing is transmitted or saved, and no email is sent.</p>}
    {config?.mode === "live" && <p id="waitlist-mode">Confirm your email before joining. No account or payment is required.</p>}
    <noscript><p>JavaScript is needed to validate this form and protect it from spam. No signup has been submitted. You can use all public reading material without joining.</p></noscript>
    {config && config.mode !== "unavailable" && !complete && <form className="study-form waitlist-form" noValidate onSubmit={submit} aria-describedby="waitlist-mode waitlist-privacy" aria-busy={busy}>
      <div><label htmlFor="waitlist-email">{config.mode === "demo" ? "Example email address" : "Email address"} (required)</label>
        <input ref={emailInput} id="waitlist-email" type="email" required autoComplete={config.mode === "demo" ? "off" : "email"} autoCapitalize="none" spellCheck={false} maxLength={254} value={email} onChange={event => setEmail(event.target.value)} aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? "waitlist-email-error" : undefined} placeholder="student@example.com" disabled={busy} />
        {errors.email && <p className="waitlist-error" id="waitlist-email-error">{errors.email}</p>}
      </div>
      <div><label className="waitlist-consent" htmlFor="waitlist-consent"><input ref={consentInput} id="waitlist-consent" type="checkbox" required checked={consent} onChange={event => setConsent(event.target.checked)} disabled={busy} aria-invalid={Boolean(errors.consent)} aria-describedby={errors.consent ? "waitlist-consent-error" : undefined} /><span>{waitlistConsent} (Required to join; optional for studying.)</span></label>
        {errors.consent && <p className="waitlist-error" id="waitlist-consent-error">{errors.consent}</p>}
      </div>
      <div className="waitlist-trap" aria-hidden="true"><label>Leave this field empty<input ref={website} type="text" name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <p id="waitlist-privacy">We ask only for your email, not your name, university or health information. Joining does not enable analytics. Read the <Link href="/privacy#waitlist">waitlist privacy notice</Link> and <Link href="/terms">educational disclaimer</Link>.</p>
      {config.mode === "live" && <div>
        <p>Starting spam protection loads Cloudflare Turnstile, which processes device and network information. Your email goes to Brevo only when you request confirmation.</p>
        {!showCheck && <button type="button" className="button button-secondary" disabled={busy} onClick={() => { setCheckError(""); setShowCheck(true); }}>Start spam-protection check</button>}
        {showCheck && <WaitlistSpamCheck siteKey={config.siteKey} onToken={setToken} onError={checkFailed} />}
        <p role="status">{checkError || (token ? "Spam-protection check complete." : "")}</p>
        {checkError && <p><a href="/waitlist">Reload the waitlist page</a> if the check remains unavailable.</p>}
      </div>}
      <button type="submit" className="button button-primary" disabled={busy}>{busy ? "Requesting confirmation…" : config.mode === "demo" ? "Try demo — no signup" : "Request confirmation email"}</button>
    </form>}
    <div ref={result} tabIndex={-1} role={failed ? "alert" : "status"} className={message ? "study-notice" : undefined}>{message}</div>
    {failed && <p><a href="/waitlist">Reload the waitlist page</a> to start again.</p>}
    {complete && <p><Link href="/library">Continue to the free study library →</Link></p>}
  </section>;
}

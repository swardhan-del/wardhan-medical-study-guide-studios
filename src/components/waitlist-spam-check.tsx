"use client";
import Script from "next/script";
import { useEffect, useRef } from "react";

type Turnstile = {
  render: (element: HTMLElement, options: { sitekey: string; action: string; size: string; callback: (token: string) => void; "expired-callback": () => void; "error-callback": () => void }) => string;
  remove: (id: string) => void;
};
declare global { interface Window { turnstile?: Turnstile } }

export function WaitlistSpamCheck({ siteKey, onToken, onError }: { siteKey: string; onToken: (token: string) => void; onError: () => void }) {
  const container = useRef<HTMLDivElement>(null), widget = useRef<string | null>(null);
  useEffect(() => () => {
    if (widget.current !== null) window.turnstile?.remove(widget.current);
    widget.current = null;
  }, []);
  function render() {
    if (!container.current || widget.current !== null) return;
    try {
      if (!window.turnstile) { onError(); return; }
      widget.current = window.turnstile.render(container.current, {
        sitekey: siteKey, action: "waitlist", size: "compact", callback: onToken,
        "expired-callback": onError, "error-callback": onError,
      });
    } catch { onError(); }
  }
  return <div>
    <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={render} onError={onError} />
    <div ref={container} aria-label="Spam-protection check" />
  </div>;
}

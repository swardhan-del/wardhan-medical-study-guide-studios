"use client";
import { useState, useSyncExternalStore } from "react";
import { Analytics } from "@vercel/analytics/next";
import { analyticsAllowed } from "@/lib/learning-analytics";
function subscribePreference(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener("wardhan-analytics-change", listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener("wardhan-analytics-change", listener);
  };
}
export function LearningAnalytics() {
  const allowed = useSyncExternalStore(subscribePreference, analyticsAllowed, () => false);
  if (!allowed) return null;
  return (
    <Analytics
      beforeSend={(event) => {
        if (!analyticsAllowed()) return null;
        const url = new URL(event.url);
        if (/^\/(review|study|reading-list)(\/|$)/.test(url.pathname))
          return null;
        url.search = "";
        url.hash = "";
        return { ...event, url: url.toString() };
      }}
    />
  );
}
export function AnalyticsPreference() {
  const [message, setMessage] = useState("");
  function setPreference(optOut: boolean) {
    try {
      localStorage.setItem("wardhan-analytics-optout", optOut ? "1" : "0");
      window.dispatchEvent(new Event("wardhan-analytics-change"));
      setMessage(
        optOut
          ? "Analytics is disabled for this browser."
          : "Analytics is allowed unless your browser sends a privacy signal.",
      );
    } catch {
      setMessage(
        "Your browser cannot save this preference. Analytics stays disabled while storage is unavailable.",
      );
    }
  }
  return (
    <div>
      <div className="action-row">
        <button
          className="button button-secondary"
          onClick={() => setPreference(true)}
        >
          Disable analytics in this browser
        </button>
        <button
          className="button button-secondary"
          onClick={() => setPreference(false)}
        >
          Allow analytics
        </button>
      </div>
      <p role="status">{message}</p>
    </div>
  );
}

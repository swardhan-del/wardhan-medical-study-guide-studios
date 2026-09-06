"use client";
import { useState } from "react";
import { Analytics } from "@vercel/analytics/next";
import { analyticsAllowed } from "@/lib/learning-analytics";
export function LearningAnalytics() {
  if (process.env.NEXT_PUBLIC_LEARNING_ANALYTICS !== "1") return null;
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

"use client";
import { useState } from "react";

export function CorrectionForm({
  lesson,
  email,
}: {
  lesson: string;
  email: string | null;
}) {
  const [section, setSection] = useState("");
  const [details, setDetails] = useState("");
  const [draft, setDraft] = useState("");
  const title = `Study feedback: ${lesson || "General feedback"}`;
  const body = `Page: ${lesson || "Not specified"}\nSection: ${section}\n\nFeedback or correction:\n${details}\n`;
  const href = email
    ? `mailto:${email}?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(body)}`
    : `https://github.com/swardhan-del/wardhan-medical-study-guide-studios/issues/new?${new URLSearchParams({ title, body })}`;
  return (
    <form
      className="study-form"
      onSubmit={(event) => {
        event.preventDefault();
        setDraft(href);
      }}
    >
      <p>
        {email
          ? "Create an email draft to review in your email application."
          : "Prepare a correction for our public GitHub issue tracker. A free GitHub account is needed to submit it."}{" "}
        Please do not include patient information or other sensitive personal
        details.
      </p>
      <p>
        <strong>Page:</strong> {lesson || "General feedback"}
      </p>
      <label>
        Page title, section or question
        <input
          maxLength={120}
          value={section}
          onChange={(e) => {
            setSection(e.target.value);
            setDraft("");
          }}
          placeholder="For example: Renal clearance, question 2"
        />
      </label>
      <label>
        Your feedback or correction
        <textarea
          required
          minLength={10}
          maxLength={1200}
          rows={6}
          value={details}
          onChange={(e) => {
            setDetails(e.target.value);
            setDraft("");
          }}
          placeholder="Describe the issue and, if possible, suggest a source or correction."
        />
      </label>
      <button className="button button-primary" type="submit">
        {email ? "Prepare feedback email" : "Prepare GitHub feedback"}
      </button>
      {draft && (
        <div role="status" className="study-notice">
          <p>
            Your draft is ready. Nothing has been sent.{" "}
            {email
              ? "Send it from your email application."
              : "Review it on GitHub and select Create to submit. GitHub will show a confirmation and an issue link."}
          </p>
          <a
            className="button button-secondary"
            href={draft}
            target={email ? undefined : "_blank"}
            rel="noreferrer"
          >
            {email ? "Open email draft" : "Review and submit on GitHub ↗"}
          </a>
        </div>
      )}
    </form>
  );
}

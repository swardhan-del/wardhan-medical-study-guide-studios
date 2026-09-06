"use client";
import { useState, useEffect } from "react";
import { learningEvent } from "@/lib/learning-analytics";
import { updateLearning, useLearning } from "./learning-store";
export function CompleteLesson({ slug }: { slug: string }) {
  const { ready, data, persistent } = useLearning();
  const done = data.lessons.includes(slug);
  useEffect(() => {
    learningEvent("lesson_started", { lesson: slug });
  }, [slug]);
  return (
    <div className="lesson-completion">
      <button
        className="button button-primary"
        disabled={!ready || done}
        onClick={() => {
          learningEvent("lesson_completed", { lesson: slug });
          updateLearning((s) => ({
            ...s,
            lessons: [...new Set([...s.lessons, slug])],
          }));
        }}
      >
        {done ? "✓ Lesson marked complete" : "Mark lesson complete"}
      </button>
      <p>
        {persistent
          ? "Progress is saved in this browser. Completing a lesson is your own assessment."
          : "Storage is unavailable; completion lasts only for this visit."}
      </p>
    </div>
  );
}
export function ShareChallenge() {
  const [message, setMessage] = useState("");
  const [fallback, setFallback] = useState("");
  async function share() {
    const url = `${window.location.origin}/practice/renal-challenge`;
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Challenge link copied. Share it with a classmate.");
      learningEvent("challenge_shared", { set: "renal-challenge" });
      updateLearning((s) => ({ ...s, shares: s.shares + 1 }));
    } catch {
      setFallback(url);
      setMessage("Copy the link below to share this challenge.");
    }
  }
  return (
    <div className="share-challenge">
      <button className="button button-secondary" onClick={share}>
        Copy challenge link
      </button>
      <p role="status">{message}</p>
      {fallback && (
        <label>
          Challenge URL
          <input
            readOnly
            value={fallback}
            onFocus={(e) => e.currentTarget.select()}
          />
        </label>
      )}
    </div>
  );
}

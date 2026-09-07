"use client";
import { SavedRecall, SavedSelfCheck } from "./saved-recall";
import { useState } from "react";
import Link from "next/link";
import {
  renalLessons,
  renalLessonHref,
  type RenalLesson,
} from "@/content/renal-course";
import { updateLearning, useLearning } from "./learning-store";
function OralPrompt({ lesson }: { lesson: RenalLesson }) {
  const [revealed, setRevealed] = useState(false);
  const { ready, data } = useLearning();
  const checkedCount = lesson.rubric.filter((_, i) => data.drafts[`rubric-${lesson.slug}-${i}`] === "yes").length;
  return (
    <section className="study-panel">
      <p className="eyebrow">Speak first. Compare second.</p>
      <h2>{lesson.oral}</h2>
      <p>
        Take about 90 seconds to explain this aloud, or draft an answer below.
        Your draft and self-checks are saved on this browser. Your writing is not sent for AI evaluation.
      </p>
      <SavedRecall id={`oral-renal-${lesson.slug}`} label="My answer" />
      <button
        className="button button-primary"
        onClick={() => setRevealed(!revealed)}
      >
        {revealed ? "Hide answer rubric" : "Compare with the rubric"}
      </button>
      {revealed && (
        <div className="answer-explanation">
          <h3>Did your explanation include these points?</h3>
          {lesson.rubric.map((point, i) => <div className="rubric-check" key={point}><SavedSelfCheck id={`rubric-${lesson.slug}-${i}`} label={point} /></div>)}
          <p>
            {checkedCount} of {lesson.rubric.length} points self-assessed.
            This is a revision aid, not a grade.
          </p>
          <h3>Follow-up question</h3>
          <p>{lesson.followUp}</p>
          <div className="action-row">
            <button
              className="button button-secondary"
              disabled={!ready || data.oral.includes(lesson.slug)}
              onClick={() =>
                updateLearning((s) => ({
                  ...s,
                  oral: [...new Set([...s.oral, lesson.slug])],
                }))
              }
            >
              {data.oral.includes(lesson.slug)
                ? "Self-assessment saved"
                : "Save that I practiced this topic"}
            </button>
            <Link className="text-link" href={renalLessonHref(lesson.slug)}>
              Revisit the explanation →
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
export function OralPractice() {
  const [slug, setSlug] = useState(renalLessons[0].slug);
  return (
    <div className="study-stack">
      <label className="study-form">
        Choose an oral topic
        <select value={slug} onChange={(e) => setSlug(e.target.value)}>
          {renalLessons.map((l) => (
            <option key={l.slug} value={l.slug}>
              {l.title}
            </option>
          ))}
        </select>
      </label>
      <OralPrompt
        key={slug}
        lesson={renalLessons.find((l) => l.slug === slug)!}
      />
    </div>
  );
}

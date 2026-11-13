"use client";

import Link from "next/link";
import { useState } from "react";
import { firstSessionHref, firstSessionsPath, firstStudySessions } from "@/content/first-study-sessions";
import { practiceItems } from "@/content/practice-registry";
import type { LearningProgress } from "@/lib/learning-core";
import { PracticeQuestion } from "./practice-question";

const reviewDelay = 24 * 60 * 60 * 1000;
const sessions = firstStudySessions.map(session => {
  const item = practiceItems.find(question => question.id === session.followUp);
  if (!item) throw new Error(`Missing follow-up question: ${session.followUp}`);
  return { ...session, item };
});

export function FirstSessionReview({ data, now }: { data: LearningProgress; now: number }) {
  const [open, setOpen] = useState<string | null>(null);
  const started = sessions.flatMap(session => {
    const lastAt = Math.max(data.checkpoints[session.question]?.at ?? 0, data.answers[session.question]?.lastAt ?? 0);
    if (!lastAt) return [];
    const completed = Boolean(data.checkpoints[session.followUp] || data.answers[session.followUp]);
    return [{ ...session, completed, available: now - lastAt >= reviewDelay }];
  });

  return (
    <section className="study-panel" aria-labelledby="subject-review-heading">
      <h2 id="subject-review-heading">First-session follow-up</h2>
      {started.length === 0 ? (
        <p><Link className="text-link" href={firstSessionsPath}>Try a five-minute study session</Link> and check an answer to add its follow-up here.</p>
      ) : (
        <ul className="first-session-list study-stack">
          {started.map(session => (
            <li key={session.id}>
              <h3>{session.subject}</h3>
              <p><Link href={firstSessionHref(session.id)}>{session.title}</Link></p>
              {session.completed && <p>Follow-up already practised.</p>}
              {!session.completed && !session.available && <p>Available 24 hours after your latest first-session answer.</p>}
              {(session.completed || session.available) && (
                <button
                  type="button"
                  className="button button-secondary"
                  aria-expanded={open === session.id}
                  aria-controls={`follow-up-${session.id}`}
                  onClick={() => setOpen(open === session.id ? null : session.id)}
                >
                  {open === session.id ? "Close" : session.completed ? "Review" : "Try"} {session.subject} follow-up
                </button>
              )}
              <div id={`follow-up-${session.id}`} hidden={open !== session.id}>
                {open === session.id && <PracticeQuestion item={session.item} title={`${session.subject} follow-up question`} />}
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { firstSessionHref, firstSessionsPath, firstStudySessions } from "@/content/first-study-sessions";
import { practiceItems } from "@/content/practice-registry";
import type { LearningProgress } from "@/lib/learning-core";
import type { PublicFigure } from "@/lib/figures";
import { EducationalFigure } from "./educational-figure";
import { PracticeQuestion } from "./practice-question";

const reviewDelay = 24 * 60 * 60 * 1000;
const weeklyDelay = 7 * reviewDelay;

function reviewQuestion(id: string) {
  const item = practiceItems.find(question => question.id === id);
  if (!item) throw new Error(`Missing first-session review question: ${id}`);
  return item;
}

const sessions = firstStudySessions.map(session => ({
  ...session,
  followUpItem: reviewQuestion(session.followUp),
  weeklyItem: reviewQuestion(session.weeklyReview),
}));

export function FirstSessionReview({ data, now, figures }: { data: LearningProgress; now: number; figures: PublicFigure[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const lastAttempt = (id: string) => Math.max(data.checkpoints[id]?.at ?? 0, data.answers[id]?.lastAt ?? 0);
  const started = sessions.flatMap(session => {
    const lastAt = lastAttempt(session.question);
    if (!lastAt) return [];
    const completed = Boolean(data.checkpoints[session.followUp] || data.answers[session.followUp]);
    const firstDue = lastAt + reviewDelay;
    const weeklyDue = lastAt + weeklyDelay;
    return [{ ...session, completed, firstDue, weeklyDue, weeklyCompleted: lastAttempt(session.weeklyReview) >= weeklyDue }];
  });

  return (
    <section className="study-panel" aria-labelledby="subject-review-heading">
      <h2 id="subject-review-heading">First-session follow-up</h2>
      {started.length === 0 ? (
        <p><Link className="text-link" href={firstSessionsPath}>Try a five-minute study session</Link> and check an answer to add its follow-up here.</p>
      ) : (
        <ul className="first-session-list study-stack">
          {started.map(session => {
            const reviews = [
              { id: `follow-up-${session.id}`, label: `${session.subject} follow-up`, item: session.followUpItem, due: session.firstDue, completed: session.completed, waiting: "Available 24 hours after your latest first-session answer.", done: "Follow-up already practised.", fresh: false, figure: undefined },
              { id: `weekly-review-${session.id}`, label: `${session.subject} one-week review`, item: session.weeklyItem, due: session.weeklyDue, completed: session.weeklyCompleted, waiting: "A different question opens one week after your latest first-session answer.", done: "One-week review complete.", fresh: !session.weeklyCompleted, figure: figures.find(figure => figure.id === session.weeklyFigure) },
            ];
            return (
              <li key={session.id}>
                <h3>{session.subject}</h3>
                <p><Link href={firstSessionHref(session.id)}>{session.title}</Link></p>
                {reviews.map(review => {
                  const expanded = open === review.id;
                  const available = review.completed || now >= review.due;
                  return (
                    <div key={review.id}>
                      {review.completed && <p>{review.done}</p>}
                      {!available && <p>{review.waiting}</p>}
                      {available && <button
                        type="button"
                        className="button button-secondary"
                        aria-expanded={expanded}
                        aria-controls={review.id}
                        onClick={() => setOpen(expanded ? null : review.id)}
                      >
                        {expanded ? "Close" : review.completed ? "Review" : "Try"} {review.label}
                      </button>}
                      <div id={review.id} hidden={!expanded || !available}>
                        {expanded && available && review.figure && <EducationalFigure figure={review.figure} />}
                        {expanded && available && <PracticeQuestion item={review.item} title={`${review.label} question`} freshAttempt={review.fresh} />}
                      </div>
                    </div>
                  );
                })}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

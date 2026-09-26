"use client";
import { useRef } from "react";
import Link from "next/link";
import type { JourneyLesson, ResumeLesson } from "@/lib/lesson-journeys";
import { resumeHref } from "@/lib/learning-journey";
import { useLearning, updateJourney } from "./learning-store";

export function ContinueLearning({ lessons }: { lessons: ResumeLesson[] }) {
  const { ready, persistent, data } = useLearning();
  const last = lessons.find(lesson => lesson.id === data.resume?.lesson);
  const completed = !!last && data.lessons.includes(last.id);
  const href = data.resume ? (last?.href ? `${last.href}${data.resume.stage === "practice" ? "#lesson-quiz" : ""}` : resumeHref(data.resume)) : "/start";
  return <section className="study-panel continue-card" aria-labelledby="continue-title">
    <p className="eyebrow">Your next study session</p><h2 id="continue-title">Continue where you left off</h2>
    {!ready ? <p role="status">Loading local progress…</p> : last && data.resume ? <>
      <p><strong>{last.title}</strong> · {completed ? "Marked complete" : { learn: "Explanation", practice: "Practice", summary: "Summary" }[data.resume.stage]}</p>
      <div className="action-row"><Link className="button button-primary" href={completed ? last.next.href : href}>{completed ? `Next: ${last.next.title}` : "Resume lesson"}</Link>{completed && <Link href={href}>Revisit completed lesson</Link>}<Link href="/study">View my progress</Link></div>
    </> : <><p>Your next session starts with one free lesson. Choose a subject, practise its questions, then save the summary.</p><div className="action-row"><Link className="button button-primary" href="/start#choose-subject">Choose my first subject</Link><Link href="/starter-pack">Get the free starter pack</Link></div></>}
    <p className="muted-note">{ready && !persistent ? "Browser storage is unavailable; progress lasts only for this visit." : "Saved on this browser only. Clearing site data removes it; My Study has export and reset controls."}</p>
  </section>;
}
export function SavedSummaries({ lessons }: { lessons: Pick<JourneyLesson, "id" | "title" | "summary">[] }) {
  const { ready, data } = useLearning();
  const heading = useRef<HTMLHeadingElement>(null);
  const saved = lessons.filter(lesson => data.journey[lesson.id]?.saved);
  return <section id="saved-summaries" className="study-panel" aria-labelledby="saved-summaries-title">
    <h2 id="saved-summaries-title" ref={heading} tabIndex={-1}>Saved lesson summaries</h2>
    <p>{lessons.filter(lesson => data.lessons.includes(lesson.id)).length} library lessons marked complete. Completion is a study record, not an assessment of mastery.</p>
    {!ready ? <p role="status">Loading saved summaries…</p> : !saved.length ? <p>No summaries saved yet. Use “Save summary to My Study” at the end of a <Link href="/library">library lesson</Link>.</p> : <div className="summary-list">{saved.map(lesson => <details key={lesson.id}><summary>{lesson.title}{data.lessons.includes(lesson.id) ? " · Complete" : " · In progress"}</summary><p>{lesson.summary}</p><div className="action-row"><Link href={`/library/${lesson.id}#lesson-review`}>Review this lesson</Link><button className="plain-button" onClick={() => { updateJourney(lesson.id, { saved: false }); heading.current?.focus(); }}>Remove saved summary: {lesson.title}</button></div></details>)}</div>}
  </section>;
}

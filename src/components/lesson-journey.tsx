"use client";
import { useEffect } from "react";
import Link from "next/link";
import type { JourneyLesson } from "@/lib/lesson-journeys";
import { journeyStatus, stageForHash } from "@/lib/learning-journey";
import { rememberLesson, updateJourney, updateLearning, useLearning } from "./learning-store";

export function LessonJourney({ lesson }: { lesson: JourneyLesson }) {
  const { ready, persistent, data } = useLearning();
  const status = journeyStatus(data, lesson.id, lesson.questions);
  const current = status.complete ? "continue" : data.resume?.lesson === lesson.id ? data.resume.stage : "learn";
  useEffect(() => {
    const remember = () => rememberLesson(lesson.id, window.location.hash ? stageForHash(window.location.hash) : undefined);
    remember();
    window.addEventListener("hashchange", remember);
    return () => window.removeEventListener("hashchange", remember);
  }, [lesson.id]);
  return <section className="study-panel lesson-journey" aria-labelledby="journey-title">
    <div className="journey-heading"><h2 id="journey-title">Your lesson journey</h2><Link href="/library">Back to library</Link></div>
    <nav aria-label="Learning journey"><ol className="journey-steps">
      <li><Link href={`/study/${lesson.subject}`}>Choose subject</Link></li>
      <li><a href="#lesson-objectives" aria-current={current === "learn" ? "step" : undefined} onClick={() => rememberLesson(lesson.id, "learn")}>Study explanation</a><span>{data.journey[lesson.id]?.read ? "Reviewed" : "Start here"}</span></li>
      <li><a href="#concept-check-title" aria-current={current === "practice" ? "step" : undefined} onClick={() => rememberLesson(lesson.id, "practice")}>Practice</a><span>{status.attempted} / {status.total} questions attempted</span></li>
      <li><a href="#lesson-review" aria-current={current === "summary" ? "step" : undefined} onClick={() => rememberLesson(lesson.id, "summary")}>Review summary</a><span>{data.journey[lesson.id]?.reviewed ? "Reviewed" : "To review"}</span></li>
      <li><a href="#continue-learning" aria-current={current === "continue" ? "step" : undefined}>Continue learning</a><span>{status.complete ? "Lesson marked complete" : "Your next step"}</span></li>
    </ol></nav>
    <progress aria-label="Lesson study steps" max={3} value={status.steps} />
    <p role="status">{ready ? `${status.steps} of 3 study steps: explanation, practice and summary.${status.complete ? " Lesson marked complete." : ""}` : "Loading local progress…"}</p>
    <p className="muted-note">Completion records your study activity, not mastery. Progress stays in this browser; no sign-in is needed.</p>
    {ready && !persistent && <p role="status">Browser storage is unavailable. You can keep studying, but progress may be lost when you leave.</p>}
    <button className="button button-secondary" disabled={!ready} aria-pressed={!!data.journey[lesson.id]?.read} onClick={() => updateJourney(lesson.id, { read: !data.journey[lesson.id]?.read })}>
      {data.journey[lesson.id]?.read ? "Explanation reviewed — undo" : "Mark explanation reviewed"}
    </button>
  </section>;
}

export function LessonReview({ lesson }: { lesson: JourneyLesson }) {
  const { ready, persistent, data } = useLearning();
  const entry = data.journey[lesson.id];
  const status = journeyStatus(data, lesson.id, lesson.questions);
  useEffect(() => {
    const target = document.getElementById("lesson-review");
    if (!target || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(item => item.isIntersecting)) rememberLesson(lesson.id, "summary");
    }, { threshold: 0.3 });
    observer.observe(target);
    return () => observer.disconnect();
  }, [lesson.id]);
  return <section className="study-panel lesson-review" id="lesson-review" aria-labelledby="lesson-review-title">
    <p className="eyebrow">Review and continue</p><h2 id="lesson-review-title">Review summary</h2>
    <p>{lesson.summary}</p>
    <p>Compare this recap with your answers. Revisit the explanation for any point you could not explain.</p>
    <div className="action-row">
      <button className="button button-secondary" disabled={!ready} aria-pressed={!!entry?.saved} onClick={() => updateJourney(lesson.id, { saved: !entry?.saved })}>{entry?.saved ? "Summary saved — remove" : "Save summary to My Study"}</button>
      <button className="button button-secondary" disabled={!ready} aria-pressed={!!entry?.reviewed} onClick={() => updateJourney(lesson.id, { reviewed: !entry?.reviewed })}>{entry?.reviewed ? "Summary reviewed — undo" : "Mark summary reviewed"}</button>
    </div>
    <p role="status">{entry?.saved ? (persistent ? "Summary saved in this browser. Find it in My Study." : "Summary kept for this visit only. Browser storage is unavailable.") : "Save this published recap to revisit it without repeating the lesson."}</p>
    <div className="action-row">
      <button className="button button-primary" disabled={!ready || (!status.complete && !status.canComplete)} aria-pressed={status.complete} aria-describedby="completion-help" onClick={() => updateLearning(state => ({ ...state, lessons: status.complete ? state.lessons.filter(id => id !== lesson.id) : [...new Set([...state.lessons, lesson.id])] }))}>{status.complete ? "Lesson complete — reopen" : "Mark lesson complete"}</button>
      <Link href="/study#saved-summaries">My saved summaries</Link>
    </div>
    <p id="completion-help" className="muted-note">To mark complete, review the explanation, check at least one practice answer and review this summary. Your remaining questions and mistakes stay available for revision.</p>
    <nav id="continue-learning" aria-label="Recommended next lesson"><h3>Continue learning</h3><p>Recommended next: {lesson.next.title}</p><div className="action-row"><Link className="button button-primary" href={lesson.next.href}>Continue: {lesson.next.title}</Link><Link href={`/library?subject=${lesson.subject === "genetics" ? "genetics-all" : lesson.subject}`}>Explore this subject in the library</Link></div></nav>
  </section>;
}

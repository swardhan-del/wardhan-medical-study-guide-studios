"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  renalLessons,
  renalLessonHref,
} from "@/content/renal-course";
import { emptyProgress, localDate, studyPlan } from "@/lib/learning-core";
import { recordVisit, updateLearning, useLearning } from "./learning-store";
import { PracticeQuestion } from "./practice-question";
import { practiceItems, practiceTopics } from "@/content/practice-registry";
import { practiceSummary } from "@/lib/learning-core";
export function StudyDashboard() {
  const { ready, data, persistent } = useLearning();
  const [session, setSession] = useState<string[] | null>(null);
  const [subject, setSubject] = useState("all");
  const [showUnattempted, setShowUnattempted] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [confirm, setConfirm] = useState(false);
  useEffect(() => {
    recordVisit();
  }, []);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const refresh = () => setNow(Date.now());
    const timer = window.setInterval(refresh, 60000);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);
  if (!ready) return <p role="status">Loading your study progress…</p>;
  const mistakes = practiceItems.filter(
    (q) => data.answers[q.id] && !data.answers[q.id].lastCorrect,
  );
  const due = practiceItems.filter(
    (q) =>
      data.answers[q.id] &&
      (!data.answers[q.id].lastCorrect || data.answers[q.id].dueAt <= now),
  );
  const lastPracticed = practiceItems.filter((q) => data.answers[q.id]).sort((a, b) => data.answers[b.id].lastAt - data.answers[a.id].lastAt)[0];
  const next =
    renalLessons.find((l) => !data.lessons.includes(l.slug)) ?? renalLessons[0];
  function reset() {
    updateLearning(() => emptyProgress());
    setSession(null);
    setConfirm(false);
  }
  return (
    <div className="study-stack">
      <p className="study-notice">
        {persistent
          ? "No account is needed. Clearing site data removes your saved progress."
          : "Browser storage is unavailable. Progress may disappear when you leave."}
      </p>
      <div className="metric-row">
        <div>
          <strong>{renalLessons.filter((l) => data.lessons.includes(l.slug)).length}/{renalLessons.length}</strong>
          <span>Renal lessons marked complete</span>
        </div>
        <div>
          <strong>{Object.keys(data.answers).length}/{practiceItems.length}</strong>
          <span>Questions attempted</span>
        </div>
        <div>
          <strong>{due.length}</strong>
          <span>Questions due</span>
        </div>
        <div>
          <strong>{data.visits.length}</strong>
          <span>Study days</span>
        </div>
      </div>
      <section className="study-panel">
        <p className="eyebrow">Your next ten minutes</p>
        <h2>
          {due.length
            ? "Revisit what needs practice."
            : "Build the next connection."}
        </h2>
        <p>
          Wrong answers remain due. Correct answers return after approximately
          1, 3, 7, 14 and 30 days of successive correct reviews. This is a
          simple review schedule. A retry within 24 hours or an answer made with a hint does not advance the schedule. These counts do not measure exam readiness.
        </p>
        <div className="action-row">
          <Link
            className="button button-primary"
            href={lastPracticed?.href ?? renalLessonHref(next.slug)}
          >
            Continue learning
          </Link>
          <button
            className="button button-secondary"
            disabled={!due.length}
            onClick={() => (setReviewIndex(0), setSession(due.slice(0, 10).map((q) => q.id)))}
          >
            Review due questions ({due.length})
          </button>
          <button
            className="button button-secondary"
            disabled={!mistakes.length}
            onClick={() => (setReviewIndex(0), setSession(mistakes.map((q) => q.id)))}
          >
            Review my mistakes ({mistakes.length})
          </button>
        </div>
      </section>
      {session && (
        <div>
          <button className="text-link" onClick={() => setSession(null)}>
            Close review session
          </button>
          <p>Review item {reviewIndex + 1} of {session.length}</p>
          <PracticeQuestion freshAttempt key={session[reviewIndex]} item={practiceItems.find((q) => q.id === session[reviewIndex])!} title="Your review session" />
          <div className="action-row"><button className="button button-secondary" disabled={reviewIndex === 0} onClick={() => setReviewIndex(reviewIndex - 1)}>Previous review item</button><button className="button button-secondary" disabled={reviewIndex === session.length - 1} onClick={() => setReviewIndex(reviewIndex + 1)}>Next review item</button></div>
        </div>
      )}
      <section>
        <p className="eyebrow">Your practice map</p>
        <h2>Let your answers guide your revision.</h2>
        <p>Coverage shows how many questions you have attempted. Accuracy describes those attempts. Neither implies mastery. First-attempt scores stay unchanged when you correct an answer.</p>
        <label className="study-form">Filter practice map by subject<select value={subject} onChange={(e) => setSubject(e.target.value)}><option value="all">All subjects</option>{[...new Set(practiceTopics.map((t) => t.subject))].map((id) => <option key={id} value={id}>{id.replaceAll("-", " ")}</option>)}</select></label>
        <label><input type="checkbox" checked={showUnattempted} onChange={(e) => setShowUnattempted(e.target.checked)} /> Show topics I have not attempted</label>
        {!Object.keys(data.answers).length && !showUnattempted && <p>Your practice map starts with your first checked answer. Explore a <Link className="text-link" href="/subjects">subject learning path</Link>, then return here to review it.</p>}
        <div className="study-grid two">
          {practiceTopics.filter((t) => (subject === "all" || t.subject === subject) && (showUnattempted || practiceItems.some((q) => q.topic === t.id && data.answers[q.id]))).map((topic) => {
            const stats = practiceSummary(practiceItems.filter((q) => q.topic === topic.id).map((q) => q.id), data.answers);
            const status = !stats.attempted ? "Not started" : stats.latestCorrect < stats.attempted ? "Needs review" : stats.attempted < stats.total ? "In progress" : "All questions attempted";
            return <article key={topic.id} className="topic-progress"><Link className="text-link" href={topic.href}>{topic.title}</Link><p className="practice-status">{status}</p><progress aria-label={`${topic.title} question coverage`} max={stats.total} value={stats.attempted} /><p>Coverage: {stats.attempted} of {stats.total} attempted · {stats.total - stats.attempted} not attempted</p><p>Latest accuracy: {stats.attempted ? `${stats.latestCorrect} of ${stats.attempted} correct` : "No attempts yet"}</p><p>First-attempt accuracy: {stats.firstKnown ? `${stats.firstCorrect} of ${stats.firstKnown} recorded first attempts correct` : "Not recorded yet"}</p>{stats.correctedWithHelp > 0 && <p>{stats.correctedWithHelp} latest correct answers used a hint or a same-day retry.</p>}</article>;
          })}
        </div>
      </section>
      <section className="study-panel">
        <h2>Your activity</h2>
        <p>
          {data.quizzes} quiz sets completed · {data.shares} challenge links
          copied · {data.oral.length} oral topics self-assessed. These are your
          local activity counts, not site-wide analytics.
        </p>
        <div className="action-row">
          <Link className="text-link" href="/study/planner">
            Plan for my exam →
          </Link>
          <Link className="text-link" href="/practice/oral">
            Practise an oral answer →
          </Link>
        </div>
      </section>
      <details className="study-details">
        <summary>Manage study progress</summary>
        <p>
          Download a JSON record of this browser’s progress, or clear it. The
          saved lessons and activities are below. Clearing progress keeps those bookmarks.
        </p>
        <div className="action-row">
          <button
            className="button button-secondary"
            onClick={() => {
              const url = URL.createObjectURL(
                new Blob([JSON.stringify(data, null, 2)], {
                  type: "application/json",
                }),
              );
              const a = document.createElement("a");
              a.href = url;
              a.download = `wardhan-study-progress-${localDate()}.json`;
              a.click();
              setTimeout(() => URL.revokeObjectURL(url), 1000);
            }}
          >
            Download progress record
          </button>
          <button
            className="button button-secondary"
            onClick={() => setConfirm(true)}
          >
            Clear learning progress
          </button>
        </div>
        {confirm && (
          <div className="study-notice">
            <p>
              Clear all lesson, quiz, written-answer, oral and planner progress from this
              browser?
            </p>
            <button
              className="button button-secondary"
              onClick={() => setConfirm(false)}
            >
              Keep progress
            </button>{" "}
            <button className="button button-primary" onClick={reset}>
              Yes, clear progress
            </button>
          </div>
        )}
      </details>
    </div>
  );
}
export function ExamPlanner() {
  const { ready, data } = useLearning();
  const [date, setDate] = useState("");
  const [minutes, setMinutes] = useState(20);
  const [error, setError] = useState("");
  const [today] = useState(() => localDate());
  const result = data.plan
    ? studyPlan(
        data.plan.start,
        data.plan.date,
        data.plan.minutes,
        renalLessons,
      )
    : null;
  function create(event: React.FormEvent) {
    event.preventDefault();
    if (!studyPlan(today, date, minutes, renalLessons)) {
      setError(
        "Choose an exam date from tomorrow to one year away and 10–120 minutes per day.",
      );
      return;
    }
    updateLearning((s) => ({ ...s, plan: { start: today, date, minutes } }));
    setError("");
  }
  return (
    <div className="study-stack">
      <form className="study-panel study-form" onSubmit={create}>
        <label>
          Exam date
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
        <label>
          Minutes available each day
          <input
            type="number"
            min="10"
            max="120"
            step="5"
            required
            value={minutes}
            onChange={(e) => setMinutes(Number(e.target.value))}
          />
        </label>
        <button
          className="button button-primary"
          disabled={!ready}
          type="submit"
        >
          Build my plan
        </button>
        {error && <p role="alert">{error}</p>}
      </form>
      {data.plan && !result && (
        <p className="study-notice">
          Your saved exam date has arrived or is outside the planning window.
          Choose a new date to make a fresh plan.
        </p>
      )}
      {result && (
        <section aria-live="polite">
          <h2>
            {Math.max(
              0,
              Math.round(
                (Date.parse(`${data.plan!.date}T12:00:00Z`) -
                  Date.parse(`${today}T12:00:00Z`)) /
                  86400000,
              ),
            )}{" "}
            days until your exam
          </h2>
          <p>
            {data.plan!.minutes} minutes a day, starting {data.plan!.start}.
            Each line is a time box; a lesson can continue over two days. The
            schedule keeps its original dates when you return. Use the dashboard
            for questions due today, or build a new plan to change the schedule.
          </p>
          {result.unfinishedMinutes > 0 && (
            <p className="study-notice">
              This leaves about {result.unfinishedMinutes} minutes of the first
              learning-and-recall pass unfinished. Increase daily time or
              prioritise your weakest topics. This plan cannot guarantee full
              coverage.
            </p>
          )}
          <ol className="planner-list">
            {result.sessions.map((session) => (
              <li key={session.date}>
                <h3>
                  {new Date(`${session.date}T12:00:00`).toLocaleDateString(
                    undefined,
                    { weekday: "short", month: "short", day: "numeric" },
                  )}
                </h3>
                {session.tasks.map((task, i) => (
                  <p key={i}>
                    <strong>
                      {task.minutes} min · {task.kind}
                    </strong>
                    <br />
                    {task.slug ? (
                      <Link
                        className="text-link"
                        href={renalLessonHref(task.slug)}
                      >
                        {renalLessons.find((l) => l.slug === task.slug)?.title}
                      </Link>
                    ) : (
                      <Link className="text-link" href="/study">
                        Open my review queue →
                      </Link>
                    )}
                  </p>
                ))}
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}

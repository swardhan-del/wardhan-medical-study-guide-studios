"use client";
import { useState } from "react";
import { optionOrder } from "@/lib/option-order";
import { AirwayPressureDiagram } from "./airway-pressure-diagram";
import Link from "next/link";
import type { PracticeItem } from "@/content/practice-registry";
import { recordAnswer, recordVisit, useLearning } from "./learning-store";

export function PracticeQuestion({ item, title = "Check your understanding", freshAttempt = false }: { item: PracticeItem; title?: string; freshAttempt?: boolean }) {
  const { ready, data, persistent } = useLearning();
  const previous = data.answers[item.id];
  const [draft, setDraft] = useState<number | null | undefined>(freshAttempt ? null : undefined);
  const [submitted, setSubmitted] = useState<boolean | null>(freshAttempt ? false : null);
  const [feedbackSeen, setFeedbackSeen] = useState(false);
  const savedChoice = previous?.lastChoice;
  const choice = draft === undefined ? (typeof savedChoice === "number" && savedChoice < (item.options?.length ?? 0) ? savedChoice : null) : draft;
  const checked = submitted ?? (choice !== null && !!previous);
  const activityHref = item.href.split("#")[0] + (item.href.includes("?") ? "&" : "?") + "review=1" + (item.href.includes("#") ? "#" + item.href.split("#")[1] : "");
  if (!item.options || item.answer === undefined) return <section className="study-panel"><h3>{item.title}</h3><p>{item.prompt}</p><p>This question uses a specimen or a clinical data table. Open the activity to review it with its visual context.</p><Link className="button button-primary" href={activityHref}>Open activity →</Link></section>;
  return <section className="study-panel practice-question" aria-label={title}>
    <h3>{title}</h3>
    {item.id === "studio-respiratory-pressure-reading" && <AirwayPressureDiagram />}
    {previous && <p className="muted-note">Saved history: first attempt {previous.firstCorrect === null ? "not recorded" : previous.firstCorrect ? "correct" : "incorrect"}; latest attempt {previous.lastCorrect ? "correct" : "incorrect"}{previous.assisted ? " (same-day retry or hint used)" : ""}.</p>}
    {/* Scope the native radio group to this instance, including during streamed page replacement. */}
    <form onSubmit={event => event.preventDefault()}>
      <fieldset disabled={checked || !ready}><legend>{item.prompt}</legend><div className="concept-options">{optionOrder(item.id, item.options.length).map(i => <label key={item.options![i].text}><input type="radio" name={item.id} checked={choice === i} onChange={() => setDraft(i)} /><span>{item.options![i].text}</span></label>)}</div></fieldset>
    </form>
    <button className="button button-primary" disabled={!ready || choice === null || checked} onClick={() => { if (choice === null) return; recordAnswer(item.id, choice === item.answer, choice, feedbackSeen); recordVisit(); setSubmitted(true); }}>Check answer</button>
    {checked && <div className="concept-feedback" role="status"><p><strong>{choice === item.answer ? "Correct." : "Review the distinction."}</strong></p><p>Correct answer: {item.options[item.answer].text}</p><ul>{item.options.map((o, i) => <li key={o.text}><strong>{i === item.answer ? "Why it works" : "Why not"}: {o.text}</strong><p>{o.explanation}</p></li>)}</ul><p>Retries within 24 hours help you correct a misconception, but do not advance your spaced-review streak.</p><button className="button button-secondary" onClick={() => { setDraft(null); setSubmitted(false); setFeedbackSeen(true); }}>Try without feedback</button></div>}
    <p className="muted-note">{persistent ? "Saved on this browser. " : "Storage is unavailable; this session may not be saved. "}<Link href="/study">My Study →</Link></p>
  </section>;
}

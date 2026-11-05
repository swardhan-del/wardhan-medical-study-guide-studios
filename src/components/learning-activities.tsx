"use client";

import { useState } from "react";
import type { LearningActivity, ActivityFeedback, ExplanationActivity } from "@/lib/learning-activity";
import { checkActivityName, checkActivitySequence } from "@/lib/learning-activity";
import styles from "./learning-activities.module.css";

function ExplanationPractice({ activity }: { activity: ExplanationActivity }) {
  const [draft, setDraft] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  return <>
    <label htmlFor={`${activity.id}-draft`}>Write or outline your explanation</label>
    <textarea id={`${activity.id}-draft`} rows={5} maxLength={6000} value={draft} onChange={event => setDraft(event.target.value)} />
    <p className={styles.note}>Your draft stays on this page, is not sent anywhere, and clears when you leave. No automated essay score is assigned.</p>
    <button type="button" aria-expanded={revealed} aria-controls={`${activity.id}-rubric`} onClick={() => setRevealed(!revealed)}>{revealed ? "Hide comparison" : "Compare with the rubric"}</button>
    {revealed && <div className={styles.screenRubric} id={`${activity.id}-rubric`}>
      <p>Mark only points your explanation actually includes. These are your own checks, not an automated assessment.</p>
      <fieldset><legend>Evidence in my explanation</legend>{activity.criteria.map(criterion => <label className={styles.criterion} key={criterion.id}>
        <input type="checkbox" checked={checked.includes(criterion.id)} onChange={event => setChecked(previous => event.target.checked ? [...previous, criterion.id] : previous.filter(id => id !== criterion.id))} />
        <span><strong>{criterion.label}</strong><br />{criterion.explanation}</span>
      </label>)}</fieldset>
      <p role="status">You marked {checked.length} of {activity.criteria.length} rubric points.</p>
      <h4>One possible explanation</h4><p>{activity.model}</p>
      <p>Revise a missing connection in your draft, then explain it again without reading the model.</p>
    </div>}
    <div className={styles.printAnswer}><h4>Self-review rubric</h4><ul>{activity.criteria.map(c => <li key={c.id}>{c.label}: {c.explanation}</li>)}</ul><p>{activity.model}</p></div>
  </>;
}

function ActivityCard({ activity }: { activity: LearningActivity }) {
  const [answer, setAnswer] = useState("");
  const [order, setOrder] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<ActivityFeedback | null>(null);
  return <section className={styles.card} aria-labelledby={`${activity.id}-title`}>
    <p className="eyebrow">{activity.kind === "name" ? "Retrieve a name" : activity.kind === "sequence" ? "Build a sequence" : "Explain and self-review"}</p>
    <h3 id={`${activity.id}-title`}>{activity.prompt}</h3>
    <p><strong>Objective:</strong> {activity.objective}</p>
    {activity.kind === "name" && <>
      <label htmlFor={`${activity.id}-answer`}>Short name</label>
      <input id={`${activity.id}-answer`} maxLength={200} autoComplete="off" value={answer} onChange={event => { setAnswer(event.target.value); setFeedback(null); }} />
      <button type="button" onClick={() => setFeedback(checkActivityName(answer, activity))}>Check name</button>
      <p className={styles.note}>Exact listed synonyms only. Unrecognised wording and sentences remain unassessed.</p>
      <details><summary>Reveal the name and explanation</summary><p>{activity.accepted[0]} — {activity.explanation}</p></details>
    </>}
    {activity.kind === "sequence" && <>
      <div className={styles.choices} aria-label="Available stages">{activity.presentation.map(id => {
        const stage = activity.stages.find(item => item.id === id)!;
        return <button key={id} type="button" disabled={order.includes(id)} onClick={() => { setOrder(previous => [...previous, id]); setFeedback(null); }}>{stage.label}</button>;
      })}</div>
      <h4>Your sequence</h4>{order.length ? <ol>{order.map(id => <li key={id}>{activity.stages.find(stage => stage.id === id)!.label}</li>)}</ol> : <p>No stages selected.</p>}
      <div className={styles.choices}>
        <button type="button" onClick={() => setFeedback(checkActivitySequence(order, activity))}>Check order</button>
        <button type="button" disabled={!order.length} onClick={() => { setOrder(previous => previous.slice(0, -1)); setFeedback(null); }}>Undo last stage</button>
        <button type="button" onClick={() => { setOrder([]); setFeedback(null); }}>Reset sequence</button>
      </div>
      <details><summary>Review the sequence with explanations</summary><ol>{activity.stages.map(stage => <li key={stage.id}><strong>{stage.label}:</strong> {stage.explanation}</li>)}</ol></details>
    </>}
    {activity.kind === "explanation" && <ExplanationPractice activity={activity} />}
    <p role="status" className={styles.feedback}>{feedback?.message}</p>
    <p className={styles.note}>Reference: <a href={activity.reference.url}>{activity.reference.title}</a>.</p>
  </section>;
}

export function LearningActivities({ activities }: { activities: LearningActivity[] }) {
  if (!activities.length) return null;
  return <section className={styles.collection} aria-labelledby="reasoning-practice-title">
    <h2 id="reasoning-practice-title">Retrieve, reconstruct and explain</h2>
    <p>Try each task before revealing its answer. Use the explanations to correct the reasoning as well as the final name. These activities do not replace your existing saved questions.</p>
    {activities.map(activity => <ActivityCard key={activity.id} activity={activity} />)}
  </section>;
}

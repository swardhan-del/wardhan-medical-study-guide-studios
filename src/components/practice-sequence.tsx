"use client";
import Link from "next/link";
import { learningEvent } from "@/lib/learning-analytics";
import { useEffect, useRef, useState } from "react";
import type { PracticeItem } from "@/content/practice-registry";
import { checkpointFor } from "@/lib/checkpoint-adapter";
import { nextCheckpointIndex, reinforcementVariant, type CheckpointOutcome } from "@/lib/conceptual-checkpoint";
import { PracticeQuestion } from "./practice-question";
import { useLearning, updateLearning } from "./learning-store";
export type PracticeEntry = { item: PracticeItem; title?: string };
type PracticeSequenceProps = { entries: PracticeEntry[]; title?: string; freshAttempt?: boolean; variants?: PracticeEntry[]; completionId?: string };
export function PracticeSequence(props: PracticeSequenceProps) {
  return <SequenceState key={props.entries.map(entry => entry.item.id).join("|")} {...props}/>;
}
function SequenceState({ entries, title = "Lesson practice", freshAttempt = false, variants = [], completionId }: PracticeSequenceProps) {
  const { ready, data } = useLearning();
  const [index, setIndex] = useState(0), [showAll, setShowAll] = useState(false), [finished, setFinished] = useState(false), [round, setRound] = useState(0);
  const [results, setResults] = useState<Record<string, CheckpointOutcome>>({});
  const [extra, setExtra] = useState<PracticeEntry[]>([]);
  const [previousId, setPreviousId] = useState<string | null>(null);
  const initialized = useRef(false), heading = useRef<HTMLHeadingElement>(null);
  const focusFeedback = useRef(false), counted = useRef(false);
  const region = useRef<HTMLElement>(null);
  const fresh = freshAttempt || round > 0;
  const queue = [...entries, ...extra];
  function outcome(item: PracticeItem): CheckpointOutcome | undefined {
    return results[item.id] ?? (!fresh && ready ? data.checkpoints[item.id]?.outcome ?? (typeof data.answers[item.id]?.lastChoice === "number" ? data.answers[item.id].lastCorrect ? "correct" : "incorrect" : undefined) : undefined);
  }
  useEffect(() => {
    if (!ready || initialized.current) return;
    initialized.current = true;
    const fragment = window.location.hash.slice(1);
    const linked = entries.findIndex(({ item }) => fragment === `question-${item.id}` || (fragment && item.href.split("#")[1] === fragment));
    const done = !freshAttempt ? entries.filter(({ item }) => data.checkpoints[item.id] || typeof data.answers[item.id]?.lastChoice === "number").map(({ item }) => item.id) : [];
    const restoredVariants = !freshAttempt ? variants.filter(({ item: candidate }) => entries.some(({ item }) => data.checkpoints[item.id]?.outcome === "incorrect" && checkpointFor(item)?.variants?.includes(candidate.id))) : [];
    queueMicrotask(() => {
    setExtra(restoredVariants);
    const all = [...entries, ...restoredVariants];
    for (const { item } of restoredVariants) if (data.checkpoints[item.id]) done.push(item.id);
    const first = nextCheckpointIndex(all.map(e => e.item.id), done, -1);
    setIndex(linked >= 0 ? linked : first >= 0 ? first : 0);
    setFinished(linked < 0 && first < 0);
    if (linked >= 0) requestAnimationFrame(() => heading.current?.focus());
    if (done.length) setPreviousId(done.at(-1)!);
    });
  }, [ready, data, entries, freshAttempt, variants]);
  useEffect(() => {
    function follow() {
      const fragment = window.location.hash.slice(1);
      const linked = entries.findIndex(({ item }) => fragment === `question-${item.id}` || (fragment && item.href.split("#")[1] === fragment));
      if (linked >= 0) { setIndex(linked); setFinished(false); setShowAll(false); requestAnimationFrame(() => heading.current?.focus()); }
    }
    window.addEventListener("hashchange", follow);
    return () => window.removeEventListener("hashchange", follow);
  }, [entries]);
  useEffect(() => {
    if (!focusFeedback.current || !previousId) return;
    const feedback = region.current?.querySelector<HTMLElement>(`#question-${previousId} [data-feedback] h4`);
    if (feedback) { feedback.focus({ preventScroll: true }); feedback.scrollIntoView({ block: "nearest", behavior: "instant" }); }
    focusFeedback.current = false;
  }, [results, previousId, index, finished]);
  if (!queue.length) return null;
  const outcomes = queue.map(({ item }) => outcome(item));
  const checked = outcomes.filter(Boolean).length;
  const missed = queue.filter(({ item }) => outcome(item) === "incorrect" || data.checkpoints[item.id]?.selfAssessment === "review");
  function complete(item: PracticeItem, result: CheckpointOutcome) {
    const updated = { ...results, [item.id]: result };
    focusFeedback.current = true;
    setResults(updated); setPreviousId(item.id);
    const done = queue.filter(({ item: q }) => updated[q.id] || outcome(q)).map(({ item: q }) => q.id);
    let nextQueue = queue;
    const definition = checkpointFor(item);
    if (result === "incorrect" && definition) {
      const id = reinforcementVariant(definition, variants.map(e => e.item.id), done, queue.map(e => e.item.id));
      const variant = variants.find(e => e.item.id === id);
      if (variant) { setExtra([...extra, variant]); nextQueue = [...queue, variant]; }
    }
    const next = nextCheckpointIndex(nextQueue.map(e => e.item.id), done, index);
    if (next < 0 && completionId && !counted.current) { counted.current = true; updateLearning(s => ({ ...s, quizzes: s.quizzes + 1 })); learningEvent({ version: 1, event: "quiz_completed", quiz_id: completionId }); }
    if (!showAll) { setFinished(next < 0); if (next >= 0) setIndex(next); }
    // The post-render effect focuses the retained explanation, never an offscreen heading.
  }
  return <section ref={region} className="practice-sequence" aria-label={`${title} sequence`}>
    <noscript><style>{".practice-sequence [data-sequence-question][hidden] { display: block !important; }"}</style><p>All checkpoint models are available below for reading without interactive grading.</p></noscript>
    <h3 ref={heading} tabIndex={-1}>{finished ? `${title}: results` : `${title}: ${showAll ? "all questions" : `question ${index + 1}`}`}</h3>
    <div className="quiz-position"><p aria-live="polite">{finished ? `${checked} of ${queue.length} checkpoints reviewed` : `Question ${index + 1} of ${queue.length}`}. Previous feedback remains available below.</p><progress aria-label={`${title}: questions checked`} value={checked} max={queue.length}/></div>
    <p className="muted-note">Check once to see the explanation and open the next checkpoint. Written explanations use self-assessment. A completed practice set does not certify complete subject coverage or mastery.</p>
    <button className="button button-secondary" aria-pressed={showAll} disabled={!ready} onClick={() => { setShowAll(!showAll); setFinished(false); }}>{showAll ? "Show one question at a time" : "Show all questions"}</button>
    {queue.map(({ item, title: label }, position) => {
      const active = !finished && position === index;
      const previous = item.id === previousId && !active;
      const reviewed = !!outcome(item);
      return <div key={`${round}-${item.id}`} hidden={!showAll && !active && !previous && !(finished && reviewed)} data-sequence-question={item.id} data-active-checkpoint={active ? "true" : undefined}>
        {previous && <h4>Previous checkpoint — keep the relationship in view</h4>}
        <PracticeQuestion item={item} title={label} freshAttempt={fresh} feedbackOnly={!showAll && !active && reviewed} onReset={() => { setIndex(position); setFinished(false); }} onComplete={evaluation => complete(item, evaluation.outcome)}/>
      </div>;
    })}
    {!finished && !showAll && !checkpointFor(queue[index].item) && <button className="button button-secondary" onClick={() => { if (index + 1 < queue.length) setIndex(index + 1); else setFinished(true); }}>Continue reading (activity remains unassessed)</button>}
    <details><summary>Checkpoint history and navigation</summary><ol>{queue.map(({ item }, position) => <li key={item.id}><button className="text-link" onClick={() => { setIndex(position); setFinished(false); }}>{position + 1}. {item.prompt}</button> — {outcome(item)?.replaceAll("-", " ") ?? "not checked"}</li>)}</ol><button className="button button-secondary" onClick={() => setFinished(true)}>See my results</button></details>
    {finished && <div className="study-panel practice-results"><h4>Your next step</h4><ul><li>{outcomes.filter(o => o === "correct").length} correct</li><li>{outcomes.filter(o => o === "incorrect").length} incorrect — review the relationship</li><li>{outcomes.filter(o => o === "self-review" || o === "unassessed").length} model comparisons, without an objective score</li><li>{queue.length - checked} not checked</li></ul>{missed.map(({ item }) => <p key={item.id}><button className="text-link" onClick={() => { setIndex(queue.findIndex(e => e.item.id === item.id)); setFinished(false); }}>Review: {item.prompt}</button>{(data.checkpoints[item.id]?.misses ?? 0) >= 2 ? " — this relationship has needed review more than once" : ""}</p>)}<p>Reinforcement uses a different, explicitly linked example where one is available. Relationships without a verified variant stay on your review list.</p><Link className="button button-secondary" href="/study">My Study</Link><button className="button button-primary" onClick={() => { counted.current = false; setRound(round + 1); setResults({}); setExtra([]); setPreviousId(null); setIndex(0); setFinished(false); setShowAll(false); }}>Try this set again</button></div>}
  </section>;
}

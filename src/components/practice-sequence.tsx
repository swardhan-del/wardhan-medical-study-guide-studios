"use client";
import { useEffect, useRef, useState } from "react";
import type { PracticeItem } from "@/content/practice-registry";
import { PracticeQuestion } from "./practice-question";
import { useLearning } from "./learning-store";

export type PracticeEntry = { item: PracticeItem; title?: string };

export function PracticeSequence({ entries, title = "Lesson practice", freshAttempt = false }: {
  entries: PracticeEntry[];
  title?: string;
  freshAttempt?: boolean;
}) {
  const { ready, data } = useLearning();
  const [index, setIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [finished, setFinished] = useState(false);
  const [round, setRound] = useState(0);
  const [results, setResults] = useState<Record<string, boolean | null>>({});
  const heading = useRef<HTMLHeadingElement>(null);
  const focusRequested = useRef(false);
  const freshRound = freshAttempt || round > 0;

  useEffect(() => {
    // Preserve existing question/activity fragments, including links from My Study.
    function followFragment() {
      const fragment = window.location.hash.slice(1);
      if (!fragment || fragment === "concept-check-title") return;
      const target = entries.findIndex(({ item }) =>
        fragment === `question-${item.id}` || item.href.split("#")[1] === fragment);
      if (target >= 0) {
        setIndex(target);
        setFinished(false);
        // The heading remains mounted even when the target is already active.
        heading.current?.focus({ preventScroll: true });
        heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
      }
    }
    followFragment();
    window.addEventListener("hashchange", followFragment);
    return () => window.removeEventListener("hashchange", followFragment);
  }, [entries]);

  useEffect(() => {
    if (!focusRequested.current) return;
    heading.current?.focus({ preventScroll: true });
    heading.current?.scrollIntoView({ block: "start", behavior: "instant" });
    focusRequested.current = false;
  }, [index, finished, round]);

  function resultFor(item: PracticeItem): boolean | null {
    if (Object.hasOwn(results, item.id)) return results[item.id];
    if (freshRound || !ready) return null;
    const saved = data.answers[item.id];
    return saved && typeof saved.lastChoice === "number" && saved.lastChoice >= 0 && saved.lastChoice < (item.options?.length ?? 0)
      ? saved.lastCorrect : null;
  }
  function move(next: number) {
    focusRequested.current = true;
    setIndex(next);
    setFinished(false);
  }
  function restart() {
    focusRequested.current = true;
    setRound(round + 1);
    setResults({});
    setIndex(0);
    setShowAll(false);
    setFinished(false);
  }

  if (!entries.length) return null;
  const active = entries[index] ?? entries[0];
  const outcomes = entries.map(({ item }) => resultFor(item));
  const correct = outcomes.filter(value => value === true).length;
  const incorrect = outcomes.filter(value => value === false).length;
  const checked = correct + incorrect;
  const contextual = !active.item.options || active.item.answer === undefined;
  return <section className="practice-sequence" aria-label={`${title} sequence`}>
    <h3 ref={heading} tabIndex={-1}>{finished ? `${title}: results` : `${title}: ${showAll ? "all questions" : `question ${index + 1}`}`}</h3>
    <div className="quiz-position">
      <p aria-live="polite">{finished ? `${checked} of ${entries.length} questions checked` : showAll ? `All ${entries.length} questions` : `Question ${index + 1} of ${entries.length}`}</p>
      <progress aria-label={`${title}: questions checked`} value={checked} max={entries.length} />
    </div>
    <p className="muted-note">Check an answer, read why it is right or wrong, then continue. {freshRound ? "This is a fresh practice round; previous history is preserved." : "Saved checked answers are restored; use “Try this set again” for a fresh round."}</p>
    {!finished ? <div className="action-row">
      <button className="button button-secondary" disabled={!ready} aria-pressed={showAll} onClick={() => setShowAll(!showAll)}>{showAll ? "Show one question at a time" : "Show all questions"}</button>
      {showAll ? <button className="button button-secondary" disabled={!ready} onClick={() => { focusRequested.current = true; setFinished(true); }}>See my results</button> : null}
    </div> : null}
    {entries.map(({ item, title: questionTitle }, position) => <div key={`${round}-${item.id}`} hidden={finished || (!showAll && position !== index)} data-sequence-question={item.id}>
      <PracticeQuestion item={item} title={questionTitle} freshAttempt={freshRound} onAnswerState={value => setResults(previous => ({ ...previous, [item.id]: value }))} />
    </div>)}
    {!finished && !showAll ? <nav className="action-row" aria-label={`${title}: question navigation`}>
      <button className="button button-secondary" disabled={index === 0} onClick={() => move(index - 1)}>Previous question</button>
      <button className="button button-primary" disabled={!ready || (!contextual && resultFor(active.item) === null)} onClick={() => {
        if (index < entries.length - 1) move(index + 1);
        else { focusRequested.current = true; setFinished(true); }
      }}>{index === entries.length - 1 ? "See my results" : "Next question"}</button>
      {!contextual && resultFor(active.item) === null ? <p className="muted-note">Check this answer to continue.</p> : null}
    </nav> : null}
    {finished ? <div className="study-panel practice-results" role="status">
      <h4>Your next step</h4>
      <ul><li>{correct} correct</li><li>{incorrect} incorrect — revisit these explanations</li><li>{entries.length - checked} not checked</li></ul>
      <p>These are {freshRound ? "this round’s" : "your latest saved"} checked answers, not a measure of mastery or exam readiness. First-attempt history stays unchanged when you retry.</p>
      {entries.map(({ item }, position) => outcomes[position] === false ? <p key={item.id}><button className="text-link" onClick={() => move(position)}>Review question {position + 1}: {item.prompt}</button></p> : null)}
      <div className="action-row"><button className="button button-primary" onClick={restart}>Try this set again</button><button className="button button-secondary" onClick={() => move(0)}>Review this set</button></div>
    </div> : null}
  </section>;
}

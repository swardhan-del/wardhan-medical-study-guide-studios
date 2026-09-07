"use client";

import { SavedRecall, SavedSelfCheck } from "./saved-recall";
import { useRef, useState } from "react";
import practice from "@/content/thorax-practice.json";
import { ThoraxMap } from "@/components/thorax-map";

export type AnatomyAnswers = Record<string, { choice: number; checked: boolean }>;
type Props = {
  answers: AnatomyAnswers;
  onAnswer: (id: string, choice: number, checked: boolean) => void;
  onReset: (ids: string[]) => void;
};

function SourceLink({ source }: { source: string }) {
  const reference = practice.sources.find((item) => item.id === source);
  return reference ? <a href={reference.url} className="msk-reference">Read the reference: {reference.title} →</a> : null;
}

function ThoraxQuestions({ answers, onAnswer, onReset }: Props) {
  const [index, setIndex] = useState(0);
  const [reviewIds, setReviewIds] = useState<string[] | null>(null);
  const heading = useRef<HTMLLegendElement>(null);
  const queue = reviewIds ? reviewIds.map((id) => practice.questions.find((item) => item.id === id)!) : practice.questions;
  const question = queue[index];
  const response = answers[question.id];
  const checked = practice.questions.filter((item) => answers[item.id]?.checked);
  const correct = checked.filter((item) => answers[item.id].choice === item.answer).length;
  const missed = checked.filter((item) => answers[item.id].choice !== item.answer);
  function focusQuestion() { heading.current?.focus(); }
  return (
    <section className="thorax-practice" aria-labelledby="thorax-practice-title">
      <p className="eyebrow">Test the relationships</p>
      <h4 id="thorax-practice-title">Twelve questions. Explain every answer.</h4>
      <p>Choose an answer before checking it. Each option has an explanation. You can change your answer, skip a question or return to one you missed.</p>
      <p className="thorax-quiz-progress" role="status">{correct} of 12 correct · {12 - checked.length} unanswered · {missed.length} to review</p>
      <div className="thorax-actions">
        <button type="button" disabled={!missed.length} onClick={() => { setReviewIds(missed.map((item) => item.id)); setIndex(0); focusQuestion(); }}>Review missed questions ({missed.length})</button>
        {reviewIds ? <button type="button" onClick={() => { setReviewIds(null); setIndex(0); focusQuestion(); }}>Return to all questions</button> : null}
        <button type="button" onClick={() => { onReset(practice.questions.map((item) => item.id)); setIndex(0); setReviewIds(null); focusQuestion(); }}>Reset thorax practice</button>
      </div>
      <form className="lesson-quiz thorax-question" onSubmit={(event) => { event.preventDefault(); if (response) onAnswer(question.id, response.choice, true); }}>
        <p className="eyebrow" aria-live="polite">{reviewIds ? "Review" : "Question"} {index + 1} of {queue.length}</p>
        <fieldset>
          <legend ref={heading} tabIndex={-1}>{question.prompt}</legend>
          {question.options.map((option, optionIndex) => <label className="quiz-option" key={`${question.id}-${optionIndex}`}>
            <input type="radio" name={`answer-${question.id}`} checked={response?.choice === optionIndex} onChange={() => onAnswer(question.id, optionIndex, false)} />
            <span>{option}</span>
          </label>)}
        </fieldset>
        <button type="submit" className="button button-primary" disabled={!response || response.checked}>Check thorax answer</button>
        <div className="quiz-feedback thorax-feedback" role="status" aria-live="polite">
          {response?.checked ? <>
            <p><strong>{response.choice === question.answer ? "Correct." : "Keep practicing."} Correct answer: {question.options[question.answer]}.</strong> {question.explanations[question.answer]}</p>
            <h5>Why the other answers do not fit</h5>
            <ul>{question.options.map((option, optionIndex) => optionIndex === question.answer ? null : <li key={option}><strong>{option}:</strong> {question.explanations[optionIndex]}</li>)}</ul>
            <SourceLink source={question.source} />
          </> : null}
        </div>
      </form>
      <div className="thorax-actions thorax-question-nav">
        <button type="button" disabled={index === 0} onClick={() => { setIndex((previous) => previous - 1); focusQuestion(); }}>← Previous question</button>
        <button type="button" disabled={index === queue.length - 1} onClick={() => { setIndex((previous) => previous + 1); focusQuestion(); }}>Next question →</button>
      </div>
      <div className="thorax-question-index" role="group" aria-label="Jump to a thorax question">
        {queue.map((item, itemIndex) => {
          const answer = answers[item.id];
          const state = !answer?.checked ? "unanswered" : answer.choice === item.answer ? "correct" : "needs review";
          return <button type="button" key={item.id} aria-label={`Question ${itemIndex + 1}, ${state}`} aria-pressed={index === itemIndex} data-state={state} onClick={() => { setIndex(itemIndex); focusQuestion(); }}>{itemIndex + 1}<span aria-hidden="true">{state === "correct" ? " ✓" : state === "needs review" ? " ↻" : ""}</span></button>;
        })}
      </div>
      {checked.length === 12 ? <p className="thorax-complete">{correct === 12 ? "All twelve questions correct. Now explain a relationship in your own words below." : `You have checked all twelve questions. Review the ${missed.length} you missed, then try a short answer below.`}</p> : null}
      <p className="thorax-small-note">Answers stay while you change topics on this page. Checked answers and written responses are saved in this browser and appear in My study. Reset starts a fresh round without deleting your history.</p>
    </section>
  );
}

function ThoraxRecall() {
  return (
    <section className="thorax-recall" aria-labelledby="thorax-recall-title">
      <p className="eyebrow">Say it in your own words</p>
      <h4 id="thorax-recall-title">Four short-answer challenges</h4>
      <p>Write or say your answer before opening the model. Use the checklist to assess it yourself; your writing is not automatically graded or sent anywhere.</p>
      {practice.oral.map((prompt, index) => <details className="thorax-recall-card" key={prompt.id}>
        <summary>{index + 1}. {prompt.prompt}</summary>
        <SavedRecall id={`oral-${prompt.id}`} label="Write your answer" />
        <details className="thorax-model-answer">
          <summary>Compare with the model answer</summary>
          <p>{prompt.answer}</p>
          <fieldset>
            <legend>My self-check</legend>
            {prompt.checklist.map((item, i) => <SavedSelfCheck key={item} id={`check-${prompt.id}-${i}`} label={item} />)}
          </fieldset>
        </details>
      </details>)}
    </section>
  );
}

export function ThoraxLab(props: Props) {
  return (
    <div className="thorax-lab">
      <nav className="thorax-jump-links" aria-label="Thorax learning activities">
        <a href="#thorax-map-title">Explore the image</a>
        <a href="#thorax-practice-title">Try 12 questions</a>
        <a href="#thorax-recall-title">Practice a short answer</a>
      </nav>
      <div className="thorax-explanations">
        {practice.sections.map((section) => <section key={section.title}><h4>{section.title}</h4><p>{section.text}</p></section>)}
      </div>
      <ThoraxMap />
      <ThoraxQuestions {...props} />
      <ThoraxRecall />
      <details className="thorax-references">
        <summary>Sources for this Thorax activity</summary>
        <p>Original summaries and questions developed from your curated Volume I, with the references below used to check anatomical relationships. Source check: {practice.reviewedAt}. This is an educational practice activity.</p>
        <ul>{practice.sources.map((source) => <li key={source.id}><a href={source.url}>{source.title}</a>{"sections" in source ? <p>{source.sections}</p> : null}</li>)}</ul>
      </details>
    </div>
  );
}

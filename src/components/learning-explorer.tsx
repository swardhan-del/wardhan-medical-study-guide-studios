"use client";

import Link from "next/link";
import { useState } from "react";
import type { StudyLesson } from "@/content/anatomy-learning";

export function LearningExplorer({ lessons }: { lessons: StudyLesson[] }) {
  const [active, setActive] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { choice: number; checked: boolean }>>({});
  const correct = lessons.filter((lesson) => answers[lesson.id]?.checked && answers[lesson.id]?.choice === lesson.answer).length;
  return (
    <section id="explore" className="learning-explorer" aria-labelledby="explorer-title">
      <header className="explorer-heading">
        <div><p className="eyebrow">Explore & recall</p><h2 id="explorer-title">Choose a topic.</h2></div>
        <p className="learning-progress" role="status" aria-live="polite">{correct} of {lessons.length} answered correctly this session</p>
      </header>
      <div className="explorer-layout">
        <div className="lesson-selector" role="group" aria-label="Choose a study topic">
          {lessons.map((lesson, index) => (
            <button key={lesson.id} type="button" aria-pressed={active === index} aria-controls={`lesson-${lesson.id}`} onClick={() => setActive(index)}>
              <span className="lesson-number">{String(index + 1).padStart(2, "0")}</span>{lesson.title}
            </button>
          ))}
        </div>
        <div className="lesson-workspace">
          {lessons.map((lesson, index) => {
            const response = answers[lesson.id];
            const isCorrect = response?.checked && response.choice === lesson.answer;
            return (
              <article className="lesson-panel" id={`lesson-${lesson.id}`} hidden={active !== index} key={lesson.id} aria-labelledby={`title-${lesson.id}`}>
                <p className="eyebrow">Topic {index + 1} of {lessons.length}</p>
                <h3 id={`title-${lesson.id}`}>{lesson.title}</h3>
                <p>{lesson.explanation}</p>
                <ul className="lesson-points">{lesson.points.map((point) => <li key={point}>{point}</li>)}</ul>
                <a className="msk-reference" href={`#source-${lesson.source}`}>Source: {lesson.reference} →</a>
                <form className="lesson-quiz" onSubmit={(event) => {
                  event.preventDefault();
                  if (!response) return;
                  setAnswers((previous) => ({ ...previous, [lesson.id]: { choice: response.choice, checked: true } }));
                }}>
                  <fieldset>
                    <legend>{lesson.question}</legend>
                    {lesson.options.map((option, optionIndex) => (
                      <label className="quiz-option" key={option}>
                        <input type="radio" name={`answer-${lesson.id}`} value={optionIndex} checked={response?.choice === optionIndex} onChange={() => setAnswers((previous) => ({ ...previous, [lesson.id]: { choice: optionIndex, checked: false } }))} />
                        <span>{option}</span>
                      </label>
                    ))}
                  </fieldset>
                  <button className="button button-primary" type="submit" disabled={!response}>Check answer</button>
                  <div className="quiz-feedback" role="status" aria-live="polite">
                    {response?.checked ? <p><strong>{isCorrect ? "Correct." : "Try again."}</strong> {lesson.feedback}</p> : null}
                  </div>
                </form>
                {lesson.related ? <Link className="text-link" href={lesson.related.href}>{lesson.related.label} →</Link> : null}
              </article>
            );
          })}
          <div className="lesson-pagination">
            <button type="button" className="plain-button" disabled={active === 0} onClick={() => setActive((index) => index - 1)}>← Previous topic</button>
            <button type="button" className="plain-button" disabled={active === lessons.length - 1} onClick={() => setActive((index) => index + 1)}>Next topic →</button>
          </div>
        </div>
      </div>
    </section>
  );
}

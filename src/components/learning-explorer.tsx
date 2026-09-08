"use client";

import { recordAnswer, recordVisit, useLearning } from "./learning-store";
import Link from "next/link";
import { useState } from "react";
import type { StudyLesson } from "@/content/anatomy-learning";
import { ThoraxLab, type AnatomyAnswers } from "@/components/thorax-lab";
import thoraxPractice from "@/content/thorax-practice.json";

export function LearningExplorer({ lessons, initialLessonId }: { lessons: StudyLesson[]; initialLessonId?: string }) {
  const [active, setActive] = useState(Math.max(0, lessons.findIndex((l) => l.id === initialLessonId)));
  const { data, ready } = useLearning();
  const [drafts, setDrafts] = useState<AnatomyAnswers>({});
  const [resetIds, setResetIds] = useState<string[]>([]);
  const storedId = (id: string) => id.startsWith("thorax-") ? id : "anatomy-" + id;
  const answers: AnatomyAnswers = Object.fromEntries(Object.entries(data.answers).filter(([id, a]) => (id.startsWith("thorax-") || id.startsWith("anatomy-")) && a.lastChoice !== null).map(([id, a]) => [id.replace(/^anatomy-/, ""), { choice: a.lastChoice!, checked: true }]));
  for (const id of resetIds) delete answers[id];
  Object.assign(answers, drafts);
  function answer(id: string, choice: number, checked: boolean, correct: number) {
    setDrafts((previous) => ({ ...previous, [id]: { choice, checked } }));
    if (checked) { recordAnswer(storedId(id), choice === correct, choice); recordVisit(); }
  }
  const questions = lessons.flatMap<{ id: string; answer: number }>((lesson) => lesson.activity === "thorax" ? thoraxPractice.questions : [lesson]);
  const correct = questions.filter((question) => answers[question.id]?.checked && answers[question.id]?.choice === question.answer).length;
  return (
    <section id="explore" className="learning-explorer" aria-labelledby="explorer-title">
      <header className="explorer-heading">
        <div><p className="eyebrow">Explore & recall</p><h2 id="explorer-title">Choose a topic.</h2></div>
        <p className="learning-progress" role="status" aria-live="polite">{correct} of {questions.length} answered correctly in this round · history saved in My Study</p>
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
                {lesson.activity === "thorax" ? <ThoraxLab answers={answers}
                  onAnswer={(id, choice, checked) => answer(id, choice, checked, thoraxPractice.questions.find((q) => q.id === id)!.answer)}
                  onReset={(ids) => { setResetIds((previous) => [...new Set([...previous, ...ids])]); setDrafts((previous) => Object.fromEntries(Object.entries(previous).filter(([id]) => !ids.includes(id)))); }}
                /> : <form className="lesson-quiz" onSubmit={(event) => {
                  event.preventDefault();
                  if (!response || response.checked) return;
                  answer(lesson.id, response.choice, true, lesson.answer);
                }}>
                  <fieldset>
                    <legend>{lesson.question}</legend>
                    {lesson.options.map((option, optionIndex) => (
                      <label className="quiz-option" key={option}>
                        <input type="radio" name={`answer-${lesson.id}`} value={optionIndex} checked={response?.choice === optionIndex} onChange={() => answer(lesson.id, optionIndex, false, lesson.answer)} />
                        <span>{option}</span>
                      </label>
                    ))}
                  </fieldset>
                  <button className="button button-primary" type="submit" disabled={!ready || !response || response.checked}>Check answer</button>
                  <div className="quiz-feedback" role="status" aria-live="polite">
                    {response?.checked ? <p><strong>{isCorrect ? "Correct." : "Try again."}</strong> {lesson.feedback}</p> : null}
                  </div>
                </form>}
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

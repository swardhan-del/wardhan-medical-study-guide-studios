"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { learningEvent } from "@/lib/learning-analytics";
import {
  renalLessonHref,
  renalLessons,
  type RenalQuestion,
} from "@/content/renal-course";
import {
  recordAnswer,
  recordVisit,
  updateLearning,
  useLearning,
} from "./learning-store";
export function RenalQuiz({
  questions,
  title = "Test your understanding",
  quizId = "lesson",
}: {
  questions: RenalQuestion[];
  title?: string;
  quizId?: string;
}) {
  const [index, setIndex] = useState(0);
  const promptRef = useRef<HTMLLegendElement>(null);
  useEffect(() => {
    if (index > 0) {
      promptRef.current?.focus({ preventScroll: true });
      promptRef.current?.scrollIntoView({ behavior: "instant", block: "start" });
    }
  }, [index]);
  const [choice, setChoice] = useState<number | null>(null);
  const [results, setResults] = useState<Record<string, number>>({});
  const { ready, persistent, data } = useLearning();
  const [finished, setFinished] = useState(false);
  useEffect(() => {
    recordVisit();
  }, []);
  const question = questions[index];
  if (!question)
    return <p>No questions in this session. Choose another activity.</p>;
  const checked = results[question.id] !== undefined;
  const correct = Object.entries(results).filter(
    ([id, picked]) => questions.find((q) => q.id === id)?.answer === picked,
  ).length;
  const missed = questions.filter(
    (q) => results[q.id] !== undefined && results[q.id] !== q.answer,
  );
  function check() {
    if (choice === null || checked) return;
    if (Object.keys(results).length === 0)
      learningEvent("quiz_started", { set: quizId });
    setResults((previous) => ({ ...previous, [question.id]: choice }));
    recordAnswer(question.id, choice === question.answer, choice);
  }
  function next() {
    if (index === questions.length - 1) {
      learningEvent("quiz_completed", { set: quizId });
      setFinished(true);
      updateLearning((s) => ({ ...s, quizzes: s.quizzes + 1 }));
    } else {
      setIndex(index + 1);
      setChoice(null);
    }
  }
  function restart() {
    setIndex(0);
    setChoice(null);
    setResults({});
    setFinished(false);
  }
  return (
    <section className="study-panel renal-quiz" aria-label={title}>
      <p className="eyebrow">Active recall · {questions.length} questions</p>
      <h2>{title}</h2>
      <p className="muted-note">Checked answers are saved in My Study. This quiz opens a fresh practice round; earlier results remain in your history. Same-day retries do not advance spaced review.</p>
      {!persistent && (
        <p className="study-notice" role="status">
          Browser storage is unavailable. This session works, but progress may
          be lost when you leave.
        </p>
      )}
      {finished ? (
        <div className="quiz-result" aria-live="polite">
          <p className="score-number">
            {correct}
            <span> / {questions.length}</span>
          </p>
          <h3>Here is your next step.</h3>
          <p>
            {missed.length
              ? "Revisit these explanations, then try your mistakes again."
              : "You answered every question correctly. Return tomorrow for a spaced review."}
          </p>
          {Array.from(new Set(missed.map((q) => q.lesson))).map((slug) => (
            <p key={slug}>
              <Link className="text-link" href={renalLessonHref(slug)}>
                {renalLessons.find((l) => l.slug === slug)?.title} →
              </Link>
            </p>
          ))}
          <div className="action-row">
            <Link className="button button-primary" href="/study">
              My Study
            </Link>
            <button className="button button-secondary" onClick={restart}>
              Try this set again
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="quiz-position">
            <span>
              Question {index + 1} of {questions.length}
            </span>
            <progress
              aria-label="Questions checked"
              value={Object.keys(results).length}
              max={questions.length}
            />
          </div>
          {data.answers[question.id] && <p className="muted-note">Previous history: first attempt {data.answers[question.id].firstCorrect === null ? "not recorded" : data.answers[question.id].firstCorrect ? "correct" : "incorrect"}; latest answer {data.answers[question.id].lastCorrect ? "correct" : "incorrect"}.</p>}
          <fieldset
            key={question.id}
            className="quiz-choices"
            disabled={checked}
          >
            <legend ref={promptRef} tabIndex={-1}>
              {question.prompt}
            </legend>
            {question.options.map((option, i) => (
              <label
                key={option.text}
                className={`quiz-option${choice === i ? " selected" : ""}`}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  checked={choice === i}
                  onChange={() => setChoice(i)}
                />
                <span>{option.text}</span>
              </label>
            ))}
          </fieldset>
          {checked && (
            <div className="answer-explanation" role="status">
              <h3>
                {results[question.id] === question.answer
                  ? "Correct."
                  : "A useful mistake to learn from."}
              </h3>
              <p>
                <strong>Correct answer:</strong>{" "}
                {question.options[question.answer].text}
              </p>
              <ul>
                {question.options.map((option, i) => (
                  <li key={option.text}>
                    <strong>
                      {i === question.answer
                        ? "Why it works"
                        : `Why not “${option.text}”`}
                      :
                    </strong>{" "}
                    {option.explanation}
                  </li>
                ))}
              </ul>
              <Link
                className="text-link"
                href={renalLessonHref(question.lesson)}
              >
                Read the related explanation →
              </Link>
            </div>
          )}
          <div className="action-row">
            {!checked ? (
              <button
                className="button button-primary"
                disabled={choice === null || !ready}
                onClick={check}
              >
                Check answer
              </button>
            ) : (
              <button className="button button-primary" onClick={next}>
                {index === questions.length - 1
                  ? "See my results"
                  : "Next question"}
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}

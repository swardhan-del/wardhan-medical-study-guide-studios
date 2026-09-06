"use client";
import { useState } from "react";
import type { LibraryLesson } from "@/lib/library-types";

export function ConceptCheck({
  lesson,
}: {
  lesson: Pick<LibraryLesson, "id" | "question">;
}) {
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const { question } = lesson;
  return (
    <section
      className="concept-check study-panel"
      aria-labelledby="concept-check-title"
    >
      <p className="eyebrow">Test the distinction</p>
      <h2 id="concept-check-title">Check your understanding</h2>
      <fieldset>
        <legend>{question.prompt}</legend>
        <div className="concept-options">
          {question.options.map((option, index) => (
            <label
              key={option.text}
              className={
                checked && index === question.answer ? "concept-correct" : ""
              }
            >
              <input
                type="radio"
                name={`check-${lesson.id}`}
                checked={selected === index}
                onChange={() => {
                  setSelected(index);
                  setChecked(false);
                }}
              />
              <span>{option.text}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <button
        className="button button-primary"
        disabled={selected === null}
        onClick={() => setChecked(true)}
      >
        Check answer
      </button>
      {checked && (
        <div className="concept-feedback" role="status">
          <h3>
            {selected === question.answer
              ? "Correct."
              : "Review the distinction."}
          </h3>
          <p>
            <strong>Correct answer:</strong>{" "}
            {question.options[question.answer].text}
          </p>
          <ul>
            {question.options.map((option, index) => (
              <li key={option.text}>
                <strong>
                  {index === question.answer ? "Why it works" : "Why not"}:{" "}
                  {option.text}
                </strong>
                <p>{option.reason}</p>
              </li>
            ))}
          </ul>
          <p>
            Change your choice to try again. This check stays in the current
            page session.
          </p>
        </div>
      )}
    </section>
  );
}

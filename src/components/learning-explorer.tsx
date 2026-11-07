"use client";

import { useLearning } from "./learning-store";
import Link from "next/link";
import { PracticeQuestion } from "./practice-question";
import { CheckpointFeedback } from "./conceptual-checkpoint";
import { checkpointFor } from "@/lib/checkpoint-adapter";
import { evaluateCheckpoint } from "@/lib/conceptual-checkpoint";
import { useEffect, useRef, useState } from "react";
import type { StudyLesson } from "@/content/anatomy-learning";
import { ThoraxLab } from "@/components/thorax-lab";
import thoraxPractice from "@/content/thorax-practice.json";

export function LearningExplorer({ lessons, initialLessonId }: { lessons: StudyLesson[]; initialLessonId?: string }) {
  const [active, setActive] = useState(Math.max(0, lessons.findIndex((l) => l.id === initialLessonId)));
  const { data } = useLearning();
  const [previousId, setPreviousId] = useState<string | null>(null);
  const storedId = (id: string) => id.startsWith("thorax-") ? id : "anatomy-" + id;
  const questions = lessons.flatMap<{ id: string; answer: number }>((lesson) => lesson.activity === "thorax" ? thoraxPractice.questions : [lesson]);
  const correct = questions.filter(q => data.answers[storedId(q.id)]?.lastCorrect).length;
  const itemFor = (lesson: StudyLesson) => ({ id: storedId(lesson.id), topic: storedId(lesson.id), title: lesson.title, subject: "anatomy", href: `#question-${storedId(lesson.id)}`, prompt: lesson.question, answer: lesson.answer, options: lesson.options.map(text => ({ text, explanation: lesson.feedback })) });
  const workspace = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!previousId) return;
    const heading = workspace.current?.querySelector<HTMLElement>(":scope > [data-feedback] h4");
    heading?.focus({ preventScroll: true }); heading?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [previousId]);
  const previous = lessons.find(l => l.id === previousId);
  const previousQuestion = previous ? checkpointFor(itemFor(previous)) : null;
  const previousChoice = previous ? data.answers[storedId(previous.id)]?.lastChoice : null;
  const previousEvaluation = previousQuestion && typeof previousChoice === "number" ? evaluateCheckpoint(previousQuestion, previousChoice) : null;
  return (
    <section id="explore" className="learning-explorer" aria-labelledby="explorer-title">
      <header className="explorer-heading">
        <div><p className="eyebrow">Explore & recall</p><h2 id="explorer-title">Choose a topic.</h2></div>
        <p className="learning-progress" role="status" aria-live="polite">{correct} of {questions.length} answered correctly on the latest attempt · history saved in My Study</p>
      </header>
      <div className="explorer-layout">
        <div className="lesson-selector" role="group" aria-label="Choose a study topic">
          {lessons.map((lesson, index) => (
            <button key={lesson.id} type="button" aria-pressed={active === index} aria-controls={`lesson-${lesson.id}`} onClick={() => setActive(index)}>
              <span className="lesson-number">{String(index + 1).padStart(2, "0")}</span>{lesson.title}
            </button>
          ))}
        </div>
        <div ref={workspace} className="lesson-workspace">
          {previous && previous.id !== lessons[active].id && previousQuestion && previousEvaluation && <CheckpointFeedback question={previousQuestion} evaluation={previousEvaluation}/>}
          {lessons.map((lesson, index) => {
            return (
              <article className="lesson-panel" id={`lesson-${lesson.id}`} hidden={active !== index} key={lesson.id} aria-labelledby={`title-${lesson.id}`}>
                <p className="eyebrow">Topic {index + 1} of {lessons.length}</p>
                <h3 id={`title-${lesson.id}`}>{lesson.title}</h3>
                <p>{lesson.explanation}</p>
                <ul className="lesson-points">{lesson.points.map((point) => <li key={point}>{point}</li>)}</ul>
                <a className="msk-reference" href={`#source-${lesson.source}`}>Source: {lesson.reference} →</a>
                {lesson.activity === "thorax" ? <ThoraxLab/> : <PracticeQuestion item={itemFor(lesson)} onComplete={() => { setPreviousId(lesson.id); if (index + 1 < lessons.length) setActive(index + 1); }}/>}
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

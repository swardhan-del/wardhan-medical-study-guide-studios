import type { LibraryLesson } from "@/lib/library-types";
import studio from "@/content/study-questions.json";
import transfer from "@/content/transfer-practice.json";
import { ConceptCheck } from "./concept-check";
import { PracticeQuestion } from "./practice-question";
import { SavedRecall, SavedSelfCheck } from "./saved-recall";
import type { ReactNode } from "react";
import styles from "./histology-foundations.module.css";

function TeachingParagraph({ text }: { text: string }) {
  const separator = text.indexOf(":");
  return <p>{separator > 0 && separator < 45 ? <><strong>{text.slice(0, separator + 1)}</strong>{text.slice(separator + 1)}</> : text}</p>;
}

type Props = {
  lesson: LibraryLesson;
  preparation: ReactNode;
  coreConcepts: ReactNode;
  visualStudy: ReactNode;
  explanationIntro: string;
  conceptTitle: string;
  applicationIntro: string;
  continuation: ReactNode;
};

export function FoundationsLessonContent({ lesson, preparation, coreConcepts, visualStudy, explanationIntro, conceptTitle, applicationIntro, continuation }: Props) {
  const knowledge = studio.questions.filter(q => q.topic === lesson.id);
  const applied = transfer.questions.filter(q => q.topic === lesson.id);
  return <div className={styles.lesson}>
    <section className="study-panel" aria-labelledby="lesson-objectives">
      <h2 id="lesson-objectives">Learning Objectives</h2>
      <ul>{lesson.objectives?.map(objective => <li key={objective}>{objective}</li>)}</ul>
      <p>{preparation}</p>
    </section>
    {coreConcepts}
    <section className="concept-explanations" aria-labelledby="concept-map-title">
      <h2 id="concept-map-title">Guided Explanation</h2>
      <p>{explanationIntro}</p>
      {lesson.steps.map((step, index) => <details open className={styles.explanation} key={step.title}>
        <summary>{index + 1}. {step.title}</summary>
        <div>{step.body.split("\n\n").map(paragraph => <TeachingParagraph key={paragraph} text={paragraph}/>)}</div>
      </details>)}
    </section>
    {visualStudy}
    {lesson.workedExample && <section className="study-panel" aria-labelledby="worked-example-heading">
      <h2 id="worked-example-heading">{lesson.workedExample.title}</h2>
      <p>{lesson.workedExample.prompt}</p>
      <details><summary>Show the reasoning</summary><ol>{lesson.workedExample.solution.map(step => <li key={step}>{step}</li>)}</ol></details>
    </section>}
    <section aria-labelledby="knowledge-check-heading">
      <h2 id="knowledge-check-heading">Knowledge Check</h2>
      <p>Select the single best answer to each question, then review the explanation. Use the feedback to identify the distinction you need to revisit.</p>
      <ConceptCheck lesson={lesson} title={conceptTitle}/>
      <span id="studio-practice"/>
      {knowledge.map((q, index) => <PracticeQuestion key={q.id} item={q} title={`Question ${index + 2}`}/>)}
    </section>
    <section aria-labelledby="application-heading" id="apply-the-concept">
      <h2 id="application-heading">Clinical and Applied Questions</h2>
      <p>{applicationIntro}</p>
      {applied.map((q, index) => <PracticeQuestion key={q.id} item={q} title={`Application Question ${index + 1}`}/>)}
    </section>
    <section className="concept-recall study-panel" aria-labelledby="oral-recall-title">
      <h2 id="oral-recall-title">Oral Examination Prompts</h2>
      <p>Explain each answer aloud before opening its model response. Include the observation, the reasoning and any limitation.</p>
      {lesson.oralExamination?.map((q, index) => <div key={q.prompt}>
        <h3>Prompt {index + 1}</h3><p>{q.prompt}</p>
        <details><summary>Model response {index + 1}</summary><p>{q.answer}</p></details>
      </div>)}
      <h3>Integrated explanation</h3><p>{lesson.recall.prompt}</p>
      <SavedRecall id={`oral-${lesson.id}`} label="My oral examination notes"/>
      <details><summary>Model integrated explanation</summary><p>{lesson.recall.answer}</p></details>
    </section>
    <section className="study-panel" aria-labelledby="summary-checklist-title">
      <h2 id="summary-checklist-title">Summary Checklist</h2>
      <p>Mark an objective when you can explain it without notes. Your selections are saved in this browser when storage is available.</p>
      <ul className={styles.checklist}>{lesson.summaryChecklist?.map((label, index) => <li key={label}><SavedSelfCheck id={`${lesson.id}-summary-${index + 1}`} label={label}/></li>)}</ul>
      <p>{continuation}</p>
    </section>
  </div>;
}

import path from "@/content/histology-guided-path.json";
import { practiceItems } from "@/content/practice-registry";
import styles from "./histology-guided-path.module.css";

export function HistologyGuidedPath() {
  const count = path.stages.reduce((total, stage) => total + stage.questionIds.length, 0);
  return <section className={styles.path} aria-labelledby="histology-guided-path-title">
    <p className="eyebrow">Four stages · {count} existing practice questions</p>
    <h2 id="histology-guided-path-title">{path.title}</h2>
    <p>{path.intro}</p>
    <nav aria-label="Deeper histology stages" className={styles.stageLinks}>
      {path.stages.map((stage, index) => <a key={stage.id} href={`#histology-path-${stage.id}`}>{index + 1}. {stage.title}</a>)}
      <a href="#histology-assay-case-title">Research reasoning exercise</a>
    </nav>
    <ol className={styles.stages}>
      {path.stages.map((stage, index) => <li key={stage.id} id={`histology-path-${stage.id}`}>
        <h3>{index + 1}. {stage.title}</h3>
        <p>{stage.explanation}</p>
        <p className={styles.goal}><strong>Your task:</strong> {stage.goal}</p>
        <ul aria-label={`${stage.title}: explanations and activities`}>
          {stage.links.map(link => <li key={link.href}><a href={link.href}>{link.label}</a></li>)}
        </ul>
        <details className={styles.questions}>
          <summary>Choose from {stage.questionIds.length} practice questions: stage {index + 1}</summary>
          <ol>
            {stage.questionIds.map(id => {
              const question = practiceItems.find(item => item.id === id);
              if (!question) throw new Error(`Unknown guided histology question: ${id}`);
              // Document navigation keeps repeated Back/fragment visits tied to the correct lesson.
              return <li key={id}><a href={`/library/${question.topic}#question-${id}`}>{question.prompt}</a><p className="muted-note">In {question.title}</p></li>;
            })}
          </ol>
        </details>
      </li>)}
    </ol>
    <section className={styles.research} aria-labelledby="histology-assay-case-title">
      <h3 id="histology-assay-case-title">{path.researchCase.title}</h3>
      <p>{path.researchCase.scenario}</p>
      <p>Form an answer before opening each model explanation. This exercise supports self-review; it does not automatically grade your reasoning.</p>
      {path.researchCase.prompts.map(prompt => <div key={prompt.title} className={styles.caseStep}>
        <h4>{prompt.title}</h4>
        <p>{prompt.prompt}</p>
        <details><summary>Compare your reasoning: {prompt.title.slice(3)}</summary>
          <p>{prompt.reasoning}</p>
          <ul aria-label={`${prompt.title}: references`}>
            {prompt.referenceIds.map(id => {
              const reference = path.researchCase.references.find(item => item.id === id)!;
              return <li key={id}><a href={reference.url}>{reference.title}</a><span className="muted-note"> — {reference.kind}</span></li>;
            })}
          </ul>
        </details>
      </div>)}
      <p><a href="#oral-histology-foundations-tissues">Write your explanation in your lesson notes</a>, then compare it with the model reasoning.</p>
    </section>
    <p><a href="#histology-guided-path-title">Return to the four stages</a> · <a href="#knowledge-check-heading">Return to the introductory Knowledge Check</a></p>
  </section>;
}

export function HistologyGuidedPathReturn({ lessonId }: { lessonId: string }) {
  const stage = path.stages.find(item => item.questionIds.some(id => practiceItems.some(question => question.id === id && question.topic === lessonId)));
  return stage ? <p className="study-notice"><a href={`/library/${path.lessonId}#histology-guided-path-title`}>Return to the guided histology path</a>: preparation, tissue identification, mechanisms and development.</p> : null;
}

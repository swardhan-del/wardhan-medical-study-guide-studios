import Link from "next/link";
import { thoraxPractice, type ThoraxUnit } from "@/content/thorax-models";
import { AnatomySystemExplorer } from "./anatomy-system-explorer";
import { PracticeSequence } from "./practice-sequence";
import { StudyVisual } from "./study-visual";
import { ThoraxModelDiagram } from "./thorax-model-diagram";
import styles from "./anatomy-systems.module.css";

export function ThoraxStudyUnit({ unit }: { unit: ThoraxUnit }) {
  const exercises = thoraxPractice(unit);

  return <section className={styles.practice} id="thorax-study" aria-labelledby="thorax-study-title">
    <header className={styles.header}>
      <h2 id="thorax-study-title">{unit.title}</h2>
      <p>{unit.objective}</p>
      <div className={styles.actions}>
        {unit.views.map(view => <a key={view.id} href={"#" + view.id}>{view.title}</a>)}
        <a href="#thorax-apply">Apply what you learned</a>
      </div>
    </header>
    {unit.views.map(view => <StudyVisual
      id={view.id} key={view.id} title={view.title}
      alt={view.landmarks.map(landmark => landmark.name + ". " + landmark.detail).join(" ")}
      caption={view.caption} observe={view.observe}
      credit="Original schematic · Wardhan Medical Study Guide Studios. AI-assisted teaching adaptation."
      sources={view.sources}
    >
      <AnatomySystemExplorer landmarks={view.landmarks} allowUnlabelledView><ThoraxModelDiagram view={view.id}/></AnatomySystemExplorer>
    </StudyVisual>)}
    <section className="study-panel" aria-labelledby="thorax-example">
      <h3 id="thorax-example">Worked routes</h3>
      <dl className={styles.examples}>{unit.examples.map(example => <div key={example.title}>
        <dt>{example.title}</dt><dd>{example.explanation}</dd>
      </div>)}</dl>
    </section>
    <section id="thorax-apply" aria-label="Apply what you learned">
      <PracticeSequence title="Thorax application" entries={exercises.map((item, index) => ({
        item, title: unit.exercises[index].title,
      }))}/>
    </section>
    <section className="study-panel" aria-labelledby="thorax-specimen">
      <h3 id="thorax-specimen">Try it on a real specimen</h3>
      <p>{unit.fieldwork.task}</p>
      <a href={unit.fieldwork.source.url}>{unit.fieldwork.source.title} (external)</a>
      <details><summary>Compare your observations</summary><p>{unit.fieldwork.compare}</p></details>
    </section>
    <div className={styles.actions}>
      <Link className="button button-secondary" href={unit.next.href}>{unit.next.label} →</Link>
      <Link href={unit.relatedLesson.href}>{unit.relatedLesson.label}</Link>
    </div>
  </section>;
}

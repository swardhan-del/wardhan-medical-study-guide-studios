import Link from "next/link";
import type { LibraryLesson } from "@/lib/library-types";
import { entryLessonGuides } from "@/content/entry-lesson-guides";
import { subjectHubs } from "@/content/subject-hubs";
import references from "@/content/lesson-references.json";
import { FoundationsLessonContent } from "./foundations-lesson-content";
import styles from "./subject-hub.module.css";

export function SubjectEntryContent({ lesson }: { lesson: LibraryLesson }) {
  const guide = entryLessonGuides[lesson.id];
  const hub = subjectHubs[lesson.subject];
  const refs = references as Record<string, { title: string; url: string; supportingReferences?: { title: string; url: string }[] }>;
  const reference = refs[lesson.id];
  const source = [reference, ...(reference.supportingReferences ?? [])][guide.comparison.sourceIndex];
  const visual = guide.comparison;
  return <>
    <FoundationsLessonContent lesson={lesson}
      preparation={<>No previous {hub.name} lesson is required. Review the <Link href={`/learn/foundations/${lesson.subject}`}>starting vocabulary</Link> if you need a reminder.</>}
      coreConcepts={<section className="study-panel" aria-labelledby="core-concepts-title">
        <h2 id="core-concepts-title">Core Concepts</h2>
        <dl className={styles.terms}>{guide.terms.map(([term, meaning]) => <div key={term}><dt>{term}</dt><dd>{meaning}</dd></div>)}</dl>
      </section>}
      explanationIntro={guide.introduction}
      visualStudy={<section className="study-panel" aria-labelledby="visual-study-title">
        <h2 id="visual-study-title">Visual Study Prompts</h2>
        <figure className={styles.comparison} data-entry-comparison>
          <table className={styles.wideComparison}>
            <caption>{visual.title}</caption>
            <thead><tr>{visual.headers.map(header => <th scope="col" key={header}>{header}</th>)}</tr></thead>
            <tbody>{visual.rows.map(row => <tr key={row.join("-")}>{row.map((cell, i) => i === 0 ? <th scope="row" key={i}>{cell}</th> : <td key={i}>{cell}</td>)}</tr>)}</tbody>
          </table>
          <div className={styles.narrowComparison} data-mobile-comparison role="group" aria-label={visual.title}>
            <h3>{visual.title}</h3>
            <ol>{visual.rows.map(row => <li key={row.join("-")}><dl>{row.map((cell, i) => <div key={visual.headers[i]}>
              <dt>{visual.headers[i]}</dt><dd>{cell}</dd>
            </div>)}</dl></li>)}</ol>
          </div>
          <figcaption>
            <p>{visual.caption}</p><p><strong>Observe and explain:</strong> {visual.observe}</p>
            <p className="muted-note">Original teaching comparison, Wardhan Medical Study Guide Studios; AI-assisted, source-checked. Scientific reference: <a href={source.url}>{source.title}</a>. All values and labels are provided as accessible text.</p>
          </figcaption>
        </figure>
      </section>}
      conceptTitle="Question 1"
      applicationIntro="Use the mechanism and the stated assumptions to justify one best answer. Cases and numerical values are hypothetical teaching examples."
      continuation={<>Return to the <Link href={`/study/${lesson.subject}`}>{hub.name} topic map</Link> to choose your next lesson.</>}
    />
    <section className="study-panel" aria-labelledby="short-recap-title">
      <h2 id="short-recap-title">Short Recap</h2><p>{lesson.recall.answer}</p>
      <Link className="text-link" href="/library">Return to the library →</Link>
    </section>
  </>;
}

import { StudyVisual, VisualComparison } from "./study-visual";
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
        <StudyVisual data-entry-comparison title={visual.title} caption={visual.caption}
          alt={visual.rows.map(row => row.map((cell, i) => `${visual.headers[i]}: ${cell}`).join("; ")).join(". ")}
          observe={visual.observe} sources={[{ title: source.title, url: source.url }]}
          credit="Original teaching comparison, Wardhan Medical Study Guide Studios; AI-assisted, source-checked. All values and labels are provided as accessible text.">
          <VisualComparison title={visual.title} headers={visual.headers} rows={visual.rows} />
        </StudyVisual>
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

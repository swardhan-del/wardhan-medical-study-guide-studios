import Link from "next/link";
import { studyPaths, beginnerSequences } from "@/content/study-paths";
import { studyGroups, subjectLessons } from "@/lib/study-collections";
import { practiceItems } from "@/content/practice-registry";
import { subjectLessonCounts } from "@/lib/subject-lesson-counts";

export function SubjectCoverage({ subject }: { subject: string }) {
  const path = studyPaths[subject];
  const lessons = subjectLessons(subject);
  const coverage = subjectLessonCounts(subject);
  const first = lessons.find(l => l.id === path.start)!;
  return <section className="study-panel" id="coverage" aria-labelledby="coverage-title">
    <p className="eyebrow">Start here · Topic coverage</p>
    <h2 id="coverage-title">What you can study here</h2>
    <p>{path.preparation}</p>
    <Link className="button button-primary" href={beginnerSequences[subject][0].href}>Start with {subject === "anatomy" ? beginnerSequences[subject][0].title : first.title}</Link>
    <p>{coverage.detail ? `${coverage.total} available lessons: ${coverage.detail}` : `${lessons.length} ${subject === "anatomy" ? "written course lessons" : "focused lesson introductions"}`}. Library resource totals also include other formats and activities; they are not additional lessons or a measure of syllabus completion.</p>
    <p>This map covers the current collection. An available introduction is a starting point, not complete preparation for an examination. Compare it with your course syllabus.</p>
    {subject === "physiology" && <p><Link href="/learn/renal">The {coverage.renal}-lesson renal course</Link> is included in the total above. It develops renal topics further and overlaps the core introductions; these are not additional syllabus areas.</p>}
    <h3>{["biophysics", "anatomy"].includes(subject) ? "What to study alongside this course" : "Still needs fuller lessons"}</h3>
    <p>{["biophysics", "anatomy"].includes(subject) ? "The native lessons cover the supplied topic structure. These additional checks and experiences remain necessary." : "Selected gaps identified in the source review; this is not an exhaustive list or a release schedule."}</p>
    <ul>{path.gaps.map(gap => <li key={gap}>{gap}{!["biophysics", "anatomy"].includes(subject) && " — Not yet covered in depth"}</li>)}</ul>
  </section>;
}

// Existing collection order, exposed before the large lesson-card grid.
export function SubjectLessonOrder({ subject }: { subject: string }) {
  const lessons = subjectLessons(subject);
  const groups = studyGroups.filter(group => group.subject === subject);
  return <section className="study-panel" id="lesson-order" aria-labelledby="lesson-order-title">
    <h2 id="lesson-order-title">Lesson order</h2>
    <p>Open a section for the numbered list. This is the current collection order; use the beginner steps or a focused topic sequence when starting a new subject. It is not a complete university syllabus.</p>
    {groups.map(group => <details className="study-details" key={group.id}>
      <summary>{group.title} · {group.lessonIds.length} {subject === "anatomy" ? "lessons available" : "introductions available"}</summary>
      <ol start={1 + groups.slice(0, groups.indexOf(group)).reduce((count, item) => count + item.lessonIds.length, 0)}>{group.lessonIds.map(id => {
        const lesson = lessons.find(l => l.id === id)!;
        const count = subject === "anatomy" && id !== "anatomy-foundations" ? 5 : practiceItems.filter(q => q.topic === id).length;
        return <li key={id}><Link href={`/library/${id}`}>{lesson.title}</Link> — {subject === "anatomy" ? "Lesson available" : "Introduction available"} · {count} practice {count === 1 ? "question" : "questions"}</li>;
      })}</ol>
    </details>)}
    {subject === "physiology" && <p><Link href="/learn/renal">Follow the separate eight-lesson renal course</Link> for the guided renal sequence.</p>}
  </section>;
}

import Link from "next/link";
import { studyPaths } from "@/content/study-paths";
import { studyGroups, subjectLessons } from "@/lib/study-collections";
import { practiceItems } from "@/content/practice-registry";

export function SubjectCoverage({ subject }: { subject: string }) {
  const path = studyPaths[subject];
  const lessons = subjectLessons(subject);
  const first = lessons.find(l => l.id === path.start)!;
  return <section className="study-panel" id="coverage" aria-labelledby="coverage-title">
    <p className="eyebrow">Start here · Topic coverage</p>
    <h2 id="coverage-title">What you can study here</h2>
    <p>{path.preparation}</p>
    <Link className="button button-primary" href={`/library/${first.id}`}>Start with {first.title}</Link>
    <p>{lessons.length} focused lesson introductions. Library resource totals also include other formats and activities; they are not additional lessons or a measure of syllabus completion.</p>
    <p>This map covers the current collection. An available introduction is a starting point, not complete preparation for an examination. Compare it with your course syllabus.</p>
    {studyGroups.filter(g => g.subject === subject).map(group => <details className="study-details" key={group.id}>
      <summary>{group.title} · {group.lessonIds.length} introductions available</summary>
      <ul>{group.lessonIds.map(id => {
        const lesson = lessons.find(l => l.id === id)!;
        const count = practiceItems.filter(q => q.topic === id).length;
        return <li key={id}><Link href={`/library/${id}`}>{lesson.title}</Link> — Introduction available · {count} practice {count === 1 ? "question" : "questions"}</li>;
      })}</ul>
    </details>)}
    {subject === "physiology" && <p><Link href="/learn/renal">The separate eight-lesson renal course</Link> develops renal topics further. It overlaps this collection and should not be counted as eight additional syllabus areas.</p>}
    <h3>{subject === "biophysics" ? "What to study alongside this course" : "Still needs fuller lessons"}</h3>
    <p>{subject === "biophysics" ? "The native lessons cover the supplied topic structure. These additional checks and experiences remain necessary." : "Selected gaps identified in the source review; this is not an exhaustive list or a release schedule."}</p>
    <ul>{path.gaps.map(gap => <li key={gap}>{gap}{subject !== "biophysics" && " — Not yet covered in depth"}</li>)}</ul>
  </section>;
}

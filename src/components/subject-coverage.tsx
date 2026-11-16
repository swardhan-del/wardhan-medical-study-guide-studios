import Link from "next/link";
import { studyPaths, beginnerSequences } from "@/content/study-paths";
import { studyGroups, subjectLessons } from "@/lib/study-collections";
import { physiologyCoursePath } from "@/content/curriculum";
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
    <p>{coverage.detail ? `${coverage.total} available lessons: ${coverage.detail}` : `${lessons.length} ${subject === "anatomy" ? "written course lessons" : "focused lesson introductions"}`}.</p>
    {subject === "physiology" && <p><Link href="/learn/renal">The {coverage.renal}-lesson renal course</Link> is included in the total above. Use it to go deeper into renal topics from the core lessons.</p>}
    <h3>What to study alongside this course</h3>
    <p>Use your syllabus and course materials to review these areas.</p>
    <ul>{path.gaps.map(gap => <li key={gap}>{gap}</li>)}</ul>
  </section>;
}

// Existing collection order, exposed before the large lesson-card grid.
export function SubjectLessonOrder({ subject }: { subject: string }) {
  const lessons = subjectLessons(subject);
  const groups = studyGroups.filter(group => group.subject === subject);
  return <section className="study-panel" id="lesson-order" aria-labelledby="lesson-order-title">
    <h2 id="lesson-order-title">Lesson order</h2>
    <p>Browse the website’s lesson collections by topic. For sequential study, use the ordered course or guide at the top of this page.</p>
    {groups.map(group => <details className="study-details" key={group.id}>
      <summary>{group.title} · {group.lessonIds.length} {subject === "anatomy" ? "lessons available" : "introductions available"}</summary>
      <ol start={1 + groups.slice(0, groups.indexOf(group)).reduce((count, item) => count + item.lessonIds.length, 0)}>{group.lessonIds.map(id => {
        const lesson = lessons.find(l => l.id === id)!;
        return <li key={id}><Link href={`/library/${id}`}>{lesson.title}</Link> — {subject === "anatomy" ? "Lesson available" : "Introduction available"}</li>;
      })}</ol>
    </details>)}
    {subject === "physiology" && <p><Link href={physiologyCoursePath + "#renal"}>See renal physiology in Part 4 of the Full Course</Link>.</p>}
  </section>;
}

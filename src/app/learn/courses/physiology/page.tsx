import Link from "next/link";
import { CourseLessonProgress, CourseResume } from "@/components/course-progress";
import { physiologyCourse, physiologyCoursePath } from "@/content/curriculum";
import { releasedCourseLesson } from "@/lib/course-lessons";
import { searchMetadata } from "@/lib/search-metadata";
import styles from "./course.module.css";

export const metadata = searchMetadata(physiologyCoursePath);

export default function PhysiologyFullCourse() {
  const parts = physiologyCourse.parts.map(part => ({
    ...part,
    chapters: part.chapters?.map(chapter => ({
      ...chapter,
      lessons: chapter.lessonIds.map(releasedCourseLesson),
    })),
  }));

  return <div className={`site-container study-page ${styles.course}`}>
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <Link href="/subjects">Subjects</Link>
      <span aria-hidden="true"> / </span>
      <Link href="/subjects/physiology">Medical Physiology</Link>
      <span aria-hidden="true"> / </span>
      <span aria-current="page">Full Course</span>
    </nav>
    <header className="study-hero">
      <p className="eyebrow">{physiologyCourse.title}</p>
      <h1>Full Course</h1>
      <p className="interior-lede">Browse the eight parts in order. Cardiovascular and respiratory chapters link to available lessons and show where teaching is still pending.</p>
      <CourseResume lessons={parts.flatMap(part => part.chapters?.flatMap(chapter => chapter.lessons) ?? [])} />
      <div className="action-row">
        <Link href="/library?subject=physiology">Search the physiology library</Link>
        <Link href="/study">Review progress in My Study</Link>
      </div>
    </header>
    <nav className="study-panel" aria-label="Course parts">
      <h2>Course parts</h2>
      <ol>{parts.map(part => <li key={part.id}><a href={`#${part.id}`}>{part.title}</a></li>)}</ol>
    </nav>
    {parts.map((part, partIndex) => <section className="study-panel" key={part.id} id={part.id} aria-labelledby={`${part.id}-title`}>
      <h2 id={`${part.id}-title`}>Part {partIndex + 1}. {part.title}</h2>
      {part.id === "respiratory" && <p>
        The respiratory topics and adaptation follow the <a href="https://semmelweis.hu/elettan/files/2023/08/EMed-lect_fall.pdf">2026/27 Semmelweis Physiology lecture schedule</a>. Acid–base integration is listed as supplementary study.
      </p>}
      {part.chapters ? <ol className={styles.chapters}>
        {part.chapters.map((chapter, chapterIndex) => <li key={chapter.id}>
          <details open id={chapter.id}>
            <summary>
              <h3>{partIndex + 1}.{chapterIndex + 1} {chapter.title} <span>{chapter.lessons.length ? "Partial coverage" : "No mapped lesson"}</span></h3>
            </summary>
            {chapter.lessons.length ? <ul>{chapter.lessons.map(lesson => <li key={lesson.progressId}>
              <Link href={lesson.href}>{lesson.title}</Link><CourseLessonProgress id={lesson.progressId} />
              <div className="action-row">
                <Link href={lesson.href + lesson.practiceAnchor} aria-label={`Practice: ${lesson.title}`}>Practice</Link>
                <Link href={lesson.href + lesson.reviewAnchor} aria-label={`Review: ${lesson.title}`}>Review</Link>
              </div>
            </li>)}</ul> : <p>This chapter is listed in sequence. A mapped teaching lesson is pending.</p>}
          </details>
        </li>)}
      </ol> : <>
        <p>Chapter mapping is pending.</p>
        {part.id === "renal" && <Link href="/learn/renal">Open the existing renal physiology course</Link>}
      </>}
    </section>)}
  </div>;
}

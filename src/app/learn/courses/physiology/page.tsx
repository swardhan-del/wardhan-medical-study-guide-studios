import Link from "next/link";
import { CourseLessonProgress, CourseResume } from "@/components/course-progress";
import { physiologyCourse, physiologyCoursePath } from "@/content/curriculum";
import { releasedCourseLesson, type CourseLessonLink } from "@/lib/course-lessons";
import { searchMetadata } from "@/lib/search-metadata";
import styles from "./course.module.css";

export const metadata = searchMetadata(physiologyCoursePath);

function CourseLessons({ lessons }: { lessons: CourseLessonLink[] }) {
  return <ul>{lessons.map(lesson => <li key={lesson.progressId}>
    <Link href={lesson.href}>{lesson.title}</Link><CourseLessonProgress id={lesson.progressId} />
    <div className="action-row">
      <Link href={lesson.href + lesson.practiceAnchor} aria-label={`Practice: ${lesson.title}`}>Practice</Link>
      <Link href={lesson.href + lesson.reviewAnchor} aria-label={`Review: ${lesson.title}`}>Review</Link>
    </div>
  </li>)}</ul>;
}

export default function PhysiologyFullCourse() {
  const parts = physiologyCourse.parts.map(part => ({
    ...part,
    chapters: part.chapters.map(chapter => ({
      ...chapter,
      lessons: chapter.lessonIds.map(releasedCourseLesson),
      related: (chapter.relatedLessonIds ?? []).map(releasedCourseLesson),
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
      <p className="interior-lede">Study the eight divided guide parts in order. Each chapter shows its released lessons, related study and gaps. Open a lesson to practise, review and continue.</p>
      <Link className="button button-primary" href={`#${parts[0].id}`}>Start with Part 1</Link>
      <CourseResume lessons={parts.flatMap(part => part.chapters.flatMap(chapter => chapter.lessons))} />
      <div className="action-row">
        <Link href="/library/physiology-membrane-foundations">Optional membrane physiology foundation</Link>
        <Link href="/study/physiology/revision">Print revision notes</Link>
        <Link href="/study">Review progress in My Study</Link>
      </div>
    </header>
    <nav className="study-panel" aria-label="Course parts">
      <h2>Course parts</h2>
      <ol>{parts.map(part => <li key={part.id}><a href={`#${part.id}`}>{part.title}</a></li>)}</ol>
    </nav>
    <details className="study-panel">
      <summary>How the guide relates to lectures and the examination</summary>
      <p>The 2026/27 Physiology I lecture schedule and the oral-exam topic list were cross-referenced separately. Guide parts 1, 2, 3, 5 and 6 have Physiology I examination cross-references. The lecture schedule also touches selected material from Part 8.</p>
      <p>Chapter numbers below identify positions in the eight-part web course, ordered by the divided guides. The lecture schedule uses teaching dates, and the examination list has its own topic numbers. Complete Physiology II syllabus alignment for Parts 4, 7 and 8 remains unverified.</p>
      <a href="https://semmelweis.hu/elettan/files/2023/08/EMed-lect_fall.pdf">Semmelweis Physiology lecture schedule</a>
    </details>
    {parts.map((part, partIndex) => {
      const previousPart = parts[partIndex - 1], nextPart = parts[partIndex + 1];
      return <section className="study-panel" key={part.id} id={part.id} aria-labelledby={`${part.id}-title`}>
        <h2 id={`${part.id}-title`}>Part {partIndex + 1}. {part.title}</h2>
        <ol className={styles.chapters}>
          {part.chapters.map((chapter, chapterIndex) => {
            const previousChapter = part.chapters[chapterIndex - 1], nextChapter = part.chapters[chapterIndex + 1];
            return <li key={chapter.id}>
              <details open id={chapter.id}>
                <summary>
                  <h3>{chapter.number ?? `${partIndex + 1}.${chapterIndex + 1}`} {chapter.title} <span>{chapter.lessons.length ? "Partial coverage" : chapter.related.length ? "Related coverage only" : "No mapped lesson"}</span></h3>
                </summary>
                {chapter.lessons.length > 0 ? <CourseLessons lessons={chapter.lessons} /> : <p>A dedicated teaching lesson for this chapter is pending.</p>}
                {chapter.related.length > 0 && <><p>Related released lessons</p><CourseLessons lessons={chapter.related} /></>}
                {!chapter.lessons.length && <div className="action-row">
                  {previousChapter ? <a href={`#${previousChapter.id}`}>Previous chapter: {previousChapter.title}</a> : previousPart && <a href={`#${previousPart.id}`}>Previous part: {previousPart.title}</a>}
                  {nextChapter ? <a href={`#${nextChapter.id}`}>Next chapter: {nextChapter.title}</a> : nextPart && <a href={`#${nextPart.id}`}>Next part: {nextPart.title}</a>}
                </div>}
              </details>
            </li>;
          })}
        </ol>
        <nav className="action-row" aria-label={`Part ${partIndex + 1} navigation`}>
          {previousPart && <a href={`#${previousPart.id}`}>Previous part: {previousPart.title}</a>}
          <Link href={`/study/physiology/revision#${part.guidePartId}`}>Print this part’s revision notes</Link>
          {nextPart && <a href={`#${nextPart.id}`}>Next part: {nextPart.title}</a>}
        </nav>
      </section>;
    })}
  </div>;
}

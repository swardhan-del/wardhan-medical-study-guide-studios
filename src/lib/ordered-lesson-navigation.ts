import "server-only";
import { physiologyChapterHref, physiologyChapterNavigation, physiologyCourse, physiologyCoursePath } from "@/content/curriculum";
import { releasedCourseLesson } from "./course-lessons";
import { guideLessonNavigation, guidePartHref } from "./printable-guides";

function physiologyNavigation(lessonId: string) {
  const location = physiologyChapterNavigation(lessonId);
  if (!location) return null;

  const { chapter, partIndex, previous, next, previousLessonId, nextLessonId } = location;
  function step(lessonId: string | undefined, adjacent: typeof next, offset: -1 | 1) {
    const targetId = lessonId ?? (offset === -1 ? adjacent?.lessonIds.at(-1) : adjacent?.lessonIds[0]);
    if (targetId) {
      const lesson = releasedCourseLesson(targetId);
      return { href: lesson.href, title: lesson.title, kind: "lesson" };
    }
    if (adjacent) return { href: physiologyChapterHref(adjacent), title: adjacent.title, kind: "chapter" };
    const part = physiologyCourse.parts[partIndex + offset];
    return part && { href: physiologyCoursePath + "#" + part.id, title: part.title, kind: "part" };
  }

  return {
    label: "Full Course chapter navigation",
    current: { href: physiologyChapterHref(chapter), title: "Back to this chapter in Full Course" },
    previous: step(previousLessonId, previous, -1),
    next: step(nextLessonId, next, 1),
  };
}

export function orderedLessonNavigation(subject: string, lessonId: string) {
  if (subject === "physiology") {
    const course = physiologyNavigation(lessonId);
    if (course) return course;
  }

  const guide = guideLessonNavigation(subject, lessonId);
  if (!guide) return null;

  const { part, previousLesson, nextLesson, previousPart, nextPart } = guide;
  function step(lesson: typeof nextLesson, adjacent: typeof nextPart) {
    if (lesson) return { href: `/library/${lesson.id}`, title: lesson.title, kind: "lesson" };
    return adjacent && { href: guidePartHref(adjacent), title: adjacent.title, kind: "part" };
  }

  if (subject === "physiology" && part.number === "00") {
    return {
      label: "Physiology course navigation",
      current: { href: guidePartHref(part), title: "Foundation lesson in the guide" },
      previous: undefined,
      next: { href: physiologyCoursePath + "#" + physiologyCourse.parts[0].id, title: physiologyCourse.parts[0].title, kind: "part" },
    };
  }

  return {
    label: "Ordered guide navigation",
    current: { href: guidePartHref(part), title: `Guide part ${part.number}: ${part.title}` },
    previous: step(previousLesson, previousPart),
    next: step(nextLesson, nextPart),
  };
}

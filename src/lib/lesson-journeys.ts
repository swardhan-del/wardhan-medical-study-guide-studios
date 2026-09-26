import { renalLessons, renalLessonHref } from "@/content/renal-course";
import { studyLessons, studyGroups } from "./study-collections";
import { beginnerSequences } from "@/content/study-paths";
import { practiceItems } from "@/content/practice-registry";

export type JourneyLesson = {
  id: string; title: string; subject: string; summary: string;
  questions: string[]; next: { title: string; href: string };
};
// Only this small projection crosses the client boundary; full teaching content stays on the server.
export const journeyLessons: JourneyLesson[] = studyLessons.map(lesson => {
  const starters = beginnerSequences[lesson.subject] ?? [];
  const startIndex = starters.findIndex(item => item.href === `/library/${lesson.id}`);
  const sequence = studyGroups.filter(group => group.subject === lesson.subject).flatMap(group => group.lessonIds);
  const index = sequence.indexOf(lesson.id);
  const next = index >= 0 ? studyLessons.find(item => item.id === sequence[index + 1]) : undefined;
  return {
    id: lesson.id, title: lesson.title, subject: lesson.subject, summary: lesson.recall.answer,
    questions: practiceItems.filter(item => item.topic === lesson.id).map(item => item.id),
    next: starters[startIndex + 1] && startIndex >= 0 ? starters[startIndex + 1] : next
      ? { title: next.title, href: `/library/${next.id}` }
      : { title: "Choose another topic in this subject", href: `/study/${lesson.subject}` },
  };
});
export type ResumeLesson = { id: string; title: string; next: { title: string; href: string }; href?: string };
export const journeyIndex: ResumeLesson[] = [
  ...journeyLessons.map(({ id, title, next }) => ({ id, title, next })),
  ...renalLessons.map((lesson, index) => ({
    id: lesson.slug, title: lesson.title, href: renalLessonHref(lesson.slug),
    next: renalLessons[index + 1]
      ? { title: renalLessons[index + 1].title, href: renalLessonHref(renalLessons[index + 1].slug) }
      : { title: "Review the renal course", href: "/learn/renal" },
  })),
];

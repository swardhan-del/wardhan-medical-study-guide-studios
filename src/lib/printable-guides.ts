import data from "@/content/printable-guides.json";
import { studyLessons, studySubjects } from "./study-collections";

export type GuidePart = {
  id: string;
  subject: string;
  number: string;
  title: string;
  lessonIds: string[];
  basis: string;
  coverage: string;
  practiceHref: string | null;
  relatedLessonIds?: string[];
};

export const guideParts: GuidePart[] = data.parts;
const lessonsById = new Map(studyLessons.map(lesson => [lesson.id, lesson]));

export function partsForSubject(subject: string) {
  return studySubjects.some(item => item.id === subject) ? guideParts.filter(part => part.subject === subject) : [];
}

export function guidePartHref(part: GuidePart) {
  return `/study/${part.subject}/guide#${part.id}`;
}

export function orderedGuideLessons(ids: readonly string[]) {
  return ids.map(id => {
    const lesson = lessonsById.get(id);
    if (!lesson) throw new Error(`Guide refers to an unknown lesson: ${id}`);
    return lesson;
  });
}

export function guideLessonNavigation(subject: string, lessonId: string) {
  const parts = partsForSubject(subject);
  const index = parts.findIndex(part => part.lessonIds.includes(lessonId));
  if (index < 0) return null;

  const part = parts[index];
  const lessons = orderedGuideLessons(part.lessonIds);
  const position = part.lessonIds.indexOf(lessonId);
  return {
    part,
    previousLesson: lessons[position - 1],
    nextLesson: lessons[position + 1],
    previousPart: parts[index - 1],
    nextPart: parts[index + 1],
  };
}

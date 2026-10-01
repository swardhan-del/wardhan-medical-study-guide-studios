import library from "../content/library-lessons.json" with { type: "json" };
import studio from "../content/study-questions.json" with { type: "json" };
import transfer from "../content/transfer-practice.json" with { type: "json" };
import anatomy from "../content/anatomy-course.json" with { type: "json" };
import { renalLessons, renalQuestions, renalRevision } from "../content/renal-course.ts";
import type { LibraryLesson } from "./library-types.ts";
import type { QualityLesson } from "./content-quality-types.ts";

/** Adapters preserve each established route and question ID. No private input is imported. */
export const qualityLessons: QualityLesson[] = [
  ...(library.lessons as LibraryLesson[]).map(lesson => {
    const questions = [...studio.questions, ...transfer.questions].filter(q => q.topic === lesson.id);
    return {
      id: lesson.id, title: lesson.title, subject: lesson.subject, slug: lesson.id,
      href: `/library/${lesson.id}`, objectives: lesson.objectives ?? [], updatedAt: lesson.updatedAt,
      links: { prerequisite: lesson.prerequisites ?? [], related: lesson.related, compare: [], next: [] },
      questions: [{ id: `concept-${lesson.id}`, ...lesson.question, options: lesson.question.options.map(o => ({ text: o.text, explanation: o.reason })) }, ...questions],
      prompts: [{ id: `oral-${lesson.id}`, prompt: lesson.recall.prompt, explanation: lesson.recall.answer }, ...(lesson.oralExamination ?? []).map((p, index) => ({ id: `oral-prompt-${lesson.id}-${index + 1}`, prompt: p.prompt, explanation: p.answer })), ...anatomy.records.filter(r => r.lessonId === lesson.id).flatMap(r => r.practice.map(p => ({ id: p.id, prompt: p.prompt, explanation: p.answer })))],
      content: { lesson, questions, anatomy: anatomy.records.filter(r => r.lessonId === lesson.id) },
    };
  }),
  ...renalLessons.map((lesson, index) => ({
    id: `renal-${lesson.slug}`, title: lesson.title, subject: "physiology", slug: lesson.slug,
    href: `/learn/renal/${lesson.slug}`, objectives: lesson.objectives, updatedAt: renalRevision,
    links: { prerequisite: renalLessons[index - 1] ? [`renal-${renalLessons[index - 1].slug}`] : [], related: [], compare: [], next: renalLessons[index + 1] ? [`renal-${renalLessons[index + 1].slug}`] : [] },
    questions: renalQuestions.filter(q => q.lesson === lesson.slug),
    prompts: [{ id: `oral-renal-${lesson.slug}`, prompt: lesson.oral, explanation: lesson.rubric.join(" ") }],
    content: { lesson, questions: renalQuestions.filter(q => q.lesson === lesson.slug) },
  })),
];

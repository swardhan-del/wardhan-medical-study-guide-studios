import library from "./library-lessons.json";
import thorax from "./thorax-practice.json";
import { anatomyLearningPages } from "./anatomy-learning";
import { renalLessons, renalQuestions, renalLessonHref } from "./renal-course";
import { abgCases } from "./abg-cases";
import { histologyTissues } from "./histology-tissues";
import studio from "./study-questions.json";
import transfer from "./transfer-practice.json";

export type PracticeItem = {
  id: string;
  topic: string;
  title: string;
  subject: string;
  href: string;
  prompt: string;
  options?: { text: string; explanation: string }[];
  answer?: number;
};
export const practiceItems: PracticeItem[] = [
  ...studio.questions,
  ...renalQuestions.map((q) => ({
    ...q, topic: q.lesson, subject: "physiology",
    title: renalLessons.find((l) => l.slug === q.lesson)!.title,
    href: renalLessonHref(q.lesson) + "#lesson-quiz",
  })),
  ...library.lessons.map((l) => ({
    id: "concept-" + l.id, topic: l.id, title: l.title, subject: l.subject,
    href: "/library/" + l.id + "#concept-check-title", prompt: l.question.prompt,
    answer: l.question.answer,
    options: l.question.options.map((o) => ({ text: o.text, explanation: o.reason })),
  })),
  ...anatomyLearningPages.flatMap((page) => page.lessons.filter((l) => !l.activity).map((l) => ({
    id: "anatomy-" + l.id, topic: "anatomy-" + page.slug, title: page.title, subject: "anatomy",
    href: "/subjects/anatomy/" + page.slug + "?topic=" + l.id + "#explore",
    prompt: l.question, answer: l.answer,
    options: l.options.map((text) => ({ text, explanation: l.feedback })),
  }))),
  ...thorax.questions.map((q) => ({
    ...q, topic: "anatomy-thorax", title: "Thorax: map and mechanisms", subject: "anatomy",
    href: "/subjects/anatomy/thorax#thorax-practice-title",
    options: q.options.map((text, i) => ({ text, explanation: q.explanations[i] })),
  })),
  ...histologyTissues.map((t, i) => ({
    id: "histology-" + (i + 1), topic: "histology-detective", title: "Renal histology detective",
    subject: "histology", href: "/practice/histology?case=" + (i + 1) + "#detective-cases",
    prompt: "Identify tubule specimen " + (i + 1) + " using two structural clues.",
  })),
  ...abgCases.map((c, i) => ({
    id: "abg-" + (i + 1), topic: "abg-lab", title: "Blood-gas interpretation",
    subject: "physiology", href: "/practice/physiology?case=" + (i + 1) + "#abg",
    prompt: "Case " + (i + 1) + ": pH " + c.ph + ", PaCO₂ " + c.co2 + ", bicarbonate " + c.bicarbonate + ".",
  })),
  ...transfer.questions.map((q) => q.id.startsWith("micrograph-") ? { id: q.id, topic: q.topic, subject: q.subject, title: q.title, href: q.href, prompt: q.prompt } : q),
];
export const practiceTopics = Array.from(new Map(practiceItems.map((q) =>
  [q.topic, { id: q.topic, title: q.topic === "histology-micrographs" ? "Microscope section practice" : q.topic === "renal-experiments" ? "Renal circuit experiments" : q.title, subject: q.subject, href: q.href.split("#")[0] }]
)).values());
export const learningLessonIds = [...new Set([...renalLessons.map((l) => l.slug), ...practiceTopics.map((t) => t.id)])];
export const learningQuestionIds = [...new Set(practiceItems.map((q) => q.id))];
export const learningDraftIds = [
  ...renalLessons.flatMap((l) => ["oral-renal-" + l.slug, ...l.rubric.map((_, i) => "rubric-" + l.slug + "-" + i)]),
  ...library.lessons.map((l) => "oral-" + l.id),
  ...thorax.oral.flatMap((q) => ["oral-" + q.id, ...q.checklist.map((_, i) => "check-" + q.id + "-" + i)]),
  ...transfer.questions.map((q) => "explain-" + q.id),
  "lab-prediction", "lab-explanation",
];

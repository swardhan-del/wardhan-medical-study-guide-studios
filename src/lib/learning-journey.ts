import type { LearningProgress } from "./learning-core.ts";

export type JourneyStage = "learn" | "practice" | "summary";
export const journeyAnchors: Record<JourneyStage, string> = {
  learn: "lesson-objectives", practice: "concept-check-title", summary: "lesson-review",
};
export function stageForHash(hash: string): JourneyStage {
  if (/summary|lesson-review/.test(hash)) return "summary";
  if (/check|practice|quiz|application|apply-the-concept/.test(hash)) return "practice";
  return "learn";
}
export function journeyStatus(data: LearningProgress, id: string, questions: string[]) {
  const entry = data.journey[id];
  const attempted = questions.filter(question => data.answers[question]).length;
  const steps = Number(!!entry?.read) + Number(attempted > 0) + Number(!!entry?.reviewed);
  return { attempted, total: questions.length, steps, complete: data.lessons.includes(id), canComplete: steps === 3 };
}
export function resumeHref(resume: NonNullable<LearningProgress["resume"]>) {
  // Callers resolve the identifier against the public lesson index. Never store URLs.
  return `/library/${encodeURIComponent(resume.lesson)}#${journeyAnchors[resume.stage]}`;
}

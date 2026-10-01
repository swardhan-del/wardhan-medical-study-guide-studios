import records from "../content/lesson-quality.json" with { type: "json" };
import reviewData from "../content/lesson-review-evidence.json" with { type: "json" };
import baseline from "../content/lesson-quality-legacy.json" with { type: "json" };
import { qualityLessons } from "./quality-lessons.ts";
import { allowsLessonIndexing } from "./content-quality.ts";
import type { LessonQuality, ReviewEvidence } from "./content-quality-types.ts";

export const lessonQuality = records.records as LessonQuality[];
export const reviewEvidence = reviewData.records as ReviewEvidence[];
export const qualityForLesson = (id: string) => lessonQuality.find(q => q.lessonId === id);
/** Compatibility preserves published routes, not a claim of review. CI verifies frozen fingerprints. */
export function qualityAllowsIndexing(id: string): boolean {
  const lesson = qualityLessons.find(l => l.id === id);
  if (!lesson) return true; // Non-lesson catalog entries retain the existing route policy.
  const q = qualityForLesson(id);
  return allowsLessonIndexing(lesson, q, qualityLessons, reviewEvidence, Object.hasOwn(baseline.lessons, id), new Date().toISOString().slice(0, 10));
}
export { qualityLessons };

export function hasRecordedReview(id: string, scope: ReviewEvidence["scope"]): boolean {
  const q = qualityForLesson(id);
  return Boolean(q?.reviewEvidenceIds.some(evidenceId => reviewEvidence.some(e => e.id === evidenceId && e.lessonId === id && e.scope === scope)));
}

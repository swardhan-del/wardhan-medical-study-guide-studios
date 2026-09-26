import registry from "../content/measurement-registry.json" with { type: "json" };

export type MeasurementEvent =
  | { version: 1; event: "subject_selected"; subject_id: string }
  | { version: 1; event: "lesson_opened"; lesson_id: string }
  | { version: 1; event: "quiz_completed"; quiz_id: string }
  | { version: 1; event: "summary_saved"; lesson_id: string }
  | { version: 1; event: "starter_pack_requested"; asset_id: "study-guide-starter-pack" }
  | { version: 1; event: "waitlist_submitted" };
const subjects = new Set(Object.values(registry.subjectRoutes));
const lessons = new Set(Object.values(registry.lessonRoutes));
const quizzes = new Set(registry.quizIds);
const summaries = new Set(Object.values(registry.summaryDrafts));

// Exact schemas reject extra properties rather than silently forwarding private fields.
export function validateMeasurement(value: unknown): MeasurementEvent | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  if (input.version !== 1 || typeof input.event !== "string") return null;
  const valid = (key: string, values: Set<string>) => Object.keys(input).length === 3 && typeof input[key] === "string" && values.has(input[key] as string);
  switch (input.event) {
    case "subject_selected": return valid("subject_id", subjects) ? { version: 1, event: input.event, subject_id: input.subject_id as string } : null;
    case "lesson_opened": return valid("lesson_id", lessons) ? { version: 1, event: input.event, lesson_id: input.lesson_id as string } : null;
    case "quiz_completed": return valid("quiz_id", quizzes) ? { version: 1, event: input.event, quiz_id: input.quiz_id as string } : null;
    case "summary_saved": return valid("lesson_id", summaries) ? { version: 1, event: input.event, lesson_id: input.lesson_id as string } : null;
    case "starter_pack_requested": return valid("asset_id", new Set(["study-guide-starter-pack"])) ? { version: 1, event: input.event, asset_id: "study-guide-starter-pack" } : null;
    case "waitlist_submitted": return Object.keys(input).length === 2 ? { version: 1, event: input.event } : null;
    default: return null;
  }
}

export function eventForPath(path: string): MeasurementEvent | null {
  const subject = (registry.subjectRoutes as Record<string, string>)[path];
  if (subject) return { version: 1, event: "subject_selected", subject_id: subject };
  const lesson = (registry.lessonRoutes as Record<string, string>)[path];
  return lesson ? { version: 1, event: "lesson_opened", lesson_id: lesson } : null;
}

export function completedSummary(draftId: string, drafts: Record<string, string>): string | null {
  const mapping = registry.summaryDrafts as Record<string, string>;
  const lesson = mapping[draftId];
  return lesson && Object.entries(mapping).filter(([, id]) => id === lesson).every(([id]) => drafts[id] === "yes") ? lesson : null;
}

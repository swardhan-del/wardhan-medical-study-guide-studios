import type { LessonQuality, QualityLesson, ReviewEvidence } from "./content-quality-types.ts";

export const linkKinds = ["prerequisite", "next", "related", "compare"] as const;
const nonempty = (value: unknown): value is string => typeof value === "string" && value.trim().length > 0;
export function validDate(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
}
export function containsPrivateReference(value: unknown): boolean {
  let text = typeof value === "string" ? value : JSON.stringify(value);
  for (let i = 0; i < 3; i++) { try { text = decodeURIComponent(text); } catch { break; } }
  return /\.private(?:[\\/]|\b)|dropbox(?:usercontent)?\.com|(?:[\\/]Users[\\/]|[\\/]home[\\/])|file:\/\/|Library[\\/]CloudStorage|source-intake[\\/]/i.test(text);
}
export function explainedQuestions(lesson: QualityLesson): boolean {
  return lesson.prompts.every(p => nonempty(p.prompt) && nonempty(p.explanation)) && lesson.questions.length > 0 && lesson.questions.every(q => nonempty(q.prompt) && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length && q.options.length >= 2 && q.options.every(o => nonempty(o.text) && nonempty(o.explanation)));
}
export function resolvedLinks(id: string, links: LessonQuality["links"], lessons: readonly QualityLesson[]) {
  return linkKinds.map(kind => ({ kind, lessons: [...new Set(Array.isArray(links?.[kind]) ? links[kind] : [])].flatMap(target => {
    const lesson = lessons.find(item => item.id === target && item.id !== id);
    return lesson ? [{ id: lesson.id, title: lesson.title, href: lesson.href }] : [];
  }) })).filter(group => group.lessons.length > 0);
}
/** Input is untrusted JSON; malformed shapes become diagnostics, never runtime exceptions. */
export function validateQuality(input: unknown, lesson: QualityLesson, lessons: readonly QualityLesson[], evidence: readonly ReviewEvidence[], today: string): string[] {
  const errors: string[] = [];
  if (!input || typeof input !== "object" || Array.isArray(input)) return ["quality record must be an object"];
  const q = input as LessonQuality;
  for (const field of ["lessonId", "title", "subject", "topic", "slug", "learnerLevel", "visualNotes"] as const) if (!nonempty(q[field])) errors.push(`${field} is required`);
  for (const [field, value] of [["lessonId", lesson.id], ["title", lesson.title], ["subject", lesson.subject], ["slug", lesson.slug]] as const) if (q[field] !== value) errors.push(`${field} must match the existing lesson`);
  const enums = {
    contentStatus: ["draft", "editorial-reviewed", "medical-review-pending", "independently-clinically-reviewed"],
    visualStatus: ["not-required", "planned", "rights-review-pending", "approved-and-published"],
    assessmentStatus: ["questions-planned", "explanations-complete", "reviewed"],
    accessibilityStatus: ["pending", "checked"], readabilityStatus: ["pending", "checked"],
    indexStatus: ["indexable", "noindex-pending-review", "noindex"],
  };
  for (const [field, values] of Object.entries(enums)) if (!values.includes(q[field as keyof typeof enums])) errors.push(`${field} is invalid`);
  for (const field of ["objectives", "limitations", "reviewEvidenceIds"] as const) if (!Array.isArray(q[field]) || !q[field].every(nonempty)) errors.push(`${field} must be a string array`);
  if (typeof q.visualRequired !== "boolean") errors.push("visualRequired must be explicit");
  if (q.visualRequired && q.visualStatus === "not-required") errors.push("required visual cannot be marked not-required");
  for (const field of ["lastReviewedAt", "nextReviewAt"] as const) if (q[field] !== null && !validDate(q[field])) errors.push(`${field} must be an ISO date or null`);
  if (validDate(q.lastReviewedAt) && q.lastReviewedAt > today) errors.push("lastReviewedAt cannot be in the future");
  if (validDate(q.lastReviewedAt) && validDate(q.nextReviewAt) && q.nextReviewAt <= q.lastReviewedAt) errors.push("nextReviewAt must follow lastReviewedAt");
  if (!Array.isArray(q.sources)) errors.push("sources must be an array");
  else for (const source of q.sources) {
    if (!source || !nonempty(source.title) || !nonempty(source.publisherOrAuthor) || (!nonempty(source.url) && !nonempty(source.citation)) || !validDate(source.accessedAt) || source.accessedAt > today || !["textbook", "guideline", "research", "educational-reference", "authored-adaptation"].includes(source.sourceType)) errors.push("source requires title, publisher/author, URL or citation, access date and source type");
    if (source?.url && /\.(?:docx?|pptx?)(?:[?#]|$)/i.test(source.url)) errors.push("raw Office source URLs are not public lesson references");
    if (source?.url) { try { const url = new URL(source.url); if (url.protocol !== "https:" || url.username || url.password) errors.push("source URL must be public HTTPS without credentials"); } catch { errors.push("invalid source URL"); } }
  }
  for (const kind of linkKinds) {
    const targets = q.links?.[kind];
    if (!Array.isArray(targets) || !targets.every(nonempty)) errors.push(`links.${kind} must be an ID array`);
    else for (const target of targets) if (target === lesson.id || !lessons.some(l => l.id === target)) errors.push(`links.${kind}: unknown or self target ${target}`);
  }
  const ids = Array.isArray(q.reviewEvidenceIds) ? q.reviewEvidenceIds : [];
  const attached = ids.flatMap(id => {
    const item = evidence.find(e => e.id === id && e.lessonId === lesson.id);
    if (!item) errors.push(`missing review evidence: ${id}`);
    return item ? [item] : [];
  });
  if (validDate(q.lastReviewedAt) && !attached.some(e => ["editorial", "clinical"].includes(e.scope) && e.reviewedAt === q.lastReviewedAt)) errors.push("lastReviewedAt needs matching editorial or clinical evidence");
  const requireEvidence = (scope: ReviewEvidence["scope"]) => {
    if (!attached.some(e => e.scope === scope && validDate(e.reviewedAt) && e.reviewedAt <= today && e.reviewedAt >= lesson.updatedAt && nonempty(e.reviewer) && nonempty(e.qualification) && /^docs\/reviews\/[a-z0-9-]+\.md$/.test(e.record) && (scope !== "clinical" || e.independent === true))) errors.push(`${scope} evidence for the current lesson is required`);
  };
  if (["editorial-reviewed", "independently-clinically-reviewed"].includes(q.contentStatus)) requireEvidence("editorial");
  if (q.contentStatus === "independently-clinically-reviewed") requireEvidence("clinical");
  if (q.visualStatus === "approved-and-published") requireEvidence("visual");
  if (q.assessmentStatus === "reviewed") requireEvidence("assessment");
  if (q.accessibilityStatus === "checked") requireEvidence("accessibility");
  if (q.readabilityStatus === "checked") requireEvidence("readability");
  if (["explanations-complete", "reviewed"].includes(q.assessmentStatus) && !explainedQuestions(lesson)) errors.push("practice questions need an explanation for every option and a valid answer");
  if (q.indexStatus === "indexable") {
    if (!q.sources?.length) errors.push("indexable lesson needs sources");
    if (!q.objectives?.length) errors.push("indexable lesson needs learning objectives");
    if (JSON.stringify(q.objectives) !== JSON.stringify(lesson.objectives)) errors.push("indexable objectives must match the lesson teaching record");
    if (q.contentStatus === "draft") errors.push("draft lesson cannot be indexable");
    requireEvidence("editorial");
    if (!explainedQuestions(lesson) || q.assessmentStatus === "questions-planned") errors.push("indexable lesson needs explained practice questions");
    if (!["not-required", "approved-and-published"].includes(q.visualStatus)) errors.push("indexable lesson needs a completed visual decision");
    if (q.accessibilityStatus !== "checked" || q.readabilityStatus !== "checked") errors.push("indexable lesson needs accessibility and readability checks");
    if (!validDate(q.lastReviewedAt) || !validDate(q.nextReviewAt)) errors.push("indexable lesson needs review dates");
    if (validDate(q.lastReviewedAt) && q.lastReviewedAt < lesson.updatedAt) errors.push("review predates the current lesson");
    if (!q.limitations?.length) errors.push("indexable lesson needs explicit limitations");
  }
  if (containsPrivateReference(q)) errors.push("private source reference in public metadata");
  return [...new Set(errors)];
}

/** One eligibility decision is shared by metadata, sitemap and full-text search. */
export function allowsLessonIndexing(lesson: QualityLesson, quality: LessonQuality | undefined, lessons: readonly QualityLesson[], evidence: readonly ReviewEvidence[], legacy: boolean, today: string): boolean {
  if (!quality) return legacy;
  return quality.indexStatus === "indexable" && validateQuality(quality, lesson, lessons, evidence, today).length === 0;
}

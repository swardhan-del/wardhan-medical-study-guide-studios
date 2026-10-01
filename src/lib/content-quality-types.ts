/** Public-safe metadata only. Raw intake and reviewer contact details stay private. */
export type LessonQuality = {
  lessonId: string;
  title: string;
  subject: string;
  topic: string;
  slug: string;
  learnerLevel: string;
  objectives: string[];
  sources: {
    title: string;
    publisherOrAuthor: string;
    url?: string;
    citation?: string;
    accessedAt: string;
    sourceType: "textbook" | "guideline" | "research" | "educational-reference" | "authored-adaptation";
  }[];
  contentStatus: "draft" | "editorial-reviewed" | "medical-review-pending" | "independently-clinically-reviewed";
  visualStatus: "not-required" | "planned" | "rights-review-pending" | "approved-and-published";
  visualRequired: boolean;
  visualNotes: string;
  assessmentStatus: "questions-planned" | "explanations-complete" | "reviewed";
  accessibilityStatus: "pending" | "checked";
  readabilityStatus: "pending" | "checked";
  indexStatus: "indexable" | "noindex-pending-review" | "noindex";
  lastReviewedAt: string | null;
  nextReviewAt: string | null;
  limitations: string[];
  reviewEvidenceIds: string[];
  links: { prerequisite: string[]; related: string[]; compare: string[]; next: string[] };
};
export type ReviewEvidence = {
  id: string;
  lessonId: string;
  scope: "editorial" | "clinical" | "visual" | "assessment" | "accessibility" | "readability";
  reviewedAt: string;
  reviewer: string;
  qualification: string;
  independent: boolean;
  /** Committed, public-safe signed-off review note; never a raw source. */
  record: string;
  contentSha256: string;
};
export type QualityLesson = {
  id: string; title: string; subject: string; slug: string; href: string;
  objectives: string[]; updatedAt: string;
  links: LessonQuality["links"];
  questions: { id: string; prompt: string; answer: number; options: { text: string; explanation: string }[] }[];
  prompts: { id: string; prompt: string; explanation: string }[];
  /** Includes original teaching data and all associated question data for the frozen legacy fingerprint. */
  content: unknown;
};

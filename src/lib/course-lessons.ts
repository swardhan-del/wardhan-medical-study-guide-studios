import "server-only";
import { getPublicRecord } from "./catalog";
import { resourceHref } from "./catalog-types";
import release from "@/content/public-release.json";
import registry from "@/content/learning-registry.json";

export type CourseLessonLink = {
  progressId: string;
  title: string;
  href: string;
  practiceAnchor: string;
  reviewAnchor: string;
};

export function releasedCourseLesson(id: string): CourseLessonLink {
  const record = getPublicRecord(id);
  if (!record || record.status !== "public" || record.format !== "WEB" || !release.resourceIds.includes(id)) {
    throw new Error(`Course lesson is missing or outside the public release allowlist: ${id}`);
  }

  const renal = record.href?.startsWith("/learn/renal/");
  const progressId = renal ? id.slice("renal-".length) : id;
  if (!registry.learningLessonIds.includes(progressId)) {
    throw new Error(`Course lesson has no existing progress identity: ${id}`);
  }

  return {
    progressId,
    title: record.title,
    href: resourceHref(record),
    practiceAnchor: renal ? "#lesson-quiz" : "#concept-check-title",
    reviewAnchor: renal ? "#recap" : "#lesson-review",
  };
}

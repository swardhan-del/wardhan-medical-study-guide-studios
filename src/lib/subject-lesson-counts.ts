import { renalLessons } from "@/content/renal-course";
import { subjectLessons } from "@/lib/study-collections";

// Count lessons, not catalog resources or distinct syllabus areas.
export function subjectLessonCounts(subject: string) {
  const core = subjectLessons(subject).length;
  const renal = subject === "physiology" ? renalLessons.length : 0;
  return {
    total: core + renal,
    renal,
    detail: renal ? `${core} core introductions and ${renal} renal course lessons` : null,
  };
}

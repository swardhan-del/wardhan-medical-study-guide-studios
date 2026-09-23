import Link from "next/link";
import type { LibraryLesson } from "@/lib/library-types";
import { FoundationsLessonContent } from "./foundations-lesson-content";
import { HistologyVisualStudy, TissueFamilyOverview } from "./histology-foundations-visuals";

export function HistologyFoundationsContent({ lesson }: { lesson: LibraryLesson }) {
  return <FoundationsLessonContent lesson={lesson}
    preparation={<>No previous histology lesson is required. Review <Link href="/learn/foundations/histology">histology terminology</Link> if needed.</>}
    coreConcepts={<TissueFamilyOverview/>} visualStudy={<HistologyVisualStudy/>}
    explanationIntro="Study the tissue families in sequence, then compare the evidence used to identify them. Each explanation can be expanded or collapsed."
    conceptTitle="Question 1: tissue families"
    applicationIntro="Use the structural evidence to predict function or justify a classification. Each hypothetical scenario has one best answer."
    continuation={<>Continue with <Link href="/library/microscopy">microscopy and section interpretation</Link>, or revisit a tissue family from the related lessons.</>}
  />;
}

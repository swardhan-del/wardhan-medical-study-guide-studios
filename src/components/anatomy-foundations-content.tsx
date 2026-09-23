import Link from "next/link";
import type { LibraryLesson } from "@/lib/library-types";
import { FoundationsLessonContent } from "./foundations-lesson-content";
import { AnatomyVisualStudy } from "./anatomy-foundations-visuals";

export function AnatomyFoundationsContent({ lesson }: { lesson: LibraryLesson }) {
  return <FoundationsLessonContent lesson={lesson}
    preparation={<>No previous Anatomy lesson is required. Allow about 35 minutes, including practice. You can pause and return to your saved answers and notes.</>}
    coreConcepts={<section className="study-panel" aria-labelledby="core-concepts-title">
      <h2 id="core-concepts-title">Core Concepts</h2>
      <p>Anatomy describes structures and their relationships. Four questions organise this lesson:</p>
      <ol><li><strong>What is the reference?</strong> Establish position, side and viewing direction.</li><li><strong>Where is the structure?</strong> Describe its region, depth and relationship to a landmark.</li><li><strong>What defines the space?</strong> Distinguish a body compartment, a serous cavity and an organ lumen.</li><li><strong>How is it organised?</strong> Connect cells and tissues to organs and organ systems.</li></ol>
      <p>Use a specific comparison whenever possible. “Distal to the elbow” communicates more than an isolated label such as “distal”.</p>
    </section>}
    visualStudy={<AnatomyVisualStudy/>}
    explanationIntro="Begin with the reference position, then move from spatial relationships to compartments and organ structure. Each explanation can be expanded or collapsed."
    conceptTitle="Question 1: anatomical position"
    applicationIntro="Apply the stated orientation, boundaries and tissue functions to each hypothetical scenario. Select one best answer; distinguish a justified anatomical description from an unsupported diagnosis."
    continuation={<>Continue with <Link href="/library/thoracic-cage-landmarks">thoracic cage landmarks</Link>, or use the <Link href="/subjects/anatomy#anatomy-course-map">Anatomy course map</Link> to choose your next region. For tissue recognition, study <Link href="/library/histology-foundations-tissues">Histology Foundations</Link>.</>}
  />;
}

import data from "@/content/lesson-visuals.json";
import references from "@/content/lesson-references.json";
import { StudyVisual, VisualComparison, VisualFlow } from "./study-visual";

export const visualsForLesson = (id: string) => data.visuals.filter(visual => visual.lessonIds.includes(id));
export function LessonVisuals({ lessonId }: { lessonId: string }) {
  const visuals = visualsForLesson(lessonId);
  if (!visuals.length) return null;
  const refs = references as Record<string,{title:string;url:string}>;
  return <section className="lesson-visuals" aria-label="Visual study prompts" data-lesson-visuals={lessonId}>
    {visuals.map(visual => <StudyVisual key={visual.id} id={`visual-${visual.id}`} title={visual.title} alt={visual.alt} caption={visual.caption} observe={visual.observe}
      credit="Original teaching layout © Wardhan Medical Study Guide Studios; AI-assisted, based on the cited lesson references. Simplified relationships, not a specimen image or a diagnostic aid."
      sources={visual.referenceIds.map(id => refs[id])}>
      {visual.kind === "comparison" && visual.headers && visual.rows && <VisualComparison title={visual.title} headers={visual.headers} rows={visual.rows} />}
      {visual.kind === "flow" && visual.steps && <VisualFlow label={visual.title} steps={visual.steps} />}
    </StudyVisual>)}
  </section>;
}

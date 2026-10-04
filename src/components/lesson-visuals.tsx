import data from "@/content/lesson-visuals.json";
import references from "@/content/lesson-references.json";
import { StudyVisual, VisualComparison, VisualFlow, VisualViewport } from "./study-visual";
import { OriginalDiagram } from "./original-diagrams";

export const visualsForLesson = (id: string) => data.visuals.filter(visual => visual.lessonIds.includes(id));
export function LessonVisuals({ lessonId, label = "Visual study prompts" }: { lessonId: string; label?: string }) {
  const visuals = visualsForLesson(lessonId);
  if (!visuals.length) return null;
  const refs = references as Record<string,{title:string;url:string;supportingReferences?:{title:string;url:string}[]}>;
  return <section className="lesson-visuals" aria-label={label} data-lesson-visuals={lessonId}>
    {visuals.map(visual => <StudyVisual key={visual.id} id={`visual-${visual.id}`} title={visual.title} alt={visual.alt} caption={visual.caption} observe={visual.observe}
      credit={visual.credit ?? "Original teaching layout © Wardhan Medical Study Guide Studios; AI-assisted, based on the cited lesson references. Simplified relationships, not a specimen image or a diagnostic aid."}
      sources={[...new Map(visual.referenceIds.flatMap(id => [refs[id], ...(refs[id].supportingReferences ?? [])]).filter(source => !visual.sourceUrls || visual.sourceUrls.includes(source.url)).map(source => [source.url, source])).values()]}>
      {visual.kind === "comparison" && visual.headers && visual.rows && <VisualComparison title={visual.title} headers={visual.headers} rows={visual.rows} />}
      {visual.kind === "flow" && visual.steps && <VisualFlow label={visual.title} steps={visual.steps} />}
      {visual.kind === "svg" && <>
        <p className="original-diagram-explanation">{visual.explanation}</p>
        <VisualViewport label={`${visual.title}; scroll horizontally on a narrow screen`} minWidth={640}>
          <OriginalDiagram id={visual.id} title={visual.title} alt={visual.alt} />
        </VisualViewport>
        <p className="muted-note original-diagram-review">Hand-authored SVG with AI assistance. Schematic, not to scale. Scientific, editorial and human accessibility review pending. Scientific references checked {visual.sourceCheckedAt}.</p>
        {visual.knowledgeCheck && <section className="diagram-knowledge-check" aria-labelledby={visual.knowledgeCheck.id}>
          <h4 id={visual.knowledgeCheck.id}>Knowledge check</h4><p>{visual.knowledgeCheck.prompt}</p>
          <details><summary>Show the explained answer</summary><p>{visual.knowledgeCheck.explanation}</p></details>
        </section>}
      </>}
    </StudyVisual>)}
  </section>;
}

import "server-only";
import data from "@/content/mcb-review-visuals.json";
import { requireLocalReview } from "@/lib/local-review";
import { LocalMcbDiagram } from "./local-mcb-diagrams";
import { StudyVisual, VisualViewport } from "./study-visual";

export function LocalMcbReview({ lessonId }: { lessonId: string }) {
  requireLocalReview();
  return <section id="draft-visual-review" aria-labelledby="draft-visual-title">
    <h2 id="draft-visual-title">Molecular Cell Biology · diagram review</h2>
    <p className="study-notice">Local draft only. Scientific, editorial, human accessibility and applicable public-use reviews remain pending. Original coded schematics; no archive images are reproduced. The GPCR label now reads “GDP leaves; GTP binds Gα”. This is a clarity edit, not a new accuracy approval.</p>
    {data.visuals.filter(visual => visual.lessonIds.includes(lessonId)).map(visual => <StudyVisual key={visual.id} id={`draft-${visual.id}`} title={visual.title} alt={visual.alt} caption={visual.caption} observe={visual.observe}
      credit={`${visual.credit} AI-assisted schematic, not to scale. Reused from draft PR #30; local review only.`}
      sources={visual.sourceUrls.map((url, index) => ({ title: `Scientific reference ${index + 1}`, url }))}>
      <VisualViewport label={`${visual.title} — scrollable diagram`} minWidth={650}>
        <LocalMcbDiagram id={visual.id} title={visual.title} alt={visual.alt} />
      </VisualViewport>
      <p>{visual.explanation}</p>
      <details><summary>{visual.knowledgeCheck.prompt}</summary><p>{visual.knowledgeCheck.explanation}</p></details>
    </StudyVisual>)}
  </section>;
}

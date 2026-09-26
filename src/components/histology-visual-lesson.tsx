"use client";
import { useState } from "react";
import { StudyVisual, VisualViewport } from "./study-visual";
import Image from "next/image";
import visuals from "@/content/visual-sources.json";
import transfer from "@/content/transfer-practice.json";
import { PracticeQuestion } from "./practice-question";

export function HistologyVisualLesson({ initialStage = 0, review = false }: { initialStage?: number; review?: boolean }) {
  const [stage, setStage] = useState(initialStage);
  const [labels, setLabels] = useState(true);
  const [failedImages, setFailedImages] = useState<Record<string,boolean>>({});
  const titles = ["1. Learn the pattern", "2. Remove the labels", "3. Real section A", "4. Transfer to section B"];
  const specimen = visuals[stage === 3 ? 1 : 0];
  const imageAlt = stage === 2 ? "Pink tissue containing several open tubular profiles, each with a ring of rounded purple nuclei. Inspect the large open profile in the upper left." : "A thick pink lining curves around a broad pale space. Nuclear profiles vary from rounded deep in the lining to flatter at the free surface.";
  const question = transfer.questions.find((q) => q.id === (stage === 3 ? "micrograph-b-check" : "micrograph-a-check"))!;
  return <section id="microscope-sequence" className="study-panel visual-sequence" aria-labelledby="microscope-title">
    <p className="eyebrow">Drawing → observation → transfer</p><h2 id="microscope-title">From a clean diagram to a real section</h2>
    <p>First locate a free surface, then trace the lining to its basal boundary. Decide how many layers are present before naming the shape of the surface cells. Do not identify a tissue from stain colour alone.</p>
    <div className="topic-buttons" aria-label="Choose a visual learning step">{titles.map((title, i) => <button key={title} aria-pressed={stage === i} onClick={() => { setStage(i); setLabels(i === 0); }}>{title}</button>)}</div>
    <h3>{titles[stage]}</h3>
    {stage < 2 ? <>
      <StudyVisual title="One epithelial layer and its boundaries"
        alt="One row of cuboidal cells with rounded nuclei lies on a basal boundary, with a free surface above."
        caption="Regular cell shapes emphasise the layer and its two surfaces. Real sections can contain partial cells, folds and oblique cuts."
        observe="Locate the free surface, basal boundary and a complete cell. Explain why nuclear rows alone cannot establish the number of layers."
        credit="Original teaching schematic · Wardhan Medical Study Guide Studios; AI-assisted, not to scale and not microscopy."
        sources={[{title:"OpenStax: Epithelial Tissue",url:"https://openstax.org/books/anatomy-and-physiology-2e/pages/4-2-epithelial-tissue"}]}>
      <VisualViewport label="Epithelial pattern; scroll horizontally on a narrow screen" minWidth={500}><svg viewBox="0 0 650 260" role="img" aria-label="Schematic of a single row of square epithelial cells, with rounded nuclei, resting on a basal line and facing an open space above." className="epithelium-pattern">
        <rect width="650" height="260" fill="#faf6ee" />
        {Array.from({ length: 6 }, (_, i) => <g key={i}><rect x={55 + i * 90} y="90" width="90" height="90" fill="#ebc6cf" stroke="#765273" strokeWidth="2"/><circle cx={100 + i * 90} cy="136" r="13" fill="#765273"/></g>)}
        <path d="M55 186 H595" stroke="#147273" strokeWidth="6"/>
        {labels && <g fill="#142b31" fontSize="20" textAnchor="middle"><text x="325" y="45">Free surface / lumen</text><text x="325" y="225">Basal boundary · basement membrane</text><text x="325" y="77">One layer of cuboidal cells</text></g>}
      </svg></VisualViewport>
      <button className="button button-secondary" onClick={() => setLabels(!labels)}>{labels ? "Hide diagram labels" : "Show diagram labels"}</button>
      </StudyVisual>
      {stage === 0 ? <p><strong>Worked example:</strong> A single layer of cells with similar height and width is simple cuboidal epithelium. Rounded nuclei help you locate cells, but counting rows of nuclei alone can mislead you. Follow the whole lining from its basal boundary to the lumen.</p> : <p>Without the labels, point out the free surface, the basal boundary and one complete cell. Explain why the drawing represents one layer. Then test this approach on section A.</p>}
    </> : <>
      <StudyVisual title={`Microscope section ${stage===2 ? "A" : "B"}`} alt={imageAlt}
        caption={`Source magnification ${specimen.magnification}; screen size is not a calibrated scale. Follow the lining before deciding on the cell shape.`}
        observe="Combine the number of cell layers with the shape of the cells at the free surface. State which boundary supports your answer."
        credit={`${specimen.author} · ${specimen.license}. ${specimen.modifications}`}
        sources={[{title:"Original image and description",url:specimen.sourceUrl},{title:specimen.license,url:specimen.licenseUrl}]}>
        {failedImages[specimen.path] ? <p className="visual-image-fallback" role="status"><strong>Image unavailable.</strong> {imageAlt} Return to “1. Learn the pattern” to practise the method with the labelled schematic.</p> :
        <a href={specimen.path} target="_blank" rel="noreferrer" aria-label="Enlarge microscope section (opens in a new tab)"><Image src={specimen.path} width={specimen.width} height={specimen.height} sizes="(max-width: 760px) 90vw, 800px" alt={imageAlt} onError={()=>setFailedImages(previous=>({...previous,[specimen.path]:true}))} /></a>}
      </StudyVisual>
      <PracticeQuestion freshAttempt={review} key={question.id} item={question} title={stage === 2 ? "Identify a real epithelial lining" : "Transfer the method to a new section"} />
      <details className="study-details"><summary>Image source, licence and original description</summary><p>{specimen.author} · <a href={specimen.licenseUrl}>{specimen.license}</a>. {specimen.modifications}</p><a className="text-link" href={specimen.sourceUrl}>Original image and description ↗</a><p>The image source supplies the tissue classification and magnification. Explanations and questions are original teaching adaptations.</p></details>
    </>}
    <div className="action-row"><button className="button button-secondary" disabled={stage === 0} onClick={() => { setStage(stage - 1); setLabels(stage - 1 === 0); }}>Previous visual step</button><button className="button button-primary" disabled={stage === 3} onClick={() => { setStage(stage + 1); setLabels(false); }}>Next visual step →</button></div>
    <p className="source-note">Classification reference: <a href="https://openstax.org/books/anatomy-and-physiology-2e/pages/4-2-epithelial-tissue">OpenStax: Epithelial tissue</a>. These two sections practice epithelial classification; they do not establish competence in renal tubule identification.</p>
  </section>;
}

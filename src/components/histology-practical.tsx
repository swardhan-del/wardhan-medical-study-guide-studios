"use client";

import { useState } from "react";
import Link from "next/link";
import { checkHistologyName, histologyNames } from "@/lib/histology-short-answer";
import styles from "./histology-practical.module.css";

const tissueEvidence = [
  { name: "Epithelial", cells: "A continuous, closely joined layer facing a surface or lumen.", matrix: "Little material between cells; a basal boundary separates the lining from support.", structure: "Polarity and surface-cell shape help refine the classification.", trap: "Nuclei at different heights do not alone prove stratification." },
  { name: "Connective", cells: "Cells are distributed within a supporting matrix; cell density varies.", matrix: "Inspect collagen orientation, other fibres and ground substance. Adipose and blood are specialised exceptions to a fibre-dominated picture.", structure: "Aligned extracellular bundles with sparse flattened nuclei favour tendon over smooth muscle.", trap: "Pink colour occurs in both collagen and muscle." },
  { name: "Muscle", cells: "Contractile cells form fibres or bundles; inspect nuclear position and branching.", matrix: "Supporting connective tissue surrounds the contractile component.", structure: "Combine striations, cell shape, branching and nuclear pattern; section plane changes which features are visible.", trap: "Absence of visible striations in one field does not establish smooth muscle." },
  { name: "Nervous", cells: "Neurons and glia cooperate; a field may show cell bodies, processes or fibre bundles.", matrix: "Do not identify every pale interval as extracellular matrix: preparation and unresolvable processes matter.", structure: "Seek neuronal somata, processes and the wider CNS or PNS organisation; glial subtype needs more evidence than nuclear size alone.", trap: "A glial cell, a myelin sheath and an axon are different structures." },
];

export function TissueEvidenceExplorer() {
  const [active, setActive] = useState(0);
  const item = tissueEvidence[active];
  return <section className={styles.panel} aria-labelledby="tissue-evidence-title">
    <p className="eyebrow">Make an identification from evidence</p>
    <h2 id="tissue-evidence-title">Compare cells, matrix and specialised structures</h2>
    <p><strong>First locate a boundary, lumen or repeated unit.</strong> Select a family, then find its clues in the diagrams and micrographs below. This comparison does not identify an uploaded specimen.</p>
    <div className={styles.choices} aria-label="Tissue family">{tissueEvidence.map((t, i) => <button key={t.name} type="button" aria-pressed={active===i} onClick={() => setActive(i)}>{t.name}</button>)}</div>
    <div aria-live="polite" aria-atomic="true"><h3>{item.name}: three lines of evidence</h3><dl>
      <dt><strong>Cell arrangement</strong></dt><dd>{item.cells}</dd>
      <dt><strong>Extracellular material</strong></dt><dd>{item.matrix}</dd>
      <dt><strong>Specialised structures</strong></dt><dd>{item.structure}</dd>
    </dl><p className={styles.clue}><strong>Common trap:</strong> {item.trap}</p></div>
    <p>Now explain one positive clue and one alternative aloud. Continue to <Link href="/library/microscopy">preparation, stains and section interpretation</Link> for the method behind the image.</p>
  </section>;
}

const preparation = [
  { name: "Fix and preserve", purpose: "Stabilise the specimen before further processing; preservation changes the living material." },
  { name: "Process and embed", purpose: "Replace water through processing and support the tissue in paraffin for cutting." },
  { name: "Section and mount", purpose: "Cut thin sections and transfer them to glass; choose orientation for the structure of interest." },
  { name: "Remove wax and rehydrate", purpose: "Prepare a paraffin section for an aqueous staining workflow." },
  { name: "Stain for contrast", purpose: "Use the selected stain to make relevant components distinguishable." },
  { name: "Finish and coverslip", purpose: "Complete the method-appropriate finishing steps and protect the section for examination." },
];
const choiceOrder = [4, 1, 5, 0, 3, 2];

export function PreparationSequence() {
  const [order, setOrder] = useState<number[]>([]);
  const [feedback, setFeedback] = useState("");
  function check() {
    if (order.length !== preparation.length) { setFeedback(`Choose all six stages first. You have chosen ${order.length}.`); return; }
    const mismatch = order.findIndex((value, i) => value !== i);
    setFeedback(mismatch === -1 ? "Sequence matched. Explain the purpose of each stage below before moving on." : `Revisit stage ${mismatch + 1}: ${preparation[mismatch].name} belongs here. ${preparation[mismatch].purpose}`);
  }
  return <section className={styles.panel} aria-labelledby="preparation-sequence-title">
    <p className="eyebrow">Build the workflow</p><h2 id="preparation-sequence-title">From specimen to routine paraffin slide</h2>
    <p>Choose stages in order. This models the purpose of a routine workflow; frozen sections and other methods differ. Use your laboratory’s approved procedure for reagents, timing and handling.</p>
    <div className={styles.choices}>{choiceOrder.map(i => <button type="button" key={i} disabled={order.includes(i)} onClick={() => { setOrder(previous => [...previous, i]); setFeedback(""); }}>{preparation[i].name}</button>)}</div>
    <h3>Your sequence</h3>{order.length ? <ol>{order.map(i => <li key={i}>{preparation[i].name}</li>)}</ol> : <p>No stages chosen yet.</p>}
    <div className={styles.choices}><button type="button" onClick={check}>Check sequence</button><button type="button" disabled={!order.length} onClick={() => { setOrder(previous => previous.slice(0,-1)); setFeedback(""); }}>Undo last stage</button><button type="button" onClick={() => {setOrder([]);setFeedback("");}}>Reset sequence</button></div>
    <p role="status" className={styles.feedback}>{feedback}</p>
    <details><summary>Review the order and the reason for each stage</summary><ol>{preparation.map(s => <li key={s.name}><strong>{s.name}:</strong> {s.purpose}</li>)}</ol></details>
    <p>Reference: <a href="https://histology.siu.edu/intro/tissprep.htm">Southern Illinois University tissue preparation</a>.</p>
  </section>;
}

const organs = [
  { name: "Lymph node", boundary: "Capsule with a subcapsular sinus; cortical follicles and a deeper paracortex.", relation: "Medullary cellular cords alternate with lymph sinuses.", alternative: "A follicle alone also occurs in spleen or tonsil. Seek the capsule–sinus and cortex–medulla relationships." },
  { name: "Spleen", boundary: "Capsule and trabeculae enclose red pulp with islands of white pulp.", relation: "Seek a central arteriole with associated lymphoid tissue, rather than a peripheral cortical band.", alternative: "A trabecular vessel is not identified as a white-pulp arteriole merely because it is arterial. Inspect its surrounding tissue." },
  { name: "Thymus", boundary: "Incomplete septa divide a repeated darker-cortex/paler-medulla arrangement.", relation: "Medullary Hassall corpuscles are epithelial structures; a pale medulla is not a germinal centre.", alternative: "Fat alone cannot identify an involuted thymus. Find residual thymic organisation." },
  { name: "Palatine tonsil", boundary: "Stratified squamous surface epithelium extends into crypts next to lymphoid tissue.", relation: "Trace a crypt’s epithelial continuity to the surface; a node sinus lies beneath a connective-tissue capsule.", alternative: "A cropped field without surface or capsule may remain indeterminate. Other tonsils need their own epithelial context." },
];

function ShortNamePractice({ item }: { item: typeof histologyNames[number] }) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<ReturnType<typeof checkHistologyName> | null>(null);
  return <div className={styles.question}>
    <label htmlFor={item.id}>{item.prompt}</label><input id={item.id} value={answer} maxLength={400} autoComplete="off" aria-describedby="name-check-limits" onChange={e => {setAnswer(e.target.value);setResult(null);}}/>
    <button type="button" onClick={() => setResult(checkHistologyName(answer,item))}>Check short answer</button>
    <p role="status" className={styles.feedback}>{result?.message}</p>
  </div>;
}

export function LymphoidPractical() {
  const [organ, setOrgan] = useState(0);
  const [route, setRoute] = useState<"lymph"|"blood">("lymph");
  const item=organs[organ];
  const routeSteps = route === "lymph" ? ["Drained tissue → afferent lymphatic", "Subcapsular and deeper lymph sinuses", "Medullary sinuses → efferent lymphatic at the hilum"] : ["Circulating lymphocyte in blood", "Postcapillary HEV in the paracortex", "Crossing the vessel wall into lymph-node tissue"];
  return <section className={styles.panel} aria-labelledby="lymphoid-practical-title">
    <p className="eyebrow">A practical differential</p><h2 id="lymphoid-practical-title">Which organisation fits the field?</h2>
    <p>Compare boundaries and relationships before naming the organ. The panel is a conceptual aid; verify these clues on real sections through the linked teaching atlas.</p>
    <div className={styles.choices} aria-label="Lymphoid organ">{organs.map((o,i) => <button type="button" key={o.name} aria-pressed={i===organ} onClick={() => setOrgan(i)}>{o.name}</button>)}</div>
    <div aria-live="polite" aria-atomic="true"><h3>{item.name}</h3><p><strong>Find the boundary:</strong> {item.boundary}</p><p><strong>Confirm a relationship:</strong> {item.relation}</p><p className={styles.clue}><strong>Test the alternative:</strong> {item.alternative}</p></div>
    <p><a href="https://histology.oit.duke.edu/NormalBody/Lymphatic/Lymphatic.html">Compare labelled specimens in Duke’s lymphatic practical</a>. The external atlas has its own controls and specimen context.</p>
    <h3>One node, two entry routes</h3><p>Switch the route to keep the vessel and tissue compartments distinct. Arrows represent a simplified sequence, not transit time or scale.</p>
    <div className={styles.choices}><button type="button" aria-pressed={route==="lymph"} onClick={() => setRoute("lymph")}>Lymph from drained tissue</button><button type="button" aria-pressed={route==="blood"} onClick={() => setRoute("blood")}>Lymphocytes from blood</button></div>
    <ol className={styles.route} aria-live="polite" aria-label="Selected entry route">{routeSteps.map(s => <li key={s}>{s}</li>)}</ol>
    <p className={styles.clue}><strong>Keep the categories straight:</strong> paracortex is a tissue region, HEV is a blood vessel, and a sinus is a lymph passage.</p>
    <h3>Type the structure before revealing it</h3><p id="name-check-limits">This checks short names against a small set of accepted synonyms. It does not grade essays or clinical competence. Unrecognised wording, including negated sentences, remains unassessed. Your entries stay on this page and are not sent or saved.</p>
    {histologyNames.map(q => <ShortNamePractice key={q.id} item={q}/>)}
    <p>Then use the oral prompts to explain the relationship in your own words.</p>
  </section>;
}

export function HistologyDemonstrations() {
  return <section className={styles.panel} aria-labelledby="histology-demonstrations-title">
    <h2 id="histology-demonstrations-title">Watch, pause and explain</h2>
    <p><a href="https://www.open.edu/openlearn/mod/oucontent/view.php?id=65373&section=2">Open University: identifying tissues — video and transcript</a>. Before magnifying, pause to name the outer boundary and repeated units. Compare your observations with the transcript.</p>
    <p><a href="https://research-information.bris.ac.uk/en/publications/production-and-use-of-an-open-access-film-to-demonstrate-the-prep/">University of Bristol: tissue-preparation film and background</a>. Follow the university’s link to the film and match each stage with its purpose. It is an overview, not your laboratory procedure.</p>
  </section>;
}

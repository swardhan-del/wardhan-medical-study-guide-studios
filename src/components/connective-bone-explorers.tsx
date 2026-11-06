"use client";

import { useState } from "react";
import styles from "./connective-bone-explorers.module.css";

const collagenStages = [
  { name: "Modify and assemble", place: "Endoplasmic reticulum", operation: "Procollagen chains are modified and assembled into a triple-helical precursor.", question: "Would a defect here be the same reaction as extracellular cross-link initiation?", answer: "No. Intracellular prolyl hydroxylation and precursor assembly differ from the extracellular lysyl-oxidase reaction. Identify the compartment before naming a failure point." },
  { name: "Secrete and process", place: "Secretory route to extracellular space", operation: "The precursor is exported; propeptide processing enables fibrillar assembly.", question: "Does seeing extracellular collagen tell you the secretion rate of the nearest cell now?", answer: "No. The visible matrix has accumulated over time. Synthesis, export, assembly and degradation all contribute; one static field cannot isolate a current rate." },
  { name: "Organize fibrils", place: "Extracellular matrix", operation: "Many molecules assemble into fibrils, which contribute to larger tissue-scale bundles.", question: "Is a triple helix the same thing as one bundle seen in H&E?", answer: "No. Molecule, fibril and bundle are different levels of organization. Their sizes and arrangement cannot be substituted for one another." },
  { name: "Stabilize links", place: "Extracellular matrix", operation: "Lysyl oxidase initiates chemistry that supports covalent cross-links in collagen and elastin.", question: "Does this enzyme use the same location and cofactor scheme as collagen prolyl hydroxylase?", answer: "No. Lysyl oxidase is copper-dependent and acts extracellularly. Prolyl hydroxylase acts in the endoplasmic reticulum with different reaction requirements." },
];

export function CollagenRouteExplorer() {
  const [selected, setSelected] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const stage = collagenStages[selected];
  return <section className={`study-panel ${styles.explorer}`} aria-labelledby="collagen-route-title">
    <p className="eyebrow">Connect the compartments</p>
    <h2 id="collagen-route-title">Follow a fibrillar collagen pathway</h2>
    <p>Select an operation, locate it, then answer the question before revealing the reasoning. This is a simplified type-I collagen pathway, not a model for every collagen family.</p>
    <div className={styles.controls} role="group" aria-label="Collagen operations">
      {collagenStages.map((item, index) => <button key={item.name} type="button" aria-pressed={selected === index} onClick={() => { setSelected(index); setRevealed(false); }}>{item.name}</button>)}
    </div>
    <ol className={styles.route} aria-label="Intracellular and extracellular sequence">
      {collagenStages.map((item, index) => <li key={item.name} className={selected === index ? styles.current : undefined} aria-current={selected === index ? "step" : undefined}>
        <span className={styles.number} aria-hidden="true">{index + 1}</span><div><strong>{item.name}</strong><span>{item.place}</span></div>
      </li>)}
    </ol>
    <div className={styles.observation} aria-live="polite"><h3>{stage.place}</h3><p>{stage.operation}</p><p><strong>Predict:</strong> {stage.question}</p></div>
    <button type="button" aria-expanded={revealed} aria-controls="collagen-route-reasoning" onClick={() => setRevealed(!revealed)}>{revealed ? "Hide the reasoning" : "Reveal the reasoning"}</button>
    <p id="collagen-route-reasoning" hidden={!revealed}>{stage.answer}</p>
    <noscript><p>The complete pathway and explained prompts are available in the preceding lesson sections without interactive controls.</p></noscript>
  </section>;
}

export function BonePreparationExplorer() {
  const [preparation, setPreparation] = useState<"ground" | "decalcified">("ground");
  const [plane, setPlane] = useState<"transverse" | "longitudinal">("transverse");
  const [revealed, setRevealed] = useState(false);
  const ground = preparation === "ground", transverse = plane === "transverse";
  const description = `${ground ? "Ground" : "Decalcified"} bone in ${plane} orientation: ${transverse ? "concentric layers around a central channel" : "extended layers alongside a central channel"}. ${ground ? "Dark marks represent retained lacunar spaces, not preserved living cells." : "Small nuclear symbols represent cells that may be visible in a suitably preserved section."}`;
  return <section className={`study-panel ${styles.explorer}`} aria-labelledby="bone-preparation-title">
    <p className="eyebrow">Change one variable at a time</p>
    <h2 id="bone-preparation-title">Compare preparation and section plane</h2>
    <p>Keep the underlying osteonal arrangement in mind while changing what the preparation and cutting direction reveal.</p>
    <fieldset><legend>Preparation</legend><div className={styles.controls}>
      {(["ground", "decalcified"] as const).map(value => <button type="button" key={value} aria-pressed={value === preparation} onClick={() => { setPreparation(value); setRevealed(false); }}>{value === "ground" ? "Ground bone" : "Decalcified H&E"}</button>)}
    </div></fieldset>
    <fieldset><legend>Section plane</legend><div className={styles.controls}>
      {(["transverse", "longitudinal"] as const).map(value => <button type="button" key={value} aria-pressed={value === plane} onClick={() => { setPlane(value); setRevealed(false); }}>{value === "transverse" ? "Transverse section" : "Longitudinal section"}</button>)}
    </div></fieldset>
    <figure className={styles.diagram}>
      <svg viewBox="0 0 500 290" role="img" aria-labelledby="bone-model-label bone-model-description">
        <title id="bone-model-label">{`Conceptual osteon: ${preparation}, ${plane}`}</title>
        <desc id="bone-model-description">{`${description} Not a micrograph or a calibrated physical model; symbol size and spacing are illustrative.`}</desc>
        <rect x="5" y="5" width="490" height="280" rx="10" fill="#faf5e9" stroke="#66573e" strokeWidth="2" />
        {transverse ? <>
          {[110, 88, 66, 44].map(r => <circle key={r} cx="250" cy="145" r={r} fill="none" stroke="#907a55" strokeWidth="3"/>)}
          <circle cx="250" cy="145" r="24" fill="#fff" stroke="#66573e" strokeWidth="3"/>
          {[0,1,2,3,4,5,6,7].map(i => {
            const angle=i*Math.PI/4, x=250+77*Math.cos(angle), y=145+77*Math.sin(angle);
            return <g key={i} transform={`translate(${x} ${y}) rotate(${i*45})`}><ellipse rx="6" ry="12" fill={ground ? "#252b33" : "#e1b9c4"} stroke="#252b33" strokeWidth="2"/>{!ground && <ellipse rx="2.5" ry="5" fill="#453356"/>}</g>;
          })}
        </> : <>
          {[105,135,165,195,305,335,365,395].map(x => <line key={x} x1={x} x2={x} y1="25" y2="265" stroke="#907a55" strokeWidth="3"/>)}
          <rect x="225" y="15" width="50" height="260" fill="#fff" stroke="#66573e" strokeWidth="3"/>
          {[150,180,320,350].flatMap((x,j) => [75,145,215].map(y => <g key={`${x}-${y}`} transform={`translate(${x} ${y+(j%2 ? 12 : 0)})`}><ellipse rx="6" ry="12" fill={ground ? "#252b33" : "#e1b9c4"} stroke="#252b33" strokeWidth="2"/>{!ground && <ellipse rx="2.5" ry="5" fill="#453356"/>}</g>))}
        </>}
      </svg>
      <figcaption><strong>Original conceptual illustration.</strong> The white central space represents the vascular channel; surrounding lines represent lamellae. It is not a micrograph, scale model or prediction of exact H&E colors. Canaliculi and vessels are omitted.</figcaption>
    </figure>
    <div className={styles.observation} aria-live="polite"><h3>What this selection represents</h3><p>{description}</p><p><strong>Question:</strong> {ground ? "Can the dark spaces establish that osteocytes died before the sample was prepared?" : "Can this decalcified section directly measure the mineral content that existed before preparation?"}</p></div>
    <button type="button" aria-expanded={revealed} aria-controls="bone-preparation-reasoning" onClick={() => setRevealed(!revealed)}>{revealed ? "Hide the reasoning" : "Reveal the reasoning"}</button>
    <p id="bone-preparation-reasoning" hidden={!revealed}>{ground ? "No. Preparation emphasizes matrix spaces and generally does not preserve the cells that occupied them. The image alone cannot establish prior viability." : "No. Mineral was removed during preparation. Use an appropriate retained-mineral preparation or measurement for a mineral question."} {transverse ? "A circular profile is compatible with cutting across an osteon." : "The long channel and layers are compatible with a cut along an osteon."}</p>
    <noscript><p>The lesson explains both preparations and planes in full. The default diagram is a conceptual transverse ground-bone view.</p></noscript>
  </section>;
}

"use client";

import { useId, useState } from "react";
import styles from "./learning-activities.module.css";

const slides = [
  { title: "1. A specialised epithelial sheet", clue: "Find the thick neural plate in the middle of the surface ectoderm.", explanation: "Begin with tissue identity before shape: the future neural region is part of ectoderm. The notochord beneath it is a separate axial mesodermal structure.", question: "Which feature distinguishes the neural plate from a pre-existing closed tube?", answer: "It remains a sheet without an enclosed neural-tube lumen.", path: "M 100 70 L 220 70" },
  { title: "2. The sheet bends", clue: "Trace the continuous neural epithelium down into the groove and up both folds.", explanation: "The drawing follows a local transverse level. The elevated folds approach one another as the plate bends; a central groove is still open to the space above.", question: "Is the open groove the same as a fully enclosed lumen?", answer: "No. Trace its boundary: the opening above has not yet been closed by fusion.", path: "M 100 55 C 115 55 115 135 160 135 C 205 135 205 55 220 55" },
  { title: "3. The folds meet", clue: "Follow the neural wall around the newly enclosed space.", explanation: "Fusion establishes a tube locally. This simplified geometric step does not imply that all levels close at once or that every cell migration begins only after fusion.", question: "What information is missing if this single section is used to claim that the whole embryo has completed closure?", answer: "The state of other cranial-to-caudal levels is not shown.", path: "M 160 60 C 110 60 110 145 160 145 C 210 145 210 60 160 60 Z" },
  { title: "4. Surface and tube are distinct", clue: "Identify the surface ectoderm above the internal neural tube; keep the tube wall separate from its lumen.", explanation: "The surface becomes continuous above the tube. Neural crest cells are a distinct population associated with the border/dorsal region and migrate; the dots here indicate that population schematically, not its exact number or timing.", question: "Does the notochord become the neural tube merely because it lies beneath it?", answer: "No. Position and signalling influence do not establish lineage.", path: "M 160 85 C 115 85 115 155 160 155 C 205 155 205 85 160 85 Z" },
];

export function NeurulationSlides() {
  const [index, setIndex] = useState(0);
  const titleId = useId();
  const descriptionId = useId();
  const slide = slides[index];
  return <section className={styles.card} aria-labelledby="neurulation-slides-title">
    <h2 id="neurulation-slides-title">Read a changing transverse section</h2>
    <p>Original teaching schematic of primary neurulation: dorsal is above, ventral below. It is not a specimen, is not to scale, and does not depict secondary neurulation. Neural crest timing and closure patterns are simplified.</p>
    <div className={styles.choices} aria-label="Choose developmental view">{slides.map((item, i) => <button key={item.title} type="button" aria-pressed={i === index} onClick={() => setIndex(i)}>{item.title}</button>)}</div>
    <div aria-live="polite" aria-atomic="true">
      <h3>{slide.title}</h3>
      <svg viewBox="0 0 320 220" width="100%" style={{ maxWidth: 560, display: "block" }} role="img" aria-labelledby={`${titleId} ${descriptionId}`}>
        <title id={titleId}>{slide.title}</title><desc id={descriptionId}>{slide.clue} Dorsal is at the top; the notochord is the small outlined circle beneath the neural tissue.</desc>
        <path d={index === 3 ? "M 20 50 H 300" : index === 2 ? "M 20 60 H 140 M 180 60 H 300" : index === 1 ? "M 20 55 H 100 M 220 55 H 300" : "M 20 70 H 100 M 220 70 H 300"} stroke="#a35d18" strokeWidth="7" fill="none" />
        <path d={slide.path} stroke="#244c88" strokeWidth="12" fill={index >= 2 ? "#f2f7ff" : "none"} strokeLinejoin="round" />
        <circle cx="160" cy="185" r="12" fill="#f7edd2" stroke="#514020" strokeWidth="3" />
        {index === 3 && <g fill="#7b326f" stroke="#fff" strokeWidth="2"><circle cx="106" cy="86" r="7" /><circle cx="214" cy="86" r="7" /></g>}
      </svg>
      <p><strong>Find it:</strong> {slide.clue}</p><p>{slide.explanation}</p>
      <details key={index}><summary>{slide.question}</summary><p>{slide.answer}</p></details>
    </div>
    <p><strong>Legend:</strong> thick blue line = neural epithelium; thin ochre line = surface ectoderm; lower outlined circle = notochord; purple dots in the last view = schematic neural crest cells. Shape, location and labels supplement colour.</p>
    <p>Reference: <a href="https://embryology.med.unsw.edu.au/embryology/index.php/Neural_System_Development">UNSW neural system development</a>. Compare its developmental views with this simplified sequence.</p>
  </section>;
}

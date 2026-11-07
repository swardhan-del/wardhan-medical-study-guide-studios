"use client";

import { useId, useState, useSyncExternalStore } from "react";
import stages from "@/content/retinal-development.json";
import styles from "./retinal-explorers.module.css";

const subscribe = () => () => {};
const client = () => true;
const server = () => false;

export function RetinalDevelopmentExplorer() {
  const id = useId();
  const ready = useSyncExternalStore(subscribe, client, server);
  const [selected, setSelected] = useState(0);
  const stage = stages[selected];
  return <section id="retinal-development" className={styles.explorer} aria-labelledby={`${id}-heading`}>
    <h2 id={`${id}-heading`}>Connect developmental events without merging their lineages</h2>
    <p>Follow the optic neuroepithelium and surface ectoderm as separate populations. This original relationship diagram summarises interacting processes; it is not a timed embryo series, a cross-section or a complete map of eye development.</p>
    <div className={styles.controls} role="group" aria-label="Choose a developmental stage">
      {stages.map((item, index) => <button key={item.id} type="button" disabled={!ready} aria-pressed={selected === index} aria-controls={`${id}-explanation`} onClick={() => setSelected(index)}>{index + 1}. {item.title}</button>)}
    </div>
    <div className={styles.lineages} role="img" aria-label="Two developmental routes: forebrain optic neuroepithelium forms optic cup, RPE and neural retina; surface ectoderm forms lens placode and lens vesicle. Tissue interaction does not change ancestry.">
      <div><h3>Optic neuroepithelium</h3><ol><li data-stage={selected === 0 ? "active" : undefined}>Forebrain → optic vesicle</li><li data-stage={selected === 1 ? "active" : undefined}>Folding → two-layered optic cup</li><li data-stage={selected === 2 ? "active" : undefined}>Outer layer → RPE<br />Inner layer → neural retina</li><li data-stage={selected === 3 ? "active" : undefined}>Ganglion-cell axons → brain</li></ol></div>
      <div><h3>Surface ectoderm</h3><ol><li data-stage={selected === 0 ? "active" : undefined}>Distinct surface epithelium</li><li data-stage={selected === 1 ? "active" : undefined}>Lens placode → invagination</li><li data-stage={selected === 2 ? "active" : undefined}>Separated lens vesicle</li><li data-stage={selected === 3 ? "active" : undefined}>Lens differentiation continues</li></ol></div>
    </div>
    <p className={styles.callout} id={`${id}-explanation`} role="status"><strong>{stage.title}.</strong> {stage.explanation}</p>
    <p><strong>What the arrows mean:</strong> a developmental sequence within a named population. The parallel columns do not mean identical timing. The lens has inductive interactions with the optic tissues but does not become a neuroectodermal derivative.</p>
    <details><summary>Read all four developmental explanations</summary><ol>{stages.map(item => <li key={item.id}><strong>{item.title}.</strong> {item.explanation}</li>)}</ol></details>
    <p><strong>Research challenge:</strong> an optic-cup-like shape in a mouse stem-cell culture supports organised morphogenesis under those conditions. State which extra experiments would be needed to claim visual function or normal human development.</p>
    <noscript><p>Both developmental routes and all four explanations remain available without JavaScript.</p></noscript>
  </section>;
}

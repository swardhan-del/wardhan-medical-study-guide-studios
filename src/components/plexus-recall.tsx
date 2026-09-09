"use client";
import { useState } from "react";
const stages = [
  { label: "Roots", items: ["C5", "C6", "C7", "C8", "T1"] },
  { label: "Trunks", items: ["Upper: C5–C6", "Middle: C7", "Lower: C8–T1"] },
  { label: "Divisions", items: ["Each trunk has an anterior and a posterior division"] },
  { label: "Cords", items: ["Lateral: anterior divisions of upper and middle trunks", "Medial: anterior division of lower trunk", "Posterior: posterior divisions of all three trunks"] },
  { label: "Terminal branches", items: ["Musculocutaneous: lateral cord", "Median: lateral and medial cords", "Ulnar: medial cord", "Axillary and radial: posterior cord"] },
];
export function PlexusRecall() {
  const [labels, setLabels] = useState(true);
  return <section className="study-panel" aria-labelledby="plexus-recall-title">
    <h2 id="plexus-recall-title">Rebuild the plexus without the labels</h2>
    <p>Follow the five levels, then hide their names and reconstruct the connections aloud. This is an organisational schematic; it does not show spatial position or anatomical variation.</p>
    <button className="button button-secondary" aria-pressed={!labels} onClick={() => setLabels(v => !v)}>{labels ? "Hide plexus labels" : "Show plexus labels"}</button>
    <ol className="plexus-recall-map" aria-label="Five levels of the brachial plexus">
      {stages.map((stage, i) => <li key={stage.label}><strong>{labels ? stage.label : `Level ${i+1}: name this level`}</strong>{labels ? <ul>{stage.items.map(item => <li key={item}>{item}</li>)}</ul> : <p>Identify its components and explain how it connects to the next level.</p>}</li>)}
    </ol>
    <details><summary>Check a worked route: C5 to the axillary nerve</summary><p>C5 contributes to the upper trunk. Follow its posterior division into the posterior cord, then the axillary nerve. A trunk and a cord are different levels even when fibres pass through both.</p></details>
    <p><a href="https://openstax.org/books/anatomy-and-physiology-2e/pages/13-4-the-peripheral-nervous-system" target="_blank" rel="noreferrer">Compare with the OpenStax peripheral nervous system chapter (opens in a new tab)</a></p>
  </section>;
}

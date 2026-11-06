"use client";

import { useState } from "react";
import styles from "./histology-practical.module.css";

const systems = {
  "liver-pancreas": [
    { name: "Liver blood route", steps: ["Portal venous and hepatic arterial branches", "Sinusoidal blood channels", "Central venous drainage", "Larger hepatic venous outflow"], clue: "Blood remains in the vascular route; plasma-derived material exchanges across its boundary. Disse is not a bile canaliculus.", question: "Which hepatocyte surface faces the exchange compartment?", answer: "The basal or sinusoidal domain faces the space of Disse. The apical canalicular domain lies between neighbouring hepatocytes and carries bile." },
    { name: "Bile route", steps: ["Hepatocyte apical secretion", "Canaliculi between adjacent hepatocytes", "Small transitional biliary channels", "Portal-region bile ducts", "Larger biliary passages"], clue: "A canaliculus is bounded by hepatocytes; a bile duct has a distinct epithelial lining.", question: "Why should the bile arrow not end in a central vein?", answer: "Bile and blood occupy different channels. Bile drains toward the biliary tree, whereas sinusoidal blood drains toward central venous outflow." },
    { name: "Pancreatic exocrine route", steps: ["Polarised acinar cell", "Apical secretion into the acinar lumen", "Centroacinar and intercalated duct origin", "Larger pancreatic ducts", "Duodenal lumen"], clue: "Ductal fluid and bicarbonate accompany acinar products. Not every digestive enzyme is an inactive zymogen.", question: "Does an apical granule establish the activation state of every enzyme it contains?", answer: "No. Packaging, transport and activation are different questions. Several proteases travel as precursors, while other digestive enzymes are secreted in active forms." },
    { name: "Pancreatic endocrine route", steps: ["Endocrine cell in an islet", "Hormone release toward the vascular environment", "Islet capillary circulation", "Blood-borne delivery", "Responsive target tissues"], clue: "The endocrine route does not enter the exocrine duct lumen.", question: "Does hormone immunostaining alone prove mature regulated secretion?", answer: "No. It demonstrates a product under the staining conditions; physiological responsiveness requires an appropriate functional test." },
  ],
  "renal-histology": [
    { name: "Blood route", steps: ["Afferent arteriole", "Glomerular capillary tuft", "Efferent arteriole", "Peritubular capillaries or medullary vasa recta", "Venous return"], clue: "The efferent arteriole carries blood. It does not drain capsular filtrate.", question: "Where does filtered fluid leave this vascular route?", answer: "Across the filtration interface into capsular space, then through the urinary pole into proximal tubular lumen." },
    { name: "Filtrate route", steps: ["Capsular space", "Proximal tubule", "Loop and distal nephron", "Connection to collecting system", "Collecting ducts toward papilla and calyx"], clue: "Reabsorption crosses epithelial and vascular boundaries; the two lumina do not simply open into each other.", question: "Why is the collecting system continuous with a nephron but developmentally distinguished?", answer: "Its epithelium comes from the ureteric bud, whereas nephron epithelial progenitors form the connected nephron." },
    { name: "Nephron formation", steps: ["Nephron progenitor compartment beside ureteric epithelium", "Pretubular aggregate", "Epithelial renal vesicle with polarity and lumen", "Comma-shaped and S-shaped bodies", "Regional differentiation and collecting-system connection"], clue: "This is a simplified epithelial sequence. Vascular and stromal contributions are not a single nephron epithelial lineage.", question: "Does detection of a mature-segment marker prove complete mature transport function?", answer: "No. Marker detection, morphology and physiological function are different readouts and require appropriate evidence." },
  ],
  "respiratory-histology": [
    { name: "Airway levels", steps: ["Cartilage-supported conducting airway", "Bronchiole without cartilage or submucosal glands", "Terminal bronchiole: continuous conducting wall", "Respiratory bronchiole: wall interrupted by alveolar openings", "Alveolar ducts and distal exchange spaces"], clue: "An alveolus beside a wall does not prove an opening through that wall.", question: "Which observation distinguishes the first respiratory airway from the final conducting airway?", answer: "An alveolar opening interrupting a recognisable bronchiolar wall, demonstrated in the section rather than inferred from proximity." },
    { name: "Exchange route", steps: ["Alveolar lining material", "Attenuated type I epithelium", "Closely apposed or fused basal laminae in thin regions", "Capillary endothelium", "Capillary blood"], clue: "A macrophage clears material but is not an obligatory continuous layer in this diffusion route.", question: "Can every fine barrier layer be resolved in a low-power H&E field?", answer: "No. The fine epithelial, basement-membrane and endothelial relationships require appropriate higher-resolution evidence." },
    { name: "Lung maturation", steps: ["Respiratory specification in foregut epithelium", "Branching epithelium within mesenchyme", "Pseudoglandular organisation", "Canalicular and saccular maturation", "Alveolarisation and continuing septal remodelling"], clue: "Stages overlap. A single field cannot supply an exact age or a clinical viability threshold.", question: "What must be checked before comparing week labels from two publications?", answer: "The age convention, species, sampled region and definition of each stage; gestational and postconception week labels cannot be equated without checking." },
  ],
};

export function SystemRelationships({ lessonId }: { lessonId: keyof typeof systems }) {
  const [active, setActive] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const entries = systems[lessonId];
  const item = entries[active];
  return <section className={styles.panel} aria-labelledby="system-relationships-title">
    <p className="eyebrow">Trace a route</p>
    <h2 id="system-relationships-title">Trace each route</h2>
    <p>Select a route, explain each transition, then answer the question before revealing the reasoning. These are conceptual maps, not microscope images.</p>
    <div className={styles.choices} aria-label="Relationship to explore">{entries.map((entry, index) => <button key={entry.name} type="button" aria-pressed={active === index} onClick={() => { setActive(index); setRevealed(false); }}>{entry.name}</button>)}</div>
    <div aria-live="polite" aria-atomic="true">
      <h3>{item.name}</h3>
      <ol aria-label="Selected relationship">{item.steps.map(step => <li key={step}>{step}</li>)}</ol>
      <p className={styles.clue}><strong>Key point:</strong> {item.clue}</p>
      <p><strong>Explain it:</strong> {item.question}</p>
      <div className={styles.choices}><button type="button" aria-expanded={revealed} aria-controls="system-relationship-answer" onClick={() => setRevealed(!revealed)}>{revealed ? "Hide the reasoning" : "Reveal the reasoning"}</button></div>
      <p id="system-relationship-answer" hidden={!revealed}>{item.answer}</p>
    </div>
    <noscript><p>The full route and development explanations are available in the lesson sections above.</p></noscript>
  </section>;
}

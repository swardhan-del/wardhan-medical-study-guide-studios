"use client";

import { useState } from "react";
import styles from "./histology-practical.module.css";

const glands = [
  { name: "Simple unbranched", duct: "One unbranched duct", units: "One secretory unit", reasoning: "Neither the duct nor the secretory end piece branches in this simplified example." },
  { name: "Simple branched", duct: "One unbranched duct", units: "Several secretory units sharing that duct", reasoning: "The secretory portion branches, but the duct does not. Several end pieces alone do not make a gland compound." },
  { name: "Compound", duct: "A branching duct system", units: "Secretory units drain into branches", reasoning: "Compound classifies the duct tree. Tubular, acinar and mixed secretory shapes are a separate descriptive axis." },
];

export function GlandStructureExplorer() {
  const [active, setActive] = useState(0);
  const [reveal, setReveal] = useState(false);
  const gland = glands[active];
  return <section className={styles.panel} aria-labelledby="gland-explorer-title">
    <p className="eyebrow">Compare the architecture</p>
    <h2 id="gland-explorer-title">Trace the duct, then classify the gland</h2>
    <p>Select an arrangement. Follow the duct from its opening before inspecting the secretory portion. These original diagrams simplify topology; they are not tissue sections or an embryonic sequence.</p>
    <div className={styles.choices} aria-label="Gland arrangement">
      {glands.map((item, i) => <button type="button" key={item.name} aria-pressed={active === i} onClick={() => { setActive(i); setReveal(false); }}>{item.name}</button>)}
    </div>
    <div aria-live="polite" aria-atomic="true">
      <h3>{gland.name}</h3>
      <svg viewBox="0 0 360 220" width="360" height="220" className={styles.diagram} aria-hidden="true" focusable="false">
        <path d="M25 25H335" stroke="#526f66" strokeWidth="3" />
        <path d="M180 25V100" stroke="#185c83" strokeWidth="16" fill="none" />
        {active === 0 && <ellipse cx="180" cy="155" rx="38" ry="53" fill="#d5ead9" stroke="#276d5b" strokeWidth="4" strokeDasharray="7 4" />}
        {active === 1 && <>
          <path d="M180 100Q110 105 95 160M180 100V167M180 100Q250 105 265 160" fill="none" stroke="#276d5b" strokeWidth="20" strokeDasharray="7 4" />
          {[95,180,265].map(x => <ellipse key={x} cx={x} cy="172" rx="28" ry="31" fill="#d5ead9" stroke="#276d5b" strokeWidth="4" strokeDasharray="7 4" />)}
        </>}
        {active === 2 && <>
          <path d="M180 100L85 133V151M180 100V151M180 100L275 133V151" fill="none" stroke="#185c83" strokeWidth="16" />
          {[85,180,275].map(x => <ellipse key={x} cx={x} cy="177" rx="28" ry="28" fill="#d5ead9" stroke="#276d5b" strokeWidth="4" strokeDasharray="7 4" />)}
        </>}
      </svg>
      <p className="muted-note">Top line: surface with the duct opening. Solid blue paths: ducts. Dashed green outlines: secretory portions. The same relationships are described below.</p>
      <dl><dt><strong>Duct pattern</strong></dt><dd>{gland.duct}</dd><dt><strong>Secretory pattern</strong></dt><dd>{gland.units}</dd></dl>
      <p className={styles.clue}><strong>Identify the branch:</strong> Does the branching occur in the duct, the secretory portion, or neither?</p>
      <div className={styles.choices}><button type="button" aria-expanded={reveal} aria-controls="gland-reasoning" onClick={() => setReveal(!reveal)}>{reveal ? "Hide gland reasoning" : "Reveal gland reasoning"}</button></div>
      <p id="gland-reasoning" hidden={!reveal}>{gland.reasoning}</p>
      <p>A two-dimensional crop may not establish the entire duct tree. Ask for a wider field or additional structural evidence when the connections are missing.</p>
    </div>
    <noscript><p>Read the duct-classification explanation above for all three arrangements. Interactive comparison requires JavaScript.</p></noscript>
  </section>;
}

const conditions = [
  { name: "A: reference comparison", r: 4, t: 1, answer: "This is the comparison condition: relative conductance is 1/4 = 0.25 and tracer index is 1. It is not an assertion of normal health." },
  { name: "B: resistance changes", r: 2, t: 1, answer: "Compared with A, resistance halves and conductance doubles from 0.25 to 0.5. The specified tracer index is unchanged. These values alone do not identify the route or a claudin." },
  { name: "C: tracer changes", r: 4, t: 2, answer: "Compared with A, conductance remains 0.25 while the tracer index doubles. A tracer result and an electrical result cannot be used interchangeably." },
  { name: "D: both readouts change", r: 2, t: 2, answer: "Compared with A, conductance and tracer index both double. The paired change still does not identify a specific molecular defect or a clinical diagnosis." },
];

const contacts = [
  { name: "Tight junction", partner: "Neighbouring cell near the apical boundary", link: "Selective paracellular barrier and membrane-domain organisation", point: [180, 58], explanation: "A close cell–cell boundary regulates passage around cells. It is not a cytoplasm-to-cytoplasm channel or literal fusion of two plasma membranes." },
  { name: "Adherens junction", partner: "Neighbouring cell", link: "Cadherin-associated attachment to actin", point: [180, 90], explanation: "Connect the adhesion to actin organisation and cell-shape change. A belt is a useful epithelial model, not the only shape of every adherens contact." },
  { name: "Desmosome", partner: "Neighbouring cell", link: "Desmosomal cadherins and intermediate-filament anchorage", point: [180, 125], explanation: "The two cell-facing plaques distribute mechanical stress. They do not provide an open communicating pore." },
  { name: "Gap junction", partner: "Neighbouring cytoplasm through paired channels", link: "Connexons form an intercellular communication route", point: [180, 160], explanation: "Start inside one cell and finish inside the other. This route differs from extracellular passage between epithelial chambers." },
  { name: "Hemidesmosome", partner: "Extracellular matrix below the cell", link: "Intermediate-filament attachment through a basal adhesion complex", point: [95, 202], explanation: "The external partner is matrix, not another cell. Despite its name, the attachment is not literally half a desmosome with identical molecular composition." },
  { name: "Focal adhesion", partner: "Extracellular matrix", link: "Integrins and associated adaptors connect to actin", point: [265, 202], explanation: "Both this contact and a hemidesmosomal attachment face matrix. Their characteristic cytoskeletal linkage distinguishes them." },
];

export function JunctionMapExplorer() {
  const [active, setActive] = useState(0);
  const contact = contacts[active];
  return <section className={styles.panel} aria-labelledby="junction-map-title">
    <p className="eyebrow">Locate the contact</p>
    <h2 id="junction-map-title">Which partner is connected?</h2>
    <p>Select a contact to locate its relationship in this original schematic. Positions separate the examples for comparison; their spacing and inventory are not a literal map of every epithelial cell.</p>
    <div className={styles.choices} aria-label="Junction to compare">{contacts.map((item, i) => <button type="button" key={item.name} aria-pressed={active === i} onClick={() => setActive(i)}>{item.name}</button>)}</div>
    <div aria-live="polite" aria-atomic="true">
      <h3>{contact.name}</h3>
      <svg className={styles.diagram} viewBox="0 0 360 245" width="360" height="245" aria-hidden="true" focusable="false">
        <rect x="32" y="35" width="135" height="165" rx="8" fill="#e4f0ed" stroke="#173d35" strokeWidth="3" />
        <rect x="193" y="35" width="135" height="165" rx="8" fill="#e4f0ed" stroke="#173d35" strokeWidth="3" />
        <ellipse cx="100" cy="125" rx="22" ry="30" fill="#a7beb7" /><ellipse cx="260" cy="125" rx="22" ry="30" fill="#a7beb7" />
        {[58,90,125,160].map(y => <path key={y} d={`M160 ${y}H200`} stroke="#526f66" strokeWidth="5" />)}
        <path d="M20 215H340" stroke="#526f66" strokeWidth="8" strokeDasharray="12 5" />
        <path d="M95 195V215M265 195V215" stroke="#526f66" strokeWidth="5" />
        <circle cx={contact.point[0]} cy={contact.point[1]} r="20" fill="none" stroke="#a04b14" strokeWidth="5" />
      </svg>
      <p className="muted-note">The two outlined shapes represent neighbouring cells, with apical surfaces at the top. The dashed band beneath them represents extracellular matrix. The ring selects the contact; its meaning is also given in text.</p>
      <dl><dt><strong>Partner</strong></dt><dd>{contact.partner}</dd><dt><strong>Connection or task</strong></dt><dd>{contact.link}</dd></dl>
      <p className={styles.clue}><strong>Distinguish it:</strong> {contact.explanation}</p>
    </div>
    <noscript><p>All six contacts and their comparisons are explained in the lesson sections above.</p></noscript>
  </section>;
}

export function BarrierReadoutExplorer() {
  const [active, setActive] = useState(0);
  const [reveal, setReveal] = useState(false);
  const condition = conditions[active];
  return <section className={styles.panel} aria-labelledby="barrier-explorer-title">
    <p className="eyebrow">Interpret two measurements</p>
    <h2 id="barrier-explorer-title">Resistance and tracer passage: compare the evidence</h2>
    <p>These values are invented for learning. Geometry is fixed and resistance is already blank-corrected. Here r = R/Rref, g = G/Gref = 1/r, and t is a named tracer-transfer index relative to its own reference over a fixed interval. It is not a permeability coefficient.</p>
    <p className={styles.clue}><strong>Always compare with A:</strong> r = 4, g = 0.25, t = 1. A is a comparison condition, not a clinical normal range.</p>
    <div className={styles.choices} aria-label="Barrier condition">
      {conditions.map((item, i) => <button type="button" key={item.name} aria-pressed={active === i} onClick={() => { setActive(i); setReveal(false); }}>{item.name}</button>)}
    </div>
    <div aria-live="polite" aria-atomic="true">
      <h3>{condition.name}</h3>
      <dl><dt><strong>Relative resistance r</strong></dt><dd>{condition.r}</dd><dt><strong>Tracer index t</strong></dt><dd>{condition.t}</dd></dl>
      <p><strong>Calculate before revealing:</strong> What is g = 1/r, and which readout changes compared with A?</p>
      <div className={styles.choices}><button type="button" aria-expanded={reveal} aria-controls="barrier-reasoning" onClick={() => setReveal(!reveal)}>{reveal ? "Hide barrier reasoning" : "Reveal barrier reasoning"}</button></div>
      <div id="barrier-reasoning" hidden={!reveal} className={styles.feedback}><p><strong>Relative conductance g = {1 / condition.r}</strong></p><p>{condition.answer}</p></div>
      <p>In real data, uncertainty, replication, tracer identity and pathway controls matter. Equal invented numbers here do not teach that a nonsignificant experimental difference proves equivalence.</p>
    </div>
    <noscript><p>The explanation above includes the four conditions and their interpretation. Interactive comparison requires JavaScript.</p></noscript>
  </section>;
}

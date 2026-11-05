"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./histology-practical.module.css";

const profiles = [
  { name: "Cross-cut villus", centre: "Connective-tissue core", outside: "Intestinal lumen", basal: "Toward the central connective tissue", answer: 0, explanation: "A villus projects into the intestinal lumen. Cutting across it leaves epithelium around a core of lamina propria, which can contain vessels and other cells." },
  { name: "Cross-cut crypt", centre: "Crypt lumen", outside: "Surrounding lamina propria", basal: "Toward the surrounding connective tissue", answer: 1, explanation: "A crypt is an epithelial invagination. Cutting across it leaves an epithelial ring around its own lumen, with supporting connective tissue outside the ring." },
] as const;
const options = ["Connective tissue inside the epithelial ring", "A lumen inside the epithelial ring", "A whole submucosal fold inside one epithelial cell"];

export function GIProfileExplorer() {
  const [selected, setSelected] = useState(0);
  const [labels, setLabels] = useState(false);
  const [choice, setChoice] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const profile = profiles[selected];
  const villus = selected === 0;
  return <section className={styles.panel} aria-labelledby="gi-profile-explorer-title">
    <p className="eyebrow">Interpret the section</p>
    <h2 id="gi-profile-explorer-title">Villus or crypt: inspect the centre</h2>
    <p>Both can look round in cross-section. Choose a profile, inspect the tissue on each side of the epithelial ring, then explain which side is apical.</p>
    <div className={styles.choices} aria-label="Profile to compare">
      {profiles.map((item, index) => <button key={item.name} type="button" aria-pressed={selected === index} onClick={() => { setSelected(index); setChoice(null); setChecked(false); setLabels(false); }}>{item.name}</button>)}
    </div>
    <h3>{profile.name}</h3>
    <figure style={{ margin: 0 }}>
      <svg viewBox="0 0 320 280" role="img" aria-labelledby="gi-profile-image-title" aria-describedby="gi-profile-image-description" style={{ width: "100%", maxWidth: 420, height: "auto", display: "block", marginInline: "auto" }}>
        <title id="gi-profile-image-title">{`${profile.name}: original conceptual cross-section`}</title>
        <desc id="gi-profile-image-description">{`${profile.centre} at the centre, an epithelial ring around it, and ${profile.outside.toLowerCase()} outside. The apical epithelial surface faces the lumen. This is not a microscope image or a measured reconstruction.`}</desc>
        <rect x="2" y="2" width="316" height="276" rx="16" fill={villus ? "#fffdf7" : "#f3d4c9"} stroke="#344c46" strokeWidth="2" />
        <circle cx="160" cy="140" r="100" fill="#bfd7cb" stroke="#173d35" strokeWidth="4" />
        <circle cx="160" cy="140" r="67" fill={villus ? "#f3d4c9" : "#fffdf7"} stroke="#173d35" strokeWidth="4" />
        {Array.from({ length: 16 }, (_, i) => {
          const angle = i * Math.PI / 8;
          return <ellipse key={i} cx={160 + Math.cos(angle) * 83} cy={140 + Math.sin(angle) * 83} rx="5" ry="9" fill="#253b58" transform={`rotate(${i * 22.5} ${160 + Math.cos(angle) * 83} ${140 + Math.sin(angle) * 83})`} />;
        })}
        {(villus ? [[137, 113], [188, 134], [139, 172], [179, 177]] : [[30, 70], [285, 110], [40, 230], [270, 235]]).map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="4" ry="8" fill="#76554c" transform={`rotate(35 ${x} ${y})`} />)}
        <text x="160" y="148" textAnchor="middle" fontSize="26" fontWeight="700" fill="#173d35">A</text>
        <path d="M 42 140 H 70" fill="none" stroke="#173d35" strokeWidth="2" />
        <circle cx="28" cy="140" r="14" fill="#fffdf7" stroke="#173d35" strokeWidth="2" />
        <text x="28" y="148" textAnchor="middle" fontSize="22" fontWeight="700" fill="#173d35">B</text>
        <text x="290" y="35" textAnchor="middle" fontSize="22" fontWeight="700" fill="#173d35">C</text>
      </svg>
      <figcaption>Original schematic, not a histology photograph. A = centre; B = epithelial ring; C = surrounding space or tissue. Colours distinguish compartments and do not simulate a stain. Vessels and individual cell boundaries are simplified or omitted.</figcaption>
    </figure>
    <div className={styles.choices}><button type="button" aria-expanded={labels} aria-controls="gi-profile-labels" onClick={() => setLabels(!labels)}>{labels ? "Hide compartment labels" : "Reveal compartment labels"}</button></div>
    <dl id="gi-profile-labels" hidden={!labels}>
      <dt>A — centre</dt><dd>{profile.centre}</dd>
      <dt>B — epithelial ring</dt><dd>Apical surfaces face the lumen. Basal surfaces face supporting connective tissue: {profile.basal.toLowerCase()}.</dd>
      <dt>C — outside</dt><dd>{profile.outside}</dd>
    </dl>
    <fieldset className={styles.question}>
      <legend>Which observation fits the selected profile?</legend>
      {options.map((option, index) => <label key={option} style={{ display: "flex", alignItems: "flex-start", gap: ".6rem" }}><input style={{ width: 20, height: 20, padding: 0, flexShrink: 0, marginTop: ".35em" }} type="radio" name="gi-profile-answer" checked={choice === index} onChange={() => { setChoice(index); setChecked(false); }} />{option}</label>)}
      <button type="button" disabled={choice === null} onClick={() => setChecked(true)}>Check the profile</button>
    </fieldset>
    <div className={styles.feedback} role="status" aria-live="polite">{checked && <p><strong>{choice === profile.answer ? "Correct relationship. " : "Recheck the centre. "}</strong>{profile.explanation} A microvillus is a cell-surface projection and does not contain a submucosal tissue core.</p>}</div>
    <p className={styles.clue}><strong>Transfer to a real slide:</strong> trace the epithelial boundary and inspect its centre before naming a round profile. A disrupted or oblique section may require neighbouring profiles or another section.</p>
    <details><summary>Read both profiles without the controls</summary><p>A cross-cut villus has connective tissue inside its epithelial ring and intestinal lumen outside. A cross-cut crypt has lumen inside its epithelial ring and lamina propria outside. In both, the apical epithelial surface faces the lumen and the basal surface faces supporting tissue.</p></details>
    <p><a href="https://histology.oit.duke.edu/MBS/SysSci/SS-GItract/SS-GItract.html">Explore the Duke GI practical and linked slides</a>. For preparation and stain reasoning, <Link href="/learn/visual-studio">visit the Visual Study Studio</Link>.</p>
  </section>;
}

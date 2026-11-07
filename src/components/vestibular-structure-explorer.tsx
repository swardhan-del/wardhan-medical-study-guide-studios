"use client";

import { useId, useState, useSyncExternalStore } from "react";
import structures from "../content/vestibular-diagrams.json";
import styles from "./vestibular-structure-explorer.module.css";

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

type StructureKind = "crista" | "macula";

function StructureDrawing({ kind, selected, prefix }: { kind: StructureKind; selected: number; prefix: string }) {
  const crista = kind === "crista", y = crista ? 175 : 200;
  const markers = crista ? [[300, 215], [300, 75], [440, 215]] : [[300, 235], [300, 90], [465, 190]];
  return <svg viewBox="0 0 600 290" role="img" aria-labelledby={`${prefix}-title ${prefix}-description`}>
    <title id={`${prefix}-title`}>{`${crista ? "Crista and cupula" : "Macula and otolithic membrane"}: original schematic`}</title>
    <desc id={`${prefix}-description`}>A simplified sensory epithelium and its overlying material. The numbered features correspond to the labelled controls and explanations below. This is neither a tissue photograph nor a scale drawing.</desc>
    <rect width="600" height="290" fill="#eef8fb" />
    {crista ? <>
      <path d="M185 190 Q150 40 300 30 Q450 40 415 190Z" fill="#b2e1e7" fillOpacity=".8" stroke="#27626e" strokeWidth="3" />
      <path d="M30 30H570" stroke="#27626e" strokeWidth="3" />
      <path d="M30 260H570V230H440Q390 175 360 180H240Q205 175 160 230H30Z" fill="#ebd0b8" stroke="#684b36" strokeWidth="3" />
    </> : <>
      <path d="M95 122 Q300 102 505 122V157H95Z" fill="#b2e1e7" stroke="#27626e" strokeWidth="3" />
      {Array.from({ length: 9 }, (_, i) => 125 + i * 42).map(x => <path key={x} d={`M${x} 108l11 -12 13 9 -3 15 -16 3Z`} fill="#dfbd61" stroke="#705114" strokeWidth="2" />)}
      <path d="M30 260H570V205H30Z" fill="#ebd0b8" stroke="#684b36" strokeWidth="3" />
    </>}
    {[220, 290, 360].map(x => <g key={x}>
      <rect x={x - 20} y={y - 4} width="20" height="49" rx="4" fill="#e6a4ad" stroke="#803b50" strokeWidth="2" />
      <ellipse cx={x + 10} cy={y + 6} rx="14" ry="26" fill="#8baee0" stroke="#163d77" strokeWidth="3" />
      {[[0, 20], [7, 29], [14, 38]].map(([dx, height]) => <path key={dx} d={`M${x + dx} ${y - 17}v-${height}`} stroke="#173a4f" strokeWidth="3" />)}
    </g>)}
    {markers.map(([x, cy], index) => <g key={index} aria-hidden="true">
      <circle cx={x} cy={cy} r="20" fill={selected === index ? "#143b55" : "white"} stroke="#143b55" strokeWidth="3" />
      <text x={x} y={cy + 10} textAnchor="middle" fill={selected === index ? "white" : "#143b55"} fontSize="30" fontFamily="sans-serif" fontWeight="700">{String(index + 1)}</text>
    </g>)}
  </svg>;
}

export function VestibularStructureExplorer() {
  const id = useId();
  const hydrated = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const [shown, setShown] = useState<StructureKind | "all">("all");
  const [selected, setSelected] = useState<Record<StructureKind, number>>({ crista: 0, macula: 0 });
  return <section className={styles.explorer} aria-labelledby={`${id}-heading`}>
    <h2 id={`${id}-heading`}>Compare the sensory architecture</h2>
    <p>First locate the sensory epithelium, then its overlying material, then the mechanical relationship. These original schematics explain relationships; they cannot identify an unknown real specimen. Their colours are illustrative, not histological stains.</p>
    <p><strong>Diagram key:</strong> blue oval cells represent receptor hair cells; pink rectangular cells represent supporting cells. Short lines above the receptors represent hair bundles. The pale blue material is the cupula or otolithic membrane, and the gold shapes represent otoconia. Cell shapes and proportions are simplified.</p>
    <div className={styles.controls} role="group" aria-label="Choose a sensory structure">
      {([["all", "Compare both"], ["crista", "Crista and cupula"], ["macula", "Macula and otoconia"]] as const).map(([value, label]) => <button key={value} type="button" disabled={!hydrated} aria-pressed={shown === value} onClick={() => setShown(value)}>{label}</button>)}
    </div>
    <div className={styles.panels}>{structures.map(structure => {
      const kind = structure.id as StructureKind, prefix = `${id}-${kind}`, feature = structure.features[selected[kind]];
      return <section key={kind} hidden={shown !== "all" && shown !== kind} aria-labelledby={`${prefix}-heading`}>
        <h3 id={`${prefix}-heading`}>{structure.title}</h3>
        <StructureDrawing kind={kind} selected={selected[kind]} prefix={prefix} />
        <div className={styles.features} role="group" aria-label={`${structure.title}: diagram features`}>
          {structure.features.map((item, index) => <button key={item.title} type="button" disabled={!hydrated} aria-pressed={selected[kind] === index} aria-controls={`${prefix}-explanation`} onClick={() => setSelected(previous => ({ ...previous, [kind]: index }))}>{`${index + 1}. ${item.title}`}</button>)}
        </div>
        <p id={`${prefix}-explanation`} className={styles.explanation} role="status"><strong>{feature.title}.</strong> {feature.description}</p>
        <details><summary>Read all three feature explanations</summary><ol>{structure.features.map(item => <li key={item.title}><strong>{item.title}.</strong> {item.description}</li>)}</ol></details>
      </section>;
    })}</div>
    <p className={styles.prompt}><strong>Try an identification argument:</strong> hair cells occur in both structures. Name the spatial relationship that distinguishes a crista from a macula, then state what an incomplete section might fail to show.</p>
    <noscript><p>Both diagrams and every feature explanation are available without JavaScript. The selection controls require JavaScript.</p></noscript>
  </section>;
}

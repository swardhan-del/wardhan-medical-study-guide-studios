"use client";

import { useId, useState, useSyncExternalStore } from "react";
import { calculateVestibularInput, compareVestibularInputs, equalInputPair, formatVestibularDifference, type VestibularInput, type VestibularVectors } from "../lib/vestibular-model";
import styles from "./vestibular-motion-explorer.module.css";

const subscribeToHydration = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

const rest = (): VestibularInput => ({ tilt: "0", ax: "0", az: "0" });
const coordinates = (values: [number, number]) => `(${values.map(value => (Math.abs(value) < .0005 ? 0 : value).toFixed(3)).join(", ")})`;

function VectorPlot({ vectors, id, label }: { vectors: VestibularVectors; id: string; label: string }) {
  const rows = [
    { id: "gravity", values: vectors.gravity, color: "#176288", width: 5 },
    { id: "acceleration", values: vectors.acceleration, color: "#99600c", width: 4 },
    { id: "input", values: vectors.input, color: "#7c3e91", width: 3 },
  ];
  return <svg className={styles.plot} viewBox="0 0 320 320" role="img" aria-labelledby={`${id}-title ${id}-description`}>
    <title id={`${id}-title`}>{`${label}: head-fixed vectors`}</title>
    <desc id={`${id}-description`}>The x-axis points right and the z-axis points up. Gravity is blue and solid, acceleration amber and dashed, and model input purple and solid. The numerical components below are the text equivalent. Overlapping vectors may conceal one another.</desc>
    <rect x="5" y="5" width="310" height="310" rx="12" fill="#f5f8fc" />
    <path d="M25 160H295M160 295V25" stroke="#586d80" />
    <text x="290" y="148" fontSize="18" fill="#263c52">x</text><text x="172" y="25" fontSize="18" fill="#263c52">z</text>
    <defs>{rows.map(row => <marker key={row.id} id={`${id}-${row.id}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill={row.color} /></marker>)}</defs>
    {rows.filter(row => Math.hypot(...row.values) >= 1e-12).map(row => <line key={row.id} x1="160" y1="160" x2={160 + row.values[0] * 40} y2={160 - row.values[1] * 40} stroke={row.color} strokeWidth={row.width} strokeDasharray={row.id === "acceleration" ? "6 3" : undefined} markerEnd={`url(#${id}-${row.id})`} />)}
  </svg>;
}

export function VestibularMotionExplorer() {
  const id = useId();
  const hydrated = useSyncExternalStore(subscribeToHydration, clientSnapshot, serverSnapshot);
  const [inputs, setInputs] = useState<[VestibularInput, VestibularInput]>([rest(), rest()]);
  const vectors = inputs.map(calculateVestibularInput);
  const comparison = vectors[0] && vectors[1] ? compareVestibularInputs(vectors[0], vectors[1]) : null;
  function change(index: number, key: keyof VestibularInput, value: string) {
    setInputs(previous => previous.map((input, i) => i === index ? { ...input, [key]: value } : input) as [VestibularInput, VestibularInput]);
  }
  return <section className={styles.explorer} aria-labelledby={`${id}-heading`}>
    <h2 id={`${id}-heading`}>Different causes, the same model input</h2>
    <p className={styles.callout}><strong>q = g<sub>head</sub> − a.</strong> The x-axis points right and the z-axis points up in the head. Positive tilt is rightward roll. Acceleration components are expressed in these head-fixed axes, in units of g.</p>
    <p>This original two-dimensional geometry model separates gravity in head coordinates from translational acceleration. It does not simulate an otolith organ, a neuron, perceived movement or a diagnostic test. A matching vector does not identify a unique physical cause.</p>
    <div className={styles.controls}>
      <button type="button" disabled={!hydrated} onClick={() => setInputs(equalInputPair())}>Load the equal-input pair</button>
      <button type="button" disabled={!hydrated} onClick={() => setInputs([rest(), rest()])}>Reset both to upright rest</button>
    </div>
    <div className={styles.cases}>{inputs.map((input, index) => {
      const label = `Scenario ${index === 0 ? "A" : "B"}`, caseId = `${id}-${index}`, result = vectors[index];
      return <fieldset key={index} className={styles.case}>
        <legend>{label}</legend>
        {([
          ["tilt", "Rightward head tilt (degrees)", -90, 90],
          ["ax", "Head acceleration along x (g)", -2, 2],
          ["az", "Head acceleration along z (g)", -2, 2],
        ] as const).map(([key, text, min, max]) => <label key={key} htmlFor={`${caseId}-${key}`}>{text}<input id={`${caseId}-${key}`} type="number" inputMode="decimal" step="any" min={min} max={max} value={input[key]} disabled={!hydrated} aria-invalid={!result || undefined} aria-describedby={`${caseId}-limits${result ? "" : ` ${caseId}-error`}`} onChange={event => change(index, key, event.target.value)} /></label>)}
        <p id={`${caseId}-limits`}>Use finite values: tilt −90 to 90 degrees; each acceleration −2 to 2 g.</p>
        {!result ? <p id={`${caseId}-error`} role="status" className={styles.error}>Enter finite values within the listed limits. This scenario has no calculated result until corrected.</p> : <>
          <VectorPlot vectors={result} id={`${caseId}-plot`} label={label} />
          <p className={styles.output} role="status" aria-live="polite">g_head = {coordinates(result.gravity)}; a = {coordinates(result.acceleration)}; q = {coordinates(result.input)}. Components are (x, z), in g, rounded to three decimals.</p>
        </>}
      </fieldset>;
    })}</div>
    <p>Blue solid: g<sub>head</sub>. Amber dashed: a. Purple solid: q. A zero vector has no arrow. Compare both numerical components when arrows overlap; rounded components can conceal a small difference.</p>
    <p className={styles.callout} role="status" data-equal={comparison?.equal} data-difference={comparison?.difference}>{!comparison ? "Correct both scenarios before comparing the model inputs." : comparison.equal ? "Both q components match within numerical precision. This does not establish that tilt and translation are the same." : `The q vectors differ. Component-vector difference magnitude: ${formatVestibularDifference(comparison.difference)} g. Matching one component alone is insufficient.`}</p>
    <details><summary>Read the worked pair and its limits</summary>
      <p>Scenario A: tilt 30°, acceleration (0, 0), gives q ≈ (0.500, −0.866). Scenario B: upright, acceleration approximately (−0.500, −0.133975), gives the same q to the displayed precision. The preset calculates the second acceleration from the first vector before displaying it. These are original algebraic examples, not measured participant data.</p>
      <p>The comparison uses the underlying numbers, with a numerical tolerance of 10⁻⁹ g; it is not a biological detection threshold. The model omits canal dynamics, tissue mechanics, neural coding, sensory integration and perception.</p>
    </details>
    <noscript><p>The worked pair and its explanation remain available without JavaScript. Editing the model requires JavaScript. No response is sent to a server.</p></noscript>
  </section>;
}

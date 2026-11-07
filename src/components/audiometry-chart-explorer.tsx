"use client";

import { useState, useSyncExternalStore } from "react";
import data from "@/content/audiometry-chart.json";
import { checkAudiometryDifference, compareAudiometryThresholds } from "@/lib/audiometry-model";
import styles from "./audiometry-chart-explorer.module.css";

const subscribe = () => () => {};
const frequencyX = (hz: number) => 80 + 100 * Math.log2(hz / 250);
const levelY = (db: number) => 70 + (db + 10) * 5;

function symbol(ear: string, route: "air" | "bone", masked: boolean) {
  return route === "air" ? (masked ? (ear === "right" ? "△" : "□") : (ear === "right" ? "○" : "×")) : (masked ? (ear === "right" ? "[" : "]") : (ear === "right" ? "<" : ">"));
}

export function AudiometryChartExplorer() {
  const ready = useSyncExternalStore(subscribe, () => true, () => false);
  const [caseId, setCaseId] = useState("gap");
  const [frequency, setFrequency] = useState(1000);
  const [answer, setAnswer] = useState("");
  const [unavailable, setUnavailable] = useState(false);
  const [feedback, setFeedback] = useState<ReturnType<typeof checkAudiometryDifference> | null>(null);
  const [showAir, setShowAir] = useState(true);
  const [showBone, setShowBone] = useState(true);
  const current = data.cases.find(item => item.id === caseId)!;
  const point = current.values.find(item => item.frequencyHz === frequency)!;
  const airSymbol = symbol(current.ear, "air", current.airMasking === "masked");
  const boneSymbol = symbol(current.ear, "bone", current.boneMasking === "masked");
  const boneOffset = current.ear === "right" ? -10 : 10;
  function clearAnswer() { setAnswer(""); setUnavailable(false); setFeedback(null); }
  function check() { setFeedback(checkAudiometryDifference(compareAudiometryThresholds(point, current.earSpecificEstablished), answer, unavailable)); }
  const valueText = (value: number | null) => value === null ? "Not supplied" : `${value} dB HL`;
  return <section id="audiogram-explorer" className={`study-panel ${styles.panel}`} aria-labelledby="audiogram-explorer-title">
    <p className="eyebrow">Compare, calculate, qualify</p>
    <h2 id="audiogram-explorer-title">What does the audiogram actually establish?</h2>
    <p>{data.intro}</p>
    <div className={styles.controls} role="group" aria-label="Choose a fictional audiogram">
      {data.cases.map(item => <button key={item.id} type="button" aria-pressed={caseId === item.id} disabled={!ready} onClick={() => { setCaseId(item.id); clearAnswer(); }}>{item.title}</button>)}
    </div>
    <p><strong>{current.title}.</strong> Presentation side: {current.ear}. Air: {current.airMasking}. Bone: {current.boneMasking}, at the {current.bonePlacement}. Responding ear established in the fictional record: <strong>{current.earSpecificEstablished ? "yes" : "no"}</strong>.</p>
    <div className={styles.controls} role="group" aria-label="Visible measurement routes">
      <button type="button" disabled={!ready} aria-pressed={showAir} onClick={() => setShowAir(value => !value)}>Air conduction</button>
      <button type="button" disabled={!ready} aria-pressed={showBone} onClick={() => setShowBone(value => !value)}>Bone conduction</button>
    </div>
    <p className={styles.key}><strong>Symbol key:</strong> {airSymbol} = air conduction; {boneSymbol} = bone conduction. Colour records presentation side: red for right, blue for left; it does not establish the responding cochlea. A downwards arrow attached to a bone symbol means no response at that output level. A blank position means no value was supplied. The dashed vertical guide selects a frequency; it is not a measurement.</p>
    <div className={styles.chartScroll} role="region" tabIndex={0} aria-label="Fictional audiogram: scroll horizontally to read the full frequency axis">
      <svg viewBox="0 0 650 810" className={styles.chart} data-ear={current.ear} role="img" aria-labelledby="audiogram-svg-title" aria-describedby="audiogram-svg-description">
        <title id="audiogram-svg-title">{`${current.title}: ${current.ear}-side air and bone observations`}</title>
        <desc id="audiogram-svg-description">{`An original fictional audiogram. Equal horizontal steps represent frequency doubling, and higher dB HL levels run down the vertical axis. ${frequency.toLocaleString("en-US")} Hz is selected. All values and no-response limits appear in the table below.`}</desc>
        <text x="330" y="22" textAnchor="middle" className={styles.axisTitle}>Hearing level (dB HL): increases downwards</text>
        {Array.from({ length: 14 }, (_, index) => index * 10 - 10).map(db => <g key={db}><line x1="80" x2="580" y1={levelY(db)} y2={levelY(db)} className={styles.grid} data-zero={db === 0} /><text x="65" y={levelY(db) + 5} textAnchor="end" className={styles.tick}>{db}</text></g>)}
        {data.frequenciesHz.map(hz => <g key={hz}><line x1={frequencyX(hz)} x2={frequencyX(hz)} y1="70" y2={levelY(120)} className={styles.grid} /><text x={frequencyX(hz)} y="748" textAnchor="middle" className={styles.tick}>{hz.toLocaleString("en-US")}</text></g>)}
        <text x="330" y="788" textAnchor="middle" className={styles.axisTitle}>Frequency (Hz): equal steps are octaves</text>
        <line x1={frequencyX(frequency)} x2={frequencyX(frequency)} y1="65" y2="725" className={styles.selected} />
        {current.values.map(point => <g key={point.frequencyHz} data-frequency={point.frequencyHz}>
          {showAir && point.airDbHL !== null && <text data-route="air" x={frequencyX(point.frequencyHz)} y={levelY(point.airDbHL)} className={styles.air} textAnchor="middle" dominantBaseline="central">{airSymbol}</text>}
          {showBone && point.boneDbHL !== null && <text data-route="bone" x={frequencyX(point.frequencyHz) + boneOffset} y={levelY(point.boneDbHL)} className={styles.bone} textAnchor="middle" dominantBaseline="central">{boneSymbol}</text>}
          {showBone && point.boneNoResponseAtDbHL !== null && <g data-route="bone-no-response"><text x={frequencyX(point.frequencyHz) + boneOffset} y={levelY(point.boneNoResponseAtDbHL)} className={styles.bone} textAnchor="middle" dominantBaseline="central">{boneSymbol}</text><path d={`M ${frequencyX(point.frequencyHz) + boneOffset * 1.5} ${levelY(point.boneNoResponseAtDbHL) + 8} l ${boneOffset * 1.6} 20 m 0 -9 v 9 h ${-boneOffset * .9}`} className={styles.limitArrow} /></g>}
        </g>)}
      </svg>
    </div>
    <p className={styles.caption}>{data.diagramConvention} One octave has the same plotted length as 20 dB. Bone symbols are slightly offset sideways for legibility; they still refer to the labelled frequency. Points are shown without connecting missing values. The table remains available when a plotted route is hidden.</p>
    <p>The data table can be scrolled horizontally on narrow screens.</p>
    <div className={styles.tableScroll} role="region" tabIndex={0} aria-label="All supplied values for this fictional audiogram">
      <table><caption>{current.title}: complete supplied data</caption><thead><tr><th scope="col">Frequency (Hz)</th><th scope="col">Air conduction</th><th scope="col">Bone conduction</th></tr></thead><tbody>
        {current.values.map(item => <tr key={item.frequencyHz} data-selected={item.frequencyHz === frequency}><th scope="row">{item.frequencyHz.toLocaleString("en-US")}</th><td>{valueText(item.airDbHL)}</td><td>{item.boneNoResponseAtDbHL !== null ? `No response at ${item.boneNoResponseAtDbHL} dB HL; exact threshold unknown` : valueText(item.boneDbHL)}</td></tr>)}
      </tbody></table>
    </div>
    <div className={styles.exercise}>
      <h3>Try the subtraction, then qualify the result</h3>
      <label htmlFor="audiogram-frequency">Comparison frequency</label>
      <select id="audiogram-frequency" value={frequency} disabled={!ready} onChange={event => { setFrequency(Number(event.target.value)); clearAnswer(); }}>{data.frequenciesHz.map(hz => <option key={hz} value={hz}>{hz.toLocaleString("en-US")} Hz</option>)}</select>
      <p>At this frequency: air {valueText(point.airDbHL)}; bone {point.boneNoResponseAtDbHL !== null ? `no response at ${point.boneNoResponseAtDbHL} dB HL` : valueText(point.boneDbHL)}. What is the numerical air-minus-bone threshold difference?</p>
      <label htmlFor="audiogram-difference">Difference (dB)</label>
      <input id="audiogram-difference" type="text" inputMode="decimal" value={answer} disabled={!ready || unavailable} onChange={event => { setAnswer(event.target.value); setFeedback(null); }} aria-describedby="audiogram-calculation-scope" autoComplete="off" />
      <label className={styles.choice}><input type="checkbox" checked={unavailable} disabled={!ready} onChange={event => { setUnavailable(event.target.checked); setFeedback(null); }} />No exact result</label>
      <button type="button" disabled={!ready} onClick={check}>Check answer</button>
      <p id="audiogram-calculation-scope">{data.calculationScope} Your answer is not sent or stored.</p>
      <div role="status" aria-live="polite" data-feedback={feedback ? (feedback.correct ? "correct" : "incorrect") : undefined}>{feedback?.message}</div>
    </div>
    <details><summary>Reveal the case interpretation and limits</summary><p>{current.explanation}</p></details>
    <noscript><p>Interactive selection requires JavaScript. The initial case remains readable above; all five cases and their explanations follow.</p>{data.cases.map(item => <section key={item.id}><h3>{item.title}</h3><p>{item.explanation}</p><ul>{item.values.map(point => <li key={point.frequencyHz}>{point.frequencyHz.toLocaleString("en-US")} Hz: air {valueText(point.airDbHL)}; bone {point.boneNoResponseAtDbHL !== null ? `no response at ${point.boneNoResponseAtDbHL} dB HL` : valueText(point.boneDbHL)}.</li>)}</ul></section>)}</noscript>
  </section>;
}

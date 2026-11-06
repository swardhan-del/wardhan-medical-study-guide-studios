"use client";

import { useState } from "react";
import data from "@/content/brain-barrier-explorer.json";
import styles from "./brain-barrier-explorer.module.css";

export function BrainBarrierExplorer() {
  const [routeIndex, setRouteIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [caseIndex, setCaseIndex] = useState(0);
  const [answer, setAnswer] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const route = data.routes[routeIndex];
  const step = route.steps[stepIndex];
  const scenario = data.cases[caseIndex];

  return <div className={styles.explorer} id="brain-barrier-explorer">
    <h3>{data.title}</h3>
    <p>{data.introduction}</p>
    <div className={styles.controls} role="group" aria-label="Choose an anatomical route">
      {data.routes.map((item, i) => <button key={item.id} type="button" aria-pressed={routeIndex === i} aria-controls="brain-barrier-route" onClick={() => {setRouteIndex(i); setStepIndex(0);}}>{item.label}</button>)}
    </div>
    <div id="brain-barrier-route">
      <h4>{route.title}</h4>
      <ol className={styles.route} aria-label={route.title}>
        {route.steps.map((item, i) => <li key={item.label}>
          <button type="button" aria-pressed={stepIndex === i} aria-controls="brain-barrier-step" onClick={() => setStepIndex(i)}>
            <span className={styles.number} aria-hidden="true">{i + 1}</span>
            <span>{item.label}{item.seal && <strong className={styles.seal}>Principal sealing cell layer</strong>}</span>
          </button>
          {i < route.steps.length - 1 && <span className={styles.arrow} aria-hidden="true">↓</span>}
        </li>)}
      </ol>
      <div id="brain-barrier-step" className={styles.explanation} aria-live="polite" aria-atomic="true">
        <h4>{stepIndex + 1}. {step.label}</h4><p>{step.detail}</p>
      </div>
      <p><strong>Scope:</strong> {route.limit}</p>
      <ul aria-label="Route references">{route.references.map(ref => <li key={ref.url}><a href={ref.url}>{ref.title}</a></li>)}</ul>
    </div>
    <details><summary>Read both routes and every compartment</summary>
      {data.routes.map(item => <section key={item.id}><h4>{item.title}</h4><ol>{item.steps.map(s => <li key={s.label}><strong>{s.label}{s.seal ? " — principal sealing cell layer" : ""}.</strong> {s.detail}</li>)}</ol><p>{item.limit}</p></section>)}
    </details>

    <h3>What does the experiment establish?</h3>
    <p>Choose a scenario, make a prediction, then inspect the reasoning. These original exercises summarise specific findings; they do not model a patient or grade clinical competence.</p>
    <div className={styles.controls} role="group" aria-label="Choose an evidence scenario">
      {data.cases.map((item, i) => <button key={item.id} type="button" aria-pressed={caseIndex === i} aria-controls="brain-barrier-case" onClick={() => {setCaseIndex(i); setAnswer(null); setChecked(false);}}>{i + 1}. {item.title}</button>)}
    </div>
    <div id="brain-barrier-case" className={styles.case}>
      <h4>{scenario.title}</h4><p><strong>Observed:</strong> {scenario.observation}</p>
      <fieldset><legend>{scenario.question}</legend>
        {scenario.options.map((option, i) => <label key={`${scenario.id}-${i}`}>
          <input type="radio" name="brain-barrier-prediction" checked={answer === i} onChange={() => {setAnswer(i);setChecked(false);}} />
          <span>{option.text}</span>
        </label>)}
      </fieldset>
      <div className={styles.controls}>
        <button type="button" disabled={answer === null} onClick={() => setChecked(true)}>Check this interpretation</button>
        <button type="button" onClick={() => {setAnswer(null);setChecked(false);}}>Reset this scenario</button>
      </div>
      {checked && answer !== null && <p role="status" className={styles.explanation}><strong>{answer === scenario.answer ? "Supported interpretation. " : "Reconsider the inference. "}</strong>{scenario.options[answer].explanation}</p>}
      <ul aria-label="Scenario references">{scenario.references.map(ref => <li key={ref.url}><a href={ref.url}>{ref.title}</a></li>)}</ul>
    </div>
    <details><summary>Read all four scenarios and their reasoning</summary>
      {data.cases.map(item => <section key={item.id}><h4>{item.title}</h4><p>{item.observation}</p><p>{item.question}</p><ul>{item.options.map((option, i) => <li key={option.text}><strong>{i === item.answer ? "Supported: " : "Not supported: "}{option.text}</strong> {option.explanation}</li>)}</ul></section>)}
    </details>
    <noscript><p>Interactive selection needs JavaScript. Both routes and all four scenarios are available in the expandable text explanations above.</p></noscript>
  </div>;
}

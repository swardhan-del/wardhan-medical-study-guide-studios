"use client";

import { useState } from "react";
import data from "@/content/reproductive-route-explorer.json";
import styles from "./brain-barrier-explorer.module.css";

export function ReproductiveRouteExplorer() {
  const [mapIndex, setMapIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const map = data.maps[mapIndex];
  const step = map.steps[stepIndex];

  return <section className={`study-panel ${styles.explorer}`} aria-labelledby="reproductive-route-title">
    <p className="eyebrow">Connect tissue with development</p>
    <h2 id="reproductive-route-title">{data.title}</h2>
    <p>{data.introduction}</p>
    <div className={styles.controls} role="group" aria-label="Choose a reproductive map">
      {data.maps.map((item, i) => <button type="button" key={item.id} aria-pressed={mapIndex === i} aria-controls="reproductive-route-map" onClick={() => {setMapIndex(i); setStepIndex(0);}}>{item.label}</button>)}
    </div>
    <div id="reproductive-route-map">
      <h3>{map.title}</h3>
      <ul className={styles.route} aria-label={map.title}>
        {map.steps.map((item, i) => <li key={item.label}>
          <button type="button" aria-pressed={stepIndex === i} aria-controls="reproductive-route-detail" onClick={() => setStepIndex(i)}>
            {map.sequential && <span className={styles.number} aria-hidden="true">{i + 1}</span>}
            <span>{item.label}</span>
          </button>
          {map.sequential && i < map.steps.length - 1 && <span className={styles.arrow} aria-hidden="true">↓</span>}
        </li>)}
      </ul>
      <div className={styles.explanation} id="reproductive-route-detail" aria-live="polite" aria-atomic="true">
        <h3>{step.label}</h3><p>{step.detail}</p>
      </div>
      <p><strong>Map scope:</strong> {map.limit}</p>
      <ul aria-label="Map references">{map.references.map(ref => <li key={ref.url}><a href={ref.url}>{ref.title}</a></li>)}</ul>
    </div>
    <details><summary>Read both complete maps</summary>
      {data.maps.map(item => <section key={item.id}><h3>{item.title}</h3>
        <p>{item.limit}</p>
        {item.sequential ? <ol>{item.steps.map(s => <li key={s.label}><strong>{s.label}.</strong> {s.detail}</li>)}</ol>
          : <ul>{item.steps.map(s => <li key={s.label}><strong>{s.label}.</strong> {s.detail}</li>)}</ul>}
      </section>)}
    </details>
    <noscript><p>Map selection needs JavaScript. Both complete maps remain readable in the expandable text above.</p></noscript>
  </section>;
}

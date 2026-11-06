"use client";

import { useCallback, useState } from "react";
import type lymphoidData from "@/content/lymphoid-specimen.json";
import type { PublicFigure } from "@/lib/figures";
import styles from "./lymphoid-specimen-explorer.module.css";

export function LymphoidSpecimenExplorer({ figure, data, scope = "lymphoid", introduction = "Start outside the tissue and move inward. Choose a numbered region, describe the visible pattern, then compare the interpretation. Markers indicate broad study regions, not individual cells.", licenseLabel = "CC BY 4.0 terms" }: { figure: PublicFigure; data: typeof lymphoidData; scope?: string; introduction?: string; licenseLabel?: string }) {
  const [selected, setSelected] = useState(0);
  const [markers, setMarkers] = useState(true);
  const [response, setResponse] = useState("");
  const [comparison, setComparison] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const imageRef = useCallback((node: HTMLImageElement | null) => {
    // A failed server-rendered image can finish before React attaches onError.
    if (node?.complete && node.naturalWidth === 0) setUnavailable(true);
  }, []);
  const region = data.regions[selected];
  const regionCount = data.regions.length === 4 ? "four" : "five";
  const portrait = figure.height > figure.width;
  const description = <div id={`${scope}-region-description`} className={styles.description} aria-live="polite" aria-atomic="true">
    <h3>{selected + 1}. {region.label}</h3>
    <p><strong>Observe:</strong> {region.observation}</p>
    <p><strong>Interpret:</strong> {region.interpretation}</p>
    <p><strong>Resolution limit:</strong> {region.limit}</p>
  </div>;
  return <section className={`study-panel ${styles.explorer}`} aria-labelledby={`${scope}-specimen-title`}>
    <p className="eyebrow">Read a real section</p>
    <h2 id={`${scope}-specimen-title`}>{data.title}</h2>
    <p>{introduction}</p>
    <div className={styles.controls} role="group" aria-label="Specimen regions">
      {data.regions.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === index} aria-controls={`${scope}-region-description`} onClick={() => setSelected(index)}>{index + 1}. {item.label}</button>)}
    </div>
    {portrait && description}
    <figure id={`figure-${figure.id}`}>
      <div className={styles.imageFrame} style={portrait ? {maxWidth: "28rem", marginInline: "auto"} : undefined}>
        {unavailable ? <p role="status">The specimen image could not load. The complete descriptions below remain available. You can also open the original-sized image or its creator’s source.</p> : <>
          {/* The approved JPEG retains the original diagnostic pixels; browser sizing does not recode it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img ref={imageRef} src={figure.src} width={figure.width} height={figure.height} alt={figure.alt} onError={() => setUnavailable(true)} />
          {markers && <div className={styles.markers} aria-hidden="true">{data.regions.map((item, index) => <span key={item.id} className={selected === index ? styles.selectedMarker : styles.marker} style={{ left: `${item.anchor.x}%`, top: `${item.anchor.y}%` }}>{index + 1}</span>)}</div>}
        </>}
      </div>
      <figcaption><strong>{figure.title}.</strong> {figure.caption}</figcaption>
    </figure>
    <div className={styles.controls}>
      <button type="button" aria-pressed={markers} onClick={() => setMarkers(value => !value)}>{markers ? "Hide region markers" : "Show region markers"}</button>
      <a href={figure.src} target="_blank" rel="noopener noreferrer">Open full-size image in a new tab</a>
      <a href={figure.src} download>Download credited specimen image</a>
    </div>
    <p className={styles.credit}>{figure.rights} <a href={figure.sourceUrl}>Creator and source</a> · <a href={figure.licenseUrl}>{licenseLabel}</a>. {figure.modifications}</p>
    {!portrait && description}
    <details><summary>Read all {regionCount} region explanations</summary>
      <ol>{data.regions.map(item => <li key={item.id}><h3>{item.label}</h3><p>{item.observation}</p><p>{item.interpretation}</p><p><strong>Limit:</strong> {item.limit}</p></li>)}</ol>
    </details>
    <noscript><p>The region buttons need JavaScript. The numbered image and all {regionCount} explanations above remain available.</p></noscript>
    <h3>Build your practical answer</h3>
    <label htmlFor={`${scope}-specimen-response`}>Write two observations, one interpretation and one detail you still need.</label>
    <textarea id={`${scope}-specimen-response`} rows={5} maxLength={3000} value={response} onChange={event => { setResponse(event.target.value); setComparison(false); }} aria-describedby={`${scope}-response-limits`} />
    <p id={`${scope}-response-limits`}>Compare your own reasoning with the model. This does not grade your wording or make a diagnosis. Your text stays on this page and is cleared when you leave or reload.</p>
    <div className={styles.controls}>
      <button type="button" onClick={() => setComparison(true)}>Compare with model reasoning</button>
      <button type="button" onClick={() => { setResponse(""); setComparison(false); }}>Clear my response</button>
    </div>
    {comparison && <div role="status" className={styles.description}><p><strong>Model reasoning:</strong> {data.model}</p><p>Check each part of your answer against the image. Additional accurate observations may also be valid.</p></div>}
    <details><summary>Read the model without entering a response</summary><p>{data.model}</p></details>
  </section>;
}

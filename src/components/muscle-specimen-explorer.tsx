"use client";

import { useCallback, useState } from "react";
import data from "@/content/muscle-specimens.json";
import type { PublicFigure } from "@/lib/figures";
import styles from "./muscle-specimen-explorer.module.css";

const choices = ["skeletal", "cardiac", "smooth"] as const;

function SpecimenTask({ index, figures }: { index: number; figures: PublicFigure[] }) {
  const item = data.specimens[index];
  const figure = figures.find(f => f.id === item.figureId)!;
  const [choice, setChoice] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [failed, setFailed] = useState(false);
  const imageRef = useCallback((node: HTMLImageElement | null) => {
    if (node?.complete && node.naturalWidth === 0) setFailed(true);
  }, []);
  return <div className={styles.task}>
    <figure id={`figure-${figure.id}`}>
      <div className={styles.imageFrame}>
        {failed ? <p role="status">The specimen image could not load. Use the text description and source link below; image-based identification is unavailable in this state.</p> :
          // Preserve approved specimen pixels and orientation; do not re-encode diagnostic images.
          // eslint-disable-next-line @next/next/no-img-element
          <img ref={imageRef} src={figure.src} width={figure.width} height={figure.height} alt={figure.alt} onError={() => setFailed(true)} />}
      </div>
      <figcaption>{figure.alt}</figcaption>
    </figure>
    <p><strong>Describe before identifying:</strong> Follow the cell arrangement, then look for banding and the position of nuclei. Name a feature you cannot confidently resolve.</p>
    <div className={styles.controls} role="group" aria-label="Choose the muscle pattern">
      {choices.map(value => <button type="button" key={value} aria-pressed={choice === value} onClick={() => setChoice(value)}>{value[0].toUpperCase() + value.slice(1)} muscle</button>)}
    </div>
    {choice && <div role="status" className={styles.feedback}>
      <p><strong>{choice === item.answer ? "That matches this specimen." : "Reconsider the combined evidence."}</strong> {item.explanation}</p>
      <p>This checks the selected tissue category; it does not grade your free-text reasoning.</p>
    </div>}
    <details><summary>Reveal specimen provenance and interpretation</summary>
      <h3>{figure.title}</h3><p>{figure.caption}</p><p>{item.explanation}</p>
    </details>
    <div className={styles.controls}>
      <a href={figure.src} target="_blank" rel="noopener noreferrer">Open full-size specimen in a new tab</a>
      <a href={figure.src} download>Download specimen image</a>
    </div>
    <p className={styles.credit}>{figure.rights} <a href={figure.sourceUrl}>Creator and source</a> · <a href={figure.licenseUrl}>Image licence terms</a>. {figure.modifications} Preserve the credit and licence when reusing the image.</p>
    <label htmlFor="muscle-specimen-response">Write two observations, your interpretation and one limitation.</label>
    <textarea id="muscle-specimen-response" maxLength={3000} rows={5} value={response} onChange={event => { setResponse(event.target.value); setShowModel(false); }} aria-describedby="muscle-response-limits" />
    <p id="muscle-response-limits">Your text stays on this page. It is cleared when you change specimen, leave or reload. Compare it with a model; no AI grading or diagnosis is performed.</p>
    <div className={styles.controls}>
      <button type="button" onClick={() => setShowModel(true)}>Compare my explanation</button>
      <button type="button" onClick={() => { setResponse(""); setShowModel(false); }}>Clear my explanation</button>
    </div>
    {showModel && <div role="status" className={styles.feedback}><strong>Model reasoning:</strong> {item.model}<p>Check observations, interpretation and limits separately. Other accurate observations may also be valid.</p></div>}
  </div>;
}

export function MuscleSpecimenExplorer({ figures }: { figures: PublicFigure[] }) {
  const [selected, setSelected] = useState(0);
  return <section className={`study-panel ${styles.explorer}`} aria-labelledby="muscle-specimen-title">
    <p className="eyebrow">Observe · interpret · check the limit</p>
    <h2 id="muscle-specimen-title">{data.title}</h2>
    <p>These are separate preparations with different staining and section planes, not a controlled colour comparison. Use several clues. The full image and its source remain available.</p>
    <div className={styles.controls} role="group" aria-label="Choose a muscle specimen">
      {data.specimens.map((item, index) => <button key={item.figureId} type="button" aria-pressed={selected === index} aria-controls="muscle-selected-specimen" onClick={() => setSelected(index)}>Specimen {index + 1}</button>)}
    </div>
    <div id="muscle-selected-specimen"><SpecimenTask key={selected} index={selected} figures={figures} /></div>
    <details><summary>Read all three specimen interpretations</summary>
      <ol>{data.specimens.map(item => {
        const figure = figures.find(f => f.id === item.figureId)!;
        return <li key={item.figureId}><h3>{figure.title}</h3><p>{figure.alt}</p><p>{item.model}</p><p>{figure.caption}</p><p>{figure.rights} <a href={figure.src}>Open this specimen</a> · <a href={figure.sourceUrl}>Creator and source</a> · <a href={figure.licenseUrl}>Image licence terms</a></p></li>;
      })}</ol>
    </details>
    <noscript><p>Interactive selection needs JavaScript. All three interpretations and image links remain available in the disclosure above.</p></noscript>
  </section>;
}

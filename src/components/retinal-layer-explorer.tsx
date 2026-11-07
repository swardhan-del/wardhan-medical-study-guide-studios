"use client";

import { useId, useState, useSyncExternalStore } from "react";
import layers from "@/content/retinal-layers.json";
import styles from "./retinal-explorers.module.css";

const subscribe = () => () => {};
const client = () => true;
const server = () => false;

export function RetinalLayerExplorer() {
  const id = useId();
  const ready = useSyncExternalStore(subscribe, client, server);
  const [selected, setSelected] = useState(0);
  const [reversed, setReversed] = useState(false);
  const [route, setRoute] = useState<"light" | "signal">("light");
  const position = (index: number) => 40 + (reversed ? 9 - index : index) * 42;
  const from = position(route === "light" ? 9 : 1) + 17;
  const to = position(route === "light" ? 1 : 7) + 17;
  const current = layers[selected];
  return <section id="retinal-layers" className={styles.explorer} aria-labelledby={`${id}-heading`}>
    <h2 id={`${id}-heading`}>Read the layers in either orientation</h2>
    <p>Choose a numbered layer, then reverse the drawing. Keep the anatomical relationship fixed while the page orientation changes. Select the arrow to compare incoming light with a simplified forward neural route.</p>
    <p><strong>Diagram limits:</strong> equal-width bands are a teaching map, not measured thicknesses or separate whole-cell populations. The colours are illustrative, not H&E. Lateral connections, feedback and regional variation are omitted.</p>
    <div className={styles.controls} role="group" aria-label="Layer-map orientation">
      <button type="button" disabled={!ready} aria-pressed={!reversed} onClick={() => setReversed(false)}>Choroidal side above</button>
      <button type="button" disabled={!ready} aria-pressed={reversed} onClick={() => setReversed(true)}>Vitreous side above</button>
    </div>
    <div className={styles.controls} role="group" aria-label="Layer-map route">
      <button type="button" disabled={!ready} aria-pressed={route === "light"} onClick={() => setRoute("light")}>Incoming light</button>
      <button type="button" disabled={!ready} aria-pressed={route === "signal"} onClick={() => setRoute("signal")}>Forward neural route</button>
    </div>
    <div className={styles.layerLayout}>
      <figure className={styles.drawing}>
        <svg viewBox="0 0 350 485" role="img" aria-labelledby={`${id}-title ${id}-desc`}>
          <title id={`${id}-title`}>{`Retinal layer map: ${reversed ? "vitreous" : "choroidal"} side above; ${route === "light" ? "incoming light" : "forward neural route"}`}</title>
          <desc id={`${id}-desc`}>{`Numbered bands correspond to the ten labelled controls. ${route === "light" ? "The arrow points from the vitreous-facing surface toward the photoreceptor segments." : "The arrow summarises photoreceptor to bipolar to ganglion signalling, ending at ganglion-cell bodies; output axons then travel toward the optic disc."} Selected: ${current.label}.`}</desc>
          <defs><marker id={`${id}-arrow`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10Z" fill="#144c65" /></marker></defs>
          <rect width="350" height="485" rx="12" fill="#f0f7fa" />
          <text x="145" y="26" textAnchor="middle" fontSize="20" fill="#173b4b">{reversed ? "Vitreous side" : "Choroidal side"}</text>
          {layers.map((layer, index) => <g key={layer.id} aria-hidden="true">
            <rect x="20" y={position(index)} width="230" height="35" rx="3" fill={selected === index ? "#174a62" : index % 2 ? "#d9e8f4" : "#efdddf"} stroke="#496779" strokeWidth={selected === index ? "3" : "1"} />
            <text x="135" y={position(index) + 27} textAnchor="middle" fontSize="28" fontWeight="700" fill={selected === index ? "#fff" : "#173b4b"}>{index + 1}</text>
          </g>)}
          <path data-retinal-route={route} d={`M285 ${from}V${to}`} stroke="#144c65" strokeWidth="6" markerEnd={`url(#${id}-arrow)`} />
          <text x="145" y="473" textAnchor="middle" fontSize="20" fill="#173b4b">{reversed ? "Choroidal side" : "Vitreous side"}</text>
        </svg>
        <figcaption>{route === "light" ? "Light: vitreous side → photoreceptor segments." : "Simplified neural route: photoreceptor → bipolar → ganglion cell. Ganglion axons continue toward the optic disc."}</figcaption>
      </figure>
      <div className={styles.layerControls} role="group" aria-label="Choose a retinal layer">
        {layers.map((layer, index) => <button key={layer.id} type="button" disabled={!ready} aria-pressed={selected === index} aria-controls={`${id}-explanation`} onClick={() => setSelected(index)}>{index + 1}. {layer.label}</button>)}
      </div>
    </div>
    <p className={styles.callout} id={`${id}-explanation`} role="status"><strong>{current.label}.</strong> {current.explanation}</p>
    <details><summary>Read all ten layer explanations</summary><ol>{layers.map(layer => <li key={layer.id}><strong>{layer.label}.</strong> {layer.explanation}</li>)}</ol></details>
    <p><strong>Try it:</strong> select the photoreceptor segments, outer nuclear layer and outer plexiform layer. Explain how different parts of one photoreceptor contribute to all three.</p>
    <noscript><p>The initial map and all ten explanations remain readable without JavaScript. The orientation and route controls require JavaScript.</p></noscript>
  </section>;
}

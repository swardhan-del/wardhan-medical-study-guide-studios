import data from "@/content/placenta-circulation.json";
import styles from "./endocrine-development-map.module.css";

export function PlacentaCirculation() {
  return <section className={`study-panel ${styles.map}`} aria-labelledby="placenta-circulation-title">
    <p className="eyebrow">Trace blood, then trace a molecule</p>
    <h2 id="placenta-circulation-title">{data.title}</h2>
    <p>Follow each circuit in order. Predict the answer at each stage, then open it to compare your reasoning.</p>
    {data.tracks.map((track, i) => <div key={track.label} className={styles.track}>
      <h3>{track.label}</h3>
      <ol className={styles.stages} aria-label={track.label}>
        {track.stages.map((stage, j) => <li key={stage.title}>
          <details><summary><span className={styles.number} aria-hidden="true">{j + 1}</span>{stage.title}</summary>
            <p><strong>{stage.question}</strong></p><p>{stage.answer}</p>
          </details>
          {j < track.stages.length - 1 && <span className={styles.arrow} aria-hidden="true">→</span>}
        </li>)}
      </ol>
      {i === 0 && <p className={styles.distinction}><strong>Exchange across an interface:</strong> {data.centralNote}</p>}
    </div>)}
    <p className="muted-note">{data.kind}. Read the maternal-flow, fetal-flow and exchange-barrier explanations for the supporting sources.</p>
  </section>;
}

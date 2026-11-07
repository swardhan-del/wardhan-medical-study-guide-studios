"use client";

import { useState } from "react";
import model from "@/content/pdh-mechanism-model.json";
import { countPdhCarbon } from "@/lib/pdh-mechanism";
import styles from "./pdh-mechanism-explorer.module.css";

export function PdhMechanismExplorer() {
  const [selected, setSelected] = useState(0);
  const [input, setInput] = useState("4");
  const [balance, setBalance] = useState(countPdhCarbon("4")!);
  const [error, setError] = useState("");
  const state = model.states[selected];

  function calculate() {
    const next = countPdhCarbon(input);
    if (!next) {
      setError("Enter a whole number from 1 to 12. The last calculated balance below is unchanged.");
      return;
    }
    setBalance(next);
    setError("");
  }

  return <section className={`study-panel ${styles.explorer}`} aria-labelledby="pdh-mechanism-title">
    <p className="eyebrow">Explore a catalytic cycle</p>
    <h2 id="pdh-mechanism-title">{model.title}</h2>
    <p>Follow one completed reaction, then check the carbon ledger. The attached lipoyl carrier, CoA and the electron acceptor have different roles.</p>
    <div className={styles.controls} role="group" aria-label="PDH cycle stages">
      {model.states.map((item, index) => <button key={item.id} type="button" aria-pressed={selected === index} aria-controls="pdh-current-stage" onClick={() => setSelected(index)}>{index + 1}. {item.label}</button>)}
    </div>
    <div id="pdh-current-stage" className={styles.current} aria-live="polite" aria-atomic="true">
      <h3>{state.label}</h3>
      <dl><dt>Carbon</dt><dd>{state.carbon}</dd><dt>Attached carrier</dt><dd>{state.lipoyl}</dd><dt>Electrons</dt><dd>{state.electron}</dd></dl>
      <div className={styles.carbonMap} aria-label="Location of the three original pyruvate carbons">
        <p><strong>Tracked carbon map</strong> — schematic grouping, not atomic structure.</p>
        <div className={styles.locations}>
          {selected === 0 ? <div data-carbon-location="pyruvate"><h4>Available pyruvate</h4><span className={styles.carbon}>C</span><span className={styles.carbon}>C</span><span className={styles.carbon}>C</span><p>3 substrate carbons</p></div> : <>
            <div data-carbon-location="co2"><h4>Released CO₂</h4><span className={styles.carbon}>C</span><p>1 substrate carbon</p></div>
            <div data-carbon-location={selected === 1 ? "lipoyl" : "acetyl-coa"}><h4>{selected === 1 ? "Acetyl group on the lipoyl arm" : "Acetyl group carried by CoA"}</h4><span className={styles.carbon}>C</span><span className={styles.carbon}>C</span><p>2 substrate carbons; the carrier’s other carbons are outside this ledger.</p></div>
          </>}
        </div>
      </div>
    </div>
    <ul>{model.limits.map(limit => <li key={limit}>{limit}</li>)}</ul>
    <details><summary>Read all four stages without using the controls</summary>
      <ol>{model.states.map(item => <li key={item.id}><h3>{item.label}</h3><p><strong>Carbon:</strong> {item.carbon}</p><p><strong>Carrier:</strong> {item.lipoyl}</p><p><strong>Electrons:</strong> {item.electron}</p></li>)}</ol>
    </details>
    <details><summary>Explain the bottleneck before revealing the answer</summary>
      <p><strong>Prompt:</strong> If a simplified system could transfer acetyl groups but could not regenerate its reduced lipoyl arms, why would repeated turnover become limited?</p>
      <p><strong>Model:</strong> Transfer alone does not restore the oxidised carrier. The available arms can accumulate in the reduced state, so the complete catalytic sequence cannot keep cycling normally. This hypothetical component restriction is not a clinical diagnosis.</p>
    </details>
    <h3 id="pdh-carbon-title">Carbon bookkeeping: completed reactions</h3>
    <p>For each completed reaction, 3 tracked input carbons become 2 in an acetyl group and 1 in CO₂. The carbon atoms in CoA itself are not added to this ledger.</p>
    <form onSubmit={event => { event.preventDefault(); calculate(); }} className={styles.controls} noValidate aria-labelledby="pdh-carbon-title">
      <label htmlFor="pdh-reactions">Number of completed reactions (whole number, 1–12)</label>
      <input id="pdh-reactions" type="number" min="1" max="12" step="1" inputMode="numeric" value={input} onChange={event => { setInput(event.target.value); setError(""); }} aria-describedby="pdh-ledger-help pdh-ledger-error" aria-invalid={Boolean(error)} />
      <button type="submit">Check the carbon balance</button>
    </form>
    <p id="pdh-ledger-help">This controls the count only. It does not change the rate or simulate a tissue. Nothing is sent or saved.</p>
    <p id="pdh-ledger-error" role="status">{error}</p>
    <div className={styles.current} id="pdh-carbon-balance" aria-live="polite" aria-atomic="true">
      <h4>Last calculated balance: {balance.reactions} completed {balance.reactions === 1 ? "reaction" : "reactions"}</h4>
      <dl><dt>Input carbon</dt><dd>{balance.inputCarbon}</dd><dt>Carbon in acetyl groups</dt><dd>{balance.acetylCarbon}</dd><dt>Carbon in CO₂</dt><dd>{balance.carbonDioxideCarbon}</dd></dl>
      <p>{balance.inputCarbon} = {balance.acetylCarbon} + {balance.carbonDioxideCarbon}. All {balance.inputCarbon} substrate-derived carbons are accounted for.</p>
    </div>
    <noscript><p>The stage buttons and calculator need JavaScript. All four stages and the worked four-reaction balance remain readable above.</p></noscript>
    <p>Mechanism references: {model.references.map((ref, index) => <span key={ref.id}>{index > 0 ? " · " : ""}<a href={ref.url}>{ref.title}</a></span>)}</p>
  </section>;
}

"use client";

import { useState } from "react";
import data from "@/content/blood-specimen-cases.json";
import styles from "./connective-bone-explorers.module.css";

const preparations = ["Peripheral blood smear", "Marrow aspirate smear", "Marrow tissue section"];

export function BloodSpecimenExplorer() {
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const item = data.cases[current];
  return <section className={`study-panel ${styles.explorer}`} aria-labelledby="blood-specimen-title">
    <p className="eyebrow">Make the observation fit the question</p>
    <h2 id="blood-specimen-title">Choose a preparation</h2>
    <p>Try each task. Decide what evidence you need before selecting a specimen. These are teaching scenarios, not specimen images.</p>
    <div className={styles.controls} role="group" aria-label="Study tasks">
      {data.cases.map((task, index) => <button key={task.id} type="button" aria-pressed={current === index} onClick={() => { setCurrent(index); setAnswer(""); }}>{task.label}</button>)}
    </div>
    <p id="blood-specimen-question"><strong>{item.question}</strong></p>
    <div className={styles.controls} role="group" aria-labelledby="blood-specimen-question">
      {preparations.map(preparation => <button key={preparation} type="button" aria-pressed={answer === preparation} onClick={() => setAnswer(preparation)}>{preparation}</button>)}
    </div>
    <div role="status" aria-live="polite" aria-atomic="true">
      {answer && <p className={styles.observation}><strong>{answer === item.answer ? "Good match. " : "Reconsider the readout. "}</strong>{answer === item.answer ? item.reason : `Your choice is ${answer.toLowerCase()}. This task needs ${item.answer.toLowerCase()}. ${item.reason}`}</p>}
    </div>
    <details><summary>Compare all three preparations</summary>
      <dl>{data.cases.map(task => <div key={task.id}><dt><strong>{task.answer}</strong></dt><dd>{task.reason}</dd></div>)}</dl>
    </details>
    <noscript><p>The interactive buttons need JavaScript. Open “Compare all three preparations” for the complete comparison.</p></noscript>
    <p className="muted-note">Choices stay on this page and are cleared when you leave or reload. This activity does not assess clinical competence.</p>
  </section>;
}

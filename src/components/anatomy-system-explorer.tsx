"use client";

import { useState, type ReactNode } from "react";
import styles from "./anatomy-systems.module.css";

type Landmark = { name: string; detail: string; x: number; y: number };

export function AnatomySystemExplorer({ landmarks, children }: { landmarks: readonly Landmark[]; children: ReactNode }) {
  const [active, setActive] = useState(0);
  return <div className={styles.explorer}>
    <div className={styles.canvas}>
      {children}
      {landmarks.map((landmark, index) => <button
        type="button"
        key={landmark.name}
        className={styles.marker}
        aria-label={`Select ${landmark.name} on the diagram`}
        aria-pressed={active === index}
        onClick={() => setActive(index)}
        style={{ left: landmark.x / 336 * 100 + "%", top: landmark.y / 250 * 100 + "%" }}
      >{index + 1}</button>)}
    </div>
    <div className={styles.controls}>
      <div role="group" aria-label="Diagram landmarks" className={styles.landmarks}>
        {landmarks.map((landmark, index) => <button
          type="button" key={landmark.name}
          aria-pressed={active === index}
          onClick={() => setActive(index)}
        ><span aria-hidden="true">{index + 1}</span>{landmark.name}</button>)}
      </div>
      <div className={styles.explanation} aria-live="polite">
        <strong>{landmarks[active].name}</strong>
        <p>{landmarks[active].detail}</p>
      </div>
    </div>
  </div>;
}

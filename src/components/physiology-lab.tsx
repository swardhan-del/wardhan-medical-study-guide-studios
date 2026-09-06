"use client";
import { useState } from "react";
import Link from "next/link";
import {
  renalCircuit,
  ventilationModel,
  wintersRange,
} from "@/lib/learning-core";
export function RenalHemodynamics() {
  const [afferent, setAfferent] = useState(1);
  const [efferent, setEfferent] = useState(1);
  const model = renalCircuit(afferent, efferent);
  return (
    <section
      className="study-panel physiology-model"
      aria-label="Renal hemodynamics model"
    >
      <p className="eyebrow">Explore · resistance before and after</p>
      <h2>A small circuit. A big distinction.</h2>
      <p>
        Predict what happens to flow and glomerular pressure. Then change one
        resistance at a time. A value of 1 is the reference setting.
      </p>
      <div className="circuit-map" aria-label="Blood pathway">
        <span>
          Afferent
          <br />
          <strong>{afferent.toFixed(1)}×</strong>
        </span>
        <span className="circuit-glomerulus">
          Glomerulus
          <br />
          <strong>{model.pressure}</strong>
          <small>pressure units</small>
        </span>
        <span>
          Efferent
          <br />
          <strong>{efferent.toFixed(1)}×</strong>
        </span>
      </div>
      <div className="study-grid two">
        <label className="slider-label">
          Afferent resistance <output>{afferent.toFixed(1)}×</output>
          <input
            aria-label="Afferent resistance"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={afferent}
            onChange={(e) => setAfferent(Number(e.target.value))}
          />
          <span>Dilated ← reference → constricted</span>
        </label>
        <label className="slider-label">
          Efferent resistance <output>{efferent.toFixed(1)}×</output>
          <input
            aria-label="Efferent resistance"
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={efferent}
            onChange={(e) => setEfferent(Number(e.target.value))}
          />
          <span>Dilated ← reference → constricted</span>
        </label>
      </div>
      <div className="metric-row" aria-live="polite">
        <div>
          <strong data-testid="renal-flow">{model.flowPercent}%</strong>
          <span>Flow relative to baseline</span>
        </div>
        <div>
          <strong data-testid="renal-pressure">{model.pressure}</strong>
          <span>Glomerular pressure · baseline 50</span>
        </div>
      </div>
      <button
        className="button button-secondary"
        onClick={() => {
          setAfferent(1);
          setEfferent(1);
        }}
      >
        Reset resistance
      </button>
      <details className="study-details" open>
        <summary>What this model can tell you</summary>
        <p>
          This is a two-resistor circuit analogy. In arbitrary units, arterial
          pressure stays at 100 and venous pressure at 0. Flow is proportional
          to 1/(afferent + efferent resistance); glomerular pressure is 100 ×
          efferent/(afferent + efferent resistance). Real renal pressures and
          flows are not predicted here.
        </p>
        <p>
          <strong>GFR is not calculated.</strong> Filtration also depends on
          oncotic pressure, Bowman-space pressure and the filtration
          coefficient. Moderate efferent constriction can support GFR, while
          severe constriction can lower it. There is no clinical cutoff encoded
          in these sliders; autoregulation and hormone responses are omitted.
        </p>
      </details>
      <Link className="text-link" href="/learn/renal/afferent-efferent">
        Read the afferent/efferent lesson →
      </Link>
    </section>
  );
}
export function VentilationPlayground() {
  const [ventilation, setVentilation] = useState(1);
  const { co2, ph } = ventilationModel(ventilation);
  return (
    <section className="study-panel" aria-label="Ventilation playground">
      <p className="eyebrow">Explore · CO₂ and pH</p>
      <h2>Change ventilation. Watch the ratio.</h2>
      <label className="slider-label">
        Relative alveolar ventilation <output>{ventilation.toFixed(1)}×</output>
        <input
          aria-label="Relative alveolar ventilation"
          type="range"
          min="0.5"
          max="2"
          step="0.1"
          value={ventilation}
          onChange={(e) => setVentilation(Number(e.target.value))}
        />
      </label>
      <div className="metric-row" aria-live="polite">
        <div>
          <strong>{co2.toFixed(1)}</strong>
          <span>Modeled PaCO₂ · mmHg</span>
        </div>
        <div>
          <strong>{ph.toFixed(2)}</strong>
          <span>Modeled pH</span>
        </div>
      </div>
      <p>
        Assumes steady CO₂ production, PaCO₂ = 40 / relative alveolar
        ventilation, and fixed bicarbonate of 24 mmol/L. pH uses the
        Henderson–Hasselbalch equation. This deliberately isolates the ratio:
        buffering, renal compensation, dead-space changes and disease dynamics
        are omitted.
      </p>
      <button
        className="button button-secondary"
        onClick={() => setVentilation(1)}
      >
        Reset ventilation
      </button>
    </section>
  );
}
const cases = [
  {
    name: "A falling bicarbonate",
    ph: "7.29",
    co2: 26,
    bicarbonate: 12,
    sodium: 140,
    chloride: 104,
    direction: "Acidemia",
    process: "Metabolic acidosis with expected respiratory compensation",
    reasoning:
      "Low bicarbonate explains the acidemia. Winter’s range is 24–28 mmHg; measured PaCO₂ is 26. The anion gap is 24 mmol/L. This is elevated against our teaching reference of 8–12 (normal albumin assumed), but does not identify the cause.",
    winter: true,
  },
  {
    name: "CO₂ that looks normal",
    ph: "7.10",
    co2: 40,
    bicarbonate: 12,
    sodium: 140,
    chloride: 104,
    direction: "Acidemia",
    process: "Metabolic acidosis plus respiratory acidosis",
    reasoning:
      "A PaCO₂ of 40 is near the usual baseline but is too high for bicarbonate 12. Winter’s range is 24–28. The CO₂ therefore suggests an additional respiratory acidosis, rather than adequate compensation.",
    winter: true,
  },
  {
    name: "A near-normal pH",
    ph: "7.45",
    co2: 18,
    bicarbonate: 12,
    sodium: 140,
    chloride: 104,
    direction: "Within the reference interval",
    process: "Metabolic acidosis plus respiratory alkalosis",
    reasoning:
      "The pH is at the upper boundary of our reference interval. Bicarbonate is low, and PaCO₂ is below Winter’s 24–28 range. Opposing metabolic acidosis and respiratory alkalosis can hide behind a near-normal pH.",
    winter: true,
  },
  {
    name: "A recent rise in CO₂",
    ph: "7.26",
    co2: 60,
    bicarbonate: 26,
    sodium: 140,
    chloride: 104,
    direction: "Acidemia",
    process: "Acute respiratory acidosis",
    reasoning:
      "High CO₂ explains the acidemia. In an acute respiratory acidosis, bicarbonate often rises about 1–2 mmol/L per 10 mmHg CO₂ increase. A rise from 24 to 26 is compatible with an acute response to CO₂ increasing from 40 to 60. Duration and clinical context matter.",
    winter: false,
  },
  {
    name: "A recent fall in CO₂",
    ph: "7.49",
    co2: 30,
    bicarbonate: 22,
    sodium: 140,
    chloride: 108,
    direction: "Alkalemia",
    process: "Acute respiratory alkalosis",
    reasoning:
      "Low CO₂ explains alkalemia. A fall in bicarbonate of about 1–2 mmol/L per 10 mmHg acute CO₂ decrease is expected. Here, CO₂ falls from 40 to 30 and bicarbonate from 24 to 22. Winter’s formula is for metabolic acidosis, so it is not used here.",
    winter: false,
  },
  {
    name: "A rising bicarbonate",
    ph: "7.50",
    co2: 48,
    bicarbonate: 36,
    sodium: 140,
    chloride: 94,
    direction: "Alkalemia",
    process: "Metabolic alkalosis with expected respiratory compensation",
    reasoning:
      "Raised bicarbonate explains alkalemia. PaCO₂ commonly rises about 0.6–0.75 mmHg per 1 mmol/L bicarbonate rise. A 12 mmol/L rise predicts a CO₂ increase of about 7–9 mmHg. PaCO₂ 48 is compatible with that response.",
    winter: false,
  },
];
const processes = cases.map((c) => c.process);
function AbgCase({ index }: { index: number }) {
  const item = cases[index];
  const [direction, setDirection] = useState("");
  const [process, setProcess] = useState("");
  const [checked, setChecked] = useState(false);
  const range = wintersRange(item.bicarbonate);
  return (
    <div className="abg-case">
      <p className="eyebrow">
        Case {index + 1} of {cases.length} · fictional teaching values
      </p>
      <h3>{item.name}</h3>
      <div className="metric-row">
        <div>
          <strong>{item.ph}</strong>
          <span>pH</span>
        </div>
        <div>
          <strong>{item.co2}</strong>
          <span>PaCO₂ · mmHg</span>
        </div>
        <div>
          <strong>{item.bicarbonate}</strong>
          <span>HCO₃⁻ · mmol/L</span>
        </div>
      </div>
      <p>
        Na⁺ {item.sodium} mmol/L · Cl⁻ {item.chloride} mmol/L · assume normal
        albumin. Values are rounded.
      </p>
      <div className="study-form">
        <label>
          1. Describe the pH
          <select
            value={direction}
            onChange={(e) => {
              setDirection(e.target.value);
              setChecked(false);
            }}
          >
            <option value="">Choose a direction</option>
            {["Acidemia", "Within the reference interval", "Alkalemia"].map(
              (text) => (
                <option key={text}>{text}</option>
              ),
            )}
          </select>
        </label>
        <label>
          2. Explain the pattern
          <select
            value={process}
            onChange={(e) => {
              setProcess(e.target.value);
              setChecked(false);
            }}
          >
            <option value="">Choose an interpretation</option>
            {processes.map((text) => (
              <option key={text}>{text}</option>
            ))}
          </select>
        </label>
      </div>
      <button
        className="button button-primary"
        disabled={!direction || !process}
        onClick={() => setChecked(true)}
      >
        Check interpretation
      </button>
      {checked && (
        <div className="answer-explanation" role="status">
          <h3>
            {direction === item.direction && process === item.process
              ? "Both steps correct."
              : "Compare your reasoning."}
          </h3>
          <p>
            <strong>
              {item.direction} · {item.process}
            </strong>
          </p>
          <p>{item.reasoning}</p>
          {item.winter && (
            <p>
              Expected PaCO₂: {range.low}–{range.high} mmHg. Anion gap:{" "}
              {item.sodium} − ({item.chloride} + {item.bicarbonate}) ={" "}
              {item.sodium - item.chloride - item.bicarbonate} mmol/L.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
export function AbgPractice() {
  const [index, setIndex] = useState(0);
  return (
    <section className="study-panel" aria-label="ABG interpretation exercise">
      <p className="eyebrow">Test · explain the pattern</p>
      <h2>Six blood gases. Work through the logic.</h2>
      <p>
        Teaching ranges: pH 7.35–7.45; PaCO₂ 35–45 mmHg; HCO₃⁻ 22–26 mmol/L.
        These fictional exercises develop interpretation skills; they do not
        assess or treat a patient.
      </p>
      <div className="topic-buttons" aria-label="Choose an ABG case">
        {cases.map((item, i) => (
          <button
            key={item.name}
            aria-pressed={index === i}
            onClick={() => setIndex(i)}
          >
            Case {i + 1}
          </button>
        ))}
      </div>
      <AbgCase key={index} index={index} />
      <div className="action-row">
        <button
          className="button button-secondary"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
        >
          Previous case
        </button>
        <button
          className="button button-secondary"
          disabled={index === cases.length - 1}
          onClick={() => setIndex(index + 1)}
        >
          Next case
        </button>
      </div>
      <p className="source-note">
        Compensation cross-check:{" "}
        <a
          className="text-link"
          href="https://www.merckmanuals.com/professional/nephrology/acid-base-regulation-and-disorders/acid-base-disorders"
        >
          Merck Manual: Acid–Base Disorders
        </a>
        . Cases and explanations are original teaching adaptations. Each case
        starts fresh when reopened.
      </p>
    </section>
  );
}

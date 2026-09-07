"use client";
import { abgCases as cases } from "@/content/abg-cases";
import { recordAnswer, recordVisit, useLearning } from "./learning-store";
import { SavedRecall } from "./saved-recall";
import { PracticeQuestion } from "./practice-question";
import transfer from "@/content/transfer-practice.json";
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
      <div className="study-panel"><h3>1. Predict before moving a slider</h3><p>Keep afferent resistance at 1 and double efferent resistance. Predict the direction of flow and glomerular pressure separately.</p><SavedRecall id="lab-prediction" label="My prediction and reason" /></div>
      <h3>2. Run the experiment</h3>
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
      <h3>3. Explain and transfer</h3><SavedRecall id="lab-explanation" label="What changed, and why?" />
      <p>Compare the observed values with your prediction. Reset, then repeat with afferent resistance at 2 and efferent resistance at 1.</p>
      {transfer.questions.filter((q) => q.topic === "renal-experiments").map((q) => <PracticeQuestion key={q.id} item={q} title="Test the circuit relationship" />)}
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
const processes = cases.map((c) => c.process);
function AbgCase({ index, review }: { index: number; review: boolean }) {
  const item = cases[index];
  const { data, ready } = useLearning();
  const previous = data.answers["abg-" + (index + 1)];
  const directions = ["Acidemia", "Within the reference interval", "Alkalemia"];
  const packed = review ? null : previous?.lastChoice;
  const [draftDirection, setDirection] = useState<string | null>(null);
  const [draftProcess, setProcess] = useState<string | null>(null);
  const direction = draftDirection ?? (packed != null ? directions[Math.floor(packed / processes.length)] ?? "" : "");
  const process = draftProcess ?? (packed != null ? processes[packed % processes.length] ?? "" : "");
  const [submitted, setChecked] = useState<boolean | null>(null);
  const checked = submitted ?? (!review && !!previous);
  const [feedbackSeen, setFeedbackSeen] = useState(false);
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
              if (checked) setFeedbackSeen(true);
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
              if (checked) setFeedbackSeen(true);
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
        disabled={!ready || !direction || !process || checked}
        onClick={() => { recordAnswer("abg-" + (index + 1), direction === item.direction && process === item.process, directions.indexOf(direction) * processes.length + processes.indexOf(process), feedbackSeen); recordVisit(); setChecked(true); }}
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
          <p>{item.reasoning}</p><p>Saved in this browser. Your first-attempt result stays recorded.</p><button className="text-link" onClick={() => { setDirection(""); setProcess(""); setChecked(false); setFeedbackSeen(true); }}>Try without feedback</button>
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
export function AbgPractice({ initialCase = 0, review = false }: { initialCase?: number; review?: boolean }) {
  const [index, setIndex] = useState(initialCase);
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
      <AbgCase key={index} index={index} review={review} />
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
        . Cases and explanations are original teaching adaptations. Checked answers are saved in My study on this browser.
      </p>
    </section>
  );
}

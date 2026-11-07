"use client";
import { useId, useRef, useState } from "react";
import { learningEvent } from "@/lib/learning-analytics";
import { evaluateCheckpoint, type CheckpointDefinition, type CheckpointEvaluation, type CheckpointResponse } from "@/lib/conceptual-checkpoint";
import { assessCheckpoint, recordCheckpoint, recordVisit, useLearning } from "./learning-store";
import { optionOrder } from "@/lib/option-order";
import styles from "./conceptual-checkpoint.module.css";

export function CheckpointFeedback({ question: q, evaluation, assessment }: { question: CheckpointDefinition; evaluation: CheckpointEvaluation; assessment?: "review" | "explained" }) {
  const self = evaluation.outcome === "self-review" || evaluation.outcome === "unassessed";
  return <div className={`concept-feedback ${styles.feedback}`} role="status" data-feedback={evaluation.outcome}>
    <h4 tabIndex={-1}>{evaluation.outcome === "correct" ? "Correct — You understand the relationship." : self ? "Compare with the model explanation" : "Review the Relationship"}</h4>
    <p>Your answer: {evaluation.responseLabel}</p>
    <p><strong>{self ? "Model explanation" : "Correct answer"}:</strong> {evaluation.answer}</p>
    {evaluation.explanation.split("\n\n").map((text, i) => <p key={i}>{text}</p>)}
    {q.mechanism !== evaluation.answer && q.mechanism !== evaluation.explanation && <p><strong>The relationship:</strong> {q.mechanism}</p>}
    {q.relatedExplanation && <p>{q.relatedExplanation}</p>}
    {q.metadata.prerequisites.length > 0 && <p>Connect this with: {q.metadata.prerequisites.map(id => id.replaceAll("-", " ")).join("; ")}.</p>}
    {"options" in q && <details><summary>Compare all answer explanations</summary><ul>{q.options.map((o, i) => <li key={i}><strong>{o.text}</strong><p>{o.explanation}</p></li>)}</ul></details>}
    {self && <div role="group" aria-label="Self-assess your explanation"><p>Choose the next review step. This does not add an objective score.</p><button className="button button-secondary" aria-pressed={assessment === "review"} onClick={() => assessCheckpoint(q.id, "review")}>I need to review this relationship</button><button className="button button-secondary" aria-pressed={assessment === "explained"} onClick={() => assessCheckpoint(q.id, "explained")}>My explanation covers the model</button></div>}
  </div>;
}

export function ConceptualCheckpoint({ question: q, title, freshAttempt = false, feedbackOnly = false, onComplete, onReset, children, footer }: { question: CheckpointDefinition; title?: string; freshAttempt?: boolean; feedbackOnly?: boolean; onComplete?: (evaluation: CheckpointEvaluation) => void; onReset?: () => void; children?: React.ReactNode; footer?: React.ReactNode }) {
  const { ready, persistent, data } = useLearning();
  const group = useId();
  const submitted = useRef(false);
  const [response, setResponse] = useState<CheckpointResponse>(q.type === "multiple" ? [] : q.type === "numeric" ? { value: "", unit: "" } : q.type === "single" || q.type === "boolean" ? -1 : "");
  const [result, setResult] = useState<CheckpointEvaluation | null>(null);
  const [retry, setRetry] = useState(false);
  const [error, setError] = useState("");
  const saved = data.checkpoints[q.id];
  const legacy = data.answers[q.id];
  const restored = !freshAttempt && !retry ? saved?.response !== null && saved?.response !== undefined ? evaluateCheckpoint(q, saved.response) : (q.type === "single" || q.type === "boolean") && typeof legacy?.lastChoice === "number" ? evaluateCheckpoint(q, legacy.lastChoice) : saved && (q.type === "self-review" || q.type === "short") ? { outcome: saved.outcome, answer: q.model, explanation: "Your written response was not saved. Compare a fresh explanation with the model when you revisit.", responseLabel: "Previous response not stored" } as CheckpointEvaluation : null : null;
  const evaluation = result ?? restored;
  const visibleResponse = evaluation && !result ? saved?.response ?? legacy?.lastChoice ?? response : response;
  const evaluated = evaluateCheckpoint(q, response);
  function check() {
    if (!ready || submitted.current || evaluation) return;
    if (!evaluated) { setError(q.type === "numeric" ? "Enter a finite number and select its unit." : "Provide a response before continuing."); return; }
    submitted.current = true;
    recordCheckpoint(q, response, evaluated, retry);
    recordVisit();
    learningEvent({ version: 1, event: "quiz_completed", quiz_id: q.id });
    setResult(evaluated); setError(""); onComplete?.(evaluated);
    // Inline conceptual checks keep their explanation mounted while opening the next section.
    const node = document.getElementById(`question-${q.id}`);
    const detail = node?.closest("details");
    const next = detail?.nextElementSibling;
    if (next instanceof HTMLDetailsElement) next.open = true;
  }
  return <section className={`study-panel practice-question ${styles.checkpoint}`} id={`question-${q.id}`} aria-label={title ?? `Conceptual Checkpoint: ${q.prompt}`}>
    <p className="eyebrow">Conceptual Checkpoint</p>
    {legacy && <p className="muted-note">Saved history: first attempt {legacy.firstCorrect === null ? "not recorded" : legacy.firstCorrect ? "correct" : "incorrect"}; latest attempt {legacy.lastCorrect ? "correct" : "incorrect"}{legacy.assisted ? " (same-day retry or hint used)" : ""}.</p>}
    {!feedbackOnly && <><h3>{title ?? q.metadata.topic}</h3>{children}<form onSubmit={event => { event.preventDefault(); check(); }}>
      <fieldset disabled={!ready || !!evaluation}><legend>{q.prompt}</legend>
        {"options" in q && <div className="concept-options">{optionOrder(q.id, q.options.length).map(i => <label key={i}><input type={q.type === "multiple" ? "checkbox" : "radio"} name={group} checked={q.type === "multiple" ? Array.isArray(visibleResponse) && visibleResponse.includes(i) : visibleResponse === i} onChange={() => setResponse(q.type === "multiple" ? Array.isArray(response) && response.includes(i) ? response.filter(n => n !== i) : [...(Array.isArray(response) ? response : []), i] : i)} /><span>{q.options[i].text}</span></label>)}</div>}
        {q.type === "multiple" && <p>Select every correct answer. The complete set is required.</p>}
        {q.type === "numeric" && <><p>{q.precision}</p><label>Calculated value<input type="text" inputMode="decimal" maxLength={40} value={typeof response === "object" && "value" in response ? response.value : ""} onChange={e => setResponse({ value: e.target.value, unit: typeof response === "object" && "unit" in response ? response.unit : "" })}/></label><label>Unit<select value={typeof response === "object" && "unit" in response ? response.unit : ""} onChange={e => setResponse({ value: typeof response === "object" && "value" in response ? response.value : "", unit: e.target.value })}><option value="">Choose a unit</option>{q.units.map(unit => <option key={unit.label}>{unit.label}</option>)}</select></label></>}
        {(q.type === "short" || q.type === "self-review") && <><label>Your explanation<textarea rows={4} maxLength={2000} value={typeof response === "string" ? response : ""} onChange={e => setResponse(e.target.value)}/></label><p>Your typed text stays on this page only. It is not saved or sent to an AI service. {q.type === "self-review" ? "You will compare it with a model, without automated grading." : "Only explicitly accepted terms can be graded; other wording stays unassessed."}</p></>}
      </fieldset>
      <button className="button button-primary" disabled={!ready || !!evaluation || !evaluated} type="submit">Check Answer and Continue →</button>
      {error && <p role="alert">{error}</p>}
    </form></>}

    {evaluation && <><p><strong>{q.prompt}</strong></p><CheckpointFeedback question={q} evaluation={evaluation} assessment={saved?.selfAssessment}/>{<button className="button button-secondary" onClick={() => { submitted.current = false; setResult(null); setRetry(true); setResponse(q.type === "multiple" ? [] : q.type === "numeric" ? { value: "", unit: "" } : q.type === "single" || q.type === "boolean" ? -1 : ""); onReset?.(); }}>Try without feedback</button>}</>}
    <div className={styles.sources}><p><strong>Source and scope</strong> · {q.metadata.topic}</p><ul>{q.metadata.sources.map((source, i) => <li key={i}>{source.url ? <a href={source.url}>{source.title}</a> : source.title}{source.locator && <> — {source.locator}</>}<br/>{source.basis.replaceAll("-", " ")}</li>)}</ul>{!q.metadata.sources.some(s => s.basis === "primary-lecture-verified" && s.locator) && <p>Primary lecture slide/page verification is not recorded for this checkpoint.</p>}</div>
    <p className="muted-note">{persistent ? "Progress saved in this browser." : "Storage is unavailable. Progress is kept for this open session only."} Repeated practice is not a measure of mastery.</p>
    {footer}
    <noscript><p>Interactive checking requires JavaScript. Use this model for self-review.</p><details><summary>Model explanation</summary><p>{"model" in q ? q.model : q.mechanism}</p>{q.type === "numeric" && <ol>{q.workedSolution.map(step => <li key={step}>{step}</li>)}</ol>}</details></noscript>
  </section>;
}

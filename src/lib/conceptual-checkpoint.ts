/** Content-independent grading. A response is never graded by substring matching. */
export type CheckpointSource = { title: string; locator?: string; url?: string; basis: "primary-lecture-verified" | "course-material-based" | "textbook-based" | "study-guide-based" | "supplemental-reference-based" | "source-review-needed" };
export type CheckpointMetadata = { subject: string; lesson: string; topic: string; subtopic: string; concept: string; difficulty: "introductory" | "applied"; prerequisites: string[]; sources: CheckpointSource[] };
type Common = { id: string; prompt: string; mechanism: string; metadata: CheckpointMetadata; relatedExplanation?: string; variants?: string[] };
export type CheckpointDefinition = Common & (
  | { type: "single" | "boolean"; options: { text: string; explanation: string }[]; answer: number }
  | { type: "multiple"; options: { text: string; explanation: string }[]; answers: number[] }
  | { type: "numeric"; answer: number; unit: string; units: { label: string; factor: number }[]; tolerance: number; precision: string; workedSolution: string[] }
  | { type: "short"; accepted: string[]; model: string }
  | { type: "self-review"; model: string }
);
export type CheckpointResponse = number | number[] | { value: string; unit: string } | string;
export type CheckpointOutcome = "correct" | "incorrect" | "self-review" | "unassessed";
export type CheckpointEvaluation = { outcome: CheckpointOutcome; answer: string; explanation: string; responseLabel: string };
const normal = (s: string) => s.normalize("NFKC").trim().toLocaleLowerCase("en").replace(/\s+/g, " ");
export function evaluateCheckpoint(q: CheckpointDefinition, response: CheckpointResponse): CheckpointEvaluation | null {
  if (q.type === "single" || q.type === "boolean") {
    if (typeof response !== "number" || !Number.isInteger(response) || !q.options[response] || !q.options[q.answer]) return null;
    return { outcome: response === q.answer ? "correct" : "incorrect", answer: q.options[q.answer].text, explanation: q.options[response].explanation, responseLabel: q.options[response].text };
  }
  if (q.type === "multiple") {
    if (!Array.isArray(response) || !response.length || new Set(response).size !== response.length || response.some(i => !Number.isInteger(i) || !q.options[i])) return null;
    const correct = response.length === q.answers.length && q.answers.every(i => response.includes(i));
    return { outcome: correct ? "correct" : "incorrect", answer: q.answers.map(i => q.options[i].text).join("; "), explanation: q.options.map((o, i) => `${response.includes(i) ? "Selected" : "Not selected"}: ${o.text}. ${o.explanation}`).join("\n\n"), responseLabel: response.map(i => q.options[i].text).join("; ") };
  }
  if (q.type === "numeric") {
    if (!response || typeof response !== "object" || Array.isArray(response) || !("value" in response) || typeof response.value !== "string" || typeof response.unit !== "string") return null;
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(response.value.trim())) return null;
    const unit = q.units.find(u => u.label === response.unit), value = Number(response.value);
    if (!unit || !Number.isFinite(value) || !Number.isFinite(value * unit.factor)) return null;
    const correct = Math.abs(value * unit.factor - q.answer) <= q.tolerance + Number.EPSILON * Math.max(1, Math.abs(q.answer)) * 4;
    return { outcome: correct ? "correct" : "incorrect", answer: `${q.answer} ${q.unit}`, explanation: q.workedSolution.join("\n\n"), responseLabel: `${response.value} ${response.unit}` };
  }
  if (typeof response !== "string" || !response.trim() || response.length > 2000) return null;
  if (q.type === "short") return { outcome: q.accepted.some(s => normal(s) === normal(response)) ? "correct" : "unassessed", answer: q.model, explanation: "Only the listed equivalent terms can be checked automatically. Other wording needs comparison with the model; it is not marked incorrect.", responseLabel: "Typed response (kept only while this page is open)" };
  if (q.type !== "self-review") return null;
  return { outcome: "self-review", answer: q.model, explanation: "Compare your explanation with the model. This is self-assessment, not an automated correctness judgement.", responseLabel: "Written explanation (not saved or sent)" };
}
export type CheckpointRecord = { outcome: CheckpointOutcome; response: number | number[] | { value: string; unit: string } | null; at: number; submissions: number; misses: number; concept: string; selfAssessment?: "review" | "explained" };
export function reinforcementVariant(q: CheckpointDefinition, available: string[], completed: string[], queued: string[]): string | undefined {
  return q.variants?.find(id => id !== q.id && available.includes(id) && !completed.includes(id) && !queued.includes(id));
}
export function nextCheckpointIndex(ids: string[], completed: string[], current: number): number {
  const next = ids.findIndex((id, i) => i > current && !completed.includes(id));
  return next >= 0 ? next : ids.findIndex(id => !completed.includes(id));
}

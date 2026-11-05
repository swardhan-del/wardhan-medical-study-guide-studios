/** Additive activities. Legacy PracticeItem IDs and numeric answer storage are unchanged. */
type ActivityBase = {
  id: string;
  lessonId: string;
  objective: string;
  prompt: string;
  reference: { title: string; url: string };
};
export type NameActivity = ActivityBase & {
  kind: "name";
  accepted: string[];
  contrasts: { names: string[]; explanation: string }[];
  explanation: string;
};
export type SequenceActivity = ActivityBase & {
  kind: "sequence";
  stages: { id: string; label: string; explanation: string }[];
  presentation: string[];
};
export type ExplanationActivity = ActivityBase & {
  kind: "explanation";
  criteria: { id: string; label: string; explanation: string }[];
  model: string;
};
export type LearningActivity = NameActivity | SequenceActivity | ExplanationActivity;
export type ActivityFeedback = { state: "empty" | "matched" | "contrast" | "unassessed" | "incomplete"; message: string };
const normalize = (s: string) => s.normalize("NFKC").trim().toLocaleLowerCase("en").replace(/[.!]+$/, "").replace(/\s+/g, " ");

export function checkActivityName(answer: string, activity: NameActivity): ActivityFeedback {
  const value = normalize(answer);
  if (!value) return { state: "empty", message: "Enter a short name first." };
  if (activity.accepted.some(name => normalize(name) === value)) return { state: "matched", message: `Name matched. ${activity.explanation}` };
  const contrast = activity.contrasts.find(item => item.names.some(name => normalize(name) === value));
  if (contrast) return { state: "contrast", message: contrast.explanation };
  return { state: "unassessed", message: "This wording is unassessed. Compare it with the explanation; the checker recognises only listed short names, not sentences or essays." };
}

export function checkActivitySequence(order: string[], activity: SequenceActivity): ActivityFeedback {
  const expected = activity.stages.map(stage => stage.id);
  if (new Set(order).size !== order.length || order.some(id => !expected.includes(id))) return { state: "unassessed", message: "The sequence contains an unknown or repeated stage. Reset and try again." };
  if (order.length !== expected.length) return { state: "incomplete", message: `Choose every stage before checking (${order.length} of ${expected.length}).` };
  const mismatch = order.findIndex((id, index) => id !== expected[index]);
  if (mismatch >= 0) {
    const stage = activity.stages[mismatch];
    return { state: "contrast", message: `Revisit position ${mismatch + 1}: ${stage.label}. ${stage.explanation}` };
  }
  return { state: "matched", message: "Order matched. Now explain why each transition is necessary; matching an order alone does not assess that explanation." };
}

export function validateActivities(activities: LearningActivity[]): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const activity of activities) {
    if (ids.has(activity.id)) errors.push(`Duplicate activity: ${activity.id}`);
    ids.add(activity.id);
    if (!activity.objective.trim() || !activity.prompt.trim() || !activity.lessonId) errors.push(`Incomplete activity: ${activity.id}`);
    if (!activity.reference.url.startsWith("https://")) errors.push(`Invalid reference: ${activity.id}`);
    if (activity.kind === "sequence") {
      const expected = activity.stages.map(stage => stage.id);
      if (expected.length < 2 || new Set(expected).size !== expected.length || new Set(activity.presentation).size !== expected.length || activity.presentation.length !== expected.length || activity.presentation.some(id => !expected.includes(id))) errors.push(`Invalid sequence: ${activity.id}`);
    } else if (activity.kind === "name") {
      const accepted = activity.accepted.map(normalize);
      if (!accepted.length || accepted.some(name => !name) || activity.contrasts.some(c => c.names.some(name => accepted.includes(normalize(name))))) errors.push(`Ambiguous name rule: ${activity.id}`);
    } else if (!activity.criteria.length || new Set(activity.criteria.map(c => c.id)).size !== activity.criteria.length) errors.push(`Invalid rubric: ${activity.id}`);
  }
  return errors;
}

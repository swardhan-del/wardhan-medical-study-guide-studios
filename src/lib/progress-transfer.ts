import { parseProgress, type LearningProgress } from "./learning-core.ts";

export function readTransfer(raw: string, lessons: string[], questions: string[], drafts: string[], resources: string[]) {
  if (raw.length > 1000000) throw new Error("Choose a progress file smaller than 1 MB.");
  let value;
  try { value = JSON.parse(raw); } catch { throw new Error("This file is not valid JSON. Choose a Wardhan progress export."); }
  const wrapped = value?.format === "wardhan-study-export";
  if (wrapped && value.version !== 1) throw new Error("This export version is not supported.");
  const progress = wrapped ? value.progress : value;
  if (!progress || ![1, 2].includes(progress.version) || !Array.isArray(progress.lessons) || !progress.answers || typeof progress.answers !== "object" || Array.isArray(progress.answers)) throw new Error("This is not a recognised Wardhan progress record.");
  const saved: string[] = wrapped && Array.isArray(value.saved) ? [...new Set<string>(value.saved.filter((id: unknown) => typeof id === "string" && resources.includes(id)))].slice(0, 500) : [];
  return { progress: parseProgress(JSON.stringify(progress), lessons, questions, drafts), saved };
}

// Do not add counters from overlapping exports or turn a retry into a new first attempt.
export function mergeProgress(current: LearningProgress, incoming: LearningProgress): LearningProgress {
  const answers = { ...current.answers };
  for (const [id, attempt] of Object.entries(incoming.answers)) {
    if (!answers[id] || attempt.lastAt > answers[id].lastAt) answers[id] = attempt;
  }
  return {
    version: 2,
    lessons: [...new Set([...current.lessons, ...incoming.lessons])],
    oral: [...new Set([...current.oral, ...incoming.oral])],
    visits: [...new Set([...current.visits, ...incoming.visits])].sort().slice(-366),
    answers,
    drafts: { ...incoming.drafts, ...current.drafts },
    plan: current.plan ?? incoming.plan,
    quizzes: Math.max(current.quizzes, incoming.quizzes),
    shares: Math.max(current.shares, incoming.shares),
  };
}

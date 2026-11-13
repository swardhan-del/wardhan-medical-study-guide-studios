import sources from "../content/checkpoint-sources.json" with { type: "json" };
import type { PracticeItem } from "../content/practice-registry.ts";
import type { CheckpointDefinition, CheckpointMetadata } from "./conceptual-checkpoint.ts";

type SourceMetadata = Omit<CheckpointMetadata, "concept" | "lesson"> & { lesson?: string };
const sourceMetadata: Record<string, SourceMetadata | undefined> = sources as Record<string, SourceMetadata>;

export function checkpointSourceFor(id: string) {
  const source = sourceMetadata[id];
  return source && { ...source, lesson: source.lesson ?? id };
}

export function checkpointFor(item: PracticeItem): CheckpointDefinition | null {
  if (item.checkpoint) return item.checkpoint;
  if (!item.options || item.answer === undefined) return null;
  const mapped = checkpointSourceFor(item.id) ?? checkpointSourceFor(item.topic);
  const metadata: CheckpointMetadata = mapped ? { ...mapped, concept: item.id, sources: mapped.sources.map(source => ({ ...source, ...(item.href.startsWith("/library/") && !source.url ? { url: item.href.split("#")[0] + "#lesson-source" } : {}) })) } : { subject: item.subject, lesson: item.topic, topic: item.title, subtopic: item.title, concept: item.id, difficulty: "applied", prerequisites: [], sources: [{ title: "References in the associated activity", url: item.href.split("#")[0] + "#sources", basis: "source-review-needed" }] };
  return { id: item.id, type: "single", prompt: item.prompt, options: item.options, answer: item.answer, mechanism: item.options[item.answer].explanation, metadata };
}

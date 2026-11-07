import sources from "../content/checkpoint-sources.json" with { type: "json" };
import type { PracticeItem } from "../content/practice-registry.ts";
import type { CheckpointDefinition, CheckpointMetadata } from "./conceptual-checkpoint.ts";
export function checkpointFor(item: PracticeItem): CheckpointDefinition | null {
  if (item.checkpoint) return item.checkpoint;
  if (!item.options || item.answer === undefined) return null;
  const mapped = (sources as Record<string, CheckpointMetadata>)[item.id] ?? (sources as Record<string, CheckpointMetadata>)[item.topic];
  const metadata: CheckpointMetadata = mapped ? { ...mapped, concept: item.id, sources: mapped.sources.map(source => ({ ...source, ...(item.href.startsWith("/library/") && !source.url ? { url: item.href.split("#")[0] + "#lesson-source" } : {}) })) } : { subject: item.subject, lesson: item.topic, topic: item.title, subtopic: item.title, concept: item.id, difficulty: "applied", prerequisites: [], sources: [{ title: "References in the associated activity", url: item.href.split("#")[0] + "#sources", basis: "source-review-needed" }] };
  return { id: item.id, type: "single", prompt: item.prompt, options: item.options, answer: item.answer, mechanism: item.options[item.answer].explanation, metadata };
}

"use client";
import Link from "next/link";
import type { PracticeItem } from "@/content/practice-registry";
import { checkpointFor } from "@/lib/checkpoint-adapter";
import type { CheckpointEvaluation } from "@/lib/conceptual-checkpoint";
import { ConceptualCheckpoint } from "./conceptual-checkpoint";
import { AirwayPressureDiagram } from "./airway-pressure-diagram";
import { CorrectionLink } from "./correction-link";
export function PracticeQuestion({ item, title, freshAttempt = false, feedbackOnly = false, onReset, onComplete }: { item: PracticeItem; title?: string; freshAttempt?: boolean; feedbackOnly?: boolean; onReset?: () => void; onComplete?: (evaluation: CheckpointEvaluation) => void }) {
  const question = checkpointFor(item);
  if (!question) return <section className="study-panel"><h3>{title ?? item.title}</h3><p>{item.prompt}</p><p>This question needs its specimen or clinical data. Open the activity to review it in context.</p><Link className="button button-primary" href={item.href}>Open activity →</Link></section>;
  return <><ConceptualCheckpoint key={question.id} question={question} title={title} freshAttempt={freshAttempt} feedbackOnly={feedbackOnly} onComplete={onComplete} onReset={onReset} footer={<CorrectionLink questionId={item.id}/>}>{item.id === "studio-respiratory-pressure-reading" && <AirwayPressureDiagram />}</ConceptualCheckpoint></>;
}

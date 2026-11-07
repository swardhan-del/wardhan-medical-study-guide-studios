import definitions from './typed-checkpoints.json' with { type: 'json' };
import type { CheckpointDefinition } from '../lib/conceptual-checkpoint.ts';
import type { PracticeItem } from './practice-registry.ts';
export const typedCheckpointItems: PracticeItem[] = (definitions as CheckpointDefinition[]).map(q => ({id:q.id,topic:q.metadata.lesson,title:q.metadata.subtopic,subject:q.metadata.subject,href:q.metadata.lesson==='filtration-and-clearance'?'/learn/renal/filtration-and-clearance#lesson-quiz':`/library/${q.metadata.lesson}#question-${q.id}`,prompt:q.prompt,checkpoint:q}));

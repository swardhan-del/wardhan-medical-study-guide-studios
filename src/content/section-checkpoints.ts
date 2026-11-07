import library from './library-lessons.json' with { type: 'json' };
import anatomy from './anatomy-course.json' with { type: 'json' };
import sources from './checkpoint-sources.json' with { type: 'json' };
import { foundations } from './foundations.ts';
import type { PracticeItem } from './practice-registry.ts';
import type { CheckpointMetadata } from '../lib/conceptual-checkpoint.ts';
const mapped = sources as Record<string, CheckpointMetadata>;
export const sectionCheckpointItems: PracticeItem[] = library.lessons.flatMap(lesson => lesson.steps.flatMap((step, index) => {
  if (!('practice' in step) || !step.practice) return [];
  const id = `section-${lesson.id}-${index + 1}`;
  return [{ id, topic: lesson.id, title: step.title, subject: lesson.subject, href: `/library/${lesson.id}#question-${id}`, prompt: step.practice.prompt, checkpoint: { id, type: 'self-review' as const, prompt: step.practice.prompt, model: step.practice.feedback, mechanism: step.practice.feedback, metadata: { ...mapped[lesson.id], concept: id, subtopic: step.title } } }];
}));
export const anatomyCheckpointItems: PracticeItem[] = anatomy.records.flatMap(record => record.practice.map(practice => ({ id: practice.id, topic: record.lessonId, title: practice.kind, subject: 'anatomy', href: `/library/${record.lessonId}#question-${practice.id}`, prompt: practice.prompt, checkpoint: { id: practice.id, type: 'self-review' as const, prompt: practice.prompt, model: practice.answer, mechanism: practice.answer, metadata: { ...mapped[record.lessonId], concept: practice.id, subtopic: practice.kind } } })));
export const foundationCheckpointItems: PracticeItem[] = Object.entries(foundations).map(([subject, f]) => {
  const id = `foundation-${subject}`;
  return { id, topic: id, title: f.title, subject, href: `/learn/foundations/${subject}#question-${id}`, prompt: f.prompt, checkpoint: { id, type: 'self-review', prompt: f.prompt, model: f.answer, mechanism: f.answer, metadata: { subject, lesson: id, topic: f.title, subtopic: 'Apply the vocabulary', concept: id, difficulty: 'introductory', prerequisites: [], sources: [{ title: 'Supporting reference for this vocabulary lesson', url: f.source, basis: 'supplemental-reference-based' }] } } };
});

import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, realpathSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const depthDimensions = ['terminology', 'distinctions', 'mechanism', 'application', 'calculation-or-identification', 'misconceptions', 'transfer'];

export function privateOutput(root, output) {
  const target = path.resolve(root, output);
  const relative = path.relative(root, target);
  assert(relative && !relative.startsWith('..') && ['.private', 'output'].includes(relative.split(path.sep)[0]), 'Output must stay inside .private/ or output/');
  let ancestor = target;
  while (!existsSync(ancestor)) ancestor = path.dirname(ancestor);
  const resolved = path.resolve(realpathSync(ancestor), path.relative(ancestor, target));
  const actualRelative = path.relative(realpathSync(root), resolved);
  assert(!actualRelative.startsWith('..') && ['.private', 'output'].includes(actualRelative.split(path.sep)[0]), 'Output symlink leaves the private directory');
  mkdirSync(resolved, { recursive: true });
  return realpathSync(resolved);
}

export function planLessons(lessons, subjectsByLesson = {}) {
  const ids = new Set();
  return lessons.map(lesson => {
    assert(!ids.has(lesson.id), 'Duplicate lesson ID'); ids.add(lesson.id);
    const fingerprint = createHash('sha256').update(JSON.stringify(lesson)).digest('hex');
    const questions = lesson.questions.map(q => {
      assert(q.id && q.prompt && Number.isInteger(q.answer) && q.options[q.answer], 'Incomplete question');
      assert(q.options.every(o => o.text && o.explanation), 'Every option needs feedback');
      return { id: q.id, kind: 'multiple-choice', prompt: q.prompt, options: q.options, answerIndex: q.answer, answer: q.options[q.answer].text, explanation: q.options[q.answer].explanation };
    });
    const oral = lesson.prompts.map(q => ({ id: q.id, kind: 'explanation', prompt: q.prompt, answer: q.explanation }));
    assert(oral.every(q => q.prompt && q.answer), 'Missing model response');
    const content = lesson.content.lesson;
    const concepts = (content.steps ?? content.sections ?? []).map((step, index) => ({
      id: `${lesson.id}-concept-${index + 1}`, title: step.title,
      depth: Object.fromEntries(depthDimensions.map(d => [d, 'not-audited'])),
      terminology: [], sourceEdition: 'not-reconciled', assessmentIds: [],
    }));
    return {
      lessonId: lesson.id, title: lesson.title, subject: subjectsByLesson[lesson.id] ?? lesson.subject, learningSubject: lesson.subject, href: lesson.href,
      lessonFingerprint: fingerprint, objectives: lesson.objectives,
      prerequisites: lesson.links.prerequisite, concepts,
      questions: [...questions, ...oral],
      sequence: ['define-and-distinguish', 'explain', 'worked-example', 'answer-before-reveal', 'compare-feedback', 'apply', 'next-lesson'],
      media: { formats: ['portrait', 'landscape'], flow: ['question', 'pause', 'answer', 'option-feedback', 'return-to-lesson'], audio: 'silent', releaseStatus: 'private-review-only' },
      gates: { sourceEdition: 'pending', rights: 'pending', scientific: 'pending', editorial: 'pending', humanAccessibility: 'pending', ownerRelease: 'pending' },
      limitation: 'Existing teaching content reused for planning. A question count or matching heading does not establish concept mastery, source coverage or review approval.',
    };
  });
}

export async function main(args = process.argv.slice(2)) {
  const opts = {};
  for (let i = 0; i < args.length; i += 2) {
    assert(['--out', '--subject', '--lesson'].includes(args[i]) && args[i + 1] && !args[i + 1].startsWith('--'), 'Use --out PATH [--subject ID] [--lesson ID]');
    assert(!opts[args[i]], 'Duplicate argument'); opts[args[i]] = args[i + 1];
  }
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const { qualityLessons } = await import('../src/lib/quality-lessons.ts');
  const { default: taxonomy } = await import('../src/content/library-taxonomy.json', { with: { type: 'json' } });
  // The existing taxonomy separates Immunology from the shared genetics data group.
  const subjectsByLesson = Object.fromEntries(taxonomy.nodes.flatMap(node => (node.resources ?? []).map(id => [id, node.subject === 'immunology' ? 'immunology' : taxonomy.subjects.find(s => s.id === node.subject)?.learningSubject ?? node.subject])));
  const selected = qualityLessons.filter(l => (!opts['--subject'] || (subjectsByLesson[l.id] ?? l.subject) === opts['--subject']) && (!opts['--lesson'] || l.id === opts['--lesson']));
  assert(selected.length, 'No matching lessons');
  const plans = planLessons(selected, subjectsByLesson);
  const output = privateOutput(root, opts['--out'] ?? '.private/question-media');
  const data = { version: 1, source: 'current-repository-teaching-records', generatedAt: new Date().toISOString(), releaseStatus: 'private-review-only', lessons: plans };
  writeFileSync(path.join(output, 'lesson-plan.json'), JSON.stringify(data, null, 2) + '\n', { flag: 'wx' });
  writeFileSync(path.join(output, 'lesson-plan.md'), '# Question and media lesson plan\n\nPrivate review only. Source editions, concept coverage and human reviews remain pending.\n\n' + plans.map(p => `- ${p.subject}: ${p.title} (${p.lessonId}); ${p.concepts.length} teaching sections; ${p.questions.length} existing assessment/model-response cards; ${p.href}`).join('\n') + '\n', { flag: 'wx' });
  console.log(JSON.stringify({ lessons: plans.length, cards: plans.reduce((n, p) => n + p.questions.length, 0), conceptsToAudit: plans.reduce((n, p) => n + p.concepts.length, 0), output, publication: false }));
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();

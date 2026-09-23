import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { beginnerSequences, studyPaths } from '../src/content/study-paths.ts';
import { validateLibraryLessons } from '../scripts/library-schema.mjs';
const read = name => JSON.parse(readFileSync(new URL(`../src/content/${name}.json`, import.meta.url), 'utf8'));
const id = 'anatomy-foundations';
const lessons = read('library-lessons');
const lesson = lessons.lessons.find(l => l.id === id);
const knowledge = read('study-questions').questions.filter(q => q.topic === id);
const applied = read('transfer-practice').questions.filter(q => q.topic === id);

test('Anatomy foundations is registered separately from all 120 regional lessons and begins the learning path', () => {
  assert(lesson);
  assert.deepEqual(lesson.prerequisites, []);
  assert.equal(read('anatomy-course').records.length, 120);
  assert(!read('anatomy-course').records.some(r => r.lessonId === id));
  assert.equal(studyPaths.anatomy.start, id);
  assert.equal(beginnerSequences.anatomy[0].href, `/library/${id}`);
  for (const [file, key] of [['study-collections','groups'],['printable-guides','parts']]) {
    const groups = read(file)[key];
    assert.equal(groups.filter(g => g.lessonIds.includes(id)).length, 1);
    assert.deepEqual(groups.find(g => g.id === id).lessonIds, [id]);
    assert.equal(groups.filter(g => g.id.startsWith('anatomy-volume-')).flatMap(g => g.lessonIds).length, 120);
  }
  assert(read('public-release').resourceIds.includes(id));
  assert(read('library-taxonomy').nodes.some(n => n.resources.includes(id) && n.subject === 'anatomy'));
  assert(read('study-map').groups.some(g => g.subject === 'anatomy' && g.topics.some(t => t.href === `/library/${id}`)));
  assert(read('public-search')[id].includes('pleural cavity'));
  assert.doesNotThrow(() => validateLibraryLessons(lessons, read('public-catalog'), read('library-sources')));
});

test('assessment keys independently distinguish orientation, planes, compartments and tissue function', () => {
  assert.equal(knowledge.length, 6);
  assert.equal(applied.length, 4);
  assert.equal(lesson.question.options[lesson.question.answer].text, 'Anterior to the heart');
  const answers = [...knowledge, ...applied].map(q => q.options[q.answer].text);
  assert.deepEqual(answers, [
    'Distal to the elbow', 'Parasagittal', 'The diaphragm',
    'It is the potential space between visceral and parietal pleura',
    'An organ integrating several tissue families', 'The right hand and the right foot',
    'Patient’s right and anterior', 'Fluid occupies the right pleural cavity',
    'The mark remains on the anatomical anterior surface of the right forearm',
    'Mechanical mixing of the luminal contents',
  ]);
  assert.match(applied[0].prompt, /viewed from the feet towards the head, with anterior at the top/);
  assert.match(applied[3].prompt, /epithelial lining remains intact/);
  for (const q of [...knowledge, ...applied]) {
    assert.equal(q.subject, 'anatomy');
    assert(q.options.every(o => o.explanation.length > 30));
    assert.equal(new Set(q.options.map(o => o.text)).size, q.options.length);
    assert(!/retrieval|oral recall/i.test(q.prompt + (q.heading ?? '')));
  }
});

test('the foundation distinguishes anatomical evidence from diagnosis and has accountable sources', () => {
  assert.equal(lesson.oralExamination.length, 4);
  assert.equal(lesson.summaryChecklist.length, 7);
  assert.match(lesson.workedExample.solution.join(' '), /regional clue/);
  assert.match(lesson.workedExample.solution.join(' '), /independent boundary clue/);
  assert.match(lesson.workedExample.solution.at(-1), /does not establish a diagnosis/);
  assert(!/retrieval|oral recall/i.test(JSON.stringify(lesson)));
  const refs = read('lesson-references')[id];
  assert.equal(refs.supportingReferences.length, 4);
  for (const ref of [refs, ...refs.supportingReferences]) {
    assert.equal(new URL(ref.url).hostname, 'openstax.org');
    assert.equal(new URL(ref.url).protocol, 'https:');
  }
  assert(read('library-sources')[lesson.source].context.includes('No textbook image'));
  assert(!read('public-figures').figures.some(f => f.resourceIds.includes(id)));
});

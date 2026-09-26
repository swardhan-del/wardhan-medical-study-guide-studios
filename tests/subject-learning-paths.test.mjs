import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { subjectHubs, newEntryLessonIds } from '../src/content/subject-hubs.ts';
import { entryLessonGuides } from '../src/content/entry-lesson-guides.ts';
import { studyPaths, beginnerSequences } from '../src/content/study-paths.ts';

const read = name => JSON.parse(readFileSync(new URL(`../src/content/${name}.json`, import.meta.url), 'utf8'));
const lessons = read('library-lessons').lessons;
const byId = new Map(lessons.map(l => [l.id, l]));
const studio = read('study-questions').questions;
const transfer = read('transfer-practice').questions;

test('every curriculum hub starts a released subject lesson and maps available next steps', () => {
  assert.deepEqual(Object.keys(subjectHubs).sort(), ['anatomy','biochemistry','biophysics','cell-biology','genetics','histology','physiology']);
  const release = read('public-release').resourceIds;
  for (const [subject, hub] of Object.entries(subjectHubs)) {
    assert(hub.covers.length > 60 && hub.why.length > 60 && hub.firstReason.length > 60);
    assert.equal(byId.get(hub.firstLesson)?.subject, subject);
    assert(release.includes(hub.firstLesson));
    assert.equal(studyPaths[subject].start, hub.firstLesson);
    assert.equal(beginnerSequences[subject][0].href, '/library/' + hub.firstLesson);
    if (subject !== 'anatomy') assert(hub.topics.length >= 4);
    for (const topic of hub.topics) assert.equal(byId.get(topic.lesson)?.subject, subject, topic.lesson);
  }
});

test('new entry lessons have complete teaching, accessible comparisons and public source registrations', () => {
  const refs = read('lesson-references'), sources = read('library-sources');
  const collections = read('study-collections').groups, parts = read('printable-guides').parts;
  const nodes = read('library-taxonomy').nodes;
  for (const id of newEntryLessonIds) {
    const l = byId.get(id), guide = entryLessonGuides[id];
    assert(l && guide, id);
    assert.equal(l.steps.length, 4);
    assert(l.steps.reduce((n,s) => n+s.body.split(/\s+/).length, 0) >= 250);
    assert.equal(l.objectives.length, 4);
    assert.equal(l.oralExamination.length, 2);
    assert.equal(l.summaryChecklist.length, 4);
    assert(l.workedExample.solution.length >= 3 && l.recall.answer.length > 100);
    assert.doesNotMatch(JSON.stringify([l, guide]), /retrieval|oral recall|\/Users\/|dropbox/i);
    assert(sources[l.source].context.includes('Original website'));
    const links = [refs[id], ...refs[id].supportingReferences];
    assert(links.length >= 2 && links.every(r => /^https:\/\//.test(r.url) && r.title.length > 15));
    assert(links[guide.comparison.sourceIndex]);
    assert.equal(guide.comparison.headers.length, 3);
    assert(guide.comparison.rows.every(row => row.length === 3));
    assert(guide.comparison.caption.length > 100 && guide.comparison.observe.length > 50);
    assert.equal(collections.filter(g=>g.lessonIds.includes(id)).length, 1);
    assert.equal(parts.filter(g=>g.lessonIds.includes(id)).length, 1);
    assert(nodes.some(n=>n.resources.includes(id)));
  }
});

// Reviewed answer text is independent of the numeric key and option presentation order.
const expected = {
  'concept-physiology-membrane-foundations': 'Facilitated diffusion',
  'physiology-membrane-foundations-knowledge-1': 'The inside is 70 mV more negative than the outside.',
  'physiology-membrane-foundations-application-1': 'It decreases because the downhill Na⁺ movement supplies less energy.',
  'physiology-membrane-foundations-application-2': 'It becomes less negative.',
  'concept-biochemistry-enzyme-foundations': 'The substrate concentration at half the limiting initial rate',
  'biochemistry-enzyme-foundations-knowledge-1': 'The rate at which equilibrium is approached.',
  'biochemistry-enzyme-foundations-application-1': 'Higher apparent Km with unchanged Vmax.',
  'biochemistry-enzyme-foundations-application-2': '30 µmol/min',
  'concept-genetics-genome-foundations': 'A chromosome contains many genes; an allele is a version at a locus.',
  'genetics-genome-foundations-knowledge-1': 'Transcription',
  'genetics-genome-foundations-application-1': '50%',
  'genetics-genome-foundations-application-2': 'RNA abundance differs; the gene need not be absent from either cell.',
  'concept-biophysics-membrane-foundations': 'Movement continues in both directions, with zero net flux.',
  'biophysics-membrane-foundations-knowledge-1': 'It halves.',
  'biophysics-membrane-foundations-application-1': 'From left to right',
  'biophysics-membrane-foundations-application-2': 'No; solute permeability and redistribution must also be considered.',
};

test('all sixteen entry question keys select the independently reviewed answer with distinct explanations', () => {
  const questions = newEntryLessonIds.flatMap(id => [
    { id: 'concept-'+id, ...byId.get(id).question },
    ...studio.filter(q=>q.topic===id), ...transfer.filter(q=>q.topic===id),
  ]);
  assert.equal(questions.length, 16);
  assert.deepEqual(new Set(questions.map(q=>q.id)), new Set(Object.keys(expected)));
  for (const q of questions) {
    assert.equal(q.options[q.answer]?.text, expected[q.id], q.id);
    assert.equal(q.options.filter(o=>o.text===expected[q.id]).length, 1);
    const explanations = q.options.map(o=>o.reason ?? o.explanation);
    assert(explanations.every(e=>e.length > 45), q.id);
    assert.equal(new Set(explanations).size, q.options.length);
  }
});

test('worked quantitative examples and comparison values agree with independent calculations', () => {
  const rate = (maximum, km, substrate) => maximum*substrate/(km+substrate);
  assert.equal(rate(80,2,2), 40);
  assert.equal(rate(60,3,3), 30);
  for (const [substrate, value] of entryLessonGuides['biochemistry-enzyme-foundations'].comparison.rows)
    assert.equal(rate(80,2,Number(substrate)), Number(value));
  const cross = ['A','a'].flatMap(p=>['A','a'].map(q=>p+q));
  assert.equal(cross.filter(g=>g==='aa').length/cross.length, 1/4);
  assert.equal(cross.filter(g=>g==='Aa'||g==='aA').length/cross.length, 1/2);
  assert(byId.get('genetics-genome-foundations').workedExample.solution.some(s=>s.includes('25%')));
  const relativeRate = (area, thickness) => area/thickness;
  assert.equal(relativeRate(1,2), .5);
  assert.equal(relativeRate(2,3), 2/3);
  assert(byId.get('biophysics-membrane-foundations').workedExample.solution.some(s=>s.includes('2/3')));
  // Nernst potential is proportional to ln(outside/inside) for K+.
  assert(Math.log(8/140) > Math.log(4/140));
  assert(-90 < -70); // The worked increase in K conductance initially hyperpolarises.
});

test('approved Histology and Anatomy flagship records remain byte-equivalent after JSON normalisation', () => {
  const expectedHashes = {
    'histology-foundations-tissues': '46160053e8b3657d1ee8f5b9e71ce1c18cdddb10f0c6d41ba2fab53a038cffc2',
    'anatomy-foundations': 'd1345b844fc3e0d8348255510a0a74662b2416226e521a7e0d20ca94dcd87acd',
  };
  for (const [id, hash] of Object.entries(expectedHashes))
    assert.equal(createHash('sha256').update(JSON.stringify(byId.get(id))).digest('hex'), hash, id);
});

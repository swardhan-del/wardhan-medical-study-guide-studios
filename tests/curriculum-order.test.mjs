import test from 'node:test';
import assert from 'node:assert/strict';
import { curriculumOrders, curriculumStartHref, beginnerLinks } from '../src/content/curriculum-order.ts';
import { validateCurriculum } from '../scripts/check-curriculum.mjs';

const expected = {
  physiology: ['homeostasis-fluids','membranes','excitable-cells','cardiovascular','respiratory','renal','digestion-energy','endocrine-reproduction','nervous-senses','blood'],
  'cell-biology': ['cell-organisation','membranes','organelles-energy','dna-chromatin','replication-repair','transcription-rna','translation-targeting','cell-control-methods'],
  biochemistry: ['chemical-foundations','proteins','enzymes','carbohydrates-lipids','bioenergetics','central-metabolism','nucleotide-nitrogen','integrated-clinical'],
};

test('foundational stages have the specified order and planned starts never invent lessons', () => {
  for (const [subject, ids] of Object.entries(expected)) {
    const order = curriculumOrders[subject];
    assert.deepEqual(order.stages.map(s => s.id), ids);
    assert(order.stages[0].planned.length > 0);
    assert.equal(curriculumStartHref(subject), `/study/${subject}#subject-topic-map`);
  }
  assert.deepEqual(curriculumOrders['cell-biology'].stages[0].links, []);
  assert.deepEqual(curriculumOrders.biochemistry.stages[0].links.map(l=>l.href), ['biophysics-water-biopolymers','biophysics-energy-first-law','biophysics-entropy-potentials'].map(id=>`/library/${id}`));
  assert(curriculumOrders.physiology.stages[5].links.some(l=>l.href==='/learn/renal'));
  assert(!curriculumOrders.physiology.stages.slice(0,5).some(s=>s.links.some(l=>l.href==='/learn/renal')));
});

test('existing molecular and metabolic lessons are reused once in their curriculum', () => {
  for (const [subject, ids] of Object.entries({
    'cell-biology': ['dna-replication','dna-repair','rna-processing','translation','protein-trafficking','cell-signaling'],
    biochemistry: ['enzyme-kinetics','glycolysis','lipid-metabolism','nitrogen-metabolism'],
  })) {
    const links=curriculumOrders[subject].stages.flatMap(s=>s.links);
    for (const id of ids) assert.equal(links.filter(l=>l.href===`/library/${id}`).length,1,id);
  }
});

test('established anatomy, histology, genetics and biophysics starting routes remain unchanged', () => {
  const preserved={anatomy:'anatomy-foundations',histology:'histology-foundations-tissues',genetics:'genetics-genome-foundations',biophysics:'biophysics-membrane-foundations'};
  for(const [subject,id] of Object.entries(preserved)) {
    assert.equal(curriculumStartHref(subject),`/library/${id}`);
    assert.equal(beginnerLinks[subject][0].href,`/library/${id}`);
  }
  const orientations = {
    anatomy: ['/library/anatomy-foundations','/library/thoracic-cage-landmarks','/study/anatomy/guide'],
    histology: ['/library/histology-foundations-tissues','/library/microscopy','/library/epithelia'],
    genetics: ['/library/genetics-genome-foundations','/library/inheritance','/library/innate-adaptive'],
    biophysics: ['/library/biophysics-membrane-foundations','/library/biophysics-image-formation','/library/biophysics-wave-optics'],
  };
  for (const [subject, routes] of Object.entries(orientations)) assert.deepEqual(beginnerLinks[subject].map(link=>link.href), routes);
  assert.deepEqual(curriculumOrders.anatomy.stages.map(s=>s.links[0].href),['anatomy-foundations','thoracic-cage-landmarks','abdominal-surface-map','pelvic-boundaries','neck-triangles','bones-and-connections'].map(id=>`/library/${id}`));
});

test('curriculum validator rejects duplicate targets, broken routes and pretend planned links', () => {
  const mutate = change => { const data=structuredClone(curriculumOrders); change(data); return data; };
  assert.throws(()=>validateCurriculum(mutate(d=>d.physiology.stages[0].links.push(d.physiology.stages[0].links[0]))),/duplicate target/);
  assert.throws(()=>validateCurriculum(mutate(d=>d.physiology.stages[0].links[0].href='/library/not-a-real-lesson')),/invalid target/);
  assert.throws(()=>validateCurriculum(mutate(d=>d.biochemistry.stages[0].planned=['/library/invented-foundation'])),/fake planned route/);
});

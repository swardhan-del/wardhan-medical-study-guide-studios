import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {qualityAllowsIndexing} from '../src/lib/lesson-quality.ts';
const read=n=>JSON.parse(readFileSync(`src/content/${n}.json`,'utf8'));
const lessons=read('library-lessons').lessons;
const quality=read('lesson-quality').records;
const ids=['fluid-and-membrane-transport','membrane-potentials','biophysics-action-potentials','synaptic-integration','muscle-contraction','connective-tissue','somatosensory-pathways','genetics-genome-foundations'];
const questions=[...lessons.map(l=>({id:`concept-${l.id}`,...l.question})),...read('study-questions').questions,...read('transfer-practice').questions];
const sha=x=>createHash('sha256').update(JSON.stringify(x)).digest('hex');

test('Phase 12 preserves all 356 existing question records and every original lesson route',()=>{
 const fixture=JSON.parse(readFileSync('tests/fixtures/phase-twelve-preservation.json','utf8'));
 assert.equal(Object.keys(fixture.questionHashes).length,356);
 for(const [id,hash] of Object.entries(fixture.questionHashes)) { const q=questions.find(q=>q.id===id);assert(q,id);assert.equal(sha(q),hash,id); }
 assert.deepEqual(lessons.filter(l=>!fixture.lessonIds.includes(l.id)).map(l=>l.id),['somatosensory-pathways']);
 for(const id of fixture.lessonIds)assert(lessons.some(l=>l.id===id),id);
});

test('all eight adaptations have substantial teaching and honest preview gates',()=>{
 const search=read('public-search');
 for(const id of ids){
  const l=lessons.find(l=>l.id===id),q=quality.find(q=>q.lessonId===id);
  assert(l.steps.length>=5,id);assert(l.steps.reduce((n,s)=>n+s.body.split(/\s+/).length,0)>400,id);
  assert(l.objectives.length>=4&&l.workedExample.solution.length>=3&&l.oralExamination.length>=2,id);
  assert.equal(q.contentStatus,'medical-review-pending');assert.equal(q.indexStatus,'noindex-pending-review');assert.equal(q.visualStatus,'rights-review-pending');
  assert.equal(qualityAllowsIndexing(id),false);assert.equal(search[id],undefined);
  assert(q.limitations.some(s=>/independent clinical/i.test(s)));assert(q.sources.length>=2);
  assert(read('lesson-visuals').visuals.some(v=>v.lessonIds.includes(id)),id);
  assert(!read('lesson-review-evidence').records.some(e=>e.lessonId===id&&e.scope==='clinical'),id);
 }
});

test('new questions select the source-checked mechanism and have distinct explained alternatives',()=>{
 const expected={
  'membrane-potentials':['Hyperpolarisation towards −90 mV','About 6.3 mV','About 3.7 mV'],
  'biophysics-action-potentials':['Insufficient available channels for regenerative inward current','A sinoatrial nodal pacemaker cell','Reduced internodal leakage and charging load, with regeneration at nodes'],
  'synaptic-integration':['Calcium-triggered transmitter release','Increased conductance lowers input resistance and shunts the excitatory input','A peak of −54 mV, crossing the stated threshold'],
  'muscle-contraction':['The end-plate potential is graded and local; the muscle action potential is regenerative and propagates','The stimulus-evoked cytosolic calcium rise and resulting force','SERCA pumps cytosolic calcium back into the SR'],
  'connective-tissue':['Dense regular connective tissue','White adipocyte morphology with lipid removed during processing','The original mineral density of the living bone'],
  'genetics-genome-foundations':['The variant is detected, but its causal significance remains unresolved','The assay did not detect that specified variant under its validated conditions','It supplies a coordinate and comparison framework'],
  'somatosensory-pathways':['Right-foot vibration and conscious proprioception','VPL for body; VPM for face','Left-foot pain-temperature input that has already crossed in the spinal cord'],
 };
 for(const [topic,answers] of Object.entries(expected))for(const [i,answer]of answers.entries()){
  const q=questions.find(q=>q.id===`${topic}-phase12-application-${i+1}`);assert(q);assert.equal(q.options[q.answer].text,answer);
  assert.equal(q.options.filter(o=>o.text===answer).length,1);assert(q.options.every(o=>o.explanation.length>50));assert.equal(new Set(q.options.map(o=>o.explanation)).size,q.options.length);
 }
 assert.equal(questions.filter(q=>q.id.includes('-phase12-')).length,21);
 assert.equal(questions.filter(q=>/^fluid-and-membrane-transport-application-[123]$/.test(q.id)).length,3);
});

test('passive-model visual values agree with independent exponential calculations',()=>{
 const visuals=read('lesson-visuals').visuals;
 const charging=visuals.find(v=>v.id==='passive-charging-values');
 for(const [t,,voltage]of charging.rows){const ms=Number.parseFloat(t);assert(Math.abs(Number(voltage.replace('−','-'))-(-70+10*(1-Math.exp(-ms/20))))<0.051);}
 const distance=visuals.find(v=>v.id==='passive-distance-values');
 for(const [x,,voltage]of distance.rows)assert(Math.abs(Number(voltage)-10*Math.exp(-Number(x)))<0.051);
 assert.equal(-70+8+8,-54);assert(-54>-55);
});

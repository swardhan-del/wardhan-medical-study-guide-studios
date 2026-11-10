import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolveLessonStepBodies } from '../scripts/library-schema.mjs';
const read = p => JSON.parse(readFileSync(p,'utf8'));
const course=read('src/content/anatomy-course.json').records;
const lessons=read('src/content/library-lessons.json').lessons;
const collections=read('src/content/study-collections.json').groups;
const print=read('src/content/printable-guides.json').parts;

test('five anatomy volumes expose the agreed counts, stable legacy URLs and synchronized print order',()=>{
 const expected=[18,22,18,30,32];
 assert.equal(new Set(course.map(r=>r.lessonId)).size,120);
 assert.equal(lessons.filter(l=>l.subject!=='anatomy').length,147);
 for(let v=1;v<=5;v++){
  const records=course.filter(r=>r.volume===v), ids=records.map(r=>r.lessonId);
  assert.equal(records.length,expected[v-1]);
  assert.deepEqual(records.map(r=>r.order),Array.from({length:expected[v-1]},(_,i)=>i+1));
  assert.deepEqual(collections.find(g=>g.id===`anatomy-volume-${v}`).lessonIds,ids);
  assert.deepEqual(print.find(g=>g.id===`anatomy-volume-${v}`).lessonIds,ids);
 }
 for(const id of ['thorax-nerve-relations','abdomen-portal-relations','inguinal-canal-relations','pelvis-urinary-route','head-neck-tongue-map','limbs-plexus-and-joints']) assert(course.some(r=>r.lessonId===id));
});
test('every course record has a referenceable manuscript, explained practice and an acyclic preparation route',()=>{
 const questionIds=new Set();
 const files=readdirSync('content/anatomy',{recursive:true}).filter(p=>p.endsWith('.json'));
 assert.equal(files.length,120);
 const resolved=new Map(resolveLessonStepBodies(files.map(file=>read('content/anatomy/'+file).lesson)).map(l=>[l.id,l]));
 for(const file of files){
  const r=read('content/anatomy/'+file), l=resolved.get(r.lesson.id);
  assert.equal(readFileSync('content/anatomy/'+file.replace(/\.json$/,'.md'),'utf8').startsWith('# '),true);
  assert(l.steps.length>=4 && l.objectives.length===(['ocular-motor-nerves','thoracic-development'].includes(l.id)?6:3));
  assert(l.steps.reduce((n,s)=>n+s.body.split(/\s+/).length,0)>=200, l.id);
  assert(r.sourceSections.length && r.identification.prompt.length>40);
  assert.equal(r.practice.length,4);
  for(const q of r.practice){assert(!questionIds.has(q.id));questionIds.add(q.id);assert(q.answer.length>100);}
  const seen=new Set([l.id]);let current=l;
  while(current.prerequisites?.length){const id=current.prerequisites[0];assert(!seen.has(id),'Prerequisite cycle');seen.add(id);current=lessons.find(x=>x.id===id);assert(current);}
 }
 assert.equal(questionIds.size,480);
});

test('shared anatomy bodies preserve every generated lesson and leave authoring records untouched',()=>{
 const files=readdirSync('content/anatomy',{recursive:true}).filter(p=>p.endsWith('.json'));
 const authored=files.map(file=>read('content/anatomy/'+file).lesson);
 const before=JSON.stringify(authored);
 const resolved=resolveLessonStepBodies(authored);
 assert.equal(authored.flatMap(l=>l.steps).filter(s=>s.bodyRef).length,2);
 for(const l of resolved)assert.deepEqual(l,lessons.find(p=>p.id===l.id),l.id);
 assert.equal(JSON.stringify(authored),before);
});

test('shared anatomy references fail closed for stale bodies, missing targets, ambiguity and reference chains',()=>{
 const files=readdirSync('content/anatomy',{recursive:true}).filter(p=>p.endsWith('.json'));
 const original=files.map(file=>read('content/anatomy/'+file).lesson);
 for(const change of ['stale','missing','ambiguous','chain','both']){
  const copy=structuredClone(original);
  const target=copy.find(l=>l.id==='abdominal-regional-reasoning').steps[0];
  const source=copy.find(l=>l.id===target.bodyRef.lessonId);
  const step=source.steps.find(s=>s.title===target.bodyRef.stepTitle);
  if(change==='stale')step.body+=' A changed explanation.';
  if(change==='missing')target.bodyRef.lessonId='absent-lesson';
  if(change==='ambiguous')source.steps.push({...step});
  if(change==='chain'){step.bodyRef={...target.bodyRef};delete step.body;}
  if(change==='both')target.body='An ambiguous second body.';
  assert.throws(()=>resolveLessonStepBodies(copy),/teaching reference|referenced teaching/i,change);
 }
});

test('the ocular-motor manuscript retains the reviewed answers, checklist and research references',()=>{
 const path='content/anatomy/volume-04-head-neck-neuro/15-ocular-motor-nerves';
 const record=read(path+'.json'), manuscript=readFileSync(path+'.md','utf8');
 for(const item of record.lesson.oralExamination){
  assert(manuscript.includes(item.prompt));
  assert(manuscript.includes(item.answer));
 }
 for(const item of record.lesson.summaryChecklist) assert(manuscript.includes(item));
 for(const ref of [record.furtherReading,...record.furtherReading.supportingReferences]) assert(manuscript.includes(ref.url));
 const reference=read('src/content/lesson-references.json')['ocular-motor-nerves'];
 assert.equal(reference.checkedAt,record.furtherReading.checkedAt);
 assert.deepEqual(reference.supportingReferences,record.furtherReading.supportingReferences);
 assert.equal(record.lesson.question.options[record.lesson.question.answer].text,'Abducens VI');
 assert.deepEqual(record.practice.map(q=>q.id),['ocular-motor-nerves-explain','ocular-motor-nerves-relations','ocular-motor-nerves-correction','ocular-motor-nerves-identification']);
});

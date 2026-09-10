import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
const read = p => JSON.parse(readFileSync(p,'utf8'));
const course=read('src/content/anatomy-course.json').records;
const lessons=read('src/content/library-lessons.json').lessons;
const collections=read('src/content/study-collections.json').groups;
const print=read('src/content/printable-guides.json').parts;

test('five anatomy volumes expose the agreed counts, stable legacy URLs and synchronized print order',()=>{
 const expected=[18,22,18,30,32];
 assert.equal(new Set(course.map(r=>r.lessonId)).size,120);
 assert.equal(lessons.filter(l=>l.subject!=='anatomy').length,114);
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
 for(const file of files){
  const r=read('content/anatomy/'+file), l=r.lesson;
  assert.equal(readFileSync('content/anatomy/'+file.replace(/\.json$/,'.md'),'utf8').startsWith('# '),true);
  assert(l.steps.length>=4 && l.objectives.length===3);
  assert(l.steps.reduce((n,s)=>n+s.body.split(/\s+/).length,0)>=200, l.id);
  assert(r.sourceSections.length && r.identification.prompt.length>40);
  assert.equal(r.practice.length,4);
  for(const q of r.practice){assert(!questionIds.has(q.id));questionIds.add(q.id);assert(q.answer.length>100);}
  const seen=new Set([l.id]);let current=l;
  while(current.prerequisites?.length){const id=current.prerequisites[0];assert(!seen.has(id),'Prerequisite cycle');seen.add(id);current=lessons.find(x=>x.id===id);assert(current);}
 }
 assert.equal(questionIds.size,480);
});

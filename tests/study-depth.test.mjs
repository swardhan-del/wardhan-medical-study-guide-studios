import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { validateLibraryLessons } from '../scripts/library-schema.mjs';
import { beginnerSequences } from '../src/content/study-paths.ts';
import { renalLessons } from '../src/content/renal-course.ts';
const read = name => JSON.parse(fs.readFileSync(new URL('../src/content/'+name+'.json',import.meta.url),'utf8'));
const lessons=read('library-lessons'), catalog=read('public-catalog'), sources=read('library-sources');
test('study-map links resolve and unavailable topics cannot masquerade as lessons',()=>{
  const map=read('study-map');
  const urls=new Set([...catalog.records.map(r=>r.href||'/library/'+r.id),...renalLessons.map(l=>'/learn/renal/'+l.slug)]);
  const ids=new Set();
  for(const group of map.groups){
    assert(group.sourceId && group.sourceLabel && group.topics.length);
    for(const topic of group.topics){
      assert(!ids.has(topic.id));ids.add(topic.id);
      assert(topic.title.length>5);
      if(topic.href){assert(urls.has(topic.href),'Unknown map target: '+topic.href);assert.equal(topic.status,'introduction-available');}
      else assert.equal(topic.status,'planned');
    }
  }
  assert(map.groups.find(g=>g.subject==='biostatistics').topics.every(t=>t.status==='planned'&&!t.href));
  assert(!/\/Users\/|dropbox|\.docx|question.bank/i.test(JSON.stringify(map)));
});
test('guided lessons require valid prerequisites and complete worked reasoning',()=>{
  const original=lessons.lessons.find(l=>l.workedExample);
  assert(original);
  for(const corrupt of [
    l=>{l.prerequisites=['missing-lesson'];},
    l=>{l.prerequisites=[l.id];},
    l=>{l.workedExample.solution=['Answer'];},
    l=>{l.objectives=[];},
  ]){
    const changed=structuredClone(lessons);corrupt(changed.lessons.find(l=>l.id===original.id));
    assert.throws(()=>validateLibraryLessons(changed,catalog,sources));
  }
});
test('new guided lessons have explicit references and explanations for every option',()=>{
  const refs=read('lesson-references');
  for(const lesson of lessons.lessons.filter(l=>l.workedExample)){
    assert(refs[lesson.id]);assert(lesson.steps.length>=4);
    assert(lesson.question.options.every(o=>o.reason.length>30));
  }
});

test('beginner paths lead to published pages and agree with subject entry points',()=>{
  const urls=new Set([...catalog.records.map(r=>r.href||'/library/'+r.id),'/start/anatomy',...Object.keys(beginnerSequences).map(s=>'/study/'+s+'/guide')]);
  assert.equal(Object.keys(beginnerSequences).length,7);
  assert.equal(beginnerSequences.anatomy[0].href,'/start/anatomy');
  for(const steps of Object.values(beginnerSequences)){
    assert.equal(steps.length,3);
    for(const step of steps) assert(urls.has(step.href),'Unpublished beginner destination: '+step.href);
  }
});

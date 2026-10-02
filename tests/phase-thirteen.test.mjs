import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createRequire, Module} from 'node:module';
import {fileURLToPath} from 'node:url';
import ts from 'typescript';
import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {containsPrivateReference} from '../src/lib/content-quality.ts';
import {qualityAllowsIndexing} from '../src/lib/lesson-quality.ts';
import {emptyProgress, parseProgress} from '../src/lib/learning-core.ts';
import {optionOrder} from '../src/lib/option-order.ts';
const read=name=>JSON.parse(readFileSync(`src/content/${name}.json`,'utf8'));
const ids=['fluid-and-membrane-transport','membrane-potentials','biophysics-action-potentials','synaptic-integration','muscle-contraction','connective-tissue','somatosensory-pathways','genetics-genome-foundations'];
const lessons=read('library-lessons').lessons, refs=read('lesson-references'), records=read('lesson-quality').records;
const visuals=read('lesson-visuals').visuals, transfer=read('transfer-practice').questions;
const bibliography=id=>[refs[id],...(refs[id].supportingReferences??[])];
const sha=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const fixture=JSON.parse(readFileSync('tests/fixtures/phase-thirteen-preservation.json','utf8'));
const questions=[...lessons.map(l=>({id:`concept-${l.id}`,topic:l.id,href:`/library/${l.id}#concept-check-title`,...l.question})),...read('study-questions').questions,...transfer];
const publicUrl=value=>{
 const url=new URL(value);assert.equal(url.protocol,'https:',value);assert(!url.username&&!url.password,value);
 assert(!containsPrivateReference(value),value);assert(!/^(localhost|127\.|\[|10\.|192\.168\.)/.test(url.hostname),value);
 assert(url.hostname.includes('.')&&!url.hostname.endsWith('.local'),value);
};

test('eight draft bibliographies use public HTTPS and agree with structured source metadata',()=>{
 for(const id of ids){
  const visible=bibliography(id), sources=records.find(q=>q.lessonId===id).sources;
  assert.equal(new Set(visible.map(s=>s.url)).size,visible.length,`${id}: duplicate reference`);
  assert.deepEqual(sources.map(s=>s.url).sort(),visible.map(s=>s.url).sort(),`${id}: source drift`);
  for(const s of visible){assert(s.title.trim().length>10);publicUrl(s.url);}
  for(const s of sources){assert(s.publisherOrAuthor.trim());assert.match(s.accessedAt,/^\d{4}-\d{2}-\d{2}$/);}
 }
 const pangenome='https://www.genome.gov/about-genomics/new-human-pangenome-reference';
 assert(refs['genetics-genome-foundations'].supportingReferences.some(r=>r.url===pangenome&&r.title==='NHGRI: A new human pangenome reference'));
 // The flagship inheritance visual uses sourceIndex=4. Appending sources must not retarget it.
 assert.equal(bibliography('genetics-genome-foundations')[4].url,'https://medlineplus.gov/genetics/understanding/inheritance/riskassessment/');
});

// Compile the real components, as the established visual component tests do.
const require=createRequire(import.meta.url);
const compile=(relative,resolve)=>{
 const filename=fileURLToPath(new URL(relative,import.meta.url));const mod=new Module(filename);mod.filename=filename;
 mod.require=resolve??createRequire(filename);
 mod._compile(ts.transpileModule(readFileSync(filename,'utf8'),{compilerOptions:{jsx:ts.JsxEmit.ReactJSX,module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2022}}).outputText,filename);
 return mod.exports;
};
const studyVisual=compile('../src/components/study-visual.tsx');
const {LessonVisuals}=compile('../src/components/lesson-visuals.tsx',id=>{
 if(id==='./study-visual')return studyVisual;
 if(id==='@/content/lesson-visuals.json')return read('lesson-visuals');
 if(id==='@/content/lesson-references.json')return refs;
 return require(id);
});
test('every draft visual renders captions, text equivalents and its full supporting bibliography',()=>{
 for(const id of ids){
  const placed=visuals.filter(v=>v.lessonIds.includes(id));assert(placed.length,id);
  const html=renderToStaticMarkup(React.createElement(LessonVisuals,{lessonId:id}));
  assert.equal((html.match(/<figcaption>/g)??[]).length,placed.length,id);
  assert.equal((html.match(/<summary>Read a text description<\/summary>/g)??[]).length,placed.length,id);
  for(const v of placed){
   for(const field of ['alt','caption','observe'])assert(v[field].trim().length>40,`${v.id}: ${field}`);
   assert(v.referenceIds.length);assert.equal(new Set(v.referenceIds).size,v.referenceIds.length);
   for(const refId of v.referenceIds){assert(refs[refId],`${v.id}: unknown reference`);for(const ref of bibliography(refId)){publicUrl(ref.url);assert(html.includes(`href="${ref.url}"`),`${v.id}: hidden supporting reference ${ref.url}`);}}
   assert(!containsPrivateReference(JSON.stringify(v)),v.id);
  }
 }
});

test('all draft application alternatives have specific, distinct feedback and valid answer indices',()=>{
 for(const id of ids){
  const applications=transfer.filter(q=>q.topic===id);assert(applications.length>=3,id);
  for(const q of applications){
   assert(Number.isInteger(q.answer)&&q.answer>=0&&q.answer<q.options.length,q.id);
   assert.equal(new Set(q.options.map(o=>o.text)).size,q.options.length,q.id);
   assert.equal(new Set(q.options.map(o=>o.explanation.trim())).size,q.options.length,q.id);
   for(const option of q.options){
    assert(option.explanation.trim().length>50,`${q.id}: feedback too short`);
    assert.notEqual(option.explanation.trim(),option.text.trim(),q.id);
    assert.doesNotMatch(option.explanation,/^(correct|incorrect|wrong|see (above|lesson))[.!\s]*$/i,q.id);
   }
  }
 }
 const summation=transfer.find(q=>q.id==='synaptic-integration-phase12-application-3');
 assert.match(summation.options[summation.answer].explanation,/does not give the actual action-potential peak/);
 assert.match(lessons.find(l=>l.id==='muscle-contraction').steps[2].body,/muscle length is held constant: this is an isometric contraction/);
});

test('all eight drafts retain review gates, no review credentials, and no search eligibility',()=>{
 for(const id of ids){
  const q=records.find(q=>q.lessonId===id);assert(q,id);
  for(const [key,value] of Object.entries({contentStatus:'medical-review-pending',indexStatus:'noindex-pending-review',visualStatus:'rights-review-pending',assessmentStatus:'explanations-complete',accessibilityStatus:'pending',readabilityStatus:'pending'}))assert.equal(q[key],value,`${id}: ${key}`);
  assert.deepEqual(q.reviewEvidenceIds,[]);assert.equal(q.lastReviewedAt,null);assert.equal(q.nextReviewAt,null);
  assert(!read('lesson-review-evidence').records.some(e=>e.lessonId===id),id);
  assert.equal(qualityAllowsIndexing(id),false);assert.equal(read('public-search')[id],undefined);
  for(const targets of Object.values(q.links))for(const target of targets)assert(target!==id&&lessons.some(l=>l.id===target),`${id}: invalid relationship ${target}`);
 }
});

test('Phase 13 preserves all 242 routes, 381 question identities, choice order and progress identifiers from the PR base',()=>{
 assert.equal(fixture.base,'b8783e6819928ab69fefded345e7aa238fd3f88b');
 assert.deepEqual(lessons.map(l=>l.id),fixture.lessonIds);
 assert.equal(Object.keys(fixture.questionIdentityHashes).length,381);assert.equal(questions.length,381);
 for(const q of questions){
  const identity={id:q.id,topic:q.topic,href:q.href,prompt:q.prompt,answer:q.answer,options:q.options.map(o=>o.text),presentationOrder:optionOrder(q.id,q.options.length)};
  assert.equal(sha(identity),fixture.questionIdentityHashes[q.id],q.id);
 }
 const registry=read('learning-registry');
 for(const [key,hash] of Object.entries(fixture.registryHashes))assert.equal(sha(registry[key]),hash,key);
});

test('existing draft answers, notes, completion and review schedules survive the current progress parser',()=>{
 const before=emptyProgress();before.lessons=[...ids];before.oral=[...ids];
 for(const id of ids){
  before.drafts[`oral-${id}`]=`My saved explanation for ${id}.\nKeep the second line.`;
  before.drafts[`${id}-summary-1`]='yes';
  before.journey[id]={read:true,reviewed:true,saved:true,at:1790899200000};
 }
 for(const q of questions.filter(q=>ids.includes(q.topic)))before.answers[q.id]={attempts:3,correct:2,lastCorrect:true,streak:2,dueAt:1791244800000,firstCorrect:false,lastAt:1790985600000,lastChoice:q.answer,assisted:false};
 before.resume={lesson:ids[4],stage:'summary',at:1790985600000};before.visits=['2026-10-01'];before.quizzes=4;
 const registry=read('learning-registry');
 assert.deepEqual(parseProgress(JSON.stringify(before),registry.learningLessonIds,registry.learningQuestionIds,registry.learningDraftIds),before);
});

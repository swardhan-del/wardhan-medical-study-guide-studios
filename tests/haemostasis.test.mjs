import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {qualityAllowsIndexing, qualityLessons} from '../src/lib/lesson-quality.ts';
import {validateQuality} from '../src/lib/content-quality.ts';
import {emptyProgress, parseProgress} from '../src/lib/learning-core.ts';
const read=name=>JSON.parse(readFileSync(`src/content/${name}.json`,'utf8'));
const id='blood-and-haemostasis';
const lesson=read('library-lessons').lessons.find(l=>l.id===id);
const record=read('lesson-quality').records.find(q=>q.lessonId===id);
const questions=read('study-questions').questions.filter(q=>q.topic===id);
const additions=['studio-apply-blood-endothelium-restraint','studio-apply-blood-adhesion-versus-aggregation'];

test('haemostasis uses three aligned public sources and retains explicit pending review and indexing gates',()=>{
 const urls=['https://www.ncbi.nlm.nih.gov/books/NBK534253/','https://www.ncbi.nlm.nih.gov/books/NBK57148/','https://openstax.org/books/anatomy-and-physiology-2e/pages/18-5-hemostasis'];
 const refs=read('lesson-references')[id];
 assert.deepEqual([refs,...refs.supportingReferences].map(s=>s.url),urls);
 assert.equal(refs.checkedAt,'2026-10-03');
 assert.deepEqual(record.sources.map(s=>s.url),urls);
 for(const source of record.sources){assert.equal(source.accessedAt,'2026-10-03');assert(source.publisherOrAuthor);assert.equal(new URL(source.url).protocol,'https:');}
 assert.deepEqual(record.objectives,lesson.objectives);
 for(const [key,value] of Object.entries({contentStatus:'medical-review-pending',indexStatus:'noindex-pending-review',assessmentStatus:'explanations-complete',visualStatus:'rights-review-pending',accessibilityStatus:'pending',readabilityStatus:'pending'}))assert.equal(record[key],value,key);
 assert.deepEqual(record.reviewEvidenceIds,[]);assert.equal(record.lastReviewedAt,null);assert.equal(record.nextReviewAt,null);
 assert(!read('lesson-review-evidence').records.some(e=>e.lessonId===id));
 assert.deepEqual(validateQuality(record,qualityLessons.find(l=>l.id===id),qualityLessons,read('lesson-review-evidence').records,'2026-10-03'),[]);
 assert.equal(qualityAllowsIndexing(id),false);assert.equal(read('public-search')[id],undefined);
 assert.equal(createHash('sha256').update(readFileSync('src/content/lesson-quality-legacy.json')).digest('hex'),'aa8e6b029cd6681f678ea3b95d09a966a761e4f624f7897048000d30527fd5b7');
});

test('haemostasis application keys distinguish endothelial inhibition from receptor-specific adhesion and aggregation',()=>{
 assert.deepEqual(questions.map(q=>q.id),['studio-apply-blood-and-haemostasis',...additions]);
 // Independent expected mechanisms: loss of NO/PGI2 weakens inhibition; blocking
 // alpha-IIb-beta-3–fibrinogen leaves the stipulated GPIb–vWF capture available.
 const expected=[
  [additions[0],0,'Greater susceptibility to activation and aggregation'],
  [additions[1],1,'GPIb-IX-V–vWF capture can continue, while fibrinogen bridging between platelets is reduced'],
 ];
 for(const [qid,answer,text] of expected){
  const q=questions.find(q=>q.id===qid);assert.equal(q.answer,answer);assert.equal(q.options[q.answer].text,text);
  assert.equal(q.href,`/library/${id}#studio-practice`);
  assert.equal(new Set(q.options.map(o=>o.text)).size,q.options.length);
  assert.equal(new Set(q.options.map(o=>o.explanation)).size,q.options.length);
  for(const option of q.options){assert(option.explanation.length>50);assert.notEqual(option.text,option.explanation);}
 }
 assert.match(lesson.steps[0].body,/intact endothelium.*nitric oxide and prostacyclin/);
 assert.match(lesson.steps.map(s=>s.body).join(' '),/factor XIIIa crosslinks/);
 assert.match(lesson.steps.at(-1).body,/plasminogen to plasmin/);
});

test('old haemostasis notes, attempts and schedules survive alongside the two new question IDs',()=>{
 const registry=read('learning-registry'),measurement=read('measurement-registry');
 const saved=emptyProgress();saved.lessons=[id];saved.oral=[id];saved.drafts[`oral-${id}`]='My original saved haemostasis explanation.\nKeep my note.';
 saved.journey[id]={read:true,reviewed:true,saved:true,at:1790985600000};
 for(const [qid,choice] of [[`concept-${id}`,1],['studio-apply-blood-and-haemostasis',0],...additions.map((q,i)=>[q,i])]){
  saved.answers[qid]={attempts:3,correct:2,lastCorrect:true,streak:2,dueAt:1791331200000,firstCorrect:false,lastAt:1791072000000,lastChoice:choice,assisted:false};
  assert(registry.learningQuestionIds.includes(qid));assert.equal(registry.questionLessons[qid],id);assert(measurement.quizIds.includes(qid));
 }
 saved.resume={lesson:id,stage:'summary',at:1791072000000};
 assert.deepEqual(parseProgress(JSON.stringify(saved),registry.learningLessonIds,registry.learningQuestionIds,registry.learningDraftIds),saved);
});

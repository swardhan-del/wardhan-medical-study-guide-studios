import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, realpathSync, symlinkSync, rmSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { planLessons, privateOutput, depthDimensions } from '../scripts/question-media-plan.mjs';

const lesson = {id:'existing-id',title:'Existing title',subject:'genetics',href:'/library/existing-id',objectives:['Explain'],links:{prerequisite:[]},content:{lesson:{steps:[{title:'A concept'}]}},questions:[{id:'unchanged-question',prompt:'Which?',answer:1,options:[{text:'A',explanation:'A feedback'},{text:'B',explanation:'B feedback'}]}],prompts:[{id:'unchanged-oral',prompt:'Explain?',explanation:'Model response'}]};

test('media plans preserve keys, answer order, model responses and unapproved status',()=>{
  const original=structuredClone(lesson); const [p]=planLessons([lesson]);
  assert.deepEqual(lesson,original); assert.equal(p.questions[0].id,'unchanged-question');
  assert.equal(p.questions[0].answerIndex,1); assert.equal(p.questions[0].answer,'B');
  assert.equal(p.questions[1].answer,'Model response'); assert.equal(p.gates.scientific,'pending');
  assert.deepEqual(Object.keys(p.concepts[0].depth),depthDimensions);
  assert(Object.values(p.concepts[0].depth).every(x=>x==='not-audited'));
  assert.notEqual(p.lessonFingerprint,planLessons([{...lesson,title:'Changed'}])[0].lessonFingerprint);
  const [immune] = planLessons([lesson], {'existing-id':'immunology'});
  assert.equal(immune.subject,'immunology');assert.equal(immune.learningSubject,'genetics');
});
test('missing option feedback, invalid keys and duplicated lessons cannot produce a plan',()=>{
  const bad=structuredClone(lesson);bad.questions[0].options[0].explanation='';
  assert.throws(()=>planLessons([bad]),/feedback/);
  bad.questions[0].answer=9;assert.throws(()=>planLessons([bad]),/Incomplete/);
  assert.throws(()=>planLessons([lesson,lesson]),/Duplicate/);
});
test('output cannot enter public, source or a symlink escaping the private area',()=>{
  const root=mkdtempSync(path.join(os.tmpdir(),'wardhan-media-')); const other=mkdtempSync(path.join(os.tmpdir(),'wardhan-outside-'));
  try {
    assert.throws(()=>privateOutput(root,'public/media'),/private/);
    assert.throws(()=>privateOutput(root,'../escaped'),/private/);
    assert.equal(privateOutput(root,'.private/ok'),path.join(realpathSync(root),'.private/ok'));
    mkdirSync(path.join(root,'output'));symlinkSync(other,path.join(root,'output/link'));
    assert.throws(()=>privateOutput(root,'output/link'),/symlink/);
    assert.throws(()=>privateOutput(root,'output/link/new-folder'),/symlink/);
    assert.equal(existsSync(path.join(other,'new-folder')),false);
  } finally {rmSync(root,{recursive:true,force:true});rmSync(other,{recursive:true,force:true});}
});

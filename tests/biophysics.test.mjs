import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { thinLens, transmission, charging, diffusionDistance, relativeFlow, echoDepthCm } from "../src/lib/biophysics-models.ts";
const read = name => JSON.parse(readFileSync(new URL("../src/content/"+name+".json", import.meta.url),"utf8"));
const close = (a,b) => assert(Math.abs(a-b)<1e-9, a+" differs from "+b);
test("biophysics models reproduce independent worked cases and limiting behaviour", () => {
  const real=thinLens(10,30); close(real.imageCm,15); close(real.magnification,-0.5); assert.equal(real.kind,"real");
  const virtual=thinLens(10,5); close(virtual.imageCm,-10); close(virtual.magnification,2); assert.equal(virtual.kind,"virtual");
  assert.equal(thinLens(10,10).kind,"parallel"); assert.equal(thinLens(10,10).imageCm,null);
  close(transmission(0),1); close(transmission(4),1/16);
  close(charging(0),0); close(charging(1),0.6321205588285577);
  close(diffusionDistance(200,1),20); close(diffusionDistance(200,4),40);
  close(relativeFlow(0.5),1/16); close(relativeFlow(2),16);
  close(echoDepthCm(100),7.7); close(echoDepthCm(40),3.08);
  assert(charging(5)<1 && charging(5)>charging(1));
});
test("invalid physical inputs do not produce plausible-looking model results", () => {
  for(const bad of [NaN,Infinity,-1]) {
    assert.throws(()=>transmission(bad),RangeError);
    assert.throws(()=>charging(bad),RangeError);
    assert.throws(()=>echoDepthCm(bad),RangeError);
    assert.throws(()=>diffusionDistance(200,bad),RangeError);
  }
  assert.throws(()=>thinLens(0,20),RangeError);
  assert.throws(()=>relativeFlow(0),RangeError);
  assert.throws(()=>diffusionDistance(0,1),RangeError);
});
test("the biophysics course is reachable, sequenced and contains independent explained practice", () => {
  const coverage=read("biophysics-coverage"), lessons=read("library-lessons").lessons.filter(l=>l.subject==="biophysics");
  const questions=read("study-questions").questions.filter(q=>q.subject==="biophysics");
  assert.equal(coverage.lessons.filter(l=>l.track==="theory").length,36);
  assert.equal(coverage.lessons.filter(l=>l.track==="practical").length,14);
  assert.equal(lessons.length,50); assert.equal(questions.length,50);
  assert.deepEqual(new Set(coverage.lessons.map(l=>l.lessonId)),new Set(lessons.map(l=>l.id)));
  for(const l of lessons) {
    const application=questions.filter(q=>q.topic===l.id);
    assert.equal(application.length,1); assert.notEqual(application[0].prompt,l.question.prompt);
    assert(l.steps.length>=4);
  }
  for(const track of ["theory","practical"]) {
    const nums=coverage.lessons.filter(l=>l.track===track).map(l=>l.topic);
    assert.deepEqual(nums,Array.from({length:nums.length},(_,i)=>i+1));
  }
  const publicData=JSON.stringify([lessons,coverage,questions]);
  assert.doesNotMatch(publicData,/drive\.google\.com|sediment:|\/Users\//);
});

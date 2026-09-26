import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import registry from "../src/content/learning-registry.json" with {type:"json"};
import {learningLessonIds,learningQuestionIds,learningDraftIds} from "../src/content/practice-registry.ts";
import {parseProgress,emptyProgress,gradeAttempt} from "../src/lib/learning-core.ts";

test("the compact progress registry preserves every existing lesson, question and draft identifier",()=>{
  assert.deepEqual(registry,{learningLessonIds,learningQuestionIds,learningDraftIds});
  for(const values of Object.values(registry))assert(values.every(id=>typeof id==="string"));
  for(const values of Object.values(registry))assert(values.every(id=>! /\s/.test(id)&&id.length<150));
});
test("existing saved answers, oral notes and checklist records survive the compact-registry boundary",()=>{
  const lesson=learningLessonIds[0],question="concept-anatomy-foundations",draft="oral-anatomy-foundations";
  const stored={...emptyProgress(),lessons:[lesson],answers:{[question]:gradeAttempt(undefined,true,Date.now(),0)},drafts:{[draft]:"My private explanation","anatomy-foundations-summary-1":"yes"}};
  const parsed=parseProgress(JSON.stringify(stored),registry.learningLessonIds,registry.learningQuestionIds,registry.learningDraftIds);
  assert(parsed.lessons.includes(lesson));assert(parsed.answers[question]);assert.equal(parsed.drafts[draft],"My private explanation");assert.equal(parsed.drafts["anatomy-foundations-summary-1"],"yes");
});
test("progress storage does not import teaching content and pre-launch analytics cannot auto-activate in production",()=>{
  const store=readFileSync(new URL("../src/components/learning-store.ts",import.meta.url),"utf8");
  assert(!store.includes("practice-registry"));assert(store.includes("learning-registry.json"));
  const config=readFileSync(new URL("../next.config.ts",import.meta.url),"utf8");
  assert.match(config,/NEXT_PUBLIC_LEARNING_ANALYTICS: "0"/);
});

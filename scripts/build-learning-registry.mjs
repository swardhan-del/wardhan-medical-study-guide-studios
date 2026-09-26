import { readFileSync, writeFileSync } from "node:fs";
import { learningLessonIds, learningQuestionIds, learningDraftIds } from "../src/content/practice-registry.ts";
const path = new URL("../src/content/learning-registry.json", import.meta.url);
const value = JSON.stringify({learningLessonIds,learningQuestionIds,learningDraftIds},null,2)+"\n";
if(process.argv.includes("--check")) {
  if(readFileSync(path,"utf8")!==value)throw new Error("Learning registry is stale: run node scripts/build-learning-registry.mjs.");
} else writeFileSync(path,value);
console.log("Progress identifiers verified without shipping lesson text or answer explanations.");

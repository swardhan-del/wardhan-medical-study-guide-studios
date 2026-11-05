import test from "node:test";
import assert from "node:assert/strict";
import { checkHistologyName, histologyNames } from "../src/lib/histology-short-answer.ts";
import { readFileSync } from "node:fs";

test("short-name feedback accepts declared synonyms without accepting negation or an essay", () => {
  for (const rule of histologyNames) {
    for (const name of rule.accepted) {
      assert.equal(checkHistologyName(`  ${name.toUpperCase()}. `, rule).state, "matched");
      for (const sentence of [`not ${name}`, `${name} is wrong`, `It is not ${name}; it is another structure`, `${name} or something else`]) {
        assert.equal(checkHistologyName(sentence, rule).state, "unassessed", sentence);
      }
    }
    for (const name of rule.alternatives) assert.equal(checkHistologyName(name, rule).state, "contrast");
    assert.equal(checkHistologyName("  ", rule).state, "empty");
    assert.equal(checkHistologyName("<script>alert(1)</script>", rule).state, "unassessed");
    assert.equal(checkHistologyName("a correct explanation with unfamiliar wording", rule).state, "unassessed");
  }
});

test("section citations stay aligned when either lesson is edited",()=>{
  const refs=JSON.parse(readFileSync("src/content/histology-depth-references.json","utf8"));
  const lessons=JSON.parse(readFileSync("src/content/library-lessons.json","utf8")).lessons;
  for(const [id,sections] of Object.entries(refs)) {
    const lesson=lessons.find(l=>l.id===id);assert(lesson);
    assert.deepEqual(sections.map(s=>s.title),lesson.steps.map(s=>s.title));
    for(const section of sections) {assert(section.references.length); for(const ref of section.references) {assert(ref.title);assert.equal(new URL(ref.url).protocol,"https:");}}
  }
});

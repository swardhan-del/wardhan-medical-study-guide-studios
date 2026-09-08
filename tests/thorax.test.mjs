import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const content = JSON.parse(readFileSync(new URL("../src/content/thorax-practice.json", import.meta.url), "utf8"));

test("thorax practice has complete answer rationales and resolvable references", () => {
  const sources = new Set(content.sources.map((source) => source.id));
  const ids = new Set();
  assert.equal(content.questions.length, 12);
  for (const question of content.questions) {
    assert.ok(!ids.has(question.id)); ids.add(question.id);
    assert.ok(question.prompt && question.options.length > 1);
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.options.length);
    assert.equal(new Set(question.options).size, question.options.length);
    assert.equal(question.explanations.length, question.options.length);
    assert.ok(question.explanations.every((explanation) => explanation.length > 30));
    assert.ok(sources.has(question.source));
  }
  for (const source of content.sources) {
    assert.ok(source.url === "#source-volume-i" || new URL(source.url).protocol === "https:");
  }
  assert.equal(content.structures.length, 6);
  for (const structure of content.structures) {
    assert.ok(structure.x > 5 && structure.x < 95 && structure.y > 5 && structure.y < 95);
    assert.ok(structure.description && structure.connection && sources.has(structure.source));
  }
  assert.equal(content.oral.length, 4);
  assert.ok(content.oral.every((prompt) => prompt.answer && prompt.checklist.length === 3));
});

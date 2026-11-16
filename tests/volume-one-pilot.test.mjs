import test from "node:test";
import assert from "node:assert/strict";
import course from "../src/content/anatomy-course.json" with { type: "json" };
import registry from "../src/content/learning-registry.json" with { type: "json" };
import { volumeOnePilot } from "../src/content/anatomy-volume-one-pilot.ts";

test("Volume I lessons each have a sourced diagram and five distinct, explained MCQs", () => {
  const volume = course.records.filter(lesson => lesson.volume === 1);
  assert.deepEqual(volumeOnePilot.map(lesson => lesson.id), volume.map(lesson => lesson.lessonId));
  const ids = new Set();
  for (const { id, diagram, items } of volumeOnePilot) {
    assert.match(diagram.source, /^https:\/\/(www\.ncbi\.nlm\.nih\.gov\/books\/|openstax\.org\/books\/)/);
    const names = diagram.nodes.map(([name]) => name);
    assert.ok(names.length >= 3 && new Set(names).size === names.length, id);
    assert.ok(diagram.edges.every(([a, b]) => diagram.nodes[a] && diagram.nodes[b] && a !== b), id);
    assert.equal(items.length, 5, id);
    assert.equal(new Set(items.map(item => item.prompt)).size, 5, id);
    for (const item of items) {
      assert.ok(!ids.has(item.id), item.id);
      ids.add(item.id);
      assert.ok(item.options[item.answer], item.id);
      assert.equal(new Set(item.options.map(option => option.text)).size, 3, item.id);
      assert.equal(new Set(item.options.map(option => option.explanation)).size, 3, item.id);
      assert.ok(item.options.every(option => option.explanation.length > 15), item.id);
      assert.equal(registry.questionLessons[item.id], id);
    }
  }
});

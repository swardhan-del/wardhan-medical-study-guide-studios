import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { beginnerSequences, studyPaths } from "../src/content/study-paths.ts";
import { validateLibraryLessons } from "../scripts/library-schema.mjs";

const read = name => JSON.parse(readFileSync(new URL(`../src/content/${name}.json`, import.meta.url), "utf8"));
const id = "histology-foundations-tissues";
const lessons = read("library-lessons");
const lesson = lessons.lessons.find(l => l.id === id);
const retrieval = read("study-questions").questions.filter(q => q.topic === id);
const transfer = read("transfer-practice").questions.filter(q => q.topic === id);

test("histology foundations is a released, searchable first lesson in every relevant entry point", () => {
  assert.equal(lesson.title, "Histology Foundations: The Four Basic Tissues");
  assert.equal(lesson.subject, "histology");
  assert.doesNotThrow(() => validateLibraryLessons(lessons, read("public-catalog"), read("library-sources")));
  assert.deepEqual(lesson.prerequisites, []);
  assert.equal(studyPaths.histology.start, id);
  assert.equal(beginnerSequences.histology[0].href, `/library/${id}`);
  assert.equal(read("study-collections").groups.find(g => g.id === "study-histology").lessonIds[0], id);
  assert.equal(read("histology-areas").areas.find(a => a.id === "foundations").lessons[0], id);
  assert.equal(read("printable-guides").parts.flatMap(p => p.lessonIds).filter(value => value === id).length, 1);
  assert.equal(read("public-release").resourceIds.filter(value => value === id).length, 1);
  const nodes = read("library-taxonomy").nodes;
  assert.equal(nodes.find(n => n.id === `topic-${id}`).parentId, "histology-basic-tissues");
  assert(nodes.find(n => n.id === "histology-i-histology-basic-tissues").resources.includes(id));
  assert(read("study-map").groups.some(g => g.subject === "histology" && g.topics.some(t => t.href === `/library/${id}`)));
  const indexed = read("public-search")[id];
  for (const query of ["epithelial", "connective", "muscle", "nervous", "Schwann", "Identification clues", "Worked Identification Example"])
    assert(indexed.includes(query), `Missing indexed content: ${query}`);
});

test("the four tissue explanations include recognition, function, location, medical relevance and visual tasks", () => {
  assert(lesson.objectives.length >= 4);
  for (const tissue of ["Epithelial", "Connective", "Muscle", "Nervous"]) {
    const step = lesson.steps.find(s => s.title.startsWith(`${tissue} tissue:`));
    assert(step, `Missing ${tissue} explanation`);
    for (const label of ["Defining characteristics:", "Functions and representative locations:", "Identification clues:", "Medical relevance:"])
      assert(step.body.includes(label), `${tissue}: ${label}`);
  }
  assert(lesson.workedExample.solution.length >= 4);
  assert.match(lesson.workedExample.solution.at(-1), /exact organ is not/);
  assert.equal(lesson.oralExamination.length, 3);
  assert.equal(lesson.summaryChecklist.length, 7);
  assert.match(lesson.recall.answer, /colour alone cannot identify/);
});

test("retrieval and transfer keys retain the reviewed tissue distinctions with explained distractors", () => {
  assert.equal(retrieval.length + 1, 6);
  assert.equal(transfer.length, 3);
  assert.equal(lesson.question.options[lesson.question.answer].text, "Epithelial, connective, muscle and nervous");
  const correct = Object.fromEntries([...retrieval, ...transfer].map(q => [q.id, q.options[q.answer].text]));
  const expected = {
    "retrieval-2": "Closely joined cells with apical–basal polarity and little intervening matrix",
    "retrieval-3": "Resist and transmit tensile loading mainly along the bundle axis",
    "retrieval-4": "Long striated fibres with multiple peripheral nuclei",
    "retrieval-5": "Schwann cell — peripheral nerve",
    "retrieval-6": "Connective tissue — loose supporting tissue beneath an epithelium",
    "transfer-1": "The continuous protective barrier is disrupted",
    "transfer-2": "Dense regular connective tissue, because matrix dominates over cells",
    "transfer-3": "Conduction may slow or fail, and the affected myelin was formed by Schwann cells",
  };
  for (const [suffix, answer] of Object.entries(expected)) assert.equal(correct[`${id}-${suffix}`], answer);
  for (const q of [...retrieval, ...transfer]) {
    assert.equal(q.subject, "histology");
    assert.equal(q.href.split("#")[0], `/library/${id}`);
    assert(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length);
    assert(q.options.every(o => o.explanation.length > 30));
    assert.equal(new Set(q.options.map(o => o.text)).size, q.options.length);
  }
  assert(retrieval.every(q => q.heading === "Knowledge Check"));
});

test("the foundations citation reuses existing approved sources and reuses only the two previously approved micrographs", () => {
  const refs = read("lesson-references");
  assert.equal(lesson.source, "histology");
  assert.equal(refs[id].url, refs.epithelia.url);
  assert.deepEqual(refs[id].supportingIds, ["connective-tissue", "muscle-histology", "myelin-and-glial-cells"]);
  for (const supportingId of refs[id].supportingIds) {
    assert(lessons.lessons.some(l => l.id === supportingId));
    assert.equal(new URL(refs[supportingId].url).protocol, "https:");
  }
  assert.deepEqual(read("public-figures").figures.filter(f => f.resourceIds.includes(id)).map(f => f.id), ["cuboidal-section", "squamous-section"]);
  assert(!read("public-videos").records.some(v => v.lessonIds.includes(id)));
  assert(!read("study-audio").records.some(a => a.lessonId === id));
});

 test("professional terminology and optional assessment fields are validated", () => {
  assert(!/retrieval|oral recall|future micrograph|Visual-learning prompt/i.test(JSON.stringify(lesson)));
  for (const q of retrieval) assert(!/retrieval/i.test(q.heading + q.prompt));
  for (const field of ["oralExamination", "summaryChecklist"]) {
    const invalid = structuredClone(lessons);
    invalid.lessons.find(l => l.id === id)[field] = [];
    assert.throws(() => validateLibraryLessons(invalid, read("public-catalog"), read("library-sources")), /Incomplete/);
  }
});

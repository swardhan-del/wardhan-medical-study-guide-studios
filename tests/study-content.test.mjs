import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
test("each concept introduction has a public topic reference", () => {
  const lessons = read("../src/content/library-lessons.json").lessons;
  const refs = read("../src/content/lesson-references.json");
  assert.equal(Object.keys(refs).length, lessons.length);
  for (const lesson of lessons) { assert(refs[lesson.id]?.title.length > 10); assert.equal(new URL(refs[lesson.id].url).protocol, "https:"); }
  assert.match(refs["nitrogen-metabolism"].url, /nitrogenous-wastes/);
  assert.doesNotMatch(refs["nitrogen-metabolism"].url, /NBK92001/);
});
test("public micrographs match the recorded original files and license provenance", () => {
  const images = read("../src/content/visual-sources.json");
  assert.equal(images.length, 2);
  for (const image of images) {
    assert.equal(image.license, "CC0 1.0");
    assert.equal(new URL(image.sourceUrl).host, "commons.wikimedia.org");
    assert.equal(new URL(image.originalUrl).host, "upload.wikimedia.org");
    const bytes = readFileSync(new URL("../public" + image.path, import.meta.url));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), image.sha256);
    assert.equal(bytes[0], 255); assert.equal(bytes[1], 216);
  }
});
test("new transfer questions have unique ids, valid answers and explained alternatives", () => {
  const qs = read("../src/content/transfer-practice.json").questions;
  assert.ok(qs.length >= 9);
  assert.ok(qs.some(q => q.id === "plexus-route-application"));
  assert.ok(qs.some(q => q.id === "plexus-landmark-application"));
  assert.equal(new Set(qs.map((q) => q.id)).size, qs.length);
  for (const q of qs) { assert(q.options[q.answer]); assert(q.options.every((o) => o.explanation.length > 30)); assert(q.href.startsWith("/")); }
});

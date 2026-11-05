import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const read = p => JSON.parse(readFileSync(p, 'utf8'));
const parts = read('src/content/printable-guides.json').parts;
const lessons = read('src/content/library-lessons.json').lessons;
test('printable parts cover every released lesson exactly once in its own subject', () => {
  assert.equal(new Set(parts.map(p => p.id)).size, parts.length);
  assert.deepEqual(parts.flatMap(p => p.lessonIds).sort(), lessons.map(l => l.id).sort());
  for (const part of parts) for (const id of part.lessonIds) assert.equal(lessons.find(l => l.id === id)?.subject, part.subject);
  assert.equal(parts.filter(p => p.subject === 'histology').length, 20);
  assert.equal(parts.filter(p => p.subject === 'biochemistry').length, 15);
  assert(parts.filter(p => !p.lessonIds.length).every(p => p.coverage.includes('does not yet')));
});

test('related learning reaches released lessons without duplicating printable chapters', () => {
 for (const part of parts) {
  const related = part.relatedLessonIds ?? [];
  assert.equal(new Set(related).size, related.length);
  for (const id of related) { assert(lessons.some(l => l.id === id)); assert(!part.lessonIds.includes(id)); }
 }
 assert.deepEqual(parts.find(p => p.id === "histology-part-07").relatedLessonIds,["thoracic-development"]);
 assert.deepEqual(parts.find(p => p.id === "histology-part-07").lessonIds,["respiratory-histology"]);
});

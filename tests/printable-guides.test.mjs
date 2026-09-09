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
  assert.equal(parts.filter(p => p.subject === 'biochemistry').length, 14);
  assert(parts.filter(p => !p.lessonIds.length).every(p => p.coverage.includes('does not yet')));
});

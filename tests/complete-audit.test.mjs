import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { optionOrder } from '../src/lib/option-order.ts';
import { matchesSearchText } from '../src/lib/catalog-filter.ts';
const read = name => JSON.parse(readFileSync(new URL(`../src/content/${name}.json`, import.meta.url), 'utf8'));
test('beginner question phrasing finds the concept without substring false positives', () => {
  for (const query of ['osmosis', 'what is osmosis?', 'please explain osmosis', 'how does osmosis work?']) assert.ok(matchesSearchText('Water transport by osmosis', query), query);
  assert.ok(matchesSearchText('Action potential and membrane', 'what is an action potential?'));
  assert.equal(matchesSearchText('Molecular interaction', 'action'), false);
  assert.ok(matchesSearchText('glomerular filtration rate', 'GFR'));
});
test('question presentation is stable and varied while preserving original answer values', () => {
  const lessons = read('library-lessons').lessons.filter(l => l.subject === 'biophysics');
  const positions = lessons.map(l => {
    const order = optionOrder('concept-' + l.id, l.question.options.length);
    assert.deepEqual([...order].sort(), [0, 1, 2]);
    assert.deepEqual(order, optionOrder('concept-' + l.id, l.question.options.length));
    return order.indexOf(l.question.answer);
  });
  assert.equal(new Set(positions).size, 3);
  assert.ok(positions.filter((n, i) => n !== i % 3).length > 20);
});
test('map includes every released biophysics lesson and Histology II includes supporting-cell lessons', () => {
  const lessons = read('library-lessons').lessons.filter(l => l.subject === 'biophysics');
  const topics = read('study-map').groups.filter(g => g.subject === 'biophysics').flatMap(g => g.topics);
  assert.equal(topics.length, 50);
  for (const l of lessons) assert.ok(topics.some(t => t.href === '/library/' + l.id));
  const ids = read('library-taxonomy').nodes.filter(n => n.subject === 'histology-ii').flatMap(n => n.resources);
  for (const id of ['neurulation', 'myelin-and-glial-cells', 'brain-and-csf-barriers']) assert.ok(ids.includes(id));
});

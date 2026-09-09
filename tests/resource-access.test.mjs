import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { matchesCatalogQuery, suggestQuery, catalogSearchText } from '../src/lib/catalog-filter.ts';
import { resourceHref } from '../src/lib/catalog-types.ts';
const read = name => JSON.parse(readFileSync(new URL(`../src/content/${name}.json`, import.meta.url), 'utf8'));
const index = read('public-search');
const records = read('public-catalog').records.map(r => ({ ...r, searchText: index[r.id] }));
test('published explanations and figures are searchable in every teaching collection', () => {
  const lessons = read('library-lessons').lessons;
  for (const subject of new Set(lessons.map(l => l.subject))) {
    const lesson = lessons.find(l => l.subject === subject);
    const phrase = lesson.steps[0].body.split(' ').slice(0, 6).join(' ');
    assert.ok(matchesCatalogQuery(records.find(r => r.id === lesson.id), phrase), `${subject}: ${phrase}`);
  }
  assert.ok(matchesCatalogQuery(records.find(r => r.id === 'limbs-plexus-and-joints'), 'axillary artery'));
  assert.ok(matchesCatalogQuery(records.find(r => r.id === 'renal-filtration-and-clearance'), 'GFR'));
  assert.equal(suggestQuery(records.map(r => catalogSearchText(r)), 'brachal plexus'), 'brachial plexus');
  assert.equal(suggestQuery(records.map(r => catalogSearchText(r)), 'zzzzzzzzunknown'), null);
  assert.equal(Object.keys(index).length, records.length);
  assert.doesNotMatch(JSON.stringify(index), /\/Users\/|original_dropbox_path|destination_dropbox_path|dropboxusercontent/);
});
test('all 19 web and activity wrappers link directly; PDF and private detail pages remain available', () => {
  const direct = records.filter(r => r.href && ['WEB', 'ACTIVITY'].includes(r.format));
  assert.equal(direct.length, 19);
  for (const r of direct) {
    assert.equal(resourceHref(r), r.href);
    assert.equal(resourceHref({ ...r, status: 'private-review' }, '/review'), '/review/' + r.id);
  }
  assert.equal(resourceHref(records.find(r => r.id === 'renal-revision-sheet')), '/library/renal-revision-sheet');
});
test('all twelve subject entries have explicit, internally consistent public availability', () => {
  const { subjects, nodes } = read('library-taxonomy');
  assert.equal(subjects.length, 12);
  for (const subject of subjects) {
    const ids = new Set(nodes.filter(n => n.subject === subject.id).flatMap(n => n.resources));
    for (const id of ids) assert.ok(records.some(r => r.id === id), `${subject.id}: ${id}`);
    assert.equal(ids.size === 0, ['microbiology', 'biostatistics'].includes(subject.id), subject.id);
  }
  const immunity = nodes.filter(n => n.subject === 'immunology').flatMap(n => n.resources);
  assert.ok(immunity.includes('antigen-presentation'));
  assert.ok(!immunity.includes('meiosis'));
});

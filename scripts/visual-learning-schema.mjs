import assert from 'node:assert/strict';
export function validateVisualLearning({ visuals, lessons, references, figures, audit, catalog }) {
  const ids = new Set(lessons.map(l => l.id));
  assert.equal(new Set(visuals.map(v => v.id)).size, visuals.length, 'Duplicate visual ID');
  for (const v of visuals) {
    for (const key of ['id','title','alt','caption','observe']) assert(typeof v[key] === 'string' && v[key].trim().length > 3, `${v.id}: missing ${key}`);
    assert(v.lessonIds.length && new Set(v.lessonIds).size === v.lessonIds.length, `${v.id}: lesson placements required`);
    assert(v.lessonIds.every(id => ids.has(id)), `${v.id}: unknown lesson`);
    assert(v.referenceIds.length && v.referenceIds.every(id => references[id]?.url?.startsWith('https://')), `${v.id}: missing source`);
    assert(['comparison','flow'].includes(v.kind), `${v.id}: unknown visual kind`);
    if (v.kind === 'comparison') {
      assert(v.headers?.length === 3 && new Set(v.headers).size === 3 && v.rows?.length >= 2, `${v.id}: invalid comparison`);
      assert(v.rows.every(row => row.length === v.headers.length && row.every(cell => typeof cell === 'string' && cell.trim())), `${v.id}: incomplete comparison row`);
      assert(!v.steps, `${v.id}: ambiguous visual kind`);
    } else {
      assert(v.steps?.length >= 2 && v.steps.every(step => typeof step === 'string' && step.length > 5), `${v.id}: incomplete flow`);
      assert.equal(new Set(v.steps).size, v.steps.length, `${v.id}: repeated flow step`);
      assert(!v.rows, `${v.id}: ambiguous visual kind`);
    }
  }
  for (const f of figures) {
    for (const key of ['title','alt','caption','observe','rights','sourceUrl','publicApproval','evidence']) assert(typeof f[key] === 'string' && f[key].trim(), `${f.id}: missing ${key}`);
  }
  assert.equal(new Set(audit.map(r => r.id)).size, audit.length, 'Duplicate audit record');
  assert.deepEqual(audit.map(r=>r.id).sort(), catalog.map(r=>r.id).sort(), 'Audit must cover every public resource');
  for (const r of audit) {
    assert(r.rationale?.length > 40 && r.route?.startsWith('/'), `${r.id}: audit needs a route and reason`);
    assert(['new-comparison-or-flow','standardise-or-reuse','retain-drawing-practice','retain-text-practice','retain-nonvisual-resource'].includes(r.action), `${r.id}: invalid audit action`);
    assert.deepEqual([...r.visualIds].sort(), visuals.filter(v=>v.lessonIds.includes(r.id)).map(v=>v.id).sort(), `${r.id}: stale visual audit`);
    assert.deepEqual([...r.figureIds].sort(), figures.filter(f=>f.resourceIds.includes(r.id)).map(f=>f.id).sort(), `${r.id}: stale figure audit`);
  }
}

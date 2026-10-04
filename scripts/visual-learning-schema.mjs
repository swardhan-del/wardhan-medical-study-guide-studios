import assert from 'node:assert/strict';
import { originalDiagramIds } from '../src/lib/original-diagram-models.ts';
export function validateVisualLearning({ visuals, lessons, references, figures, audit, catalog }) {
  const ids = new Set(lessons.map(l => l.id));
  assert.equal(new Set(visuals.map(v => v.id)).size, visuals.length, 'Duplicate visual ID');
  for (const v of visuals) {
    for (const key of ['id','title','alt','caption','observe']) assert(typeof v[key] === 'string' && v[key].trim().length > 3, `${v.id}: missing ${key}`);
    assert(v.lessonIds.length && new Set(v.lessonIds).size === v.lessonIds.length, `${v.id}: lesson placements required`);
    assert(v.lessonIds.every(id => ids.has(id)), `${v.id}: unknown lesson`);
    assert(v.referenceIds.length && v.referenceIds.every(id => references[id]?.url?.startsWith('https://')), `${v.id}: missing source`);
    assert(['comparison','flow','svg'].includes(v.kind), `${v.id}: unknown visual kind`);
    if (v.kind === 'comparison') {
      assert(v.headers?.length === 3 && new Set(v.headers).size === 3 && v.rows?.length >= 2, `${v.id}: invalid comparison`);
      assert(v.rows.every(row => row.length === v.headers.length && row.every(cell => typeof cell === 'string' && cell.trim())), `${v.id}: incomplete comparison row`);
      assert(!v.steps, `${v.id}: ambiguous visual kind`);
    } else if (v.kind === 'flow') {
      assert(v.steps?.length >= 2 && v.steps.every(step => typeof step === 'string' && step.length > 5), `${v.id}: incomplete flow`);
      assert.equal(new Set(v.steps).size, v.steps.length, `${v.id}: repeated flow step`);
      assert(!v.rows, `${v.id}: ambiguous visual kind`);
    } else {
      assert(originalDiagramIds.includes(v.id), `${v.id}: unknown original SVG renderer`);
      assert(!v.rows && !v.steps, `${v.id}: ambiguous SVG kind`);
      for (const field of ['explanation','credit','sourceCheckedAt']) assert(typeof v[field] === 'string' && v[field].trim(), `${v.id}: missing ${field}`);
      assert(v.authorship === 'original-svg-code', `${v.id}: source artwork is not allowed`);
      assert(/^\d{4}-\d{2}-\d{2}$/.test(v.sourceCheckedAt) && !Number.isNaN(Date.parse(v.sourceCheckedAt)), `${v.id}: invalid source date`);
      const bibliography = v.referenceIds.flatMap(id => [references[id], ...(references[id]?.supportingReferences ?? [])]);
      assert(v.sourceUrls?.length && new Set(v.sourceUrls).size === v.sourceUrls.length && v.sourceUrls.every(url => url.startsWith('https://') && bibliography.some(ref => ref.url === url)), `${v.id}: unmapped scientific source`);
      assert(v.scientificStatus === 'medical-review-pending' && v.editorialStatus === 'pending' && v.accessibilityStatus === 'pending' && Array.isArray(v.reviewEvidenceIds) && v.reviewEvidenceIds.length === 0, `${v.id}: original authorship is not review approval`);
      assert(v.knowledgeCheck?.id === `diagram-check-${v.id}` && v.knowledgeCheck.prompt?.length > 20 && v.knowledgeCheck.explanation?.length > 40, `${v.id}: explained knowledge check required`);
    }
  }
  assert.equal(new Set(visuals.filter(v=>v.kind==='svg').map(v=>v.knowledgeCheck.id)).size, visuals.filter(v=>v.kind==='svg').length, 'Duplicate diagram knowledge check');
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

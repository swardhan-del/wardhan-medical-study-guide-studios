import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeCandidates } from '../scripts/candidate-review.mjs';
const item = () => ({ id:'example-lesson', subject:'physiology', title:'Example', objectives:['Learn'], sections:[{heading:'One',body:'An example.'}], question:{prompt:'Choose',answer:0,options:[{text:'A',explanation:'Yes'},{text:'B',explanation:'No'}]}, references:[{title:'Example reference',url:'https://example.org/article'}], releaseStatus:'review-required', sourceGuide:{source:'/Users/private/secret.docx'} });
test('import retains teaching fields and strips source and review metadata', () => {
  const out = normalizeCandidates([item()]); assert.equal(out.candidates.length, 1); assert.equal(out.candidates[0].question.answer, 0); assert(!JSON.stringify(out).includes('/Users/')); assert(!('sourceGuide' in out.candidates[0]));
});
test('rejects duplicates, invalid answers, private paths and non-review records', () => {
  assert.throws(() => normalizeCandidates([item(), item()]), /duplicate/);
  const badAnswer=item(); badAnswer.question.answer=8; assert.throws(() => normalizeCandidates([badAnswer]), /answer/);
  const badPath=item(); badPath.sections[0].body='/study guide/private/file'; assert.throws(() => normalizeCandidates([badPath]), /body/);
  const badLink=item(); badLink.references[0].url='https://example.org/?token=x'; assert.throws(() => normalizeCandidates([badLink]));
  const released=item(); released.releaseStatus='published'; assert.throws(() => normalizeCandidates([released]), /review-required/);
});

test('CLI creates a private file once and fails closed on Vercel', async () => {
  const { mkdtemp, writeFile, readFile } = await import('node:fs/promises');
  const { tmpdir } = await import('node:os');
  const { join, resolve } = await import('node:path');
  const { spawnSync } = await import('node:child_process');
  const dir = await mkdtemp(join(tmpdir(), 'candidate-review-'));
  const input = join(dir, 'candidate.json'); await writeFile(input, JSON.stringify(item()));
  const cli = resolve('scripts/import-candidate-lessons.mjs');
  const env = { ...process.env, VERCEL: '' };
  const first = spawnSync(process.execPath, [cli, input], { cwd: dir, env }); assert.equal(first.status, 0, first.stderr.toString());
  const output = join(dir, '.private/candidate-lessons.json'); const before = await readFile(output, 'utf8');
  const second = spawnSync(process.execPath, [cli, input], { cwd: dir, env }); assert.notEqual(second.status, 0); assert.equal(await readFile(output, 'utf8'), before);
  const blocked = spawnSync(process.execPath, [cli, input], { cwd: dir, env: { ...env, VERCEL: '1' } }); assert.notEqual(blocked.status, 0); assert.match(blocked.stderr.toString(), /disabled on Vercel/);
});

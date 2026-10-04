import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync, symlinkSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { execFileSync } from 'node:child_process';
import { inspectFile, inspectText, makePolicy, checkRepository, checkOutput, sha256 } from '../scripts/privacy-boundary.mjs';

// Synthetic inputs only: neither real source names nor raw intake bytes belong in tests.
const source = Buffer.from([137, 80, 78, 71, 0, 251, 33, 12]);
const filename = 'Synthetic Review Specimen.png';
const manifest = { version: 1, fileSha256: [sha256(source)], filenameSha256: [sha256(filename.toLowerCase())] };
const policy = makePolicy(manifest);
const put = (root, file, value) => { mkdirSync(dirname(join(root, file)), { recursive: true }); writeFileSync(join(root, file), value); };
function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'visual-privacy-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}

test('private filenames remain blocked in prose, URLs, HTML and encoded metadata', () => {
  for (const name of [filename, filename.toUpperCase(), encodeURIComponent(filename), encodeURIComponent(encodeURIComponent(filename)), filename.replaceAll(' ', '&#32;'), filename.replaceAll(' ', '\\u0020')]) {
    for (const text of [`<meta content="${name}">`, JSON.stringify({ source: `https://example.invalid/${name}` }), `Copied ${name} for review`]) assert(inspectText(text, policy).includes('private source filename'), text);
  }
  assert.deepEqual(inspectText('An original diagram of a cell', policy), []);
  // Existing student-facing disclosure names the archive without exposing it.
  assert.deepEqual(inspectText('The full STEM Visualizer archive is not available here.', policy, { publicSurface: true }), []);
  assert(inspectFile(`docs/${filename}`, Buffer.from('Different contents'), policy).includes('private source filename'));
});

test('renaming, changing an extension or embedding source bytes does not allow publication', () => {
  for (const path of ['docs/safe.md', 'src/content/illustration.json', 'public/images/renamed.png']) assert(inspectFile(path, source, policy).includes('private source or OCR bytes'));
  assert(inspectText(`data:image/png;base64,${source.toString('base64')}`, policy).includes('embedded private asset bytes'));
  assert(inspectText(`canonical/${sha256(source)}.png`, policy).includes('private canonical or OCR fingerprint'));
});

test('copied OCR records and intake paths fail on public surfaces', () => {
  const ocr = { decoded: true, labels: [{ box: [0, 0, 1, 1], confidence: 1, text: 'Synthetic OCR sample' }] };
  assert(inspectText(JSON.stringify(ocr), policy).includes('raw OCR record'));
  for (const path of ['source-intake/test', 'label-inspection/sample.json', 'https://www.dropbox.com/s/example', 'conversion-queue/test']) {
    assert(inspectText(encodeURIComponent(encodeURIComponent(path)), policy, { publicSurface: true }).includes('private intake reference'));
  }
});

test('inline build source maps are inspected after decoding, not exempted', () => {
  const map = content => 'data:application/json;base64,' + Buffer.from(JSON.stringify({ version: 3, sourcesContent: [content] })).toString('base64');
  assert.deepEqual(inspectText(map('An ordinary public lesson'), policy, { publicSurface: true }), []);
  assert(inspectText(map(filename), policy, { publicSurface: true }).includes('private source filename'));
  assert(inspectText(map('data:image/png;base64,' + source.toString('base64')), policy).includes('embedded private asset bytes'));
});

test('released assets are permitted only at their approved path with their exact bytes', () => {
  const approved = Buffer.from([2, 0, 7]);
  const scoped = makePolicy(manifest, [{ path: 'images/released.png', sha256: sha256(approved) }]);
  assert.deepEqual(inspectFile('public/images/released.png', approved, scoped), []);
  assert(inspectFile('public/images/other.png', approved, scoped).includes('unapproved asset bytes or location'));
  assert(inspectFile('public/images/released.png', source, scoped).includes('unapproved asset bytes or location'));
  assert(inspectFile('docs/hidden.dat', approved, scoped).includes('unapproved asset bytes or location'));
});

test('Git index cannot hide private staged bytes behind a safe working copy', t => {
  const root = fixture(t);
  execFileSync('git', ['init', '--quiet', root]);
  put(root, '.gitignore', '.private/\n'); put(root, '.vercelignore', '.private/**\n');
  put(root, 'docs/record.md', source);
  execFileSync('git', ['add', '.'], { cwd: root });
  put(root, 'docs/record.md', 'Safe working copy');
  assert(checkRepository(root, policy).errors.some(e => e.includes('(index): private source')));
  put(root, '.private/forced.png', source);
  execFileSync('git', ['add', '-f', '.private/forced.png'], { cwd: root });
  assert(checkRepository(root, policy).errors.some(e => e.includes('private artifact path')));
});

test('repository symlinks and Vercel ignore exceptions cannot expose private copies', t => {
  const root = fixture(t); execFileSync('git', ['init', '--quiet', root]);
  put(root, '.gitignore', '.private/\n'); put(root, '.vercelignore', '.private/**\n!.private/example.png\n');
  put(root, '.private/example.png', source);
  symlinkSync('.private/example.png', join(root, 'looks-safe.txt'));
  const errors = checkRepository(root, policy).errors;
  assert(errors.some(e => e.includes('symlinks'))); assert(errors.some(e => e.includes('negated')));
});

test('HTML, metadata, sitemap, RSC, client bundles and Vercel output are scanned', t => {
  const root = fixture(t);
  const paths = ['.next/server/app/lesson.html', '.next/server/app/sitemap.xml.body', '.next/server/app/lesson.rsc', '.next/static/chunks/client.js', '.vercel/output/static/meta.json'];
  for (const path of paths) put(root, path, JSON.stringify({ content: filename }));
  const result = checkOutput(root, policy);
  assert.equal(result.errors.filter(e => e.includes('private source filename')).length, paths.length);
  put(root, '.vercel/output/static/renamed.png', source);
  assert(checkOutput(root, policy).errors.some(e => e.includes('private source or OCR bytes')));
});

test('root and page deployment traces reject direct and symlinked private dependencies', t => {
  const root = fixture(t);
  put(root, '.private/private.bin', source);
  symlinkSync('.private/private.bin', join(root, 'alias.bin'));
  put(root, '.next/next-server.js.nft.json', JSON.stringify({ files: ['../alias.bin'] }));
  put(root, '.next/server/page.nft.json', JSON.stringify({ files: ['../../.private/private.bin'] }));
  assert.equal(checkOutput(root, policy).errors.filter(e => e.includes('private dependency')).length, 2);
});

test('snapshot validation works without Git, without pretending the index was inspected', t => {
  const root = fixture(t);
  put(root, 'package.json', '{}'); put(root, '.gitignore', '.private/\n'); put(root, '.vercelignore', '.private/**\n');
  put(root, 'src/content/example.json', JSON.stringify({ title: 'Public lesson' }));
  assert.deepEqual(checkRepository(root, policy).errors, []);
  assert.equal(checkRepository(root, policy).indexChecked, false);
  put(root, 'src/content/example.json', JSON.stringify({ title: filename }));
  assert(checkRepository(root, policy).errors.some(e => e.includes('private source filename')));
});

test('deny inventory contains only validated digests, never source labels or approvals', () => {
  const current = JSON.parse(readFileSync('scripts/private-intake-fingerprints.json', 'utf8'));
  assert.equal(current.intakeRecords, 640);
  assert(current.fileSha256.length >= 637);
  assert(current.filenameSha256.length > 0);
  assert.doesNotThrow(() => makePolicy(current));
  assert.throws(() => makePolicy({ ...manifest, fileSha256: ['not-a-digest'] }));
});

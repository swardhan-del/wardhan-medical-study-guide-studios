import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { hasGitWorktree } from './content-quality-git.mjs';

export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export const normalise = value => {
  let text = String(value).normalize('NFKC');
  for (let i = 0; i < 4; i++) {
    const previous = text;
    text = text.replace(/\\+u([\da-f]{4})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/\\+x([\da-f]{2})/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
      .replace(/&#(x[\da-f]+|\d+);/gi, (_, code) => String.fromCodePoint(parseInt(code.replace(/^x/i, ''), /^x/i.test(code) ? 16 : 10)))
      .replace(/&(?:sol|period|lowbar|colon);/gi, entity => ({'&sol;':'/', '&period;':'.', '&lowbar;':'_', '&colon;':':'})[entity.toLowerCase()])
      .replace(/\\\//g, '/');
    text = text.replace(/(?:%[\da-f]{2})+/gi, encoded => { try { return decodeURIComponent(encoded); } catch { return encoded; } });
    if (text === previous) break;
  }
  return text;
};

const artifactPath = /(?:^|[\\/])(?:\.private|source-intake|conversion-queue|label-inspection|review-contact-sheets)(?:[\\/]|$)|(?:^|[\\/])canonical[\\/][\da-f]{64}/i;
const rawReference = /source-intake[\\/]|conversion-queue[\\/]|label-inspection[\\/]|review-contact-sheets[\\/]|canonical[\\/][\da-f]{64}|STEM[_ -]Visualizer[_ /\\]Images|original_dropbox_path|destination_dropbox_path|https?:[^\s"<>]*dropbox(?:usercontent)?\.com/i;
const media = /\.(?:png|jpe?g|gif|webp|avif|heic|pdf|docx?|pptx?|xlsx?|zip|mp4|mov|woff2?|ico)$/i;

export function makePolicy(manifest, assets = []) {
  if (manifest.version !== 1) throw new Error('Unsupported privacy fingerprint version');
  for (const list of [manifest.fileSha256, manifest.filenameSha256]) {
    if (!Array.isArray(list) || new Set(list).size !== list.length || list.some(h => !/^[a-f0-9]{64}$/.test(h))) throw new Error('Invalid privacy fingerprints');
  }
  return { files: new Set(manifest.fileSha256), names: new Set(manifest.filenameSha256), approved: new Map(assets.map(a => [`public/${a.path}`, a.sha256])) };
}

/** Digest matching keeps private filenames and OCR out of the repository itself. */
export function inspectText(input, policy, { publicSurface = false, digestManifest = false, depth = 0 } = {}) {
  const errors = new Set();
  const text = normalise(input);
  if (publicSurface && rawReference.test(text)) errors.add('private intake reference');
  if (/canonical[\\/][a-f0-9]{64}|label-inspection[\\/][a-f0-9]{64}/i.test(text)) errors.add('private canonical or OCR location');
  if (!digestManifest && [...text.matchAll(/\b[a-f0-9]{64}\b/gi)].some(m => policy.files.has(m[0].toLowerCase()))) errors.add('private canonical or OCR fingerprint');
  // Try suffixes to find filenames with spaces in prose, JSON, URLs and attributes.
  for (const extension of text.matchAll(/\.(?:png|jpe?g|heic|pdf|docx?|pptx?|csv|webp)\b/gi)) {
    const prefix = text.slice(Math.max(0, extension.index - 240), extension.index).match(/[\p{L}\p{N}_(). -]+$/u)?.[0];
    if (!prefix) continue;
    const value = (prefix + extension[0]).toLowerCase();
    const starts = [0, ...[...value.matchAll(/ /g)].map(m => m.index + 1)];
    if (starts.some(start => policy.names.has(sha256(value.slice(start))))) errors.add('private source filename');
  }
  // Raw OCR serialisations are not a lesson or attribution record.
  if (/"labels"\s*:/.test(text) && /"box"\s*:/.test(text) && /"confidence"\s*:/.test(text) && /"(?:decoded|canonicalHash|method)"\s*:/.test(text)) errors.add('raw OCR record');
  for (const match of text.matchAll(/data:((?:image|application)\/[^,;\s]+);base64,([A-Za-z0-9+/=\r\n]+)/g)) {
    const decoded = Buffer.from(match[2], 'base64');
    if (policy.files.has(sha256(decoded))) errors.add('embedded private asset bytes');
    else if (match[1] === 'application/json' && depth < 4) {
      // Turbopack emits inline JSON source maps. Inspect their decoded contents,
      // including sourcesContent, rather than exempting maps or encoded JSON.
      try {
        const value = JSON.parse(decoded.toString('utf8'));
        for (const error of inspectText(JSON.stringify(value), policy, { publicSurface, depth: depth + 1 })) errors.add(error);
      } catch { errors.add('invalid encoded JSON'); }
    } else errors.add('inline asset needs an explicit released file');
  }
  return [...errors];
}

export function inspectFile(file, bytes, policy, { output = false } = {}) {
  const errors = inspectText(file, policy, { publicSurface: output });
  if (artifactPath.test(normalise(file))) errors.push('private artifact path');
  const hash = sha256(bytes);
  if (policy.files.has(hash)) errors.push('private source or OCR bytes');
  const releasedHash = policy.approved.get(file);
  if (!output && (file.startsWith('public/') || media.test(file) || bytes.subarray(0, 8192).includes(0))) {
    if (!releasedHash || hash !== releasedHash) errors.push('unapproved asset bytes or location');
  }
  // PNG/JPEG/etc. in output must be identical to an already released asset.
  if (output && media.test(file) && !new Set(policy.approved.values()).has(hash)) errors.push('unapproved output asset');
  if (!bytes.subarray(0, 8192).includes(0)) errors.push(...inspectText(bytes.toString('utf8'), policy, {
    publicSurface: output || /^(?:src\/content|public)\//.test(file),
    // Historic audit documents may cite a bare digest. They may not contain the
    // actual private name/path, OCR record or bytes. Runtime surfaces never may.
    digestManifest: !output && (file === 'scripts/private-intake-fingerprints.json' || file.startsWith('docs/')),
  }));
  return [...new Set(errors)];
}

function walk(root, directory) {
  if (!existsSync(join(root, directory))) return [];
  return readdirSync(join(root, directory), { withFileTypes: true }).flatMap(entry => {
    const file = `${directory}/${entry.name}`;
    return entry.isDirectory() ? walk(root, file) : [file];
  });
}

export function checkRepository(root, policy) {
  const errors = [];
  const workingObjects = new Map();
  const git = hasGitWorktree(root);
  // Git's index is inspected as well as working bytes; a safe working copy must
  // not conceal a previously staged private file. Vercel may omit Git entirely.
  const files = git ? [...new Set(execFileSync('git', ['ls-files', '-co', '--exclude-standard', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean))]
    : ['package.json', '.gitignore', '.vercelignore', ...['src', 'public', 'scripts', 'docs'].flatMap(d => walk(root, d))];
  for (const file of files) {
    const absolute = join(root, file);
    if (!existsSync(absolute)) { errors.push(`${file}: missing file or broken symlink`); continue; }
    if (lstatSync(absolute).isSymbolicLink()) { errors.push(`${file}: repository symlinks require a separate release review`); continue; }
    const bytes = readFileSync(absolute);
    workingObjects.set(file, createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex'));
    for (const error of inspectFile(file, bytes, policy)) errors.push(`${file}: ${error}`);
  }
  if (git) {
    for (const entry of execFileSync('git', ['ls-files', '--stage', '-z'], { cwd: root, encoding: 'utf8' }).split('\0').filter(Boolean)) {
      const [, mode, object, stage, file] = entry.match(/^(\d+) ([a-f0-9]+) (\d)\t([\s\S]+)$/);
      if (mode !== '100644' && mode !== '100755' || stage !== '0') { errors.push(`${file}: unsupported index entry`); continue; }
      // The Git blob hash proves these index bytes were already inspected above.
      if (workingObjects.get(file) === object) continue;
      const bytes = execFileSync('git', ['cat-file', 'blob', object], { cwd: root, maxBuffer: 64 * 1024 * 1024 });
      for (const error of inspectFile(file, bytes, policy)) errors.push(`${file} (index): ${error}`);
    }
    for (const path of ['.private/probe.png', '.private/conversion-queue/probe.json']) {
      try { execFileSync('git', ['check-ignore', '--quiet', path], { cwd: root }); } catch { errors.push('Private intake is not Git-ignored'); }
    }
  }
  for (const [file, rule] of [['.gitignore', '.private/'], ['.vercelignore', '.private/**']]) {
    const rules = readFileSync(join(root, file), 'utf8').split(/\r?\n/);
    if (!rules.includes(rule) || rules.some(line => /^!.*private/i.test(line))) errors.push(`${file}: private exclusion missing or negated`);
  }
  return { errors: [...new Set(errors)], fileCount: files.length, indexChecked: git };
}

export function checkOutput(root, policy, directories = ['.next/server', '.next/static', '.vercel/output']) {
  const errors = [];
  const files = directories.flatMap(d => walk(root, d));
  // Root server traces live outside .next/server.
  for (const name of ['.next/next-server.js.nft.json', '.next/next-minimal-server.js.nft.json']) if (existsSync(join(root, name))) files.push(name);
  for (const file of files) {
    const absolute = join(root, file);
    if (lstatSync(absolute).isSymbolicLink()) { errors.push(`${file}: output symlink requires review`); continue; }
    const bytes = readFileSync(absolute);
    for (const error of inspectFile(file, bytes, policy, { output: true })) errors.push(`${file}: ${error}`);
    if (file.endsWith('.nft.json')) {
      const trace = JSON.parse(bytes.toString());
      for (const dependency of trace.files ?? []) {
        const target = resolve(absolute, '..', dependency);
        const actual = existsSync(target) ? realpathSync(target) : target;
        if (artifactPath.test(normalise(dependency)) || artifactPath.test(relative(root, actual))) errors.push(`${file}: private dependency in deployment trace`);
      }
    }
  }
  return { errors: [...new Set(errors)], fileCount: files.length };
}

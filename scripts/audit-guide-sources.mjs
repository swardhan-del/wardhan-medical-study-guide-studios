// Read-only metadata census. Output must remain outside the public application.
// Usage: node scripts/audit-guide-sources.mjs <archive-root> <private-output.json>
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { resolve, relative, extname } from 'node:path';
const [rootArg, outputArg] = process.argv.slice(2);
if (!rootArg || !outputArg) throw new Error('Supply archive root and private output path.');
const root = resolve(rootArg), output = resolve(outputArg);
if (!relative(process.cwd(), output).startsWith('..')) throw new Error('Keep the source inventory outside the website checkout.');
const records = [], errors = [];
function walk(path, subject) {
  let entries;
  try { entries = readdirSync(path, { withFileTypes: true }); } catch (error) { errors.push({ path: relative(root, path), error: error.code }); return; }
  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name.startsWith('~$') || entry.isSymbolicLink()) continue;
    const file = resolve(path, entry.name);
    if (entry.isDirectory()) { walk(file, subject); continue; }
    const name = relative(root, file);
    if (!/final|print|divided|stem|visualizer|visuals|visulalizer|diagrams_images/i.test(name) && !/biostatistics/i.test(subject)) continue;
    try {
      const st = statSync(file), extension = extname(file).toLowerCase();
      records.push({ subject, path: name, bytes: st.size, extension,
        role: ['.docx','.pdf','.pptx'].includes(extension) ? 'source-document' : ['.png','.jpg','.jpeg','.svg','.webp','.mp4'].includes(extension) ? 'visual' : 'supporting-record',
        archiveOrDuplicateFolder: /archive|older|duplicate|quarantine|previous/i.test(name),
        contentReview: 'not-read', publicRelease: 'not-cleared-by-this-inventory' });
    } catch (error) { errors.push({ path: name, error: error.code }); }
  }
}
for (const entry of readdirSync(root, { withFileTypes: true })) {
  if (entry.isDirectory() && (/^0[1-6]_/.test(entry.name) || /^(biostatistics|biophysics|microbiology)$/i.test(entry.name))) walk(resolve(root, entry.name), entry.name);
}
writeFileSync(output, JSON.stringify({ generatedAt: new Date().toISOString(), scope: 'File metadata only; not a content, rights or medical review. Includes rendered previews and duplicates.', records, errors }, null, 2));
console.log(`${records.length} metadata records; ${errors.length} errors. No source file contents copied.`);

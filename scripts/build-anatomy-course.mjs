import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, relative } from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const read = path => JSON.parse(readFileSync(join(root, path), 'utf8'));
const check = process.argv.includes('--check');
const emit = (path, value) => {
  const content = typeof value === 'string' ? value : JSON.stringify(value, null, 2) + '\n';
  if (check) { if (readFileSync(join(root, path), 'utf8') !== content) throw Error(`Anatomy output is stale: ${path}`); }
  else writeFileSync(join(root, path), content);
};
const folders = readdirSync(join(root, 'content/anatomy')).filter(f => f.startsWith('volume-')).sort();
const files = folders.flatMap(folder => readdirSync(join(root, 'content/anatomy', folder)).filter(f => f.endsWith('.json')).sort().map(f => join('content/anatomy', folder, f)));
const course = files.map(read);
const expected = [18, 22, 18, 30, 32];
const ids = new Set(course.map(r => r.lesson.id));
if (ids.size !== 120) throw Error('Course must have 120 unique lessons');
for (let v = 1; v <= 5; v++) {
 const lessons = course.filter(r => r.volume === v);
 if (lessons.length !== expected[v - 1] || lessons.some((r,i) => r.order !== i + 1)) throw Error(`Incorrect volume ${v} count/order`);
}
for (const record of course) {
 const l = record.lesson;
 if (record.practice.length < 4 || record.practice.some(q => q.prompt.length < 20 || q.answer.length < 60)) throw Error(`Incomplete practice: ${l.id}`);
 if (!record.identification.prompt || record.sourceSections.length === 0 || !record.furtherReading.url.startsWith('https://')) throw Error(`Missing learning/source record: ${l.id}`);
 if (JSON.stringify(record).match(/\/Users\/|\.private|dropboxusercontent|department, or examination board|Practical specimen additions|\ufffd/)) throw Error(`Unclean source text: ${l.id}`);
 const md = [`# ${String(record.order).padStart(2,'0')}. ${l.title}`, '', `Volume ${record.volume} · ${l.minutes} minutes · Updated ${l.updatedAt}`, '', l.summary, '', '## Objectives', '', ...l.objectives.map(o => '- '+o), '', '## Prerequisite knowledge', '', 'Start with anatomical position, planes, directional terms and the difference between a nerve, artery, vein and duct.', ...(l.prerequisites.length ? l.prerequisites.map(id => `- Previous lesson: [${id}](/library/${id})`) : ['- Begin with the website anatomy orientation at /start/anatomy.']), '', ...l.steps.flatMap(s => ['## '+s.title, '', s.body, '']), '## Worked example', '', l.workedExample.prompt, '', ...l.workedExample.solution.map((s,i) => `${i+1}. ${s}`), '', '## Draw and identify', '', record.identification.prompt, '', 'Checkpoints:', '', ...record.identification.checkpoints.map(s => '- '+s), '', '## Practice', '', '### 1. '+l.question.prompt, '', ...l.question.options.map((o,i) => `${String.fromCharCode(65+i)}. ${o.text}`), '', ...record.practice.flatMap((q,i) => [`### ${i+2}. ${q.prompt}`, '', q.kind, '']), '## Answers and explanations', '', `1. ${l.question.options[l.question.answer].text}. ${l.question.options[l.question.answer].reason}`, '', ...record.practice.flatMap((q,i) => [`${i+2}. ${q.answer}`, '']), '## Oral recap', '', l.recall.prompt, '', l.recall.answer, '', '## Sources and editorial record', '', `Source: ${l.source}, ${l.section}.`, '', `[Further reading: ${record.furtherReading.title}](${record.furtherReading.url})`, '', record.editorial.basis, '', record.editorial.review, '', record.editorial.visualRights, '', `Website: /library/${l.id}`, ''].join('\n');
 emit(files[course.indexOf(record)].replace(/\.json$/,'.md'), md);
}
const existing = read('src/content/library-lessons.json');
existing.lessons = [...existing.lessons.filter(l => l.subject !== 'anatomy'), ...course.map(r => r.lesson)];
emit('src/content/library-lessons.json', existing);
emit('src/content/anatomy-course.json', { version: 1, updatedAt: '2026-09-10', records: course.map(({lesson, ...extras}) => ({ lessonId: lesson.id, ...extras })) });
emit('src/content/anatomy-practice-index.json', { records: course.map(r => ({ lessonId: r.lesson.id, title: r.lesson.title, practice: r.practice.map(q => ({ id: q.id, prompt: q.prompt })) })) });
const groups = read('src/content/study-collections.json');
const print = read('src/content/printable-guides.json');
for (let v=1; v<=5; v++) {
 const lessonIds = course.filter(r => r.volume===v).map(r => r.lesson.id);
 groups.groups.find(g => g.id===`anatomy-volume-${v}`).lessonIds = lessonIds;
 const part = print.parts.find(g => g.id===`anatomy-volume-${v}`);
 if (!part) throw Error(`Missing printable volume ${v}`);
 part.lessonIds = lessonIds;
 part.coverage = `${lessonIds.length} written lessons with explanations, identification tasks and explained practice. Covers the mapped course topics; check your school syllabus for additional requirements.`;
}
print.updatedAt='2026-09-10'; emit('src/content/study-collections.json',groups); emit('src/content/printable-guides.json',print);
const refs=read('src/content/lesson-references.json');
for (const r of course) refs[r.lesson.id]={...r.furtherReading,checkedAt:'2026-09-10'};
emit('src/content/lesson-references.json',refs);
emit('content/anatomy/COVERAGE.md',['# Five-volume anatomy course coverage','','The canonical editable records are the numbered JSON files. The adjacent Markdown files and website data are generated by `npm run content:anatomy`. Source manuscripts are preserved separately and are not shipped with the website.','','| Volume | Lessons | Source section mapping |','|---|---:|---|',...expected.map((n,i)=>`| ${i+1} | ${n} | See each lesson’s Sources section |`),'','## Lesson register','',...course.map((r,i)=>`- Volume ${r.volume}, ${r.order}: [${r.lesson.title}](${relative('content/anatomy',files[i]).replace(/\.json$/,'.md')}) — ${r.sourceSections.join('; ')}`),'','## Scope boundaries','','The course adapts explanatory source chapters and integrates original guided practice. Repetitive source oral-answer banks, publishing checklists and manuscript front matter are not reproduced. Source drawing pages are replaced by new identification tasks. Thoracic and abdominal wall topics in Volume V are taught in Volumes I and II; TMJ and skull exits are taught in Volume IV. They are cross-volume foundations rather than duplicated chapters. The source PDF’s raw diagram/OCR addenda are excluded; no unreviewed atlas plate or private STEM image is imported.','', 'Lesson counts do not establish syllabus completeness or medical peer review. The six existing anatomy URLs are preserved.',''].join('\n'));
console.log(`Anatomy course: ${course.length} lesson files, Markdown manuscripts, web records and five printable volumes ${check?'verified':'generated'}.`);

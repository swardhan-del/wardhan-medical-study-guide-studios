import { readFileSync, writeFileSync } from 'node:fs';
import { renalLessons } from '../src/content/renal-course.ts';
import { foundations } from '../src/content/foundations.ts';
const read = name => JSON.parse(readFileSync(new URL(`../src/content/${name}.json`, import.meta.url), 'utf8'));
const lessons = read('library-lessons').lessons;
const released = new Set(read('public-release').resourceIds);
const publicLessons = lessons.filter(lesson => released.has(lesson.id));
const subjectRoutes = {};
for (const subject of [...new Set(publicLessons.map(lesson => lesson.subject))]) {
  subjectRoutes[`/study/${subject}`] = subject;
  subjectRoutes[`/subjects/${subject}`] = subject;
}
for (const [path, subject] of [['histology-i','histology'],['histology-ii','histology'],['immunology','genetics']]) subjectRoutes[`/subjects/${path}`] = subject;
const lessonRoutes = Object.fromEntries(publicLessons.map(lesson => [`/library/${lesson.id}`, lesson.id]));
for (const lesson of renalLessons) lessonRoutes[`/learn/renal/${lesson.slug}`] = `renal-${lesson.slug}`;
for (const subject of Object.keys(foundations)) lessonRoutes[`/learn/foundations/${subject}`] = `foundation-${subject}`;
const lessonIds = new Set(publicLessons.map(lesson => lesson.id));
const quizIds = [...publicLessons.map(lesson => `concept-${lesson.id}`), ...read('study-questions').questions.filter(q => lessonIds.has(q.topic)).map(q => q.id), ...read('transfer-practice').questions.filter(q => lessonIds.has(q.topic)).map(q => q.id), 'renal-challenge', ...renalLessons.map(lesson => `lesson:${lesson.slug}`)];
const summaryDrafts = Object.fromEntries(publicLessons.flatMap(lesson => (lesson.summaryChecklist ?? []).map((_, i) => [`${lesson.id}-summary-${i + 1}`, lesson.id])));
const value = { subjectRoutes, lessonRoutes, quizIds: [...new Set(quizIds)], summaryDrafts };
const target = new URL('../src/content/measurement-registry.json', import.meta.url);
const output = JSON.stringify(value, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (readFileSync(target, 'utf8') !== output) throw new Error('Measurement registry is stale. Run node scripts/build-measurement-registry.mjs.');
} else writeFileSync(target, output);
console.log(`Measurement allowlist: ${Object.keys(lessonRoutes).length} public lessons; no question text, answers or learner data.`);

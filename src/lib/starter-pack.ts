import library from "../content/library-lessons.json" with { type: "json" };
import references from "../content/lesson-references.json" with { type: "json" };
import sources from "../content/library-sources.json" with { type: "json" };
import { studyPaths } from "../content/study-paths.ts";
import type { LibraryLesson, LibrarySource } from "./library-types.ts";

type Reference = { title: string; url: string; supportingIds?: string[]; supportingReferences?: { title: string; url: string }[] };
const subjects = [
  ["histology", "Histology"], ["anatomy", "Anatomy"], ["physiology", "Physiology"],
  ["biochemistry", "Biochemistry"], ["genetics", "Genetics & Immunology"],
  ["biophysics", "Biophysics"], ["cell-biology", "Cell Biology"],
];
export const starterLessons = subjects.map(([id, title]) => {
  const lesson = (library.lessons as LibraryLesson[]).find(item => item.id === studyPaths[id].start)!;
  const reference = (references as Record<string, Reference>)[lesson.id];
  return { subject: title, lesson, source: (sources as Record<string, LibrarySource>)[lesson.source], references: [reference,
    ...(reference.supportingReferences ?? []), ...(reference.supportingIds ?? []).map(key => (references as Record<string, Reference>)[key]),
  ] };
});
export const escapeHtml = (value: string) => value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
export const starterPackCss = `
.starter-pack{font:17px/1.65 system-ui,sans-serif;color:#14252c;background:#fff;margin:0 auto;padding:24px;max-width:850px}
.starter-pack a{color:#155d61;overflow-wrap:anywhere;text-decoration:underline;text-underline-offset:.18em}.starter-pack a:focus-visible{outline:3px solid #155d61;outline-offset:4px}
.starter-pack h1,.starter-pack h2,.starter-pack h3{font-family:inherit;font-weight:700;line-height:1.2}
.starter-pack h1{font-size:2.2rem}.starter-pack h2{font-size:1.65rem}.starter-pack h3{font-size:1.2rem}
.starter-pack .pack-lesson,.starter-pack .pack-key{border-top:1px solid #bac7c8;margin:32px 0;padding-top:24px;scroll-margin-top:7rem}
.starter-pack .pack-source{font-size:.9rem;overflow-wrap:anywhere}.starter-pack .pack-answer{margin-block:24px}
.starter-pack .pack-tasks{padding:16px 16px 16px 36px;background:#f1f6f4}.starter-pack .pack-instructions{border:1px solid #bac7c8;padding:20px}
@media(max-width:480px){.starter-pack{padding:16px}.starter-pack h1{font-size:1.85rem}}
@media print{
@page{size:A4;margin:17mm}
.starter-pack{font-size:10pt;line-height:1.4;max-width:none;padding:0;margin:0;color:#000}
.starter-pack h1{font-size:24pt}.starter-pack h2{font-size:18pt;margin:.7em 0}.starter-pack h3{font-size:13pt;margin:.7em 0}
.starter-pack p{margin:.6em 0}.starter-pack .pack-lesson,.starter-pack .pack-key{break-before:page;border:0;margin:0;padding:0}
.starter-pack .pack-answer{break-inside:avoid;margin-block:14px}.starter-pack h2,.starter-pack h3{break-after:avoid}
.starter-pack p,.starter-pack li{orphans:3;widows:3}.starter-pack a{color:#000}
.starter-pack .pack-tasks{background:none;padding:.5em .5em .5em 2em}.starter-pack .pack-source{font-size:8.5pt;line-height:1.35}
}
`;
// All prose and answers below are taken from released website lessons, never source-book files.
// Escape every data-derived string because the same markup powers the web and offline edition.
export function starterPackBody(origin: string) {
  const e = escapeHtml;
  return `<header><p>Wardhan Medical Study Guide Studios · Free learning resource</p><h1>Study Guide starter pack</h1><p>Seven subject entry points, short recaps and explained practice questions from the published website lessons.</p><p>Choose subject → Start free lesson → Practice → Review summary → Continue learning.</p></header>
  <section class="pack-instructions" aria-labelledby="pack-use"><h2 id="pack-use">Use this pack</h2><ol><li>Choose one subject. Read the recap and open the linked lesson for the full explanation.</li><li>Answer its Knowledge Check before reading the answer key.</li><li>Explain the oral prompt, compare it with the recap and revisit any gaps.</li><li>On the website, save the summary in My Study and continue to the recommended next lesson.</li></ol><p>This is a starting sampler, not a complete syllabus or an assessment of examination readiness. The website teaching adaptations are AI-assisted and source-checked; independent clinical peer review has not been completed.</p><p>The downloaded HTML opens offline. Use your browser’s Print command to print or save as PDF. Lesson and reference links need an internet connection. This pack contains no trackers, scripts, forms or external images.</p></section>
  <nav aria-label="Starter pack contents"><h2>Choose a subject</h2><ol>${starterLessons.map(({ subject, lesson }) => `<li><a href="#pack-${e(lesson.id)}">${e(subject)}: ${e(lesson.title)}</a></li>`).join("")}</ol><a href="#pack-answers">Answer key and explanations</a></nav>
  ${starterLessons.map(({ subject, lesson, source, references: refs }) => `<section class="pack-lesson" id="pack-${e(lesson.id)}"><p>${e(subject)} · ${lesson.minutes} minute full lesson</p><h2>${e(lesson.title)}</h2><p>${e(lesson.summary)}</p><h3>Summary</h3><p>${e(lesson.recall.answer)}</p><h3>Knowledge Check</h3><p>${e(lesson.question.prompt)}</p><ol type="A">${lesson.question.options.map(option => `<li>${e(option.text)}</li>`).join("")}</ol><h3>Oral explanation practice</h3><p>${e(lesson.recall.prompt)}</p><ul class="pack-tasks"><li>□ Read the full explanation.</li><li>□ Check the answer and explain the reasoning.</li><li>□ Review the recap and identify what to revisit.</li></ul><p><a href="${e(origin)}/library/${e(lesson.id)}">Open the full free lesson</a> · <a href="${e(origin)}/study/${e(lesson.subject)}">Continue this subject</a></p><div class="pack-source"><h3>Source and editorial record</h3><p>Content: Wardhan Medical Study Guide Studios, published teaching adaptation, updated ${e(lesson.updatedAt)}. Original lesson record: ${e(source.title)}; ${e(source.edition)}; ${e(lesson.section)}.</p><ul>${refs.map(ref => `<li><a href="${e(ref.url)}">${e(ref.title)}</a> — ${e(ref.url)}</li>`).join("")}</ul><p>Full lesson: ${e(origin)}/library/${e(lesson.id)}</p></div></section>`).join("")}
  <section class="pack-key" id="pack-answers"><h2>Answer key and explanations</h2>${starterLessons.map(({ subject, lesson }) => `<section class="pack-answer"><h3>${e(subject)}: ${e(lesson.title)}</h3><p><strong>${String.fromCharCode(65 + lesson.question.answer)}. ${e(lesson.question.options[lesson.question.answer].text)}</strong></p><p>${e(lesson.question.options[lesson.question.answer].reason)}</p><a href="#pack-${e(lesson.id)}">Return to the question</a></section>`).join("")}</section>
  <footer><p>Choose your next session at <a href="${e(origin)}/start">${e(origin)}/start</a>. This pack reproduces the studio’s existing public explanations and original questions, not source-textbook pages or third-party images.</p></footer>`;
}
export function starterPackDocument(origin: string) {
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Study Guide starter pack</title><style>${starterPackCss}</style></head><body style="margin:0"><main class="starter-pack">${starterPackBody(origin)}</main></body></html>`;
}

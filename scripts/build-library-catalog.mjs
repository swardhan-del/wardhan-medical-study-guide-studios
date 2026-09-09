import { readFileSync, writeFileSync, statSync } from "node:fs";
import { renalLessons } from "../src/content/renal-course.ts";
import {
  anatomyTopicLinks,
  anatomyTopicHref,
} from "../src/content/anatomy-navigation.ts";
import { anatomyLearningPages } from "../src/content/anatomy-learning.ts";
import { musculoskeletalTopics, musculoskeletalRecall } from "../src/content/musculoskeletal.ts";
import { validateCatalog } from "./catalog-schema.mjs";
const read = (path) =>
  JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const { lessons } = read("../src/content/library-lessons.json");
const base = { status: "public", updatedAt: "2026-09-06", bytes: 0 };
const records = lessons.map((l) => ({
  ...base,
  id: l.id,
  updatedAt: l.updatedAt,
  title: l.title,
  subject: l.subject,
  kind: "Study lesson",
  format: "WEB",
  summary: l.summary,
  tags: l.tags,
  minutes: l.minutes,
}));
for (const topic of anatomyTopicLinks)
  records.push({
    ...base,
    id: `anatomy-${topic.slug}`,
    title: topic.label,
    subject: "anatomy",
    kind: topic.slug === "musculoskeletal" ? "Study map and available lessons" : "Interactive topic lessons",
    format: "WEB",
    summary: topic.slug === "musculoskeletal" ? "Open the available plexus lesson and recall examples. Other regional sections are study outlines; the full guide and decks are not available here." : `Study ${topic.label.toLowerCase()} through explanations, visual teaching material and recall practice.`,
    href: anatomyTopicHref(topic.slug),
    tags: [topic.label, "anatomy", "embryology"],
    minutes: 10,
  });
for (const l of renalLessons)
  records.push({
    ...base,
    id: `renal-${l.slug}`,
    title: l.title,
    subject: "physiology",
    kind: "Renal course lesson",
    format: "WEB",
    summary: l.description,
    href: `/learn/renal/${l.slug}`,
    tags: ["Renal and acid–base physiology", "renal", "kidney", l.title],
    minutes: l.minutes,
  });
for (const [id, title, subject, href, summary, tags] of [
  [
    "biophysics-lab",
    "Biophysics: predict and calculate",
    "biophysics",
    "/practice/biophysics",
    "Explore six coded models for lenses, attenuation, membrane charging, diffusion, flow and ultrasound.",
    ["Biophysics", "Practical calculations", "Physical principles"],
  ],
  [
    "renal-course",
    "The complete renal mini-course",
    "physiology",
    "/learn/renal",
    "Follow eight lessons from kidney organization to acid–base interpretation, with 30 explained questions.",
    ["renal", "kidney", "course"],
  ],
  [
    "renal-challenge",
    "Five-minute renal challenge",
    "physiology",
    "/practice/renal-challenge",
    "Test five renal concepts, see every answer explained and review your mistakes.",
    ["renal", "quiz", "challenge"],
  ],
  [
    "physiology-lab",
    "Physiology lab and ABG exercises",
    "physiology",
    "/practice/physiology",
    "Explore renal resistance and ventilation models, then interpret six fictional blood gases.",
    [
      "Respiratory physiology",
      "Renal and acid–base physiology",
      "ABG",
      "model",
    ],
  ],
  [
    "histology-detective",
    "Renal histology detective",
    "histology",
    "/practice/histology",
    "Identify three original tubule schematics and reveal the structural clues.",
    ["Organ histology", "Microscopic structure", "renal", "tubules"],
  ],
  [
    "oral-practice",
    "Renal oral-exam practice",
    "physiology",
    "/practice/oral",
    "Practice eight structured answers with self-assessment rubrics and follow-up prompts.",
    ["renal", "oral exam"],
  ],
])
  records.push({
    ...base,
    id,
    title,
    subject,
    href,
    summary,
    tags,
    kind: "Practice",
    format: "ACTIVITY",
    minutes: 5,
  });
records.push({
  ...base,
  id: "renal-revision-sheet",
  title: "Renal physiology revision sheet",
  subject: "physiology",
  kind: "Revision sheet",
  format: "PDF",
  summary:
    "A two-page printable summary of key renal mechanisms, equations and acid–base reasoning.",
  href: "/downloads/renal-revision-sheet.pdf",
  bytes: statSync(
    new URL("../public/downloads/renal-revision-sheet.pdf", import.meta.url),
  ).size,
  tags: ["renal", "printable", "summary"],
});
records.sort(
  (a, b) =>
    a.subject.localeCompare(b.subject) || a.title.localeCompare(b.title),
);
const data = validateCatalog({ version: 1, records });
const path = new URL("../src/content/public-catalog.json", import.meta.url);
const output = JSON.stringify(data, null, 2) + "\n";
if (process.argv.includes("--check")) {
  if (readFileSync(path, "utf8").replaceAll("\r\n", "\n") !== output)
    throw new Error(
      "Public library is stale. Run node scripts/build-library-catalog.mjs.",
    );
} else writeFileSync(path, output);
console.log(
  `Library catalog: ${records.length} resources across ${new Set(records.map((r) => r.subject)).size} subjects.`,
);

const figures = read("../src/content/public-figures.json").figures;
const recaps = read("../src/content/study-recaps.json").recaps;
const searchIndex = Object.fromEntries(records.map(record => {
  const lesson = lessons.find(l => l.id === record.id);
  const renal = renalLessons.find(l => record.id === `renal-${l.slug}`);
  const anatomy = anatomyLearningPages.find(l => record.id === `anatomy-${l.slug}`);
  const parts = [
    ...(lesson?.steps.flatMap(s => [s.title, s.body]) ?? []),
    ...(lesson?.objectives ?? []),
    ...(lesson?.workedExample ? [lesson.workedExample.title, lesson.workedExample.prompt, ...lesson.workedExample.solution] : []),
    ...(renal?.sections.flatMap(s => [s.title, s.text]) ?? []),
    ...(renal?.objectives ?? []),
    // These are the same public lesson objects rendered by LearningExplorer.
    ...(anatomy ? [JSON.stringify(anatomy.lessons)] : []),
    ...(record.id === "anatomy-musculoskeletal" ? musculoskeletalTopics.map(t => t.title + " " + t.description).concat(musculoskeletalRecall.map(r => r.question + " " + r.answer)) : []),
    ...figures.filter(f => f.resourceIds.includes(record.id)).flatMap(f => [f.title, f.alt, f.caption]),
    ...recaps.filter(r => r.lessonId === record.id).flatMap(r => r.dialogue.map(d => d.text)),
  ];
  return [record.id, parts.join(" ")];
}));
const searchPath = new URL("../src/content/public-search.json", import.meta.url);
const searchOutput = JSON.stringify(searchIndex, null, 2) + "\n";
if (process.argv.includes("--check")) {
  if (readFileSync(searchPath, "utf8").replaceAll("\r\n", "\n") !== searchOutput) throw new Error("Public search index is stale. Run npm run content:library.");
} else writeFileSync(searchPath, searchOutput);

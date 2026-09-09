import { readFileSync, writeFileSync, statSync } from "node:fs";
import { renalLessons } from "../src/content/renal-course.ts";
import {
  anatomyTopicLinks,
  anatomyTopicHref,
} from "../src/content/anatomy-navigation.ts";
import { validateCatalog } from "./catalog-schema.mjs";
const read = (path) =>
  JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const { lessons } = read("../src/content/library-lessons.json");
const base = { status: "public", updatedAt: "2026-09-06", bytes: 0 };
const records = lessons.map((l) => ({
  ...base,
  updatedAt: l.updatedAt,
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
    kind: "Topic explorer",
    format: "WEB",
    summary: `Explore ${topic.label.toLowerCase()} through explanations, visual teaching material, source references and recall practice.`,
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

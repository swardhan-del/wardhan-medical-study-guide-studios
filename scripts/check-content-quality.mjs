import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { qualityLessons, lessonQuality, reviewEvidence, qualityAllowsIndexing } from "../src/lib/lesson-quality.ts";
import { validateQuality, explainedQuestions, containsPrivateReference, resolvedLinks, validDate } from "../src/lib/content-quality.ts";
const read = file => JSON.parse(readFileSync(file, "utf8"));
const baseline = read("src/content/lesson-quality-legacy.json");
const today = new Date().toISOString().slice(0, 10);
const errors = [];
const rows = [];
for (const id of Object.keys(baseline.lessons)) if (!qualityLessons.some(l => l.id === id)) errors.push(`Published legacy lesson was removed: ${id}`);
const fingerprints = new Map(qualityLessons.map(l => [l.id, createHash("sha256").update(JSON.stringify(l.content)).digest("hex")]));
for (const [name, records, field] of [["quality", lessonQuality, "lessonId"], ["evidence", reviewEvidence, "id"]]) {
  if (new Set(records.map(r => r[field])).size !== records.length) errors.push(`Duplicate ${name} records`);
}
for (const q of lessonQuality) if (!qualityLessons.some(l => l.id === q.lessonId)) errors.push(`Unknown lesson in quality registry: ${q.lessonId}`);
for (const e of reviewEvidence) {
  if (!/^[a-z0-9-]+$/.test(e.id) || !["editorial", "clinical", "visual", "assessment", "accessibility", "readability"].includes(e.scope) || !validDate(e.reviewedAt) || e.reviewedAt > today || typeof e.independent !== "boolean" || typeof e.reviewer !== "string" || !e.reviewer.trim() || typeof e.qualification !== "string" || !e.qualification.trim()) errors.push(`Invalid review evidence fields: ${e.id}`);
  if (!qualityLessons.some(l => l.id === e.lessonId)) errors.push(`Unknown lesson in review evidence: ${e.id}`);
  if (!/^docs\/reviews\/[a-z0-9-]+\.md$/.test(e.record) || !existsSync(e.record)) errors.push(`Missing committed review note: ${e.id}`);
  else if (!readFileSync(e.record, "utf8").includes(e.id)) errors.push(`Review note must identify evidence ID: ${e.id}`);
  if (e.contentSha256 !== fingerprints.get(e.lessonId)) errors.push(`Review evidence does not cover current content: ${e.id}`);
  if (containsPrivateReference(e)) errors.push(`Private reference in evidence: ${e.id}`);
}
for (const lesson of qualityLessons) {
  const q = lessonQuality.find(q => q.lessonId === lesson.id);
  const unchangedLegacy = baseline.lessons[lesson.id] === fingerprints.get(lesson.id);
  if (!q && !unchangedLegacy) errors.push(`${lesson.id}: new or changed lesson needs a quality record (do not refresh the legacy baseline)`);
  if (q) errors.push(...validateQuality(q, lesson, qualityLessons, reviewEvidence, today).map(error => `${lesson.id}: ${error}`));
  const links = resolvedLinks(lesson.id, q?.links ?? lesson.links, qualityLessons).flatMap(g => g.lessons.map(l => l.id));
  rows.push({ id: lesson.id, indexable: qualityAllowsIndexing(lesson.id), compatibility: !q && unchangedLegacy,
    medicalPending: q?.contentStatus !== "independently-clinically-reviewed", visual: q?.visualStatus ?? "not-recorded",
    missingExplanations: !explainedQuestions(lesson), reviewDue: Boolean(q?.nextReviewAt && q.nextReviewAt <= today), reviewDateMissing: !q?.lastReviewedAt || !q?.nextReviewAt,
    metadataMissing: !q || !q.sources?.length || !q.objectives?.length || !q.lastReviewedAt || !q.nextReviewAt, contentSha256: fingerprints.get(lesson.id), links: [...new Set(links)] });
}
// Scan deployable authored text. Documents/private briefs are deliberately outside this surface.
function scan(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const file = `${directory}/${entry.name}`;
    if (entry.isDirectory()) scan(file);
    else if (/\.(json|tsx?|mdx?|html|svg|txt|csv)$/i.test(file) && containsPrivateReference(readFileSync(file, "utf8"))) errors.push(`Private source reference in public content: ${file}`);
    else if (/\.(docx?|pptx?)$/i.test(file)) errors.push(`Raw Office source in public content: ${file}`);
  }
}
scan("src/content"); scan("public");
if (existsSync(".git")) {
  const tracked = execFileSync("git", ["ls-files", ".private"], { encoding: "utf8" }).trim();
  if (tracked) errors.push("Private input is tracked by Git");
  const raw = execFileSync("git", ["ls-files", "-co", "--exclude-standard", "*.doc", "*.docx", "*.ppt", "*.pptx", "*.pdf"], { encoding: "utf8" }).trim().split("\n").filter(Boolean);
  const released = new Set(read("src/content/public-release.json").assets.map(a => `public/${a.path}`));
  for (const file of new Set(raw)) if (!released.has(file)) errors.push(`Raw source outside private intake: ${file}`);
  try { execFileSync("git", ["check-ignore", ".private/source-intake/2026-10-01/probe.docx"], { stdio: "pipe" }); } catch { errors.push(".private is not ignored by Git"); }
} else if (!readFileSync(".gitignore", "utf8").split(/\r?\n/).includes(".private/")) {
  errors.push("Deployment snapshot must retain the .private/ Git exclusion (tracked-file check runs in CI)");
}
if (!readFileSync(".vercelignore", "utf8").split(/\r?\n/).includes(".private/**")) errors.push("Vercel must exclude .private/**");
const groups = [
  ["Indexable lessons (legacy compatibility is not quality approval)", rows.filter(r => r.indexable)],
  ["Pending independent medical review", rows.filter(r => r.medicalPending)],
  ["Planned or rights-pending visuals", rows.filter(r => ["planned", "rights-review-pending"].includes(r.visual))],
  ["Visual review status not recorded", rows.filter(r => r.visual === "not-recorded")],
  ["Missing explained practice questions", rows.filter(r => r.missingExplanations)],
  ["Lessons due for review", rows.filter(r => r.reviewDue)],
  ["Review dates not recorded", rows.filter(r => r.reviewDateMissing)],
  ["Quality metadata not yet recorded", rows.filter(r => r.metadataMissing)],
  ["Orphaned lessons (no incoming or outgoing lesson links)", rows.filter(r => !r.links.length && !rows.some(other => other.links.includes(r.id)))],
  ["Weakly linked lessons (fewer than two distinct outgoing lessons)", rows.filter(r => r.links.length < 2)],
];
const report = [`# Content quality report — ${today}`, "", `${rows.length} native lessons. ${rows.filter(r => r.compatibility).length} unchanged legacy lessons retain existing index eligibility; this is not medical, visual or rights clearance.`, "", ...groups.flatMap(([name, items]) => [`## ${name}: ${items.length}`, "", items.map(r => `- ${r.id}`).join("\n") || "None.", ""]), "## Validation errors", "", errors.map(e => `- ${e}`).join("\n") || "None.", ""].join("\n");
mkdirSync("output/phase-eleven", { recursive: true });
writeFileSync("output/phase-eleven/content-quality-report.md", report);
writeFileSync("output/phase-eleven/content-quality-report.json", JSON.stringify({ date: today, rows, errors }, null, 2) + "\n");
for (const [name, items] of groups) console.log(`${name}: ${items.length}`);
console.log("Report: output/phase-eleven/content-quality-report.md");
if (errors.length) { console.error(errors.join("\n")); process.exitCode = 1; }

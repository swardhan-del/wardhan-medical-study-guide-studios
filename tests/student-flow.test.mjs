import test from "node:test";
import assert from "node:assert/strict";
import { emptyProgress, parseProgress, gradeAttempt } from "../src/lib/learning-core.ts";
import { mergeProgress, readTransfer } from "../src/lib/progress-transfer.ts";
import { journeyStatus, stageForHash, resumeHref } from "../src/lib/learning-journey.ts";
import { starterLessons, starterPackBody, starterPackDocument, escapeHtml } from "../src/lib/starter-pack.ts";
import { studyPaths } from "../src/content/study-paths.ts";

const parse = data => parseProgress(JSON.stringify(data), ["lesson"], ["question"]);
test("legacy progress retains answers and completion without inventing journey milestones", () => {
  const legacy = { version: 1, lessons: ["lesson"], answers: { question: gradeAttempt(undefined, true, 10) } };
  const migrated = parse(legacy);
  assert.deepEqual(migrated.lessons, ["lesson"]);
  assert.equal(migrated.answers.question.correct, 1);
  assert.equal(migrated.resume, null);
  assert.deepEqual(migrated.journey, {});
});
test("resume and summary states survive export and strip unknown identifiers, URLs and invalid types", () => {
  const data = { ...emptyProgress(), resume: { lesson: "lesson", stage: "summary", at: 30, url: "https://invalid.example" }, journey: { lesson: { read: true, reviewed: true, saved: true, at: 30 }, unknown: { saved: true, at: 30 } } };
  const clean = parse(data);
  assert.deepEqual(clean.resume, { lesson: "lesson", stage: "summary", at: 30 });
  assert.deepEqual(Object.keys(clean.journey), ["lesson"]);
  assert.deepEqual(readTransfer(JSON.stringify(clean), ["lesson"], ["question"], [], []).progress, clean);
  for (const resume of [{ lesson: "https://bad.test", stage: "learn", at: 1 }, { lesson: "lesson", stage: "bad", at: 1 }, { lesson: "lesson", stage: "learn", at: -1 }]) assert.equal(parse({ ...data, resume }).resume, null);
  assert.deepEqual(parse({ ...data, journey: { lesson: { read: "yes", reviewed: 1, saved: true, at: 3 } } }).journey.lesson, { read: false, reviewed: false, saved: true, at: 3 });
});
test("completion stays separate from mastery and requires explicit confirmation", () => {
  const data = emptyProgress();
  assert.equal(journeyStatus(data, "lesson", ["question"]).steps, 0);
  data.journey.lesson = { read: true, reviewed: true, saved: true, at: 1 };
  assert.equal(journeyStatus(data, "lesson", ["question"]).canComplete, false);
  data.answers.question = gradeAttempt(undefined, false, 10);
  assert.equal(journeyStatus(data, "lesson", ["question"]).steps, 3);
  assert.equal(journeyStatus(data, "lesson", ["question"]).complete, false);
  data.lessons.push("lesson");
  assert.equal(journeyStatus(data, "lesson", ["question"]).complete, true);
  assert.equal(data.answers.question.lastCorrect, false);
});
test("transfer merges the latest resume and summary changes including removals without changing counters", () => {
  const current = { ...emptyProgress(), resume: { lesson: "lesson", stage: "summary", at: 20 }, journey: { lesson: { read: true, reviewed: true, saved: false, at: 20 } } };
  const incoming = { ...emptyProgress(), resume: { lesson: "lesson", stage: "practice", at: 10 }, journey: { lesson: { read: true, reviewed: false, saved: true, at: 10 } } };
  assert.deepEqual(mergeProgress(current, incoming), current);
  assert.deepEqual(mergeProgress(incoming, current), current);
  assert.deepEqual(emptyProgress().journey, {});
  assert.equal(emptyProgress().resume, null);
});
test("resume anchors stay within public library routes and recognise old practice and summary anchors", () => {
  assert.equal(stageForHash("#concept-check-title"), "practice");
  assert.equal(stageForHash("#summary-checklist-title"), "summary");
  assert.equal(stageForHash("#lesson-objectives"), "learn");
  assert.equal(resumeHref({ lesson: "lesson", stage: "summary", at: 1 }), "/library/lesson#lesson-review");
});
test("starter pack uses every existing subject entry lesson and its unchanged answer explanation", () => {
  assert.equal(starterLessons.length, 7);
  assert.equal(new Set(starterLessons.map(item => item.lesson.subject)).size, 7);
  const html = starterPackBody("https://example.com");
  for (const { lesson, references, source } of starterLessons) {
    assert.equal(lesson.id, studyPaths[lesson.subject].start);
    assert(lesson.question.options[lesson.question.answer]);
    assert(html.includes(escapeHtml(lesson.recall.answer)));
    assert(html.includes(escapeHtml(lesson.question.options[lesson.question.answer].reason)));
    assert(html.includes(escapeHtml(source.title)));
    for (const ref of references) assert.match(ref.url, /^https:\/\//);
  }
});
test("offline starter pack is self-contained, escaped and has no scripts, trackers or copyrighted image copies", () => {
  const html = starterPackDocument('https://example.com/"<script>');
  assert.match(html, /<html lang="en-GB">/);
  assert.match(html, /@media print/);
  assert.doesNotMatch(html, /<script|<img|<iframe|<form|onclick=|\.private|Dropbox|file:\/\//i);
  assert.equal(escapeHtml('<img src="x">&\''), "&lt;img src=&quot;x&quot;&gt;&amp;&#39;");
});

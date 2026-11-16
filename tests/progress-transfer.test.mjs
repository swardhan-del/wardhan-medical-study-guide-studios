import test from "node:test";
import assert from "node:assert/strict";
import { emptyProgress, gradeAttempt } from "../src/lib/learning-core.ts";
import { readTransfer, mergeProgress } from "../src/lib/progress-transfer.ts";

const parse = raw => readTransfer(raw, ["lesson"], ["question"], ["draft"], ["resource"]);
test("transfer rejects unrelated, malformed, unsupported and oversized files", () => {
  for (const raw of ["{", "null", "[]", '{"version":2}', JSON.stringify({format:"wardhan-study-export", version:99}), " ".repeat(1000001)]) assert.throws(() => parse(raw));
});
test("legacy and wrapped transfers validate recognised content and remove unknown identifiers", () => {
  const progress = {...emptyProgress(), lessons:["lesson", "unknown"], drafts:{draft:"My explanation", unknown:"Ignore"}};
  assert.deepEqual(parse(JSON.stringify(progress)).progress.lessons, ["lesson"]);
  const imported = parse(JSON.stringify({format:"wardhan-study-export", version:1, progress, saved:["resource", "unknown", "resource"]}));
  assert.deepEqual(imported.saved,["resource"]);
  assert.deepEqual(imported.progress.drafts,{draft:"My explanation"});
});
test("merging is repeatable without doubling activity or replacing newer work", () => {
  const earlier = gradeAttempt(undefined, false, 1000, 1);
  const later = gradeAttempt(earlier, true, 2000, 0);
  const current = {...emptyProgress(), answers:{question:later}, drafts:{draft:"Current notes"}, quizzes:3, visits:["2026-09-09"]};
  const incoming = {...emptyProgress(), answers:{question:earlier}, drafts:{draft:"Older notes"}, quizzes:2, lessons:["lesson"], visits:["2026-09-08"]};
  const merged = mergeProgress(current,incoming);
  assert.equal(merged.answers.question.lastAt,2000);
  assert.equal(merged.answers.question.firstCorrect,false);
  assert.equal(merged.drafts.draft,"Current notes");
  assert.equal(merged.quizzes,3);
  assert.deepEqual(mergeProgress(merged,incoming),merged);
  assert.deepEqual(current.lessons,[]);
  assert.equal(mergeProgress(incoming,current).answers.question.lastAt,2000);
});

test("practical stations round trip and an explicitly restarted practical stays restarted", () => {
  const id = "spinal-cord-practical";
  const current = emptyProgress();
  current.practicals[id] = { solved: [0, 1], at: 100 };
  const imported = parse(JSON.stringify(current)).progress;
  assert.deepEqual(imported.practicals[id], current.practicals[id]);

  const restarted = emptyProgress();
  restarted.practicals[id] = { solved: [], at: 200 };
  assert.deepEqual(mergeProgress(imported, restarted).practicals[id], restarted.practicals[id]);
  assert.deepEqual(mergeProgress(restarted, imported).practicals[id], restarted.practicals[id]);

  current.practicals[id] = { solved: [0, 9], at: 300 };
  assert.equal(parse(JSON.stringify(current)).progress.practicals[id], undefined);
});

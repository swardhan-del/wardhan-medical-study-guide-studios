import test from "node:test";
import assert from "node:assert/strict";
import {
  practiceSummary,
  parseProgress,
  gradeAttempt,
  renalCircuit,
  ventilationModel,
  wintersRange,
  studyPlan,
  calendarDays,
} from "../src/lib/learning-core.ts";
import {
  renalLessons,
  renalQuestions,
  renalChallengeIds,
} from "../src/content/renal-course.ts";
test("complete course has unique routes and 30 fully explained questions linked to lessons", () => {
  assert.equal(renalLessons.length, 8);
  assert.equal(renalQuestions.length, 30);
  assert.equal(new Set(renalQuestions.map((q) => q.id)).size, 30);
  assert.equal(new Set(renalLessons.map((l) => l.slug)).size, 8);
  for (const q of renalQuestions) {
    assert(renalLessons.some((l) => l.slug === q.lesson));
    assert(q.options[q.answer]);
    assert(q.options.every((o) => o.explanation.length > 20));
  }
  for (const id of renalChallengeIds)
    assert(renalQuestions.some((q) => q.id === id));
});
test("damaged, unknown and oversized browser data are safely discarded", () => {
  const ids = renalLessons.map((l) => l.slug),
    qs = renalQuestions.map((q) => q.id);
  for (const raw of ["{bad", "null", "[]", "x".repeat(100001)])
    assert.deepEqual(parseProgress(raw, ids, qs).answers, {});
  const data = parseProgress(
    JSON.stringify({
      version: 1,
      lessons: [ids[0], ids[0], "unknown"],
      visits: ["2026-02-30", "2026-09-06"],
      answers: { r01: { attempts: -1, correct: 20 } },
      plan: { date: "2026-02-30", minutes: 20 },
    }),
    ids,
    qs,
  );
  assert.deepEqual(data.lessons, [ids[0]]);
  assert.deepEqual(data.visits, ["2026-09-06"]);
  assert.deepEqual(data.answers, {});
  assert.equal(data.plan, null);
});
test("same-day corrections preserve first attempt and do not advance review", () => {
  const now = 1000000, day = 86400000;
  const wrong = gradeAttempt(undefined, false, now, 2);
  const retry = gradeAttempt(wrong, true, now + 5000, 0);
  assert.equal(retry.dueAt, now);
  assert.equal(retry.streak, 0);
  assert.equal(retry.firstCorrect, false);
  assert.equal(retry.assisted, true);
  const firstReview = gradeAttempt(retry, true, now + day + 5000, 0);
  assert.equal(firstReview.streak, 1);
  const nextReview = gradeAttempt(firstReview, true, firstReview.dueAt, 0);
  assert.equal(nextReview.streak, 2);
  assert.equal(nextReview.dueAt, firstReview.dueAt + 3 * day);
  const premature = gradeAttempt(nextReview, true, firstReview.dueAt + day, 0);
  assert.equal(premature.streak, 2);
  assert.equal(premature.dueAt, nextReview.dueAt);
  const hinted = gradeAttempt(undefined, true, now, 0, true);
  assert.equal(hinted.streak, 0);
  assert.equal(hinted.dueAt, now);
});
test("coverage and accuracy remain separate when three questions are unattempted", () => {
  const answer = gradeAttempt(undefined, true, 1000000, 0);
  assert.deepEqual(practiceSummary(["a", "b", "c", "d"], { a: answer }), { total: 4, attempted: 1, latestCorrect: 1, firstCorrect: 1, firstKnown: 1, correctedWithHelp: 0 });
});
test("legacy progress migrates without inventing first results and written drafts survive", () => {
  const legacy = { version: 1, lessons: ["kidney"], answers: { a: { attempts: 3, correct: 2, lastCorrect: true, streak: 1, dueAt: 12345 } } };
  const migrated = parseProgress(JSON.stringify(legacy), ["kidney"], ["a"]);
  assert.equal(migrated.version, 2);
  assert.equal(migrated.answers.a.attempts, 3);
  assert.equal(migrated.answers.a.firstCorrect, null);
  assert.deepEqual(migrated.lessons, ["kidney"]);
  migrated.drafts = { "oral-a": "My reasoning", unknown: "discard", long: "x".repeat(5001) };
  const restored = parseProgress(JSON.stringify(migrated), ["kidney"], ["a"], ["oral-a", "long"]);
  assert.deepEqual(restored.drafts, { "oral-a": "My reasoning" });
});
test("circuit preserves distinct flow and pressure responses and bounds input", () => {
  assert.deepEqual(renalCircuit(1, 1), { flowPercent: 100, pressure: 50 });
  assert(renalCircuit(2, 1).pressure < 50);
  assert(renalCircuit(2, 1).flowPercent < 100);
  assert(renalCircuit(1, 2).pressure > 50);
  assert(renalCircuit(1, 2).flowPercent < 100);
  assert.equal(renalCircuit(2, 2).pressure, 50);
  for (const n of [NaN, Infinity, 0, 3])
    assert.throws(() => renalCircuit(n, 1));
});
test("ventilation inverse relation and metabolic acidosis compensation examples", () => {
  assert.equal(ventilationModel(2).co2, 20);
  assert.equal(ventilationModel(0.5).co2, 80);
  assert(ventilationModel(2).ph > ventilationModel(1).ph);
  assert.deepEqual(wintersRange(12), { low: 24, high: 28 });
});
test("planner respects daily time budgets, impossible dates and calendar boundaries", () => {
  assert.equal(calendarDays("2026-03-28", "2026-03-30"), 2);
  assert.equal(studyPlan("2026-09-06", "2026-09-06", 20, renalLessons), null);
  assert.equal(studyPlan("2026-09-06", "2026-02-30", 20, renalLessons), null);
  const plan = studyPlan("2026-09-06", "2026-09-08", 10, renalLessons);
  assert.equal(plan.sessions.length, 2);
  assert(plan.unfinishedMinutes > 0);
  assert(
    plan.sessions.every(
      (s) => s.tasks.reduce((n, t) => n + t.minutes, 0) <= 10,
    ),
  );
  assert.equal(plan.sessions[1].date, "2026-09-07");
  assert.equal(
    studyPlan("2026-09-06", "2026-10-06", 20, renalLessons).unfinishedMinutes,
    0,
  );
});

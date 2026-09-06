import test from "node:test";
import assert from "node:assert/strict";
import {
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
test("wrong answers remain due and successive correct reviews get spaced", () => {
  const now = 1000000;
  const wrong = gradeAttempt(undefined, false, now);
  assert.equal(wrong.dueAt, now);
  assert.equal(wrong.streak, 0);
  const first = gradeAttempt(wrong, true, now);
  assert.equal(first.dueAt, now + 86400000);
  const second = gradeAttempt(first, true, now);
  assert.equal(second.dueAt, now + 3 * 86400000);
  const missed = gradeAttempt(second, false, now);
  assert.equal(missed.streak, 0);
  assert.equal(missed.correct, 2);
  assert.equal(missed.attempts, 4);
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

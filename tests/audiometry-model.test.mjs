import test from "node:test";
import assert from "node:assert/strict";
import { compareAudiometryThresholds, checkAudiometryDifference, readDifferenceAnswer } from "../src/lib/audiometry-model.ts";

test("separates a valid paired difference from a no-response output limit", () => {
  const measured = compareAudiometryThresholds({ frequencyHz: 1000, airDbHL: 55, boneDbHL: 20, boneNoResponseAtDbHL: null }, true);
  assert.equal(measured.kind, "same-ear"); assert.equal(measured.differenceDb, 35);
  assert.equal(checkAudiometryDifference(measured, "35", false).correct, true);
  assert.equal(checkAudiometryDifference(measured, "", true).correct, false);
  const limited = compareAudiometryThresholds({ frequencyHz: 1000, airDbHL: 95, boneDbHL: null, boneNoResponseAtDbHL: 65 }, true);
  assert.equal(limited.kind, "output-limit"); assert.equal(limited.differenceDb, null);
  assert.equal(checkAudiometryDifference(limited, "30", false).correct, false);
  assert.equal(checkAudiometryDifference(limited, "", true).correct, true);
});

test("preserves a numerical comparison without claiming an established responding ear", () => {
  const evidence = compareAudiometryThresholds({ frequencyHz: 1000, airDbHL: 60, boneDbHL: 10, boneNoResponseAtDbHL: null }, false);
  assert.equal(evidence.kind, "ear-unestablished"); assert.equal(evidence.differenceDb, 50);
  assert.equal(checkAudiometryDifference(evidence, "50", false).correct, true);
  assert.match(evidence.explanation, /Do not label this a confirmed same-ear/);
});

test("keeps absent observations separate from measured zero and negative levels", () => {
  const missing = compareAudiometryThresholds({ frequencyHz: 8000, airDbHL: 40, boneDbHL: null, boneNoResponseAtDbHL: null }, true);
  assert.equal(missing.kind, "unmeasured"); assert.equal(missing.differenceDb, null);
  const zero = compareAudiometryThresholds({ frequencyHz: 1000, airDbHL: 0, boneDbHL: 0, boneNoResponseAtDbHL: null }, true);
  assert.equal(zero.differenceDb, 0);
  const below = compareAudiometryThresholds({ frequencyHz: 1000, airDbHL: 0, boneDbHL: -5, boneNoResponseAtDbHL: null }, true);
  assert.equal(below.differenceDb, 5);
});

test("rejects conflicting or non-finite data and misleading input coercions", () => {
  assert.throws(() => compareAudiometryThresholds({ frequencyHz: 1000, airDbHL: 90, boneDbHL: 60, boneNoResponseAtDbHL: 65 }, true));
  assert.throws(() => compareAudiometryThresholds({ frequencyHz: 0, airDbHL: 10, boneDbHL: 5, boneNoResponseAtDbHL: null }, true));
  assert.throws(() => compareAudiometryThresholds({ frequencyHz: 1000, airDbHL: NaN, boneDbHL: 5, boneNoResponseAtDbHL: null }, true));
  for (const input of ["", " ", "NaN", "Infinity", "0x20", "35 dB", "1e309", "1,000"]) assert.equal(readDifferenceAnswer(input), null);
  assert.equal(readDifferenceAnswer(" 35 "), 35); assert.equal(readDifferenceAnswer("-5.5"), -5.5);
});

export type AudiometryPoint = {
  frequencyHz: number;
  airDbHL: number | null;
  boneDbHL: number | null;
  boneNoResponseAtDbHL: number | null;
};

export type DifferenceEvidence =
  | { kind: "unmeasured" | "output-limit"; differenceDb: null; explanation: string }
  | { kind: "same-ear" | "ear-unestablished"; differenceDb: number; explanation: string };

export function compareAudiometryThresholds(point: AudiometryPoint, earSpecificEstablished: boolean): DifferenceEvidence {
  if (!Number.isFinite(point.frequencyHz) || point.frequencyHz <= 0) throw new Error("A positive finite frequency is required.");
  for (const value of [point.airDbHL, point.boneDbHL, point.boneNoResponseAtDbHL]) {
    if (value !== null && !Number.isFinite(value)) throw new Error("A measurement must be finite or explicitly missing.");
  }
  if (point.boneDbHL !== null && point.boneNoResponseAtDbHL !== null) throw new Error("An exact bone threshold and a no-response limit cannot describe the same observation.");
  if (point.boneNoResponseAtDbHL !== null) return {
    kind: "output-limit", differenceDb: null,
    explanation: `No bone-conduction response was obtained at the stated ${point.boneNoResponseAtDbHL} dB HL output limit. This is not an exact bone-conduction threshold, so an exact threshold difference cannot be calculated.`,
  };
  if (point.airDbHL === null || point.boneDbHL === null) return {
    kind: "unmeasured", differenceDb: null,
    explanation: "A paired air- and bone-conduction threshold is not supplied at this frequency. Missing data are not zero and do not establish a difference.",
  };
  const differenceDb = point.airDbHL - point.boneDbHL;
  return earSpecificEstablished ? {
    kind: "same-ear", differenceDb,
    explanation: `${point.airDbHL} minus ${point.boneDbHL} gives ${differenceDb} dB. Under this fictional case's stated reliable, same-ear conditions, this is the air-bone threshold difference at ${point.frequencyHz.toLocaleString("en-US")} Hz. The subtraction alone does not identify its cause.`,
  } : {
    kind: "ear-unestablished", differenceDb,
    explanation: `The recorded values differ numerically by ${differenceDb} dB, but the responding cochlea is not established. Do not label this a confirmed same-ear air-bone gap.`,
  };
}

export function readDifferenceAnswer(input: string): number | null {
  const trimmed = input.trim();
  if (!trimmed || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(trimmed)) return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
}

export function checkAudiometryDifference(evidence: DifferenceEvidence, input: string, cannotCalculate: boolean) {
  if (evidence.differenceDb === null) return {
    correct: cannotCalculate,
    message: cannotCalculate ? `Correct: no exact paired threshold difference is available. ${evidence.explanation}` : `An exact number is not supported. ${evidence.explanation}`,
  };
  if (cannotCalculate) return { correct: false, message: `Both recorded numbers are available for subtraction. ${evidence.explanation}` };
  const answer = readDifferenceAnswer(input);
  if (answer === null) return { correct: false, message: "Enter a finite number in dB, or select that an exact numerical difference is unavailable." };
  const correct = Math.abs(answer - evidence.differenceDb) < 1e-9;
  return { correct, message: `${correct ? "The arithmetic is correct." : "Recheck air minus bone at the same frequency."} ${evidence.explanation}` };
}

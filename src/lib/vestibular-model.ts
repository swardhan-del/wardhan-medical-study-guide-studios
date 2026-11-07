export type VestibularInput = { tilt: string; ax: string; az: string };
export type VestibularVectors = { gravity: [number, number]; acceleration: [number, number]; input: [number, number] };

/** Head-fixed x-right/z-up coordinates. This is geometry, not a neural model. */
export function calculateVestibularInput(raw: VestibularInput): VestibularVectors | null {
  const values = [raw.tilt, raw.ax, raw.az];
  if (values.some(value => value.trim() === "")) return null;
  const [tilt, ax, az] = values.map(Number);
  if (![tilt, ax, az].every(Number.isFinite) || Math.abs(tilt) > 90 || Math.abs(ax) > 2 || Math.abs(az) > 2) return null;
  const angle = tilt * Math.PI / 180;
  const gravity: [number, number] = [Math.sin(angle), -Math.cos(angle)];
  return { gravity, acceleration: [ax, az], input: [gravity[0] - ax, gravity[1] - az] };
}

export function compareVestibularInputs(a: VestibularVectors, b: VestibularVectors) {
  const difference = Math.hypot(a.input[0] - b.input[0], a.input[1] - b.input[1]);
  return { difference, equal: difference < 1e-9 };
}

export function equalInputPair(): [VestibularInput, VestibularInput] {
  const angle = Math.PI / 6;
  return [{ tilt: "30", ax: "0", az: "0" }, { tilt: "0", ax: String(-Math.sin(angle)), az: String(Math.cos(angle) - 1) }];
}

export function formatVestibularDifference(value: number): string {
  return value > 0 && value < .001 ? value.toExponential(2) : value.toFixed(3);
}

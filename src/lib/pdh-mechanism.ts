export type CarbonBalance = {
  reactions: number;
  inputCarbon: number;
  acetylCarbon: number;
  carbonDioxideCarbon: number;
};

// A count of completed reactions, not a rate, pool size or kinetic simulation.
export function countPdhCarbon(raw: string): CarbonBalance | null {
  if (raw.trim() === "") return null;
  const reactions = Number(raw);
  if (!Number.isInteger(reactions) || reactions < 1 || reactions > 12) return null;
  return { reactions, inputCarbon: 3 * reactions, acetylCarbon: 2 * reactions, carbonDioxideCarbon: reactions };
}

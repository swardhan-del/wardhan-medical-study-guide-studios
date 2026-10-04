/** Original teaching layouts; these IDs are shared by validation and rendering. */
export const originalDiagramIds = [
  "chromatin-local-access", "er-folding-decisions", "gpcr-versus-rtk", "first-pass-indicator-flow",
] as const;

export const indicatorModel = { amountMg: 5, referenceFlowLMin: 5, higherFlowLMin: 10, recirculationDelayMin: 0.55 } as const;

/** An illustrative gamma transit-time density, not a patient measurement or fit.
 * Its integral is one; amount/flow therefore equals the concentration-time AUC.
 * Time is in minutes, flow in L/min and the result is baseline-corrected mg/L.
 */
export function firstPassConcentration(timeMin: number, flowLMin = indicatorModel.referenceFlowLMin as number): number {
  if (!Number.isFinite(timeMin) || !Number.isFinite(flowLMin) || flowLMin <= 0) throw new Error("Invalid illustrative curve input");
  if (timeMin <= 0) return 0;
  const transitDensity = 500 * timeMin ** 2 * Math.exp(-10 * timeMin);
  return indicatorModel.amountMg / flowLMin * transitDensity;
}

export function observedConcentration(timeMin: number): number {
  return firstPassConcentration(timeMin) + 0.45 * firstPassConcentration(timeMin - indicatorModel.recirculationDelayMin);
}

export function flowFromIndicator(amountMg: number, firstPassAucMgMinL: number): number {
  if (![amountMg, firstPassAucMgMinL].every(n => Number.isFinite(n) && n > 0)) throw new Error("Amount and first-pass AUC must be positive");
  return amountMg / firstPassAucMgMinL;
}

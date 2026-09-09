function positive(value: number, name: string) {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(name + " must be finite and positive");
}
function nonnegative(value: number, name: string) {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(name + " must be finite and nonnegative");
}
export function thinLens(focalCm: number, objectCm: number) {
  positive(focalCm, "Focal length"); positive(objectCm, "Object distance");
  if (Math.abs(objectCm - focalCm) < 1e-9) return { imageCm: null, magnification: null, kind: "parallel" as const };
  const imageCm = focalCm * objectCm / (objectCm - focalCm);
  return { imageCm, magnification: -imageCm / objectCm, kind: imageCm > 0 ? "real" as const : "virtual" as const };
}
export function transmission(layers: number) {
  nonnegative(layers, "Half-value layers");
  return 2 ** -layers;
}
export function charging(timeConstants: number) {
  nonnegative(timeConstants, "Elapsed time constants");
  return -Math.expm1(-timeConstants);
}
export function diffusionDistance(diffusionUm2PerSecond: number, seconds: number) {
  positive(diffusionUm2PerSecond, "Diffusion coefficient"); nonnegative(seconds, "Time");
  return Math.sqrt(2 * diffusionUm2PerSecond * seconds);
}
export function relativeFlow(radiusRatio: number) {
  positive(radiusRatio, "Radius ratio");
  return radiusRatio ** 4;
}
export function echoDepthCm(returnMicroseconds: number, speedMetresPerSecond = 1540) {
  nonnegative(returnMicroseconds, "Echo time"); positive(speedMetresPerSecond, "Sound speed");
  return speedMetresPerSecond * returnMicroseconds * 1e-6 / 2 * 100;
}

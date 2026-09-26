import { createHash } from "node:crypto";
import { validateMeasurement } from "./measurement-events.ts";
import type { PublicMeasurementConfig } from "./measurement-consent.ts";

type Environment = Record<string, string | undefined>;
type Configuration = { public: PublicMeasurementConfig; endpoint?: string; token?: string };
export function measurementConfig(env: Environment): Configuration {
  const off: Configuration = { public: { enabled: false } };
  // Collection is deliberately disabled on hosted previews and in local private review.
  if (env.LOCAL_CURATION_REVIEW === "1" || (env.VERCEL_ENV && env.VERCEL_ENV !== "production") || env.MEASUREMENT_PROVIDER !== "http") return off;
  const endpoint = env.MEASUREMENT_ENDPOINT, token = env.MEASUREMENT_TOKEN;
  const recipient = env.MEASUREMENT_RECIPIENT_NAME?.trim(), privacyUrl = env.MEASUREMENT_PRIVACY_URL;
  if (!endpoint || !token || /[\r\n]/.test(token) || token.length > 2000 || !recipient || recipient.length > 80 || !privacyUrl) return off;
  try {
    const url = new URL(endpoint), privacy = new URL(privacyUrl);
    for (const candidate of [url, privacy]) {
      if (candidate.protocol !== "https:" || candidate.username || candidate.password || candidate.search || candidate.hash || (candidate.port && candidate.port !== "443")) return off;
      if (!candidate.hostname.includes(".") || /^[\d.]+$/.test(candidate.hostname) || candidate.hostname.includes(":") || /(?:^|\.)(localhost|local|internal|test)$/.test(candidate.hostname)) return off;
    }
    const consentVersion = createHash("sha256").update(JSON.stringify([1, endpoint, recipient, privacyUrl, env.MEASUREMENT_POLICY_VERSION || "1"])).digest("hex").slice(0, 24);
    return { public: { enabled: true, recipient, privacyUrl: privacy.toString(), consentVersion }, endpoint: url.toString(), token };
  } catch { return off; }
}
const responseHeaders = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow", "Referrer-Policy": "no-referrer" };
const reply = (status: number) => new Response(null, { status, headers: responseHeaders });

export function measurementStatus(env: Environment): Response {
  return Response.json(measurementConfig(env).public, { headers: responseHeaders });
}
async function boundedJson(request: Request): Promise<unknown> {
  if (Number(request.headers.get("content-length")) > 512 || !request.body) throw new Error("Invalid body");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = []; let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read(); if (done) break;
      size += value.byteLength;
      if (size > 512) { await reader.cancel(); throw new Error("Invalid body"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const bytes = new Uint8Array(size); let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export async function collectMeasurement(request: Request, env: Environment, send: typeof fetch = fetch): Promise<Response> {
  const config = measurementConfig(env);
  if (!config.public.enabled) return reply(204);
  const url = new URL(request.url);
  if (url.search || request.headers.get("origin") !== url.origin || (request.headers.has("sec-fetch-site") && request.headers.get("sec-fetch-site") !== "same-origin")) return reply(403);
  if (request.headers.get("dnt") === "1" || request.headers.get("sec-gpc") === "1" || request.headers.get("x-measurement-consent") !== config.public.consentVersion) return reply(403);
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return reply(415);
  let event;
  try { event = validateMeasurement(await boundedJson(request)); } catch { return reply(400); }
  if (!event) return reply(400);
  try {
    const result = await send(config.endpoint!, {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.token}` },
      body: JSON.stringify(event), redirect: "error", cache: "no-store", signal: AbortSignal.timeout(2000),
    });
    await result.body?.cancel();
    return reply(result.ok ? 204 : 503);
  } catch { return reply(503); }
}

// Server entry points only. Never import this module from a client component.
import { validateWaitlist, WAITLIST_CONSENT_VERSION } from "./waitlist.ts";
import type { WaitlistPublicConfig } from "./waitlist.ts";

type Env = Record<string, string | undefined>;
type Config = { mode: "demo" | "unavailable" } | {
  mode: "live"; origin: string; apiKey: string; listId: number; templateId: number; siteKey: string; secret: string;
};
export function waitlistConfig(env: Env = process.env): Config {
  // Previews never enrol real people, even if credentials are inherited.
  if (env.VERCEL_ENV === "preview" || !env.WAITLIST_MODE || env.WAITLIST_MODE === "demo") return { mode: "demo" };
  if (env.WAITLIST_MODE !== "brevo") return { mode: "unavailable" };
  const listId = Number(env.BREVO_WAITLIST_LIST_ID), templateId = Number(env.BREVO_DOI_TEMPLATE_ID);
  try {
    const origin = new URL(env.WAITLIST_ORIGIN || "");
    if (origin.protocol !== "https:" || origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash ||
      !env.BREVO_API_KEY?.trim() || !env.TURNSTILE_SECRET_KEY?.trim() || !env.TURNSTILE_SITE_KEY?.trim() ||
      !Number.isSafeInteger(listId) || listId < 1 || !Number.isSafeInteger(templateId) || templateId < 1) return { mode: "unavailable" };
    return { mode: "live", origin: origin.origin, apiKey: env.BREVO_API_KEY, listId, templateId, siteKey: env.TURNSTILE_SITE_KEY, secret: env.TURNSTILE_SECRET_KEY };
  } catch { return { mode: "unavailable" }; }
}
export function publicWaitlistConfig(config: Config): WaitlistPublicConfig {
  return config.mode === "live" ? { mode: "live", siteKey: config.siteKey } : { mode: config.mode };
}
export function waitlistResponse(body: object, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex", "Referrer-Policy": "no-referrer" } });
}
async function boundedJson(request: Request) {
  const limit = 4096;
  if (Number(request.headers.get("content-length")) > limit) throw new Error("size");
  const reader = request.body?.getReader();
  if (!reader) throw new Error("body");
  const decoder = new TextDecoder();
  let bytes = 0, text = "";
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) { await reader.cancel(); throw new Error("size"); }
      text += decoder.decode(value, { stream: true });
    }
    return JSON.parse(text + decoder.decode());
  } finally { reader.releaseLock(); }
}
export async function handleWaitlist(request: Request, config = waitlistConfig(), send: typeof fetch = fetch) {
  // Do not even read a posted address when collection is disabled.
  if (config.mode !== "live") return waitlistResponse({ status: config.mode }, config.mode === "demo" ? 200 : 503);
  if (request.headers.get("origin") !== config.origin || request.headers.get("sec-fetch-site") === "cross-site")
    return waitlistResponse({ status: "error", message: "Open the waitlist on the official site and try again." }, 403);
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json")
    return waitlistResponse({ status: "error", message: "The form request could not be read. Reload and try again." }, 415);
  let data;
  try { data = await boundedJson(request); }
  catch { return waitlistResponse({ status: "error", message: "The form request could not be read. Reload and try again." }, 400); }
  if (!data || typeof data !== "object" || Array.isArray(data)) return waitlistResponse({ status: "error", message: "Invalid form request." }, 400);
  const errors = validateWaitlist(data.email, data.consent);
  if (Object.keys(errors).length) return waitlistResponse({ status: "invalid", errors }, 422);
  if (data.consentVersion !== WAITLIST_CONSENT_VERSION) return waitlistResponse({ status: "error", message: "The privacy notice has changed. Reload this page before continuing." }, 409);
  if (data.website !== "" || typeof data.token !== "string" || !data.token || data.token.length > 2048)
    return waitlistResponse({ status: "error", message: "Complete the spam-protection check and try again." }, 422);
  try {
    const check = await send("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret: config.secret, response: data.token }),
      signal: AbortSignal.timeout(8000), redirect: "error", cache: "no-store",
    });
    if (!check.ok) throw new Error("verification");
    const result = await check.json();
    if (result.success !== true || result.hostname !== new URL(config.origin).hostname || result.action !== "waitlist")
      return waitlistResponse({ status: "error", message: "The spam-protection check expired or failed. Complete a new check and try again." }, 422);
  } catch {
    return waitlistResponse({ status: "error", message: "Spam protection is temporarily unavailable. Please try again later." }, 503);
  }
  try {
    // Double opt-in only: never add a contact directly or override an unsubscribe.
    const response = await send("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
      method: "POST", headers: { "Content-Type": "application/json", "api-key": config.apiKey },
      body: JSON.stringify({ email: data.email.trim(), includeListIds: [config.listId], templateId: config.templateId, attributes: { WAITLIST_CONSENT: WAITLIST_CONSENT_VERSION, WAITLIST_REQUESTED_AT: new Date().toISOString() }, redirectionUrl: config.origin + "/waitlist/confirmation" }),
      signal: AbortSignal.timeout(8000), redirect: "error", cache: "no-store",
    });
    // The documented DOI success is 201. Do not expose provider bodies or contact state.
    if (response.status !== 201) throw new Error("provider");
    return waitlistResponse({ status: "pending" }, 202);
  } catch {
    // A timeout may occur after provider acceptance. Do not claim nothing was sent.
    return waitlistResponse({ status: "error", message: "We could not confirm that the request was accepted. If a confirmation email arrives, use its link; otherwise try again later." }, 503);
  }
}

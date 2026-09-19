import { parseVerification, type MemberState } from "./access.ts";

export type VerificationConfig = { origin?: string; apiKey?: string };
// Called only through the server-only integration. Injection is for tests, never a browser flag.
export async function verifySession(
  token: string | undefined,
  config: VerificationConfig,
  request: typeof fetch = fetch,
  now: () => number = Date.now,
): Promise<MemberState> {
  if (!token) return { kind: "anonymous" };
  if (!/^[A-Za-z0-9_-]{32,512}$/.test(token)) return { kind: "anonymous" };
  try {
    if (!config.origin || !config.apiKey || config.apiKey.length < 32) return { kind: "unavailable" };
    const origin = new URL(config.origin);
    if (origin.protocol !== "https:" || origin.username || origin.password || origin.pathname !== "/" ||
        origin.search || origin.hash) return { kind: "unavailable" };
    const response = await request(new URL("/v1/session/verify", origin), {
      method: "POST", redirect: "error", cache: "no-store", signal: AbortSignal.timeout(3000),
      headers: { "Authorization": `Bearer ${config.apiKey}`, "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify({ sessionToken: token }),
    });
    // A service 401 may mean its API key failed; only an explicit session result means signed out.
    if (response.status !== 200 || !response.headers.get("content-type")?.includes("application/json"))
      return { kind: "unavailable" };
    const body = await response.text();
    if (body.length > 64000) return { kind: "unavailable" };
    const data = JSON.parse(body);
    if (data?.state === "anonymous") return { kind: "anonymous" };
    return parseVerification(data, now());
  } catch {
    return { kind: "unavailable" };
  }
}

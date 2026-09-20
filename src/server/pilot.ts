import "server-only";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { pilotConfig } from "@/lib/pilot-config";
import type { Identity, ModuleId, PilotProvider } from "@/lib/membership-core";

import { verifyPilotIdentity } from "@/lib/pilot-identity";
export const boundedFetch: typeof fetch = (input, init) => fetch(input, {
  ...init, cache: "no-store", redirect: "error",
  signal: init?.signal ? AbortSignal.any([init.signal, AbortSignal.timeout(5000)]) : AbortSignal.timeout(5000),
});
export function config() { return pilotConfig(process.env); }
export function createAuthClient(cfg: NonNullable<ReturnType<typeof config>>, cookieMethods: {
  getAll: () => { name: string; value: string }[];
  setAll: (values: { name: string; value: string; options: CookieOptions }[]) => void;
}) {
  return createServerClient(cfg.url, cfg.key, {
    global: { fetch: boundedFetch },
    cookieOptions: { httpOnly: true, secure: cfg.secure, sameSite: "lax", path: "/" },
    cookies: cookieMethods,
  });
}
export async function authClient() {
  const cfg = config();
  if (!cfg) throw new Error("Pilot unavailable");
  const jar = await cookies();
  return createAuthClient(cfg, {
    getAll: () => jar.getAll(),
    setAll: values => { for (const { name, value, options } of values) jar.set(name, value, options); },
  });
}
export async function verifiedIdentity(client: Awaited<ReturnType<typeof authClient>>) {
  const cfg = config();
  if (!cfg) throw new Error("Pilot unavailable");
  return verifyPilotIdentity(client, cfg.emails);
}
export async function pilotProvider(): Promise<PilotProvider> {
  const cfg = config();
  if (!cfg || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Pilot unavailable");
  const auth = await authClient();
  // Keep this client separate from user cookies/Authorization. This module is server-only.
  const admin = createClient(cfg.url, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }, global: { fetch: boundedFetch },
  });
  return {
    verifyIdentity: () => verifiedIdentity(auth),
    async snapshot(identity: Identity, moduleId: ModuleId | null) {
      const result = await admin.rpc("pilot_access_snapshot", { p_user_id: identity.userId, p_session_id: identity.sessionId, p_module_id: moduleId });
      if (result.error) throw new Error("Entitlement unavailable");
      return result.data;
    },
    async download() {
      const bucket = await admin.storage.getBucket("member-pilot-private");
      if (bucket.error || !bucket.data || bucket.data.public !== false) throw new Error("Private asset unavailable");
      const result = await admin.storage.from("member-pilot-private").download("canary.txt");
      if (result.error || !result.data || result.data.size > 4096 || result.data.type !== "text/plain") throw new Error("Asset unavailable");
      return new Uint8Array(await result.data.arrayBuffer());
    },
  };
}

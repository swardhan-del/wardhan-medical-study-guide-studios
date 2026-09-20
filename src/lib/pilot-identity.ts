import type { SupabaseClient } from "@supabase/supabase-js";
import type { Identity } from "./membership-core";
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export async function verifyPilotIdentity(client: SupabaseClient, emails: readonly string[]): Promise<Identity | null> {
  const claims = await client.auth.getClaims();
  if (claims.error) {
    if (claims.error.status && claims.error.status >= 400 && claims.error.status < 500 && claims.error.status !== 429) return null;
    if (claims.error.name === "AuthSessionMissingError") return null;
    throw new Error("Identity unavailable");
  }
  if (!claims.data) return null;
  // Local JWT verification alone would not prove that Auth is available right now.
  const user = await client.auth.getUser();
  if (user.error) {
    if (user.error.status === 401 || user.error.status === 403 || user.error.name === "AuthSessionMissingError") return null;
    throw new Error("Identity unavailable");
  }
  const { sub, session_id: sessionId } = claims.data.claims;
  if (!user.data.user || user.data.user.id !== sub || typeof sub !== "string" || !uuid.test(sub) ||
      typeof sessionId !== "string" || !uuid.test(sessionId) || !user.data.user.email_confirmed_at ||
      !emails.includes(user.data.user.email?.toLowerCase() ?? "")) return null;
  return { userId: sub, sessionId };
}

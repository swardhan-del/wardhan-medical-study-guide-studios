import { cookies } from "next/headers";
import { authClient, config } from "@/server/pilot";
import { denial, html } from "@/server/pilot-response";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const cfg = config();
  if (!cfg) return denial(503);
  if (request.headers.get("origin") !== cfg.origin) return denial(403);
  let failed = false;
  try {
    const client = await authClient();
    const result = await client.auth.signOut({ scope: "local" });
    failed = Boolean(result.error);
  } catch { failed = true; }
  finally {
    const jar = await cookies();
    const prefix = `sb-${new URL(cfg.url).hostname.split(".")[0]}-auth-token`;
    for (const cookie of jar.getAll()) {
      if (cookie.name === prefix || cookie.name.startsWith(`${prefix}.`) || cookie.name === `${prefix}-code-verifier`)
        jar.set(cookie.name, "", { maxAge: 0, httpOnly: true, secure: cfg.secure, sameSite: "lax", path: "/" });
    }
    jar.set("wmss_member_session", "", { maxAge: 0, path: "/", httpOnly: true, secure: cfg.secure, sameSite: "lax" });
  }
  if (failed) return html("Sign-out could not be confirmed", "<p>Your browser session was cleared, but the account service could not confirm revocation. Please try again when it is available.</p>", 503);
  return html("You are signed out", '<p><a href="/sign-in">Sign in again</a></p>');
}

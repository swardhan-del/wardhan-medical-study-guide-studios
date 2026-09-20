import { config } from "@/server/pilot";
import { denial, html } from "@/server/pilot-response";
import { privateHeaders } from "@/lib/membership-core";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(request: Request) {
  const cfg = config();
  if (!cfg) return denial(503);
  // A PKCE verifier cookie and callback must use the same explicitly approved origin.
  if (new URL(request.url).origin !== cfg.origin)
    return new Response(null, { status: 303, headers: { ...privateHeaders, Location: `${cfg.origin}/sign-in` } });
  return html("Sign in to the pilot", '<p>Use your invited email address. We will send a one-time sign-in link. Registration is closed.</p><form method="post" action="/auth/sign-in"><label for="email">Email address</label><input id="email" name="email" type="email" autocomplete="email" required maxlength="254"><button type="submit">Send sign-in link</button></form>');
}

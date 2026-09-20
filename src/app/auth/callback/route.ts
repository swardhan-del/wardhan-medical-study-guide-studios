import { authClient, config, verifiedIdentity } from "@/server/pilot";
import { denial } from "@/server/pilot-response";
import { privateHeaders } from "@/lib/membership-core";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(request: Request) {
  const cfg = config(), url = new URL(request.url);
  if (!cfg) return denial(503);
  if (url.origin !== cfg.origin || url.searchParams.getAll("code").length !== 1) return denial(401);
  const code = url.searchParams.get("code");
  if (!code || code.length > 2048) return denial(401);
  try {
    const client = await authClient();
    const exchanged = await client.auth.exchangeCodeForSession(code);
    if (exchanged.error) return denial(exchanged.error.status && exchanged.error.status < 500 ? 401 : 503);
    if (!await verifiedIdentity(client)) {
      await client.auth.signOut({ scope: "local" });
      return denial(401);
    }
    return new Response(null, { status: 303, headers: { ...privateHeaders, Location: `${cfg.origin}/member` } });
  } catch { return denial(503); }
}

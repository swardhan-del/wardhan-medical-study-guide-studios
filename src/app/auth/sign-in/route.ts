import { authClient, config } from "@/server/pilot";
import { denial, html } from "@/server/pilot-response";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const cfg = config();
  if (!cfg) return denial(503);
  if (request.headers.get("origin") !== cfg.origin) return denial(403);
  if (!request.headers.get("content-type")?.startsWith("application/x-www-form-urlencoded")) return denial(403);
  try {
    // Read with a hard cap even if Content-Length is missing or dishonest.
    const reader = request.body?.getReader();
    if (!reader) return denial(403);
    let raw = "", size = 0;
    for (;;) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.length;
      if (size > 1024) { await reader.cancel(); return denial(403); }
      raw += new TextDecoder().decode(chunk.value);
    }
    const fields = new URLSearchParams(raw);
    const email = (fields.get("email") ?? "").trim().toLowerCase();
    if (fields.getAll("email").length === 1 && cfg.emails.includes(email)) {
      const client = await authClient();
      const result = await client.auth.signInWithOtp({ email, options: { shouldCreateUser: false, emailRedirectTo: `${cfg.origin}/auth/callback` } });
      if (result.error) return denial(503);
    }
    return html("Check your email", "<p>If this address is invited, a sign-in link will arrive shortly. Open it in this browser.</p>");
  } catch { return denial(503); }
}

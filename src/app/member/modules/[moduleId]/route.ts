import { isModuleId, pilotModules } from "@/lib/membership-core";
import { asset, denial, escapeHtml, html } from "@/server/pilot-response";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET(_request: Request, { params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = await params;
  if (!isModuleId(moduleId)) return html("Page not found", "<p>This module is not available.</p>", 404);
  const result = await asset(moduleId);
  if (!result.allowed) return denial(result.status);
  return html(pilotModules[moduleId].label, `<p>Synthetic pilot content only.</p><pre>${escapeHtml(new TextDecoder().decode(result.bytes))}</pre><p><a href="/api/member/assets/${pilotModules[moduleId].asset}">Open synthetic canary</a></p><form action="/auth/sign-out" method="post"><button type="submit">Sign out</button></form>`);
}

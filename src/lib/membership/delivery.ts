import { accessMessages, moduleAccess, type MemberState } from "./access.ts";
import { pilotModules } from "./catalog.ts";
export const privateHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
  "X-Content-Type-Options": "nosniff",
};
export async function deliverAsset(
  assetId: string,
  getState: () => Promise<MemberState>,
  readAsset: (assetId: string) => Promise<string>,
): Promise<Response> {
  const entry = pilotModules.find(item => item.assetId === assetId);
  if (!entry) return new Response("Not found", { status: 404, headers: privateHeaders });
  const access = moduleAccess(await getState(), entry.id);
  if (!access.allowed) return new Response(accessMessages[access.reason], {
    status: access.reason === "sign-in" ? 401 : access.reason === "unavailable" ? 503 : 403,
    headers: privateHeaders,
  });
  try {
    // No object URL or arbitrary path from the request is ever read or returned.
    return new Response(await readAsset(assetId), { headers: {
      ...privateHeaders, "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${assetId}.txt"`,
    } });
  } catch {
    return new Response("This download is temporarily unavailable.", { status: 503, headers: privateHeaders });
  }
}

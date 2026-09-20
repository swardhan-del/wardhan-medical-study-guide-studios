import "server-only";
import { accessDecision } from "@/lib/membership-core";
import { getMemberSession } from "@/lib/member-session";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const privateHeaders = {
  "Cache-Control": "private, no-store",
  "Vary": "Cookie",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assetId: string }> },
) {
  const decision = accessDecision({ session: await getMemberSession(), requiredTier: "basic" });
  if (!decision.allowed)
    return Response.json({ error: "Access denied" }, { status: decision.status, headers: privateHeaders });

  // Authorize before resolving the fixed pilot ID; never accept a filesystem path.
  const { assetId } = await params;
  if (assetId !== "membership-foundation-pilot")
    return Response.json({ error: "Not found" }, { status: 404, headers: privateHeaders });

  return new Response("WMSS_SYNTHETIC_MEMBERSHIP_PILOT: access-control check only. No teaching material.\n", {
    headers: { ...privateHeaders, "Content-Type": "text/plain; charset=utf-8" },
  });
}

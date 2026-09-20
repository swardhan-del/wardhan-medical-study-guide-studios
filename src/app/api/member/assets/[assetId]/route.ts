import "server-only";
import { privateHeaders, pilotModules, type ModuleId } from "@/lib/membership-core";
import { asset } from "@/server/pilot-response";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ assetId: string }> },
) {
  const { assetId } = await params;
  const moduleId = (Object.keys(pilotModules) as ModuleId[]).find(id => pilotModules[id].asset === assetId);
  if (!moduleId)
    return Response.json({ error: "Not found" }, { status: 404, headers: privateHeaders });
  const result = await asset(moduleId);
  if (!result.allowed)
    return Response.json({ error: result.status === 503 ? "Temporarily unavailable" : "Access denied" }, { status: result.status, headers: privateHeaders });
  return new Response(Buffer.from(result.bytes), {
    headers: { ...privateHeaders, "Content-Type": "text/plain; charset=utf-8" },
  });
}

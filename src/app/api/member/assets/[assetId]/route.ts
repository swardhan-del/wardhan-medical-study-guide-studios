import { getMemberAsset } from "@/server/member-content";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(_request: Request, context: { params: Promise<{ assetId: string }> }) {
  return getMemberAsset((await context.params).assetId);
}

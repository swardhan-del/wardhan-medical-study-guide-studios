import "server-only";
import { moduleAccess } from "@/lib/membership/access";
import { findPilotModule } from "@/lib/membership/catalog";
import { deliverAsset } from "@/lib/membership/delivery";
import { getMemberState } from "./membership";

// Synthetic sentinel content only. Real lessons and storage migration require separate approval.
const content = {
  "synthetic-foundation": "WARDHAN_SYNTHETIC_FOUNDATION_BODY: This is a synthetic access-check lesson, with no medical teaching content.",
  "synthetic-deeper": "WARDHAN_SYNTHETIC_DEEPER_BODY: This is a synthetic deeper-module access check, with no medical teaching content.",
};
const downloads = {
  "synthetic-foundation-download": "WARDHAN_SYNTHETIC_FOUNDATION_ASSET: Synthetic foundation download. No medical source material.",
  "synthetic-deeper-download": "WARDHAN_SYNTHETIC_DEEPER_ASSET: Synthetic deeper-module download. No medical source material.",
};
export async function getMemberLesson(moduleId: string) {
  const entry = findPilotModule(moduleId);
  if (!entry) return { access: { allowed: false, reason: "not-found" } as const };
  const access = moduleAccess(await getMemberState(), entry.id);
  if (!access.allowed) return { access };
  return { access, module: entry, body: content[entry.id] };
}
export function getMemberAsset(assetId: string) {
  return deliverAsset(assetId, getMemberState, async id => {
    if (!Object.hasOwn(downloads, id)) throw new Error("Unknown asset");
    return downloads[id as keyof typeof downloads];
  });
}

import "server-only";
import { cookies } from "next/headers";
import { verifyMemberSession } from "@/lib/membership-core";

export async function getMemberSession() {
  const cookieStore = await cookies();
  // Read only the signed cookie; no browser-provided tier or header fallback.
  const sessions = cookieStore.getAll("wmss_member_session");
  if (sessions.length !== 1) return null;
  return verifyMemberSession(sessions[0].value, process.env.MEMBERSHIP_SESSION_SECRET);
}

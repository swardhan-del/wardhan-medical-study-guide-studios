import "server-only";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/membership/provider";
export const SESSION_COOKIE = "__Host-wardhan-session";
export async function getMemberState() {
  const tokens = (await cookies()).getAll(SESSION_COOKIE);
  if (tokens.length > 1) return { kind: "anonymous" } as const;
  return verifySession(tokens[0]?.value, {
    origin: process.env.MEMBERSHIP_VERIFIER_ORIGIN,
    apiKey: process.env.MEMBERSHIP_VERIFIER_API_KEY,
  });
}

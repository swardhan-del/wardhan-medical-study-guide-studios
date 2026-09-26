import { handleWaitlist, publicWaitlistConfig, waitlistConfig, waitlistResponse } from "@/lib/waitlist-server";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export function GET() { return waitlistResponse(publicWaitlistConfig(waitlistConfig())); }
export async function POST(request: Request) { return handleWaitlist(request); }

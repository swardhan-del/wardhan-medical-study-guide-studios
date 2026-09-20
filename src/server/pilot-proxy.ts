import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { config, createAuthClient } from "@/server/pilot";
import { privateHeaders } from "@/lib/membership-core";

export async function refreshPilotCookies(request: NextRequest) {
  const cfg = config();
  let response = NextResponse.next({ request });
  if (cfg && !request.nextUrl.pathname.startsWith("/auth/")) {
    const client = createAuthClient(cfg, {
      getAll: () => request.cookies.getAll(),
      setAll: values => {
        for (const { name, value } of values) request.cookies.set(name, value);
        response = NextResponse.next({ request });
        for (const { name, value, options } of values) response.cookies.set(name, value, options);
      },
    });
    // Refresh only. Every protected route independently verifies Auth and Postgres.
    try { await client.auth.getClaims(); } catch { /* The route returns a generic denial. */ }
  }
  for (const [key, value] of Object.entries(privateHeaders)) response.headers.set(key, value);
  return response;
}

import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/server/membership";
import { privateHeaders } from "@/lib/membership/delivery";
// Local cookie clearing only. Provider-wide session revocation belongs to the future account adapter.
export async function POST(request: Request) {
  const protocol = process.env.VERCEL ? "https:" : new URL(request.url).protocol;
  const expectedOrigin = `${protocol}//${request.headers.get("host")}`;
  if (request.headers.get("origin") !== expectedOrigin)
    return new Response("Forbidden", { status: 403, headers: privateHeaders });
  const response = new NextResponse(null, { status: 303, headers: { Location: "/account" } });
  response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: true, sameSite: "lax", path: "/", maxAge: 0 });
  for (const [key, value] of Object.entries(privateHeaders)) response.headers.set(key, value);
  return response;
}

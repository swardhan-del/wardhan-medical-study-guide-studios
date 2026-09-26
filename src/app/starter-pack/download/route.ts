import { starterPackDocument } from "@/lib/starter-pack";
import { getSiteUrl } from "@/lib/site-url";
export const dynamic = "force-static";
export function GET() {
  return new Response(starterPackDocument(getSiteUrl()), { headers: {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Disposition": 'attachment; filename="wardhan-study-guide-starter-pack.html"',
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'",
  } });
}

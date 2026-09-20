import { pilotModules, type ModuleId } from "@/lib/membership-core";
import { checkAccess, denial, html } from "@/server/pilot-response";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export async function GET() {
  const decision = await checkAccess(null);
  if (!decision.allowed) return denial(decision.status);
  const links: string[] = [];
  for (const moduleId of Object.keys(pilotModules) as ModuleId[]) {
    const access = await checkAccess(moduleId);
    if (access.status === 503 || access.status === 401) return denial(access.status);
    links.push(`<li><a href="/member/modules/${moduleId}">${pilotModules[moduleId].label}</a> — ${access.allowed ? "Available" : "Locked"}</li>`);
  }
  return html("Your pilot modules", `<p>This private preview contains synthetic access checks only. No teaching material is available here.</p><ul>${links.join("")}</ul><form action="/auth/sign-out" method="post"><button type="submit">Sign out</button></form>`);
}

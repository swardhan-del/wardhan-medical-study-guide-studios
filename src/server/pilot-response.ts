import "server-only";
import { authorizePilot, privateHeaders, readPilotAsset, type ModuleId } from "@/lib/membership-core";
import { pilotProvider } from "@/server/pilot";

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
}
export function html(title: string, body: string, status = 200) {
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${escapeHtml(title)} · Wardhan Study</title><style>body{margin:0;background:#f7f5ef;color:#142f30;font:18px/1.65 system-ui,sans-serif}main,nav{max-width:850px;margin:auto;padding:24px}nav{display:flex;flex-wrap:wrap;gap:20px;border-bottom:1px solid #ccc}a{color:#11645a}h1{font-size:clamp(2rem,6vw,3.2rem);line-height:1.15}input,button{font:inherit;padding:12px;max-width:100%;box-sizing:border-box}input{width:100%;margin:8px 0 20px}button{background:#164b44;color:white;border:0;border-radius:5px;cursor:pointer}li{margin:16px 0}pre{white-space:pre-wrap;overflow-wrap:anywhere;padding:20px;background:#fff}label{display:block}form{max-width:520px}a:focus-visible,button:focus-visible,input:focus-visible{outline:3px solid #ba6519;outline-offset:4px}</style></head><body><nav aria-label="Primary navigation"><a href="/">Wardhan Study</a><a href="/membership">Membership</a><a href="/member">Member area</a></nav><main><h1>${escapeHtml(title)}</h1>${body}</main></body></html>`, {
    status, headers: { ...privateHeaders, "Content-Type": "text/html; charset=utf-8", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'" },
  });
}
export function denial(status: 401 | 403 | 503) {
  return html(status === 401 ? "Sign in to continue" : status === 403 ? "Module locked" : "Member access is temporarily unavailable", status === 401
    ? '<p>Use your invited pilot account to continue.</p><p><a href="/sign-in">Sign in</a></p>'
    : status === 403 ? '<p>Your account does not currently have access to this module.</p><p><a href="/member">Return to the member area</a></p>'
    : '<p>Please try again later.</p>', status);
}
export async function checkAccess(moduleId: ModuleId | null) {
  try { return await authorizePilot(await pilotProvider(), moduleId); }
  catch { return { allowed: false as const, status: 503 as const }; }
}
export async function asset(moduleId: ModuleId) {
  try { return await readPilotAsset(await pilotProvider(), moduleId); }
  catch { return { allowed: false as const, status: 503 as const }; }
}

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";
const marker = "WMSS_PRIVATE_CANARY_";
function walk(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]);
}
const files = [...walk("public"), ...walk(".next/static"), ...walk("src/content"),
  ...walk(".next/server/app").filter(p => /\.(?:html|rsc|body)$/.test(p))];
for (const path of files) {
  const content = readFileSync(path);
  assert.ok(!content.includes(marker), `Protected marker in ${path}`);
  assert.ok(!content.includes("SUPABASE_SERVICE_ROLE_KEY"), `Server key reference in ${path}`);
  const secret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (secret) assert.ok(!content.includes(secret), `Server credential in ${path}`);
}
const prerender = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
assert.ok(!Object.keys(prerender.routes).some(p => /^\/(?:member(?:\/|$)|api\/member|auth\/|sign-in)/.test(p)), "Protected route was prerendered");
console.log(`Pilot leak check passed across ${files.length} public/client/prerender/content artifacts.`);

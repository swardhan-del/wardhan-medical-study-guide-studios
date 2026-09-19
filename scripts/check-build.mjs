import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
const root = ".next/server";
for (const path of readdirSync(root, { recursive: true })) {
  if (!statSync(join(root, String(path))).isFile()) continue;
  if (String(path).endsWith(".nft.json")) {
    const trace = JSON.parse(readFileSync(join(root, String(path)), "utf8"));
    if (trace.files.some((file) => /(^|[\\/])\.private[\\/]/.test(file)))
      throw new Error("Private curation data entered a deployment trace.");
  }
  if (
    /\.(html|rsc|txt)$/.test(String(path)) &&
    /https?:[^\s<>]*dropbox|original_dropbox_path|destination_dropbox_path|study%20guide/i.test(
      readFileSync(join(root, String(path)), "utf8"),
    )
  )
    throw new Error("Private archive information in rendered output: " + path);
}
console.log("Deployment trace and rendered privacy checks passed.");

// Protected synthetic payloads may exist in server code, never public HTML/RSC or client bundles.
for (const directory of [".next/static", ".next/server/app", "public"]) {
  for (const path of readdirSync(directory, { recursive: true })) {
    const fullPath = join(directory, String(path));
    if (!statSync(fullPath).isFile()) continue;
    if (directory === ".next/server/app" && !/\.(html|rsc|txt|json)$/.test(String(path))) continue;
    if (/WARDHAN_SYNTHETIC_(?:FOUNDATION|DEEPER)_(?:BODY|ASSET)/.test(readFileSync(fullPath, "utf8")))
      throw new Error("Protected pilot payload in public build output: " + fullPath);
  }
}
const prerender = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
for (const route of Object.keys(prerender.routes)) {
  if (/^\/(?:member|account|api\/member)(?:\/|$)/.test(route))
    throw new Error("Member route was prerendered: " + route);
}
console.log("Protected pilot payloads excluded from static pages, public assets and client bundles.");

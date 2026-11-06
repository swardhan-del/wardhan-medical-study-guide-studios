import { containsPrivateReference } from "../src/lib/content-quality.ts";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
const buildDir = process.env.STUDY_BUILD_DIR || ".next";
const root = join(buildDir, "server");
for (const path of readdirSync(root, { recursive: true })) {
  if (!statSync(join(root, String(path))).isFile()) continue;
  if (String(path).endsWith(".html")) {
    const html = readFileSync(join(root, String(path)), "utf8");
    for (const match of html.matchAll(/\/_next\/(static\/[^"<>?\\\s]+\.(?:js|css))/g)) {
      if (!existsSync(join(buildDir, match[1])))
        throw new Error(`Rendered page ${path} references a missing build asset: ${match[1]}`);
    }
  }
  if (String(path).endsWith(".nft.json")) {
    const trace = JSON.parse(readFileSync(join(root, String(path)), "utf8"));
    if (trace.files.some((file) => /(^|[\\/])\.private[\\/]/.test(file)))
      throw new Error("Private curation data entered a deployment trace.");
  }
  if (
    /\.(html|rsc|txt)$/.test(String(path)) &&
    (containsPrivateReference(readFileSync(join(root, String(path)), "utf8")) || /https?:[^\s<>]*dropbox|original_dropbox_path|destination_dropbox_path|study%20guide/i.test(
      readFileSync(join(root, String(path)), "utf8"),
    ))
  )
    throw new Error("Private archive information in rendered output: " + path);
}
console.log("Deployment trace, rendered privacy and static asset reference checks passed.");

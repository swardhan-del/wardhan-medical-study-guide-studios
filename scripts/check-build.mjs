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

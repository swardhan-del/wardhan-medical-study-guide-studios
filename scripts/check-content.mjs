import { createHash } from "node:crypto";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { validateCatalog } from "./catalog-schema.mjs";
if (process.env.VERCEL && process.env.LOCAL_CURATION_REVIEW === "1")
  throw new Error("Local curation review must never be enabled on Vercel.");
const catalog = validateCatalog(
  JSON.parse(
    readFileSync(
      new URL("../src/content/public-catalog.json", import.meta.url),
      "utf8",
    ),
  ),
);
const publicDir = new URL("../public", import.meta.url);
const entries = existsSync(publicDir)
  ? readdirSync(publicDir, { recursive: true })
  : [];
const learningAssets = JSON.parse(
  readFileSync(
    new URL("../src/content/public-learning-assets.json", import.meta.url),
    "utf8",
  ),
).assets;
for (const asset of learningAssets) {
  if (
    asset.kind !== "original-web-revision-sheet" ||
    !/^downloads\/[a-z0-9-]+\.pdf$/.test(asset.path)
  )
    throw new Error("Invalid public learning asset path or kind");
  const bytes = readFileSync(
    new URL(asset.path, new URL("../public/", import.meta.url)),
  );
  if (createHash("sha256").update(bytes).digest("hex") !== asset.sha256)
    throw new Error(
      "Released learning asset changed; review and update its hash",
    );
}
if (
  entries.some(
    (name) =>
      /\.(pdf|docx|pptx|xlsx|zip)$/i.test(String(name).replaceAll("\\", "/")) &&
      !learningAssets.some(
        (asset) => asset.path === String(name).replaceAll("\\", "/"),
      ),
  )
)
  throw new Error(
    "Do not bundle study source documents in public/. Use an explicitly released external file URL.",
  );
console.log(
  `Content checks passed: ${catalog.records.length} public records; ${learningAssets.length} explicitly released revision sheet; no bundled private study documents.`,
);

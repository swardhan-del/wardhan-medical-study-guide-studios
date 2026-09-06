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
if (entries.some((name) => /\.(pdf|docx|pptx|xlsx|zip)$/i.test(String(name))))
  throw new Error(
    "Do not bundle study source documents in public/. Use an explicitly released external file URL.",
  );
console.log(
  `Content checks passed: ${catalog.records.length} public records; no bundled study documents.`,
);

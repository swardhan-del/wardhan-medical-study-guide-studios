import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { notFound } from "next/navigation";
import type { CatalogRecord } from "./catalog-types";
// This is an opt-in, loopback-only development review, NOT authentication.
// Vercel builds also reject the flag in scripts/check-content.mjs.
export async function getLocalReview(): Promise<CatalogRecord[]> {
  if (process.env.VERCEL || process.env.LOCAL_CURATION_REVIEW !== "1")
    notFound();
  try {
    const data = JSON.parse(
      await readFile(join(process.cwd(), ".private/catalog.json"), "utf8"),
    );
    if (data.version !== 1 || !Array.isArray(data.records))
      throw new Error("Invalid local catalog.");
    return data.records;
  } catch {
    throw new Error(
      "Run npm run content:import with the curated folder before opening local review.",
    );
  }
}

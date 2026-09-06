import "server-only";
import data from "@/content/public-catalog.json";
import type { CatalogRecord } from "./catalog-types";
export const publicCatalog = data.records as CatalogRecord[];
export function getPublicRecord(id: string) {
  return publicCatalog.find((record) => record.id === id);
}

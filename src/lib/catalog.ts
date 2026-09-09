import "server-only";
import searchIndex from "@/content/public-search.json";
import data from "@/content/public-catalog.json";
import type { CatalogRecord } from "./catalog-types";
export const publicCatalog: CatalogRecord[] = data.records.map(record => ({ ...record, searchText: (searchIndex as Record<string, string>)[record.id] ?? "" })) as CatalogRecord[];
export function getPublicRecord(id: string) {
  return publicCatalog.find((record) => record.id === id);
}

"use client";
import { CatalogBrowser } from "./catalog-browser";
import { ReadingListNotice } from "./reading-list-provider";
import type { CatalogRecord } from "@/lib/catalog-types";

export function SavedLearning({ records }: { records: CatalogRecord[] }) {
  return (
    <section
      id="saved-learning"
      className="saved-learning"
      aria-labelledby="saved-learning-title"
    >
      <h2 id="saved-learning-title">Your saved resources</h2>
      <ReadingListNotice />
      <CatalogBrowser records={records} savedOnly />
    </section>
  );
}

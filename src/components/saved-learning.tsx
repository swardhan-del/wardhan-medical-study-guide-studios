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
      <p className="eyebrow">Your saved learning</p>
      <h2 id="saved-learning-title">Lessons and activities for later</h2>
      <ReadingListNotice />
      <CatalogBrowser records={records} savedOnly />
    </section>
  );
}

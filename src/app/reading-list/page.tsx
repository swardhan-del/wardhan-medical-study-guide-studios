import { CatalogBrowser } from "@/components/catalog-browser";
import { ReadingListNotice } from "@/components/reading-list-provider";
import { publicCatalog } from "@/lib/catalog";
export const metadata = {
  title: "Reading list",
  robots: { index: false, follow: true },
};
export default function ReadingListPage() {
  return (
    <div className="site-container library-page">
      <header className="library-heading">
        <p className="eyebrow">Your study space</p>
        <h1>Pick up where you left off.</h1>
        <ReadingListNotice />
      </header>
      <CatalogBrowser records={publicCatalog} savedOnly />
    </div>
  );
}

import { CatalogBrowser } from "@/components/catalog-browser";
import { getLocalReview } from "@/lib/local-review";
export const dynamic = "force-dynamic";
export const metadata = {
  title: "Local collection review",
  robots: { index: false, follow: false },
};
export default async function ReviewPage() {
  const records = await getLocalReview();
  return (
    <div className="site-container library-page">
      <header className="library-heading">
        <p className="eyebrow">
          Local collection review · September 2, 2026 snapshot
        </p>
        <h1>The curated collection.</h1>
        <p className="interior-lede">
          {records.length} private records brought together for review. These
          editions have not been released to the public library.
        </p>
      </header>
      <CatalogBrowser records={records} basePath="/review" />
    </div>
  );
}

import { CatalogBrowser } from "@/components/catalog-browser";
import { publicCatalog } from "@/lib/catalog";
export const metadata = {
  title: "Library",
  description:
    "Browse released medical study guides, divided volumes, and teaching resources.",
  alternates: { canonical: "/library" },
};
export default function LibraryPage() {
  return (
    <div className="site-container library-page">
      <header className="library-heading">
        <p className="eyebrow">Study library</p>
        <h1>Find your next chapter.</h1>
        <p className="interior-lede">
          Browse by subject and format, then save resources for your next study
          session.
        </p>
      </header>
      <CatalogBrowser records={publicCatalog} />
    </div>
  );
}

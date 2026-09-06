import { LearningCollection } from "@/components/learning-collection";
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
          Start a lesson, explore a model, or test your understanding. The free
          renal course is ready to use.
        </p>
      </header>
      <LearningCollection />
      {publicCatalog.length > 0 && (
        <section className="study-stack">
          <h2>Released guide downloads</h2>
          <CatalogBrowser records={publicCatalog} />
        </section>
      )}
    </div>
  );
}

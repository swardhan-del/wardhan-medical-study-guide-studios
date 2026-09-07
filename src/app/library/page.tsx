import { librarySubjects, subjectRecords } from "@/lib/taxonomy";
import Link from "next/link";
import { subjectInterests } from "@/content/subjects";
import { CatalogBrowser } from "@/components/catalog-browser";
import { publicCatalog } from "@/lib/catalog";
export const metadata = {
  title: "Library",
  description:
    "Study anatomy, histology, cell biology, biochemistry, physiology and genetics with source-based lessons, explained questions and interactive practice.",
  alternates: { canonical: "/library" },
};
export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; q?: string }>;
}) {
  const filters = await searchParams;
  const subject =
    typeof filters.subject === "string" &&
    subjectInterests.some((s) => s.id === filters.subject)
      ? filters.subject
      : "";
  const query = typeof filters.q === "string" ? filters.q.slice(0, 200) : "";
  return (
    <div className="site-container library-page">
      <header className="library-heading">
        <p className="eyebrow">Study library</p>
        <h1>Find your next chapter.</h1>
        <p className="interior-lede">
          {publicCatalog.length} resources across six medical sciences. Open a
          source-based lesson, test a concept, or save your next study session.
        </p>
      </header>
      <nav
        className="library-subjects"
        aria-label="Explore subjects and topics"
      >
        {librarySubjects
          .filter((s) => subjectRecords(s.id).length > 0)
          .map((s) => (
            <Link key={s.id} href={"/subjects/" + s.id}>
              {s.title}
            </Link>
          ))}
      </nav>
      <p>
        <Link className="text-link" href="/videos">
          Browse the video library →
        </Link>
      </p>
      <CatalogBrowser
        key={`${subject}:${query}`}
        records={publicCatalog}
        initialSubject={subject}
        initialQuery={query}
        showSubjectNavigation
      />
      <aside className="library-source-note">
        <p className="eyebrow">From the study guides to your next question</p>
        <h2>Read. Connect. Recall.</h2>
        <p>
          Each new lesson names its guide and source section, explains three
          connected ideas, and includes an original question plus an oral-recall
          prompt. Save a resource to return to it in My Study.
        </p>
        <Link href="/study#saved-learning" className="text-link">
          Open my saved learning →
        </Link>
      </aside>
    </div>
  );
}

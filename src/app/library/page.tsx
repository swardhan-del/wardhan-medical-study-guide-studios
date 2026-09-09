import { librarySubjects, subjectRecords } from "@/lib/taxonomy";
import Link from "next/link";
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
    librarySubjects.some((s) => s.id === filters.subject)
      ? filters.subject
      : "";
  const query = typeof filters.q === "string" ? filters.q.slice(0, 200) : "";
  return (
    <div className="site-container library-page">
      <header className="library-heading">
        <p className="eyebrow">Study library</p>
        <h1>Find the topic you need</h1>
        <p className="interior-lede">
          Browse lessons, practice activities, and available revision resources. Search for a topic or filter by subject and format.
        </p>
      </header>
      <CatalogBrowser key={`${subject}:${query}`} records={publicCatalog} initialSubject={subject} initialQuery={query} />
      <details className="study-details"><summary>Subject directories and video recaps</summary>
      <nav className="library-subjects" aria-label="Explore subjects and topics">
        {librarySubjects.filter(s => subjectRecords(s.id).length > 0).map(s => <Link key={s.id} href={"/subjects/" + s.id}>{s.title}</Link>)}
      </nav><Link href="/videos">Browse the video library →</Link></details>
      <aside className="library-source-note">
        <p className="eyebrow">Study and revise</p>
        <h2>Read. Connect. Recall.</h2>
        <p>
          Use the explanations, practice questions and available source notes as you study. Save useful resources to return to them in My Study.
        </p>
        <Link href="/study#saved-learning" className="text-link">
          Open My Study →
        </Link>
      </aside>
    </div>
  );
}

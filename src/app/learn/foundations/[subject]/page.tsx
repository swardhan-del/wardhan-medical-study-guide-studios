import { SearchBreadcrumbs } from "@/components/search-breadcrumbs";
import { StructuredData } from "@/components/structured-data";
import { lessonSchema } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/site-url";
import { subjectInterests } from "@/content/subjects";
import { searchMetadata } from "@/lib/search-metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { foundations } from "@/content/foundations";
import { studyPaths } from "@/content/study-paths";
type Props = { params: Promise<{ subject: string }> };
export function generateStaticParams() { return Object.keys(foundations).map(subject => ({ subject })); }
export async function generateMetadata({ params }: Props) {
  const { subject } = await params;
  return searchMetadata(`/learn/foundations/${subject}`);
}
export default async function FoundationPage({ params }: Props) {
  const { subject } = await params, f = foundations[subject]; if (!f) notFound();
  return <article className="site-container study-page foundation-page">
    <SearchBreadcrumbs items={[{ name: "Library", href: "/library" }, { name: subjectInterests.find(s => s.id === subject)!.title, href: `/study/${subject}` }, { name: f.title, href: `/learn/foundations/${subject}` }]} />
    <StructuredData data={lessonSchema({ path: `/learn/foundations/${subject}`, title: f.title, summary: f.introduction, citation: f.source }, getSiteUrl())} />
    <header className="study-hero"><p className="eyebrow">Before your first lesson</p><h1>{f.title}</h1><p className="interior-lede">{f.introduction}</p></header>
    <section className="study-panel"><h2>Words to use precisely</h2><dl className="foundation-terms">{f.terms.map(([term, definition]) => <div key={term}><dt>{term}</dt><dd>{definition}</dd></div>)}</dl></section>
    <section className="study-panel"><h2>Work through one distinction</h2><p>{f.example}</p><h3>Explain it without looking</h3><p>{f.prompt}</p><details><summary>Compare your explanation</summary><p>{f.answer}</p></details></section>
    <p><Link className="button button-primary" href={`/library/${studyPaths[subject].start}`}>Begin the first lesson</Link></p><p><Link href={`/study/${subject}`}>Choose another lesson in this subject</Link></p>
    <footer className="muted-note"><p>Original introductory teaching notes, 9 September 2026. <a href={f.source}>Read the supporting reference</a>. Specific lesson sources provide further detail. AI-assisted preparation; independent subject review has not been completed.</p></footer>
  </article>;
}

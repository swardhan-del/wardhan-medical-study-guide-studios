import Link from "next/link";
import { topicGuides } from "@/content/topic-guides";
import { searchMetadata } from "@/lib/search-metadata";
import { SearchBreadcrumbs } from "@/components/search-breadcrumbs";

export const metadata = searchMetadata("/learn/topics");
export default function TopicSequences() {
  return <article className="site-container study-page">
    <SearchBreadcrumbs items={[{ name: "Library", href: "/library" }, { name: "Guided topic sequences", href: "/learn/topics" }]} />
    <header className="study-hero"><p className="eyebrow">Study across connected lessons</p><h1>Guided medical-science topic sequences</h1><p className="interior-lede">Choose a focused question, work through the published lessons in order and check whether you can explain the connections.</p><p>Each sequence gives you preparation advice, a study method and a review task. Open the full lessons for labelled visuals, answer explanations and source references. These sequences complement your official course material; they are not a complete syllabus.</p></header>
    <div className="resource-grid">{topicGuides.map(guide => <section className="resource-card" key={guide.slug}><p className="eyebrow">{guide.stages.length} connected lessons</p><h2><Link href={`/learn/topics/${guide.slug}`}>{guide.title}</Link></h2><p>{guide.summary}</p><p>{guide.audience}</p><Link className="text-link" href={`/learn/topics/${guide.slug}`}>Follow this sequence →</Link></section>)}</div>
    <p>Looking for a different topic? <Link href="/library">Search the complete study library</Link> or <Link href="/subjects">browse by subject</Link>.</p>
  </article>;
}

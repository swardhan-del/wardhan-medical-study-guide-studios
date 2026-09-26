import Link from "next/link";
import { notFound } from "next/navigation";
import { topicGuides } from "@/content/topic-guides";
import lessonData from "@/content/library-lessons.json";
import { searchMetadata } from "@/lib/search-metadata";
import { getSiteUrl } from "@/lib/site-url";
import { collectionGraph } from "@/lib/structured-data";
import { StructuredData } from "@/components/structured-data";
import { SearchBreadcrumbs } from "@/components/search-breadcrumbs";

export const dynamicParams = false;
export function generateStaticParams() { return topicGuides.map(guide => ({ slug: guide.slug })); }
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { return searchMetadata(`/learn/topics/${(await params).slug}`); }
export default async function TopicSequence({ params }: Props) {
  const { slug } = await params;
  const guide = topicGuides.find(guide => guide.slug === slug);
  if (!guide) notFound();
  const stages = guide.stages.map(stage => ({ ...stage, lesson: lessonData.lessons.find(lesson => lesson.id === stage.id)! }));
  return <article className="site-container study-page topic-sequence">
    <SearchBreadcrumbs items={[{ name: "Library", href: "/library" }, { name: "Guided topic sequences", href: "/learn/topics" }, { name: guide.title, href: `/learn/topics/${slug}` }]} />
    <StructuredData data={collectionGraph(guide.title, guide.summary, `/learn/topics/${slug}`, stages.map(({ lesson }) => ({ name: lesson.title, href: `/library/${lesson.id}` })), getSiteUrl())} />
    <header className="study-hero"><p className="eyebrow">Free guided sequence · {stages.length} published lessons</p><h1>{guide.title}</h1><p className="interior-lede">{guide.summary}</p><p>{guide.audience}</p><a className="button button-primary" href="#study-sequence">Explore the lesson sequence ↓</a></header>
    <section className="study-panel"><h2>Before you begin</h2><p>{guide.preparation}</p><h3>A useful study method</h3><p>{guide.method}</p></section>
    <section id="study-sequence" aria-labelledby="sequence-title"><h2 id="sequence-title">Build the explanation in order</h2><ol className="topic-sequence-steps">{stages.map(({ id, purpose, lesson }, i) => <li key={id} className="study-panel">
      <p className="eyebrow">Step {i + 1} · {lesson.minutes} minutes in the full lesson</p><h3><Link href={`/library/${id}`}>{lesson.title}</Link></h3><p>{purpose}</p><p>{lesson.summary}</p>
      <p><strong>Explain after studying:</strong> {lesson.recall.prompt}</p>
      <div className="action-row"><Link className="button button-secondary" href={`/library/${id}`}>Study {lesson.title}</Link><Link href={`/library/${id}#concept-check-title`}>Try the Knowledge Check</Link><Link href={`/library/${id}#lesson-source`}>Sources and further reading</Link></div>
    </li>)}</ol></section>
    <section className="study-panel"><h2>Review the connections</h2><p>{guide.review}</p><p>Use the explanations in the full lessons to check your answer before moving on. Revisit a step if you can name a process but cannot justify it.</p><Link className="button button-primary" href={guide.next.href}>{guide.next.title}</Link></section>
    <footer className="study-sources"><h2>Sources and editorial scope</h2><p>This is an original study sequence through the studio’s published lessons. Lesson summaries and review prompts are drawn from those lessons; their source links above include the supporting references and editorial notes. No new source images or clinical guidance are introduced here.</p><p><Link href="/about">Read about the independent study library</Link>. <Link href="/learn/topics">Choose another guided topic</Link> or <Link href="/library">return to the library</Link>.</p></footer>
  </article>;
}

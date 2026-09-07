import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { anatomyLearningPages } from "@/content/anatomy-learning";
import { AnatomyTopicNav } from "@/components/anatomy-topic-nav";
import { LearningExplorer } from "@/components/learning-explorer";

type Props = { params: Promise<{ topic: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return anatomyLearningPages.map((page) => ({ topic: page.slug }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { topic } = await params;
  const page = anatomyLearningPages.find((item) => item.slug === topic);
  return page ? { title: `${page.title} — Interactive anatomy study`, description: page.description, alternates: { canonical: `/subjects/anatomy/${topic}` } } : { title: "Topic not found" };
}
export default async function AnatomyTopicPage({ params }: Props) {
  const { topic } = await params;
  const page = anatomyLearningPages.find((item) => item.slug === topic);
  if (!page) notFound();
  return (
    <div className="site-container library-page anatomy-learning-page">
      <header className="library-heading">
        <Link className="text-link" href="/subjects/anatomy">← Anatomy collection</Link>
        <p className="eyebrow subject-eyebrow">Anatomy · Interactive study preview</p>
        <h1>{page.title}</h1>
        <p className="interior-lede">{page.description}</p>
        <AnatomyTopicNav current={topic} />
      </header>
      <section className={`learning-intro${page.image ? " with-image" : ""}`} aria-label="About this study page">
        <div>
          <p className="eyebrow">From your study guide to a working understanding</p>
          <h2>Read. Make a connection. Test it.</h2>
          <p>{page.introduction}</p>
          <div className="msk-actions">
            <a href="#explore" className="button button-primary">Start exploring</a>
            <a href="#sources" className="button button-secondary">View sources</a>
          </div>
        </div>
        {page.image ? <figure>
          <a href={page.image.src} target="_blank" rel="noopener noreferrer" aria-label="Enlarge study illustration (opens in a new tab)">
            <Image src={page.image.src} alt={page.image.alt} width={1200} height={1200} sizes="(max-width: 760px) 90vw, 35vw" />
          </a>
          <figcaption>{page.image.caption}. Select to enlarge.</figcaption>
        </figure> : null}
      </section>
      {topic === "thorax" ? <p className="thorax-course-link"><Link className="text-link" href="/subjects/anatomy/regional-anatomy#thorax-map-title">Explore the interactive chest image and twelve-question Thorax practice →</Link></p> : null}
      <LearningExplorer key={topic} lessons={page.lessons} />
      <section className="msk-section" id="sources" aria-labelledby="anatomy-sources-title">
        <p className="eyebrow">Follow the reference</p>
        <h2 id="anatomy-sources-title">Source volumes & sections</h2>
        <p>These summaries and recall activities draw from the curated study-guide editions. References name the source sections used. Full manuscripts are being prepared for release.</p>
        <div className="msk-topic-grid">
          {page.sources.map((source) => <article key={source.id} id={`source-${source.id}`} className="msk-topic anatomy-source">
            <p className="eyebrow">Study-guide source</p>
            <h3>{source.title}</h3>
            <p>{source.coverage}</p>
            <ul className="source-section-list">{page.lessons.filter((lesson) => lesson.source === source.id).map((lesson) => <li key={lesson.id}><strong>{lesson.title}:</strong> {lesson.reference}</li>)}</ul>
            <Link className="text-link" href={`/subjects/anatomy#${source.id}`}>View this volume’s preview →</Link>
          </article>)}
        </div>
      </section>
      <section className="msk-section" aria-labelledby="continue-anatomy">
        <h2 id="continue-anatomy">Connect another region.</h2>
        <AnatomyTopicNav current={topic} />
      </section>
    </div>
  );
}

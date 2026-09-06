import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AnatomyTopicNav } from "@/components/anatomy-topic-nav";
import { musculoskeletalSources, musculoskeletalTopics, musculoskeletalRecall } from "@/content/musculoskeletal";

export const metadata: Metadata = {
  title: "Musculoskeletal system — Study map & sources",
  description: "Explore musculoskeletal anatomy through Volume V and three teaching decks, with chapter references, regional study routes and recall examples.",
  alternates: { canonical: "/subjects/anatomy/musculoskeletal" },
};

export default function MusculoskeletalPage() {
  return (
    <div className="site-container library-page msk-page">
      <header className="library-heading">
        <Link href="/subjects/anatomy" className="text-link">← Anatomy collection</Link>
        <p className="eyebrow subject-eyebrow">Volume V · Study preview</p>
        <h1>Musculoskeletal system</h1>
        <p className="interior-lede">A guided route through bones, joints, muscles and regional anatomy, drawn from the Volume V study guide and three companion teaching decks.</p>
        <AnatomyTopicNav current="musculoskeletal" />
        <div className="msk-actions">
          <a className="button button-primary" href="#study-map">Explore the study map</a>
          <a className="button button-secondary" href="#sources">View source notes</a>
        </div>
      </header>

      <section className="msk-overview" aria-labelledby="msk-start">
        <figure>
          <a href="/images/anatomy/volume-5.png" target="_blank" rel="noopener noreferrer" aria-label="Enlarge hip-bone illustration (opens in a new tab)">
            <Image src="/images/anatomy/volume-5.png" alt="Anterior, lateral and posterior views of hip bones with labeled landmarks." width={1055} height={1491} sizes="(max-width: 760px) 90vw, 35vw" />
          </a>
          <figcaption>Hip bones and landmarks · STEM Visualizer collection. Select the image to enlarge.</figcaption>
        </figure>
        <div>
          <p className="eyebrow">Begin with relationships</p>
          <h2 id="msk-start">Give every structure a place.</h2>
          <p>Use a consistent route through each topic: identify the structure, describe its relationships, then connect movement with nerve supply and blood supply. The source guide adds lymphatic drainage and development where relevant.</p>
          <ol className="msk-study-steps">
            <li><strong>Orient.</strong> Name the region, landmarks and boundaries.</li>
            <li><strong>Connect.</strong> Follow the joints, muscles and neurovascular routes.</li>
            <li><strong>Recall.</strong> Speak a short answer, sketch the relationships and check the source.</li>
          </ol>
          <p className="msk-reference">Study method: <a href="#source-volume-v">Volume V, “How to Use This Book” and “The Oral Exam Answer Formula.”</a></p>
          <Link className="text-link" href="/subjects/anatomy#volume-v">View the forthcoming book and companion guide →</Link>
        </div>
      </section>

      <section id="study-map" className="msk-section" aria-labelledby="study-map-title">
        <p className="eyebrow">Eight connected study areas</p>
        <h2 id="study-map-title">Choose where to begin.</h2>
        <nav className="volume-jump-links" aria-label="Musculoskeletal study areas">
          {musculoskeletalTopics.map((topic) => <a key={topic.id} href={`#${topic.id}`}>{topic.title}</a>)}
        </nav>
        <div className="msk-topic-grid">
          {musculoskeletalTopics.map((topic, index) => (
            <article className="msk-topic" id={topic.id} key={topic.id}>
              <p className="eyebrow">Part {index + 1}</p>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
              <p className="msk-reference">{topic.reference}</p>
              <ul className="msk-source-links" aria-label={`Sources for ${topic.title}`}>
                {topic.sources.map((id) => <li key={id}><a href={`#source-${id}`}>{id === "volume-v" ? "Volume V source notes" : musculoskeletalSources.find((source) => source.id === id)?.title} →</a></li>)}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="msk-section" aria-labelledby="recall-title">
        <p className="eyebrow">Try a short recall session</p>
        <h2 id="recall-title">Answer first. Then check.</h2>
        <p>Say your answer aloud before opening each explanation.</p>
        <div className="msk-recall">
          {musculoskeletalRecall.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
              <a className="msk-reference" href={`#source-${item.source}`}>{item.reference} View source notes →</a>
            </details>
          ))}
        </div>
      </section>

      <section id="sources" className="msk-section" aria-labelledby="sources-title">
        <p className="eyebrow">The material behind this study map</p>
        <h2 id="sources-title">Source guides & teaching decks</h2>
        <p>These notes identify the editions, chapters and slides used for this preview. The full books and teaching decks are being prepared for release; this page provides study summaries and references.</p>
        <div className="msk-topic-grid">
          {musculoskeletalSources.map((source) => (
            <article className="msk-topic msk-source" id={`source-${source.id}`} key={source.id}>
              <p className="eyebrow">{source.format}</p>
              <h3>{source.title}</h3>
              <p>{source.description}</p>
              <p><strong>Coverage:</strong> {source.coverage}</p>
              <p className="msk-reference">{source.locator}</p>
              <p className="msk-reference">{source.edition}</p>
              <a className="text-link" href="#study-map">Back to the study map ↑</a>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { NodeExplorer, OrganDetective, SlideJourney, VisualReelGallery } from "@/components/visual-studio";
import { studioSources, nodeLandmarks, organPatterns, slideStages } from "@/content/visual-studio";
import { searchMetadata } from "@/lib/search-metadata";
import styles from "@/components/visual-studio.module.css";

export const metadata = searchMetadata("/learn/visual-studio");

export default function VisualStudioPage() {
  return <div className={`site-container ${styles.page}`}>
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/">Home</Link><span aria-current="page"> / Visual studio</span></nav>
    <header className={styles.hero}><div className={styles.heroCopy}><p className={styles.kicker}>The visual study studio · histology</p><h1>See it.<br/>Explore it.<br/>Explain it.</h1><p>Build an explanation with your eyes and your own decisions. Find landmarks, trace routes and compare structures before checking the answer.</p><a href="#node">Start with a lymph node ↓</a></div><Image src="/media/visual-studio/studio-cover.webp" width={1536} height={1024} sizes="(max-width:800px) 90vw, 45vw" alt="Conceptual illustration of a microscope and abstract tissue-like patterns; an AI-generated illustration, not a specimen." priority/></header>
    <nav className={styles.jumpLinks} aria-label="Visual studio activities"><a href="#node">01 · Trace a route</a><a href="#organs">02 · Compare organs</a><a href="#preparation">03 · Build a slide</a><a href="#visual-minutes">Watch the visual minutes</a></nav>
    <noscript><p className="study-notice">The diagrams, explanations, videos and reference notes are available below. JavaScript enables the clickable activities; the complete text alternative is in “Read the diagrams without interaction”.</p></noscript>
    <NodeExplorer/>
    <OrganDetective/>
    <SlideJourney/>
    <VisualReelGallery/>
    <section id="studio-sources" className={styles.activity} aria-labelledby="studio-sources-title"><p className={styles.kicker}>Follow the evidence</p><h2 id="studio-sources-title">From a drawing to a real section.</h2><p>Use the drawings to learn relationships, then inspect the linked real specimens. External slide viewers have their own controls and availability. None of their slide images has been copied here.</p><div className={styles.sourceGrid}>{studioSources.map(s => <div key={s.url}><a href={s.url}>{s.title} ↗</a><p>{s.scope}</p></div>)}</div>
      <details><summary>Read the diagrams without interaction</summary><h3>Lymph-node landmarks</h3><ol>{nodeLandmarks.map(l => <li key={l.name}><strong>{l.name}.</strong> {l.detail} {l.why}</li>)}</ol><h3>Compare the organs</h3>{organPatterns.map(o => <p key={o.id}><strong>{o.name}:</strong> {o.pattern}. {o.anchor}. {o.contrast}</p>)}<h3>Routine paraffin preparation</h3><ol>{slideStages.map(s => <li key={s.title}><strong>{s.title}.</strong> {s.body}</li>)}</ol></details>
      <p className={styles.caption}>References checked 5 November 2026. Original diagrams, explanations and questions; simplified conceptual models without measured scale, physiological transit time or diagnostic interpretation. The cover is an AI-generated conceptual illustration. The three videos animate the original schematics and include no speech. Source and editorial checks are AI-assisted; independent subject-specialist review remains outstanding.</p>
      <div className={styles.nextStep}><Link href="/study/histology">Explore all histology lessons →</Link><Link href="/contact">Suggest a sourced correction →</Link></div>
    </section>
  </div>;
}

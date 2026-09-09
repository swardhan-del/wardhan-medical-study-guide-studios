import Link from "next/link";
import { notFound } from "next/navigation";
import { guideParts } from "@/lib/printable-guides";
import { studySubjects, subjectLessons } from "@/lib/study-collections";
import { figuresForResource } from "@/lib/figures";
import { videosForLesson } from "@/lib/videos";

type Props = { params: Promise<{ subject: string }> };
export function generateStaticParams() { return studySubjects.map(s => ({ subject: s.id })); }
export async function generateMetadata({ params }: Props) {
  const { subject } = await params;
  return { title: `${studySubjects.find(s => s.id === subject)?.title ?? "Study"} · Guide parts and visuals` };
}
export default async function GuidePage({ params }: Props) {
  const { subject } = await params;
  const s = studySubjects.find(s => s.id === subject); if (!s) notFound();
  const parts = guideParts.filter(p => p.subject === subject), lessons = subjectLessons(subject);
  return <article className="site-container study-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/study">My Study</Link><span> / </span><Link href={`/study/${subject}`}>{s.title}</Link><span aria-current="page"> / Guide parts</span></nav>
    <header className="study-hero"><p className="eyebrow">Read · Visualise · Recall · Print</p><h1>{s.title}: guide parts and visuals</h1>
      <p>Choose a part, study its available lessons, and use the figures and practice alongside your printed guide. Printable web notes include part dividers, worked examples and an optional answer key.</p>
      <Link className="button button-primary" href={`/study/${subject}/revision`}>Choose parts and print notes</Link>
      <p className="muted-note">{subject === "histology" ? "The 20-part order follows the divided printable guide, Revision 4 (3 August 2026). Links cover selected concepts within each part, not every topic named in its title." : subject === "biochemistry" ? "The 14 parts group section themes found in the final biochemistry guide. Numbering is for this website; each link covers selected concepts." : "Parts follow the website teaching sequence. They are not a verified reproduction of the final source guide’s chapter order."} Complete source documents and the full STEM Visualizer archive are not available here. Only released website visuals are linked below.</p>
    </header>
    <nav className="guide-contents" aria-label="Guide parts"><ol>{parts.map(p => <li key={p.id}><a href={`#${p.id}`}>{p.number}. {p.title}</a></li>)}</ol></nav>
    {parts.map(p => {
      const available = lessons.filter(l => p.lessonIds.includes(l.id));
      const figures = [...new Map(available.flatMap(l => figuresForResource(l.id)).map(f => [f.id, f])).values()];
      const videos = available.filter(l => videosForLesson(l.id).length > 0);
      return <section className="study-panel guide-part" id={p.id} key={p.id}>
        <p className="eyebrow">Part {p.number} · {available.length ? `${available.length} available lessons` : "Coverage gap"}</p><h2>{p.title}</h2><p>{p.coverage}</p>
        {available.length > 0 && <><h3>Read and practise</h3><ul>{available.map(l => <li key={l.id}><Link href={`/library/${l.id}`}>{l.title}</Link> · {l.minutes} min · concept check and oral recall</li>)}</ul><Link href={`/study/${subject}/revision#${p.id}`}>Open this part in the printable notes</Link></>}
        {figures.length > 0 && <><h3>Released figures</h3><ul>{figures.map(f => <li key={f.id}><Link href={`/library/${available.find(l => figuresForResource(l.id).some(x => x.id === f.id))!.id}#lesson-figures`}>{f.title}</Link> — {f.kind === "diagram" ? "Teaching diagram" : "Image"}</li>)}</ul></>}
        {videos.length > 0 && <><h3>Watch and explain</h3><ul>{videos.map(l => <li key={l.id}><Link href={`/library/${l.id}`}>{l.title}: narrated visual explanation</Link></li>)}</ul></>}
        {p.practiceHref && <p><Link href={p.practiceHref}>Open available tissue identification practice</Link></p>}
        {!available.length && <p>Use your course material for this part. A dedicated web adaptation and its visual activities remain to be added.</p>}
      </section>;
    })}
  </article>;
}

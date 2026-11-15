import { searchMetadata } from "@/lib/search-metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guidePartHref, orderedGuideLessons, partsForSubject } from "@/lib/printable-guides";
import { studySubjects } from "@/lib/study-collections";
import { figuresForResource } from "@/lib/figures";
import { videosForLesson } from "@/lib/videos";
import { physiologyCourse, physiologyCoursePath } from "@/content/curriculum";

type Props = { params: Promise<{ subject: string }> };
export function generateStaticParams() { return studySubjects.map(s => ({ subject: s.id })); }
export async function generateMetadata({ params }: Props) {
  const { subject } = await params;
  return searchMetadata(`/study/${subject}/guide`);
}
export default async function GuidePage({ params }: Props) {
  const { subject } = await params;
  const s = studySubjects.find(s => s.id === subject); if (!s) notFound();
  const parts = partsForSubject(subject);
  return <article className="site-container study-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/study">My Study</Link><span> / </span><Link href={`/study/${subject}`}>{s.title}</Link><span aria-current="page"> / Guide parts</span></nav>
    <header className="study-hero"><p className="eyebrow">Read · Visualise · Recall · Print</p><h1>{s.title}: guide parts and visuals</h1>
      <p>Choose a part, study its available lessons, and use the figures and practice alongside your printed guide. Printable web notes include part dividers, worked examples and an optional answer key.</p>
      <div className="action-row">
        {subject === "physiology" && <Link className="button button-primary" href={physiologyCoursePath}>Full Course</Link>}
        <Link className={subject === "physiology" ? "button button-secondary" : "button button-primary"} href={`/study/${subject}/revision`}>Choose parts and print notes</Link>
      </div>
      <p className="muted-note">{subject === "anatomy" ? "The five volumes contain 18, 22, 18, 30 and 32 written lessons respectively. Every lesson has an original drawing task and at least five explained practice items. Source sections are recorded on each lesson." : subject === "histology" ? "The 20-part order follows the divided printable guide. The 2022 Microscopic Anatomy II syllabus was cross-referenced as historical evidence. Current-year alignment for Microscopic Anatomy I and II is unverified. Released lessons cover selected topics." : subject === "biochemistry" ? "The 14 parts group section themes found in the final biochemistry guide. Numbering is for this website; each link covers selected concepts." : subject === "physiology" ? "The eight numbered parts follow the divided printable guides. Part 00 is optional preparation. The Full Course includes chapters, related lessons and syllabus notes." : "Parts follow the website teaching sequence. Syllabus alignment is unverified."}</p>
    </header>
    <nav className="guide-contents" aria-label="Guide parts"><ol>{parts.map(p => <li key={p.id}><a href={`#${p.id}`}>{p.number}. {p.title}</a></li>)}</ol></nav>
    {parts.map((p, index) => {
      const available = orderedGuideLessons(p.lessonIds);
      const previous = parts[index - 1], next = parts[index + 1];
      const coursePart = subject === "physiology" ? physiologyCourse.parts.find(part => part.guidePartId === p.id) : undefined;
      const figures = [...new Map(available.flatMap(l => figuresForResource(l.id)).map(f => [f.id, f])).values()];
      const videos = available.filter(l => videosForLesson(l.id).length > 0);
      const related = orderedGuideLessons(p.relatedLessonIds ?? []);
      return <section className="study-panel guide-part" id={p.id} key={p.id}>
        <p className="eyebrow">Part {p.number} · {available.length ? `${available.length} available lessons` : "Coverage gap"}</p><h2>{p.title}</h2><p>{p.coverage}</p>
        {coursePart && <p><Link href={physiologyCoursePath + "#" + coursePart.id}>Browse chapters and gaps in the Full Course</Link></p>}
        {available.length > 0 && <><h3>Read and practise in order</h3><ol>{available.map(l => <li key={l.id}><Link href={`/library/${l.id}`}>{l.title}</Link> · {l.minutes} min · {subject === "anatomy" ? "Core practice and identification task" : "knowledge check and oral examination prompts"}</li>)}</ol><Link href={`/study/${subject}/revision#${p.id}`}>Open this part in the printable notes</Link></>}
        {figures.length > 0 && <><h3>Released figures</h3><ul>{figures.map(f => <li key={f.id}><Link href={`/library/${available.find(l => figuresForResource(l.id).some(x => x.id === f.id))!.id}#lesson-figures`}>{f.title}</Link> — {f.kind === "diagram" ? "Teaching diagram" : "Image"}</li>)}</ul></>}
        {videos.length > 0 && <><h3>Watch and explain</h3><ul>{videos.map(l => <li key={l.id}><Link href={`/library/${l.id}`}>{l.title}: narrated visual explanation</Link></li>)}</ul></>}
        {related.length > 0 ? <><h3>Related learning</h3><ul aria-label={`Related lessons for ${p.title}`}>{related.map(l => <li key={l.id}><Link href={`/library/${l.id}`}>{l.title}</Link></li>)}</ul></> : null}
        {p.practiceHref && <p><Link href={p.practiceHref}>Open available tissue identification practice</Link></p>}
        {!available.length && <p>Use your course material for this part. A dedicated web adaptation and its visual activities remain to be added.</p>}
        <nav className="action-row" aria-label={`Guide part ${p.number} navigation`}>
          {previous && <Link href={guidePartHref(previous)}>Previous part: {previous.title}</Link>}
          {next && <Link href={guidePartHref(next)}>Next part: {next.title}</Link>}
        </nav>
      </section>;
    })}
  </article>;
}

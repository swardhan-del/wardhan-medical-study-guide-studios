import { searchMetadata } from "@/lib/search-metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { guidePartHref, orderedGuideLessons, partsForSubject } from "@/lib/printable-guides";
import { guideSubjects } from "@/content/subjects";
import { figuresForResource } from "@/lib/figures";
import { videosForLesson } from "@/lib/videos";
import { physiologyCourse, physiologyCoursePath } from "@/content/curriculum";
import { GuideVisualPractice } from "@/components/guide-visual-practice";
import { guideVisualPractice } from "@/content/guide-visual-practice";

type Props = { params: Promise<{ subject: string }> };
export function generateStaticParams() { return guideSubjects.map(s => ({ subject: s.id })); }
export async function generateMetadata({ params }: Props) {
  const { subject } = await params;
  return searchMetadata(`/study/${subject}/guide`);
}
export default async function GuidePage({ params }: Props) {
  const { subject } = await params;
  const s = guideSubjects.find(s => s.id === subject); if (!s) notFound();
  const parts = partsForSubject(subject);
  const practice = guideVisualPractice[subject];
  return <article className="site-container study-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/study">My Study</Link><span> / </span><Link href={s.href}>{s.title}</Link><span aria-current="page"> / Guide parts</span></nav>
    <header className="study-hero"><h1>{s.title}: guide parts and visuals</h1>
      <p>Try a visual exercise, choose a topic in course order, or print revision notes with worked examples and answers.</p>
      <div className="action-row">
        {subject === "physiology" && <Link className="button button-primary" href={physiologyCoursePath}>Full Course</Link>}
        <Link className="button button-secondary" href={`/study/${subject}/revision`}>Choose parts and print notes</Link>
        {practice && <a className="text-link" href="#visual-practice">Try a visual exercise</a>}
        <a className="text-link" href="#guide-parts">Jump to course parts</a>
      </div>
    </header>
    {practice && <GuideVisualPractice practice={practice} id="visual-practice" />}
    <nav className="guide-contents" id="guide-parts" aria-label="Guide parts"><ol>{parts.map(p => <li key={p.id}><a href={`#${p.id}`}>{p.number}. {p.title}</a></li>)}</ol></nav>
    {parts.map((p, index) => {
      const available = orderedGuideLessons(p.lessonIds);
      const previous = parts[index - 1], next = parts[index + 1];
      const coursePart = subject === "physiology" ? physiologyCourse.parts.find(part => part.guidePartId === p.id) : undefined;
      const figures = [...new Map(available.flatMap(l => figuresForResource(l.id)).map(f => [f.id, f])).values()];
      const videos = available.filter(l => videosForLesson(l.id).length > 0);
      const related = orderedGuideLessons(p.relatedLessonIds ?? []);
      const hasWebTeaching = available.length > 0 || p.practiceHref;
      return <section className="study-panel guide-part" id={p.id} key={p.id}>
        <p className="eyebrow">Part {p.number} · {available.length ? `${available.length} available lessons` : p.practiceHref ? "Practical available" : "Course materials"}</p><h2>{p.title}</h2><p>{hasWebTeaching ? p.coverage : "Use your course materials for this topic."}</p>
        {coursePart && <p><Link href={physiologyCoursePath + "#" + coursePart.id}>View the chapters in this part</Link></p>}
        {available.length > 0 && <><h3>Lessons and questions</h3><ol>{available.map(l => <li key={l.id}><Link href={`/library/${l.id}`}>{l.title}</Link> · {l.minutes} min · {subject === "anatomy" ? "Core practice and identification task" : "knowledge check and oral examination prompts"}</li>)}</ol><Link href={`/study/${subject}/revision#${p.id}`}>Open this part in the printable notes</Link></>}
        {figures.length > 0 && <><h3>Figures to study</h3><ul>{figures.map(f => <li key={f.id}><Link href={`/library/${available.find(l => figuresForResource(l.id).some(x => x.id === f.id))!.id}#lesson-figures`}>{f.title}</Link> — {f.kind === "diagram" ? "Teaching diagram" : "Image"}</li>)}</ul></>}
        {videos.length > 0 && <><h3>Watch and explain</h3><ul>{videos.map(l => <li key={l.id}><Link href={`/library/${l.id}`}>{l.title}: narrated visual explanation</Link></li>)}</ul></>}
        {related.length > 0 ? <><h3>Related learning</h3><ul aria-label={`Related lessons for ${p.title}`}>{related.map(l => <li key={l.id}><Link href={`/library/${l.id}`}>{l.title}</Link></li>)}</ul></> : null}
        {p.practiceHref && <p><Link href={p.practiceHref}>{p.practiceLabel ?? "Open available tissue identification practice"}</Link></p>}
        {p.id === "histology-part-08" && <p><Link href="#histology-part-09">Continue with digestive-wall structure in Part 09</Link></p>}
        {p.id === "study-immunology" && <GuideVisualPractice practice={guideVisualPractice.immunology} id="immunology-visual-practice" heading="h3" />}
        <nav className="action-row" aria-label={`Guide part ${p.number} navigation`}>
          {previous && <Link href={guidePartHref(previous)}>Previous part: {previous.title}</Link>}
          {next && <Link href={guidePartHref(next)}>Next part: {next.title}</Link>}
        </nav>
      </section>;
    })}
  </article>;
}

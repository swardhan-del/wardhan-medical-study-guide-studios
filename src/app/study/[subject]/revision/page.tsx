import Link from "next/link";
import Image from "next/image";
import transfer from "@/content/transfer-practice.json";
import { optionOrder } from "@/lib/option-order";
import { figuresForResource } from "@/lib/figures";
import { TeachingDiagram } from "@/components/teaching-diagram";
import { notFound } from "next/navigation";
import { studySubjects, studyGroups, subjectLessons } from "@/lib/study-collections";
import questions from "@/content/study-questions.json";
import references from "@/content/lesson-references.json";
import { PrintStudy } from "@/components/print-study";
const applicationQuestions = [...transfer.questions, ...questions.questions];
const answerLetter = (id: string, count: number, answer: number) => String.fromCharCode(65 + optionOrder(id, count).indexOf(answer));
type Props = { params: Promise<{ subject: string }> };
export function generateStaticParams() { return studySubjects.map(s => ({ subject: s.id })); }
export async function generateMetadata({ params }: Props) { const { subject } = await params; return { title: "Printable revision notes · " + (studySubjects.find(s => s.id === subject)?.title || "Study"), robots: { index: false, follow: true } }; }
export default async function RevisionPage({ params }: Props) {
 const { subject } = await params, s = studySubjects.find(s => s.id === subject); if (!s) notFound();
 const lessons = subjectLessons(subject), groups = studyGroups.filter(g => g.subject === subject);
 const refs = references as Record<string, { title: string; url: string }>;
 return <article className="site-container revision-page">
  <nav className="breadcrumbs print-control" aria-label="Breadcrumb"><Link href="/study">My Study</Link><span> / </span><Link href={"/study/" + subject}>{s.title}</Link><span aria-current="page"> / Revision notes</span></nav>
  <header><p className="eyebrow">Read · Recall · Explain</p><h1>{s.title}: revision notes</h1><p>Concise notes and original questions from the website lessons. Try each question before checking the answer key.</p><p className="muted-note">AI-assisted, source-checked teaching adaptations, updated {lessons.map(l => l.updatedAt).sort().at(-1)}. Independent clinical peer review has not been completed. This is a web revision collection, not the complete source book.</p><PrintStudy /></header>
  {groups.map(g => <section key={g.id} className="revision-section"><h2>{g.title}</h2>{lessons.filter(l => g.lessonIds.includes(l.id)).map(l => <section key={l.id} className="revision-lesson"><h3>{l.title}</h3>{l.steps.map(step => <p key={step.title}><strong>{step.title}.</strong> {step.body}</p>)}{l.workedExample && <div className="revision-worked-example"><h4>{l.workedExample.title}</h4><p>{l.workedExample.prompt}</p><ol>{l.workedExample.solution.map(step => <li key={step}>{step}</li>)}</ol></div>}<TeachingDiagram lessonId={l.id} />{figuresForResource(l.id).map(f => <figure key={f.id} className="revision-figure"><Image unoptimized src={f.src} width={f.width} height={f.height} alt={f.alt} /><figcaption><strong>{f.title}.</strong> {f.caption} <a href={f.sourceUrl}>Scientific reference</a>. {f.rights}.</figcaption></figure>)}<h4>Check your understanding</h4><p>{l.question.prompt}</p><ol type="A">{optionOrder("concept-" + l.id, l.question.options.length).map(i => <li key={i}>{l.question.options[i].text}</li>)}</ol>{applicationQuestions.filter(q => q.topic === l.id).map(q => <div key={q.id}><p>{q.prompt}</p><ol type="A">{optionOrder(q.id, q.options.length).map(i => <li key={i}>{q.options[i].text}</li>)}</ol></div>)}<p><strong>Explain aloud:</strong> {l.recall.prompt}</p><p className="revision-source">Source section: {l.section}. Further reading: <a href={refs[l.id].url}>{refs[l.id].title}</a>. <Link href={"/library/" + l.id}>Full lesson and editorial record</Link>.</p></section>)}</section>)}
  <section className="revision-answers"><h2>Answer key and explanation prompts</h2>{lessons.map(l => <section key={l.id}><h3>{l.title}</h3><p><strong>{answerLetter("concept-" + l.id, l.question.options.length, l.question.answer)}. {l.question.options[l.question.answer].text}</strong> {l.question.options[l.question.answer].reason}</p>{applicationQuestions.filter(q => q.topic === l.id).map(q => <p key={q.id}><strong>Application: {answerLetter(q.id, q.options.length, q.answer)}. {q.options[q.answer].text}</strong> {q.options[q.answer].explanation}</p>)}<p><strong>Oral explanation:</strong> {l.recall.answer}</p></section>)}</section>
  <footer className="revision-attribution">Wardhan Medical Study Guide Studios · An independent educational project by Siddhartha Harshwardhan.</footer>
 </article>;
}

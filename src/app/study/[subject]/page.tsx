import Link from "next/link";
import { BiophysicsCourseIntro } from "@/components/biophysics-course";
import { SubjectCoverage } from "@/components/subject-coverage";
import { notFound } from "next/navigation";
import { studySubjects, studyGroups, subjectLessons } from "@/lib/study-collections";
import { StudyCollectionBrowser } from "@/components/study-collection-browser";
import { figuresForResource } from "@/lib/figures";
import { videosForLesson } from "@/lib/videos";
import { videoDuration } from "@/lib/video-types";
import audioData from "@/content/study-audio.json";
import { renalLessons, renalQuestions } from "@/content/renal-course";
type Props = { params: Promise<{ subject: string }> };
export function generateStaticParams() { return studySubjects.map(s => ({ subject: s.id })); }
export async function generateMetadata({ params }: Props) { const { subject } = await params; const s = studySubjects.find(s => s.id === subject); return { title: s ? s.title + " · Subject learning" : "Subject not found", description: s?.description, alternates: { canonical: "/study/" + subject } }; }
export default async function SubjectStudyPage({ params }: Props) {
 const { subject } = await params, s = studySubjects.find(s => s.id === subject); if (!s) notFound();
 const lessons = subjectLessons(subject), groups = studyGroups.filter(g => g.subject === subject);
 const audio = audioData.records as { lessonId: string }[];
 const cards = lessons.map(l => { const g = groups.find(g => g.lessonIds.includes(l.id))!; const video = videosForLesson(l.id)[0]; return { id: l.id, title: l.title, summary: l.summary, tags: l.tags, minutes: l.minutes, group: g.id, groupTitle: g.title, figure: figuresForResource(l.id)[0], videoId: video?.id, duration: video ? videoDuration(video.durationSeconds) : undefined, audio: audio.some(a => a.lessonId === l.id) }; });
 return <div className="site-container study-page">
   <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/subjects">Subjects</Link><span aria-hidden="true"> / </span><span aria-current="page">{s.title}</span></nav>
   <header className="study-hero"><p className="eyebrow">Subject learning</p><h1>{s.title}</h1><p className="interior-lede">{s.description}</p><p>Study a mechanism, explain an answer, then revise it with recap cards, narrated videos or audio where available.</p>
     <div className="action-row"><Link className="button button-secondary" href={"/study/" + subject + "/revision"}>Open printable revision notes</Link><Link href={"/subjects/" + subject}>Browse the subject directory</Link></div>
   </header>
   {subject === "biophysics" && <BiophysicsCourseIntro />}
   <SubjectCoverage subject={subject} />
   {subject === "physiology" && <section className="study-panel" aria-labelledby="renal-course-heading"><p className="eyebrow">Renal and acid–base physiology · Guided course</p><h2 id="renal-course-heading">Renal physiology, step by step</h2><p>{renalLessons.length} lessons and {renalQuestions.length} questions with explanations, plus interactive circulation and acid–base activities.</p><Link className="button button-primary" href="/learn/renal">Open renal physiology course</Link></section>}
   <StudyCollectionBrowser cards={cards} groups={groups} />
   <p className="muted-note">These are focused teaching adaptations, with source references on each lesson. AI-assisted educational content; independent clinical peer review has not been completed. Your practice stays in this browser.</p>
 </div>;
}

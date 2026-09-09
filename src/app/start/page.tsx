import Link from "next/link";
import { SubjectSubsets } from "@/components/subject-subsets";
import { studySubjects, subjectLessons } from "@/lib/study-collections";
import { studyPaths, beginnerSequences } from "@/content/study-paths";

export const metadata = { title: "Start here", description: "Choose a medical subject, see what is covered and begin your first study session.", alternates: { canonical: "/start" } };

export default function StartPage() {
  return <div className="site-container study-page">
    <header className="study-hero"><p className="eyebrow">Your first visit</p><h1>Choose a subject. Start with one lesson.</h1><p className="interior-lede">Use a short session to understand one idea, explain it without looking, then check your answer.</p></header>
    <section className="study-panel" aria-labelledby="first-session"><h2 id="first-session">Your first 15 minutes</h2><ol><li>Choose your subject below and check its starting knowledge and topic map.</li><li>Spend about 7 minutes reading one lesson and tracing its worked example or available figure.</li><li>Spend 5 minutes recalling the explanation and answering its questions.</li><li>Use the last 3 minutes to review mistakes and save what you want to revisit.</li></ol><p>These are focused introductions. Available lessons and practice scores do not establish full syllabus coverage or exam readiness.</p></section>
    <section aria-labelledby="choose-subject"><h2 id="choose-subject">Choose your subject</h2><div className="studio-grid">{studySubjects.map(subject => {
      const steps = beginnerSequences[subject.id];
      return <article className="study-panel" key={subject.id}><h3>{subject.title}</h3><p>{studyPaths[subject.id].preparation}</p><p>{subjectLessons(subject.id).length} focused introductions; this is not a complete subject course.</p><ol className="start-sequence">{steps.map(step => <li key={step.href}><Link href={step.href}>{step.title}</Link></li>)}</ol><div className="action-row"><Link className="button button-primary" href={steps[0].href}>Start {subject.title}</Link><Link href={`/learn/foundations/${subject.id}`}>Learn the foundations</Link><Link href={`/study/${subject.id}#coverage`}>See topic coverage</Link></div></article>;
    })}</div></section><SubjectSubsets />
    <section className="study-panel"><h2>Find your way around</h2><ul><li><Link href="/subjects">Subjects</Link>: choose a learning path and explore the topic directory.</li><li><Link href="/library">Library</Link>: search and filter all available lessons and resources.</li><li><Link href="/study">My Study</Link>: return to saved resources, review answers and transfer your progress.</li></ul></section>
  </div>;
}

import Link from "next/link";
import { studentSubjects, availableLessons, firstLesson, subjectDestination } from "@/lib/student-subjects";
import { studyPaths } from "@/content/study-paths";

export const metadata = { title: "Start here", description: "Choose a medical subject, see what is covered and begin your first study session.", alternates: { canonical: "/start" } };

export default function StartPage() {
  return <div className="site-container study-page">
    <header className="study-hero"><p className="eyebrow">Your first visit</p><h1>Choose a subject. Start with one lesson.</h1><p className="interior-lede">Use a short session to understand one idea, explain it without looking, then check your answer.</p></header>
    <section className="study-panel" aria-labelledby="first-session"><h2 id="first-session">Your first 15 minutes</h2><ol><li>Choose your subject below. Open its foundations if the vocabulary is unfamiliar.</li><li>Spend about 7 minutes reading one explanation and tracing its worked example or available figure.</li><li>Spend 5 minutes recalling the explanation and answering its questions.</li><li>Use the last 3 minutes to review mistakes and save what you want to revisit.</li></ol><p>These are focused introductions. Available lessons and practice scores do not establish full syllabus coverage or exam readiness.</p></section>
    <section aria-labelledby="choose-subject"><h2 id="choose-subject">Choose your subject</h2><div className="studio-grid">{studentSubjects.map(subject => {
      const first = firstLesson(subject.id), collection = subject.learningSubject || subject.id;
      return <article className="study-panel" key={subject.id}><h3>{subject.title}</h3><p>{studyPaths[collection]?.preparation ?? subject.description}</p><p>{availableLessons(subject.id).length ? `${availableLessons(subject.id).length} available lessons; shared subsets are not additional content.` : "No public lessons released yet."}</p><div className="action-row">{first && <Link className="button button-primary" href={`/library/${first.id}`}>Start {subject.title}</Link>}{studyPaths[collection] && <Link href={`/learn/foundations/${collection}`}>Learn the foundations</Link>}<Link href={subjectDestination(subject.id)}>See available coverage</Link></div></article>;
    })}</div></section>
    <section className="study-panel"><h2>Find your way around</h2><ul><li><Link href="/subjects">Subjects</Link>: choose a learning path and explore the topic directory.</li><li><Link href="/library">Library</Link>: search and filter all available lessons and resources.</li><li><Link href="/study">My Study</Link>: return to saved resources, review answers and transfer your progress.</li></ul></section>
  </div>;
}

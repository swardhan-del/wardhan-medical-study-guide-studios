import { firstSessionHref, firstSessionsPath } from "@/content/first-study-sessions";
import { anatomySystemsPath } from "@/content/anatomy-systems";
import { searchMetadata } from "@/lib/search-metadata";
import { ContinueLearning } from "@/components/continue-learning";
import { StudentEntryModes } from "@/components/subject-hub";
import { journeyIndex } from "@/lib/lesson-journeys";
import Link from "next/link";
import { SubjectSubsets } from "@/components/subject-subsets";
import { studySubjects } from "@/lib/study-collections";
import { subjectLessonCounts } from "@/lib/subject-lesson-counts";
import { topicGuides } from "@/content/topic-guides";
import { studyPaths, beginnerSequences } from "@/content/study-paths";

export const metadata = searchMetadata("/start");

export default function StartPage() {
  const firstSequence = topicGuides.find(guide => guide.slug === "membrane-transport");
  return <div className="site-container study-page">
    <header className="study-hero"><p className="eyebrow">Your first visit</p><h1>Choose a subject. Start with one lesson.</h1><p className="interior-lede">Choose subject → Start free lesson → Practice → Review summary → Continue learning.</p></header>
    <div className="action-row"><Link className="button button-primary" href={firstSessionsPath}>Try a five-minute study session</Link></div>
    <StudentEntryModes />
    <p><Link href={anatomySystemsPath}>Explore the anatomy body systems →</Link></p>
    <ContinueLearning lessons={journeyIndex} />
    <section className="study-panel" aria-labelledby="first-session"><h2 id="first-session">Your first 15 minutes</h2><ol><li>Choose your subject below and check its starting knowledge and topic map.</li><li>Spend about 7 minutes reading one lesson and tracing its worked example or available figure.</li><li>Spend 5 minutes recalling the explanation and answering its questions.</li><li>Use the last 3 minutes to review mistakes and save what you want to revisit.</li></ol><p>These are focused introductions. Available lessons and practice scores do not establish full syllabus coverage or exam readiness.</p>{firstSequence ? <><p>Prefer a connected topic? The membrane transport sequence links {firstSequence.stages.length} published lessons, with practice and sources at each step. Begin with one lesson in this session and return for the next.</p><div className="action-row"><Link className="button button-secondary" href={`/learn/topics/${firstSequence.slug}`}>Try the membrane transport sequence</Link><Link className="text-link" href="/learn/topics">Explore all guided sequences</Link></div></> : null}</section>
    <section aria-labelledby="choose-subject"><h2 id="choose-subject">Choose your subject</h2><div className="studio-grid">{studySubjects.map(subject => {
      const steps = beginnerSequences[subject.id];
      const coverage = subjectLessonCounts(subject.id);
      return <article className="study-panel" key={subject.id}><h3>{subject.title}</h3><p>{studyPaths[subject.id].preparation}</p><p>{coverage.detail ? `${coverage.total} available lessons: ${coverage.detail}` : `${coverage.total} focused introductions`}; this is not a complete subject course.</p><ol className="start-sequence">{steps.map(step => <li key={step.href}><Link href={step.href}>{step.title}</Link></li>)}</ol><div className="action-row"><Link className="button button-primary" href={steps[0].href}>Start {subject.title}</Link><Link href={firstSessionHref(subject.id)}>Try a short session</Link><Link href={`/learn/foundations/${subject.id}`}>Learn the foundations</Link><Link href={`/study/${subject.id}#coverage`}>See topic coverage</Link></div></article>;
    })}</div></section><SubjectSubsets />
    <section className="study-panel"><h2>Your free Study Guide starter pack</h2><p>Seven starting lessons, short recaps, explained questions and source references. Read online, download for offline reading, or print and save as PDF.</p><Link className="button button-secondary" href="/starter-pack">Open the starter pack</Link></section>
    <section className="study-panel"><h2>Find your way around</h2><ul><li><Link href="/subjects">Subjects</Link>: choose a learning path and explore the topic directory.</li><li><Link href="/library">Library</Link>: search and filter all available lessons and resources.</li><li><Link href="/study">My Study</Link>: return to saved resources, review answers and transfer your progress.</li></ul></section>
  </div>;
}

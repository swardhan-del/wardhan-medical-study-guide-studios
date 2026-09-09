import { QuickSearch } from "@/components/quick-search";
import Link from "next/link";
import { SubjectCard } from "@/components/subject-card";
import { studySubjects } from "@/lib/study-collections";
import { SubjectSubsets } from "@/components/subject-subsets";
import { renalLessons, renalQuestions } from "@/content/renal-course";
import { LearningCollection } from "@/components/learning-collection";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <div className="page-stack">
      <div className="site-container quick-start"><QuickSearch /><nav className="quick-links" aria-label="Quick study access"><Link href="/subjects">All subjects and coverage</Link><Link href="/study">Continue studying</Link><Link href="/study#saved-learning">Saved resources</Link></nav></div>
      <section
        className="hero-section site-container learning-home"
        aria-labelledby="home-heading"
      >
        <div className="hero-copy">
          <p className="eyebrow">Medical sciences, clearly explained</p>
          <h1 id="home-heading">
            Understand the science. Connect the concepts.
          </h1>
          <p className="hero-lede">
            Choose a subject, study one idea, and check your understanding. Focused introductions and practice across seven medical sciences.
          </p>
          <div className="action-row">
            <Link className="button button-primary" href="/start">
              Start here
            </Link>
            <Link className="text-link" href="#subject-heading">
              Choose your subject
            </Link>
          </div>
        </div>
        <aside className="hero-aside" aria-label="Your first study session"><p className="eyebrow">Start learning</p><h2>Choose your subject</h2><nav className="home-subject-links" aria-label="Start a subject">{studySubjects.map(s => <Link key={s.id} href={`/study/${s.id}`}>{s.title} →</Link>)}</nav></aside>
      </section>
      <section
        className="content-section site-container"
        aria-labelledby="subject-heading"
      >
        <div className="section-heading split-heading">
          <h2 id="subject-heading">Explore the medical sciences</h2>
          <p className="section-intro">
            Browse by subject and connect structure, function, development, and
            disease mechanisms as you study.
          </p>
        </div>
        <div className="subject-grid">
          {studySubjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
        <SubjectSubsets />
      </section>
      <section
        className="content-section site-container"
        aria-labelledby="learning-heading"
      >
        <div className="section-heading">
          <h2 id="learning-heading">Choose how you want to study</h2>
        </div>
        <LearningCollection />
      </section>
      <section className="site-container return-banner">
        <div>
          <h2>Build on your previous practice</h2>
          <p>
            Review your answers, revisit topics that need attention, and keep
            useful resources ready for your next session.
          </p>
          <p className="muted-note">
            Your progress stays in this browser. Use export and import in My Study to transfer it to another device.
          </p>
        </div>
        <Link className="button button-primary" href="/study">
          Open My Study
        </Link>
      </section>

      <section className="site-container study-panel"><p className="eyebrow">Featured guided course</p><h2>Renal physiology, step by step</h2><p>{renalLessons.length} lessons and {renalQuestions.length} explained questions, with interactive activities.</p><Link className="text-link" href="/learn/renal">Open renal physiology →</Link></section>
      <section className="closing-section site-container">
        <h2>Know what you are learning from</h2>
        <div className="closing-copy">
          <p>
            Check each lesson’s available source references and editorial notes.
            If an explanation is unclear or you notice an error, help improve it
            by sending feedback.
          </p>
          <Link className="text-link" href="/learn/renal#sources">
            View course sources →
          </Link>
          <p>
            <Link className="text-link" href="/contact">
              Suggest a correction →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

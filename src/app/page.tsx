import Link from "next/link";
import { SubjectCard } from "@/components/subject-card";
import { subjectInterests } from "@/content/subjects";
import { renalLessons, renalQuestions } from "@/content/renal-course";
import { LearningCollection } from "@/components/learning-collection";
export const metadata = { alternates: { canonical: "/" } };
export default function Home() {
  return (
    <div className="page-stack">
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
            Explore focused lessons, visual explanations, and practice questions
            across the medical sciences. Study a topic, check your
            understanding, and return to the concepts you want to strengthen.
          </p>
          <div className="action-row">
            <Link className="button button-primary" href="/library">
              Explore the study library
            </Link>
            <Link className="text-link" href="/learn/renal">
              Start renal physiology
            </Link>
          </div>
        </div>
        <aside
          className="hero-aside renal-hero-card"
          aria-label="Renal course preview"
        >
          <p className="eyebrow">Featured course</p>
          <h2>Renal physiology, step by step</h2>
          <p>
            Connect filtration, tubular transport, fluid balance, and acid–base
            regulation through {renalLessons.length} lessons, interactive
            activities, and {renalQuestions.length} questions with explanations.
          </p>
          <ol className="hero-path">
            <li>
              <span>01</span> Follow renal circulation
            </li>
            <li>
              <span>02</span> Trace tubular transport
            </li>
            <li>
              <span>03</span> Explain fluid and acid–base balance
            </li>
          </ol>
          <Link className="text-link" href="/learn/renal/kidney-map">
            Start the first lesson →
          </Link>
        </aside>
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
            Your saved resources and progress stay in this browser and do not
            sync between devices.
          </p>
        </div>
        <Link className="button button-primary" href="/study">
          Open My Study
        </Link>
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
          {subjectInterests.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </section>
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

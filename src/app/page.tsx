import Link from "next/link";
import { SubjectCard } from "@/components/subject-card";
import { subjectInterests } from "@/content/subjects";
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
          <p className="eyebrow">
            Understand something difficult. Come back stronger.
          </p>
          <h1 id="home-heading">
            Make room for the <em>why</em> behind medicine.
          </h1>
          <p className="hero-lede">
            Follow a mechanism. Explore a model. Test yourself. Start with our
            free renal physiology course and turn today’s mistakes into
            tomorrow’s understanding.
          </p>
          <div className="action-row">
            <Link
              className="button button-primary"
              href="/practice/renal-challenge"
            >
              Try a five-minute renal challenge ↗
            </Link>
            <Link className="text-link" href="/learn/renal">
              Explore the full course →
            </Link>
          </div>
        </div>
        <aside
          className="hero-aside renal-hero-card"
          aria-label="Renal course preview"
        >
          <p className="eyebrow">The first free course</p>
          <h2>
            The kidney,
            <br />
            <em>connected.</em>
          </h2>
          <ol className="hero-path">
            <li>
              <span>01</span> Follow the blood
            </li>
            <li>
              <span>02</span> Recover what matters
            </li>
            <li>
              <span>03</span> Balance water and acid
            </li>
          </ol>
          <p>
            8 lessons · 30 explained questions
            <br />
            Interactive models · Saved review
          </p>
          <Link className="text-link" href="/learn/renal/kidney-map">
            Open the first lesson →
          </Link>
        </aside>
      </section>
      <section
        className="content-section site-container"
        aria-labelledby="learning-heading"
      >
        <div className="section-heading">
          <p className="eyebrow">Explain → Explore → Test</p>
          <h2 id="learning-heading">
            Less passive reading.
            <br />
            More things clicking into place.
          </h2>
        </div>
        <LearningCollection />
      </section>
      <section className="site-container return-banner">
        <div>
          <p className="eyebrow">Made for the return visit</p>
          <h2>Your mistakes are a useful starting point.</h2>
          <p>
            Your browser remembers the questions you tried. Open your weak-topic
            map, review what is due and make a manageable plan for your exam.
          </p>
        </div>
        <Link className="button button-primary" href="/study">
          Open my study dashboard →
        </Link>
      </section>
      <section
        className="content-section site-container"
        aria-labelledby="subject-heading"
      >
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Explore the medical sciences</p>
            <h2 id="subject-heading">
              Connect the subjects.
              <br />
              Keep the mechanism in view.
            </h2>
          </div>
          <p className="section-intro">
            Study anatomy through linked topic pages and volume previews, then
            connect renal histology with physiology. More subject collections
            are in preparation.
          </p>
        </div>
        <div className="subject-grid">
          {subjectInterests.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </section>
      <section className="closing-section site-container">
        <div>
          <p className="eyebrow">Built from a real study library</p>
          <h2>
            Clear explanations.
            <br />
            Visible sources.
          </h2>
        </div>
        <div className="closing-copy">
          <p>
            Each renal lesson names its source material, revision date and
            editorial status. Tell us where an explanation helped, where you got
            stuck, or what needs correcting.
          </p>
          <Link className="text-link" href="/learn/renal#sources">
            Read the course sources →
          </Link>
          <p>
            <Link className="text-link" href="/contact">
              Share feedback →
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

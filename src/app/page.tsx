import { publicCatalog } from "@/lib/catalog";
import Link from "next/link";
import { SubjectCard } from "@/components/subject-card";
import { subjectInterests } from "@/content/subjects";

export default function Home() {
  return (
    <div className="page-stack">
      <section
        className="hero-section site-container"
        aria-labelledby="home-heading"
      >
        <div className="hero-copy">
          <p className="eyebrow">A public library in the making</p>
          <h1 id="home-heading">
            Make room for the <em>why</em> behind medicine.
          </h1>
          <p className="hero-lede">
            Helping students learn medical sciences through independently
            authored learning resources, shaped with care and released when they
            are ready to be public.
          </p>
          <div className="action-row">
            <Link className="button button-primary" href="/library">
              Explore the library <span aria-hidden="true">↗</span>
            </Link>
            <Link className="text-link" href="/about">
              About the studio <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <aside className="hero-aside" aria-label="Public availability note">
          <div className="aside-index">01</div>
          <div>
            <p className="aside-label">Current edition</p>
            <h2>
              {publicCatalog.length
                ? "The study library."
                : "The library is taking shape."}
            </h2>
            <p>
              Search released resources, explore subjects, and build a reading
              list. New guides appear after their release review.
            </p>
          </div>
          <div className="aside-rule" aria-hidden="true" />
          <p className="aside-footnote">
            Quietly built. Deliberately released.
          </p>
        </aside>
      </section>

      <section
        className="content-section site-container"
        aria-labelledby="subject-heading"
      >
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Subject interests</p>
            <h2 id="subject-heading">
              A library organized around the fields students revisit.
            </h2>
          </div>
          <p className="section-intro">
            Each card is an area of interest, not a promise of a public
            collection. When a collection is ready, this is where it will begin.
          </p>
        </div>
        <div className="subject-grid">
          {subjectInterests.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </section>

      <section
        className="method-section site-container"
        aria-labelledby="method-heading"
      >
        <div className="method-panel">
          <p className="eyebrow">How the library works</p>
          <h2 id="method-heading">Release is a decision, not a default.</h2>
          <p className="method-lede">
            The studio develops resources independently, then keeps the public
            library intentionally small until each release has been reviewed.
          </p>
          <ol className="method-steps">
            <li>
              <span>01</span>
              <div>
                <strong>Author</strong>
                <p>Shape a resource around a clear learning purpose.</p>
              </div>
            </li>
            <li>
              <span>02</span>
              <div>
                <strong>Review</strong>
                <p>Check the work before it is treated as public.</p>
              </div>
            </li>
            <li>
              <span>03</span>
              <div>
                <strong>Release</strong>
                <p>Publish only what is ready to be seen here.</p>
              </div>
            </li>
          </ol>
        </div>
        <div className="availability-note">
          <p className="eyebrow">Public availability</p>
          <div className="availability-count">
            {String(publicCatalog.length).padStart(2, "0")}
          </div>
          <h3>
            {publicCatalog.length
              ? "Resources in the public library."
              : "No public resources yet."}
          </h3>
          <p>
            This site is a clear starting point while the public library is
            being prepared.
          </p>
          <Link className="text-link" href="/contact">
            Follow the contact pathway <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section
        className="closing-section site-container"
        aria-labelledby="closing-heading"
      >
        <div>
          <p className="eyebrow">Keep in touch</p>
          <h2 id="closing-heading">The next chapter belongs in the open.</h2>
        </div>
        <div className="closing-copy">
          <p>
            For release questions, accessibility notes, or collaboration
            inquiries, use the studio’s direct contact pathway when it has been
            shared with you.
          </p>
          <Link className="button button-secondary" href="/contact">
            Contact pathway <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

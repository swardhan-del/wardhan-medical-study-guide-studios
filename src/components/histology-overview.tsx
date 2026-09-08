import Link from "next/link";
import { publicCatalog } from "@/lib/catalog";
import data from "@/content/histology-areas.json";

export function HistologyOverview() {
  return (
    <section
      className="histology-overview"
      id="histology-overview"
      aria-labelledby="histology-overview-heading"
    >
      <p className="eyebrow">Understand what you are looking at</p>
      <h2 id="histology-overview-heading">
        From cells and tissues to organs and development.
      </h2>
      <div className="histology-definitions">
        <article>
          <h3>Microscopic anatomy</h3>
          <p>
            The study of structures too small to distinguish with the unaided
            eye. It connects cellular detail, tissue architecture and the
            organisation of organs using microscopy.
          </p>
        </article>
        <article>
          <h3>Histology</h3>
          <p>
            The study of tissues: their cells, extracellular material and
            arrangement. Learn to identify epithelial, connective, muscle and
            nervous tissue, then explain how those tissues work together within
            an organ.
          </p>
        </article>
        <article>
          <h3>Embryology</h3>
          <p>
            The study of development. Follow early cell differentiation, germ
            layers and organ formation to understand how mature structures
            acquire their shape, position and relationships.
          </p>
        </article>
      </div>
      <p className="histology-reading-note">
        For each specimen, ask: What identifies this tissue? How does its structure support its function? How did it develop?
      </p>
      <p className="directory-footnote">
        Overview references:{" "}
        <a
          href="https://openstax.org/books/anatomy-and-physiology-2e/pages/4-1-types-of-tissues"
          target="_blank"
          rel="noopener noreferrer"
        >
          OpenStax: Types of tissues
        </a>{" "}
        and{" "}
        <a
          href="https://openstax.org/books/anatomy-and-physiology-2e/pages/28-2-embryonic-development"
          target="_blank"
          rel="noopener noreferrer"
        >
          Embryonic development
        </a>
        .
      </p>
      <div className="histology-course-links">
        <Link href="/subjects/histology-i">
          <strong>Microscopic Anatomy & Embryology I →</strong>
          <span>
            Methods, basic tissues, organ histology, reproductive structures and
            early development.
          </span>
        </Link>
        <Link href="/subjects/histology-ii">
          <strong>Microscopic Anatomy & Embryology II →</strong>
          <span>
            Nervous tissue, neurodevelopment, CNS pathways, endocrine
            connections and special senses.
          </span>
        </Link>
      </div>
      <h3 className="histology-area-heading">Explore the subject areas</h3>
      <p>
        Explore these areas of microscopic anatomy and development. Expand an area to find its available lessons.
      </p>
      <div className="histology-areas">
        {data.areas.map((area) => (
          <details key={area.id} id={`histology-area-${area.id}`}>
            <summary>{area.title}</summary>
            <div className="histology-area-content">
              <p>{area.description}</p>

              {area.lessons.length > 0 && (
                <>
                  <h4>Lessons and study resources</h4>
                  <ul>
                    {area.lessons.map((id) => (
                      <li key={id}>
                        <Link href={`/library/${id}`}>
                          {
                            publicCatalog.find((record) => record.id === id)!
                              .title
                          }{" "}
                          →
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

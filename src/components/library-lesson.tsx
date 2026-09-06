import { CorrectionLink } from "./correction-link";
import Link from "next/link";
import { subjectInterests } from "@/content/subjects";
import sourceData from "@/content/library-sources.json";
import { publicCatalog } from "@/lib/catalog";
import { resourceHref } from "@/lib/catalog-types";
import type {
  LibraryLesson as Lesson,
  LibrarySource,
} from "@/lib/library-types";
import { getSiteUrl } from "@/lib/site-url";
import { SaveButton } from "./catalog-browser";
import { ConceptCheck } from "./concept-check";

export function LibraryLesson({ lesson }: { lesson: Lesson }) {
  const subject = subjectInterests.find((s) => s.id === lesson.subject)!;
  const source = (sourceData as Record<string, LibrarySource>)[lesson.source];
  const related = lesson.related
    .map((id) => publicCatalog.find((r) => r.id === id))
    .filter((r) => r !== undefined);
  const schema = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: lesson.title,
    description: lesson.summary,
    url: `${getSiteUrl()}/library/${lesson.id}`,
    learningResourceType: "Study lesson",
    educationalLevel: "Undergraduate",
    inLanguage: "en",
    isAccessibleForFree: true,
    dateModified: lesson.updatedAt,
    author: {
      "@type": "Organization",
      name: "Wardhan Medical Study Guide Studios",
    },
    citation: `${source.title}. ${source.edition}. ${lesson.section}.`,
  };
  return (
    <article className="site-container concept-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/library">Library</Link>
        <span aria-hidden="true">/</span>
        <Link href={`/subjects/${subject.id}`}>{subject.title}</Link>
      </nav>
      <header className="concept-heading">
        <p className="eyebrow">
          {subject.title} · {lesson.minutes} minute lesson
        </p>
        <h1>{lesson.title}</h1>
        <p className="interior-lede">{lesson.summary}</p>
        <div className="action-row">
          <a className="button button-primary" href="#concept-check-title">
            Try the question ↓
          </a>
          <SaveButton id={lesson.id} title={lesson.title} />
          <a href="#lesson-source" className="text-link">
            Guide and sources
          </a>
        </div>
      </header>
      <div className="concept-layout">
        <div>
          <section
            className="concept-explanations"
            aria-labelledby="concept-map-title"
          >
            <p className="eyebrow">Three ideas to connect</p>
            <h2 id="concept-map-title">Build the explanation</h2>
            <p>Open each idea, then explain how it relates to the next.</p>
            <div className="concept-sequence">
              {lesson.steps.map((step, index) => (
                <details key={step.title} open={index === 0}>
                  <summary>
                    <span className="concept-number" aria-hidden="true">
                      0{index + 1}
                    </span>
                    <span>{step.title}</span>
                    <span className="concept-expand" aria-hidden="true">
                      +
                    </span>
                  </summary>
                  <p>{step.body}</p>
                </details>
              ))}
            </div>
          </section>
          <ConceptCheck
            key={lesson.id}
            lesson={{ id: lesson.id, question: lesson.question }}
          />
          <section
            className="concept-recall study-panel"
            aria-labelledby="oral-recall-title"
          >
            <p className="eyebrow">Say it without looking</p>
            <h2 id="oral-recall-title">Practice an oral answer</h2>
            <p className="concept-prompt">{lesson.recall.prompt}</p>
            <details>
              <summary>Reveal a model answer</summary>
              <p>{lesson.recall.answer}</p>
            </details>
            <p className="muted-note">
              Try explaining the mechanism aloud before revealing the answer.
            </p>
          </section>
        </div>
        <aside className="concept-sidebar">
          <p className="eyebrow">Connect the subjects</p>
          <h2>Study this next</h2>
          {related.map((r) => (
            <Link className="concept-related" key={r.id} href={resourceHref(r)}>
              <span>
                {subjectInterests.find((s) => s.id === r.subject)?.title}
              </span>
              <strong>{r.title} →</strong>
            </Link>
          ))}
          <div className="concept-study-note">
            <h3>Make this a return visit</h3>
            <p>
              Save this lesson, then revisit its question without opening the
              explanation first.
            </p>
            <Link href="/study#saved-learning" className="text-link">
              My saved learning →
            </Link>
          </div>
        </aside>
      </div>
      <section className="library-source-note" id="lesson-source">
        <p className="eyebrow">Source and editorial record</p>
        <h2>{source.title}</h2>
        <p>{source.edition}</p>
        <p>
          <strong>Source section:</strong> {lesson.section}
        </p>
        <p>{source.context}</p>
        {source.reference && (
          <p>
            <a href={source.reference.url} target="_blank" rel="noreferrer">
              {source.reference.title}
              <span className="visually-hidden"> (opens in a new tab)</span> ↗
            </a>
          </p>
        )}
        <p>
          Web lesson by Wardhan Medical Study Guide Studios. Updated{" "}
          <time dateTime={lesson.updatedAt}>{lesson.updatedAt}</time>.
          AI-assisted, source-checked educational adaptation; independent
          clinical peer review has not been completed.
        </p>
        <p className="muted-note">
          The full source edition remains in the controlled library. This page
          publishes an original teaching adaptation and original recall
          questions.
        </p>
        <CorrectionLink />
      </section>
      <nav className="action-row concept-end" aria-label="Continue studying">
        <Link
          className="button button-primary"
          href={`/library?subject=${subject.id}`}
        >
          More {subject.title} →
        </Link>
        <Link className="text-link" href="/library">
          Explore all subjects
        </Link>
      </nav>
    </article>
  );
}

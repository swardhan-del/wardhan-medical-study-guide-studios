import { EducationalFigure, FigureGallery } from "./educational-figure";
import { figuresForResource } from "@/lib/figures";
import { LessonVideos } from "./lesson-videos";
import { ResourceBreadcrumbs } from "./taxonomy-navigation";
import references from "@/content/lesson-references.json";
import transfer from "@/content/transfer-practice.json";
import { PracticeQuestion } from "./practice-question";
import { SavedRecall } from "./saved-recall";
import { HistologyVisualLesson } from "./histology-visual-lesson";
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
  const reference = (
    references as Record<
      string,
      { title: string; url: string; checkedAt: string }
    >
  )[lesson.id];
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
      <ResourceBreadcrumbs id={lesson.id} />
      <header className="concept-heading">
        <p className="eyebrow">
          {subject.title} · {lesson.minutes} minute concept introduction
        </p>
        <h1>{lesson.title}</h1>
        <p className="interior-lede">{lesson.summary}</p>
        <p className="muted-note">
          A focused introduction for revision. Use the source guide and further
          reading for the full topic.
        </p>
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
                  {((lesson.id === "microscopy" && index === 0) ||
                    (lesson.id === "renal-histology" && index === 2)) &&
                    figuresForResource(lesson.id).map((f) => (
                      <EducationalFigure key={f.id} figure={f} />
                    ))}
                </details>
              ))}
            </div>
          </section>
          {lesson.id === "epithelia" && (
            <>
              <HistologyVisualLesson />
              <FigureGallery
                figures={figuresForResource(lesson.id)}
                title="Compare epithelial architecture"
                comparison
              />
            </>
          )}
          {lesson.id === "nitrogen-metabolism" && (
            <section className="study-panel">
              <p className="eyebrow">Worked mechanism</p>
              <h2>Follow the nitrogen without losing the carbon</h2>
              <p>
                Take alanine as an example. Alanine aminotransferase transfers
                its amino group to α-ketoglutarate, producing glutamate and
                pyruvate. This transfers nitrogen; it does not yet excrete it.
                Pyruvate retains the carbon skeleton and can enter other
                metabolic pathways.
              </p>
              <ol>
                <li>
                  Collect nitrogen: transamination places many amino groups on
                  glutamate.
                </li>
                <li>
                  Handle nitrogen: glutamate can supply ammonium, while
                  aspartate supplies the other nitrogen incorporated into urea.
                </li>
                <li>
                  Package for disposal: the hepatic urea cycle converts these
                  nitrogen inputs into urea.
                </li>
                <li>
                  Eliminate: urea travels in blood to the kidneys for urinary
                  excretion. Renal ammonium excretion is a separate, important
                  route linked to acid–base balance.
                </li>
              </ol>
              <p>
                <strong>Check the distinction:</strong> transferring an amino
                group, making urea and excreting nitrogen are different steps.
                Do not use these verbs interchangeably.
              </p>
            </section>
          )}
          <ConceptCheck
            key={lesson.id}
            lesson={{ id: lesson.id, question: lesson.question }}
          />
          {transfer.questions
            .filter((q) => q.topic === lesson.id)
            .map((q) => (
              <PracticeQuestion
                key={q.id}
                item={q}
                title="Apply the concept in a different setting"
              />
            ))}
          <section
            className="concept-recall study-panel"
            aria-labelledby="oral-recall-title"
          >
            <p className="eyebrow">Say it without looking</p>
            <h2 id="oral-recall-title">Practice an oral answer</h2>
            <p className="concept-prompt">{lesson.recall.prompt}</p>
            <SavedRecall id={`oral-${lesson.id}`} />
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
        <h3>Further reading for this topic</h3>
        {reference && (
          <p>
            <a href={reference.url} target="_blank" rel="noreferrer">
              {reference.title}
              <span className="visually-hidden"> (opens in a new tab)</span> ↗
            </a>
          </p>
        )}
        <p className="muted-note">
          Further-reading link checked {reference.checkedAt}. The source guide
          above identifies the authored material; this public reference supports
          further study of this topic.
        </p>
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
      <LessonVideos lessonId={lesson.id} />
    </article>
  );
}

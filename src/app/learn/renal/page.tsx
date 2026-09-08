import { SaveButton } from "@/components/catalog-browser";
import Link from "next/link";
import {
  renalLessons,
  renalLessonHref,
  renalQuestions,
} from "@/content/renal-course";
import { RenalSources } from "@/components/renal-sources";
import { getSiteUrl } from "@/lib/site-url";
export const metadata = {
  title: `Renal physiology: ${renalLessons.length} lessons and ${renalQuestions.length} practice questions`,
  description:
    "Work through renal circulation, clearance, tubular transport, urine concentration and acid–base regulation, then apply the concepts in practice questions.",
  alternates: { canonical: "/learn/renal" },
};
export default function RenalCourse() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Renal physiology, step by step",
    description: metadata.description,
    url: `${getSiteUrl()}/learn/renal`,
    isAccessibleForFree: true,
    inLanguage: "en",
    provider: {
      "@type": "Organization",
      name: "Wardhan Medical Study Guide Studios",
      url: getSiteUrl(),
    },
    hasPart: renalLessons.map((l) => ({
      "@type": "LearningResource",
      name: l.title,
      url: `${getSiteUrl()}${renalLessonHref(l.slug)}`,
    })),
  };
  return (
    <div className="site-container study-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <header className="study-hero">
        <SaveButton id="renal-course" title="Renal physiology course" />
        <Link className="text-link" href="/library">
          ← Learning library
        </Link>
        <p className="eyebrow">Free mini-course · Medical physiology</p>
        <h1>Understand renal physiology from filtration to fluid balance</h1>
        <p className="interior-lede">
          Work through the nephron step by step. Connect renal circulation,
          clearance, tubular transport, urine concentration, and acid–base
          regulation, then apply the concepts in practice questions.
        </p>
        <div className="action-row">
          <Link
            className="button button-primary"
            href={renalLessonHref(renalLessons[0].slug)}
          >
            Start the first lesson
          </Link>
          <Link
            className="button button-secondary"
            href="/practice/renal-challenge"
          >
            Check your understanding
          </Link>
        </div>
      </header>
      <div className="course-facts">
        <span>
          <strong>{renalLessons.length}</strong> focused lessons
        </span>
        <span>
          <strong>{renalQuestions.length}</strong> explained questions
        </span>
        <span>
          <strong>~2 hours</strong> first learning pass
        </span>
        <span>
          <strong>Free</strong> no sign-in
        </span>
      </div>
      <section className="study-stack">
        <div>
          <p className="eyebrow">A connected sequence</p>
          <h2>Build your understanding, one mechanism at a time</h2>
        </div>
        <ol className="course-lessons">
          {renalLessons.map((lesson, i) => (
            <li key={lesson.slug}>
              <span className="lesson-number">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>
                  <Link href={renalLessonHref(lesson.slug)}>
                    {lesson.title}
                  </Link>
                </h3>
                <p>{lesson.description}</p>
                <span className="source-note">
                  {lesson.minutes} min reading + questions
                </span>
              </div>
              <Link
                className="text-link"
                aria-label={`Read lesson ${i + 1}: ${lesson.title}`}
                href={renalLessonHref(lesson.slug)}
              >
                Read lesson →
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <section className="study-grid two">
        <article className="study-panel">
          <p className="eyebrow">Explore</p>
          <h2>Explore how the variables interact</h2>
          <p>
            Use interactive models to investigate renal resistance, carbon
            dioxide and pH, then practise interpreting fictional blood-gas
            results.
          </p>
          <Link className="button button-secondary" href="/practice/physiology">
            Explore interactive models
          </Link>
        </article>
        <article className="study-panel">
          <p className="eyebrow">Keep the essentials</p>
          <h2>Review the essential concepts</h2>
          <p>
            Download a concise renal physiology revision sheet for reference
            alongside the lessons.
          </p>
          <a
            className="button button-secondary"
            href="/downloads/renal-revision-sheet.pdf"
            download
          >
            Download PDF
          </a>
        </article>
      </section>
      <div className="action-row">
        <Link className="text-link" href="/study">
          Open My Study →
        </Link>
        <Link className="text-link" href="/study/planner">
          Build an exam plan →
        </Link>
        <Link className="text-link" href="/practice/oral">
          Practise an oral answer →
        </Link>
      </div>
      <RenalSources />
    </div>
  );
}

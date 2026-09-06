import { SaveButton } from "@/components/catalog-browser";
import Link from "next/link";
import { renalLessons, renalLessonHref } from "@/content/renal-course";
import { RenalSources } from "@/components/renal-sources";
import { getSiteUrl } from "@/lib/site-url";
export const metadata = {
  title: "Free renal physiology course: 8 lessons and 30 practice questions",
  description:
    "Understand clearance, afferent versus efferent resistance, tubular transport, ADH and acid–base balance. Free lessons, interactive models and saved review.",
  alternates: { canonical: "/learn/renal" },
};
export default function RenalCourse() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Renal physiology: understand, explore, test",
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
        <h1>
          Make the kidney
          <br />
          <em>make sense.</em>
        </h1>
        <p className="interior-lede">
          Follow the mechanism, explore the variables, then test what you can
          explain. Eight lessons connect filtration to fluid balance and
          acid–base reasoning.
        </p>
        <div className="action-row">
          <Link
            className="button button-primary"
            href={renalLessonHref(renalLessons[0].slug)}
          >
            Start lesson one
          </Link>
          <Link
            className="button button-secondary"
            href="/practice/renal-challenge"
          >
            Try the five-minute challenge
          </Link>
        </div>
      </header>
      <div className="course-facts">
        <span>
          <strong>8</strong> focused lessons
        </span>
        <span>
          <strong>30</strong> explained questions
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
          <h2>Start with the map. Finish with the reasoning.</h2>
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
                aria-label={`Open lesson ${i + 1}: ${lesson.title}`}
                href={renalLessonHref(lesson.slug)}
              >
                Open →
              </Link>
            </li>
          ))}
        </ol>
      </section>
      <section className="study-grid two">
        <article className="study-panel">
          <p className="eyebrow">Explore</p>
          <h2>Put the mechanisms to work.</h2>
          <p>
            Change renal resistance, explore CO₂ and pH, and interpret six
            fictional blood gases.
          </p>
          <Link className="button button-secondary" href="/practice/physiology">
            Open the physiology lab
          </Link>
        </article>
        <article className="study-panel">
          <p className="eyebrow">Keep the essentials</p>
          <h2>A revision sheet for your desk.</h2>
          <p>
            Two printable pages: the nephron map, clearance equations, transport
            locations and acid–base steps.
          </p>
          <a
            className="button button-secondary"
            href="/downloads/renal-revision-sheet.pdf"
            download
          >
            Download revision sheet · PDF
          </a>
        </article>
      </section>
      <div className="action-row">
        <Link className="text-link" href="/study">
          My progress and due reviews →
        </Link>
        <Link className="text-link" href="/study/planner">
          Build an exam plan →
        </Link>
        <Link className="text-link" href="/practice/oral">
          Practice an oral answer →
        </Link>
      </div>
      <RenalSources />
    </div>
  );
}

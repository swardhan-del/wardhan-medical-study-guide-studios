import { NephronMap } from "@/components/nephron-map";
import { SaveButton } from "@/components/catalog-browser";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  renalLessons,
  renalQuestions,
  renalLessonHref,
} from "@/content/renal-course";
import { RenalQuiz } from "@/components/renal-quiz";
import { CompleteLesson } from "@/components/lesson-actions";
import { RenalSources } from "@/components/renal-sources";
export const dynamicParams = false;
export function generateStaticParams() {
  return renalLessons.map((l) => ({ slug: l.slug }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const l = renalLessons.find((l) => l.slug === slug);
  return l
    ? {
        title: l.title,
        description: l.description,
        alternates: { canonical: renalLessonHref(slug) },
        openGraph: {
          title: l.title,
          description: l.description,
          url: renalLessonHref(slug),
          images: ["/learn/renal/opengraph-image"],
        },
      }
    : { title: "Lesson not found" };
}
export default async function RenalLessonPage({ params }: Props) {
  const { slug } = await params;
  const index = renalLessons.findIndex((l) => l.slug === slug);
  const lesson = renalLessons[index];
  if (!lesson) notFound();
  const next = renalLessons[index + 1];
  const previous = renalLessons[index - 1];
  return (
    <div className="site-container study-page renal-lesson">
      <header className="study-hero">
        <Link className="text-link" href="/learn/renal">
          ← Renal course
        </Link>
        <p className="eyebrow">
          Lesson {index + 1} of 8 · {lesson.minutes} minutes + recall
        </p>
        <h1>{lesson.title}</h1>
        <p className="interior-lede">{lesson.description}</p>
        <SaveButton id={`renal-${slug}`} title={lesson.title} />
      </header>
      <div className="lesson-layout">
        <aside className="lesson-outline">
          <h2>By the end, you can…</h2>
          <ul>
            {lesson.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <a className="text-link" href="#lesson-quiz">
            Go to the questions ↓
          </a>
          <br />
          <a className="text-link" href="#sources">
            Read the sources ↓
          </a>
        </aside>
        <div className="lesson-reading">
          {lesson.sections.map((s) => (
            <section key={s.title}>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </section>
          ))}
        </div>
      </div>
      {slug === "kidney-map" && <NephronMap />}
      <section className="pathway-section">
        <p className="eyebrow">Make the connection</p>
        <ol className="pathway-map">
          {lesson.pathway.map((p, i) => (
            <li key={p.title}>
              <span>{i + 1}</span>
              <h3>{p.title}</h3>
              <p>{p.detail}</p>
            </li>
          ))}
        </ol>
      </section>
      <aside className="misconception">
        <p className="eyebrow">The common trap</p>
        <p>{lesson.misconception}</p>
      </aside>
      {[
        "afferent-efferent",
        "abg-interpretation",
        "concentrating-urine",
      ].includes(slug) && (
        <p>
          <Link
            className="button button-secondary"
            href={
              slug === "abg-interpretation"
                ? "/practice/physiology#abg"
                : "/practice/physiology"
            }
          >
            Explore this in the physiology lab →
          </Link>
        </p>
      )}
      {slug === "tubular-transport" && (
        <p>
          <Link className="button button-secondary" href="/practice/histology">
            Connect this with histology →
          </Link>
        </p>
      )}
      <div id="lesson-quiz">
        <RenalQuiz
          key={slug}
          quizId={`lesson:${slug}`}
          questions={renalQuestions.filter((q) => q.lesson === slug)}
        />
      </div>
      <CompleteLesson slug={slug} />
      <nav className="lesson-pagination" aria-label="Course lessons">
        {previous ? (
          <Link className="text-link" href={renalLessonHref(previous.slug)}>
            ← {previous.title}
          </Link>
        ) : (
          <Link className="text-link" href="/learn/renal">
            ← Course overview
          </Link>
        )}
        {next ? (
          <Link className="text-link" href={renalLessonHref(next.slug)}>
            Next: {next.title} →
          </Link>
        ) : (
          <Link className="text-link" href="/study">
            Continue with your review queue →
          </Link>
        )}
      </nav>
      <RenalSources section={lesson.sourceSection} />
    </div>
  );
}

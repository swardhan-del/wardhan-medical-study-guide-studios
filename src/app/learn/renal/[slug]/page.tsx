import { SearchBreadcrumbs } from "@/components/search-breadcrumbs";
import { StructuredData } from "@/components/structured-data";
import { lessonSchema } from "@/lib/structured-data";
import { getSiteUrl } from "@/lib/site-url";
import { renalRevision } from "@/content/renal-course";
import { searchMetadata } from "@/lib/search-metadata";
import { StudyVisual, VisualFlow } from "@/components/study-visual";
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
import { CompleteLesson, LessonPracticeLink } from "@/components/lesson-actions";
import { RenalSources } from "@/components/renal-sources";
export const dynamicParams = false;
export function generateStaticParams() {
  return renalLessons.map((l) => ({ slug: l.slug }));
}
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return searchMetadata(`/learn/renal/${slug}`);
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
      <StructuredData data={lessonSchema({ path: renalLessonHref(slug), title: lesson.title, summary: lesson.description,
        updatedAt: renalRevision, minutes: lesson.minutes, objectives: lesson.objectives,
        citation: [`Medical Physiology: Renal Physiology, Revision 15. ${lesson.sourceSection}.`, "https://www.ncbi.nlm.nih.gov/books/NBK482248/", "https://www.merckmanuals.com/professional/nephrology/acid-base-regulation-and-disorders/acid-base-disorders"],
      }, getSiteUrl())} />
      <SearchBreadcrumbs items={[{ name: "Library", href: "/library" }, { name: "Physiology", href: "/study/physiology" }, { name: "Renal physiology", href: "/learn/renal" }, { name: lesson.title, href: renalLessonHref(slug) }]} />
      <header className="study-hero">
        <Link className="text-link" href="/learn/renal">
          ← Renal course
        </Link>
        <p className="eyebrow">
          Lesson {index + 1} of 8 · {lesson.minutes} minutes + self-assessment
        </p>
        <h1>{lesson.title}</h1>
        <p className="interior-lede">{lesson.description}</p>
        <SaveButton id={`renal-${slug}`} title={lesson.title} />
      </header>
      <div className="lesson-layout">
        <aside className="lesson-outline">
          <h2>Learning Objectives</h2>
          <ul>
            {lesson.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
          <LessonPracticeLink slug={slug} />
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
      <StudyVisual className="pathway-section" headingLevel={2} title="Connect the mechanism"
        alt={lesson.pathway.map(p=>`${p.title}: ${p.detail}`).join(" ")}
        caption="Read the labelled relationships in order. This is a conceptual study sequence, not a scale anatomical drawing or a measured time course."
        observe="Explain the relationship between each adjacent pair of stages, then identify where the lesson’s common misconception would interrupt the reasoning."
        credit="Original teaching sequence · Wardhan Medical Study Guide Studios; adapted from Medical Physiology: Renal Physiology, Revision 15. AI-assisted."
        sources={[{title:"Lesson source sections and supporting references",url:"#sources"}]}>
        <VisualFlow label="Renal mechanism sequence" steps={lesson.pathway.map(p=>`${p.title}: ${p.detail}`)} />
      </StudyVisual>
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

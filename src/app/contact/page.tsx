import { searchMetadata } from "@/lib/search-metadata";
import { CorrectionForm } from "@/components/correction-form";
import { practiceItems } from "@/content/practice-registry";
import { studio } from "@/content/studio";
export const metadata = searchMetadata("/contact");
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string | string[]; question?: string | string[] }>;
}) {
  const params = await searchParams;
  const question = typeof params.question === "string"
    ? practiceItems.find((item) => item.id === params.question && item.answer !== undefined)
    : undefined;
  const lessonPath =
    typeof params.lesson === "string" &&
    /^\/(?:learn|library|subjects|practice)(?:\/[a-z0-9-]+)*$/.test(
      params.lesson,
    )
      ? params.lesson
      : "";
  const lesson = question ? question.href.split(/[?#]/, 1)[0] : lessonPath;
  return (
    <div className="site-container study-page correction-page">
      <header className="study-hero">
        <p className="eyebrow">Contact</p>
        <h1>Questions, feedback, and corrections</h1>
        <p className="interior-lede">
          Have a question about a resource, found an unclear explanation, or
          noticed an accessibility issue? Your feedback helps improve the
          library.
        </p>
      </header>
      <section className="study-panel" aria-labelledby="contact-email-heading">
        <h2 id="contact-email-heading">Get in touch</h2>
        <p>
          I’m {studio.founderName}, the creator of the library. You can contact
          me at{" "}
          <a href={`mailto:${studio.contactEmail}`}>{studio.contactEmail}</a>{" "}
          with questions or feedback.
        </p>
      </section>
      <section className="study-panel">
        <h2>Share feedback or suggest a correction</h2>
        <p>
          Include the page title, section or question, and a brief description
          of the issue. If you are suggesting a factual correction, include a
          supporting source where possible.
        </p>
        <CorrectionForm key={question?.id ?? lesson} lesson={lesson} questionId={question?.id} email={studio.contactEmail} />
      </section>
    </div>
  );
}

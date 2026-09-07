import { CorrectionForm } from "@/components/correction-form";
import { studio } from "@/content/studio";
export const metadata = {
  title: "Questions, feedback, and corrections",
  description:
    "Ask a question, suggest a correction or report an accessibility issue in the medical study library.",
  alternates: { canonical: "/contact" },
  robots: { index: false, follow: true },
};
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ lesson?: string }>;
}) {
  const params = await searchParams;
  const lesson =
    typeof params.lesson === "string" &&
    /^\/(?:learn|library|subjects|practice)(?:\/[a-z0-9-]+)*$/.test(
      params.lesson,
    )
      ? params.lesson
      : "";
  return (
    <div className="site-container study-page">
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
        <CorrectionForm lesson={lesson} email={studio.contactEmail} />
      </section>
    </div>
  );
}

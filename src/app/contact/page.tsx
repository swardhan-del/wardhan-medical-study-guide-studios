import { CorrectionForm } from "@/components/correction-form";
import { studio } from "@/content/studio";
export const metadata = {
  title: "Contact and corrections",
  description:
    "Contact Siddhartha Harshwardhan about independently developed medical study resources, corrections and accessibility.",
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
        <p className="eyebrow">Contact the studio</p>
        <h1>A conversation about learning.</h1>
        <p>
          I’m {studio.founderName}. I’m building this website independently to
          help medical students understand difficult ideas, drawing on my own
          study notes and knowledge base.
        </p>
        <p>
          I struggled with medical sciences as a medical student. This project
          grows out of the ways I learned to make sense of them, with the hope
          that those approaches can help someone else.
        </p>
      </header>
      <section className="study-panel" aria-labelledby="contact-email-heading">
        <h2 id="contact-email-heading">Get in touch</h2>
        <p>
          For resource questions, accessibility feedback or collaboration
          inquiries, email me at{" "}
          <a href={`mailto:${studio.contactEmail}`}>{studio.contactEmail}</a>.
        </p>
      </section>
      <section className="study-panel">
        <h2>Send a correction or feedback</h2>
        <p>
          Found an error or an unclear explanation? Include the section so I can
          find it and improve it.
        </p>
        <CorrectionForm lesson={lesson} email={studio.contactEmail} />
      </section>
    </div>
  );
}

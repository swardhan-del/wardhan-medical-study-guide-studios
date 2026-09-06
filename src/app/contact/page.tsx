import { CorrectionForm } from "@/components/correction-form";
export const metadata = {
  title: "Contact and corrections",
  description: "Report a lesson correction or accessibility issue.",
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
  const configured = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  const email =
    configured && /^[^\s@<>?&#]+@[^\s@<>?&#]+\.[^\s@<>?&#]+$/.test(configured)
      ? configured
      : null;
  return (
    <div className="site-container study-page">
      <header className="study-hero">
        <p className="eyebrow">Contact the studio</p>
        <h1>Help make the next explanation clearer.</h1>
        <p>
          Report an error, an unclear diagram or an accessibility problem.
          Include the section so we can find it.
        </p>
      </header>
      <section className="study-panel">
        <h2>Send a correction or feedback</h2>
        <CorrectionForm lesson={lesson} email={email} />
      </section>
    </div>
  );
}

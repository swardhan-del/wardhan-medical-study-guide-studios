import Link from "next/link";
export const metadata = {
  title: "Contact",
  description: "Get in touch about the Wardhan Medical study library.",
  alternates: { canonical: "/contact" },
};
export default function ContactPage() {
  const configured = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  const email =
    configured && /^[^\s@<>?&#]+@[^\s@<>?&#]+\.[^\s@<>?&#]+$/.test(configured)
      ? configured
      : null;
  return (
    <div className="page-stack page-interior">
      <section className="interior-hero site-container">
        <p className="eyebrow">Contact the studio</p>
        <h1>A conversation about learning.</h1>
        <p className="interior-lede">
          For resource questions, accessibility feedback, or collaboration
          inquiries.
        </p>
      </section>
      <section className="contact-section site-container">
        <div className="contact-card">
          <p className="eyebrow">
            {email ? "Email the studio" : "Contact availability"}
          </p>
          <h2>
            {email
              ? "Get in touch."
              : "Public contact details are being prepared."}
          </h2>
          <p>
            {email
              ? "Use the email link below to open your email application. Include the resource title when asking about a guide."
              : "If a direct contact channel has been shared with you, please use that channel. You can explore the library in the meantime."}
          </p>
          <div className="contact-actions">
            {email ? (
              <a className="button button-primary" href={`mailto:${email}`}>
                {email}
              </a>
            ) : (
              <Link className="button button-primary" href="/library">
                Explore the library
              </Link>
            )}
          </div>
        </div>
        <aside className="contact-aside">
          <p className="aside-label">Thoughtful feedback helps</p>
          <p>
            A guide title and a page or section reference make a resource
            question easier to follow up.
          </p>
        </aside>
      </section>
    </div>
  );
}

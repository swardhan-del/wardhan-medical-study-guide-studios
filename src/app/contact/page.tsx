import Link from "next/link";

export const metadata = {
  title: "Contact",
  description: "The direct contact pathway for Wardhan Medical Study Guide Studios.",
};

export default function ContactPage() {
  return (
    <div className="page-stack page-interior">
      <section className="interior-hero site-container" aria-labelledby="contact-heading">
        <p className="eyebrow">Contact pathway</p>
        <h1 id="contact-heading">A direct line, when one is ready to share.</h1>
        <p className="interior-lede">This site does not operate a public intake form. If the studio has shared a direct contact channel with you, please use that channel for release questions, accessibility notes, or collaboration inquiries.</p>
      </section>
      <section className="contact-section site-container" aria-labelledby="contact-status-heading">
        <div className="contact-card">
          <p className="eyebrow">Current status</p>
          <h2 id="contact-status-heading">Public contact details are being prepared.</h2>
          <p>Until a direct channel is published, this site remains read-only. No message is collected or stored here.</p>
          <div className="contact-actions">
            <Link className="button button-primary" href="/subjects">Browse subject interests <span aria-hidden="true">↗</span></Link>
            <Link className="text-link" href="/">Back to home <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <aside className="contact-aside">
          <span className="aside-index">03</span>
          <p className="aside-label">A public site with no intake backend</p>
          <p>Keeping the pathway simple means nothing is submitted accidentally and no invented address is presented as official.</p>
        </aside>
      </section>
    </div>
  );
}

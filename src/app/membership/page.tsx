import Link from "next/link";

export const metadata = {
  title: "Membership",
  description: "Proposed memberships for complete foundation and deeper learning modules. Enrolment is not open yet.",
  alternates: { canonical: "/membership" },
};

export default function MembershipPage() {
  return (
    <div className="page-stack page-interior">
      <section className="interior-hero site-container" aria-labelledby="membership-heading">
        <p className="eyebrow">Membership</p>
        <h1 id="membership-heading">Follow complete learning sequences.</h1>
        <p className="interior-lede">Membership unlocks whole modules—not isolated lessons, videos, or question purchases.</p>
        <p>Membership is in preparation. Enrolment and payments are not open yet.</p>
      </section>
      <section className="prose-section site-container" aria-labelledby="membership-includes">
        <div className="prose-column">
          <h2 id="membership-includes">What membership includes</h2>
          <p>Member learning will include full lessons, question sets with explanations, downloads, videos, interactive tools, and protected media when those materials have been reviewed and released.</p>
          <p>The planned public pages will be a catalogue and curriculum guide, without teaching samples in place of membership. The existing public library remains available during this preparation.</p>
          <h2>Basic — proposed level</h2>
          <p>Complete foundation modules, organised as full learning sequences.</p>
          <ul>
            <li>Complete foundation modules</li>
            <li>Their lesson questions and explained answers</li>
            <li>Member dashboard and progress tools</li>
          </ul>
          <h2>Advanced — proposed level</h2>
          <p>Complete deeper modules plus additional learning tools.</p>
          <ul>
            <li>Everything in Basic</li>
            <li>Complete deeper modules</li>
            <li>Additional member tools as they are reviewed and released</li>
          </ul>
          <h2>Commercial details still to be decided</h2>
          <p>Prices, billing interval, taxes, refund policy, launch date, and final module-to-tier allocation are not published or configured yet.</p>
          <p><Link href="/member">Visit the member area</Link></p>
        </div>
        <aside className="quote-panel" aria-label="Membership availability">
          <p>Whole modules. Connected learning sequences.</p>
          <span className="quote-attribution">Proposed memberships · Enrolment closed</span>
        </aside>
      </section>
    </div>
  );
}

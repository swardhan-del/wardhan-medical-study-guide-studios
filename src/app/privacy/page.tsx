import { AnalyticsPreference } from "@/components/learning-analytics";
import { studio } from "@/content/studio";
export const metadata = {
  title: "Privacy",
  description:
    "How the study library handles browser storage, optional waitlist signup and consent-based analytics.",
  alternates: { canonical: "/privacy" },
};
export default function PrivacyPage() {
  return (
    <div className="site-container library-page">
      <header className="library-heading">
        <p className="eyebrow">Privacy and your choices</p>
        <h1>Privacy in the study library.</h1>
      </header>
      <div className="privacy-copy">
        <p>This independent project is operated by {studio.founderName}. For privacy questions or requests, email <a href={`mailto:${studio.contactEmail}`}>{studio.contactEmail}</a>. Last updated 26 September 2026.</p>
        <h2 id="waitlist">Optional pre-launch waitlist</h2>
        <p>The waitlist page states whether signup is open. In demo mode, the form checks an example address in page memory only. It sends no signup request, saves no address and sends no email. Closing or reloading the page clears the form.</p>
        <p>When live signup is enabled, we use your consent to request launch and new free-resource updates. We send your email and a dated consent-notice record to Brevo, our email provider. You join only after following its confirmation link. We do not ask for your name, university, study progress or health information. Your email is not stored in browser storage, the repository or an application database.</p>
        <p>Live signup uses Cloudflare Turnstile to reduce automated abuse. It loads only when you select “Start spam-protection check” and processes device and network information; our server checks the resulting token. Brevo handles the confirmation email, subscription and unsubscribe records. These providers may process information internationally under their service arrangements. See <a href="https://www.brevo.com/legal/privacypolicy/" rel="noreferrer">Brevo’s privacy policy</a> and <a href="https://www.cloudflare.com/privacypolicy/" rel="noreferrer">Cloudflare’s privacy policy</a>.</p>
        <p>You can withdraw consent through the unsubscribe link in updates or by emailing the privacy contact above, without losing access to free lessons. Live waitlist records are kept until you withdraw or the waitlist closes, with a review after 12 months. Unconfirmed requests are removed within 30 days. Minimal suppression records may be retained by the email provider to honour an unsubscribe. These retention procedures must be configured before live signups open.</p>
        <p>You can ask to access, correct, export or delete your information, or restrict or object to its use where applicable. You may complain to your local data-protection authority. There is no sale of waitlist addresses, advertising profile or automated eligibility decision.</p>
        <h2>Saved resources</h2>
        <p>
          When you save a resource, its identifier is stored in this browser’s
          local storage. The site does not send your reading list to a server.
          Clear it from Your saved resources in My Study, or delete this site’s browser
          data.
        </p>
        <h2>Learning progress</h2>
        <p>
          Lesson completion, quiz attempts, review dates, study-day counts, oral
          self-assessment and your exam plan are stored in this browser. They
          stay in this browser as detailed records. Aggregate activity events
          are described below. Open My Study to download a progress record or
          clear it. Export and import let you manually transfer progress and saved resources between devices. Importing reads the file in your browser without uploading it. Automatic synchronisation is not available. Written
          explanations, oral drafts and self-checks are also saved in this
          browser, so they survive reloads and topic changes. They are included
          in the downloaded progress record and removed by clearing learning
          progress. Your writing is not sent to the studio or to an AI service.
        </p>
        <h2>Sharing</h2>
        <p>
          The challenge button copies a public URL. Your answers and scores are
          not included. The local share count records successful link copies,
          not whether somebody received or opened the link.
        </p>
        <h2>Contact</h2>
        <p>
          The correction form prepares a draft in page memory. It sends nothing
          automatically and does not save your message on this website. Opening
          the email draft passes its contents to your email application. You
          review and send it there, and your email provider handles the message.
          Do not include personal or patient information.
        </p>
        <h2>Hosting and external files</h2>
        <p>
          The hosting service processes requests needed to deliver the site,
          which can include network and browser information. Opening a resource
          hosted elsewhere sends a request to that file’s host. Only after you
          choose “Allow analytics”, production may use Vercel Web Analytics for page views and curriculum activity events.
          Events contain fixed lesson or quiz identifiers, or a
          returning-study-day flag; they do not include answer text, scores,
          oral drafts or exam dates. Query strings and personal study pages are
          excluded from page-view tracking, as are waitlist pages. One fixed
          waitlist event may record that the email provider accepted a confirmation
          request; it does not prove delivery or confirmed membership. It contains
          no address, token or form text. This site honours Do Not Track and
          Global Privacy Control signals.
        </p>
        <h2>Analytics preference</h2>
        <p>
          Analytics is off unless you explicitly allow it in this browser.
          You can withdraw permission here at any time. Joining the waitlist
          never enables analytics. The setting does not change your study progress.
        </p>
        <AnalyticsPreference />
      </div>
    </div>
  );
}

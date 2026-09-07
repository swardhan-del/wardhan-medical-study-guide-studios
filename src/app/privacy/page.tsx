import { AnalyticsPreference } from "@/components/learning-analytics";
export const metadata = {
  title: "Privacy",
  description:
    "How the study library handles saved reading lists and contact links.",
  alternates: { canonical: "/privacy" },
};
export default function PrivacyPage() {
  return (
    <div className="site-container library-page">
      <header className="library-heading">
        <p className="eyebrow">Your browser, your list</p>
        <h1>Privacy in the study library.</h1>
      </header>
      <div className="privacy-copy">
        <h2>Saved resources</h2>
        <p>
          When you save a resource, its identifier is stored in this browser’s
          local storage. The site does not send your reading list to a server.
          Clear it from Saved learning in My Study, or delete this site’s browser
          data.
        </p>
        <h2>Learning progress</h2>
        <p>
          Lesson completion, quiz attempts, review dates, study-day counts, oral
          self-assessment and your exam plan are stored in this browser. They
          stay in this browser as detailed records. Aggregate activity events
          are described below. Open My study to download a progress record or
          clear it. This does not synchronize between browsers or devices. Written
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
          hosted elsewhere sends a request to that file’s host. Production uses
          Vercel Web Analytics for page views and curriculum activity events.
          Events contain fixed lesson or quiz identifiers, or a
          returning-study-day flag; they do not include answer text, scores,
          oral drafts or exam dates. Query strings and personal study pages are
          excluded from page-view tracking. This site honors Do Not Track and
          Global Privacy Control signals.
        </p>
        <h2>Analytics preference</h2>
        <p>
          You can opt out on this browser. The setting does not change your
          saved learning progress.
        </p>
        <AnalyticsPreference />
      </div>
    </div>
  );
}

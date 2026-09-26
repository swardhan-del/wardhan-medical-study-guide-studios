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
          hosted elsewhere sends a request to that file’s host. The website checks
          its own analytics configuration without sending a learning event or
          contacting an analytics recipient. No optional measurement starts
          before you choose “Allow optional analytics”.
        </p>
        <h2>Optional analytics</h2>
        <p>
          If configured and allowed, measurement sends only an event name and a
          public subject, lesson, quiz or resource identifier. It helps us understand
          which learning resources are used. It does not send names, email addresses,
          student identifiers, answers, scores, written explanations, exam dates,
          page URLs, search terms or referrers. We do not add advertising trackers,
          cross-site identifiers, session recordings or automatic page-view tracking.
          The named recipient and its privacy information appear in the controls below
          when measurement is configured. This site does not forward your IP address,
          browser headers or cookies to that recipient.
        </p>
        <p>
          You can refuse or withdraw permission without losing access to any study
          feature. Your choice is stored in this browser for up to 180 days, separately
          from your study progress. A changed measurement policy or recipient requires
          a new choice. Earlier activity is not sent when you opt in. Withdrawal stops
          new events; it cannot recall counts already delivered. Do Not Track and
          Global Privacy Control keep measurement off. If configuration, storage or
          delivery is unavailable, your lessons and practice continue to work.
        </p>
        <h2>Analytics preference</h2>
        <AnalyticsPreference />
      </div>
    </div>
  );
}

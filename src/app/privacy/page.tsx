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
          Clear it from the Reading list page, or delete this site’s browser
          data.
        </p>
        <h2>Contact</h2>
        <p>
          If a public email address is available, the contact link opens your
          email application. This website has no contact form and does not store
          messages.
        </p>
        <h2>Hosting and external files</h2>
        <p>
          The hosting service processes requests needed to deliver the site,
          which can include network and browser information. Opening a resource
          hosted elsewhere sends a request to that file’s host. This application
          includes no advertising or analytics scripts.
        </p>
      </div>
    </div>
  );
}

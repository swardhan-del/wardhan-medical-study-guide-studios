import Link from "next/link";
import { DirectoryBrowser } from "@/components/directory-browser";
import {
  directoryEntries,
  directorySubjects,
  directoryUpdatedAt,
} from "@/lib/subject-directory";

export const metadata = {
  title: "Medical subject directory",
  description:
    "Browse medical subjects, subtopics, printable study-guide collections and their original Dropbox folders.",
  alternates: { canonical: "/subjects" },
};

export default function SubjectsPage() {
  const folders = directoryEntries.filter((e) => e.kind === "folder").length;
  return (
    <div className="site-container directory-page">
      <header className="library-heading">
        <p className="eyebrow">Medical subject directory</p>
        <h1>Your subjects. Your guides. One directory.</h1>
        <p className="interior-lede">
          Find a medical subject, follow its subtopics, and open the original
          study-guide folders in Dropbox.
        </p>
        <div className="directory-stats">
          <span>
            <strong>{directorySubjects.length}</strong> subject views
          </span>
          <span>
            <strong>{folders.toLocaleString("en-US")}</strong> folder links
          </span>
          <span>
            <strong>{directoryEntries.length - folders}</strong> reference &
            guide files
          </span>
        </div>
        <p className="directory-access">
          Dropbox links open in a new tab using your existing access. Sign in to
          the Dropbox account that contains these folders.
        </p>
      </header>
      <DirectoryBrowser
        entries={directoryEntries}
        subjects={directorySubjects}
        overview
      />
      <section
        className="directory-subjects"
        aria-labelledby="directory-subjects-title"
      >
        <div className="directory-section-heading">
          <h2 id="directory-subjects-title">Browse by subject</h2>
          <Link className="text-link" href="/library">
            Study the website lessons →
          </Link>
        </div>
        <div className="directory-subject-grid">
          {directorySubjects.map((subject, i) => {
            const count = directoryEntries.filter((e) =>
              e.subjects.includes(subject.id),
            ).length;
            return (
              <article className="directory-subject-card" key={subject.id}>
                <p className="eyebrow">
                  {String(i + 1).padStart(2, "0")} · {count} directory links
                </p>
                <h3>
                  <Link href={`/subjects/${subject.id}`}>{subject.title}</Link>
                </h3>
                <p>{subject.description}</p>
                <Link
                  className="text-link"
                  href={`/subjects/${subject.id}`}
                  aria-label={`Explore subject for ${subject.title}`}
                >
                  Browse subtopics →
                </Link>
                {subject.printableUrl && (
                  <a
                    className="directory-print-link"
                    href={subject.printableUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Printable guide collection ↗
                    <span className="sr-only">
                      {" "}
                      — {subject.title}, Dropbox, new tab
                    </span>
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </section>
      <aside className="directory-note">
        <h2>A map of the source library</h2>
        <p>
          The directory follows the medical folders and the curated concept
          library. Shared collections appear in both relevant subjects. Expand
          folders to see the hierarchy, or search for a concept across subjects.
        </p>
        <p>
          Checked {directoryUpdatedAt}. Working files, rendering output,
          duplicate quarantines and administrative records are excluded. Open
          the original subject folder to inspect its complete contents and
          versions.
        </p>
      </aside>
    </div>
  );
}

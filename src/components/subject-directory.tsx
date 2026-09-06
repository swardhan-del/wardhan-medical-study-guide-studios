import { DirectoryBrowser } from "@/components/directory-browser";
import {
  directorySubjects,
  directoryUpdatedAt,
  entriesForSubject,
} from "@/lib/subject-directory";

export function SubjectDirectory({ id }: { id: string }) {
  const subject =
    directorySubjects.find((s) => s.id === id) ||
    (id === "histology"
      ? directorySubjects.find((s) => s.id === "histology-i")
      : undefined);
  if (!subject) return null;
  const entries = entriesForSubject(id);
  return (
    <section
      className="subject-directory"
      id="dropbox-directory"
      aria-labelledby="directory-heading"
    >
      <header>
        <p className="eyebrow">Your source directory</p>
        <h2 id="directory-heading">Guides, subtopics and source folders.</h2>
        <p>
          Open a folder title in Dropbox, or expand it here to see its
          subtopics. Links use your existing Dropbox access; they may ask you to
          sign in.
        </p>
      </header>
      <div className="directory-shortcuts">
        {subject.printableUrl ? (
          <a
            href={subject.printableUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="directory-shortcut"
          >
            <span className="eyebrow">Start here</span>
            <strong>Final printable guide collection ↗</strong>
            <span>
              {subject.printableNote ||
                "Open the guide editions and their divided volumes."}
            </span>
            <span className="sr-only">Opens Dropbox in a new tab</span>
          </a>
        ) : (
          <div className="directory-shortcut">
            <strong>Source collection</strong>
            <span>
              No separate final-printable folder was found for this subject. The
              available reference files are listed below.
            </span>
          </div>
        )}
        <a
          href={subject.dropboxUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="directory-shortcut"
        >
          <span className="eyebrow">Browse in Dropbox</span>
          <strong>Open the subject folder ↗</strong>
          <span>See the original files, folder hierarchy and versions.</span>
          <span className="sr-only">Opens Dropbox in a new tab</span>
        </a>
      </div>
      <DirectoryBrowser entries={entries} />
      <p className="directory-footnote">
        Folder inventory checked {directoryUpdatedAt}. “Final printable”
        identifies the source folder’s name; its files may include multiple
        editions. Curated topic links open the review collection. Publication
        permission and scientific review are separate from folder placement.
      </p>
    </section>
  );
}

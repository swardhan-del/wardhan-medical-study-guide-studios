import { publicCatalog } from "@/lib/catalog";
import { SubjectCard } from "@/components/subject-card";
import { subjectInterests } from "@/content/subjects";

export const metadata = {
  title: "Subjects",
  description:
    "Subject interests and public-release availability from Wardhan Medical Study Guide Studios.",
};

export default function SubjectsPage() {
  const hasPublicCollections = publicCatalog.length > 0;

  return (
    <div className="page-stack page-interior">
      <section
        className="interior-hero site-container"
        aria-labelledby="subjects-heading"
      >
        <p className="eyebrow">Subject interests</p>
        <h1 id="subjects-heading">
          The fields the library is being shaped around.
        </h1>
        <p className="interior-lede">
          Explore each subject, then browse its released guides and volumes.
        </p>
      </section>
      <section
        className="subjects-section site-container"
        aria-labelledby="availability-heading"
      >
        <div className="empty-state" role="status" aria-live="polite">
          <span className="empty-state-code">
            {hasPublicCollections ? "01" : "00"}
          </span>
          <div>
            <p className="eyebrow">Public collections</p>
            <h2 id="availability-heading">
              {hasPublicCollections
                ? "Explore the released resources."
                : "No public collections are available yet."}
            </h2>
            <p>
              {hasPublicCollections
                ? "Open the Library to search all released resources."
                : "The subject map is ready; the public release layer is still being prepared."}
            </p>
          </div>
        </div>
        <div className="subject-grid subjects-grid-page">
          {subjectInterests.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      </section>
    </div>
  );
}

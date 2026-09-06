import { CorrectionLink } from "./correction-link";
import { renalRevision } from "@/content/renal-course";
export function RenalSources({ section }: { section?: string }) {
  return (
    <section className="study-sources" id="sources">
      <p className="eyebrow">Authorship & sources</p>
      <h2>Know what you are learning from.</h2>
      <p>
        Published by Wardhan Medical Study Guide Studios. Web lessons, questions
        and original schematics are adapted from the studio’s curated renal
        study guide. Revised{" "}
        <time dateTime={renalRevision}>6 September 2026</time>.
      </p>
      <ol>
        <li>
          <strong>Medical Physiology: Renal Physiology, Revision 15</strong>, 2
          September 2026.{" "}
          {section ??
            "Chapters 28–33: circulation, clearance, tubular handling, concentration, volume regulation and acid–base balance."}{" "}
          The full manuscript is held in the private study library.
        </li>
        <li>
          <a
            className="text-link"
            href="https://www.ncbi.nlm.nih.gov/books/NBK482248/"
          >
            Dalal, Bruss & Sehdev: Renal Blood Flow and Filtration
          </a>
          , StatPearls / NCBI Bookshelf. Supplementary hemodynamics reference.
        </li>
        <li>
          <a
            className="text-link"
            href="https://www.merckmanuals.com/professional/nephrology/acid-base-regulation-and-disorders/acid-base-disorders"
          >
            Merck Manual: Acid–Base Disorders
          </a>
          . External cross-check for compensation and anion-gap reasoning,
          accessed 6 September 2026.
        </li>
      </ol>
      <p className="source-note">
        Editorial status: source-checked educational adaptation, with
        AI-assisted drafting and implementation. No independent clinical peer
        review is claimed. Examples teach mechanisms and exam reasoning; they
        are not patient-care guidance.{" "}
        <CorrectionLink />
        .
      </p>
    </section>
  );
}

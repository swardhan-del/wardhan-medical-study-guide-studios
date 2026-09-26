import { SaveButton } from "@/components/save-button";
import { searchMetadata } from "@/lib/search-metadata";
import Link from "next/link";
import { OralPractice } from "@/components/oral-practice";
export const metadata = searchMetadata("/practice/oral");
export default function OralPage() {
  return (
    <div className="site-container study-page">
      <header className="study-hero">
        <Link className="text-link" href="/learn/renal">
          ← Renal course
        </Link>
        <p className="eyebrow">Oral-exam practice</p>
        <h1>
          Can you explain
          <br />
          <em>the mechanism?</em>
        </h1>
        <p className="interior-lede">
          Practice a coherent answer, compare it with the key points, then go
          one question deeper.
        </p>
      <SaveButton id="oral-practice" title="Oral practice" />
      </header>
      <OralPractice />
      <p className="source-note">
        <Link className="text-link" href="/learn/renal#sources">
          Course authorship and sources →
        </Link>
      </p>
    </div>
  );
}

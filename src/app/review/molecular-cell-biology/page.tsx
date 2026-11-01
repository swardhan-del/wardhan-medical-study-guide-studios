import Link from "next/link";
import data from "@/content/mcb-review-visuals.json";
import { requireLocalReview } from "@/lib/local-review";
export const dynamic = "force-dynamic";
export const metadata = { title: "Molecular Cell Biology diagram review", robots: { index: false, follow: false } };
export default function McbReviewPage() {
  requireLocalReview();
  return <div className="site-container library-page">
    <header className="library-heading"><p className="eyebrow">Local curation review</p><h1>Molecular Cell Biology diagram review</h1>
      <p className="interior-lede">Three existing original diagrams, integrated beside their published lessons for review. No new lesson or archive artwork is released.</p>
      <p className="study-notice">Scientific, editorial, human accessibility and applicable public-use reviews remain pending. This view is disabled on Vercel even if the local flag is set.</p></header>
    <ol>{data.visuals.map(visual => <li key={visual.id}><h2><Link href={`/review/molecular-cell-biology/${visual.lessonIds[0]}#draft-visual-review`}>{visual.title}</Link></h2><p>{visual.caption}</p></li>)}</ol>
    <Link href="/study/cell-biology">Open the published Molecular Cell Biology lessons</Link>
  </div>;
}

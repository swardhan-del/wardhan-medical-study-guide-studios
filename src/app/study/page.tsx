import Link from "next/link";
import { SavedLearning } from "@/components/saved-learning";
import { publicCatalog } from "@/lib/catalog";
import { StudyDashboard } from "@/components/study-dashboard";
export const metadata = {
  title: "My Study",
  description:
    "Return to saved resources, review your practice, and choose your next topic.",
  robots: { index: false, follow: true },
};
export default function StudyPage() {
  return (
    <div className="site-container study-page">
      <header className="study-hero">
        <p className="eyebrow">My Study</p>
        <h1>Continue your learning</h1>
        <p className="interior-lede">
          Return to saved resources, review your practice, and choose your next
          topic.
        </p>
      </header>
      <p><Link className="text-link" href="/start">First visit? Choose a starting lesson →</Link></p>
      <section className="study-panel" aria-labelledby="study-map-title">
        <p className="eyebrow">The wider course</p>
        <h2 id="study-map-title">Explore the study map</h2>
        <p>Follow the source-based sequence across subjects and see which topics have an introduction available and which are planned.</p>
        <Link className="button button-secondary" href="/study/map">Open study map</Link>
      </section>
      <StudyDashboard />
      <SavedLearning records={publicCatalog} />
    </div>
  );
}

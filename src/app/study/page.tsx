import { SavedLearning } from "@/components/saved-learning";
import { publicCatalog } from "@/lib/catalog";
import { StudyDashboard } from "@/components/study-dashboard";
export const metadata = {
  title: "My study dashboard",
  robots: { index: false, follow: true },
};
export default function StudyPage() {
  return (
    <div className="site-container study-page">
      <header className="study-hero">
        <p className="eyebrow">Your personal study space</p>
        <h1>
          A little stronger
          <br />
          <em>every day.</em>
        </h1>
        <p className="interior-lede">
          See what you have practiced, revisit what needs work and choose your
          next session.
        </p>
      </header>
      <StudyDashboard />
      <SavedLearning records={publicCatalog} />
    </div>
  );
}

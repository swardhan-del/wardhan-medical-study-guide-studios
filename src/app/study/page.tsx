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
      <StudyDashboard />
      <SavedLearning records={publicCatalog} />
    </div>
  );
}

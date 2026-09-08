import Link from "next/link";
import { renalLessons, renalQuestions } from "@/content/renal-course";
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
      <section className="study-courses" aria-labelledby="study-courses-title">
        <h2 id="study-courses-title">Your courses</h2>
        <div className="study-panel study-subject">
          <h3><Link href="/subjects/physiology">Physiology</Link></h3>
          <article className="study-course" aria-labelledby="renal-course-title">
            <div>
              <h4 id="renal-course-title"><Link href="/learn/renal">Renal physiology</Link></h4>
              <p>Work through kidney function, from filtration to fluid balance.</p>
              <p className="source-note">{renalLessons.length} lessons · {renalQuestions.length} practice questions</p>
            </div>
            <Link className="button button-secondary" href="/learn/renal">Open course</Link>
          </article>
        </div>
      </section>
      <StudyDashboard />
      <SavedLearning records={publicCatalog} />
    </div>
  );
}

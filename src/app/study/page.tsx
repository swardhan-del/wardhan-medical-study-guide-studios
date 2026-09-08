import Link from "next/link";
import { studySubjects, subjectLessons } from "@/lib/study-collections";
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
        <h2 id="study-courses-title">Study by subject</h2>
        <div className="study-panel study-subject">
          <h3><Link href="/study/physiology">Physiology</Link></h3>
          <article className="study-course" aria-labelledby="renal-course-title">
            <div>
              <h4 id="renal-course-title"><Link href="/learn/renal">Renal physiology</Link></h4>
              <p>Work through kidney function, from filtration to fluid balance.</p>
              <p className="source-note">{renalLessons.length} lessons · {renalQuestions.length} practice questions</p>
            </div>
            <Link className="button button-secondary" href="/learn/renal">Open course</Link>
          </article>
          <div className="action-row"><Link className="button button-primary" href="/study/physiology">Explore all physiology sections</Link></div>
          <p>Study cellular, cardiovascular, respiratory, renal, blood, digestive, endocrine and nervous-system physiology through lessons, questions and narrated recaps.</p>
        </div>
        <div className="studio-grid">{studySubjects.filter(s => s.id !== "physiology").map(s => <article key={s.id} className="study-panel studio-card"><p className="eyebrow">Subject {s.number}</p><h3><Link href={"/study/" + s.id}>{s.title}</Link></h3><p>{s.description}</p><p className="muted-note">{subjectLessons(s.id).length} focused lessons · Recap cards and explained questions</p><Link className="text-link" href={"/study/" + s.id}>Open subject learning →</Link></article>)}</div>
      </section>
      <StudyDashboard />
      <SavedLearning records={publicCatalog} />
    </div>
  );
}

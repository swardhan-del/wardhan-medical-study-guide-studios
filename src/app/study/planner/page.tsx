import Link from "next/link";
import { ExamPlanner } from "@/components/study-dashboard";
export const metadata = {
  title: "My renal revision planner",
  robots: { index: false, follow: true },
};
export default function PlannerPage() {
  return (
    <div className="site-container study-page">
      <header className="study-hero">
        <Link className="text-link" href="/study">
          ← My Study
        </Link>
        <p className="eyebrow">Renal revision planner</p>
        <h1>
          Make time
          <br />
          <em>for understanding.</em>
        </h1>
        <p className="interior-lede">
          Turn the renal course into daily time boxes, then use your weak-topic
          map to adjust what needs the most attention.
        </p>
      </header>
      <ExamPlanner />
    </div>
  );
}

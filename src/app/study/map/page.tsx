import Link from "next/link";
import data from "@/content/study-map.json";
import { studyLessons } from "@/lib/study-collections";
import { StudyMapBrowser } from "@/components/study-map-browser";

export const metadata = {
  title: "Study map",
  description: "Explore the subject sequence and distinguish available introductions from planned teaching topics.",
  alternates: { canonical: "/study/map" },
};

export default function StudyMapPage() {
  const total = data.groups.reduce((n, g) => n + g.topics.length, 0);
  return <div className="site-container study-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/study">My Study</Link><span aria-hidden="true"> / </span><span aria-current="page">Study map</span></nav>
    <header className="study-hero"><p className="eyebrow">Plan your learning</p><h1>See how the subjects connect</h1>
      <p className="interior-lede">{total} topics across {data.groups.length} source sections, from regional anatomy to molecular mechanisms.</p>
      <p>The native collection currently contains {studyLessons.length} lessons, alongside the separate renal course. Linked topics have an introduction available; this does not mean their full scope is complete. Planned adaptations are a development sequence, not finished lessons or a measure of syllabus coverage.</p>
      <p>Biostatistics needs a newly authored course. Its topics are proposals rather than an imported textbook.</p>
      <Link className="button button-primary" href="/study">Choose an available lesson</Link>
    </header>
    <StudyMapBrowser groups={data.groups} />
  </div>;
}

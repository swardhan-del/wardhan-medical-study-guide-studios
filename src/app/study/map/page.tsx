import Link from "next/link";
import data from "@/content/study-map.json";
import { studyLessons, studyGroups } from "@/lib/study-collections";
import { StudyMapBrowser } from "@/components/study-map-browser";

export const metadata = {
  title: "Study map",
  description: "Explore the subject sequence and distinguish available introductions from planned teaching topics.",
  alternates: { canonical: "/study/map" },
};

export default function StudyMapPage() {
  const biophysics = studyGroups.filter(g => g.subject === "biophysics").map(g => ({
    id: g.id, subject: g.subject, title: g.title, sourceLabel: "Biophysics teaching sequence",
    topics: g.lessonIds.map(id => ({ id, title: studyLessons.find(l => l.id === id)!.title, href: `/library/${id}`, status: "introduction-available" })),
  }));
  const groups = [...data.groups, ...biophysics];
  const total = groups.reduce((n, g) => n + g.topics.length, 0);
  return <div className="site-container study-page">
    <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/study">My Study</Link><span aria-hidden="true"> / </span><span aria-current="page">Study map</span></nav>
    <header className="study-hero"><p className="eyebrow">Plan your learning</p><h1>See how the subjects connect</h1>
      <p className="interior-lede">{total} topics across {groups.length} teaching sections, from regional anatomy to molecular mechanisms.</p>
      <p>The website currently contains {studyLessons.length} lessons, alongside the separate renal course. Linked topics have an introduction available; this does not mean their full scope is complete. Planned topics are shown so you can see the gaps; they are not finished lessons.</p>
      <p>Biostatistics has no published lessons yet. Use the availability filter to show only topics you can study now.</p>
      <Link className="button button-primary" href="/library">Choose an available lesson</Link>
    </header>
    <StudyMapBrowser groups={groups} />
  </div>;
}

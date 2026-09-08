import Link from "next/link";
import { publicVideos } from "@/lib/videos";
import { taxonomyNodes } from "@/lib/taxonomy";
import { VideoBrowser } from "@/components/video-browser";
export const metadata = {
  title: "Video library",
  description:
    publicVideos.length ? "Watch educational videos and continue with related medical study lessons." : "No videos are available yet. Explore the written lessons and practice activities in the study library.",
  alternates: { canonical: "/videos" },
};
export default function VideosPage() {
  return (
    <div className="site-container library-page">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link href="/library">Library</Link>
        <span aria-current="page"> / Videos</span>
      </nav>
      <header className="library-heading">
        <p className="eyebrow">Study videos</p>
        <h1>Video library</h1>
        <p className="interior-lede">
          {publicVideos.length ? "Watch explanations connected to the subjects and lessons you study." : "No videos are available yet. Explore the written lessons and practice activities in the meantime."}
        </p>
      </header>
      <VideoBrowser
        videos={publicVideos}
        topics={taxonomyNodes
          .filter((n) => publicVideos.some((v) => v.topicIds.includes(n.id)))
          .map((n) => ({ id: n.id, title: n.title }))}
      />
      <Link className="text-link" href="/library">
        Explore written lessons →
      </Link>
    </div>
  );
}

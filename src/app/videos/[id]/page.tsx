import Link from "next/link";
import { notFound } from "next/navigation";
import { publicVideos } from "@/lib/videos";
import { publicCatalog } from "@/lib/catalog";
import { taxonomyNodes } from "@/lib/taxonomy";
import { LibraryBreadcrumbs } from "@/components/taxonomy-navigation";
import { VideoPlayer } from "@/components/video-player";
import { videoDuration } from "@/lib/video-types";
type Props = { params: Promise<{ id: string }> };
export function generateStaticParams() {
  return publicVideos.map((v) => ({ id: v.id }));
}
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const v = publicVideos.find((v) => v.id === id);
  return {
    title: v?.title || "Video not found",
    description: v?.summary,
    alternates: { canonical: "/videos/" + id },
  };
}
export default async function VideoPage({ params }: Props) {
  const { id } = await params;
  const v = publicVideos.find((v) => v.id === id);
  if (!v) notFound();
  return (
    <article className="site-container library-page">
      <LibraryBreadcrumbs
        node={taxonomyNodes.find((n) => n.id === v.topicIds[0])}
      />
      <p className="eyebrow">Video · {videoDuration(v.durationSeconds)}</p>
      <h1>{v.title}</h1>
      <p className="interior-lede">{v.summary}</p>
      <VideoPlayer video={v} />
      <nav className="native-related" aria-label="Related lessons">
        <h2>Continue with a lesson</h2>
        <ul>
          {v.lessonIds.map((id) => (
            <li key={id}>
              <Link href={"/library/" + id}>
                {publicCatalog.find((r) => r.id === id)?.title}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/videos">All videos</Link>
      </nav>
    </article>
  );
}

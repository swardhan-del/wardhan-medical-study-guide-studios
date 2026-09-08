import Link from "next/link";
import { videosForLesson } from "@/lib/videos";
import { VideoPlayer } from "./video-player";
export function LessonVideos({ lessonId }: { lessonId: string }) {
  const videos = videosForLesson(lessonId);
  if (!videos.length) return null;
  return (
    <section id="lesson-videos" aria-label="Related videos">
      <h2>Watch this topic</h2>
      {videos.map((video) => (
        <article key={video.id}>
          <h3>
            <Link href={"/videos/" + video.id}>{video.title}</Link>
          </h3>
          <VideoPlayer video={video} />
        </article>
      ))}
    </section>
  );
}

import data from "@/content/public-videos.json";
import type { PublicVideo } from "./video-types";
export const publicVideos = data.records as PublicVideo[];
export function videosForLesson(id: string) {
  return publicVideos.filter((v) => v.lessonIds.includes(id));
}

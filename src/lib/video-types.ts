export type PublicVideo = {
  id: string;
  title: string;
  summary: string;
  subject: string;
  topicIds: string[];
  lessonIds: string[];
  durationSeconds: number;
  status: "public";
  publicApproval: string;
  medicalReview: "reviewed";
  aiGenerated: boolean;
  sourceUrl: string;
  posterUrl: string;
  captions: { src: string; language: string; label: string }[];
  transcript: { startSeconds: number; text: string }[];
  mimeType: "video/mp4" | "video/webm";
};
export function videoDuration(seconds: number) {
  return (
    Math.floor(seconds / 60) +
    ":" +
    String(Math.floor(seconds % 60)).padStart(2, "0")
  );
}

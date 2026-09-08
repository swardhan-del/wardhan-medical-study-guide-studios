import { LessonVideos } from "@/components/lesson-videos";
export default async function RenalLessonLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <>
      {children}
      <div className="site-container">
        <LessonVideos lessonId={"renal-" + slug} />
      </div>
    </>
  );
}

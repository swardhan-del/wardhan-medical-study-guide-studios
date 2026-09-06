import { renalLessons } from "@/content/renal-course";
import { NextResponse, type NextRequest } from "next/server";
import catalog from "@/content/public-catalog.json";
import { subjectInterests } from "@/content/subjects";
import { anatomyTopicLinks } from "@/content/anatomy-navigation";
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const parts = path.split("/").filter(Boolean);
  const blockedReview =
    parts[0] === "review" &&
    (Boolean(process.env.VERCEL) || process.env.LOCAL_CURATION_REVIEW !== "1");
  const missingResource =
    parts[0] === "library" &&
    parts.length > 1 &&
    (parts.length !== 2 ||
      !(catalog.records as { id: string }[]).some(
        (record) => record.id === parts[1],
      ));
  const knownStudyTopic =
    parts.length === 3 &&
    parts[0] === "subjects" &&
    parts[1] === "anatomy" &&
    anatomyTopicLinks.some((topic) => topic.slug === parts[2]);
  const missingSubject =
    parts[0] === "subjects" &&
    parts.length > 1 &&
    !knownStudyTopic &&
    (parts.length !== 2 ||
      !subjectInterests.some((subject) => subject.id === parts[1]));
  const missingLesson =
    parts[0] === "learn" &&
    parts[1] === "renal" &&
    parts.length > 2 &&
    (parts.length !== 3 ||
      (!renalLessons.some((lesson) => lesson.slug === parts[2]) &&
        parts[2] !== "opengraph-image"));
  if (blockedReview || missingResource || missingSubject || missingLesson) {
    return new NextResponse(
      '<!doctype html><html lang="en"><head><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found</title></head><body><main><h1>Page not found</h1><p>This page is not available.</p><a href="/library">Return to the library</a></main></body></html>',
      {
        status: 404,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "private, no-store",
          "X-Robots-Tag": "noindex, nofollow",
        },
      },
    );
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    "/review/:path*",
    "/library/:path*",
    "/subjects/:path*",
    "/learn/renal/:path*",
  ],
};

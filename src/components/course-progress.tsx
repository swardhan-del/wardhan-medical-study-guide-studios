"use client";

import Link from "next/link";
import type { CourseLessonLink } from "@/lib/course-lessons";
import { useLearning } from "./learning-store";

export function CourseResume({ lessons }: { lessons: CourseLessonLink[] }) {
  const { ready, data } = useLearning();
  const resume = data.resume;
  const last = lessons.find(lesson => lesson.progressId === resume?.lesson);
  const next = lessons.find(lesson => !data.lessons.includes(lesson.progressId));

  if (!ready) return <p>Loading course progress…</p>;
  if (!resume || !last) {
    return next ? <p><Link href={next.href}>Open first unfinished lesson: {next.title}</Link></p>
      : <p>All mapped lessons are marked complete in this browser.</p>;
  }

  const anchor = resume.stage === "practice" ? last.practiceAnchor
    : resume.stage === "summary" ? last.reviewAnchor : "";
  return <p><Link href={last.href + anchor}>Resume: {last.title}</Link></p>;
}

export function CourseLessonProgress({ id }: { id: string }) {
  const { ready, data } = useLearning();
  if (!ready) return null;
  if (data.lessons.includes(id)) return <span> · Marked complete</span>;
  if (data.journey[id] || data.resume?.lesson === id) return <span> · In progress</span>;
  return null;
}

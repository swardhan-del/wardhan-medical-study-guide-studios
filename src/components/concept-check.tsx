"use client";
import type { LibraryLesson } from "@/lib/library-types";
import { PracticeQuestion } from "./practice-question";
export function ConceptCheck({ lesson }: { lesson: Pick<LibraryLesson, "id" | "question"> }) {
  return <div className="concept-check" id="concept-check-title"><PracticeQuestion item={{ id: "concept-" + lesson.id, topic: lesson.id, title: "Check your understanding", subject: "", href: "/library/" + lesson.id, prompt: lesson.question.prompt, answer: lesson.question.answer, options: lesson.question.options.map((o) => ({ text: o.text, explanation: o.reason })) }} /></div>;
}

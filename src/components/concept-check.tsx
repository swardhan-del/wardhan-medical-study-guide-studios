import { typedCheckpointItems } from "@/content/typed-checkpoints";
import type { LibraryLesson } from "@/lib/library-types";
import { PracticeSequence, type PracticeEntry } from "./practice-sequence";

type CheckLesson = Pick<LibraryLesson, "id" | "question">;

export function conceptCheckEntries(lesson: CheckLesson, additional: PracticeEntry[], title = "Check your understanding"): PracticeEntry[] {
  const first = { title, item: { id: "concept-" + lesson.id, topic: lesson.id, title: "Check your understanding", subject: "", href: "/library/" + lesson.id, prompt: lesson.question.prompt, answer: lesson.question.answer, options: lesson.question.options.map(option => ({ text: option.text, explanation: option.reason })) } };
  const typed = typedCheckpointItems.filter(item => item.topic === lesson.id).map(item => ({ item }));
  return [first, ...additional, ...typed];
}

export function ConceptCheck({ lesson, title, additional = [], entries }: { lesson: CheckLesson; title?: string; additional?: PracticeEntry[]; entries?: PracticeEntry[] }) {
  return <div className="concept-check" id="concept-check-title">
    <PracticeSequence key={lesson.id} entries={entries ?? conceptCheckEntries(lesson, additional, title)} title="Knowledge Check" />
  </div>;
}

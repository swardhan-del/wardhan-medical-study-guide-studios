import { typedCheckpointItems } from "@/content/typed-checkpoints";
import type { LibraryLesson } from "@/lib/library-types";
import { PracticeSequence, type PracticeEntry } from "./practice-sequence";
export function ConceptCheck({ lesson, title = "Check your understanding", additional = [] }: { lesson: Pick<LibraryLesson, "id" | "question">; title?: string; additional?: PracticeEntry[] }) {
  const first = { title, item: { id: "concept-" + lesson.id, topic: lesson.id, title: "Check your understanding", subject: "", href: "/library/" + lesson.id, prompt: lesson.question.prompt, answer: lesson.question.answer, options: lesson.question.options.map((o) => ({ text: o.text, explanation: o.reason })) } };
  return <div className="concept-check" id="concept-check-title">{<PracticeSequence key={lesson.id} entries={[first, ...additional, ...typedCheckpointItems.filter(item => item.topic === lesson.id).map(item => ({ item }))]} title="Knowledge Check" />}</div>;
}

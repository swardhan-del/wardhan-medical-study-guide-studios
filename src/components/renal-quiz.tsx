import { typedCheckpointItems } from "@/content/typed-checkpoints";
import { renalLessonHref, renalLessons, type RenalQuestion } from "@/content/renal-course";
import { PracticeSequence } from "./practice-sequence";
export function RenalQuiz({ questions, title = "Test your understanding", quizId = "lesson" }: { questions: RenalQuestion[]; title?: string; quizId?: string }) {
  return <section className="study-panel renal-quiz" aria-label={title}><h2>{title}</h2><PracticeSequence key={quizId} title={title} completionId={quizId} variants={typedCheckpointItems.filter(q => q.id.endsWith("-reinforcement")).map(item => ({ item }))} entries={[...typedCheckpointItems.filter(q => q.id.endsWith("-initial") && questions.length > 0 && questions.every(item => item.lesson === q.topic)).map(item => ({ item })), ...questions.map(q => ({ item: { ...q, topic: q.lesson, title: renalLessons.find(l => l.slug === q.lesson)?.title ?? title, subject: "physiology", href: renalLessonHref(q.lesson) + "#lesson-quiz" } }))]}/></section>;
}

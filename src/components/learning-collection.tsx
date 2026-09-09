import { SaveButton } from "./catalog-browser";
import { publicCatalog } from "@/lib/catalog";
import Link from "next/link";
export function LearningCollection({ compact = false }: { compact?: boolean }) {
  const cards = [
    [
      "01 · Lessons",
      "Study renal physiology",
      "Work through the mechanisms of kidney function with focused lessons and explained questions.",
      "/learn/renal",
      "Start the course",
    ],
    [
      "02 · Questions",
      "Check your understanding",
      "Try five renal physiology questions, review the explanations, and identify a topic to revisit.",
      "/practice/renal-challenge",
      "Try the renal challenge",
    ],
    [
      "03 · Interactive models",
      "Explore physiological mechanisms",
      "Adjust model variables and examine how they affect renal circulation and acid–base balance.",
      "/practice/physiology",
      "Explore interactive models",
    ],
    [
      "04 · Tissue identification",
      "Practise tissue identification",
      "Use structural clues to distinguish renal tubule schematics and explain what you see.",
      "/practice/histology",
      "Start histology practice",
    ],
    [
      "05 · Oral practice",
      "Prepare a renal oral explanation",
      "Organise your answer with structured prompts, self-assessment criteria, and follow-up questions.",
      "/practice/oral",
      "Practise a renal oral answer",
    ],
    [
      "06 · Your next session",
      "Plan your next study session",
      "Return to saved resources, review your practice, and choose what to study next.",
      "/study",
      "Open My Study",
    ],
  ];
  return (
    <div className="study-grid learning-collection">
      {cards
        .slice(0, compact ? 3 : cards.length)
        .map(([tag, title, text, href, action]) => (
          <article className="study-card" key={href}>
            <p className="eyebrow">{tag}</p>
            <h2>{title}</h2>
            <p>{text}</p>
            <Link className="text-link" href={href}>
              {action} →
            </Link>
            {publicCatalog.find((r) => r.href === href) && (
              <SaveButton
                id={publicCatalog.find((r) => r.href === href)!.id}
                title={title}
              />
            )}
          </article>
        ))}
    </div>
  );
}

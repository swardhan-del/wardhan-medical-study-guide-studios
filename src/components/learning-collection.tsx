import Link from "next/link";
export function LearningCollection({ compact = false }: { compact?: boolean }) {
  const cards = [
    [
      "01 · Free mini-course",
      "Renal physiology, understood.",
      "Eight focused lessons, 30 questions with explanations, and a downloadable revision sheet.",
      "/learn/renal",
      "Start the course",
    ],
    [
      "02 · Five minutes",
      "Take the renal challenge.",
      "Five questions. Discover the misconception behind each wrong answer and find your next lesson.",
      "/practice/renal-challenge",
      "Try the challenge",
    ],
    [
      "03 · Learn by changing things",
      "The physiology lab.",
      "Explore a renal resistance circuit, adjust ventilation and work through six blood gases.",
      "/practice/physiology",
      "Open the lab",
    ],
    [
      "04 · Look closely",
      "Histology detective.",
      "Identify three renal tubule schematics and reveal the structural clues.",
      "/practice/histology",
      "Investigate a tubule",
    ],
    [
      "05 · Say it out loud",
      "Practice an oral answer.",
      "Eight structured prompts, self-assessment rubrics and follow-up questions.",
      "/practice/oral",
      "Practice explaining",
    ],
    [
      "06 · Come back tomorrow",
      "Your study dashboard.",
      "Save progress, revisit mistakes and make a plan for your exam.",
      "/study",
      "Open my study space",
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
          </article>
        ))}
    </div>
  );
}

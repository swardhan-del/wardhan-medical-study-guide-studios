import { SaveButton } from "@/components/catalog-browser";
import Link from "next/link";
import { renalChallengeIds, renalQuestions } from "@/content/renal-course";
import { RenalQuiz } from "@/components/renal-quiz";
import { ShareChallenge } from "@/components/lesson-actions";
export const metadata = {
  title: "Five-minute renal physiology challenge",
  description:
    "Five free questions on filtration, ADH and acid–base balance. Learn why each answer works, then share the challenge.",
  alternates: { canonical: "/practice/renal-challenge" },
  openGraph: {
    title: "Can you explain the kidney in five questions?",
    description: "Try the free five-minute renal challenge.",
    url: "/practice/renal-challenge",
    images: ["/learn/renal/opengraph-image"],
  },
};
export default function ChallengePage() {
  return (
    <div className="site-container study-page">
      <header className="study-hero">
        <Link className="text-link" href="/learn/renal">
          ← Explore the full course
        </Link>
        <p className="eyebrow">Five questions · about five minutes</p>
        <h1>
          How well do you
          <br />
          <em>know the kidney?</em>
        </h1>
        <p className="interior-lede">
          Think through the mechanism before choosing. Every answer has an
          explanation, and your mistakes become a personal review session.
        </p>
      <SaveButton id="renal-challenge" title="Renal challenge" />
      </header>
      <RenalQuiz
        quizId="renal-challenge"
        questions={renalChallengeIds.map((id) =>
          renalQuestions.find((q) => q.id === id)!,
        )}
        title="Your five-minute renal challenge"
      />
      <ShareChallenge />
      <p className="source-note">
        Original questions adapted from the renal study guide.{" "}
        <Link className="text-link" href="/learn/renal#sources">
          Authorship, sources and revision details →
        </Link>
      </p>
    </div>
  );
}

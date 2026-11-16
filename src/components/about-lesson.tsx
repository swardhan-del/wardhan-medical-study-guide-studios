import { qualityForLesson, qualityLessons } from "@/lib/lesson-quality";
import { RelatedLearning } from "./related-learning";
const reviewLabels = {
  draft: "Draft — editorial and medical review have not been completed.",
  "editorial-reviewed": "Editorial review recorded. Independent clinical review has not been completed.",
  "medical-review-pending": "Medical review pending. Independent clinical review has not been completed.",
  "independently-clinically-reviewed": "Independent clinical review recorded for this lesson. Educational content does not replace clinical advice.",
};
const visualLabels = {
  "not-required": "No additional teaching visual is required for this lesson's objectives.",
  planned: "Teaching visuals are planned and have not completed review.",
  "rights-review-pending": "Proposed visuals are awaiting rights review.",
  "approved-and-published": "Published teaching visuals have a recorded review and release decision.",
};
export function AboutLesson({ lessonId }: { lessonId: string }) {
  const lesson = qualityLessons.find(l => l.id === lessonId);
  if (!lesson) return null;
  const quality = qualityForLesson(lessonId);
  const links = quality?.links ?? lesson.links;
  return <div className="lesson-transparency-body">
      {quality?.learnerLevel && <p><strong>Who this is for:</strong> {quality.learnerLevel}</p>}
      {quality?.sources.length ? <ul>{quality.sources.map((source, index) => <li key={index}>
        {source.url ? <a href={source.url}>{source.title}</a> : source.title}. {source.publisherOrAuthor}. {source.citation} Accessed <time dateTime={source.accessedAt}>{source.accessedAt}</time>.
      </li>)}</ul> : null}
      <p><strong>Visual learning:</strong> {quality ? visualLabels[quality.visualStatus] : "Visual review details have not yet been recorded. Refer to each figure's caption and credit."}</p>
      <p><strong>Practice questions:</strong> {quality?.assessmentStatus === "reviewed" ? "Question review is recorded." : quality?.assessmentStatus === "explanations-complete" ? "Answer explanations are complete; question review is pending." : quality?.assessmentStatus === "questions-planned" ? "Questions and explanations are still being prepared." : "Formal review of these questions has not yet been recorded."}</p>
      <p><strong>Accessibility and readability:</strong> {quality?.accessibilityStatus === "checked" && quality?.readabilityStatus === "checked" ? "Checks are recorded for this version." : "A complete accessibility and readability check has not yet been recorded for this version."}</p>
      <p>{quality?.lastReviewedAt ? <>Last reviewed: <time dateTime={quality.lastReviewedAt}>{quality.lastReviewedAt}</time>.</> : "Review date not yet recorded."}</p>
      {quality?.limitations.length ? <ul>{quality.limitations.map(note => <li key={note}>{note}</li>)}</ul> : null}
      {!links.prerequisite.length && <p>{quality ? "No prerequisite lessons are specified." : "Prerequisite lessons have not yet been specified. Use the subject learning path to choose a starting point."}</p>}
      <RelatedLearning lessonId={lessonId} links={links} />
    </div>;
}

export function LessonReviewStatus({ lessonId, updatedAt }: { lessonId: string; updatedAt: string }) {
  const quality = qualityForLesson(lessonId);
  return <p className="muted-note">Last updated <time dateTime={updatedAt}>{updatedAt}</time>. {quality ? reviewLabels[quality.contentStatus] : "Not independently peer reviewed."}</p>;
}

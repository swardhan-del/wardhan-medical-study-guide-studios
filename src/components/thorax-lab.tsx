"use client";

import { SavedRecall, SavedSelfCheck } from "./saved-recall";
import { PracticeSequence } from "./practice-sequence";
import practice from "@/content/thorax-practice.json";
import { ThoraxMap } from "@/components/thorax-map";

function ThoraxQuestions() {
  return <section className="thorax-practice" aria-labelledby="thorax-practice-title">
    <h4 id="thorax-practice-title">Twelve questions. Explain every answer.</h4>
    <PracticeSequence title="Thorax relationships" entries={practice.questions.map(q => ({ item: { id: q.id, topic: "anatomy-thorax", title: "Thorax relationships", subject: "anatomy", href: "/subjects/anatomy/thorax#thorax-practice-title", prompt: q.prompt, answer: q.answer, options: q.options.map((text, i) => ({ text, explanation: q.explanations[i] })) } }))}/>
  </section>;
}

function ThoraxRecall() {
  return (
    <section className="thorax-recall" aria-labelledby="thorax-recall-title">
      <p className="eyebrow">Say it in your own words</p>
      <h4 id="thorax-recall-title">Four short-answer challenges</h4>
      <p>Write or say your answer before opening the model. Use the checklist to assess it yourself; your writing is not automatically graded or sent anywhere.</p>
      {practice.oral.map((prompt, index) => <details className="thorax-recall-card" key={prompt.id}>
        <summary>{index + 1}. {prompt.prompt}</summary>
        <SavedRecall id={`oral-${prompt.id}`} label="Write your answer" />
        <details className="thorax-model-answer">
          <summary>Compare with the model answer</summary>
          <p>{prompt.answer}</p>
          <fieldset>
            <legend>My self-check</legend>
            {prompt.checklist.map((item, i) => <SavedSelfCheck key={item} id={`check-${prompt.id}-${i}`} label={item} />)}
          </fieldset>
        </details>
      </details>)}
    </section>
  );
}

export function ThoraxLab() {
  return (
    <div className="thorax-lab">
      <nav className="thorax-jump-links" aria-label="Thorax learning activities">
        <a href="#thorax-map-title">Explore the image</a>
        <a href="#thorax-practice-title">Try 12 questions</a>
        <a href="#thorax-recall-title">Practice a short answer</a>
      </nav>
      <div className="thorax-explanations">
        {practice.sections.map((section) => <section key={section.title}><h4>{section.title}</h4><p>{section.text}</p></section>)}
      </div>
      <ThoraxMap />
      <ThoraxQuestions />
      <ThoraxRecall />
      <details className="thorax-references">
        <summary>Sources for this Thorax activity</summary>
        <p>Original summaries and questions developed from the Volume I anatomy study guide, with the references below used to check anatomical relationships. Source check: {practice.reviewedAt}. This is an educational practice activity.</p>
        <ul>{practice.sources.map((source) => <li key={source.id}><a href={source.url}>{source.title}</a>{"sections" in source ? <p>{source.sections}</p> : null}</li>)}</ul>
      </details>
    </div>
  );
}

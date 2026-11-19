import { SavedRecall } from "./saved-recall";

export function ObservationNotes({
  id,
  prompt,
  criteria,
}: {
  id: string;
  prompt: string;
  criteria: readonly string[];
}) {
  return (
    <div>
      <p>{prompt}</p>
      <SavedRecall
        id={id}
        label="My observations and reasoning"
        placeholder="Describe two visible clues, explain how they support your answer, and state one uncertainty."
      />
      <details className="study-details">
        <summary>Compare my reasoning</summary>
        <p>Read your explanation against these points, then revisit the image where your evidence is unclear.</p>
        <ul>{criteria.map(criterion => <li key={criterion}>{criterion}</li>)}</ul>
        <p>This writing is for self-review. The checkpoint below has its own answer and feedback.</p>
      </details>
    </div>
  );
}

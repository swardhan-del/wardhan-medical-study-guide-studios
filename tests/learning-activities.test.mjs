import test from "node:test";
import assert from "node:assert/strict";
import { checkActivityName, checkActivitySequence, validateActivities } from "../src/lib/learning-activity.ts";
// Data imports only an erased TypeScript type; no runtime alias resolution is needed.
import { learningActivities } from "../src/content/learning-activities.ts";

test("activity IDs, objective links and sequence sets are valid", () => {
  assert.deepEqual(validateActivities(learningActivities), []);
  assert(validateActivities([...learningActivities, learningActivities[0]]).length);
});

test("names never accept negation, a matching substring, or an unknown essay", () => {
  for (const activity of learningActivities.filter(item => item.kind === "name")) {
    for (const name of activity.accepted) {
      assert.equal(checkActivityName(` ${name.toUpperCase()}. `, activity).state, "matched");
      for (const answer of [`not ${name}`, `${name} is wrong`, `perhaps ${name} or something else`]) assert.equal(checkActivityName(answer, activity).state, "unassessed");
    }
    for (const contrast of activity.contrasts) for (const name of contrast.names) assert.equal(checkActivityName(name, activity).state, "contrast");
    assert.equal(checkActivityName("", activity).state, "empty");
    assert.equal(checkActivityName("<img src=x onerror=alert(1)>", activity).state, "unassessed");
  }
});

test("sequence checks reject partial, repeated, foreign and misplaced stages", () => {
  for (const activity of learningActivities.filter(item => item.kind === "sequence")) {
    const order = activity.stages.map(stage => stage.id);
    assert.equal(checkActivitySequence(order, activity).state, "matched");
    assert.equal(checkActivitySequence(order.slice(1), activity).state, "incomplete");
    assert.equal(checkActivitySequence([...order].reverse(), activity).state, "contrast");
    assert.equal(checkActivitySequence([order[0], order[0]], activity).state, "unassessed");
    assert.equal(checkActivitySequence(["foreign"], activity).state, "unassessed");
    const malformed = { ...activity, presentation: [order[0], order[0]] };
    assert(validateActivities([malformed]).length);
  }
});

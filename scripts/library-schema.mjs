import { createHash } from "node:crypto";

// Authoring-only references resolve before generating public lesson data.
// Pin the exact body so editing a prerequisite cannot silently alter another
// reviewed lesson. References must point directly to one literal body.
export function resolveLessonStepBodies(lessons) {
  const byId = new Map(lessons.map(lesson => [lesson.id, lesson]));
  if (byId.size !== lessons.length) throw new Error("Duplicate lesson ID in teaching references.");
  return lessons.map(lesson => ({
    ...lesson,
    steps: lesson.steps.map(step => {
      if (!("bodyRef" in step)) return { ...step };
      const ref = step.bodyRef;
      if ("body" in step || !ref || typeof ref.lessonId !== "string" ||
          typeof ref.stepTitle !== "string" || !/^[a-f0-9]{64}$/.test(ref.sha256 ?? ""))
        throw new Error(`Invalid teaching reference: ${lesson.id}`);
      const matches = byId.get(ref.lessonId)?.steps.filter(source => source.title === ref.stepTitle) ?? [];
      if (matches.length !== 1 || "bodyRef" in matches[0] || typeof matches[0].body !== "string")
        throw new Error(`Missing, ambiguous or chained teaching reference: ${lesson.id}`);
      const body = matches[0].body;
      if (createHash("sha256").update(body).digest("hex") !== ref.sha256)
        throw new Error(`Changed referenced teaching requires review: ${lesson.id}`);
      const resolved = { ...step, body };
      delete resolved.bodyRef;
      return resolved;
    }),
  }));
}

export function validateLibraryLessons(data, catalog, sources) {
  if (
    data.version !== 1 ||
    !Array.isArray(data.lessons) ||
    !data.lessons.length
  )
    throw new Error("Missing learning content.");
  const ids = new Set();
  const teachingOwners = new Map();
  const records = new Map(catalog.records.map((r) => [r.id, r]));
  const text = (value, min = 1) =>
    typeof value === "string" &&
    value.trim().length >= min &&
    value.length < 3000;
  for (const lesson of data.lessons) {
    if (!/^[a-z0-9-]{1,80}$/.test(lesson.id) || ids.has(lesson.id))
      throw new Error("Invalid or duplicate lesson ID.");
    ids.add(lesson.id);
    const record = records.get(lesson.id);
    if (
      !record ||
      record.subject !== lesson.subject ||
      record.title !== lesson.title ||
      record.format !== "WEB" ||
      record.href
    )
      throw new Error(`Lesson/catalog mismatch: ${lesson.id}`);
    if (!sources[lesson.source] || !text(lesson.section, 10))
      throw new Error(`Missing source: ${lesson.id}`);
    if (
      !text(lesson.summary, 30) ||
      !Array.isArray(lesson.steps) ||
      lesson.steps.length < 3 ||
      lesson.steps.some((s) => !text(s.title, 3) || !text(s.body, 100) ||
        (s.practice !== undefined && (!text(s.practice?.prompt, 15) || !text(s.practice?.feedback, 20))))
    )
      throw new Error(`Incomplete teaching content: ${lesson.id}`);
    if (lesson.oralExamination !== undefined &&
      (!Array.isArray(lesson.oralExamination) || lesson.oralExamination.length < 1 ||
        lesson.oralExamination.some(q => !text(q.prompt, 15) || !text(q.answer, 40))))
      throw new Error(`Incomplete oral examination prompts: ${lesson.id}`);
    if (lesson.summaryChecklist !== undefined &&
      (!Array.isArray(lesson.summaryChecklist) || lesson.summaryChecklist.length < 3 ||
        lesson.summaryChecklist.some(item => !text(item, 15)) ||
        new Set(lesson.summaryChecklist).size !== lesson.summaryChecklist.length))
      throw new Error(`Incomplete summary checklist: ${lesson.id}`);
    const q = lesson.question;
    if (lesson.objectives || lesson.prerequisites || lesson.workedExample) {
      if (!Array.isArray(lesson.objectives) || lesson.objectives.length < 3 || lesson.objectives.some(o => !text(o, 15)))
        throw new Error(`Incomplete objectives: ${lesson.id}`);
      if (!Array.isArray(lesson.prerequisites) || lesson.prerequisites.some(id => id === lesson.id || !records.has(id)))
        throw new Error(`Broken prerequisite: ${lesson.id}`);
      const example = lesson.workedExample;
      if (!example || !text(example.title, 5) || !text(example.prompt, 30) || !Array.isArray(example.solution) || example.solution.length < 3 || example.solution.some(s => !text(s, 20)))
        throw new Error(`Incomplete worked example: ${lesson.id}`);
    }
    if (
      !q ||
      !text(q.prompt, 15) ||
      !Array.isArray(q.options) ||
      q.options.length < 3 ||
      q.options.some((o) => !text(o.text, 1) || !text(o.reason, 15)) ||
      !Number.isInteger(q.answer) ||
      q.answer < 0 ||
      q.answer >= q.options.length
    )
      throw new Error(`Invalid question: ${lesson.id}`);
    if (new Set(q.options.map((o) => o.text)).size !== q.options.length)
      throw new Error(`Duplicate options: ${lesson.id}`);
    if (
      !lesson.recall ||
      !text(lesson.recall.prompt, 15) ||
      !text(lesson.recall.answer, 40)
    )
      throw new Error(`Incomplete recall: ${lesson.id}`);
    if (
      !Array.isArray(lesson.related) ||
      lesson.related.length < 2 ||
      lesson.related.some((id) => id === lesson.id || !records.has(id))
    )
      throw new Error(`Broken related resource: ${lesson.id}`);
    if (
      /\/Users\/|\/study guide\/|original_dropbox_path|destination_dropbox_path|HOLD_RESTRICTED|dropboxusercontent/.test(
        JSON.stringify(lesson),
      )
    )
      throw new Error(
        "Private source data must remain outside the web lesson.",
      );
    // Detect copied teaching under a new identity. Shared navigation references
    // and independently authored lessons about the same concept remain valid.
    const teaching = JSON.stringify(
      {
        summary: lesson.summary,
        steps: lesson.steps,
        workedExample: lesson.workedExample,
        question: lesson.question,
        recall: lesson.recall,
        oralExamination: lesson.oralExamination,
        summaryChecklist: lesson.summaryChecklist,
      },
      (_key, value) => typeof value === "string"
        ? value.normalize("NFC").replace(/\s+/g, " ").trim()
        : value,
    );
    const owner = teachingOwners.get(teaching);
    if (owner)
      throw new Error(`Duplicate teaching content: ${lesson.id} repeats ${owner}; reuse the existing lesson ID.`);
    teachingOwners.set(teaching, lesson.id);
  }
  for (const record of catalog.records)
    if (record.format === "WEB" && !record.href && !ids.has(record.id))
      throw new Error("Web record has no lesson.");
  return data;
}

export function validateLibraryLessons(data, catalog, sources) {
  if (
    data.version !== 1 ||
    !Array.isArray(data.lessons) ||
    !data.lessons.length
  )
    throw new Error("Missing learning content.");
  const ids = new Set();
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
      lesson.steps.some((s) => !text(s.title, 3) || !text(s.body, 100))
    )
      throw new Error(`Incomplete teaching content: ${lesson.id}`);
    const q = lesson.question;
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
  }
  for (const record of catalog.records)
    if (record.format === "WEB" && !record.href && !ids.has(record.id))
      throw new Error("Web record has no lesson.");
  return data;
}

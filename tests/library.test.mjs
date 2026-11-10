import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateLibraryLessons } from "../scripts/library-schema.mjs";
import { validateCatalog } from "../scripts/catalog-schema.mjs";
import { subjectInterests } from "../src/content/subjects.ts";
import { matchesCatalogQuery } from "../src/lib/catalog-filter.ts";
const read = (name) =>
  JSON.parse(
    readFileSync(
      new URL(`../src/content/${name}.json`, import.meta.url),
      "utf8",
    ),
  );
const data = read("library-lessons"),
  catalog = read("public-catalog"),
  sources = read("library-sources");
test("every subject has usable public resources and every original lesson has complete content", () => {
  assert.doesNotThrow(() => validateCatalog(catalog));
  assert.doesNotThrow(() => validateLibraryLessons(data, catalog, sources));
  for (const subject of [
    "anatomy",
    "histology",
    "cell-biology",
    "biochemistry",
    "physiology",
    "genetics",
  ])
    assert.ok(
      catalog.records.filter((r) => r.subject === subject).length >= 4,
      subject,
    );
  assert.ok(data.lessons.filter((l) => l.subject === "histology").length >= 16);
});
test("broken cross-links, absent teaching content and incorrect answer keys fail the release gate", () => {
  for (const change of [
    { related: ["missing", "also-missing"] },
    { steps: [] },
    { source: "unread-source" },
    { question: { ...data.lessons[0].question, answer: 99 } },
  ]) {
    const copy = structuredClone(data);
    Object.assign(copy.lessons[0], change);
    assert.throws(() => validateLibraryLessons(copy, catalog, sources));
  }
});
test("optional section practice requires both a usable prompt and explanatory feedback", () => {
  for (const practice of [null, {}, { prompt: "Explain this structural distinction.", feedback: "" }, { prompt: "", feedback: "This explanation cannot substitute for a missing learner prompt." }]) {
    const copy = structuredClone(data);
    copy.lessons[0].steps[0].practice = practice;
    assert.throws(() => validateLibraryLessons(copy, catalog, sources), /Incomplete teaching content/);
  }
});
test("copied teaching cannot acquire a second lesson identity through renaming or whitespace changes", () => {
  const copy = structuredClone(data);
  const duplicate = structuredClone(copy.lessons[0]);
  duplicate.id = "duplicate-teaching-fixture";
  duplicate.title = "Renamed teaching fixture";
  duplicate.steps[0].body = `  ${duplicate.steps[0].body.replaceAll(" ", "  ")}\n`;
  copy.lessons.push(duplicate);
  const records = [...catalog.records, {
    ...catalog.records.find(r => r.id === data.lessons[0].id),
    id: duplicate.id,
    title: duplicate.title,
  }];
  assert.throws(() => validateLibraryLessons(copy, { ...catalog, records }, sources), /Duplicate teaching content/);
});
test("shared sources and related-reading relationships do not count as duplicate lessons", () => {
  const copy = structuredClone(data);
  copy.lessons[1].source = copy.lessons[0].source;
  copy.lessons[1].section = copy.lessons[0].section;
  copy.lessons[1].related = [...copy.lessons[0].related].filter(id => id !== copy.lessons[1].id);
  if (copy.lessons[1].related.length < 2) copy.lessons[1].related.push(copy.lessons[0].id);
  assert.doesNotThrow(() => validateLibraryLessons(copy, catalog, sources));
});
test("search matches multiple words across source topic tags and title, including punctuation variants", () => {
  const r = catalog.records.find((r) => r.id === "renal-abg-interpretation");
  assert.ok(matchesCatalogQuery(r, "renal acid-base"));
  assert.ok(
    matchesCatalogQuery(
      catalog.records.find((r) => r.id === "epithelia"),
      "tissues epithelial",
    ),
  );
  assert.equal(matchesCatalogQuery(r, "renal unrelatedterm"), false);
});
test("internal resource links cannot become external redirects or private-file paths", () => {
  const good = catalog.records.find((r) => r.href);
  for (const href of [
    "//example.com",
    "/review/private",
    "/downloads/../../secret",
    "javascript:alert(1)",
    "/learn/renal?token=secret",
  ])
    assert.throws(() =>
      validateCatalog({ version: 1, records: [{ ...good, href }] }),
    );
});

test("every subject topic chip leads to at least one relevant record", () => {
  for (const subject of subjectInterests.filter(
    (subject) => subject.id !== "anatomy",
  )) {
    for (const topic of subject.topics)
      assert.ok(
        catalog.records.some(
          (record) =>
            record.subject === subject.id &&
            matchesCatalogQuery(record, topic, subject.title),
        ),
        `${subject.id}: ${topic}`,
      );
  }
});

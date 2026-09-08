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

import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const read = (name) => JSON.parse(readFileSync(new URL(`../src/content/${name}.json`, import.meta.url), "utf8"));
const guides = read("histology-guides");
const areas = read("histology-areas").areas;
const catalog = read("public-catalog").records;
const curatedRoot = "/study guide/08_WEB_LIBRARY_CURATION/02_CANDIDATES_FOR_REVIEW/CONCEPT_LIBRARY_2026-09-06/02_Microscopic_Anatomy_Histology/";

test("histology resources retain exact curated file destinations and released lesson links", () => {
  const seen = new Set();
  for (const guide of guides.records) {
    assert.ok(guide.topics.length && guide.summary && guide.edition);
    assert.ok(guide.courses.every((id) => guides.courses.some((course) => course.id === id)));
    for (const file of guide.files) {
      const url = new URL(file.url);
      assert.equal(url.origin, "https://www.dropbox.com");
      assert.ok(decodeURIComponent(url.pathname).startsWith("/preview" + curatedRoot));
      assert.equal(decodeURIComponent(url.pathname).split("/").at(-1), file.filename);
      assert.equal(file.filename.split(".").at(-1).toUpperCase(), file.format);
      assert.equal(url.searchParams.get("role"), "personal");
      assert.ok(!seen.has(file.url)); seen.add(file.url);
    }
    for (const id of guide.lessons) assert.ok(catalog.some((lesson) => lesson.id === id && lesson.format === "WEB" && lesson.status === "public"), id);
  }
  assert.ok(guides.records.some((guide) => guide.purpose === "practice"));
});

test("described histology areas link to the real directory and existing lessons", () => {
  const directory = read("subject-directory").entries;
  for (const area of areas) {
    assert.ok(area.description && area.sources.length);
    for (const source of area.sources) {
      const url = new URL(source.url);
      assert.equal(url.origin, "https://www.dropbox.com");
      assert.ok(decodeURIComponent(url.pathname).startsWith("/home" + curatedRoot));
      assert.ok(directory.some((entry) => entry.url === source.url), source.label);
    }
    for (const id of area.lessons) assert.ok(catalog.some((lesson) => lesson.id === id && lesson.status === "public"), id);
  }
});

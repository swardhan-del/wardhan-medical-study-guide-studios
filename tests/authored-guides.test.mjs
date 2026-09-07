import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const data = JSON.parse(readFileSync(new URL("../src/content/authored-guides.json", import.meta.url), "utf8"));
const catalog = JSON.parse(readFileSync(new URL("../src/content/public-catalog.json", import.meta.url), "utf8"));

test("authored guides retain exact file types, account access and working lesson references", () => {
  const ids = new Set();
  const urls = new Set();
  for (const guide of data.records) {
    assert.ok(!ids.has(guide.id));
    ids.add(guide.id);
    assert.ok(["read", "practice"].includes(guide.purpose));
    assert.ok(guide.summary && guide.edition && guide.topics.length);
    for (const file of guide.files) {
      const url = new URL(file.url);
      assert.equal(url.origin, "https://www.dropbox.com");
      assert.ok(decodeURIComponent(url.pathname).startsWith("/preview/study guide/06_Genetics_Immunology/"));
      assert.equal(decodeURIComponent(url.pathname).split("/").at(-1), file.filename);
      assert.equal(file.filename.split(".").at(-1).toUpperCase(), file.format);
      assert.equal(url.searchParams.get("role"), "personal");
      assert.equal(url.searchParams.get("context"), "standalone_preview");
      assert.ok(!urls.has(file.url));
      urls.add(file.url);
    }
    for (const id of guide.lessons) {
      assert.ok(catalog.records.some((lesson) => lesson.id === id && lesson.status === "public" && lesson.format === "WEB"), `Missing public lesson: ${id}`);
    }
  }
  const practice = data.records.find((guide) => guide.id === "complement-serology-recall");
  assert.equal(practice.files.length, 2);
  assert.match(practice.files[0].filename, /Active_Recall/);
  assert.match(practice.files[1].filename, /Answer_Key/);
});

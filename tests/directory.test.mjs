import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validateDirectory } from "../scripts/directory-schema.mjs";
const source = JSON.parse(
  fs.readFileSync(
    new URL("../src/content/subject-directory.json", import.meta.url),
  ),
);
test("directory covers requested courses and each real source destination is unique", () => {
  const data = validateDirectory(source);
  for (const id of [
    "anatomy",
    "histology-i",
    "histology-ii",
    "cell-biology",
    "biochemistry",
    "physiology",
    "genetics",
    "immunology",
    "microbiology",
    "biostatistics",
  ]) {
    assert(data.subjects.some((s) => s.id === id));
    assert(data.entries.some((e) => e.subjects.includes(id)));
  }
  assert(
    data.entries.some(
      (e) =>
        e.title.includes("Antigen Presentation") &&
        e.subjects.includes("immunology") &&
        !e.subjects.includes("genetics"),
    ),
  );
  assert(
    data.entries.some(
      (e) =>
        e.title.includes("Inheritance and Pedigrees") &&
        e.subjects.includes("genetics") &&
        !e.subjects.includes("immunology"),
    ),
  );
});
test("directory rejects external, administrative and executable destinations", () => {
  for (const url of [
    "javascript:alert(1)",
    "https://evil.example/home/study%20guide/file",
    "https://www.dropbox.com/home/study%20guide/00_Admin/private",
  ]) {
    const data = structuredClone(source);
    data.entries[0].url = url;
    assert.throws(() => validateDirectory(data));
  }
});
test("directory rejects missing and cyclic parents", () => {
  const missing = structuredClone(source);
  missing.entries[0].parentId = "not-present";
  assert.throws(() => validateDirectory(missing), /parent/);
  const cycle = structuredClone(source);
  cycle.entries[0].parentId = cycle.entries[0].id;
  assert.throws(() => validateDirectory(cycle), /cycle/);
});

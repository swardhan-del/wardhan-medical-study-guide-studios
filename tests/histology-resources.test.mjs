import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read = (n) =>
  JSON.parse(
    fs.readFileSync(
      new URL("../src/content/" + n + ".json", import.meta.url),
      "utf8",
    ),
  );
test("histology areas retain teaching descriptions and only released lesson references", () => {
  const catalog = read("public-catalog");
  for (const a of read("histology-areas").areas) {
    assert(a.title && a.description);
    assert.deepEqual(a.sources, []);
    for (const id of a.lessons)
      assert(catalog.records.some((r) => r.id === id && r.status === "public"));
  }
});

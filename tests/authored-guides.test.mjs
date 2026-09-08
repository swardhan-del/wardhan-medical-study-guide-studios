import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
test("private-only authored guides are excluded from the public source tree", () => {
  for (const name of ["authored-guides", "histology-guides"]) {
    const d = JSON.parse(
      fs.readFileSync(
        new URL("../src/content/" + name + ".json", import.meta.url),
        "utf8",
      ),
    );
    assert.deepEqual(d.records, []);
  }
});

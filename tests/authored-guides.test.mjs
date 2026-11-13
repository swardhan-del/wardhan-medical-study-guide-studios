import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
test("private-only authored guides are excluded from the public source tree", () => {
  for (const name of ["authored-guides", "histology-guides"]) {
    const manifest = new URL(`../src/content/${name}.json`, import.meta.url);
    assert.equal(fs.existsSync(manifest), false, `${name} must stay outside the public source tree`);
  }
});

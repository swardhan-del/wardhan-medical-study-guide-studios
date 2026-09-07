import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validateTaxonomy } from "../scripts/taxonomy-schema.mjs";
const read = (p) =>
  JSON.parse(
    fs.readFileSync(
      new URL("../src/content/" + p + ".json", import.meta.url),
      "utf8",
    ),
  );
const taxonomy = read("library-taxonomy"),
  catalog = read("public-catalog");
test("native taxonomy covers every released resource and retains course distinctions", () => {
  validateTaxonomy(taxonomy, catalog);
  for (const id of [
    "histology-i",
    "histology-ii",
    "genetics",
    "immunology",
    "microbiology",
    "biostatistics",
  ])
    assert(taxonomy.subjects.some((s) => s.id === id));
});
test("cycles, missing parents, duplicate IDs, private metadata and unapproved resources fail closed", () => {
  for (const mutate of [
    (d) => (d.nodes[0].parentId = d.nodes[0].id),
    (d) => (d.nodes[0].parentId = "absent"),
    (d) => d.nodes.push(d.nodes[0]),
    (d) => (d.nodes[0].original_dropbox_path = "/private"),
    (d) => d.nodes[0].resources.push("unapproved"),
  ]) {
    const d = structuredClone(taxonomy);
    mutate(d);
    assert.throws(() => validateTaxonomy(d, catalog));
  }
});

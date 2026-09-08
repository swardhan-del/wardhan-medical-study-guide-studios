import { readFileSync } from "node:fs";
import { validateTaxonomy } from "./taxonomy-schema.mjs";
const read = (p) =>
  JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
validateTaxonomy(
  read("../src/content/library-taxonomy.json"),
  read("../src/content/public-catalog.json"),
);
console.log("Native taxonomy checks passed.");

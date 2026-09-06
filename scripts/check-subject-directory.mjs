import fs from "node:fs";
import assert from "node:assert/strict";
import { validateDirectory } from "./directory-schema.mjs";
const data = validateDirectory(
  JSON.parse(
    fs.readFileSync(
      new URL("../src/content/subject-directory.json", import.meta.url),
    ),
  ),
);
const routes = JSON.parse(
  fs.readFileSync(
    new URL("../src/content/directory-routes.json", import.meta.url),
  ),
);
assert.deepEqual(
  routes,
  data.subjects.map((s) => s.id),
  "Directory route guard is stale; regenerate the directory.",
);
console.log(
  `Directory checks passed: ${data.subjects.length} subject views and ${data.entries.length} verified-path links.`,
);

import { readFileSync } from "node:fs";
import { validateLibraryLessons } from "./library-schema.mjs";
const read = (name) =>
  JSON.parse(
    readFileSync(
      new URL(`../src/content/${name}.json`, import.meta.url),
      "utf8",
    ),
  );
const data = validateLibraryLessons(
  read("library-lessons"),
  read("public-catalog"),
  read("library-sources"),
);
console.log(
  `Learning checks passed: ${data.lessons.length} sourced lessons, explained questions, recall prompts and valid related links.`,
);

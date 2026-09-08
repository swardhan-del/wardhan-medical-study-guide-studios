import { validateVideos } from "./video-schema.mjs";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import assert from "node:assert/strict";
const read = (p) => JSON.parse(readFileSync(p, "utf8"));
const release = read("src/content/public-release.json"),
  catalog = read("src/content/public-catalog.json");
assert.deepEqual(
  [...release.resourceIds].sort(),
  catalog.records.map((r) => r.id).sort(),
  "Catalog differs from explicit release allowlist",
);
const actual = readdirSync("public", { recursive: true })
  .map((p) => String(p).replaceAll("\\", "/"))
  .filter((p) => statSync(join("public", p)).isFile());
assert.deepEqual(
  actual.sort(),
  release.assets.map((a) => a.path).sort(),
  "Unapproved or missing public asset",
);
for (const a of release.assets) {
  assert(/^[a-z0-9/.-]+$/.test(a.path) && !a.path.includes(".."));
  const bytes = readFileSync(join("public", a.path));
  assert.equal(bytes.length, a.bytes);
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    a.sha256,
    "Released asset changed: " + a.path,
  );
}
const privatePattern =
  /https?:\/\/[^\s"'<>]*dropbox|original_dropbox_path|destination_dropbox_path|(?:C:|D:)\\|\/study(?:%20| )guide\//i;
for (const p of readdirSync("src", { recursive: true })) {
  if (/\.(json|tsx?|css)$/.test(p))
    assert(
      !privatePattern.test(readFileSync(join("src", p), "utf8")),
      "Private source information in " + p,
    );
}
console.log(
  "Release allowlist verified: " +
    release.resourceIds.length +
    " resources; " +
    release.assets.length +
    " exact assets; no private paths or archive URLs.",
);

validateVideos(
  read("src/content/public-videos.json"),
  catalog,
  read("src/content/library-taxonomy.json"),
);

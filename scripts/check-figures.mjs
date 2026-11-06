import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
import { validateFigureMetadata } from "./figure-metadata-policy.mjs";
const require = createRequire(
  process.env.FIGURE_TOOLS_ROOT
    ? resolve(process.env.FIGURE_TOOLS_ROOT, "package.json")
    : import.meta.url,
);
const sharp = require("sharp");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const { figures } = read("src/content/public-figures.json"),
  taxonomy = read("src/content/library-taxonomy.json"),
  catalog = read("src/content/public-catalog.json"),
  release = read("src/content/public-release.json");
assert.equal(new Set(figures.map((f) => f.id)).size, figures.length);
for (const f of figures) {
  assert(
    f.alt.length > 30 &&
      f.caption.length > 30 &&
      f.publicApproval &&
      f.rights &&
      fs.existsSync(f.evidence),
  );
  assert(
    f.sourceUrl.startsWith("https://") && !f.sourceUrl.includes("dropbox"),
  );
  for (const id of f.topicIds)
    assert(
      taxonomy.nodes.some((n) => n.id === id),
      "Unknown figure topic " + id,
    );
  for (const id of f.subjectIds)
    assert(
      taxonomy.subjects.some((s) => s.id === id),
      "Unknown figure subject " + id,
    );
  for (const id of f.resourceIds)
    assert(
      catalog.records.some((r) => r.id === id),
      "Unknown figure resource " + id,
    );
  for (const v of f.variants) {
    assert(/^\/images\/figures\/[a-z0-9-]+\.(webp|png|jpg)$/.test(v.src));
    assert(
      release.assets.some((a) => "/" + a.path === v.src),
      "Derivative missing release evidence",
    );
    const m = await sharp("public" + v.src).metadata();
    const expectedFormat = v.src.endsWith(".png") ? "png" : v.src.endsWith(".jpg") ? "jpeg" : "webp";
    assert.equal(m.format, expectedFormat, "Asset extension and decoded format differ");
    assert.equal(fs.statSync("public" + v.src).size, v.bytes, "Figure byte count differs");
    const display = validateFigureMetadata(f.id, m);
    assert.equal(display.width, v.width);
    assert.equal(display.height, v.height);
    assert(
      Math.abs(v.height / v.width - f.height / f.width) < 0.004,
      "Aspect ratio changed",
    );
    assert(v.width <= f.width, "Upscaled source");
  }
  assert.equal(f.src, f.variants.at(-1).src);
  if (f.licenseUrl) assert([
    "https://creativecommons.org/licenses/by/4.0/",
    "https://creativecommons.org/licenses/by-sa/4.0/",
    "https://creativecommons.org/licenses/by-sa/3.0/",
    "https://creativecommons.org/publicdomain/zero/1.0/",
  ].includes(f.licenseUrl), "Unreviewed licence URL");
  if (f.panelDescriptions) assert(f.panelDescriptions.length > 0 && f.panelDescriptions.every(p => p.label && p.text.length > 30));
}
console.log(
  `Figure checks passed: ${figures.length} approved figures, responsive variants, mapped topics, preserved proportions and reviewed metadata.`,
);

import assert from "node:assert/strict";
import fs from "node:fs";
import { createRequire } from "node:module";
import { resolve } from "node:path";
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
    assert(/^\/images\/figures\/[a-z0-9-]+\.webp$/.test(v.src));
    assert(
      release.assets.some((a) => "/" + a.path === v.src),
      "Derivative missing release evidence",
    );
    const m = await sharp("public" + v.src).metadata();
    assert(
      !m.exif && !m.xmp && !m.iptc && !m.icc,
      "Unexpected metadata in " + v.src,
    );
    assert.equal(m.width, v.width);
    assert.equal(m.height, v.height);
    assert(
      Math.abs(v.height / v.width - f.height / f.width) < 0.004,
      "Aspect ratio changed",
    );
    assert(v.width <= f.width, "Upscaled source");
  }
  assert.equal(f.src, f.variants.at(-1).src);
}
console.log(
  `Figure checks passed: ${figures.length} approved figures, responsive variants, mapped topics, preserved proportions and stripped metadata.`,
);

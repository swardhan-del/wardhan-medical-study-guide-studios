// Explicit preparation command, never part of a build. Inputs must already be released.
import fs from "node:fs";
import { createHash } from "node:crypto";
import { createRequire } from "node:module";
import { resolve } from "node:path";
const require = createRequire(
  process.env.FIGURE_TOOLS_ROOT
    ? resolve(process.env.FIGURE_TOOLS_ROOT, "package.json")
    : import.meta.url,
);
const sharp = require("sharp");
import assert from "node:assert/strict";
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const selections = read("src/content/figure-selections.json"),
  release = read("src/content/public-release.json");
const digest = (b) => createHash("sha256").update(b).digest("hex");
fs.mkdirSync("public/images/figures", { recursive: true });
const records = [];
for (const item of selections.figures) {
  const original = fs.readFileSync("public/" + item.sourceAsset),
    approved = release.assets.find((a) => a.path === item.sourceAsset);
  assert(
    approved && approved.sha256 === digest(original),
    "Only an exact released source can be prepared",
  );
  const meta = await sharp(original).metadata(),
    variants = [];
  const widths = [
    ...new Set([320, 640, 1280, meta.width].filter((w) => w <= meta.width)),
  ].sort((a, b) => a - b);
  for (const width of widths) {
    const path = `images/figures/${item.id}-${width}.webp`;
    const bytes = await sharp(original)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .webp(
        item.kind === "diagram"
          ? { lossless: true }
          : { quality: 92, effort: 6 },
      )
      .toBuffer();
    fs.writeFileSync("public/" + path, bytes);
    const info = await sharp(bytes).metadata();
    assert(!info.exif && !info.xmp && !info.iptc, "Metadata must be stripped");
    const asset = {
      path,
      sha256: digest(bytes),
      bytes: bytes.length,
      evidence: "docs/FIGURE_PLACEMENTS.md",
    };
    const i = release.assets.findIndex((a) => a.path === path);
    if (i < 0) release.assets.push(asset);
    else release.assets[i] = asset;
    variants.push({
      src: "/" + path,
      width: info.width,
      height: info.height,
      bytes: bytes.length,
    });
  }
  records.push({
    ...item,
    width: meta.width,
    height: meta.height,
    src: variants.at(-1).src,
    variants,
    publicApproval:
      "Retained public release plus requested website placement and derivative preparation, 2026-09-07",
    modifications:
      "Full frame, proportional resizing and metadata removal only; no generative edits, cropping, relabeling or scientific changes.",
  });
}
fs.writeFileSync(
  "src/content/public-figures.json",
  JSON.stringify({ version: 1, figures: records }, null, 2) + "\n",
);
fs.writeFileSync(
  "src/content/public-release.json",
  JSON.stringify(release, null, 2) + "\n",
);
console.log(
  JSON.stringify(
    records.map((f) => ({
      id: f.id,
      variants: f.variants.length,
      bytes: f.variants.reduce((n, v) => n + v.bytes, 0),
    })),
  ),
);

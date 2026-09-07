import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { validateVideos } from "../scripts/video-schema.mjs";
const read = (n) =>
  JSON.parse(
    fs.readFileSync(
      new URL("../src/content/" + n + ".json", import.meta.url),
      "utf8",
    ),
  );
const catalog = read("public-catalog"),
  taxonomy = read("library-taxonomy");
const good = {
  id: "sample",
  title: "Test resource",
  summary: "Synthetic test metadata",
  subject: "physiology",
  topicIds: ["physiology-renal"],
  lessonIds: ["renal-kidney-map"],
  durationSeconds: 5,
  status: "public",
  publicApproval: "Explicit fixture approval for automated tests only",
  medicalReview: "reviewed",
  aiGenerated: true,
  sourceUrl: "/media/test.webm",
  posterUrl: "/images/test.png",
  mimeType: "video/webm",
  captions: [{ src: "/media/test.vtt", language: "en", label: "English" }],
  transcript: [{ startSeconds: 0, text: "Test caption" }],
};
test("video library is fail closed until reviewed public deliveries are available", () =>
  assert.doesNotThrow(() =>
    validateVideos(read("public-videos"), catalog, taxonomy),
  ));
test("video validation rejects missing review, unsafe delivery, broken lessons and inaccurate timing", () => {
  for (const change of [
    { medicalReview: "pending" },
    { publicApproval: "" },
    { sourceUrl: "https://www.dropbox.com/preview/private" },
    { sourceUrl: "//evil.example/v.mp4" },
    { sourceUrl: "/media/../../private" },
    { posterUrl: "javascript:alert(1)" },
    { lessonIds: ["private-lesson"] },
    { topicIds: ["private-topic"] },
    { durationSeconds: 0 },
    { transcript: [{ startSeconds: 6, text: "Late" }] },
    { captions: [] },
  ])
    assert.throws(() =>
      validateVideos(
        { version: 1, records: [{ ...good, ...change }] },
        catalog,
        taxonomy,
      ),
    );
  assert.doesNotThrow(() =>
    validateVideos({ version: 1, records: [good] }, catalog, taxonomy),
  );
});

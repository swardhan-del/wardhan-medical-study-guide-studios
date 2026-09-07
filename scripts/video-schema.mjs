import assert from "node:assert/strict";
export function validateVideos(data, catalog, taxonomy) {
  assert.equal(data.version, 1);
  assert(Array.isArray(data.records));
  const seen = new Set();
  const safeUrl = (u) => {
    assert(typeof u === "string");
    if (
      /^\/(?:media|downloads|images)\/[a-z0-9/.-]+$/.test(u) &&
      !u.includes("..")
    )
      return;
    const parsed = new URL(u);
    assert(
      parsed.protocol === "https:" &&
        !parsed.username &&
        !parsed.password &&
        !parsed.search &&
        !parsed.hash &&
        !/dropbox|localhost/i.test(parsed.hostname),
      "Unsafe delivery URL",
    );
  };
  for (const v of data.records) {
    assert(/^[a-z0-9-]+$/.test(v.id) && !seen.has(v.id));
    seen.add(v.id);
    assert.equal(v.status, "public");
    assert.equal(v.medicalReview, "reviewed");
    assert(
      typeof v.publicApproval === "string" &&
        v.publicApproval.trim().length > 10,
      "Public approval required",
    );
    assert(v.title && v.summary && typeof v.aiGenerated === "boolean");
    assert(v.durationSeconds > 0 && Number.isFinite(v.durationSeconds));
    assert(["video/mp4", "video/webm"].includes(v.mimeType));
    assert(taxonomy.subjects.some((s) => s.id === v.subject));
    assert(
      v.topicIds.length &&
        v.topicIds.every((id) => taxonomy.nodes.some((n) => n.id === id)),
    );
    assert(
      v.lessonIds.length &&
        v.lessonIds.every((id) =>
          catalog.records.some((r) => r.id === id && r.status === "public"),
        ),
    );
    safeUrl(v.sourceUrl);
    safeUrl(v.posterUrl);
    assert(Array.isArray(v.captions) && Array.isArray(v.transcript));
    v.captions.forEach((c) => {
      safeUrl(c.src);
      assert(c.language && c.label);
    });
    let last = -1;
    v.transcript.forEach((line) => {
      assert(
        line.startSeconds >= 0 &&
          line.startSeconds >= last &&
          line.startSeconds < v.durationSeconds &&
          line.text,
      );
      last = line.startSeconds;
    });
    assert(
      v.captions.length && v.transcript.length,
      "Reviewed captions and transcript required for new video release",
    );
    assert(
      !/original_dropbox_path|destination_dropbox_path|study%20guide|HOLD_RESTRICTED|[A-Z]:\\/.test(
        JSON.stringify(v),
      ),
    );
  }
  return data;
}

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
    assert.equal(v.medicalReview, v.explainer ? "editorial-reviewed" : "reviewed");
    assert(
      typeof v.publicApproval === "string" &&
        v.publicApproval.trim().length > 10,
      "Public approval required",
    );
    assert(v.title && v.summary && typeof v.aiGenerated === "boolean");
    assert(v.durationSeconds > 0 && Number.isFinite(v.durationSeconds));
    assert(
      [v.width, v.height].every(
        (n) => Number.isInteger(n) && n > 0 && n <= 16384,
      ),
      "Measured display dimensions required",
    );
    assert(
      ["speech", "non-speech", "silent"].includes(v.audioContent),
      "Inspected audio content required",
    );
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
    if (v.explainer !== undefined) {
      assert(v.explainer && !v.researchContext, "An explainer needs its own source record");
      assert(Array.isArray(v.explainer.sources) && v.explainer.sources.length > 0, "Explainers require sources");
      const links = [...v.explainer.sources, ...(v.explainer.furtherViewing ? [v.explainer.furtherViewing] : [])];
      for (const link of links) {
        assert(typeof link.title === "string" && link.title.trim() && link.url.startsWith("https://"));
        safeUrl(link.url);
      }
    }
    if (v.researchContext !== undefined) {
      const c = v.researchContext;
      assert(c && ["creator", "title", "credit", "condition", "key", "limits"].every(k => typeof c[k] === "string" && c[k].trim().length > 10), "Research media require attribution and experimental context");
      safeUrl(c.url);
      assert(c.url.startsWith("https://"), "Research source must be an external citation");
      assert.equal(c.license, "CC BY 4.0", "Research media licence requires review");
      assert.equal(c.licenseUrl, "https://creativecommons.org/licenses/by/4.0/");
    }
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
      v.transcript.length && (v.audioContent === "silent" || v.captions.length),
      "Reviewed transcript or visual description required; audio also requires captions",
    );
    assert(
      !/original_dropbox_path|destination_dropbox_path|study%20guide|HOLD_RESTRICTED|[A-Z]:\\/.test(
        JSON.stringify(v),
      ),
    );
  }
  return data;
}

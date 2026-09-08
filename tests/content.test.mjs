import test from "node:test";
import assert from "node:assert/strict";
import { validateCatalog } from "../scripts/catalog-schema.mjs";
const record = {
  id: "example-guide",
  title: "Example guide",
  summary: "A test fixture.",
  subject: "physiology",
  kind: "study guide",
  format: "PDF",
  updatedAt: "2026-09-06",
  bytes: 2048,
  status: "public",
};
const catalog = (change) => ({
  version: 1,
  records: [{ ...record, ...change }],
});
test("accepts an empty public library and explicit released metadata", () => {
  assert.doesNotThrow(() => validateCatalog({ version: 1, records: [] }));
  assert.doesNotThrow(() => validateCatalog(catalog()));
});
test("rejects private records and private provenance in public input", () => {
  assert.throws(() => validateCatalog(catalog({ status: "private-review" })));
  assert.throws(() =>
    validateCatalog(catalog({ original_dropbox_path: "/study guide/private" })),
  );
  assert.throws(() =>
    validateCatalog(catalog({ summary: "/Users/example/private.pdf" })),
  );
});
test("rejects invalid IDs and duplicate resources", () => {
  assert.throws(() => validateCatalog(catalog({ id: "../../secret" })));
  assert.throws(() =>
    validateCatalog({ version: 1, records: [record, record] }),
  );
});
test("accepts only permanent public HTTPS download URLs", () => {
  assert.doesNotThrow(() =>
    validateCatalog(
      catalog({ downloadUrl: "https://files.example.com/released/guide.pdf" }),
    ),
  );
  for (const downloadUrl of [
    "javascript:alert(1)",
    "http://files.example.com/file.pdf",
    "https://dropbox.com/a.pdf",
    "https://www.dropbox.com/a.pdf",
    "https://files.example.com/a.pdf?token=secret",
    "https://user:pass@example.com/a.pdf",
    "https://127.0.0.1/a.pdf",
  ])
    assert.throws(() => validateCatalog(catalog({ downloadUrl })));
});
test("private local review accepts metadata but never download links", () => {
  assert.doesNotThrow(() =>
    validateCatalog(catalog({ status: "private-review" }), "private-review"),
  );
  assert.throws(() =>
    validateCatalog(
      catalog({
        status: "private-review",
        downloadUrl: "https://example.com/a.pdf",
      }),
      "private-review",
    ),
  );
});
test("rejects unknown subjects, file formats, sizes and dates", () => {
  for (const change of [
    { subject: "restricted" },
    { format: "EXE" },
    { bytes: -1 },
    { updatedAt: "yesterday" },
  ])
    assert.throws(() => validateCatalog(catalog(change)));
});

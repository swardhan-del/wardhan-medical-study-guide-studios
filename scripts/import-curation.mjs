import { readFile, mkdir, writeFile } from "node:fs/promises";
import { resolve, join } from "node:path";
import { validateCatalog } from "./catalog-schema.mjs";
const root = process.argv[2];
if (!root)
  throw new Error(
    "Usage: npm run content:import -- /absolute/path/to/08_WEB_LIBRARY_CURATION",
  );
const manifest = JSON.parse(
  await readFile(
    join(
      resolve(root),
      "03_APPROVED_PRIVATE_SITE/APPROVED_PRIVATE_SITE_MANIFEST.json",
    ),
    "utf8",
  ),
);
const subjects = {
  "01": "anatomy",
  "02": "histology",
  "03": "cell-biology",
  "04": "biochemistry",
  "05": "physiology",
  "06": "genetics",
};
const records = manifest.records
  .filter((record) => record.curation_status === "APPROVED_PRIVATE_SITE")
  .map((record) => {
    if (
      record.rights_privacy_status !== "CLEAR_PRIVATE" ||
      record.copy_status !== "COPIED_VERIFIED" ||
      !record.source_sha256 ||
      record.source_sha256 !== record.destination_sha256
    )
      throw new Error(`Unverified curated record: ${record.record_id}`);
    return {
      id: record.record_id,
      title: record.title,
      subject: subjects[record.subject_code],
      kind: record.content_type,
      format: record.format.toUpperCase(),
      summary: `A ${record.content_type} in ${record.subject}.`,
      updatedAt: record.modified_date.slice(0, 10),
      bytes: record.file_size_bytes,
      status: "private-review",
    };
  });
validateCatalog({ version: 1, records }, "private-review");
await mkdir(".private", { recursive: true });
await writeFile(
  ".private/catalog.json",
  JSON.stringify({ version: 1, records }, null, 2) + "\n",
);
console.log(
  `Imported ${records.length} sanitized metadata records into ignored .private/catalog.json. No source files or Dropbox paths copied. No public records changed.`,
);

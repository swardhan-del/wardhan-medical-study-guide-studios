export const formats = ["WEB", "ACTIVITY", "PDF", "DOCX", "PPTX"];
export const subjects = [
  "anatomy",
  "histology",
  "cell-biology",
  "biochemistry",
  "physiology",
  "genetics",
];
const fields = [
  "id",
  "title",
  "subject",
  "kind",
  "format",
  "summary",
  "updatedAt",
  "bytes",
  "downloadUrl",
  "status",
  "href",
  "tags",
  "minutes",
];
export function validateCatalog(data, status = "public") {
  if (!data || data.version !== 1 || !Array.isArray(data.records))
    throw new Error("Catalog must have version 1 and records.");
  const seen = new Set();
  for (const record of data.records) {
    if (!record || Object.keys(record).some((key) => !fields.includes(key)))
      throw new Error("Unexpected catalog field; use the sanitized schema.");
    if (!/^[a-z0-9-]{1,80}$/.test(record.id) || seen.has(record.id))
      throw new Error("Invalid or duplicate ID.");
    seen.add(record.id);
    for (const key of ["title", "summary", "kind"]) {
      if (
        typeof record[key] !== "string" ||
        !record[key].trim() ||
        record[key].length > 500
      )
        throw new Error(`Invalid ${key}.`);
    }
    if (
      !subjects.includes(record.subject) ||
      !formats.includes(record.format) ||
      record.status !== status
    )
      throw new Error("Invalid subject, format or release status.");
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(record.updatedAt) ||
      Number.isNaN(Date.parse(record.updatedAt))
    )
      throw new Error("Invalid date.");
    if (!Number.isSafeInteger(record.bytes) || record.bytes < 0)
      throw new Error("Invalid file size.");
    if (
      record.href !== undefined &&
      (status !== "public" ||
        typeof record.href !== "string" ||
        !/^\/(?:learn\/renal(?:\/[a-z0-9-]+)?|practice\/[a-z0-9-]+|subjects\/anatomy\/[a-z0-9-]+|downloads\/[a-z0-9-]+\.pdf)$/.test(
          record.href,
        ))
    )
      throw new Error("Invalid internal resource destination.");
    if (
      record.tags !== undefined &&
      (!Array.isArray(record.tags) ||
        record.tags.length > 16 ||
        record.tags.some(
          (tag) => typeof tag !== "string" || !tag.trim() || tag.length > 80,
        ))
    )
      throw new Error("Invalid topic tags.");
    if (
      record.minutes !== undefined &&
      (!Number.isSafeInteger(record.minutes) ||
        record.minutes < 1 ||
        record.minutes > 120)
    )
      throw new Error("Invalid study duration.");
    if (record.downloadUrl) {
      if (status !== "public")
        throw new Error("Private review records cannot contain download URLs.");
      const url = new URL(record.downloadUrl);
      if (
        url.protocol !== "https:" ||
        url.username ||
        url.password ||
        url.search ||
        url.hash ||
        /(^|\.)(dropbox\.com|dropboxusercontent\.com|localhost)$/.test(
          url.hostname,
        ) ||
        !url.hostname.includes(".") ||
        /^[\d.:]+$/.test(url.hostname)
      )
        throw new Error(
          "Use a permanent public HTTPS file URL without credentials or Dropbox paths.",
        );
    }
    if (
      /\/Users\/|\/study guide\/|original_dropbox_path|destination_dropbox_path|HOLD_RESTRICTED/.test(
        JSON.stringify(record),
      )
    )
      throw new Error("Private provenance must not enter a catalog.");
  }
  return data;
}

import type { CatalogRecord } from "./catalog-types";

export const normalizeSearch = (value: string) => value.normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase()
  .replace(/[–—−-]/g, " ").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
const aliases: Record<string, string> = {
  gfr: "glomerular filtration", abg: "blood gas", adh: "antidiuretic hormone",
  ecg: "electrocardiogram", ekg: "electrocardiogram", rbc: "erythrocyte",
  haemoglobin: "hemoglobin", oesophagus: "esophagus", foetal: "fetal",
  remodelling: "remodeling", signalling: "signaling", specialisations: "specializations",
};
const canonical = (value: string) => normalizeSearch(value).split(" ").map(w => aliases[w] ?? w).join(" ");
export function catalogSearchText(record: CatalogRecord, subjectTitle = "") {
  return [record.title, record.summary, record.kind, subjectTitle, ...(record.tags ?? []), record.searchText ?? ""].join(" ");
}
export function matchesSearchText(text: string, query: string) {
  const haystack = canonical(text);
  return canonical(query.slice(0, 200)).split(" ").filter(Boolean).every(word => haystack.includes(word));
}
export function matchesCatalogQuery(record: CatalogRecord, query: string, subjectTitle = "") {
  return matchesSearchText(catalogSearchText(record, subjectTitle), query);
}
export function searchRank(record: CatalogRecord, query: string) {
  if (!query.trim()) return 0;
  return matchesSearchText(record.title, query) ? 3 : matchesSearchText(record.summary + " " + (record.tags ?? []).join(" "), query) ? 2 : 1;
}
// Bounded Damerau-Levenshtein comparison: suggestions never silently alter the query.
function distance(a: string, b: string) {
  const rows = Array.from({ length: a.length + 1 }, () => Array<number>(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) rows[i][0] = i;
  for (let j = 0; j <= b.length; j++) rows[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) {
    rows[i][j] = Math.min(rows[i-1][j] + 1, rows[i][j-1] + 1, rows[i-1][j-1] + (a[i-1] === b[j-1] ? 0 : 1));
    if (i > 1 && j > 1 && a[i-1] === b[j-2] && a[i-2] === b[j-1]) rows[i][j] = Math.min(rows[i][j], rows[i-2][j-2] + 1);
  }
  return rows[a.length][b.length];
}
export function suggestQuery(texts: string[], query: string): string | null {
  const words = normalizeSearch(query.slice(0, 200)).split(" ");
  if (words.length > 12) return null;
  const vocabulary = [...new Set(texts.flatMap(t => normalizeSearch(t).split(" ")))];
  const corrected = words.map(word => {
    if (word.length < 4 || word.length > 32 || vocabulary.includes(word) || aliases[word]) return word;
    let best = word, score = word.length >= 8 ? 3 : 2;
    for (const candidate of vocabulary) {
      if (candidate.length > 32 || Math.abs(candidate.length - word.length) >= score) continue;
      const next = distance(word, candidate);
      if (next < score) { best = candidate; score = next; }
    }
    return best;
  }).join(" ");
  return corrected !== words.join(" ") && texts.some(t => matchesSearchText(t, corrected)) ? corrected : null;
}

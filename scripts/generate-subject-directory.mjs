import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const repo = path.resolve(import.meta.dirname, "..");
const work = path.resolve(repo, "..");
const inventory = JSON.parse(
  fs.readFileSync(
    path.join(work, "dropbox-directory-remote-snapshot-2026-09-06.json"),
  ),
);
const curated = JSON.parse(
  fs.readFileSync(
    path.join(work, "dropbox-directory-curated-folders-2026-09-06.json"),
  ),
);
const guideLists = JSON.parse(
  fs.readFileSync(
    path.join(work, "dropbox-directory-guide-files-2026-09-06.json"),
  ),
);
if (inventory.some((s) => !s.complete))
  throw new Error(
    "Finish all Dropbox listing cursors before generating the directory.",
  );
const roots = inventory.slice(0, 7).map((s) => s.name);
const ids = [
  "anatomy",
  "histology",
  "cell-biology",
  "biochemistry",
  "physiology",
  "genetics",
  "biostatistics",
];
const rootIds = Object.fromEntries(roots.map((r, i) => [r, ids[i]]));
const curatedRoot =
  "08_WEB_LIBRARY_CURATION/02_CANDIDATES_FOR_REVIEW/CONCEPT_LIBRARY_2026-09-06/";
const toPath = (p) => {
  const m = /^ns:\d+\/\/study guide\/(.+)$/.exec(p);
  if (!m || m[1].split("/").some((s) => s === ".." || s === "."))
    throw new Error("Unexpected Dropbox path");
  return m[1];
};
const url = (p, file = false) =>
  "https://www.dropbox.com/" +
  (file ? "preview/" : "home/") +
  ["study guide", ...p.split("/")].map(encodeURIComponent).join("/") +
  (file ? "?context=standalone_preview&role=personal" : "");
const idFor = (p) =>
  crypto.createHash("sha256").update(p).digest("hex").slice(0, 16);
const title = (name) => {
  const cleaned = name
    .replace(/^\d+(?:-\d+)?[_ ]+/, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return cleaned === cleaned.toUpperCase()
    ? cleaned
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase())
        .replace(/\b(Cns|Dna|Rna|Stem|Emii|Emi|Toc|Atp|Gfr|Adh|Abg)\b/g, (s) =>
          s.toUpperCase(),
        )
    : cleaned;
};
const excluded = (p) =>
  p
    .split("/")
    .some(
      (s) =>
        /^(?:\.?codex|tmp$|qa(?:_|$)|render|pages?$|thumb|contact.sheet|supporting|\d+[_ ](?:needs|unclear|unreadable|unrelated|duplicates|quarantine|possible.scientific|requires.accuracy|classification.review)|00_README|00_MANIFEST)/i.test(
          s,
        ) ||
        /quarantine|exact.duplicates|drafts.and|older.versions|previous.(?:version|verizion|document|quarantine)|former.|finder.metadata|evidence|(?:^|_)qa(?:_|$)|(?:^|_)audit(?:_|$)|(?:^|_)archive(?:_|$)|interface.screenshot|previous ver|older veri|print.development|development.files|table.of.contents.work/i.test(
          s,
        ),
    );
function courses(base, relative) {
  if (base === "histology") {
    if (
      /Neurulation|Neural_Crest|Brain_Vesicles|Spinal_Cord|Reflex|Olfactory|Taste_Organ|Eye_and_Ear|Ear_Auditory|Neurodevelopment|Nervous_Tissue_Foundations/i.test(
        relative,
      )
    )
      return ["histology-ii"];
    if (
      /EM_?II|EM_II|PART_IX|PART_VIII|(?:^|\/)(?:13|14|15|16|17|18|19)_(?:Nervous|Sensory|Autonomic|Eye|Ear|Olfactory|Skin)/i.test(
        relative,
      )
    )
      return ["histology-ii"];
    if (
      /(?:^|\/)0[12]_EMI_|PART_(?:II|III|IV|V|VI|VII)_|(?:^|\/)(?:0[1-9]|1[012])_(?:Course|Epithelial|Connective|Blood|Muscle|Circulatory|Respiratory|Oral|Stomach|Urinary|Male|Female)/i.test(
        relative,
      )
    )
      return ["histology-i"];
    return ["histology-i", "histology-ii"];
  }
  if (base === "genetics") {
    if (/Microbiology.and.Antimicrobials/i.test(relative))
      return ["microbiology"];
    if (/(?:^|\/)0[123]_(?:Genetic|Cytogenetic)/i.test(relative))
      return ["genetics"];
    if (
      /(?:^|\/)0[4567]_(?:Immunology|Adaptive|Complement|Clinical.Immunology)/i.test(
        relative,
      )
    )
      return ["immunology"];
    if (
      /Antigen|Complement|Immune|Immunoserology|Inflammation|T_Cells_B_Cells|Flow_Cytometry/i.test(
        relative,
      )
    )
      return ["immunology"];
    if (
      /Cell_Division|Cytogenetics|DNA_Repair|Epigenetics|Genome_Structure|Inheritance|Molecular_Methods/i.test(
        relative,
      )
    )
      return ["genetics"];
    return ["genetics", "immunology"];
  }
  return [base];
}
function category(p, collection) {
  if (collection === "curated") return "topics";
  if (/Final_Printable|Finalized Vol|Final_Print_Set/i.test(p))
    return "printable";
  if (/Official_Lectures|Syllabus And Schedule/i.test(p)) return "lectures";
  if (/Textbooks_and_Atlases/i.test(p)) return "textbooks";
  if (/Exam_Preparation/i.test(p)) return "exam";
  if (/STEM|Stem|Diagrams_Images|Slide_Atlas/i.test(p)) return "visuals";
  if (/TOC_Organized_Source_Library/i.test(p)) return "topics";
  return "notes";
}
const entries = new Map();
const omitted = [];
function addFolder(p, base, collection, relative) {
  const artifact = p.split("/").some((part) => {
    const name = part.replace(/[_-]/g, " ").toLowerCase();
    return /\baudit\b|\bqa\b|\brender(?:ed|s)?\b|\bproof\b|\bworking\b|\bprevious\b|\bolder\b|\bneeds\b|\bquarantine\b|\bpublication candidates\b|\bactive reference visuals\b|\bsource intake\b|\bclassification review\b|\bunrelated\b|\bunreadable\b|\blow resolution\b|\bmanual classification\b|\bpossible scientific\b|\bunclear\b/.test(
      name,
    );
  });
  if (excluded(p) || artifact) {
    omitted.push(p);
    return;
  }
  const parts = relative.split("/").filter(Boolean);
  const rootName = roots[ids.indexOf(base)];
  const label = parts.length
    ? title(parts.at(-1))
    : collection === "curated"
      ? "Curated topic library"
      : "Subject folder";
  entries.set(p, {
    id: idFor(p),
    title: label,
    subjects: courses(base, relative),
    baseSubject: base,
    category: category(p, collection),
    collection,
    kind: "folder",
    url: url(p),
    trail: parts.slice(0, -1).map(title).join(" / "),
    parentPath: p.slice(0, p.lastIndexOf("/")),
    path: p,
    root: rootName,
  });
}
for (const s of inventory.filter((s) => rootIds[s.name])) {
  const base = rootIds[s.name];
  addFolder(s.name, base, "source", "");
  for (const e of s.folders) {
    const p = toPath(e.path);
    addFolder(p, base, "source", p.slice(s.name.length + 1));
  }
}
for (const e of curated) {
  const p = toPath(e.path);
  if (!p.startsWith(curatedRoot))
    throw new Error("Unexpected curated folder root");
  const remainder = p.slice(curatedRoot.length),
    root = remainder.split("/")[0],
    base = rootIds[root];
  if (!base) continue;
  addFolder(p, base, "curated", remainder.slice(root.length + 1));
}
for (const list of guideLists)
  for (const e of list.entries) {
    if (
      !/\.(?:pdf|docx|pptx|epub)$/i.test(e.name) ||
      /(?:Revision.Log|Unresolved.Items|Cross.Reference.Audit|Register|Report|Prompt)/i.test(
        e.name,
      )
    )
      continue;
    const p = toPath(e.path),
      parentPath = p.slice(0, p.lastIndexOf("/"));
    const base = list.subject === "microbiology" ? "genetics" : list.subject;
    const relative = p.slice(p.indexOf("/") + 1);
    entries.set(p, {
      id: idFor(p),
      title: e.name.replace(/_/g, " "),
      subjects: courses(base, relative),
      baseSubject: base,
      category:
        list.subject === "biostatistics"
          ? "textbooks"
          : list.subject === "microbiology"
            ? "lectures"
            : "printable",
      collection: "source",
      kind: "file",
      format: e.name.split(".").at(-1).toUpperCase(),
      url: url(p, true),
      trail: parentPath.split("/").slice(1).map(title).join(" / "),
      parentPath,
      path: p,
      updatedAt: e.modified_time || null,
    });
  }
const subjectDefinitions = [
  [
    "anatomy",
    "Macroscopic Anatomy & Embryology",
    "Regional anatomy, five volumes and developmental connections.",
    "anatomy",
    roots[0],
    "Finalized Vol 1 4 study guide",
  ],
  [
    "histology-i",
    "Microscopic Anatomy & Embryology I",
    "General tissues, organ histology and early development.",
    "histology",
    roots[1],
    "06_Final_Printable_Guides",
  ],
  [
    "histology-ii",
    "Microscopic Anatomy & Embryology II",
    "Neurodevelopment, CNS microscopy, reflexes and special senses.",
    "histology",
    roots[1],
    "06_Final_Printable_Guides",
  ],
  [
    "cell-biology",
    "Molecular & Cell Biology",
    "Molecular mechanisms, cellular structures and laboratory techniques.",
    "cell-biology",
    roots[2],
    "06_Final_Printable_Guides",
  ],
  [
    "biochemistry",
    "Biochemistry",
    "Biomolecules, enzymes, metabolism and the topic-based guide collection.",
    "biochemistry",
    roots[3],
    "06_Final_Printable_Guides",
  ],
  [
    "physiology",
    "Medical Physiology",
    "Cellular, cardiovascular, respiratory, renal, blood, gastrointestinal, endocrine and nervous-system physiology.",
    "physiology",
    roots[4],
    "06_Final_Printable_Guides",
  ],
  [
    "genetics",
    "Medical Genetics",
    "Inheritance, cytogenetics, pedigrees and diagnostic methods.",
    "genetics",
    roots[5],
    "06_Final_Printable_Guides",
  ],
  [
    "immunology",
    "Immunology",
    "Innate and adaptive immunity, antigen presentation, complement, vaccines and therapies.",
    "genetics",
    roots[5],
    "06_Final_Printable_Guides",
  ],
  [
    "microbiology",
    "Microbiology & Antimicrobials",
    "The existing sterilisation, disinfection and antibiotic source collection.",
    null,
    roots[5] +
      "/01_Official_Lectures_and_Course_Materials/08_Microbiology_and_Antimicrobials",
    null,
  ],
  [
    "biostatistics",
    "Biostatistics",
    "The medical statistics reference collection in Dropbox.",
    null,
    roots[6],
    null,
  ],
];
const subjects = subjectDefinitions.map(
  ([id, title, description, learningSubject, folder, printable]) => ({
    id,
    title,
    description,
    learningSubject,
    dropboxUrl: url(folder),
    printableUrl: printable ? url(folder + "/" + printable) : null,
    printableNote: ["histology-i", "histology-ii"].includes(id)
      ? "Shared I–II printable collection"
      : ["genetics", "immunology"].includes(id)
        ? "Shared genetics and immunology collection"
        : null,
  }),
);
const rows = [...entries.values()]
  .sort((a, b) => a.title.localeCompare(b.title, undefined, { numeric: true }))
  .map((e) => {
    let p = e.parentPath;
    while (p && !entries.has(p))
      p = p.includes("/") ? p.slice(0, p.lastIndexOf("/")) : "";
    const { path: rawPath, parentPath, root, ...safe } = e;
    void rawPath;
    void parentPath;
    void root;
    return { ...safe, parentId: p ? entries.get(p).id : null };
  });
const result = {
  version: 1,
  updatedAt: "2026-09-06",
  linkAccess: "existing-dropbox-access",
  subjects,
  entries: rows,
};
fs.writeFileSync(
  path.join(repo, "src/content/directory-routes.json"),
  JSON.stringify(
    subjects.map((s) => s.id),
    null,
    2,
  ) + "\n",
);
fs.writeFileSync(
  path.join(repo, "src/content/subject-directory.json"),
  JSON.stringify(result, null, 2) + "\n",
);
fs.writeFileSync(
  path.join(work, "dropbox-directory-generation-audit-2026-09-06.json"),
  JSON.stringify(
    {
      scannedFolders:
        inventory.reduce((n, s) => n + s.folders.length, 0) + curated.length,
      omittedFolders: omitted,
      entries: rows.length,
      subjects: subjects.length,
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify(
    {
      subjects: subjects.length,
      folders: rows.filter((e) => e.kind === "folder").length,
      files: rows.filter((e) => e.kind === "file").length,
      perSubject: subjects.map((s) => [
        s.id,
        rows.filter((e) => e.subjects.includes(s.id)).length,
      ]),
    },
    null,
    2,
  ),
);

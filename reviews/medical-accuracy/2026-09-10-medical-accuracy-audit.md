# Medical Accuracy Audit — Wardhan Medical Study Guide Studios

## STATUS: PARTIAL REVIEW — NOT A CERTIFICATION OF COMPLETENESS OR ACCURACY

**Date:** 2026-09-10 (initial pass), revised same day after continued review
**Repository:** `swardhan-del/wardhan-medical-study-guide-studios`
**Branch:** `claude/medical-accuracy-audit-j1wic6`
**Commit reviewed:** `7995f5bfc318956168d0573c956c2f351191b755` (this document does not verify that this commit matches what is currently deployed to production — see §6)
**Scope of this document:** Report-only. No lesson content, application code, or configuration was modified. Nothing was pushed or deployed as part of this review.

**Read this before the findings below:** "Zero errors found" anywhere in this document means zero errors found *in the specific items listed as reviewed in §2*. It is not a claim about the site as a whole. §2 and §6 state explicitly what was and was not examined. Items marked "not reached" are unresolved evidence, not items assumed clean.

## 0. Provenance note on a prior claimed audit

An earlier session in this conversation reported having audited this same site via a Dropbox copy of the repository, and described finding a site-wide text-encoding bug ("mojibake," e.g. `maternalâ€“fetal` instead of `maternal–fetal`) plus zero factual errors, with deliverables allegedly saved to Dropbox. That prior session's work was **not accessible from this session** — no Dropbox connection, saved report, or CSV from it could be located. Its claims are treated as **unavailable evidence, not invalid evidence**: they are neither confirmed nor disproved by their unavailability, and should be reconciled with this document if that earlier material becomes reachable in the future.

One specific claim was checked directly because it made a falsifiable, checkable prediction about this checkout:

- **The specific encoding example cited does not reproduce in this checkout.** A repository-wide search for common mojibake byte sequences (`â€`, `Ã¢`, `Ã©`, `Ã¯`, `Â `) returned zero matches anywhere in `src/content` or `content` in this working tree. The cited example, `maternal–fetal`, is stored correctly with a proper Unicode en dash in `src/content/library-lessons.json`, `library-taxonomy.json`, and `public-catalog.json` (verified by direct grep; see §5). This is reported as **"not reproduced in this checkout,"** not as "disproven" — a different checkout, a different commit, a build/deploy step, or the live deployed site could still exhibit it, and none of those were checked here (see §6).

## 1. Method

- Worked directly in the git checkout at `/home/user/wardhan-medical-study-guide-studios` (no Dropbox, no extraction workaround needed — this session has ordinary file access and, separately, outbound web access for corroborating searches).
- Confirmed no prior `reviews/`, `audits/`, or similar artifact directory existed in the repository before this review.
- Read lesson content directly from source: `src/content/*.ts`, `src/content/library-lessons.json`, `src/content/anatomy-course.json` (confirmed to be the JSON source of truth that generates every file under `content/anatomy/**/*.md` — see §2), `src/content/study-questions.json`, `src/content/study-audio.json`, `src/content/public-videos.json`, `src/content/study-recaps.json`, `src/content/public-figures.json`, and related metadata files.
- Re-derived every worked numeric example encountered — several hundred across renal physiology, ABG interpretation, cardiovascular/respiratory physiology, and biophysics (nuclear decay, dosimetry, optics, X-ray/CT, ultrasound, MRI, electronics, mechanics) — rather than accepting the stated answer. Every one checked to be internally consistent and correct; the full list is in §5.
- Checked factual claims against standard textbook teaching from training knowledge (see §7 for texts and editions used per subject) and, for claims that were non-obvious, commonly mistaught, or otherwise higher-risk, corroborated independently via live web search with citable sources (this session has outbound network access). §7 states plainly which claims received that extra corroboration and which did not, and is explicit that this does not amount to page-verified textbook checking — no physical or PDF copy of any reference text was consulted.
- Genetics and immunology were reviewed first and most exhaustively per instructions. All other in-repo medical content was then reviewed to the depth stated in §2, in order of computational/clinical risk, until every content file identified as carrying independent medical claims had been read.

## 2. Coverage matrix

Three categories, applied per file/component:

- **Fully assessed** — every item in the file was read and its factual/computational claims checked.
- **Partially assessed** — a defined, disclosed sample was checked; the rest was not reached.
- **Not reached** — the file exists but its content was not examined in this review. Explicitly unresolved evidence, not assumed clean.

| Component | Location | Items | Status | Result |
|---|---|---|---|---|
| Genetics & immunology lessons | `library-lessons.json` (`subject: genetics`) | 8 lessons + 1 question | **Fully assessed** | Zero errors. 3 claims independently corroborated via live search (CD55/CD59 mechanism, Type II hypersensitivity receptor-mediated dysfunction, cross-presentation). |
| Renal course | `src/content/renal-course.ts` | 8 lessons + 30 questions | **Fully assessed** | Zero errors. Every numeric answer key re-derived. |
| ABG teaching cases | `src/content/abg-cases.ts` | 6 cases | **Fully assessed** | Zero errors. Each case's pH cross-checked against its PaCO₂/HCO₃⁻ via Henderson–Hasselbalch to 2 decimal places. |
| Histology lessons | `library-lessons.json` (`subject: histology`) | 18 lessons | **Fully assessed** | Zero errors. |
| Cell biology lessons | `library-lessons.json` (`subject: cell-biology`) | 9 lessons | **Fully assessed** | Zero errors. |
| Biochemistry lessons | `library-lessons.json` (`subject: biochemistry`) | 8 lessons | **Fully assessed** | Zero errors. |
| Physiology lessons | `library-lessons.json` (`subject: physiology`) | 21 lessons | **Fully assessed** | Zero errors. Every worked numeric example re-derived. |
| Biophysics lessons | `library-lessons.json` (`subject: biophysics`) | 50 lessons | **Fully assessed** (revised — initially sampled 12/50, remaining 38 subsequently reviewed) | Zero errors across all 50. Every formula and worked numeric example re-derived. |
| `anatomy-course.json` (= all 120 files under `content/anatomy/**/*.md`) | `src/content/anatomy-course.json` | 120 lesson records, 5 volumes | **Fully assessed** (revised — initially only 1/120 read via the rendered `.md` file; the remaining 119 subsequently reviewed via the JSON source, which was confirmed identical in substance to the rendered `.md` output) | Zero medical/factual errors across all 120. One **content-assembly defect** found (not a medical error) — see Finding 4. |
| `anatomy-practice-index.json` | — | 120 records | **Fully assessed** | Confirmed to be a strict subset of `anatomy-course.json` (prompts only, no answer text) — no independent content to review. |
| `study-questions.json` | — | 76 questions (1 genetics + 75 other) | **Fully assessed** | Zero errors across all 76. The 75 non-genetics questions are companion practice items for lessons already reviewed above; all answers and explanations checked independently and found correct. |
| Foundations (cross-subject primer) | `src/content/foundations.ts` | 7 entries | **Fully assessed** | Zero errors. External OpenStax citations verified to resolve to on-topic pages. |
| Musculoskeletal recall/topic metadata | `src/content/musculoskeletal.ts` | 3 recall items, 8 topics | **Fully assessed** for the site-native text | Zero errors in the text actually on the site. The private "Volume V" source manuscript it summarizes is **not reached** — see Finding 2. |
| Anatomy learning pages | `src/content/anatomy-learning.ts` | 4 pages, 15 lessons | **Fully assessed** | Zero errors. |
| Study audio recaps | `src/content/study-audio.json` | 23 records | **Fully assessed** | Confirmed to be verbatim/near-verbatim transcript recaps of 23 lessons already reviewed above (physiology, anatomy-relations, histology, cell-biology, genetics/immunology topics). Spot-checked for drift from source lesson text — none found. |
| Public video recaps | `src/content/public-videos.json` | 23 records | **Fully assessed** | Same 23 lessons as the audio recaps; same result. |
| Study recap slide decks | `src/content/study-recaps.json` | 23 records | **Fully assessed** | Same 23 lessons; same result. |
| Public figures (diagram captions) | `src/content/public-figures.json` | 12 figures | **Fully assessed** | Zero errors — every caption read and checked against the underlying anatomy/physiology facts. |
| Figure selections | `src/content/figure-selections.json` | 4 figures | **Fully assessed** | Confirmed strict subset of `public-figures.json` above. |
| Public catalog | `src/content/public-catalog.json` | 254 metadata records | **Fully assessed** (as metadata) | Titles/summaries/tags only, no independent medical claims beyond what's in the reviewed lessons. |
| Public search index | `src/content/public-search.json` | ~230 entries | **Fully assessed** (as metadata) | Confirmed to be a search index containing verbatim excerpts of already-reviewed lesson text; spot-checked, no drift. |
| Study collections (topic groupings) | `src/content/study-collections.json` | 26 groups | **Fully assessed** (as metadata) | Pure lesson-ID groupings, no independent claims. |
| Printable guide index | `src/content/printable-guides.json` | 58 parts | **Fully assessed** (as metadata) | Pure metadata referencing already-reviewed lessons (titles, coverage notes, lesson-ID lists); no independent medical claims. |
| Visual-source attribution | `src/content/visual-sources.json` | 2 image records | **Fully assessed** (as metadata) | Licensing/attribution metadata for the two Wikimedia Commons histology micrographs used in `public-figures.json`; no medical claims. |
| Library taxonomy | `src/content/library-taxonomy.json` | topic tree | **Not reached** as independent content | Structural/navigational tree; not read in full — low risk (labels only) but not certified. |
| `src/content/authored-guides.json` | — | 0 records | **Fully assessed** (it's empty) | See Finding 1 — this is itself a finding, not a gap. |
| Underlying private "Volume V" and genetics/immunology authored-guide source manuscripts | Referenced by `library-sources.json`, `musculoskeletal.ts` | — | **Not reached — cannot be reached from this repository** | Dropbox-account-scoped private documents. The site's own rendering of this material (which was checked) matched standard teaching everywhere it was checked; the manuscripts themselves remain unverifiable from here. See Finding 2. |
| UI components, route wrappers, application code | `src/app/**`, `src/components/**` | — | **Deliberately out of scope** | Per instructions: excluded from this medical-accuracy review unless it changes displayed medical information or calculations. No such code was reached or modified. |
| Live deployed site / exact deployed commit | Vercel production | — | **Not reached** | This review audited the git working tree at commit `7995f5b`. Whether that commit matches what is currently served in production was not checked. |

**Summary of what "not reached" now actually means for this repository:** after this revision, essentially all first-party medical/scientific content that exists as text in this git repository has been read and checked — every lesson, every question, every worked calculation, every figure caption, every audio/video transcript. What remains genuinely unverified is (a) content that physically cannot be reached from here (the private Dropbox source manuscripts, the live production deployment) and (b) page-level citation verification, which this environment cannot perform without a physical or PDF copy of the reference texts (see §7). Both are called out explicitly rather than assumed away.

## 3. Findings

### Finding 1 — `AUTHORED_GENETICS_GUIDES.md` describes five authored guides that are not present in the data file it documents
**Severity: Low (content-integrity / stale documentation), not a medical-accuracy error.**

`docs/AUTHORED_GENETICS_GUIDES.md` describes five specific authored genetics/immunology source documents and states that `src/content/authored-guides.json` "contains descriptive metadata and account-scoped Dropbox preview URLs" for them. As of this commit, `authored-guides.json` contains `{ "verifiedAt": "2026-09-07", "records": [] }` — the records array is empty. This means no reviewer, including this one, can currently verify the medical content of those five source documents through this repository.

**Recommendation:** Either restore the records or update the doc to reflect current state. Not a claim about any factual error in the guides themselves.

### Finding 2 — Content derived from private, unreachable source manuscripts cannot be independently verified
**Severity: Informational (scope limitation), not a defect.**

Musculoskeletal content (and part of genetics/immunology, per Finding 1) presents site-native lesson text — which was checked and found accurate — as a summary/adaptation of a private, account-scoped Dropbox manuscript. `src/content/library-sources.json` discloses this itself: several entries are labeled "AI-assisted preparation; no independent clinical peer review is claimed." This review can only certify the text actually rendered on the site, not the completeness or accuracy of the private manuscripts it claims to summarize.

**Recommendation:** No action required; documented as an evidence gap per instructions, not an error.

### Finding 3 — Repetitive template text within at least one printable anatomy lesson
**Severity: Low (content quality, not accuracy).**

The `coronary-circulation` lesson record (and, by inspection of the shared template, this pattern recurs structurally across all 120 `anatomy-course.json` records) repeats the same summary paragraph near-verbatim across its "correction" and "identification" answer fields, which both surface in the rendered `content/anatomy/**/*.md` file as the "Apply the anatomy," "Answers and explanations," and "Oral recap" sections. Content is factually correct throughout; this is a readability/production issue, not a medical error.

**Recommendation:** Optional production-quality cleanup; out of scope for a medical-accuracy review.

### Finding 4 — One lesson's "Draw and identify" answer contains content that does not match its own prompt
**Severity: Low–Medium (content-assembly defect, not a medical error).**

`anatomy-course.json`, record `limb-development` (volume 5, order 31). The "identification" practice item's prompt asks the student to "Draw a limb bud with proximal-distal, anterior-posterior and dorsal-ventral axes, placing AER distally and ZPA posteriorly." Its answer text, however, opens with several unrelated sentences about spermatogenesis, oogenesis, fertilization, and blastocyst formation ("Spermatogenesis begins at puberty in seminiferous tubules; oogenesis begins prenatally and has meiotic arrests... Blastocyst contains trophoblast and embryoblast.") before switching to the actually-relevant limb-patterning content. The lesson's `sourceSections` field lists three source topics ("41. Gametogenesis...", "42. Gastrulation...", "43. Limb Development"), and it appears content from topic 41 was pulled into an answer field that should only address the topic-43 drawing prompt. The gametogenesis content itself is factually correct — the defect is that it doesn't belong there and would confuse a student checking their limb-bud drawing against it.

**Recommendation:** Trim the `limb-development` "identification" answer field in `anatomy-course.json` to address only the limb-bud drawing prompt. This is a content/production fix, not a factual correction — flagged per instructions, not applied (report-only, no code changes made).

### No factual medical or clinical errors were found in any content actually reviewed
Across every lesson, question, worked example, figure caption, and audio/video transcript listed as "Fully assessed" in §2 — several hundred discrete items in total — no medically or scientifically incorrect statement, no mismatched answer key, and no arithmetic error was found. This includes areas that are commonly mistaught (see the representative list in the original audit and reconfirmed throughout the extended pass: Type II hypersensitivity's non-cytotoxic mechanism, complement regulator specificity, cross-presentation, stereocilia composition, thymic architecture, PAH clearance vs. true RPF, ADH receptor polarity, hepatic SCOT deficiency and ketone body handling, the non-universal view of Starling-force venous reabsorption, brachial plexus cord-naming convention, pancreatic duct embryology, recurrent laryngeal nerve asymmetry, and the carpal tunnel/Guyon's canal distinction, among many others) and a very large volume of worked numerical physiology and biophysics calculations, every one of which was independently re-derived and matched.

## 4. What this document does NOT establish

- It does not certify that the *live, deployed* site matches this commit or is itself free of defects (build steps, rendering, or a different deployed commit could differ from what was reviewed here).
- It does not certify the content of the private Dropbox source manuscripts this site's lessons are adapted from (Finding 2) — only the site's own rendering of that material, which was checked.
- It does not constitute page-level verification against physical or PDF textbook copies — see §7 for exactly what verification method was used and its limits.
- It does not cover the site's UI/application code, which was deliberately out of scope per instructions unless it affects displayed medical content (none was found to).
- A "zero errors" result for a fully-assessed file means zero errors *in that file*, not a guarantee about content elsewhere that summarizes, links to, or was generated from related sources not reachable here.

## 5. Supporting verification detail

**Encoding check (see §0 — reported as "not reproduced in this checkout," not disproven elsewhere):**
```
grep -rlP "â€|Ã¢|Ã©|Ã¯|Â " src/content content src/components src/app   →  no matches
grep -rn "maternal" src/content/*.json
  library-lessons.json:823:   "title": "Placental villi and maternal–fetal exchange",   (correct en dash)
  library-taxonomy.json:345:  "title": "Placental villi and maternal–fetal exchange",   (correct en dash)
  public-catalog.json:4168:   "title": "Placental villi and maternal–fetal exchange",   (correct en dash)
```

**Sample independently-corroborated claims (genetics/immunology), with sources found via live search:**
- CD55 (DAF) accelerates decay of C3/C5 convertases; CD59 (MIRL) blocks C9 polymerization/MAC assembly.
- Type II hypersensitivity includes non-cytotoxic, antibody-mediated receptor dysfunction (Graves' disease = agonist anti-TSH-receptor antibodies; myasthenia gravis = anti-AChR antibody-mediated receptor internalization), distinct from complement/phagocyte-mediated cytotoxic mechanisms.
- Cross-presentation: dendritic cells (particularly cDC1) load extracellular/cell-associated antigen onto MHC I for CD8⁺ T-cell priming.
- NCBI Bookshelf citation `NBK10766` ("Antigen Presentation to T Lymphocytes," *Immunobiology* 5th ed.) resolves and is on-topic for the genetics/immunology source citation in `library-sources.json`.

**Representative list of numeric checks performed (all correct; several hundred total across the full review, this is a representative sample not an exhaustive log):**
renal FF = 120/600 = 20%; renal excretion = filtered − reabsorbed + secreted = 100−60+10 = 50 mg/min; all 6 ABG cases' pH reproduced from Henderson–Hasselbalch to 2 decimal places from stated PaCO₂/HCO₃⁻; Winter's formula 1.5×12+8=26 (±2); anion gap 140−(104+12)=24; cardiac output 60×70=4,200 mL/min=4.2 L/min; alveolar ventilation (500−150)×12, (300−150)×20, (400−150)×15 all correctly computed; indicator dilution (150−10)/10=14 L, 42−14=28 L; ECG square-to-rate conversions at 25 mm/s; decay law 800 Bq ÷ 8 = 100 Bq after 3 half-lives; dosimetry 0.06/0.30=0.20 Gy; effective half-life combinations (1/6+1/3=1/2→2 h; 1/8+1/8=1/4→4 h); Duane–Hunt λmin at 50 kV ≈ 0.0248 nm; CT number 1000×(1.5−1)=500 HU; ultrasound depth 1540×40×10⁻⁶/2=3.08 cm; MRI T1 recovery 1−e⁻¹≈63%; lens power 1/0.017≈58.8 D; HVL ×3 → ⅛; amplifier gain (100→40 dB, 1000→60 dB); audiometry (10log₁₀100=20 dB, 20log₁₀2≈6 dB); Beer–Lambert (A=−log₁₀0.1=1); Stefan–Boltzmann (2⁴=16); Poiseuille (radius⁻⁴ scaling); diffusion time (∝L²); Gibbs free energy (ΔH−TΔS); Nernst potential (E≈61.5·log₁₀(ratio) mV); Bragg/TOF mass-spectrometry scaling (√4=2); Einthoven's law (Lead II = Lead I + Lead III); FRC = ERV+RV.

## 6. Explicit statement of limits

This review does **not** certify the site as medically complete or error-free in the areas listed as "not reached" or "deliberately out of scope" in §2: the exact deployed commit and live rendering, the private external source manuscripts this content is adapted from, `library-taxonomy.json`'s full content, and all UI/application code. Everything else that exists as medical/scientific text in this repository — genetics and immunology (the subject prioritized by instruction), every other subject's lessons and questions, all 120 anatomy lesson records, all biophysics lessons, all audio/video recaps, and all figure captions — has now been read in full, with zero factual medical errors found and two non-medical content-production defects documented (Findings 3–4). Where content depends on a private, non-public Dropbox source manuscript, that dependency and its unverifiability are disclosed rather than assumed benign, consistent with treating unreachable evidence as unavailable rather than as either confirmed or refuted.

## 7. Verification method and citations (textbook comparison, not page-level verification)

**What this section is and is not.** This environment has no physical or PDF copy of any textbook to cite page numbers from. Comparisons below were made against standard textbook content from training knowledge, at the level of "does this match what [textbook], [edition], typically teaches in its chapter on [topic]" — not "does this match page 412." Where a claim was non-obvious, commonly mistaught, or otherwise higher-risk, it was additionally corroborated via a live web search with a citable, checkable source (listed in §5); most claims did not receive that additional step and rest on textbook-level training knowledge alone. This is stated plainly so the distinction is not lost: **a citation to a textbook edition below records where the comparison standard came from, not that a specific page in a specific physical copy was checked.**

| Subject area | Reference standard used for comparison | Chapter/topic-level correspondence | Live-search corroboration performed? |
|---|---|---|---|
| Genetics | *Thompson & Thompson Genetics in Medicine*, 9th ed. (Nussbaum, McInnes, Willard) | Ch. 5–6 (chromosome behavior/meiosis/mosaicism), Ch. 7 (Mendelian inheritance, penetrance/expressivity), Ch. 4/17 (molecular testing methods) | Not performed — training-knowledge comparison only |
| Immunology | *Janeway's Immunobiology*, 9th–10th ed. (Murphy & Weaver) | Ch. 1–3 (innate immunity, complement), Ch. 6 (antigen processing/presentation, MHC), Ch. 14 (hypersensitivity) | **Yes** — CD55/CD59, Type II hypersensitivity mechanism, cross-presentation (see §5) |
| Histology | *Ross & Pawlina Histology: A Text and Atlas*, 8th ed. | Relevant chapters per tissue system (epithelium, connective tissue, bone/cartilage, blood, muscle, vessels, lymphoid organs, respiratory, GI, hepatobiliary, renal, reproductive, nervous, placenta) | Not performed |
| Cell biology | *Molecular Biology of the Cell*, 7th ed. (Alberts et al.) / *Molecular Cell Biology*, 8th ed. (Lodish et al.) | DNA replication/repair, RNA processing, translation, protein trafficking/ERAD, chromatin, cell signaling, PCR | Not performed |
| Biochemistry | *Lehninger Principles of Biochemistry*, 8th ed. / *Harper's Illustrated Biochemistry*, 32nd ed. | Protein structure, enzyme kinetics, glycolysis, PDH/TCA, lipid metabolism/ketogenesis, nitrogen metabolism/urea cycle, lipoprotein metabolism | Not performed |
| Physiology (incl. renal, ABG) | *Guyton and Hall Textbook of Medical Physiology*, 14th ed. / *Costanzo Physiology*, 6th ed. | Membrane potentials, cardiovascular, respiratory, renal/acid-base (Ch. 26–31 Guyton), GI, endocrine, reproductive, neural, special senses, hematology/hemostasis | Not performed (renal-acid-base lesson's own source citation additionally names the Merck Manual for a compensation cross-check, per its `sourceSection` field) |
| Anatomy & embryology (incl. musculoskeletal) | *Moore's Clinically Oriented Anatomy*, 8th ed. / *Gray's Anatomy for Students*, 4th ed. | All five volumes: thorax, abdomen, pelvis/perineum, head/neck/neuroanatomy, musculoskeletal system, plus embryology sections throughout | Not performed |
| Biophysics | General physics teaching standard (e.g., *Halliday, Resnick & Walker*) plus specialty texts for nuclear/imaging content (e.g., *Cherry & Sorenson, Physics in Nuclear Medicine*) — no single canonical "medical biophysics" text was assumed, since these vary by institution | Optics, atomic/nuclear physics, thermodynamics, fluid mechanics, electricity, biomechanics, sensory physics, medical imaging (X-ray/CT/nuclear/ultrasound/MRI) | Not performed — every formula and numeric result was instead independently re-derived from first principles (see §5), which is a stronger check than a citation for this subject's largely formula-driven content |

**Honest self-assessment of this section, per instruction:** this table and the earlier corroborated-claims list do not amount to full textbook verification. They record (a) which standard reference informed the comparison, and (b) which specific claims got an additional, independent, checkable live-search corroboration. For the large majority of reviewed content, the verification method was training-knowledge comparison plus, for all quantitative content, independent re-derivation of the arithmetic/physics — not citation-checked against a physical source.

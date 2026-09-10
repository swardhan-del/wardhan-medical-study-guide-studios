# Medical Accuracy Audit — Wardhan Medical Study Guide Studios

**Date:** 2026-09-10
**Repository:** `swardhan-del/wardhan-medical-study-guide-studios`
**Branch:** `claude/medical-accuracy-audit-j1wic6`
**Commit reviewed:** `7995f5bfc318956168d0573c956c2f351191b755`
**Scope of this document:** Report-only. No lesson content, application code, or configuration was modified. Nothing was pushed or deployed as part of this review.

## 0. Provenance note on a prior claimed audit

An earlier session in this conversation reported having audited this same site via a Dropbox copy of the repository, and described finding a site-wide text-encoding bug ("mojibake," e.g. `maternalâ€“fetal` instead of `maternal–fetal`) plus zero factual errors, with deliverables allegedly saved to Dropbox. That session's work was **not visible to this session** and none of its claimed artifacts exist in this repository. Per instructions, its claims were treated as an unverified handoff, not as established fact, and were independently re-checked:

- **The claimed encoding bug does not reproduce in this repository.** A repository-wide search for common mojibake byte sequences (`â€`, `Ã¢`, `Ã©`, `Ã¯`, `Â `) returned zero matches in `src/content` or `content`. The specific example cited, `maternal–fetal`, is stored correctly with a proper Unicode en dash in `src/content/library-lessons.json`, `library-taxonomy.json`, and `public-catalog.json` (verified by direct grep; see §4). The most likely explanation is that the bug was an artifact of the previous session's Dropbox text-extraction workaround (renaming `.ts` files to force extraction), not a defect in the actual source. It is not carried forward as a finding here.
- No Dropbox-saved report or CSV from that session could be located from this repository or this session's context, so this document does not assume they exist or are accurate.

## 1. Method

- Worked directly in the git checkout at `/home/user/wardhan-medical-study-guide-studios` (no Dropbox, no extraction workaround needed — this session has normal file access).
- Confirmed no prior `reviews/`, `audits/`, or similar artifact directory existed in the repository before this review (searched for `*review*`/`*audit*` at the top three directory levels; only pre-existing engineering docs under `docs/` and `src/app/review` — an unrelated student self-review feature — were found).
- Read lesson content directly from source (`src/content/*.ts`, `src/content/library-lessons.json`, `content/anatomy/**/*.md`), not through any lossy extraction step.
- Checked factual/computational claims against standard textbook teaching (Guyton & Hall and Costanzo for physiology, Robbins for pathology, Janeway's Immunobiology/Kuby for immunology, Thompson & Thompson for genetics, Moore for anatomy) and, where a claim was non-obvious or a commonly-mistaught nuance, against current sources via live web search (this session has outbound network access, unlike the prior session, which reported it did not).
- Re-derived every worked numeric example (Winter's formula, anion gaps, Henderson–Hasselbalch cross-checks, clearance/filtration-fraction arithmetic, half-life and effective-half-life combination, dose/HU/dB/lens-power calculations, ECG square-to-time conversions) rather than accepting the stated answer.
- Genetics and immunology were reviewed first and most exhaustively per instructions, then remaining subjects were reviewed in order of computational/clinical risk.

## 2. Coverage inventory and per-component assessment

"Reviewed" below means the actual lesson/question text and (where present) worked numeric answers were read and independently checked. "Not reached" means the file exists but its content was not examined in this pass — these are the unresolved-evidence items called out explicitly per instructions, not areas silently assumed clean.

| Component | Location | Items | Depth | Result |
|---|---|---|---|---|
| Genetics & immunology lessons | `src/content/library-lessons.json` (`subject: genetics`) | 8 lessons + 1 question | Full read, claim-by-claim, 3 claims independently corroborated via live search (CD55/CD59 mechanism, Type II hypersensitivity receptor-mediated dysfunction, cross-presentation) | **No errors found.** |
| Renal course | `src/content/renal-course.ts` | 8 lessons + 30 questions | Full read; every numeric answer key re-derived | **No errors found.** All Winter's-formula, filtration-fraction, and mass-balance arithmetic checked and correct. |
| ABG teaching cases | `src/content/abg-cases.ts` | 6 cases | Full read; pH cross-checked against each case's stated PaCO₂/HCO₃⁻ via Henderson–Hasselbalch, and Winter's-formula/compensation rules re-derived | **No errors found.** All 6 cases are internally consistent to the decimal place. |
| Histology lessons | `library-lessons.json` (`subject: histology`) | 18 lessons | Full read | **No errors found.** |
| Cell biology lessons | `library-lessons.json` (`subject: cell-biology`) | 9 lessons | Full read | **No errors found.** |
| Biochemistry lessons | `library-lessons.json` (`subject: biochemistry`) | 8 lessons | Full read | **No errors found.** |
| Physiology lessons | `library-lessons.json` (`subject: physiology`) | 21 lessons | Full read; every worked numeric example re-derived (cardiac output, dead-space/alveolar ventilation, indicator dilution, ECG rate/interval math) | **No errors found.** |
| Biophysics lessons | `library-lessons.json` (`subject: biophysics`) | 50 lessons | Sampled 12 of 50, weighted toward calculation-heavy topics (decay law, dosimetry, effective half-life, X-ray production, CT/HU, ultrasound depth/Doppler, MRI T1 recovery, lens power, attenuation, amplifier gain, audiometry); remaining 38 **not reached** | **No errors found in the sample.** All formulas and arithmetic checked (e.g., λmin at 50 kV ≈ 0.0248 nm, HU = 1000(1.5−1) = 500, T1 recovery 1−e⁻¹ ≈ 63%, 3 half-lives → ⅛). |
| Foundations (cross-subject primer) | `src/content/foundations.ts` | 7 entries | Full read | **No errors found.** External OpenStax citations verified to resolve to on-topic pages. |
| Musculoskeletal recall/topic metadata | `src/content/musculoskeletal.ts` | 3 recall items, 8 topics | Full read | **No errors found** in the site-native text (hip-bone composition, carpal tunnel contents, flexion/extension plane and axis). The underlying "Volume V" source manuscript this content summarizes is a private, account-scoped Dropbox document and was **not reached** — see §3. |
| Anatomy learning pages | `src/content/anatomy-learning.ts` | 4 pages, 15 lessons | Full read | **No errors found** (mediastinal divisions, lung lobation, peritoneal relationships, gut arterial territories, limb/kidney development). |
| Anatomy printable guide (sample) | `content/anatomy/volume-01-thorax/14-coronary-circulation.md` | 1 of 120 lesson files | Full read | **No errors found** (coronary dominance defined by posterior interventricular artery origin, venous drainage routes, diastolic LV perfusion mechanism — all correct). Noted as a **content-quality** (not accuracy) issue: heavy verbatim repetition of the same paragraphs across the Objectives/Apply/Worked-example/Answers/Oral-recap sections within this file — see §4. Whether this repetition is representative of the other 119 files was **not checked**. |
| `content/anatomy/**` (remaining 119 lesson files) | — | 119 files | **Not reached** | Unresolved evidence. |
| `src/content/anatomy-course.json`, `anatomy-practice-index.json` | — | 618 KB / 124 KB | **Not reached** | Unresolved evidence. |
| `src/content/study-questions.json` (non-genetics) | — | 75 of 76 questions | **Not reached** (only the 1 genetics question was reviewed, in §2 above) | Unresolved evidence. |
| `src/content/public-catalog.json`, `public-search.json`, `study-map.json`, `study-collections.json`, `study-recaps.json`, `printable-guides.json`, `figure-selections.json`, `public-figures.json`, `visual-sources.json` | — | large JSON indexes/metadata | **Not reached** beyond targeted greps (see §3, §4) | Unresolved evidence. |
| `study-audio.json`, `public-videos.json` | — | audio/video metadata | **Not reached** — underlying audio/video content itself cannot be reviewed from static text | Unresolved evidence. |
| UI components, route wrappers | `src/app/**`, `src/components/**` | ~20+ files | **Not reached** — this review targeted content correctness, not rendering | Unresolved evidence. |
| Live deployed site / exact deployed commit | Vercel production | — | **Not reached.** This review audited the git working tree at commit `7995f5b`; whether that commit matches what is currently served in production was not independently confirmed. | Unresolved evidence. |
| `src/content/authored-guides.json` | — | 0 records | Read in full | File is empty (`"records": []`) — see §3, this is a finding, not a gap. |

## 3. Findings

### Finding 1 — `AUTHORED_GENETICS_GUIDES.md` describes five authored guides that are not present in the data file it documents
**Severity: Low (content-integrity / stale documentation), not a medical-accuracy error.**

`docs/AUTHORED_GENETICS_GUIDES.md` describes five specific authored genetics/immunology source documents (an integrated DOCX, an illustrated immunology PDF addendum, a 200-question addendum, a "Complement, Inflammation, Serology and HAE" master guide, and its recall/answer set) and states that `src/content/authored-guides.json` "contains descriptive metadata and account-scoped Dropbox preview URLs" for them. As of this commit, `authored-guides.json` contains:
```json
{ "verifiedAt": "2026-09-07", "records": [] }
```
The records array is empty. Either the records were removed after the doc was written, or they were never added. This means the "Genetics and Immunology" subject page's promised "five selected study collections above the full Dropbox directory" (per the same doc) currently has no backing metadata to render, and — separately from any UI question — no reviewer (including this one) can currently verify the medical content of those five source documents through this repository, because the records that would carry the (Dropbox-account-scoped, not public) links are gone.

**Recommendation:** Either restore the records to `authored-guides.json` or update `AUTHORED_GENETICS_GUIDES.md` to reflect current state. This is a documentation/data consistency issue for engineering, not a claim about any factual error in the guides themselves — their content was not reachable in this review either way.

### Finding 2 — Underlying "Volume V" musculoskeletal manuscript and other authored-guide-derived content cannot be independently verified from this repository
**Severity: Informational (scope limitation).**

Several subjects (musculoskeletal, and per Finding 1, a portion of genetics/immunology) present the site's own lesson text (which was checked and found accurate) as a summary/adaptation of a private, account-scoped source manuscript stored in Dropbox (e.g., `musculoskeletal.ts`'s "Volume V" citations, page/slide-locator references). `src/content/library-sources.json` is transparent about this: several entries are explicitly labeled "AI-assisted preparation; no independent clinical peer review is claimed," and describe the web lessons as adaptations checked against "the source and the linked scientific reference" rather than full-text reproductions. This is a reasonable and disclosed design choice, not a defect — but it means this review (like any reviewer without Dropbox access to the private source) can only certify the text that is actually rendered on the site, not the completeness or accuracy of the private manuscripts it claims to summarize.

**Recommendation:** No action required; noted for completeness per the instruction to identify unresolved evidence explicitly.

### Finding 3 — Repetitive template text within at least one printable anatomy lesson file
**Severity: Low (content quality, not accuracy).**

`content/anatomy/volume-01-thorax/14-coronary-circulation.md` repeats the same paragraph ("The coronary arteries arise from the aortic sinuses and distribute across the epicardial surface... Dominance concerns posterior interventricular origin and varies between people...") near-verbatim across the "Apply the anatomy," "Worked example," "Draw and identify," "Answers and explanations," and "Oral recap" sections. The content is factually correct throughout; this is a readability/production issue (the template appears to reuse the same generated block in multiple slots) rather than a medical error. Only this one file (of 120) was read in full, so whether this pattern recurs elsewhere in `content/anatomy/` was not established.

**Recommendation:** Spot-check a larger sample of the 119 remaining anatomy lesson files for the same repetition pattern if a documentation/production-quality pass is wanted; out of scope for this medical-accuracy review.

### No factual medical or clinical errors were found
Across every lesson, question, and worked example actually reviewed (see §2 coverage table), no medically or scientifically incorrect statement, no mismatched answer key, and no arithmetic error was found — including in areas that are commonly mistaught (Type II hypersensitivity's non-cytotoxic receptor-mediated mechanism; complement regulator CD55 vs. CD59 specific mechanisms; cross-presentation of extracellular antigen onto MHC I; stereocilia being actin-based rather than true motile cilia; the thymus lacking true lymphoid follicles; PAH clearance approximating *effective* rather than true renal plasma flow; basolateral, not apical, location of the ADH V2 receptor; liver lacking the SCOT enzyme needed to consume the ketone bodies it produces; the revised/non-universal view of Starling-force venous-end capillary reabsorption). Numeric answer keys for every renal question (30/30), every ABG case (6/6), every physiology worked example, and the sampled biophysics calculations were independently re-derived and matched the stated answers.

## 4. Supporting verification detail

**Encoding check (Finding in §0, not §3 — no current defect):**
```
grep -rlP "â€|Ã¢|Ã©|Ã¯|Â " src/content content src/components src/app   →  no matches
grep -rn "maternal" src/content/*.json
  library-lessons.json:823:   "title": "Placental villi and maternal–fetal exchange",   (correct en dash)
  library-taxonomy.json:345:  "title": "Placental villi and maternal–fetal exchange",   (correct en dash)
  public-catalog.json:4168:   "title": "Placental villi and maternal–fetal exchange",   (correct en dash)
```

**Sample independently-verified claims (genetics/immunology), with corroborating sources:**
- CD55 (DAF) accelerates decay of C3/C5 convertases; CD59 (MIRL) blocks C9 polymerization/MAC assembly — corroborated against current complement-regulation literature.
- Type II hypersensitivity includes non-cytotoxic, antibody-mediated receptor dysfunction (Graves' disease = agonist anti-TSH-receptor antibodies; myasthenia gravis = anti-AChR antibody-mediated receptor internalization) distinct from complement/phagocyte-mediated cytotoxic mechanisms — corroborated.
- Cross-presentation: dendritic cells (particularly cDC1) load extracellular/cell-associated antigen onto MHC I for CD8+ T-cell priming — corroborated.
- NCBI Bookshelf citation `NBK10766` ("Antigen Presentation to T Lymphocytes," *Immunobiology* 5th ed.) resolves and is on-topic for the genetics/immunology source citation in `library-sources.json`.

**Full list of numeric checks performed (all correct):** renal FF = 120/600 = 20%; renal Q3 excretion = 100−60+10 = 50 mg/min; all 6 ABG cases' pH vs. Henderson–Hasselbalch (7.26, 7.49, 7.50 reproduced to 2 decimal places from stated PaCO₂/HCO₃⁻); Winter's formula 1.5×12+8=26 (±2); anion gap 140−(104+12)=24; cardiac output 60×70=4,200 mL/min=4.2 L/min; alveolar ventilation (500−150)×12=4,200 mL/min and (300−150)×20=3,000 mL/min and (400−150)×15=3,750 mL/min; indicator dilution (150−10)/10=14 L, 42−14=28 L; ECG 4 large squares→75 bpm, 5 large squares→60 bpm; decay law 800 Bq ÷ 8 = 100 Bq after 3 half-lives; dosimetry 0.06/0.30=0.20 Gy; effective half-life 1/8+1/3=1/2→2 h and 1/8+1/8=1/4→4 h; Duane–Hunt λmin at 50 kV ≈ 0.0248 nm; CT number 1000×(1.5−1)=500 HU; ultrasound depth 1540×40×10⁻⁶/2=3.08 cm; MRI T1 recovery 1−e⁻¹≈63%; lens power 1/0.017≈58.8 D; HVL ×3 → ⅛; amplifier gain 100→40 dB, 1000→60 dB; audiometry 10log₁₀(100)=20 dB.

## 5. Explicit statement of limits

This review does **not** certify the site as medically complete or error-free in the areas listed as "not reached" in §2 (119 of 120 printable anatomy lesson files; the two large anatomy JSON data files; 75 of 76 non-genetics study questions; most public-catalog/search/video/audio metadata; all UI/routing code; the live deployed site). Genetics and immunology — the subject prioritized by instruction — received full-depth review of every lesson and question present in the codebase, with zero errors found and several nuanced points independently corroborated. Where content depends on a private, non-public Dropbox source manuscript, that dependency and its unverifiability are disclosed rather than assumed benign.

# Phase 16 — original diagram system

4 October 2026. Branch `feat/foundational-curriculum-gap-fixes`, draft [PR #30](https://github.com/swardhan-del/wardhan-medical-study-guide-studios/pull/30), starting from `10d3252f2032b09cac87cf85cd6b43cf9bb17871`. Keep this PR draft and stacked on PR #29. No merge or production deployment is authorised.

## Authorship and review boundary

These four diagrams are independently hand-authored SVG code with AI assistance. Coordinates, shapes, labels and the illustrative concentration curves were authored for this project. No source illustration was copied, traced, cropped, edited, embedded or used as a layout template. Scientific references support the concepts; they are not artwork sources. Credit: **Original diagram — Wardhan Medical Study Guide Studios.**

Original authorship is not final scientific, editorial or accessibility approval. Each new visual explicitly retains `medical-review-pending`, pending editorial/accessibility review and empty review-evidence IDs. No clinical credentials, permission records or approval dates were invented. Existing lesson quality records, legacy fingerprints, no-index rules and review evidence are unchanged.

The four Phase 15 image-review packets remain private, unapproved and blocked for integration. Their scientific, commercial-rights, attribution and accessibility decisions have not been changed. These original diagrams confer no permission to use those images. Fourteen private review-package files and all 159 protected content/public-asset/fixture files captured before Phase 16 remain byte-identical.

## Placements and duplicate decisions

| Original visual ID | Existing lesson route | Beginner-first placement | Learning gap and reuse decision |
| --- | --- | --- | --- |
| `chromatin-local-access` | `/library/chromatin-access-and-topology` | Molecular & Cell Biology, DNA/chromatin stage 4 | No existing approved diagram covers octamer stoichiometry and local accessibility together. Adds one local schematic; no universal fibre hierarchy. |
| `er-folding-decisions` | `/library/er-protein-quality-control` | Molecular & Cell Biology, translation/protein targeting stage 7 | Existing trafficking flow already covers successful ER/Golgi transport and is preserved. This diagram adds the folding decision, cytosolic ERAD and a distinct stress-response branch. |
| `gpcr-versus-rtk` | `/library/cell-signaling` | Molecular & Cell Biology, signalling stage 8 | Existing lesson teaches second messengers without a receptor-class visual comparison. One shared renderer/record is added; no duplicate autonomic diagram or lesson. |
| `first-pass-indicator-flow` | `/library/cardiac-output` | Physiology, cardiovascular stage 4 | Existing pressure–volume visual is preserved; it does not teach indicator-dilution flow measurement. The equilibrium compartment-volume lesson at `/library/indicator-dilution` is also preserved and deliberately receives no flow diagram. |

The typed curriculum order and all existing learning paths remain unchanged. Registry placement reuses the established lesson and printable-revision rendering; no new route, source-image file, public asset or search entry is created. There are 58 registered lesson visuals (54 existing plus these four), 12 existing public figures, 242 library lessons and 262 catalog records.

Each diagram uses the shared `StudyVisual` contract: named SVG title/description, nearby explanation, visible caption, concise text alternative, observation prompt, authorship credit and mapped scientific citations. Four new `diagram-check-*` prompts have explained answers in native keyboard-operable disclosure controls. They are unscored reflection checks and do not write student progress. Existing assessment questions, answer order and the 927 registered question IDs remain unchanged.

## Scientific checks and sources

Public scientific text was checked on **2026-10-04**, using the linked primary teaching chapters and indicator-dilution article. NCBI/PMC direct requests sometimes returned a browser challenge; their indexed chapter/article passages were used for the AI-assisted source check. This is not independent clinical review. No source illustration or image file was imported.

- **Chromatin:** [Biology of Chromatin, Introduction to Epigenetics — NCBI Bookshelf](https://www.ncbi.nlm.nih.gov/books/NBK585710/). Canonical octamer contains two H2A, two H2B, two H3 and two H4 molecules. The drawing compares local DNA access; accessibility alone is not sufficient to establish transcription. No universal 30-nm fibre is drawn. Histone variants and broader chromatin regulation remain outside this simplified model.
- **ER quality control:** [Fewell and Brodsky, Entry into the Endoplasmic Reticulum: Protein Translocation, Folding and Quality Control — NCBI Bookshelf](https://www.ncbi.nlm.nih.gov/books/NBK6210/). Rough-ER entry, chaperone-assisted folding and successful export are separated from persistent-misfolding disposal. ERAD proceeds through extraction/retrotranslocation, ubiquitin targeting and cytosolic proteasomal degradation; extraction and tagging may be coupled. Accumulated misfolded protein activates an adaptive UPR. Prolonged unresolved stress can contribute to apoptosis; UPR does not always cause it.
- **Receptors:** [Signaling through G-Protein-Linked Cell-Surface Receptors](https://www.ncbi.nlm.nih.gov/books/NBK26912/) and [Signaling through Enzyme-Linked Cell-Surface Receptors](https://www.ncbi.nlm.nih.gov/books/NBK26822/), *Molecular Biology of the Cell*, NCBI Bookshelf. GPCRs promote GDP-to-GTP exchange on Gα, and Gα and/or Gβγ can regulate effectors. RTK activation involves dimerisation or rearrangement and cytosolic tyrosine phosphorylation/docking. Ras/MAP kinase is one example. Neither cAMP nor MAP kinase is a universal output; Ras is distinct from a heterotrimeric G protein.
- **Indicator dilution:** [OpenStax, Cardiac Physiology](https://openstax.org/books/anatomy-and-physiology-2e/pages/19-4-cardiac-physiology) and [James B. Bassingthwaighte, Dispersion of Indicator in the Circulation](https://pmc.ncbi.nlm.nih.gov/articles/PMC3085985/). First-pass dose/AUC estimates flow, with adequate mixing, suitable sampling/recovery and approximately steady flow. Recirculation must be excluded or corrected, including estimation of the first-pass tail. Flow is distinct from stroke volume per beat. The chart is synthetic and is not patient data or a clinical calculator.

References are appended to the existing four lesson bibliographies without changing existing entries or reference order. Every new visual's source URLs map to those bibliographies and record the actual source-check date. No lesson quality source record is replaced or review date advanced.

### Indicator model and units

The original teaching curve uses a normalised illustrative density `500 t² exp(−10t)`, with time in minutes, multiplied by `dose / flow`. This is a convenient independently authored mathematical example, not the empirical curve or figure from the cited article. Numerical integration verifies that a 5 mg dose at 5 L/min has a first-pass AUC of 1 mg·min/L; at 10 L/min the AUC is 0.5 mg·min/L. A separate delayed signal illustrates recirculation and is excluded from the dose/AUC denominator. Curve width is held fixed for comparison and is not a claim that flow changes only curve height in real measurements.

## Technical accessibility and preservation

- Static responsive SVG viewBoxes; no animation, raster image, external SVG or image request. Text, arrows, hatch patterns and line styles accompany colour.
- Minimum 640 CSS px inner canvas preserves legible labels. On 320/390 px screens the existing labelled, focusable diagram region scrolls horizontally without widening the page; full prose/text equivalents wrap outside it. Desktop diagrams fit the existing reading column.
- Semantic SVG titles/descriptions, independent IDs across instances, captions and ordinary HTML explanations remain available to assistive technology. Decorative internal primitives are hidden from the accessibility tree to avoid duplicate label announcements.
- Browser checks measure label bounds and minimum rendered font size, use arrow keys to scroll, open both explanation disclosures by keyboard, check reflow/reduced-motion and run Axe WCAG 2 A/AA, 2.1 AA and 2.2 AA rules at each requested width. These are automated checks, supplemented by AI visual inspection; they do not constitute human accessibility or readability approval.
- A new public-content preservation fixture pins the starting teaching, route/question registries, quality/evidence, curriculum, public assets, search metadata, 54 prior visuals and pre-existing bibliographies. It does not refresh the frozen legacy quality baseline or the Phase 13 fixture. Existing source entries must remain intact and in order.
- Existing privacy regressions still reject private names/paths, canonical and OCR copies, known raw bytes, encoded metadata/source maps, staged-index substitutions, symlinks and deployment traces. New tests apply the real deny policy to the SVG source, visual metadata and rendered HTML; hosted/local route checks now also cover cardiac output. `.private/` exclusions are unchanged.

## Verification

Validation results and exact-head remote status are recorded in the leading Phase 16 entry of [CODEX_HANDOFF.md](CODEX_HANDOFF.md) and on PR #30. Local logs/screenshots are ignored. Prior-head CI is not evidence for the new head. Original diagrams and successful tests are not a substitute for final scientific, editorial, visual and human accessibility review.

## Next safe phase

Review these four original diagrams on one exact preview commit, one lesson at a time. A qualified educator must check each scientific mechanism, caveat, calculation and explained answer; an editor must review wording; a human accessibility reviewer must inspect screen-reader, zoom and mobile use. Record scope, version, reviewer qualifications, findings and disposition in the existing review workflow. Correct findings and re-review affected material. Keep the private image packets unapproved and all lesson/release/indexing gates in place until their separate evidence requirements are satisfied. Do not merge PR #30 or deploy production as part of Phase 16.

# Molecular Cell Biology diagrams — source check, 1 November 2026

**AI-assisted source comparison only. Not qualified scientific, editorial, rights or human accessibility approval. No release gate is cleared.**

Review target: draft [PR #30](https://github.com/swardhan-del/wardhan-medical-study-guide-studios/pull/30), exact head `9bf0175ae1659595381d7ab592a3f5c21407d435`, still stacked on #29. This review branch starts from current main `4ae389056352e64ccdc27a4eba0ffc2a976b3066`. It does not import, merge or reproduce the existing implementation. The [existing diagram code](https://github.com/swardhan-del/wardhan-medical-study-guide-studios/blob/9bf0175ae1659595381d7ab592a3f5c21407d435/src/components/original-diagrams.tsx) and [metadata/explanations](https://github.com/swardhan-del/wardhan-medical-study-guide-studios/blob/9bf0175ae1659595381d7ab592a3f5c21407d435/src/content/lesson-visuals.json) remain authoritative for the reviewed version.

## Scope and source disposition

The subject is Molecular Cell Biology. A complete scoped remote inventory found 696 source files, including 37 PDFs and 10 DOCX files, with no PPT/PPTX files. Lecture presentations in this subject are PDFs. PowerPoints found by a broader keyword search belonged to other subjects; they must not be reassigned merely because their text mentions molecular biology.

The current controlled subject model records zero approved-private Molecular Cell Biology assets, and the approved-private manifest contains no corresponding assets. An existing candidate collection already contains relevant material. Two selected candidate images were hash-matched to their existing private review records; a third source-image alias was not resolved in that subject's candidate directory. Do not duplicate the collection, infer a controlling edition from filenames, or treat possession as public rights. Private source paths, raw slides, image bytes and source extracts stay outside Git.

The original coded schematics are a separate representation from the held archive images. Unresolved archive-artwork rights do not prove anything about independently authored code; each representation needs its own applicable review and release record. The original schematics' qualified scientific, editorial and human accessibility reviews remain pending in their current metadata. References support facts, not permission to copy their illustrations.

## Findings for the three existing diagrams

| Diagram and existing route | Bounded check | Disposition |
| --- | --- | --- |
| `chromatin-local-access` — `/library/chromatin-access-and-topology` | The code labels two copies each of H2A/H2B/H3/H4 and distinguishes local accessibility from automatic gene activation. Its caption explicitly avoids a universal fixed 30-nm hierarchy. | No definite contradiction found in these selected labels/explanation. This is a limited model, not a complete description of chromatin regulation. Qualified review remains pending. |
| `er-folding-decisions` — `/library/er-protein-quality-control` | Folding/export is separate from cytosolic disposal. UPR is labelled signalling, not a disposal compartment; extraction/tagging coupling and conditional apoptosis are qualified in the explanation. | No definite contradiction found in these selected distinctions. Reviewers should verify the simplified order, compartments and caveats against the exact figure. |
| `gpcr-versus-rtk` — `/library/cell-signaling` | The comparison distinguishes heterotrimeric G protein from Ras, allows Gα/Gβγ effectors and qualifies RTK rearrangement/dimerisation and example outputs. | One editorial suggestion: replace “GDP → GTP exchange on Gα” with “GDP leaves; GTP binds Gα”. The existing wording says exchange and is not classified as a factual error; the proposed wording makes the two events clearer for beginners. |

Sources actually checked on 1 November:

- [Biology of Chromatin, Introduction to Epigenetics (2021)](https://www.ncbi.nlm.nih.gov/books/NBK585710/) supports the canonical octamer description. [Ou et al., ChromEMT (2017), DOI 10.1126/science.aag0025](https://doi.org/10.1126/science.aag0025) supports caution about a universal higher-order hierarchy; its observed structures are specific experimental results, not universal dimensions for every cell.
- [Entry into the Endoplasmic Reticulum: Protein Translocation, Folding and Quality Control](https://www.ncbi.nlm.nih.gov/books/NBK6210/) supports ERAD/cytosolic proteasome and adaptive UPR distinctions. The selected private lecture pages do not by themselves establish the entire ERAD/UPR explanation or publication rights. One inspected page depicts general cytosolic quality control; another contains attributed textbook artwork.
- [Signaling through G-Protein-Linked Cell-Surface Receptors](https://www.ncbi.nlm.nih.gov/books/NBK26912/) supports the nucleotide-exchange clarification and G-protein distinction. [Signaling through Enzyme-Linked Cell-Surface Receptors](https://www.ncbi.nlm.nih.gov/books/NBK26822/) supports the RTK/docking/Ras example and receptor-specific limits.

Direct NCBI chapter requests encountered a browser challenge. Available indexed chapter passages and research-paper excerpts were checked; this is not a claim that every source chapter or private lecture slide was fully retrieved, reviewed or licensed. No challenge was bypassed.

## Proposed code patch

[The one-line label patch](../review-patches/2026-11-01-mcb-gpcr-label.patch) targets the exact PR #30 component above. It is **unapplied**. It must not be applied blindly to main, which does not contain that draft component. It changes no question ID, answer, assessment order, saved progress, other diagram or source/review record.

The patch applies cleanly to a private copy of the pinned source, and the resulting TSX transpiles. The three existing SVGs were retrieved from PR #30's exact READY preview; a private rendering of the proposed label fits its panel. These checks establish neither qualified review nor browser/accessibility approval of a new integrated head. A future application requires the normal checks and a preview tied to that new head. Existing passing CI for the unchanged draft is reused only for that original version.

## Remaining gates and responsible next step

The owner must identify the controlling source edition for any new archive adaptation and locate or commission the required exact-version scientific, editorial, human accessibility and applicable rights reviews. Original SVG review and archive-image licensing remain separate. The existing review packets should be completed in place with scope, version/hash, reviewer qualifications, findings and disposition; no approval or reviewer identity is invented here.

This branch provides a review record and proposed correction. It does not change the draft stack, publish archive sources, apply the patch, clear the lesson quality ledger or deploy new medical content. The production baseline remains `4ae3890` until a separately evidenced content release is ready.

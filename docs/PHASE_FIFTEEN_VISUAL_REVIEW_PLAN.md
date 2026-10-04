# Phase 15 — visual review and safe integration plan

Prepared 4 October 2026 for draft [PR #30](https://github.com/swardhan-del/wardhan-medical-study-guide-studios/pull/30), branch `feat/foundational-curriculum-gap-fixes`. Lesson baseline: `bf4f3e3a6f475071ba8ecc04283866fda61bfdd6`. This document is AI-assisted preparation, not independent scientific/clinical review, commercial rights clearance, human accessibility approval or release evidence.

## Decision

**Four ready for human inspection; zero approved for integration.** All four lack both a completed version-bound scientific review and documented commercial-publication permission. No lesson, route, question, answer, progress key, public asset, existing diagram, quality record, review evidence or indexing gate is changed.

The four private records V15-01 through V15-04 contain the exact canonical SHA-256, all original locations and duplicate aliases, source subject, intended sequence, proposed placement, scientific questions, separate rights and attribution fields, draft caption/alt text/observation prompt and responsive requirements. They are held with the existing ignored intake review queue; no source name, path, OCR text or image bytes are transferred here. These records refer to the exact lesson baseline above; a later lesson or artwork change requires renewed review. Source origins identify possession, not authorship or ownership.

## Review sequence and learning purpose

| Private record | Existing lesson placement | Specific objective and scientific focus | Existing representation / preferred option |
| --- | --- | --- | --- |
| V15-01 — chromatin | Molecular & Cell Biology stage 4, `/library/chromatin-access-and-topology`; after nucleosome/accessibility explanation and before topology check | Separate packaging, accessibility and DNA topology. Review whether the illustrated hierarchy overstates a universal structure; check each topoisomerase statement. | No equivalent registered visual. The existing DNA-replication diagram covers fork orientation only. Prefer one original schematic if the additional representation is justified, after review. |
| V15-02 — ER quality control | Molecular & Cell Biology stage 7, `/library/er-protein-quality-control`; beside disposal explanation and pulse–chase example | Distinguish folding/export, retention, ERAD and the unfolded protein response. Check compartments, glycan specificity, extraction/ubiquitination and arrows. | Reuse the existing original protein-trafficking flow for the successful export objective. It does not cover the disposal branch. Assess that remaining gap before commissioning any additional diagram. |
| V15-03 — receptor signalling | Molecular & Cell Biology stage 8, `/library/cell-signaling`, shared with physiology stage 3 `/library/autonomic-signalling` | Connect receptor, G protein, effector and messenger; qualify tissue effects and distinguish ion-channel receptors. Review every subtype and permeability label. | No equivalent receptor map. Baroreflex and thyroid-feedback diagrams teach different objectives. Prefer one shared original accessible comparison, never two copies or new lessons. |
| V15-04 — indicator dilution | Physiology stage 1, `/library/indicator-dilution`; after tracer selection beside the loss-corrected example | Separate measured from derived fluid volumes; check compartment boundaries, losses, equilibration, units and plasma/whole-blood distinction. | No equivalent tracer-compartment diagram. Existing membrane-transport visuals support prerequisites only. Prefer a single original compartment map/table using the existing example if justified. |

All four: scientific review **pending**; commercial rights **pending**; source attribution **pending original-source identification**; caption/alt/observation text **draft requirements, not approved copy**; mobile and human accessibility review **pending**; publishable **no**.

The comparison covered current lesson text, 54 registered lesson visuals, 12 released figures, coded teaching diagrams, the physiology models and the typed curriculum order. “Released” describes current repository status and does not establish independent scientific review. No fully equivalent approved representation was found for these four complete objectives. The partial reuse recommendations above must be considered first. The existing anatomy, histology, genetics and biophysics starting points remain intact.

## Required version-bound decisions

For each candidate, a qualified scientific reviewer must record identity, qualification, review date, exact artwork hash, exact lesson commit, scope, specific findings, disposition and signed evidence. A professor’s scientific sign-off covers only its stated scientific scope; it does not grant image-publication rights.

A separate rights record must establish original creator, rights holder, original source/version, licence or written permission, commercial/global web use, permission to adapt/crop/create responsive variants, attribution requirements, any territory/expiry limits and evidence location. Repository review notes, the current queue, prior review snapshots, the review-evidence registry and released-figure records supplied no qualifying approval for these four. This is a bounded project evidence check, not a claim about evidence outside the available records.

Only after both decisions, confirm educational need and absence of an equivalent current representation. Select either reuse, an original independently authored diagram or the approved source image. Do not trace or reproduce uncleared artwork under an “original” label. Any correction to a visual, caption or lesson requires re-review of that version. Keep clinical, visual, accessibility/readability and no-index gates pending wherever evidence is incomplete; this plan authorises no gate changes.

## Future integration contract

Use the existing `StudyVisual`/`VisualComparison`/`VisualFlow` contract. Every final representation needs concise alt text, a visible model-qualified caption, an observation prompt, a text equivalent, scientific references and distinct artwork attribution/rights evidence. The private packets contain candidate-specific draft requirements; they must match the approved final pixels or diagram, not endorse the current source image.

Verify 320 px and 390 px layouts, text enlargement, colour-independent labels, reading order, keyboard operation and focus, failed-image fallback, print output and reduced motion. Dense charts should become semantic comparisons or labelled panels rather than illegible thumbnails. No duplicate questions or progress identifiers are needed. Human screen-reader/readability review remains separate from automated checks.

## Regression boundary

`npm run content:privacy` scans working files and staged Git objects (so a safe working copy cannot hide unsafe staged bytes), denies known source filenames through digest matching, rejects private/OCR bytes even after renaming, copied OCR records, canonical locations, embedded media, unapproved asset locations and repository symlinks. Existing released assets retain their exact path/hash allowlist. Git and Vercel exclusions remain mandatory. A Vercel snapshot without Git is explicitly reported as such; CI supplies the index check.

The digest-only deny inventory covers 640 intake records: 637 unreleased source-byte hashes, 620 OCR-file hashes and 767 unique source-name hashes. Three byte-identical legacy released assets remain governed by their existing approval/path/hash records; this grants no new permission. No raw names, source paths or OCR strings are stored in the inventory. Updating this deny inventory must never update the release allowlist or a frozen lesson baseline.

Postbuild runs the same checks over server/client output, rendered HTML/RSC, sitemap bodies, metadata and available Vercel output, including root and page dependency traces and resolved symlink targets. Browser regressions check the five existing target lesson routes, source-route denial and sitemap. Synthetic negative tests exercise encoded names, copied OCR, renamed/embedded bytes, staged files and output leaks without committing real examples.

These are enforceable checks for the documented representations, not a claim to detect every conceivable transformation or paraphrase. New intake requires a refreshed private inventory and digest-only guard; review must still inspect the diff. Private review material is never an application dependency.

## Next safe phase

Run `npm run content:privacy` before preparing a review checkout. Open V15-01 in the local private package, review its exact asset hash against the pinned lesson commit, and record scientific findings and separate rights evidence. Continue one objective at a time through V15-04. With no completed approvals, the next phase remains human review; do not run an asset import or deployment command. After actual approvals and reviewed corrections, propose a narrowly scoped integration on a draft branch and repeat all content, privacy, browser and release checks. PR #30 remains draft; production is unchanged.

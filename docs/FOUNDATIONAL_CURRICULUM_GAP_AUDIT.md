# Foundational curriculum gap audit

Date: 4 October 2026. Branch: `feat/foundational-curriculum-gap-fixes`.
Base: `c94fc2be4fe64149bd5be5c2ce4631ce71811cb7`, the existing draft [PR #29](https://github.com/swardhan-del/wardhan-medical-study-guide-studios/pull/29). The new draft is stacked on that branch so its diff does not duplicate Phase 12–14 teaching or review work. Neither draft is authorised for merge or production deployment.

## Inventory and scope

Before editing, inspected the clean checkout, remote branch, PR #29, handoff, source-consistency audit, review queue/findings, visual standard, subject hubs, subject learning path, anatomy path, study paths, foundation primers, lesson journeys, catalog, public figures, lesson visuals and all three dated intake folders.

The collection contains 242 library lessons plus the separate eight-lesson renal course. The current learning registry, question bank, routes, answer order, notes/progress formats and review evidence are preserved. The visual inventory contains 54 existing lesson comparisons/flows and 12 public figure records, alongside existing coded diagrams, interactive teaching and recap media. No new lesson, question, visual, source file, subject map route or learning-path route is created.

The demonstrated navigation gaps were:

- Physiology's short path began with membrane teaching while an older component still contained a renal-first sequence. Neither showed the complete requested organ-system order.
- Molecular & Cell Biology began with replication, omitting the earlier cell/organellar context from its visible sequence.
- Biochemistry began with enzymes, ahead of chemical and protein foundations.
- Subject hubs, Start Here, coverage links and directory paths each held their own order data.

`src/content/curriculum-order.ts` now owns the staged order, reasons, existing sample lesson and preserved orientation links. Subject hubs and study paths are projections of it. The existing topic-map renderer supplies the course map, directory path and compact Start Here preview. Missing stages are text marked **Planned**, never fabricated links. Existing sampler lessons and their quizzes remain available and are labelled as available teaching rather than a substitute for missing foundations.

The anatomy six-stage map retains its original titles, descriptions, order, links and presentation; only its data source moved. Anatomy, histology, genetics and biophysics retain their established three orientation destinations and first lessons. Immunology's existing directory destinations are preserved. The renal course remains linked at physiology stage six and from existing coverage/course access points.

## Ordered stages and missing teaching

| Subject | Visible order | Foundations still missing or only partly covered |
| --- | --- | --- |
| Physiology | Homeostasis/body fluids → membranes/transport/resting potential → action potentials/synapses/muscle/autonomic control → cardiovascular → respiratory → renal/acid-base → gastrointestinal/energy balance → endocrine/reproduction → nervous system/special senses → blood/haemostasis | Full homeostasis/body-fluid foundation. Existing short orientation and indicator-dilution teaching cover part of it. |
| Molecular & Cell Biology | Cell organisation → membranes/transport → organelles/energy → DNA/chromatin → replication/repair → transcription/RNA processing → translation/targeting → cell cycle/signalling/apoptosis/methods | Cell organisation; cell-specific membrane overview; organelle/energy foundation; transcription/control foundation; cell cycle/apoptosis. Existing membrane teaching is linked as shared preparation. |
| Biochemistry | Water/pH/buffers/thermodynamics → amino acids/proteins/interactions → enzymes/kinetics → carbohydrates/lipids → bioenergetics → central metabolism → nucleotide/nitrogen metabolism → integrated clinical biochemistry | Integrated pH/buffer foundation (existing water, first-law and free-energy lessons are reused); fuller amino-acid/interactions teaching (existing molecular-interaction teaching is reused); carbohydrate/lipid chemistry; bioenergetics/oxidative phosphorylation; nucleotide metabolism; integrated clinical/laboratory interpretation. Existing protein and metabolic lessons are reused. |

These are coverage gaps, not promises of a completed course or a publication schedule. DNA replication, repair, RNA processing, translation, trafficking, signalling, enzyme kinetics, glycolysis, lipid and nitrogen metabolism are linked in place. No parallel teaching copies are made.

## Private intake and duplicate handling

A local, Git-ignored and deployment-excluded queue is saved at `.private/conversion-queue/foundational-curriculum/intake-candidates.json`. It inventories the intake dates 2026-10-01, 2026-10-03 and 2026-10-04 without copying, renaming or removing originals. It is deliberately absent from the PR; a fresh checkout requires access to the existing private workspace.

The queue contains only subject, concept, proposed sequence position, private source identifier, duplicate-check result, scientific-review status, rights/provenance status, visual-review status and publishable decision. Identifiers group byte-identical local occurrences; existing conversion-brief matches and potential lesson/visual matches are recorded for reuse. Filename-derived concept/placement is provisional, not inspection of image content. Ambiguous concepts remain unresolved.

At inventory time: **914 files; 317 locally readable files; 181 distinct readable hashes; 136 duplicate occurrences grouped; 597 cloud-placeholder candidates with unresolved byte comparisons; 778 queue records total.** Three readable hashes match existing public asset bytes. This match grants no new rights or placement approval. Do not call the unresolved placeholders unique assets. No candidate is marked publishable.

The earlier eight conversion briefs and their review history are retained. References to those briefs avoid recreating completed adaptations. Semantic/image similarity still needs inspection before any new visual concept is commissioned. Existing scientific rejection/hold decisions are not overridden by this metadata inventory.

## Visual integration decisions

Existing biophysics water, thermodynamics, free-energy and molecular-interaction lessons are explicitly linked as shared biochemical preparation; they are not recreated or moved. Their original course order is preserved.

No additional image or diagram is needed to explain the navigation change itself. Reuse the existing lesson visuals where the curriculum links already lead:

- Membrane pathway/energy comparisons and passive-voltage plots support the membrane sequence.
- Existing channel-state, synaptic and muscle comparisons support excitable-cell teaching.
- RNA-processing and translation sequences, DNA-repair comparison and existing trafficking teaching support the molecular sequence.
- Enzyme, glycolysis, lipid/ketone and nitrogen comparisons support the biochemical sequence.

Their visual records, captions, observation prompts, descriptions, credits, scientific citations and asset bytes are unchanged. No clinical, scientific, visual-rights or accessibility approval is inferred from successful schema checks. The nine pending lesson-quality records and no-index gates from PR #29 remain unchanged.

A new visual can be considered only after selecting a genuine remaining lesson gap and checking existing visual coverage. Use `StudyVisual` and the existing figure/lesson-visual registries; do not create another caption or figure system. Before any harvested asset enters the public tree, document scientific accuracy, readable labels, provenance, commercial rights, concise alt text, caption, observation prompt, placement and approved visual-review disposition. An original SVG is preferable where it adds missing teaching, but originality alone is not scientific approval.

## Validation record

`content:curriculum` is part of content checks and prebuild. It rejects unavailable targets, duplicate stages/targets within a subject, empty stages and fake links in planned work. Tests assert the requested full order, renal placement, reuse of existing molecular/metabolic lessons and preserved subject starts. Existing question/progress preservation tests remain intact; the frozen legacy quality baseline and Phase 13 fixture are unchanged.

Current implementation validation and hosted-preview results are recorded in `CODEX_HANDOFF.md` and the draft PR. Automated layout, keyboard and Axe checks are technical evidence only, not human readability or assistive-technology approval.

## Next review and integration steps

1. Review the exact new PR version's ordering and planned-gap descriptions with a subject educator; do not mark missing teaching as completed.
2. Make the remaining private cloud placeholders locally readable, then complete their hash comparisons and reconcile aliases into existing queue records. Do not duplicate the source files or regenerate the older conversion briefs.
3. Inspect each candidate against the existing lesson/visual inventory. Retain scientific rejection and rights holds; record claim-specific corrections and commercial permission separately.
4. Select one real foundation gap, prepare an original teaching adaptation and only its necessary visual, with version-bound scientific, assessment, editorial and accessibility review.
5. Continue PR #29's existing human review gates. A navigation fix does not complete independent clinical review or release authorisation. Keep both PRs draft and production unchanged.

## Exact changed files

- `docs/CODEX_HANDOFF.md`
- `docs/FOUNDATIONAL_CURRICULUM_GAP_AUDIT.md`
- `package.json`
- `playwright.config.ts`
- `scripts/check-curriculum.mjs`
- `src/app/globals.css`
- `src/app/learn/foundations/[subject]/page.tsx`
- `src/app/start/page.tsx`
- `src/app/study/[subject]/page.tsx`
- `src/app/subjects/[slug]/page.tsx`
- `src/components/anatomy-learning-path.tsx`
- `src/components/subject-card.tsx`
- `src/components/subject-coverage.tsx`
- `src/components/subject-hub.module.css`
- `src/components/subject-hub.tsx`
- `src/components/subject-learning-path.tsx`
- `src/content/curriculum-order.ts`
- `src/content/study-paths.ts`
- `src/content/subject-hubs.ts`
- `tests/curriculum-order.test.mjs`
- `tests/e2e/curriculum-order.spec.ts`
- `tests/e2e/first-visit.spec.ts`
- `tests/e2e/subject-learning-paths.spec.ts`
- `tests/subject-learning-paths.test.mjs`

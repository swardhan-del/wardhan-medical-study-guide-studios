# Conceptual learning and assessment

The shared engine is used by native library lessons, renal quizzes, anatomy exploration, anatomy written practice, and introductory vocabulary lessons. The official site name and existing teaching assets remain unchanged.

## Definitions and grading

`conceptual-checkpoint.ts` separates grading from React. Definitions carry subject, lesson, topic, subtopic, concept, difficulty, sources, prerequisites, mechanism and response-specific explanations. Types include single choice, true/false, complete-set selection, numeric values with explicit unit conversion and tolerance, constrained terms and self-review. Unknown prose is not marked incorrect. Written explanations are never sent to a service or persisted as text by this component.

`checkpoint-adapter.ts` preserves existing option order, answer keys, question IDs and rationales. Source mappings are generated from the existing lesson/source registries. No lecture slide or page verification is inferred. Original typed questions are held separately in `typed-checkpoints.json`. Existing section prompts and model answers are projected from their teaching records rather than copied into a second maintained question bank.

Source priority for future authoring is verified university lectures, course materials, final study guides, approved textbooks/scholarly references, then labelled supplements. Use `primary-lecture-verified` only with a checked locator; never infer a slide number or page from a filename. Existing migrations retain their recorded guide/reference basis.

## Interaction and progress

A submission records once, teaches the relationship and opens the next checkpoint. The preceding feedback remains visible. History navigation and an all-question revision view retain access to earlier explanations. Inline checks keep feedback in place and open the following teaching section. Existing full reading access is preserved.

Browser progress remains compatible with version 1/2 exports and stable answer IDs. The version 2 payload gains validated checkpoint records. Import merges the newest record without summing overlapping counters. Storage failures retain in-memory progress with an explicit limitation. First-attempt history and the existing same-day retry rules are preserved. Self-assessment is separate from objective scores.

Variants must explicitly share a concept and be named in the originating definition. A missed answer can append a different verified example after intervening questions. Queue reconstruction survives reload. Identical, already queued or completed variants are excluded. The renal clearance pair is the first included variant mapping; other concepts need editorial variant mapping, not inferred similarity. My Study records repeated misunderstanding and written explanations marked for review.

## Coverage boundaries

268 native lessons span anatomy, histology, molecular cell biology, biochemistry, genetics/immunology, physiology, biophysics and biostatistics. Embryology is integrated into anatomy/histology. Eight renal lessons, seven vocabulary lessons and fifteen anatomy-explorer topics are audited separately. Context-dependent specimen/blood-gas activities retain their existing data/visual context.

Framework availability is **not** a claim that all major sections meet the complete instructional standard. Many sections still need a verified worked example, inline checkpoint, specific distractor rationale or different reinforcement example. Primary lecture locator evidence is not available for this migration. Existing sources and release evidence are preserved; this technical migration does not constitute independent clinical peer review.

Run `node scripts/audit-conceptual-coverage.mjs <output-directory>` for a lesson-level coverage register. It deliberately does not mark unverified major-concept coverage complete. Run `node scripts/build-checkpoint-sources.mjs --check` and `node scripts/build-learning-registry.mjs --check` to validate projections.

## Verification and reversal

Unit tests cover answer preservation, exact sets, units/rounding, malformed input, self-assessment, progress import and variant selection. Browser tests cover automatic progression, retained feedback, resume, duplicate submission, source visibility, mobile/keyboard accessibility and storage failure. Existing route, specimen, diagram and release checks remain required.

Use the normal pull-request and protected deployment workflow. Revert the feature commit to restore the earlier presentation; the additional browser progress field is ignored by the previous parser. Never delete historical source files or reset a learner's existing history as part of rollback.

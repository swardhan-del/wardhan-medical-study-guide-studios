# Phase 14: lesson review queue

This queue prepares human review of the eight Phase 12 drafts after the Phase 13 source-consistency audit. It records planned work, not completed reviews or reviewer approval. Review one route at a time, in the order below.

Branch: `feat/phase-twelve-lesson-preview`. Draft PR: [#29](https://github.com/swardhan-del/wardhan-medical-study-guide-studios/pull/29). Starting content version: `e4b09f45c3b0e6dd8ff58fe6840292b0da3f30cc`. Every completed review must identify the exact commit actually inspected; the starting version is not an automatic approval target for later changes.

Use the [content quality pipeline](CONTENT_QUALITY_PIPELINE.md), [Phase 12 review scope](PHASE_TWELVE_REVIEW.md), [Phase 13 source-consistency audit](PHASE_THIRTEEN_SOURCE_CONSISTENCY_AUDIT.md) and [handoff](CODEX_HANDOFF.md). AI-assisted source checks and passing technical tests do not constitute independent clinical review, publication-rights clearance or human accessibility approval.

## Ordered queue

All entries are awaiting completed human review records. No reviewer is assigned or approval implied by this table.

| Order | Lesson ID | Route | Specific review focus |
| --- | --- | --- | --- |
| 1 | `fluid-and-membrane-transport` | `/library/fluid-and-membrane-transport` | Transport mechanisms and tonicity; permeability versus driving force, channel/carrier and active-transport distinctions, and stated osmotic assumptions. |
| 2 | `membrane-potentials` | `/library/membrane-potentials` | Membrane-potential signs and cable calculations; inside-minus-outside convention, units, passive-model boundary assumptions and worked exponential values. |
| 3 | `biophysics-action-potentials` | `/library/biophysics-action-potentials` | Action-potential channel states and propagation; availability versus inactivation, recovery, regenerative spread and qualifications across excitable-cell models. |
| 4 | `synaptic-integration` | `/library/synaptic-integration` | Synaptic release, summation and shunting; release/receptor sequence, stipulated passive arithmetic versus the triggered spike, and conductance/reversal-potential wording. |
| 5 | `muscle-contraction` | `/library/muscle-contraction` | Skeletal, cardiac and smooth-muscle distinctions; NMJ and excitation–contraction coupling, calcium/ATP roles, and constant-length versus fixed-load wording. |
| 6 | `connective-tissue` | `/library/connective-tissue` | Connective-tissue identification and preparation limits; cell/matrix clues, cartilage/bone/adipose comparisons, and limits of processing, staining and schematics. |
| 7 | `somatosensory-pathways` | `/library/somatosensory-pathways` | Sensory crossings, laterality and VPL/VPM; body versus face sequences, relay locations, worked lesion assumptions and limits of experimental thalamic evidence. |
| 8 | `genetics-genome-foundations` | `/library/genetics-genome-foundations` | Pangenome, inheritance assumptions, VUS and genetic-test scope; reference diversity, stipulated inheritance probabilities, uncertainty and limits of test interpretation. |

## Required version-bound review record

Create a separate record for each lesson and review scope. Copy the following template only when recording an actual review. Blank placeholders are not evidence; do not prefill reviewer identities, qualifications, dates, findings or approval. With the reviewer's permission, retain a public-safe completed note under `docs/reviews/`; keep contact details, private correspondence and raw source files out of Git and public routes.

| Required field | What the completed note must record |
| --- | --- |
| Lesson ID | Exact ID from the queue and its route. |
| Commit SHA | Full immutable SHA of the content inspected, including associated questions and visuals. Record the current content SHA-256 required by the existing evidence schema when linking evidence. |
| Reviewer | Accountable reviewer attribution, recorded with permission; do not substitute an AI assistant for an independent human reviewer. |
| Qualification | Relevant actual qualifications and subject expertise; state independence for clinical review without inventing credentials. |
| Date | Actual review completion date in `YYYY-MM-DD` form. |
| Scope | Sections, worked examples, question IDs, visual IDs and references inspected; identify applicable checklist domains and anything not assessed. |
| Findings | Specific observations with locations, source support, corrections required and any unresolved limitations. An empty field does not mean no findings. |
| Disposition | `changes-required`, `accepted-for-stated-scope`, or `not-assessed`, with reasons and outstanding gates. Acceptance is limited to the recorded scope and version, not overall release approval. |

After corrections, record the new commit and an explicit review of the changed material before treating the earlier finding as resolved. Preserve earlier notes as history; do not silently carry approval forward to an unreviewed version. Refer to `src/content/lesson-review-evidence.json` and `src/lib/content-quality-types.ts` for evidence linkage; this queue itself is not a review-evidence record.

## Scientific/clinical teaching content checklist

- [ ] Inspect all teaching steps, worked examples and scope limitations against authoritative sources supporting the specific claims, using the lesson's focus above.
- [ ] Verify mechanisms, terminology, signs, units, equations, arithmetic and model assumptions; distinguish hypothetical examples from clinical conclusions.
- [ ] Check qualifications across species, tissue/cell types and experimental versus human evidence; identify unsupported generalisations or missing limitations.
- [ ] Record findings, required corrections and the reviewer's disposition for the exact version. Preserve pending clinical status for anything outside the completed scope.

## Visual scientific accuracy and publication-rights checklist

- [ ] Review every visual's labels, sequence, orientation, comparison, caption and relationship to its lesson; distinguish schematics from specimen images or measured data.
- [ ] Check accessible descriptions, text equivalents and source mappings against the visual's actual teaching content.
- [ ] Document authorship/provenance and commercial publication rights or the applicable original-work release decision for each exact asset or layout. A citation or private-site approval alone is not public-use clearance.
- [ ] Record the scientific and rights decisions separately, including unresolved assets. Do not import raw Dropbox documents, unapproved STEM images or images without documented suitability and rights.

## Editorial wording, readability and accessibility checklist

- [ ] Review professional headings, terminology and explanations for a global student audience; identify ambiguous wording and unexplained abbreviations.
- [ ] Check learning objectives, prerequisites, related/next links and source/review labels against the actual lesson and validated targets.
- [ ] Inspect mobile and enlarged-text layouts, keyboard operation, focus order, disclosures, tables and visual descriptions; include human screen-reader/assistive-technology review.
- [ ] Record devices, assistive tools, inspected scope and limitations. Automated checks alone do not complete human readability or accessibility review.

## Question answers and explanations checklist

- [ ] Check every knowledge/application question and open-question model response against the lesson's objectives and stated assumptions.
- [ ] Independently work each answer and calculation; verify an unambiguous best answer where required and useful, accurate feedback for every option.
- [ ] Check distractors, explanation consistency and distinctions between model predictions and real physiological behaviour.
- [ ] Record question-specific findings using existing IDs. Preserve IDs, answer order, saved notes and progress; any necessary answer correction requires an explicit compatibility plan rather than silently changing saved answer meaning.

## Release rule

Do not change `medical-review-pending`, `rights-review-pending`, `noindex-pending-review`, or review-evidence fields until a completed version-bound review note exists. Review one route at a time. Do not add evidence IDs, reviewer credentials or review dates merely because this queue, a source audit or a test run exists.

A completed note is necessary but not sufficient for release: all applicable scientific, visual-rights, assessment, editorial/readability and accessibility gates must be satisfied with evidence for the current version, followed by explicit release authorisation. Partial acceptance must not clear other pending domains. Keep PR #29 draft; do not merge, deploy production or remove indexing gates as part of Phase 14. This phase changes documentation only, not lesson text, questions, quality statuses or review evidence.

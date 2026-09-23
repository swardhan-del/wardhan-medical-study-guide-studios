# Medical lesson and visual learning standard

Applies to future anatomy, histology, physiology, biochemistry, genetics, immunology, biophysics and cell-biology lessons. Use the histology foundations lesson as a worked example. This standard governs new work; adopting it does not authorise rewriting other published lessons.

## Lesson sequence and terminology

| Section | Purpose and preferred wording |
| --- | --- |
| Learning Objectives | Use assessable verbs: identify, distinguish, explain, predict, calculate or justify. Specify the expected level of detail. |
| Core Concepts | Establish the organising framework and starting vocabulary before exceptions. |
| Guided Explanation | Progress from organisation to mechanism, examples and limits. Connect each structural feature to function. |
| Visual Study Prompts | Ask the learner to locate, compare, trace, label or predict using a specified figure. |
| Worked Identification Example | Give the observations, interpretation, competing explanation and justified conclusion. Use at least two independent positive clues. |
| Knowledge Check | Test essential understanding with one best answer and explained alternatives. “Self-Assessment” or “Examination Practice” may suit other contexts. |
| Clinical and Applied Questions | Require transfer of a mechanism to a new, clearly specified scenario. “Application Questions” is an acceptable shorter label. |
| Oral Examination Prompts | Ask for a structured spoken explanation before displaying a concise model response. “Oral Explanation Practice” is an acceptable alternative. |
| Summary Checklist | State observable tasks the learner can perform without notes. It must not imply certification or clinical competence. |
| Sources and Further Reading | Identify the approved source edition/sections, relevant public references, review date and editorial limitations. |

Use professional, direct instructions. Replace learner-facing “retrieval”, “oral recall”, “retrieve the essentials” and production-facing placeholders with the labels above. Keep stable internal question IDs and storage keys when polishing an existing lesson; they preserve learner history. Use British English consistently (organisation, fibre, colour, oesophagus, haematoxylin), except in exact source titles. Define abbreviations on first use. Preserve qualifiers and scientific distinctions when shortening prose.

## Assessment and explanations

- Define the knowledge or reasoning each question assesses. The stem must supply all necessary observations and constraints.
- Confirm one best answer under those constraints against the approved source. Write a concise explanation for that answer and every distractor.
- Use plausible alternatives reflecting real misconceptions. Avoid absurd distractors, answer-length cues, trivia, double negatives and unstated clinical assumptions.
- Application items should connect observations → mechanism → consequence. Identify hypothetical cases explicitly; never imply a real patient, specimen or measured dataset without evidence.
- Worked identification examples must distinguish family, subtype, cell type and organ. Two clues must be independent (for example, architecture plus matrix or nuclear pattern). Explain why a plausible alternative is less likely and what remains uncertain.
- Keep answers concealed until requested. Use native buttons, radio groups, fieldsets, legends and details/summary. Announce answer feedback with a status region. Keep keyboard operation and saved-answer behaviour working.
- `oralExamination` and `summaryChecklist` are optional validated fields in the native lesson schema. Use structured prompts/answers and one assessable task per checklist item. Surface them in both the lesson and revision collection.

## Visual source and publication decision

Inspect the source record, exact asset, rights, privacy and medical accuracy before selection. A private-site manifest, an approved-looking filename or inclusion in a STEM deck is not public publication clearance. Record unresolved candidates in the controlled archive, never in public content. Preserve originals; prepare separate derivatives only when cleared.

Prefer an existing individually released asset that teaches the intended point. Use an original CSS/SVG schematic when a diagram can accurately teach the relationship and publication is authorised. Identify it as an original schematic, disclose AI assistance where applicable, and name scientific references separately from image creators. Never present a generated image or schematic as genuine microscopy. If neither is appropriate, use a labelled placeholder with a useful observation task and state that no specimen image is supplied.

For repository-delivered images, register attribution, evidence, placement and responsive derivatives in the existing figure records; pin new binaries in `public-release.json`. Inline SVG teaching diagrams are source code rather than new public asset files: review them in Git, give them accessible names and captions, and document their placement and scientific review. Never place private archive paths, account links or access tokens in public records.

## Caption and alt-text format

Every teaching image or diagram must provide:

1. **Title:** the structure or relationship being taught.
2. **Caption:** the relevant anatomy/mechanism and how the visual represents it. State stain, orientation, specimen or source magnification only when verified. A screen size is not a calibrated scale bar.
3. **Observe and explain:** one purposeful task and the evidence the learner should examine; avoid merely saying “study the image”.
4. **Credit and rights:** creator/institution, licence or exact release evidence, modifications, and image-source link. For original schematics, state creator, schematic status, lack of scale and scientific references. Scientific references do not imply that their publishers created the artwork.
5. **Accessible equivalent:** meaningful alt text or SVG accessible name describing the educational relationship. Do not put essential labels only in pixels. Use visible HTML text for a longer explanation, abbreviations, legends and uncertainty.

Example: “Longitudinal skeletal muscle schematic. Repeated cross-lines indicate striations; nuclei lie at the fibre periphery. Observe the combined striation and nuclear pattern, then predict which evidence changes in transverse section. Original teaching schematic, Wardhan Medical Study Guide Studios; AI-assisted SVG, source-checked; not microscopy, not to scale. Scientific reference: [specific section].”

## Visual interface and performance

- Place visuals beside the relevant explanation or in a clearly navigable visual-study section. Do not add decorative anatomy unrelated to the learning objective.
- Use the existing design tokens, semantic heading order, generous spacing and responsive single-column fallbacks. At 320 CSS pixels and with enlarged text, preserve labels and avoid page-level horizontal scrolling.
- Use shape, position and text as well as colour. Check text contrast and meaningful graphical boundaries; do not encode an answer only with colour.
- Give raster images intrinsic dimensions, responsive `srcset`/`sizes`, lazy loading where appropriate, and proportional uncropped display. Load full-resolution files only when requested. Reuse cleared derivatives instead of duplicating files.
- Provide keyboard access, visible focus, meaningful names and focus return for image dialogs. Keep explanations accessible with native details/summary. Honour reduced motion; static diagrams need no animation.
- Captions, alt text and observation instructions must remain useful when images fail. Include an equivalent text explanation of any relationship required to answer a question.

## Scientific quality checklist

- [ ] Approved source record, edition and section checked; factual additions traceable to a source.
- [ ] No unsupported claims, invented citations, false affiliations, patient claims or publication rights.
- [ ] Objectives, explanations, visual tasks and assessments align without unnecessary repetition.
- [ ] Tissue/organ/cell distinctions, structure/function and normal/pathological distinctions preserved.
- [ ] Histology: matrix versus cells, orientation, stain limitations, CNS/PNS myelin and visible versus inferred features explicit.
- [ ] Anatomy: side, plane, orientation, relationships, variation and organ context clear.
- [ ] Physiology/biophysics: units, axes, sign conventions, assumptions and boundary conditions clear; illustrative models distinguished from measurements.
- [ ] Biochemistry/cell biology: compartments, reaction direction, enzymes, substrates/products and causal sequence checked.
- [ ] Genetics/immunology: gene/protein/cell terminology, inheritance or mechanism, context and uncertainty checked; no unsupported clinical efficacy claim.
- [ ] Each question has one verified best answer, plausible distractors and concise explanations; oral prompts have model responses.
- [ ] Every visual has approval, meaningful alternative text, caption, credit, source and observation task; generated material is labelled.
- [ ] Existing lessons, learner IDs and unrelated features preserved.
- [ ] Catalog/search/revision/figure registrations updated as necessary.
- [ ] `npm run content:check`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` and `npm run test:e2e` pass.
- [ ] Lesson route reviewed directly on desktop and mobile; keyboard, feedback, expanded content, image failure, source links and reduced motion checked. Run automated accessibility scanning when available and report its limits.
- [ ] Preview tied to the committed SHA and verified before requesting production review. Keep production unchanged until authorised.

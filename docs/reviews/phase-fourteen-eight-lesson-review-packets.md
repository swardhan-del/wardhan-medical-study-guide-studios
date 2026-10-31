# Phase 14: eight lesson review packets

Prepared for draft [PR #29](https://github.com/swardhan-del/wardhan-medical-study-guide-studios/pull/29) on `feat/phase-twelve-lesson-preview`. Documentation baseline: `a8b1c555a55e9225b1af5271a2671df873c3d3da`; the lesson content is unchanged from the Phase 13 checkpoint `e4b09f45c3b0e6dd8ff58fe6840292b0da3f30cc`.

**This is a review-preparation packet, NOT review evidence or clinical approval.** Its location under `docs/reviews/` does not make it a completed review. No reviewer is assigned, no qualification or approval is implied, and this packet must not be linked as release evidence. Independent clinical, visual-rights and human editorial/accessibility decisions remain pending.

Use the [ordered review queue](../PHASE_FOURTEEN_REVIEW_QUEUE.md), [Phase 13 source-consistency audit](../PHASE_THIRTEEN_SOURCE_CONSISTENCY_AUDIT.md), and [content quality pipeline](../CONTENT_QUALITY_PIPELINE.md). Review one route at a time on the exact PR #29 commit actually inspected; do not treat a moving branch name or an older preview as a version identifier.

## Route packets

The focus and high-risk checks below are instructions for qualified reviewers, not completed findings or approvals. Apply the shared checklist to every row.

| Order | Route | Review focus | Particular check to record |
| --- | --- | --- | --- |
| 1 | `/library/fluid-and-membrane-transport` | Permeability vs electrochemical driving force; channels/carriers; primary/secondary transport; osmolarity vs tonicity. | Check the stated concentration, charge, pressure and time assumptions; distinguish an available transport pathway from its driving force and avoid treating all osmoles as equally effective for tonicity. |
| 2 | `/library/membrane-potentials` | Voltage sign; equilibrium vs resting potential; passive cable assumptions; time/length constants. | Verify inside-minus-outside voltage, units and worked values. Cable calculations assume an ideal uniform cable without a nearby end boundary; check that the equations and captions retain this qualification. |
| 3 | `/library/biophysics-action-potentials` | Channel availability; refractoriness; local current; myelination; neuron vs ventricular models. | Check state transitions, recovery and propagation reasoning without imposing one universal action-potential waveform or refractory mechanism on different cell models. |
| 4 | `/library/synaptic-integration` | Calcium-triggered release; receptor effects; summation; shunting/reversal potential. | Passive synaptic summation is not the peak of a regenerative action potential. Check the example's stipulated sum separately from its threshold prediction, and review conductance/reversal-potential labels. |
| 5 | `/library/muscle-contraction` | End plate vs action potential; skeletal triad; ATP; skeletal/cardiac/smooth distinctions. | Isometric contraction means constant overall muscle length. Check that fixed load is not substituted for fixed length, and that coupling and calcium/ATP roles are qualified for the muscle type. |
| 6 | `/library/connective-tissue` | Cell–matrix identification; tissue-preparation limits; limits of text-only schematics. | A schematic cannot prove staining, protein expression, mineral density, or measured thermogenesis. Check captions, accessible descriptions and preparation limitations against what the layout actually shows. |
| 7 | `/library/somatosensory-pathways` | DCML vs anterolateral crossing; laterality; VPL/VPM; fictional-lesion boundary. | Trace the body/face relay and crossing sequence in each example. The somatosensory lesion example is fictional and not diagnostic advice; retain its stated assumptions and approximate sensory boundary. |
| 8 | `/library/genetics-genome-foundations` | Genome/reference/pangenome wording; inheritance assumptions; testing limits; VUS language. | `Aa × Aa` gives 25% affected and 50% carrier per pregnancy under stated assumptions; verify those assumptions rather than generalising the result. A VUS is not a clinical conclusion. Check reference diversity and test-scope limitations separately from individual variant interpretation. |

## Required checks for every packet

### Added haemostasis packet after the original eight

The haemostasis upgrade at `f9f95e43dec2f23787ec1ccf614da864472440d2` adds a ninth review target without changing the order above: `/library/blood-and-haemostasis`. Review endothelial nitric oxide/prostacyclin restraint; exposed matrix and immobilised vWF; GPIb-IX-V capture versus activated αIIbβ3–fibrinogen bridging (not an exclusive ligand map); thrombin, XIIIa and anticoagulant/fibrinolytic control. Check the exact keys and every alternative for `studio-apply-blood-endothelium-restraint` and `studio-apply-blood-adhesion-versus-aggregation`, as well as the preserved questions. Review the older short recap's narrower scope and the still-pending mechanism visual. The same version-bound return record and all shared checklists apply.

For the current technical findings, existing asset-permission scope and missing signed clinical evidence, see [technical readiness](../PHASE_FOURTEEN_TECHNICAL_READINESS.md). Neither that AI-assisted record nor a passing browser check completes this packet.

Keep these boxes uncompleted in this preparation document. Record actual review outcomes in separate version-bound notes, including anything not assessed.

- [ ] **Objectives and claims:** compare objectives, teaching steps, terminology, mechanisms and limitations with authoritative sources supporting the specific claims. Identify unsupported generalisations and differences between experimental models and human clinical conclusions.
- [ ] **Calculations:** independently recompute worked examples and question values; verify units, signs, equations, boundary conditions and hypothetical assumptions.
- [ ] **Answers and explanations:** inspect every knowledge/application question, answer key, option explanation and open-question model response. Check ambiguity, reasoning and consistency with the lesson. Use existing question IDs to locate findings.
- [ ] **Visual science and accessibility:** inspect every visual's labels, sequence, captions and alt text/accessibility descriptions, including text equivalents. Check consistency with the teaching text and limitations of schematic representation.
- [ ] **Source decisions:** check visible bibliography, supporting references and structured quality sources against the specific claim or visual. Record inaccessible or insufficient evidence; do not infer support from the existence of a URL alone.
- [ ] **Rights decisions:** separately document provenance, scientific suitability and commercial publication rights or original-work release decisions for each exact visual. Citations and source availability do not confer reproduction rights. Keep raw documents and unapproved STEM images private.
- [ ] **Editorial and accessibility decisions:** check clarity for a global student audience, mobile/enlarged-text legibility, keyboard/focus behaviour and human screen-reader use. Automated checks are not human accessibility approval.

## Version-bound return record

For each route and assessed scope, the reviewer must supply the lesson ID, full commit SHA, reviewer attribution, actual qualification, completion date, scope, findings and disposition required by the [queue's record template](../PHASE_FOURTEEN_REVIEW_QUEUE.md#required-version-bound-review-record). Include question/visual IDs and source locations where relevant. Record permission for public attribution and independence for clinical review; do not fabricate credentials or publish private correspondence.

Any later evidence linkage must use the existing schema and current content fingerprint. A completed note for one scope does not approve other scopes, other routes or later revisions. After a correction, the changed version must be re-reviewed, with unresolved findings retained explicitly.

## Release boundary

Keep `medical-review-pending`, `rights-review-pending`, `noindex-pending-review` and review-evidence fields unchanged until the required completed version-bound notes exist. Completion of the applicable review gates and explicit release authorisation are also required. Do not merge PR #29, deploy production or remove indexing gates as part of this documentation work. Lesson content, question IDs, answers, routes, saved notes/progress and visuals remain unchanged.

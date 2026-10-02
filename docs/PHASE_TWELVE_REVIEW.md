# Phase 12 — eight lesson adaptations for preview

Status: draft review only, 2 October 2026. **Do not merge or deploy this branch to production.** Independent clinical review, visual approval and the final release decision remain unresolved. The user's latest instruction authorises a draft PR and preview, superseding the earlier request to publish all eight immediately.

## Recovery and preservation

The stopped checkout was clean on `feat/phase-twelve-eight-lesson-adaptations` at `caba7ad1c1dccbcfd9e74ec9f898944f98c46397`. Current main matched it. The supplied first-batch mailbox patch passed `git apply --check` without overlap and was imported with `git am` on `feat/phase-twelve-lesson-preview` as `be10dfc28e8ae5eb38b13b6eccff2dea22dbfd26`. Its original source commit was `f2c0ecb14ba24c88c84d5b9bb09925abac7475a0`; the local imported commit has a different committer identity/time. The patch and private working notes were preserved.

The imported batch is a membrane-transport upgrade, not a completed Phase 12 release. This continuation retains its original question, three new questions and comparison. It adds the remaining seven topic drafts. All 241 previous lesson IDs and all 356 previous concept/studio/application question records are pinned by a preservation fixture and checked byte-equivalently after JSON normalisation. Existing correct-answer indices and option order are unchanged. Storage keys, progress code, existing routes, framework, package versions and public asset binaries are unchanged.

## Topic checklist

“Prepared” means original text, worked reasoning, explained practice, linked bibliography and accessible visual layouts are implemented for review. It does not mean medically approved or ready for production.

| Brief | Preview route | Prepared scope | Remaining topic-specific work |
| --- | --- | --- | --- |
| 01 Membrane transport | `/library/fluid-and-membrane-transport` | Five explanations, polarity/osmosis, worked pathway example, three new application questions, original transport comparison | Independent scientific/editorial and visual release review |
| 02 Resting/electrotonic potentials | `/library/membrane-potentials` | Recording sign, single-ion equilibrium versus resting state, conductance, passive time/distance equations, calculated tables, three questions | Independent check of signs, assumptions and table values; optional plotted traces beyond the accessible calculated tables |
| 03 Action potentials | `/library/biophysics-action-potentials` | Channel states, refractoriness, passive versus regenerated propagation, nodal versus ventricular distinctions, two visual comparisons, three questions | Independent waveform/channel-state review; optional quantitative trace after model selection |
| 04 Synaptic transmission | `/library/synaptic-integration` | Release/receptors/termination, electrical comparison, shunting and summation, original flow and comparison, three questions | Independent review of receptor/reversal-potential limits; plotted summation traces not supplied |
| 05 NMJ and skeletal coupling | `/library/muscle-contraction` | End-plate versus muscle action potential, triad/CaV1.1/RyR1, calcium/ATP/relaxation, compartment-labelled sequence, sarcomere comparison, three questions | Independent skeletal/cardiac comparison and visual review |
| 06 Supporting tissues | `/library/connective-tissue` | Connective tissue/cartilage/bone/white and brown adipose, two-clue worked identification, preparation limits, recognition table, three questions | No micrographs supplied; individual scientific/rights review is still needed before adding specimen images |
| 07 Somatosensory pathways | `/library/somatosensory-pathways` | One focused new lesson: body/face routes, crossings, VPL/VPM, thalamic integration, fictional T10 localisation, side-labelled flow and comparison, concept question plus three applications | Independent laterality, crossing and thalamic review; not a diagnostic protocol |
| 08 Genetics/genomics | `/library/genetics-genome-foundations` | Existing genome/expression/inheritance retained; variants, references/pangenome, testing scope and uncertainty added; original evidence comparison and three questions | Independent genetics review; no clinical variant-classification protocol, treatment or patient-specific testing advice |

Seven existing routes are expanded. The new somatosensory route fills a sequence gap: the spinal-cord, trigeminal and diencephalon lessons organise regional anatomy separately and do not coherently follow a modality from receptor through crossing to cortex. Those routes are retained and linked; their content is not duplicated wholesale. The new route is registered in the nervous-system collection, taxonomy and printable revision collection. There are 242 library lessons and eight renal lessons; this is a content count, not a review ledger.

The total addition is 24 explained application questions, one new concept question, and 13 original selectable-text visual layouts including the imported batch. The existing 148 public asset files and 12 released figures are unchanged. No new audio, video, commercial feature or raw-source route is created.

## Source-consistency work and limits

Public bibliographies appear in each lesson's About panel and source section. References are concept support, not permission to reproduce a publisher's text or artwork. New explanations are independently worded; numerical and localisation examples are explicitly hypothetical.

- Membrane pathways, osmosis and compartments: OpenStax *Anatomy and Physiology 2e*, §§3.1 and 26.1. Preserve the distinction between gradient and pathway, and between osmolarity and tonicity.
- Passive and active membrane signals: OpenStax §12.4; Alberts et al., *Molecular Biology of the Cell*, 4th edition, membrane electrical properties; Newman & Newman, *MetaNeuron* (2013), passive models. Rising and decaying exponentials are distinguished; units and model assumptions are explicit.
- Excitable cell differences: OpenStax §19.2. The new text separates ventricular working-cell sodium upstrokes/plateaux from nodal calcium-dependent upstrokes. It does not reuse the source intake's mixed cell-type heading.
- Synapses: OpenStax §12.5; Purves et al., *Neuroscience*, 2nd edition (2001), chemical synapses; experimental leak-conductance work in rat sympathetic neurons (2015). The experimental paper supports shunting principles, not a claim that all synapses behave identically.
- Skeletal coupling: OpenStax §§10.2–10.3 and the 2024 *Nature Communications* CaV1.1 voltage-sensor study. The explanation distinguishes T-tubule and SR membranes and does not substitute cardiac trigger-calcium coupling for skeletal coupling.
- Connective tissue/bone: OpenStax §§4.3 and 6.3; the 2016 *Nature* UCP1 thermogenesis study. Morphological clues are separated from protein/function measurements. No source micrograph is reproduced.
- Sensory pathways: OpenStax §14.2, Purves' dorsal-column/medial-lemniscal section, and experimental thalamic-reticular projection evidence. Spinal crossing is qualified as occurring over a few segments; VPL and VPM, body and face, and relay versus inhibitory modulation stay distinct.
- Genetics: NHGRI Gene, Human Genomic Variation and VUS resources; MedlinePlus inheritance probability and test interpretation pages. Detection, molecular effect and disease interpretation are separate. No ACMG/AMP classification algorithm is implemented or claimed to be current clinical guidance.

These were AI-assisted source-consistency checks, not independent qualified medical review. Public source pages and indexed source excerpts were consulted; some direct NCBI page requests presented a browser challenge. Foundational books are identified by their actual editions, not described as the newest edition. A human reviewer must resolve the final scientific judgement and source sufficiency before release.

## Quality and release gates

All eight explicit quality records use `medical-review-pending`, `explanations-complete`, `rights-review-pending` and `noindex-pending-review`. No clinical evidence record is created. The frozen Phase 11 compatibility baseline is unchanged. Noindex removes these drafts from the generated full-text index and sitemap; it is not access control. The route allowlist entry for the new lesson permits rendering in this review branch and does not record clinical or production approval.

- [x] Original adaptations, explained questions and validated lesson relationships prepared.
- [x] Raw sources and unreviewed image candidates excluded from Git, public paths and deployment tracing.
- [x] Existing question records, routes and progress identifiers preserved.
- [ ] Independent qualified clinical/scientific review of every adaptation and answer explanation.
- [ ] Independent visual scientific review and final rights/release approval for the exact layouts.
- [ ] Any requested specimen micrograph individually cleared, accurately captioned and responsively prepared; otherwise retain the explicit no-micrograph limitation.
- [ ] Human editorial sign-off and assistive-technology review beyond automated accessibility checks.
- [ ] Deliberate index/release decision and approved production release after all required checks pass.

The raw intake, extracted working text, supplied patch, asset candidates and populated conversion briefs remain in the ignored private layer. The existing approved-private curation models were consulted as the governing standard; no mismatched source edition or candidate asset has been marked cleared. Private approval and filenames do not confer public reproduction rights. Originals remain unchanged. Exact filenames, original hashes and per-brief working progress stay in the private queue rather than public lesson data.

Verification results, immutable implementation commit, PR and preview are recorded in `CODEX_HANDOFF.md` and the draft PR. Do not interpret this review document as approval to merge.

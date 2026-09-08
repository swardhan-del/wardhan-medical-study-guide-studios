# Interactive Thorax lesson

The Thorax card in `/subjects/anatomy/regional-anatomy` now links a fuller
regional explanation to a front-view chest schematic, six-structure
identification round, a diaphragm-position comparison, twelve questions with
per-option explanations, and four short-answer prompts with model answers and
self-assessment checklists. `/subjects/anatomy/thorax` links back to this activity.

The twelve questions replace the card's single recall question. Together with
the three other regional questions, the page's session total is fifteen.
The Thorax practice distinguishes correct, unanswered and needs-review states;
review collects the currently missed questions. Resetting Thorax practice leaves
other regions' answers intact. Correct responses, draft writing, diagram state
and self-checks survive switching regions on the same page. A reload starts a
new session. No answers are sent to a server or graded by AI.

## Content and image provenance

The curated `Volume_01_Thorax_Heart_Lungs_and_Mediastinum.docx` was read on
September 7, 2026. The source is the Volume I copy in the concept-library
curation folder. Coverage: Thoracic Wall Core Map, sternum and sternal angle;
diaphragm action and innervation; pleural layers; lung lobes; and mediastinal
boundaries/subdivisions. The learning JSON contains section locators and links
to OpenStax and NCBI Bookshelf references used to check relationships.

The interactive SVG is an original schematic drawn for the page. It is not
attributed to STEM Visualizer. It shows anatomical right on the viewer's left,
paired lungs and pleural outlines, the central mediastinum, tracheobronchial
branches, and the diaphragm. Shapes, spacing and organ proportions are
deliberately simplified and identified as such in the caption. The breathing
comparison changes only the diaphragm, isolating its descent during inspiration;
it is not a physiological simulation or a clinical imaging model.

The previously published mediastinal preview was inspected; its sternal-angle
label and transverse-plane line are not aligned. It was not reused in this
new activity. Original source documents and the existing asset were preserved.
No course manuscript, external illustration or private source bytes were added
to this change. Content-source checking is not independent academic review.

## Verification

`tests/thorax.test.mjs` checks the content contract, answer rationales,
references and diagram marker bounds. `tests/e2e/thorax.spec.ts` covers keyboard
selection, identification correction/completion/reset, diaphragm states, all
twelve answers, distractor feedback, mistake review, cross-topic retention,
scoped reset and short-answer models on desktop and mobile.

The Playwright match list now includes the existing `authored-guides` and
`histology-resources` suites as well as Thorax. Those two files had previously
been omitted by the project-level match expressions.

Work resumed in the sibling Dropbox checkout `.codex_work/study-site-thorax-2026-09-07`
at the verified remote commit `5ee8576`, after the original checkout's online-only
files delayed reads. Its three draft files were copied without overwriting;
the original checkout remains intact. Subsequent website work should verify the
current GitHub branch before selecting a checkout.

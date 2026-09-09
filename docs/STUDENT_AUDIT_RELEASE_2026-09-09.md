# First-time student audit: implementation

This release follows the 347-URL production experience audit from 9 September 2026. It changes the site; the previous audit preserved the site unchanged. It is an experience and implementation review, not independent medical peer review.

## Implemented

- F01: common question prefixes are removed for search; whole-token matching avoids finding `interaction` for `action`. Abbreviations and explicit typo suggestions remain.
- F02: Figures links only appear when the lesson has actual figures. Six original teaching diagrams explain replication, lens image formation, myelin organisation, CNS barriers, pyruvate/TCA carbon flow and secretory-protein traffic. Mobile diagrams have a contained, keyboard-accessible scroll area and an explicit instruction.
- F03: Histology II includes neurulation, myelin/glia and brain/CSF barriers.
- F04: every native lesson has an explicit learning aim, a subject vocabulary reminder and a linked preparation page. Seven foundation pages provide terms, a worked distinction and recall. Sequenced next-lesson links support continued learning. This does not turn all concise introductions into comprehensive chapters.
- F05: a deterministic presentation permutation varies quiz choice order without changing original question IDs, correct indices or saved choices. Nine weak distractor sets were revised. Printed answer letters use the same permutation. The bank still needs broader subject-expert question development.
- F06: homepage and Start here expose all 12 directory subjects with current availability; shared subsets are labelled. The map includes all 50 biophysics lessons and its next action leads to subject selection.
- F07: single-resource leaf topic cards open learning directly. Old topic URLs remain valid with a clear resource action. Three repeated parent/child labels are differentiated.
- F08: planner and oral-explanation entry points explicitly state their renal scope.
- F09: guided external real-slide exercises cover connective, muscle and nervous tissue. Specimens remain on the verified provider's website. The local image bank has not been expanded with unapproved material.
- F10: long headings wrap and mobile headings are compact; diagram layouts cannot widen the page.
- F11: printable subject notes include all authored worked examples, attached figures, new teaching diagrams and both application-question collections. Video clips remain short recaps with existing transcripts and captions.
- F12: unreleased microbiology and biostatistics remain explicitly unavailable, and coverage limits remain visible. Independent medical peer review is outside this release's scope.

## Remaining content work

More complete chapters and worked examples across the curriculum; a larger locally hosted, rights-cleared specimen collection; more sophisticated assessment banks; full microbiology and biostatistics courses; and independent subject review. These are not reported as completed by this implementation.

## Verification

The release is gated by content/privacy checks, unit tests, lint, TypeScript, production build and desktop/mobile/local-review browser tests. The post-deployment audit preserves one register row and desktop/mobile screenshots for every discovered public URL, with redirect destinations, missing anchors, media/asset results and remaining coverage observations. Evidence is stored in Dropbox under `audits/student-audit-release-2026-09-09/`; the previous audit remains intact.

Scientific references are linked with the new foundations, diagrams and external exercises. Existing source assets and private curation files are unchanged. Original answer indices remain the stored values, so existing progress imports and saved histories retain their meaning.

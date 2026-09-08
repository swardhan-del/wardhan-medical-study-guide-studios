# Student audit implementation — 6 September 2026

This release integrates the six-subject library at b3623ff and resolves the seven findings in the live student walkthrough.

1. Availability: subject cards use actual catalog counts. The subject directory shows released content instead of an empty collection claim.
2. Coverage: 39 authored and source-mapped lessons across all six medical sciences, plus the existing course and activities, produce 58 public catalog resources. Each subject has usable lessons and related links. These are learning units, not claims of complete syllabus coverage.
3. Discovery: library search matches title, summary, subject and tags; subject/format filters, direct topic links, pagination and recovery from empty search are supported.
4. Corrections: lesson-aware links open a draft form. The creator-approved public email in `src/content/studio.ts` is the destination. The learner prepares a mailto draft, reviews it in their email application and sends it themselves; the site sends no automatic message, stores no draft and claims no delivery receipt. Privacy text describes this flow. No message was sent during tests.
5. Nephron map: original SVG schematic separates red blood and blue tubular fluid; labels identify cortex, medulla and route segments. Recall toggle hides labels. Full-size labels can be scrolled on small screens without page overflow. It is simplified and not to scale; connecting tubule and the omitted vasa recta course are explained. Cross-check: NIDDK, Your Kidneys & How They Work, https://www.niddk.nih.gov/health-information/kidney-disease/kidneys-how-they-work (accessed 6 September 2026), plus the existing curated renal source referenced on the lesson. No third-party image was reproduced.
6. Saved learning: existing reading-list storage is preserved and shown inside My Study. Legacy /reading-list redirects to the saved section. Course, renal lessons and activities have save controls, as do catalog cards and cross-subject lessons. Removal and browser reload use the same stored IDs. Progress reset explicitly preserves bookmarks. Progress remains browser-local.
7. Practice evidence: Not started has no score bar; Needs review requires an incorrect latest answer; Practiced means attempted answers are correct. Bars use attempted questions as denominator, with remaining questions explicitly counted. This is not an exam-readiness or mastery claim.

Checks: unit/content gates, lint, production build and desktop/mobile student journeys. Browser tests cover cross-subject bookmarks and removal, legacy route continuity, status transitions, contextual correction drafts, diagram recall and page-width containment. Existing content and private-build gates remain enforced.

Source originals and private archives are excluded from the public release. No contact details were invented and no student feedback was sent.

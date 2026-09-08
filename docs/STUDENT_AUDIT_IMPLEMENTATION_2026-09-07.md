# Student audit implementation — 7 September 2026

Students can now keep practice across subjects, distinguish coverage from accuracy, and move from schematic histology to real microscope sections. This implements the follow-up student walkthrough without changing the original Dropbox manuscripts or opening their access permissions.

## Changes by finding

1. **Thoracic landmark correction.** The Thorax and Volume I previews use a new original orientation diagram. The sternal angle and T4–T5 disc are drawn on the same transverse plane. Organ positions and the inferior subdivisions are explicitly outside this diagram's scope. The old image URL permanently redirects to the replacement. Anatomical cross-check: [Texas Tech thoracic landmark tables](https://anatomy.ttuhscep.edu/cardiovascular_system/sup_med_tables.html).
2. **References by topic.** All 39 concept introductions have individual public further-reading references in `lesson-references.json`. The nitrogen lesson now links to nitrogenous waste handling; enzyme-assay material is used only for enzyme kinetics. These references supplement the existing named sections of the authored source guides. URL and page-title checks are not a claim of independent clinical review.
3. **Shared saved practice.** The registry connects renal quizzes, all concept checks, anatomy/Thorax questions, three histology cases, six ABG cases and new transfer questions to My study. Written answers and self-checks persist across reloads, including renal oral practice. Activity reviews return to the appropriate case or microscope section, retaining the visual or numerical context.
4. **Honest progress.** The map shows attempted topics by default, with a control to include unattempted topics. Coverage uses all questions as its denominator. Latest accuracy and recorded first-attempt accuracy are separate. A successful correction cannot erase the first result. Same-day, early or hint-assisted retries do not advance the review interval. Legacy renal records migrate without inventing first-attempt results when they cannot be recovered. No mastery or exam-readiness score is claimed.
5. **Lesson depth.** Short lessons are labeled concept introductions. Epithelia gains a worked example, a four-step visual sequence and transfer questions; nitrogen handling gains a worked mechanism and an additional application question. The other introductions retain their concise scope; they are not presented as complete textbook chapters.
6. **Real histology.** The visual sequence moves from a labeled original schematic, through label-free recall, to a real section and a different tissue for transfer. Two unchanged CC0 images from Berkshire Community College's Bioscience Image Library have visible provenance, original dimensions, source magnification and SHA-256 records in `visual-sources.json`. The renal detective also links to Yale's public slide collection for further renal identification practice. Epithelial classification exercises do not claim to validate renal diagnostic skill.
7. **Question quality.** The highlighted nitrogen, V2-receptor and mediastinal landmark distractors now address plausible conceptual confusions. A pelvic question tests anatomy instead of asking students to memorize volume numbers. Seven new questions explain every answer option.
8. **Learning before archive.** Public subject lessons now precede the authored guides and full Dropbox inventory. The larger directory is an explicit disclosure. Original folder destinations and access requirements remain intact.
9. **Learning routes.** Subject pages offer suggested sequences. The canonical Thorax page contains the rich chest activity directly, and regional-anatomy access remains compatible. Topic and case links support targeted return visits.
10. **Physiology experiments.** The renal circuit asks for a written prediction, a controlled slider experiment, a written explanation and two transfer checks. The model still separates flow from glomerular pressure and does not calculate GFR.

## Data and privacy

`wardhan-learning:v1` remains the browser key for compatibility; its validated data schema is version 2. Drafts are limited to known prompt IDs and 5,000 characters each. Written answers remain in the browser and are included in progress export/reset. Bookmark storage remains separate. The privacy page describes these changes. Storage failure still permits a temporary in-memory session.

## Verification

Verified on this release: **29 unit/content tests and 72 desktop, mobile and local-review browser tests passed**, together with lint, TypeScript, the production build and private-data trace checks. Desktop and mobile captures were inspected for the new microscope exercise and corrected thoracic plane. The upload preflight excludes `.env*`, the `.private` symlink itself and private directory contents.

To repeat: run `npm test`, `npm run lint`, `npm run typecheck`, `npm run build` and the desktop/mobile/local-review Playwright projects. New tests cover migration, first-attempt preservation, review scheduling, coverage denominators, image provenance, topic references, activity deep links, written-answer persistence, cross-subject review, responsive layouts and archive access. Original catalog, privacy and deployment-trace gates remain in force.

Medical content remains an AI-assisted educational adaptation with the independent-review status disclosed on the site. The release adds focused worked examples and visual practice, not a complete rewrite of every subject.

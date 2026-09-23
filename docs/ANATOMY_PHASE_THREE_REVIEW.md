# Anatomy foundations: Phase Three review

Baseline: merged Phase One and Phase Two, `3d3de1348d173af3ebf9f2b8a6cb4bbfefffa174`. Branch: `feat/phase-three-anatomy-foundations`. This release is for a pull request and preview; production promotion is not authorised by this task.

## Learning scope

The new `/library/anatomy-foundations` lesson establishes anatomical position, laterality, directional comparisons, body planes, section orientation, surface localisation, major body compartments, serous spaces, organ lumina and tissue-to-organ organisation. Eight connected explanations lead into a worked identification using independent orientation, regional and boundary clues. Seven knowledge questions and four application questions have one best answer and explanations for every alternative. Four oral examination prompts, an integrated spoken explanation and seven saved checklist items complete the lesson.

The visible course map on `/subjects/anatomy` and `/study/anatomy` begins with this lesson and continues into all five existing regional volumes. The 120 regional lessons remain separate from the new foundation. The homepage, searchable library, Start Here sequence, taxonomy, study map and printable revision collection expose the new lesson. The existing `/start/anatomy` refresher and every existing lesson route remain available.

## Scientific and editorial review

New prose, questions, worked cases and diagrams were authored for this task. The primary public reference already used by the short Anatomy orientation was extended with specific OpenStax chapters. Source record `anatomy-foundations-openstax` identifies this new editorial basis; no claim is made to have adapted an unread private guide.

| Content | Scientific reference checked on 23 September 2026 |
| --- | --- |
| Position, directions, planes, body cavities, quadrants, serous membranes | [OpenStax Anatomy and Physiology 2e, 1.6](https://openstax.org/books/anatomy-and-physiology-2e/pages/1-6-anatomical-terminology) |
| Levels of organisation | [OpenStax 1.2](https://openstax.org/books/anatomy-and-physiology-2e/pages/1-2-structural-organization-of-the-human-body) |
| Tissue families and composite membranes | [OpenStax 4.1](https://openstax.org/books/anatomy-and-physiology-2e/pages/4-1-types-of-tissues) |
| Pleural layers, potential space and lung relationships | [OpenStax 22.2](https://openstax.org/books/anatomy-and-physiology-2e/pages/22-2-the-lungs) |
| Tissue contributions in the stomach | [OpenStax 23.4](https://openstax.org/books/anatomy-and-physiology-2e/pages/23-4-the-stomach) |

The transverse-image question explicitly supplies viewing direction and the anterior marker; the learner is never expected to infer patient laterality from an unlabelled screen. Clinical examples are hypothetical anatomy exercises, not diagnostic or procedural instructions. Pleural cavity, lung/airway interior, mediastinum, abdominal compartment and peritoneal space remain distinct. The worked example states both its conclusion and the limits of the observations. AI-assisted source review is not independent clinical peer review.

## Visual decisions

The existing approved figure register contains regional thoracic-plane and abdominal-region graphics. Their specific regional teaching scope does not replace the foundation diagrams, so they remain in their current placements. No local/cloud deck, unverified image, textbook figure, raster image or microscopy image was copied. All 148 existing public asset release records remain unchanged.

Five figure groups contain nine original inline SVGs:

1. Anterior and lateral reference-position views (two drawings).
2. Median, coronal and transverse planes viewed edge-on (three drawings).
3. Posterior and anterior compartment maps (two drawings).
4. A simplified pleural interface (one drawing).
5. Tissue contributions to a stomach wall (one drawing).

Each group includes a title, meaningful SVG accessible names, a caption, an observation task, visible creator/AI-assistance disclosure and a scientific source link. Captions explicitly identify schematic status, lack of scale, omitted structures and exaggerated spaces. Labels and full HTML explanations provide equivalent relationships. No external image request or new browser dependency is required. Diagrams use text, outlines, position and dashed boundaries as well as colour.

## Reusable implementation and preservation

`FoundationsLessonContent` extracts the Phase Two section and assessment layout. Histology supplies the same wording, figures, links and identifiers through its existing wrapper; Anatomy supplies its own content. `PracticeQuestion`, `ConceptCheck`, `SavedRecall` and `SavedSelfCheck` retain the existing progress store and feedback patterns. Optional supporting references are rendered on the lesson and printable revision page.

The Anatomy generator now replaces only the 120 IDs that it owns rather than every lesson with subject `anatomy`. This prevents a generator run from deleting a standalone foundation lesson. It continues to verify the same five canonical volumes, manuscript files and question records. The five-volume introduction lists only its five volumes; the new foundation has a separate collection and print section.

A baseline comparison verified that all 236 existing lessons, 81 study questions, 12 transfer questions, 256 catalogue records, 244 taxonomy nodes, 26 study groups, 58 printable parts and 46 study-map groups were unchanged. Anatomy course/practice records and the public figure/provenance files retained exact bytes. Existing question and storage IDs were preserved.

## Validation

Run the repository content check, unit tests, typecheck, lint, production build and complete desktop/mobile/local-review browser suite. New regression tests cover course-map navigation, exact independently reviewed answer keys, concealed feedback, all answer explanations, saved responses, oral notes/checklist persistence, keyboard disclosures, 320-pixel layout, source links, labelled SVGs, text-only usability and printable content. Existing Histology browser coverage verifies the shared renderer extraction.

The final task report records the tested commit, exact results and matching preview. No preview or production success is inferred solely from a local build. Independent specialist review and supervised specimen/radiological teaching remain outside this release.

### Direct accessibility and visual review

Axe-core reported zero WCAG 2 A/AA and WCAG 2.1 AA violations on the foundation lesson and Anatomy hub at 1440, 390 and 320 CSS-pixel widths, with reduced motion enabled. Neither route had page-level horizontal overflow. The automated contrast rule left items for manual review; this is not a claim of complete accessibility conformance. All five figure groups were inspected in mobile screenshots. Diagram text contrast is at least 11.91:1 across its backgrounds, and the brown plane marks have 5.24:1 contrast against the body fill. Captions provide a full textual equivalent and distinguish schematic boundaries from anatomical partitions.

All five scientific-reference URLs returned HTTP 200 in a direct GET check. No third-party image bytes were fetched or published.

### Completed local validation

- Content validation: passed; 237 sourced lessons, 257 catalogue resources and 148 unchanged exact public assets.
- Unit tests: 57 passed, zero failures.
- Typecheck and lint: passed.
- Production build: passed; 605 generated pages, including rendered privacy and deployment-trace checks.
- Complete browser suite: 424 desktop, mobile and local-review tests passed, zero failures.
- Direct review: five figure groups, source links, professional headings, responsive layout, keyboard controls, saved progress and text-only usability verified.

Existing Node module-type and terminal-colour notices were non-failing environment/tooling warnings; no dependency or configuration changes were made to suppress them.

# Histology observation and review implementation

The first implementation batch helps learners write an explanation before comparing it with the worked answer, then apply the same observation method during the existing one-week review. It extends the released histology first session and preserves its lesson, question, image and review identities.

## Repository reconciliation

Baseline main is `86fec7440ff299a0dd76f1bf5104b0934a1a17d3`. The existing source checkout is preserved. Development takes place in a separate clone outside the source archive.

| Council priority | Existing work | Action in this batch |
| --- | --- | --- |
| Anatomy accuracy | Draft #109 contains pelvic, hand and brainstem corrections and supporting references. | Keep that work in its existing review branch. |
| Navigation | Draft #110 contains library pagination and navigation changes. | Keep the current entry URLs and reuse the existing first-session route. |
| Teaching depth | Draft #111 expands complement, haemostasis and the cardiac cycle. Histology foundations already has a worked example and explained questions. | Add a saved observation and comparison step to the histology session. |
| Visual reasoning | Draft #112 contains Anatomy Volume I diagrams. The released figure registry already supplies the cuboidal and squamous micrographs. | Reuse those image records and the existing enlargement control. |
| Educational validation | PRELAUNCH_CHECKLIST.md already defines beginner sessions, unseen application tasks and review requirements. | Supply a bounded specialist-review and learner-session package. |

Existing proposals remain separate. A file appearing in a draft PR does not establish that its change is live or approved. Compare the actual diff with main when integrating another batch.

## Source reconciliation

| Source or resource | Verified scope | Website use |
| --- | --- | --- |
| Authored source record `b88b1cbb1791f4a6`, Microscopic Anatomy and Embryology I–II, Professional Integrated Edition, Revision 4, 2 August 2026 | The controlled copy matches its recorded SHA-256 `c0ffba3a4e2a859ca986439c287a87ce83c4ed41928566b20a676355c936cb9e`. Relevant headings are Epithelial Tissue Characteristics and Epithelial Classification by Layer and Shape. | Existing foundations explanation, observed cell boundaries, layer classification and surface shape. |
| Controlled histology foundations concept review | Polarity, layers, supporting tissue, section geometry and limits of slide inference are already mapped to existing lessons and question IDs. | Reuse the existing epithelial question and visual context. |
| OpenStax Anatomy and Physiology 2e, section 4.2 | Apical and basal surfaces, classification by layers and surface-cell shape, and the distinction between simple and stratified epithelium. | Public supporting reference already used by the foundations lesson. |
| `cuboidal-section` and `squamous-section` | Existing cleared Berkshire Community College CC0 micrographs, captions, image derivatives and source links. | Initial observation and the existing one-week review respectively. |

The historical manifest's original-document locator is unavailable locally. The controlled curated copy was read and its recorded content hash verified. This identifies the edition used here without making a claim about every source copy or the latest manuscript. Full private locators and integrity evidence remain outside tracked files.

## Code design

1. Extend the existing first-session content record with an optional observation guide. Histology supplies a prompt for its weekly image, three comparison criteria, and separate stable draft IDs for the initial and weekly explanations.
2. Render the initial guide through the existing `/learn/first-session/histology` page before its worked explanation and checkpoint. Keep the figure's attribution, accessible description and enlargement controls available.
3. Use one small `ObservationNotes` component in the initial session and one-week review. It composes `SavedRecall` with a native disclosure containing the comparison criteria. These criteria support self-review. Only the existing checkpoint records an assessed attempt.
4. Register the two new draft IDs through `practice-registry.ts` and regenerate the compact learning registry. The existing learning store, parser, progress export and merge functions continue to handle persistence. Separate IDs retain the initial explanation while the learner writes a later one.
5. Render the weekly observation only when the existing weekly review is open and available. Keep the existing 24-hour and one-week schedule and question IDs.

## Files

| File | Change |
| --- | --- |
| `src/content/first-study-sessions.ts` | Optional observation guide and histology content. |
| `src/components/observation-notes.tsx` | Shared saved-writing and criteria disclosure. |
| `src/app/learn/first-session/[subject]/page.tsx` | Initial observation placement. |
| `src/components/first-session-review.tsx` | Separate written explanation beside the weekly figure. |
| `src/content/practice-registry.ts` | Register new draft IDs. |
| `src/content/learning-registry.json` | Generated draft allowlist. |
| `tests/e2e/first-visit.spec.ts` | Initial and delayed writing, persistence, export/import and storage-failure coverage. |
| `docs/HISTOLOGY_PILOT_REVIEW_2026-11-19.md` | Specialist-review scope and learner protocol. |

## Acceptance

- Initial writing and weekly writing survive reload and progress export/import independently.
- Writing and opening comparison criteria leave existing quiz scores and completion records unchanged.
- Existing first-session answers still schedule the existing follow-up questions.
- Keyboard, 320-pixel width, enlarged text, unavailable storage and image descriptions remain usable.
- Public asset hashes, existing lesson and question IDs, and publication/review flags retain their baseline values.
- Required content, unit, type, lint, build and browser checks run against the final implementation.
- Specialist sign-off and learner outcomes remain outstanding until actual review and sessions occur.

## Subsequent batches

Review the accuracy draft first, then integrate the independently useful navigation and depth changes in their dependency order. Expand the observation guide to another subject only after its source, task and comparison criteria are reconciled. Use real specialist feedback and learner observations to choose the next change.

## Validation record

Content and publication-boundary checks, all 175 unit tests, type checking, lint and the production build passed. Ten focused desktop/mobile checks passed for saved explanations, export/import, unavailable storage and the existing review schedule. Direct visual inspection at 1440 and 390 pixels led to a spacing refinement. Native comparison disclosures also worked with JavaScript disabled.

The selected controlled source and curation files retain their recorded SHA-256 values, and the original checkout remains clean. No source archive mutation was performed. The complete browser suite and commit-matched preview results are recorded in the draft pull request.

The baseline Next.js dependency has two moderate npm audit findings. The high-severity production dependency gate passes. The build initially displayed the framework's security advisory notice and passed on retry. This batch retains the baseline dependency versions; dependency remediation remains separate from the histology changes.

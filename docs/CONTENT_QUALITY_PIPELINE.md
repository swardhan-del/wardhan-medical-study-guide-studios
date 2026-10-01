# Content quality and source-to-lesson pipeline

Phase 11 introduces a shared quality record for the existing native library and renal lesson formats. It does not publish a new lesson, import a source manuscript, complete a medical review, or confer rights on an asset. This is a global medical-science learning platform; local course terminology in source filenames is not the intended audience or a claim of institutional affiliation.

## Authoritative records

- `src/lib/content-quality-types.ts`: schema for public-safe lesson metadata and review evidence.
- `src/content/lesson-quality.json`: opt-in quality records keyed by the existing lesson ID. Renal records use the catalog ID `renal-<slug>`; routes, quiz IDs and saved-progress IDs are unchanged.
- `src/content/lesson-review-evidence.json`: scoped evidence referencing committed, public-safe review notes in `docs/reviews/`. Include reviewer attribution/qualification with permission, independence for clinical review, date and the SHA-256 of the current adapted content. Do not publish personal contact details or raw review correspondence.
- `src/lib/quality-lessons.ts`: adapters for the 241 library lessons and eight renal lessons, multiple-choice answers and open-question model responses.
- `src/content/lesson-quality-legacy.json`: **frozen compatibility baseline**, taken from main `f2c807b1ff302b413572b62b1f3be4a6617b756e`. It is not a review ledger and does not mark the lessons reviewed. Do not regenerate it to make a changed lesson pass validation.

The sidecar model preserves all existing teaching JSON. Missing records use existing objectives and valid lesson relationships, show review metadata as unrecorded, and preserve legacy index eligibility. A new or substantively changed lesson must receive an explicit quality record. Its content fingerprint includes teaching text and associated questions. Changing an answer explanation without changing the lesson date still invalidates the legacy exemption and previous review evidence.

A record contains the lesson ID, matching title/subject/slug, topic, learner level, objectives, public bibliographic source records, content/visual/assessment/accessibility/readability/index statuses, review dates, limitations, evidence IDs, and prerequisite/related/compare/next ID arrays. See the TypeScript type for the exact enums. Empty arrays, pending statuses and null dates are allowed for a nonindexable draft. Required fields cannot be silently omitted.

## Index and review decisions

An explicitly indexable lesson needs sources with publisher/author, URL or citation and access date; objectives; a non-draft content status; current editorial evidence; valid answers with explanations for every option and model responses for open questions; a completed visual decision; evidenced accessibility/readability checks; review dates; and limitations. `medical-review-pending` can be indexable after these editorial checks, but must say clearly that independent clinical review is incomplete. It is never a substitute for clinical review evidence.

`independently-clinically-reviewed`, `reviewed` assessments, and `approved-and-published` visuals require the corresponding evidence. Visual evidence must describe the scientific check, exact published assets, rights/release decision and accessible equivalents; the established figure/public-release validators remain authoritative for asset approval. Source citations describe provenance and support; they do not assert a licence to reproduce source text or illustrations.

Dates and evidence must refer to the current version. Due reviews appear in the report; reaching a review date does not silently remove an existing lesson. A reviewer decides the appropriate update or explicit noindex status. A syntactically complete record cannot establish medical truth or legal clearance: accountable human review is still required.

`noindex-pending-review` and `noindex` records remove the lesson from indexable metadata, the sitemap, and generated full-text search entries. Existing route handling stays intact. **Noindex is not privacy**: only public-safe adapted content may enter `src/content` or public lesson routes. Draft manuscripts and briefs stay outside those trees.

## Conversion workflow

1. Inventory intake privately with filenames, byte sizes and SHA-256; preserve originals. Locate the corresponding curation-model and approved-private-manifest records. An unmatched newer edition remains unapproved; an older approved edition does not clear it.
2. Select one private conversion brief. Compare its scope with existing lessons before proposing a route. Prefer a justified upgrade or consolidation; avoid duplicate search pages.
3. Verify primary references, edition/section and scientific claims. Record access dates from actual checks. Write a new student-facing explanation with measurable objectives, prerequisites and explicit scope limits. Never copy raw source pages into public content.
4. Prepare original or individually right-cleared web visuals. Inspect scientific accuracy, labels, orientation, caption, alt text, rights evidence and responsive behaviour. Register approved assets in the established figure/release models. Private STEM candidates are not publication permission.
5. Author aligned knowledge checks and application questions, one best answer with plausible alternatives, and explanations for every option. Preserve existing question IDs and answer positions during upgrades.
6. Add a draft quality record and validate target lesson IDs. Use `noindex-pending-review` until the editorial, visual, assessment, accessibility and readability gates have evidence. Record outstanding medical review honestly.
7. Run the complete content, unit, lint, type, build and browser checks. Review the actual diff and preview. Publish only under the authorised PR/release process.

## Commands and reports

`npm run content:quality` writes a readable Markdown report and machine-readable JSON to ignored `output/phase-eleven/`. It reports indexable lessons, medical review pending, planned/rights-pending visuals, unrecorded visual status, missing explained questions, overdue or undated reviews, metadata gaps, and orphaned/weakly linked lessons. It rejects private paths in public content, raw Office files in deployable content, tracked private input and missing deployment exclusions.

`npm run content:check` and the production `prebuild` include the quality command, so the existing CI and Vercel build both enforce it. `npm run content:library` regenerates catalog/search data. Neither command reads the private intake. CI can run from a clean clone without private sources.

## First private conversion queue

The eight briefs and hashed source inventory live only in the ignored private conversion queue. Public documentation lists the intended teaching scopes, not raw file locations or source text:

1. Cell membrane transport and permeability.
2. Resting membrane potential and electrotonic potentials.
3. Action potentials in excitable cells.
4. Synaptic transmission.
5. Neuromuscular junction and skeletal-muscle excitation–contraction coupling.
6. Connective tissue, cartilage, bone and adipose tissue.
7. Somatosensory pathways and thalamic integration.
8. Genetics and genomics foundations.

Each brief records actual source files, audience, scope, visual needs, references to verify, proposed questions, existing prerequisite/related routes, proposed next briefs and publication blockers. These are planning records, not completed scientific reviews or new public lessons. Future workers need access to the preserved local private queue; it is deliberately absent from GitHub and Vercel.

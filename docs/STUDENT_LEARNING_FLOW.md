# Student learning flow — Phase Six

## Scope and content integrity

Built from main after Phase Three. The unmerged Phase Four/Five branches are not dependencies. All existing public lesson text, question identifiers, answer keys and released assets remain unchanged. This phase adds the journey around the shared library lesson renderer, retaining the specialist renal and subject activities. The existing renal course also records resume positions and uses the shared home/My Study return card; its original completion and practice controls are preserved.

The five student actions are **Choose subject → Start free lesson → Practice → Review summary → Continue learning**. Homepage, Start Here, Library and My Study provide entry and return links. Each library lesson exposes the same explanation, practice, summary and recommendation controls. Recommendations use the existing beginner sequence first, then the subject topic order, then the subject hub. They are editorial suggestions, not personalised medical advice.

## Local progress contract

Reuse `wardhan-learning:v1`, with the existing version 2 payload. Optional fields:

- `resume`: recognised lesson identifier, stage (`learn`, `practice`, `summary`) and local timestamp. No URLs, identities or scroll recordings.
- `journey`: recognised lesson identifiers mapped to explanation-reviewed, summary-reviewed, summary-saved booleans and a timestamp.

The existing `lessons` array holds explicitly marked completions. Opening a lesson never completes it. The progress indicator describes three study actions: explanation reviewed, at least one answer checked, summary reviewed. Completion requires all three plus the student's explicit action. Undoing an explanation or summary review reopens the lesson. Completion does not imply full question coverage, correctness, mastery or examination readiness. Mistakes and unanswered questions remain visible in the existing practice dashboard.

Resume records an opened lesson, a chosen section, a checked answer or a visible summary. It restores a section, not an exact scroll position. Saved summaries store only identifiers and render the current approved recap (`recall.answer`); they never duplicate editable source content in browser storage. Existing Histology/Anatomy checklist identifiers and written drafts are unchanged.

Version 1 and older version 2 records still parse. Unknown identifiers, invalid stages and malformed fields are discarded. Export/import includes the new fields; the newer timestamp wins for resume and journey entries (including summary removals). Cross-tab storage events refresh the UI. Clear learning progress removes resume, completions, saved summaries and answers while retaining separately managed resource bookmarks. Blocked/full browser storage falls back to the current tab's memory with a visible notice; there is no server fallback or automatic sync. Browser clearing/private browsing can remove data.

## Privacy

Progress, summaries, answers, filters and drafts require no sign-in and are not uploaded. Analytics is off by default even if the deployment enables the analytics feature. Its script is mounted only after the browser's explicit Allow analytics preference; Do Not Track / Global Privacy Control override that preference. Existing opt-outs persist. Hosting still processes requests needed to deliver pages, as explained on Privacy.

## Library, mobile and keyboard behaviour

Reuse the catalog's text search, subject/format filters and empty states. The added lesson-progress filter combines with them; it excludes non-lesson resources when selected. Clearing filters returns focus to search. The mobile primary navigation uses visible links in a three-column grid with 44 px minimum targets. Journey controls use native buttons, links, progress elements, named regions and text labels, with no colour-only states or animation. Errors/404s offer Library and My Study recovery links without clearing browser data.

## Starter pack publication

`/starter-pack` and `/starter-pack/download` generate the same body from the seven existing `studyPaths` entry lessons. The download is a self-contained **HTML document**, explicitly labelled as such; it opens offline and supports browser Print / Save as PDF. No pre-generated PDF, user export, source manuscript, third-party image or private Dropbox content is included.

`src/lib/starter-pack.ts` selects only the approved public `library-lessons.json` records. It preserves the published summary, oral prompt/recap, one question and its verified answer explanation, plus source titles/sections and further-reading links from existing records. Question letters in the pack use the displayed, original option order. The web quiz's shuffled order is independent. Both editions use the same scoped CSS, including print typography and page breaks. Scientific prose is not newly authored by this phase. Content changes automatically flow to both editions during a build. All interpolated text is HTML-escaped. The downloadable edition embeds its own CSS, has no scripts or external assets, and requires network access only when a reader opens a lesson/reference link. It is a sampler, with the existing editorial-review limitation disclosed.

## Validation

Unit tests cover legacy migration, identifier/field validation, progress versus mastery, export/import merge rules, safe resume anchors, the seven starter selections, unchanged answers and self-contained escaped download markup. Browser tests cover a complete student journey, reload, cross-tab updates, export/import/reset, blocked/corrupt storage, combined library filters, offline download/print layout, keyboard navigation, default analytics privacy and 404 recovery. Axe checks the full homepage, Start Here, library lesson, My Study, Library and starter-pack pages at desktop and mobile sizes. Existing content validation and the complete regression suite remain required.

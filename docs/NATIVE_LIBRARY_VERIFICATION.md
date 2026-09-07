# Native library verification

Baseline: swardhan-del/wardhan-medical-study-guide-studios, feat/curated-study-library at cc02a695145ed205e51fe95b08507b7a5ffa727c. Implementation branch: feat/native-library-navigation. The linked Vercel project is prj_hmL4Mgj5zTsHGekOgy9hT8hWgJxD. This change requests a preview, not production promotion.

## Publication reconciliation

The public release ledger pins the 58 previously released resource IDs and all nine baseline public assets, plus the 15 explicitly reviewed image derivatives in FIGURE_PLACEMENTS.md by SHA-256 and byte count. The separate 44-item approved-private manifest is not public authorization; none of those source files were copied. The public-approved archive area was empty. Historical release documents support retaining existing web adaptations and licensed illustrations. Originals remain untouched. Raw directory listings and Dropbox URLs have been removed from the current public source tree; Git history has not been rewritten.

## Checks

- Production webpack build and TypeScript: 181 generated routes.
- Unit tests: 29 passed.
- ESLint and taxonomy/catalog/release checks passed.
- Browser suite: 61 of 70 initially passed. After fixing stale URL expectations and navigation waits, all nine failed cases passed on rerun. Desktop and 390-pixel mobile covered native library/subject/system/topic/resource journeys, PDF viewing and downloads, route/asset crawling, legacy lessons, search/filter/pagination, quizzes and private-review exclusion.
- Axe WCAG A/AA checks: 16 page/viewport combinations, zero violations; no horizontal overflow.
- Actual VideoPlayer component with synthetic media: playback, seek, speed, captions, transcript timestamps, fullscreen, no autoplay and conservative loading passed at 1440 and 390 pixels. This is not an archive-video approval or playback claim.
- Deployment trace and rendered-output checks reject private fixtures, source paths and Dropbox links. A Windows trace-exclusion edge case was detected with the local review fixture present and corrected with an exact catalog exclusion in addition to the directory pattern.

## Video intake and remaining work

A case-insensitive inventory found 37 video paths across the medical archive and curation area; copies are included, so this is not a unique-video count. Four copied candidates have intake traceability, including three approximately 5.6 MB files and one approximately 3.42 GB recording. These remain candidates, not approved releases. Private filenames and source locations are intentionally not included here.

Three small candidates could not produce media metadata during bounded FFmpeg reads (20 seconds each). Dropbox confirmed metadata for two files, but Dash content/media inspection was unavailable because the account has no Dash license. A refined scan found three automated-transcript Markdown documents and no standalone VTT/SRT files, after rejecting 50 filename matches to molecular transcription material. Transcript-to-video correspondence and embedded caption tracks remain unverified. Actual frame content, duration, captions, medical review, ownership and topic mapping remain unverified. File hydration or local media access must be resolved before content-based classification. Filename-only categorization was not published.

There are zero published archive videos. Completion requires actual-media inspection, explicit public/rights/privacy and medical review, verified topic/lesson mappings, corrected captions/transcripts, approved derivatives, and a stable video delivery host with byte-range and cross-origin caption support. No host was purchased or provisioned. See VIDEO_PUBLICATION.md for the exact schema and workflow.

## Limits

Browser checks used Chromium desktop/mobile emulation, not physical iOS/Safari devices. A future custom domain still needs DNS/Vercel configuration; internal navigation and local asset URLs are origin-relative. Deploy the reviewed branch to preview and record its commit and URL in the pull request before considering production promotion.

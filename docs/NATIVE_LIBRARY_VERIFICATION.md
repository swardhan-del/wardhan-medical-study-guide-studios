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

## Verified Vercel preview, 2026-09-08

The clean Vercel build for d599c5ade98392931f625bcf43b83096d5587dcd completed successfully, including all content/figure gates and the postbuild deployment-trace and rendered privacy checks. The Windows-local final build had failed on a Dropbox filesystem read after compilation and generation; it is not represented as a completed build. An initial cloud build caught a CRLF/LF mismatch in the SVG release ledger. The ledger now pins canonical Git bytes and .gitattributes forces LF for SVG, without changing the image content or archive original.

Preview: https://wardhan-medical-study-guide-studios-jg9wdkt62.vercel.app (Vercel authentication is enabled). Pull request: https://github.com/swardhan-del/wardhan-medical-study-guide-studios/pull/2. This task has not promoted production.

Authenticated browser verification passed all eight targeted desktop/mobile cases: complete category/topic/resource and PDF download journeys; filtered lesson navigation and breadcrumbs; all native subject/topic/resource routes; private/unknown 404s; figure keyboard opening, focus containment/return, Escape close, zoom, full image loading and download. The route crawl ran once on desktop; the mobile crawl case intentionally reuses that coverage.

Axe checks passed 22 page/viewport combinations plus the open image dialog at two widths, with zero WCAG A/AA violations. No page horizontal overflow was found. Chromium desktop and mobile emulation were used; physical Safari/iOS testing remains outside this verification.

Use playwright.preview.config.ts with CHECK_BASE_URL to repeat native-navigation/figure tests against a preview. For protected previews, obtain authorized access first and set PREVIEW_STORAGE_STATE to an ignored local Playwright storage-state file. Never commit auth state, temporary share parameters or cookies. scripts/check-accessibility.mjs accepts the same variables and rejects redirects to an authentication page. Vercel authentication screens were excluded from the website accessibility results.

All 15 new image derivatives passed metadata and proportion checks. The four reviewed figures total about 3.9 MB across all responsive variants; source originals remain preserved. The video controls were verified with synthetic media, and zero archive videos play on this preview. Three 20-second source probes timed out; three automated-transcript documents were located, but content reads failed locally and through the connector. Duration, scientific content, caption correspondence and AI provenance therefore remain unverified for the archive candidates.

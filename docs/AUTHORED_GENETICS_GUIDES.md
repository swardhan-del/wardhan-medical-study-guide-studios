# Authored genetics and immunology resources — superseded

**Status: historical.** The feature this document originally described was removed from the site on 2026-09-08 (commit `325bd34`, "Build native approved library with educational figures and video infrastructure") as part of a repository-wide privacy policy change, documented in [NATIVE_LIBRARY.md](NATIVE_LIBRARY.md): *"Candidate file records and private account navigation URLs have been removed from the current source tree."* This page is kept for historical reference and to explain why `src/content/authored-guides.json` currently contains an empty `records` array rather than the five entries described below — that emptying was a deliberate, policy-driven removal, not data loss or an accident, and it should not be reversed by restoring the old records.

## What existed before 2026-09-08

Between 2026-09-07 and 2026-09-08, the Genetics and Immunology subject pages briefly surfaced five selected study collections sourced from the site owner's private Dropbox archive, each described in `src/content/authored-guides.json` with a title, edition, topic list, and one or more **account-scoped Dropbox preview URLs** (`dropbox.com/preview/...?role=personal`). The five collections were:

- An integrated Medical Genetics & Immunology I study guide (DOCX)
- An illustrated immunology addendum (PDF)
- A 200-question genetics & immunology practice set (PDF)
- A focused complement/inflammation/serology/HAE guide (Markdown)
- A companion 32-question active-recall set with a separate answer key (Markdown)

The rendering component (`src/components/authored-guides.tsx`) was deleted in the same commit that emptied the data file, so no code path currently reads or displays this data even if the records were restored.

## Why it was removed

Account-scoped Dropbox preview URLs are still real, working links into a private archive — "account-scoped" limits who can use them, but it does not make them safe to publish in a public git repository or a public website's shipped data. The 2026-09-08 commit replaced this pattern site-wide with the policy now documented in `NATIVE_LIBRARY.md`: public content must be either (a) natively authored lesson text checked into `library-lessons.json` and rendered by the site itself, or (b) an explicitly reviewed, hash-pinned file copied into `public/` and listed in `public-release.json` — never a live link into the private archive, expiring or not.

## What replaced it

The genetics/immunology subject pages now surface content the native way: as ordinary lessons in `src/content/library-lessons.json` (`subject: "genetics"`), rendered through the same `CatalogBrowser` component used for every other subject. As of this writing that covers 8 lessons spanning both genetics (meiosis/nondisjunction, inheritance patterns and penetrance, genetic testing method selection, conditional-probability carrier-risk reasoning) and immunology (innate vs. adaptive immunity, MHC/antigen presentation, complement, the four hypersensitivity mechanisms) — reviewed for medical accuracy in `reviews/medical-accuracy/2026-09-10-medical-accuracy-audit.md` §2, with zero errors found. This is a smaller set than the five retired guides covered, but it is native, public-safe, and does not depend on the private archive being reachable to render correctly.

The `<span id="authored-guides" />` anchor and the `.authored-guides` / `.histology-overview` CSS rules that remain in `src/app/subjects/[slug]/page.tsx` and `src/app/globals.css` are leftover, harmless artifacts of the old feature (an anchor ID kept for link compatibility, unused styling) — not evidence the feature is still active.

## What was intentionally not done in this reconciliation

Per the explicit instruction under which this reconciliation was written: no private Dropbox links were re-added anywhere in this repository, and no new or invented metadata was substituted for the removed records. If the site owner wants the five original collections (or their successors) represented on the public site again, the correct path — per `NATIVE_LIBRARY.md` step 4 — is to make an explicit, per-edition public-release decision for each document (review it, decide what may be published, and either write it up as native lesson content or copy an approved file into `public/` with a recorded hash), not to restore live archive links.

## Superseded checks

The unit/browser test descriptions in the original version of this document (file-extension validation, account-scoped URL structure checks, the `authored-guides`/`histology-resources` Playwright suites referenced in `THORAX_INTERACTIVE_LESSON.md`) described tests for the now-deleted `authored-guides.tsx` component and are no longer applicable. Whether those specific test files still exist and still pass was not verified as part of this reconciliation and is out of scope for a medical-content review.

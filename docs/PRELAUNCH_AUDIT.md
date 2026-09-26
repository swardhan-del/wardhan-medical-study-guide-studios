# Phase Ten audit scope and findings

Baseline: `e86352ac8a5c90869abe5b474c1e550f779bd843`, the deployed main branch containing Phases One–Three. The Phase Four–Nine PRs were open at inspection. This report describes the baseline and bounded improvements, not approval to launch their combined future state.

## Coverage and limits

The production-build inventory discovers static pages, fixed dynamic pages and the five existing regional anatomy routes; redirects retain their destinations. The baseline contained **598 public page URLs**. Every URL returned HTTP 200, all internal destinations and anchor IDs resolved, and titles, descriptions, headings and image geometry were checked. After scoping the loading boundary, 20 legacy aliases correctly return HTTP 307 with their existing destination, rather than an HTTP 200 streamed redirect; all 578 rendered pages return HTTP 200. Redirect headers and destinations are validated rather than treating aliases as empty lessons. Private curation routes are excluded and remain protected by the existing tests.

Existing content validation covers every released lesson's source record, source section, question answer key, alternative explanations, related links, release eligibility and exact approved asset hashes. The rendered audit checks student-facing headings for awkward terminology. Guide and lesson navigation now use “oral examination practice”; printable question labels use “Knowledge Check”. Scientific lesson wording, reference dates, question IDs and approved assets are preserved.

This is an engineering and editorial audit, with representative manual reading and visual inspection. It is **not a line-by-line independent medical review of all scientific claims**. Source attribution does not establish correctness or current clinical applicability. No resource receives a new peer-reviewed label.

## Content still awaiting independent review

**All public teaching content is pending**, including:

- All 237 authored library lessons and their worked examples, answer keys and explanations (`src/content/library-lessons.json`, associated study/transfer questions and Anatomy practice index).
- The eight renal lessons, renal challenge, acid–base exercises, haemodynamic models and oral prompts.
- Seven introductory foundation pages, the short Anatomy orientation, five regional Anatomy routes and the musculoskeletal collection.
- All original diagrams, licensed micrographs in their teaching context, identification activities, audio/video recaps, printable revision pages and the renal revision PDF.

The public footer and About page now make this scope explicit, including the medical-advice and official-course-material limitations. A reviewer must record their name/qualification, review date, exact content version, sources checked, questions/figures checked, corrections and unresolved scope. Clinical examples and numerical interpretation need priority. Existing source/publication approval is retained; it is not relabelled as clinical review.

## External links

The baseline contained 128 unique external HTTPS links: **94 reachable, zero confirmed 404/410, 34 requiring manual checks**. The unresolved set comprises 30 NCBI Bookshelf links, one PubMed link, two Wikimedia Commons image records and one Texas Tech anatomy link. Automated HTTP 200 browser challenges are classified as unresolved, not successful source verification.

The exact URLs and HTTP outcomes are in `PRELAUNCH_EXTERNAL_LINKS.json`. A successful request proves reachability only, not medical relevance, image rights or an independent scientific review. Existing image rights/provenance records and all 148 approved public asset hashes remain the authority; no new media was published.

## Implemented improvements

- Separated browser-local progress identifiers from the full teaching/question registry, with a generated manifest and exact-parity regression tests. Existing saved answers, notes and summary IDs survive unchanged.
- Extracted the save control from the catalogue browser so saving a lesson no longer imports catalogue filtering and taxonomy code.
- Kept the existing system fonts: no font download, external font service or font-swap layout shift was introduced.
- Retained responsive, dimensioned, lazy-loaded approved figures. Added visible preview/full-size failure descriptions while keeping captions and credits available, and explicit modal focus return.
- Improved save-control loading-state contrast, disclosure/textarea focus indicators, prose-source link visibility, skip-link focus destination and reduced-motion animation behaviour.
- Disabled the old automatic production analytics switch. Consent-based analytics remains a Phase Nine integration dependency; no provider settings were changed.
- Gave recap and question components distinct React keys to prevent duplicate recap cards after client-side navigation.
- Scoped the streaming loading screen to interactive practice routes; ordinary lessons render their teaching text even with JavaScript disabled.
- Repaired the existing accessibility command's reliance on an untracked local axe installation by using the versioned Playwright/axe dependencies.

## Performance evidence

Before/after figures sum distinct initial external JavaScript chunks referenced by the production HTML and gzip each chunk with Node's default compression. They exclude HTML/RSC, later navigation/prefetch and lazy requests; they are **bundle budgets, not Core Web Vitals measurements**.

| Route | Baseline gzip bytes | After gzip bytes |
| --- | ---: | ---: |
| Homepage | 202,417 | 180,810 |
| Anatomy foundations | 501,355 | 208,407 |
| Histology foundations | 501,355 | 208,407 |

The flagship reduction is approximately 58%. Full question-bank review on My Study still loads 523,983 gzip bytes of JavaScript and the searchable library includes about 805 kB of uncompressed HTML/RSC data. These remain performance risks for slow connections; neither is hidden by the lesson budget. Future changes should load review content on demand and measure real navigation latency without transmitting private progress. Public entry points and lessons have a 300 KiB initial-JavaScript budget in the regression gate. Recalculate these figures after final integration because shared chunks can change.

There is no field-data claim for LCP, INP or CLS. After the canonical domain receives sufficient traffic, review the 75th-percentile mobile/desktop measurements; Google's good thresholds are LCP ≤2.5 s, INP ≤200 ms and CLS ≤0.1. [Core Web Vitals guidance](https://web.dev/articles/vitals). A fast local build or reduced bundle is not proof of passing these field metrics.

## Validation and release decision

The final PR report records the tested commit, complete test results and matching hosted preview. New tests cover all public HTTP routes/internal anchors, mobile overflow/runtime failures, explicit review status, payload budgets, keyboard navigation, persisted answers/summaries, failed images, JavaScript-disabled reading and absent legacy analytics/font requests. Automated axe checks cover 25 representative routes and templates on desktop and a 320-pixel viewport; a real screen-reader review remains a launch action.

Use [PRELAUNCH_CHECKLIST.md](PRELAUNCH_CHECKLIST.md) for the owner decisions. A passing technical gate permits review of this PR. It does not clear the clinical, legal, integration, domain or provider gates, and it does not authorise a merge or production release.

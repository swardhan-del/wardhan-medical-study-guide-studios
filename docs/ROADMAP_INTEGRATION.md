# Roadmap integration record

The owner authorised normal merges and production deployment of the completed free Study Guide roadmap on 26 September 2026. Phase Three (PR #19, merge `e86352a`) was already in main. Integrate #20 (subject paths), #21 (visual standard), #22 (local learning flow), #23 (waitlist), #24 (search), #25 (consented measurement), then #26 (quality gate). Unrelated membership PRs #15 and #16 are excluded. No branch is deleted, history rewritten or payment feature introduced.

Each originally independent branch receives its earlier dependencies through normal merge commits. Re-run CI after integration changes and merge only passing current heads. PR #26 must have successful GitHub validation before its normal merge. The final production deployment must report that final main SHA, READY state and the public alias.

## Reconciled boundaries

- The four new foundation lessons use the shared visual wrapper, complete text equivalents, observations and original source credits. The visual audit covers all 261 catalogue resources, including 241 authored lessons.
- Keep the complete online and offline starter pack, plus the optional waitlist invitation. Its explanations, questions and answer key are generated from the current approved public entry lessons.
- Preserve local progress, completion, saved recaps, cross-tab updates and transfer. A generated compact identifier-to-lesson map supports question-based resume without bundling question text into every lesson.
- Preserve search metadata, structured data, topic guides and indexing exclusions. Add the actual starter-pack, waitlist and terms routes; confirmation/utility pages remain noindex.
- Remove the legacy automatic analytics SDK. The optional provider-neutral adapter requires configuration and explicit consent. Connect success-only recap/download/waitlist hooks; demo results, failed downloads and failed storage do not count as successful conversions.
- Preserve shared image captions and fallbacks alongside keyboard focus return, reduced motion, no-JavaScript reading and the full quality gate. Every phase's regression suite remains enabled.

## Preservation and checks

Compared with main before integration, all 237 existing lesson records, 87 existing study questions, 16 existing application-question records and all public asset bytes are identical. Additions from Phase Four bring the catalogue to 241 authored lessons, 91 study questions and 24 application-question records. Validation also verifies all approved asset hashes and source/release records.

The build discovers 618 public page URLs. Run the content, unit, type, lint, production-build and complete browser gates on the integrated head. Browser coverage includes all public routes, 320-pixel layout, consent and payload safety, storage failures, offline downloads, metadata, image failures, question explanations and all subject entry paths. The hosted release suite repeats the critical student journey and verifies demo/disabled provider state. Exact CI run and deployment identities are reported with the completed release rather than inferred from local success.

## Human launch gates remain open

**Independent clinical peer review has not been completed for any teaching resource**, including all 241 authored lessons, renal teaching and clinical examples, diagrams, questions, recaps and printable resources. Source checking and tests do not confer peer-review status.

The owner still needs clinical/subject review with recorded edition sign-off; privacy/terms and recipient/retention review; custom-domain and canonical-host configuration; Search Console verification and sitemap submission; and live waitlist sender, double opt-in, spam-protection and unsubscribe testing before enabling real signup. Only `GOOGLE_SITE_VERIFICATION` was present in production at integration inspection; no measurement or waitlist credentials were configured. Its presence does not prove Search Console verification.

Analytics remains off and signup remains an explicitly labelled demo until those integrations are configured. The previously documented 34 source links requiring manual verification remain human checks; no new claim of external-link or clinical certification is made. Real assistive-technology review and field Core Web Vitals also remain open. My Study still loads the full practice bank; ordinary lesson bundles remain subject to the 300 KiB gzip gate.

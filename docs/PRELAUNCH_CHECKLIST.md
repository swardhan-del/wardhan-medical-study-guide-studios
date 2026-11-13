# Pre-launch decision checklist

## Current decision and pilot gate — 9 November 2026

The reorganisation is not a completed launch. Use small reviewed pull requests and inspect their exact Vercel previews. **Do not automatically merge or deploy production.** Preserve the existing Vercel hostname, publication allowlist, content identities and saved progress. A custom domain is optional and is not a prerequisite or authorised purchase.

| Current gate | Evidence required | Status at this navigation increment |
| --- | --- | --- |
| Canonical source structure | Existing checkout, stable source/lesson crosswalk, retained history and remotely verified curation delivery. | Reconciliation evidence remains in the existing controlled report. Pending delivery must not be labelled complete. |
| Navigation | Three entry modes, distinct subject subsets, working first lessons and explicit incomplete coverage. | Implemented locally; record executed checks and exact preview separately. |
| Teaching and independent review | Each improved lesson has assessable objectives, verified source edition, reviewed explanation/answer/figure scope and named qualified reviewer sign-off. | Independent subject-specialist review remains outstanding. Navigation changes do not confer scientific approval. |
| Beginner usability | Real first-year participants attempt navigation and unseen application questions without coaching, using the protocol below. | No sessions or measured success rates yet. |
| Technical preservation | Content, unit, type, lint, build, browser and privacy checks; stable lesson/question IDs, asset bytes and progress compatibility. | Record actual executions against the final code. Never infer a pass from this checklist. |
| Release decision | Reviewed PR, exact protected preview, unresolved limitations and rollback evidence. | No new merge or production deployment authorised by this plan. |

### Beginner session protocol

Use the existing controlled improvement backlog and consolidated report for evidence. Do not publish participant names, notes or assessment responses in Git. Obtain participants' consent, use anonymous session IDs and record prior subject familiarity, device and accessibility needs where relevant. Do not recruit or contact people automatically.

1. A subject-specialist reviewer defines the intended starting lesson(s), measurable concept objectives, previously unseen application questions and a scoring rubric **before** sessions. Keep these assessment answers away from participants until their first attempt is complete. Do not reuse the lesson's displayed quiz as an unseen outcome measure.
2. From the homepage, ask the participant to find a beginner lesson about membrane transport, tissue identification or enzyme kinetics. Give no path or menu hints. Record chosen links, steps, elapsed time, wrong turns, requests for help and eventual destination. Define a successful unassisted destination in advance; report assisted and abandoned tasks separately.
3. Let the participant study the full explanation, visual and worked example, then complete the existing checkpoint. Record misconceptions and confusing language. Let them use a different entry mode to locate an unfamiliar concept and locate examination practice.
4. Ask the unseen application question without opening the lesson answer. Have the reviewer score the first attempt against the prespecified rubric; record which reasoning criterion was missed. Keep retries separate. Record whether the participant understands the feedback and can continue, return and resume saved progress.
5. Test all three pathways with real first-year students and include mobile and keyboard-only use. Keep a session count and separate denominators by pathway and task. Store anonymous findings in the existing backlog, referencing canonical lesson IDs and observed issues. Fix navigation or reviewed teaching gaps, then repeat affected tasks with unseen items.

The owner's **proposed** acceptance targets are at least **90%** finding their intended starting lesson without help and at least **80%** correctly explaining/applying the concept after study. Report raw numerators and denominators alongside percentages, exclusions and uncertainty. A tiny convenience sample, AI simulation or automated browser run does not establish these population targets. Sample size and sampling limitations need agreement before acceptance. Until real sessions and independent review are complete, label the pathways **awaiting educational validation**, even if technical tests pass.

## Historical launch checklist — September 2026

The following rows preserve the earlier integration record. Their permissions, counts, commit, provider observations and domain assumptions are historical; use the current decision above and fresh evidence for any new action.

**Decision: not ready for an unrestricted public launch.** This quality gate now includes the authorised integration of roadmap PRs #20–26, retaining Phase Three already in main. Technical checks do not establish clinical accuracy, legal approval, a working mailing list or search indexing. Merge only after the updated PR heads pass CI, then verify the final main SHA on production. No membership, payment or charging work is included.

| Gate | Required evidence before launch | Current disposition |
| --- | --- | --- |
| Release integration | Review and integrate the intended free curriculum, visual, student-flow, waitlist, search and consent changes, then rerun the complete gate on the resulting main commit. | Dependency order is #20 → #21 → #22 → #23 → #24 → #25 → #26. Integration commits preserve each original branch and combine progress, privacy, source notices and configuration; the final deployment must match the merged main SHA. |
| Independent clinical peer review | Qualified subject reviewers sign off exact lesson/question/figure editions, record corrections, date, scope and reviewer credentials. Prioritise acid–base interpretation, renal physiology, anatomical laterality, neuroanatomy and embryology. | **Outstanding for every public teaching resource.** See the review scope in PRELAUNCH_AUDIT.md and the public About notice. AI assistance, source checks and passing answer-key tests are not peer review. |
| Domain and HTTPS | Owner chooses the canonical domain, adds it to this Vercel project and applies Vercel's displayed DNS records. Verify HTTPS, preferred-host redirects and every canonical/share URL; set `NEXT_PUBLIC_SITE_URL` to that HTTPS origin. | No DNS or domain change was made. The generated Vercel domain is the verified baseline. [Vercel domain instructions](https://vercel.com/docs/domains/working-with-domains/add-a-domain). |
| Production configuration | Project `prj_hmL4Mgj5zTsHGekOgy9hT8hWgJxD`, production branch main, Node 24, `npm run build`; keep `LOCAL_CURATION_REVIEW` unset and preview deployment protection enabled. Verify the deployed SHA and critical routes before promotion. | Read-only inspection confirmed these project/build settings and production `e86352a`. No production settings are changed by integration; GitHub merges trigger normal production deployments. |
| Search Console and sitemap | After domain connection, owner verifies the Domain property using Google's DNS record (or the correct URL-prefix verification method), submits `https://<canonical-domain>/sitemap.xml`, and inspects representative lesson URLs. Check canonical host, robots, noindex exclusions and sitemap after the search PR is integrated. | A production `GOOGLE_SITE_VERIFICATION` variable exists; its presence does **not** prove Google ownership verification, sitemap acceptance or indexing. No Search Console action was performed. [Google setup guidance](https://developers.google.com/search/docs/monitor-debug/search-console-start). |
| Analytics | Review the integrated consent-based layer. Set server-only `MEASUREMENT_PROVIDER=http`, `MEASUREMENT_ENDPOINT`, `MEASUREMENT_TOKEN`, `MEASUREMENT_RECIPIENT_NAME`, `MEASUREMENT_PRIVACY_URL` and policy version only for an approved recipient. Verify refusal, withdrawal, privacy signals, no history upload and no events in previews. | No provider credentials are configured. The old SDK is removed; missing configuration keeps the consent-based layer off. Do not revive `NEXT_PUBLIC_LEARNING_ANALYTICS`. |
| Waitlist | Verify provider processing/retention, sender/domain, double opt-in, failure handling and spam protection. Its current contract uses `WAITLIST_MODE=brevo`, `WAITLIST_ORIGIN`, `BREVO_API_KEY`, `BREVO_WAITLIST_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`, `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. Test with an owner-controlled address. | The integrated form and terms are available. No credentials were found in the inspected project. Keep demo mode honest; never claim mail delivery from a demo response. |
| Privacy, terms and disclaimer | Owner obtains an appropriate review of the actual deployed notice, provider recipients, local storage, consent, deletion/contact process and educational disclaimer. Check the terms route after PR #23 is integrated. | The integrated notices explain clinical-review status, local study storage, waitlist demo mode and optional consent-based measurement. This is not legal sign-off. |
| External sources and rights | Resolve manual-check links, verify topic relevance and attribution, and retain recorded public asset approvals. Changes to source editions or image bytes require a new review. | No confirmed 404/410 in 128 unique links; 34 require manual review. No asset bytes, rights statements, question IDs or scientific lesson text were changed. |
| Accessibility and performance | Pass the repeatable tests below, inspect mobile screenshots and run a real assistive-technology review with a student. After release, check field performance on the canonical domain. | Automated checks cover common failure modes, not all assistive technologies or real-world Core Web Vitals. No field-performance pass is claimed. |
| Owner release decision | Record the reviewed commit, unresolved limitations, rollout/rollback plan and approval. Recheck production after the authorised merge/deploy. | The owner has authorised normal roadmap merges and production deployment once CI passes. This authorisation does not complete independent clinical, legal, domain or provider launch gates. |

## Repeatable technical gate

```sh
npm ci
npm run content:check
npm test
npm run typecheck
npm run lint
npm audit --omit=dev --audit-level=high
npm run build
npm run test:e2e
```

The browser suite includes the entire public-route inventory, narrow-screen geometry, source-status disclosures and JavaScript budgets, plus key student journeys and axe checks. The build also verifies the compact progress registry. `node scripts/check-accessibility.mjs` runs the focused accessibility subset using installed dependencies.

For a separate link review, start the production build locally on port 3105 and run:

```sh
CHECK_BASE_URL=http://127.0.0.1:3105 AUDIT_LAYOUT=1 npm run audit:public
npm run audit:links
```

Reports are written under ignored `.private/prelaunch/`; Playwright attaches its route report in test results. External checks are intentionally separate from CI: bot challenges and provider outages require investigation, not invented replacement citations.

Verify the exact PR SHA is READY on its protected Vercel preview. Use authenticated `vercel curl` for the homepage, both flagship lessons, a quiz, the privacy/about pages, robots and sitemap. Preserve preview protection and noindex. Before activating providers, separately test the real waitlist delivery and analytics recipient with owner-controlled test data. Demo responses and mocked tests do not establish provider delivery.

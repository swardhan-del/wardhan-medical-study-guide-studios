# Pre-launch decision checklist

**Decision: not ready for an unrestricted public launch.** This quality-gate branch starts from main `e86352a`. Technical checks do not establish clinical accuracy, legal approval, a working mailing list or search indexing. Keep the PR unmerged until reviewed. No membership, payment or charging work is included.

| Gate | Required evidence before launch | Current disposition |
| --- | --- | --- |
| Release integration | Review and integrate the intended free curriculum, visual, student-flow, waitlist, search and consent changes, then rerun the complete gate on the resulting main commit. | Phases Four–Nine remain separate PRs #20–25; none was imported or merged here. Resolve overlaps in progress, privacy, source notices and configuration deliberately. |
| Independent clinical peer review | Qualified subject reviewers sign off exact lesson/question/figure editions, record corrections, date, scope and reviewer credentials. Prioritise acid–base interpretation, renal physiology, anatomical laterality, neuroanatomy and embryology. | **Outstanding for every public teaching resource.** See the review scope in PRELAUNCH_AUDIT.md and the public About notice. AI assistance, source checks and passing answer-key tests are not peer review. |
| Domain and HTTPS | Owner chooses the canonical domain, adds it to this Vercel project and applies Vercel's displayed DNS records. Verify HTTPS, preferred-host redirects and every canonical/share URL; set `NEXT_PUBLIC_SITE_URL` to that HTTPS origin. | No DNS or domain change was made. The generated Vercel domain is the verified baseline. [Vercel domain instructions](https://vercel.com/docs/domains/working-with-domains/add-a-domain). |
| Production configuration | Project `prj_hmL4Mgj5zTsHGekOgy9hT8hWgJxD`, production branch main, Node 24, `npm run build`; keep `LOCAL_CURATION_REVIEW` unset and preview deployment protection enabled. Verify the deployed SHA and critical routes before promotion. | Read-only inspection confirmed these project/build settings and production `e86352a`. No production settings or deployments changed. |
| Search Console and sitemap | After domain connection, owner verifies the Domain property using Google's DNS record (or the correct URL-prefix verification method), submits `https://<canonical-domain>/sitemap.xml`, and inspects representative lesson URLs. Check canonical host, robots, noindex exclusions and sitemap after the search PR is integrated. | A production `GOOGLE_SITE_VERIFICATION` variable exists; its presence does **not** prove Google ownership verification, sitemap acceptance or indexing. No Search Console action was performed. [Google setup guidance](https://developers.google.com/search/docs/monitor-debug/search-console-start). |
| Analytics | Integrate and review Phase Nine. Set server-only `MEASUREMENT_PROVIDER=http`, `MEASUREMENT_ENDPOINT`, `MEASUREMENT_TOKEN`, `MEASUREMENT_RECIPIENT_NAME`, `MEASUREMENT_PRIVACY_URL` and policy version only for an approved recipient. Verify refusal, withdrawal, privacy signals, no history upload and no events in previews. | No provider credentials are configured. This branch disables the older automatic opt-out integration. Keep it off until consent-based measurement is integrated and tested. Do not revive `NEXT_PUBLIC_LEARNING_ANALYTICS`. |
| Waitlist | Integrate Phase Seven and verify provider processing/retention, sender/domain, double opt-in, failure handling and spam protection. Its current contract uses `WAITLIST_MODE=brevo`, `WAITLIST_ORIGIN`, `BREVO_API_KEY`, `BREVO_WAITLIST_LIST_ID`, `BREVO_DOI_TEMPLATE_ID`, `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. Test with an owner-controlled address. | Form/terms implementation remains in PR #23, not main. No credentials were found in the inspected project. Keep demo mode honest; never claim mail delivery from a demo response. |
| Privacy, terms and disclaimer | Owner obtains an appropriate review of the actual deployed notice, provider recipients, local storage, consent, deletion/contact process and educational disclaimer. Check the terms route after PR #23 is integrated. | This branch explains clinical-review status and disables legacy analytics. It is not a legal sign-off. No terms page or live waitlist exists on this baseline. |
| External sources and rights | Resolve manual-check links, verify topic relevance and attribution, and retain recorded public asset approvals. Changes to source editions or image bytes require a new review. | No confirmed 404/410 in 128 unique links; 34 require manual review. No asset bytes, rights statements, question IDs or scientific lesson text were changed. |
| Accessibility and performance | Pass the repeatable tests below, inspect mobile screenshots and run a real assistive-technology review with a student. After release, check field performance on the canonical domain. | Automated checks cover common failure modes, not all assistive technologies or real-world Core Web Vitals. No field-performance pass is claimed. |
| Owner release decision | Record the reviewed commit, unresolved limitations, rollout/rollback plan and approval. Recheck production after the authorised merge/deploy. | **Not authorised by this task.** PR and preview only. |

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

Verify the exact PR SHA is READY on its protected Vercel preview. Use authenticated `vercel curl` for the homepage, both flagship lessons, a quiz, the privacy/about pages, robots and sitemap. Preserve preview protection and noindex. After later integration, separately test the waitlist's real success path and analytics consent; they cannot be certified from this main baseline.

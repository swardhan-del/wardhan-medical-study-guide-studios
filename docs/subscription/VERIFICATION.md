# Verification — 19 September 2026

## Executed locally

| Check | Result |
| --- | --- |
| Clean dependency install | Passed; no dependency/version changes |
| `npm test` | 88 passed, 0 failed, including 39 new membership unit/adapter/delivery tests |
| `npm run lint` | Passed after correcting three reserved-variable lint findings |
| `npm run build` | Passed, including existing source/release checks and new static exposure checks |
| `npm run typecheck` | Passed after correcting a TypeScript discriminated-union declaration |
| Existing E2E cases | All 404 passed in the combined 432-case run |
| New membership E2E cases | All 28 passed across focused runs on the corrected implementation/test expectations, as detailed below |
| `npm audit --omit=dev --audit-level=high` | 0 vulnerabilities |
| Staged whitespace/privacy checks | Passed; no `.private`, source teaching records, public assets, documents or certificates added |
| Visual review | Desktop 1440px and mobile 390px membership page inspected; no horizontal overflow. Mobile verified Basic dashboard and locked deeper module inspected. |

Exact browser-run sequence: the initial combined run had **424 passes and 8 new-case failures**. Four failures came from manually supplied test cookies being dropped on Next's RSC redirect; the tests now request the observed `?_rsc` endpoint directly. Two failures caught the app's same-origin cookie-clearing check using Next's internal hostname; it now validates the request Host and uses a relative redirect. Two failures were an incorrect HTTP-404 expectation for a streamed `notFound` page. The focused 28-case rerun had **26 passes and 2 test-expectation failures** because the streamed response carries a framework 404 marker instead of the human-readable heading. Correcting that assertion and rerunning only those two cases produced **2 passes**. There is no claim of one clean 432/432 run locally. Previously passing unrelated tests were not rerun.

Protected routes return no body/asset for anonymous, forged, Basic-on-deeper, expired, revoked, past-due, mismatched-identity and unavailable/slow verification. Valid synthetic Basic and Advanced accounts receive only explicitly granted synthetic modules. Tests cover direct asset GET/HEAD, range requests without entitlement, cookie clearing, cache headers, RSC, guessed IDs and static URLs. Postbuild checks inspected public assets, browser chunks, rendered HTML/RSC and the prerender manifest; no pilot payload marker entered those public surfaces and no member/account route was prerendered.

## Deployment boundary

Before push, the existing project was confirmed as `prj_hmL4Mgj5zTsHGekOgy9hT8hWgJxD` with authenticated Git previews, production branch `main`, and no membership provider environment variables. No hosting setting or secret was changed. The production alias pointed to `dpl_52m1LE3W7xt2eA4aFyUrq1AkNDFg`; the PR #14 production deployment remained canceled. A feature-branch push can create only the normal synthetic preview, not an approved production release.

Remote CI and exact preview checks occur after the commit/push; their authoritative results are in the PR and task report. Local results alone do not establish deployed provider integration.

## Not executed or claimed

Real account enrolment/recovery/provider logout, real entitlement database or private object storage, payment-provider test-mode events, renewals/refunds, live charges, a migration of existing public material and production release. Their missing inputs, exact extension files and acceptance criteria are in `HANDOFF.md`, `FOUNDATION.md` and `BILLING_DESIGN.md`. Billing scenarios there are proposed tests, not passing test evidence.

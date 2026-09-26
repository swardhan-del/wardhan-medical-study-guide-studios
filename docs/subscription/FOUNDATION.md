# Subscription foundation — 19 September 2026

Status: preparatory code and synthetic content only; enrolment and billing remain closed.

## Verified starting point and bounded change

Remote main was `16bd49374c25b22432e828f5f6ea5cf283d4be16` (merged PR #14). No newer main commit or open PR was found. Its two validation jobs and Vercel preview passed; the previously reported 404 E2E count was not independently rerun at that baseline. The production alias still points to `dpl_52m1LE3W7xt2eA4aFyUrq1AkNDFg` / commit `7995f5bfc318956168d0573c956c2f351191b755`. The automatic deployment of #14 is canceled.

The existing site has content generation, public catalogue/search, static lessons, browser-local progress, tests and deployment privacy checks. It has no account provider, entitlement database, billing integration or private media service. The Vercel environment inventory contains only the production search-verification variable. The exact local Revision 3 subscription plan was read without copying it into Git. The original Dropbox checkout has a Git-object read error and was preserved; work uses a fresh clone outside Dropbox.

This change adds `/membership`, `/account`, `/member`, two synthetic module pages and two protected synthetic download IDs. It retains all existing lesson identifiers, learning order, content and public routes. It adds no medical teaching material. The original public policy gap therefore remains until the separately approved migration in `EXPOSURE_AND_MIGRATION.md`.

## What is implemented

- Public membership copy explaining Basic, Advanced and a possible future Complete tier, with no invented price or commercial allocation.
- Member navigation: Dashboard, My modules, Downloads and tools, Account and membership. The dashboard has membership status, module availability, a continue-learning area and download/tool guidance. Cross-device progress is explicitly not connected.
- Async server cookie integration in `src/server/membership.ts`. The cookie is an opaque session identifier, never a tier claim. No login form, session issuer, test-cookie bypass, checkout or payment success endpoint ships in the application.
- A server-to-server verifier adapter in `src/lib/membership/provider.ts`: fixed HTTPS origin, authenticated POST, no cache, no redirects, three-second timeout, strict response parsing and no error details returned to users.
- `src/lib/membership/access.ts` checks session expiry, recent verification (30 seconds maximum, five seconds clock tolerance), matching account identity, active membership, paid-through expiry, supported tier and explicit module grants. Advanced does not automatically include Basic. The deeper synthetic module additionally requires Advanced. Unknown modules are denied.
- `src/server/member-content.ts` is a server-only data boundary. It checks access before returning a synthetic body. Downloads repeat authorization on every request, use an allowlist instead of request-controlled file paths, set private/no-store headers and never publish an underlying asset URL.
- Downloads return 401 for no session, 403 for insufficient/expired/inactive access, 503 when verification or storage fails, and 404 for unknown assets. HTML/RSC pages show a safe locked shell; their HTTP status may be 200, but they contain no protected body or download. All member/account responses prohibit caching and indexing.
- Browser-session clearing is an origin-checked POST with a secure HttpOnly cookie deletion. It is deliberately labelled “Clear this browser session”, not provider-wide logout.
- Build assertions reject pilot payloads in public files, generated HTML/RSC and browser bundles and reject prerendered member pages. This complements server authorization; it is not itself the paywall.

## Exact external integration contract

No existing provider was found or newly approved. This boundary is provider-neutral so an approved managed identity/database provider can be integrated without changing product routes. **The verifier endpoint below does not exist yet.** Do not describe the foundation as working customer sign-in or a live paid platform.

Server-only environment values, unset by default:

```
MEMBERSHIP_VERIFIER_ORIGIN=https://approved-verifier-origin.example
MEMBERSHIP_VERIFIER_API_KEY=<at least 32 characters; secret manager value>
```

The approved provider adapter must accept `POST /v1/session/verify` with `Authorization: Bearer <service credential>` and JSON `{ "sessionToken": "<opaque cookie value>" }`. Do not log tokens or response bodies. The service must validate the session against its authoritative account store and read the current entitlement record, not simply echo claims or renew a stale snapshot. Return `200 application/json` with either `{ "state": "anonymous" }` for an invalid session or this shape:

```json
{
  "checkedAt": "2026-09-19T14:00:00.000Z",
  "session": {
    "userId": "provider-account-id",
    "expiresAt": "2026-09-19T15:00:00.000Z"
  },
  "membership": {
    "userId": "provider-account-id",
    "tier": "basic",
    "status": "active",
    "validUntil": "2026-10-19T14:00:00.000Z",
    "moduleIds": ["synthetic-foundation"]
  }
}
```

These dates and grants illustrate schema only. The adapter permits `active`, `expired`, `revoked`, `past_due`, `canceled`; only `active` with future `validUntil` grants access. A service-level 401 is an unavailable verification service, not proof of an anonymous account. No trial/grace period or Complete allocation has been approved. Model scheduled end-of-period cancellation as still active until the paid-through time; a terminal canceled record denies access.

Select an approved authentication SDK before implementing enrolment/sign-in and a same-origin callback. It must validate provider issuer/audience and OAuth state/PKCE/nonce where applicable, resist session fixation, rotate and revoke sessions, and issue `__Host-wardhan-session` with Secure, HttpOnly, SameSite=Lax, Path=/ and no Domain. The opaque value must be 32–512 URL-safe characters. Add CSRF and return-URL allowlists for all account mutations. The current cookie-clearing endpoint is not global session revocation. Account support and recovery must use the selected provider's real flows.

The synthetic download store is deliberately in server-only code. **It is not private object storage and must never receive real manuscripts.** Once a private storage account is approved, replace the two synthetic lookups in `src/server/member-content.ts` with an authorization-adjacent private reader using opaque asset IDs and fixed server-side keys. Prefer streaming through the authorized route for the pilot. For larger video/range delivery, separately review short-lived audience-bound tokens, CDN cache behavior, range requests and revocation limits. Keep real content, binaries and source/rights manifests outside this public repository and its history.

## Verification commands

```
npm ci
npm test
npm run lint
npm run build
npm run typecheck
npm run test:e2e
npm audit --omit=dev --audit-level=high
```

The E2E suite starts an isolated HTTPS verifier fixture and a separate Next server on port 3103; the existing suites use 3101 and 3102. `tests/fixtures/membership-server.mjs` supplies synthetic accounts only in the test process. The app has no testing switch and uses the same adapter as a deployment. The test CA is trusted only by the spawned child process and is deleted after use. Nothing provisions an external service.

Focused rerun after a relevant membership fix: `npx playwright test --project=membership-desktop --project=membership-mobile`. Do not rerun already-passing broad checks without a new change or failure.

## Preview and production boundaries

The existing Vercel project has Git previews and Vercel authentication enabled (`all_except_custom_domains`). The branch contains public copy and synthetic checks only; `.private`, environment files and tests are excluded from uploads. No new environment values are set. The preview therefore denies protected content even if someone forges a valid-looking cookie. Inspect the exact preview and commit, never infer customer access from READY. No merge, production promotion, domain change, public-content migration, paid service or live billing is included.

## Sources

The framework guidance calls for authorization close to the data and independent checks in route handlers: [Next.js authentication](https://nextjs.org/docs/app/guides/authentication). The matching installed Next.js guides were read before implementation. Billing sources and the future event design are in `BILLING_DESIGN.md`.

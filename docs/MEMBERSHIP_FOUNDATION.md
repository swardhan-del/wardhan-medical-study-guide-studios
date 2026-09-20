# Reconstructed membership foundation — 20 September 2026

> Historical description of draft PR #16. On the preview pilot branch, its HMAC
> adapter and in-code diagnostic response are replaced by the single Supabase
> path described in [PREVIEW_MEMBERSHIP_PILOT.md](PREVIEW_MEMBERSHIP_PILOT.md).
> Neither PR #15 nor PR #16 is modified by that stacked draft.

This narrow implementation was rebuilt from the owner's reconstructed handoff,
on baseline `16bd49374c25b22432e828f5f6ea5cf283d4be16`. The original temporary
patch and commit were pruned. This is a new implementation, not a recovered
patch or a match for its old SHA-256. Draft PR #15 is a separate, broader
subscription proposal and has not been applied or changed here.

## Scope and delivery boundary

Public `/membership` explains complete modules, proposed Basic and Advanced
levels, and closed enrolment. `/member` dynamically verifies access on the
server and otherwise renders a locked shell. An HTML 200 is expected for that
shell; it contains no protected teaching content. The primary navigation links
both pages. No account creation, cookie issuer, demo login, checkout, billing,
real customer data or private storage is implemented.

`/api/member/assets/membership-foundation-pilot` is the only allowed asset ID.
It requires at least Basic access and serves one synthetic diagnostic string.
It never reads a source file, real lesson, PDF, image, video, question or answer.
Authentication and authorization run before ID resolution. Anonymous/invalid
credentials return 401; inactive, expired or insufficient membership returns
403. Unknown IDs return 404 only after authorization. All these responses use
`Cache-Control: private, no-store`, `Vary: Cookie`, `nosniff` and `noindex`.
The dynamic member page is not prerendered and has noindex metadata. No member
route or pilot payload is added to the sitemap, public files or client code.

## Dormant provider contract

The future selected provider must verify identity and the authoritative current
entitlement before issuing a short-lived `wmss_member_session` cookie. No
provider or secret is configured by this change. Leave
`MEMBERSHIP_SESSION_SECRET` unset on previews and production. It must eventually
be an independently generated secret with at least 32 random bytes, stored only
in an approved secret manager, with a separate key for each environment.

The fixed wire format is `base64url(JSON).base64url(HMAC-SHA256(payload))`.
The signature covers the encoded payload; unpadded canonical base64url and a
constant-time signature comparison are required. Claims have exactly these
four fields: opaque `memberId`, `tier` (`basic` or `advanced`),
`membershipStatus` (`active`, `expired`, `cancelled`, `past_due`), and numeric
`expiresAt` in Unix milliseconds. Only active membership with an expiry in the
next five minutes grants access. Basic accesses Basic; Advanced also accesses
Basic, matching the reconstructed product copy. Unknown tiers/statuses, absent
or malformed claims, invalid signatures, missing/short secrets and expiry deny.
No query, local-storage, payment-return or client-supplied tier can grant access.
The server-only cookie adapter is shared by the member page and asset route.

Before connecting a real provider, require Secure, HttpOnly, SameSite=Lax,
Path=/ and no Domain on cookies; review CSRF, rotation, logout/revocation,
recovery, issuance/refresh, issuer/audience and entitlement outage behavior.
This signed snapshot alone cannot detect a membership change until expiry,
with a maximum five-minute window. A future issuer must never refresh stale
claims or issue when the authoritative entitlement is unavailable. Real
teaching delivery requires separately approved live entitlement/revocation
checks and private storage. The synthetic in-repository string is not a
private asset store and must never be replaced with real teaching material.

## Proposed module-to-tier matrix

| Module family | Proposed level | Release state |
| --- | --- | --- |
| Reviewed foundation modules | Basic | Owner must approve exact module list and release status. |
| Reviewed deeper modules | Advanced | Owner must approve exact module list and release status. |
| Additional member tools | Advanced | Define each tool and privacy model before release. |
| Unreviewed or rights-unresolved sources | No tier | Reference-only; never upload to protected delivery. |

Prices, billing interval, taxes, refund policy, launch date and final module
allocations remain undecided. This table is not a live entitlement table.

## Billing and webhooks — design only

Only verified payment-provider webhooks may write billing-derived membership
state. Persist member, entitlement, event ID/type, effective period and audit
records server-side. Verify signatures against the raw request body and enforce
event idempotency and ordering before applying transitions. Handle renewal,
cancellation at period end, payment failure/past due, refunds, disputes and
retries. Reconcile uncertain/out-of-order events with authoritative provider
state and deny when entitlement cannot be verified. A browser's payment-success
value grants nothing. No webhook, billing account, price or payment secret is
created by this foundation.

## Existing public exposure and migration

The existing public library, routes, media, search records and assets remain
unchanged. No public lessons are migrated or newly made private. Previously
published material remains exposed through current URLs, static output, client
bundles, caches, old deployments and Git history; adding a paywall cannot erase
that exposure. Any later migration requires rights review, complete module
boundaries, stable lesson IDs, private storage and separate owner approval.
Repository visibility, history, domains and production must not be changed.

## Validation and publication

Run `npm install`, `npm test`, `npm run lint`, `npm run typecheck`,
`npm run build`, `npx playwright install --with-deps chromium`, and
`npm run test:e2e`. Unit tests exercise signatures and the complete access
matrix with random test-process secrets; no test account can sign into the app.
Additionally verify the actual built server and the exact Git preview, including
anonymous/forged requests, HTML/RSC leakage, private headers, desktop/mobile
navigation and absence of the pilot payload in static/client/public output.

Publish only a feature branch and draft PR. The existing Git integration may
produce its preview; do not invoke a deployment, merge or promotion. Preserve
the final SHA, PR/preview URLs, exact validation results and a new portable patch
beside the private reconstructed package. Those private handoff files and test
secrets must not enter Git or deployment traces.

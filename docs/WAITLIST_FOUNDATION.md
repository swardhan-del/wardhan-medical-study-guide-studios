# Privacy-respecting pre-launch waitlist

Phase Seven starts at main `e86352a`, preserving all published lesson and question records. Phase Four, Five and Six were unmerged when work began; no commits from those branches are included. `/starter-pack` is a small landing page linking to the existing free lessons and printable revision notes, not the separate Phase Six generated download implementation. Reconcile that route when reviewing the two PRs together.

## Public journey and honest states

One `WaitlistCta` appears on the homepage and both subject-hub families (`/subjects/[slug]`, `/study/[subject]`), plus `/starter-pack`. It leads to `/waitlist`, explains pre-launch status, launch/free-resource updates and lack of timing or early-access guarantees. Free learning never requires signup. `/terms` and the existing `/privacy` cover independent educational support and data choices.

Default **demo** validates in page memory. It permits reserved example.com/org/net addresses, makes no POST, writes no browser storage, loads no Turnstile script and clears the form on completion. The API rejects live collection in demo without reading the request body. No local CSV, database, queue, log of form fields or fake “email sent” state exists. The mode/config GET is no-store and contains no secrets. A configuration-fetch failure disables the form rather than guessing availability.

**Live** means a provider accepted a double-opt-in request, not that mail was delivered or that the student joined. Membership is managed by Brevo after email confirmation. `/waitlist/confirmation` is an informational redirect only: direct visits cannot prove membership and generate no conversion. Live failures never echo provider bodies, addresses or tokens. Network failure after acceptance is explicitly uncertain and retry remains available.

## Environment and activation

No email provider or Turnstile credentials were present locally or in the linked Vercel project at implementation time. This PR does not provision accounts, change environment variables, send email, activate signup or deploy production. **All Vercel previews force demo mode even if credentials are inherited.**

Default `WAITLIST_MODE=demo` (or unset). For live collection set all of these on the server, never with a NEXT_PUBLIC prefix:

| Variable | Purpose |
| --- | --- |
| WAITLIST_MODE | `brevo`; unknown values fail closed |
| WAITLIST_ORIGIN | Exact public HTTPS origin, without a path/query/credentials |
| BREVO_API_KEY | API key authorised for the dedicated waitlist |
| BREVO_WAITLIST_LIST_ID | Positive integer ID of that list |
| BREVO_DOI_TEMPLATE_ID | Positive integer ID of the double-opt-in template |
| TURNSTILE_SITE_KEY | Public widget identifier, returned only in live configuration |
| TURNSTILE_SECRET_KEY | Server verification secret |

Before enabling live mode, the operator must configure and verify the following with the actual provider account:

1. Create the dedicated list and Brevo text contact attributes `WAITLIST_CONSENT` and `WAITLIST_REQUESTED_AT`. The adapter submits the consent text version `2026-09-26` and ISO request time; retain the matching version of this repository and the provider's confirmation record. This is a request record, not proof of confirmed membership.
2. Configure a double-opt-in template using Brevo's required confirmation link, with a recognisable verified sender and exactly the promised purpose. Use the dedicated list; do not auto-subscribe via a contact-create endpoint. Preserve existing unsubscribes and suppressions. Confirm repeat requests and unsubscribed contacts behave correctly in the provider before enabling public use.
3. Include a working one-click unsubscribe in every later update. Do not enable email-open or click tracking. Do not add other mailing lists, advertising automation or unrelated marketing.
4. Restrict Turnstile hostnames to the deployed site; disable pre-clearance. The server verifies a fresh token's success, hostname and `waitlist` action. Tokens are single-use and expire at the provider. A honeypot, same-origin JSON POST, 4 KB streaming body limit and bounded upstream timeouts add protection. This does not claim a global IP rate limiter: use the provider's quotas and hosting abuse controls if needed before live traffic.
5. Confirm provider agreements, processing regions/international-transfer arrangements and the public privacy wording. Configure or operate the documented retention procedure: clear unconfirmed requests within 30 days, review active waitlist records at 12 months, remove them when no longer needed or the waitlist closes, honour deletion/withdrawal and retain only required suppression records. These are operator procedures, not a background deletion service in this repository. Update the notice if actual arrangements differ.
6. With explicit authorisation and an operator-owned test mailbox, verify confirmation delivery, confirmation, unsubscribe, suppression, deletion and retention. Automated tests mock provider responses and do not prove real email delivery. Then enable live variables and redeploy production through the normal reviewed release process.

No client email value enters the URL, analytics, error text or persistent browser data. Hosting necessarily handles network requests; the application does not log request bodies. Turnstile loads only after a student's explicit “Start spam-protection check” action. CSP allows its fixed script/frame origin only for the waitlist document; CTA anchors use full navigation so the correct document policy applies. No other external scripts or form destinations are added.

## Analytics

`analyticsAllowed()` now requires an explicit saved allow choice (`wardhan-analytics-optout=0`), the production analytics flag, and no Do Not Track or Global Privacy Control signal. Missing/unavailable storage means no tracking. The Analytics component is not mounted before consent; same-tab preference changes and cross-tab storage events update it. Waitlist pages are excluded from page-view tracking. Consent can be withdrawn on `/privacy`.

The only new conversion event, `waitlist_confirmation_requested`, has **no properties** and fires only after an API 202/pending response and only with independent analytics consent. It measures provider acceptance, not delivery or membership. No event is fired for demo, invalid submission, failure, or the confirmation redirect. Signup consent never enables analytics.

## Validation and accessibility

Shared client/server email and explicit-consent validation; inline text errors with aria-invalid/describedby; first invalid control receives focus; result status/alert is focused; submit is locked during a request; failed/expired spam checks can be restarted. Native checkbox/button semantics, existing focus styling and a compact widget support keyboard and narrow layouts. A no-JavaScript notice explains that signup has not happened, with free reading still available.

Unit tests exercise malformed/oversized requests, untrusted origins, honeypot, missing/expired/forged tokens, hostname/action mismatches, provider errors/timeouts, confirmation acceptance, secret exclusion and consent gating. Browser tests exercise demo non-transmission, mocked live pending/error/retry paths, double-submit prevention, script failure, keyboard focus, CTA navigation, 320px layout and axe accessibility. Mocked Turnstile tests verify application behaviour, not Cloudflare's third-party widget internals. Run `npm run content:check`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, `npm run test:e2e`.

## Primary references checked 26 September 2026

- [Brevo double-opt-in endpoint](https://developers.brevo.com/reference/create-doi-contact): request schema, required list/template/redirect, API-key header and 201 success.
- [Cloudflare server verification](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/): single-use token verification, expiry, hostname and action checks.
- [Cloudflare explicit rendering](https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/) and [CSP](https://developers.cloudflare.com/turnstile/reference/content-security-policy/).
- [EDPB: lawful processing](https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en) and [individual rights](https://www.edpb.europa.eu/sme/be-compliant/respect-individuals-rights_en): clear optional consent, notice and withdrawal principles. The product copy is not a claim of legal review or certification.

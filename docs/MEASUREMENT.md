# Privacy-conscious measurement

Phase Nine starts from main `e86352a`. This is optional measurement of public learning actions, not a student record, assessment result, attendance log or measure of learning quality. It replaces the automatic production Vercel SDK. Hosting-provider settings, billing and production environment variables are not changed by this branch.

## Consent and data flow

1. The browser requests `/api/measurement` once for public configuration. This ordinary first-party GET contains no event, cookies or referrer, and never contacts a measurement recipient. If unavailable, measurement stays off.
2. If enabled, the interface names the recipient and links its privacy information. Accept and refuse have equal prominence. All learning features remain available after refusal. The existing Privacy link opens permanent controls; withdrawal is also available in the non-modal footer panel.
3. No event is sent before explicit opt-in. A legacy opt-out remains refused; the old implicit allow setting does not count as consent. DNT or GPC overrides permission. Unavailable browser storage disables measurement.
4. A versioned consent choice is stored locally for up to 180 days. Its local timestamp is not sent. Recipient, endpoint or policy changes invalidate it. Removing browser data also removes permission. Cross-tab storage changes stop further events; pending browser requests are aborted on withdrawal. A failed preference write keeps this visit off and is explained in the interface.
5. The browser validates the event against the public registry, then posts only approved JSON to `/api/measurement`. It omits cookies and referrers and includes the current policy version as a consent header. There is no event queue, history upload, background retry, beacon, student/session identifier, fingerprint, session recording or automatic page-view event.
6. The server requires the expected origin and consent-version header, honours incoming privacy signals, caps bodies at 512 bytes, and rejects unknown events, identifiers and extra properties. It constructs fresh outbound JSON and forwards it through a server-only HTTP adapter. Provider credentials stay in an Authorization header. No client IP, browser headers, cookies, URL or referrer is forwarded.
7. The adapter times out after two seconds, rejects redirects and returns an empty failure response. The browser ignores failed delivery and keeps the site usable. No application analytics code writes payloads, credentials or provider errors to client/server logs or permanent application storage.

Consent controls stop future delivery; they cannot recall counts already delivered. Hosting still handles ordinary network requests and may retain its normal access logs. A recipient may retain its own delivery metadata, so do not describe this as a guarantee of anonymous processing. The consent header is a browser assertion, not user authentication or proof against forged requests; these counts are not authoritative transactions.

## Event specification

Every event has `version: 1` and the exact `event` name below. Only the stated additional fields are allowed. No scores, answers, free text, email addresses, click text, page URLs, query strings, referrers, timestamps, device details or user IDs are accepted.

| Event | Trigger and additional fields | Purpose and limits |
| --- | --- | --- |
| `subject_selected` | Enter a published subject hub; `subject_id` from the public registry. Directory aliases map to their curriculum subject. | Understand which subject entry points are used. Direct visits and reloads also count; filter changes are not counted. |
| `lesson_opened` | Enter a released authored, foundation or renal lesson; `lesson_id`. | Identify useful lesson entry points. A page opening does not establish that a lesson was read. |
| `quiz_completed` | Submit a single-question Knowledge Check or open the final results of the renal sequence/challenge; `quiz_id`. | Measure completed practice units, including incorrect attempts. One checked question is a one-question unit, not completion of every question in a lesson. Retries may count again; results are never included. |
| `summary_saved` | All items in a lesson's summary checklist are checked and the local save succeeds; `lesson_id`. | Measure use of summary checklists. Partial checks, restored state, oral drafts and failed saves do not count. Unchecking and completing again can produce another event. |
| `starter_pack_requested` | `recordStarterPackRequested(true)` after the actual starter-pack response/download succeeds; fixed `asset_id: "study-guide-starter-pack"`. | Measure delivery requests, not clicks or proof of reading. Currently reserved: main has no starter-pack flow. |
| `waitlist_submitted` | `recordWaitlistSubmitted(true)` only after the real waitlist service confirms acceptance; no additional fields. | Measure successful sign-ups without email addresses. Demo responses, validation errors, failures and CTA clicks must pass false or omit the call. Currently reserved: main has no waitlist form. |

There are four wired event types on this baseline and two tested integration hooks. Later-phase starter-pack and waitlist PRs remain independent; this change neither imports those branches nor fabricates conversion events. Their maintainers must wire the hooks at confirmed success boundaries and add end-to-end checks when those flows land. Marketing/waitlist consent is separate from analytics consent.

Counters can repeat across visits or devices and are affected by refusal, privacy signals, blockers and network errors. Do not infer unique students, retention, conversion rates across identities, exam readiness or clinical competence from these events. Do not add the retired `lesson_completed`, `quiz_started`, `challenge_shared` or `learning_day` events.

## Environment-only integration

Default: disabled. No collector or credentials are provisioned by this PR. Configure these **server-only** variables to enable the generic HTTP adapter in an approved production environment:

| Variable | Meaning |
| --- | --- |
| `MEASUREMENT_PROVIDER` | `off` (default) or `http`; all other values disable collection. |
| `MEASUREMENT_ENDPOINT` | Approved HTTPS collector URL accepting the JSON contract above. No embedded credentials, query string, fragment, local hostname or literal-IP address. The operator must verify the destination; this URL check does not resolve DNS. |
| `MEASUREMENT_TOKEN` | Server-only Bearer credential. Never put it in a URL, browser bundle, `NEXT_PUBLIC_*` variable or log. |
| `MEASUREMENT_RECIPIENT_NAME` | Plain-text name shown to students before consent. Required. |
| `MEASUREMENT_PRIVACY_URL` | Public HTTPS recipient privacy notice without credentials, query string or fragment. Required. |
| `MEASUREMENT_POLICY_VERSION` | Default `1`; increase when purposes or processing policy change to require a fresh choice. |

Missing/invalid settings disable the integration. Vercel preview/development environments and local private review always disable it, regardless of credentials. Local tests use a mock recipient and mock delivery, not a real analytics account. Configuration is read at runtime; publish/deploy updated environment settings according to the hosting platform's normal workflow.

The collector must accept `POST` JSON and `Authorization: Bearer …`, and return a 2xx response without redirecting. A vendor with a different protocol needs a server-side adapter or collector bridge. No vendor SDK, third-party browser script or relaxed CSP is required. Review the recipient's processing and retention before configuring it, and keep the displayed notice accurate. Secrets belong in the hosting environment manager, never in this repository. `.env.example` contains placeholders only.

## Maintaining the boundary

- Regenerate with `node scripts/build-measurement-registry.mjs` when released curriculum identifiers change. The standard content and build checks verify that this compact manifest matches existing released lessons; it contains no question text or answers.
- Add schema changes in `measurement-events.ts` on both client and server. Exact reconstruction is deliberate: additional fields are rejected, not passed through.
- Never call measurement from render, a draft keystroke, an answer-value callback, a contact form or personal My Study restoration. Existing local learning histories are independent of this layer.
- Keep optional integration failures outside all learning operations. There are no retries or offline queues to flush after consent changes.

## Validation

Run content checks, unit tests, typecheck, lint, production build and the full Playwright suite. Unit tests cover all six schemas, hostile/extra fields, public IDs, completed summaries, consent expiry/policy changes, legacy settings, privacy signals, cross-tab withdrawal, blocked storage, HTTP validation, stripped request metadata and provider failures. Browser tests intercept only the measurement endpoint for configured scenarios and exercise actual navigation, quizzes and saved summaries; they verify zero pre-consent events, no replay, withdrawal, persisted choice, failure tolerance, payload safety and keyboard accessibility. Real preview verification must confirm the endpoint reports disabled and sends no events.

This is a conservative technical opt-in policy for all visitors, not a jurisdiction-specific legal determination. Design references: [EDPB consent principles](https://www.edpb.europa.eu/sme/be-compliant/process-personal-data-lawfully_en) and [ICO cookies and similar technologies](https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/).

## Integrated roadmap behaviour

The starter-pack control records a request only after an HTTP success and receipt of the file body; it does not claim the user saved or read the file. Failed downloads and no-JavaScript downloads emit no event. The waitlist uses its acceptance hook only for HTTP 202 with pending confirmation, never demo mode or failure. Saving a recap in the lesson journey also emits `summary_saved` only after persistent browser storage succeeds; it uses the same fixed lesson identifier as checklist completion. No form values or recap text are sent.

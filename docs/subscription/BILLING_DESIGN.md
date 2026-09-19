# Billing integration design — inactive

Membership is the product. No item-level purchase flow, live prices, checkout, customer creation, charge or billing webhook endpoint is activated in this change. No provider has been selected. The event examples below use Stripe vocabulary only as a concrete design reference, not an approved provider/account or price.

## Authoritative state and transaction boundary

Use a durable server-side account store with separate records for account ↔ provider customer, subscription ID/environment, approved price-to-tier/module mapping, membership paid-through time/status/version, and webhook inbox. The mapping must be server-controlled and versioned. Never accept a module list, customer ID, tier, amount or entitlement from the browser.

Unique inbox key: provider + account/connected-account + live/test environment + event ID. Persist signature-verified events transactionally before acknowledgement. The inbox has received, processing, applied and failed states, retry count and a redacted error. A failed transaction must not become a permanently ignored event. Lock the subscription/account while applying a fresh provider snapshot and membership update; commit entitlement changes and inbox completion atomically. Store minimal audit identifiers, not payment card information or unredacted request logs.

## Event handling

1. Read the raw request body with a size limit. Use the chosen provider SDK to validate the signature, endpoint secret and timestamp tolerance before parsing/trusting event data. Separate test and live secrets; reject events for the wrong account or environment. Invalid signatures return 400 with no persistence or grant.
2. Persist a verified event or identify its duplicate. Acknowledge after durable acceptance; queue processing may then proceed with retries. If durable acceptance fails, return a retryable error. Restrict the event types subscribed at the provider.
3. Retrieve current subscription and payment/invoice state server-to-server. Events may be duplicated or out of order, so do not order solely by event arrival or overwrite newer state using an old payload. Serialize updates per subscription and reconcile from current provider truth. A checkout completion or browser redirect alone grants nothing.
4. Map only approved recurring membership prices. Unknown prices, customer mismatches, incomplete records or an unavailable provider/database create no new grant and raise an operational alert. Preserve a previously paid term only when it is still valid and independently verifiable; never extend access from an unverified event.
5. Project the verified state into the entitlement record read by the session-verification service. Apply module grants from the approved mapping, explicit start/end times and revocation status. Cached session claims never extend the paid-through time.

| Trigger | Intended processing and access result |
| --- | --- |
| Initial checkout / subscription creation | Link to an authenticated existing account through a server-created checkout session; await verified settled invoice/payment state before granting. Incomplete, trialing or pending states grant nothing until an explicit policy is approved. |
| Paid renewal (`invoice.paid` or provider equivalent) | Verify the subscription, associated settled invoice, customer and recurring price; extend paid-through from provider period data exactly once. |
| Scheduled cancellation | Mark cancellation scheduled and display the actual end date; retain verified active access only until the paid-through time. Do not promise this commercial policy before approval. |
| Effective cancellation / deletion | Reconcile and mark terminal cancellation; revoke future requests when the verified service end is reached. |
| Failed renewal / action required | Record failure and notify through a separately approved flow. Never extend paid-through. The current code denies `past_due`; exact retry/grace/service-end policy remains an owner decision. |
| Upgrade or downgrade | Reconcile the actual effective price and date after provider-confirmed change; no local optimistic grant or unapproved proration assumption. |
| Refund / dispute / fraud / administrative revoke | Apply an explicit approved policy; do not equate every partial refund with cancellation. Once revoked, set status/version immediately and deny future page/asset requests. |
| Duplicate or reordered event | Process idempotently against current provider truth; no double extension or stale reactivation. |
| Verification/database outage | All newly requested protected content remains locked; do not trust browser caches or locally supplied payment flags. |

Revocation stops subsequent server requests. It cannot retract downloaded files, screenshots, copied content or already buffered media. Signed media URLs introduce a validity window; that window must be an explicit reviewed choice, not a promise of instant recall.

## Reconciliation and operational readiness

Before launch, implement periodic reconciliation of active subscriptions against provider truth and a replayable dead-letter/inbox view. Record last reconciled time and entitlement version, monitor failures and mismatches, and support verified manual revocation with an audit trail. Email sending and operational scheduling require separate authorized configuration; this design creates neither.

## Acceptance tests for the future provider integration (not yet executed)

- Valid raw-body signature, invalid signature, stale replay, wrong environment/account, altered body and oversized request.
- Checkout success without a paid invoice never grants access; invented price and account mismatch deny.
- Paid initial invoice and renewal update once; duplicate, out-of-order, concurrent and delayed events do not resurrect revoked access or double-extend a term.
- Durable inbox/database/queue failure retries safely; crash before/after entitlement commit can be replayed.
- Scheduled/effective cancellation, failed payments, action-required state, unknown status, approved upgrade/downgrade and explicit refund/dispute policy.
- Provider outage and stale reconciliation deny new unverifiable access; real provider session expiry and recovery flows work.
- A formerly valid user cannot fetch new lesson HTML, RSC, downloads or media after the entitlement ends. All tests use provider test mode and synthetic resources.

## Primary references checked on 19 September 2026

[Stripe webhook delivery and signature verification](https://docs.stripe.com/webhooks) documents raw-body verification and handling duplicate/unordered delivery. [Stripe subscription webhooks](https://docs.stripe.com/billing/subscriptions/webhooks) describes subscription and invoice events. The architecture above is a proposed application design derived from those delivery constraints. No Stripe runtime integration is claimed.

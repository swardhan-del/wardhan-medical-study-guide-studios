# Minimal continuation — external dependencies only

The synthetic foundation is implemented on `feat/subscription-foundation`. Do not rebuild it or repeat the content audit. Nothing here authorizes merge, production deployment, content migration, live billing or paid provisioning.

Blocked input: owner-approved identity provider, entitlement database and private storage with test credentials, plus the approved pilot module grants. No such provider integration or credentials existed in the repository/Vercel environment when this foundation was built.

Once those inputs are available, connect the real provider at the contract in `docs/subscription/FOUNDATION.md`. Relevant files: `src/server/membership.ts`, `src/lib/membership/provider.ts`, `src/lib/membership/access.ts`, `src/server/member-content.ts`, `src/app/account/page.tsx`, `src/app/api/account/sign-out/route.ts`, `.env.example`. Add the selected SDK's real sign-in/callback/recovery and provider session revocation; replace synthetic storage reads with a private store reader while keeping synthetic test fixtures. Configure secrets only in the approved test environment. Use the inactive design in `docs/subscription/BILLING_DESIGN.md` for any later separately authorized provider test-mode billing work.

Commands, from the repository: `npm ci`, `npm test`, `npm run lint`, `npm run build`, `npm run typecheck`, `npx playwright test --project=membership-desktop --project=membership-mobile`. Run new provider tests once, then inspect CI once for the completed batch.

Acceptance: real provider test accounts can sign in/out/recover; Basic and Advanced access follows explicit whole-module grants; expired/revoked/wrong-account/offline verification denies lesson HTML/RSC and direct assets; storage has no anonymous object URL; no real source content/secrets enter Git, client bundles or previews. Record actual provider/preview evidence. Keep enrolment and billing closed until commercial terms and release are separately approved.

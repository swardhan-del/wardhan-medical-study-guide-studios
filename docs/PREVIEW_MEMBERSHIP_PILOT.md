# Preview membership pilot

This is a synthetic pilot, disabled unless all preview settings are present.
Production is explicitly rejected even if the enable flag is accidentally set.
Provisioning and real-account acceptance remain incomplete until the evidence
record below is updated. Do not treat local provider doubles as hosted Auth tests.

## Reconciliation of drafts

The live preflight found `origin/main` at
`16bd49374c25b22432e828f5f6ea5cf283d4be16`. Draft #15 is open at
`b9a459543a6833e55139a59fa122f5e890b9fe7d`; draft #16 is open at
`1923f28d548d7d7473ef88e0b4f89cad68e30014`. This new branch starts at #16.
Neither draft is merged, closed, rebased, overwritten, retargeted or force-pushed.
The new PR targets `feat/membership-foundation`, showing only the pilot delta.

| Overlap | Decision in this branch |
| --- | --- |
| `src/app/membership/page.tsx` | Keep #16's public membership copy unchanged. |
| `src/components/site-nav.tsx` | Keep #16's navigation unchanged. |
| `src/app/member/page.tsx` | Replace #16's locked shell with a dynamic HTML route. Complete checks before response headers ensure 401/403/503, without a streamed 200. |
| `src/app/api/member/assets/[assetId]/route.ts` | Keep the same route and original pilot ID; map both pilot modules to one private canary using the same authorization path. |
| `.env.example` | Replace HMAC settings with value-free preview Supabase settings. |
| #16 `membership-core.ts`, `member-session.ts` | Retire the HMAC cookie authority only on this new branch. Replace it with verified identity and a current DB snapshot. |
| #15 `membership/{access,catalog,provider,delivery}.ts`, `server/{membership,member-content}.ts` | Do not copy the separate opaque-session/verifier model. Reimplement explicit whole-module grants and failure checks in the single Supabase path. |
| #15 account/sign-out routes, member layout/module routes, locked component | Do not import its local-cookie-only logout or alternate route tree. Use provider sign-out and a current Auth-session DB check. |
| #15 styles/about/README/robots/sitemap/build/Playwright changes | Do not cherry-pick broader proposal edits. Add only pilot-specific tests/build checks here. |
| #15 subscription docs and tests | Retain as the separate draft proposal; use the private approved brief for this pilot. |

## Request authority

The SSR client is created per request. `getClaims()` verifies JWT identity and
refreshes cookies through the Next proxy. Each protected handler independently
calls it again, calls the live Auth `getUser()` endpoint, checks matching user ID,
confirmed email and the server-only allowlist, then calls the service-only
`pilot_access_snapshot` Postgres RPC. It does not use `getSession()` as authority.

The RPC takes a single current snapshot of `auth.sessions`, membership, catalogue
and the exact module grant. A deleted/expired Auth session denies access, including
replay of an otherwise unexpired JWT after logout. Membership validity is compared
against Postgres time. No allow decision is cached across requests. Basic needs an
explicit Foundations grant. Advanced still needs each explicit whole-module grant.
Inactive, revoked, expired, past-due and cancelled memberships deny the next request.

The dashboard checks current membership and checks both module grants before
showing availability. Module pages and direct assets re-run the complete check.
Provider errors produce generic 503 responses. Invalid identity returns 401;
insufficient current membership/grant returns 403. Unknown safe IDs return 404.

The Storage bucket must remain private. After authorization, the server verifies
that setting and downloads the same text object for either module. It buffers at
most the tiny configured object before returning content so errors cannot emit
partial protected bytes. No signed or public Storage URL is returned. All member,
auth and asset responses are private/no-store, noindex, nosniff and Vary: Cookie.
Member HTML also uses a restrictive CSP. These routes are never prerendered.

## Auth and provisioning runbook

1. In the authenticated Supabase console, create a separate preview project in
   the owner-selected region. Use no existing production project, billing change,
   paid upgrade or real data. Disable public signup and pre-create only the two
   or three owner-approved pilot users. Keep email confirmation/passwordless on.
2. Apply `supabase/migrations/202609200001_preview_membership.sql` only there.
   Confirm all three tables use RLS, browser roles have no table/RPC privileges,
   and no `storage.objects` policy grants browser access to the private bucket.
3. Approve the exact pilot branch preview origin. Set the Auth site URL and exact
   `/auth/callback` redirect URL there, without wildcard origins. PKCE sign-in
   starts and ends on the same origin. `shouldCreateUser: false` prevents signup.
4. Set `.env.example`'s six runtime names ONLY in Vercel Preview, scoped to
   `feat/preview-supabase-membership-pilot` on the existing Vercel project.
   The service-role key and email list are server-only. Do not paste secrets into
   chat, arguments, Git, screenshots, logs or Production settings. Use the approved
   console/secret environment. The public URL and publishable key are not authority.
5. Locally, load the same preview credentials securely and set
   `PILOT_ADMIN_PROJECT_REF` to explicitly confirm the target. Run
   `node scripts/pilot-admin.mjs membership <invited-email> basic` (and advanced
   for the other account). The script refuses non-allowlisted users and does not
   create accounts. Assignments first revoke access to fail closed on partial error.
6. Run `node scripts/pilot-admin.mjs canary` once. It requires an empty PRIVATE
   bucket and generates a random synthetic text object in memory. Its bytes are
   never saved in Git or public artifacts. Do not upload anything else.
7. Let the normal Git integration produce the Preview. Do not manually deploy,
   promote, merge or change domains. Record the exact deployed commit and URL.

The allowlist and callback origin are owner inputs supplied through the supported
console flow. An unauthenticated console is a provisioning blocker, not permission
to invent users or copy credentials from unrelated projects.

## Verification

Local commands: `npm install`, `npm test`, `npm run test:pilot:sql`,
`npm run lint`, `npm run typecheck`, `npm run build`,
`npx playwright install --with-deps chromium`, `npm run test:e2e`.
SQL tests start and remove an isolated local Postgres cluster, with minimal Auth
and Storage schema fixtures. They prove SQL/RLS and live row changes, not hosted
Supabase authentication or Storage behavior. Set `PG_BINDIR` if needed.

The unit suite uses provider doubles for outages and policy edge cases. Browser
tests with an unconfigured provider assert 503, no bytes, no-store headers and
desktop/mobile navigation. Build checks inspect public files, content indexes,
client bundles and prerendered artifacts for protected bytes or server secrets.

Hosted acceptance must record all of the following on the exact Preview:

- Real email link requested through the UI, received by an invited user, and
  redeemed in that browser; no admin-generated shortcut counts as email sign-in.
- Anonymous 401; Basic Foundations 200 and Deep Dive 403; Advanced 200 on both;
  missing grant 403; direct asset requests have the same decisions.
- Change membership to expired/revoked/cancelled/past_due using server admin
  tooling. The very next page AND direct asset request must be 403 without bytes.
- Provider logout clears cookies and invalidates the Auth session. Both the
  browser and replay of the old session must be denied on the next request.
- Controlled preview-only Auth, database and Storage failure each returns 503
  without bytes. Restore preview configuration after each test. Do not add a
  browser outage switch or touch production.
- Desktop/mobile paths, public pages, sitemap, headers, direct anonymous Storage
  access, no marker in public/static/client output, GitHub CI and deployed SHA.

## Evidence state

Executed locally on 20 September 2026: dependency installation and production
dependency audit (zero vulnerabilities); 81 unit/content/SDK-contract tests;
61 SQL/RLS assertions; lint; typecheck; build; Chromium installation; all 422
Playwright tests (desktop, mobile and local review). Build leak checks covered
3,175 public/client/prerender/content artifacts. No public content or asset files
changed. The SDK contract includes PKCE, disabled signup, a live identity request
despite a cached signing key, simulated outage, and cookie clearing on logout.
Its intercepted HTTP responses are not proof of hosted Supabase behavior.

This branch prepares the implementation and executable local checks. Real hosted
sign-in, provider logout, hosted row revocation, private Storage delivery and
controlled hosted outages are pending authenticated Supabase provisioning and
the owner-approved accounts/region/redirect origin. Do not merge or release it
until those acceptance checks actually pass. No actual lessons, sources, media,
questions, payments, billing, production settings or domains belong in this pilot.

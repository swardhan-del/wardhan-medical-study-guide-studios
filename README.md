# Wardhan Medical Study Guide Studios

Native medical library with subject, system, topic and resource pages; searchable released lessons, practice and PDF viewing/download. Dropbox remains the controlled source archive.

See [Native library](docs/NATIVE_LIBRARY.md) for the content model, release boundary, update workflow and hosting dependencies.

Run `npm ci`, `npm run content:check`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build` and `npm run test:e2e`.

This work targets a Vercel preview. Production promotion is a separate step.

## Membership preparation

The bounded subscription foundation uses synthetic content only; real enrolment, billing and private storage are not connected. See [implementation and provider contract](docs/subscription/FOUNDATION.md), [membership experience and proposed tiers](docs/subscription/PRODUCT_AND_TIERS.md), [public exposure and migration](docs/subscription/EXPOSURE_AND_MIGRATION.md), [inactive billing design](docs/subscription/BILLING_DESIGN.md), and the [external-dependency handoff](docs/subscription/HANDOFF.md). Existing public teaching routes are unchanged. [Executed verification](docs/subscription/VERIFICATION.md) distinguishes local tests from external integration.

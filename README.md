# Wardhan Medical Study Guide Studios

Next.js study-library interface with searchable resource cards, six subject pages, resource detail pages, browser-local reading lists, configurable email contact, sitemap, sharing metadata and responsive layouts.

The public catalog currently has **zero released resources**. An optional local review imports the **44 private curated records** from the September 2, 2026 source manifest. Those records and source documents are not committed or served on Vercel.

## Develop and verify

```sh
npm ci
npm run dev
npm test
npm run lint
npm run build
npx playwright install chromium
npm run test:e2e
```

For installed Chrome, set `PLAYWRIGHT_EXECUTABLE_PATH` to its executable when running browser tests. CI installs Chromium automatically. Browser tests cover public desktop/mobile routes, private-route rejection, filtering, guide detail views and keyboard navigation. Reading lists use this browser's local storage, not an account or remote database.

## Local curation review

```sh
npm run content:import -- "/absolute/path/to/08_WEB_LIBRARY_CURATION"
npm run build
npm run review
```

Open `http://127.0.0.1:3100/review`. Originals are preserved. No private downloads are enabled. The review catalog is ignored by Git, and review routes are disabled on Vercel.

## Routes

`/`, `/about`, `/subjects`, `/subjects/[slug]`, `/library`, `/library/[id]`, `/reading-list`, `/contact`, `/privacy`.

`/review` and `/review/[id]` are opt-in local review routes only.

## Deploy and release content

- [Vercel step-by-step](docs/VERCEL_DEPLOYMENT.md)
- [Content import and public release](docs/CONTENT_INTEGRATION.md)
- [.env.example](.env.example): both public URL and contact email are optional.

GitHub Actions validates changes. No deployment, payment provider, identity provider, file-storage service or domain is provisioned by the application code.

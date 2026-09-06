# Content integration and release

The source archive is preserved. The website uses an explicit catalog, never a recursive directory listing or automatic Dropbox synchronization.

## Local private review

From this repository checkout:

```sh
npm ci
npm run content:import -- "/absolute/path/to/08_WEB_LIBRARY_CURATION"
npm run build
npm run review
```

Open `http://127.0.0.1:3100/review`. The import checks the private allowlist, verification status and matching stored hashes, then projects the 44 selected manifest records into `.private/catalog.json`. It does not rehash source bytes or claim the September 2, 2026 selection is the latest edition. Titles, subject, format, type, source modification date and size are carried over. No raw paths, binary files or source text are copied. Records include guides, divided volumes and teaching materials. The content model supplies the six subject families; restricted and commercial-only records are excluded.

`.private/` is gitignored. Local review requires `LOCAL_CURATION_REVIEW=1`, binds to loopback through the review command, and is disabled on Vercel. It is not an authentication system and must not be exposed through tunnels or other hosting providers. The build refuses that flag on Vercel. Downloads remain unavailable in local review.

## Public resources

`src/content/public-catalog.json` is the sole public catalog. It is intentionally empty until titles/content and the exact editions are approved for public release. Public source code is visible on GitHub even before deployment; never put private documents or manifests in the repository.

After selecting an exact public edition, add a sanitized record:

```json
{
  "id": "a-stable-resource-id",
  "title": "Approved public title",
  "subject": "physiology",
  "kind": "study guide",
  "format": "PDF",
  "summary": "Approved short description.",
  "updatedAt": "2026-09-06",
  "bytes": 123456,
  "status": "public",
  "downloadUrl": "https://your-public-file-host.example/released/guide.pdf"
}
```

Supported subjects: anatomy, histology, cell-biology, biochemistry, physiology, genetics. Supported formats: PDF, DOCX, PPTX. `downloadUrl` is optional: an approved metadata-only record can be listed without a download. Use a permanent, deliberately public HTTPS URL; expiring signed links, raw Dropbox links and credentials are rejected. The site does not proxy or upload files. Provisioning a file host and uploading approved editions is a separate publication action.

Run `npm run content:check`, `npm test`, `npm run lint`, `npm run build` and `npm run test:e2e`. Review the diff and download destination before merging. JSON validation checks structure; it cannot itself establish publication rights or prove a URL serves the intended file.

## What remains for a private hosted library

Choose who can sign in, an identity provider, and private object storage. Protect both metadata routes and file downloads on the server, with per-user access checks. Keep the private metadata and documents outside this public GitHub repository. The local review route and Vercel's search-indexing controls are not substitutes for that system.

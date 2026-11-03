# Local candidate lesson review

This is a local authoring aid. It does not approve or publish lessons and it does not import source guides, images, source paths or provenance records into the public application. The existing `/review` boundary returns 404 on Vercel and when local review is disabled. Noindex is not authentication. Run the review server bound to loopback only; do not expose it to a network or include candidate files in a public repository.

After reviewing the input source and using local candidate JSON files, run:

```sh
node scripts/import-candidate-lessons.mjs /absolute/path/to/candidate.json /absolute/path/to/another-candidate.json
npm run build
npm run review
```

Open `http://127.0.0.1:3100/review/lessons`. The importer accepts review-required single records or a collection with a `lessons` array. It copies only the title, subject, objectives, sections, explained question and HTTPS reference metadata into ignored `.private/candidate-lessons.json`; source-guide metadata is discarded. It rejects duplicate IDs, invalid answers, private-path markers and unsafe reference URLs. These checks are not a complete privacy or scientific audit. Import is disabled on Vercel. Existing output is never overwritten; preserve or separately handle it before a future import.

The page is intended for qualified content review, not public delivery. Before release, reconcile current catalog overlap and source versions, obtain appropriate scientific, rights, privacy, editorial and accessibility review for the exact content, adapt cleared material to the public schema, then run the normal build, tests, preview and protected release process. Never copy `.private` into a public build or repository. A local review page, successful test or noindex directive is not release authorization.

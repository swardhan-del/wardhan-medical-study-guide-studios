# Content integration and release

See [Native library](NATIVE_LIBRARY.md) for the current public taxonomy, release gate and update workflow. The public catalog contains existing released web adaptations and one revision PDF; it is not the private source manifest.

## Private review

The existing content:import command may project the 44 private approved metadata records into .private/catalog.json for loopback-only review. That import does not authorize public publication. Private review remains disabled on Vercel and excluded from deployment traces. Never commit source paths or private files.

## Reconcile before integrating

Before preparing an integration, record these answers in the existing private curation register:

1. Does the material already exist in the source archive, with a stable provider identity and verified edition?
2. Does the website already teach the concept?
3. Which existing lesson and question IDs apply?
4. Does an existing revision already contain the proposed improvement?
5. Can the existing lesson be improved or referenced instead of creating another identity?
6. Are suitable existing images available, and is their public use cleared?
7. Is this a new concept or merely a different filename, format, subject placement or revision?
8. Does the exact proposed version have the required scientific, rights and public-release evidence?

Reuse canonical lesson IDs across subjects, course routes, related reading and search. Preserve routes, question IDs and saved progress. Keep editable manuscripts, printable outputs and retained historical revisions distinct; matching subject matter alone is not evidence of a disposable duplicate. Compare content and dependencies before proposing archival. Keep uncertain cases on hold.

The lesson validator rejects identical teaching and assessment payloads under different lesson IDs, including whitespace-only copies. This is a narrow accidental-copy check, not a semantic or scientific review. Review overlapping concepts manually and preserve legitimate shared references. Generated catalogs and search records must be updated through their existing generators, not removed independently.

When an anatomy review lesson uses an identical prerequisite section, its editable JSON may use `bodyRef` with the canonical `lessonId`, exact `stepTitle` and SHA-256 of that body. The existing anatomy generator resolves the reference into the same public teaching and printable manuscript. References must point directly to one literal body; missing, ambiguous, chained or changed references fail validation. A future body change requires deliberate review of every affected lesson. Shared storage does not remove the section from either learning journey or create a new lesson identity.

Keep archived, prepared, scientifically reviewed, rights-reviewed, publicly authorized, implemented, preview-verified and production-released states separate. Reconciliation never grants approval. Keep detailed source paths, provider metadata, review records and rollback evidence in the private curation workspace. Do not copy them into this repository or deployment. Build directories (including alternate `.next-*` directories), dependencies, private environments and diagnostic output remain excluded from deployment uploads.

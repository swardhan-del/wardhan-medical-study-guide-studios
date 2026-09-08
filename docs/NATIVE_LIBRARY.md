# Native library and publication boundary

The library uses version-controlled public metadata, with no runtime archive connection. Start at /library or /subjects, browse a subject, system and topic, then open /library/[id]. Existing anatomy, renal and practice URLs remain available. Root-relative links work on previews and a future custom domain.

## Reconciled release

The deployed baseline is cc02a695145ed205e51fe95b08507b7a5ffa727c from feat/curated-study-library in swardhan-del/wardhan-medical-study-guide-studios. The Dropbox checkout began on main at 27372b6 with a stale Vercel project link. The verified Vercel project is prj_hmL4Mgj5zTsHGekOgy9hT8hWgJxD. This change targets a feature-branch preview only.

The September 2 archive manifest authorizes 44 PRIVATE items, not public publication. The public archive folder is empty. The existing web release documents separately authorize explanatory adaptations, a revision PDF and selected illustrations. These are retained at their existing bytes. The new public-release.json pins every public asset by SHA-256 and every catalog ID. No new archive binary is copied. Candidate file records and private account navigation URLs have been removed from the current source tree; previous Git history is not rewritten.

The meaningful public organization retains subject/course distinctions, regional anatomy, histology tissue/organ/development areas, molecular mechanisms, metabolism, inheritance, immunity and physiological systems. It deliberately omits raw file trees, course handouts, private guide editions and administrative classifications. Empty subjects remain clearly marked; their unapproved files do not receive routes or search records.

## Add or extend content

1. Add a subject with a stable id, title, description and optional learningSubject in src/content/library-taxonomy.json. Add a catalog subject in scripts/catalog-schema.mjs and src/content/subjects.ts if this is a new catalog family.
2. Add a system/category node with parentId null. Add a topic with its parent node ID and the same subject. IDs are stable public slugs. Never use source paths as IDs. A node may list multiple resource IDs; shared courses can refer to the same released resource. Update directory-routes.json when adding subject routes.
3. For a lesson, extend library-lessons.json using the existing source, section, teaching steps, question, recall and related fields. Maintain source bibliography and lesson references. Run content:library to rebuild public-catalog.json. Route-backed lessons keep their existing native page and receive a resource detail page automatically.
4. Record a separate public release decision for an exact edition before adding it to public-release.json. Private approval, filenames and folder placement are insufficient. Store private provenance and source-to-delivery mappings outside Git, in the controlled source archive.
5. Add an approved resource ID to the release allowlist and at least one taxonomy topic. For a small released file, copy (never move) only that file to public/downloads, record its hash and bytes, and update the learning asset manifest and validator to support its explicitly approved type. The present downloadable release is the renal revision PDF. PDF viewing has an inline preview plus full-size and download fallbacks for mobile.
6. For new image/audio/video resources, add the reviewed MIME/format to the catalog schema and native viewer with image alt text or media captions/transcripts before release. Current images are viewed within their approved lessons. No standalone media release is currently approved.
7. Large files require separately provisioned public object storage and an explicit approved file-host policy, ideally behind a same-origin delivery route. Never use private archive URLs, expiring links or credentials. The image derivatives are small enough for the repository. Archive videos remain blocked by delivery hosting and content review; see VIDEO_PUBLICATION.md.
8. Run content:check, test, typecheck, lint, build and test:e2e. Review the public release diff and preview before any production promotion. Set NEXT_PUBLIC_SITE_URL to the custom HTTPS origin when connecting a custom domain; all navigation and bundled assets remain relative.

## Checks

The build validates taxonomy ancestry, cycles, public resource references and reachability; checks the release catalog allowlist; hashes every delivered asset; rejects private path fields and archive URLs in source; and excludes local review data from deployment traces. Browser tests cover desktop/mobile journeys, filtering, PDF viewing/download, 404s, links and keyboard access. No authentication or private hosted library is implied by a preview.

Educational image placements and the derivative workflow: [FIGURE_PLACEMENTS.md](FIGURE_PLACEMENTS.md). Video schema and delivery requirements: [VIDEO_PUBLICATION.md](VIDEO_PUBLICATION.md).

# Dropbox subject directory

## Plan and implementation

Use the existing Vercel hostname as the permanent working address. The Subjects page is the inventory entry point; website lessons remain available through Library and the related-lesson section of subject pages.

1. Enumerate the original medical subject folders and complete every Dropbox listing cursor. Include Biostatistics and the nested Microbiology/Antimicrobials collection. Exclude administrative, rendering, audit, working and duplicate-quarantine branches from the navigable teaching directory.
2. Preserve the folder hierarchy and add the curated concept library as a second collection. Keep distinct locations distinct; a directory is not evidence that copies are identical or that an edition is academically approved.
3. Expose ten subject views: macroscopic anatomy/embryology, microscopic anatomy/embryology I, microscopic anatomy/embryology II, molecular/cell biology, biochemistry, physiology, genetics, immunology, microbiology and biostatistics. Shared I–II and genetics/immunology collections appear in both views. Keep the original `/subjects/histology` overview address working.
4. Put each existing final-printable collection at the top. For subjects without a dedicated printable folder, state that explicitly and link their existing reference collection. Selected files directly inside printable/reference folders are also listed, preserving their edition filenames.
5. Provide folder expansion, cross-subject search, collection filters, empty-state reset and paginated search results. Links open Dropbox in a new tab; free web lessons remain a separate, clearly labeled section.

## Link and access model

The signed-in Dropbox UI was inspected at `/home/study%20guide`. Its actual links use `/home/<encoded path>` for folders and `/preview/<encoded path>?context=standalone_preview&role=personal` for files. The directory uses this observed navigation pattern with paths returned by complete Dropbox metadata listings. These are account navigation links, not public share links. They require the viewer's existing Dropbox access and do not grant any new access. No shared link was created, no recipients were added, and no sharing permissions changed. No source document bytes are bundled in GitHub or Vercel.

The website itself remains publicly reachable on its Vercel address. The directory publishes the requested academic folder names and navigation URLs. A visitor without the corresponding Dropbox access cannot use these URLs as public downloads. Links depend on folder paths: renaming or moving a source requires regenerating the directory.

## Source snapshots and updating

Read-only inventory files are retained outside the public checkout in the Dropbox `.codex_work` folder:

- `dropbox-directory-remote-snapshot-2026-09-06.json`: original folders, including explicitly complete pagination state.
- `dropbox-directory-curated-folders-2026-09-06.json`: the curated concept hierarchy.
- `dropbox-directory-guide-files-2026-09-06.json`: selected direct file listings.
- `dropbox-directory-generation-audit-2026-09-06.json`: counts and excluded paths.

`node scripts/generate-subject-directory.mjs` reads these snapshots and produces `src/content/subject-directory.json`. To update, refresh the Dropbox listings, complete pagination, inspect changes, update the snapshot date in the generator, regenerate, then run `npm test`, `npm run lint`, `npm run build` and the desktop/mobile browser suite. Deploy a fresh Production build after preview verification. No Dropbox credentials or new environment variables are needed at runtime. The inventory is a dated snapshot, not an automatic live synchronization service.

The build validates link origins, unique destinations, course membership and an acyclic hierarchy. Tests cover source-course distinctions, malicious or administrative destinations, folder expansion, search, filters, course routes, existing lesson navigation, desktop/mobile layout and the sitemap. Selected folder/file destinations are also checked in the authenticated Dropbox browser. Prior contact, nephron-diagram and saved-study audit improvements are retained from commit `c2daf5c`.

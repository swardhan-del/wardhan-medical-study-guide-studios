# Printable guide integration — 9 September 2026

Students can browse guide parts, jump to existing released lessons and visuals, and select parts for printing. The same part manifest controls navigation, printable dividers and the answer key. Every released native lesson belongs to exactly one printable part; shared concepts are not duplicated in the print collection.

## Source basis and limits

- Microscopic anatomy and embryology: 20 numbered folders in the divided Revision 4 guide, dated 3 August 2026. Their order and titles were inspected. This is a source-part mapping, not a claim that all content of those parts has been imported. Later teaching decks and revision files also exist.
- Biochemistry: text extracted through the Dropbox connector from the final designer-formatted guide. Fourteen editorial groups reflect observed section themes. They are not original chapter numbers. Placeholder front matter, extraction defects and unresolved statements mean the whole source is not release-ready.
- Anatomy, cell biology, physiology, genetics/immunology and biophysics: retain the released website teaching sequence. Chapter order has not been reconciled against every final source manuscript.
- The standalone visual curation model retrieved for this audit contains zero records. Existing released figures and videos remain available through guide-part links. The full STEM archive is not published by this change.
- Biostatistics has a source PDF but no dedicated released course; no new microbiology source root was found in the scoped census. These subjects are not represented as complete courses.

## Private evidence

A dated audit folder alongside the website checkout contains the file-level metadata inventory, source curation models, biochemistry extraction and screenshots. It is deliberately outside the repository and deployment. The reproducible census skips hidden folders and symlinks, includes final/print/divided/visual collections, and records read errors. Counts include rendered previews and duplicates; they are not counts of distinct study assets or cleared visuals.

Run `node scripts/audit-guide-sources.mjs <archive-root> <private-output.json>` to repeat the metadata census. It neither changes originals nor creates shared links. A metadata record is not a content or medical review.

## Validation

The content test ensures unique part IDs and exactly-once lesson coverage within the correct subject. Browser checks cover all seven guide pages on desktop and mobile, printable selection, hidden answers, print-only styling, and explicit histology gaps. Build checks retain the public asset allowlist and private-path protections.

## Remaining integration work

Read and reconcile the latest complete manuscripts across subjects, correct source defects, review each visual's provenance and teaching accuracy, then release additional lessons/assets through the existing allowlist. Do not equate a final filename, an inventory entry or private-site clearance with public release clearance. This release adds navigation and printable functionality around the currently released teaching content; it does not complete the full archive migration.

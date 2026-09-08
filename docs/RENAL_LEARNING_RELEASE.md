# Free renal learning release — 6 September 2026

The public site now offers a complete learning experience at `/learn/renal`: eight source-based lessons, 30 original multiple-choice questions explaining every option, a five-question shareable challenge, a two-page revision PDF, a resistance circuit, a ventilation model and six ABG cases. A browser-local dashboard supplies completion records, a weak-topic map and spaced question review. Eight oral prompts have self-assessment rubrics and follow-ups. Three original tubule schematics introduce histology recognition. The exam planner respects daily time budgets and retains its original dates.

## Source boundary and editorial status

Authoritative input: `08_WEB_LIBRARY_CURATION/03_APPROVED_PRIVATE_SITE/APPROVED_PRIVATE_SITE_MANIFEST.json` in the Dropbox study-guide workspace. Original manuscripts and slide files were read without changes. Public content consists of short authored adaptations and original diagrams, not a copy of a manuscript or course slide archive.

| Source | Curation ID | SHA-256 verified before adaptation |
| --- | --- | --- |
| Renal Physiology Revision 15, 2 September 2026, DOCX | ce804f6537146a34 | f7ad27d4532da97b0fd57347b2ccecf33fa3d2734c24549b2fc577563a6dedd6 |
| Microscopic Anatomy and Embryology I–II Revision 4, 2 August 2026, DOCX | b88b1cbb1791f4a6 | c0ffba3a4e2a859ca986439c287a87ce83c4ed41928566b20a676355c936cb9e |

The renal lessons map to chapters 28–33; each page gives its source section. The histology exercise maps to “Kidney and Nephron Histology,” especially tubular segments and practical identification. The renal source's detailed correction overrides the simplified legacy claim that efferent constriction always increases GFR. Additional checks: [NCBI renal blood flow and filtration](https://www.ncbi.nlm.nih.gov/books/NBK482248/) and [Merck acid–base disorders](https://www.merckmanuals.com/professional/nephrology/acid-base-regulation-and-disorders/acid-base-disorders).

Editorial status is disclosed as AI-assisted, source-checked educational adaptation. No independent clinical peer review is claimed. No patient diagnosis or treatment tool is provided. All quiz items have a valid lesson reference and a rationale for each option. A qualified subject reviewer should review the published teaching copy before it is adopted as an official course resource.

## Models and review logic

- The renal circuit holds arterial pressure at 100 and venous pressure at 0 in arbitrary units. Relative flow = 2/(Ra+Re); intermediate pressure = 100Re/(Ra+Re). It demonstrates resistance and pressure relationships, not patient RBF or GFR. GFR is explicitly not computed: filtration coefficient, oncotic pressure and Bowman-space pressure are omitted. Severe efferent constriction is explained in the adjacent source-based text.
- The ventilation model holds CO2 production and bicarbonate fixed. PaCO2 = 40/relative alveolar ventilation; pH = 6.1 + log10(24/(0.03PaCO2)). Buffering, renal compensation and disease dynamics are not simulated.
- Six fictional ABGs use internally consistent rounded values. Winter's range is applied only to metabolic-acidosis examples; respiratory cases and metabolic alkalosis use their appropriate teaching compensation rules.
- Wrong answers remain due; consecutive correct reviews use 1, 3, 7, 14, then 30 days. This is a transparent scheduling heuristic, not a validated personalized memory model. Latest attempts power the weak-topic map; completion is self-marked.
- Progress is browser-only. Parsing filters unknown IDs, invalid types, dates and oversized inputs. Storage failure preserves a usable in-memory session and shows a notice. Cross-tab storage changes update subscribers. JSON export is a record, not an import/sync system.
- Histology images are original SVG schematics with exaggerated clues, not photomicrographs. Existing third-party microscopy remains private.

## Public PDF gate

`public/downloads/renal-revision-sheet.pdf` is an explicitly released original derivative. Its exact path and SHA-256 are allowlisted in `src/content/public-learning-assets.json`; all other PDF/DOCX/PPTX/XLSX/ZIP files remain prohibited in `public/`. A changed PDF fails the content check until reviewed and rehashed. Rebuild with the bundled Python runtime and `scripts/build-renal-sheet.py`, render both pages, inspect, then update the hash. `output/` copies are excluded from Git and deployment.

## Discoverability and measurement

Public course and practice pages have canonical URLs and are in the sitemap. The course exposes truthful Course/LearningResource JSON-LD and a generated sharing image. Private review, reading list and personal study pages are excluded from indexing. Unknown renal routes return a real 404.

Vercel's included Web Analytics option was enabled on the existing Pro project, without the Analytics Plus add-on. The SDK activates only in production. Standard Vercel event usage pricing applies. Production events:

| Event | Meaning | Properties |
| --- | --- | --- |
| lesson_started | Lesson component viewed | lesson slug |
| lesson_completed | Learner marks lesson complete | lesson slug |
| quiz_started | First answer checked in a set | set ID |
| quiz_completed | Learner opens final results | set ID |
| challenge_shared | Challenge link copied successfully | fixed challenge ID |
| learning_day | First local recorded learning visit on a calendar date | returning boolean |

These are activity events, not proof of learning or exam readiness. Events can repeat across sessions and devices; the browser return flag is not cross-device retention. No answers, scores, drafts, exam dates or persistent student IDs are transmitted. Query strings and hash fragments are stripped. Private study routes are omitted from analytics. Do Not Track, Global Privacy Control and a browser opt-out are honored. Browser-only activity totals are clearly distinguished from aggregate Vercel reports.

Search Console uses a URL-prefix property for the current Vercel production hostname. `GOOGLE_SITE_VERIFICATION` is configured in Production and rendered through Next metadata. After deployment, verify ownership and submit `/sitemap.xml`. A custom domain is optional and still requires the owner's choice; change `NEXT_PUBLIC_SITE_URL`, update the PDF course URL and reverify the chosen domain when available.

## Validation

Run `npm test`, `npm run lint`, `npm run build`, then the desktop/mobile Playwright suite with the system Chrome executable. The suite covers public/private routing, new page layouts, challenge-to-mistake review, saved completion, invalid/blocked storage, circuit controls, ABG explanations, oral rubrics, histology clues, planner persistence, PDF delivery and metadata. Inspect course, activity and homepage screenshots. Production verification additionally checks Google verification output, canonical origin, robots, sitemap, analytics requests and the real public course flow.

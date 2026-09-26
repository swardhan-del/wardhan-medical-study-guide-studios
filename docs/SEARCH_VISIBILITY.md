# Public search visibility standard

Phase Eight starts from `e86352a` on main (completed Histology and Anatomy). Open later-phase branches are deliberately not pulled into this change. No approved lesson content, question IDs, source assets or release permissions are changed.

## One source of truth

`src/lib/search-pages.ts` registers every public HTML route. `searchMetadata(path)` supplies its title, summary, canonical, Open Graph and Twitter fields. Sitemap generation and request-level indexing policy use the same records. New pages must be registered; unknown routes fail closed for indexing.

- Use a distinct, descriptive title and an accurate summary of visible content. Retain the established lesson URL and title. Video titles identify the recap format.
- Canonicals use `NEXT_PUBLIC_SITE_URL`, then the Vercel project production domain, then the existing public Vercel domain. Local development alone uses localhost. Never use an ephemeral `VERCEL_URL` as the public origin.
- Configure the same public origin at build and runtime. On connecting a custom domain, deploy production with that HTTPS origin and redirect the former host in Vercel. Alternate hosts receive `noindex` as a fallback; canonical tags alone are not redirects.
- Every public page overrides the nested social metadata, including its own URL, title and description. Existing studio social images are reused with descriptive alt text; no new source imagery is published.
- Use `SearchBreadcrumbs` for a visible path and matching `BreadcrumbList`. Every authored library, renal and foundation lesson includes its own name as the final item, not only a parent topic.

## Audit and indexing decisions

| Page family | Search policy |
| --- | --- |
| Homepage, start, about, library, subjects, complete subject learning hubs | Index on the canonical production host |
| Authored library lessons, foundation lessons, renal course and lessons, useful practice, released videos | Index; unique metadata and canonical routes |
| Three guided topic sequences and their index | Index; connect existing lessons through preparation, study method, ordered steps and a review task |
| Taxonomy topic directories | Index only with at least two distinct indexable destinations; repeated destination sets are excluded |
| Empty subject directories | Noindex; keep available routes intact |
| Personal study, planner, map containing planned content, guide outlines, printable duplicate summaries, utility notices | Noindex; accessible to students |
| Legacy Anatomy interactive previews and source outlines | Noindex; full released Anatomy lessons remain discoverable |
| Catalogue aliases | Resolve existing aliases with HTTP 308 before streaming, omit aliases from sitemap, point metadata to actual destinations |
| Downloaded revision PDF | `X-Robots-Tag: noindex, follow`; index the useful resource landing page instead |
| Any query-string variation (except internal `_rsc`) | Canonical to clean route and `X-Robots-Tag: noindex, follow` in production |
| Preview, development, alternate deployment hosts, missing pages | Noindex; preview robots disallows all crawling |
| Private review and API | Disallowed in robots; hosted private review also remains inaccessible |

Production robots intentionally **allows `/study/<subject>`**. The old blanket `/study` block hid useful public learning hubs. Utility URLs remain crawlable so crawlers can read their noindex response. A noindex directive is not authentication or a confidentiality guarantee. Do not link or publish private source records; retain the existing release gates and Vercel preview protection.

Sitemaps contain only self-canonical, indexable routes. `lastmod` appears only where an existing editorial date is recorded; a build or deployment does not fabricate a content revision date. Preview sitemaps contain public canonical URLs for validation, are not advertised in preview robots, and carry preview noindex headers.

## Structured data and internal links

`src/lib/structured-data.ts` supplies schema-dts checked builders, and `StructuredData` safely serializes them. Supported patterns:

- `Organization` identifies the actual independent publisher, with no invented institution affiliation.
- `WebSite` names the public site. Do not add a `SearchAction` or promise a search feature not represented on the page.
- `LearningResource` describes the visible lesson, level, language, free access, real citations, and recorded time/date where available.
- `Course` describes the existing eight-lesson renal course and its lesson links.
- `BreadcrumbList` matches the visible breadcrumb order and canonical destinations.
- `CollectionPage` and ordered `ItemList` describe each curated topic sequence.

Do not invent reviewers, accreditations, ratings, upload dates or medical credentials. The videos have no verified upload-date records, so no `VideoObject` rich-result claim is added. Valid Schema.org markup does not guarantee Google rich results or indexing. JSON-LD must match visible content. Escape `<` and Unicode line separators before embedding JSON in a script.

Guides live at `/learn/topics/{tissue-identification,membrane-transport,dna-to-protein}`. Links from the homepage, library, relevant subject hubs and participating lessons give useful entry points and a route back. Their original study guidance uses the existing lesson summaries, review prompts and linked source records; it introduces no copied source material or new clinical claims. Add future topic pages only when there is a real, coherent sequence and useful original guidance.

## Validation

Run `npm run content:check`, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run test:e2e`.

- Unit tests cover registry uniqueness, lesson breadcrumbs, canonical aliases, sitemap eligibility, environment/domain/query indexing rules, metadata parity, schema shape, actual dates, and script escaping.
- Browser tests request every registered route, parse the delivered HTML and JSON-LD, compare metadata, check redirects, sitemap, robots, social images and noindex headers.
- Topic-page browser tests cover desktop/mobile layout, keyboard links, visible current breadcrumbs, round-trip navigation and axe WCAG A/AA checks.
- Typecheck validates schema vocabulary against `schema-dts`. This is not a Google rich-result certification. Optionally inspect deployed examples with the [Schema.org validator](https://validator.schema.org/) and [Google Rich Results Test](https://search.google.com/test/rich-results); LearningResource is not itself a promised Google rich-result feature.
- Verify a preview using authenticated Vercel tooling without disabling deployment protection. Before launch, verify production canonicals, robots and sitemap against the connected custom domain.

Reference policies: [Google robots meta and X-Robots-Tag](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag), [canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls), [structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies), [breadcrumbs](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb), [Schema.org LearningResource](https://schema.org/LearningResource).

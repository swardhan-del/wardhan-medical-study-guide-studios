# Exposure findings and proposed migration

Scope: focused subscription boundary review at main `16bd49374c25b22432e828f5f6ea5cf283d4be16`, plus the synthetic foundation change. This is not a new broad medical or rights audit.

## Observed public surfaces

| Surface | Evidence | Consequence |
| --- | --- | --- |
| Repository and reachable history | GitHub reports the repository public. `src/content/library-lessons.json` has 235 lessons; `src/content/anatomy-course.json` has 120 anatomy records (overlapping collections, not additive totals). Public lessons are also in `content/`. | Code access already reveals teaching text and answers independently of route protection. |
| Static lessons and printable guides | Existing `/library/[id]`, `/subjects/anatomy/[topic]`, `/learn/*` and `/study/[subject]/guide` rendering imports teaching data and produces public HTML/RSC. | Page navigation locks alone cannot remove cached or directly requested teaching output. |
| Client bundles and questions | `src/components/library-lesson.tsx` imports teaching/question resources, renders step bodies and recall answers, and passes material into interactive clients. Existing public quiz clients contain questions and answers. The built client chunks matched existing teaching terms; 593 static routes were generated, with zero protected member/account routes prerendered. | A browser visibility lock would still deliver the material. The new protected pilot uses a server-only data boundary instead. |
| Public search | `src/content/public-search.json` has 255 entries. Existing tests explicitly require search over teaching phrases. `src/lib/catalog.ts` joins search text to public records passed to the catalogue UI. | A member-only lesson could still leak through a public search bundle unless the index is replaced with safe metadata only. |
| Direct public files | 148 files: one PDF, 23 MP4 videos, 23 MP3 audio files, 23 VTT captions, 70 WebP, four PNG, three JPG and one SVG. The release ledger pins their bytes. Example: `/downloads/renal-revision-sheet.pdf`. | Asset URLs bypass page navigation. Captions/transcripts and responsive image variants require the same migration review as their parent lesson. |
| Indexing and old deployments | Existing sitemap lists teaching routes; current robots policy does not authorize access. Existing Vercel previews and production deployments retain prior artifacts. | Current build changes do not remove old build URLs, crawled copies, browser caches or downloads. |
| Private source boundary | `.private` and environment files are ignored/excluded; only `.env.example` is tracked among those paths. No `.private` commits were found in reachable history. Existing docs acknowledge removed historical source/account metadata. | This limited check does not certify the entire public history free of private metadata; it establishes that already-published teaching and earlier metadata need migration planning. |

Representative oldest reachable changes for the inspected paths:

- `b3623ff`: public library lessons, 6 September 2026.
- `8ebc3a7`: public teaching search index, 9 September 2026.
- `6f0fa22`: public renal revision PDF, 6 September 2026.
- `5141854`: public PCR recap video, 8 September 2026.

No new teaching material, real private asset, source manuscript, private plan, source path inventory or secret is included in this change. Synthetic payload markers are checked against public build output. The existing public assets and release ledger are unchanged.

## Proposed migration, requiring separate approval

1. Freeze a reviewed catalogue of stable lesson IDs, ordered module membership, prerequisites, source hashes and commercial rights. Keep the complete source/rights register private. Mark previously public works as previously disclosed; do not sell secrecy as their benefit.
2. Decide the treatment of existing public material and communicate any access change. Future subscription value should be the maintained, reviewed learning library and services; prior copies cannot be recalled. Do not silently renumber, remove or split learning sequences.
3. Retain a public code repository only if it contains application code, public descriptive metadata and synthetic fixtures. Put real future member content in a private content store or separately approved private repository. Changing visibility of this repository or rewriting history needs a distinct decision and cannot erase forks, clones or third-party caches. This change does neither.
4. Create a public catalogue projection with title, stable ID, concise non-teaching overview, sequence position and membership description only. Remove full-body search text, answers, transcripts, figures and download URLs from that projection and its client props. Member search must authorize server-side and filter by current module grants before returning results.
5. Replace each teaching route's data loader with the central membership check and private content reader. Preserve existing URLs/IDs through server-controlled mapping. Cover printable guides, quiz APIs, answers, image optimisation, video/audio/caption URLs, manifests and related-resource previews. Never rely on middleware alone or static page wrappers.
6. Move approved asset derivatives to a private store, preserving original source files and rights records. Map opaque asset IDs to fixed private keys; deny arbitrary paths and remote URLs. Authorize GET, HEAD, range and streaming requests. Use a short-lived media-token design only after its cache/revocation limits are accepted.
7. With explicit release approval, remove superseded public assets/build outputs and teaching sitemap entries, retire affected legacy deployments/aliases, and request cache/search removal where available. Retain safe metadata pages or authorized redirects at stable lesson URLs. Old publicly distributed copies remain outside technical control.
8. Before rollout, test anonymous, wrong-tier, expired, canceled, revoked and verifier-outage requests against HTML, RSC, client JS, search indexes, public files, private storage direct URLs, old URLs and CDN caches. Then test valid accounts, sequence continuity and accepted commercial rules in test mode. Separate approval is required for production.

Acceptance: an unauthenticated or unentitled requester receives no protected teaching bytes from any newly controlled delivery surface; the public repository/current deploy contains only safe public data and synthetic fixtures; the known historical disclosure remains documented, not claimed erased.

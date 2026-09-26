# Search Console after connecting a custom domain

The current public origin is `https://wardhan-medical-study-guide-studios.vercel.app`. No custom domain, Google ownership or indexing submission is claimed by this change. Preview builds stay noindex. Do not submit a private preview to a search engine.

## Deployment prerequisites (maintainer)

Connect the intended custom domain to this existing Vercel project, set `NEXT_PUBLIC_SITE_URL` to its canonical HTTPS origin for production and preview builds, and redeploy. Redirect alternative hosts to the canonical domain in Vercel. Preserve preview deployment protection. This PR does not change domains, DNS or production.

Verify production returns 200 for a flagship lesson, uses the custom origin in canonical/OG/JSON-LD links, and allows indexing only for complete public content. Check `/robots.txt` advertises the custom-domain `/sitemap.xml`, and that the sitemap contains neither redirects nor personal, preview or incomplete pages. A preview must still return `X-Robots-Tag: noindex` even though its canonical points at production.

## The one manual owner action: verify domain ownership

In [Google Search Console](https://search.google.com/search-console), add a **Domain property** for the connected domain (without a scheme or path). Copy the unique TXT verification record Google displays into that domain’s DNS provider. Return to Search Console and select **Verify** once DNS has propagated. Keep that TXT record in place after verification.

This is one owner verification procedure; it requires access to the correct Google account and DNS zone. Only use the exact record supplied by Google. Do not share passwords, replace unrelated DNS records or invent a verification token. A Domain property covers subdomains and HTTP/HTTPS. The existing optional `GOOGLE_SITE_VERIFICATION` HTML token supports URL-prefix properties; it is not a substitute for the Domain property's DNS verification.

The site already advertises its sitemap in production robots, so no second owner setup action is required for sitemap discovery. Optionally submit `sitemap.xml` in the verified property's Sitemaps report for explicit submission status, and inspect a flagship lesson with URL Inspection. An automatically discovered sitemap may not appear as a manually submitted sitemap. Neither sitemap submission nor requesting indexing guarantees inclusion or ranking.

After verification, the owner can grant a maintainer access through Search Console's normal permissions. Monitor indexing and canonical selection there; keep duplicate, personal and incomplete URLs excluded. Do not treat search traffic as proof of educational quality or claim rich-result eligibility from syntactically valid markup alone.

Official instructions: [Add a website property](https://support.google.com/webmasters/answer/34592?hl=en), [verify ownership](https://support.google.com/webmasters/answer/9008080?hl=en), [Sitemaps report](https://support.google.com/webmasters/answer/7451001?hl=en), [URL Inspection](https://support.google.com/webmasters/answer/9012289?hl=en).

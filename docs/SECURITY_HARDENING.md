# Security hardening — 10 September 2026

Production baseline: `c10b9e0b01e8167461c077cfa11a4f4d11bf09f5`.

The review found no demonstrated exploitable vulnerability in the inspected request, rendering, private-review and public-release boundaries. The production dependency audit reported zero known vulnerabilities. These are bounded checks, not a guarantee against future or undiscovered flaws.

The response policy now restricts scripts, connections, images, video, frames and objects to this origin (images also permit data/blob URLs). Inline event handlers, production eval, external form submission and base-URL rewriting are blocked. Static Next.js bootstrap scripts and inline styles remain allowed; this is not a strict nonce-based CSP. The PDF download directory permits same-origin embedding so the native document reader continues to work; other pages deny framing. Public media currently uses same-origin delivery. New external media providers require a deliberate policy update and browser validation.

CI checks production dependencies for high/critical advisories. Browser regression tests verify private paths remain inaccessible, CSP blocks event handlers and external scripts, and lessons, PDF responses and video metadata remain usable on desktop and mobile. Build checks verify approved resource/asset inventories, hashes, private-path exclusion and deployment traces.

Vercel account inspection found no custom WAF rules, drafts or system bypass entries; Attack Mode was off. Vercel supplies platform DDoS mitigation. No load attack or penetration test was performed, and absence of custom rules is not itself a vulnerability. Deployment-protection automation access is separate from firewall system bypasses. Account MFA, external recipient security and unknown dependency vulnerabilities are outside these checks.

The original workspace checkout was older and had missing imported files and a Git object read error. It was preserved. Remediation and runtime tests use a clean Dropbox checkout matching the production baseline; the separately registered Codex Security scan of the older checkout must retain partial coverage.

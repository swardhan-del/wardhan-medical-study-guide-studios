# Deploying the study library

This repository can deploy as a public website without any required API keys, database, payment service or login provider. The 44-record curated private collection remains local; deploying this repository does not publish those documents or create an authenticated private library.

## Project setup

1. In Vercel, select the intended team and look for `wardhan-medical-study-guide-studios` first. Open it if it exists. Do not create a duplicate.
2. If it does not exist, select **Add New → Project**, choose the GitHub repository `swardhan-del/wardhan-medical-study-guide-studios`, and select **Import**. If absent, use **Adjust GitHub App Permissions** / **Configure GitHub App** to grant Vercel access to this exact repository.
3. Framework: **Next.js**. Root directory: repository root (`./`). Build command: **npm run build**. Output directory: framework default. Node.js: **24.x**. Install command: **npm ci** (or the detected npm default).
4. The first dashboard import normally creates a production deployment from the production branch. For a preview-first review, prepare the project without deploying (the CLI can do this), connect the repository, and deploy the feature branch as Preview. Keep `main` as the Production Branch.

## Environment variables

Open **Project → Settings → Environment Variables**. None are required for the current public site.

| Key                         | Value                                                                           | Where                                                                                                                          |
| --------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`      | Optional final HTTPS origin, e.g. `https://your-domain.example`, without a path | Production. Leave unset for the generated Vercel domain. Usually leave unset in Preview so sharing URLs refer to that preview. |

The approved public creator name and contact email are maintained in `src/content/studio.ts`. Contact does not require an environment variable.

Do not put secrets in `NEXT_PUBLIC_*`: those values are public. Do not add Dropbox credentials, local file paths, the local `.env.local` contents, or `LOCAL_CURATION_REVIEW`. The latter causes a Vercel build failure intentionally. Vercel supplies `VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL` and `VERCEL_ENV` automatically.

## Preview → production

1. Push the integration branch to GitHub. Once Git integration is connected, non-production branch pushes produce Preview deployments. Alternatively run `vercel deploy` from the linked repository checkout.
2. Open **Project → Deployments**, open the Preview, wait for **Ready**, then click **Visit**. Check desktop/mobile navigation, search, subjects, reading list, contact and released file links. The preview public library is empty until public records are explicitly released.
3. When satisfied, merge the reviewed branch into `main`. With Git integration this starts the Production build automatically. Alternatively select the tested Preview’s menu → **Promote to Production**, which builds using Production environment variables; keep Git history aligned with the released code.
4. Wait for Production to become **Ready** and select **Visit**. Verify the permanent production domain, not only the unique preview URL.
5. Use **Redeploy** only after changing environment variables or when intentionally rebuilding the same commit. You do not need a separate redeploy after every preview or promotion.
6. A custom domain is optional. Add it in **Settings → Domains**, apply the DNS records Vercel provides, wait for verification, set `NEXT_PUBLIC_SITE_URL` to that origin, and redeploy once.

Preview pages use noindex metadata and headers. Noindex is a search-engine preference, not access control. Configure Vercel Deployment Protection if you want the public-code preview accessible only to your team. The `/review` routes always return 404 on Vercel, even if a private metadata file is accidentally included.

## Official references

- https://vercel.com/docs/deployments/overview
- https://vercel.com/docs/git
- https://vercel.com/docs/deployments/promote-preview-to-production
- https://vercel.com/docs/environment-variables

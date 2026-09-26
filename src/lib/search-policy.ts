import { searchPage } from "./search-pages.ts";

export function shouldNoIndex(path: string, query: URLSearchParams, hostname: string, origin: string, production: boolean): boolean {
  if (!production || hostname !== new URL(origin).hostname || !searchPage(path)?.index) return true;
  // React's internal navigation requests do not create a separate public page.
  return [...query.keys()].some((key) => key !== "_rsc");
}

export function robotsPolicy(origin: string, production: boolean) {
  return {
    rules: production
      ? { userAgent: "*", allow: "/", disallow: ["/review", "/api/"] }
      : { userAgent: "*", disallow: "/" },
    sitemap: production ? `${origin}/sitemap.xml` : undefined,
  };
}

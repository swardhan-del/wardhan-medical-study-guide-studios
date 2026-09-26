import type { MetadataRoute } from "next";
import { getSiteUrl, isIndexable } from "@/lib/site-url";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: isIndexable()
      ? {
          userAgent: "*",
          allow: "/",
          disallow: ["/review", "/reading-list", "/study", "/member", "/account", "/api/member", "/api/account"],
        }
      : { userAgent: "*", disallow: "/" },
    sitemap: isIndexable() ? `${getSiteUrl()}/sitemap.xml` : undefined,
  };
}

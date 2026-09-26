import type { MetadataRoute } from "next";
import { getSiteUrl, isIndexable } from "@/lib/site-url";
import { robotsPolicy } from "@/lib/search-policy";

export default function robots(): MetadataRoute.Robots {
  return robotsPolicy(getSiteUrl(), isIndexable());
}

export function getSiteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const fallback =
    process.env.VERCEL_ENV === "preview"
      ? process.env.VERCEL_URL
      : process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  const value =
    configured || (fallback ? `https://${fallback}` : "http://localhost:3000");
  const url = new URL(value);
  if (
    !["https:", "http:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash ||
    (process.env.VERCEL && url.protocol !== "https:")
  )
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be an HTTPS origin, for example https://example.com, without a path or credentials.",
    );
  return url.origin;
}
export function isIndexable() {
  return process.env.VERCEL_ENV === "production";
}

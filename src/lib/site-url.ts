const stripTrailingSlash = (value: string) => value.replace(/\/$/, "");

export function getSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (configuredUrl) return stripTrailingSlash(configuredUrl);

  const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (productionUrl) return `https://${stripTrailingSlash(productionUrl)}`;

  const deploymentUrl = process.env.VERCEL_URL;
  if (deploymentUrl) return `https://${stripTrailingSlash(deploymentUrl)}`;

  return "http://localhost:3000";
}

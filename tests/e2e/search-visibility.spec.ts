import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { searchPages, indexablePages } from "../../src/lib/search-pages";
import { topicGuides } from "../../src/content/topic-guides";

// Inspect delivered HTML, including metadata for every route, not just helper output.
test("every public route delivers its own canonical, social metadata and valid JSON-LD", async ({ request, page }, info) => {
  test.skip(info.project.name !== "desktop", "Route metadata is independent of viewport");
  test.setTimeout(240000);
  for (const route of searchPages) {
    const response = await request.get(route.path, { headers: { "User-Agent": "Twitterbot" }, maxRedirects: 0 });
    if (route.canonical && route.canonical !== route.path) {
      expect([307, 308], route.path).toContain(response.status());
      expect(response.headers().location.split("#")[0], route.path).toBe(route.canonical);
      continue;
    }
    expect(response.status(), route.path).toBe(200);
    expect(response.headers()["x-robots-tag"], route.path).toContain("noindex");
    const parsed = await page.evaluate(html => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const meta = (selector: string) => doc.querySelector(selector)?.getAttribute("content");
      return {
        title: doc.querySelector("title")?.textContent,
        description: meta('meta[name="description"]'),
        canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href"),
        ogTitle: meta('meta[property="og:title"]'), ogDescription: meta('meta[property="og:description"]'), ogUrl: meta('meta[property="og:url"]'), ogImage: meta('meta[property="og:image"]'),
        twitterTitle: meta('meta[name="twitter:title"]'), twitterDescription: meta('meta[name="twitter:description"]'),
        robots: meta('meta[name="robots"]'), h1: doc.querySelector("h1")?.textContent,
        schemas: [...doc.querySelectorAll('script[type="application/ld+json"]')].map(script => JSON.parse(script.textContent!)),
        breadcrumbs: [...doc.querySelectorAll('nav[aria-label="Breadcrumb"] [aria-current="page"]')].map(el => el.textContent),
      };
    }, await response.text());
    expect(parsed.title, route.path).toBe(`${route.title} | Study Guide Studios`);
    expect(parsed.description, route.path).toBe(route.description);
    expect(new URL(parsed.canonical!).pathname, route.path).toBe(route.path);
    expect(new URL(parsed.canonical!).search).toBe("");
    expect(parsed.ogUrl, route.path).toBe(parsed.canonical);
    expect(parsed.ogTitle, route.path).toBe(parsed.title); expect(parsed.twitterTitle, route.path).toBe(parsed.title);
    expect(parsed.ogDescription, route.path).toBe(route.description); expect(parsed.twitterDescription, route.path).toBe(route.description);
    expect(new URL(parsed.ogImage!).pathname, route.path).toMatch(/opengraph-image/);
    expect(parsed.robots, route.path).toContain("noindex");
    expect(parsed.schemas.length, route.path).toBeGreaterThan(0);
    for (const schema of parsed.schemas) {
      expect(schema["@context"], route.path).toBe("https://schema.org");
      const nodes = schema["@graph"] ?? [schema];
      for (const node of nodes) {
        expect(["Organization", "WebSite", "LearningResource", "Course", "BreadcrumbList", "CollectionPage", "ItemList"], route.path).toContain(node["@type"]);
        if (node.url) expect(new URL(node.url).origin, route.path).toBe(new URL(parsed.canonical!).origin);
        if (node["@type"] === "LearningResource" || node["@type"] === "Course") {
          expect(node.name, route.path).toBe(parsed.h1); expect(node.url, route.path).toBe(parsed.canonical);
          expect(node.isAccessibleForFree).toBe(true);
          if (node["@type"] === "LearningResource") expect(node.citation, route.path).toBeTruthy();
        }
        if (node["@type"] === "BreadcrumbList") {
          const items = node.itemListElement;
          expect(items.map((item: {position: number}) => item.position)).toEqual(items.map((_: unknown, i: number) => i+1));
          expect(items.at(-1).item, route.path).toBe(parsed.canonical);
          expect(parsed.breadcrumbs, route.path).toContain(items.at(-1).name);
        }
      }
    }
  }
});

test("sitemap, robots, query variants, redirects and missing pages agree with indexing policy", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const urls = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]));
  expect(urls.map(url => url.pathname).sort()).toEqual(indexablePages.map(page => page.path).sort());
  expect(new Set(urls.map(url => url.href)).size).toBe(urls.length);
  expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");
  for (const path of ["/library?q=heart", "/library?subject=anatomy", "/learn/topics?utm_source=test", "/study", "/downloads/renal-revision-sheet.pdf"]) {
    expect((await request.get(path)).headers()["x-robots-tag"], path).toContain("noindex");
  }
  for (const path of ["/review", "/library/private", "/learn/topics/missing"]) {
    const res = await request.get(path); expect(res.status(), path).toBe(404); expect(res.headers()["x-robots-tag"], path).toContain("noindex");
  }
  for (const path of ["/opengraph-image", "/learn/renal/opengraph-image"]) {
    const response = await request.get(path); expect(response.status()).toBe(200); expect(response.headers()["content-type"]).toContain("image/");
  }
});

for (const guide of topicGuides) test(`${guide.slug}: visible sequence, keyboard navigation, mobile layout and accessibility`, async ({ page }, info) => {
  await page.goto(`/learn/topics/${guide.slug}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(guide.title);
  await expect(page.locator(".topic-sequence-steps > li")).toHaveCount(guide.stages.length);
  await expect(page.getByRole("navigation", { name: "Breadcrumb" }).locator('[aria-current="page"]')).toHaveText(guide.title);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);
  await page.keyboard.press("Tab"); await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  await page.keyboard.press("Enter");
  await page.screenshot({ path: info.outputPath(`${guide.slug}.png`), fullPage: true });
  const first = page.locator(".topic-sequence-steps > li").first().getByRole("link").first();
  await first.focus(); await page.keyboard.press("Enter");
  await expect(page).toHaveURL(new RegExp(`/library/${guide.stages[0].id}$`));
  await expect(page.getByRole("region", { name: "Guided topic sequences" }).getByRole("link", { name: guide.title, exact: true })).toBeVisible();
  await page.getByRole("region", { name: "Guided topic sequences" }).getByRole("link", { name: guide.title, exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/learn/topics/${guide.slug}$`));
});

test("topic sequences are discoverable from homepage, library and the relevant subject hubs", async ({ page }) => {
  for (const path of ["/", "/library", "/study/histology", "/study/physiology", "/study/genetics"]) {
    await page.goto(path);
    await expect(page.getByRole("region", { name: "Guided topic sequences" })).toBeVisible();
    await page.getByRole("link", { name: "Explore all guided topic sequences" }).click();
    await expect(page).toHaveURL(/\/learn\/topics$/);
    await expect(page.getByRole("heading", { level: 2 })).toHaveCount(3);
  }
});

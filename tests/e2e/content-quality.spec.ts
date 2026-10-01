import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

for (const route of ["/library/physiology-membrane-foundations", "/library/connective-tissue", "/library/genetics-genome-foundations", "/learn/renal/kidney-map"]) {
  test(`lesson transparency, valid learning links and mobile access: ${route}`, async ({ page }, info) => {
    const errors: string[] = [];
    page.on("pageerror", error => errors.push(error.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    const panel = page.locator(".lesson-transparency");
    await panel.locator("summary").focus();
    await page.keyboard.press("Enter");
    await expect(panel).toHaveAttribute("open", "");
    await expect(panel).toContainText("independent clinical review has not been completed");
    await expect(panel).toContainText("Last updated:");
    await expect(panel.getByRole("heading", { name: "Learning objectives", exact: true })).toBeVisible();
    const links = await panel.getByRole("navigation", { name: "Related learning" }).getByRole("link").evaluateAll(nodes => nodes.map(node => (node as HTMLAnchorElement).pathname));
    expect(links.length).toBeGreaterThan(0);
    for (const link of new Set(links)) expect((await page.request.get(link)).status()).toBe(200);
    expect((await new AxeBuilder({ page }).include(".lesson-transparency").analyze()).violations).toEqual([]);
    if (info.project.name === "mobile") {
      await page.setViewportSize({ width: 320, height: 844 });
      await page.evaluate(() => { document.documentElement.style.fontSize = "20px"; });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    expect(await panel.innerText()).not.toMatch(/\.private|Dropbox|source-intake|Semifinal_Master|peer reviewed/i);
    await panel.screenshot({ path: info.outputPath("about-lesson.png") });
    expect(errors).toEqual([]);
  });
}

test("private intake and conversion queue have no public routes or sitemap entries", async ({ request }) => {
  for (const path of ["/.private/source-intake/2026-10-01/", "/.private/conversion-queue/2026-10-01/", "/library/cell-membrane-transport-and-permeability"]) expect((await request.get(path)).status()).toBe(404);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toMatch(/\.private|source-intake|conversion-queue/);
  const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  expect(new Set(urls).size).toBe(urls.length);
});

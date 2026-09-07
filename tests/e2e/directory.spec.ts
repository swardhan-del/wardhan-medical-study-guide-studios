import { test, expect } from "@playwright/test";
import taxonomy from "../../src/content/library-taxonomy.json";
import catalog from "../../src/content/public-catalog.json";
test("library to subject to system to topic to PDF and download", async ({
  page,
  request,
}, info) => {
  await page.goto("/library");
  await page
    .getByRole("navigation", { name: "Explore subjects and topics" })
    .getByRole("link", { name: "Medical Physiology", exact: true })
    .click();
  await expect(page).toHaveURL(/subjects\/physiology$/);
  await page
    .getByRole("heading", {
      name: "Renal and acid-base physiology",
      exact: true,
    })
    .getByRole("link")
    .click();
  await expect(page).toHaveURL(/topics\/physiology-renal$/);
  await page
    .getByRole("heading", {
      name: "Renal physiology revision sheet",
      exact: true,
    })
    .first()
    .getByRole("link")
    .click();
  await expect(page).toHaveURL(/topics\/topic-renal-revision-sheet$/);
  await page
    .getByRole("heading", {
      name: "Renal physiology revision sheet",
      exact: true,
    })
    .getByRole("link")
    .click();
  await expect(page).toHaveURL(/library\/renal-revision-sheet$/);
  await expect(page.locator('object[type="application/pdf"]')).toBeVisible();
  const download = page.waitForEvent("download");
  await page.getByRole("link", { name: "Download PDF", exact: true }).click();
  expect((await download).suggestedFilename()).toBe("renal-revision-sheet.pdf");
  const pdf = await request.get("/downloads/renal-revision-sheet.pdf");
  expect(pdf.status()).toBe(200);
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({ path: info.outputPath("native-resource.png") });
});
test("topic filtering, lesson journey, breadcrumbs and related links", async ({
  page,
}) => {
  await page.goto("/subjects");
  await page.getByRole("searchbox", { name: "Search topics" }).fill("renal");
  await page.getByLabel("Topic subject").selectOption("physiology");
  await page
    .locator(".native-topic-results")
    .getByRole("link", { name: "Renal and acid-base physiology", exact: true })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }),
  ).toContainText("Medical Physiology");
  await page.getByLabel("Search resources").fill("clearance");
  await page
    .locator(".resource-card")
    .getByRole("link", { name: "Open lesson", exact: false })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "clearance",
  );
  await page.getByRole("link", { name: "Open lesson", exact: false }).click();
  await expect(page).toHaveURL(/learn\/renal\/filtration-and-clearance$/);
});
test("all native routes and public assets resolve without archive exposure", async ({
  request,
}, info) => {
  test.setTimeout(180000);
  if (info.project.name !== "desktop") return;
  for (const url of [
    ...taxonomy.subjects.map((s) => "/subjects/" + s.id),
    ...taxonomy.nodes.map((n) => "/topics/" + n.id),
    ...catalog.records.map((r) => "/library/" + r.id),
  ]) {
    const res = await request.get(url);
    expect(res.status(), url).toBe(200);
    const html = await res.text();
    expect(html, url).not.toMatch(
      /https?:[^"<>]*dropbox|original_dropbox_path|destination_dropbox_path|study%20guide/,
    );
  }
  for (const url of [
    "/topics/missing",
    "/videos/unapproved",
    "/library/private",
    "/review",
  ])
    expect((await request.get(url)).status()).toBe(404);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain("/topics/physiology-renal");
  expect(sitemap).not.toContain("dropbox");
});

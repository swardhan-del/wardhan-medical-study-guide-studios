import { test, expect } from "@playwright/test";

test("medical directory lists the real courses and searches Dropbox subtopics", async ({
  page,
}, info) => {
  await page.goto("/subjects");
  await expect(page.locator(".directory-subject-card")).toHaveCount(10);
  await expect(
    page.getByRole("link", {
      name: "Microscopic Anatomy & Embryology II",
      exact: true,
    }),
  ).toBeVisible();
  await page.screenshot({
    path: info.outputPath("subject-directory.png"),
    fullPage: true,
  });
  const browser = page.locator(".directory-browser:visible");
  await browser.getByRole("searchbox").fill("complement");
  await browser.getByLabel("Directory subject").selectOption("immunology");
  await expect(browser.locator(".directory-results>li").first()).toBeVisible();
  const links = await browser
    .locator(".directory-results a")
    .evaluateAll((a) =>
      a.map((e) => ({
        href: e.getAttribute("href"),
        target: e.getAttribute("target"),
      })),
    );
  expect(links.length).toBeGreaterThan(0);
  expect(
    links.every(
      (l) =>
        l.href?.startsWith("https://www.dropbox.com/home/study%20guide/") &&
        l.target === "_blank",
    ),
  ).toBe(true);
  await browser.getByRole("searchbox").fill("no-such-medical-concept-999");
  await expect(
    browser.getByRole("heading", { name: "No matching folders or guides." }),
  ).toBeVisible();
  await browser
    .getByRole("button", { name: "Reset directory filters" })
    .click();
  await expect(browser.getByRole("searchbox")).toHaveValue("");
  await expect(browser.getByLabel("Directory subject")).toHaveValue("");
});

test("physiology preserves folder hierarchy and printable-guide destinations", async ({
  page,
}, info) => {
  await page.goto("/subjects/physiology");
  const directory = page.locator("#dropbox-directory:visible");
  await expect(
    directory.getByRole("link", { name: /^Start here Final printable/ }),
  ).toHaveAttribute(
    "href",
    /05_Medical_Physiology\/06_Final_Printable_Guides$/,
  );
  await directory
    .getByRole("button", { name: "Expand Subject folder", exact: true })
    .click();
  await directory
    .getByRole("button", { name: "Expand Final Printable Guides", exact: true })
    .click();
  await expect(
    directory.getByRole("link", {
      name: /^Divided Study Guide Medical Physiology/,
    }),
  ).toHaveAttribute("href", /04_Divided_Study_Guide_Medical_Physiology$/);
  await directory.getByRole("button", { name: "Expand all folders" }).click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await directory.getByRole("button", { name: "Collapse all folders" }).click();
  await directory.getByRole("searchbox").fill("renal circulation");
  await expect(
    directory.locator(".directory-results>li").first(),
  ).toBeVisible();
  await directory.scrollIntoViewIfNeeded();
  await page.screenshot({ path: info.outputPath("physiology-directory.png") });
});

test("course views and reference-only subjects open without false availability notices", async ({
  page,
}) => {
  for (const [id, title] of [
    ["histology-i", "Microscopic Anatomy & Embryology I"],
    ["histology-ii", "Microscopic Anatomy & Embryology II"],
    ["immunology", "Immunology"],
    ["microbiology", "Microbiology & Antimicrobials"],
    ["biostatistics", "Biostatistics"],
  ]) {
    expect((await page.goto(`/subjects/${id}`))?.status()).toBe(200);
    await expect(
      page.getByRole("heading", { name: title, level: 1, exact: true }),
    ).toBeVisible();
    await expect(page.locator("#dropbox-directory:visible")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "This collection is in preparation." }),
    ).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.goto("/subjects/microbiology");
  await page
    .locator("#dropbox-directory")
    .getByRole("searchbox")
    .fill("antibiotics");
  await expect(page.locator(".directory-results a").first()).toHaveAttribute(
    "href",
    /^https:\/\/www\.dropbox\.com\/preview\/study%20guide\/.*Antibiotics\.pdf\?context=standalone_preview&role=personal$/,
  );
});

test("directory search paginates and the new course routes enter the sitemap", async ({
  page,
  request,
}) => {
  await page.goto("/subjects");
  const browser = page.locator(".directory-browser:visible");
  await browser.getByRole("searchbox").fill("physiology");
  await expect(browser.locator(".directory-results>li")).toHaveCount(30);
  await browser
    .getByRole("button", { name: "Show more directory results" })
    .click();
  await expect(browser.locator(".directory-results>li")).toHaveCount(60);
  await browser.getByLabel("Collection type").selectOption("printable");
  await expect(browser.getByRole("status")).not.toHaveText("0 matching links");
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const slug of [
    "histology-i",
    "histology-ii",
    "immunology",
    "microbiology",
    "biostatistics",
  ])
    expect(sitemap).toContain(`/subjects/${slug}`);
  expect(sitemap).not.toContain("dropbox.com");
});

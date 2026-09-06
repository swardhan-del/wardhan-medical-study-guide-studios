import { test, expect } from "@playwright/test";
test("public routes render and fit the viewport without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const route of [
    "/",
    "/library",
    "/subjects",
    "/subjects/anatomy",
    "/subjects/anatomy/musculoskeletal",
    "/subjects/physiology",
    "/reading-list",
    "/contact",
    "/privacy",
    "/about",
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  expect(errors).toEqual([]);
});
test("subject cards lead to subject pages and reading list survives invalid browser data", async ({
  page,
}) => {
  await page.goto("/subjects");
  await page
    .getByRole("link", { name: "Explore subject for Medical Physiology" })
    .click();
  await expect(page).toHaveURL(/\/subjects\/physiology$/);
  await page.evaluate(() =>
    localStorage.setItem("wardhan-reading-list:v1", "{invalid"),
  );
  await page.goto("/reading-list");
  await expect(page.getByText("A place for your next session.")).toBeVisible();
});
test("private review and unknown guide IDs cannot be accessed in a public build", async ({
  request,
}) => {
  for (const route of [
    "/review",
    "/review/test-anatomy",
    "/library/does-not-exist",
    "/subjects/does-not-exist",
    "/subjects/anatomy/does-not-exist",
    "/subjects/anatomy/musculoskeletal/does-not-exist",
  ])
    expect((await request.get(route)).status()).toBe(404);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("/review");
  expect(sitemap).not.toContain("/Users/");
  const response = await request.get("/");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["x-robots-tag"]).toBe("noindex, nofollow");
});
test("keyboard users can skip navigation", async ({ page }) => {
  await page.goto("/library");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#main-content$/);
});
test("reading list clearing is deliberate and persists after reload", async ({
  page,
}) => {
  await page.goto("/reading-list");
  await page.evaluate(() =>
    localStorage.setItem(
      "wardhan-reading-list:v1",
      JSON.stringify(["a-saved-resource"]),
    ),
  );
  await page.reload();
  await page
    .getByRole("button", { name: "Clear reading list", exact: true })
    .click();
  await page.getByRole("button", { name: "Keep list" }).click();
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("wardhan-reading-list:v1") ?? "[]"),
    ),
  ).toEqual(["a-saved-resource"]);
  await page
    .getByRole("button", { name: "Clear reading list", exact: true })
    .click();
  await page.getByRole("button", { name: "Yes, clear list" }).click();
  await page.reload();
  expect(
    await page.evaluate(() =>
      JSON.parse(localStorage.getItem("wardhan-reading-list:v1") ?? "[]"),
    ),
  ).toEqual([]);
});

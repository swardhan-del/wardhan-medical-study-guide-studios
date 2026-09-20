import { test, expect } from "@playwright/test";

test("public membership navigation remains accessible without leaking a canary", async ({ page }) => {
  await page.goto("/membership");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Follow complete learning sequences.");
  await page.getByRole("link", { name: "Visit the member area" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Member access is temporarily unavailable");
  expect(await page.locator("body").innerText()).not.toContain("WMSS_PRIVATE_CANARY_");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.getByRole("link", { name: "Membership", exact: true }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Follow complete learning sequences.");
});
for (const path of ["/member", "/member/modules/pilot-foundations", "/member/modules/pilot-deep-dive", "/api/member/assets/membership-foundation-pilot", "/api/member/assets/membership-deep-dive-pilot", "/sign-in"]) {
  test(`unconfigured provider fails closed at ${path}`, async ({ request }) => {
    const attempts: Record<string, string>[] = [{}, { Cookie: "wmss_member_session=forged", Authorization: "Bearer forged", RSC: "1" }];
    for (const headers of attempts) {
      const response = await request.get(path, { headers });
      expect(response.status()).toBe(503);
      expect(response.headers()["cache-control"]).toContain("no-store");
      expect(response.headers()["vary"]).toContain("Cookie");
      expect(response.headers()["x-content-type-options"]).toBe("nosniff");
      expect(response.headers()["x-robots-tag"]).toContain("noindex");
      expect(await response.text()).not.toMatch(/WMSS_PRIVATE_CANARY_|SUPABASE_SERVICE_ROLE_KEY|canary\.txt|member-pilot-private/);
    }
  });
}
test("unknown asset and module paths reveal no private bytes", async ({ request }) => {
  for (const path of ["/api/member/assets/unknown", "/member/modules/unknown"])
    expect((await request.get(path)).status()).toBe(404);
});
test("public artifacts do not contain the protected marker", async ({ request }) => {
  for (const path of ["/", "/membership", "/sitemap.xml", "/robots.txt"])
    expect(await (await request.get(path)).text()).not.toContain("WMSS_PRIVATE_CANARY_");
});

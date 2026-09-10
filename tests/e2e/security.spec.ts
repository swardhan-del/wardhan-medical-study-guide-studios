import { test, expect } from "@playwright/test";

test("public and denied pages enforce browser security boundaries", async ({ request }) => {
  for (const route of ["/", "/library", "/review", "/.env", "/.git/config", "/.private/catalog.json"]) {
    const response = await request.get(route);
    expect(response.status()).toBe(route === "/" || route === "/library" ? 200 : 404);
    const headers = response.headers();
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
    expect(headers["content-security-policy"]).toContain("form-action 'self'");
    expect(headers["content-security-policy"]).not.toContain("'unsafe-eval'");
  }
  const pdf = await request.get("/downloads/renal-revision-sheet.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect(pdf.headers()["x-frame-options"]).toBe("SAMEORIGIN");
  expect(pdf.headers()["content-security-policy"]).toContain("frame-ancestors 'self'");
});

test("CSP blocks injected event handlers and external scripts", async ({ page }) => {
  await page.goto("/");
  const result = await page.evaluate(async () => {
    const violations: string[] = [];
    document.addEventListener("securitypolicyviolation", event => violations.push(event.effectiveDirective));
    const button = document.createElement("button");
    button.setAttribute("onclick", "document.documentElement.dataset.injected = 'yes'");
    document.body.append(button);
    button.click();
    const script = document.createElement("script");
    const blocked = new Promise<boolean>(resolve => {
      script.onerror = () => resolve(true);
      script.onload = () => resolve(false);
    });
    script.src = "https://security-test.invalid/injected.js";
    document.head.append(script);
    await blocked;
    await new Promise(resolve => setTimeout(resolve, 100));
    return { injected: document.documentElement.dataset.injected, violations };
  });
  expect(result.injected).toBeUndefined();
  expect(result.violations).toContain("script-src-attr");
  expect(result.violations).toContain("script-src-elem");
});

test("lessons, PDF previews and video metadata load without CSP violations", async ({ page }) => {
  await page.addInitScript(() => {
    const violations: string[] = [];
    Object.assign(window, { securityViolations: violations });
    document.addEventListener("securitypolicyviolation", event => violations.push(event.effectiveDirective + ":" + event.blockedURI));
  });
  for (const route of ["/subjects/anatomy/thorax", "/library/renal-revision-sheet", "/videos/recap-fluid-and-membrane-transport"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    if (route.startsWith("/videos/")) {
      await page.locator("video").evaluate((video: HTMLVideoElement) => video.load());
      await expect.poll(() => page.locator("video").evaluate((video: HTMLVideoElement) => video.readyState)).toBeGreaterThan(0);
    }
    expect(await page.evaluate(() => (window as unknown as { securityViolations: string[] }).securityViolations)).toEqual([]);
  }
});

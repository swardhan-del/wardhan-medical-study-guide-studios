import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import comparisons from "../../src/content/lymphoid-comparison-specimens.json";
import { learningActivities } from "../../src/content/learning-activities";

const route = "/library/lymphoid-organs";
const hashes: Record<string, string> = {
  "lymphoid-thymus-wider-field": "704c20dd6d5ae144719a4aa8c3858ef65ed48d0aa1b6414f9dc3c52ed99642fe",
  "lymphoid-spleen-detail": "bd7182c8569b52e593fae5456105560157cd6d360286616b0121457878266476",
  "lymphoid-thymus-detail": "6ca97baea5d026930107334b825aac01744410b1a5281f42e8ec0cd067e695ff",
};

for (const item of comparisons) test(`A student examines ${item.data.figureId} alongside the existing node`, async ({ page }, info) => {
  const errors: string[] = [];
  page.on("pageerror", e => errors.push(e.message));
  expect((await page.goto(route))?.status()).toBe(200);
  await expect(page.locator(".concept-sequence > details")).toHaveCount(23);
  await expect(page.locator('img[src="/images/figures/normal-lymph-node-architecture.jpg"]')).toHaveCount(1);
  {
    const panel = page.locator(`section[aria-labelledby="${item.scope}-specimen-title"]`);
    await page.locator(`.lesson-jumps a[href="#${item.scope}-specimen-title"]`).click();
    await expect(panel.locator("h2")).toBeInViewport();
    await expect(page.locator(`img[src="/images/figures/${item.data.figureId}.jpg"]`)).toHaveCount(1);
    if (item.scope === "thymus-wide-comparison") {
      await expect(panel).toContainText("human paediatric thymus, H&E");
      await expect(panel.getByRole("link", { name: "CC0 1.0 Universal terms", exact: true })).toHaveAttribute("href", "https://creativecommons.org/publicdomain/zero/1.0/");
    } else {
      await expect(panel).toContainText("Exact species, stain and fixation are unreported");
      await expect(panel.getByRole("link", { name: "CC BY-SA 3.0 terms", exact: true })).toHaveAttribute("href", "https://creativecommons.org/licenses/by-sa/3.0/");
    }
    await expect.poll(() => panel.locator("img").evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(true);
    for (const level of [1, 2, 3]) {
      const zoom = panel.getByRole("button", { name: `${level}× view`, exact: true });
      await zoom.focus();
      await page.keyboard.press("Space");
      await expect(zoom).toHaveAttribute("aria-pressed", "true");
      for (const [i, region] of item.data.regions.entries()) {
        const control = panel.getByRole("button", { name: `${i + 1}. ${region.label}`, exact: true });
        await control.focus();
        await page.keyboard.press("Enter");
        await expect(control).toHaveAttribute("aria-pressed", "true");
        const description = panel.locator(`#${item.scope}-region-description`);
        await expect(description).toContainText(region.observation);
        await expect(description).toContainText(region.interpretation);
        await expect(description).toContainText(region.limit);
        const viewport = panel.getByRole("region", { name: `${item.data.title}: scrollable specimen`, exact: true });
        await expect.poll(() => viewport.evaluate((el, anchor) => {
          const frame = el.firstElementChild as HTMLElement;
          const maxX = el.scrollWidth - el.clientWidth;
          const maxY = el.scrollHeight - el.clientHeight;
          const x = Math.max(0, Math.min(maxX, frame.clientWidth * anchor.x / 100 - el.clientWidth / 2));
          const y = Math.max(0, Math.min(maxY, frame.clientHeight * anchor.y / 100 - el.clientHeight / 2));
          return el.scrollWidth <= el.clientWidth + 1 ? el.scrollLeft === 0 && el.scrollTop === 0 : Math.abs(el.scrollLeft - x) <= 2 && Math.abs(el.scrollTop - y) <= 2;
        }, region.anchor)).toBe(true);
        // One open marker is visible; the tissue is not covered by all labels.
        await expect(panel.locator('[aria-hidden="true"] > span')).toHaveCount(1);
      }
    }
    await panel.getByRole("button", { name: "Hide region markers", exact: true }).click();
    await expect(panel.locator('[aria-hidden="true"] > span')).toHaveCount(0);
    await panel.getByRole("button", { name: "Show region markers", exact: true }).click();
    const viewport = panel.getByRole("region", { name: `${item.data.title}: scrollable specimen`, exact: true });
    await viewport.focus();
    await expect(viewport).toBeFocused();
    const before = await viewport.evaluate(e => e.scrollLeft);
    await page.keyboard.press("ArrowLeft");
    await expect.poll(() => viewport.evaluate(e => e.scrollLeft)).toBeLessThan(before);
    await panel.getByRole("button", { name: "1× view", exact: true }).click();
    await expect.poll(() => viewport.evaluate(e => e.scrollLeft + e.scrollTop)).toBe(0);
    const downloaded = page.waitForEvent("download");
    await panel.getByRole("link", { name: "Download credited specimen image", exact: true }).click();
    const file = await downloaded;
    expect(file.suggestedFilename()).toBe(`${item.data.figureId}.jpg`);
    const path = await file.path();
    expect(path).not.toBeNull();
    expect(createHash("sha256").update(await readFile(path!)).digest("hex")).toBe(hashes[item.data.figureId]);
    await panel.screenshot({ path: info.outputPath(`${item.scope}-review.png`) });
  }
  expect(errors).toEqual([]);
});

test("The selected tissue remains visible when an already zoomed field is resized", async ({ page }) => {
  await page.goto(route);
  const rootSize = await page.locator("html").evaluate(e => parseFloat(getComputedStyle(e).fontSize));
  for (const item of comparisons) {
    const panel = page.locator(`section[aria-labelledby="${item.scope}-specimen-title"]`);
    await panel.getByRole("button", { name: "3× view", exact: true }).click();
    const region = item.data.regions[2];
    await panel.getByRole("button", { name: `3. ${region.label}`, exact: true }).click();
    await expect.poll(() => panel.locator("img").evaluate((e: HTMLImageElement) => e.complete && e.naturalWidth > 0)).toBe(true);
    const viewport = panel.getByRole("region", { name: `${item.data.title}: scrollable specimen`, exact: true });
    for (const width of [1440, 390, 320, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.locator("html").evaluate((el, size) => el.style.fontSize = `${size}px`, rootSize * (width === 320 ? 2 : 1));
      // Do not change the selected region or zoom: layout changes alone must recenter it.
      await expect.poll(() => viewport.evaluate(el => {
        const marker = el.querySelector('[aria-hidden="true"] > span')!.getBoundingClientRect();
        const bounds = el.getBoundingClientRect();
        const x = (marker.left + marker.right) / 2 - bounds.left;
        const y = (marker.top + marker.bottom) / 2 - bounds.top;
        return x > 0 && x < el.clientWidth && y > 0 && y < el.clientHeight;
      })).toBe(true);
    }
  }
});

test("Written comparison uses manual criteria and clears temporary answers", async ({ page }) => {
  await page.goto(route);
  const activities = learningActivities.filter(x => x.lessonId === "lymphoid-organs" && x.kind === "explanation");
  expect(activities).toHaveLength(3);
  const sent: string[] = [];
  page.on("request", request => { if (request.method() === "POST") sent.push(request.postData() ?? ""); });
  for (const activity of activities) {
    if (activity.kind !== "explanation") throw Error("Expected a manual explanation activity");
    const card = page.locator(`section[aria-labelledby="${activity.id}-title"]`);
    const text = card.getByRole("textbox", { name: "Write or outline your explanation", exact: true });
    await text.fill("Temporary specimen reasoning 74291: two visible relationships.");
    await card.getByRole("button", { name: "Compare with the rubric", exact: true }).click();
    const rubric = card.locator(`#${activity.id}-rubric`);
    await expect(rubric).toContainText(activity.model);
    for (const check of await rubric.getByRole("checkbox").all()) await check.check();
    await expect(rubric.getByRole("status")).toHaveText(`You marked ${activity.criteria.length} of ${activity.criteria.length} rubric points.`);
    await card.getByRole("button", { name: "Clear my explanation and checks", exact: true }).click();
    await expect(text).toHaveValue("");
    await card.getByRole("button", { name: "Compare with the rubric", exact: true }).click();
    await expect(rubric.getByRole("status")).toHaveText(`You marked 0 of ${activity.criteria.length} rubric points.`);
    await text.fill("Temporary specimen reasoning 74291: revised.");
  }
  expect(sent.some(x => x.includes("74291"))).toBe(false);
  expect(await page.evaluate(() => JSON.stringify([localStorage, sessionStorage]))).not.toContain("74291");
  await page.reload();
  for (const activity of activities) await expect(page.locator(`#${activity.id}-draft`)).toHaveValue("");
});

test("Comparison details remain readable at 320 pixels with actual double-size text", async ({ browser, baseURL }, info) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 320, height: 900 } });
  const page = await context.newPage();
  await page.goto(route);
  const original = await page.locator("body").evaluate(e => parseFloat(getComputedStyle(e).fontSize));
  const root = await page.locator("html").evaluate(e => parseFloat(getComputedStyle(e).fontSize));
  await page.addStyleTag({ content: `html { font-size: ${root * 2}px !important; }` });
  expect(await page.locator("body").evaluate(e => parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThanOrEqual(original * 1.99);
  for (const item of comparisons) {
    const panel = page.locator(`section[aria-labelledby="${item.scope}-specimen-title"]`);
    await panel.getByRole("button", { name: "3× view", exact: true }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    expect(await panel.evaluate(e => e.scrollWidth <= e.clientWidth + 1)).toBe(true);
    await panel.screenshot({ path: info.outputPath(`${item.scope}-320px-double-text.png`) });
  }
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await context.close();
});

test("Missing images retain all descriptions and no-JavaScript readers can access models", async ({ page, browser, baseURL }) => {
  for (const item of comparisons) await page.route(`**/${item.data.figureId}.jpg`, route => route.abort());
  await page.goto(route);
  for (const item of comparisons) {
    const panel = page.locator(`section[aria-labelledby="${item.scope}-specimen-title"]`);
    await panel.scrollIntoViewIfNeeded();
    await expect(panel.getByRole("status")).toContainText("specimen image could not load");
    await expect(panel.locator('[aria-hidden="true"] > span')).toHaveCount(0);
    await panel.getByText("Read all three region explanations", { exact: true }).click();
    for (const region of item.data.regions) await expect(panel.getByText(region.interpretation, { exact: true }).last()).toBeVisible();
  }
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false });
  const plain = await context.newPage();
  await plain.goto(route);
  for (const item of comparisons) {
    const panel = plain.locator(`section[aria-labelledby="${item.scope}-specimen-title"]`);
    await panel.getByText("Read all three region explanations", { exact: true }).click();
    for (const region of item.data.regions) await expect(panel.getByText(region.interpretation, { exact: true }).last()).toBeVisible();
  }
  for (const activity of learningActivities.filter(x => x.lessonId === "lymphoid-organs" && x.kind === "explanation")) {
    if (activity.kind !== "explanation") continue;
    const card = plain.locator(`section[aria-labelledby="${activity.id}-title"]`);
    await card.getByText("Read the rubric and model without entering a response", { exact: true }).click();
    await expect(card.getByText(activity.model, { exact: true }).first()).toBeVisible();
  }
  await context.close();
});

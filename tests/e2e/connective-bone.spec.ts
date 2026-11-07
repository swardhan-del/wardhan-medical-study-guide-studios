import { showAllPractice } from "./helpers/practice-view";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import data from "../../src/content/library-lessons.json";
import practice from "../../src/content/transfer-practice.json";
import type { LibraryLesson } from "../../src/lib/library-types";

const ids = ["connective-tissue", "cartilage-bone"];
const asset = "/images/figures/mouse-skeletal-lineage-long-2022.jpg";
const lessons = data.lessons.filter(l => ids.includes(l.id)) as LibraryLesson[];

for (const lesson of lessons) {
  test(`First-time student finds and returns from expanded tissue lesson: ${lesson.id}`, async ({ page }) => {
    await page.goto("/");
    await page.getByRole("navigation", { name: "Primary navigation" }).getByRole("link", { name: "Subjects", exact: true }).click();
    await page.locator('a[href="/subjects/histology"]').click();
    await page.getByRole("searchbox", { name: "Search resources", exact: true }).fill(lesson.title);
    const card = page.locator(".resource-card:visible").filter({ has: page.locator(`a[href="/library/${lesson.id}"]`) });
    await expect(card).toHaveCount(1); await card.getByRole("link", { name: "Read lesson", exact: true }).click();
    await expect(page.locator("h1")).toHaveText(lesson.title);
    await page.getByRole("link", { name: lesson.id === "connective-tissue" ? "Collagen pathway" : "Preparation explorer", exact: true }).click();
    await expect(page.locator(lesson.id === "connective-tissue" ? "#collagen-route-title" : "#bone-preparation-title")).toBeInViewport();
    await page.getByRole("navigation", { name: "Breadcrumb" }).locator('a[href="/subjects/histology"]').click();
    await expect(page.getByRole("searchbox", { name: "Search resources", exact: true })).toBeVisible();
  });
  test(`Deep tissue lesson retains explanation, section evidence and original recall: ${lesson.id}`, async ({ page }) => {
    const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
    const response = await page.goto(`/library/${lesson.id}`); expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveText(lesson.title);
    const sections = page.locator(".concept-sequence > details"); await expect(sections).toHaveCount(lesson.steps.length);
    await expect(sections.getByRole("textbox", { name: "Your explanation", exact: true })).toHaveCount(lesson.steps.length);
    await expect(sections.locator(".practice-question")).toHaveCount(lesson.steps.length);
    for (const [i, step] of lesson.steps.entries()) {
      const section = sections.nth(i);
      if (!(await section.evaluate(el => (el as HTMLDetailsElement).open))) await section.locator(":scope > summary").click();
      expect(await section.locator(":scope > p").allTextContents()).toEqual(step.body.split("\n\n"));
      await expect(section).toContainText(step.practice!.prompt);
      const feedback = section.locator("[data-feedback]");
      await expect(feedback).toBeHidden();
      await section.getByRole("textbox", { name: "Your explanation", exact: true }).fill("My mechanism explanation before comparing."); await section.getByRole("button", { name: "Check Answer and Continue →", exact: true }).click();
      await expect(feedback).toBeVisible(); await expect(feedback).toContainText(step.practice!.feedback);
      expect(await section.locator('a[href^="https://"]').count()).toBeGreaterThan(0);
    }
    await expect(page.locator("main")).toContainText(lesson.recall.prompt);
    expect(await page.locator('main a[href*="dropbox"]').count()).toBe(0);
    expect(await page.locator("main").innerText()).not.toMatch(/\/Users\/|rlkey=|Library\/CloudStorage/);
    expect(errors).toEqual([]);
  });

  test(`Deep tissue application feedback and saved answers: ${lesson.id}`, async ({ page }) => {
    const questions = practice.questions.filter(q => q.topic === lesson.id);
    await page.goto(`/library/${lesson.id}`);
    await showAllPractice(page);
    for (const q of questions) {
      const block = page.locator(`#question-${q.id}`); const wrong = (q.answer + 1) % q.options.length;
      await block.getByRole("radio", { name: q.options[wrong].text, exact: true }).check();
      await block.getByRole("button", { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
      await expect(block).toContainText(q.options[wrong].explanation);
      await block.getByRole("button", { name: "Try without feedback", exact: true }).click();
      await block.getByRole("radio", { name: q.options[q.answer].text, exact: true }).check();
      await block.getByRole("button", { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
      await expect(block).toContainText(q.options[q.answer].explanation);
    }
    await page.reload(); await showAllPractice(page);
    for (const q of questions) await expect(page.locator(`#question-${q.id}`).getByRole("radio", { name: q.options[q.answer].text, exact: true })).toBeChecked();
  });

  test(`Deep tissue save/remove, accessibility and enlarged mobile text: ${lesson.id}`, async ({ page }, info) => {
    await page.goto(`/library/${lesson.id}`);
    const save = page.getByRole("button", { name: `Save to My Study: ${lesson.title}`, exact: true });
    await save.click(); await page.reload();
    const saved = page.getByRole("button", { name: `Saved to My Study: ${lesson.title} (remove from saved resources)`, exact: true });
    await expect(saved).toHaveAttribute("aria-pressed", "true"); await saved.click(); await page.reload(); await expect(save).toBeVisible();
    await showAllPractice(page);
    expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
    await page.setViewportSize({ width: 320, height: 900 }); await page.addStyleTag({ content: "html { font-size: 200% !important; }" });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBe(true);
    const heading = lesson.id === "connective-tissue" ? "collagen-route-title" : "bone-preparation-title";
    const explorer = page.locator(`section[aria-labelledby="${heading}"]`);
    expect(await explorer.evaluate(el => el.scrollWidth <= el.clientWidth + 1)).toBe(true);
    await explorer.screenshot({ path: info.outputPath(`${lesson.id}-320-text-200.png`) });
    await page.setViewportSize({ width: 1440, height: 1000 }); await page.addStyleTag({ content: "html { font-size: 100% !important; }" });
    await explorer.screenshot({ path: info.outputPath(`${lesson.id}-desktop.png`) });
  });

  test(`Deep tissue explanations and prompt feedback remain without JavaScript: ${lesson.id}`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ javaScriptEnabled: false, baseURL }); const page = await context.newPage();
    await page.goto(`/library/${lesson.id}`); const sections = page.locator(".concept-sequence > details");
    await expect(sections).toHaveCount(lesson.steps.length);
    const task = sections.last().locator(".practice-question noscript");
    await task.getByText("Model explanation", { exact: true }).click(); await expect(task.locator("details > p")).toBeVisible(); expect(await task.locator("details > p").textContent()).toBe(lesson.steps.at(-1)!.practice!.feedback);
    if (lesson.id === "cartilage-bone") {
      const figure = page.locator("#figure-mouse-skeletal-lineage"); await figure.getByText("Read the figure panel by panel", { exact: true }).click();
      await expect(figure.locator("dt")).toHaveCount(4);
    }
    await context.close();
  });
}

test("Part 03 revision uses the current source revision and both expanded lessons", async ({ page }) => {
  await page.goto("/study/histology/revision"); await page.getByRole("button", { name: "Clear selection", exact: true }).click();
  await page.getByRole("checkbox", { name: "03. Connective Tissue Adipose Cartilage and Bone", exact: true }).check();
  await expect(page.locator(".revision-lesson")).toHaveCount(2);
  for (const lesson of lessons) {
    const section=page.locator(".revision-lesson").filter({hasText:lesson.title});
    await expect(section).toHaveCount(1); await expect(section).toContainText(lesson.steps.at(-1)!.title);
  }
  await expect(page.locator("main")).toContainText("Revision 6");
});

test("Collagen explorer resets feedback and supports keyboard operation across compartments", async ({ page }) => {
  await page.goto("/library/connective-tissue");
  const panel = page.locator('section[aria-labelledby="collagen-route-title"]');
  for (const name of ["Modify and assemble", "Secrete and process", "Organize fibrils", "Stabilize links"]) {
    const b = panel.getByRole("button", { name, exact: true }); await b.focus(); await page.keyboard.press("Enter");
    await expect(b).toHaveAttribute("aria-pressed", "true"); await expect(panel.locator("#collagen-route-reasoning")).toBeHidden();
    await expect(panel.locator('[aria-current="step"]')).toContainText(name);
    await panel.getByRole("button", { name: "Reveal the reasoning", exact: true }).click();
    await expect(panel.locator("#collagen-route-reasoning")).toBeVisible();
  }
});

test("Bone explorer independently changes preparation and plane with explicit limits", async ({ page }, info) => {
  // Four full-panel evidence captures take longer on the expanded teaching page.
  test.setTimeout(60000);
  await page.goto("/library/cartilage-bone"); const panel = page.locator('section[aria-labelledby="bone-preparation-title"]');
  for (const prep of ["Ground bone", "Decalcified H&E"]) for (const plane of ["Transverse section", "Longitudinal section"]) {
    for (const name of [prep, plane]) { const b=panel.getByRole("button", { name, exact: true }); await b.focus(); await page.keyboard.press("Enter"); await expect(b).toHaveAttribute("aria-pressed", "true"); }
    await expect(panel.locator("#bone-preparation-reasoning")).toBeHidden();
    await expect(panel.getByRole("img")).toHaveAccessibleName(new RegExp(prep.startsWith("Ground") ? "ground" : "decalcified"));
    await panel.getByRole("button", { name: "Reveal the reasoning", exact: true }).click();
    await expect(panel.locator("#bone-preparation-reasoning")).toContainText(prep.startsWith("Ground") ? "prior viability" : "Mineral was removed");
    await panel.screenshot({ path: info.outputPath(`${prep.startsWith("Ground") ? "ground" : "decalcified"}-${plane.split(" ")[0]}.png`) });
  }
});

test("Mouse research figure preserves attribution, keyboard zoom, download bytes and focus return", async ({ page }, info) => {
  await page.goto("/library/cartilage-bone"); const figure=page.locator("#figure-mouse-skeletal-lineage");
  await figure.getByText("Read the figure panel by panel", { exact: true }).click(); await expect(figure.locator("dt")).toHaveCount(4);
  await expect(figure).toContainText("Scale bars: 100 µm"); await expect(figure).toContainText("not human H&E");
  await expect(figure.getByRole("link", { name: "Image reuse licence: CC BY 4.0", exact: true })).toHaveAttribute("href", "https://creativecommons.org/licenses/by/4.0/");
  const trigger=figure.getByRole("button", { name: "Enlarge Mouse skeletal development: follow the labeling window", exact: true });
  await trigger.focus(); await page.keyboard.press("Enter"); const dialog=page.getByRole("dialog");
  await expect(dialog.getByRole("button", { name: "Close image", exact: true })).toBeFocused();
  await expect(dialog.locator("img")).toHaveJSProperty("naturalWidth",612,{timeout:30000});
  await dialog.getByLabel("Image zoom").selectOption("3"); const region=dialog.getByRole("region",{name:"Scrollable enlarged image"});await region.focus();await page.keyboard.press("ArrowRight");
  expect(await region.evaluate(el=>el.scrollWidth>el.clientWidth)).toBe(true);
  await dialog.screenshot({path:info.outputPath("mouse-lineage-zoom.png")});
  const pending=page.waitForEvent("download");await dialog.getByRole("link",{name:"Download image",exact:true}).click();const download=await pending;
  expect(download.suggestedFilename()).toBe(asset.split("/").at(-1));const path=await download.path();expect(path).toBeTruthy();
  expect(createHash("sha256").update(await readFile(path!)).digest("hex")).toBe("d7180a42ec6569bab2034a1a1992e7647d00da581221be21fb48d7ddecdb4216");
  await page.keyboard.press("Escape");await expect(dialog).not.toBeVisible();await expect(trigger).toBeFocused();
});

test("Mouse figure failure keeps a usable panel guide",async({page})=>{
  await page.route(`**${asset}`,route=>route.abort());await page.goto("/library/cartilage-bone");const figure=page.locator("#figure-mouse-skeletal-lineage");await figure.scrollIntoViewIfNeeded();
  await expect(figure).toContainText("Image unavailable.");await figure.getByText("Read the figure panel by panel",{exact:true}).click();await expect(figure).toContainText("two different denominators");
  await figure.getByRole("button",{name:"Try the full-size image",exact:true}).click();await expect(page.getByRole("dialog")).toContainText("Full-size image unavailable.");await page.keyboard.press("Escape");
});

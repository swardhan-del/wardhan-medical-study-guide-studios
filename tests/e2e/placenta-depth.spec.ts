import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createHash } from "node:crypto";
import teaching from "../../src/content/library-lessons.json";
import practice from "../../src/content/transfer-practice.json";
import specimen from "../../src/content/placenta-specimen.json";
import guides from "../../src/content/printable-guides.json";

const route = "/library/placenta";
const lesson = teaching.lessons.find(x => x.id === "placenta")!;
const panelSelector = 'section[aria-labelledby="placenta-specimen-title"]';

test("First-time student finds, saves and returns from the placenta specimen lesson", async ({page}) => {
  await page.goto("/");
  await page.getByRole("navigation",{name:"Primary navigation"}).getByRole("link",{name:"Subjects",exact:true}).click();
  await page.locator('a[href="/subjects/histology"]').click();
  await page.getByRole("searchbox",{name:"Search resources",exact:true}).fill("placenta");
  const card=page.locator(".resource-card:visible").filter({has:page.locator('a[href="/library/placenta"]')});await expect(card).toHaveCount(1);
  await card.getByRole("link",{name:"Read lesson",exact:true}).click();await expect(page.locator("h1")).toHaveText(lesson.title);
  await page.getByRole("link",{name:"Read the specimen",exact:true}).click();await expect(page.locator("#placenta-specimen-title")).toBeInViewport();
  const save=page.getByRole("button",{name:`Save to My Study: ${lesson.title}`,exact:true});await save.click();await page.reload();
  const saved=page.getByRole("button",{name:`Saved to My Study: ${lesson.title} (remove from saved resources)`,exact:true});await expect(saved).toHaveAttribute("aria-pressed","true");await saved.click();await page.reload();await expect(save).toBeVisible();
  await page.getByRole("navigation",{name:"Breadcrumb"}).locator('a[href="/subjects/histology"]').click();await expect(page.getByRole("searchbox",{name:"Search resources",exact:true})).toBeVisible();
});

test("Placenta explanation preserves full content, references and source boundaries", async ({page}) => {
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  expect((await page.goto(route))?.status()).toBe(200);
  const sections=page.locator(".concept-sequence > details"); await expect(sections).toHaveCount(24);
  for(const [i,step] of lesson.steps.entries()) {
    expect(await sections.nth(i).locator(":scope > p").allTextContents()).toEqual(step.body.split("\n\n"));
    expect(await sections.nth(i).locator('a[href^="https://"]').count()).toBeGreaterThan(0);
  }
  await expect(page.locator("main")).toContainText("Cytotrophoblasts persist at term");
  await expect(page.locator("main")).toContainText("pseudotime");
  expect(await page.locator('main a[href*="dropbox"]').count()).toBe(0);
  expect(await page.locator("main").innerText()).not.toMatch(/\/Users\/|rlkey=|Library\/CloudStorage/);
  await expect(page.locator('img[src="/images/figures/chorionic-villus-term.jpg"]')).toHaveCount(1);
  expect(errors).toEqual([]);
});

test("Specimen regions work with the keyboard and markers can be hidden", async ({page},info) => {
  await page.goto(route); await page.getByRole("link",{name:"Read the specimen",exact:true}).click();
  const panel=page.locator(panelSelector);
  for(const [i,region] of specimen.regions.entries()) {
    const control=panel.getByRole("button",{name:`${i+1}. ${region.label}`,exact:true}); await control.focus(); await page.keyboard.press("Enter");
    await expect(control).toHaveAttribute("aria-pressed","true");
    await expect(page.locator("#placenta-region-description")).toContainText(region.observation);
    await expect(page.locator("#placenta-region-description")).toContainText(region.interpretation);
    await expect(page.locator("#placenta-region-description")).toContainText(region.limit);
  }
  await expect(panel.locator('[aria-hidden="true"] span')).toHaveCount(5);
  await panel.getByRole("button",{name:"Hide region markers"}).click(); await expect(panel.locator('[aria-hidden="true"] span')).toHaveCount(0);
  await panel.getByRole("button",{name:"Show region markers"}).click();
  await panel.screenshot({path:info.outputPath("placenta-depth.png")});
});

test("Typed comparison gives a model without grading, sending or persisting an answer", async ({page}) => {
  await page.goto(route); const panel=page.locator(panelSelector); const text=panel.locator("textarea");
  const sent: string[]=[]; page.on("request",r=>{if(r.method()==="POST")sent.push(r.postData()??"");});
  await text.fill("A villous surface and internal capillary; I need scale and broader context.");
  await panel.getByRole("button",{name:"Compare with model reasoning",exact:true}).click();
  await expect(panel.getByRole("status")).toContainText(specimen.model);
  await expect(panel).toContainText("does not grade your wording");
  expect(sent.some(x=>x.includes("A villous surface"))).toBe(false);
  expect(await page.evaluate(()=>JSON.stringify(localStorage))).not.toContain("A villous surface");
  await text.fill("Changed observation"); await expect(panel.getByRole("status")).toHaveCount(0);
  await panel.getByRole("button",{name:"Clear my response"}).click(); await expect(text).toHaveValue("");
  await text.fill("Transient response"); await page.reload(); await expect(text).toHaveValue("");
});

test("Placenta questions explain distractors, correct answers and retain practice progress", async ({page}) => {
  await page.goto(route); await page.getByRole("button",{name:"Show all questions",exact:true}).click();
  const questions=practice.questions.filter(q=>q.topic==="placenta" && q.id.endsWith("20261106")); expect(questions).toHaveLength(16);
  for(const q of questions) {
    const block=page.locator(`#question-${q.id}`);
    for (const [index, option] of q.options.entries()) {
      if (index===q.answer) continue;
      await block.getByRole("radio",{name:option.text,exact:true}).check();
      await block.getByRole("button",{name:"Check answer",exact:true}).click();
      await expect(block).toContainText(option.explanation);
      await block.getByRole("button",{name:"Try without feedback",exact:true}).click();
    }
    await block.getByRole("radio",{name:q.options[q.answer].text,exact:true}).check();await block.getByRole("button",{name:"Check answer",exact:true}).click();await expect(block).toContainText(q.options[q.answer].explanation);
  }
  await page.reload();await page.getByRole("button",{name:"Show all questions",exact:true}).click();
  for(const q of questions)await expect(page.locator(`#question-${q.id}`).getByRole("radio",{name:q.options[q.answer].text,exact:true})).toBeChecked();
});

test("Credited download preserves approved pixels and narrow text stays readable", async ({page,request},info) => {
  await page.goto(route);const panel=page.locator(panelSelector);
  await expect(panel.getByRole("link",{name:"CC0 1.0 terms"})).toHaveAttribute("href","https://creativecommons.org/publicdomain/zero/1.0/");
  const asset=await request.get("/images/figures/chorionic-villus-term.jpg");expect(asset.status()).toBe(200);
  expect(createHash("sha256").update(await asset.body()).digest("hex")).toBe("405b884058e38858bd01632786d5eceb93cf73a969390845754d2cb3b1db72a5");
  const downloadPromise=page.waitForEvent("download");await panel.getByRole("link",{name:"Download credited specimen image"}).click();expect((await downloadPromise).suggestedFilename()).toBe("chorionic-villus-term.jpg");
  await expect(panel).toContainText("Exact gestational week, fixation, section thickness and calibrated scale are not supplied");
  expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
  await page.setViewportSize({width:320,height:900});await page.addStyleTag({content:"html { font-size:200% !important; }"});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
  expect(await panel.evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);
  await panel.screenshot({path:info.outputPath("placenta-320px-200pct.png")});
  await page.locator("#placenta-specimen-title").scrollIntoViewIfNeeded();
  await page.screenshot({path:info.outputPath("placenta-enlarged-viewport.png")});
});

test("Image failure and JavaScript absence retain explanations", async ({page,browser,baseURL},info) => {
  await page.route("**/chorionic-villus-term.jpg",r=>r.abort());await page.goto(route);const panel=page.locator(panelSelector);
  await expect(panel.getByRole("status")).toContainText("specimen image could not load");
  await panel.getByText("Read all five region explanations",{exact:true}).click();for(const r of specimen.regions)await expect(panel.getByText(r.interpretation,{exact:true}).last()).toBeVisible();
  const context=await browser.newContext({javaScriptEnabled:false,baseURL});const plain=await context.newPage();await plain.goto(route);
  await plain.getByText("Read all five region explanations",{exact:true}).click();for(const r of specimen.regions)await expect(plain.locator(panelSelector).getByText(r.interpretation,{exact:true}).last()).toBeVisible();
  await plain.getByText("Read the model without entering a response",{exact:true}).click();await expect(plain.getByText(specimen.model,{exact:true})).toBeVisible();
  await expect(plain.locator(`${panelSelector} noscript`)).toBeVisible();
  await plain.locator(panelSelector).screenshot({path:info.outputPath("placenta-no-javascript.png")});await context.close();
});


test("Two circuits stay separate and six predictions work with keyboard and no JavaScript", async ({page,browser,baseURL}) => {
  await page.goto(route);await page.getByRole("link",{name:"Trace two circuits",exact:true}).click();
  const panel=page.locator('section[aria-labelledby="placenta-circulation-title"]');
  await expect(panel.locator("ol")).toHaveCount(2);await expect(panel.locator("details")).toHaveCount(6);
  for(const details of await panel.locator("details").all()) {
    await details.locator("summary").focus();await page.keyboard.press("Enter");await expect(details).toHaveAttribute("open","");
    await expect(details.locator("p").last()).toBeVisible();await page.keyboard.press("Enter");await expect(details).not.toHaveAttribute("open","");
  }
  await expect(panel).toContainText("does not join the two blood circuits");
  const context=await browser.newContext({javaScriptEnabled:false,baseURL});const plain=await context.newPage();await plain.goto(route);
  await plain.locator('section[aria-labelledby="placenta-circulation-title"] summary').filter({hasText:"Umbilical vein"}).click();await expect(plain.getByText("Back toward the fetus.",{exact:true})).toBeVisible();await context.close();
});

test("Placenta revision keeps the selected lesson, questions, source and specimen credit", async ({page}, info) => {
  const part=guides.parts.find(p=>p.id==="histology-part-12")!;
  await page.goto("/study/histology/revision");
  await page.getByRole("button",{name:"Clear selection",exact:true}).click();
  await page.getByRole("checkbox",{name:`${part.number}. ${part.title}`,exact:true}).check();
  const section=page.locator("#histology-part-12");
  await expect(section.locator(".revision-lesson")).toHaveCount(1);
  await expect(section.getByRole("heading",{name:lesson.title,exact:true})).toBeVisible();
  for(const step of lesson.steps) await expect(section).toContainText(step.title);
  for(const q of practice.questions.filter(q=>q.topic==="placenta")) await expect(section).toContainText(q.prompt);
  await expect(section).toContainText("CC0 1.0");
  const specimenImage=section.locator('img[src^="/images/figures/chorionic-villus-term.jpg"]');
  await expect(specimenImage).toHaveCount(1);
  expect(new URL(await specimenImage.getAttribute("src") ?? "",page.url()).pathname).toBe("/images/figures/chorionic-villus-term.jpg");
  await specimenImage.scrollIntoViewIfNeeded();
  await expect.poll(()=>specimenImage.evaluate((image:HTMLImageElement)=>image.naturalWidth)).toBe(4469);
  expect(await section.locator('a[href*="dropbox"]').count()).toBe(0);
  await page.getByRole("checkbox",{name:"Include answer key",exact:true}).uncheck();await expect(page.locator(".revision-answers")).toHaveCount(0);
  await page.emulateMedia({media:"print"});await expect(page.locator(".guide-selector")).toBeHidden();
  await section.locator(".guide-divider").screenshot({path:info.outputPath("placenta-print-heading.png")});
});

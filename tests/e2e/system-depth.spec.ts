import { showAllPractice } from "./helpers/practice-view";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import teaching from "../../src/content/library-lessons.json";
import practice from "../../src/content/transfer-practice.json";

for (const id of ["renal-histology", "respiratory-histology"] as const) {
  const lesson = teaching.lessons.find(l => l.id === id)!;
  const questions = practice.questions.filter(q => q.topic === id && q.id.startsWith("system-depth-"));
  test(`${id}: a first visit reaches one lesson through search and its printable part`, async ({page},testInfo) => {
    await page.goto("/");
    await page.getByRole("navigation",{name:"Primary navigation"}).getByRole("link",{name:"Subjects",exact:true}).click();
    await page.locator('a[href="/subjects/histology"]').click();
    await page.getByRole("searchbox",{name:"Search resources",exact:true}).fill(lesson.title);
    const card=page.locator(".resource-card:visible").filter({has:page.locator(`a[href="/library/${id}"]`)});
    await expect(card).toHaveCount(1);await card.getByRole("link",{name:"Read lesson",exact:true}).click();
    await expect(page.getByRole("heading",{level:1,name:lesson.title,exact:true})).toBeVisible();
    await page.getByRole("link",{name:"Trace a route",exact:true}).click();
    await expect(page.locator("#system-relationships-title")).toBeInViewport();
    await page.screenshot({path:testInfo.outputPath(`${id}-route-viewport.png`)});
    await page.goto("/study/histology/revision");await page.getByRole("button",{name:"Clear selection",exact:true}).click();
    const partTitle=id==="renal-histology"?"10. Urinary System Kidney Nephron Ureter and Bladder":"07. Respiratory System";
    await page.getByRole("checkbox",{name:partTitle,exact:true}).check();
    await expect(page.locator(".revision-lesson")).toHaveCount(1);
    await expect(page.locator(".revision-lesson")).toContainText(lesson.steps[10].title);
    await expect(page.locator(".revision-answers")).toContainText(lesson.title);
    await page.goto("/library?subject=histology");await page.getByRole("searchbox").fill("no-system-depth-result-816394");
    await expect(page.locator(".catalog-empty")).toBeVisible();await page.locator(".catalog-empty").getByRole("button",{name:"Clear filters",exact:true}).click();
    await expect(page.locator(".resource-card:visible").first()).toBeVisible();
  });
  test(`${id}: complete sections and source relationships remain readable`, async ({page}) => {
    const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
    await page.goto(`/library/${id}`);
    await expect(page.getByRole("heading", {level:1,name:lesson.title,exact:true})).toBeVisible();
    const sections=page.locator(".concept-sequence > details"); await expect(sections).toHaveCount(13);
    for (const [i,step] of lesson.steps.entries()) {
      await expect(sections.nth(i).locator(".concept-step-title")).toHaveText(step.title);
      expect(await sections.nth(i).locator(":scope > p").allTextContents()).toEqual(step.body.split("\n\n"));
      await expect(sections.nth(i).locator(":scope > details")).toHaveCount(1);
    }
    await expect(sections.nth(9).locator(".concept-number")).toHaveText("10");
    await expect(page.locator("#lesson-source")).not.toContainText("controlled library");
    expect(errors).toEqual([]);
  });
  test(`${id}: all original application checks explain wrong and correct answers and persist`, async ({page}) => {
    await page.goto(`/library/${id}`);
    await showAllPractice(page);
    expect(questions).toHaveLength(12);
    for(const q of questions) {
      const block=page.locator(`#question-${q.id}`); const wrong=(q.answer+1)%q.options.length;
      await block.getByRole("radio",{name:q.options[wrong].text,exact:true}).check();
      await block.getByRole("button",{name: /^Check (?:answer|Answer and Continue →)$/}).click();
      await expect(block).toContainText(q.options[wrong].explanation);
      await block.getByRole("button",{name:"Try without feedback",exact:true}).click();
      await block.getByRole("radio",{name:q.options[q.answer].text,exact:true}).check();
      await block.getByRole("button",{name: /^Check (?:answer|Answer and Continue →)$/}).click();
      await expect(block).toContainText(q.options[q.answer].explanation);
    }
    await page.reload(); await showAllPractice(page);
    for(const q of questions) await expect(page.locator(`#question-${q.id}`).getByRole("radio",{name:q.options[q.answer].text,exact:true})).toBeChecked();
  });
  test(`${id}: route explorer supports keyboard switching and hides stale reasoning`, async ({page}) => {
    await page.goto(`/library/${id}`); const panel=page.locator('section[aria-labelledby="system-relationships-title"]');
    const names=id==="renal-histology"?["Blood route","Filtrate route","Nephron formation"]:["Airway levels","Exchange route","Lung maturation"];
    for(const name of names) {
      const button=panel.getByRole("button",{name,exact:true});await button.focus();await page.keyboard.press("Enter");
      await expect(button).toHaveAttribute("aria-pressed","true");await expect(panel.locator("#system-relationship-answer")).toBeHidden();
      await expect(panel.getByRole("list",{name:"Selected relationship"}).getByRole("listitem")).toHaveCount(5);
      const reveal=panel.getByRole("button",{name:"Reveal the reasoning",exact:true});await reveal.focus();await page.keyboard.press("Enter");
      await expect(panel.locator("#system-relationship-answer")).toBeVisible();
    }
    if(id==="renal-histology") {await panel.getByRole("button",{name:"Blood route",exact:true}).click();await expect(panel.getByRole("list")).not.toContainText("Capsular space");}
  });
  test(`${id}: saved resource, automated accessibility and enlarged text reflow`, async ({page},testInfo) => {
    await page.goto(`/library/${id}`);
    const save=page.getByRole("button",{name:`Save to My Study: ${lesson.title}`,exact:true});await save.click();await page.reload();
    const saved=page.getByRole("button",{name:`Saved to My Study: ${lesson.title} (remove from saved resources)`,exact:true});await expect(saved).toHaveAttribute("aria-pressed","true");await saved.click();await page.reload();await expect(save).toBeVisible();
    await showAllPractice(page);
    expect((await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze()).violations).toEqual([]);
    await page.screenshot({path:testInfo.outputPath(`${id}-desktop.png`),fullPage:true});
    await page.setViewportSize({width:320,height:900});await page.addStyleTag({content:"html { font-size: 200% !important; }"});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
    const panel=page.locator('section[aria-labelledby="system-relationships-title"]');expect(await panel.evaluate(el=>el.scrollWidth<=el.clientWidth+1)).toBe(true);
    await panel.screenshot({path:testInfo.outputPath(`${id}-enlarged.png`)});
  });
  test(`${id}: teaching and sources remain usable without JavaScript`,async({browser,baseURL})=>{
    const context=await browser.newContext({javaScriptEnabled:false,baseURL});const page=await context.newPage();await page.goto(`/library/${id}`);
    await expect(page.locator(".concept-sequence > details")).toHaveCount(13);
    await expect(page.locator(".concept-sequence > details > details")).toHaveCount(13);
    await expect(page.locator("#worked-example-heading")).toBeVisible();await context.close();
  });
}

import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import teaching from "../../src/content/library-lessons.json";
import practice from "../../src/content/transfer-practice.json";

test("foundation comparison changes the evidence without losing the lesson or micrographs", async ({ page }) => {
  await page.goto("/library/histology-foundations-tissues");
  const explorer=page.locator('section[aria-labelledby="tissue-evidence-title"]');
  await explorer.getByRole("button", {name:"Connective",exact:true}).click();
  await expect(explorer.getByRole("heading",{name:"Connective: three lines of evidence"})).toBeVisible();
  await expect(explorer.getByText("Pink colour occurs in both collagen and muscle.",{exact:false})).toBeVisible();
  await explorer.getByRole("button", {name:"Muscle",exact:true}).focus();
  await page.keyboard.press("Enter");
  await expect(explorer.getByRole("button",{name:"Muscle",exact:true})).toHaveAttribute("aria-pressed","true");
  await expect(page.getByRole("heading",{name:"Visual Study Prompts",exact:true})).toBeVisible();
  await expect(page.locator('img[src*="figures/"]').first()).toBeVisible();
});

test("paraffin preparation reports incomplete, wrong and correct orders and can reset", async ({ page }) => {
  await page.goto("/library/microscopy");
  const panel=page.locator('section[aria-labelledby="preparation-sequence-title"]');
  await panel.getByRole("button",{name:"Check sequence",exact:true}).click();
  await expect(panel.getByRole("status")).toContainText("Choose all six stages");
  const names=["Fix and preserve","Process and embed","Section and mount","Remove wax and rehydrate","Stain for contrast","Finish and coverslip"];
  for(const name of [names[1],names[0],...names.slice(2)]) await panel.getByRole("button",{name,exact:true}).click();
  await panel.getByRole("button",{name:"Check sequence",exact:true}).click();
  await expect(panel.getByRole("status")).toContainText("Revisit stage 1");
  await panel.getByRole("button",{name:"Reset sequence",exact:true}).click();
  for(const name of names) await panel.getByRole("button",{name,exact:true}).click();
  await panel.getByRole("button",{name:"Check sequence",exact:true}).click();
  await expect(panel.getByRole("status")).toContainText("Sequence matched");
  await panel.getByRole("button",{name:"Undo last stage",exact:true}).click();
  await expect(panel.getByRole("button",{name:names[5],exact:true})).toBeEnabled();
  await expect(page.getByRole("link",{name:/Open University: identifying tissues/}).first()).toHaveAttribute("href",/open\.edu/);
  await expect(page.locator('a[href*="0022155414545224"]').first()).toHaveCount(1);
});

test("lymphoid comparison keeps lymph and blood routes separate and short-name assessment is bounded", async ({ page }) => {
  await page.goto("/library/lymphoid-organs");
  const panel=page.locator('section[aria-labelledby="lymphoid-practical-title"]');
  await panel.getByRole("button",{name:"Spleen",exact:true}).click();
  await expect(panel.getByText("Capsule and trabeculae enclose red pulp with islands of white pulp.",{exact:false})).toBeVisible();
  await panel.getByRole("button",{name:"Lymphocytes from blood",exact:true}).click();
  await expect(panel.getByRole("list",{name:"Selected entry route"})).toContainText("Postcapillary HEV");
  await expect(panel.getByRole("list",{name:"Selected entry route"})).not.toContainText("afferent lymphatic");
  const input=panel.locator("#hev-name"); const field=input.locator("..");
  await field.getByRole("button",{name:"Check short answer",exact:true}).click();
  await expect(field.getByRole("status")).toContainText("Type one short name");
  await input.fill("not a high endothelial venule");
  await field.getByRole("button",{name:"Check short answer",exact:true}).click();
  await expect(field.getByRole("status")).toContainText("not assessed");
  await input.fill("HEV");
  await input.press("Tab"); await page.keyboard.press("Enter");
  await expect(field.getByRole("status")).toContainText("Name matched");
  await input.fill("afferent lymphatic");
  await field.getByRole("button",{name:"Check short answer",exact:true}).click();
  await expect(field.getByRole("status")).toContainText("different structure");
  await page.reload(); await expect(page.locator("#hev-name")).toHaveValue("");
});

for (const id of ["histology-foundations-tissues","microscopy","lymphoid-organs"]) {
  test(`${id}: new panels remain readable at 320px and 200% text with no axe violations`, async ({page}) => {
    const errors:string[]=[]; page.on("pageerror",e=>errors.push(e.message));
    await page.setViewportSize({width:320,height:900});await page.goto(`/library/${id}`);
    await page.addStyleTag({content:"html { font-size: 200% !important; }"});
    await page.evaluate(() => document.fonts.ready);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1)).toBeTruthy();
    const panels=page.locator('section[aria-labelledby="tissue-evidence-title"],section[aria-labelledby="preparation-sequence-title"],section[aria-labelledby="lymphoid-practical-title"]');
    for (const panel of await panels.all()) {
      await panel.scrollIntoViewIfNeeded();
      expect(await panel.evaluate(el=>el.scrollWidth <= el.clientWidth+1)).toBeTruthy();
    }
    const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();
    expect(result.violations).toEqual([]);expect(errors).toEqual([]);
  });
}

for (const [id, sectionCount, questionCount] of [["microscopy",6,8],["lymphoid-organs",23,11]] as const) {
  test(`${id}: complete teaching, all new explained checks and saved responses survive reload`, async ({page}) => {
    await page.goto(`/library/${id}`);
    const lesson=teaching.lessons.find(l=>l.id===id)!;
    await expect(page.locator(".concept-sequence > details")).toHaveCount(sectionCount);
    for(const step of lesson.steps) await expect(page.getByText(step.title,{exact:true}).first()).toBeVisible();
    await page.getByRole("button",{name:"Show all questions",exact:true}).click();
    const questions=practice.questions.filter(q=>q.topic===id&&q.id.startsWith("histology-depth-"));
    expect(questions).toHaveLength(questionCount);
    for(const q of questions) {
      const block=page.locator(`#question-${q.id}`);const wrong=(q.answer+1)%q.options.length;
      await block.getByRole("radio",{name:q.options[wrong].text,exact:true}).check();
      await block.getByRole("button",{name:"Check answer",exact:true}).click();
      await expect(block).toContainText(q.options[wrong].explanation);
      await block.getByRole("button",{name:"Try without feedback",exact:true}).click();
      await block.getByRole("radio",{name:q.options[q.answer].text,exact:true}).check();
      await block.getByRole("button",{name:"Check answer",exact:true}).click();
      await expect(block).toContainText(q.options[q.answer].explanation);
    }
    await page.reload();await page.getByRole("button",{name:"Show all questions",exact:true}).click();
    for(const q of questions) await expect(page.locator(`#question-${q.id}`).getByRole("radio",{name:q.options[q.answer].text,exact:true})).toBeChecked();
  });
  test(`${id}: no JavaScript retains explanations, references and worked example`, async({browser,baseURL})=>{
    const context=await browser.newContext({javaScriptEnabled:false,baseURL});const page=await context.newPage();await page.goto(`/library/${id}`);
    await expect(page.locator(".concept-sequence > details")).toHaveCount(sectionCount);
    await expect(page.locator(".concept-sequence > details > details")).toHaveCount(sectionCount);
    await expect(page.locator("#worked-example-heading")).toBeVisible();await context.close();
  });
}

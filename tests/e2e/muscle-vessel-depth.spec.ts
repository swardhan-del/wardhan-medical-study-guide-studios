import { showAllPractice } from "./helpers/practice-view";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import lessons from "../../src/content/library-lessons.json";
import specimens from "../../src/content/muscle-specimens.json";
import figures from "../../src/content/public-figures.json";
import practice from "../../src/content/transfer-practice.json";

const panelSelector='section[aria-labelledby="muscle-specimen-title"]';

test("Student can find the expanded muscle lesson, save it and return to the subject",async({page})=>{
  await page.goto("/subjects/histology");
  await page.getByRole("searchbox",{name:"Search resources",exact:true}).fill("muscle");
  const card=page.locator(".resource-card:visible").filter({has:page.locator('a[href="/library/muscle-histology"]')});
  await expect(card).toHaveCount(1); await card.getByRole("link",{name:"Read lesson",exact:true}).click();
  const title=lessons.lessons.find(l=>l.id==="muscle-histology")!.title;
  await expect(page.locator("h1")).toHaveText(title);
  await page.getByRole("link",{name:"Compare specimens",exact:true}).click();
  await expect(page.locator("#muscle-specimen-title")).toBeInViewport();
  await page.getByRole("button",{name:`Save to My Study: ${title}`,exact:true}).click();await page.reload();
  const saved=page.getByRole("button",{name:`Saved to My Study: ${title} (remove from saved resources)`,exact:true});
  await expect(saved).toHaveAttribute("aria-pressed","true");await saved.click();
  await page.getByRole("navigation",{name:"Breadcrumb"}).locator('a[href="/subjects/histology"]').click();
  await expect(page.getByRole("searchbox",{name:"Search resources",exact:true})).toBeVisible();
});

for(const id of ["muscle-histology","vessel-histology"]){
  test(`${id} exposes developmental explanation, section evidence and explained practice`,async({page})=>{
    const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
    await page.goto(`/library/${id}`);
    const steps=page.locator(".concept-sequence > details");await expect(steps).toHaveCount(18);
    for(const [index, step] of (await steps.all()).entries()){
      if((await step.getAttribute("open"))===null)await step.locator("summary").first().click();
      const expectedPractice = (lessons.lessons.find(l => l.id === id)!.steps[index] as { practice: { prompt: string; feedback: string } }).practice;
      await expect(step.getByText(expectedPractice.prompt, { exact: true })).toBeVisible();
      await step.getByRole("textbox", { name: "Your explanation", exact: true }).fill("My structure and mechanism explanation.");
      await step.getByRole("button", { name: "Check Answer and Continue →", exact: true }).click();
      await expect(step.locator('[data-feedback="self-review"]')).toContainText(expectedPractice.feedback);
      await expect(step.locator('details').filter({has:page.locator('summary', {hasText:/References for/})})).toHaveCount(1);
    }
    const questions=practice.questions.filter(q=>q.topic===id);expect(questions).toHaveLength(8);
    await showAllPractice(page);
    for(const question of questions){
      const box=page.locator(`#question-${question.id}`);
      await expect(box).toContainText(question.prompt);
      await box.getByRole("radio",{name:question.options[question.answer].text,exact:true}).check();
      await box.getByRole("button",{name: /^Check (?:answer|Answer and Continue →)$/}).click();
      await expect(box).toContainText(question.options[question.answer].explanation);
    }
    expect(errors).toEqual([]);
  });
}

test("Keyboard specimen choices reveal correct explanations and preserve source orientation",async({page},info)=>{
  await page.goto("/library/muscle-histology"); const panel=page.locator(panelSelector);
  for(const [i,item] of specimens.specimens.entries()){
    const button=panel.getByRole("button",{name:`Specimen ${i+1}`,exact:true});await button.focus();await page.keyboard.press("Enter");
    await expect(button).toHaveAttribute("aria-pressed","true");
    const figure=figures.figures.find(f=>f.id===item.figureId)!;
    const img=panel.locator("img");await expect(img).toHaveAttribute("src",figure.src);
    await expect.poll(()=>img.evaluate((el:HTMLImageElement)=>({width:el.naturalWidth,height:el.naturalHeight}))).toEqual({width:figure.width,height:figure.height});
    await panel.getByRole("button",{name:item.answer[0].toUpperCase()+item.answer.slice(1)+" muscle",exact:true}).click();
    await expect(panel.getByRole("status")).toContainText("That matches this specimen.");
    await expect(panel.getByRole("status")).toContainText(item.explanation);
    await expect(panel.getByRole("link",{name:"Image licence terms",exact:true}).first()).toHaveAttribute("href",figure.licenseUrl!);
  }
  await panel.screenshot({path:info.outputPath("muscle-specimen-exercise.png")});
});

test("Typed explanation is local, resettable and never presented as AI grading",async({page})=>{
  await page.goto("/library/muscle-histology");const panel=page.locator(panelSelector);const sent:string[]=[];
  page.on("request",r=>{if(r.method()==="POST")sent.push(r.postData()??"");});
  const text="Parallel striated fibres; I cannot identify the stain from colour.";
  await panel.locator("textarea").fill(text);await panel.getByRole("button",{name:"Compare my explanation",exact:true}).click();
  await expect(panel.getByRole("status")).toContainText("Model reasoning:");
  await expect(panel).toContainText("no AI grading");
  expect(sent.some(x=>x.includes(text))).toBe(false);
  await panel.getByRole("button",{name:"Specimen 2",exact:true}).click();await expect(panel.locator("textarea")).toHaveValue("");
  await panel.locator("textarea").fill(text);await panel.getByRole("button",{name:"Clear my explanation",exact:true}).click();await expect(panel.locator("textarea")).toHaveValue("");
  await panel.locator("textarea").fill(text);await page.reload();await expect(panel.locator("textarea")).toHaveValue("");
});

test("Unavailable image is distinguished from a successful specimen journey",async({page})=>{
  await page.route("**/images/figures/skeletal-muscle-striation.jpg",r=>r.abort());
  await page.goto("/library/muscle-histology");const panel=page.locator(panelSelector);
  await expect(panel.getByRole("status")).toContainText("image-based identification is unavailable");
  await expect(panel.getByRole("link",{name:"Creator and source",exact:true}).first()).toBeVisible();
});

test("All interpretations remain usable without JavaScript",async({browser,baseURL})=>{
  const context=await browser.newContext({javaScriptEnabled:false});const page=await context.newPage();
  await page.goto(`${baseURL}/library/muscle-histology`);const panel=page.locator(panelSelector);
  await panel.getByText("Read all three specimen interpretations",{exact:true}).click();
  for(const item of specimens.specimens)await expect(panel).toContainText(item.model);
  await expect(panel.getByRole("link",{name:"Open this specimen",exact:true})).toHaveCount(3);await context.close();
});

for(const id of ["muscle-histology","vessel-histology"]){
  test(`${id} supports 320px reflow, 200% text and accessible controls`,async({browser,baseURL},info)=>{
    const context=await browser.newContext({viewport:{width:320,height:900}});const page=await context.newPage();
    await page.goto(`${baseURL}/library/${id}`);await page.addStyleTag({content:"html { font-size: 200% !important; }"});
    await page.locator(".concept-sequence > details").evaluateAll(nodes=>nodes.forEach(n=>n.setAttribute("open","")));
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1)).toBe(true);
    const result=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();
    expect(result.violations).toEqual([]);await page.screenshot({path:info.outputPath(`${id}-320px-200text.png`),fullPage:true});await context.close();
  });
}

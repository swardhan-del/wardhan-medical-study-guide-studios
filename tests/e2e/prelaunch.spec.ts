import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const paths=["/","/start","/subjects","/library","/subjects/anatomy","/study/histology","/library/histology-foundations-tissues","/library/anatomy-foundations","/library/epithelia","/learn/renal/kidney-map","/practice/renal-challenge","/practice/physiology","/practice/histology","/practice/biophysics","/study","/contact","/privacy","/subjects/physiology","/topics/physiology-renal","/topics/topic-renal-revision-sheet","/library/renal-revision-sheet","/videos","/topics/topic-epithelia","/library/microscopy","/library/renal-histology"];
test("pre-launch surfaces have accessible names, contrast, reduced motion and narrow-screen layout",async({page},info)=>{
  test.setTimeout(120000);
  if(info.project.name==="mobile")await page.setViewportSize({width:320,height:900});
  await page.emulateMedia({reducedMotion:"reduce"});
  for(const path of paths) {
    await page.goto(path);
    expect(new URL(page.url()).origin).toBe(new URL(info.project.use.baseURL!).origin);
    await expect(page.locator("h1:visible")).toHaveCount(1);
    await expect(page.locator(".clinical-review-notice:visible")).toContainText("peer review has not been completed");
    const results=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();
    expect(results.violations,path).toEqual([]);
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),path).toBe(true);
    expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
  }
  await page.screenshot({path:info.outputPath("privacy-and-review-status.png"),fullPage:true});
});

test("a keyboard learner can skip navigation, practise, save a summary and return to saved work",async({page})=>{
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link",{name:"Skip to content"})).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
  await page.getByRole("link",{name:"Begin Anatomy Foundations",exact:true}).click();
  await expect(page).toHaveURL(/\/library\/anatomy-foundations$/);
  const question=page.locator("#concept-check-title:visible");
  await question.getByRole("radio").first().check();
  await question.getByRole("button",{name:"Check answer",exact:true}).click();
  await expect(question.getByRole("status")).toBeVisible();
  const note=page.getByRole("textbox",{name:"My oral examination notes",exact:true});
  await note.fill("Explain the reference position before using directional terms.");
  const checks=page.locator('section[aria-labelledby="summary-checklist-title"] input[type="checkbox"]:visible');
  for(const item of await checks.all())await item.check();
  await page.getByRole("button",{name:/^Save to My Study:/}).click();
  await page.reload();
  await expect(note).toHaveValue("Explain the reference position before using directional terms.");
  await expect(checks.first()).toBeChecked();
  await expect(page.getByRole("button",{name:/^Saved to My Study:/})).toHaveAttribute("aria-pressed","true");
  await page.getByRole("navigation",{name:"Primary navigation"}).getByRole("link",{name:"My Study",exact:true}).click();
  await expect(page.locator("#saved-learning")).toContainText("Anatomy Foundations: Position, Planes and Organisation");
});

test("failed figure previews and full-size images preserve explanations, credits and focus",async({page},info)=>{
  await page.route("**/images/**",route=>route.abort("failed"));
  await page.goto("/library/histology-foundations-tissues");
  const figure=page.locator(".educational-figure").first();
  const trigger=figure.getByRole("button",{name:/^Enlarge /});
  await trigger.scrollIntoViewIfNeeded();
  await expect(figure.locator(".figure-unavailable")).toContainText("Preview image unavailable");
  await expect(figure.locator("figcaption")).not.toBeEmpty();
  await trigger.focus();await page.keyboard.press("Enter");
  const dialog=page.getByRole("dialog");
  await expect(dialog).toBeVisible();await expect(dialog.getByRole("status")).toContainText("Full-size image unavailable");
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await figure.getByText("Figure source and usage",{exact:true}).click();
  await expect(figure.getByRole("link",{name:"Source description or scientific reference"})).toBeVisible();
  await figure.screenshot({path:info.outputPath("image-failure.png")});
});

test("public teaching remains readable without JavaScript",async({browser},info)=>{
  const context=await browser.newContext({javaScriptEnabled:false,viewport:info.project.use.viewport,baseURL:info.project.use.baseURL,storageState:process.env.PREVIEW_STORAGE_STATE});
  const page=await context.newPage();
  for(const path of ["/library/anatomy-foundations","/library/histology-foundations-tissues"]) {
    await page.goto(path);
    await expect(page.getByRole("heading",{name:"Learning Objectives",exact:true})).toBeVisible();
    await expect(page.getByRole("heading",{name:"Sources and Further Reading",exact:true})).toBeVisible();
    await expect(page.locator(".clinical-review-notice")).toContainText("not medical advice");
  }
  await context.close();
});

test("pre-launch browsing loads no analytics SDK or external fonts",async({page})=>{
  const resources:string[]=[];page.on("request",r=>resources.push(r.url()));
  await page.goto("/privacy");
  await expect(page.getByText(/Optional analytics is disabled for this pre-launch build/).last()).toBeVisible();
  await page.goto("/library/anatomy-foundations");
  await expect(page.locator("h1:visible")).toBeVisible();
  expect(resources.some(url=>/vercel-insights|\/_vercel\/insights|fonts\.googleapis|fonts\.gstatic/.test(url))).toBe(false);
});

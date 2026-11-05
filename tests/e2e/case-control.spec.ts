import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import data from "../../src/content/library-lessons.json";
import studio from "../../src/content/study-questions.json";

const id = "cohort-case-control-denominators";
const lesson = data.lessons.find(l => l.id === id)!;
const questions = studio.questions.filter(q => q.topic === id);

test("case-control: subject, search, map and return navigation reach one original lesson", async ({ page }) => {
  await page.goto("/subjects/biostatistics");
  await expect(page.getByRole("heading", { level: 1, name: "Biostatistics", exact: true })).toBeVisible();
  await page.getByRole("searchbox").fill("denominator");
  const card = page.locator(".resource-card:visible").filter({ has: page.locator(`a[href="/library/${id}"]`) });
  await expect(card).toHaveCount(1);
  await card.getByRole("link", { name: "Read lesson", exact: true }).click();
  await expect(page.locator(".concept-sequence > details")).toHaveCount(8);
  await page.goBack(); await expect(page).toHaveURL(/subjects\/biostatistics/);
  await page.goto("/study/map");
  await page.getByRole("combobox", { name: "Subject", exact: true }).selectOption("biostatistics");
  await page.getByRole("searchbox", { name: "Find a topic" }).fill("Variables and study design");
  await page.locator(`a[href="/library/${id}"]`).click();
  await expect(page.getByRole("heading", { level: 1, name: lesson.title, exact: true })).toBeVisible();
});

test("case-control: all integer explorer states preserve counts, denominators and odds", async ({ page }) => {
  await page.goto(`/library/${id}`);
  const slider = page.getByRole("slider", { name: "Population B: number experiencing the outcome" });
  const population = page.getByRole("region", { name: "Population B — adjustable", exact: true });
  for (let n = 40; n <= 960; n += 4) {
    await slider.evaluate((input, value) => {
      Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, String(value));
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }, n);
    const a = 3*n/4, b = (1000-n)/4, c = n/4, d = 3*(1000-n)/4;
    const riskE = a/(a+b), riskU = c/(c+d);
    await expect(page.getByRole("status").filter({ hasText: "Population B:" })).toContainText(`${n} outcomes among 1000; exposed risk ${riskE.toFixed(4)}, unexposed risk ${riskU.toFixed(4)}; risk ratio ${(riskE/riskU).toFixed(4)}; odds ratio 9`);
    await expect(population.locator("dd")).toHaveText([String(a),String(b),String(c),String(d),`${n}/1000`,`${a}/${a+b} = ${riskE.toFixed(4)}`,`${c}/${c+d} = ${riskU.toFixed(4)}`,(riskE/riskU).toFixed(4),"9"]);
    expect(a*d).toBe(9*b*c);
  }
  await slider.focus(); await page.keyboard.press("Home"); await expect(slider).toHaveValue("40");
  await page.keyboard.press("ArrowRight"); await expect(slider).toHaveValue("44");
  await page.keyboard.press("End"); await expect(slider).toHaveValue("960");
});

test("case-control: explained questions preserve answers and existing student work", async ({ page }) => {
  const old=data.lessons.find(l=>l.id==='standard-deviation-standard-error')!;
  await page.goto('/library/'+old.id);
  const oldQuestion=page.locator('#question-concept-'+old.id);
  await oldQuestion.getByRole('radio',{name:old.question.options[0].text,exact:true}).check();
  await oldQuestion.getByRole('button',{name:'Check answer',exact:true}).click();
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('wardhan-learning:v1')!).answers['concept-standard-deviation-standard-error']);
  await page.goto(`/library/${id}`);
  const main=page.locator('#question-concept-'+id);
  await main.getByRole('radio',{name:lesson.question.options[0].text,exact:true}).check();
  await main.getByRole('button',{name:'Check answer',exact:true}).click();
  await expect(main).toContainText(lesson.question.options[0].reason);
  for(const q of questions){
    await page.goto(q.href);const block=page.locator('#question-'+q.id);
    const wrong=(q.answer+1)%q.options.length;
    await block.getByRole('radio',{name:q.options[wrong].text,exact:true}).check();
    await block.getByRole('button',{name:'Check answer',exact:true}).click();await expect(block).toContainText(q.options[wrong].explanation);
    await block.getByRole('button',{name:'Try without feedback',exact:true}).click();
    await block.getByRole('radio',{name:q.options[q.answer].text,exact:true}).check();
    await block.getByRole('button',{name:'Check answer',exact:true}).click();await expect(block).toContainText(q.options[q.answer].explanation);
  }
  await page.reload();await page.getByRole('button',{name:'Show all questions',exact:true}).click();
  await expect(page.locator('.practice-question:visible')).toHaveCount(6);
  for(const q of questions)await expect(page.locator('#question-'+q.id).getByRole('radio',{name:q.options[q.answer].text,exact:true})).toBeChecked();
  await page.goto('/library/'+old.id);expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('wardhan-learning:v1')!).answers['concept-standard-deviation-standard-error'])).toEqual(before);
});

test("case-control: keyboard, mobile enlarged text, sources, reading list and boundaries",async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/library/'+id);
  const save=page.getByRole('button',{name:'Save to My Study: '+lesson.title,exact:true});await save.click();await page.reload();
  const saved=page.getByRole('button',{name:'Saved to My Study: '+lesson.title+' (remove from saved resources)',exact:true});await expect(saved).toHaveAttribute('aria-pressed','true');await saved.click();await page.reload();await expect(save).toBeVisible();
  const explanation=page.locator('.case-control-explorer details');await explanation.locator('summary').focus();await page.keyboard.press('Enter');await expect(explanation).toHaveAttribute('open','');
  await expect(page.locator('#lesson-source a[href="https://www.cdc.gov/field-epi-manual/php/chapters/analyze-interpret-data.html"]')).toHaveCount(1);
  await expect(page.locator('#lesson-source a[href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10502767/"]')).toHaveCount(1);
  await page.getByRole('button',{name:'Show all questions',exact:true}).click();expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  await page.setViewportSize({width:320,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  expect(await page.locator('.case-control-explorer dt,.case-control-explorer dd').evaluateAll(xs=>xs.every(x=>x.scrollWidth<=x.clientWidth))).toBe(true);
  await expect(page.locator('main a[href*="dropbox"]')).toHaveCount(0);await expect(page.locator('main a[download]')).toHaveCount(0);
  for(const path of ['/review','/.env','/.private/candidate-lessons.json','/library/case-control-raw-source'])expect((await page.request.get(path)).status()).toBe(404);
  await page.goto('/library?subject=biostatistics');await page.getByRole('searchbox').fill('no-case-control-result-987654');await expect(page.locator('.catalog-empty')).toBeVisible();await page.locator('.catalog-empty').getByRole('button',{name:'Clear filters',exact:true}).click();await expect(page.locator('.resource-card:visible').first()).toBeVisible();expect(errors).toEqual([]);
});

test('case-control: no-JavaScript reading retains complete tables and explicit download limits',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,baseURL});const page=await context.newPage();await page.goto('/library/'+id);
 await expect(page.locator('.case-control-populations section')).toHaveCount(2);await expect(page.locator('.case-control-populations')).toContainText('375/500 = 0.7500');
 await expect(page.locator('.case-control-explorer')).toContainText('The slider requires JavaScript');
 await expect(page.locator('section[aria-labelledby="worked-example-heading"]')).toContainText('75/300 = 1/4');
 expect((await page.request.get('/study/biostatistics/revision')).status()).toBe(404);await context.close();
});

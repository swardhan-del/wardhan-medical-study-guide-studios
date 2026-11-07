import { showAllPractice, compareAnatomyModels } from "./helpers/practice-view";
import { newEntryLessonIds } from "../../src/content/subject-hubs";
import { mkdirSync } from "node:fs";
import { test, expect } from '@playwright/test';
import data from '../../src/content/library-lessons.json';

test('a pending radio copy cannot interfere with an active practice question',async({page})=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/library/indicator-dilution');
  // Reproduce a same-named input in a not-yet-hydrated streaming copy.
  await page.evaluate(()=>{
    const pending=document.createElement('input');pending.type='radio';
    pending.name='concept-indicator-dilution';pending.hidden=true;document.body.append(pending);
  });
  const check=page.locator('#question-concept-indicator-dilution');
  await showAllPractice(page);await check.getByRole('radio', { name: data.lessons.find(l => l.id === 'indicator-dilution')!.question.options[1].text, exact: true }).check();
  await check.getByRole('button',{name: /^Check (?:answer|Answer and Continue →)$/}).click();
  await expect(check.getByRole('status')).toContainText('Correct');
  expect(errors).toEqual([]);
});

test('map filters separate available introductions from planned adaptations',async({page})=>{
  await page.goto('/study');
  await page.getByRole('link',{name:'Open study map',exact:true}).click();
  await expect(page.getByRole('heading',{level:1})).toHaveText('See how the subjects connect');
  await page.getByRole('combobox',{name:'Subject',exact:true}).selectOption('biostatistics');
  await page.getByRole('combobox',{name:'Availability',exact:true}).selectOption('available');
  await expect(page.getByRole('status')).toContainText('4 topics');
  await expect(page.getByRole('link',{name:'Distributions and graphical summaries'})).toBeVisible();
  await page.getByRole('button',{name:'Clear filters'}).click();
  await page.getByRole('searchbox',{name:'Find a topic'}).fill('myelin');
  await expect(page.getByRole('link',{name:'Myelin, supporting cells and peripheral ganglia',exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('link',{name:'Myelin, supporting cells and peripheral ganglia',exact:true}).click();
  await expect(page).toHaveURL(/\/library\/myelin-and-glial-cells$/);
  await expect(page.getByRole('heading',{level:1})).toContainText('Myelin and glia');
});

for(const lesson of data.lessons.filter(l=>'workedExample' in l)){
  test(`guided lesson renders and saves its answer: ${lesson.id}`,async({page},info)=>{
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('/library/'+lesson.id);
    await expect(page.getByRole('heading',{level:1})).toHaveText(lesson.title);
    await expect(page.getByRole('heading',{name:['histology-foundations-tissues', 'anatomy-foundations', ...newEntryLessonIds].includes(lesson.id) ? 'Learning Objectives' : 'What you will be able to explain'})).toBeVisible();
    const worked=page.locator('section[aria-labelledby="worked-example-heading"]:visible');
    await worked.locator('summary').click();
    await expect(worked.locator('ol')).toBeVisible();
    const check=page.locator('#question-concept-'+lesson.id);
    await showAllPractice(page);await check.getByRole('radio', { name: lesson.question.options[lesson.question.answer].text, exact: true }).check();
    await check.getByRole('button',{name: /^Check (?:answer|Answer and Continue →)$/}).click();
    await expect(check.getByRole('status')).toContainText('Correct');
    await page.reload();await showAllPractice(page);
    await expect(check.getByRole('radio', { name: lesson.question.options[lesson.question.answer].text, exact: true })).toBeChecked();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(errors).toEqual([]);
    if (lesson.subject === 'anatomy' && lesson.id !== 'anatomy-foundations') {
      await expect(page.getByRole('navigation', { name: 'Anatomy volume navigation' })).toBeVisible();
      await compareAnatomyModels(page, 1);
      const shots = process.env.ANATOMY_SCREENSHOT_DIR;
      if (shots) { mkdirSync(shots, { recursive: true }); await page.screenshot({path: `${shots}/${lesson.id}-${info.project.name}.jpg`, fullPage:true, quality:65}); }
    }
    if(lesson.id==='indicator-dilution') await page.screenshot({path:info.outputPath('guided-lesson.png'),fullPage:true});
  });
}

for (const id of ['lymph-and-fluid-exchange', 'nitrogen-metabolism']) {
  test(`mechanism supplement is accessible and keyboard readable: ${id}`, async ({ page }) => {
    await page.goto('/library/' + id);
    const figure = page.locator(`[data-teaching-figure="${id}"]:visible`);
    await expect(figure).toBeVisible();
    const description = figure.getByText('Read a text description', { exact: true });
    await description.focus();
    await page.keyboard.press('Enter');
    await expect(figure.locator('details')).toHaveAttribute('open', '');
    const worked = page.locator('section[aria-labelledby="worked-example-heading"]:visible');
    await expect(worked.locator('ol')).toBeHidden();
    await worked.locator('summary').focus();
    await page.keyboard.press('Enter');
    await expect(worked.locator('ol')).toBeVisible();
    await page.setViewportSize({ width: 320, height: 800 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    const { default: AxeBuilder } = await import('@axe-core/playwright');
    const results = await new AxeBuilder({ page }).include('main').analyze();
    expect(results.violations).toEqual([]);
  });
}

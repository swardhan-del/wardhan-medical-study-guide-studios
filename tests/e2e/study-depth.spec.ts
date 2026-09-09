import { test, expect } from '@playwright/test';
import data from '../../src/content/library-lessons.json';

test('map filters separate available introductions from planned adaptations',async({page},info)=>{
  await page.goto('/study');
  await page.getByRole('link',{name:'Open study map',exact:true}).click();
  await expect(page.getByRole('heading',{level:1})).toHaveText('See how the subjects connect');
  await page.getByRole('combobox',{name:'Subject',exact:true}).selectOption('biostatistics');
  await page.getByRole('combobox',{name:'Availability',exact:true}).selectOption('available');
  await expect(page.getByRole('status')).toContainText('0 topics');
  await expect(page.getByText(/No topics match/)).toBeVisible();
  await page.getByRole('button',{name:'Clear filters'}).click();
  await page.getByRole('searchbox',{name:'Find a topic'}).fill('myelin');
  await expect(page.getByRole('link',{name:'Myelin and supporting cells'})).toBeVisible();
  await page.screenshot({path:info.outputPath('study-map.png'),fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.getByRole('link',{name:'Myelin and supporting cells'}).click();
  await expect(page.getByRole('heading',{level:1})).toContainText('Myelin and glia');
});

for(const lesson of data.lessons.filter(l=>'workedExample' in l)){
  test(`guided lesson renders and saves its answer: ${lesson.id}`,async({page},info)=>{
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('/library/'+lesson.id);
    await expect(page.getByRole('heading',{level:1})).toHaveText(lesson.title);
    await expect(page.getByRole('heading',{name:'What you will be able to explain'})).toBeVisible();
    const worked=page.locator('section[aria-labelledby="worked-example-heading"]:visible');
    await worked.locator('summary').click();
    await expect(worked.locator('ol')).toBeVisible();
    const check=page.locator('#concept-check-title:visible');
    await check.getByRole('radio').nth(lesson.question.answer).check();
    await check.getByRole('button',{name:'Check answer',exact:true}).click();
    await expect(check.getByRole('status')).toContainText('Correct.');
    await page.reload();
    await expect(check.getByRole('radio').nth(lesson.question.answer)).toBeChecked();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    expect(errors).toEqual([]);
    if(lesson.id==='indicator-dilution') await page.screenshot({path:info.outputPath('guided-lesson.png'),fullPage:true});
  });
}

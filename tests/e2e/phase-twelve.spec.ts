import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import library from '../../src/content/library-lessons.json';
import transfer from '../../src/content/transfer-practice.json';
import quality from '../../src/content/lesson-quality.json';

for(const record of quality.records){
 const id=record.lessonId;
 const lesson=library.lessons.find(l=>l.id===id)!;
 test(`Phase 12: ${id} explanations, preview status, keyboard, visuals and saved answers`,async({page},info)=>{
  test.setTimeout(90000);
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.emulateMedia({reducedMotion:'reduce'});
  if(info.project.name==='mobile')await page.setViewportSize({width:320,height:844});
  const response=await page.goto(`/library/${id}`);expect(response?.status()).toBe(200);
  await expect(page.getByRole('heading',{level:1})).toHaveText(lesson.title);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
  const panel=page.locator('.lesson-transparency');await panel.locator('summary').focus();await page.keyboard.press('Enter');
  await expect(panel).toContainText('Medical review pending');await expect(panel).toContainText('Independent clinical review has not been completed');
  await expect(panel).toContainText('Proposed visuals are awaiting rights review');
  const region=page.locator(`[data-lesson-visuals="${id}"]:visible`);await expect(region).toBeVisible();
  await region.locator('summary').first().focus();await page.keyboard.press('Enter');await expect(region.locator('details').first()).toHaveAttribute('open','');
  const worked=page.locator('section[aria-labelledby="worked-example-heading"]:visible');await worked.locator('summary').click();await expect(worked.locator('ol')).toBeVisible();
  const current=[{...lesson.question,options:lesson.question.options.map(o=>({text:o.text,explanation:o.reason}))},...transfer.questions.filter(q=>q.topic===id&&(q.id.includes('-phase12-')||id==='fluid-and-membrane-transport'))];
  for(const q of current){
   const card=page.locator('.practice-question:visible').filter({hasText:q.prompt});
   const wrong=q.options[(q.answer+1)%q.options.length];await card.getByRole('radio',{name:wrong.text,exact:true}).check();await card.getByRole('button',{name:'Check answer',exact:true}).click();await expect(card.getByRole('status')).toContainText('Review the distinction.');
   await card.getByRole('button',{name:'Try without feedback',exact:true}).click();await card.getByRole('radio',{name:q.options[q.answer].text,exact:true}).check();await card.getByRole('button',{name:'Check answer',exact:true}).click();
   for(const o of q.options)await expect(card.getByRole('status')).toContainText(o.explanation);
  }
  await page.reload();
  for(const q of current)await expect(page.locator('.practice-question:visible').filter({hasText:q.prompt}).getByRole('radio',{name:q.options[q.answer].text,exact:true})).toBeChecked();
  await panel.locator('summary').click();
  if(info.project.name==='mobile')await page.evaluate(()=>{document.documentElement.style.fontSize='20px';});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  const result=await new AxeBuilder({page}).include('.lesson-transparency').include('[data-lesson-visuals]').analyze();expect(result.violations).toEqual([]);
  expect((await page.locator('article').allInnerTexts()).join('\n')).not.toMatch(/\.private|source-intake|Dropbox|Semifinal_Master/);
  await region.screenshot({path:info.outputPath(`${id}-visuals.png`)});expect(errors).toEqual([]);
 });
}

test('Phase 12 pending routes stay out of sitemap and raw intake stays inaccessible',async({request})=>{
 const sitemap=await(await request.get('/sitemap.xml')).text();
 for(const q of quality.records)expect(sitemap).not.toContain(`/library/${q.lessonId}</loc>`);
 for(const path of ['/.private/source-intake/2026-10-01/','/.private/working/phase-twelve/phase12-membrane-transport.patch'])expect((await request.get(path)).status()).toBe(404);
});

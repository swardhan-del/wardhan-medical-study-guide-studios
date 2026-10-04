import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import visuals from '../../src/content/lesson-visuals.json';
import {emptyProgress} from '../../src/lib/learning-core';

const originals=visuals.visuals.filter(v=>v.kind==='svg');
for(const visual of originals){
 test(`${visual.id}: responsive SVG, text alternatives and keyboard feedback`,async({page},info)=>{
  test.setTimeout(120000);
  await page.emulateMedia({reducedMotion:'reduce'});
  const lesson=visual.lessonIds[0];
  for(const width of [320,390,1440]){
   await page.setViewportSize({width,height:1000});
   const response=await page.goto('/library/'+lesson);expect(response?.status()).toBe(200);
   const figure=page.locator('#visual-'+visual.id+':visible');
   await expect(figure).toBeVisible();
   const svg=figure.getByRole('img',{name:visual.title});
   await expect(svg).toHaveAttribute('aria-describedby',/.+/);
   await expect(svg.locator('desc')).toHaveText(visual.alt);
   await expect(figure.locator('figcaption')).toContainText(visual.caption);
   await expect(figure.locator('figcaption')).toContainText(visual.observe);
   await expect(figure.locator('.visual-credit')).toHaveText('Original diagram — Wardhan Medical Study Guide Studios.');
   await expect(figure.locator('.original-diagram-review')).toContainText('Scientific, editorial and human accessibility review pending');
   for(const url of visual.sourceUrls!)await expect(figure.locator(`.visual-sources a[href="${url}"]`)).toBeVisible();
   await expect(svg.locator('image,animate,animateTransform,foreignObject,script')).toHaveCount(0);
   const geometry=await svg.evaluate((el:SVGSVGElement)=>{
    const bounds=el.viewBox.baseVal,scale=el.getBoundingClientRect().width/bounds.width;
    const labels=[...el.querySelectorAll('text')].map(text=>{
     const b=text.getBBox();return {text:text.textContent,x:b.x,y:b.y,right:b.x+b.width,bottom:b.y+b.height,font:parseFloat(getComputedStyle(text).fontSize)*scale};
    });return {width:bounds.width,height:bounds.height,labels};
   });
   for(const label of geometry.labels){
    expect(label.x,label.text??'label').toBeGreaterThanOrEqual(0);
    expect(label.y,label.text??'label').toBeGreaterThanOrEqual(0);
    expect(label.right,label.text??'label').toBeLessThanOrEqual(geometry.width);
    expect(label.bottom,label.text??'label').toBeLessThanOrEqual(geometry.height);
    expect(label.font,label.text??'label').toBeGreaterThanOrEqual(14);
   }
   const frame=figure.getByRole('region',{name:visual.title+'; scroll horizontally on a narrow screen'});
   if(width<760){await frame.focus();await page.keyboard.press('ArrowRight');await expect.poll(()=>frame.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);}
   const check=figure.locator('.diagram-knowledge-check');
   await expect(check).toContainText(visual.knowledgeCheck!.prompt);
   await expect(check.locator('details')).not.toHaveAttribute('open','');
   await check.getByText('Show the explained answer',{exact:true}).focus();await page.keyboard.press('Enter');
   await expect(check.locator('details')).toHaveAttribute('open','');
   await expect(check.locator('details p')).toHaveText(visual.knowledgeCheck!.explanation);
   await figure.locator('.visual-description summary').focus();await page.keyboard.press('Enter');
   await expect(figure.locator('.visual-description p')).toBeVisible();
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
   const accessibility=await new AxeBuilder({page}).include('#visual-'+visual.id).withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
   expect(accessibility.violations).toEqual([]);
   await figure.screenshot({path:info.outputPath(`${visual.id}-${width}.png`)});
   if(width===1440)await svg.screenshot({path:info.outputPath(`${visual.id}-svg.png`)});
  }
 });
}

test('new diagram knowledge checks do not overwrite existing lesson notes, answers or progress',async({page})=>{
 const seed=emptyProgress();
 for(const visual of originals){
  const id=visual.lessonIds[0];seed.lessons.push(id);seed.oral.push(id);
  seed.drafts[`oral-${id}`]=`Saved explanation for ${id}.\nKeep my notes.`;
  seed.answers[`concept-${id}`]={attempts:2,correct:1,lastCorrect:true,streak:1,dueAt:1791244800000,firstCorrect:false,lastAt:1790985600000,lastChoice:0,assisted:false};
 }
 await page.goto('/');
 const key=await page.evaluate(async progress=>{
  // Match the repository's existing browser persistence contract.
  const storageKey='wardhan-learning:v1';localStorage.setItem(storageKey,JSON.stringify(progress));return storageKey;
 },seed);
 for(const visual of originals){
  await page.goto('/library/'+visual.lessonIds[0]);
  await expect(page.getByRole('textbox',{name:'My explanation',exact:true})).toHaveValue(seed.drafts[`oral-${visual.lessonIds[0]}`]);
  await expect(page.getByRole('button',{name:'Lesson complete — reopen',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.locator('#visual-'+visual.id+' .diagram-knowledge-check summary').click();
 }
 const after=await page.evaluate(key=>JSON.parse(localStorage.getItem(key)!),key);
 expect(after.drafts).toEqual(seed.drafts);expect(after.answers).toEqual(seed.answers);
 expect(after.lessons).toEqual(seed.lessons);expect(after.oral).toEqual(seed.oral);
});

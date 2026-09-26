import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import visuals from '../../src/content/lesson-visuals.json';
import figures from '../../src/content/public-figures.json';

const lessonIds = [...new Set(visuals.visuals.flatMap(v=>v.lessonIds))];
for (let start=0;start<lessonIds.length;start+=10) {
 test(`visual placements and semantic equivalents: lessons ${start+1}–${Math.min(start+10,lessonIds.length)}`,async({page},info)=>{
  test.setTimeout(120000);
  for(const id of lessonIds.slice(start,start+10)) {
   const response=await page.goto('/library/'+id);expect(response?.status()).toBe(200);
   const region=page.locator(`[data-lesson-visuals="${id}"]:visible`);await expect(region).toBeVisible();
   for(const visual of visuals.visuals.filter(v=>v.lessonIds.includes(id))) {
    const figure=region.locator('#visual-'+visual.id);
    await expect(figure).toHaveAttribute('aria-label',visual.title);
    await expect(figure.locator('figcaption')).toContainText(visual.caption);
    await expect(figure.locator('figcaption')).toContainText(visual.observe);
    await expect(figure.locator('.visual-credit')).toContainText('Original teaching layout');
    expect(await figure.locator('.visual-sources a').count()).toBeGreaterThan(0);
    await figure.locator('summary').focus();await page.keyboard.press('Enter');
    await expect(figure.locator('details')).toHaveAttribute('open','');
    await expect(figure.locator('details')).toContainText(visual.alt);
    if(visual.kind==='comparison') {
     await expect(figure.locator('table')).toBeVisible({visible:info.project.name==='desktop'});
     const mobile=figure.locator('.visual-comparison-mobile');
     await expect(mobile).toBeVisible({visible:info.project.name==='mobile'});
     for(const row of visual.rows!) for(const cell of row) await expect(mobile).toContainText(cell);
    }
   }
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  }
 });
}

test('visual components meet automated accessibility checks and narrow-screen/reduced-motion requirements',async({page},info)=>{
 test.setTimeout(120000);
 await page.emulateMedia({reducedMotion:'reduce'});
 for(const route of ['/library/enzyme-kinetics','/library/placenta','/library/connective-tissue','/library/muscle-histology','/library/anatomy-foundations','/library/histology-foundations-tissues','/practice/biophysics','/practice/physiology','/practice/histology','/subjects/anatomy/thorax','/subjects/anatomy/musculoskeletal','/learn/renal/kidney-map']) {
  await page.goto(route);await expect(page.locator('[data-visual-standard]:visible').first()).toBeVisible();
  const results=await new AxeBuilder({page}).include('[data-visual-standard]').withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa']).analyze();
  expect(results.violations,route).toEqual([]);
 }
 await page.setViewportSize({width:320,height:800});
 for(const id of ['enzyme-kinetics','muscle-histology','biophysics-practical-attenuation']) {
  await page.goto('/library/'+id);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
  await page.locator('[data-visual-standard]:visible').first().screenshot({path:info.outputPath(id+'-320.png')});
 }
});

test('approved image failure retains explanation and a keyboard-operable enlarged fallback',async({page})=>{
 await page.route('**/images/figures/**',route=>route.abort());
 await page.goto('/library/histology-foundations-tissues');
 const figure=page.locator('#figure-cuboidal-section:visible');await figure.scrollIntoViewIfNeeded();
 await expect(figure.getByRole('status')).toContainText('Image unavailable.');
 await expect(figure.locator('figcaption')).toContainText('Observe and explain:');
 const button=figure.getByRole('button',{name:'Try the full-size image'});await button.focus();await page.keyboard.press('Enter');
 const dialog=page.getByRole('dialog');await expect(dialog.getByRole('status')).toContainText('Full-size image unavailable.');
 await expect(dialog.getByRole('button',{name:'Close image'})).toBeFocused();await page.keyboard.press('Escape');await expect(button).toBeFocused();
});

test('all approved figure files and source metadata remain available',async({request})=>{
 for(const f of figures.figures) {
  const response=await request.get(f.src);expect(response.status()).toBe(200);expect(response.headers()['content-type']).toContain('image/');
  expect(f.alt.length).toBeGreaterThan(30);expect(f.observe.length).toBeGreaterThan(40);expect(f.sourceUrl).toMatch(/^https:\/\//);
 }
});

test('printable revision uses the same comparison and includes descriptions when images cannot load',async({page})=>{
 await page.route('**/images/figures/**',route=>route.abort());
 await page.goto('/study/biochemistry/revision');
 const figure=page.locator('#visual-enzyme-inhibition-models:visible');await expect(figure).toBeVisible();
 await page.emulateMedia({media:'print'});await expect(figure.locator('table')).toBeVisible();await expect(figure.locator('.visual-comparison-mobile')).toBeHidden();
 await expect(figure.locator('figcaption')).toContainText('Observe and explain:');
});

test('interactive microscopy retains stage navigation and questions when the specimen cannot load',async({page})=>{
 await page.route(url=>url.pathname.startsWith('/_next/image'),route=>route.abort());
 await page.goto('/library/epithelia');
 const lesson=page.locator('#microscope-sequence:visible');
 await lesson.getByRole('button',{name:'3. Real section A',exact:true}).click();
 await expect(lesson.locator('.visual-image-fallback')).toContainText('Image unavailable.');
 await expect(lesson.getByRole('radio').first()).toBeVisible();
 await expect(lesson.locator('[data-visual-standard] figcaption')).toContainText('Source magnification');
 await lesson.getByRole('button',{name:'1. Learn the pattern',exact:true}).focus();await page.keyboard.press('Enter');
 await expect(lesson.locator('svg')).toBeVisible();
});

test('diagram frames preserve label size and allow horizontal keyboard scrolling at 320 pixels',async({page})=>{
 await page.setViewportSize({width:320,height:800});await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/practice/biophysics');
 const frame=page.getByRole('region',{name:'Teaching plot; scroll horizontally on a narrow screen'}).first();
 await expect(frame).toBeVisible();
 expect(await frame.locator('svg').evaluate(el=>el.getBoundingClientRect().width)).toBeGreaterThanOrEqual(500);
 await frame.focus();await page.keyboard.press('ArrowRight');
 await expect.poll(()=>frame.evaluate(el=>el.scrollLeft)).toBeGreaterThan(0);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});

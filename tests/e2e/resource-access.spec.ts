import { test, expect } from '@playwright/test';
import taxonomy from '../../src/content/library-taxonomy.json';
import catalog from '../../src/content/public-catalog.json';

test('search is visible before scrolling and finds lesson text with spelling recovery', async ({page}, info) => {
  await page.goto('/');
  const search = page.getByRole('searchbox', {name:'What do you want to understand?'});
  await expect(search).toBeInViewport();
  await search.fill('axillary artery');
  await page.getByRole('button', {name:'Search', exact:true}).click();
  await expect(page).toHaveURL(/q=axillary/);
  await expect(page.getByRole('searchbox', {name:'Search resources'})).toBeInViewport();
  await expect(page.getByRole('link', {name:'Brachial plexus from roots to terminal nerves', exact:true})).toBeVisible();
  await page.getByRole('searchbox', {name:'Search resources'}).fill('brachal plexus');
  await page.getByRole('button', {name:'brachial plexus',exact:true}).click();
  await expect(page.getByRole('link', {name:'Brachial plexus from roots to terminal nerves',exact:true})).toBeVisible();
  await page.screenshot({path:info.outputPath('search.png')});
});

test('all twelve subjects show their released resources or honest empty state', async ({page},info) => {
  test.setTimeout(120000);
  const errors: string[] = []; page.on('pageerror', e=>errors.push(e.message));
  for (const subject of taxonomy.subjects) {
    await page.goto('/subjects/' + subject.id);
    await expect(page.getByRole('heading',{level:1})).toHaveText(subject.title);
    const ids = new Set(taxonomy.nodes.filter(n=>n.subject===subject.id).flatMap(n=>n.resources));
    if (ids.size) {
      const browser = page.locator('#website-lessons .catalog-browser');
      await expect(browser.getByRole('status')).toHaveText(`${ids.size} resource${ids.size===1?'':'s'}`);
      const link = browser.locator('.resource-card h2 a').first();
      await link.click();
      await expect(page.getByRole('heading',{level:1})).toBeVisible();
    } else await expect(page.getByRole('heading', { name: 'No public lessons yet', exact: true })).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),subject.id).toBe(true);
    await page.goto('/library?subject='+subject.id);
    await expect(page.getByRole('combobox',{name:'Subject',exact:true})).toHaveValue(subject.id);
    await expect(page.getByRole('status')).toHaveText(`${ids.size} resource${ids.size===1?'':'s'}`);
  }
  expect(errors).toEqual([]);
  await page.screenshot({path:info.outputPath('subject-filter.png')});
});

test('nineteen legacy resource URLs reach the actual material', async ({request},info)=>{
  test.setTimeout(120000);
  if(info.project.name!=='desktop') return;
  for(const record of catalog.records.filter(r=>'href' in r && ['WEB','ACTIVITY'].includes(r.format))) {
    const response=await request.get('/library/'+record.id);
    expect(response.ok(),record.id).toBe(true);
    // Streaming redirects are covered below in the real browser; non-streaming redirects resolve here.
    const body=await response.text();
    expect(body,record.id).not.toContain('TOPIC EXPLORER');
  }
});

test('renal results and old bookmarks open the lesson without a second read button',async({page})=>{
  await page.goto('/library/renal-filtration-and-clearance');
  await expect(page).toHaveURL(/\/learn\/renal\/filtration-and-clearance$/);
  await expect(page.getByRole('heading',{level:1})).toContainText('clearance');
  await page.goto('/library?q=clearance');
  const link=page.locator('.resource-card h2 a').filter({hasText:'What does renal clearance actually measure?'});
  await expect(link).toHaveAttribute('href','/learn/renal/filtration-and-clearance');
});

test('plexus recall hides labels and applied questions explain alternatives',async({page},info)=>{
  await page.goto('/library/limbs-plexus-and-joints');
  await page.getByRole('button',{name:'Hide plexus labels'}).click();
  await expect(page.getByRole('list',{name:'Five levels of the brachial plexus',exact:true})).not.toContainText('Posterior cord');
  await page.getByRole('button',{name:'Show plexus labels'}).click();
  const question=page.locator('.practice-question:visible').filter({hasText:'In a simplified plexus map'});
  await question.getByRole('radio',{name:'Upper trunk → posterior division → posterior cord',exact:true}).check();
  await question.getByRole('button',{name:'Check answer',exact:true}).click();
  await expect(question.getByRole('status')).toContainText('Correct');
  await question.screenshot({path:info.outputPath('applied-anatomy.png')});
});

test('unsupported native sharing offers the existing export fallback',async({page})=>{
  await page.addInitScript(()=>Object.defineProperty(navigator,'canShare',{value:()=>false,configurable:true}));
  await page.goto('/study');
  await page.getByRole('button',{name:'Share a transfer file',exact:true}).click();
  await expect(page.locator('#progress-transfer [role=status]')).toContainText('Use Export progress and saved resources');
  await expect(page.getByRole('button',{name:'Export progress and saved resources',exact:true})).toBeEnabled();
});

test('anatomy course connects all five volumes to lessons and printable collections', async ({ page }) => {
  await page.goto('/study/anatomy');
  await expect(page.getByRole('heading', { name: '120 lessons, from landmarks to regional reasoning' })).toBeVisible();
  await page.getByRole('link', { name: 'Begin Volume I', exact: true }).click();
  await expect(page).toHaveURL(/\/library\/thoracic-cage-landmarks$/);
  await expect(page.getByRole('navigation', { name: 'Anatomy volume navigation' })).toContainText('Lesson 1 of 18');
  await page.getByRole('link', { name: 'Volume contents', exact: true }).click();
  await expect(page.locator('.guide-part')).toHaveCount(5);
  const expected=[18,22,18,30,32];
  for (let i=0;i<5;i++) await expect(page.locator(`#anatomy-volume-${i+1}`)).toContainText(`${expected[i]} available lessons`);
  await page.getByRole('link', { name: 'Choose parts and print notes', exact: true }).click();
  await expect(page.locator('.revision-lesson')).toHaveCount(120);
  await page.getByRole('button', { name: 'Clear selection' }).click();
  await page.locator('.guide-options input').nth(4).check();
  await expect(page.locator('.revision-lesson')).toHaveCount(32);
  await expect(page.locator('.revision-answers')).toContainText('Vertebral and skull development');
  await expect(page.locator('.revision-answers')).not.toContainText('Fetal shunts and adult remnants');
});

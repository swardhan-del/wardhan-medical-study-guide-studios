import { showAllPractice } from "./helpers/practice-view";
import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {createHash} from 'node:crypto';
import teaching from '../../src/content/library-lessons.json';
import practice from '../../src/content/transfer-practice.json';
import specimen from '../../src/content/reproductive-specimen.json';
import maps from '../../src/content/reproductive-route-explorer.json';
const route='/library/reproductive-histology';
const lesson=teaching.lessons.find(l=>l.id==='reproductive-histology')!;
const panelSelector='section[aria-labelledby="reproductive-specimen-title"]';
const imagePath='/images/figures/human-epididymis-he.jpg';
const imageSha='c6fdf934ecc96b2876b60c34f54f72493e0c3a82255ea94e8d08bb3668eed311';

test('Reproductive depth: every explanation and source is readable',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));expect((await page.goto(route))?.status()).toBe(200);
 const sections=page.locator('.concept-sequence > details');await expect(sections).toHaveCount(36);
 for(const [i,s] of lesson.steps.entries()){expect(await sections.nth(i).locator(':scope > p').allTextContents()).toEqual(s.body.split('\n\n'));expect(await sections.nth(i).locator('a[href^="https://"]').count()).toBeGreaterThan(0);}
 expect(await page.locator('main').innerText()).not.toMatch(/\/Users\/|rlkey=|Library\/CloudStorage/);expect(await page.locator('main a[href*="dropbox"]').count()).toBe(0);expect(errors).toEqual([]);
});

test('Reproductive depth: specimen regions and local answer comparison',async({page},info)=>{
 const sent:string[]=[];page.on('request',r=>{if(r.postData()?.includes('temporary-reproductive-response'))sent.push(r.url())});
 await page.goto(route);await page.getByRole('link',{name:'Read the specimen',exact:true}).click();const panel=page.locator(panelSelector);await expect(panel.locator('img')).toHaveCount(1);await expect.poll(()=>panel.locator('img').evaluate(e=>(e as HTMLImageElement).naturalWidth)).toBe(1856);
 for(const [i,r] of specimen.regions.entries()){const b=panel.getByRole('button',{name:`${i+1}. ${r.label}`,exact:true});await b.focus();await page.keyboard.press('Enter');await expect(b).toHaveAttribute('aria-pressed','true');await expect(page.locator('#reproductive-region-description')).toContainText(r.observation);}
 await panel.getByRole('button',{name:'Hide region markers',exact:true}).click();await expect(panel.locator('[class*="markers"]')).toHaveCount(0);await panel.getByRole('button',{name:'Show region markers',exact:true}).click();
 await panel.locator('textarea').fill('temporary-reproductive-response: the tall lining differs from the small vascular profile.');await panel.getByRole('button',{name:'Compare with model reasoning',exact:true}).click();await expect(panel.getByRole('status')).toContainText(specimen.model);
 expect(await page.evaluate(()=>JSON.stringify(localStorage))).not.toContain('temporary-reproductive-response');expect(sent).toEqual([]);
 await panel.getByRole('button',{name:'Clear my response',exact:true}).click();await expect(panel.locator('textarea')).toHaveValue('');await panel.locator('textarea').fill('temporary-reproductive-response');await page.reload();await showAllPractice(page);await expect(panel.locator('textarea')).toHaveValue('');await panel.screenshot({path:info.outputPath('reproductive-specimen.png')});
});

test('Reproductive depth: maps distinguish sequence from developmental contributors',async({page})=>{
 await page.goto(route);await page.getByRole('link',{name:'Explore transport and development',exact:true}).click();const panel=page.locator('section[aria-labelledby="reproductive-route-title"]');
 for(const m of maps.maps){const select=panel.getByRole('button',{name:m.label,exact:true});await select.focus();await page.keyboard.press('Enter');await expect(select).toHaveAttribute('aria-pressed','true');const list=panel.getByRole('list',{name:m.title,exact:true}),steps=list.getByRole('button');await expect(steps).toHaveCount(m.steps.length);await expect(steps.first()).toHaveAttribute('aria-pressed','true');
  for(const [i,s] of m.steps.entries()){await steps.nth(i).focus();await page.keyboard.press('Enter');await expect(page.locator('#reproductive-route-detail')).toContainText(s.detail);expect(await steps.nth(i).evaluate(e=>getComputedStyle(e).outlineWidth)).toBe('3px');}
  await expect(list.locator('[class*="arrow"]')).toHaveCount(m.sequential?m.steps.length-1:0);await expect(panel).toContainText(m.limit);
 }
});

test('Reproductive depth: all 32 original questions explain choices and retain answers',async({page})=>{
 test.setTimeout(180000);await page.goto(route);await showAllPractice(page);const questions=practice.questions.filter(q=>q.id.startsWith('reproductive-depth-'));expect(questions).toHaveLength(32);
 for(const q of questions){const block=page.locator(`#question-${q.id}`);for(const [i,o] of q.options.entries()){if(i===q.answer)continue;await showAllPractice(page);await block.getByRole('radio',{name:o.text,exact:true}).check();await block.getByRole('button',{name: /^Check (?:answer|Answer and Continue →)$/}).click();await expect(block).toContainText(o.explanation);await block.getByRole('button',{name:'Try without feedback',exact:true}).click();}await showAllPractice(page);await block.getByRole('radio',{name:q.options[q.answer].text,exact:true}).check();await block.getByRole('button',{name: /^Check (?:answer|Answer and Continue →)$/}).click();await expect(block).toContainText(q.options[q.answer].explanation);}
 await page.reload();await showAllPractice(page);for(const q of questions)await expect(page.locator(`#question-${q.id}`).getByRole('radio',{name:q.options[q.answer].text,exact:true})).toBeChecked();
});

test('Reproductive depth: credited public image and actual download match cleared bytes',async({page,request})=>{
 const r=await request.get(imagePath);expect(r.status()).toBe(200);expect(createHash('sha256').update(await r.body()).digest('hex')).toBe(imageSha);
 await page.goto(route);const panel=page.locator(panelSelector);await expect(panel.getByRole('link',{name:'CC BY-SA 3.0 terms',exact:true})).toHaveAttribute('href','https://creativecommons.org/licenses/by-sa/3.0/');await expect(panel).toContainText('Nonessential embedded metadata removed');
 const pending=page.waitForEvent('download');await panel.getByRole('link',{name:'Download credited specimen image',exact:true}).click();const download=await pending;expect(download.suggestedFilename()).toBe('human-epididymis-he.jpg');const stream=await download.createReadStream(),chunks:Buffer[]=[];for await(const chunk of stream!)chunks.push(chunk);expect(createHash('sha256').update(Buffer.concat(chunks)).digest('hex')).toBe(imageSha);
});

test('Reproductive depth: accessibility and 320px enlarged controls',async({page,browser,baseURL},info)=>{
 const context=await browser.newContext({baseURL,viewport:{width:1440,height:1000}}),audit=await context.newPage();await audit.goto(route);expect((await new AxeBuilder({page:audit}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);await context.close();
 await page.goto(route);await page.setViewportSize({width:320,height:900});await page.addStyleTag({content:'html{font-size:200% !important}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 for(const [i,selector] of [panelSelector,'section[aria-labelledby="reproductive-route-title"]'].entries()){const panel=page.locator(selector);expect(await panel.evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);await panel.scrollIntoViewIfNeeded();await page.screenshot({path:info.outputPath(`reproductive-mobile-${i}.png`)});}
 await page.getByRole('button',{name:'Developmental contributors',exact:true}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});

test('Reproductive depth: image failure and no JavaScript retain explanations',async({page,browser,baseURL})=>{
 await page.route('**/human-epididymis-he.jpg',r=>r.abort());await page.goto(route);await expect(page.locator(panelSelector).getByRole('status')).toContainText('specimen image could not load');
 const context=await browser.newContext({baseURL,javaScriptEnabled:false}),plain=await context.newPage();await plain.goto(route);const panel=plain.locator(panelSelector);await panel.getByText('Read all four region explanations',{exact:true}).click();for(const r of specimen.regions)await expect(panel.getByText(r.interpretation,{exact:true}).last()).toBeVisible();await panel.getByText('Read the model without entering a response',{exact:true}).click();await expect(panel.getByText(specimen.model,{exact:true})).toBeVisible();
 const explorer=plain.locator('section[aria-labelledby="reproductive-route-title"]');await explorer.getByText('Read both complete maps',{exact:true}).click();for(const m of maps.maps)for(const s of m.steps)await expect(explorer.getByText(s.detail,{exact:false}).last()).toBeVisible();await context.close();
});

test('Reproductive depth: discovery and printable continuity',async({page})=>{
 await page.goto('/library?subject=histology');await page.getByRole('searchbox').fill('stereocilia');const card=page.locator('.resource-card:visible').filter({has:page.locator(`a[href="${route}"]`)});await expect(card).toHaveCount(1);await card.getByRole('link',{name:'Read lesson',exact:true}).click();await expect(page).toHaveURL(new RegExp(route+'$'));await expect(page.locator('h1')).toHaveText(lesson.title);
 await page.getByRole('navigation',{name:'Breadcrumb'}).locator('a[href="/subjects/histology"]').click();await expect(page).toHaveURL(/\/subjects\/histology$/);
 await page.goto('/study/histology/revision');await page.getByRole('button',{name:'Clear selection',exact:true}).click();await page.getByRole('checkbox',{name:/Reproductive histology: testis, ovary and uterus/}).check();const printable=page.locator('.revision-lesson');await expect(printable).toHaveCount(1);await expect(printable).toContainText('Trace the relationships around an antral oocyte');await expect(printable).toContainText('Three planes through one stipulated object');await expect(printable).toContainText('Count chromosome sets separately from DNA content');await expect(page.locator(`img[src="${imagePath}"]`)).toHaveCount(1);await expect(page.locator('main')).toContainText('CC BY-SA 3.0');
});

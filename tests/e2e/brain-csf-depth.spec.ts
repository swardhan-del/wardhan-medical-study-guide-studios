import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {createHash} from 'node:crypto';
import teaching from '../../src/content/library-lessons.json';
import practice from '../../src/content/transfer-practice.json';
import specimen from '../../src/content/brain-csf-specimen.json';
import explorer from '../../src/content/brain-barrier-explorer.json';
import guides from '../../src/content/printable-guides.json';
const route='/library/brain-and-csf-barriers';
const lesson=teaching.lessons.find(x=>x.id==='brain-and-csf-barriers')!;
const panelSelector='section[aria-labelledby="brain-csf-specimen-title"]';
const imagePath='/images/figures/human-choroid-plexus-labelled.jpg';

test('Barrier explanations expose every section reference without private sources',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));expect((await page.goto(route))?.status()).toBe(200);await expect(page.locator('h1')).toHaveText(lesson.title);
 const sections=page.locator('.concept-sequence > details');await expect(sections).toHaveCount(30);
 for(const [i,s] of lesson.steps.entries()){expect(await sections.nth(i).locator(':scope > p').allTextContents()).toEqual(s.body.split('\n\n'));expect(await sections.nth(i).locator('a[href^="https://"]').count()).toBeGreaterThan(0);}
 expect(await page.locator('main').innerText()).not.toMatch(/\/Users\/|rlkey=|Library\/CloudStorage/);expect(await page.locator('main a[href*="dropbox"]').count()).toBe(0);expect(errors).toEqual([]);
});

test('Specimen regions keep the original labels and local typed comparison',async({page},info)=>{
 await page.goto(route);const panel=page.locator(panelSelector);await page.getByRole('link',{name:'Read the specimen',exact:true}).click();await expect(panel.locator('img')).toHaveCount(1);await expect(panel).toContainText('original photograph’s text and arrows');
 for(const [i,r] of specimen.regions.entries()){const b=panel.getByRole('button',{name:`${i+1}. ${r.label}`,exact:true});await b.focus();await page.keyboard.press('Enter');await expect(b).toHaveAttribute('aria-pressed','true');await expect(page.locator('#brain-csf-region-description')).toContainText(r.observation);}
 await panel.getByRole('button',{name:'Hide region markers',exact:true}).click();await expect(panel.locator('[class*="markers"]')).toHaveCount(0);await expect(panel.locator('img')).toBeVisible();
 await panel.locator('textarea').fill('The pale vascular core is enclosed by an epithelial layer; the outer surface faces CSF.');await panel.getByRole('button',{name:'Compare with model reasoning',exact:true}).click();await expect(panel.getByRole('status')).toContainText(specimen.model);await panel.getByRole('button',{name:'Clear my response',exact:true}).click();await expect(panel.locator('textarea')).toHaveValue('');await panel.locator('textarea').fill('Transient response');await page.reload();await expect(panel.locator('textarea')).toHaveValue('');await panel.screenshot({path:info.outputPath('brain-csf-specimen.png')});
});

test('Every compartment is reachable by keyboard and route changes reset its selection',async({page})=>{
 await page.goto(route);await page.getByRole('link',{name:'Explore barrier routes',exact:true}).click();const panel=page.locator('#brain-barrier-explorer');
 for(const r of explorer.routes){const b=panel.getByRole('button',{name:r.label,exact:true});await b.focus();await page.keyboard.press('Enter');await expect(b).toHaveAttribute('aria-pressed','true');const steps=panel.getByRole('list',{name:r.title,exact:true}).getByRole('button');await expect(steps).toHaveCount(r.steps.length);await expect(steps.first()).toHaveAttribute('aria-pressed','true');
 for(const [i,s] of r.steps.entries()){await steps.nth(i).focus();await page.keyboard.press('Enter');await expect(steps.nth(i)).toHaveAttribute('aria-pressed','true');await expect(page.locator('#brain-barrier-step')).toContainText(s.detail);expect(await steps.nth(i).evaluate(e=>getComputedStyle(e).outlineWidth)).toBe('3px');}await expect(panel).toContainText(r.limit);}
});

test('Evidence scenarios explain all options and clear stale answers',async({page})=>{
 await page.goto(route);const panel=page.locator('#brain-barrier-explorer');
 for(const [index,s] of explorer.cases.entries()){await panel.getByRole('button',{name:`${index+1}. ${s.title}`,exact:true}).click();const block=page.locator('#brain-barrier-case');await expect(block.getByRole('button',{name:'Check this interpretation',exact:true})).toBeDisabled();await expect(block.getByRole('status')).toHaveCount(0);
 for(const o of s.options){await block.getByRole('radio',{name:o.text,exact:true}).check();await block.getByRole('button',{name:'Check this interpretation',exact:true}).click();await expect(block.getByRole('status')).toContainText(o.explanation);}await block.getByRole('button',{name:'Reset this scenario',exact:true}).click();await expect(block.locator('input:checked')).toHaveCount(0);await expect(block.getByRole('status')).toHaveCount(0);}
});

test('All 25 applied questions give option feedback and preserve saved answers',async({page})=>{
 test.setTimeout(120000);await page.goto(route);await page.getByRole('button',{name:'Show all questions',exact:true}).click();const questions=practice.questions.filter(q=>q.id.startsWith('brain-csf-depth-'));expect(questions).toHaveLength(25);
 for(const q of questions){const block=page.locator(`#question-${q.id}`);for(const [i,o] of q.options.entries()){if(i===q.answer)continue;await block.getByRole('radio',{name:o.text,exact:true}).check();await block.getByRole('button',{name:'Check answer',exact:true}).click();await expect(block).toContainText(o.explanation);await block.getByRole('button',{name:'Try without feedback',exact:true}).click();}await block.getByRole('radio',{name:q.options[q.answer].text,exact:true}).check();await block.getByRole('button',{name:'Check answer',exact:true}).click();await expect(block).toContainText(q.options[q.answer].explanation);}
 await page.reload();await page.getByRole('button',{name:'Show all questions',exact:true}).click();for(const q of questions)await expect(page.locator(`#question-${q.id}`).getByRole('radio',{name:q.options[q.answer].text,exact:true})).toBeChecked();
});

test('Credited image request and actual download match the approved original',async({page,request})=>{
 const r=await request.get(imagePath);expect(r.status()).toBe(200);expect(createHash('sha256').update(await r.body()).digest('hex')).toBe('91f87f49a5a043ea89cb81197a9e19bc9aca80b64e6a64c04c645c59d85a046b');
 await page.goto(route);const panel=page.locator(panelSelector);await expect(panel.getByRole('link',{name:'CC0 1.0 terms',exact:true})).toHaveAttribute('href','https://creativecommons.org/publicdomain/zero/1.0/');const pending=page.waitForEvent('download');await panel.getByRole('link',{name:'Download credited specimen image',exact:true}).click();const download=await pending;expect(download.suggestedFilename()).toBe('human-choroid-plexus-labelled.jpg');const stream=await download.createReadStream();const chunks:Buffer[]=[];for await(const c of stream!)chunks.push(c);expect(createHash('sha256').update(Buffer.concat(chunks)).digest('hex')).toBe('91f87f49a5a043ea89cb81197a9e19bc9aca80b64e6a64c04c645c59d85a046b');
});

test('Accessibility and enlarged narrow text retain region and scenario controls',async({page,browser,baseURL},info)=>{
 const context=await browser.newContext({baseURL,viewport:{width:1440,height:1000}});const audit=await context.newPage();await audit.goto(route);expect((await new AxeBuilder({page:audit}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);await context.close();
 await page.goto(route);await page.setViewportSize({width:320,height:900});await page.addStyleTag({content:'html {font-size:200% !important;}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
 for(const selector of [panelSelector,'#brain-barrier-explorer']){const panel=page.locator(selector);expect(await panel.evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);await panel.scrollIntoViewIfNeeded();await page.screenshot({path:info.outputPath(selector===panelSelector?'brain-csf-mobile-specimen.png':'brain-csf-mobile-routes.png')});}
 const panel=page.locator('#brain-barrier-explorer');await panel.getByRole('button',{name:explorer.routes[1].label,exact:true}).click();await panel.getByRole('button',{name:'4. Identity versus growth',exact:true}).click();await page.locator('#brain-barrier-case').getByRole('radio').first().check();await panel.getByRole('button',{name:'Check this interpretation',exact:true}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
});

test('Image failure and no JavaScript preserve complete explanations',async({page,browser,baseURL})=>{
 await page.route('**/human-choroid-plexus-labelled.jpg',r=>r.abort());await page.goto(route);await expect(page.locator(panelSelector).getByRole('status')).toContainText('specimen image could not load');
 const context=await browser.newContext({baseURL,javaScriptEnabled:false});const plain=await context.newPage();await plain.goto(route);const panel=plain.locator(panelSelector);await panel.getByText('Read all three region explanations',{exact:true}).click();for(const r of specimen.regions)await expect(panel.getByText(r.interpretation,{exact:true}).last()).toBeVisible();await panel.getByText('Read the model without entering a response',{exact:true}).click();await expect(panel.getByText(specimen.model,{exact:true})).toBeVisible();const routes=plain.locator('#brain-barrier-explorer');await routes.getByText('Read both routes and every compartment',{exact:true}).click();for(const r of explorer.routes)for(const s of r.steps)await expect(routes.getByText(s.detail,{exact:false}).last()).toBeVisible();await routes.getByText('Read all four scenarios and their reasoning',{exact:true}).click();for(const s of explorer.cases)await expect(routes.getByText(s.options[s.answer].explanation,{exact:false}).last()).toBeVisible();await context.close();
});

test('Revision rendering keeps the complete unit, specimen and credits',async({page})=>{
 const part=guides.parts.find(p=>p.id==='histology-part-13')!;await page.goto('/study/histology/revision');await page.getByRole('button',{name:'Clear selection',exact:true}).click();await page.getByRole('checkbox',{name:`${part.number}. ${part.title}`,exact:true}).check();const section=page.locator('#histology-part-13');for(const s of lesson.steps)await expect(section).toContainText(s.title);await expect(section).toContainText('Tulemo');await expect(section.locator(`img[src="${imagePath}"]`)).toHaveCount(1);await page.emulateMedia({media:'print'});await expect(page.locator('.guide-selector')).toBeHidden();
});

test('First-time journey finds the lesson, saves it and returns to Histology II',async({page})=>{
 await page.goto('/');await page.getByRole('navigation',{name:'Primary navigation'}).getByRole('link',{name:'Subjects',exact:true}).click();await page.locator('a[href="/subjects/histology"]').click();await page.getByRole('searchbox',{name:'Search resources',exact:true}).fill('barriers');const card=page.locator('.resource-card:visible').filter({has:page.locator(`a[href="${route}"]`)});await expect(card).toHaveCount(1);await card.getByRole('link',{name:'Read lesson',exact:true}).click();await expect(page.locator('h1')).toHaveText(lesson.title);
 await page.getByRole('button',{name:`Save to My Study: ${lesson.title}`,exact:true}).click();await page.reload();const saved=page.getByRole('button',{name:`Saved to My Study: ${lesson.title} (remove from saved resources)`,exact:true});await expect(saved).toHaveAttribute('aria-pressed','true');await saved.click();await page.getByRole('navigation',{name:'Breadcrumb'}).locator('a[href="/subjects/histology-ii"]').click();await expect(page.getByRole('searchbox',{name:'Search resources',exact:true})).toBeVisible();
});

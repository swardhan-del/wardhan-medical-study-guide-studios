import { showAllPractice } from "./helpers/practice-view";
import type {LibraryLesson} from '../../src/lib/library-types';
import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {createHash} from 'node:crypto';
import teaching from '../../src/content/library-lessons.json';
import practice from '../../src/content/transfer-practice.json';
import specimen from '../../src/content/neurulation-specimen.json';
import videos from '../../src/content/public-videos.json';
import release from '../../src/content/public-release.json';
import guides from '../../src/content/printable-guides.json';
const route='/library/neurulation';
const lesson=teaching.lessons.find(x=>x.id==='neurulation')! as LibraryLesson;
const panelSelector='section[aria-labelledby="neurulation-specimen-title"]';
const research=videos.records.filter(x=>x.lessonIds.includes('neurulation'));

test('Research library routes retain credits and return to the neural lesson',async({page})=>{
 for(const v of research){expect((await page.goto('/videos/'+v.id))?.status()).toBe(200);await expect(page.locator('h1')).toHaveText(v.title);await expect(page.getByRole('link',{name:'CC BY 4.0',exact:true})).toHaveAttribute('href','https://creativecommons.org/licenses/by/4.0/');await expect(page.locator('video')).toHaveAttribute('preload','none');await page.locator('a[href="/library/neurulation"]').first().click();await expect(page.locator('h1')).toHaveText(lesson.title);}
});

test('Neural explanations retain all sections, references and privacy boundaries',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));expect((await page.goto(route))?.status()).toBe(200);
 await expect(page.locator('h1')).toHaveText(lesson.title);const sections=page.locator('.concept-sequence > details');await expect(sections).toHaveCount(23);
 for(const [i,s] of lesson.steps.entries()){expect(await sections.nth(i).locator(':scope > p').allTextContents()).toEqual(s.body.split('\n\n'));expect(await sections.nth(i).locator('a[href^="https://"]').count()).toBeGreaterThan(0);await sections.nth(i).getByRole("textbox", { name: "Your explanation", exact: true }).fill("My mechanism explanation before comparing."); await sections.nth(i).getByRole("button", { name: "Check Answer and Continue →", exact: true }).click();await expect(sections.nth(i)).toContainText(s.practice!.feedback);}
 expect(await page.locator('main').innerText()).not.toMatch(/\/Users\/|rlkey=|Library\/CloudStorage/);expect(await page.locator('main a[href*="dropbox"]').count()).toBe(0);expect(errors).toEqual([]);
 await expect(page.locator('img[src="/images/figures/chick-neural-tube-labels.jpg"]')).toHaveCount(1);
});

test('Neural specimen regions support keyboard, hidden hints and local model comparison',async({page},info)=>{
 await page.goto(route);await page.getByRole('link',{name:'Read the specimen',exact:true}).click();const panel=page.locator(panelSelector);
 for(const [i,r] of specimen.regions.entries()){const button=panel.getByRole('button',{name:`${i+1}. ${r.label}`,exact:true});await button.focus();await page.keyboard.press('Enter');await expect(button).toHaveAttribute('aria-pressed','true');expect(await button.evaluate(e=>getComputedStyle(e).outlineWidth)).not.toBe('0px');await expect(page.locator('#neurulation-region-description')).toContainText(r.interpretation);}
 await expect(panel.locator('[aria-hidden="true"] span')).toHaveCount(4);await panel.getByRole('button',{name:'Hide region markers'}).click();await expect(panel.locator('[aria-hidden="true"] span')).toHaveCount(0);await panel.getByRole('button',{name:'Show region markers'}).click();
 const sent:string[]=[];page.on('request',r=>{if(r.method()==='POST')sent.push(r.postData()??'');});const response='My neural observation: nuclei do not outline cell borders.';await panel.locator('textarea').fill(response);await panel.getByRole('button',{name:'Compare with model reasoning',exact:true}).click();await expect(panel.getByRole('status')).toContainText(specimen.model);expect(sent.some(s=>s.includes(response))).toBe(false);expect(await page.evaluate(()=>JSON.stringify(localStorage))).not.toContain(response);
 await panel.screenshot({path:info.outputPath('neurulation-specimen.png')});await page.screenshot({path:info.outputPath('neurulation-viewport.png')});await panel.locator('textarea').fill('Changed response');await expect(panel.getByRole('status')).toHaveCount(0);await panel.getByRole('button',{name:'Clear my response'}).click();await expect(panel.locator('textarea')).toHaveValue('');await panel.locator('textarea').fill('Transient');await page.reload();await showAllPractice(page);await expect(panel.locator('textarea')).toHaveValue('');
});

test('Neural applied questions explain every option and retain saved answers',async({page})=>{
 test.setTimeout(90000);await page.goto(route);await showAllPractice(page);const questions=practice.questions.filter(q=>q.id.startsWith('neurulation-depth-'));expect(questions).toHaveLength(22);
 for(const q of questions){const block=page.locator(`#question-${q.id}`);for(const [i,o] of q.options.entries()){if(i===q.answer)continue;await showAllPractice(page);await block.getByRole('radio',{name:o.text,exact:true}).check();await block.getByRole('button',{name: /^Check (?:answer|Answer and Continue →)$/}).click();await expect(block).toContainText(o.explanation);await block.getByRole('button',{name:'Try without feedback',exact:true}).click();}await showAllPractice(page);await block.getByRole('radio',{name:q.options[q.answer].text,exact:true}).check();await block.getByRole('button',{name: /^Check (?:answer|Answer and Continue →)$/}).click();await expect(block).toContainText(q.options[q.answer].explanation);}
 await page.reload();await showAllPractice(page);for(const q of questions)await expect(page.locator(`#question-${q.id}`).getByRole('radio',{name:q.options[q.answer].text,exact:true})).toBeChecked();
});

test('Neural movies load on demand and expose source, condition and channel keys',async({page})=>{
 const requests:string[]=[];page.on('request',r=>{if(/neural-v[57]\.mp4/.test(r.url()))requests.push(r.url());});await page.goto(route);await page.getByRole('link',{name:'Research movies',exact:true}).click();await expect(page.locator('video')).toHaveCount(2);
 for(const v of research){const section=page.getByRole('region',{name:v.title,exact:true});await expect(section.locator('video')).toHaveAttribute('preload','none');await expect(section.locator('video')).not.toHaveAttribute('autoplay','');await expect(section).toContainText('Apical left; basal right');await expect(section).toContainText('CC BY 4.0');await expect(section.getByRole('link',{name:'CC BY 4.0',exact:true})).toHaveAttribute('href','https://creativecommons.org/licenses/by/4.0/');await section.getByText('Visual description',{exact:true}).click();for(const line of v.transcript)await expect(section).toContainText(line.text);}
 expect(requests).toEqual([]);
});

test('Both research movies decode, seek, change speed and reach the end',async({page},info)=>{
 test.setTimeout(90000);await page.goto(route);await page.getByRole('link',{name:'Research movies',exact:true}).click();
 for(const v of research){const section=page.getByRole('region',{name:v.title,exact:true});const player=section.locator('video');await section.getByText('Visual description',{exact:true}).click();await section.getByRole('button',{name:'Seek to 0:00',exact:true}).click();await expect.poll(()=>player.evaluate((e:HTMLVideoElement)=>e.readyState),{timeout:15000}).toBeGreaterThanOrEqual(2);expect(await player.evaluate((e:HTMLVideoElement)=>e.videoWidth)).toBe(v.width);
 await section.getByRole('combobox',{name:'Playback speed'}).selectOption('2');expect(await player.evaluate((e:HTMLVideoElement)=>e.playbackRate)).toBe(2);await player.evaluate((e:HTMLVideoElement)=>e.play());await expect.poll(()=>player.evaluate((e:HTMLVideoElement)=>e.ended),{timeout:20000}).toBe(true);await expect(section.getByRole('alert')).toHaveCount(0);
 await player.screenshot({path:info.outputPath(v.id+'-ended.png')});}
});

test('Research player failure retains scientific context and text alternatives',async({page})=>{
 await page.route('**/media/research/*.mp4',r=>r.abort());await page.goto(route);
 for(const v of research){const section=page.getByRole('region',{name:v.title,exact:true});await section.getByText('Visual description',{exact:true}).click();await section.getByRole('button',{name:'Seek to 0:00',exact:true}).click();await expect(section.getByRole('alert')).toContainText('Playback is unavailable');await expect(section).toContainText(v.transcript[0].text);await expect(section.getByRole('link',{name:'Open video in a new tab'})).toHaveAttribute('href',v.sourceUrl);}
});

test('Neural accessibility and 320px enlarged text preserve specimen and research keys',async({page,browser,baseURL},info)=>{
 const context=await browser.newContext({baseURL,viewport:{width:1440,height:1000}});const audit=await context.newPage();await audit.goto(route);expect((await new AxeBuilder({page:audit}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze()).violations).toEqual([]);await context.close();
 await page.goto(route);await page.setViewportSize({width:320,height:900});await page.addStyleTag({content:'html {font-size:200% !important;}'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBe(true);
 for(const selector of [panelSelector,'#lesson-videos']){const section=page.locator(selector);expect(await section.evaluate(e=>e.scrollWidth<=e.clientWidth+1)).toBe(true);await section.scrollIntoViewIfNeeded();await page.screenshot({path:info.outputPath(selector===panelSelector?'neural-mobile-specimen.png':'neural-mobile-videos.png')});}
});

test('Neural image failure and no JavaScript keep complete region and research explanations',async({page,browser,baseURL})=>{
 await page.route('**/chick-neural-tube-labels.jpg',r=>r.abort());await page.goto(route);await expect(page.locator(panelSelector).getByRole('status')).toContainText('specimen image could not load');
 const context=await browser.newContext({baseURL,javaScriptEnabled:false});const plain=await context.newPage();await plain.goto(route);const panel=plain.locator(panelSelector);await panel.getByText('Read all four region explanations',{exact:true}).click();for(const r of specimen.regions)await expect(panel.getByText(r.interpretation,{exact:true}).last()).toBeVisible();await panel.getByText('Read the model without entering a response',{exact:true}).click();await expect(panel.getByText(specimen.model,{exact:true})).toBeVisible();for(const v of research){const section=plain.getByRole('region',{name:v.title,exact:true});await section.getByText('Visual description',{exact:true}).click();await expect(section).toContainText(v.transcript[0].text);}await context.close();
});

test('Approved neural assets and the actual specimen download retain their hashes',async({page,request})=>{
 test.setTimeout(90000);for(const a of release.assets.filter(a=>a.path.includes('media/research/neural-')||a.path==='images/figures/chick-neural-tube-labels.jpg')){const r=await request.get('/'+a.path);expect(r.status()).toBe(200);expect(createHash('sha256').update(await r.body()).digest('hex')).toBe(a.sha256);}
 await page.goto(route);const download=page.waitForEvent('download');await page.locator(panelSelector).getByRole('link',{name:'Download credited specimen image'}).click();expect((await download).suggestedFilename()).toBe('chick-neural-tube-labels.jpg');
});

test('Existing folding activity and neural revision keep accessible learning content',async({page})=>{
 await page.goto(route);await page.getByRole('link',{name:'Explore folding',exact:true}).click();const fourth=page.getByRole('button',{name:'4. Surface and tube are distinct',exact:true});await fourth.focus();await page.keyboard.press('Enter');await expect(fourth).toHaveAttribute('aria-pressed','true');
 await page.goto('/library/neural-tube-development');await expect(page.locator('.concept-sequence > details')).toHaveCount(4);await expect(page.getByRole('button',{name:'4. Surface and tube are distinct',exact:true})).toBeVisible();
 const part=guides.parts.find(p=>p.id==='histology-part-13')!;await page.goto('/study/histology/revision');await page.getByRole('button',{name:'Clear selection',exact:true}).click();await page.getByRole('checkbox',{name:`${part.number}. ${part.title}`,exact:true}).check();const section=page.locator('#histology-part-13');for(const s of lesson.steps)await expect(section).toContainText(s.title);await expect(section).toContainText('Arwen Wilcock');await expect(section.locator('img[src^="/images/figures/chick-neural-tube-labels.jpg"]')).toHaveCount(1);await page.emulateMedia({media:'print'});await expect(page.locator('.guide-selector')).toBeHidden();
});

test('Student discovers neural lesson, saves it and returns to the subject',async({page})=>{
 await page.goto('/');await page.getByRole('navigation',{name:'Primary navigation'}).getByRole('link',{name:'Subjects',exact:true}).click();await page.locator('a[href="/subjects/histology"]').click();await page.getByRole('searchbox',{name:'Search resources',exact:true}).fill('neurulation');const card=page.locator('.resource-card:visible').filter({has:page.locator('a[href="/library/neurulation"]')});await expect(card).toHaveCount(1);await card.getByRole('link',{name:'Read lesson',exact:true}).click();await expect(page.locator('h1')).toHaveText(lesson.title);
 await page.getByRole('button',{name:`Save to My Study: ${lesson.title}`,exact:true}).click();await page.reload();await showAllPractice(page);const saved=page.getByRole('button',{name:`Saved to My Study: ${lesson.title} (remove from saved resources)`,exact:true});await expect(saved).toHaveAttribute('aria-pressed','true');await saved.click();await page.getByRole('navigation',{name:'Breadcrumb'}).locator('a[href="/subjects/histology"]').click();await expect(page.getByRole('searchbox',{name:'Search resources',exact:true})).toBeVisible();
});

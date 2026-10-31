import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import library from '../../src/content/library-lessons.json';
import studio from '../../src/content/study-questions.json';
import {emptyProgress} from '../../src/lib/learning-core';

const id='blood-and-haemostasis', route=`/library/${id}`;
const lesson=library.lessons.find(l=>l.id===id)!;
const additions=['studio-apply-blood-endothelium-restraint','studio-apply-blood-adhesion-versus-aggregation'];
const questions=studio.questions.filter(q=>additions.includes(q.id));

test('haemostasis restores old progress and explains both new applications on desktop and mobile',async({page},info)=>{
 test.setTimeout(90000);
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 const before=emptyProgress(), note='Before this upgrade: adhesion and aggregation are different.\nKeep my wording.';
 before.lessons=[id];before.drafts[`oral-${id}`]=note;
 before.journey[id]={read:true,reviewed:true,saved:true,at:1790985600000};
 for(const [qid,choice] of [[`concept-${id}`,1],['studio-apply-blood-and-haemostasis',0]] as const)
  before.answers[qid]={attempts:3,correct:2,lastCorrect:true,streak:2,dueAt:1791331200000,firstCorrect:false,lastAt:1791072000000,lastChoice:choice,assisted:false};
 await page.addInitScript(state=>{if(!localStorage.getItem('wardhan-learning:v1'))localStorage.setItem('wardhan-learning:v1',JSON.stringify(state));},before);
 if(info.project.name==='mobile')await page.setViewportSize({width:320,height:844});
 await page.emulateMedia({reducedMotion:'reduce'});
 expect((await page.goto(route))?.status()).toBe(200);
 await expect(page.getByRole('heading',{level:1})).toHaveText(lesson.title);
 await expect(page.locator('.concept-sequence details').first()).toContainText('nitric oxide and prostacyclin');
 await expect(page.getByRole('region',{name:/^Application question [1-3]$/})).toHaveCount(3);
 await expect(page.getByRole('textbox',{name:'My explanation',exact:true})).toHaveValue(note);
 await expect(page.locator('#concept-check-title:visible').getByRole('radio',{name:'IXa with VIIIa',exact:true})).toBeChecked();
 const old=page.locator('.practice-question:visible').filter({hasText:'A student confuses prothrombinase with intrinsic tenase.'});
 await expect(old.getByRole('radio',{name:'Prothrombin to thrombin',exact:true})).toBeChecked();
 await expect(old).toContainText('first attempt incorrect; latest attempt correct');
 await expect(page.getByRole('button',{name:'Lesson complete — reopen',exact:true})).toHaveAttribute('aria-pressed','true');
 const panel=page.locator('.lesson-transparency');await panel.locator('summary').focus();await page.keyboard.press('Enter');
 await expect(panel).toContainText('Medical review pending');await expect(panel).toContainText('Proposed visuals are awaiting rights review');
 const worked=page.locator('section[aria-labelledby="worked-example-heading"]');await worked.locator('summary').focus();await page.keyboard.press('Enter');await expect(worked.locator('ol')).toBeVisible();
 for(const q of questions){
  const card=page.locator('.practice-question:visible').filter({hasText:q.prompt});
  const wrong=q.options[(q.answer+1)%q.options.length];await card.getByRole('radio',{name:wrong.text,exact:true}).check();await card.getByRole('button',{name:'Check answer',exact:true}).click();await expect(card.getByRole('status')).toContainText('Review the distinction.');
  for(const option of q.options)await expect(card.getByRole('status')).toContainText(option.explanation);
  await card.getByRole('button',{name:'Try without feedback',exact:true}).click();await card.getByRole('radio',{name:q.options[q.answer].text,exact:true}).check();await card.getByRole('button',{name:'Check answer',exact:true}).click();await expect(card.getByRole('status')).toContainText('Correct.');
 }
 await page.getByRole('textbox',{name:'My explanation',exact:true}).fill(note+'\nNew: the endothelium restrains platelets.');
 await page.reload();
 await expect(page.getByRole('textbox',{name:'My explanation',exact:true})).toHaveValue(note+'\nNew: the endothelium restrains platelets.');
 for(const q of questions)await expect(page.locator('.practice-question:visible').filter({hasText:q.prompt}).getByRole('radio',{name:q.options[q.answer].text,exact:true})).toBeChecked();
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('wardhan-learning:v1')!));
 for(const [qid,answer] of Object.entries(before.answers))expect(saved.answers[qid]).toEqual(answer);
 expect(saved.lessons).toContain(id);
 for(const qid of additions){expect(saved.answers[qid].lastCorrect).toBe(true);expect(saved.answers[qid].firstCorrect).toBe(false);}
 await panel.locator('summary').click();
 if(info.project.name==='mobile')await page.evaluate(()=>{document.documentElement.style.fontSize='20px';});
 await page.evaluate(()=>document.fonts.ready);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 expect((await new AxeBuilder({page}).include('.lesson-transparency').include('.practice-question').analyze()).violations).toEqual([]);
 await page.locator('.concept-sequence').screenshot({path:info.outputPath('haemostasis-sequence.png')});
 expect(errors).toEqual([]);
});

test('haemostasis sources agree with the quality panel and the route remains noindex',async({page,request})=>{
 await page.goto(route);
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
 await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',new RegExp(`${route}$`));
 await page.locator('.lesson-transparency summary').click();
 for(const url of ['https://www.ncbi.nlm.nih.gov/books/NBK534253/','https://www.ncbi.nlm.nih.gov/books/NBK57148/','https://openstax.org/books/anatomy-and-physiology-2e/pages/18-5-hemostasis']){
  await expect(page.locator(`#lesson-source a[href="${url}"]`)).toHaveCount(1);
  await expect(page.locator(`.lesson-transparency a[href="${url}"]`)).toHaveCount(1);
 }
 await expect(page.locator('.lesson-transparency')).toContainText('2026-10-03');
 expect(await(await request.get('/sitemap.xml')).text()).not.toContain(`${route}</loc>`);
 for(const link of await page.locator('.lesson-transparency nav a').evaluateAll(nodes=>nodes.map(n=>(n as HTMLAnchorElement).pathname)))expect((await request.get(link)).status()).toBe(200);
 expect((await page.locator('article').allInnerTexts()).join('\n')).not.toMatch(/\.private|source-intake|Dropbox/);
});

import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import data from '../../src/content/library-lessons.json';
const ids=['synonymous-variant-sequence-readout-scope'];
const refs=[['https://pubmed.ncbi.nlm.nih.gov/25768907/','https://pubmed.ncbi.nlm.nih.gov/12554675/','https://hgvs-nomenclature.org/stable/background/refseq/','https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi']];
for(const [index,id] of ids.entries()){
 const lesson=data.lessons.find(l=>l.id===id)!;
 test(`genetics sequence: ${id} supports reasoning, feedback, persistence and enlarged keyboard use`,async({page},info)=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/library/'+id);
  await expect(page.locator('.concept-sequence > details')).toHaveCount(8);
  const worked=page.locator('section[aria-labelledby="worked-example-heading"]:visible');await worked.locator('summary').focus();await page.keyboard.press('Enter');await expect(worked.locator('ol')).toBeVisible();await expect(worked).toContainText('P1 is AAA→AAG');
  const check=page.locator('#question-concept-'+id);await check.getByRole('radio',{name:lesson.question.options[1].text,exact:true}).check();await check.getByRole('button',{name:'Check answer',exact:true}).click();await expect(check).toContainText(lesson.question.options[1].reason);await check.getByRole('button',{name:'Try without feedback',exact:true}).click();await check.getByRole('radio',{name:lesson.question.options[0].text,exact:true}).check();await check.getByRole('button',{name:'Check answer',exact:true}).click();await expect(check).toContainText(lesson.question.options[0].reason);await page.reload();await expect(check.getByRole('radio',{name:lesson.question.options[0].text,exact:true})).toBeChecked();
  const save=page.getByRole('button',{name:`Save to My Study: ${lesson.title}`,exact:true});await save.click();await page.reload();const saved=page.getByRole('button',{name:`Saved to My Study: ${lesson.title} (remove from saved resources)`,exact:true});await expect(saved).toHaveAttribute('aria-pressed','true');await saved.click();await page.reload();await expect(save).toBeVisible();
  for(const url of refs[index])await expect(page.locator(`#lesson-source a[href="${url}"]`)).toHaveCount(1);
  await expect(page.locator('#oral-recall-title')).toBeVisible();await expect(page.locator('#summary-checklist-title')).toBeVisible();
  const oral=page.locator('section[aria-labelledby="oral-recall-title"]');await expect(oral.locator('details')).toHaveCount(5);await expect(page.locator('section[aria-labelledby="summary-checklist-title"] input[type=checkbox]')).toHaveCount(5);await oral.getByText('Model response 1',{exact:true}).focus();await page.keyboard.press('Enter');await expect(oral).toContainText(lesson.oralExamination![0].answer);const selfCheck=page.getByRole('checkbox',{name:lesson.summaryChecklist![0],exact:true});await selfCheck.check();await page.reload();await expect(selfCheck).toBeChecked();await selfCheck.uncheck();
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  await page.setViewportSize({width:320,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='200%');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await check.scrollIntoViewIfNeeded();await page.screenshot({path:info.outputPath(id+'-enlarged-feedback.png')});
  await page.getByRole('navigation',{name:'Continue studying'}).getByRole('link',{name:/learning path|lessons/}).click();await expect(page).toHaveURL(/\/study\/genetics$/);expect(errors).toEqual([]);
 });
 test(`genetics sequence: ${id} is reachable through subject and focused search`,async({page})=>{
  await page.goto('/');await page.getByRole('navigation',{name:'Primary navigation'}).getByRole('link',{name:'Subjects',exact:true}).click();await page.locator('a[href="/library?subject=genetics-all"]').click();await expect(page.getByRole('status')).toContainText('13 resources');await page.getByRole('searchbox').fill('synonymous');const card=page.locator('.resource-card:visible').filter({hasText:lesson.title});await expect(card).toHaveCount(1);await card.getByRole('link',{name:'Read lesson',exact:true}).click();await expect(page.getByRole('heading',{level:1})).toHaveText(lesson.title);
  await page.goto('/library?subject=genetics');await page.getByRole('searchbox').fill('reverse complement');await expect(page.locator('.resource-card:visible').filter({hasText:lesson.title})).toHaveCount(1);
  await page.goto('/library/'+id);await expect(page.locator(`a[href="/library/${'genetic-testing'}"]`)).not.toHaveCount(0);
 });
}
test('genetics sequence: print collection and source boundaries',async({page})=>{
 await page.goto('/study/genetics/revision');await page.getByRole('button',{name:'Clear selection',exact:true}).click();await page.getByRole('checkbox',{name:'01. Medical genetics',exact:true}).check();await expect(page.locator('.revision-lesson')).toHaveCount(7);await expect(page.locator('.revision-lesson').filter({hasText:data.lessons.find(l=>l.id===ids[0])!.title})).toHaveCount(1);
 for(const path of ['/.private/candidate-lessons.json','/src/content/library-lessons.json','/not-a-real-genetics-lesson']){const r=await page.request.get(path);expect(r.status()).toBe(404);}
 await page.goto('/library/'+ids[0]);await expect(page.locator('main a[href*="dropbox"]')).toHaveCount(0);await expect(page.locator('main a[download]')).toHaveCount(0);
});
test('genetics sequence: existing answer history survives new practice',async({page})=>{
 const oldId='concept-genetic-testing';await page.addInitScript(()=>{if(localStorage.getItem('wardhan-learning:v1'))return;localStorage.setItem('wardhan-learning:v1',JSON.stringify({version:2,lessons:['genetic-testing'],answers:{'concept-genetic-testing':{attempts:2,correct:1,lastCorrect:true,streak:1,dueAt:0,firstCorrect:false,lastAt:1000,lastChoice:0,assisted:true}},drafts:{},visits:[],quizzes:2,shares:0,oral:[],plan:null,resume:null,journey:{}}));});
 await page.goto('/library/'+ids[0]);const before=await page.evaluate(id=>JSON.parse(localStorage.getItem('wardhan-learning:v1')!).answers[id],oldId);const lesson=data.lessons.find(l=>l.id===ids[0])!;const question=page.locator('#question-concept-'+ids[0]);await question.getByRole('radio',{name:lesson.question.options[0].text,exact:true}).check();await question.getByRole('button',{name:'Check answer',exact:true}).click();const after=await page.evaluate(id=>JSON.parse(localStorage.getItem('wardhan-learning:v1')!).answers[id],oldId);expect(after).toEqual(before);await page.goto('/library/genetic-testing');await expect(page.locator('#question-'+oldId)).toContainText('first attempt incorrect');
});

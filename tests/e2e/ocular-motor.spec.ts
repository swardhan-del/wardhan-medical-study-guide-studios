import { showAllPractice, compareAnatomyModels } from "./helpers/practice-view";
import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import data from '../../src/content/library-lessons.json';
import studio from '../../src/content/study-questions.json';
import references from '../../src/content/lesson-references.json';
const id='ocular-motor-nerves',lesson=data.lessons.find(l=>l.id===id)!;
const application=studio.questions.find(q=>q.id==='studio-ocular-motor-branch-units')!;
const refs=references[id];

test('ocular-motor: existing localization, oral answers and saved checks remain usable',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/library/'+id);
 await expect(page.locator('.concept-sequence > details')).toHaveCount(9);
 const worked=page.locator('section[aria-labelledby="worked-example-heading"]:visible');await worked.locator('summary').focus();await page.keyboard.press('Enter');await expect(worked.locator('ol')).toBeVisible();await expect(worked).toContainText('Abducens VI');
 const q=page.locator('#question-concept-'+id);await showAllPractice(page);await q.getByRole('radio',{name:lesson.question.options[1].text,exact:true}).check();await q.getByRole('button',{name: /^Check (?:answer|Answer and Continue →)$/}).click();await expect(q).toContainText(lesson.question.options[1].reason);await q.getByRole('button',{name:'Try without feedback',exact:true}).click();await showAllPractice(page);await q.getByRole('radio',{name:'Abducens VI',exact:true}).check();await q.getByRole('button',{name: /^Check (?:answer|Answer and Continue →)$/}).click();await page.reload();await showAllPractice(page);await expect(q.getByRole('radio',{name:'Abducens VI',exact:true})).toBeChecked();
 const save=page.getByRole('button',{name:'Save to My Study: '+lesson.title,exact:true});await save.click();await page.reload();await showAllPractice(page);const saved=page.getByRole('button',{name:'Saved to My Study: '+lesson.title+' (remove from saved resources)',exact:true});await expect(saved).toHaveAttribute('aria-pressed','true');await saved.click();await page.reload();await showAllPractice(page);await expect(save).toBeVisible();
 const oral=page.locator('section[aria-labelledby="oral-recall-title"]');await expect(oral.locator('details')).toHaveCount(5);await oral.getByText('Model response 1',{exact:true}).focus();await page.keyboard.press('Enter');await expect(oral).toContainText(lesson.oralExamination![0].answer);const check=page.getByRole('checkbox',{name:lesson.summaryChecklist![0],exact:true});await check.check();await page.reload();await showAllPractice(page);await expect(check).toBeChecked();await check.uncheck();
 const anatomyModels = await compareAnatomyModels(page, 1);await expect(anatomyModels.locator('.practice-question').first()).toContainText('cross within the brainstem');expect(errors).toEqual([]);
});

test('ocular-motor: fictional branch check explains alternatives and preserves its own answer',async({page})=>{
 await page.goto('/library/'+id);const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('wardhan-learning:v1')||'{}').answers?.['concept-ocular-motor-nerves']??null);await showAllPractice(page);const q=page.locator('#question-'+application.id);await expect(q).toHaveAttribute('aria-label',application.title+' — practice 1');
 await showAllPractice(page);await q.getByRole('radio',{name:application.options![2].text,exact:true}).check();await q.getByRole('button',{name: /^Check (?:answer|Answer and Continue →)$/}).click();await expect(q).toContainText(application.options![2].explanation!);await q.getByRole('button',{name:'Try without feedback',exact:true}).click();await showAllPractice(page);await q.getByRole('radio',{name:application.options![0].text,exact:true}).check();await q.getByRole('button',{name: /^Check (?:answer|Answer and Continue →)$/}).click();await expect(q).toContainText(application.options![0].explanation!);await page.reload();await showAllPractice(page);await expect(q.getByRole('radio',{name:application.options![0].text,exact:true})).toBeChecked();const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('wardhan-learning:v1')||'{}').answers?.['concept-ocular-motor-nerves']??null);expect(after).toEqual(before);
 const names=await page.locator('.practice-question:visible:has(input[type=radio])').evaluateAll(xs=>xs.map(x=>x.getAttribute('aria-label')));expect(names).toHaveLength(2);expect(new Set(names).size).toBe(2);expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.setViewportSize({width:320,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='200%');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});

test('ocular-motor: subject search reaches the existing route and recovers from no matches',async({page})=>{
 await page.goto('/');await page.getByRole('navigation',{name:'Primary navigation'}).getByRole('link',{name:'Subjects',exact:true}).click();await page.locator('a[href="/subjects/anatomy"]').click();await expect(page).toHaveURL('/subjects/anatomy');await page.getByRole('searchbox',{name:'Search resources',exact:true}).fill('nerve branching');const card=page.locator('.resource-card:visible').filter({has:page.locator('a[href="/library/'+id+'"]')});await expect(card).toHaveCount(1);await card.getByRole('link',{name:'Read lesson',exact:true}).click();await expect(page).toHaveURL('/library/'+id);await expect(page.getByRole('heading',{level:1})).toHaveText(lesson.title);
 await page.getByRole('navigation',{name:'Anatomy volume navigation'}).getByRole('link',{name:'Volume contents',exact:true}).click();await expect(page).toHaveURL(/\/study\/anatomy\/guide#anatomy-volume-4$/);
 await page.goto('/library?subject=anatomy');await page.getByRole('searchbox').fill('no-ocular-resource-987654');await expect(page.locator('.catalog-empty').getByRole('heading',{name:'No matching resources.',exact:true})).toBeVisible();await page.locator('.catalog-empty').getByRole('button',{name:'Clear filters',exact:true}).click();await expect(page.locator('.resource-card:visible').first()).toBeVisible();await expect(page.getByRole('searchbox')).toBeFocused();
});

test('ocular-motor: selected Volume IV print includes added reasoning, references and answers',async({page})=>{
 await page.goto('/study/anatomy/revision');await page.getByRole('button',{name:'Clear selection',exact:true}).click();await page.getByRole('checkbox',{name:'04. Volume IV · Head, neck and neuroanatomy',exact:true}).check();await expect(page.locator('.revision-lesson')).toHaveCount(30);const item=page.locator('.revision-lesson').filter({has:page.getByRole('heading',{level:3,name:lesson.title,exact:true})});await expect(item).toHaveCount(1);await expect(item).toContainText('Count datasets as carefully as anatomical structures');await expect(item).toContainText(application.prompt);await expect(item).toContainText(lesson.oralExamination![0].prompt);await expect(item).toContainText(lesson.summaryChecklist![0]);
 for(const ref of [refs,...refs.supportingReferences])await expect(item.locator('a[href="'+ref.url+'"]')).toHaveCount(1);
 await expect(page.locator('main')).toContainText(lesson.oralExamination![0].answer);await expect(page.locator('main')).toContainText(application.options![0].explanation!);
});

test('ocular-motor: previous localization history survives added practice',async({page})=>{
 await page.addInitScript(()=>{if(localStorage.getItem('wardhan-learning:v1'))return;localStorage.setItem('wardhan-learning:v1',JSON.stringify({version:2,lessons:['ocular-motor-nerves'],answers:{'concept-ocular-motor-nerves':{attempts:2,correct:1,lastCorrect:true,streak:1,dueAt:0,firstCorrect:false,lastAt:1000,lastChoice:0,assisted:true}},drafts:{},visits:[],quizzes:2,shares:0,oral:[],plan:null,resume:null,journey:{}}));});
 await page.goto('/library/'+id);const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('wardhan-learning:v1')!).answers['concept-ocular-motor-nerves']);await showAllPractice(page);const q=page.locator('#question-'+application.id);await showAllPractice(page);await q.getByRole('radio',{name:application.options![0].text,exact:true}).check();await q.getByRole('button',{name: /^Check (?:answer|Answer and Continue →)$/}).click();const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('wardhan-learning:v1')!).answers['concept-ocular-motor-nerves']);expect(after).toEqual(before);await expect(page.locator('#question-concept-'+id)).toContainText('first attempt incorrect');
});

test('ocular-motor: expanded source and anatomy states remain accessible without private access',async({page})=>{
 await page.goto('/library/'+id);for(const ref of [refs,...refs.supportingReferences])await expect(page.locator('#lesson-source a[href="'+ref.url+'"]')).toHaveCount(1);await showAllPractice(page);await compareAnatomyModels(page);for(const summary of await page.locator('section[aria-labelledby="oral-recall-title"] summary').all())await summary.click();expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
 await page.setViewportSize({width:320,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='200%');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);await expect(page.locator('main a[href*="dropbox"]')).toHaveCount(0);await expect(page.locator('main a[download]')).toHaveCount(0);await expect(page.locator('.concept-sequence img')).toHaveCount(0);
 for(const path of ['/review','/.private/candidate-lessons.json','/.env','/library/trochlear-route-and-relationships']){const r=await page.request.get(path);expect(r.status()).toBe(404);}
});

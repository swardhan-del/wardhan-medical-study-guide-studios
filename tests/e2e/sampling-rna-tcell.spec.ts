import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import data from '../../src/content/library-lessons.json';
import studio from '../../src/content/study-questions.json';
import visuals from '../../src/content/lesson-visuals.json';
import references from '../../src/content/lesson-references.json';

const cases = [
  {id:'genetic-drift-sampling-model',sections:7,applications:4},
  {id:'rna-processing',sections:9,applications:8},
  {id:'antigen-presentation',sections:9,applications:4},
];
for (const entry of cases) {
  const lesson=data.lessons.find(l=>l.id===entry.id)!;
  const questions=studio.questions.filter(q=>q.topic===entry.id);
  const newVisuals=visuals.visuals.filter(v=>v.lessonIds.includes(entry.id) && ['token-sampling-replacement-comparison','rna-exon-functional-partitions','rna-terminal-site-retention','tcell-input-readout-context'].includes(v.id));
  const visual=newVisuals[0];
  const refs=(references as Record<string,{url:string;supportingReferences?:{url:string}[]}>)[entry.id];
  test(`${entry.id}: first student visit reaches one distinct lesson`,async({page})=>{
    await page.goto('/');await page.getByRole('navigation',{name:'Primary navigation'}).getByRole('link',{name:'Subjects',exact:true}).click();
    await page.locator(lesson.subject==='genetics' ? 'a[href="/library?subject=genetics-all"]' : 'a[href="/subjects/'+lesson.subject+'"]').click();
    await page.getByRole('searchbox',{name:'Search resources',exact:true}).fill(lesson.title);
    const card=page.locator('.resource-card:visible').filter({has:page.locator('a[href="/library/'+entry.id+'"]')});
    await expect(card).toHaveCount(1);await card.getByRole('link',{name:'Read lesson',exact:true}).click();
    await expect(page.getByRole('heading',{level:1,name:lesson.title,exact:true})).toBeVisible();
    await page.goBack();await expect(page.getByRole('searchbox')).toBeVisible();
    await page.goto('/library?subject='+lesson.subject);await page.getByRole('searchbox').fill('no-route-depth-result-917263');await expect(page.locator('.catalog-empty')).toBeVisible();await page.locator('.catalog-empty').getByRole('button',{name:'Clear filters',exact:true}).click();await expect(page.locator('.resource-card:visible').first()).toBeVisible();
  });
  test(`${entry.id}: complete explanations comparison and references`,async({page})=>{
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/library/'+entry.id);
    const actual=await page.locator('.concept-sequence>details').evaluateAll(xs=>xs.map(x=>({title:x.querySelector('.concept-step-title')!.textContent!.trim(),body:[...x.querySelectorAll(':scope > p')].map(p=>p.textContent).join('\n\n')})));
    expect(actual).toEqual(lesson.steps);expect(actual).toHaveLength(entry.sections);
    for(const v of newVisuals){const fig=page.locator('#visual-'+v.id);await expect(fig.locator('thead th')).toHaveCount(3);await expect(fig.locator('tbody tr')).toHaveCount(v.rows!.length);for(let i=0;i<v.rows!.length;i++)for(const cell of v.rows![i])await expect(fig.locator('tbody tr').nth(i)).toContainText(cell);}
    if(entry.id==='genetic-drift-sampling-model')await expect(page.locator('.concept-sequence')).toContainText('2/3');
    if(entry.id==='rna-processing'){await expect(page.locator('.concept-sequence')).toContainText('59 translated triplets');await expect(page.locator('.concept-sequence')).toContainText('codon 34 occupies 200, 201 and 202');}
    if(entry.id==='antigen-presentation'){await expect(page.locator('.concept-sequence')).toContainText('Both peptide input and co-stimulatory context differ');await expect(page.locator('.concept-sequence')).toContainText('3A9');}
    for(const ref of [refs,...(refs.supportingReferences??[])])await expect(page.locator('#lesson-source a[href="'+ref.url+'"]')).toHaveCount(1);
    await expect(page.locator('#lesson-source')).not.toContainText('controlled library');expect(errors).toEqual([]);
  });
  test(`${entry.id}: explained feedback and saved answers persist`,async({page})=>{
    await page.goto('/library/'+entry.id);const main=page.locator('#question-concept-'+entry.id);await main.getByRole('radio',{name:lesson.question.options[lesson.question.answer].text,exact:true}).check();await main.getByRole('button',{name:'Check answer',exact:true}).click();await expect(main).toContainText(lesson.question.options[lesson.question.answer].reason);expect(questions).toHaveLength(entry.applications);
    for(const q of questions){await page.goto(q.href);const block=page.locator('#question-'+q.id),wrong=(q.answer+1)%3;await block.getByRole('radio',{name:q.options[wrong].text,exact:true}).check();await block.getByRole('button',{name:'Check answer',exact:true}).click();await expect(block).toContainText(q.options[wrong].explanation);await block.getByRole('button',{name:'Try without feedback',exact:true}).click();await block.getByRole('radio',{name:q.options[q.answer].text,exact:true}).check();await block.getByRole('button',{name:'Check answer',exact:true}).click();await expect(block).toContainText(q.options[q.answer].explanation);}
    await page.reload();await page.getByRole('button',{name:'Show all questions',exact:true}).click();await expect(page.locator('.practice-question:visible')).toHaveCount(entry.applications+1);for(const q of questions)await expect(page.locator('#question-'+q.id).getByRole('radio',{name:q.options[q.answer].text,exact:true})).toBeChecked();
  });
  test(`${entry.id}: keyboard saved list accessibility and 200percent mobile text`,async({page},testInfo)=>{
    await page.goto('/library/'+entry.id);const save=page.getByRole('button',{name:'Save to My Study: '+lesson.title,exact:true});await save.click();await page.reload();const saved=page.getByRole('button',{name:'Saved to My Study: '+lesson.title+' (remove from saved resources)',exact:true});await expect(saved).toHaveAttribute('aria-pressed','true');await saved.click();await page.reload();await expect(save).toBeVisible();
    const fig=page.locator('#visual-'+visual.id);await fig.getByText('Read a text description',{exact:true}).focus();await page.keyboard.press('Enter');await expect(fig.locator('.visual-description')).toHaveAttribute('open','');await page.getByRole('button',{name:'Show all questions',exact:true}).click();expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
    await page.setViewportSize({width:320,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='200%');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    for(const v of newVisuals){const mobile=page.locator('#visual-'+v.id);await expect(mobile.locator('.visual-comparison-mobile')).toBeVisible();expect(await mobile.locator('dt,dd').evaluateAll(xs=>xs.every(x=>x.scrollWidth<=x.clientWidth))).toBe(true);await mobile.screenshot({path:'../sampling-rna-tcell-review-20261105/'+v.id+'-'+testInfo.project.name+'-mobile.png'});}
    await expect(page.locator('main a[href*="dropbox"],main a[download]')).toHaveCount(0);for(const route of ['/review','/.env','/.private/candidate-lessons.json'])expect((await page.request.get(route)).status()).toBe(404);
  });
  test(`${entry.id}: no JavaScript retains reading and text comparison`,async({browser,baseURL})=>{
    const context=await browser.newContext({javaScriptEnabled:false,baseURL});const p=await context.newPage();await p.goto('/library/'+entry.id);await expect(p.locator('.concept-sequence>details')).toHaveCount(entry.sections);for(const v of newVisuals)await expect(p.locator('#visual-'+v.id+' tbody tr')).toHaveCount(v.rows!.length);await expect(p.locator('#worked-example-heading')).toBeVisible();await context.close();
  });
}

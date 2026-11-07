import {test, expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import anatomy from '../../src/content/anatomy-course.json';
import library from '../../src/content/library-lessons.json';
import {renalQuestions} from '../../src/content/renal-course';
const button = /^Check Answer and Continue/;
test('every native lesson renders the shared checkpoint and retains sources',async({request})=>{
 test.setTimeout(180000);
 for(const lesson of library.lessons){
  const response=await request.get(`/library/${lesson.id}`);expect(response.status(),lesson.id).toBe(200);
  const html=await response.text();expect(html,lesson.id).toContain(`question-concept-${lesson.id}`);expect(html).toContain('Conceptual Checkpoint');expect(html).toContain('Source and scope');
 }
});
test('wrong answer advances once, retains teaching feedback, and resumes after reload',async({page})=>{
 await page.goto('/library/fluid-and-membrane-transport');
 const seq=page.getByRole('region',{name:'Knowledge Check sequence',exact:true});
 const q=library.lessons.find(l=>l.id==='fluid-and-membrane-transport')!.question;
 await seq.getByRole('radio',{name:q.options[(q.answer+1)%q.options.length].text,exact:true}).check();
 await seq.getByRole('button',{name:button}).dblclick();
 await expect(seq).toContainText('Question 2 of 2');
 await expect(seq.locator('[data-feedback="incorrect"]')).toContainText('Review the Relationship');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('wardhan-learning:v1')!).answers['concept-fluid-and-membrane-transport'].attempts)).toBe(1);
 await page.reload();await expect(seq).toContainText('Question 2 of 2');await expect(seq.locator('[data-feedback="incorrect"]')).toBeVisible();
});
test('complete-set and short responses distinguish objective grading from unassessed prose',async({page})=>{
 await page.goto('/library/anatomy-foundations#question-universal-anatomy-directions');
 const multi=page.locator('#question-universal-anatomy-directions');
 await multi.getByRole('checkbox',{name:'Their right is on your left.',exact:true}).check();
 await multi.getByRole('button',{name:button}).click();
 await expect(multi.locator('[data-feedback="incorrect"]')).toContainText('The wrist is distal');
 await page.goto('/library/microscopy#question-universal-histology-nuclear-stain');
 const short=page.locator('#question-universal-histology-nuclear-stain');
 await short.getByRole('textbox').fill('not hematoxylin');await short.getByRole('button',{name:button}).click();
 await expect(short.locator('[data-feedback="unassessed"]')).toBeVisible();
 const state=await page.evaluate(()=>localStorage.getItem('wardhan-learning:v1')!);expect(state).not.toContain('not hematoxylin');expect(JSON.parse(state).answers['universal-histology-nuclear-stain']).toBeUndefined();
});
test('numeric units, later different reinforcement, persistence and completion',async({page})=>{
 await page.goto('/learn/renal/filtration-and-clearance');
 const seq=page.locator('.renal-quiz .practice-sequence');
 const numeric=seq.locator('#question-universal-clearance-initial');
 await numeric.getByRole('textbox',{name:'Calculated value'}).fill('100');
 await expect(numeric.getByRole('button',{name:button})).toBeDisabled();
 await numeric.getByRole('combobox',{name:'Unit',exact:true}).selectOption('L/min');
 await numeric.getByRole('button',{name:button}).click();
 await expect(numeric.locator('[data-feedback="incorrect"]')).toContainText('120 mL/min');
 await page.reload();await expect(seq).toContainText('Question 2');
 for(const q of renalQuestions.filter(q=>q.lesson==='filtration-and-clearance')){
  const panel=seq.locator(`#question-${q.id}`);await panel.getByRole('radio',{name:q.options[q.answer].text,exact:true}).check();await panel.getByRole('button',{name:button}).click();
 }
 const reinforcement=seq.locator('#question-universal-clearance-reinforcement');
 await expect(reinforcement).toBeVisible();await reinforcement.getByRole('textbox').fill('0.04');await reinforcement.getByRole('combobox').selectOption('L/min');await reinforcement.getByRole('button',{name:button}).click();
 await expect(seq.locator('.practice-results')).toContainText('0 not checked');await expect(reinforcement.locator('[data-feedback="correct"]')).toContainText('40 mL/min');
});
test('section explanation is self-assessed, available on refresh and never saved as raw text',async({page})=>{
 await page.goto('/library/epithelia');const q=page.locator('.practice-question').filter({has:page.getByRole('textbox')}).first();
 await q.getByRole('textbox').fill('A private explanation for review');await q.getByRole('button',{name:button}).click();await expect(q.locator('[data-feedback="self-review"]')).toBeVisible();
 await q.getByRole('button',{name:'I need to review this relationship',exact:true}).click();
 expect(await page.evaluate(()=>localStorage.getItem('wardhan-learning:v1'))).not.toContain('A private explanation');
 await page.reload();await expect(q.getByRole('button',{name:'I need to review this relationship',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.goto('/study');
 const metric=page.locator('.metric-row > div').filter({has:page.getByText('Questions attempted',{exact:true})});
 await expect(metric.locator('strong')).toHaveText(/^1\/\d+$/);
 const topic=page.locator('.topic-progress').filter({has:page.locator('a[href="/library/epithelia"]')});
 await expect(topic).toContainText('Coverage: 1 of');await expect(topic).toContainText('No objectively graded responses yet');await expect(topic).toContainText('1 model comparisons or unassessed responses, excluded from accuracy.');
 await expect(topic).toContainText('Needs review');
 await expect(page.getByRole('link',{name:'Continue learning',exact:true})).toHaveAttribute('href',/^\/library\/epithelia#question-section-/);
 await page.reload();await expect(metric.locator('strong')).toHaveText(/^1\/\d+$/);await expect(topic).toContainText('No objectively graded responses yet');
});
test('keyboard, 320px reflow, storage write failure and accessible retained feedback',async({page},info)=>{
 await page.addInitScript(()=>{Object.defineProperty(Storage.prototype,'setItem',{value:()=>{throw Error('quota');}});});
 await page.setViewportSize({width:320,height:844});await page.goto('/library/fluid-and-membrane-transport');const seq=page.locator('#concept-check-title .practice-sequence');
 await seq.getByRole('radio').first().focus();await page.keyboard.press('Space');await seq.getByRole('button',{name:button}).focus();await page.keyboard.press('Enter');
 await expect(seq).toContainText('Question 2 of 2');await expect(seq).toContainText('Storage is unavailable');await expect(seq.locator('.concept-feedback:visible')).toHaveCount(1);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe('auto');
 expect(await page.evaluate(()=>{const r=document.activeElement!.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight;})).toBe(true);
 const audit=await new AxeBuilder({page}).include('#concept-check-title').withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();expect(audit.violations).toEqual([]);
 await seq.screenshot({path:info.outputPath('retained-feedback-320.png')});
});
test('true or false teaches the model and records the answer in the same engine',async({page})=>{
 await page.goto('/library/dna-replication#question-universal-dna-semiconservative');
 const checkpoint=page.locator('#question-universal-dna-semiconservative');
 await checkpoint.getByRole('radio',{name:'False',exact:true}).check();await checkpoint.getByRole('button',{name:button}).click();
 await expect(checkpoint.locator('[data-feedback="incorrect"]')).toContainText('Correct answer: True');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('wardhan-learning:v1')!).checkpoints['universal-dna-semiconservative'].outcome)).toBe('incorrect');
});

test('without JavaScript every anatomy model remains readable in a multi-question sequence',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false,baseURL});const page=await context.newPage();
 const record=anatomy.records[0];await page.goto('/library/'+record.lessonId);
 for(const item of record.practice){
  const checkpoint=page.locator('#question-'+item.id);await expect(checkpoint).toBeVisible();
  await checkpoint.locator('noscript').getByText('Model explanation',{exact:true}).click();
  const model=checkpoint.locator('noscript details > p');await expect(model).toBeVisible();expect(await model.textContent()).toBe(item.answer);
 }
 await context.close();
});

test('client-side lesson navigation starts the next sequence without inheriting prior answers',async({page})=>{
 const first=anatomy.records[0], next=anatomy.records.find(r=>r.volume===first.volume&&r.lessonId!==first.lessonId)!;
 await page.goto('/library/'+first.lessonId);
 const sequence=page.getByRole('region',{name:'Anatomical reasoning sequence',exact:true});
 const checkpoint=sequence.locator('#question-'+first.practice[0].id);
 await checkpoint.getByRole('textbox').fill('My first relationship explanation');await checkpoint.getByRole('button',{name:button}).click();
 await expect(sequence).toContainText('Question 2 of 4');
 await checkpoint.getByRole('button',{name:'Try without feedback',exact:true}).click();await expect(sequence).toContainText('Question 1 of 4');await expect(checkpoint.getByRole('textbox')).toHaveValue('');
 await checkpoint.getByRole('textbox').fill('A fresh explanation of the same relationship');await checkpoint.getByRole('button',{name:button}).click();await expect(sequence).toContainText('Question 2 of 4');
 const navigation=page.getByRole('navigation',{name:'Anatomy volume navigation',exact:true});
 await navigation.getByText('Jump to a lesson in this volume',{exact:true}).click();
 await navigation.locator('a[href="/library/'+next.lessonId+'"]').click();
 await expect(page).toHaveURL('/library/'+next.lessonId);await expect(sequence).toContainText('Question 1 of 4');
 await expect(sequence.locator('#question-'+next.practice[0].id).getByRole('textbox')).toHaveValue('');
 await expect(sequence.locator('[data-feedback]')).toHaveCount(0);
 expect(await page.evaluate(id=>JSON.parse(localStorage.getItem('wardhan-learning:v1')!).checkpoints[id].outcome,first.practice[0].id)).toBe('self-review');
});

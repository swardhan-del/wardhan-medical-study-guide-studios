import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import library from '../../src/content/library-lessons.json';
import studio from '../../src/content/study-questions.json';
const id='reproductive-histology';
const lesson=library.lessons.find(l=>l.id===id)!;
const extra=studio.questions.find(q=>q.id==='studio-apply-reproductive-histology')!;

test('reproductive: saved Leydig history survives alongside the new transfer question',async({page})=>{
  await page.addInitScript(()=>{
    if(localStorage.getItem('wardhan-learning:v1'))return;
    localStorage.setItem('wardhan-learning:v1',JSON.stringify({version:2,lessons:['reproductive-histology'],answers:{'concept-reproductive-histology':{attempts:2,correct:1,lastCorrect:true,streak:1,dueAt:0,firstCorrect:false,lastAt:1000,lastChoice:1,assisted:true}},drafts:{},visits:[],quizzes:2,shares:0,oral:[],plan:null,resume:null,journey:{}}));
  });
  await page.goto('/library/'+id);
  const main=page.locator('#question-concept-reproductive-histology');
  await expect(main.getByRole('radio',{name:lesson.question.options[1].text,exact:true})).toBeChecked();
  await expect(main).toContainText('first attempt incorrect');
  const before=await page.evaluate(()=>JSON.parse(localStorage.getItem('wardhan-learning:v1')!).answers['concept-reproductive-histology']);
  await page.getByRole('button',{name:'Show all questions',exact:true}).click();
  const added=page.locator('#question-studio-apply-reproductive-histology');
  await added.getByRole('radio',{name:extra.options![0].text,exact:true}).check();
  await added.getByRole('button',{name:'Check answer',exact:true}).click();
  await page.reload();await page.getByRole('button',{name:'Show all questions',exact:true}).click();
  await expect(added.getByRole('radio',{name:extra.options![0].text,exact:true})).toBeChecked();
  const after=await page.evaluate(()=>JSON.parse(localStorage.getItem('wardhan-learning:v1')!).answers['concept-reproductive-histology']);
  expect(after).toEqual(before);
});

test('reproductive: worked reasoning, feedback, references and enlarged keyboard journey',async({page},info)=>{
  const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('/library/'+id);
  const worked=page.locator('section[aria-labelledby="worked-example-heading"]:visible');
  await worked.locator('summary').focus();await page.keyboard.press('Enter');
  await expect(worked.locator('ol')).toBeVisible();await expect(worked).toContainText('only the middle plane');
  await page.getByRole('button',{name:'Show all questions',exact:true}).click();
  const added=page.locator('#question-studio-apply-reproductive-histology');
  await added.getByRole('radio',{name:extra.options![1].text,exact:true}).check();
  await added.getByRole('button',{name:'Check answer',exact:true}).click();
  await expect(added).toContainText(extra.options![1].explanation);
  await added.getByRole('button',{name:'Try without feedback',exact:true}).click();
  await added.getByRole('radio',{name:extra.options![0].text,exact:true}).check();
  await added.getByRole('button',{name:'Check answer',exact:true}).click();
  await expect(added).toContainText(extra.options![0].explanation);
  const save=page.getByRole('button',{name:`Save to My Study: ${lesson.title}`,exact:true});
  await save.click();await page.reload();
  const saved=page.getByRole('button',{name:`Saved to My Study: ${lesson.title} (remove from saved resources)`,exact:true});
  await expect(saved).toHaveAttribute('aria-pressed','true');await saved.click();await page.reload();await expect(save).toBeVisible();
  await page.getByRole('button',{name:'Show all questions',exact:true}).click();
  await expect(added.getByRole('radio',{name:extra.options![0].text,exact:true})).toBeChecked();
  for(const url of ['https://openstax.org/books/anatomy-and-physiology-2e/pages/27-1-anatomy-and-physiology-of-the-testicular-reproductive-system','https://openstax.org/books/anatomy-and-physiology-2e/pages/27-2-anatomy-and-physiology-of-the-ovarian-reproductive-system','https://pubmed.ncbi.nlm.nih.gov/39549739/','https://pubmed.ncbi.nlm.nih.gov/32598235/'])await expect(page.locator(`#lesson-source a[href="${url}"]`)).toHaveCount(1);
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  // The expanded lesson exceeds 60,000px; keep diagnostic captures bounded.
  await page.getByRole('heading',{level:1}).scrollIntoViewIfNeeded();
  await page.screenshot({path:info.outputPath('reproductive-lesson.png')});
  await page.setViewportSize({width:320,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await added.scrollIntoViewIfNeeded();await page.screenshot({path:info.outputPath('reproductive-enlarged-feedback.png')});
  await page.getByRole('navigation',{name:'Continue studying'}).getByRole('link',{name:/learning path|lessons/}).click();
  await expect(page).toHaveURL(/\/study\/histology$/);expect(errors).toEqual([]);
});

test('reproductive: new concept search reaches the existing route once',async({page})=>{
  await page.goto('/subjects/histology');
  await page.getByRole('searchbox').fill('reproductive histology');
  const card=page.locator('.resource-card:visible').filter({hasText:lesson.title});
  await expect(card).toHaveCount(1);await card.getByRole('link',{name:'Read lesson',exact:true}).click();
  await expect(page.getByRole('heading',{level:1})).toHaveText(lesson.title);
  await page.goto('/library?subject=histology');await page.getByRole('searchbox').fill('cumulus');
  await expect(page.locator('.resource-card:visible').filter({hasText:lesson.title})).toHaveCount(1);
});

test('reproductive: printable label and expanded teaching stay together',async({page})=>{
  await page.goto('/study/histology/revision');await page.getByRole('button',{name:'Clear selection',exact:true}).click();
  await page.getByRole('checkbox',{name:/Reproductive histology: testis, ovary and uterus/}).check();
  const printable=page.locator('.revision-lesson');await expect(printable).toHaveCount(1);
  await expect(printable).toContainText(lesson.title);await expect(printable).toContainText('Trace the relationships around an antral oocyte');
  await expect(printable).toContainText('Three planes through one stipulated object');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});


test('reproductive: catalog subject labels do not call published Biostatistics empty',async({page})=>{
  await page.goto('/library');
  const subject=page.getByRole('combobox',{name:'Subject',exact:true});
  await expect(subject.getByRole('option',{name:'Biostatistics',exact:true})).toHaveCount(1);
  await expect(subject.getByRole('option',{name:/Biostatistics.*no lessons yet/})).toHaveCount(0);
  await subject.selectOption('biostatistics');
  await expect(page.locator('.resource-card:visible')).toHaveCount(5);
});

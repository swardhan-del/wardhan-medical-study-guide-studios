import {test,expect} from '@playwright/test';
import lessons from '../../src/content/library-lessons.json';
import references from '../../src/content/lesson-references.json';
import quality from '../../src/content/lesson-quality.json';
import {emptyProgress} from '../../src/lib/learning-core';

for(const record of quality.records){
 test(`Phase 13: ${record.lessonId} restores existing notes and progress with consistent sources`,async({page})=>{
  const id=record.lessonId,lesson=lessons.lessons.find(l=>l.id===id)!;
  const reference=(references as Record<string,{title:string;url:string;supportingReferences?:{title:string;url:string}[]}>)[id];
  const bibliography=[reference,...(reference.supportingReferences??[])];
  const noteLabel=id==='genetics-genome-foundations'?'My oral examination notes':'My explanation';
  const questionId=`concept-${id}`,note=`Saved before Phase 13: ${id}.\nMy own explanation stays here.`;
  const prior=emptyProgress();prior.lessons=[id];prior.drafts[`oral-${id}`]=note;prior.drafts[`${id}-summary-1`]='yes';
  prior.journey[id]={read:true,reviewed:true,saved:true,at:1790899200000};
  prior.answers[questionId]={attempts:3,correct:2,lastCorrect:true,streak:2,dueAt:1791244800000,firstCorrect:false,lastAt:1790985600000,lastChoice:lesson.question.answer,assisted:false};
  await page.addInitScript(state=>{if(!localStorage.getItem('wardhan-learning:v1'))localStorage.setItem('wardhan-learning:v1',JSON.stringify(state));},prior);
  await page.goto(`/library/${id}`);
  await expect(page.getByRole('textbox',{name:noteLabel,exact:true})).toHaveValue(note);
  const concept=page.locator('#concept-check-title:visible');
  await expect(concept.getByRole('radio',{name:lesson.question.options[lesson.question.answer].text,exact:true})).toBeChecked();
  await expect(concept).toContainText('first attempt incorrect; latest attempt correct');
  await expect(page.getByRole('button',{name:'Lesson complete — reopen',exact:true})).toHaveAttribute('aria-pressed','true');
  await expect(page.getByRole('button',{name:'Summary saved — remove',exact:true})).toHaveAttribute('aria-pressed','true');
  for(const source of bibliography){
   await expect(page.locator(`#lesson-source a[href="${source.url}"]`)).toContainText(source.title);
   // Supporting sources must also reach the visual credit, not just the final bibliography.
   await expect(page.locator(`[data-lesson-visuals="${id}"]:visible .visual-sources`).first().getByRole('link',{name:source.title,exact:true})).toHaveAttribute('href',source.url);
  }
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href',new RegExp(`/library/${id}$`));
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content',/noindex/);
  await page.getByRole('textbox',{name:noteLabel,exact:true}).fill(note+'\nAdded during review.');
  await page.reload();
  await expect(page.getByRole('textbox',{name:noteLabel,exact:true})).toHaveValue(note+'\nAdded during review.');
  const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('wardhan-learning:v1')!));
  expect(stored.answers[questionId]).toEqual(prior.answers[questionId]);expect(stored.lessons).toContain(id);expect(stored.drafts[`${id}-summary-1`]).toBe('yes');
 });
}

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import data from '../../src/content/library-lessons.json';

const ids=['cochlear-fluid-voltage-reference','auditory-frequency-level-coding'];
const sourceUrls=[['https://pubmed.ncbi.nlm.nih.gov/6823305/','https://pubmed.ncbi.nlm.nih.gov/18218777/'],['https://pubmed.ncbi.nlm.nih.gov/7419827/','https://pubmed.ncbi.nlm.nih.gov/731538/']];

for(const [index,id] of ids.entries()) {
  const lesson=data.lessons.find(l=>l.id===id)!;
  test(`auditory: ${id} is reachable through subject and focused search`,async({page})=>{
    await page.goto('/subjects/physiology');
    const card=page.locator('.resource-card:visible').filter({hasText:lesson.title});
    await expect(card).toHaveCount(1);
    await card.getByRole('link',{name:'Read lesson',exact:true}).click();
    await expect(page.getByRole('heading',{level:1})).toHaveText(lesson.title);
    await page.goto('/library?subject=physiology');
    await page.getByRole('searchbox').fill(index===0?'cochlear fluids':'phase locking');
    await expect(page.locator('.resource-card:visible').filter({hasText:lesson.title})).toHaveCount(1);
  });

  test(`auditory: ${id} supports explained practice, saved state and enlarged keyboard use`,async({page},info)=>{
    const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto('/library/'+id);
    const worked=page.locator('section[aria-labelledby="worked-example-heading"]:visible');
    await worked.locator('summary').focus();await page.keyboard.press('Enter');
    await expect(worked.locator('ol')).toBeVisible();
    await expect(worked).toContainText(index===0?'−125':'300 spikes per second');
    if(index===1)await expect(worked).toContainText('0.25,0.50,0.50');
    const check=page.locator('#concept-check-title:visible');
    await check.getByRole('radio',{name:lesson.question.options[0].text,exact:true}).check();
    await check.getByRole('button',{name:'Check answer',exact:true}).click();
    await expect(check).toContainText(lesson.question.options[0].reason);
    await check.getByRole('button',{name:'Try without feedback',exact:true}).click();
    await check.getByRole('radio',{name:lesson.question.options[1].text,exact:true}).check();
    await check.getByRole('button',{name:'Check answer',exact:true}).click();
    await expect(check).toContainText(lesson.question.options[1].reason);
    await page.reload();await expect(check.getByRole('radio',{name:lesson.question.options[1].text,exact:true})).toBeChecked();
    const save=page.getByRole('button',{name:`Save to My Study: ${lesson.title}`,exact:true});
    await save.click();await page.reload();
    const saved=page.getByRole('button',{name:`Saved to My Study: ${lesson.title} (remove from saved resources)`,exact:true});
    await expect(saved).toHaveAttribute('aria-pressed','true');await saved.click();await page.reload();await expect(save).toBeVisible();
    for(const url of sourceUrls[index])await expect(page.locator(`#lesson-source a[href="${url}"]`)).toHaveCount(1);
    expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
    await page.screenshot({path:info.outputPath('auditory-lesson.png'),fullPage:true});
    await page.setViewportSize({width:320,height:844});await page.evaluate(()=>document.documentElement.style.fontSize='200%');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await check.scrollIntoViewIfNeeded();await page.screenshot({path:info.outputPath('auditory-enlarged-feedback.png')});
    await page.getByRole('link',{name:'Medical Physiology learning path →',exact:true}).click();
    await expect(page).toHaveURL(/\/study\/physiology$/);expect(errors).toEqual([]);
  });
}

test('auditory: nervous-system printable notes include both additions once',async({page})=>{
  await page.goto('/study/physiology/revision');
  await page.getByRole('button',{name:'Clear selection',exact:true}).click();
  await page.getByRole('checkbox',{name:/Nervous system and special senses/}).check();
  await expect(page.locator('.revision-lesson')).toHaveCount(4);
  for(const id of ids)await expect(page.locator('.revision-lesson').filter({hasText:data.lessons.find(l=>l.id===id)!.title})).toHaveCount(1);
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});

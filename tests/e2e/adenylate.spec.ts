import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import data from '../../src/content/library-lessons.json';
const lesson = data.lessons.find(l => l.id === 'adenylate-kinase-charge-conservation')!;

test('adenylate: subject search and coverage reach the existing candidate ID', async ({page}) => {
  await page.goto('/subjects/biochemistry');
  await expect(page.locator('.resource-card:visible').filter({hasText:lesson.title})).toHaveCount(1);
  await page.goto('/library?subject=biochemistry');
  await page.getByRole('searchbox').fill('adenylate');
  await expect(page.locator('.resource-card:visible')).toHaveCount(1);
  await expect(page.locator('.resource-card:visible')).toContainText(lesson.title);
  await page.locator('.resource-card:visible').getByRole('link',{name:'Read lesson',exact:true}).click();
  await expect(page.getByRole('heading',{level:1})).toHaveText(lesson.title);
  await page.goto('/study/biochemistry#coverage');
  const count=data.lessons.filter(l=>l.subject==='biochemistry').length;
  await expect(page.locator('#coverage:visible')).toContainText(`${count} focused lesson introductions`);
});

test('adenylate: weighted reasoning, feedback, saved state and enlarged keyboard journey', async ({page}, info) => {
  const errors:string[]=[]; page.on('pageerror', e=>errors.push(e.message));
  await page.goto('/library/'+lesson.id);
  await expect(page.getByRole('heading',{level:1})).toHaveText(lesson.title);
  const worked=page.locator('section[aria-labelledby="worked-example-heading"]:visible');
  await worked.locator('summary').focus(); await page.keyboard.press('Enter');
  await expect(worked.locator('ol')).toBeVisible(); await expect(worked).toContainText('5.8/10 = 0.58');
  const check=page.locator('#concept-check-title:visible');
  await check.getByRole('radio',{name:'0.70',exact:true}).check();
  await check.getByRole('button',{name:'Check answer',exact:true}).click();
  await expect(check).toContainText(lesson.question.options[1].reason);
  await check.getByRole('button',{name:'Try without feedback',exact:true}).click();
  await check.getByRole('radio',{name:'0.58',exact:true}).check();
  await check.getByRole('button',{name:'Check answer',exact:true}).click();
  await expect(check).toContainText(lesson.question.options[0].reason);
  await page.reload(); await expect(check.getByRole('radio',{name:'0.58',exact:true})).toBeChecked();
  const save=page.getByRole('button',{name:`Save to My Study: ${lesson.title}`,exact:true});
  await save.click(); await page.reload();
  const saved=page.getByRole('button',{name:`Saved to My Study: ${lesson.title} (remove from saved resources)`,exact:true});
  await expect(saved).toHaveAttribute('aria-pressed','true'); await saved.click(); await page.reload(); await expect(save).toBeVisible();
  await expect(page.locator('#lesson-source a[href="https://pubmed.ncbi.nlm.nih.gov/33906384/"]')).toHaveCount(1);
  expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
  await page.screenshot({path:info.outputPath('adenylate-lesson.png'),fullPage:true});
  await page.setViewportSize({width:320,height:844}); await page.evaluate(()=>document.documentElement.style.fontSize='200%');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await check.scrollIntoViewIfNeeded(); await page.screenshot({path:info.outputPath('adenylate-enlarged-question.png')});
  await page.getByRole('link',{name:'Biochemistry learning path →',exact:true}).click();
  await expect(page).toHaveURL(/\/study\/biochemistry$/); expect(errors).toEqual([]);
});

test('adenylate: Bioenergetics printable notes include the lesson once', async ({page}) => {
  await page.goto('/study/biochemistry/revision');
  await page.getByRole('button',{name:'Clear selection',exact:true}).click();
  await page.getByRole('checkbox',{name:/Bioenergetics/}).check();
  await expect(page.locator('.revision-lesson')).toHaveCount(1);
  await expect(page.locator('.revision-lesson')).toContainText(lesson.title);
  await expect(page.locator('.revision-lesson')).toContainText('Combine unequal pools using amounts');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
});

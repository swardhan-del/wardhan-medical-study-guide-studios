import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { subjectInterests } from '../../src/content/subjects';
import { curriculumOrders } from '../../src/content/curriculum-order';

for (const subject of ['physiology', 'cell-biology', 'biochemistry']) {
  test(`${subject}: consistent beginner order, real links and explicit gaps`, async ({ page }) => {
    const order = curriculumOrders[subject];
    for (const route of [`/study/${subject}`, `/subjects/${subject}`]) {
      const response = await page.goto(route);
      expect(response?.status()).toBe(200);
      const map = page.locator(`[data-curriculum="${subject}"]:visible`);
      await expect(map.locator(':scope > li')).toHaveCount(order.stages.length);
      await expect(map.locator(':scope > li > div > h3')).toHaveText(order.stages.map((s,i) => `${i === 0 ? 'Start here: ' : ''}${s.title}`));
      await expect(map.locator(':scope > li').first()).toContainText('Planned:');
      for (const stage of order.stages) {
        const row=map.locator(`[data-curriculum-stage="${stage.id}"]`);
        expect(await row.getByRole('link').evaluateAll(links => links.map(link=>link.getAttribute('href')))).toEqual(stage.links.map(l=>l.href));
        for (const gap of stage.planned ?? []) await expect(row.getByText(`Planned: ${gap}`, { exact:true })).toBeVisible();
      }
      expect((await new AxeBuilder({page}).analyze()).violations).toEqual([]);
    }
    await page.goto('/start');
    const preview=page.locator(`[data-curriculum="${subject}"]`);
    await expect(preview.locator(':scope > li')).toHaveCount(3);
    await expect(preview.locator(':scope > li > div > h3')).toHaveText(order.stages.slice(0,3).map((s,i)=>`${i===0?'Start here: ':''}${s.title}`));
    await preview.locator('xpath=..').getByRole('link',{name:`Start ${subjectInterests.find(s=>s.id===subject)!.title}`,exact:true}).click();
    await expect(page).toHaveURL(new RegExp(`/study/${subject}#subject-topic-map$`));
  });

  test(`${subject}: narrow enlarged-text, keyboard and reduced-motion navigation`, async ({ page }, info) => {
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.setViewportSize({width:320,height:900});
    await page.goto(`/study/${subject}`);
    await page.addStyleTag({content:'html { font-size: 200% !important; } * { letter-spacing: .12em !important; word-spacing: .16em !important; line-height: 1.5 !important; }'});
    const map=page.locator(`[data-curriculum="${subject}"]`);
    await expect(map).toBeVisible();
    expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth+1)).toBe(true);
    const firstLink=map.getByRole('link').first();
    await firstLink.focus();
    await expect(firstLink).toBeFocused();
    const href=await firstLink.getAttribute('href');
    await page.screenshot({path:info.outputPath(`${subject}-narrow.png`),fullPage:true});
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(new RegExp(`${href}$`));
    await expect(page.locator('h1:visible')).toBeVisible();
  });
}

test('renal course remains available at its sixth stage', async ({page}) => {
  await page.goto('/study/physiology');
  const renal=page.locator('[data-curriculum-stage="renal"]');
  await renal.getByRole('link',{name:'Eight-lesson renal and acid-base course →',exact:true}).click();
  await expect(page).toHaveURL(/\/learn\/renal$/);
  await expect(page.getByRole('heading',{level:1})).toContainText(/renal/i);
});

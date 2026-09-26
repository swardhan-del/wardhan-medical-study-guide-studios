import { test, expect } from '@playwright/test';
import { subjectHubs, newEntryLessonIds } from '../../src/content/subject-hubs';
import { subjectInterests } from '../../src/content/subjects';
import data from '../../src/content/library-lessons.json';
import studio from '../../src/content/study-questions.json';
import transfer from '../../src/content/transfer-practice.json';
import references from '../../src/content/lesson-references.json';

for (const [subject, hub] of Object.entries(subjectHubs)) {
  test(`${hub.name}: homepage to hub, first lesson, quiz and library`, async ({ page }) => {
    const title = subjectInterests.find(s=>s.id===subject)!.title;
    await page.goto('/');
    const card = page.locator(`article.subject-card#${subject}:visible`);
    await expect(card.getByRole('link', { name: `Start lesson for ${title}`, exact: true })).toHaveAttribute('href', `/library/${hub.firstLesson}`);
    await expect(card.getByRole('link', { name: `Try the quiz for ${title}`, exact: true })).toHaveAttribute('href', `/library/${hub.firstLesson}#concept-check-title`);
    await card.getByRole('link', { name: `Explore subject for ${title}`, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/study/${subject}$`));
    await expect(page.getByRole('heading', { name: 'What you will study', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Why it matters', exact: true })).toBeVisible();
    await expect(page.getByText(hub.covers, { exact: true })).toBeVisible();
    const map = page.locator(subject==='anatomy' ? '#anatomy-course-map:visible' : '#subject-topic-map:visible');
    await expect(map.locator('ol > li')).toHaveCount(subject==='anatomy' ? 6 : hub.topics.length);
    await page.getByRole('link', { name: 'Start learning', exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/library/${hub.firstLesson}$`));
    await page.locator('.concept-heading:visible').getByRole('link', { name: /Begin the Knowledge Check|Try the question/ }).click();
    await expect(page.locator('#concept-check-title:visible fieldset')).toBeVisible();
    await page.getByRole('navigation', { name: 'Continue studying' }).getByRole('link', { name: 'Search the library', exact: true }).click();
    await expect(page).toHaveURL(/\/library$/);
    await page.getByText('Choose a free subject learning path', { exact: true }).filter({ visible: true }).click();
    await page.getByRole('navigation', { name: 'Free subject learning paths' }).getByRole('link', { name: hub.name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/study/${subject}$`));
  });
}

for (const id of newEntryLessonIds) {
  const lesson = data.lessons.find(l=>l.id===id)!;
  test(`${id}: all answer explanations and saved choices work`, async ({ page }) => {
    const errors: string[] = []; page.on('pageerror', error=>errors.push(error.message));
    const response = await page.goto(`/library/${id}`);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(lesson.title);
    const questions = [
      { ...lesson.question, options: lesson.question.options.map(o=>({text:o.text,explanation:o.reason})) },
      ...studio.questions.filter(q=>q.topic===id), ...transfer.questions.filter(q=>q.topic===id),
    ];
    expect(questions).toHaveLength(4);
    for (const q of questions) {
      const panel = page.locator('.practice-question:visible').filter({ hasText: q.prompt });
      await expect(panel.getByRole('status')).toHaveCount(0);
      await expect(panel.getByRole('button', { name: 'Check answer', exact: true })).toBeDisabled();
      const wrong = q.options[(q.answer+1)%q.options.length];
      await panel.getByRole('radio', { name: wrong.text, exact: true }).check();
      await panel.getByRole('button', { name: 'Check answer', exact: true }).click();
      await expect(panel.getByRole('status')).toContainText('Review the distinction.');
      await panel.getByRole('button', { name: 'Try without feedback', exact: true }).click();
      await panel.getByRole('radio', { name: q.options[q.answer].text, exact: true }).check();
      await panel.getByRole('button', { name: 'Check answer', exact: true }).click();
      await expect(panel.getByRole('status')).toContainText('Correct.');
      for (const option of q.options) await expect(panel.getByRole('status')).toContainText(option.explanation);
    }
    await page.reload();
    for (const q of questions) await expect(page.locator('.practice-question:visible').filter({ hasText: q.prompt }).getByRole('radio', { name: q.options[q.answer].text, exact: true })).toBeChecked();
    expect(errors).toEqual([]);
  });

  test(`${id}: accessible table, keyboard explanations, sources, recap and saved checklist`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`/library/${id}`);
    for (const heading of ['Learning Objectives','Core Concepts','Guided Explanation','Visual Study Prompts','Worked Example','Knowledge Check','Clinical and Applied Questions','Oral Examination Prompts','Summary Checklist','Short Recap','Sources and Further Reading'])
      await expect(page.getByRole('heading', { name: heading, exact: true })).toBeVisible();
    const comparison = page.locator('[data-entry-comparison]:visible');
    if (page.viewportSize()!.width > 700) {
      await expect(comparison.getByRole('table')).toHaveAccessibleName(/.+/);
      await expect(comparison.getByRole('columnheader')).toHaveCount(3);
    } else {
      await expect(comparison.locator('.visual-comparison-mobile')).toHaveAccessibleName(/.+/);
      expect(await comparison.locator('.visual-comparison-mobile dt:visible').count()).toBeGreaterThanOrEqual(4);
    }
    await expect(comparison.locator('figcaption')).toContainText('Observe and explain:');
    await expect(comparison.locator('figcaption')).toContainText('Original teaching comparison');
    const refs = references[id as keyof typeof references] as {title:string;url:string;supportingReferences?:{title:string;url:string}[]};
    for (const ref of [refs, ...(refs.supportingReferences??[])])
      await expect(page.locator('#lesson-source:visible').getByRole('link', { name: ref.title, exact: false })).toHaveAttribute('href', ref.url);
    const worked = page.locator('section[aria-labelledby="worked-example-heading"]:visible');
    await expect(worked.locator('ol')).toBeHidden();
    await worked.locator('summary').focus(); await page.keyboard.press('Enter');
    await expect(worked.locator('ol')).toBeVisible();
    const details = page.locator('.concept-explanations:visible details').first();
    await details.locator('summary').focus(); await page.keyboard.press('Space');
    await expect(details).not.toHaveAttribute('open', '');
    await page.keyboard.press('Enter'); await expect(details).toHaveAttribute('open', '');
    const notes = page.getByLabel('My oral examination notes', { exact: true });
    await notes.fill('State the mechanism and its assumptions.');
    const checks = page.locator('section[aria-labelledby="summary-checklist-title"]:visible').getByRole('checkbox');
    await expect(checks).toHaveCount(4); await checks.first().focus(); await page.keyboard.press('Space');
    await expect(checks.first()).toBeFocused();
    await page.reload(); await expect(checks.first()).toBeChecked();
    await expect(notes).toHaveValue('State the mechanism and its assumptions.');
    await expect(page.locator('#short-recap-title:visible').locator('..')).toContainText(lesson.recall.answer);
    expect(await page.locator('article:visible').innerText()).not.toMatch(/retrieval|oral recall/i);
    await page.setViewportSize({width:320,height:800});
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
    await expect(comparison.locator('.visual-comparison-mobile')).toBeVisible();
    await expect(comparison.getByRole('table')).toHaveCount(0);
  });
}

test('new entry lessons appear in search, topic routes and printable revision with their answers', async ({ page, request }) => {
  for (const id of newEntryLessonIds) {
    const lesson = data.lessons.find(l=>l.id===id)!;
    for (const route of [`/topics/${lesson.subject}-entry-course`, `/topics/topic-${id}`]) {
      const response = await request.get(route); expect(response.status(), route).toBe(200);
      expect(await response.text()).toContain(`/library/${id}`);
    }
    await page.goto(`/library?q=${encodeURIComponent(lesson.title)}`);
    await page.getByRole('link', { name: lesson.title, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/library/${id}$`));
    await page.goto(`/study/${lesson.subject}/revision`);
    const entry = page.locator('.revision-lesson:visible').filter({ has: page.getByRole('heading', {name:lesson.title,exact:true}) });
    await expect(entry).toContainText('Summary Checklist');
    await expect(entry).toContainText('Oral Examination Prompts');
    await expect(entry).toContainText(lesson.question.prompt);
    expect(await entry.innerText()).not.toMatch(/retrieval|oral recall/i);
  }
});

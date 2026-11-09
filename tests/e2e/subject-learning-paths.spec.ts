import { showAllPractice } from "./helpers/practice-view";
import { test, expect } from '@playwright/test';
import { subjectHubs, newEntryLessonIds } from '../../src/content/subject-hubs';
import { subjectInterests } from '../../src/content/subjects';
import data from '../../src/content/library-lessons.json';
import studio from '../../src/content/study-questions.json';
import transfer from '../../src/content/transfer-practice.json';
import references from '../../src/content/lesson-references.json';
import collections from '../../src/content/study-collections.json';
import AxeBuilder from '@axe-core/playwright';
import { studentEntryPaths } from '../../src/content/study-paths';
import { topicGuides } from '../../src/content/topic-guides';

test('student entry modes reach existing teaching, filtered concepts and questions for every subject', async ({ page, request }) => {
  test.setTimeout(120_000);
  const routes = [
    ...Object.keys(subjectHubs).map(subject => ({ subject, route: `/study/${subject}`, combined: true })),
    ...['histology-i', 'histology-ii', 'genetics', 'immunology', 'biostatistics'].map(subject => ({ subject, route: `/subjects/${subject}`, combined: false })),
  ];
  for (const { subject, route, combined } of routes) {
    await page.goto(route);
    const entry = page.locator('#study-entry:visible');
    const paths = studentEntryPaths(subject, combined)!;
    for (const [name, href] of [['Begin from Zero', paths.begin], ['Explain a Confusing Concept', paths.concept], ['Examination Preparation', paths.practice]]) {
      const link = entry.getByRole('link', { name, exact: true });
      await expect(link).toHaveAttribute('href', href);
      expect((await request.get(href)).status(), `${route}: ${href}`).toBe(200);
    }
    await expect(entry).toContainText('do not establish full syllabus coverage');
    await entry.getByRole('link', { name: 'Explain a Confusing Concept', exact: true }).click();
    await expect(page.getByRole('combobox', { name: 'Subject', exact: true })).toHaveValue(new URL(paths.concept, 'https://example.test').searchParams.get('subject')!);
    expect(await page.locator('.resource-card:visible').count()).toBeGreaterThan(0);
  }
});

test('student entry modes work without scripts, with keyboard focus and at narrow enlarged text', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 800 } });
  try {
    const page = await context.newPage();
    await page.goto('http://127.0.0.1:3101/subjects/histology-ii');
    // Set browser text size directly: addStyleTag waits for a load callback that
    // does not run in a JavaScript-disabled document.
    await page.evaluate(() => document.documentElement.style.setProperty('font-size', '200%', 'important'));
    const entry = page.locator('#study-entry');
    const start = entry.getByRole('link', { name: 'Begin from Zero', exact: true });
    await start.focus();
    await page.keyboard.press('Tab');
    await expect(entry.getByRole('link', { name: 'Review the four basic tissues first', exact: true })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(true);
    await start.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/library\/myelin-and-glial-cells#lesson-objectives$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  } finally { await context.close(); }
});

test('student entry and pilot navigation have no automated accessibility violations', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    for (const route of ['/start', '/subjects/histology-ii', '/study/genetics', '/learn/topics/enzyme-kinetics']) {
      await page.goto(`http://127.0.0.1:3101${route}`);
      const results = await new AxeBuilder({ page }).include('main').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
      expect(results.violations, route).toEqual([]);
    }
  } finally { await context.close(); }
});

for (const slug of ['membrane-transport', 'tissue-identification', 'enzyme-kinetics']) {
  test(`${slug}: pilot sequence retains answers across its canonical lessons`, async ({ page }) => {
    test.setTimeout(120_000);
    const guide = topicGuides.find(guide => guide.slug === slug)!;
    const first = data.lessons.find(lesson => lesson.id === guide.stages[0].id)!;
    await page.goto(`/learn/topics/${slug}`);
    await page.getByRole('link', { name: `Study ${first.title}`, exact: true }).click();
    await showAllPractice(page);
    const question = page.locator('#concept-check-title:visible');
    await question.getByRole('radio', { name: first.question.options[first.question.answer].text, exact: true }).check();
    await question.getByRole('button', { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
    await expect(question.getByRole('status')).toContainText('Correct');
    const saved = await page.evaluate(id => JSON.parse(localStorage.getItem('wardhan-learning:v1')!).answers[id], `concept-${first.id}`);
    expect(saved).toBeTruthy();
    for (const [index, stage] of guide.stages.entries()) {
      await expect(page).toHaveURL(new RegExp(`/library/${stage.id}(?:#.*)?$`));
      const onward = page.getByRole('navigation', { name: `Continue ${guide.title}`, exact: true });
      await expect(onward).toContainText(`Step ${index + 1} of ${guide.stages.length}`);
      await onward.getByRole('link').click();
    }
    await expect(page).toHaveURL(new RegExp(`/learn/topics/${slug}#review-connections$`));
    await page.goto(`/library/${first.id}`);
    await showAllPractice(page);
    await expect(question.getByRole('radio', { name: first.question.options[first.question.answer].text, exact: true })).toBeChecked();
    expect(await page.evaluate(id => JSON.parse(localStorage.getItem('wardhan-learning:v1')!).answers[id], `concept-${first.id}`)).toEqual(saved);
  });
}

test('each subject exposes its existing numbered lesson order before the card grid', async ({ page }) => {
  for (const subject of subjectInterests) {
    await page.goto(`/study/${subject.id}`);
    const index = page.locator('#lesson-order');
    await expect(index.getByRole('heading', { name: 'Lesson order', exact: true })).toBeVisible();
    const groups = collections.groups.filter(group => group.subject === subject.id);
    const expected = groups.flatMap(group => group.lessonIds).map(id => `/library/${id}`);
    expect(await index.locator('ol a').evaluateAll(links => links.map(link => link.getAttribute('href')))).toEqual(expected);
    let number = 1;
    for (const group of groups) {
      const details = index.locator('details').filter({ has: page.getByText(group.title, { exact: false }) });
      await details.locator('summary').press('Enter');
      await expect(details.locator('ol')).toHaveAttribute('start', String(number));
      await expect(details.locator('ol a').first()).toBeVisible();
      number += group.lessonIds.length;
    }
    expect(await page.evaluate(() => document.getElementById('lesson-order')!.compareDocumentPosition(document.getElementById('subject-lessons')!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBeTruthy();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await index.locator('ol a').first().click();
    await expect(page).toHaveURL(new RegExp(`${expected[0]}$`));
  }
});

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
    await expect(page.locator('#concept-check-title:visible fieldset:visible')).toBeVisible();
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
    await showAllPractice(page);
    const questions = [
      { ...lesson.question, options: lesson.question.options.map(o=>({text:o.text,explanation:o.reason})) },
      ...studio.questions.filter(q=>q.topic===id), ...transfer.questions.filter(q=>q.topic===id),
    ];
    expect(questions).toHaveLength(4);
    for (const q of questions) {
      const panel = page.locator('.practice-question:visible:has(input[type=radio])').filter({ hasText: q.prompt });
      await expect(panel.getByRole('status')).toHaveCount(0);
      await expect(panel.getByRole('button', { name: /^Check (?:answer|Answer and Continue →)$/ })).toBeDisabled();
      const wrong = q.options[(q.answer+1)%q.options.length];
      await showAllPractice(page);await panel.getByRole('radio', { name: wrong.text, exact: true }).check();
      await panel.getByRole('button', { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
      await expect(panel.getByRole('status')).toContainText('Review the Relationship');
      await panel.getByRole('button', { name: 'Try without feedback', exact: true }).click();
      await showAllPractice(page);await panel.getByRole('radio', { name: q.options[q.answer].text, exact: true }).check();
      await panel.getByRole('button', { name: /^Check (?:answer|Answer and Continue →)$/ }).click();
      await expect(panel.getByRole('status')).toContainText('Correct');
      for (const option of q.options) await expect(panel.getByRole('status')).toContainText(option.explanation);
    }
    await page.reload();await showAllPractice(page);
    await showAllPractice(page);
    for (const q of questions) await expect(page.locator('.practice-question:visible:has(input[type=radio])').filter({ hasText: q.prompt }).getByRole('radio', { name: q.options[q.answer].text, exact: true })).toBeChecked();
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
    await page.reload();await showAllPractice(page); await expect(checks.first()).toBeChecked();
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

test('concept discovery connects realistic student questions to canonical explanations', async ({ page }) => {
  const cases = [
    ['Why does an action potential occur?', 'membrane-potentials'],
    ['What determines cardiac output?', 'cardiac-output'],
    ['How do I distinguish arteries and veins in histology?', 'vessel-histology'],
    ['What does Km mean?', 'enzyme-kinetics'],
    ['Why does alveolar oxygen change?', 'ventilation-perfusion'],
  ];
  await page.goto('/library?mode=concept');
  for (const [query, id] of cases) {
    await page.getByRole('searchbox', { name: 'Search resources' }).fill(query);
    const matches=page.getByRole('region', {name:'Related explanations to start with'});
    await expect(matches.locator(`a[href="/library/${id}#concept-map-title"]`)).toBeVisible();
    await expect(matches.locator(`a[href="/library/${id}#lesson-source"]`)).toBeVisible();
  }
  await page.getByRole('searchbox', { name: 'Search resources' }).fill('unavailable unusual xyz topic');
  await expect(page.getByText('No curated concept match is available', {exact:false})).toBeVisible();
  await expect(page.getByRole('heading',{name:'No matching resources.'})).toBeVisible();
});

test('examination formats offer distinct existing destinations and preserve a wrong-answer review', async ({ page }) => {
  await page.goto('/library?mode=exam&subject=biochemistry&type=calculation&q=Km');
  await expect(page.locator('a[href="/library/enzyme-kinetics#worked-example-heading"]').first()).toBeVisible();
  await page.getByRole('combobox',{name:'Assessment format'}).selectOption('oral');
  await page.getByRole('button',{name:'Find practice',exact:true}).click();
  await expect(page.locator('a[href="/library/enzyme-kinetics#oral-recall-title"]').first()).toBeVisible();
  await expect(page.getByText('Written recall or oral self-assessment', {exact:false}).first()).toBeVisible();
  await page.goto('/library/enzyme-kinetics');
  const panel=page.locator('#concept-check-title').locator('..').locator('.practice-question').first();
  await panel.getByRole('radio').first().check();
  await panel.getByRole('button',{name:/Check Answer and Continue/}).click();
  await expect(panel.getByRole('status')).toContainText('Review the Relationship');
  await page.goto('/library?mode=exam&type=review');
  await page.getByRole('link',{name:'Open my review queue',exact:true}).click();
  await expect(page.getByRole('button',{name:/Review my mistakes/})).toBeEnabled();
  await page.reload();
  await expect(page.getByRole('button',{name:/Review my mistakes/})).toBeEnabled();
});

test('six revised pilot lessons retain meaningful examples, sources, visuals and saved summaries', async ({ page }) => {
  for (const id of ['fluid-and-membrane-transport','biophysics-diffusion-osmosis','biophysics-resting-potential','membrane-potentials','biophysics-action-potentials','enzyme-kinetics']) {
    await page.goto(`/library/${id}`);
    const worked=page.locator('section[aria-labelledby="worked-example-heading"]');
    await worked.locator('summary').focus();await page.keyboard.press('Enter');
    expect(await worked.locator('li').count()).toBeGreaterThanOrEqual(3);
    await expect(worked.locator('li').first()).toBeVisible();
    expect(await page.locator('figure').count()).toBeGreaterThan(0);
    await expect(page.locator('#lesson-source')).toBeVisible();
    const check=page.locator('section[aria-labelledby="summary-checklist-title"] input').first();
    await check.check();await page.reload();await expect(check).toBeChecked();
  }
});

test('concept and assessment forms work without JavaScript at enlarged mobile text', async ({ browser }) => {
  const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:900}});
  try {
    const page=await context.newPage();
    await page.goto('http://127.0.0.1:3101/library?mode=concept');
    await page.getByRole('searchbox',{name:'Search resources'}).fill('What does Km mean?');
    await page.getByRole('button',{name:'Search resources',exact:true}).click();
    await expect(page.locator('a[href="/library/enzyme-kinetics#worked-example-heading"]').first()).toBeVisible();
    await page.locator('a[href="/library/enzyme-kinetics#worked-example-heading"]').first().click();
    await page.locator('section[aria-labelledby="worked-example-heading"] summary').click();
    await expect(page.getByText('40 μmol/min.',{exact:false}).first()).toBeVisible();
    await page.evaluate(()=>document.documentElement.style.setProperty('font-size','200%','important'));
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);
    await page.goto('http://127.0.0.1:3101/library?mode=exam&type=oral&q=Km');
    await expect(page.locator('a[href="/library/enzyme-kinetics#oral-recall-title"]').first()).toBeVisible();
  } finally {await context.close();}
});

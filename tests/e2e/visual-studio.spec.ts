import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { visualReels, slideStages, nodeLandmarks } from "../../src/content/visual-studio";

test("a first-time visitor reaches real visual activities from the homepage", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "Explore the visual studio", exact: true })).toBeVisible();
  await page.getByRole("link", { name: "Enter the visual studio" }).click();
  await expect(page).toHaveURL(/\/learn\/visual-studio$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("See it.");
  await expect(page.locator("#node")).toBeVisible();
  await expect(page.locator("#organs")).toBeVisible();
  await expect(page.locator("#preparation")).toBeVisible();
});

test("landmarks respond to keyboard and route controls preserve the blood/lymph distinction", async ({ page }) => {
  await page.goto("/learn/visual-studio");
  const node=page.locator("#node");
  for (let i=1;i<=5;i++) {
    await node.getByRole("button", { name: `${i} ${nodeLandmarks[i-1].name}`, exact:true }).focus();
    await page.keyboard.press("Enter");
    await expect(node.getByRole("button",{name:`${i} ${nodeLandmarks[i-1].name}`,exact:true})).toHaveAttribute("aria-pressed","true");
    await expect(page.locator("#node-detail")).toContainText(`Point ${i}`);
  }
  await node.getByRole("button",{name:"Trace lymph",exact:true}).click();
  await expect(node.getByRole("img",{name:/^Lymph route:/})).toBeVisible();
  await node.getByRole("button",{name:"Trace blood entry",exact:true}).click();
  await expect(node.getByRole("img",{name:/^Blood entry:/})).toBeVisible();
  await expect(node.getByText(/a circulating lymphocyte can cross/)).toBeVisible();
  await expect(node.getByRole("img",{name:/^Lymph route:/})).toHaveCount(0);
});

test("find-it activity explains an incorrect choice and requires all five correct clues", async ({ page }) => {
  await page.goto("/learn/visual-studio#node");
  const node=page.locator("#node");
  await node.getByRole("button",{name:"Test me: find the landmark"}).click();
  await expect(page.locator("#node-detail")).toBeHidden();
  await node.getByRole("button",{name:"Choose point 5",exact:true}).click();
  await expect(node.getByRole("status")).toContainText("Look again");
  await expect(node.getByRole("button",{name:"Next clue"})).toHaveCount(0);
  for(let i=1;i<=5;i++) {
    await node.getByRole("button",{name:`Choose point ${i}`,exact:true}).click();
    await expect(node.getByRole("status")).toContainText("Matched:");
    if(i<5)await node.getByRole("button",{name:"Next clue"}).click();
  }
  await expect(node.getByText(/All five clues matched/)).toBeVisible();
  await node.getByRole("button",{name:"Return to exploration"}).click();
  await expect(node.getByRole("button",{name:"Test me: find the landmark"})).toHaveAttribute("aria-pressed","false");
});

test("organ drawings, comparison text and all three explained challenges agree", async ({ page }) => {
  await page.goto("/learn/visual-studio#organs");
  const organ=page.locator("#organs");
  const choices=organ.locator('button:has(img)');
  for(const [i,pattern] of ["Peripheral cortex", "White-pulp islands", "Repeated cortical regions"].entries()) {
    await choices.nth(i).click();
    await expect(organ.getByRole("heading",{level:3,name:new RegExp("^"+pattern)})).toContainText(pattern);
  }
  for(const name of ["Lymph node","Spleen","Thymus"]) {
    await organ.getByRole("button",{name,exact:true}).last().click();
    await expect(organ.getByRole("status")).toContainText("Matched.");
    await organ.getByRole("button",{name:"Try another clue"}).click();
  }
});

test("every preparation stage changes its image, explanation and reveal state", async ({ page }) => {
  await page.goto("/learn/visual-studio#preparation");
  const panel=page.locator("#preparation");
  for(let i=0;i<slideStages.length;i++) {
    await expect(panel.getByRole("heading",{name:slideStages[i].title,exact:true})).toBeVisible();
    await expect(panel.getByRole("img")).toHaveAttribute("src",`/media/visual-studio/slide-${i}.svg`);
    await panel.getByRole("button",{name:"Reveal the explanation"}).click();
    await expect(page.locator("#stage-answer")).toHaveText(slideStages[i].answer);
    if(i<5)await panel.getByRole("button",{name:"Next stage"}).click();
  }
  await expect(panel.getByRole("button",{name:"Next stage"})).toBeDisabled();
  await panel.getByRole("link",{name:"Now build the preparation sequence yourself"}).click();
  await expect(page).toHaveURL(/\/library\/microscopy#preparation-sequence-title$/);
  await expect(page.locator("#preparation-sequence-title")).toBeVisible();
});

test("all three actual videos decode, seek, pause and expose complete captions/transcripts", async ({ page, request }) => {
  await page.goto("/learn/visual-studio#visual-minutes");
  for(const reel of visualReels) {
    const video=page.getByLabel(reel.title,{exact:true});
    await expect(video).toHaveAttribute("preload","none");
    await expect(video).not.toHaveAttribute("autoplay");
    const captions=await request.get(`/media/visual-studio/${reel.id}.vtt`);
    expect(captions.ok()).toBeTruthy();
    const vtt=await captions.text();for(const cue of reel.transcript)expect(vtt).toContain(cue.text);
    await video.evaluate(async el => { const v=el as HTMLVideoElement;v.muted=true;await v.play(); });
    await expect.poll(()=>video.evaluate(el=>(el as HTMLVideoElement).currentTime)).toBeGreaterThan(0);
    await video.evaluate(el=>{const v=el as HTMLVideoElement;v.pause();v.currentTime=12;});
    await expect.poll(()=>video.evaluate(el=>(el as HTMLVideoElement).currentTime)).toBeGreaterThanOrEqual(12);
    const duration=await video.evaluate(el=>(el as HTMLVideoElement).duration);expect(duration).toBeCloseTo(reel.seconds,0);
    await expect(video.locator("track")).toHaveAttribute("srclang","en");
  }
  for(const summary of await page.getByText("Read the full transcript",{exact:true}).all())await summary.click();
  await expect(page.getByText(visualReels[0].transcript[5].text,{exact:false})).toBeVisible();
});

test("video failure leaves the full explanation available", async ({ page }) => {
  await page.route("**/media/visual-studio/*.mp4",route=>route.abort());
  await page.goto("/learn/visual-studio#visual-minutes");
  await page.locator("video").first().evaluate(el=>(el as HTMLVideoElement).load());
  await expect(page.getByText("Video unavailable. The complete explanation is in the transcript below.")).toBeVisible();
  await page.getByText("Read the full transcript",{exact:true}).first().click();
  await expect(page.getByText(visualReels[0].transcript[0].text,{exact:false})).toBeVisible();
});

test("320px enlarged text, keyboard targets and expanded accessibility remain usable", async ({ page }, info) => {
  const errors:string[]=[];page.on("pageerror",e=>errors.push(e.message));
  await page.setViewportSize({width:320,height:900});
  await page.goto("/learn/visual-studio");
  await page.addStyleTag({content:"html{font-size:200%!important}"});
  await page.getByRole("button",{name:"Trace blood entry",exact:true}).click();
  await page.getByRole("button",{name:"Reveal the explanation"}).click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1)).toBeTruthy();
  for(const button of await page.locator("#node button").all()) {
    const box=await button.boundingBox();if(box)expect(box.height).toBeGreaterThanOrEqual(44);
  }
  const results=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21aa"]).analyze();
  expect(results.violations).toEqual([]);expect(errors).toEqual([]);
  await page.screenshot({path:info.outputPath("studio-320-text200.png"),fullPage:true});
});

test("diagrams and full text alternatives remain available without JavaScript", async ({ browser, baseURL }) => {
  const context=await browser.newContext({javaScriptEnabled:false,baseURL});const page=await context.newPage();
  await page.goto("/learn/visual-studio");
  await page.getByText("Read the diagrams without interaction",{exact:true}).click();
  await expect(page.getByRole("heading",{name:"Lymph-node landmarks",exact:true})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Routine paraffin preparation",exact:true})).toBeVisible();
  await expect(page.locator("video")).toHaveCount(3);
  await context.close();
});

test("studio returns to source lessons and is discoverable from the video library", async ({ page },info) => {
  await page.goto("/videos");await page.getByRole("link",{name:"Watch the visual minutes"}).click();
  await expect(page).toHaveURL(/\/learn\/visual-studio#visual-minutes$/);
  await page.goto("/library/lymphoid-organs");
  await page.getByRole("link",{name:"Enter the visual studio"}).click();
  await expect(page).toHaveURL(/\/learn\/visual-studio$/);
  await page.screenshot({path:info.outputPath("studio-desktop.png"),fullPage:true});
});

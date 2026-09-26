// Audit the actual build, including routes omitted accidentally from navigation.
import { readFileSync, existsSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { gzipSync } from "node:zlib";
import { chromium } from "@playwright/test";
import { anatomyLearningPages } from "../src/content/anatomy-learning.ts";

const manifest = JSON.parse(readFileSync(".next/prerender-manifest.json", "utf8"));
const htmlPath = route => ".next/server/app" + (route === "/" ? "/index" : route) + ".html";
const appPaths = Object.keys(JSON.parse(readFileSync(".next/server/app-paths-manifest.json","utf8")));
const fixed = appPaths.filter(p=>p.endsWith("/page")&&!p.includes("[")).map(p=>p.slice(0,-5)||"/");
const routes = [...new Set([...Object.keys(manifest.routes).filter(route=>existsSync(htmlPath(route))),...fixed,...anatomyLearningPages.map(p=>"/subjects/anatomy/"+p.slug)])].filter(route=>!route.startsWith("/_")&&!route.startsWith("/review")).sort();
const base = process.env.CHECK_BASE_URL;
if (!base) throw new Error("Set CHECK_BASE_URL to the running production build so dynamic routes are audited too.");
const browser = await chromium.launch({ executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH });
const records = [], failures = [], external = new Set();
const assets = new Map();
try {
  const page = await browser.newPage();
  for (const route of routes) {
    const builtHtml = htmlPath(route);
    const metaPath = builtHtml.replace(/\.html$/, ".meta");
    const meta = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : null;
    const response = existsSync(builtHtml) ? null : await fetch(new URL(route, base), {redirect:"manual", signal:AbortSignal.timeout(15000)});
    const html = response ? await response.text() : readFileSync(builtHtml, "utf8");
    const headerRedirect = meta?.headers?.location || response?.headers.get("location");
    const record = await page.evaluate(html => {
      const doc = new DOMParser().parseFromString(html, "text/html");
      const text = selector => [...doc.querySelectorAll(selector)].map(e => e.textContent.trim());
      return {
        title: doc.querySelector("title")?.textContent, headings: text("h1"), description: doc.querySelector('meta[name="description"]')?.content,
        redirect: doc.querySelector('meta[http-equiv="refresh"]')?.content?.split("url=")[1] || null,
        ids: [...doc.querySelectorAll("[id]")].map(e => e.id),
        links: [...doc.querySelectorAll("a[href]")].map(e => e.getAttribute("href")),
        images: [...doc.querySelectorAll("img")].map(e => ({ src:e.getAttribute("src"), alt:e.getAttribute("alt"), width:e.getAttribute("width"), height:e.getAttribute("height"), fill:e.style.position==="absolute"&&e.style.width==="100%"&&e.style.height==="100%", loading:e.getAttribute("loading") })),
        scripts: [...doc.querySelectorAll("script[src]")].map(e => e.getAttribute("src")),
        awkwardHeadings: text("h1,h2,h3,summary,nav a,strong").filter(s => /\bretrieval\b|\boral recall\b/i.test(s)),
        reviewNotice: /independent (clinical |subject )?(peer )?review (has not been completed|is not claimed)|No independent clinical peer review is claimed/i.test(doc.body.textContent),
      };
    }, html);
    record.redirect ||= headerRedirect || null;
    const scripts = [...new Set(record.scripts)].filter(s => s.startsWith("/_next/") && s.endsWith(".js"));
    const sizes = scripts.map(src => {
      if (!assets.has(src)) { const bytes = readFileSync(".next" + src.slice(6)); assets.set(src, {raw:bytes.length,gzip:gzipSync(bytes).length}); }
      return assets.get(src);
    });
    records.push({route,...record,htmlBytes:Buffer.byteLength(html),jsBytes:sizes.reduce((n,s)=>n+s.raw,0),jsGzipBytes:sizes.reduce((n,s)=>n+s.gzip,0)});
  }
} finally { await browser.close(); }
const byRoute = new Map(records.map(r => [r.route,r]));
const origin = "https://wardhan-medical-study-guide-studios.vercel.app";
for (const record of records) {
  const fail = (kind, detail) => failures.push({route:record.route,kind,detail});
  if (!record.redirect && (!record.title || !record.description || !record.headings.length)) fail("page-metadata","Missing title, description or heading");
  for (const heading of record.awkwardHeadings) fail("wording",heading);
  for (const image of record.images) {
    if (image.alt === null || (!image.fill && (!image.width || !image.height))) fail("image-accessibility",image.src);
  }
  for (const href of [...record.links,...(record.redirect?[record.redirect]:[])]) {
    if (/^(mailto:|tel:)/.test(href)) continue;
    const url = new URL(href, origin + record.route);
    if (url.origin !== origin) { if (url.protocol === "https:") external.add(url.href); else fail("unsafe-link",href); continue; }
    let path = decodeURIComponent(url.pathname).replace(/\/$/,"") || "/";
    if (path === "/images/anatomy/volume-1.png") path = "/images/anatomy/mediastinal-plane.svg";
    const target = byRoute.get(path);
    if (!target && !existsSync("public"+path) && !manifest.routes[path]) fail("broken-link",href);
    if (url.hash && target && !target.ids.includes(decodeURIComponent(url.hash.slice(1)))) fail("missing-anchor",href);
  }
}
const http = [];
if (base) {
  const queue = [...routes];
  await Promise.all(Array.from({length:6},async()=>{
    while(queue.length) {
      const route=queue.shift();
      try {
        const response=await fetch(new URL(route,base),{redirect:"manual",signal:AbortSignal.timeout(15000)});
        await response.body?.cancel();
        const location=response.headers.get("location");
        http.push({route,status:response.status,...(location?{location}:{})});
        const expectedRedirect=byRoute.get(route).redirect;
        const validRedirect=expectedRedirect && [301,302,303,307,308].includes(response.status) && location && new URL(location,base).href===new URL(expectedRedirect,base).href;
        if(response.status!==200&&!validRedirect)failures.push({route,kind:"http",detail:response.status});
      }
      catch { http.push({route,status:0});failures.push({route,kind:"http",detail:"Request failed or timed out"}); }
    }
  }));
}
const layouts=[];
if(process.env.AUDIT_LAYOUT==="1") {
  const browser=await chromium.launch({executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH});
  const queue=records.filter(r=>!r.redirect);
  try { await Promise.all(Array.from({length:3},async()=>{
    const context=await browser.newContext({viewport:{width:320,height:900},reducedMotion:"reduce"});
    const page=await context.newPage();let errors=[];
    page.on("pageerror",error=>errors.push(error.message));
    while(queue.length) {
      const record=queue.shift();errors=[];
      try {
        await page.goto(new URL(record.route,base).href);
        await page.locator("h1:visible").first().waitFor();
        const size=await page.evaluate(()=>({width:innerWidth,content:document.documentElement.scrollWidth}));
        const layout={route:record.route,...size,errors:[...errors]};layouts.push(layout);
        if(size.content>size.width+1||errors.length)failures.push({route:record.route,kind:"mobile-layout",detail:layout});
      } catch {failures.push({route:record.route,kind:"mobile-layout",detail:"Navigation or visible heading failed"});}
    }
    await context.close();
  })); } finally {await browser.close();}
}
const report = {generatedAt:new Date().toISOString(),routes:records.length,failures,externalLinks:[...external].sort(),http,layouts,records};
const output=process.env.AUDIT_OUTPUT || ".private/prelaunch/public-pages.json";
mkdirSync(dirname(output),{recursive:true});writeFileSync(output,JSON.stringify(report,null,2)+"\n");
console.log(JSON.stringify({routes:records.length,externalLinks:external.size,httpChecked:http.length,mobileChecked:layouts.length,failures:failures.length,report:output}));
if(failures.length&&!process.argv.includes("--report-only"))process.exitCode=1;

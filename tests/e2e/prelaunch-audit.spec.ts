import { test, expect } from "@playwright/test";
import { promisify } from "node:util";
import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
const exec=promisify(execFile);
test("every public route has working links, source-status disclosure and a usable 320px layout",async({},info)=>{
  test.setTimeout(360000);
  const output=info.outputPath("public-pages.json");
  await exec(process.execPath,["scripts/audit-public-pages.mjs"],{env:{...process.env,CHECK_BASE_URL:"http://127.0.0.1:3101",AUDIT_OUTPUT:output,AUDIT_LAYOUT:"1"},maxBuffer:2000000});
  const report=JSON.parse(await readFile(output,"utf8"));
  expect(report.failures).toEqual([]);
  expect(report.http.length).toBe(report.routes);
  expect(report.layouts.length).toBe(report.records.filter((r:{redirect:string|null})=>!r.redirect).length);
  for(const record of report.records) {
    if(!record.redirect)expect(record.reviewNotice,record.route).toBe(true);
    // Public lesson and entry-point budgets; the browser-local review dashboard needs the full question bank.
    if(["/","/library","/subjects","/start"].includes(record.route)||record.route.startsWith("/library/")||record.route.startsWith("/learn/"))expect(record.jsGzipBytes,record.route).toBeLessThan(300*1024);
  }
  await info.attach("public-route-audit",{path:output,contentType:"application/json"});
});

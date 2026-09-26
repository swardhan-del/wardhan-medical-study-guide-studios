// Network reachability is evidence, not medical review or permission to republish.
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
const inventory=JSON.parse(readFileSync(process.env.AUDIT_INPUT||".private/prelaunch/public-pages.json","utf8"));
const queue=[...inventory.externalLinks], results=[];
await Promise.all(Array.from({length:3},async()=>{
  while(queue.length) {
    const url=queue.shift();
    try {
      const response=await fetch(url,{signal:AbortSignal.timeout(12000),headers:{"User-Agent":"StudyGuideLinkAudit/1.0"}});
      const reader=response.body?.getReader(); let text="",size=0;
      if(reader)try{while(size<65536){const r=await reader.read();if(r.done)break;size+=r.value.length;text+=new TextDecoder().decode(r.value);}}finally{await reader.cancel();}
      const challenge=/checking your browser|verify you are human|just a moment|captcha|enable javascript and cookies to continue/i.test(text);
      const outcome=[404,410].includes(response.status)?"broken":response.ok&&!challenge?"reachable":"manual-check";
      results.push({url,status:response.status,finalUrl:response.url,outcome});
    } catch { results.push({url,status:0,outcome:"manual-check"}); }
  }
}));
results.sort((a,b)=>a.url.localeCompare(b.url));
const output=process.env.LINK_AUDIT_OUTPUT||".private/prelaunch/external-links.json";
mkdirSync(dirname(output),{recursive:true});writeFileSync(output,JSON.stringify({checkedAt:new Date().toISOString(),results},null,2)+"\n");
console.log(JSON.stringify({checked:results.length,reachable:results.filter(r=>r.outcome==="reachable").length,broken:results.filter(r=>r.outcome==="broken"),manual:results.filter(r=>r.outcome==="manual-check"),report:output}));
if(results.some(r=>r.outcome==="broken"))process.exitCode=1;

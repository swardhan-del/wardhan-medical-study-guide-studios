// Uses the installed, versioned axe/Playwright dependencies and normal test servers.
import { spawnSync } from "node:child_process";
const args=["node_modules/@playwright/test/cli.js","test","prelaunch.spec.ts","--grep","pre-launch surfaces"];
if(process.env.CHECK_BASE_URL)args.push("--config=playwright.preview.config.ts");
const result=spawnSync(process.execPath,args,{stdio:"inherit",env:process.env});
if(result.error)throw result.error;
process.exitCode=result.status??1;

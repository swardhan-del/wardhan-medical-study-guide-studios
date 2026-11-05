// Deterministic original schematics and silent, captioned teaching reels.
// Rebuild: node scripts/build-visual-studio-media.mjs [--video /path/to/ffmpeg]
import { mkdir, writeFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import sharp from 'sharp';
import { visualReels, slideStages } from '../src/content/visual-studio.ts';
const out='public/media/visual-studio';
await mkdir(out,{recursive:true});
const wrap = inner => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 520" width="720" height="520"><rect width="720" height="520" rx="30" fill="#102b3d"/>${inner}</svg>`;
export const nodeShape=`<path d="M562 204 C620 110 447 33 280 47 C100 61 65 180 104 330 C135 460 382 491 556 373 C609 338 515 330 526 281 C528 250 544 232 562 204Z" fill="#c88fba" stroke="#f6c9de" stroke-width="15"/>
<path d="M548 210 C599 125 441 59 280 72 C123 85 91 193 128 321 C161 432 374 463 543 350" fill="none" stroke="#72e3d6" stroke-width="12"/>
<path d="M500 222 C455 184 398 191 385 259 C373 312 428 370 509 338 L548 352 C432 442 203 416 169 310 C145 239 177 179 244 151 C344 107 468 128 521 188Z" fill="#8971b0"/>
${[[207,172],[309,126],[418,136],[171,279],[242,359]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="48" fill="#6b4692" stroke="#e1b3d6" stroke-width="4"/><circle cx="${x}" cy="${y}" r="25" fill="#d8b6d8"/>`).join('')}
<path d="M430 248 Q465 238 501 254 M413 286 Q461 272 504 294 M437 327 Q472 314 517 329" stroke="#eed6e8" stroke-width="16" fill="none" stroke-linecap="round"/>
<path d="M330 360 C302 359 299 334 315 323 C338 311 355 335 348 348 C345 357 339 362 330 360" stroke="#ffb4a0" stroke-width="10" fill="#8f4355"/>
<path d="M190 28 L202 64 M350 14 L347 60 M529 72 L508 100 M548 348 L632 374" stroke="#72e3d6" stroke-width="12"/>
<path d="M627 277 L532 281 L414 312 L347 338" stroke="#ffa794" stroke-width="9" fill="none"/>`;
const spleenShape=`<path d="M560 76 C368 17 146 72 112 237 C70 431 328 492 514 410 C623 357 637 142 560 76Z" fill="#9f526a" stroke="#f4bac1" stroke-width="14"/>
${[[180,260],[174,320],[225,385],[350,400],[430,370],[550,245],[545,180],[325,110],[320,232],[400,265],[210,100],[485,115],[262,265],[390,355]].map(([x,y])=>`<path d="M${x} ${y} l20 20 l-7 24" stroke="#ed94a1" stroke-width="7" fill="none"/>`).join('')}
${[[234,182],[414,163],[307,334],[505,301]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="59" ry="48" fill="#7860ab" stroke="#d9bee2" stroke-width="5"/><circle cx="${x+19}" cy="${y+7}" r="12" fill="#ffbd91" stroke="#7d3d49" stroke-width="5"/>`).join('')}`;
const thymusShape=`<path d="M113 146 Q190 62 276 108 Q361 42 439 102 Q575 67 616 219 L607 376 Q530 463 442 408 Q356 474 273 415 Q160 463 112 367Z" fill="#7961ad" stroke="#edb9d5" stroke-width="13"/>
<path d="M173 260 Q235 211 286 258 Q360 207 432 260 Q501 214 560 266 L556 333 Q489 363 431 328 Q356 369 286 329 Q224 367 173 329Z" fill="#d9b8d5"/>
<path d="M275 108 L280 212 M440 104 L434 212 M278 415 L284 364 M442 408 L434 365" stroke="#f0c9dd" stroke-width="9"/>
${[[224,291],[371,298],[504,289]].map(([x,y])=>`<circle cx="${x}" cy="${y}" r="21" fill="#e9b391" stroke="#ac665f" stroke-width="5"/><circle cx="${x}" cy="${y}" r="12" fill="none" stroke="#ac665f" stroke-width="3"/>`).join('')}`;
export function slideShape(i){return `<rect x="100" y="105" width="520" height="310" rx="34" fill="#1c4254" stroke="#82cfca" stroke-width="3"/>
${i<2?`<path d="M253 222 Q315 147 400 218 Q446 292 380 328 Q285 355 247 283Z" fill="#db9bae" stroke="#f8cad0" stroke-width="8"/>`:
`<rect x="190" y="167" width="340" height="195" rx="10" fill="#bce1de" fill-opacity=".3" stroke="#d2f5f0" stroke-width="5"/><ellipse cx="360" cy="263" rx="92" ry="64" fill="${i<4?'#dfc9bc':'#df9ebd'}"/>${i>=4?Array.from({length:15},(_,n)=>`<ellipse cx="${295+n%5*32}" cy="${230+Math.floor(n/5)*31}" rx="7" ry="10" fill="#694888"/>`).join(''):''}`}
${i===0?'<path d="M218 149 V348 H498 V149" stroke="#a0e5da" stroke-width="8" fill="none"/><path d="M222 209 H494" stroke="#a0e5da" stroke-width="4"/>':''}
${i===1?'<rect x="208" y="161" width="300" height="205" rx="10" stroke="#f5d18c" stroke-width="24" fill="none"/>':''}
${i===2?'<path d="M218 140 L488 397" stroke="#f8f5e6" stroke-width="12"/><path d="M255 156 L510 382" stroke="#f5d18c" stroke-width="4"/>':''}
${i===3?'<path d="M275 128 L275 186 M364 128 V186 M453 128 V186" stroke="#72e3d6" stroke-width="10" stroke-linecap="round"/>':''}
${i===4?'<circle cx="272" cy="125" r="19" fill="#8059af"/><circle cx="448" cy="125" r="19" fill="#e69bb7"/>':''}
${i===5?'<rect x="234" y="187" width="250" height="156" rx="5" stroke="#f3faf5" stroke-width="5" fill="none"/>':''}`;}
for(const [name,shape] of [['node',nodeShape],['spleen',spleenShape],['thymus',thymusShape],...slideStages.map((_,i)=>[`slide-${i}`,slideShape(i)])])await writeFile(`${out}/${name}.svg`,wrap(shape));
const ffmpeg=process.argv.includes('--video')?process.argv[process.argv.indexOf('--video')+1]:null;
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
function lines(s,max=37){const words=s.split(' '),result=[];let line='';for(const word of words){if((line+' '+word).trim().length>max){result.push(line);line=word;}else line=(line+' '+word).trim();}if(line)result.push(line);return result;}
const stamp=s=>`00:${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}.000`;
for(const reel of visualReels){
  await writeFile(`${out}/${reel.id}.vtt`,'WEBVTT\n\n'+reel.transcript.map((c,i)=>`${stamp(c.start)} --> ${stamp(reel.transcript[i+1]?.start??reel.seconds)}\n${c.text}\n`).join('\n'));
  if(!ffmpeg)continue;
  const dir=`.private/studio-frames/${reel.id}`;await mkdir(dir,{recursive:true});
  const fps=10;
  for(let frame=0;frame<reel.seconds*fps;frame++){
    const sec=frame/fps, cue=reel.transcript.findLast(c=>c.start<=sec);
    const shape=reel.id==='slide-journey'?slideShape(Math.min(5,Math.floor(sec/6))):reel.id==='organ-patterns'?[nodeShape,spleenShape,thymusShape][Math.min(2,Math.floor(sec/7))]:nodeShape;
    const trace=reel.id==='node-routes'&&sec>=6&&sec<18?`<path d="M190 28 L202 64 Q97 130 128 321 Q174 431 369 399 Q416 374 419 341 Q418 304 456 305 L505 306 Q534 321 548 348 L632 374" fill="none" stroke="#62ffdc" stroke-width="9" stroke-dasharray="14 9" stroke-dashoffset="${-sec*15}"/>`:reel.id==='node-routes'&&sec>=23?`<path d="M627 277 L532 281 L414 312 L347 338" stroke="#ffbc91" stroke-width="11" fill="none"/><circle cx="330" cy="340" r="28" fill="none" stroke="#ffffff" stroke-width="5"/>`:'';
    const body=lines(cue.text,38);
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="720" height="1280" viewBox="0 0 720 1280"><rect width="720" height="1280" fill="#102b3d"/><g font-family="Helvetica,Arial,sans-serif"><text x="46" y="62" font-size="18" letter-spacing="3" fill="#8fe4d8">WARDHAN · VISUAL MINUTE</text>${lines(reel.title,26).map((l,i)=>`<text x="46" y="${126+i*48}" font-size="38" font-weight="700" fill="#fff8ef">${esc(l)}</text>`).join('')}<g transform="translate(0 240)">${shape}${trace}</g><rect x="38" y="804" width="644" height="${Math.max(220,body.length*34+56)}" rx="22" fill="#193e50"/>${body.map((l,i)=>`<text x="64" y="${852+i*34}" fill="#fff8ef" font-size="27">${esc(l)}</text>`).join('')}<text x="46" y="1162" font-size="19" fill="#a9cdc9">Original schematic · not a specimen or scale model</text><rect x="46" y="1205" width="628" height="6" rx="3" fill="#34596a"/><rect x="46" y="1205" width="${628*sec/reel.seconds}" height="6" rx="3" fill="#8fe4d8"/><text x="46" y="1244" font-size="18" fill="#c4d9d6">Read, pause, predict. Continue with the linked lesson.</text></g></svg>`;
    const png=await sharp(Buffer.from(svg)).png().toBuffer();
    if(frame===0)await writeFile(`${out}/${reel.id}-poster.png`,png);
    await writeFile(`${dir}/${String(frame).padStart(5,'0')}.png`,png);
  }
  const r=spawnSync(ffmpeg,['-y','-loglevel','error','-framerate',String(fps),'-i',`${dir}/%05d.png`,'-c:v','libx264','-pix_fmt','yuv420p','-crf','25','-movflags','+faststart',`${out}/${reel.id}.mp4`],{encoding:'utf8'});
  if(r.status!==0)throw new Error(r.stderr||'ffmpeg failed');
  console.log(`${reel.id}: ${reel.seconds}s captioned portrait reel generated.`);
}

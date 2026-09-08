import fs from 'node:fs';
const recaps=JSON.parse(fs.readFileSync('src/content/study-recaps.json')).recaps;
const release=JSON.parse(fs.readFileSync('src/content/public-release.json'));
for(const recap of recaps) if(!release.videoIds.includes('recap-'+recap.lessonId)||!release.audioLessonIds.includes(recap.lessonId)) throw Error('Recap is not explicitly approved: '+recap.lessonId);
const jobs=[];
for(const r of recaps){const chunks=[];for(const d of r.dialogue){const words=d.text.split(/\s+/);while(words.length){let n=Math.min(15,words.length);if(words.length>15){for(let k=15;k>=7;k--)if(/[.;?!,:]$/.test(words[k-1])){n=k;break;}}chunks.push({speaker:d.speaker,text:words.splice(0,n).join(' ')});}}const dir='.private/media-work/'+r.lessonId;fs.mkdirSync(dir,{recursive:true});chunks.forEach((c,i)=>jobs.push({...c,lessonId:r.lessonId,index:i,wav:dir+'/'+i+'.wav'}));}
fs.writeFileSync('.private/media-jobs.json',JSON.stringify(jobs,null,2));
console.log(jobs.length+' spoken segments prepared');

import assert from 'node:assert/strict';import fs from 'node:fs';
const read=p=>JSON.parse(fs.readFileSync('src/content/'+p+'.json','utf8'));
const lessons=read('library-lessons').lessons,groups=read('study-collections').groups,release=read('public-release'),videos=read('public-videos').records,audios=read('study-audio').records,questions=read('study-questions').questions,recaps=read('study-recaps').recaps;
for(const l of lessons){const matches=groups.filter(g=>g.lessonIds.includes(l.id));assert.equal(matches.length,1,'Lesson needs exactly one study section: '+l.id);assert.equal(matches[0].subject,l.subject);assert(release.resourceIds.includes(l.id));}
for(const g of groups)for(const id of g.lessonIds)assert(lessons.some(l=>l.id===id&&l.subject===g.subject),'Invalid group lesson');
assert.equal(new Set(groups.map(g=>g.id)).size,groups.length);
assert.equal(new Set(questions.map(q=>q.id)).size,questions.length);
for(const q of questions){assert(lessons.some(l=>l.id===q.topic&&l.subject===q.subject));assert(q.options.length>=3&&q.options[q.answer]);assert(q.options.every(o=>o.explanation.length>=20));}
assert.deepEqual(videos.map(v=>v.id).sort(),[...release.videoIds].sort(),'Videos differ from explicit media release');
assert.deepEqual(audios.map(a=>a.lessonId).sort(),[...release.audioLessonIds].sort(),'Audio differs from explicit media release');
assert.deepEqual(recaps.map(r=>r.lessonId).sort(),audios.map(a=>a.lessonId).sort(),'Scripts must match released recap set');
// New text/model subjects do not imply a recording release. Preserve explicit media coverage.
assert.deepEqual([...new Set(videos.map(v=>v.subject))].sort(), [...release.narratedSubjects].sort(), 'Narrated subject scope differs from release');
for(const subject of release.narratedSubjects){assert(lessons.some(l=>l.subject===subject),'Narrated subject lacks lessons');}
let total=0;
for(const v of videos){
 const a=audios.find(a=>v.lessonIds.includes(a.lessonId));assert(a&&a.durationSeconds===v.durationSeconds);assert.deepEqual(a.transcript.map(l=>l.speaker+': '+l.text),v.transcript.map(l=>l.text));
 for(const path of[v.sourceUrl,v.posterUrl,v.captions[0].src,a.src]){assert(release.assets.some(r=>'/'+r.path===path),'Unapproved media path');assert(fs.existsSync('public'+path));}
 const b=fs.readFileSync('public'+v.sourceUrl);assert(b.length<1000000,'Compact recap budget exceeded');total+=b.length;assert(b.indexOf(Buffer.from('moov'))<b.indexOf(Buffer.from('mdat')),'MP4 requires fast start');
 const vtt=fs.readFileSync('public'+v.captions[0].src,'utf8');assert(vtt.startsWith('WEBVTT'));const cues=vtt.match(/\d\d:\d\d:\d\d\.\d{3} --> \d\d:\d\d:\d\d\.\d{3}/g)||[];assert.equal(cues.length,v.transcript.length);assert(!/<script|dropbox|file:|[A-Z]:\\/i.test(vtt));
 assert(a.transcript[0].startSeconds===0&&a.transcript.at(-1).startSeconds<a.durationSeconds);
}
assert(total<20000000,'Recap set exceeds small-static-media budget');
console.log('Study checks passed: '+lessons.length+' grouped lessons, '+questions.length+' application questions, '+videos.length+' captioned videos and '+audios.length+' audio recaps.');

import json,wave,subprocess,textwrap,os
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
root=Path.cwd(); ff=os.environ.get('FFMPEG', 'ffmpeg')
recaps=json.loads(Path('src/content/study-recaps.json').read_text(encoding='utf8'))['recaps']
release=json.loads(Path('src/content/public-release.json').read_text(encoding='utf8'))
assert all('recap-'+r['lessonId'] in release['videoIds'] and r['lessonId'] in release['audioLessonIds'] for r in recaps), 'Unapproved recap script'
jobs=json.loads(Path('.private/media-jobs.json').read_text(encoding='utf8'))
out=Path('public/media/recaps');out.mkdir(parents=True,exist_ok=True)
lessons=json.loads(Path('src/content/library-lessons.json').read_text(encoding='utf8'))['lessons']
videos=[];audios=[];audits=[]
fontpath=os.environ.get('RECAP_FONT','C:/Windows/Fonts/segoeui.ttf');boldpath=os.environ.get('RECAP_FONT_BOLD','C:/Windows/Fonts/segoeuib.ttf')
def font(n,b=False):return ImageFont.truetype(boldpath if b else fontpath,n)
def lines(draw,text,f,width):
 result=[];line=''
 for word in text.split():
  candidate=(line+' '+word).strip()
  if draw.textlength(candidate,font=f)>width and line:result.append(line);line=word
  else:line=candidate
 if line:result.append(line)
 return result
def draw_text(d,text,y,size,color,bold=False,width=452,gap=10):
 f=font(size,bold)
 for line in lines(d,text,f,width):
  d.text((44,y),line,font=f,fill=color);y+=size+gap
 return y
def frame(r,body,speaker,index,total,dest,poster=False):
 im=Image.new('RGB',(540,960),'#102f36');d=ImageDraw.Draw(im)
 d.rounded_rectangle((30,30,510,930),radius=24,outline='#6e9c9f',width=2)
 subject={'anatomy':'ANATOMY','physiology':'PHYSIOLOGY','histology':'HISTOLOGY','cell-biology':'CELL BIOLOGY','biochemistry':'BIOCHEMISTRY','genetics':'GENETICS & IMMUNOLOGY'}[r['subject']]
 draw_text(d,subject,58,18,'#99d8ca',True)
 y=draw_text(d,r['title'],112,31,'#fffdf3',True)
 d.line((44,y+18,496,y+18),fill='#6e9c9f',width=2)
 if poster:
  draw_text(d,'Watch. Pause. Explain.',y+58,34,'#fffdf3',True)
  draw_text(d,'A short question-and-answer recap',y+200,25,'#cce4df')
 else:
  draw_text(d,speaker.upper(),y+48,19,'#efc784',True)
  size=37
  while len(lines(d,body,font(size),452))*(size+10)>790-(y+90):size-=1
  draw_text(d,body,y+90,size,'#fffdf3')
  d.rounded_rectangle((44,844,496,850),radius=3,fill='#365b60')
  d.rounded_rectangle((44,844,44+int(452*(index+1)/total),850),radius=3,fill='#a4e0cb')
 draw_text(d,'AI-assisted recap · synthetic voices',876,16,'#cce4df')
 draw_text(d,'Wardhan Medical Study Guide Studios',902,14,'#cce4df')
 im.save(dest)
def stamp(t):
 ms=round(t*1000);return f'{ms//3600000:02d}:{ms//60000%60:02d}:{ms//1000%60:02d}.{ms%1000:03d}'
def run(args):subprocess.run([ff,'-hide_banner','-loglevel','error','-y']+args,check=True,capture_output=True)
for r in recaps:
 key=r['lessonId'];dir=Path('.private/media-work')/key;segments=[j for j in jobs if j['lessonId']==key]
 elapsed=0;transcript=[];audioTranscript=[];vtt=['WEBVTT',''];concat=[];pcm=[];params=None
 for i,j in enumerate(segments):
  with wave.open(j['wav'],'rb') as w:
   if params is None:params=w.getparams()
   assert w.getnchannels()==params.nchannels and w.getframerate()==params.framerate
   data=w.readframes(w.getnframes());dur=w.getnframes()/w.getframerate();pcm.append(data)
  transcript.append({'startSeconds':round(elapsed,3),'text':j['speaker']+': '+j['text']})
  audioTranscript.append({'startSeconds':round(elapsed,3),'speaker':j['speaker'],'text':j['text']})
  caption=j['speaker']+': '+j['text']
  vtt.extend([str(i+1),stamp(elapsed)+' --> '+stamp(elapsed+dur),textwrap.fill(caption,width=46),''])
  dest=dir/f'frame-{i}.png';frame(r,j['text'],j['speaker'],i,len(segments),dest)
  concat.extend(["file '"+dest.resolve().as_posix()+"'","duration "+str(dur)])
  elapsed+=dur
 concat.append("file '"+dest.resolve().as_posix()+"'")
 (dir/'frames.txt').write_text('\n'.join(concat),encoding='utf8')
 with wave.open(str(dir/'narration.wav'),'wb') as w:w.setparams(params);w.writeframes(b''.join(pcm))
 frame(r,'','',0,1,dir/'poster.png',True)
 Image.open(dir/'poster.png').save(out/(key+'.webp'),lossless=True)
 (out/(key+'.vtt')).write_text('\n'.join(vtt),encoding='utf8',newline='\n')
 run(['-i',str(dir/'narration.wav'),'-map_metadata','-1','-codec:a','libmp3lame','-b:a','80k','-ac','1',str(out/(key+'.mp3'))])
 run(['-f','concat','-safe','0','-i',str(dir/'frames.txt'),'-i',str(dir/'narration.wav'),'-t',str(elapsed),'-vf','fps=10,format=yuv420p','-c:v','libx264','-preset','fast','-tune','stillimage','-crf','27','-c:a','aac','-b:a','64k','-ac','1','-movflags','+faststart','-map_metadata','-1',str(out/(key+'.mp4'))])
 assert (out/(key+'.mp4')).stat().st_size<4000000,'Oversized recap'
 base='/media/recaps/'+key
 videos.append({'id':'recap-'+key,'title':r['title'],'summary':next(l['summary'] for l in lessons if l['id']==key)+' AI-assisted question-and-answer recap with synthetic voices; not independently clinically peer reviewed.','subject':r['subject'],'topicIds':['topic-'+key],'lessonIds':[key],'durationSeconds':round(elapsed,3),'width':540,'height':960,'audioContent':'speech','status':'public','publicApproval':'Requested original website adaptations and generated educational recaps, 2026-09-08; individually source-checked script.','medicalReview':'reviewed','aiGenerated':True,'sourceUrl':base+'.mp4','posterUrl':base+'.webp','captions':[{'src':base+'.vtt','language':'en','label':'English'}],'transcript':transcript,'mimeType':'video/mp4'})
 audios.append({'lessonId':key,'title':r['title'],'src':base+'.mp3','durationSeconds':round(elapsed,3),'transcript':audioTranscript})
 audits.append({'lessonId':key,'segments':len(segments),'durationSeconds':round(elapsed,3),'videoBytes':(out/(key+'.mp4')).stat().st_size,'audioBytes':(out/(key+'.mp3')).stat().st_size})
 print(json.dumps(audits[-1]),flush=True)
Path('src/content/public-videos.json').write_text(json.dumps({'version':1,'records':videos},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
Path('src/content/study-audio.json').write_text(json.dumps({'version':1,'records':audios},ensure_ascii=False,indent=2)+'\n',encoding='utf8')
Path('.private/media-build-report.json').write_text(json.dumps(audits,indent=2))

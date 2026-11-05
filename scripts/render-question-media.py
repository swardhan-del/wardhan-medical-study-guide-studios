"""Render private silent question/pause/answer videos from question-media-plan.mjs.

No network, narration service, publication or release-register mutation. Requires
Pillow and an explicitly installed FFmpeg executable. Originals are not changed.
"""
import argparse
import hashlib
import json
import math
import os
from pathlib import Path
import re
import subprocess


ROOT = Path(__file__).resolve().parents[1]
SUBJECTS = {'anatomy': 'Anatomy and Embryology', 'histology': 'Microscopic Anatomy and Histology', 'cell-biology': 'Molecular Cell Biology', 'biochemistry': 'Biochemistry', 'physiology': 'Medical Physiology', 'genetics': 'Genetics', 'immunology': 'Immunology', 'biophysics': 'Biophysics'}


def private_path(value, create=False):
    p = Path(value).resolve()
    relative = p.relative_to(ROOT)
    if relative.parts[0] not in ('.private', 'output'):
        raise ValueError('Media and plans must stay in .private/ or output/')
    if create:
        p.mkdir(parents=True, exist_ok=True)
    return p


def stamp(seconds):
    ms = round(seconds * 1000)
    return f'{ms // 3600000:02}:{ms // 60000 % 60:02}:{ms // 1000 % 60:02}.{ms % 1000:03}'


def validate_question(question):
    if not re.fullmatch(r'[a-z0-9-]+', question.get('id', '')):
        raise ValueError('Unsafe question identifier')
    if not question.get('prompt') or not question.get('answer'):
        raise ValueError('Every question needs a prompt and model answer')
    if question.get('options'):
        answer = question.get('answerIndex')
        options = question['options']
        if type(answer) is not int or not 0 <= answer < len(options) or not all(o.get('text') and o.get('explanation') for o in options) or question['answer'] != options[answer]['text']:
            raise ValueError('Invalid answer key or missing feedback')


def wrap(draw, text, font, width):
    result = []
    for paragraph in text.splitlines():
        line = ''
        for word in paragraph.split():
            # Split long scientific tokens too, rather than clipping them.
            pieces = [word]
            if draw.textlength(word, font=font) > width:
                pieces, piece = [], ''
                for char in word:
                    if draw.textlength(piece + char, font=font) > width:
                        pieces.append(piece); piece = ''
                    piece += char
                if piece:
                    pieces.append(piece)
            for piece in pieces:
                candidate = (line + ' ' + piece).strip()
                if line and draw.textlength(candidate, font=font) > width:
                    result.append(line); line = piece
                else:
                    line = candidate
        result.append(line)
    return result


def render(lesson, question, dest, args):
    from PIL import Image, ImageDraw, ImageFont
    width, height = (540, 960) if args.format == 'portrait' else (960, 540)
    margin, size = 36, 27 if args.format == 'portrait' else 28
    font = ImageFont.truetype(args.font, size)
    small = ImageFont.truetype(args.font, 17)
    heading = ImageFont.truetype(args.font, 24)
    measure = ImageDraw.Draw(Image.new('RGB', (width, height)))
    max_lines = (height - 290) // (size + 9)
    blocks = [('QUESTION', question['prompt'] + ('\n\n' + '\n'.join(f'{chr(65+i)}. {o["text"]}' for i, o in enumerate(question.get('options', []))) if question.get('options') else '')),
              ('PAUSE AND ANSWER', 'Pause here. Say or write your answer before continuing.'),
              ('MODEL ANSWER', question['answer'] + ('\n\n' + question['explanation'] if question.get('explanation') and question['explanation'] != question['answer'] else ''))]
    for i, option in enumerate(question.get('options', [])):
        state = 'Correct under the stated conditions' if i == question['answerIndex'] else 'Why this option does not fit'
        blocks.append((f'OPTION {chr(65+i)}', f'{option["text"]}\n\n{state}: {option["explanation"]}'))
    blocks.append(('RETURN TO THE LESSON', 'Explain the mechanism, then try an application question.\n\n' + lesson['href']))
    scenes = []
    for label, text in blocks:
        lines = wrap(measure, text, font, width - 2 * margin)
        for start in range(0, len(lines), max_lines):
            chunk = lines[start:start + max_lines]
            caption = '\n'.join(chunk)
            scenes.append({'label': label, 'lines': chunk, 'text': caption, 'duration': args.pause if label == 'PAUSE AND ANSWER' else max(5, math.ceil(len(caption.split()) * 60 / args.words_per_minute))})
    dest.mkdir(parents=True, exist_ok=False)
    elapsed, cues, concat, transcript = 0, ['WEBVTT', ''], [], []
    for index, scene in enumerate(scenes):
        im = Image.new('RGB', (width, height), '#102f36'); draw = ImageDraw.Draw(im)
        draw.text((margin, 26), SUBJECTS.get(lesson['subject'], lesson['subject']), font=small, fill='#a4e0cb')
        title_lines = wrap(draw, lesson['title'], heading, width - 2 * margin)
        # The complete title remains in the transcript and JSON.
        for j, line in enumerate(title_lines[:2]):
            draw.text((margin, 60+j*29), line, font=heading, fill='#fffdf3')
        draw.text((margin, 132), scene['label'], font=small, fill='#efc784')
        for j, line in enumerate(scene['lines']):
            draw.text((margin, 176+j*(size+9)), line, font=font, fill='#fffdf3')
        draw.line((margin, height-80, margin + int((width-2*margin)*(index+1)/len(scenes)), height-80), fill='#a4e0cb', width=5)
        draw.text((margin, height-61), 'PRIVATE DRAFT | review pending | silent video', font=small, fill='#fffdf3')
        draw.text((margin, height-35), 'Wardhan Medical Study Guide Studios', font=small, fill='#a4e0cb')
        frame = dest/f'frame-{index:03}.png'; im.save(frame)
        concat.extend([f"file '{frame.name}'", f'duration {scene["duration"]}'])
        # VTT markup-significant characters escaped; no HTML is evaluated.
        safe_caption = (scene['label'] + '\n' + scene['text']).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
        cues += [str(index+1), f'{stamp(elapsed)} --> {stamp(elapsed+scene["duration"])}', safe_caption, '']
        transcript.append({'startSeconds': elapsed, 'endSeconds': elapsed + scene['duration'], 'label': scene['label'], 'text': scene['text']})
        elapsed += scene['duration']
    concat.append(f"file 'frame-{len(scenes)-1:03}.png'")
    (dest/'frames.txt').write_text('\n'.join(concat)+'\n')
    (dest/'captions.vtt').write_text('\n'.join(cues)+'\n')
    (dest/'transcript.md').write_text(f'# {lesson["title"]}\n\nPrivate draft; scientific, editorial, rights and human accessibility review pending.\n\n' + '\n\n'.join(f'{t["label"]}\n\n{t["text"]}' for t in transcript)+'\n')
    cmd = [args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-n', '-f', 'concat', '-safe', '1', '-i', 'frames.txt', '-t', str(elapsed), '-vf', 'fps=10,format=yuv420p', '-c:v', 'libx264', '-preset', 'fast', '-tune', 'stillimage', '-crf', '27', '-an', '-map_metadata', '-1', '-movflags', '+faststart', 'question-answer.mp4']
    subprocess.run(cmd, cwd=dest, check=True, capture_output=True, timeout=180)
    # Decode the complete output to catch corrupt/truncated exports.
    subprocess.run([args.ffmpeg, '-v', 'error', '-i', str(dest/'question-answer.mp4'), '-f', 'null', '-'], check=True, capture_output=True, timeout=180)
    metadata = {'version': 1, 'lessonId': lesson['lessonId'], 'questionId': question['id'], 'questionFingerprint': hashlib.sha256(json.dumps(question, sort_keys=True, ensure_ascii=False).encode()).hexdigest(), 'lessonFingerprint': lesson['lessonFingerprint'], 'title': lesson['title'], 'subject': lesson['subject'], 'href': lesson['href'], 'width': width, 'height': height, 'durationSeconds': elapsed, 'audio': 'silent', 'releaseStatus': 'private-review-only', 'review': lesson['gates'], 'transcript': transcript}
    metadata['sha256'] = hashlib.sha256((dest/'question-answer.mp4').read_bytes()).hexdigest()
    (dest/'manifest.json').write_text(json.dumps(metadata, indent=2)+'\n')
    return {k: metadata[k] for k in ('lessonId', 'questionId', 'width', 'height', 'durationSeconds', 'sha256')}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--plan', required=True)
    parser.add_argument('--out', required=True)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--lesson')
    group.add_argument('--subject')
    group.add_argument('--all', action='store_true')
    selection = parser.add_mutually_exclusive_group()
    selection.add_argument('--question', help='Stable existing question ID; default is the first question per lesson')
    selection.add_argument('--all-questions', action='store_true', help='Explicitly render every question in each selected lesson')
    parser.add_argument('--format', choices=['portrait', 'landscape'], default='portrait')
    parser.add_argument('--font', required=True, help='Path to an installed, appropriately licensed TrueType font')
    parser.add_argument('--ffmpeg', default=os.environ.get('FFMPEG', 'ffmpeg'))
    parser.add_argument('--pause', type=int, default=8)
    parser.add_argument('--words-per-minute', type=int, default=130)
    args = parser.parse_args()
    if not 3 <= args.pause <= 60 or not 60 <= args.words_per_minute <= 200:
        parser.error('Pause must be 3–60 seconds; reading speed must be 60–200 words/minute')
    data = json.loads(private_path(args.plan).read_text())
    if data.get('version') != 1 or data.get('releaseStatus') != 'private-review-only':
        parser.error('Expected a private version-1 lesson plan')
    lessons = [l for l in data['lessons'] if (args.all or l['lessonId'] == args.lesson or l['subject'] == args.subject)]
    if not lessons:
        parser.error('No matching lesson or subject')
    output = private_path(args.out, create=True)
    for lesson in lessons:
        if not re.fullmatch(r'[a-z0-9-]+', lesson['lessonId']):
            raise ValueError('Unsafe lesson identifier')
        questions = [q for q in lesson['questions'] if not args.question or q['id'] == args.question]
        if not questions:
            raise ValueError('No matching question')
        for question in questions if args.all_questions else questions[:1]:
            validate_question(question)
            dest = output/lesson['lessonId']/(question['id']+'-'+args.format)
            print(json.dumps(render(lesson, question, dest, args)), flush=True)


if __name__ == '__main__':
    main()

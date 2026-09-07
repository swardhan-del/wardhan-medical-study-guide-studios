# Video library release workflow

The /videos index, /videos/[id] pages and lesson players read only public-videos.json. An empty catalog is intentional until an exact video has a public-release decision and a tested delivery URL. No archive video is bundled or automatically exposed.

## Add a reviewed video

Create a public-videos.json record using the PublicVideo type in src/lib/video-types.ts. Use a stable id, public title and summary, durationSeconds and display width/height measured from the actual media (including orientation and non-square pixel display aspect ratio), audioContent (speech, non-speech or silent), subject, topicIds and lessonIds. Inspect the video itself; filenames do not establish its topic, ownership, privacy or scientific accuracy. Record explicit publicApproval evidence, medicalReview: reviewed and whether it is AI-generated. Keep review-pending notes, private filenames and paths in the controlled archive outside Git. Do not assert expert review unless that occurred.

Provide a posterUrl, sourceUrl and video/mp4 or video/webm MIME type. Captions are WebVTT tracks with language and label. The transcript is reviewed text with chronological startSeconds values inside the measured duration. Correct automatic captions against the audio, including units, negations and medical terminology. Do not invent a transcript from slides or filenames. New releases with sound require reviewed captions and a transcript. For a confirmed silent clip, provide a reviewed, timed visual description in the transcript field and set audioContent to silent; empty captions are valid because there is no audio to caption. The player labels this text Visual description. Do not claim that an unheard audio track is silent.

The record automatically appears in video search and topic filters, creates an individual page and enters the sitemap. Matching lessonIds embed the player in the existing library lesson/resource pages and renal lesson layout. All topic and lesson references must point to released records. No unapproved video title or poster belongs in this public catalog.

## Exact hosting dependency

No suitable video delivery configuration was found in the website checkout. Before any source video can play in the preview, provision or identify an already-authorized delivery location and provide a stable public HTTPS URL for the explicitly approved derivative, poster and caption file. Large binaries stay outside Git. No service has been purchased or provisioned by this change.

The delivery host must return the correct Content-Type, support byte-range requests (206 and Accept-Ranges: bytes) for seeking, and allow anonymous cross-origin media/caption requests from the website's preview and eventual custom-domain origins. Caption files require text/vtt. Avoid signed URLs that expire, credentials in URLs and private account links. Content-addressed object names and immutable caching keep exact releases reviewable. Vercel Blob or equivalent object storage can satisfy this dependency if separately authorized and configured; a Vercel project alone is not evidence of a configured video store.

Preserve originals. Place any optimized MP4/WebM, fast-start copy, poster and corrected VTT beside a private preparation manifest outside the public checkout. Select resolution/bitrate from the actual teaching content and legibility; do not downscale small diagram labels blindly. Re-inspect derivatives for audio, text readability, synchronization and dropped content before upload.

## Player behavior and verification

The player uses native controls, playsInline and preload=none, with no autoplay. Playback speed and fullscreen controls supplement the native controls. Transcript timestamps load media on request if necessary, then seek without automatically starting playback. Measured dimensions reserve display space for portrait and landscape media; full frames are contained without cropping. Native iOS fullscreen is supported as a fallback; fullscreen failure does not incorrectly report playback failure. If delivery fails, visitors can open the file separately or read the transcript.

Run the standard build/content/browser checks. For optional isolated verification tools, create .private/verification-tools and install esbuild, axe-core and prettier there. Run scripts/check-video-player.mjs using Node; it serves an isolated synthetic fixture without a local website server. For scripts/check-accessibility.mjs, run the website on port 3101 or set CHECK_BASE_URL to its URL. Set FFMPEG_PATH to an installed FFmpeg executable for the player check. The player check records a synthetic canvas clip, remuxes it for seeking and checks the actual component at 1440 and 390 pixels. Generated fixtures and results stay under .private and are never deployed. This verifies player mechanics; it does not establish that an archive video is medically approved or playable on the preview.

## Source-inspection follow-up — 2026-09-08

The Lenovo checkout and linked Vercel project were reverified. An expanded archive scan found 37 study-guide video paths (including copies) and three unrelated website-audit videos. Four study-guide candidates were downloaded to ignored private inspection copies and verified against Dropbox content hashes. Full FFprobe measurements and decoded frame samples now establish their actual visual content, duration and codecs. No confirmed LLM-generated recording was identified. The remaining paths are not fully reviewed.

The four inspected candidates contain attributed collage artwork, classroom histology captures and a university question-bank recording. They remain outside the public catalog pending source-rights/publication and medical review; captions/audio are not yet reviewed or matched. Three private review derivatives and posters were prepared. HEVC clips were converted to H.264/AAC, orientation was preserved, and location/device metadata and data tracks were removed. The original inspection copies were hash-checked unchanged; archive originals were not edited. These derivatives are not publication assets.

Detailed measurements, proposed taxonomy placements and rights notes are in the ignored private inventory and inspection report, available locally to the owner. No private paths, source filenames, GPS values, images or videos from this investigation are committed. A working FFmpeg build with MOV/MP4 demuxing is required for inspection; the Playwright-bundled FFmpeg supports only WebM and must not be used to conclude that an MP4/MOV source is corrupt.

The public catalog still has zero video records. Preview video publication remains dependent on clearly eligible recordings, completed content/caption review and stable authorized delivery URLs. Player fixtures and local private-source playback checks do not establish public preview playback.

Follow-up verification: four synthetic player scenarios passed playback, seek-before-play, speed, fullscreen and caption/visual-description behavior at 1440 and 390 pixels, with no initial media transfer and no WCAG A/AA violations. Three actual private review derivatives each played and sought successfully at both widths. No archive audio transcript or caption accuracy is claimed by these tests.

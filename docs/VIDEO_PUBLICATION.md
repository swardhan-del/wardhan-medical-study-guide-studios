# Video library release workflow

The /videos index, /videos/[id] pages and lesson players read only public-videos.json. An empty catalog is intentional until an exact video has a public-release decision and a tested delivery URL. No archive video is bundled or automatically exposed.

## Add a reviewed video

Create a public-videos.json record using the PublicVideo type in src/lib/video-types.ts. Use a stable id, public title and summary, durationSeconds measured from the actual media, subject, topicIds and lessonIds. Inspect the video itself; filenames do not establish its topic, ownership, privacy or scientific accuracy. Record explicit publicApproval evidence, medicalReview: reviewed and whether it is AI-generated. Keep review-pending notes, private filenames and paths in the controlled archive outside Git. Do not assert expert review unless that occurred.

Provide a posterUrl, sourceUrl and video/mp4 or video/webm MIME type. Captions are WebVTT tracks with language and label. The transcript is reviewed text with chronological startSeconds values inside the measured duration. Correct automatic captions against the audio, including units, negations and medical terminology. Do not invent a transcript from slides or filenames. New releases require captions and a transcript; the player also handles older records without them defensively.

The record automatically appears in video search and topic filters, creates an individual page and enters the sitemap. Matching lessonIds embed the player in the existing library lesson/resource pages and renal lesson layout. All topic and lesson references must point to released records. No unapproved video title or poster belongs in this public catalog.

## Exact hosting dependency

No suitable video delivery configuration was found in the website checkout. Before any source video can play in the preview, provision or identify an already-authorized delivery location and provide a stable public HTTPS URL for the explicitly approved derivative, poster and caption file. Large binaries stay outside Git. No service has been purchased or provisioned by this change.

The delivery host must return the correct Content-Type, support byte-range requests (206 and Accept-Ranges: bytes) for seeking, and allow anonymous cross-origin media/caption requests from the website's preview and eventual custom-domain origins. Caption files require text/vtt. Avoid signed URLs that expire, credentials in URLs and private account links. Content-addressed object names and immutable caching keep exact releases reviewable. Vercel Blob or equivalent object storage can satisfy this dependency if separately authorized and configured; a Vercel project alone is not evidence of a configured video store.

Preserve originals. Place any optimized MP4/WebM, fast-start copy, poster and corrected VTT beside a private preparation manifest outside the public checkout. Select resolution/bitrate from the actual teaching content and legibility; do not downscale small diagram labels blindly. Re-inspect derivatives for audio, text readability, synchronization and dropped content before upload.

## Player behavior and verification

The player uses native controls, playsInline and preload=none, with no autoplay. Playback speed and fullscreen controls supplement the native controls. Transcript timestamps seek without automatically starting playback. If delivery fails, visitors can open the file separately or read the transcript.

Run the standard build/content/browser checks. For optional isolated verification tools, create .private/verification-tools and install esbuild, axe-core and prettier there. Run scripts/check-video-player.mjs using Node; it serves an isolated synthetic fixture without a local website server. For scripts/check-accessibility.mjs, run the website on port 3101 or set CHECK_BASE_URL to its URL. Set FFMPEG_PATH to an installed FFmpeg executable for the player check. The player check records a synthetic canvas clip, remuxes it for seeking and checks the actual component at 1440 and 390 pixels. Generated fixtures and results stay under .private and are never deployed. This verifies player mechanics; it does not establish that an archive video is medically approved or playable on the preview.

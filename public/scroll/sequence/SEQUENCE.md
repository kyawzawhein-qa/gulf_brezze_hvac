# Gulf Breeze HVAC — Scroll Scrub Sequence (video-derived)

**Real camera fly-through** from Wan 3.0 first→last keyframe clips (not Ken Burns).

## Specs

| Property | Value |
|----------|--------|
| Frame count | **210** |
| Dimensions | **1920 × 1080** (16:9) |
| Source FPS extract | **15** |
| Duration | **~14s** master |
| Naming | `frame_001.webp` … `frame_210.webp` |
| Public URL prefix | `/scroll/sequence/` |
| Master MP4 | `/scroll/keyframes/hvac_keyframes_master.mp4` (~25MB) |
| Clips | `/scroll/keyframes/clips/clip{1,2,3}.mp4` |

## Phase 5 captions (scroll % → frames)

| Scroll % | Frames | Caption |
|----------|--------|---------|
| **0% – 25%** | **1–53** | Blistering Florida Heat Outside? Stay 100% Cool Inside. |
| **25% – 55%** | **54–116** | Engineered for Southwest Florida Humidity & Comfort. |
| **55% – 85%** | **117–179** | Whisper-Quiet, Zoned Temperature Control in Every Room. |
| **85% – 100%** | **180–210** | Voted Best HVAC Contractor in Lee County. |

## Clip → frame map

| Clip | Motion | Seconds | Frames |
|------|--------|---------|--------|
| 1 | Exterior sky dive → living (open glass) | 5 | 1–75 |
| 2 | Living → hallway → bedroom | 5 | 76–150 |
| 3 | Bedroom → ensuite bathroom | 4 | 151–210 |

## Scrub usage

```ts
const index = Math.min(frameCount, Math.max(1, Math.round(p * (frameCount - 1)) + 1));
// src = `/scroll/sequence/frame_${String(index).padStart(3,'0')}.webp`
```

Preload recommended; total sequence ~20MB WebP.

## Generation notes

- Model: Higgsfield **Wan 3.0** (`wan3_0`), first_image + end_image roles, 720p upscaled to 1920×1080 for extract
- Audio disabled to save credits
- Concat via ffmpeg; extract: `fps=15,scale=1920:-1` libwebp q80
- Cyan `#00E5FF` airflow preserved from keyframe stills where the model retained it

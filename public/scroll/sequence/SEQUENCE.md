# Gulf Breeze HVAC — Scroll Scrub Sequence (single-entry fly-through)

**One continuous camera story** — exterior entry once, then through every room.

## Specs

| Property | Value |
|----------|--------|
| Frame count | **178** |
| Dimensions | **1920 × 1080** (16:9) |
| Source FPS extract | **15** |
| Duration | **~11.9s** scrubbed |
| Naming | `frame_001.webp` … `frame_178.webp` |
| Public URL prefix | `/scroll/sequence/` |

## Story map (published)

| Segment | Source frames | Motion |
|---------|---------------|--------|
| Entry | 1–75 | Aerial exterior → living (clip 1) |
| Interior tour | 76–178 | Living → hallway → bedroom → bath (clips 2–3, trimmed) |

## Trim note (v3)

Wan clip 2 originally restarted from the **aerial exterior** at source frame 076 (visually identical to frame 001), causing a second “fly into the house” mid-scroll. **Frames 76–107 were dropped.** Published frame 076 is source frame 108 (living-room interior); the story continues forward from there. Clip 3 (bedroom → bath) required no trim.

Rebuild: `python3 scripts/rebuild_continuous_sequence.py`

## Captions (scroll %)

| Scroll % | Caption |
|----------|---------|
| **0% – 28%** | Blistering Florida Heat Outside? Stay 100% Cool Inside. |
| **28% – 52%** | Engineered for Southwest Florida Humidity & Comfort. |
| **52% – 82%** | Whisper-Quiet, Zoned Temperature Control in Every Room. |
| **82% – 100%** | Voted Best HVAC Contractor in Lee County. |

## Scrub usage

```ts
const index = Math.min(frameCount - 1, Math.max(0, Math.round(p * (frameCount - 1))));
// src = `/scroll/sequence/frame_${String(index + 1).padStart(3, "0")}.webp`
```

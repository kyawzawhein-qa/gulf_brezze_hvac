# ART-NOTES — Gulf Breeze HVAC Photoreal Keyframes & Scrub Pack

## Sources (do not delete)

| Keyframe | Source file | Subject |
|----------|-------------|---------|
| kf-01-exterior | `refs/kf-01-exterior-src.jpg` | Aerial Cape Coral villa + pool + canal + sun flare |
| kf-02-living | `refs/kf-02-living-src.jpg` | Living room open to pool + cyan airflow from linear vents |
| kf-03-bedroom | `refs/kf-03-bedroom-src.jpg` | Hallway → bedroom with cyan vent mist |
| kf-04-bathroom | `refs/kf-04-bathroom-src.jpg` | Ensuite bath connected to bedroom |

Source dims: **2752 × 1536** (already 16:9).

## Crop

- Center crop / direct LANCZOS resize to **1920 × 1080** for keyframe masters (`.webp` + `.jpg`).
- Sequence scrub frames derived at **1600 × 900** for lighter payload.
- Hero `hero-coastal` from exterior at **1920 × 1080**; left-ish composition / sun flare left intact.

## Grade

- **Exterior:** slight contrast + warmth (Florida sun); sun flare preserved.
- **Interiors:** light contrast only; keep cool LED feel.
- **Cyan airflow `#00E5FF`:** kept as-is from source photos — not erased, not redrawn.

## Sequence interpolation

- **Method:** Ken Burns (slow zoom ~1.0 → 1.06–1.08 + slight pan) within segments; **alpha crossfade** (~4 frames) between keyframes.
- **No video AI** used (no Luma Dream Machine, Kling, Runway, or similar).
- Tools: Python 3 + Pillow; optional `cwebp` available on box.
- Story map: frames 1–9 exterior → 10–20 living → 21–30 bedroom → 31–36 bathroom.

## Style bible (locked)

Modern Coastal Florida Minimalist Villa; floor-to-ceiling glass; ~10ft ceilings; continuous light oak floors; ultra-matte off-white; linear AC slot diffusers; blistering sun outside / cool LED inside; HVAC motif cyan airflow ribbons `#00E5FF`.

## Outputs

- Keyframes: `/public/scroll/keyframes/kf-0{1–4}-{exterior,living,bedroom,bathroom}.{webp,jpg}`
- Sequence: `/public/scroll/sequence/frame_001.webp` … `frame_036.webp`
- Hero: `/public/hero/hero-coastal.webp` + `.jpg` (+ refreshed `.png`)

---

## Update — video fly-through scrub (Wan 3.0)

Replaced Ken Burns sequence with real image-to-video:

1. Uploaded kf-01…04 to Higgsfield
2. Generated 3 Wan 3.0 first→last clips (5s + 5s + 4s)
3. Concat → `hvac_keyframes_master.mp4`
4. Extracted **210** WebP frames @ 15fps into `/public/scroll/sequence/`

Job IDs: `fc1bb15c-…` (clip1), `d8ae4cf8-…` (clip2), `12e73565-…` (clip3).

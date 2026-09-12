#!/usr/bin/env python3
"""Build photoreal keyframes, 36-frame Ken Burns scrub sequence, and hero for Gulf Breeze HVAC."""
from __future__ import annotations

import json
import math
import os
from pathlib import Path

from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path("/workspace/gulf-breeze-hvac/public")
REFS = ROOT / "scroll/keyframes/refs"
KF_DIR = ROOT / "scroll/keyframes"
SEQ_DIR = ROOT / "scroll/sequence"
HERO_DIR = ROOT / "hero"

KF_W, KF_H = 1920, 1080
SEQ_W, SEQ_H = 1600, 900
HERO_W, HERO_H = 1920, 1080

SRCS = {
    1: REFS / "kf-01-exterior-src.jpg",
    2: REFS / "kf-02-living-src.jpg",
    3: REFS / "kf-03-bedroom-src.jpg",
    4: REFS / "kf-04-bathroom-src.jpg",
}

NAMES = {
    1: "kf-01-exterior",
    2: "kf-02-living",
    3: "kf-03-bedroom",
    4: "kf-04-bathroom",
}


def center_crop_16x9(im: Image.Image, tw: int, th: int) -> Image.Image:
    """Smart-ish center crop to target 16:9, then resize with LANCZOS."""
    w, h = im.size
    target_ar = tw / th
    src_ar = w / h
    if abs(src_ar - target_ar) < 0.01:
        cropped = im
    elif src_ar > target_ar:
        # wider — crop sides
        nw = int(round(h * target_ar))
        left = (w - nw) // 2
        cropped = im.crop((left, 0, left + nw, h))
    else:
        # taller — crop top/bottom slightly favoring upper third for exteriors handled by caller
        nh = int(round(w / target_ar))
        top = (h - nh) // 2
        cropped = im.crop((0, top, w, top + nh))
    return cropped.resize((tw, th), Image.Resampling.LANCZOS)


def grade_exterior(im: Image.Image) -> Image.Image:
    im = ImageEnhance.Contrast(im).enhance(1.08)
    im = ImageEnhance.Color(im).enhance(1.06)
    im = ImageEnhance.Brightness(im).enhance(1.02)
    # slight warmth via color balance approximation
    r, g, b = im.split()
    r = ImageEnhance.Brightness(r).enhance(1.04)
    b = ImageEnhance.Brightness(b).enhance(0.97)
    return Image.merge("RGB", (r, g, b))


def grade_interior(im: Image.Image) -> Image.Image:
    # keep cool; slight contrast only — preserve cyan airflow
    im = ImageEnhance.Contrast(im).enhance(1.04)
    im = ImageEnhance.Color(im).enhance(1.02)
    r, g, b = im.split()
    b = ImageEnhance.Brightness(b).enhance(1.02)
    r = ImageEnhance.Brightness(r).enhance(0.99)
    return Image.merge("RGB", (r, g, b))


def save_webp_jpg(im: Image.Image, stem: Path, webp_q: int = 82, jpg_q: int = 82):
    webp_path = stem.with_suffix(".webp")
    jpg_path = stem.with_suffix(".jpg")
    im.save(webp_path, "WEBP", quality=webp_q, method=6)
    im.save(jpg_path, "JPEG", quality=jpg_q, optimize=True)
    return webp_path, jpg_path


def ken_burns_frame(
    base: Image.Image,
    t: float,
    zoom_start: float = 1.0,
    zoom_end: float = 1.08,
    pan_x: float = 0.0,
    pan_y: float = 0.0,
    out_w: int = SEQ_W,
    out_h: int = SEQ_H,
) -> Image.Image:
    """t in [0,1]. Slow zoom + slight pan. pan_x/y are fractions of leftover crop room."""
    zoom = zoom_start + (zoom_end - zoom_start) * t
    # Render from a larger canvas: scale base then crop window
    # We work in output space: take a crop of size (out_w/zoom, out_h/zoom) from base
    # then resize to out_w x out_h
    bw, bh = base.size
    crop_w = bw / zoom
    crop_h = bh / zoom
    # available pan room
    room_x = bw - crop_w
    room_y = bh - crop_h
    # center + pan (pan_x positive = look right = crop moves left... actually:
    # pan_x > 0 means shift view toward right side of image)
    cx = room_x * 0.5 + room_x * 0.5 * pan_x * t
    cy = room_y * 0.5 + room_y * 0.5 * pan_y * t
    # clamp
    cx = max(0.0, min(room_x, cx))
    cy = max(0.0, min(room_y, cy))
    left = int(round(cx))
    top = int(round(cy))
    right = int(round(cx + crop_w))
    bottom = int(round(cy + crop_h))
    # fix rounding to exact size
    if right - left < int(crop_w):
        right = left + int(math.ceil(crop_w))
    if bottom - top < int(crop_h):
        bottom = top + int(math.ceil(crop_h))
    if right > bw:
        left -= right - bw
        right = bw
    if bottom > bh:
        top -= bottom - bh
        bottom = bh
    left = max(0, left)
    top = max(0, top)
    cropped = base.crop((left, top, right, bottom))
    return cropped.resize((out_w, out_h), Image.Resampling.LANCZOS)


def alpha_blend(a: Image.Image, b: Image.Image, alpha: float) -> Image.Image:
    """alpha=0 -> a, alpha=1 -> b"""
    alpha = max(0.0, min(1.0, alpha))
    return Image.blend(a.convert("RGB"), b.convert("RGB"), alpha)


def build_keyframes() -> dict[int, Image.Image]:
    KF_DIR.mkdir(parents=True, exist_ok=True)
    out: dict[int, Image.Image] = {}
    for i, src in SRCS.items():
        im = Image.open(src).convert("RGB")
        im = center_crop_16x9(im, KF_W, KF_H)
        if i == 1:
            im = grade_exterior(im)
        else:
            im = grade_interior(im)
        stem = KF_DIR / NAMES[i]
        wp, jp = save_webp_jpg(im, stem, webp_q=83, jpg_q=82)
        print(f"keyframe {NAMES[i]}: {wp.stat().st_size} webp, {jp.stat().st_size} jpg")
        # also keep seq-sized version in memory
        out[i] = im.resize((SEQ_W, SEQ_H), Image.Resampling.LANCZOS)
    return out


def build_sequence(kfs: dict[int, Image.Image]):
    SEQ_DIR.mkdir(parents=True, exist_ok=True)
    # Segment plan (1-based frame indices):
    # 1–9:   exterior Ken Burns (zoom 1.0→1.08, slight descent pan_y+)
    # 10–20: crossfade ext→living (frames 10–13 ~4 frames), then living KB
    # 21–30: crossfade living→bedroom (21–24), then bedroom KB
    # 31–36: crossfade bedroom→bathroom (31–34), settle bathroom

    frames: list[Image.Image] = [None] * 36  # type: ignore

    # --- Segment A: frames 1-9 exterior ---
    # Pure exterior KB for frames 1-9; crossfade starts at 10
    for fi in range(1, 10):
        t = (fi - 1) / 8.0  # 0..1 across 9 frames
        frames[fi - 1] = ken_burns_frame(
            kfs[1], t, 1.0, 1.08, pan_x=0.08, pan_y=0.15
        )

    # --- Segment B: frames 10-20 ---
    # Crossfade 10-13 (4 frames): exterior end → living start
    # Then living KB 14-20
    ext_end = ken_burns_frame(kfs[1], 1.0, 1.0, 1.08, pan_x=0.08, pan_y=0.15)
    liv_start = ken_burns_frame(kfs[2], 0.0, 1.0, 1.08, pan_x=-0.06, pan_y=0.05)

    for fi in range(10, 14):
        alpha = (fi - 10) / 3.0  # 0, 1/3, 2/3, 1
        frames[fi - 1] = alpha_blend(ext_end, liv_start, alpha)

    for fi in range(14, 21):
        t = (fi - 14) / 6.0  # 0..1 across 7 frames
        frames[fi - 1] = ken_burns_frame(
            kfs[2], t, 1.0, 1.08, pan_x=-0.06, pan_y=0.05
        )

    # --- Segment C: frames 21-30 ---
    liv_end = ken_burns_frame(kfs[2], 1.0, 1.0, 1.08, pan_x=-0.06, pan_y=0.05)
    bed_start = ken_burns_frame(kfs[3], 0.0, 1.0, 1.07, pan_x=0.05, pan_y=0.0)

    for fi in range(21, 25):
        alpha = (fi - 21) / 3.0
        frames[fi - 1] = alpha_blend(liv_end, bed_start, alpha)

    for fi in range(25, 31):
        t = (fi - 25) / 5.0
        frames[fi - 1] = ken_burns_frame(
            kfs[3], t, 1.0, 1.07, pan_x=0.05, pan_y=0.0
        )

    # --- Segment D: frames 31-36 ---
    bed_end = ken_burns_frame(kfs[3], 1.0, 1.0, 1.07, pan_x=0.05, pan_y=0.0)
    bath_start = ken_burns_frame(kfs[4], 0.0, 1.0, 1.06, pan_x=0.0, pan_y=0.04)

    for fi in range(31, 35):
        alpha = (fi - 31) / 3.0
        frames[fi - 1] = alpha_blend(bed_end, bath_start, alpha)

    for fi in range(35, 37):
        t = (fi - 35) / 1.0  # 0 then 1
        frames[fi - 1] = ken_burns_frame(
            kfs[4], t, 1.0, 1.06, pan_x=0.0, pan_y=0.04
        )

    assert all(f is not None for f in frames)

    sizes = []
    for i, im in enumerate(frames, start=1):
        path = SEQ_DIR / f"frame_{i:03d}.webp"
        # quality loop to hit ~40-120KB
        q = 78
        im.save(path, "WEBP", quality=q, method=6)
        sz = path.stat().st_size
        if sz > 130_000:
            im.save(path, "WEBP", quality=68, method=6)
            sz = path.stat().st_size
        elif sz < 35_000:
            im.save(path, "WEBP", quality=85, method=6)
            sz = path.stat().st_size
        sizes.append(sz)
        print(f"  {path.name}: {sz} bytes")

    total = sum(sizes)
    print(f"sequence total: {total/1024/1024:.2f} MB ({total} bytes)")
    return sizes


def build_hero():
    HERO_DIR.mkdir(parents=True, exist_ok=True)
    im = Image.open(SRCS[1]).convert("RGB")
    im = center_crop_16x9(im, HERO_W, HERO_H)
    im = grade_exterior(im)
    webp = HERO_DIR / "hero-coastal.webp"
    jpg = HERO_DIR / "hero-coastal.jpg"
    im.save(webp, "WEBP", quality=82, method=6)
    im.save(jpg, "JPEG", quality=82, optimize=True)
    # also refresh png at reasonable size for fallbacks
    png = HERO_DIR / "hero-coastal.png"
    im.save(png, "PNG", optimize=True)
    print(f"hero webp={webp.stat().st_size} jpg={jpg.stat().st_size} png={png.stat().st_size}")


def write_docs():
    # SEQUENCE.md
    seq_md = SEQ_DIR / "SEQUENCE.md"
    seq_md.write_text(
        """# Gulf Breeze HVAC — Scroll Scrub Sequence

Photoreal 16:9 villa walkthrough sequence for scroll-scrub storytelling.
Captions live in app / manifest — frames contain **no** baked text overlays or logos.

## Specs

| Property | Value |
|----------|--------|
| Frame count | **36** |
| Dimensions | **1600 × 900** (16:9) |
| Format | WebP (quality ~70–85, target ~40–120KB each) |
| Naming | `frame_001.webp` … `frame_036.webp` (zero-padded 3 digits) |
| Absolute path prefix | `/workspace/gulf-breeze-hvac/public/scroll/sequence/` |
| Public URL prefix | `/scroll/sequence/` |
| Keyframe sources | `/workspace/gulf-breeze-hvac/public/scroll/keyframes/` |
| Style | Photoreal villa keyframes (not SVG illustration) |

## Phase 5 caption map (scroll % AND frame ranges)

| Scroll % | Frames | Caption |
|----------|--------|---------|
| **0–25%** | **1–9** | Blistering Florida Heat Outside? Stay 100% Cool Inside. |
| **25–55%** | **10–20** | Engineered for Southwest Florida Humidity & Comfort. |
| **55–85%** | **21–30** | Whisper-Quiet, Zoned Temperature Control in Every Room. |
| **85–100%** | **31–36** | Voted Best HVAC Contractor in Lee County. |

Suggested crossfade windows (±1–2 frames) at 9↔10, 20↔21, 30↔31 for smoother caption swaps.

## Beat breakdown (photoreal)

1. **Frames 1–9 — Exterior aerial (0–25%)**  
   Cape Coral villa + pool + canal + sun flare. Ken Burns slow push-in / subtle descent on `kf-01-exterior`.

2. **Frames 10–20 — Living room (25–55%)**  
   Crossfade exterior→living (~frames 10–13), then Ken Burns into open living room with cyan airflow from linear vents (`kf-02-living`).

3. **Frames 21–30 — Bedroom hallway (55–85%)**  
   Crossfade living→bedroom hallway (~frames 21–24), then Ken Burns into bedroom with cyan vent mist (`kf-03-bedroom`).

4. **Frames 31–36 — Ensuite bathroom (85–100%)**  
   Crossfade bedroom→bathroom (~frames 31–34), settle on ensuite (`kf-04-bathroom`).

## Interpolation method

- **No video AI** (no Luma / Kling / Runway).
- Within segments: Ken Burns (slow zoom ~1.0→1.06–1.08 + slight pan) via Pillow.
- Between segments: alpha crossfade over ~4 frames.
- Cyan `#00E5FF` airflow overlays preserved from source photos.

## Brand / style bible (locked)

Modern Coastal Florida Minimalist Villa · floor-to-ceiling glass · ~10ft ceilings · continuous light oak floors · ultra-matte off-white · linear AC slot diffusers · blistering sun outside / cool LED inside · HVAC motif cyan airflow `#00E5FF`.

## Suggested scrub usage

- Prefer a canvas or stacked `<img>` sequence driven by scroll progress `p ∈ [0,1]`:
  - `index = clamp(round(p * 35) + 1, 1, 36)`
  - or linear blend between floor / ceil frames for softer scrub
- Preload all 36 WebPs.
- Map captions with the ranges above; do **not** bake captions into frames.
- Keyframe stills also available at `/scroll/keyframes/kf-0{1–4}-*.webp`.

## Files

```
/workspace/gulf-breeze-hvac/public/scroll/sequence/
  frame_001.webp … frame_036.webp
  svg/                    (legacy SVG masters — unused by photoreal pack)
  SEQUENCE.md
  manifest.json
  DONE.txt

/workspace/gulf-breeze-hvac/public/scroll/keyframes/
  kf-01-exterior.webp|.jpg
  kf-02-living.webp|.jpg
  kf-03-bedroom.webp|.jpg
  kf-04-bathroom.webp|.jpg
  refs/kf-0*-src.jpg      (source masters — do not delete)
  ART-NOTES.md
  DONE.txt
```
""",
        encoding="utf-8",
    )

    # manifest.json — preserve schema, update captions
    manifest = {
        "version": 1,
        "width": SEQ_W,
        "height": SEQ_H,
        "frameCount": 36,
        "pattern": "frame_{###}.webp",
        "frames": [f"/scroll/sequence/frame_{i:03d}.webp" for i in range(1, 37)],
        "captions": [
            {
                "at": 0.0,
                "text": "Blistering Florida Heat Outside? Stay 100% Cool Inside.",
                "frames": [1, 9],
            },
            {
                "at": 0.25,
                "text": "Engineered for Southwest Florida Humidity & Comfort.",
                "frames": [10, 20],
            },
            {
                "at": 0.55,
                "text": "Whisper-Quiet, Zoned Temperature Control in Every Room.",
                "frames": [21, 30],
            },
            {
                "at": 0.85,
                "text": "Voted Best HVAC Contractor in Lee County.",
                "frames": [31, 36],
            },
        ],
    }
    (SEQ_DIR / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )

    # ART-NOTES.md
    (KF_DIR / "ART-NOTES.md").write_text(
        """# ART-NOTES — Gulf Breeze HVAC Photoreal Keyframes & Scrub Pack

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
""",
        encoding="utf-8",
    )

    (KF_DIR / "DONE.txt").write_text(
        """DONE — photoreal keyframes + 36-frame scrub pack + hero
Generated with Pillow Ken Burns + crossfade (no video AI).
See ART-NOTES.md and ../sequence/SEQUENCE.md.
""",
        encoding="utf-8",
    )

    (SEQ_DIR / "DONE.txt").write_text(
        """DONE — 36 photoreal WebP frames (Ken Burns + crossfade from villa keyframes).
SVG masters in svg/ are legacy and unused by this pack.
See SEQUENCE.md + manifest.json.
""",
        encoding="utf-8",
    )
    print("docs written")


def main():
    print("=== Building keyframes ===")
    kfs = build_keyframes()
    print("=== Building sequence ===")
    build_sequence(kfs)
    print("=== Building hero ===")
    build_hero()
    print("=== Writing docs ===")
    write_docs()
    print("=== ALL DONE ===")


if __name__ == "__main__":
    main()

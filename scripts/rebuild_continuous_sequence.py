#!/usr/bin/env python3
"""Rebuild scroll sequence: one exterior entry, no clip-2 aerial reset.

Verified issue: frame_075 is inside the living room; frame_076 matches
frame_001 (aerial exterior) because Wan clip 2 restarts from kf-01 exterior.
We keep clip 1 (frames 1–75) and join to clip 2 interior at frame 108.
Clip 3 (151+) stitches cleanly — no second reset.
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SEQ = ROOT / "public" / "scroll" / "sequence"
BACKUP = SEQ / "_original_210"
MANIFEST = SEQ / "manifest.json"

# Inclusive source frame ranges to publish (1-based frame numbers).
KEEP_RANGES: list[tuple[int, int]] = [(1, 75), (108, 210)]


def source_frames() -> list[int]:
    out: list[int] = []
    for start, end in KEEP_RANGES:
        out.extend(range(start, end + 1))
    return out


def rebuild() -> None:
    sources = source_frames()
    count = len(sources)
    print(f"Publishing {count} frames from source indices: {KEEP_RANGES}")

    tmp = SEQ / "_rebuild_tmp"
    if tmp.exists():
        shutil.rmtree(tmp)
    tmp.mkdir(parents=True)

    for i, src in enumerate(sources, start=1):
        src_path = SEQ / f"frame_{src:03d}.webp"
        if not src_path.exists() and BACKUP.exists():
            src_path = BACKUP / f"frame_{src:03d}.webp"
        if not src_path.exists():
            raise FileNotFoundError(src_path)
        shutil.copy2(src_path, tmp / f"frame_{i:03d}.webp")

    # Remove old numbered frames from sequence dir (not docs/backups).
    for old in SEQ.glob("frame_*.webp"):
        old.unlink()

    for f in sorted(tmp.glob("frame_*.webp")):
        shutil.move(str(f), str(SEQ / f.name))
    tmp.rmdir()

    frames = [f"/scroll/sequence/frame_{i:03d}.webp" for i in range(1, count + 1)]

    manifest = {
        "version": 3,
        "source": "wan3_0_trimmed_single_entry",
        "width": 1920,
        "height": 1080,
        "frameCount": count,
        "fps": 15,
        "durationSeconds": round(count / 15, 2),
        "pattern": "frame_{###}.webp",
        "trim": {
            "reason": "Clip 2 frames 76–107 duplicated the aerial exterior entry; removed.",
            "keptRanges": [{"from": a, "to": b} for a, b in KEEP_RANGES],
            "droppedRanges": [{"from": 76, "to": 107}],
            "originalFrameCount": 210,
        },
        "frames": frames,
        "captions": [
            {
                "at": 0.0,
                "text": "Blistering Florida Heat Outside? Stay 100% Cool Inside.",
                "frames": [1, max(1, round(count * 0.28))],
            },
            {
                "at": 0.25,
                "text": "Engineered for Southwest Florida Humidity & Comfort.",
                "frames": [max(1, round(count * 0.28)) + 1, max(1, round(count * 0.52))],
            },
            {
                "at": 0.55,
                "text": "Whisper-Quiet, Zoned Temperature Control in Every Room.",
                "frames": [max(1, round(count * 0.52)) + 1, max(1, round(count * 0.82))],
            },
            {
                "at": 0.85,
                "text": "Voted Best HVAC Contractor in Lee County.",
                "frames": [max(1, round(count * 0.82)) + 1, count],
            },
        ],
    }

    MANIFEST.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {MANIFEST} ({count} frames)")


if __name__ == "__main__":
    rebuild()

#!/usr/bin/env python3
"""
Gulf Breeze HVAC — cinematic scroll-scrub sequence generator
36 frames @ 1600×900, full-bleed, continuous camera language.
"""
from __future__ import annotations
import math
from pathlib import Path

W, H = 1600, 900
OUT_DIR = Path("/workspace/gulf-breeze-hvac/public/scroll/sequence")
SVG_DIR = OUT_DIR / "svg"
N_FRAMES = 36

NAVY = "#0a2a3a"
DEEP = "#0d3d4f"
TEAL = "#0e7490"
AQUA = "#14b8a6"
SKY = "#38bdf8"
FOAM = "#e0f7fa"
SAND = "#f8fafc"
CORAL = "#f97316"


def clamp(x: float, a: float = 0.0, b: float = 1.0) -> float:
    return max(a, min(b, x))


def lerp(a: float, b: float, t: float) -> float:
    return a + (b - a) * t


def smootherstep(t: float) -> float:
    t = clamp(t)
    return t * t * t * (t * (t * 6 - 15) + 10)


def beat_weight(frame: int, start: int, end: int) -> float:
    if frame <= start:
        return 0.0
    if frame >= end:
        return 1.0
    return smootherstep((frame - start) / (end - start))


def hex_to_rgb(h: str) -> tuple[int, int, int]:
    h = h.lstrip("#")
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def mix_hex(a: str, b: str, t: float) -> str:
    t = clamp(t)
    ar, ag, ab = hex_to_rgb(a)
    br, bg, bb = hex_to_rgb(b)
    return f"#{int(lerp(ar, br, t)):02x}{int(lerp(ag, bg, t)):02x}{int(lerp(ab, bb, t)):02x}"


def frame_params(i: int) -> dict:
    t = (i - 1) / (N_FRAMES - 1)

    # Beats (1-based overlapping)
    altitude = beat_weight(i, 1, 8)          # 0 high alt → 1 descended
    sky_to_home = beat_weight(i, 5, 11)
    orbit = beat_weight(i, 8, 15)
    to_xray = beat_weight(i, 14, 19)
    ducts_in = beat_weight(i, 14, 20)
    airflow = beat_weight(i, 21, 28)
    to_interior = beat_weight(i, 27, 33)
    dusk = beat_weight(i, 28, 36)

    # Camera: always scale >= 1 for full-bleed (zoom in only)
    # High alt uses compositional house_scale instead of cam_scale < 1
    cam_scale = lerp(1.0, 1.12, beat_weight(i, 8, 14))
    cam_scale = lerp(cam_scale, 1.22, beat_weight(i, 14, 22))
    cam_scale = lerp(cam_scale, 1.38, beat_weight(i, 27, 36))

    # Orbit pan
    o = beat_weight(i, 7, 15)
    orbit_sin = math.sin(o * math.pi)
    pan_x = orbit_sin * 90
    pan_y = math.sin(orbit_sin * 1.1) * 14
    # Early slight drift
    pan_x = lerp(25, pan_x, altitude)
    pan_y = lerp(-10, pan_y, altitude)
    if to_interior > 0:
        pan_x = lerp(pan_x, 0, to_interior)
        pan_y = lerp(pan_y, 10, to_interior)

    # House relative size: tiny at altitude → full at establish
    house_scale = lerp(0.12, 1.0, altitude)
    house_scale = lerp(house_scale, 1.05, beat_weight(i, 8, 14))

    # Layer ops
    aerial_op = clamp(1.0 - sky_to_home * 1.1)
    home_op = clamp(sky_to_home * 1.15) * (1.0 - to_interior * 0.95)
    ducts_op = ducts_in * (1.0 - to_interior * 0.88)
    glow_op = airflow * (1.0 - to_interior * 0.55)
    interior_op = to_interior
    exterior_fade = 1.0 - to_interior
    condenser_op = clamp(ducts_in * 1.15) * (1.0 - to_interior * 0.95)

    # Sky morph: deep gulf altitude → bright day → dusk
    if altitude < 1:
        sky_top = mix_hex("#041018", "#0c4a6e", altitude)
        sky_mid = mix_hex("#0a3040", "#38bdf8", altitude)
        sky_bot = mix_hex("#0d3d4f", "#e0f7fa", altitude)
    else:
        sky_top = mix_hex("#0c4a6e", "#1a2744", dusk)
        sky_mid = mix_hex("#38bdf8", mix_hex("#7c3aed", "#f97316", dusk * 0.5), dusk * 0.55)
        sky_bot = mix_hex("#e0f7fa", "#fbbf24", dusk * 0.45)

    sun_y = lerp(110, 480, dusk)
    sun_op = lerp(0.95, 0.6, dusk)
    sun_r = lerp(48, 72, dusk)

    house_fill_op = lerp(1.0, 0.16, to_xray)
    window_cool = clamp(airflow * 0.55 + to_interior * 0.85)
    glow_phase = clamp((i - 21) / 8.0) if i >= 21 else 0.0

    return dict(
        i=i, t=t, cam_scale=cam_scale, pan_x=pan_x, pan_y=pan_y,
        house_scale=house_scale, altitude=altitude, sky_to_home=sky_to_home,
        orbit=orbit, to_xray=to_xray, ducts_op=ducts_op, glow_op=glow_op,
        interior_op=interior_op, exterior_fade=exterior_fade,
        aerial_op=aerial_op, home_op=home_op, condenser_op=condenser_op,
        sky_top=sky_top, sky_mid=sky_mid, sky_bot=sky_bot,
        sun_y=sun_y, sun_op=sun_op, sun_r=sun_r, dusk=dusk,
        house_fill_op=house_fill_op, window_cool=window_cool,
        glow_phase=glow_phase, airflow=airflow, to_interior=to_interior,
    )


def palm(x, base_y, lean=1.0, height=320):
    """Angular modern palm silhouette."""
    # Trunk
    trunk = (
        f"M{x:.1f} {base_y:.1f} "
        f"L{x + 8*lean:.1f} {base_y - height:.1f} "
        f"L{x + 18*lean:.1f} {base_y - height + 8:.1f} "
        f"L{x + 10*lean:.1f} {base_y:.1f} Z"
    )
    ty = base_y - height
    tx = x + 10 * lean
    # Fronds as overlapping ellipses/paths
    fronds = []
    for angle, length, thick in [
        (-0.9, 90, 18), (-0.4, 100, 20), (0.1, 95, 18),
        (0.55, 88, 16), (-1.3, 70, 14), (0.95, 72, 14),
    ]:
        a = angle * lean
        ex = tx + math.cos(a) * length
        ey = ty + math.sin(a) * length * 0.55 + 20
        fronds.append(
            f'<path d="M{tx:.1f} {ty:.1f} Q{tx + math.cos(a)*length*0.45:.1f} '
            f'{ty - 30:.1f} {ex:.1f} {ey:.1f}" '
            f'fill="none" stroke="{NAVY}" stroke-width="{thick}" '
            f'stroke-linecap="round"/>'
        )
    return f'<g opacity="0.78"><path d="{trunk}" fill="{NAVY}"/>{"".join(fronds)}</g>'


def build_svg(p: dict) -> str:
    i = p["i"]
    uid = f"f{i:03d}"
    cx, cy = W / 2, H / 2
    s = p["cam_scale"]
    cam = (
        f'transform="translate({cx + p["pan_x"]:.2f},{cy + p["pan_y"]:.2f}) '
        f'scale({s:.4f}) translate({-cx:.2f},{-cy:.2f})"'
    )

    sun_core = mix_hex("#fde68a", "#fb923c", p["dusk"])
    sun_glow = mix_hex("#fde68a", "#f97316", p["dusk"] * 0.65)
    dash_off = -p["glow_phase"] * 420
    cloud_dx = lerp(0, -50, p["t"])

    duct_paths = [
        "M320 100 V220",
        "M140 220 H500",
        "M140 220 V400",
        "M320 220 V400",
        "M500 220 V400",
        "M500 220 H580 V480",
    ]

    # Particles
    particles = []
    for n, (px, py, pr) in enumerate([
        (300, 400, 4), (700, 360, 3), (850, 480, 5), (450, 500, 3),
        (600, 450, 4), (520, 380, 3), (380, 420, 2), (760, 410, 4),
        (200, 350, 3), (900, 390, 3),
    ]):
        ox = math.sin((i + n * 7) * 0.35) * 10
        oy = math.cos((i + n * 5) * 0.28) * 7
        op = 0.2 + 0.4 * p["airflow"] + 0.35 * p["interior_op"]
        if op > 0.08:
            particles.append(
                f'<circle cx="{px+ox:.1f}" cy="{py+oy:.1f}" r="{pr}" '
                f'fill="#67e8f9" opacity="{op:.3f}"/>'
            )

    parts = []
    parts.append(
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" '
        f'viewBox="0 0 {W} {H}" role="img" '
        f'aria-label="Gulf Breeze HVAC cinematic scroll frame {i:03d}">'
    )
    parts.append("<defs>")
    parts.append(
        f'<linearGradient id="{uid}sky" x1="0" y1="0" x2="0" y2="1">'
        f'<stop offset="0%" stop-color="{p["sky_top"]}"/>'
        f'<stop offset="42%" stop-color="{p["sky_mid"]}"/>'
        f'<stop offset="100%" stop-color="{p["sky_bot"]}"/>'
        f"</linearGradient>"
    )
    parts.append(
        f'<radialGradient id="{uid}sunglow" cx="78%" cy="{p["sun_y"]/H*100:.1f}%" r="30%">'
        f'<stop offset="0%" stop-color="{sun_glow}" stop-opacity="{p["sun_op"]*0.85:.3f}"/>'
        f'<stop offset="100%" stop-color="{sun_glow}" stop-opacity="0"/>'
        f"</radialGradient>"
    )
    parts.append(
        f'<linearGradient id="{uid}roof" x1="0" y1="0" x2="0" y2="1">'
        f'<stop offset="0%" stop-color="{NAVY}"/><stop offset="100%" stop-color="{DEEP}"/>'
        f"</linearGradient>"
    )
    parts.append(
        f'<linearGradient id="{uid}lawn" x1="0" y1="0" x2="0" y2="1">'
        f'<stop offset="0%" stop-color="#5eead4"/><stop offset="100%" stop-color="#0f766e"/>'
        f"</linearGradient>"
    )
    parts.append(
        f'<linearGradient id="{uid}water" x1="0" y1="0" x2="0" y2="1">'
        f'<stop offset="0%" stop-color="#22d3ee"/><stop offset="35%" stop-color="#0e7490"/>'
        f'<stop offset="100%" stop-color="#0a2a3a"/>'
        f"</linearGradient>"
    )
    parts.append(
        f'<linearGradient id="{uid}iwall" x1="0" y1="0" x2="0" y2="1">'
        f'<stop offset="0%" stop-color="{FOAM}"/><stop offset="100%" stop-color="{SAND}"/>'
        f"</linearGradient>"
    )
    parts.append(
        f'<radialGradient id="{uid}icool" cx="50%" cy="18%" r="55%">'
        f'<stop offset="0%" stop-color="#67e8f9" stop-opacity="0.42"/>'
        f'<stop offset="100%" stop-color="#67e8f9" stop-opacity="0"/>'
        f"</radialGradient>"
    )
    parts.append(
        f'<linearGradient id="{uid}unit" x1="0" y1="0" x2="0" y2="1">'
        f'<stop offset="0%" stop-color="#475569"/><stop offset="100%" stop-color="{NAVY}"/>'
        f"</linearGradient>"
    )
    parts.append(
        f'<filter id="{uid}glow" x="-40%" y="-40%" width="180%" height="180%">'
        f'<feGaussianBlur stdDeviation="5" result="b"/>'
        f'<feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>'
        f"</filter>"
    )
    parts.append(
        f'<radialGradient id="{uid}vig" cx="50%" cy="45%" r="72%">'
        f'<stop offset="48%" stop-color="{NAVY}" stop-opacity="0"/>'
        f'<stop offset="100%" stop-color="{NAVY}" stop-opacity="0.38"/>'
        f"</radialGradient>"
    )
    # Soft land haze
    parts.append(
        f'<linearGradient id="{uid}haze" x1="0" y1="0" x2="0" y2="1">'
        f'<stop offset="0%" stop-color="{FOAM}" stop-opacity="0"/>'
        f'<stop offset="100%" stop-color="{FOAM}" stop-opacity="0.25"/>'
        f"</linearGradient>"
    )
    parts.append("</defs>")

    # Full-bleed sky (outside camera so edges never show empty)
    parts.append(f'<rect width="{W}" height="{H}" fill="url(#{uid}sky)"/>')
    parts.append(f'<circle cx="1250" cy="{p["sun_y"]:.1f}" r="300" fill="url(#{uid}sunglow)"/>')
    parts.append(
        f'<circle cx="1250" cy="{p["sun_y"]:.1f}" r="{p["sun_r"]:.1f}" '
        f'fill="{sun_core}" opacity="{p["sun_op"]:.3f}"/>'
    )

    parts.append(f"<g {cam}>")

    # ========== AERIAL / GULF LAYER (full-bleed) ==========
    if p["aerial_op"] > 0.02:
        aop = p["aerial_op"]
        parts.append(f'<g opacity="{aop:.3f}">')
        # Deep gulf water filling lower 55%
        parts.append(
            f'<path d="M0 380 C250 360, 500 410, 800 385 C1100 360, 1350 400, 1600 370 '
            f'L1600 900 L0 900 Z" fill="url(#{uid}water)"/>'
        )
        # Wave bands
        for wi, (wy, opac) in enumerate([(420, 0.18), (460, 0.14), (510, 0.1), (560, 0.08)]):
            wy2 = wy + math.sin(i * 0.2 + wi) * 6
            parts.append(
                f'<path d="M0 {wy2:.0f} C200 {wy2-18:.0f}, 400 {wy2+22:.0f}, 800 {wy2:.0f} '
                f'C1200 {wy2-20:.0f}, 1400 {wy2+15:.0f}, 1600 {wy2:.0f}" '
                f'fill="none" stroke="#67e8f9" stroke-width="3" opacity="{opac:.3f}"/>'
            )
        # Coastline land ribbon
        parts.append(
            f'<path d="M0 520 C200 500, 450 545, 750 515 C1050 485, 1300 530, 1600 505 '
            f'L1600 900 L0 900 Z" fill="#0f766e" opacity="0.85"/>'
        )
        parts.append(
            f'<path d="M0 520 C200 500, 450 545, 750 515 C1050 485, 1300 530, 1600 505 '
            f'L1600 560 C1300 580, 1050 540, 750 565 C450 590, 200 555, 0 575 Z" '
            f'fill="#5eead4" opacity="0.35"/>'
        )
        # Barrier islands / keys
        for ix, iy, irx, iry in [
            (200, 480, 80, 12), (420, 470, 60, 10), (980, 455, 100, 14),
            (1200, 465, 70, 11), (1450, 450, 55, 9),
        ]:
            parts.append(
                f'<ellipse cx="{ix}" cy="{iy}" rx="{irx}" ry="{iry}" '
                f'fill="#99f6e4" opacity="0.45"/>'
            )
        # Tiny coastal settlement lights / roofs (high-alt dots)
        hop = clamp(1.0 - p["altitude"] * 0.3)
        for hx, hy in [
            (580, 555), (610, 560), (640, 552), (680, 558), (720, 550),
            (760, 556), (800, 548), (840, 555), (880, 550), (920, 560),
            (300, 570), (340, 565), (1100, 540), (1140, 545), (1180, 538),
        ]:
            parts.append(
                f'<rect x="{hx}" y="{hy}" width="10" height="7" rx="1" '
                f'fill="{SAND}" opacity="{0.75 * hop:.3f}"/>'
            )
        # Atmospheric haze layers for altitude
        for band in range(5):
            by = 140 + band * 55
            bop = (0.06 + band * 0.035) * (1.0 - p["altitude"] * 0.5)
            parts.append(
                f'<rect y="{by}" width="{W}" height="40" fill="{FOAM}" opacity="{bop:.3f}"/>'
            )
        parts.append("</g>")

    # Clouds always
    cloud_op = 0.22 + 0.18 * (1.0 - p["dusk"]) * p["altitude"]
    parts.append(f'<g fill="#fff" opacity="{cloud_op:.3f}">')
    parts.append(f'<ellipse cx="{200 + cloud_dx:.0f}" cy="140" rx="110" ry="32"/>')
    parts.append(f'<ellipse cx="{270 + cloud_dx:.0f}" cy="128" rx="70" ry="26"/>')
    parts.append(f'<ellipse cx="{540 + cloud_dx * 0.7:.0f}" cy="110" rx="95" ry="28"/>')
    parts.append(f'<ellipse cx="{1000 - cloud_dx * 0.5:.0f}" cy="155" rx="80" ry="24"/>')
    parts.append(f'<ellipse cx="{1300 - cloud_dx * 0.3:.0f}" cy="125" rx="60" ry="20"/>')
    parts.append("</g>")

    # ========== GROUND + HOME ==========
    # Ground fades in with home
    ground_op = clamp(p["home_op"] * 1.2) * p["exterior_fade"]
    if ground_op > 0.02:
        parts.append(f'<g opacity="{ground_op:.3f}">')
        parts.append(f'<rect y="600" width="{W}" height="300" fill="{SAND}"/>')
        parts.append(
            f'<path d="M0 600c220 40 480 60 780 38 240-18 400-10 560 28v234H0z" '
            f'fill="url(#{uid}lawn)"/>'
        )
        # Driveway
        parts.append(
            f'<path d="M820 640 L980 900 L1180 900 L920 640 Z" '
            f'fill="#e2e8f0" opacity="0.7"/>'
        )
        parts.append(f'<ellipse cx="280" cy="690" rx="80" ry="30" fill="{AQUA}" opacity="0.5"/>')
        parts.append(f'<ellipse cx="1220" cy="700" rx="100" ry="34" fill="{TEAL}" opacity="0.45"/>')
        parts.append("</g>")

    # Palms
    palm_op = ground_op * 0.95
    if palm_op > 0.02:
        parts.append(f'<g opacity="{palm_op:.3f}">')
        parts.append(palm(150, 660, 1.0, 340))
        parts.append(palm(1420, 650, -1.0, 300))
        parts.append("</g>")

    # House group with house_scale for altitude→establish
    hs = p["house_scale"]
    # Center house around 800, 480
    house_cx, house_cy = 800, 480
    # Local house built at origin then translated; scale about house center in local coords
    # Local house: body around x=40..600, roof tip at 320,10 → center ~320, 260
    lcx, lcy = 320, 270
    hx = house_cx - lcx * hs
    hy = house_cy - lcy * hs

    if p["home_op"] > 0.02 or (p["aerial_op"] > 0.3 and p["altitude"] > 0.25):
        # Show house even during late aerial as growing landmark
        hop = max(p["home_op"], clamp((p["altitude"] - 0.2) * 1.5) * p["aerial_op"] * 0.9)
        hop *= p["exterior_fade"] if p["exterior_fade"] > 0.05 else 0
        # During pure aerial early, still show tiny house
        if p["altitude"] < 0.5:
            hop = max(hop, p["altitude"] * 0.85 * p["exterior_fade"])

        if hop > 0.02:
            fill_op = p["house_fill_op"] if p["to_xray"] > 0.02 else 1.0
            # Blend fill with home establish
            fill_op *= clamp(0.3 + hop)
            fill_op = clamp(fill_op)
            if p["to_xray"] < 0.05:
                fill_op = clamp(hop * 1.2)

            wire = p["to_xray"]
            stroke_w = lerp(0, 3.2, wire) / max(hs, 0.2)
            stroke_col = mix_hex(TEAL, SKY, p["airflow"] * 0.45)
            win_fill = mix_hex("#bae6fd", "#67e8f9", p["window_cool"])

            parts.append(
                f'<g transform="translate({hx:.2f},{hy:.2f}) scale({hs:.4f})" '
                f'opacity="{hop:.3f}">'
            )
            # Shadow
            parts.append(
                f'<ellipse cx="320" cy="410" rx="340" ry="28" fill="{NAVY}" '
                f'opacity="{0.18 * fill_op:.3f}"/>'
            )
            # Body
            parts.append(
                f'<rect x="40" y="140" width="560" height="250" rx="8" '
                f'fill="{SAND}" fill-opacity="{fill_op:.3f}" '
                f'stroke="{stroke_col}" stroke-width="{max(stroke_w, 0.01):.2f}" '
                f'stroke-opacity="{wire:.3f}"/>'
            )
            parts.append(
                f'<path d="M10 150 L320 10 L630 150 Z" fill="url(#{uid}roof)" '
                f'fill-opacity="{fill_op:.3f}" stroke="{stroke_col}" '
                f'stroke-width="{max(stroke_w, 0.01):.2f}" stroke-opacity="{wire:.3f}"/>'
            )
            # Chimney
            parts.append(
                f'<rect x="480" y="50" width="28" height="55" fill="{DEEP}" '
                f'opacity="{fill_op:.3f}"/>'
            )
            for wx, ww in [(80, 100), (220, 100), (360, 100), (500, 70)]:
                parts.append(
                    f'<rect x="{wx}" y="200" width="{ww}" height="78" rx="4" '
                    f'fill="{win_fill}" fill-opacity="{max(fill_op, wire*0.45):.3f}" '
                    f'stroke="{TEAL}" stroke-width="3" '
                    f'stroke-opacity="{max(fill_op, wire):.3f}"/>'
                )
                # Window mullion
                parts.append(
                    f'<path d="M{wx + ww/2:.0f} 200 v78 M{wx} 239 h{ww}" '
                    f'stroke="{TEAL}" stroke-width="2" '
                    f'opacity="{0.5 * max(fill_op, wire):.3f}"/>'
                )
            parts.append(
                f'<rect x="270" y="300" width="80" height="90" rx="4" fill="{TEAL}" '
                f'fill-opacity="{fill_op:.3f}" stroke="{stroke_col}" '
                f'stroke-width="{max(stroke_w*0.7, 0.01):.2f}" stroke-opacity="{wire:.3f}"/>'
            )
            parts.append(
                f'<circle cx="332" cy="348" r="4" fill="{FOAM}" opacity="{fill_op:.3f}"/>'
            )
            parts.append(
                f'<rect x="250" y="390" width="120" height="12" fill="#cbd5e1" '
                f'opacity="{fill_op:.3f}"/>'
            )
            parts.append(
                f'<rect x="460" y="320" width="100" height="70" rx="4" fill="#e2e8f0" '
                f'fill-opacity="{fill_op:.3f}" stroke="{stroke_col}" '
                f'stroke-width="{max(stroke_w*0.6, 0.01):.2f}" stroke-opacity="{wire:.3f}"/>'
            )
            # Siding lines (detail)
            if fill_op > 0.4:
                parts.append(
                    f'<g stroke="#cbd5e1" stroke-width="1.5" opacity="{0.35 * fill_op:.3f}">'
                )
                for sy in range(160, 380, 22):
                    parts.append(f'<path d="M50 {sy} H590"/>')
                parts.append("</g>")

            # X-ray floor grid
            if wire > 0.08:
                parts.append(
                    f'<g stroke="{SKY}" stroke-width="2" fill="none" '
                    f'stroke-dasharray="8 6" stroke-opacity="{wire * 0.55:.3f}">'
                )
                parts.append('<path d="M40 260 H600"/>')
                parts.append('<path d="M40 320 H600"/>')
                parts.append('<path d="M320 150 V390"/>')
                parts.append('<path d="M180 150 V390"/><path d="M460 150 V390"/>')
                parts.append("</g>")

            # Ducts + AHU
            if p["ducts_op"] > 0.02:
                dop = p["ducts_op"]
                parts.append(f'<g opacity="{dop:.3f}">')
                parts.append(f'<rect x="270" y="55" width="100" height="55" rx="6" fill="{NAVY}"/>')
                parts.append(f'<rect x="280" y="65" width="80" height="22" rx="3" fill="{AQUA}"/>')
                parts.append(
                    '<g fill="none" stroke="#64748b" stroke-width="16" stroke-linecap="round">'
                )
                for dp in duct_paths:
                    parts.append(f'<path d="{dp}"/>')
                parts.append("</g>")
                parts.append(
                    '<g fill="none" stroke="#94a3b8" stroke-width="9" stroke-linecap="round">'
                )
                for dp in duct_paths:
                    parts.append(f'<path d="{dp}"/>')
                parts.append("</g>")
                for vx in (110, 290, 470):
                    parts.append(
                        f'<rect x="{vx}" y="395" width="60" height="14" rx="3" fill="{TEAL}"/>'
                    )
                parts.append("</g>")

            # Airflow glow
            if p["glow_op"] > 0.02:
                gop = p["glow_op"]
                parts.append(f'<g opacity="{gop:.3f}" filter="url(#{uid}glow)">')
                parts.append(
                    f'<g fill="none" stroke="{SKY}" stroke-width="5" stroke-linecap="round" '
                    f'stroke-dasharray="28 18" stroke-dashoffset="{dash_off:.1f}">'
                )
                for dp in duct_paths:
                    parts.append(f'<path d="{dp}" stroke-opacity="0.9"/>')
                parts.append("</g>")
                parts.append(
                    f'<g fill="none" stroke="{AQUA}" stroke-width="14" stroke-linecap="round" '
                    f'stroke-opacity="0.32" stroke-dasharray="42 22" '
                    f'stroke-dashoffset="{dash_off * 0.7:.1f}">'
                )
                for dp in duct_paths[:5]:
                    parts.append(f'<path d="{dp}"/>')
                parts.append("</g>")
                for vx in (140, 320, 500):
                    mist = 0.28 + 0.2 * math.sin(i * 0.45 + vx * 0.01)
                    parts.append(
                        f'<ellipse cx="{vx}" cy="430" rx="52" ry="18" fill="#67e8f9" '
                        f'opacity="{mist * gop:.3f}"/>'
                    )
                parts.append("</g>")

            # Condenser
            if p["condenser_op"] > 0.02:
                cop = p["condenser_op"]
                parts.append(f'<g transform="translate(620,310)" opacity="{cop:.3f}">')
                parts.append(
                    f'<rect x="0" y="0" width="95" height="125" rx="8" fill="url(#{uid}unit)"/>'
                )
                parts.append(f'<rect x="8" y="10" width="78" height="72" rx="4" fill="{NAVY}"/>')
                parts.append(
                    '<circle cx="47" cy="46" r="30" fill="none" stroke="#64748b" stroke-width="3"/>'
                )
                parts.append(f'<circle cx="47" cy="46" r="8" fill="{AQUA}"/>')
                parts.append(
                    f'<g stroke="{SKY}" stroke-width="2.2" opacity="0.75" fill="none">'
                    f'<path d="M47 22v14M47 56v14M22 46h14M58 46h14"/>'
                    f'<path d="M30 30l12 12M52 50l12 12M30 62l12-12M52 34l12-12"/>'
                    f"</g>"
                )
                parts.append('<rect x="12" y="92" width="70" height="10" rx="2" fill="#334155"/>')
                parts.append(f'<rect x="12" y="108" width="42" height="8" rx="2" fill="{TEAL}"/>')
                parts.append(
                    '<path d="M0 42 H-45 V-90" fill="none" stroke="#94a3b8" '
                    'stroke-width="5" stroke-linecap="round"/>'
                )
                if p["glow_op"] > 0.15:
                    parts.append(
                        f'<g fill="none" stroke-linecap="round" opacity="0.75">'
                        f'<path d="M100 40c32-8 55-5 75 10" stroke="#67e8f9" stroke-width="3"/>'
                        f'<path d="M100 62c30-6 52-4 70 12" stroke="{AQUA}" stroke-width="2.5"/>'
                        f"</g>"
                    )
                parts.append("</g>")

            parts.append("</g>")  # house

    # ========== INTERIOR ==========
    if p["interior_op"] > 0.02:
        iop = p["interior_op"]
        parts.append(f'<g opacity="{iop:.3f}">')
        parts.append(f'<rect width="{W}" height="{H}" fill="url(#{uid}iwall)"/>')
        parts.append(f'<rect width="{W}" height="{H}" fill="url(#{uid}icool)"/>')
        parts.append(f'<path d="M0 620 H{W} V{H} H0 Z" fill="#dbeafe"/>')
        parts.append(f'<path d="M0 620 H{W}" stroke="#93c5fd" stroke-width="3"/>')

        dusk_win = mix_hex("#7dd3fc", "#fb923c", p["dusk"] * 0.55)
        dusk_h = mix_hex("#14b8a6", "#f97316", p["dusk"] * 0.55)
        parts.append(
            f'<rect x="400" y="95" width="560" height="330" rx="8" fill="{dusk_win}" '
            f'stroke="{TEAL}" stroke-width="10"/>'
        )
        parts.append(f'<rect x="420" y="115" width="520" height="290" fill="{dusk_win}"/>')
        parts.append(
            f'<rect x="420" y="280" width="520" height="125" fill="{dusk_h}" opacity="0.42"/>'
        )
        if p["dusk"] > 0.15:
            parts.append(
                f'<rect x="420" y="115" width="520" height="90" fill="#fbbf24" '
                f'opacity="{0.22 * p["dusk"]:.3f}"/>'
            )
        parts.append(f'<ellipse cx="560" cy="300" rx="42" ry="62" fill="{NAVY}" opacity="0.28"/>')
        parts.append(f'<ellipse cx="760" cy="310" rx="52" ry="72" fill="{NAVY}" opacity="0.22"/>')
        parts.append(f'<rect x="400" y="95" width="50" height="330" fill="{FOAM}" opacity="0.93"/>')
        parts.append(f'<rect x="910" y="95" width="50" height="330" fill="{FOAM}" opacity="0.93"/>')

        # Sofa
        parts.append('<g transform="translate(280,500)">')
        parts.append(f'<rect x="40" y="40" width="560" height="130" rx="24" fill="{TEAL}"/>')
        parts.append(f'<rect x="60" y="18" width="210" height="75" rx="18" fill="{AQUA}"/>')
        parts.append(f'<rect x="320" y="18" width="210" height="75" rx="18" fill="{AQUA}"/>')
        parts.append(f'<rect x="20" y="50" width="40" height="110" rx="12" fill="{NAVY}"/>')
        parts.append(f'<rect x="580" y="50" width="40" height="110" rx="12" fill="{NAVY}"/>')
        parts.append(f'<rect x="80" y="55" width="70" height="50" rx="10" fill="{FOAM}"/>')
        parts.append(f'<rect x="450" y="55" width="70" height="50" rx="10" fill="{FOAM}"/>')
        parts.append("</g>")

        parts.append(f'<rect x="560" y="700" width="240" height="24" rx="6" fill="#64748b"/>')
        parts.append('<rect x="580" y="724" width="16" height="40" fill="#475569"/>')
        parts.append('<rect x="764" y="724" width="16" height="40" fill="#475569"/>')

        parts.append('<g transform="translate(1180,540)">')
        parts.append(f'<rect x="30" y="100" width="40" height="50" rx="6" fill="{TEAL}"/>')
        parts.append(f'<ellipse cx="50" cy="80" rx="36" ry="50" fill="{AQUA}"/>')
        parts.append('<ellipse cx="28" cy="90" rx="22" ry="36" fill="#0d9488"/>')
        parts.append('<ellipse cx="72" cy="90" rx="22" ry="36" fill="#2dd4bf"/>')
        parts.append("</g>")

        # Vent + cool streams
        parts.append(f'<rect x="180" y="130" width="130" height="28" rx="4" fill="#334155"/>')
        parts.append('<g fill="none" stroke-linecap="round" opacity="0.88">')
        phase = i * 0.18
        for k, (sx, col) in enumerate([(200, "#67e8f9"), (245, SKY), (290, AQUA)]):
            wob = math.sin(phase + k) * 10
            parts.append(
                f'<path d="M{sx} 180c{10+wob:.1f} 55 {10+wob:.1f} 110 0 165" '
                f'stroke="{col}" stroke-width="3.2"/>'
            )
        parts.append("</g>")

        # Subtle thermostat ring (no 72° text)
        parts.append('<g transform="translate(1220,150)">')
        parts.append(f'<rect width="100" height="90" rx="14" fill="{NAVY}"/>')
        parts.append(f'<rect x="8" y="8" width="84" height="74" rx="10" fill="{DEEP}"/>')
        parts.append(
            f'<circle cx="50" cy="45" r="24" fill="none" stroke="{AQUA}" stroke-width="3"/>'
        )
        parts.append(f'<circle cx="50" cy="45" r="5" fill="{FOAM}"/>')
        parts.append("</g>")
        parts.append("</g>")

    if particles:
        parts.append("<g>" + "".join(particles) + "</g>")

    parts.append("</g>")  # camera
    parts.append(f'<rect width="{W}" height="{H}" fill="url(#{uid}vig)" pointer-events="none"/>')
    parts.append("</svg>")
    return "\n".join(parts)


def main():
    SVG_DIR.mkdir(parents=True, exist_ok=True)
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Generating {N_FRAMES} SVG frames @ {W}x{H}...")
    for i in range(1, N_FRAMES + 1):
        p = frame_params(i)
        (SVG_DIR / f"frame_{i:03d}.svg").write_text(build_svg(p), encoding="utf-8")
        if i in (1, 7, 11, 18, 25, 36):
            print(
                f"  {i:03d}: cam={p['cam_scale']:.3f} hs={p['house_scale']:.3f} "
                f"alt={p['altitude']:.2f} aerial={p['aerial_op']:.2f} home={p['home_op']:.2f} "
                f"xray={p['to_xray']:.2f} ducts={p['ducts_op']:.2f} glow={p['glow_op']:.2f} "
                f"int={p['interior_op']:.2f}"
            )
    print("SVGs written.")


if __name__ == "__main__":
    main()

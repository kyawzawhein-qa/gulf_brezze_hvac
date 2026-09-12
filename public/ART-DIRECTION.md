# Gulf Breeze HVAC — Art direction (one-pager)

Fictional Lee County / Fort Myers–Cape Coral HVAC demo site. Assets live under `/public` for Next.js static serving.

## Mood & keywords

coastal Southwest Florida · trustworthy local HVAC · calm breeze · cool relief · premium but approachable · soft afternoon gulf light · **not** kitschy beach clipart · subtle Demo context

## Palette (locked hex)

| Token | Hex | Role |
|-------|-----|------|
| gb-navy | `#0a2a3a` | Text on light; dark fills |
| gb-deep | `#0d3d4f` | Navy gradient partner |
| gb-teal | `#0e7490` | Secondary brand / icons |
| gb-aqua | `#14b8a6` | Accent / focus |
| gb-sky | `#38bdf8` | Soft sky accents |
| gb-foam | `#e0f7fa` | Soft tint wells |
| gb-sand | `#f8fafc` | Page background |
| gb-coral | `#f97316` | Primary CTA |
| gb-coral-dark | `#ea580c` | CTA gradient end |
| gb-slate / muted | `#334155` / `#64748b` | Secondary text |
| white | `#ffffff` | Cards / text on navy |

## Do / Don't

**Do**
- Navy text on sand/foam; white on navy/deep
- Coral pill CTAs (`.btn-primary` gradient) on navy sections
- Teal secondary borders / icon wells on sand
- Prefer SVG for logos & UI icons; WebP (+ PNG fallback) for hero/scroll frames
- Leave left ~40% of hero clear for headline overlay

**Don't**
- Palm-tree party clipart, neon sunset gradients, stock Midjourney mush
- Coral as large paragraph backgrounds
- Sky `#38bdf8` as sole small-body text on white
- Imply a real licensed contractor

## Contrast notes

- Body: navy on sand/white (strong)
- Nav/footer: white on navy
- CTA: white label on coral gradient; place over navy or deep for pop
- Focus ring: aqua `#14b8a6` on any surface

## How to use in Next.js

```tsx
// Static from /public
<img src="/hero/hero-coastal.webp" alt="" />
// or next/image
import Image from "next/image";
<Image src="/hero/hero-coastal.webp" alt="Coastal Florida home" width={1600} height={900} priority />
```

SVGs: `<img src="/brand/logo-wordmark-white.svg" alt="Gulf Breeze HVAC" />` or inline for `currentColor` icons.

## Suggested file mapping

| Surface | Asset |
|---------|--------|
| **Header** | `/brand/logo-wordmark-white.svg` (navy bar) or `/brand/logo-wordmark.svg` on light |
| **Hero** | `/hero/hero-coastal.webp` (+ `.png`); decorative `/hero/hero-coastal.svg` |
| **Scrollytelling** | `/scroll/frame-0{1–4}-*.webp` sequence; reduced-motion: `/scroll/scroll-home.svg`, `scroll-ducts.svg`, `scroll-cool.svg` or `/scroll/frame-story.svg` |
| **Services** | `/ui/icon-emergency.svg`, `icon-replacement.svg`, `icon-tuneup.svg`, `icon-iaq.svg` (`currentColor`) |
| **ChatWidget** | `/ui/chat-avatar.svg` (or `.webp`/`.png`) |
| **FinalCTA** | `/ui/pattern-cta.svg` as CSS `background-image`; optional `/ui/demo-badge.svg` |
| **DemoBadge** | `/ui/demo-badge.svg` |

## Scrollytelling art notes

1. Exterior — warm day, home + palms (caption in code)
2. Condenser — professional outdoor unit + cool wisps
3. Cutaway — diagram-illustration hybrid; airflow arrows
4. Comfort — interior cool light; thermostat art suggests **72°** (implement temp copy in React, not baked into all frames)

## Generation note

Raster frames were authored as brand-matched SVG illustrations and exported to PNG/WebP (GenerateImage MCP unavailable in this environment). Style is flat-to-soft marketing illustration aligned to teal/navy/foam. Swap with richer AI art later if desired — keep left hero clear space and no text/watermarks/logos in rasters.

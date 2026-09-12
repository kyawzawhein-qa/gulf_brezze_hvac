# Gulf Breeze HVAC — Sample / Demo Site

Polished **Next.js** demo website for an HVAC contractor sales pitch targeting **Lee County, Florida** (Fort Myers, Cape Coral, Bonita Springs, Lehigh Acres, Estero).

> This is a **sample / demo** experience — not a live business. A persistent “Sample / Demo Site” badge appears on every page.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Production build:

```bash
npm run build
npm start
```

## Tech stack

- Next.js App Router + TypeScript
- Tailwind CSS v4
- GSAP ScrollTrigger (cinematic scrollytelling)
- Client-side mocked AI chat dispatcher (no external APIs)

## What’s on the page

1. **Hero** — 24/7 emergency AC headline, sticky header with phone CTA, Book / Chat actions  
2. **Scrollytelling** — Scroll-pinned SVG story: coastal home → HVAC cutaway → cool comfort  
3. **Services** — Emergency repair, replacement, tune-ups, IAQ + service-area cities  
4. **How it works** — AI dispatcher → book slot → tech SMS (demo narrative)  
5. **Trust** — Plausible local reviews + response-time stats  
6. **Final CTA** — Book / chat / call  
7. **Floating chat widget** — Guided booking demo

## What is mocked

| Feature | Reality in this repo |
|--------|----------------------|
| AI dispatcher chat | Fully client-side flow (zip → issue → contact → slots → confirm). **No OpenAI.** |
| Appointment booking | Fake same-day / next-day slots. **No Cal.com.** |
| Tech SMS alert | Narrative confirmation only. **No Twilio.** |
| Phone number | Demo number `(239) 555-0147` — not a live line |
| Reviews & stats | Plausible marketing copy for pitches — not live review APIs |
| Automations | **No n8n / Airtable** |

Valid demo ZIPs include common Lee County codes such as `33901`, `33904`, `33914`, `33916`, and others listed in the chat widget.

## Accessibility notes

- Chat dialog uses `role="dialog"`, labelled title, focus on open, and `aria-live` for messages  
- Focus-visible rings on interactive controls  
- `prefers-reduced-motion`: scroll-pin animation falls back to a static final scene; CSS motion animations are reduced

## Project structure

```
src/
  app/           # layout, page, globals.css
  components/    # Header, Hero, Scrollytelling, Services, HowItWorks,
                 # Trust, FinalCTA, Footer, ChatWidget, DemoBadge
```



## Admin CMS (`/admin`)

WordPress-like **field editor** (not Gutenberg) backed by **SQLite + Prisma**. Public pages read content from the database via `getSiteContent()`.

### Setup

```bash
cp .env.example .env   # if needed
npm install            # runs prisma generate via postinstall
npm run db:setup       # generate + db push + seed from current site copy
npm run dev
```

### Login

- URL: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- Default password: `gulfbreeze` (env `ADMIN_PASSWORD`)
- Change it by setting `ADMIN_PASSWORD` in `.env` and restarting the server

### What you can edit

| Area | Fields |
|------|--------|
| Settings | Brand, tagline, phone, cities, demo badge, footer, logos, hero/final CTA copy |
| Story | Scrollytelling captions (`at` + text) — also syncs `manifest.json` |
| Services | Service cards + how-it-works steps |
| Trust | Reviews, hero/trust stats |
| Chat | Welcome text, valid ZIPs, issues, slots |
| Media | Uploads to `public/uploads/`, assign paths, replace scroll frames |
| Design | Brand hex tokens → `public/brand/runtime-theme.json` + CSS vars |

All `/admin/*` routes except login are cookie-session protected.

### Scripts

- `npm run db:push` — apply schema
- `npm run db:seed` — seed defaults (idempotent upserts / create-if-empty for lists)
- `npm run build` — `prisma generate && next build`

## License

Sample / demo assets for pitch use. Not affiliated with a real Gulf Breeze HVAC company.

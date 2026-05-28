# Unfolding

*Your story, gradually.*

A calm daily journalling PWA — morning intentions, evening reflections, a parking lot for your thoughts, and a grounded space to settle. Everything stays on your device.

**Live:** https://unfolding-yourstory.vercel.app

---

## What it does

Unfolding gives you a lightweight daily ritual loop. Not a meditation app, not a productivity tool — a private space to start and end each day with intention.

### Home — Morning ritual
- A daily quote and a small **Spark** task (a tiny act of care, curiosity, or creativity)
- **North Star** — one guiding phrase that stays visible all day
- **Three Intentions** — the things that matter most today, with tick-off
- **Tomorrow's one thing** — carried over from the evening before

### Space — Clear your head
- **Parking Lot** — dump any thought, worry, or idea so it stops circling your head; tag it, revisit it, or release it
- **Negativity Release** — burn or float away something you're ready to let go of
- **Kind Words Jar** — collect small wins and kind words to read on hard days
- **The Room** — a quiet visual space to sit in for a moment

### Settle — Calm down
- **Box Breathing** — a guided 4-4-4-4 breathing exercise
- **Colour Fill** — paint without purpose; just fill shapes with colour

### Evening Ritual — Reflect on today
- Three reflection prompts: something learnt, something to be grateful for, something that made you smile
- On Sundays: a warm-thought prompt (someone who came to mind this week) and a weekly summary
- Spark check-in — mark your spark done or skipped if you haven't already
- **Tomorrow's one thing** — leave yourself something to wake up to

### Let's Figure It Out — AI thinking partner
- Six structured modes: **Untangle**, **Decide**, **Unstuck**, **Vent and Solve**, **Reframe**, **Prepare**
- Launch from a parking lot item or start fresh — context is passed automatically
- Ends sessions with a **Clarity Card** saved to your history
- Powered by Groq (Llama 3.3 70B) — fast and free-tier friendly

### Me — Your profile and history
- Set your name, age, and accent colour
- Browse past reflection entries, intentions, spark log, and clarity cards
- Manage notification reminders (morning and evening)
- Export or clear all data

---

## Privacy

All journal data lives in IndexedDB on your device. Nothing is synced to a server. The only network call is the AI chat (`/api/chat`) — no message history is stored server-side.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | React 19 + Vite |
| Styling | Tailwind CSS v4 + CSS custom properties |
| Font | Plus Jakarta Sans |
| Local DB | Dexie.js v4 (IndexedDB) |
| Routing | React Router v7 |
| Icons | lucide-react |
| PWA | vite-plugin-pwa + Workbox |
| AI | Groq API — Llama 3.3 70B Versatile |
| Hosting | Vercel (with SPA rewrite rules) |

---

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm run build    # production build
npm run preview  # preview the build locally
```

### AI feature (optional)

The Let's Figure It Out screen calls a Vercel serverless function at `/api/chat`.

1. Get a free API key at [console.groq.com](https://console.groq.com)
2. Add `GROQ_API_KEY` to Vercel → Settings → Environment Variables
3. In local dev, create `.env.local`:
   ```
   GROQ_API_KEY=gsk_...
   ```

The feature degrades gracefully — screens load fine without the key; the AI call just returns an error.

---

## Project structure

```
api/
  chat.js               # Vercel serverless function — Groq proxy

public/
  icons/                # PWA icons (192, 512)
  offline.html          # Offline fallback page

src/
  components/           # Shared UI
    BottomNav.jsx
    DoneCharacter.jsx
    ErrorBoundary.jsx
    GroundingOverlay.jsx
    IOSInstallSheet.jsx
    InstallBanner.jsx
    PauseButton.jsx
    PrivacyNudge.jsx
    ScrollToTop.jsx

  data/                 # Static content
    cartoons.jsx        # Week summary cartoon data
    quotes.js           # Daily quote pool
    sparks.js           # Spark task pool

  db/
    db.js               # Dexie schema (all tables)

  home/                 # Home screen sub-components
    EveningPromptCard.jsx
    GreetingHeader.jsx
    NorthStarLine.jsx
    QuoteCard.jsx
    SparkCard.jsx
    ThreeThingsCard.jsx
    TomorrowCard.jsx
    WeekCartoonCard.jsx

  hooks/
    useInstallPrompt.js
    useTheme.js

  onboarding/           # 6-screen onboarding flow

  screens/              # Top-level screen components
    HomeScreen.jsx
    EveningRitualScreen.jsx
    FigureItOutScreen.jsx
    MeScreen.jsx
    SettleScreen.jsx
    SpaceScreen.jsx

  settle/               # Settle screen sub-components
    BoxBreathing.jsx
    ColourFill.jsx

  space/                # Space screen sub-components
    ClarityCard.jsx
    JarSVG.jsx
    KindWordsJar.jsx
    NegativityRelease.jsx
    ParkingLot.jsx
    ResolvedSection.jsx
    TheRoom.jsx

  utils/
    date.js             # Date helpers (getTodayDate, getWeekStart, etc.)
    notifications.js    # Web Push permission + scheduling helpers
    pwa.js              # Install prompt helpers
    sparkAlgorithm.js   # Weighted daily spark selection

  App.jsx               # Router + app shell
  index.css             # All CSS variables, themes, and component styles
  main.jsx
  sw.js                 # Workbox service worker
```

---

## Themes

Unfolding ships with two visual themes — **Minimal** (default) and **Playful** — plus six **accent colour** presets (Slate, Sage, Dusk, Clay, Stone, Rose).

Themes are driven by CSS custom properties on `:root` (Minimal) and `[data-theme="playful"]`. An inline script in `index.html` reads `localStorage` before React mounts to avoid a flash of the wrong theme.

---

## Day-change behaviour

On first open each day, `HomeScreen` runs an archival step:

1. **Intentions** — yesterday's `daily_intentions` row is written to `intentions_history` and the live row is cleared
2. **Spark log** — any spark still marked `pending` from a previous day is finalised as `skipped`

The Me screen history only shows entries from previous days (filtered `date < today`) so today's work-in-progress is never shown prematurely.

---

## Status

Core feature set complete. Live at [unfolding-yourstory.vercel.app](https://unfolding-yourstory.vercel.app).

# Unfolding — Claude Context

Live app: https://unfolding-yourstory.vercel.app
GitHub: https://github.com/Shalini1990/Unfolding

## What this is
A local-first daily wellness PWA. No backend database — all journal data lives in IndexedDB (Dexie.js) on the user's device. The only network calls are the Groq AI endpoints (`/api/chat`, `/api/daily`) and PostHog analytics.

## Deploy workflow
```bash
npm run deploy
# The alias step fails automatically — always run this after:
npx vercel alias set <new-deployment-url> unfolding-yourstory.vercel.app
```
The alias must be set manually every deploy or the live URL stays on the old version.

## Tech stack
- React 19 + Vite
- Tailwind CSS v4 + CSS custom properties for theming
- Dexie.js v4 (IndexedDB, 16 tables)
- React Router v7
- lucide-react icons
- vite-plugin-pwa + Workbox (PWA, service worker)
- Groq API — Llama 3.3 70B (AI features)
- PostHog (analytics, `phc_mq5GFsjmVZ8ssANMZZservSEgh5CntvLfe2BiYUje37h`)
- @vercel/analytics
- Vercel hosting + serverless functions in `/api/`

## Environment variables (Vercel)
- `GROQ_API_KEY` — powers `/api/chat` (Let's Figure It Out) and `/api/daily` (quotes + sparks)

## Theme system
Two themes: **Minimal** (Nunito everywhere) and **Playful** (Nunito body, Caveat headings).
Driven by CSS custom properties on `:root` (Minimal) and `[data-theme="playful"]`.
- `--font-sans`, `--font-heading`
- `--fs-title` (26px / 34px), `--fs-heading` (17px / 23px), `--fs-body` (15px), `--fs-small` (13px), `--fs-label` (11px), `--fs-micro` (10px)

Six accent colour presets: Slate, Sage, Dusk, Clay, Stone, Rose.
Theme + accent stored in `localStorage`. An inline script in `index.html` applies it before React mounts (no flash).

## Key files
| File | Purpose |
|---|---|
| `src/index.css` | All CSS variables, themes, type scale, every component's styles |
| `src/db/db.js` | Dexie schema — 16 tables |
| `src/App.jsx` | Routes, onboarding gate, PostHog route tracking |
| `src/main.jsx` | PostHog init, SW update toast, Vercel Analytics |
| `src/sw.js` | Service worker — skipWaiting removed so update banner works |
| `src/screens/HomeScreen.jsx` | Main daily loop, loads quote+spark (AI then static fallback) |
| `src/screens/MeScreen.jsx` | Profile, collapsible sections, history, export/clear |
| `src/utils/date.js` | getTodayDate (local time, NOT UTC), getGreeting, formatDisplayDate |
| `api/chat.js` | Groq proxy for Let's Figure It Out AI chat |
| `api/daily.js` | Groq endpoint — generates daily quote + spark, called once per day |

## Screens and routes
| Route | Screen |
|---|---|
| `/` | Onboarding (new users only) |
| `/home` | Home — morning ritual, My One Thing, quote, spark, three intentions |
| `/space` | Space — Parking Lot, Let It Out (The Room), Kind Words Jar |
| `/settle` | Settle — Box Breathing (iOS audio unlock), Colour Fill |
| `/me` | Me — profile, history, settings |
| `/evening` | Evening Ritual — reflection prompts, spark check-in, tomorrow's intention |
| `/figure-it-out` | Let's Figure It Out — AI thinking partner, 6 modes, clarity cards |

## Important decisions and known quirks

**CSS cascade order matters** — media queries in `index.css` must come AFTER base rules or they get overridden. This has caused bugs before (e.g. sound button visible on mobile).

**`getTodayDate()` uses local time** — was UTC before, caused date to show previous day for CET users between 11 PM–midnight. Now uses `getFullYear/getMonth/getDate`.

**iOS audio unlock** — `BoxBreathing.jsx` uses a fully synchronous `handleChimeToggle` (no async/await). iOS WebAudio requires the AudioContext to be created/resumed in a synchronous user gesture handler. Any async breaks the gesture trust chain.

**Spark log query** — `completion_status` is not indexed in Dexie, so use `.toArray().then(all => all.filter(...))` not `.where('completion_status').equals(...)`.

**AI-generated daily content** — `HomeScreen` calls `/api/daily` on first load of each new day. Response is cached in IndexedDB (`quote_data` table + `spark_log`). Static pools in `src/data/quotes.js` and `src/data/sparks.js` are used as fallback if Groq is unavailable.

**PWA update banner** — `skipWaiting()` was removed from `sw.js` so the new SW enters the waiting state and the `SWUpdateToast` in `main.jsx` can show the "Update available" banner. The SW only activates when the user taps Refresh.

**Evening card timing** — `isEvening` in HomeScreen is state updated every 60 seconds so the evening card appears at 5 PM even if the app was already open. Before this fix it was computed once on mount.

**Tomorrow's intention expiry** — cleared if the day it was set for has already passed (checked on load).

**Vercel alias bug** — the `deploy` script's `jq` command to extract the URL returns null. Always run the alias command manually after deploy.

## "My One Thing" (formerly North Star)
The user's daily anchor — a goal, reminder, or identity statement they want to carry every day. Set during onboarding and editable in Me screen. Shown prominently on the Home screen above the daily quote. Based on ACT framework + identity-based habits research.

## Three Things
The three daily intentions. Tickable and inline-editable (pencil icon in card header). Two acknowledgement messages: "One down — you're moving" / "Almost there" / "All three. That's a real day."

# Unfolding — Product & Technical Specification
### v2.0 · Ready for build
*Your story, gradually.*

---

## Table of Contents
1. [Objective](#1-objective)
2. [Scope](#2-scope)
3. [Feature List](#3-feature-list)
4. [Feature Details](#4-feature-details)
5. [Theme System](#5-theme-system)
6. [Navigation Structure](#6-navigation-structure)
7. [Data Model](#7-data-model)
8. [Onboarding Flow](#8-onboarding-flow)
9. [Notification Schedule](#9-notification-schedule)
10. [Technical Specification](#10-technical-specification)
11. [Later Versions](#11-later-versions)
12. [Dependencies](#12-dependencies)
13. [Metrics](#13-metrics)

---

## 1. Objective

Unfolding is a daily positivity PWA that helps users build a positive outlook through structured morning and evening rituals, intentional thought management, and AI-powered self-reflection — all within a private, pressure-free environment.

### The problem it solves
Existing apps either go deep on meditation (Calm, Headspace) or productivity (Todoist, Notion) but none offer a cohesive, lightweight daily ritual loop that is warm, joyful, and genuinely private. Unfolding fills that gap.

### Goals
- Help users develop a consistent positive outlook through small daily acts
- Give users a safe, private container for thoughts, worries, and reflections
- Deliver genuine dopamine and meaning without addiction mechanics
- Validate the concept with friends and family before investing in a native app

### Non-goals for this version
- Not a therapy or clinical mental health tool
- Not a social or community platform
- Not a productivity or task management tool

---

## 2. Scope

**Build approach:** PWA built with React + Vite, hosted on Vercel. Zero cost to deploy. Shared via link. Installable on iOS and Android home screens.

### In scope — MVP
- All 13 MVP features listed in section 3
- iOS and Android PWA installation support
- Local-first storage — all data stays on the user's device
- Claude API integration for AI features
- Web push notifications for morning and evening rituals
- Device-level lock via Web Authentication API
- Plain-English privacy page
- PWA install prompt and onboarding guide
- Theme selection at onboarding — Minimal and Playful
- Theme switching in settings — instant, no restart
- Privacy onboarding screen
- Your privacy page in settings
- Manual data export

### Not in scope — MVP
- Native iOS or Android app
- App Store or Google Play distribution
- User accounts, login, or cloud sync — not needed as all data is local to the device
- Social features, sharing, or community
- Monetisation or payments
- Offline AI (Let's Figure It Out requires internet)
- Admin dashboard or analytics backend

---

## 3. Feature List

### Morning
| # | Feature | One-liner | Phase |
|---|---|---|---|
| F01 | Positivity quote | AI-generated daily quote — thumbs down blocks forever, thumbs up adds to monthly Favourites pool, offline fallback library | MVP |
| F02 | 3 things to accomplish | Three freeform intentions — home screen card, tickable all day, positive micro-acknowledgement per tick | MVP |
| F03 | Today's Spark | Adaptive daily micro-task — learns difficulty tolerance and type affinity, day-of-week aware, 120-task library with AI supplementation | MVP |

### Evening
| # | Feature | One-liner | Phase |
|---|---|---|---|
| F04 | Reflection journal | Three evening prompts on one screen — freeform, optional individually, Sunday adds warm thought prompt as a fourth | MVP |
| F05 | Tomorrow's one thing | One optional freeform evening input — shown on morning screen next day, clears at midnight | MVP |

### Sunday
| # | Feature | One-liner | Phase |
|---|---|---|---|
| F06 | Warm thought prompt | Sunday-only fourth prompt appended to F04 reflection journal — not a standalone feature | MVP |

### Always on
| # | Feature | One-liner | Phase |
|---|---|---|---|
| F07 | Parking Lot | Frictionless thought dump with 6 emotion tags — one-at-a-time revisit ritual, resolve/journal/figure-it-out/snooze/burn actions | MVP |
| F08 | Let's figure it out | Socratic AI thinking partner — 6 modes, type-first hybrid entry, 3-5 questions max, clarity card output, Parking Lot integration | MVP |
| F09 | Kind Words Jar | Freeform private collection of kind words — no categories, hard day prompt surfaces 3 random entries | MVP |
| F10 | North Star | One onboarding sentence answering what matters most — shown on morning screen, passed to AI features as context | MVP |
| F11 | Negativity release | Completely unstructured blank space — no AI ever, keep to private archive or burn with flame animation | MVP |
| F12 | Pause button | 30-second 3-2-1 grounding sequence — persistent nav icon, fully automatic, zero data footprint | MVP |

### Trust & Privacy
| # | Feature | One-liner | Phase |
|---|---|---|---|
| F13 | Privacy onboarding screen | One calm screen before first use — explains local storage, site data warning, and export | MVP |
| F14 | Contextual privacy nudges | One-time tooltip on first use of each private feature confirming data stays on device | MVP |
| F15 | Your privacy page | Plain-English settings page — where data lives, site data warning, export button, delete all | MVP |
| F16 | Manual data export | One-tap download of all entries as a readable dated file — always accessible from settings | MVP |

### Personalisation
| # | Feature | One-liner | Phase |
|---|---|---|---|
| F17 | Theme selection — onboarding | User picks Minimal or Playful at first launch | MVP |
| F18 | Theme selection — settings | Always changeable under App feel in settings | MVP |
| F19 | Minimal theme | White base, 6 accent presets, Plus Jakarta Sans tight, line icons, geometric week fill, outline jar | MVP |
| F20 | Playful theme | Warm palette, Open Peeps illustrations, bouncy animations, full cartoon, character jar fill | MVP |

### Delight & Engagement
| # | Feature | One-liner | Phase |
|---|---|---|---|
| F21 | Week Cartoon | Auto-colours on app open daily — 7-partition cartoon revealed Sunday, sticker book in profile, 12 cartoons for MVP | MVP |
| F22 | Settle — breathing | Box breathing 4-4-4-4 with expanding shape — fully passive, open-ended, optional chime, zero data footprint | MVP |
| F23 | Settle — tile matching | Bilateral distraction mode for acute emotional overwhelm | V2 |
| F24 | Settle — colour fill | Meditative free-fill canvas for gentle, slow emotional regulation | V2 |
| F25 | Sticker book | Completed week cartoons collected into a browsable archive | V2 |
| F26 | Identity story | Monthly AI narrative of growth surfaced from reflections and sparks | V2 |
| F27 | Mood-adaptive quote | Morning quote tone shifts based on how the user is feeling that day | V2 |
| F28 | Body check-in | Gentle proactive nudge to notice physical state linked to emotional mood | V2 |
| F29 | Settle — bilateral tap | Left-right alternating tap pattern based on EMDR bilateral stimulation | V2 |

---

## 4. Feature Details

### F01 — Positivity Quote

**Overview:** An AI-generated daily quote shown each morning, personalised over time through user feedback.

**Generation:**
- Generated fresh each morning via Claude API
- Prompt context: user's North Star, day of week, blocked themes, theme preference
- Offline fallback: local library of 30 hand-curated quotes
- Quote length: 1–3 sentences maximum
- No author attribution required

**Thumbs mechanic:**
- Thumbs up — saved to Favourites pool, eligible to repeat at most once every 30 days
- Thumbs down — blocked permanently, theme pattern extracted to blocked themes list
- No interaction — shown once, never repeated, not blocked
- Unthumbing allowed — tapping the active thumb reverses the action
- Last action wins if user toggles

**Thumbs visibility:**
- Days 1–7: always visible with labels — "like" and "not for me"
- Day 8 onwards: hidden by default, revealed on tap of quote card
- One-time nudge on day 8: "tap any quote to like or dismiss it"

**Favourites pool:**
- Accessible by tapping the quote card — scrollable Favourites list
- App surfaces one favourite per month maximum — only if pool has 3+ quotes
- If all favourites shown in last 30 days, skip the repeat that month

**Edge cases:**
- User blocks everything: widen prompt rather than narrow further
- API down: show fallback library
- New user: broad positive prompt, no personalisation yet

**Data stored locally:**
- `blocked_themes`: array of extracted theme patterns
- `favourites`: array of thumbs-up quote objects with text and date
- `shown_quotes`: array of quote hashes
- `onboarding_day`: integer tracking days since install
- `last_favourite_shown`: date of last favourite surfaced

---

### F02 — 3 Things to Accomplish

**Overview:** Three freeform daily intentions set each morning, displayed as a persistent card on the home screen. Tickable throughout the day.

**Home screen placement:**
- Lives as a card on the main home screen — always visible
- Minimal theme: clean typographic card with accent colour checkboxes
- Playful theme: warm card with small illustrated character that reacts to ticks

**Setting intentions:**
- Set during the morning ritual — three freeform text inputs, no character limit
- No categories, no AI involvement, no suggestions
- If morning ritual skipped: "Still time to set your intentions for today"
- All three fields optional — user can set 1, 2, or 3

**Tick mechanic and micro-acknowledgements:**
- First tick: "One down — you're moving"
- Second tick: "Halfway there"
- Third tick: "All three. That's a real day." — slightly larger celebration, brief confetti in Playful
- Unticking allowed — no acknowledgement shown on untick

**Partial and zero completion:**
- 1 of 3 done: "You got one done today. That counts."
- 2 of 3 done: "Two out of three — more than enough."
- 0 of 3 done: "Today was its own thing. Tomorrow is a fresh start."
- 3 of 3 done: No message — the ticks speak for themselves

**Evening reflection integration:**
- Evening screen shows summary: "Here's what you set out to do today"
- Shows all three intentions with final tick states — read only

**Reset and archive:**
- Card resets at midnight or when morning ritual opens next day
- Archived locally — intention text, tick states, and date stored in history

**Data stored locally:**
- `daily_intentions`: array of 3 objects — text, ticked boolean, time_ticked timestamp
- `intentions_history`: array of past days — date, intentions, completion count
- `intentions_set_today`: boolean

---

### F03 — Today's Spark

**Overview:** One app-chosen micro-task per day designed to deliver a healthy dopamine hit. Adaptive — learns difficulty tolerance and type affinity from completion patterns.

**Dopamine types:**
- Novelty — new experiences that snap the user out of autopilot
- Creative — expressive acts that activate flow state
- Mastery — small skill or knowledge moments that build confidence
- Social — warmth-generating acts that activate connection circuits
- Sensory — physical grounding moments that anchor to the present

**Difficulty levels:**
- Easy: zero friction, under 5 minutes, no preparation
- Medium: small decision or mild effort, 5–15 minutes
- Hard: stepping outside comfort zone or meaningful time investment

**Task library:**
- 120 hand-curated tasks — 10 easy, 8 medium, 6 hard per type
- No task repeats within 30 days
- When library runs low, Claude API generates new tasks — added permanently

**Adaptive algorithm:**

*Starting state (week 1):*
- 100% easy tasks, rotate across all 5 types equally

*Difficulty progression:*
- After week 1: above 60% completion → introduce medium at 20%
- Below 60% → stay easy for another week
- Medium above 60% for 2 weeks → introduce hard at 10%
- Medium drops below 40% → reduce back to 10%
- Hard drops below 40% → remove entirely until medium stabilises

*Type affinity (rolling 14-day window):*
- Above 70% → increase frequency by 10%
- Below 30% → reduce frequency by 10%
- Minimum one appearance per fortnight per type
- Two dimensions independent — difficulty and type adjusted separately

**Day-of-week awareness:**
- Monday: easy and novelty bias
- Wednesday: medium tasks appropriate
- Friday: social tasks preferred
- Weekend: creative and sensory bias
- Sunday: easy only

**Completion signal:**
- Primary: Done button — one tap, immediate
- Fallback: evening check-in asks if spark was completed
- Not today button — escape without guilt

**Spark log — profile view:**
- Simple list: date, task text, completion status (tick or cross)
- Same view across both themes, most recent first

**Data stored locally:**
- `spark_library`: array of 120 task objects
- `spark_log`: array of daily entries
- `type_completion_rates`: rolling 14-day rates per type
- `difficulty_completion_rates`: rolling 7-day rates per difficulty
- `current_difficulty_ceiling`: easy / medium / hard
- `onboarding_week`: boolean

---

### F04 — Reflection Journal

**Overview:** Three freeform evening prompts on a single screen. A fourth prompt appears on Sundays only. Past entries accessible by date in profile.

**Prompts:**
- Something I learnt today...
- Something I'm grateful for...
- Something that made me smile...
- Sunday only — fourth prompt: Someone who came to mind this week and why...

**Input format:**
- All three prompts on one screen — no swiping, no pagination
- Freeform text inputs — no character limit
- Each prompt individually optional — saves if at least one is filled
- Sunday fourth prompt also optional

**Save and confirmation:**
- Single save action covers both reflection journal and Tomorrow's One Thing
- Confirmation: "Saved. Good evening."
- Minimal: subtle fade. Playful: soft journal-closing animation

**Sunday behaviour:**
- Same screen, one extra prompt appended at the bottom
- Not a separate ritual or screen
- Feels natural, not ceremonial

**Past entries — profile view:**
- All past entries accessible by date from profile page
- Calendar or date-indexed list — most recent first
- Read only — past entries cannot be edited
- Same view across both themes

**Data stored locally:**
- `reflection_entries`: array — date, learnt, grateful, smile, warm_thought (Sunday only)

---

### F05 — Tomorrow's One Thing

**Overview:** One optional freeform input at the end of the evening ritual. Shown briefly on the morning screen next day. Ends the day with calm anticipation.

**Input:**
- Prompt: "Something I'm looking forward to tomorrow..."
- Fully optional — no nudge if left empty
- Saved as part of the single evening save action

**Morning display:**
- Shown as a small warm card on the morning screen if filled
- Read only on morning screen
- Clears at midnight or when morning ritual opens

**Theme treatment:**
- Minimal: clean text card, accent colour text
- Playful: warm rounded card with small forward-looking illustration

**Data stored locally:**
- `tomorrow_intention`: object — text and date_set

---

### F07 — Parking Lot

**Overview:** A frictionless thought dump. User decides entirely when to revisit. Thoughts shown one at a time with intentional actions. Thought parked in under 10 seconds.

**Entry mechanic:**
- Free text input — no character limit
- Optional tag selection — six soft pill buttons below input
- One tap to park — particle animation on drop
- Entry screen clears immediately

**The six tags:** Sad · Anger · Worry · Decision · Idea · Dreams

**The jar visual:**
- Minimal: clean SVG outline jar, accent colour lid, particle animation on drop
- Playful: illustrated jar with character detail, fill rises as thoughts are added
- Three states: Empty (inviting), Partial (soft shapes inside), Full (subtle overflow signal)

**Revisit ritual:**
- User-initiated only — app never prompts to open
- Brief settling moment before thoughts shown: "You're back. Take your time."
- Thoughts shown one at a time
- Tag and date shown with each thought

**Actions per thought:**
- Resolve — mark done, move to archive
- Journal — send to reflection journal as pre-filled prompt
- Figure It Out — send to Let's Figure It Out as opening context
- Snooze — Tomorrow / In 3 days / Next week / Not yet
- Burn — flame animation, permanent delete, no confirmation dialog

**Old unresolved thoughts:**
- After 14 days — subtle visual indicator when jar is opened
- Never a notification

**Tag summary view:**
- Before showing thoughts: "2 worries, 1 idea, 1 dream"
- User can filter by tag

**Data stored locally:**
- `parking_lot`: array — text, tag, date_parked, snooze_until, status

---

### F08 — Let's Figure It Out

**Overview:** An on-demand AI thinking partner. Socratic guide — asks questions that draw out the user's own thinking. Every session ends with a clarity card. Sessions are private and not stored.

**Entry points:**
- Direct — "What's on your mind?"
- From Parking Lot — thought pre-fills opening message, tag informs mode suggestion

**Session start — hybrid approach:**
- User types first, AI suggests the most appropriate mode
- User confirms or picks a different one

**The six modes:**
- Untangle — break a big overwhelming task into small steps
- Decide — lay out options, surface what matters most
- Unstuck — diagnose why something isn't moving, find one next step
- Vent and solve — listening-first phase before shifting to solutions
- Reframe — take a negative situation and find a new angle
- Prepare — think through a hard conversation or event before it happens

**Session structure:**
- Opening: user describes situation, AI confirms mode
- Middle: 3–5 focused questions maximum, 10 exchanges total
- Close: clarity card produced

**Emotional awareness:**
- If distressed: acknowledge feelings before problem-solving
- Vent and solve: always starts with listening phase
- Offers: "Do you want to think this through, or did you just need to say it?"

**Parking Lot connection:**
- Tag informs mode: worry/sad → Reframe or Vent and solve, decision → Decide, idea → Untangle
- After session: prompt to mark original thought as resolved

**The clarity card:**
- 3–5 lines plain language
- Title: What you decided / Your next step / A new way to see it / What you are preparing for
- Four options: Save to Clarity archive / Add to tomorrow's 3 things / Return to Parking Lot / Let it go

**Privacy:**
- Conversation cleared on session end — only clarity card saved if user chooses
- One-time notice on first use
- Claude API called with anonymised context

**API context passed:**
- Mode selected, user's North Star, full conversation within session

**Data stored locally:**
- `clarity_archive`: array — title, summary, mode, date, linked_parking_lot_id

---

### F09 — Kind Words Jar

**Overview:** A private collection of kind words — things said, read, or self-noticed. A warm reserve to draw from on hard days. No prompts, no daily pressure, no categories.

**Adding an entry:**
- + button on Kind Words Jar screen only
- Prompt: "Add a kind word..."
- Days 1–7: secondary line — "You can add kind things you notice about yourself too"
- One tap to save — small warm sparkle animation

**The jar visual:**
- Minimal: soft warm outline jar, accent colour glow that deepens with entries
- Playful: illustrated glowing jar, grows warmer and brighter
- Empty state: "Kind words live here. Add the first one."

**Viewing entries:**
- Simple scrollable list — most recent first
- Date shown with each entry
- Read only — delete by swipe or long press

**Hard day prompt:**
- "Need a reminder of how people see you?"
- Surfaces 3 random entries one at a time
- Available only when jar has 3+ entries

**Data stored locally:**
- `kind_words`: array — text and date_added

---

### F10 — North Star

**Overview:** One sentence written at onboarding. Shown quietly in three places. Never prominent. Fully optional.

**The prompt:** "What matters most to you right now?"

**Where it appears:**
- Morning screen — small quiet muted italic line at the bottom
- Let's Figure It Out — passed as context to Claude API
- Positivity quote generation — passed to quote prompt

**Editability:**
- Editable anytime from profile under "Your North Star"
- No history kept — only current version stored
- Deleting removes it from all three places immediately

**Empty state:**
- Morning screen line simply does not appear
- Profile shows quiet prompt: "Add your North Star — what matters most to you right now?"

**Data stored locally:**
- `north_star`: string — current text, null if not set

---

### F11 — Negativity Release

**Overview:** A completely unstructured blank space to write the hard thing. No AI, no prompts, no response. Keep or burn.

**The space:**
- Soft heading: "Just let it out."
- Full blank text area — no placeholder, no character limit
- Keyboard opens automatically

**On completion:**
- Keep: saved privately, confirmation: "It's safe here."
- Burn: flame animation, permanent delete, no confirmation dialog, confirmation: "Gone. You can let that go now."
- Screen clears after 2 seconds

**AI involvement: None — ever.**
This is the one feature where the AI plays no role whatsoever.

**Accessing kept entries — profile view:**
- Section: "Your releases"
- List of dates only — no previews
- Tap date to read full entry
- Delete available from entry view — same flame animation

**Visual treatment:**
- Dark or very deep background for this screen only — both themes

**Data stored locally:**
- `releases`: array — text and date_written
- Excluded from manual export — by design

---

### F12 — Pause Button

**Overview:** A single tap available from anywhere. 30-second 3-2-1 sensory grounding. Fully passive. Zero data footprint.

**The tap target:**
- Persistent floating icon above the nav bar — always visible
- Tapping pauses current screen, resumes after completion

**The 3-2-1 sequence:**
- Step 1 (8s): "Notice 3 things you can see right now."
- Step 2 (8s): "Notice 2 things you can hear."
- Step 3 (8s): "Notice 1 thing you can feel — the ground under your feet, the chair beneath you."
- Close (4s): "You're here." — fades back automatically

**Visual treatment:**
- Screen dims, rest of app fades away
- Minimal: white space, soft text, gentle cross-fade
- Playful: warmer background tint, soft pulse animation

**Dismissable:** Tap anywhere to exit early — no penalty.

**Data:** Zero data footprint — nothing stored, nothing tracked.

---

## 5. Theme System

### Locked decisions

**Decision 1 — Accent colour: 6 curated presets (Minimal)**
- Slate #64748B, Sage #6B8F71, Dusk #4F46E5 (default), Clay #C2714F, Stone #78716C, Rose #BE8A9D

**Decision 2 — Week feature in Minimal: 7-segment geometric fill**
- Seven soft rounded rectangles filling with accent colour one per day

**Decision 3 — Font: Plus Jakarta Sans, one family**
- Minimal: tight letter-spacing, generous whitespace
- Playful: loose tracking, generous line height

**Decision 4 — Illustrations: Open Peeps for MVP**
- openpeeps.com, MIT licence
- Used in Playful theme for empty states, onboarding, character moments
- Minimal: no character illustrations, geometric SVGs only

**Decision 5 — Theme switching: instant with 5-second undo**
- Toast: "Switched to Playful — Undo"
- No confirmation dialog

**Decision 6 — Parking Lot jar: same asset, two SVG skins**
- Minimal: clean outline, accent lid, particle animation
- Playful: illustrated with character, rising fill

### Minimal theme
- Base: white #FFFFFF, off-white #F8FAFC
- Text: #111827, muted #6B7280
- Border: #E5E7EB
- 6 accent presets — see above, default Dusk
- Line icons, subtle fade animations
- Week feature: 7-segment geometric fill
- Empty states: typographic

### Playful theme
- Base: warm off-white #FFFBF5
- Text: #1C1917, muted #78716C
- Accent: warm amber #F59E0B
- Border: #FDE68A
- Open Peeps illustrations, bouncy spring animations
- Week Cartoon: full illustrated partitions
- Pill-shaped buttons, rounded everything
- Empty states: character illustrations

---

## 6. Navigation Structure

### Bottom navigation — 4 tabs
| Tab | Contents |
|---|---|
| Home | 3 things card, week cartoon, tomorrow card, north star line, morning/evening ritual |
| Space | Parking Lot, Kind Words Jar, Let's Figure It Out, Negativity Release |
| Settle | Breathing (MVP), tile matching + colour fill (V2) |
| Me | Spark log, reflection history, clarity archive, sticker book, north star, settings, privacy |

### Pause Button
- Persistent floating icon above nav bar — never a tab
- Accessible from every screen

### Home screen states

**Morning (before ritual, before 12pm):**
- Good morning greeting
- Positivity quote card
- Today's Spark card
- 3 things card — empty, prompting input
- North Star line at bottom

**Daytime (after morning ritual):**
- 3 things card — filled, tickable
- Week cartoon card
- Tomorrow card if set
- North Star line at bottom

**Evening (after 6pm, before evening ritual):**
- "How was your day?" prompt — tapping opens evening ritual
- 3 things card with final tick states
- Week cartoon card
- North Star line at bottom

**Sunday evening:** Same as above, evening ritual includes warm thought prompt

### Ritual access
- Morning ritual surfaces automatically before 12pm if not completed
- Evening ritual surfaces automatically after 6pm if not completed
- Manual re-access via "Morning" or "Evening" label
- Completion replaces ritual card with appropriate state

### Space screen hierarchy
1. Parking Lot — hero, jar visual front and centre
2. Kind Words Jar — warm glowing jar alongside
3. Let's Figure It Out — "Need to think something through?"
4. Negativity Release — "Just need to let something out?" (quietest, bottom)

### Navigation visual treatment
- Minimal: line icons, no labels, active = accent colour
- Playful: rounded illustrated icons, active = warm filled state
- No badges, no notification dots — calm and pressure-free

---

## 7. Data Model

**Database:** unfolding_db (IndexedDB via Dexie.js)

### Tables
| Table | Key fields |
|---|---|
| settings | theme, notification_times, onboarding_complete, onboarding_day, install_date |
| daily_intentions | date, intention_1/2/3, ticked_1/2/3, time_ticked_1/2/3, intentions_set |
| intentions_history | date, intentions array, completion_count |
| reflection_entries | date, learnt, grateful, smile, warm_thought, tomorrow_intention |
| parking_lot | id, text, tag, date_parked, snooze_until, status |
| kind_words | id, text, date_added |
| spark_log | date, task_text, type, difficulty, completion_status, interaction_type |
| spark_library | id, text, type, difficulty, last_shown, times_shown |
| spark_algorithm | type_completion_rates, difficulty_completion_rates, current_difficulty_ceiling, onboarding_week |
| clarity_archive | id, title, summary, mode, date, linked_parking_lot_id |
| releases | id, text, date_written — **excluded from export** |
| north_star | text (single record) |
| week_cartoons | id, cartoon_id, week_start_date, partition_states (7 booleans) |
| cartoon_library | id, name, theme_variant, partition_count, asset_path |
| quote_data | blocked_themes, favourites, shown_quotes, last_favourite_shown, onboarding_day |
| tomorrow_intention | text, date_set (single active record) |

### Export behaviour
- **Included:** daily_intentions history, reflection_entries, parking_lot (archived), kind_words, spark_log, clarity_archive, north_star
- **Excluded:** releases (deliberately, by design)
- **Format:** JSON + human-readable dated text file

### Reset behaviour
- daily_intentions: resets at midnight or morning open, archived to history
- tomorrow_intention: clears at midnight or morning open
- Burned entries (parking_lot, releases): deleted immediately, not recoverable
- Delete all: wipes every table completely and irreversibly

---

## 8. Onboarding Flow

Six screens on first launch. North Star and notifications are the only skippable screens.

### Screen 1 — Welcome
- App name: Unfolding
- Tagline: "Your story, gradually."
- CTA: "Let's begin"

### Screen 2 — Privacy *(not skippable)*
- "Everything you write stays on this device only"
- "We cannot see it. Nobody can."
- "Don't clear your browser's site data — it will delete your entries"
- "You can export everything anytime as a backup"
- CTA: "Got it"

### Screen 3 — Theme selection *(not skippable)*
- Two options: Minimal and Playful
- Style swatch for each — colour palette, font feel, one illustration
- CTA: "This one"

### Screen 4 — North Star *(skippable)*
- Prompt: "What matters most to you right now?"
- Skip link: "You can always add this later"
- CTA: "Save" or skip

### Screen 5 — Notification setup *(skippable)*
- Morning time picker — default 8:00am
- Evening time picker — default 8:00pm
- Skip link: "I'll set this up later"
- CTA: "Set reminders"
- If skipped: gentle in-app banner on day 3, one time only

### Screen 6 — Ready
- "You're all set. Unfolding starts now."
- Minimal: clean typographic treatment
- Playful: small celebratory character illustration
- CTA: "Open Unfolding" → lands on Home screen
- Sets onboarding_complete: true

### Post-onboarding nudges
| Trigger | Nudge |
|---|---|
| Days 1–7 | Quote thumbs always visible |
| Days 1–7 | Kind Words self-compliment nudge visible |
| Day 3 | Notification setup banner (if skipped) — once only |
| First Parking Lot use | "Your thoughts here are stored only on this device" |
| First Let's Figure It Out use | "Your conversation is not saved. Only the summary is kept if you choose." |

---

## 9. Notification Schedule

All via Web Push API. Times set at onboarding, editable in Me → Notifications.

| Notification | Frequency | Default time | Content | Deep-link |
|---|---|---|---|---|
| Morning ritual | Daily | 8:00am | "Good morning. Your day is ready." | Home — morning state |
| Evening ritual | Daily | 8:00pm | "How was your day?" | Home — reflection journal open |
| Site data reminder | Monthly | Same as morning | "Reminder — your entries live on this device. Export a backup anytime." | Me — Your Privacy |
| Sunday warm thought | Weekly, Sunday | Same as evening | "Sunday reflection — someone came to mind this week?" | Home — reflection with warm thought |

### Rules
- All off by default until permission granted at onboarding
- If ritual already completed that day — notification suppressed
- No notification badges on app icon or nav tabs
- If permission denied — app functions fully without notifications

---

## 10. Technical Specification

### Tech stack
| Layer | Technology | Rationale |
|---|---|---|
| Frontend | React + Vite | Fast builds, excellent PWA support |
| Styling | Tailwind CSS | Rapid UI, consistent design system |
| Storage | IndexedDB via Dexie.js | Local-first, works fully offline |
| AI | Claude API (claude-sonnet-4-6) | Powers Let's Figure It Out, Spark, quotes |
| Notifications | Web Push API + Service Worker | Free, no third-party needed |
| Hosting | Vercel (free tier) | Deploy in minutes, HTTPS by default |
| PWA | Vite PWA Plugin | Handles manifest, service worker, caching |
| Auth | Web Authentication API | Device PIN/biometric, no passwords |
| Font | Plus Jakarta Sans via @fontsource | Single family, both themes |
| Illustrations | Open Peeps (openpeeps.com) | MIT licence, Playful theme |

### Architecture principles
- Local-first — all data stays on device
- No backend required for MVP
- Claude API called client-side, anonymised
- Service worker handles offline mode
- Single page application — React Router

### Privacy & security
- All data in IndexedDB — zero server storage
- Claude API calls anonymised — no name, no account linkage
- Conversation history cleared on Let's Figure It Out session end
- Device-level lock via Web Authentication API
- No analytics, no tracking, no third-party SDKs in MVP
- Releases excluded from export by design

### PWA requirements
- manifest.json with name, icons, theme colour, display: standalone
- Service worker with cache-first strategy
- Custom install prompt in onboarding
- iOS install guide shown automatically in Safari
- Offline fallback page
- Push notification permission requested after first meaningful interaction

---

## 11. Later Versions

### V2 — after validation with friends and family
- Remaining V2 features (F23–F29) based on MVP engagement data
- Cloud backup — optional, opt-in, encrypted
- Custom domain — unfolding.app
- Improved iOS notification reliability
- Onboarding flow refinement based on real confusion points
- Full UI theme preview at onboarding (replacing style swatch)

### V3 — if validation confirms strong demand
- Native iOS app via React Native
- App Store submission (£99/year Apple Developer)
- Google Play submission (£20 one-time)
- Optional user accounts for cross-device sync
- Monetisation — freemium with V2 features behind subscription
- Wider beta via TestFlight

---

## 12. Dependencies

### Cost summary
Total estimated cost to launch MVP: under £200.
Apple Developer (£99/yr) and Play Store (£20) only needed at V3.

### External services
- **Anthropic Claude API** — required for Let's Figure It Out, Spark, quotes. Free tier available, scales at low cost per interaction. API key stored as Vercel environment variable.
- **Vercel** — free tier, HTTPS, global CDN, instant deploys on git push
- **Web Push API** — browser-native, no third-party service

### Development dependencies
- Claude Code — primary development tool, zero cost
- Node.js + npm
- Git + GitHub — version control, triggers Vercel deploys
- Vite PWA Plugin — npm, free, MIT
- Dexie.js — npm, free, MIT
- Tailwind CSS — npm, free, MIT
- Plus Jakarta Sans — Google Fonts via @fontsource, free, OFL
- Open Peeps — openpeeps.com, free, MIT

### Content dependencies
- Positivity quote library — 30 hand-curated fallback quotes
- Today's Spark task library — 120 hand-curated tasks grouped by dopamine type
- Week Cartoon illustrations — 12 for MVP, Open Peeps style
- Breathing animation — built in CSS/SVG, no external assets

---

## 13. Metrics

### Engagement
| Metric | What it measures | Target (month 3) |
|---|---|---|
| Daily active users | Opens per day | 60% of invited users |
| Morning ritual completion | All 3 morning features completed | > 50% |
| Evening ritual completion | Reflection + tomorrow's one thing | > 40% |
| Spark completion rate | Today's Spark marked done | > 60% |
| Sunday reflection rate | Sunday ritual completed | > 50% |

### Retention
| Metric | Target |
|---|---|
| Day 7 retention | > 60% |
| Day 30 retention | > 40% |
| Week Cartoon fill rate | > 5 of 7 partitions per week |
| Parking Lot revisit rate | > 30% of parked thoughts resolved |

### Feature utility
| Metric | Target |
|---|---|
| Let's Figure It Out sessions | > 2x per user per week |
| Kind Words Jar entries | > 5 entries per user over 30 days |
| Parking Lot entries | > 3 per user per week |

### Qualitative signals
- Unsolicited shares — did anyone forward the link without being asked?
- Feature requests — what are people asking for that isn't there?
- Drop-off points — where in the ritual does engagement stop?
- Would pay — at what point does someone say they'd pay for this?
- Miss it — did anyone notice when the app was down?
- Privacy confidence — did users feel safe writing personal thoughts?
- Export usage — did anyone use the data export feature?
- Theme split — Minimal vs Playful ratio and retention difference?

---

*Unfolding · Product Spec v2.0 · Ready for build*
*All features subject to change. Update this file when decisions change.*

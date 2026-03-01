# The Trough — Pembroke College Menu

A minimal, mobile-first Next.js web app that shows today's Pembroke College servery ("the trough") menu at a glance.

## Features

- **3-week rotation** — automatically calculates the correct week for Lent 2026 term dates
- **Weekday view** — shows both Lunch and Dinner services
- **Weekend view** — shows Brunch only (with pudding and sides)
- **Out-of-term** — friendly "no menu today" message
- **Dietary badges** — `V` (vegetarian) and `VE` (vegan) flags on every applicable dish
- **Server-rendered** — always reflects the current day; no client-side JS required
- **PWA-ready** — add to Home Screen on iOS/Android for instant daily access

## Term schedule (Lent 2026)

| Calendar weeks commencing | Rotation week |
|---------------------------|---------------|
| 19 Jan, 9 Feb, 2 Mar      | Week 1        |
| 26 Jan, 16 Feb, 9 Mar     | Week 2        |
| 2 Feb, 23 Feb, 16 Mar     | Week 3        |

## Project structure

```
src/
├── app/
│   ├── globals.css        # Minimal global styles
│   ├── layout.tsx         # Root layout + metadata
│   └── page.tsx           # Main page (server component)
├── data/
│   └── menuData.json      # All three weeks' menu data
└── lib/
    ├── dietaryFlags.ts    # Curated V/VE flags for every dish
    └── getMenu.ts         # Core rotation + lookup logic
```

## Local development

```bash
npm install
npm run dev          # starts on http://localhost:3000
```

## Deploy to Vercel (one click)

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo
3. No environment variables needed — click **Deploy**

The app uses `force-dynamic` rendering so Vercel re-renders on every request, keeping the date accurate without any caching issues.

## Updating the menu

Menu data lives in `src/data/menuData.json`. Each day has a `lunch` (or `brunch` on weekends) and `dinner` object:

```json
{
  "studentSpecial": "...",
  "alternativeDish": "...",
  "allergenFriendly": "...",
  "pudding": "...",
  "sides": ["..."]
}
```

Dietary flags are maintained separately in `src/lib/dietaryFlags.ts` — add any new dish name alongside `"v"` or `"ve"`.

---

*Not an official Pembroke College service. Menu data sourced from [Pembroke College Catering](https://www.pem.cam.ac.uk/catering).*

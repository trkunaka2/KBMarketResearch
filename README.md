# Kestrel Bags Market Research

An installable web app for capturing and tracking Kestrel Bags' tote bag market
research, on the go — no signal required.

**Live app:** https://trkunaka2.github.io/KBMarketResearch/ (deploys automatically from `main`)

## What it does

- **New response** — a mobile-first form matching the 15-question tote bag
  survey (situational use, price sensitivity, comfort, size, style, frustrations,
  etc.). Multi-select, single-select, yes/no and open-text questions, with
  conditional follow-ups (e.g. "why don't you own one" only shows if they don't).
- **Dashboard** — live progress toward a response goal, topline stats, a
  distribution chart per question, open-ended responses grouped by question,
  and a full list of every response (expandable, deletable).
- **Export** — one-tap CSV export for spreadsheets/Excel, plus a JSON backup.
  CSV/JSON files exported from the app can be re-imported anywhere to merge
  data collected on multiple phones.
- **Installable (iOS & Android)** — add it to your home screen and it runs
  full-screen like a native app, works offline, and keeps all data on-device
  in the browser's local storage.

## Getting started

```bash
npm install
npm run dev       # local dev server
npm run build     # production build (dist/)
npm run preview   # preview the production build
```

## Installing on a phone

1. Open the deployed URL in Safari (iOS) or Chrome (Android).
2. iOS: tap Share → **Add to Home Screen**. Android: tap the menu → **Install app**
   (or use the install prompt Chrome shows automatically).
3. Launch it from the home screen — it opens full-screen and keeps working
   without a network connection.

## Data & privacy

All responses are stored locally in the browser (`localStorage`) — nothing is
sent to a server. Use **Export CSV** / **Backup JSON** regularly to back up
and consolidate data from multiple devices.

## Tech

Vite + React + TypeScript + Tailwind CSS, packaged as a PWA with
`vite-plugin-pwa` for offline support and home-screen install on iOS/Android.

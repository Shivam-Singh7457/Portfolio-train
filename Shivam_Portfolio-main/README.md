# 🚂 Shivam Singh — Train Station Portfolio

A playful single-page developer portfolio with a **"train arriving at a station"** theme.

## Quick Start

```bash
# Install dependencies
npm install

# Run development server  (opens at http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Features

| Feature | Detail |
|---|---|
| 🚂 Hero Train | Locomotive slides in from right on load |
| 🎵 Audio Jingle | Jingle Bells melody via Web Audio API on arrival (mute toggle top-right) |
| 💨 Steam Particles | Canvas particle system from the chimney |
| 📢 Ticker Bar | Scrolling announcement marquee at bottom |
| 📋 Departure Board Nav | Split-flap character animation navigation |
| 🚃 Project Train Cars | Horizontal-scroll carriages with case study modals |
| 📊 Skills Timetable | Arrivals board with animated progress bars |
| 🛤️ Experience Timeline | Railway track with station stops |
| 🎫 Contact Ticket | Ticket-stub styled contact card |
| ⏰ Live Clock | Station clock in the hero section |

## Tech Stack

- **React 18** + **Vite 5** (frontend)
- **Web Audio API** (procedural audio — no audio files needed)
- **SVG** (all train graphics drawn in code)
- **Canvas API** (steam particle system)
- **CSS Animations** (split-flap, ticker, transitions)

## Customizing

All resume content is in `src/data/resume.js` — edit that file to update any section.

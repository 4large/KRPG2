# Browser Game — Vanilla JavaScript

A complete browser game built from the ground up over the summer of 2026 using nothing but vanilla JavaScript. No frameworks, no build tools. The project centers on a fully rules-complete blackjack engine, wrapped in an event-driven narrative layer with its own currency and item economy.

## What's Built

### Blackjack Engine (`blackjack.js`)
- Complete hand-state management for dealer and player, including split hands
- Splits, doubles, and insurance, with correct payout math (3:2 on blackjack, standard win/push/bust handling)
- Dealer logic that follows standard house rules (hits below 17, stands at 17+)
- Betting, balance tracking, and win-streak detection

### Narrative & Economy System
- An event-driven dialogue/choice system (`playing.js`, `story.js`) that drives story branches toward an ending and credits sequence
- A character stat system (`kevin.js`) whose values shift based on items the player owns
- A store (`store.js`) where blackjack winnings buy items that affect those stats and unlock story content
- Screens communicate through custom DOM events dispatched from a central game loop (`game.js`), rather than a framework's state management

### Supporting Pieces
- `preload.js` — asset loader with a loading-bar screen
- `title.js` — title screen
- `ad.js` — an in-game fake-ad sequence that plays after store purchases

## Tech Stack

Vanilla JavaScript (ES modules), HTML5 Canvas, and CSS. No framework or build step. The one external dependency is a CDN import of [SweetAlert2](https://sweetalert2.github.io/), used for toast notifications and modal popups in the store.

## Running Locally

This is a static site — no install or build step required.

```bash
npx serve .
# or: python3 -m http.server
```

Then open the served URL in your browser. Opening `index.html` directly via `file://` won't work, since the game uses ES modules, which browsers block from `file://` origins.

## About This Repo

This repository holds the full narrative game the blackjack engine was originally built for. The demo linked above showcases the blackjack module on its own. The game is working here on non chromium based browsers (firefox) here https://4large.github.io/KRPG2/, but a tech demo showcasing the blackjack engine will be releasing soon!

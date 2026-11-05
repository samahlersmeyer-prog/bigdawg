# Big Dawg Daily — notes for Claude

Sam's daily puzzle app for his friends. Live at https://samahlersmeyer-prog.github.io/bigdawg/ (GitHub Pages from `main`, installed on iPhones as a home-screen app). Pushing to `main` deploys.

## Working rules (keep token use low)
- Read only the file you need. Use grep to find a function, then read just those lines. Never read whole big files: `js/data.js` (puzzle banks), `strands_x.json`, `offline.html`, `server/Code.gs`.
- `index.html` holds only markup. Logic lives in `js/`, styles in `styles.css`.
- After any change: `python3 tools/stamp.py`, then commit and push. It bumps cache versions so phones update. Never hand-edit `?v=`, `GAMES_V`, or the `V`/`SHELL` lines in `sw.js`.
- Commit messages: short, plain, feature-first (e.g. "Kick Dawg: Pro Range at 1000+").
- Keep this file current: update To-do and anything that changed, and keep it about a page.

## Layout
- `index.html` — markup only, plus the script/style tags (load order matters, see below).
- `styles.css` — all styles (light/dark themes).
- `js/data.js` — puzzle banks: `ANSWERS` (Five), `PUZZLES` (Groups), `MINIS`, `STRANDS`, `VALID` word list. Puzzle of the day = `bank[DAY % length]`, `DAY` counted from `EPOCH` (Oct 6, 2026).
- `js/core.js` — URLs, date/puzzle of the day, local storage, server calls (`API`/`callServer`), toast/modal, navigation (`show(view)`).
- `js/daily.js` — Home and the four daily games (Five, Groups, Mini, Strands), keyboard, results and sharing.
- `js/social.js` — Crews, Week in Review, Scoreboard/standings, Shade (roasts), Big Dawg emotes, confetti/sounds/crown/league/player cards/reactions.
- `js/arcade.js` — Arcade / Sports / Den hubs, built-in Zoomies, Long Dawg, Fetch Breakout, the shared arcade engine, and the `defGameMeta([...])` list of every lazy-loaded game.
- `js/boot.js` — identity ("Who's playing?" + PIN) and `boot()`.
- `games/g_*.js` — one file per arcade/sports/den game, lazy-loaded. To add a game: create `games/g_x.js`, add its entry to `defGameMeta` in `js/arcade.js`, and add its key to a section in `ARC_GROUPS` (Arcade and Sports each have 3 sections; unlisted games fall into the last one). When a game ships or gets a real upgrade, add it to `FRESH` in `js/arcade.js` (`key: ["new"|"upd", "YYYY-MM-DD"]`); it shows a NEW/UPDATED tag for 7 days.
- `sw.js` — service worker (instant open, quiet background updates). `strands_x.json` — Strands bonus words, fetched after load.
- `legacy/` — generated old-iPad copy (iOS 9 Safari), puzzles + scoreboard only, at `/bigdawg/legacy/`. Built by `tools/legacy/build.mjs` (run automatically by `stamp.py`; needs Node): Babel to ES5 + polyfills, CSS grid/gap/clamp rewritten to old flexbox, plus hand fixes in `tools/legacy/shim.js` (touch for Strands drag, board sizing) and `tools/legacy/legacy.css`. Never edit `legacy/` by hand. If a new layout looks broken there, fix it in `legacy.css`.
- `server/Code.gs` — Apps Script backend; data in Google Sheet `1VL0FSSHy4VFphMntUA0tKgXBEG4ELWKx7zyXdJvS6Bw`. `server/Loader.gs` is pasted once in Apps Script and pulls `Code.gs` from GitHub, so pushing `Code.gs` goes live in about 10 minutes, no deploy. Server functions are in `API_FNS`.

The `js/` files are classic scripts sharing one global scope, loaded in order data → core → daily → social → arcade → boot. Code that runs at load time can only use things from its own file or earlier files; functions called later (from clicks or `boot()`) can live anywhere.

## Stale / leftover
- `offline.html` — old offline edition from Oct 25; out of date and not linked from the app. Don't edit or read it.
- `server/*_more.json` — puzzle top-up sources, already merged into `js/data.js`.
- The Apps Script `doGet` serves an old copy of the page from Drive ("Big Dawg Daily page (index.html)"). Everyone uses the GitHub Pages link; the split files won't work if `index.html` is re-uploaded there.

## Puzzle runway (as of Oct 31, 2026)
Banks repeat after: Minis Dec 4, Strands Dec 12, Groups Dec 17, Five 2028. Top up Minis/Strands/Groups before late November. Dawg Links (60 chains in `games/g_links.js`, day 1 = Nov 4) repeats Jan 3, 2027. The Midi (37 7×7 crosswords in `games/g_midi.js`, day 1 = Nov 4) repeats Dec 11; the generator (word-list fill + hand clues) isn't in the repo, so add new grids by hand in the same format. Dawg Guess (`games/g_guess.js`) rotates TV Shows / Movies / Animals / Pro Teams daily and picks answers in a fixed shuffled order, so it runs for over a year; closeness comes from each category's tags and `sim` function. Dawg Waffle (150 boards in `games/g_waffle.js` as [solution, scramble], each scrambled with exactly 10 swaps) repeats in April 2027.

## To-do
- (add items here)

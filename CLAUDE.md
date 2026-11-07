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
- `games/g_*.js` — one file per arcade/sports/den game, lazy-loaded. To add a game: create `games/g_x.js`, add its entry to `defGameMeta` in `js/arcade.js`, and add its key to a section in `ARC_GROUPS`, and add `key: maxScore` to `ARCADE_GAMES` in `server/Code.gs` (without it the server rejects every score and phones drop them; `recoverBests` resends each phone's best once the server knows the game) (Arcade and Sports each have 3 sections; unlisted games fall into the last one). When a game ships or gets a real upgrade, add it to `FRESH` in `js/arcade.js` (`key: ["new"|"upd", "YYYY-MM-DD"]`); it shows a NEW/UPDATED tag for 7 days.
- `tools/strands.mjs` — Strands checker/builder. `check` validates every board (no overlaps, no crossing paths, all 48 cells used, theme words 4+ letters, spangram starts on one side and ends on the opposite side — boards already played only had to touch both sides); `stamp.py` runs it and refuses to stamp if any board is broken. `fix` re-lays out broken boards with the same words and rebuilds their bonus words. Add new Strands puzzles as words only and let `fix` make the grid, rather than laying them out by hand. Strands progress is tagged with the board (`S.strands.g`), so changing a live board restarts it for everyone.
- `tools/repeats.mjs` — repeat checker for the four daily puzzles; `stamp.py` refuses to stamp if an upcoming puzzle repeats an earlier one (Five: same word; Groups: same category name or 2+ shared words; Mini: 3+ shared entries; Strands: same title/spangram or 2+ shared words). Only swap upcoming puzzles (bank index > today's `DAY`), never today's or past ones. `node tools/repeats.mjs all` also lists old repeats already played. New puzzles must also be new vs. everything already in the bank.
- `sw.js` — service worker (instant open, quiet background updates). `strands_x.json` — Strands bonus words, fetched after load.
- `legacy/` — generated old-iPad copy (iOS 9 Safari) of the whole app, every game included, at `/bigdawg/legacy/`. Built by `tools/legacy/build.mjs` (run automatically by `stamp.py`; needs Node): Babel to ES5 + polyfills (js/ and games/ → legacy/js/, legacy/games/), CSS grid/gap/clamp rewritten to old flexbox, plus hand fixes in `tools/legacy/shim.js` (pointer→touch without blocking taps on buttons/panels, canvases at 1x for speed, canvas roundRect/ellipse, board sizing; the build also lets the game loop skip up to 1/20 s per frame) and `tools/legacy/legacy.css` (home cards, arcade tiles). Never edit `legacy/` by hand. If a new layout looks broken there, fix it in `legacy.css`.
- `server/Code.gs` — Apps Script backend; data in Google Sheet `1VL0FSSHy4VFphMntUA0tKgXBEG4ELWKx7zyXdJvS6Bw`. `server/Loader.gs` is pasted once in Apps Script and pulls `Code.gs` from GitHub, so pushing `Code.gs` goes live in about 10 minutes, no deploy. Server functions are in `API_FNS`.

The `js/` files are classic scripts sharing one global scope, loaded in order data → core → daily → social → arcade → boot. Code that runs at load time can only use things from its own file or earlier files; functions called later (from clicks or `boot()`) can live anywhere.

## The Den
`DEN_SECTIONS` in `js/arcade.js` sets the daily puzzles: Words (big cards) and Logic (compact rows), in a fixed order. Re-rank that order by hand every month or so from play counts (distinct players per week), not live. NEW games (`FRESH`) pin to the top of their section for 7 days; finished puzzles sink to a slim ✓ row.

## Stale / leftover
- `offline.html` — old offline edition from Oct 25; out of date and not linked from the app. Don't edit or read it.
- `server/*_more.json` — puzzle top-up sources, already merged into `js/data.js`.
- The Apps Script `doGet` serves an old copy of the page from Drive ("Big Dawg Daily page (index.html)"). Everyone uses the GitHub Pages link; the split files won't work if `index.html` is re-uploaded there.

## Puzzle runway (as of Oct 31, 2026)
Banks repeat after: Minis Dec 4, Strands Dec 12, Groups Dec 17, Five 2028. Top up Minis/Strands/Groups before late November. Dawg Links (60 chains in `games/g_links.js`, day 1 = Nov 4) repeats Jan 3, 2027. The Midi (37 7×7 crosswords in `games/g_midi.js`, day 1 = Nov 4) repeats Dec 11; the generator (word-list fill + hand clues) isn't in the repo, so add new grids by hand in the same format. Dawg Guess (`games/g_guess.js`, Contexto-style: #rank by similarity, 15 guesses) rotates TV Shows / Movies / Animals / Pro Teams daily and picks answers in a fixed shuffled order, so it runs for over a year; each category's `clues` (genre/network/year, class/habitat/diet/size, league/distance+direction) are shown under every guess and also make up its closeness, so tied picks share a rank; one free hint after 7 misses. Dawg Waffle (150 boards in `games/g_waffle.js` as [solution, scramble], each scrambled with exactly 10 swaps) repeats in April 2027.

## To-do
- (add items here)

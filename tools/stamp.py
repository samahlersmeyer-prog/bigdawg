#!/usr/bin/env python3
"""Stamp cache-busting versions so phones pick up changes. Run before every commit:

    python3 tools/stamp.py

- index.html: every local styles.css / js/*.js tag gets ?v=<hash of that file>
- index.html: window.GAMES_V = hash of games/*.js (the arcade loads games/<file>?v=GAMES_V)
- sw.js: cache name V = hash of everything served, and SHELL precaches the stamped app files
Safe to run any number of times; it only changes what actually changed.
"""
import hashlib, pathlib, re, shutil, subprocess, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent

# Refuse to ship a broken Strands board (overlapping or crossing words, gaps). See tools/strands.mjs.
if shutil.which("node") and subprocess.run(["node", "tools/strands.mjs", "check"], cwd=ROOT).returncode:
    sys.exit("stamp: fix the Strands puzzles above first (node tools/strands.mjs fix)")
# Refuse to ship a daily puzzle that repeats an earlier one (Five, Groups, Mini, Strands). See tools/repeats.mjs.
if shutil.which("node") and subprocess.run(["node", "tools/repeats.mjs"], cwd=ROOT).returncode:
    sys.exit("stamp: swap out the repeated upcoming puzzles above first (never edit today's or past ones)")
h = lambda b: hashlib.sha1(b).hexdigest()[:10]

index = ROOT / "index.html"
html = index.read_text(encoding="utf-8")

def stamp(m):
    path = m.group(2)
    return f'{m.group(1)}{path}?v={h((ROOT / path).read_bytes())}'
html = re.sub(r'((?:src|href)=")((?:js/[\w.-]+\.js)|styles\.css)\?v=[\w]*', stamp, html)

games = b"".join(p.read_bytes() for p in sorted((ROOT / "games").glob("*.js")))
html = re.sub(r'window\.GAMES_V="[\w]*"', f'window.GAMES_V="{h(games)}"', html)
index.write_text(html, encoding="utf-8")

assets = re.findall(r'(?:src|href)="((?:js/[\w.-]+\.js|styles\.css)\?v=\w+)"', html)
served = [index, ROOT / "manifest.webmanifest", ROOT / "strands_x.json"] + \
         [ROOT / a.split("?")[0] for a in assets] + sorted((ROOT / "games").glob("*.js"))
version = h(b"".join(p.read_bytes() for p in served))

sw = ROOT / "sw.js"
src = sw.read_text(encoding="utf-8")
src = re.sub(r'const V = "bdd-[\w]*";', f'const V = "bdd-{version}";', src)
shell = ["./", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"] + ["./" + a for a in assets]
src = re.sub(r'const SHELL = \[.*?\];', "const SHELL = " + str(shell).replace("'", '"') + ";", src)
sw.write_text(src, encoding="utf-8")
print(f"stamped: sw bdd-{version}, games {h(games)}, {len(assets)} app files")

# Rebuild legacy/ (the old-iPad copy) from the files just stamped. Needs Node; see tools/legacy/build.mjs.
import shutil, subprocess
lg = ROOT / "tools" / "legacy"
if shutil.which("node"):
    if not (lg / "node_modules").exists():
        subprocess.run(["npm", "install", "--silent", "--no-audit", "--no-fund"], cwd=lg, check=True)
    subprocess.run(["node", "build.mjs"], cwd=lg, check=True)
else:
    print("legacy: SKIPPED (Node not installed) - legacy/ is now out of date")

# Rebuild offline.html (one-file edition for computers with no internet). Needs Node; see tools/offline/build.mjs.
if shutil.which("node"):
    subprocess.run(["node", "tools/offline/build.mjs"], cwd=ROOT, check=True)
else:
    print("offline: SKIPPED (Node not installed) - offline.html is now out of date")

#!/usr/bin/env python3
"""Stamp cache-busting versions so phones pick up changes. Run before every commit:

    python3 tools/stamp.py

- index.html: every local styles.css / js/*.js tag gets ?v=<hash of that file>
- index.html: window.GAMES_V = hash of games/*.js (the arcade loads games/<file>?v=GAMES_V)
- sw.js: cache name V = hash of everything served, and SHELL precaches the stamped app files
Safe to run any number of times; it only changes what actually changed.
"""
import hashlib, pathlib, re

ROOT = pathlib.Path(__file__).resolve().parent.parent
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

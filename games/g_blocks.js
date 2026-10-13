// ---------- Block Dawg (falling blocks) ----------
// The 7 four-square shapes fall into a 10-wide well. Fill rows to clear them. Paw prints on every tile.
(function () {
  const COLS = 10;
  const SHAPES = {
    I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    O: [[1, 1], [1, 1]],
    T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]]
  };
  const ORDER = ["I", "O", "T", "S", "Z", "J", "L"];
  // [base, light, dark]
  const COL = {
    I: ["#3fd0e8", "#a6f0fb", "#1f8ea3"],
    O: ["#ffd23f", "#fff0a0", "#c49a12"],
    T: ["#b065e8", "#dcb0ff", "#7334a8"],
    S: ["#5ccf5c", "#b0f2a8", "#2f8f33"],
    Z: ["#ff5a5a", "#ffb0a8", "#b82e33"],
    J: ["#4a7cff", "#a8c2ff", "#2647b0"],
    L: ["#ff9a3c", "#ffd0a0", "#bf6216"]
  };
  const PTS = [0, 100, 300, 500, 800];
  const KICKS = [[0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1], [-1, -1], [1, -1]];

  function layout(G) {
    const W = G.W, H = G.H, L = {};
    L.hud = 30;
    L.bh = Math.max(56, Math.min(68, Math.round(H * 0.11)));
    L.by = H - L.bh - 8;
    const availH = L.by - L.hud - 14;
    L.rows = availH / 20 >= 19 ? 20 : 18;
    const panelMin = 118;
    L.cell = Math.floor(Math.min(availH / L.rows, (W - 24 - panelMin) / COLS));
    L.ww = L.cell * COLS; L.wh = L.cell * L.rows;
    const panelW = Math.min(170, W - 24 - L.ww - 10);
    const total = L.ww + 10 + panelW;
    L.wx = Math.round((W - total) / 2);
    L.wy = L.hud + 6 + Math.round((availH - L.wh) / 2);
    L.px = L.wx + L.ww + 10; L.pw = panelW;
    // 4 buttons
    const gap = 8, bw = (W - 16 - gap * 3) / 4;
    L.btns = [0, 1, 2, 3].map(i => ({ x: 8 + i * (bw + gap), y: L.by, w: bw, h: L.bh }));
    return L;
  }

  function fits(s, m, x, y) {
    const n = m.length;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (!m[r][c]) continue;
      const gx = x + c, gy = y + r;
      if (gx < 0 || gx >= COLS || gy >= s.rows) return false;
      if (gy >= 0 && s.board[gy][gx]) return false;
    }
    return true;
  }
  function rot(m) {
    const n = m.length, r = [];
    for (let i = 0; i < n; i++) { r.push([]); for (let j = 0; j < n; j++) r[i].push(m[n - 1 - j][i]); }
    return r;
  }
  function nextType(s) {
    if (!s.bag.length) { s.bag = ORDER.slice(); for (let i = 6; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); const t = s.bag[i]; s.bag[i] = s.bag[j]; s.bag[j] = t; } }
    return s.bag.pop();
  }
  function spawn(G) {
    const s = G.s, t = s.next; s.next = nextType(s);
    const m = SHAPES[t];
    s.p = { t, m, x: Math.floor((COLS - m.length) / 2), y: t === "I" ? -1 : 0 };
    s.lock = 0; s.resets = 0; s.fall = 0;
    if (!fits(s, m, s.p.x, s.p.y)) { die(G); return false; }
    return true;
  }
  function die(G) {
    const s = G.s; if (s.dead) return;
    s.dead = true; s.p = null; s.rep = null;
    if (G.state === "play") { G.sfx("lose"); G.buzz(); }
    G.over(Math.min(9999999, s.score), s.lines >= 40 ? "Stacked like a champ!" : s.lines >= 10 ? "Ruff landing." : "Topped out!");
  }
  function grav(s) { return Math.max(0.05, 0.8 * Math.pow(0.84, s.level - 1)); }
  function grounded(s) { return !fits(s, s.p.m, s.p.x, s.p.y + 1); }
  function touched(s) { if (s.p && grounded(s) && s.resets < 15) { s.lock = 0; s.resets++; } }
  function move(G, dx) {
    const s = G.s; if (!s.p || s.dead || s.clr) return false;
    if (fits(s, s.p.m, s.p.x + dx, s.p.y)) { s.p.x += dx; touched(s); return true; }
    return false;
  }
  function rotate(G) {
    const s = G.s; if (!s.p || s.dead || s.clr || s.p.t === "O") return;
    const m = rot(s.p.m);
    for (let i = 0; i < KICKS.length; i++) {
      const k = KICKS[i];
      if (fits(s, m, s.p.x + k[0], s.p.y + k[1])) { s.p.m = m; s.p.x += k[0]; s.p.y += k[1]; touched(s); return; }
    }
  }
  function ghostY(s) { let y = s.p.y; while (fits(s, s.p.m, s.p.x, y + 1)) y++; return y; }
  function hardDrop(G) {
    const s = G.s; if (!s.p || s.dead || s.clr) return;
    const y = ghostY(s); s.score += 2 * (y - s.p.y); s.p.y = y; s.thud = 0.12; lockPiece(G);
  }
  function lockPiece(G) {
    const s = G.s, p = s.p, n = p.m.length;
    let above = false;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      if (!p.m[r][c]) continue;
      const gy = p.y + r; if (gy < 0) { above = true; continue; }
      s.board[gy][p.x + c] = p.t;
    }
    s.p = null;
    if (above) { die(G); return; }
    const full = [];
    for (let r = 0; r < s.rows; r++) { let f = true; for (let c = 0; c < COLS; c++) if (!s.board[r][c]) { f = false; break; } if (f) full.push(r); }
    if (full.length) {
      s.clr = { rows: full, t: 0.28 };
      const pts = PTS[full.length] * s.level; s.score = Math.min(9999999, s.score + pts);
      s.pops.push({ txt: full.length === 4 ? "WOOF! +" + pts : "+" + pts, t: 1.1 });
      if (full.length === 4) { s.pog = 1.8; G.sfx("win"); G.buzz(); } else G.sfx("pop");
    } else { spawn(G); }
  }
  function finishClear(G) {
    const s = G.s, rows = s.clr.rows; s.clr = null;
    for (let i = 0; i < rows.length; i++) { s.board.splice(rows[i], 1); s.board.unshift(new Array(COLS).fill(null)); }
    const before = s.level; s.lines += rows.length; s.level = 1 + Math.floor(s.lines / 10);
    if (s.level > before) s.pops.push({ txt: "LEVEL " + s.level, t: 1.3 });
    spawn(G);
  }
  function stackTop(s) { for (let r = 0; r < s.rows; r++) for (let c = 0; c < COLS; c++) if (s.board[r][c]) return r; return s.rows; }
  function btnAt(L, x, y) { for (let i = 0; i < 4; i++) { const b = L.btns[i]; if (x >= b.x - 4 && x <= b.x + b.w + 4 && y >= b.y - 6 && y <= b.y + b.h + 8) return i; } return -1; }
  function press(G, i) {
    const s = G.s; s.hot = i; s.hotT = 0.12;
    if (i === 0 || i === 2) { const d = i === 0 ? -1 : 1; move(G, d); s.rep = { d, t: 0.2 }; }
    else if (i === 1) rotate(G);
    else if (i === 3) hardDrop(G);
  }

  // ---- drawing ----
  function tile(c, x, y, z, t, alpha) {
    const k = COL[t]; if (alpha) c.globalAlpha = alpha;
    const b = Math.max(2, Math.round(z * 0.14));
    c.fillStyle = k[2]; c.fillRect(x, y, z, z);
    c.fillStyle = k[1]; c.fillRect(x, y, z - 1, z - 1);
    c.fillStyle = k[0]; c.fillRect(x + b, y + b, z - b * 2 - 1, z - b * 2 - 1);
    // paw print
    const cx = x + z / 2, cy = y + z / 2 + z * 0.08, u = z / 20;
    c.fillStyle = k[2];
    c.beginPath(); c.ellipse(cx, cy + u * 2, u * 3.4, u * 2.7, 0, 0, 7); c.fill();
    c.beginPath(); c.arc(cx - u * 3.8, cy - u * 1.6, u * 1.4, 0, 7); c.fill();
    c.beginPath(); c.arc(cx - u * 1.3, cy - u * 3.9, u * 1.4, 0, 7); c.fill();
    c.beginPath(); c.arc(cx + u * 1.3, cy - u * 3.9, u * 1.4, 0, 7); c.fill();
    c.beginPath(); c.arc(cx + u * 3.8, cy - u * 1.6, u * 1.4, 0, 7); c.fill();
    if (alpha) c.globalAlpha = 1;
  }
  function drawMatrix(c, m, t, x, y, z) {
    const n = m.length;
    for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) if (m[r][q]) tile(c, x + q * z, y + r * z, z, t);
  }
  function drawIcon(c, i, cx, cy, sz, col) {
    c.fillStyle = col; c.strokeStyle = col; c.lineWidth = Math.max(3, sz * 0.16); c.lineCap = "round"; c.lineJoin = "round";
    const h = sz / 2;
    if (i === 0 || i === 2) {
      const d = i === 0 ? -1 : 1;
      c.beginPath(); c.moveTo(cx + d * h * 0.8, cy); c.lineTo(cx - d * h * 0.6, cy - h * 0.8); c.lineTo(cx - d * h * 0.6, cy + h * 0.8); c.closePath(); c.fill();
    } else if (i === 1) {
      c.beginPath(); c.arc(cx, cy, h * 0.62, -Math.PI * 0.35, Math.PI * 1.25); c.stroke();
      const a = -Math.PI * 0.35, ex = cx + Math.cos(a) * h * 0.62, ey = cy + Math.sin(a) * h * 0.62;
      c.beginPath(); c.moveTo(ex + h * 0.42, ey - h * 0.05); c.lineTo(ex - h * 0.12, ey - h * 0.42); c.lineTo(ex - h * 0.05, ey + h * 0.3); c.closePath(); c.fill();
    } else {
      c.beginPath(); c.moveTo(cx, cy - h * 0.8); c.lineTo(cx, cy + h * 0.1); c.stroke();
      c.beginPath(); c.moveTo(cx - h * 0.6, cy - h * 0.15); c.lineTo(cx + h * 0.6, cy - h * 0.15); c.lineTo(cx, cy + h * 0.5); c.closePath(); c.fill();
      c.fillRect(cx - h * 0.7, cy + h * 0.62, h * 1.4, Math.max(3, sz * 0.13));
    }
  }

  defGame({
    key: "blocks", name: "Block Dawg", icon: "🧱", max: 9999999,
    blurb: "Stack the blocks. Clear the lines.",
    how: "Shapes fall into the well. Fill a whole row to clear it. Buttons: move ◀ ▶, rotate ⟳, drop ⤓. Or swipe left/right to move, swipe down to drop, tap the well to rotate. 4 lines at once = big points. Don't let the stack reach the top!",
    reset(G) {
      const L = layout(G);
      const s = G.s = { L, rows: L.rows, board: [], bag: [], next: null, p: null, score: 0, lines: 0, level: 1,
        fall: 0, lock: 0, resets: 0, clr: null, pops: [], pog: 0, dead: false, rep: null, hot: -1, hotT: 0, thud: 0, onBtn: false };
      for (let r = 0; r < L.rows; r++) s.board.push(new Array(COLS).fill(null));
      s.next = nextType(s); spawn(G);
    },
    update(G, dt) {
      const s = G.s; if (s.dead) return;
      if (s.pog > 0) s.pog -= dt;
      if (s.hotT > 0) { s.hotT -= dt; if (s.hotT <= 0 && !s.rep) s.hot = -1; }
      if (s.thud > 0) s.thud -= dt;
      for (let i = s.pops.length - 1; i >= 0; i--) { s.pops[i].t -= dt; if (s.pops[i].t <= 0) s.pops.splice(i, 1); }
      if (s.clr) { s.clr.t -= dt; if (s.clr.t <= 0) finishClear(G); return; }
      if (!s.p) return;
      if (s.rep) { s.rep.t -= dt; if (s.rep.t <= 0) { s.rep.t = 0.065; move(G, s.rep.d); } }
      if (!s.p) return;
      const soft = s.soft;
      const g = soft ? Math.min(0.04, grav(s)) : grav(s);
      if (grounded(s)) {
        s.fall = 0; s.lock += dt;
        if (s.lock >= 0.5) lockPiece(G);
      } else {
        s.fall += dt;
        while (s.fall >= g && s.p && !grounded(s)) { s.fall -= g; s.p.y++; if (soft) s.score++; }
        if (s.p && grounded(s)) s.fall = 0;
      }
    },
    down(G, x, y) {
      const s = G.s; const i = btnAt(s.L, x, y);
      s.onBtn = i >= 0;
      if (i >= 0) press(G, i);
    },
    up(G) { const s = G.s; s.rep = null; if (s.hotT <= 0) s.hot = -1; },
    tap(G, x, y) {
      const s = G.s; if (s.onBtn) return;
      if (y < s.L.by - 6) rotate(G);
    },
    swipe(G, dx, dy) {
      const s = G.s; if (s.onBtn) return;
      if (dx) move(G, dx); else if (dy > 0) hardDrop(G); else if (dy < 0) rotate(G);
    },
    onKey(G, k, d) {
      const s = G.s;
      if (k === "ArrowDown" || k === "s") { s.soft = d; return; }
      if (!d) return;
      if (k === "ArrowLeft" || k === "a") move(G, -1);
      else if (k === "ArrowRight" || k === "d") move(G, 1);
      else if (k === "ArrowUp" || k === "w") rotate(G);
      else if (k === " ") hardDrop(G);
    },
    draw(G, c) {
      const s = G.s, L = s.L, W = G.W, H = G.H, dark = G.dark(), z = L.cell;
      // background: checker wallpaper
      c.fillStyle = dark ? "#1b1830" : "#ffe9c7"; c.fillRect(0, 0, W, H);
      c.fillStyle = dark ? "#221e3b" : "#ffdfb0";
      for (let y = 0; y < H; y += 32) for (let x = (y / 32) % 2 ? 16 : 0; x < W; x += 32) c.fillRect(x, y, 16, 16);
      // well
      const shake = s.thud > 0 ? 2 : 0, wx = L.wx, wy = L.wy + shake;
      c.fillStyle = dark ? "#5a4a8a" : "#7a4a2a"; c.fillRect(wx - 5, wy - 5, L.ww + 10, L.wh + 10);
      c.fillStyle = dark ? "#0d0b1a" : "#2a2238"; c.fillRect(wx, wy, L.ww, L.wh);
      c.fillStyle = dark ? "#16132a" : "#332a45";
      for (let r = 0; r < L.rows; r++) for (let q = 0; q < COLS; q++) if ((r + q) % 2) c.fillRect(wx + q * z, wy + r * z, z, z);
      // board
      const flash = s.clr && Math.floor(s.clr.t * 20) % 2 === 0;
      for (let r = 0; r < L.rows; r++) {
        const clearing = s.clr && s.clr.rows.indexOf(r) >= 0;
        for (let q = 0; q < COLS; q++) {
          const t = s.board[r][q]; if (!t) continue;
          if (clearing && flash) { c.fillStyle = "#fff"; c.fillRect(wx + q * z, wy + r * z, z, z); }
          else tile(c, wx + q * z, wy + r * z, z, t);
        }
      }
      // ghost + piece
      if (s.p) {
        c.save(); c.beginPath(); c.rect(wx, wy, L.ww, L.wh); c.clip();
        const gy = ghostY(s), n = s.p.m.length;
        if (gy !== s.p.y) {
          c.strokeStyle = COL[s.p.t][0]; c.lineWidth = 2; c.globalAlpha = 0.85;
          for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) if (s.p.m[r][q]) {
            c.fillStyle = "rgba(255,255,255,0.08)"; c.fillRect(wx + (s.p.x + q) * z + 2, wy + (gy + r) * z + 2, z - 4, z - 4);
            c.strokeRect(wx + (s.p.x + q) * z + 2, wy + (gy + r) * z + 2, z - 4, z - 4);
          }
          c.globalAlpha = 1;
        }
        drawMatrix(c, s.p.m, s.p.t, wx + s.p.x * z, wy + s.p.y * z, z);
        c.restore();
      }
      // side panel
      const px = L.px, pw = L.pw, txt = dark ? "#f4ecff" : "#4a2a14", sub = dark ? "#b9a8e8" : "#9a5a2a";
      let y = L.wy;
      G.text(c, "NEXT", px + pw / 2, y + 8, 10, sub);
      const bz = Math.min(pw - 8, z * 4 + 12), bx = px + (pw - bz) / 2, byy = y + 18;
      c.fillStyle = dark ? "#5a4a8a" : "#7a4a2a"; c.fillRect(bx - 3, byy - 3, bz + 6, bz * 0.7 + 6);
      c.fillStyle = dark ? "#0d0b1a" : "#2a2238"; c.fillRect(bx, byy, bz, bz * 0.7);
      if (s.next) {
        const m = SHAPES[s.next], n = m.length, pz = Math.floor(Math.min(z * 0.85, (bz - 10) / 4));
        let minR = n, maxR = -1, minC = n, maxC = -1;
        for (let r = 0; r < n; r++) for (let q = 0; q < n; q++) if (m[r][q]) { minR = Math.min(minR, r); maxR = Math.max(maxR, r); minC = Math.min(minC, q); maxC = Math.max(maxC, q); }
        const w = (maxC - minC + 1) * pz, h = (maxR - minR + 1) * pz;
        drawMatrix(c, m, s.next, bx + (bz - w) / 2 - minC * pz, byy + (bz * 0.7 - h) / 2 - minR * pz, pz);
      }
      y = byy + bz * 0.7 + 10;
      // the dawg
      const top = stackTop(s);
      const face = s.dead ? ":dawgpain:" : s.pog > 0 ? ":dawgpog:" : top < Math.max(5, L.rows * 0.3) ? ":dawgsweat:" : ":dawgW:";
      const fs = Math.min(pw - 10, 78), bob = s.pog > 0 ? Math.sin(G.t * 18) * 3 : Math.sin(G.t * 3) * 1.5;
      G.img(c, face, px + pw / 2, y + fs / 2 + bob, fs);
      y += fs + 14;
      const rows = [["LEVEL", "" + s.level], ["LINES", "" + s.lines]];
      for (let i = 0; i < rows.length; i++) {
        if (y + 28 > L.wy + L.wh) break;
        G.text(c, rows[i][0], px + pw / 2, y, 9, sub); G.text(c, rows[i][1], px + pw / 2, y + 15, 13, txt); y += 38;
      }
      // pops
      for (let i = 0; i < s.pops.length; i++) {
        const p = s.pops[i], a = Math.min(1, p.t * 3);
        c.globalAlpha = a;
        G.text(c, p.txt, wx + L.ww / 2 + 1, wy + L.wh * 0.4 - (1.2 - p.t) * 30 + 1, 13, "#000");
        G.text(c, p.txt, wx + L.ww / 2, wy + L.wh * 0.4 - (1.2 - p.t) * 30, 13, "#ffd23f");
        c.globalAlpha = 1;
      }
      // buttons
      for (let i = 0; i < 4; i++) {
        const b = L.btns[i], on = s.hot === i, dy = on ? 3 : 0;
        c.fillStyle = dark ? "#0b0916" : "#7a4a2a"; c.fillRect(b.x, b.y + 4, b.w, b.h);
        c.fillStyle = i === 3 ? (on ? "#e2402f" : "#ff5a5a") : i === 1 ? (on ? "#2f9a2f" : "#5ccf5c") : (on ? "#d9a812" : "#ffd23f");
        c.fillRect(b.x, b.y + dy, b.w, b.h);
        c.fillStyle = "rgba(255,255,255,0.35)"; c.fillRect(b.x, b.y + dy, b.w, 4);
        drawIcon(c, i, b.x + b.w / 2, b.y + dy + b.h / 2, Math.min(b.h, b.w) * 0.58, "#3a1f0e");
      }
      // HUD
      c.fillStyle = "rgba(0,0,0,0.4)"; c.fillRect(0, 0, W, L.hud);
      G.text(c, `SCORE ${s.score}`, 10, 15, 11, "#fff", "left");
      G.text(c, `LV ${s.level}`, W - 10, 15, 11, "#ffd23f", "right");
    }
  });
})();

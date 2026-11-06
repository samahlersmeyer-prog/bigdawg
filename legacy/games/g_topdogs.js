function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var PUZ = [{
    "n": 7,
    "r": "gcccadbgcccddbggccdddgccfdddgeffdddggfffffggfffff"
  }, {
    "n": 8,
    "r": "aaabbbeeabbbeeeecbbbbeeefbbddeeefffeeeeefffeeeegfffeeeegffeehhhg"
  }, {
    "n": 8,
    "r": "eeeeaaaaeeeaaaabeeeeccaaeeeddddaeeeeddffeeeeefffgeeeefffghhheeff"
  }, {
    "n": 9,
    "r": "aabbbddddaabbdddddacdbdddddadddddddgaeedddddgeeddddfggeedddhhgghhhddhhhhhhhhhhhii"
  }, {
    "n": 8,
    "r": "accdddddcccccbddeecccdddeeeefdddeeeefdddeeeffhddggeefhddgggghhhd"
  }, {
    "n": 7,
    "r": "caaaabbcccaabbcccddbbcccddbfcceddffcdddddfccggddf"
  }, {
    "n": 8,
    "r": "ccdaaaabccdaaabbcfdddddbffdddgdbffffegggffffggggffffggggfffffggh"
  }, {
    "n": 7,
    "r": "dbbccaadbbbccadbbecccdffeecedffeeeeffffeeeffffeeg"
  }, {
    "n": 8,
    "r": "bbbbbaaabbbbbaaabbbbddcabbdddgggggeeffgggggfffgggggggggghggggggg"
  }, {
    "n": 8,
    "r": "bbbbacddbbbbacddebbcccddeeecddddeeeeedddefeeedddffeeedgghheegggg"
  }, {
    "n": 9,
    "r": "aaaaaddddaaaabddddcaaafddddcfffffdddeeffffggdiiifffgggiiifhhgggiiiihhhggiiiiigggg"
  }, {
    "n": 8,
    "r": "caabbeeeccbbeeeeccbbeeeecgdeeeeegggeeeeeggggggefgggggghhgggggghh"
  }, {
    "n": 7,
    "r": "ebbbbacebbbbccebbbbcceeffddcgefffffgffffffggggfff"
  }, {
    "n": 8,
    "r": "acccccbbacccccebccccceeeccddeeeeccfdeeegccfeegggccheegggcchhhhgg"
  }, {
    "n": 7,
    "r": "ccbbaaccccbccccccccccdddeeeeddeeeeegdffeeegggfffe"
  }, {
    "n": 8,
    "r": "cccccbbacccccbbbccccebdbffceeeddffeeeeeefffeegggffeegggghfeegggg"
  }, {
    "n": 8,
    "r": "eeebccaadeebccaadeebcccadeeeeccaddeeeccaffhheccgfhhheccghhheeggg"
  }, {
    "n": 9,
    "r": "bbbbbbaaadbbbbbbbcdbbbbbbbcdddddbbbbfdfddbebbfffgbbebbhffgbbebbhhhggbggghhigggggg"
  }, {
    "n": 8,
    "r": "cbbaaabdcbbbbbbdcccbbbbdcccbddddcccddddefgcgdeeefgggddeehhggdddd"
  }, {
    "n": 7,
    "r": "abbcdddbbbccddeeeccddeeeecddeeeeeffgeeefffggeefff"
  }, {
    "n": 8,
    "r": "bbbbbaaabbbbbaaedbbbbgcedfggggeedfggggeeffhhggeehhhhgggghhhhgggg"
  }, {
    "n": 7,
    "r": "aaaaaabaaaaabbdaeccbbdeeeccedeeeeeedefeeeedeeeeeg"
  }, {
    "n": 8,
    "r": "eeeebaaaeeebbbaaeeedbbaceeedffffeeffffffefffffffhfffggffhhhggggg"
  }, {
    "n": 8,
    "r": "bcccaaaebcccfffeddccffeeddccffeedfffffeedhfffeeehhhhfegehhhhfeee"
  }, {
    "n": 9,
    "r": "aaaaaaaaabaaaaaaccaaeeegccceeeeggdcceeeegggggeeefgggggeeeggggghegggggghhggggigggh"
  }, {
    "n": 8,
    "r": "bbbbbccabbbbccccbbbcccccbbdccccceedcgccfgggggfffggggffffgggggfhh"
  }, {
    "n": 7,
    "r": "caaaeeeccfbbeeccfbdeeccffdeeffffeeefffffeefffggge"
  }, {
    "n": 8,
    "r": "bbbbbaaabbbbbbaaddbbbecaddbbeeeaddbbeeeaffbeeeeeffggeeeeggggheee"
  }, {
    "n": 7,
    "r": "aabbccebbbbccebcccceeddeeccedeeeeeeddefeegdfffeeg"
  }, {
    "n": 8,
    "r": "dddbbbcafddbbbccfddbbbccfddbbcccfdddbeeefffeeeeeffggeeeehggggeee"
  }, {
    "n": 8,
    "r": "cccccbaaccccfbbbccccffddccccffddecffffddggfffhddgggffhhhggffhhhh"
  }, {
    "n": 9,
    "r": "ccccccaccbbbbcccccbbfbcccccbdffccccefffffffeehfffffeeehfffffggehhhffffgeihhfffeee"
  }, {
    "n": 8,
    "r": "aaaaaabbaaaaacbbaaaaacbbaaadcccbeeeecfffegeecfffggghffffghhhffff"
  }, {
    "n": 7,
    "r": "bbbaaadbbaaaadbbcdaddeedddddeeeddddeeedffgeeeddgg"
  }, {
    "n": 8,
    "r": "bbbeeeaabbbeeeaabbbeeecabbdeeecefeeeeeeefeeeegggffeeegggffhhhggg"
  }, {
    "n": 7,
    "r": "aaaabbbaacabbbaacabbbaeaabdbgefffdbgfffffbggffffb"
  }, {
    "n": 8,
    "r": "ddddaccbdddddccbddddcccbddddccceddddcceegddffceeggghfceegghhccce"
  }, {
    "n": 8,
    "r": "bbbaccccbbbfffccbbbfffccdbeeffffeeeefgggfffefgggfffffgggfffffhgg"
  }, {
    "n": 9,
    "r": "aaaaccccceaaaccccbeeeeecccceedeeeccceeggccccceeggffiiieeggggiiieeggiiihhgggiiiiih"
  }, {
    "n": 8,
    "r": "eebbbaaaeebbbbaaecdbbbaaeedddggaeddddgggeddfdggghhhfgggghhhggggg"
  }, {
    "n": 7,
    "r": "aaabbbbaccbbbbcccbbbbdcfffeefffffeefffffeeffffffg"
  }, {
    "n": 8,
    "r": "aaabbbbbaddbbbbbccdbbbbbcdddebbbddddeeeedddddeffddddgghhdddggghh"
  }, {
    "n": 7,
    "r": "daaaaabdaaaabbddaecebfddeeeefddeeeefddeeeeffgeeee"
  }, {
    "n": 8,
    "r": "bbccacccbdcccccfdddccfffddffffffddffggegddffggggdfffggggffffgggh"
  }, {
    "n": 8,
    "r": "aabdddccbbbddddcdddddeecddddeeeeddddffeeddffffeedgfffffedgfffhhe"
  }, {
    "n": 9,
    "r": "dddfbbbaadddffbbcaddfffbbcaddffffbeeggffffeeegffffffeegggfiffiihggfiiiiihhiiiiiii"
  }, {
    "n": 8,
    "r": "faaaaabbfffffddbcefffdddgeffffddgeffffddgggggfffgggggfffggghhhhh"
  }, {
    "n": 7,
    "r": "fcccbaaffccbaeffccceedfccceedffceeefffffeefffgggg"
  }, {
    "n": 8,
    "r": "cccccabbccccccbbcccccceeccdcceeefggceeeeffggeeeeffgggeeehffggeee"
  }, {
    "n": 7,
    "r": "ddddbaaddddbbbcdddbbbddddddddeeddddggggfffgggggff"
  }, {
    "n": 8,
    "r": "cccccaaaccccbbaacccccbbbeecccbdbeeefffffgggfffffgggfffffhgggggff"
  }, {
    "n": 8,
    "r": "aabbbbbbaabbbbbbcbbbbbbbcbbbdeeecbbbbeeecbgbfffeggggghhhggggghhh"
  }, {
    "n": 9,
    "r": "ccddaaaaaccddaaabfcddddffffdddddffffeeeeeffffeeeegffffeeggggfffgggghhfffgggghhiif"
  }, {
    "n": 8,
    "r": "bbbbaaaabbbbcaaabbbcceeedbfceeeefffffeeefffffeeefffffgggffffgggh"
  }, {
    "n": 7,
    "r": "aaaebbbcaeebbbcaeebbbcceebbdgggeebdffggeedggggeee"
  }, {
    "n": 8,
    "r": "bbbbbaacbbbbbaacffbbeaacffbbedddffbeeeedfeeeeeeeffgeehhhfhhhhhhh"
  }, {
    "n": 7,
    "r": "aaabbbbcaadbbbccddbbbccdddddccdddeefddddeefddddge"
  }, {
    "n": 8,
    "r": "ffaabbbcffadbbbcffddeeccffdgeeeeffgggeeeffgggggghffggggghggggggg"
  }, {
    "n": 8,
    "r": "bbaabbbbbbbbbbbbbecbddddeeebddddeeeegdddeegggddfeegggghheegggghh"
  }, {
    "n": 9,
    "r": "bbbbbaaaabbbbaaaaabbbbbbcaabbbbbedddbbbbeeeddfffbeeeeeffffegeeehfffeeeeehiifeeeee"
  }];
  var TINT = ["#f7b2b2", "#a8d8f0", "#b8e3a3", "#f9dd8a", "#d4bff2", "#f8c49b", "#9fe3d4", "#f2b6dc", "#d7d7a8"];
  var TINT_DK = ["#7a4b4b", "#3e6378", "#4f6e42", "#7a6a35", "#5d4c7a", "#7a5838", "#35706a", "#7a4a66", "#66663f"];
  var dayN = function dayN() {
    var _KEY$split$map = KEY.split("-").map(Number),
      _KEY$split$map2 = _slicedToArray(_KEY$split$map, 3),
      y = _KEY$split$map2[0],
      m = _KEY$split$map2[1],
      d = _KEY$split$map2[2];
    return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 9, 27)) / 864e5);
  };
  var pz = function pz() {
    return PUZ[(dayN() % PUZ.length + PUZ.length) % PUZ.length];
  };
  var rk = function rk() {
    return "bdd:den:topdogs:" + KEY + ":" + (me ? me.id : "");
  };
  var rr = function rr(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r);else c.rect(x, y, w, h);
  };
  var mmss = function mmss(t) {
    return "".concat(Math.floor(t / 60), ":").concat(String(Math.floor(t % 60)).padStart(2, "0"));
  };
  var speed = function speed(sec, limit, pts) {
    return Math.round(pts * Math.max(0, 1 - sec / limit));
  };
  var scoreOf = function scoreOf(el) {
    return 700 + speed(el, 300, 300);
  };
  defGame({
    key: "topdogs",
    name: "Top Dogs",
    icon: "👑",
    max: 1000,
    cat: "den",
    puzzle: true,
    blurb: "Daily: one dog per row, column and color.",
    how: "Place a 🐶 so every row, every column and every colored area has exactly one dog. Dogs can't touch each other, not even diagonally. Tap a square once to mark it ✕ (no dog here), twice for a dog, three times to clear. A new board every day, one go, and there's only one answer. Score: 700 for solving, plus a bonus of up to 300 for going quick. No clock on screen, so take your time.",
    reset: function reset(G) {
      var p = pz(),
        n = p.n,
        s = G.s = {
          n: n,
          reg: p.r.split("").map(function (ch) {
            return ch.charCodeAt(0) - 97;
          }),
          btns: [],
          hist: [],
          msg: "",
          msgT: 0,
          postT: 0
        };
      var r = store.get(rk());
      Object.assign(s, r && r.g ? {
        g: r.g.slice(),
        el: r.el || 0,
        done: !!r.done,
        posted: !!r.posted
      } : {
        g: new Array(n * n).fill(0),
        el: 0,
        done: false,
        posted: false
      });
    },
    persist: function persist(G) {
      var s = G.s;
      store.set(rk(), {
        g: s.g,
        el: s.el,
        done: s.done,
        posted: s.posted,
        score: s.done ? scoreOf(s.el) : 0
      });
    },
    info: function info(G) {
      var s = G.s,
        sc = scoreOf(s.el);
      return {
        score: sc,
        title: s.el < 60 ? "Speedy! 🐶" : "Solved!",
        sub: "Top Dogs in ".concat(mmss(s.el), " \xB7 ").concat(sc, " pts."),
        share: "Top Dogs #".concat(dayN() + 1, " \xB7 ").concat(mmss(s.el), " \uD83D\uDC51")
      };
    },
    bad: function bad(s) {
      var n = s.n,
        out = new Set(),
        dogs = [];
      s.g.forEach(function (v, i) {
        if (v === 2) dogs.push(i);
      });
      for (var a = 0; a < dogs.length; a++) for (var b = a + 1; b < dogs.length; b++) {
        var i = dogs[a],
          j = dogs[b],
          ri = Math.floor(i / n),
          ci = i % n,
          rj = Math.floor(j / n),
          cj = j % n;
        if (ri === rj || ci === cj || s.reg[i] === s.reg[j] || Math.abs(ri - rj) <= 1 && Math.abs(ci - cj) <= 1) {
          out.add(i);
          out.add(j);
        }
      }
      return out;
    },
    check: function check(G) {
      var s = G.s,
        dogs = s.g.filter(function (v) {
          return v === 2;
        }).length;
      if (dogs === s.n && !this.bad(s).size) {
        s.done = true;
        s.postT = 1.2;
        G.sfx("win");
        s.msg = "Solved!";
        s.msgT = 1.5;
      }
      this.persist(G);
    },
    update: function update(G, dt) {
      var s = G.s;
      if (s.msgT > 0) s.msgT -= dt;
      if (!s.done) {
        s.el += dt;
        s.ck = (s.ck || 0) + dt;
        if (s.ck > 2) {
          s.ck = 0;
          this.persist(G);
        }
      }
      if (s.done && !s.posted && s.postT > 0) {
        s.postT -= dt;
        if (s.postT <= 0) {
          s.posted = true;
          this.persist(G);
          G.post(scoreOf(s.el), this.info(G));
        }
      }
    },
    draw: function draw(G, c) {
      var s = G.s,
        dk = G.dark(),
        n = s.n,
        ink = dk ? "#fff" : "#121213";
      c.fillStyle = dk ? "#121213" : "#fff";
      c.fillRect(0, 0, G.W, G.H);
      s.btns = [];
      c.fillStyle = ink;
      c.font = "500 15px ".concat(G.UI);
      c.textAlign = "left";
      c.textBaseline = "middle";
      c.fillText(s.done ? "Solved! 🐶" : "One 🐶 per row, column & color", 14, 22);
      var N = Math.min(G.W - 24, G.H - 170),
        cs = N / n,
        ox = (G.W - N) / 2,
        oy = 46,
        bad = this.bad(s);
      for (var i = 0; i < n * n; i++) {
        var x = ox + i % n * cs,
          y = oy + Math.floor(i / n) * cs;
        c.fillStyle = (dk ? TINT_DK : TINT)[s.reg[i] % 9];
        c.fillRect(x, y, cs, cs);
        if (bad.has(i)) {
          c.fillStyle = "rgba(229,57,53,0.45)";
          c.fillRect(x, y, cs, cs);
        }
        if (s.g[i] === 1) {
          c.strokeStyle = dk ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.45)";
          c.lineWidth = 2;
          var k = cs * 0.16;
          c.beginPath();
          c.moveTo(x + cs / 2 - k, y + cs / 2 - k);
          c.lineTo(x + cs / 2 + k, y + cs / 2 + k);
          c.moveTo(x + cs / 2 + k, y + cs / 2 - k);
          c.lineTo(x + cs / 2 - k, y + cs / 2 + k);
          c.stroke();
        }
        if (s.g[i] === 2) G.img(c, s.done ? ":dawgW:" : ":dawgpog:", x + cs / 2, y + cs / 2, cs * 0.78);
      }
      c.strokeStyle = dk ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0.12)";
      c.lineWidth = 1;
      for (var _k = 1; _k < n; _k++) {
        c.beginPath();
        c.moveTo(ox + _k * cs, oy);
        c.lineTo(ox + _k * cs, oy + N);
        c.moveTo(ox, oy + _k * cs);
        c.lineTo(ox + N, oy + _k * cs);
        c.stroke();
      }
      c.strokeStyle = ink;
      c.lineWidth = 2.5;
      c.beginPath();
      for (var _i = 0; _i < n * n; _i++) {
        var r = Math.floor(_i / n),
          q = _i % n,
          _x = ox + q * cs,
          _y = oy + r * cs;
        if (q < n - 1 && s.reg[_i] !== s.reg[_i + 1]) {
          c.moveTo(_x + cs, _y);
          c.lineTo(_x + cs, _y + cs);
        }
        if (r < n - 1 && s.reg[_i] !== s.reg[_i + n]) {
          c.moveTo(_x, _y + cs);
          c.lineTo(_x + cs, _y + cs);
        }
      }
      c.stroke();
      c.lineWidth = 3;
      c.strokeRect(ox, oy, N, N);
      s.btns.push({
        x: ox,
        y: oy,
        w: N,
        h: N,
        grid: [ox, oy, cs]
      });
      var by = oy + N + 16,
        bw = (G.W - 40) / 2;
      if (!s.done) {
        s.btns.push(Object.assign(G.pill(c, 16, by, bw, 46, "Undo", false, !s.hist.length), {
          k: "undo"
        }));
        s.btns.push(Object.assign(G.pill(c, 24 + bw, by, bw, 46, "Clear", false, !s.g.some(function (v) {
          return v;
        })), {
          k: "clear"
        }));
        c.fillStyle = dk ? "#aaa" : "#666";
        c.font = "400 13px ".concat(G.UI);
        c.textAlign = "center";
        c.fillText("Tap once for ✕, twice for a dog", G.W / 2, by + 66);
      } else if (s.posted) {
        var w = Math.min(260, G.W - 40);
        s.btns.push(Object.assign(G.pill(c, G.W / 2 - w / 2, by, w, 46, "See results \xB7 ".concat(mmss(s.el)), true), {
          k: "res"
        }));
      }
      if (s.msgT > 0 && s.msg) {
        c.save();
        c.globalAlpha = Math.min(1, s.msgT * 2);
        c.font = "600 15px ".concat(G.UI);
        c.textAlign = "center";
        var _w = c.measureText(s.msg).width + 30;
        c.fillStyle = dk ? "#fff" : "#121213";
        rr(c, G.W / 2 - _w / 2, oy + N / 2 - 19, _w, 38, 8);
        c.fill();
        c.fillStyle = dk ? "#121213" : "#fff";
        c.fillText(s.msg, G.W / 2, oy + N / 2);
        c.restore();
      }
    },
    tap: function tap(G, x, y) {
      var s = G.s,
        b = s.btns.find(function (b) {
          return x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h;
        });
      if (!b) return;
      if (b.k === "res") return G.results(this.info(G));
      if (s.done) return;
      if (b.grid) {
        var _b$grid = _slicedToArray(b.grid, 3),
          ox = _b$grid[0],
          oy = _b$grid[1],
          cs = _b$grid[2],
          i = Math.min(s.n - 1, Math.floor((y - oy) / cs)) * s.n + Math.min(s.n - 1, Math.floor((x - ox) / cs));
        s.hist.push([i, s.g[i]]);
        s.g[i] = (s.g[i] + 1) % 3;
        if (s.g[i] === 2) G.sfx("pop");
        return this.check(G);
      }
      if (b.k === "undo") {
        var h = s.hist.pop();
        if (h) s.g[h[0]] = h[1];
        return this.persist(G);
      }
      if (b.k === "clear") {
        s.hist = [];
        s.g = s.g.map(function () {
          return 0;
        });
        return this.persist(G);
      }
    }
  });
})();
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
(function () {
  var CH = ["SNOW BALL PARK WAY SIDE WALK OUT", "HOME RUN WAY SIDE KICK BACK PACK", "SUN LIGHT HOUSE BOAT YARD STICK SHIFT", "DOG HOUSE WORK OUT SIDE LINE BACKER", "HOT DOG BONE HEAD BAND WAGON WHEEL", "FOOT BALL GAME DAY BREAK FAST FOOD", "BOOK CASE WORK SHOP LIFT OFF SIDE", "RAIN DROP KICK STAND OFF SHORE LINE", "TOOTH BRUSH FIRE WORK OUT LAW SUIT", "BACK FIRE TRUCK STOP WATCH DOG TAG", "PEANUT BUTTER CUP CAKE WALK WAY POINT", "ICE BOX CAR POOL SIDE KICK OFF", "STAR FISH BOWL GAME DAY LIGHT HOUSE", "HEAD LINE UP BEAT DOWN TOWN HALL", "PAN CAKE MIX TAPE WORM HOLE PUNCH", "SKATE BOARD ROOM SERVICE DOG FOOD COURT", "BLUE BIRD HOUSE FLY BALL PARK BENCH", "HAND SHAKE DOWN TOWN HOUSE PARTY LINE", "HIGH JUMP SHOT GUN POWDER ROOM MATE", "POP CORN FIELD GOAL POST CARD TRICK", "MOON WALK OVER TIME OUT FIELD TRIP", "BIRTH DAY DREAM TEAM WORK BENCH PRESS", "SAND BOX OFFICE CHAIR LIFT GATE WAY", "HONEY BEE HIVE MIND SET POINT GUARD", "FREE THROW BACK BONE DRY CLEAN UP", "GRAND STAND UP DATE NIGHT CLUB HOUSE", "CHECK BOOK MARK DOWN HILL SIDE CAR", "SWEET HEART BEAT BOX SPRING TRAINING CAMP", "MILK SHAKE DOWN FALL BACK FIELD HOUSE", "EAR RING LEADER BOARD GAME TIME OUT", "WATER SLIDE SHOW TIME LINE DRIVE WAY", "TAIL GATE WAY BACK PACK RAT RACE", "BULL PEN KNIFE POINT GUARD RAIL ROAD", "NIGHT CAP STONE WALL PAPER BACK SPIN", "FISH HOOK SHOT CLOCK WORK HORSE SHOE", "BLACK OUT FIELD DAY TIME ZONE DEFENSE", "CAMP FIRE PLACE KICK BACK ROAD TRIP", "SPRING BREAK DANCE FLOOR BOARD ROOM KEY", "SEA HORSE POWER PLAY BOOK WORM HOLE", "COW BELL HOP SCOTCH TAPE DECK HAND", "PIG PEN NAME TAG LINE UP SET", "TOP HAT TRICK PLAY DATE LINE COOK", "APPLE SAUCE PAN HANDLE BAR CODE NAME", "MAIL BOX CAR WASH OUT LAW FIRM", "COFFEE MUG SHOT GLASS HOUSE CAT NAP", "EYE BROW BEAT BOX CAR PORT HOLE", "HORSE BACK DOOR BELL BOTTOM LINE MAN", "SUPER BOWL CUT OFF SEASON TICKET BOOTH", "SLAM DUNK TANK TOP DOG HOUSE PLANT", "HALF TIME TABLE TOP SECRET SERVICE DOG", "FLASH LIGHT YEAR BOOK END ZONE OUT", "LADY BUG SPRAY PAINT BALL BOY BAND", "COUCH POTATO CHIP SHOT GUN FIGHT CLUB", "DRAGON FLY PAPER WEIGHT ROOM KEY CHAIN", "PLAY GROUND HOG WASH OUT DOOR MAT", "CANDY CORN DOG FIGHT NIGHT SHIFT WORK", "THUNDER STORM DRAIN PIPE LINE UP ROAR", "GINGER BREAD BOX SCORE CARD BOARD GAME", "BEACH FRONT DOOR STEP CHILD HOOD", "PUMPKIN PATCH WORK SHOP TALK SHOW DOWN"].map(function (s) {
    return s.split(" ");
  });
  var dayN = function dayN() {
    var _KEY$split$map = KEY.split("-").map(Number),
      _KEY$split$map2 = _slicedToArray(_KEY$split$map, 3),
      y = _KEY$split$map2[0],
      m = _KEY$split$map2[1],
      d = _KEY$split$map2[2];
    return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 10, 4)) / 864e5);
  };
  var pIdx = function pIdx() {
    return (dayN() % CH.length + CH.length) % CH.length;
  };
  var rk = function rk() {
    return "bdd:den:links:" + KEY + ":" + (me ? me.id : "");
  };
  var rr = function rr(c, x, y, w, h, r) {
    c.beginPath();
    if (c.roundRect) c.roundRect(x, y, w, h, r);else c.rect(x, y, w, h);
  };
  var mmss = function mmss(t) {
    return "".concat(Math.floor(t / 60), ":").concat(String(Math.floor(t % 60)).padStart(2, "0"));
  };
  var KB = ["QWERTYUIOP", "ASDFGHJKL", ">ZXCVBNM<"];
  var HID = [1, 2, 3, 4, 5];
  var extra = function extra(s) {
    return HID.reduce(function (a, i) {
      return a + s.rev[i] - 1;
    }, 0);
  };
  var scoreOf = function scoreOf(s) {
    return Math.max(100, 900 - 40 * extra(s)) + Math.round(100 * Math.max(0, 1 - s.el / 600));
  };
  var tile = function tile(s, i) {
    var n = s.rev[i] - 1,
      w = s.w[i].length;
    return s.rev[i] >= w ? "⬛" : n === 0 ? "🟩" : n <= 2 ? "🟨" : "🟧";
  };
  defGame({
    key: "links",
    name: "Dawg Links",
    icon: "🔗",
    max: 1000,
    cat: "den",
    puzzle: true,
    blurb: "Daily: link the chain, one compound at a time.",
    how: "Seven words in a chain. Each word plus the next one makes a compound word or phrase: SNOW → BALL (snowball) → PARK (ballpark) → WAY (parkway)… The top and bottom words are given, and every word in between shows its first letter. Tap a row, type your guess, and hit Enter. A wrong guess shows one more letter; stuck? Hint shows one too. Work from either end. Every chain can be finished, and you get one per day. Score: 900 for finishing, minus 40 for every extra letter shown, plus up to 100 for going quick. No clock on screen.",
    reset: function reset(G) {
      var w = CH[pIdx()],
        s = G.s = {
          w: w,
          sel: 1,
          typed: "",
          msg: "",
          msgT: 0,
          shake: 0,
          btns: [],
          postT: 0,
          flash: -1,
          flashT: 0
        };
      var r = store.get(rk());
      if (r && r.rev) Object.assign(s, {
        rev: r.rev,
        ok: r.ok,
        el: r.el || 0,
        done: r.done,
        posted: r.posted
      });else Object.assign(s, {
        rev: w.map(function (x, i) {
          return HID.includes(i) ? 1 : x.length;
        }),
        ok: w.map(function (x, i) {
          return !HID.includes(i);
        }),
        el: 0,
        done: false
      });
      s.sel = this.next(s, 1);
    },
    persist: function persist(G) {
      var s = G.s;
      store.set(rk(), {
        rev: s.rev,
        ok: s.ok,
        el: s.el,
        done: s.done,
        posted: s.posted,
        score: s.done ? scoreOf(s) : 0
      });
    },
    next: function next(s, from) {
      for (var d = 0; d < 7; d++) {
        var i = HID[(HID.indexOf(from) + d + HID.length) % HID.length];
        if (i !== undefined && !s.ok[i]) return i;
      }
      return HID.find(function (i) {
        return !s.ok[i];
      }) || -1;
    },
    info: function info(G) {
      var s = G.s,
        grid = HID.map(function (i) {
          return tile(s, i);
        }).join(""),
        sc = scoreOf(s),
        ex = extra(s);
      return {
        score: sc,
        grid: grid,
        title: ex === 0 ? "Perfect chain! 🐶" : "Chain linked!",
        sub: "".concat(s.w[0], " to ").concat(s.w[6], " in ").concat(mmss(s.el), " with ").concat(ex, " extra letter").concat(ex === 1 ? "" : "s", " shown. ").concat(sc, " pts."),
        share: "Dawg Links #".concat(dayN() + 1, " ").concat(ex === 0 ? "perfect" : ex + " extra", "\n").concat(s.w[0], " ").concat(grid, " ").concat(s.w[6])
      };
    },
    solve: function solve(G, i, given) {
      var s = G.s;
      s.ok[i] = true;
      if (!given) {
        s.flash = i;
        s.flashT = 0.6;
        G.sfx("pop");
      }
      s.typed = "";
      if (HID.every(function (j) {
        return s.ok[j];
      })) {
        s.done = true;
        s.sel = -1;
        s.postT = 1.2;
        s.msg = extra(s) ? "Linked!" : "Perfect!";
        s.msgT = 1.4;
        G.sfx("win");
      } else s.sel = this.next(s, i);
      this.persist(G);
    },
    reveal: function reveal(G, i) {
      var s = G.s;
      s.rev[i]++;
      s.typed = s.typed.slice(0, Math.max(0, s.w[i].length - s.rev[i]));
      if (s.rev[i] >= s.w[i].length) {
        s.msg = s.w[i];
        s.msgT = 1.4;
        this.solve(G, i, true);
      } else this.persist(G);
    },
    enter: function enter(G) {
      var s = G.s,
        i = s.sel;
      if (s.done || i < 0) return;
      var word = s.w[i],
        need = word.length - s.rev[i];
      if (s.typed.length < need) {
        s.msg = "Not enough letters";
        s.msgT = 1.2;
        s.shake = 0.35;
        return;
      }
      if (word.slice(0, s.rev[i]) + s.typed === word) return this.solve(G, i);
      s.shake = 0.4;
      G.buzz();
      s.msg = "Not it. Here's a letter.";
      s.msgT = 1.4;
      s.typed = "";
      this.reveal(G, i);
    },
    press: function press(G, k) {
      var s = G.s;
      if (s.done || s.sel < 0) return;
      if (k === ">") return this.enter(G);
      if (k === "<") {
        s.typed = s.typed.slice(0, -1);
        return;
      }
      var need = s.w[s.sel].length - s.rev[s.sel];
      if (s.typed.length < need) s.typed += k;
    },
    update: function update(G, dt) {
      var s = G.s;
      if (!s.done) {
        s.el += dt;
        s.ck = (s.ck || 0) + dt;
        if (s.ck > 2) {
          s.ck = 0;
          this.persist(G);
        }
      }
      if (s.msgT > 0) s.msgT -= dt;
      if (s.shake > 0) s.shake -= dt;
      if (s.flashT > 0) s.flashT -= dt;
      if (s.done && !s.posted && s.postT > 0) {
        s.postT -= dt;
        if (s.postT <= 0) {
          s.posted = true;
          this.persist(G);
          G.post(scoreOf(s), this.info(G));
        }
      }
    },
    draw: function draw(G, c) {
      var s = G.s,
        dk = G.dark(),
        ink = dk ? "#fff" : "#121213",
        W = G.W,
        H = G.H;
      s.btns = [];
      c.fillStyle = dk ? "#121213" : "#fff";
      c.fillRect(0, 0, W, H);
      c.fillStyle = ink;
      c.font = "500 15px ".concat(G.UI);
      c.textAlign = "center";
      c.textBaseline = "middle";
      c.fillText(s.done ? "Chain complete!" : "Each word + the next = a compound", W / 2, 20);
      var kbH = s.done ? 0 : Math.min(190, H * 0.3),
        btnH = 44,
        top = 40;
      var maxLen = Math.max.apply(Math, _toConsumableArray(s.w.map(function (x) {
          return x.length;
        }))),
        gap = 5;
      var rowH = Math.min(54, (H - top - kbH - btnH - 30) / 7 - 6);
      var box = Math.min(rowH, (W - 32 - gap * (maxLen - 1)) / maxLen);
      s.w.forEach(function (word, i) {
        var y = top + i * (rowH + 6),
          n = word.length,
          tw = n * box + (n - 1) * gap;
        var x0 = (W - tw) / 2;
        if (i === s.sel && s.shake > 0) x0 += Math.sin(s.shake * 60) * 5;
        var sel = i === s.sel,
          fl = s.flash === i && s.flashT > 0;
        for (var j = 0; j < n; j++) {
          var x = x0 + j * (box + gap);
          var ch = "",
            bg = void 0,
            fg = ink,
            br = null;
          if (s.ok[i]) {
            ch = word[j];
            var given = !HID.includes(i);
            bg = given ? dk ? "#3a3a3c" : "#e8e8e1" : s.rev[i] >= n ? dk ? "#565758" : "#b9b9b0" : "#6aaa64";
            fg = given ? ink : "#fff";
            if (fl) bg = "#8fd37f";
          } else if (j < s.rev[i]) {
            ch = word[j];
            bg = dk ? "#3a3a3c" : "#e8e8e1";
          } else {
            ch = sel ? s.typed[j - s.rev[i]] || "" : "";
            bg = dk ? "#121213" : "#fff";
            br = sel ? ch ? ink : dk ? "#818384" : "#878a8c" : dk ? "#3a3a3c" : "#d3d6da";
          }
          rr(c, x, y, box, box, 5);
          c.fillStyle = bg;
          c.fill();
          if (br) {
            c.lineWidth = 2;
            c.strokeStyle = br;
            c.stroke();
          }
          if (ch) {
            c.fillStyle = fg;
            c.font = "700 ".concat(Math.round(box * 0.55), "px ").concat(G.UI);
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillText(ch, x + box / 2, y + box / 2 + 1);
          }
        }
        if (sel) {
          c.fillStyle = "#ff5c8a";
          c.beginPath();
          c.arc(x0 - 12, y + box / 2, 4, 0, 7);
          c.fill();
        }
        if (!s.ok[i] && !s.done) s.btns.push({
          x: 0,
          y: y,
          w: W,
          h: rowH,
          row: i
        });
      });
      var y = top + 7 * (rowH + 6) + 4;
      if (!s.done) {
        var bw = (W - 36) / 2;
        s.btns.push(Object.assign(G.pill(c, 12, y, bw, btnH - 6, "Hint (+1 letter)"), {
          k: "hint"
        }));
        s.btns.push(Object.assign(G.pill(c, 24 + bw, y, bw, btnH - 6, "Enter", true), {
          k: "go"
        }));
        var ky = H - kbH,
          kh = (kbH - 16) / 3 - 6,
          kw = (W - 12) / 10 - 5;
        KB.forEach(function (row, r) {
          var keys = row.split(""),
            wide = function wide(k) {
              return k === "<" || k === ">" ? kw * 1.5 + 2.5 : kw;
            };
          var tw = keys.reduce(function (a, k) {
            return a + wide(k) + 5;
          }, -5);
          var x = (W - tw) / 2;
          keys.forEach(function (k) {
            var w = wide(k),
              yy = ky + 6 + r * (kh + 6);
            rr(c, x, yy, w, kh, 5);
            c.fillStyle = dk ? "#818384" : "#d3d6da";
            c.fill();
            c.fillStyle = ink;
            c.font = "700 ".concat(k.length && (k === "<" || k === ">") ? 13 : 16, "px ").concat(G.UI);
            c.textAlign = "center";
            c.textBaseline = "middle";
            c.fillText(k === "<" ? "⌫" : k === ">" ? "ENTER" : k, x + w / 2, yy + kh / 2 + 1);
            s.btns.push({
              x: x,
              y: yy,
              w: w,
              h: kh,
              key: k
            });
            x += w + 5;
          });
        });
      } else if (s.posted) {
        var _bw = Math.min(240, W - 60);
        s.btns.push(Object.assign(G.pill(c, W / 2 - _bw / 2, y + 10, _bw, 48, "See results", true), {
          k: "res"
        }));
      }
      if (s.msgT > 0 && s.msg) {
        c.save();
        c.globalAlpha = Math.min(1, s.msgT * 2);
        c.font = "600 15px ".concat(G.UI);
        var w = c.measureText(s.msg).width + 30;
        c.fillStyle = ink;
        rr(c, W / 2 - w / 2, 44, w, 38, 6);
        c.fill();
        c.fillStyle = dk ? "#121213" : "#fff";
        c.textAlign = "center";
        c.fillText(s.msg, W / 2, 64);
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
      if (b.row !== undefined) {
        if (b.row !== s.sel) {
          s.sel = b.row;
          s.typed = "";
        }
        return;
      }
      if (b.key) return this.press(G, b.key);
      if (b.k === "go") return this.enter(G);
      if (b.k === "hint" && s.sel >= 0) {
        s.msg = "Here's a letter";
        s.msgT = 1;
        this.reveal(G, s.sel);
      }
    },
    onKey: function onKey(G, k, d) {
      if (!d) return;
      if (k === "Enter") this.press(G, ">");else if (k === "Backspace") this.press(G, "<");else if (/^[a-z]$/i.test(k)) this.press(G, k.toUpperCase());else if (k === "ArrowUp" || k === "ArrowDown") {
        var s = G.s;
        var o = HID.filter(function (i) {
          return !s.ok[i];
        });
        if (o.length) {
          var p = o.indexOf(s.sel);
          s.sel = o[(p + (k === "ArrowUp" ? -1 : 1) + o.length) % o.length];
          s.typed = "";
        }
      }
    }
  });
})();
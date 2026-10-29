(() => {
  "use strict";

  // ENGINE START
  // ---------- constants ----------
  const GLYPH = {
    k: "♚\uFE0E",
    q: "♛\uFE0E",
    r: "♜\uFE0E",
    b: "♝\uFE0E",
    n: "♞\uFE0E",
    p: "♟\uFE0E",
  };
  const NAMES = {
    k: "king",
    q: "queen",
    r: "rook",
    b: "bishop",
    n: "knight",
    p: "pawn",
  };
  const VALUE = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 0 };
  const START =
    "rnbqkbnr" + "pppppppp" + " ".repeat(32) + "PPPPPPPP" + "RNBQKBNR";
  const KN = [
    [-2, -1],
    [-2, 1],
    [-1, -2],
    [-1, 2],
    [1, -2],
    [1, 2],
    [2, -1],
    [2, 1],
  ];
  const KG = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  const ROOK = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const BISH = [
    [-1, -1],
    [-1, 1],
    [1, -1],
    [1, 1],
  ];
  const RIGHTS = { 60: "KQ", 4: "kq", 63: "K", 56: "Q", 7: "k", 0: "q" };

  // ---------- helpers ----------
  const R = (i) => i >> 3,
    C = (i) => i & 7;
  const isW = (p) => p !== "" && p === p.toUpperCase();
  const on = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
  const sqName = (i) => "abcdefgh"[C(i)] + (8 - R(i));
  const kingAt = (b, w) => b.indexOf(w ? "K" : "k");
  const newState = () => ({
    b: [...START].map((ch) => (ch === " " ? "" : ch)),
    turn: "w",
    castle: "KQkq",
    ep: -1,
    half: 0,
  });

  // ---------- rules ----------
  function attacked(b, sq, by) {
    const r = R(sq),
      c = C(sq),
      w = by === "w";
    const has = (rr, cc, ch) =>
      on(rr, cc) && b[rr * 8 + cc] === (w ? ch.toUpperCase() : ch);
    const pr = w ? r + 1 : r - 1;
    if (has(pr, c - 1, "p") || has(pr, c + 1, "p")) return true;
    if (KN.some(([a, d]) => has(r + a, c + d, "n"))) return true;
    if (KG.some(([a, d]) => has(r + a, c + d, "k"))) return true;
    for (const [dirs, kinds] of [
      [ROOK, "rq"],
      [BISH, "bq"],
    ]) {
      for (const [a, d] of dirs) {
        let rr = r + a,
          cc = c + d;
        while (on(rr, cc) && !b[rr * 8 + cc]) {
          rr += a;
          cc += d;
        }
        if (on(rr, cc)) {
          const p = b[rr * 8 + cc];
          if (isW(p) === w && kinds.includes(p.toLowerCase())) return true;
        }
      }
    }
    return false;
  }

  function pseudo(s, i) {
    const b = s.b,
      p = b[i],
      w = isW(p),
      t = p.toLowerCase(),
      r = R(i),
      c = C(i),
      out = [];
    const add = (to, f) => out.push({ from: i, to, f });
    const free = (rr, cc) => on(rr, cc) && !b[rr * 8 + cc];
    const foe = (rr, cc) =>
      on(rr, cc) && b[rr * 8 + cc] !== "" && isW(b[rr * 8 + cc]) !== w;
    if (t === "p") {
      const d = w ? -1 : 1;
      if (free(r + d, c)) {
        add(i + d * 8);
        if (r === (w ? 6 : 1) && free(r + 2 * d, c)) add(i + d * 16, "dbl");
      }
      for (const dc of [-1, 1]) {
        const to = (r + d) * 8 + c + dc;
        if (foe(r + d, c + dc)) add(to);
        else if (on(r + d, c + dc) && to === s.ep) add(to, "ep");
      }
    } else if (t === "n" || t === "k") {
      for (const [a, d] of t === "n" ? KN : KG)
        if (free(r + a, c + d) || foe(r + a, c + d)) add((r + a) * 8 + c + d);
      const opp = w ? "b" : "w";
      if (t === "k" && i === (w ? 60 : 4) && !attacked(b, i, opp)) {
        if (
          s.castle.includes(w ? "K" : "k") &&
          !b[i + 1] &&
          !b[i + 2] &&
          !attacked(b, i + 1, opp) &&
          !attacked(b, i + 2, opp)
        )
          add(i + 2, "oo");
        if (
          s.castle.includes(w ? "Q" : "q") &&
          !b[i - 1] &&
          !b[i - 2] &&
          !b[i - 3] &&
          !attacked(b, i - 1, opp) &&
          !attacked(b, i - 2, opp)
        )
          add(i - 2, "ooo");
      }
    } else {
      for (const [a, d] of t === "r"
        ? ROOK
        : t === "b"
          ? BISH
          : ROOK.concat(BISH)) {
        let rr = r + a,
          cc = c + d;
        while (free(rr, cc)) {
          add(rr * 8 + cc);
          rr += a;
          cc += d;
        }
        if (foe(rr, cc)) add(rr * 8 + cc);
      }
    }
    return out;
  }

  function make(s, m) {
    const b = [...s.b],
      p = b[m.from],
      w = isW(p),
      t = p.toLowerCase();
    const epSq = R(m.from) * 8 + C(m.to);
    const cap = b[m.to] || (m.f === "ep" ? b[epSq] : "");
    b[m.to] = p;
    b[m.from] = "";
    if (m.f === "ep") b[epSq] = "";
    if (m.f === "oo") {
      b[m.from + 1] = b[m.from + 3];
      b[m.from + 3] = "";
    }
    if (m.f === "ooo") {
      b[m.from - 1] = b[m.from - 4];
      b[m.from - 4] = "";
    }
    if (t === "p" && (R(m.to) === 0 || R(m.to) === 7)) b[m.to] = w ? "Q" : "q"; // auto-queen
    let castle = s.castle;
    for (const sq of [m.from, m.to])
      if (RIGHTS[sq])
        castle = castle.replace(new RegExp(`[${RIGHTS[sq]}]`, "g"), "");
    return {
      b,
      turn: w ? "b" : "w",
      castle,
      ep: m.f === "dbl" ? (m.from + m.to) / 2 : -1,
      half: t === "p" || cap ? 0 : s.half + 1,
    };
  }

  function legal(s) {
    const out = [],
      w = s.turn === "w";
    s.b.forEach((p, i) => {
      if (!p || isW(p) !== w) return;
      pseudo(s, i).forEach((m) => {
        const n = make(s, m);
        if (!attacked(n.b, kingAt(n.b, w), w ? "b" : "w")) out.push(m);
      });
    });
    return out;
  }

  const inCheck = (s) =>
    attacked(s.b, kingAt(s.b, s.turn === "w"), s.turn === "w" ? "b" : "w");

  function statusOf(s, ms) {
    if (!ms.length) return inCheck(s) ? "mate" : "stalemate";
    const rest = s.b
      .filter((p) => p && p.toLowerCase() !== "k")
      .map((p) => p.toLowerCase());
    if (s.half >= 100) return "fifty";
    if (rest.length === 0 || (rest.length === 1 && "bn".includes(rest[0])))
      return "material";
    return inCheck(s) ? "check" : "play";
  }

  // ---------- computer player ----------
  function evalWhite(b) {
    let v = 0;
    b.forEach((p, i) => {
      if (!p) return;
      const t = p.toLowerCase(),
        w = isW(p);
      const centre =
        (3.5 - Math.abs(3.5 - C(i))) * (3.5 - Math.abs(3.5 - R(i)));
      let x = VALUE[t] + (t === "k" ? 0 : centre * (t === "p" ? 4 : 3));
      if (t === "p") x += (w ? 6 - R(i) : R(i) - 1) * 6;
      v += w ? x : -x;
    });
    return v;
  }

  const gain = (s, m) => (s.b[m.to] ? VALUE[s.b[m.to].toLowerCase()] : 0);

  function nega(s, d, a, b) {
    const ms = legal(s);
    if (!ms.length) return inCheck(s) ? -99999 - d : 0;
    if (!d) return (s.turn === "w" ? 1 : -1) * evalWhite(s.b);
    ms.sort((x, y) => gain(s, y) - gain(s, x));
    for (const m of ms) {
      const v = -nega(make(s, m), d - 1, -b, -a);
      if (v > a) {
        a = v;
        if (a >= b) break;
      }
    }
    return a;
  }

  function bestMove(s, depth) {
    let best = null,
      top = -Infinity;
    for (const m of legal(s)) {
      const v =
        -nega(make(s, m), depth - 1, -Infinity, Infinity) + Math.random() * 6;
      if (v > top) {
        top = v;
        best = m;
      }
    }
    return best;
  }
  // ENGINE END

  // ---------- game state ----------
  const $ = (id) => document.getElementById(id);
  const boardEl = $("chessBoard"),
    modeEl = $("mode"),
    levelEl = $("level");
  const INIT = { q: 1, r: 2, b: 2, n: 2, p: 8 };
  let s = newState(),
    hist = [],
    sel = -1,
    targets = [],
    last = null,
    flipped = false,
    busy = false,
    gid = 0;

  const info = () => {
    const ms = legal(s);
    return { ms, st: statusOf(s, ms) };
  };
  const isOver = (st) =>
    ["mate", "stalemate", "fifty", "material"].includes(st);

  function san(prev, m, st) {
    const p = prev.b[m.from],
      t = p.toLowerCase(),
      cap = prev.b[m.to] !== "" || m.f === "ep";
    let x =
      m.f === "oo"
        ? "O-O"
        : m.f === "ooo"
          ? "O-O-O"
          : (t === "p" ? (cap ? "abcdefgh"[C(m.from)] : "") : t.toUpperCase()) +
            (cap ? "x" : "") +
            sqName(m.to);
    if (t === "p" && (R(m.to) === 0 || R(m.to) === 7)) x += "=Q";
    return x + (st === "mate" ? "#" : st === "check" ? "+" : "");
  }

  function doMove(m) {
    const next = make(s, m),
      st = statusOf(next, legal(next));
    hist.push({ prev: s, san: san(s, m, st), last: m });
    s = next;
    last = m;
    sel = -1;
    targets = [];
    render();
    if (modeEl.value === "cpu" && s.turn === "b" && !isOver(st)) think();
  }

  function think() {
    busy = true;
    render();
    const id = gid;
    setTimeout(() => {
      if (id !== gid) return;
      busy = false;
      const m = bestMove(s, +levelEl.value);
      if (m) doMove(m);
      else render();
    }, 80);
  }

  function onSquare(i) {
    if (busy || isOver(info().st)) return;
    if (modeEl.value === "cpu" && s.turn === "b") return;
    const m = targets.find((t) => t.to === i);
    if (sel >= 0 && m) return doMove(m);
    const p = s.b[i];
    if (p && isW(p) === (s.turn === "w")) {
      sel = i;
      targets = legal(s).filter((x) => x.from === i);
    } else {
      sel = -1;
      targets = [];
    }
    render();
  }

  function newGame() {
    gid++;
    busy = false;
    s = newState();
    hist = [];
    sel = -1;
    targets = [];
    last = null;
    flipped = false;
    render();
  }

  function undo() {
    if (!hist.length) return;
    gid++;
    busy = false;
    s = hist.pop().prev;
    if (modeEl.value === "cpu" && s.turn === "b" && hist.length)
      s = hist.pop().prev;
    last = hist.length ? hist[hist.length - 1].last : null;
    sel = -1;
    targets = [];
    render();
  }

  // ---------- rendering ----------
  function missing(white) {
    const have = {};
    s.b.forEach((p) => {
      if (p && isW(p) === white)
        have[p.toLowerCase()] = (have[p.toLowerCase()] || 0) + 1;
    });
    return "qrbnp"
      .split("")
      .map((t) => GLYPH[t].repeat(Math.max(0, INIT[t] - (have[t] || 0))))
      .join("");
  }

  function sideName(w) {
    if (modeEl.value === "cpu") return w ? "You (White)" : "Computer (Black)";
    return w ? "White" : "Black";
  }

  function render() {
    const { ms, st } = info();
    const checkSq =
      st === "check" || st === "mate" ? kingAt(s.b, s.turn === "w") : -1;
    boardEl.replaceChildren();
    for (let k = 0; k < 64; k++) {
      const i = flipped ? 63 - k : k,
        p = s.b[i],
        t = targets.find((x) => x.to === i);
      const sq = document.createElement("button");
      sq.type = "button";
      sq.className = "square " + ((R(i) + C(i)) % 2 ? "dark" : "light");
      if (p) sq.classList.add(isW(p) ? "wp" : "bp");
      if (i === sel) sq.classList.add("selected");
      if (last && (i === last.from || i === last.to)) sq.classList.add("last");
      if (i === checkSq) sq.classList.add("check");
      if (k % 8 === 0) sq.dataset.rank = 8 - R(i);
      if (k >= 56) sq.dataset.file = "abcdefgh"[C(i)];
      sq.setAttribute(
        "aria-label",
        sqName(i) +
          (p ? ` ${isW(p) ? "white" : "black"} ${NAMES[p.toLowerCase()]}` : ""),
      );
      sq.innerHTML =
        (p ? `<span class="piece">${GLYPH[p.toLowerCase()]}</span>` : "") +
        (t ? `<b class="dot${p || t.f === "ep" ? " ring" : ""}"></b>` : "");
      sq.addEventListener("click", () => onSquare(i));
      boardEl.append(sq);
    }

    const who = s.turn === "w" ? "White" : "Black",
      other = s.turn === "w" ? "Black" : "White";
    $("status").textContent = busy
      ? "Computer is thinking…"
      : st === "mate"
        ? `Checkmate. ${other} wins`
        : st === "stalemate"
          ? "Stalemate. The game is a draw"
          : st === "fifty"
            ? "Draw by the 50-move rule"
            : st === "material"
              ? "Draw: not enough material to win"
              : st === "check"
                ? `${who} is in check`
                : `${who} to move`;

    $("topName").textContent = sideName(flipped);
    $("bottomName").textContent = sideName(!flipped);
    $("topCap").textContent = missing(!flipped);
    $("bottomCap").textContent = missing(flipped);

    const list = $("moves");
    list.replaceChildren();
    for (let n = 0; n < hist.length; n += 2) {
      const li = document.createElement("li");
      [
        `${n / 2 + 1}.`,
        hist[n].san,
        hist[n + 1] ? hist[n + 1].san : "",
      ].forEach((txt) => {
        const sp = document.createElement("span");
        sp.textContent = txt;
        li.append(sp);
      });
      list.append(li);
    }
    list.scrollTop = list.scrollHeight;
    $("undoBtn").disabled = !hist.length;
  }

  // ---------- events ----------
  $("newBtn").addEventListener("click", newGame);
  $("undoBtn").addEventListener("click", undo);
  $("flipBtn").addEventListener("click", () => {
    flipped = !flipped;
    render();
  });
  modeEl.addEventListener("change", newGame);
  render();
})();

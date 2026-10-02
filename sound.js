/* AI 교무실 사용연수 — 소리
 * 파일 없이 Web Audio로 합성한다(인터넷이 끊겨도 난다).
 *  효과음: 휩팬·펀치인·로어서드·스태거(차례로 올라가는 실로폰)·타자·알림 차임·도장·펜·체크·종
 *  배경음: D장조 잔잔한 패드 + 아르페지오. 「대기」(표지)·「실습」(타이머 도는 동안, 작게)·「마무리」
 * 브라우저 정책상 첫 클릭·키 입력 뒤부터 소리가 난다. 설정(켜기·배경음·크기)은 이 브라우저에 기억한다.
 */
(function () {
  "use strict";
  var ctx = null, master, sfxBus, bgmBus, verbIn, noise;
  var S = { on: true, bgmOn: true, vol: 0.8, mode: null, unlocked: false };
  if (window.DECK_MODE === "share") S.bgmOn = false; // 공유본: 혼자 볼 때는 배경음 없이 시작
  try {
    var saved = JSON.parse(localStorage.getItem("aio-sound") || "null");
    if (saved) { S.on = saved.on !== false; S.bgmOn = saved.bgmOn !== false; if (typeof saved.vol === "number") S.vol = saved.vol; }
  } catch (e) {}
  function save() { try { localStorage.setItem("aio-sound", JSON.stringify({ on: S.on, bgmOn: S.bgmOn, vol: S.vol })); } catch (e) {} }

  // 소리 그래프: 효과음·배경음 → 마스터 → 압축기 → 스피커, 잔향은 따로 보낸다
  function build(c) {
    var comp = c.createDynamicsCompressor();
    comp.threshold.value = -16; comp.knee.value = 10; comp.ratio.value = 4; comp.attack.value = 0.003; comp.release.value = 0.25;
    var m = c.createGain(); m.gain.value = S.on ? S.vol : 0;
    m.connect(comp); comp.connect(c.destination);
    var sb = c.createGain(); sb.gain.value = 1; sb.connect(m);
    var bb = c.createGain(); bb.gain.value = 0; bb.connect(m);
    var verb = c.createConvolver();
    var len = Math.floor(c.sampleRate * 2.6), ir = c.createBuffer(2, len, c.sampleRate);
    for (var ch = 0; ch < 2; ch++) { var d = ir.getChannelData(ch); for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.4); }
    verb.buffer = ir;
    var vg = c.createGain(); vg.gain.value = 0.8; verb.connect(vg); vg.connect(m);
    var nb = c.createBuffer(1, c.sampleRate * 2, c.sampleRate), nd = nb.getChannelData(0);
    for (var k = 0; k < nd.length; k++) nd[k] = Math.random() * 2 - 1;
    return { ctx: c, master: m, sfxBus: sb, bgmBus: bb, verbIn: verb, noise: nb };
  }
  function use(g) { ctx = g.ctx; master = g.master; sfxBus = g.sfxBus; bgmBus = g.bgmBus; verbIn = g.verbIn; noise = g.noise; }
  var live = null;
  function init() {
    if (live) return live.ctx;
    var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    try { live = build(new AC()); } catch (e) { return null; }
    use(live);
    return ctx;
  }

  // ── 부품 ──
  function env(t, a, peak, hold, rel, dest) {
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + a);
    if (hold) g.gain.setValueAtTime(Math.max(peak, 0.0002), t + a + hold);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + (hold || 0) + rel);
    g.connect(dest || sfxBus);
    return g;
  }
  function send(node, amt) { var s = ctx.createGain(); s.gain.value = amt; node.connect(s); s.connect(verbIn); }
  function osc(type, f1, f2, t, dur, dest, glide, detune) {
    var o = ctx.createOscillator(); o.type = type;
    o.frequency.setValueAtTime(f1, t);
    if (f2 && f2 !== f1) o.frequency.exponentialRampToValueAtTime(f2, t + (glide || dur));
    if (detune) o.detune.value = detune;
    o.connect(dest); o.start(t); o.stop(t + dur + 0.05);
    return o;
  }
  function nz(t, dur, dest, f) {
    var s = ctx.createBufferSource(); s.buffer = noise; s.loop = true;
    var b = ctx.createBiquadFilter(); b.type = f.type || "bandpass"; b.Q.value = f.q || 0.8;
    b.frequency.setValueAtTime(f.f1, t);
    if (f.f2) b.frequency.exponentialRampToValueAtTime(f.f2, t + (f.at || dur));
    if (f.f3) b.frequency.exponentialRampToValueAtTime(f.f3, t + dur);
    s.connect(b); b.connect(dest); s.start(t, Math.random()); s.stop(t + dur + 0.05);
    return b;
  }
  function lp(dest, f) { var x = ctx.createBiquadFilter(); x.type = "lowpass"; x.frequency.value = f; x.connect(dest); return x; }
  function pan(v, dest) { if (!ctx.createStereoPanner) return dest; var p = ctx.createStereoPanner(); p.pan.value = v; p.connect(dest); return p; }
  function hz(name) { // "A4" → 440, "C#5" …
    var m = /^([A-G])(#?)(-?\d)$/.exec(name), base = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[m[1]] + (m[2] ? 1 : 0);
    return 440 * Math.pow(2, (base + (+m[3] + 1) * 12 - 69) / 12);
  }
  var SCALE = ["D5", "E5", "F#5", "A5", "B5", "D6", "E6", "F#6", "A6", "B6"].map(hz); // D장조 5음 음계

  // ── 효과음 ──
  var LIB = {
    whip: function (t, o) { // 휩팬: 방향을 따라 왼→오른으로 지나가는 바람 + 착지
      var dir = o.dir || 1, dur = 0.62, g = env(t, 0.26, 0.38, 0, 0.36), dst = g;
      if (ctx.createStereoPanner) { var p = ctx.createStereoPanner(); p.pan.setValueAtTime(-0.85 * dir, t); p.pan.linearRampToValueAtTime(0.85 * dir, t + dur); p.connect(g); dst = p; }
      nz(t, dur, dst, { type: "bandpass", q: 0.9, f1: 320, f2: 4200, at: 0.27, f3: 650 });
      nz(t + 0.04, dur * 0.8, dst, { type: "highpass", q: 0.5, f1: 3500, f2: 8000 });
      send(g, 0.25);
      var g2 = env(t + 0.44, 0.01, 0.26, 0, 0.32); osc("sine", 130, 42, t + 0.44, 0.36, g2, 0.3);
    },
    zoomin: function (t) { // 줌 전환: 빨려 들어가는 소리 + 부드러운 착지
      var g = env(t, 0.32, 0.3, 0, 0.06); nz(t, 0.4, g, { type: "lowpass", q: 1.2, f1: 300, f2: 7000, at: 0.36 });
      LIB.impact(t + 0.34, { soft: true });
    },
    swish: function (t, o) {
      var g = env(t, 0.08, o.v || 0.16, 0, 0.2);
      nz(t, 0.3, pan(o.pan || 0, g), { type: "bandpass", q: 1.1, f1: 900, f2: 3200, at: 0.12, f3: 1500 });
    },
    impact: function (t, o) { // 키네틱 강조어가 박힐 때
      var big = o.big, soft = o.soft;
      var g = env(t, 0.005, soft ? 0.24 : (big ? 0.55 : 0.36), 0, big ? 1.1 : 0.6);
      osc("sine", big ? 110 : 140, big ? 34 : 44, t, big ? 1.1 : 0.6, g, big ? 0.9 : 0.45);
      var g2 = env(t, 0.002, soft ? 0.1 : 0.2, 0, 0.18); nz(t, 0.2, g2, { type: "lowpass", q: 0.7, f1: 2400, f2: 300 });
      send(g2, 0.5); send(g, big ? 0.35 : 0.2);
    },
    boom: function (t) { // 로고·큰 등장: 깊은 쿵 + 울림
      LIB.impact(t, { big: true });
      var g = env(t, 0.02, 0.09, 0, 1.8);
      osc("triangle", hz("D4"), hz("D4"), t, 1.9, g); osc("sine", hz("A4"), hz("A4"), t, 1.9, g); osc("sine", hz("F#5"), hz("F#5"), t, 1.9, g);
      send(g, 0.7);
    },
    riser: function (t, o) { // 파트 시작: 차오르는 소리(제목이 박힐 때 impact가 이어받는다)
      var d = o.d || 1.2, g = sfxBus;
      var a = ctx.createGain(); a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime(0.2, t + d); a.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.08); a.connect(g);
      nz(t, d + 0.1, a, { type: "bandpass", q: 1.4, f1: 300, f2: 5200, at: d });
      var b = ctx.createGain(); b.gain.setValueAtTime(0.0001, t); b.gain.exponentialRampToValueAtTime(0.045, t + d); b.gain.exponentialRampToValueAtTime(0.0001, t + d + 0.1); b.connect(g);
      osc("sawtooth", 110, 880, t, d + 0.1, lp(b, 1800), d);
      send(a, 0.4);
    },
    suck: function (t) { // 낱말이 빨려 들어갈 때(거꾸로 감은 바람)
      var a = ctx.createGain(); a.gain.setValueAtTime(0.0001, t); a.gain.exponentialRampToValueAtTime(0.32, t + 0.8); a.gain.exponentialRampToValueAtTime(0.0001, t + 0.86); a.connect(sfxBus);
      nz(t, 0.9, a, { type: "lowpass", q: 1.3, f1: 400, f2: 8000, at: 0.8 });
    },
    punch: function (t) { // 펀치인: 카메라가 들어가는 짧은 바람 + 딸깍
      LIB.swish(t, { v: 0.07 });
      var g = env(t + 0.05, 0.003, 0.16, 0, 0.1); nz(t + 0.05, 0.1, g, { type: "highpass", q: 0.7, f1: 1800 });
      var g2 = env(t + 0.06, 0.004, 0.2, 0, 0.18); osc("sine", 240, 90, t + 0.06, 0.2, g2, 0.15); send(g2, 0.15);
    },
    tap: function (t) { var g = env(t, 0.003, 0.09, 0, 0.09); osc("sine", 1900, 1250, t, 0.1, g, 0.08); },
    pop: function (t) { var g = env(t, 0.003, 0.12, 0, 0.12); osc("sine", 620, 980, t, 0.14, g, 0.05); send(g, 0.2); },
    swipe: function (t) { LIB.swish(t, { v: 0.13, pan: 0.3 }); },
    rise: function (t) { var g = env(t, 0.25, 0.11, 0, 0.3); nz(t, 0.55, g, { type: "bandpass", q: 1, f1: 500, f2: 1900, at: 0.4 }); },
    pluck: function (t, o) { // 스태거: 나올 때마다 한 음씩 올라간다
      var f = SCALE[Math.min(o.i || 0, SCALE.length - 1)], v = o.v || 0.1;
      var g = env(t, 0.004, v, 0, 0.5); osc("sine", f, f, t, 0.55, g);
      var g2 = env(t, 0.002, v * 0.35, 0, 0.12); osc("sine", f * 4, f * 4, t, 0.15, g2);
      send(g, 0.35);
    },
    lt: function (t) { // 로어서드가 미끄러져 들어올 때
      LIB.swish(t, { v: 0.11, pan: -0.3 });
      var g = env(t + 0.2, 0.004, 0.09, 0, 0.25); osc("triangle", hz("F#5"), hz("F#5"), t + 0.2, 0.28, g);
      var g2 = env(t + 0.29, 0.004, 0.09, 0, 0.36); osc("triangle", hz("C#6"), hz("C#6"), t + 0.29, 0.4, g2); send(g2, 0.3);
    },
    alert: function (t) { // 「오늘은 누르지 않아요」
      var g = env(t, 0.004, 0.14, 0.08, 0.25); osc("triangle", 880, 880, t, 0.35, g);
      var g2 = env(t + 0.16, 0.004, 0.14, 0.08, 0.35); osc("triangle", 622, 622, t + 0.16, 0.45, g2); send(g2, 0.25);
    },
    key: function (t) { var g = env(t, 0.001, 0.05 + Math.random() * 0.03, 0, 0.03); nz(t, 0.04, g, { type: "bandpass", q: 2, f1: 2500 + Math.random() * 2500 }); },
    notify: function (t) { // 휴대폰 알림
      [hz("B5"), hz("E6")].forEach(function (f, k) {
        var tt = t + k * 0.13, g = env(tt, 0.004, 0.12, 0, 0.9); osc("sine", f, f, tt, 0.95, g);
        var g2 = env(tt, 0.003, 0.035, 0, 0.3); osc("sine", f * 2.76, f * 2.76, tt, 0.35, g2); send(g, 0.4);
      });
    },
    stamp: function (t) {
      var g = env(t, 0.003, 0.38, 0, 0.28); osc("sine", 150, 46, t, 0.3, g, 0.22);
      var g2 = env(t, 0.002, 0.28, 0, 0.09); nz(t, 0.1, g2, { type: "lowpass", q: 0.8, f1: 900 }); send(g, 0.15);
    },
    scribble: function (t, o) { // 펜 사각사각
      var dur = o.d || 1, g = ctx.createGain(); g.gain.value = 0.0001; g.connect(sfxBus);
      var f = nz(t, dur, g, { type: "bandpass", q: 3, f1: 3200 });
      var n = Math.max(3, Math.round(dur * 7));
      for (var k = 0; k < n; k++) {
        var tt = t + k * dur / n;
        g.gain.setValueAtTime(0.0001, tt);
        g.gain.linearRampToValueAtTime(0.05 + Math.random() * 0.04, tt + dur / n * 0.3);
        g.gain.linearRampToValueAtTime(0.0001, tt + dur / n * 0.95);
        f.frequency.setValueAtTime(2600 + Math.random() * 1800, tt);
      }
    },
    check: function (t) { [hz("G6"), hz("D7")].forEach(function (f, k) { var g = env(t + k * 0.06, 0.003, 0.09, 0, 0.45); osc("sine", f, f, t + k * 0.06, 0.5, g); send(g, 0.3); }); },
    tick: function (t) { var g = env(t, 0.001, 0.04, 0, 0.03); osc("square", 2200, 2200, t, 0.04, lp(g, 4000)); },
    bell: function (t) { // 실습 시간이 끝났을 때
      [hz("A5"), hz("E6"), hz("A6")].forEach(function (f, k) {
        var tt = t + k * 0.38, g = env(tt, 0.004, 0.15, 0, 1.8); osc("sine", f, f, tt, 1.9, g);
        var g2 = env(tt, 0.003, 0.045, 0, 0.6); osc("sine", f * 2.4, f * 2.4, tt, 0.7, g2); send(g, 0.5);
      });
    }
  };
  var lastAt = {};
  function play(name, o) {
    o = o || {};
    if (!S.on || !live || ctx.state !== "running" || !LIB[name]) return;
    var now = ctx.currentTime;
    if (name === "key" || name === "tick" || name === "pluck") { // 너무 촘촘하면 거른다
      if (lastAt[name] && now - lastAt[name] < 0.035) return;
      lastAt[name] = now;
    }
    try { LIB[name](now + 0.01 + (o.delay || 0) / 1000, o); } catch (e) { console.warn(e); }
  }

  // ── 배경음: 두 마디마다 바뀌는 D장조 네 화음 ──
  var BPM = 72, BEAT = 60 / BPM;
  var CHORDS = [
    { b: "D2", p: ["A3", "C#4", "E4", "F#4"], a: ["D5", "F#5", "A5", "E5"] },
    { b: "B1", p: ["F#3", "A3", "D4", "E4"], a: ["B4", "D5", "F#5", "E5"] },
    { b: "G1", p: ["F#3", "A3", "B3", "D4"], a: ["G4", "B4", "D5", "F#5"] },
    { b: "A1", p: ["E3", "A3", "B3", "D4"], a: ["A4", "C#5", "E5", "B4"] }
  ].map(function (c) { return { b: hz(c.b), p: c.p.map(hz), a: c.a.map(hz) }; });
  function pad(c, t, dur) {
    var cut = S.mode === "focus" ? 800 : 1150;
    c.p.forEach(function (f) {
      var g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.05, t + 1.6);
      g.gain.setValueAtTime(0.05, t + dur - 0.2); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 2);
      g.connect(bgmBus); send(g, 0.5);
      var flt = lp(g, cut);
      osc("triangle", f, f, t, dur + 2, flt); osc("sawtooth", f, f, t, dur + 2, lp(flt, cut * 0.8), 0, 7);
    });
  }
  function bass(f, t, dur) {
    var g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.14, t + 0.08); g.gain.exponentialRampToValueAtTime(0.05, t + dur * 0.8); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.6);
    g.connect(bgmBus); osc("sine", f, f, t, dur + 0.7, g);
  }
  function arp(f, t, v) {
    var g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.006); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.9);
    g.connect(bgmBus); send(g, 0.55);
    osc("sine", f, f, t, 1, g); osc("triangle", f * 2, f * 2, t, 0.3, lp(g, 3000));
  }
  var PAT = [0, 2, 1, 3, 2, 0, 3, 1];
  function scheduleStep(s, t) {
    var c = CHORDS[Math.floor(s / 16) % CHORDS.length], k = s % 16, focus = S.mode === "focus";
    if (k === 0) { pad(c, t, BEAT * 8); bass(c.b, t, BEAT * 8); }
    var play = focus ? (k % 2 === 0 && Math.random() < 0.5) : Math.random() < 0.75;
    if (play) arp(c.a[PAT[s % 8] % c.a.length], t, (focus ? 0.03 : 0.045) * (0.7 + Math.random() * 0.5));
  }
  var timer = null, nextT = 0, step = 0;
  function pump() { while (nextT < ctx.currentTime + 0.3) { scheduleStep(step, nextT); nextT += BEAT / 2; step++; } }
  function bgm(mode) {
    if (mode !== undefined) S.mode = mode;
    if (!live || ctx.state !== "running") return;
    var now = ctx.currentTime, target = (S.mode && S.bgmOn && S.on) ? (S.mode === "focus" ? 0.3 : 0.6) : 0;
    bgmBus.gain.cancelScheduledValues(now);
    bgmBus.gain.setValueAtTime(bgmBus.gain.value, now);
    bgmBus.gain.linearRampToValueAtTime(target, now + (target ? 2.5 : 1.6));
    if (target && !timer) { nextT = now + 0.1; step = 0; timer = setInterval(pump, 60); }
    if (!target && timer) {
      var mine = timer;
      setTimeout(function () { if (timer === mine && !(S.mode && S.bgmOn && S.on)) { clearInterval(timer); timer = null; } }, 2000);
    }
  }
  function unlock() {
    if (!init()) return;
    if (ctx.state === "suspended") { var p = ctx.resume(); if (p && p.then) p.then(function () { bgm(); }); }
    if (!S.unlocked) { S.unlocked = true; }
    bgm();
  }

  // 점검용: 소리 하나를 오프라인으로 그려 가장 큰 진폭을 돌려준다(듣지 않고 확인)
  function render(name, o, sec) {
    var OAC = window.OfflineAudioContext || window.webkitOfflineAudioContext;
    var off = build(new OAC(2, Math.floor(44100 * (sec || 2.5)), 44100));
    var keep = live; use(off);
    try {
      if (name === "bgm") { off.bgmBus.gain.value = 0.6; S.mode = S.mode || "lobby"; for (var s = 0; s < 20; s++) scheduleStep(s, 0.05 + s * BEAT / 2); }
      else LIB[name](0.05, o || {});
    } finally { if (keep) use(keep); }
    return off.ctx.startRendering().then(function (buf) {
      var peak = 0, d = buf.getChannelData(0);
      for (var i = 0; i < d.length; i++) peak = Math.max(peak, Math.abs(d[i]));
      return Math.round(peak * 1000) / 1000;
    });
  }

  window.AUDIO = {
    unlock: unlock, play: play, bgm: bgm, state: S, names: Object.keys(LIB), render: render,
    toggle: function () { S.on = !S.on; save(); if (live) master.gain.setTargetAtTime(S.on ? S.vol : 0, ctx.currentTime, 0.05); bgm(); return S.on; },
    toggleBgm: function () { S.bgmOn = !S.bgmOn; save(); bgm(); return S.bgmOn; },
    volume: function (d) { S.vol = Math.max(0, Math.min(1, Math.round((S.vol + d) * 10) / 10)); save(); if (live && S.on) master.gain.setTargetAtTime(S.vol, ctx.currentTime, 0.05); return S.vol; }
  };
})();

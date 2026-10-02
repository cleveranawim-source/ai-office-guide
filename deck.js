/* AI 교무실 사용연수 — 발표 엔진
 * 1920×1080 무대를 창에 맞춰 줄이고, 장면마다 「박자(beat)」를 넘기며 움직인다.
 * 효과 어휘: 키네틱 타이포(글자 단위 솟기·강조어 펀치), 로어서드(아래 띠), 켄번스(배경 천천히 밀기),
 * 펀치인(휴대폰 화면의 누를 곳으로 카메라가 들어감), 스태거(차례로 등장), 휩팬(장면 사이 빠른 가로 이동 + 방향 흐림), 이징(아래 E).
 * 외부 라이브러리 없이 Web Animations API만 쓴다(인터넷이 끊겨도 돈다).
 */
(function () {
  "use strict";
  var W = 1920, H = 1080;
  var SHARE = window.DECK_MODE === "share"; // 연수 뒤 선생님들께 공유하는 「다시 보기」

  // ── 이징: 모든 움직임은 이 다섯 가지에서 고른다 ──
  var E = {
    out: "cubic-bezier(.16,1,.3,1)",        // 들어올 때(지수 감속)
    in: "cubic-bezier(.7,0,.84,0)",          // 나갈 때(지수 가속)
    cam: "cubic-bezier(.65,0,.35,1)",        // 카메라 이동(양쪽 부드럽게)
    punch: "cubic-bezier(.2,.9,.1,1)",       // 펀치인(빠르게 들어가 딱 멈춤)
    back: "cubic-bezier(.34,1.56,.64,1)"     // 튀어나옴(살짝 넘쳤다가 제자리)
  };
  // 용수철 이징(linear()를 지원하는 브라우저만)
  (function () {
    try {
      if (!CSS.supports("animation-timing-function", "linear(0, 1)")) return;
      var pts = [], z = 0.42, w = 13;
      for (var i = 0; i <= 48; i++) {
        var t = i / 48, wd = w * Math.sqrt(1 - z * z);
        var v = 1 - Math.exp(-z * w * t) * (Math.cos(wd * t) + (z * w / wd) * Math.sin(wd * t));
        pts.push(+v.toFixed(4));
      }
      pts[pts.length - 1] = 1;
      E.spring = "linear(" + pts.join(",") + ")";
    } catch (e) { /* 그대로 back을 쓴다 */ }
    if (!E.spring) E.spring = E.back;
  })();
  var reduced = false;
  try { reduced = matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) {}

  function easeInOutQuint(t) { return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function h(html) { var t = document.createElement("template"); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function mmss(sec) { sec = Math.max(0, Math.round(sec)); return String(Math.floor(sec / 60)).padStart(2, "0") + ":" + String(sec % 60).padStart(2, "0"); }

  // ── 소리: sound.js(AUDIO)에 맡긴다. 없으면 조용히 ──
  function sfx(kind, o) { if (window.AUDIO) window.AUDIO.play(kind, o); }
  function music(mode) { if (window.AUDIO) window.AUDIO.bgm(mode); }

  // ── 장면 목록 ──
  var PARTS = [];
  var scenes = [];
  var state = { i: -1, beat: 0, el: null, A: null, beats: [], busy: false, started: 0, timer: null };

  // ── 애니메이션 문맥: 장면마다 하나. instant이면 끝 상태로 바로 간다(뒤로 가기·건너뛰기) ──
  function makeA(root) {
    var anims = [], timers = [], alive = true;
    var A = {
      E: E, root: root, instant: false, reduced: reduced,
      $: function (s) { return typeof s === "string" ? root.querySelector(s) : s; },
      $$: function (s) { return typeof s === "string" ? $$(s, root) : (s ? (s.length !== undefined ? Array.prototype.slice.call(s) : [s]) : []); },
      go: function (el, kf, o) {
        o = o || {}; el = A.$(el); if (!el || !el.animate) return null;
        var d = o.d != null ? o.d : 700;
        if (reduced && !o.ambient) d = Math.min(d, 260);
        var a = el.animate(kf, { duration: d, delay: o.delay || 0, easing: o.e || E.out, fill: o.fill || "both", iterations: o.iter || 1, direction: o.dir || "normal", composite: o.composite || "replace" });
        anims.push(a);
        if (A.instant && !o.ambient) { try { a.finish(); } catch (e) {} }
        if (reduced && o.ambient) { try { a.pause(); } catch (e) {} }
        return a;
      },
      stagger: function (sel, kf, o) {
        o = o || {}; var list = A.$$(sel), each = o.each != null ? o.each : 70;
        list.forEach(function (el, i) { var oo = Object.assign({}, o); oo.delay = (o.delay || 0) + i * each; A.go(el, kf, oo); });
        return list;
      },
      later: function (fn, ms) {
        if (A.instant || !ms) { fn(); return; }
        var t = setTimeout(function () { if (alive) fn(); }, reduced ? Math.min(ms, 200) : ms);
        timers.push(t);
      },
      count: function (el, from, to, d, fmt) {
        el = A.$(el); fmt = fmt || function (v) { return String(Math.round(v)); };
        if (A.instant || reduced) { el.textContent = fmt(to); return; }
        var t0 = performance.now();
        (function tick(now) {
          if (!alive) return;
          var k = clamp((now - t0) / d, 0, 1), e = 1 - Math.pow(1 - k, 4);
          var txt = fmt(from + (to - from) * e);
          if (txt !== el.textContent) { el.textContent = txt; sfx("tick"); }
          if (k < 1) requestAnimationFrame(tick);
        })(t0);
      },
      type: function (el, text, cps, done) {
        el = A.$(el);
        if (A.instant || reduced) { el.textContent = text; if (done) done(); return; }
        var i = 0; el.textContent = "";
        var t = setInterval(function () {
          if (!alive) { clearInterval(t); return; }
          i++; el.textContent = text.slice(0, i); if (text[i - 1] !== " ") sfx("key");
          if (i >= text.length) { clearInterval(t); if (done) done(); }
        }, 1000 / (cps || 18));
        timers.push(t);
      },
      sfx: function (k, o) {
        if (A.instant) return;
        if (o && o.delay) { var oo = Object.assign({}, o); delete oo.delay; A.later(function () { sfx(k, oo); }, o.delay); }
        else sfx(k, o);
      },
      kill: function () { alive = false; timers.forEach(function (t) { clearTimeout(t); clearInterval(t); }); }
    };

    // 글자 쪼개기: .ln(줄) 안의 글자를 .ch로. em·b는 통째로 남겨 펀치를 준다
    A.split = function (sel) {
      A.$$(sel).forEach(function (host) {
        if (host.dataset.split) return; host.dataset.split = "1";
        (function walk(node) {
          Array.prototype.slice.call(node.childNodes).forEach(function (n) {
            if (n.nodeType === 3) {
              // 낱말(띄어쓰기 단위)로 묶어 줄바꿈은 낱말 사이에서만 일어나게 한다
              var frag = document.createDocumentFragment();
              n.textContent.split(/( +)/).forEach(function (part) {
                if (!part) return;
                if (/^ +$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
                var w = document.createElement("span"); w.className = "w";
                Array.prototype.forEach.call(part, function (c) {
                  var s = document.createElement("span"); s.className = "ch"; s.textContent = c; w.appendChild(s);
                });
                frag.appendChild(w);
              });
              node.replaceChild(frag, n);
            } else if (n.nodeType === 1 && !/^(EM|B|SVG|IMG)$/i.test(n.tagName)) walk(n);
            else if (n.nodeType === 1) n.classList.add("punch");
          });
        })(host);
      });
    };
    // 키네틱 제목: 줄마다 글자가 마스크 아래에서 솟고, 강조어는 크게 흐린 채 들어와 딱 맞춰진다
    A.kinetic = function (sel, o) {
      o = o || {}; A.split(sel); var t = o.delay || 0, each = o.each != null ? o.each : 32;
      A.$$(sel).forEach(function (host) {
        $$(".ln", host).concat(host.querySelector(".ln") ? [] : [host]).forEach(function (ln) {
          $$(".ch", ln).forEach(function (ch, i) {
            A.go(ch, [{ transform: "translateY(110%) rotate(8deg)", opacity: 0 }, { transform: "none", opacity: 1 }], { d: o.d || 900, delay: t + i * each, e: E.out });
          });
          var n = $$(".ch", ln).length;
          $$(".punch", ln).forEach(function (p) {
            A.go(p, [{ transform: "scale(" + (o.punch || 1.9) + ")", filter: "blur(16px)", opacity: 0 }, { transform: "scale(1)", filter: "blur(0px)", opacity: 1 }], { d: 760, delay: t + n * each + 120, e: E.spring });
            A.sfx(root.classList.contains("dark") ? "impact" : "pop", { delay: t + n * each + 170 });
          });
          t += n * each + (o.lineGap != null ? o.lineGap : 140);
        });
      });
      return t;
    };
    // 켄번스: 그림이 천천히 밀리고 커진다(끝없이 왕복)
    A.kenburns = function (sel, o) {
      o = o || {}; var el = A.$(sel); if (!el) return;
      var from = o.from || "scale(1.18) translate(2%, 1.5%)", to = o.to || "scale(1.04) translate(-2%, -1%)";
      A.go(el, [{ transform: from }, { transform: to }], { d: o.d || 16000, e: "cubic-bezier(.33,0,.67,1)", iter: Infinity, dir: "alternate", ambient: true });
    };
    // 마스크 닦기(왼쪽→오른쪽)
    A.wipe = function (sel, o) {
      o = o || {};
      return A.stagger(sel, [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], { d: o.d || 650, delay: o.delay || 0, each: o.each || 90, e: o.e || E.out });
    };
    function plucks(list, o, each) {
      if (!o.snd || A.instant) return;
      list.slice(0, 10).forEach(function (el, i) { A.sfx(o.snd, { i: (o.from || 0) + i, v: o.v, delay: (o.delay || 0) + i * each + (o.lead != null ? o.lead : 60) }); });
    }
    A.rise = function (sel, o) {
      o = o || {};
      plucks(A.$$(sel), o, o.each != null ? o.each : 80);
      return A.stagger(sel, [{ transform: "translateY(" + (o.y != null ? o.y : 36) + "px)", opacity: 0 }, { transform: "none", opacity: 1 }], { d: o.d || 760, delay: o.delay || 0, each: o.each != null ? o.each : 80, e: o.e || E.out });
    };
    A.pop = function (sel, o) {
      o = o || {};
      if (o.snd === undefined) o.snd = "pluck";
      plucks(A.$$(sel), o, o.each != null ? o.each : 70);
      return A.stagger(sel, [{ transform: "scale(" + (o.s || 0.6) + ")", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { d: o.d || 620, delay: o.delay || 0, each: o.each != null ? o.each : 70, e: o.e || E.spring });
    };
    // 처음엔 숨겨 두기(맞는 요소 모두). 나중 박자에서 다른 애니메이션이 덮어써 드러낸다
    A.hide = function (sel) {
      A.$$(sel).forEach(function (el) { A.go(el, [{ opacity: 0 }, { opacity: 0 }], { d: 1 }); });
    };
    A.fadeOut = function (sel, o) {
      o = o || {};
      return A.stagger(sel, [{ opacity: 1 }, { opacity: o.to != null ? o.to : 0 }], { d: o.d || 360, delay: o.delay || 0, each: o.each || 0, e: E.in });
    };
    // 그은 선(취소선·밑줄·연결선): scaleX 0→1
    A.draw = function (sel, o) {
      o = o || {};
      return A.stagger(sel, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { d: o.d || 520, delay: o.delay || 0, each: o.each || 120, e: o.e || E.cam });
    };

    // 로어서드: 아래 띠. 막대가 서고 → 꼬리표가 닦이고 → 본문이 닦이며 글이 솟는다
    A.lt = function (o) {
      var el = h('<div class="lt ' + (o.tone || "") + '" style="' + (o.style || "") + '">' +
        '<i class="lt-bar"></i>' +
        (o.tag ? '<div class="lt-tag"><span>' + o.tag + "</span></div>" : "") +
        '<div class="lt-main"><b><span>' + o.title + "</span></b>" + (o.sub ? "<small><span>" + o.sub + "</span></small>" : "") + "</div>" +
        (o.timer != null ? '<div class="lt-timer" data-timer><span>' + mmss(o.timer * 60) + "</span></div>" : "") +
        "</div>");
      (o.into ? A.$(o.into) : root).appendChild(el);
      var d0 = o.delay || 0;
      A.sfx(/warn/.test(o.tone || "") ? "alert" : "lt", { delay: d0 + 60 });
      A.go($(".lt-bar", el), [{ transform: "scaleY(0)" }, { transform: "scaleY(1)" }], { d: 360, delay: d0, e: E.out });
      var pieces = $$(".lt-tag, .lt-main, .lt-timer", el);
      pieces.forEach(function (p, i) {
        A.go(p, [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }], { d: 560, delay: d0 + 140 + i * 110, e: E.out });
        $$("span", p).forEach(function (s, j) {
          A.go(s, [{ transform: "translateY(110%)" }, { transform: "none" }], { d: 620, delay: d0 + 260 + i * 110 + j * 70, e: E.out });
        });
      });
      return el;
    };
    A.ltOut = function (el, o) {
      if (!el) return; o = o || {};
      A.sfx("swish", { v: 0.05, delay: o.delay || 0 });
      var a = A.go(el, [{ clipPath: "inset(0 0 0 0)", opacity: 1 }, { clipPath: "inset(0 0 0 100%)", opacity: 0.6 }], { d: 420, delay: o.delay || 0, e: E.in });
      if (A.instant) el.remove(); else if (a) a.finished.then(function () { el.remove(); }).catch(function () {});
    };
    // 휴대폰 화면 아래로 떨어지는 알림 배너
    A.banner = function (into, o) {
      var b = h('<div class="ph-banner"><i><img src="img/symbol-128.png" alt=""></i><div><small>AI 교무실 · 지금</small><b>' + o.title + "</b><span>" + o.body + "</span></div></div>");
      A.$(into).appendChild(b);
      A.go(b, [{ transform: "translateY(-140%)", opacity: 0 }, { transform: "none", opacity: 1 }], { d: 820, delay: o.delay || 0, e: E.spring });
      A.sfx("notify", { delay: (o.delay || 0) + 120 });
      return b;
    };

    // ── 휴대폰 + 카메라(펀치인) ──
    A.phone = function (camSel, opt) {
      opt = opt || {};
      var cam = A.$(camSel), rig = $(".rig", cam), phone = $(".phone", cam), scrs = $$(".scr", cam), fx = $(".fx", cam);
      var BZ = 14, PW = 412 + BZ * 2, PH = 864 + BZ * 2;
      var CW = cam.clientWidth || opt.w || 920, CH = cam.clientHeight || opt.h || 1080;
      var rest = { z: opt.z || 1, fx: opt.fx != null ? opt.fx : CW / 2, fy: opt.fy != null ? opt.fy : CH / 2 };
      var camS = { x: rest.fx - PW / 2 * rest.z, y: rest.fy - PH / 2 * rest.z, z: rest.z };
      var curScr = 0, camAnim = null, ring = null;
      function tf(s) { return "translate(" + s.x.toFixed(1) + "px," + s.y.toFixed(1) + "px) scale(" + s.z.toFixed(4) + ")"; }
      rig.style.transform = tf(camS);
      scrs.forEach(function (s, i) { s.style.visibility = i === 0 ? "visible" : "hidden"; });
      function moveTo(next, d, e) {
        var from = tf(camS); camS = next;
        if (camAnim) { try { camAnim.cancel(); } catch (x) {} }
        rig.style.transform = tf(next);
        camAnim = A.go(rig, [{ transform: from }, { transform: tf(next) }], { d: d, e: e, fill: "none" });
        cam.style.setProperty("--z", next.z);
      }
      var P = {
        cam: cam,
        // 들어오기: 아래에서 떠오르며 살짝 기울었다가 바로 선다
        enter: function (o) {
          o = o || {};
          A.sfx("rise", { delay: o.delay || 0 });
          A.go(phone, [{ transform: "translateY(260px) rotate(" + (o.tilt != null ? o.tilt : 6) + "deg) scale(.92)", opacity: 0 }, { transform: "none", opacity: 1 }], { d: 1100, delay: o.delay || 0, e: E.out });
        },
        show: function (i, o) {
          o = o || {};
          if (i === curScr || !scrs[i]) return;
          var dir = i > curScr ? 1 : -1, a = scrs[curScr], b = scrs[i];
          b.style.visibility = "visible"; b.style.zIndex = 2; a.style.zIndex = 1;
          A.sfx("swipe", { delay: o.delay || 0 });
          A.go(b, [{ transform: "translateX(" + dir * 100 + "%)" }, { transform: "none" }], { d: 620, delay: o.delay || 0, e: E.out });
          var an = A.go(a, [{ transform: "none", filter: "brightness(1)" }, { transform: "translateX(" + -dir * 30 + "%)", filter: "brightness(.82)" }], { d: 620, delay: o.delay || 0, e: E.out });
          var old = a;
          if (A.instant) { old.style.visibility = "hidden"; }
          else if (an) an.finished.then(function () { if (old !== scrs[curScr]) old.style.visibility = "hidden"; }).catch(function () {});
          curScr = i;
          if (ring) { ring.remove(); ring = null; }
        },
        // 펀치인: 화면 좌표(412×864 기준)의 사각형을 카메라 가운데로
        focus: function (r, o) {
          o = o || {};
          var cx = BZ + r[0] + r[2] / 2, cy = BZ + r[1] + r[3] / 2;
          var z = o.z || clamp(600 / Math.max(r[2], 120), 1.5, opt.maxZ || 1.95);
          var fxp = o.fx != null ? o.fx : rest.fx, fyp = o.fy != null ? o.fy : (opt.focusY != null ? opt.focusY : CH * 0.46);
          moveTo({ x: fxp - cx * z, y: fyp - cy * z, z: z }, o.d || 820, o.e || E.punch);
          A.sfx("punch");
          if (o.ring !== false) P.ring(r, { delay: o.ringDelay != null ? o.ringDelay : 360, tone: o.tone, label: o.label });
        },
        wide: function (o) {
          o = o || {};
          moveTo({ x: rest.fx - PW / 2 * rest.z, y: rest.fy - PH / 2 * rest.z, z: rest.z }, o.d || 760, E.cam);
          if (ring && o.keepRing !== true) { var rr = ring; ring = null; A.fadeOut(rr, { d: 260 }); A.later(function () { rr.remove(); }, 300); }
        },
        ring: function (r, o) {
          o = o || {};
          if (ring) { ring.remove(); ring = null; }
          var pad = 6;
          ring = h('<div class="ring ' + (o.tone || "") + '" style="left:' + (r[0] - pad) + "px;top:" + (r[1] - pad) + "px;width:" + (r[2] + pad * 2) + "px;height:" + (r[3] + pad * 2) + 'px"><i class="tap"></i>' + (o.label ? '<b class="ring-label">' + o.label + "</b>" : "") + "</div>");
          fx.appendChild(ring);
          A.sfx("tap", { delay: (o.delay || 0) + 260 });
          A.go(ring, [{ transform: "scale(1.35)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { d: 560, delay: o.delay || 0, e: E.back });
          A.go($(".tap", ring), [{ transform: "translate(-50%,-50%) scale(.2)", opacity: 0.55 }, { transform: "translate(-50%,-50%) scale(2.4)", opacity: 0 }], { d: 1400, delay: (o.delay || 0) + 260, iter: Infinity, e: "cubic-bezier(.2,.6,.3,1)", ambient: true });
          return ring;
        },
        clearRing: function () { if (ring) { ring.remove(); ring = null; } },
        el: function (i) { return scrs[i]; }
      };
      return P;
    };
    return A;
  }

  // ── 무대 크기 맞춤 ──
  var stage, scenesBox, streaks;
  function fit() {
    var vw = window.innerWidth, vh = window.innerHeight;
    var s = Math.min(vw / W, vh / H);
    stage.style.transform = "translate(" + (vw - W * s) / 2 + "px," + (vh - H * s) / 2 + "px) scale(" + s + ")";
  }

  // ── 장면 만들기 ──
  function buildScene(i) {
    var def = scenes[i];
    var el = h('<section class="scene ' + (def.kind || "light") + '" data-id="' + def.id + '"></section>');
    el.innerHTML = typeof def.html === "function" ? def.html() : (def.html || "");
    scenesBox.appendChild(el);
    var A = makeA(el);
    var beats = def.build ? def.build(el, A) || [] : [];
    if (!beats.length) beats = [function () {}];
    return { el: el, A: A, beats: beats };
  }

  // ── 장면 전환 ──
  var whipG;
  function transition(oldEl, newEl, type, dir) {
    return new Promise(function (done) {
      if (!oldEl) { done(); return; }
      if (reduced) type = "fade";
      if (type === "whip") {
        var t0 = performance.now(), D = 640, last = 0;
        scenesBox.style.filter = "url(#whipblur)";
        (function step(now) {
          var k = clamp((now - t0) / D, 0, 1), e = easeInOutQuint(k);
          var v = Math.abs(e - last); last = e;
          oldEl.style.transform = "translateX(" + (-dir * e * W) + "px)";
          newEl.style.transform = "translateX(" + (dir * (1 - e) * W) + "px)";
          var blur = clamp(v * 2600, 0, 90);
          whipG.setAttribute("stdDeviation", blur.toFixed(1) + " 0");
          streaks.style.opacity = clamp(v * 26, 0, 1).toFixed(2);
          streaks.style.transform = "translateX(" + (-dir * e * 300) + "px)";
          if (k < 1) requestAnimationFrame(step);
          else {
            scenesBox.style.filter = ""; whipG.setAttribute("stdDeviation", "0 0"); streaks.style.opacity = 0;
            oldEl.style.transform = ""; newEl.style.transform = ""; done();
          }
        })(t0);
        return;
      }
      if (type === "zoom") {
        oldEl.animate([{ transform: "scale(1)", opacity: 1, filter: "blur(0px)" }, { transform: "scale(1.45)", opacity: 0, filter: "blur(18px)" }], { duration: 520, easing: E.in, fill: "forwards" });
        var a = newEl.animate([{ transform: "scale(.86)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 760, delay: 260, easing: E.out, fill: "backwards" });
        a.finished.then(done, done);
        return;
      }
      if (type === "fade") {
        oldEl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: "ease", fill: "forwards" });
        var b = newEl.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 420, delay: 200, easing: "ease", fill: "backwards" });
        b.finished.then(done, done);
        return;
      }
      // push(기본): 짧게 밀어내기
      oldEl.animate([{ transform: "none", opacity: 1 }, { transform: "translateX(" + (-dir * 140) + "px)", opacity: 0 }], { duration: 380, easing: E.in, fill: "forwards" });
      var c = newEl.animate([{ transform: "translateX(" + (dir * 200) + "px)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 700, delay: 120, easing: E.out, fill: "backwards" });
      c.finished.then(done, done);
    });
  }

  function runBeats(st, upto, instant) {
    st.A.instant = !!instant;
    for (var b = 0; b <= upto; b++) { try { st.beats[b](st.A, st.el); } catch (e) { console.error(e); } }
    st.A.instant = false;
  }

  function go(i, beat, opts) {
    opts = opts || {};
    if (i < 0 || i >= scenes.length) return;
    if (state.busy) return;
    fit();
    var dir = opts.dir || (i >= state.i ? 1 : -1);
    var old = state.el, oldA = state.A;
    var st = buildScene(i);
    var def = scenes[i];
    var type = opts.instant ? "push" : (dir < 0 ? "push" : (def.trans || "push"));
    if (opts.cut) type = "none";
    if (old && !opts.instant && !opts.cut) sfx(type === "whip" ? "whip" : type === "zoom" ? "zoomin" : type === "push" ? "swish" : "none", { dir: dir, v: 0.09, pan: dir * 0.3 });
    music(def.bgm || null);
    stopTimer(); state.timer = null;
    state.i = i; state.el = st.el; state.A = st.A; state.beats = st.beats;
    var target = beat === "last" ? st.beats.length - 1 : (beat || 0);
    state.beat = target;
    if (target > 0 || opts.instant) runBeats(st, target, true);
    state.busy = true;
    var started = false;
    var startBeat = function () {
      if (started || state.el !== st.el) return; started = true; state.pending = null;
      if (!(target > 0 || opts.instant)) runBeats(st, 0, false);
    };
    state.pending = startBeat;
    if (type === "whip" || type === "zoom") setTimeout(startBeat, type === "whip" ? 300 : 280); else startBeat();
    var p = type === "none" || !old ? Promise.resolve() : transition(old, st.el, type, dir);
    var settled = false;
    var finish = function () {
      if (settled) return; settled = true;
      if (old) { old.remove(); if (oldA) oldA.kill(); }
      st.el.style.transform = ""; scenesBox.style.filter = ""; streaks.style.opacity = 0;
      if (st.el.getAnimations) st.el.getAnimations().forEach(function (a) { try { a.finish(); } catch (e) {} });
      state.busy = false;
    };
    p.then(finish, finish);
    // 창이 가려져 애니메이션이 멈춰도 발표가 잠기지 않게
    setTimeout(finish, 1500);
    sync();
  }

  function next() {
    if (state.pending) state.pending(); // 첫 동작이 아직이면 먼저 실행
    if (state.busy) return;
    if (!state.started) state.started = Date.now();
    if (state.beat < state.beats.length - 1) {
      state.beat++;
      try { state.beats[state.beat](state.A, state.el); } catch (e) { console.error(e); }
      var def = scenes[state.i];
      if (def.practiceMin && state.beat === 1 && !state.timer && !SHARE) startTimer(def.practiceMin);
      sync();
    } else go(state.i + 1, 0, { dir: 1 });
  }
  function prev() {
    if (state.pending) state.pending();
    if (state.busy) return;
    if (state.beat > 0) {
      var b = state.beat - 1, keepTimer = state.timer;
      var old = state.el, oldA = state.A;
      var st = buildScene(state.i);
      runBeats(st, b, true);
      old.remove(); oldA.kill();
      state.el = st.el; state.A = st.A; state.beats = st.beats; state.beat = b;
      state.timer = keepTimer; paintTimer();
      sync();
    } else if (state.i > 0) go(state.i - 1, "last", { dir: -1, instant: true });
  }

  // ── 실습 타이머(로어서드 오른쪽 칸) ──
  var timerTick = null;
  function startTimer(min) {
    state.timer = { left: min * 60, total: min * 60, running: true, at: Date.now() };
    runTimer(); paintTimer(); music("focus");
  }
  function runTimer() {
    clearInterval(timerTick);
    timerTick = setInterval(function () {
      var t = state.timer; if (!t || !t.running) return;
      t.left = Math.max(0, t.left - 1); paintTimer();
      if (t.left === 0) { t.running = false; sfx("bell"); music(scenes[state.i].bgm || null); }
    }, 1000);
  }
  function stopTimer() { clearInterval(timerTick); }
  function paintTimer() {
    var t = state.timer, box = state.el && $("[data-timer]", state.el);
    if (box) {
      var s = $("span", box);
      if (s) s.textContent = t ? (t.left === 0 ? "시간 됐어요" : mmss(t.left)) : s.textContent;
      box.classList.toggle("run", !!(t && t.running));
      box.classList.toggle("done", !!(t && t.left === 0));
      box.classList.toggle("paused", !!(t && !t.running && t.left > 0));
    }
    presenterPaint();
  }
  function toggleTimer() {
    var def = scenes[state.i]; if (!def.practiceMin) return;
    if (!state.timer) { startTimer(def.practiceMin); return; }
    state.timer.running = !state.timer.running;
    if (state.timer.running) { runTimer(); music("focus"); } else music(scenes[state.i].bgm || null);
    paintTimer();
  }

  // ── 진행 표시·발표자 노트·개요 ──
  var hud, bar, notesBox, overview, help, blackout, toast;
  function partOf(def) { return PARTS[def.part] || { name: "" }; }
  function sync() {
    var def = scenes[state.i]; if (!def) return;
    bar.style.transform = "scaleX(" + ((state.i + 1) / scenes.length) + ")";
    $("#hud-part").textContent = (def.part ? def.part + "부 · " : "") + partOf(def).name;
    $("#hud-label").textContent = def.label;
    $("#hud-count").textContent = (state.i + 1) + " / " + scenes.length + (state.beats.length > 1 ? "  ·  단계 " + (state.beat + 1) + "/" + state.beats.length : "");
    var sc = $("#snav-count"); if (sc) sc.textContent = (state.i + 1) + " / " + scenes.length;
    $$("#hud-segs i").forEach(function (s, k) { s.classList.toggle("on", k === state.i); s.classList.toggle("past", k < state.i); });
    renderNotes();
    presenterPaint();
    try { history.replaceState(null, "", "#" + (state.i + 1)); } catch (e) {}
  }
  function renderNotes() {
    var def = scenes[state.i], nx = scenes[state.i + 1];
    notesBox.innerHTML = '<div class="nb-head"><b>' + def.label + "</b><span>" + (def.min ? "약 " + def.min + "분" : "") + (def.practiceMin ? " · 실습 타이머 " + def.practiceMin + "분 (T)" : "") + "</span></div>" +
      '<div class="nb-body">' + (def.notes || "") + "</div>" +
      (nx ? '<div class="nb-next">다음 · ' + nx.label + "</div>" : "");
  }
  function buildOverview() {
    var html = '<div class="ov-head"><h2>발표 구성</h2><p>장면을 누르면 그 자리로 갑니다 · 닫기 G</p></div><div class="ov-grid">';
    var byPart = {};
    scenes.forEach(function (s, i) { (byPart[s.part] = byPart[s.part] || []).push([s, i]); });
    Object.keys(byPart).forEach(function (p) {
      var part = PARTS[p], list = byPart[p];
      var mins = list.reduce(function (a, x) { return a + (x[0].min || 0); }, 0);
      html += '<section class="ov-part' + (part.isNew ? " new" : "") + '"><h3><span>' + (+p ? p + "부" : "시작") + "</span>" + part.name + "<em>" + Math.round(mins) + "분</em></h3><ol>";
      list.forEach(function (x) {
        var s = x[0];
        html += '<li><button type="button" data-go="' + x[1] + '"><i>' + (x[1] + 1) + "</i>" + s.label + (s.isNew ? ' <b class="nw">NEW</b>' : "") + (s.practiceMin ? ' <b class="pr">실습</b>' : "") + "</button></li>";
      });
      html += "</ol></section>";
    });
    overview.innerHTML = html + "</div>";
  }
  function showToast(msg) {
    toast.textContent = msg; toast.hidden = false;
    toast.animate([{ opacity: 0, transform: "translate(-50%,10px)" }, { opacity: 1, transform: "translate(-50%,0)" }], { duration: 300, easing: E.out });
    clearTimeout(showToast.t); showToast.t = setTimeout(function () { toast.hidden = true; }, 2600);
  }

  // ── 발표자 창(P): 노트·다음 장면·경과 시간. 파일로 열었을 때 쓴다 ──
  var pw = null;
  function openPresenter() {
    try { pw = window.open("", "aio-presenter", "width=1180,height=760"); } catch (e) { pw = null; }
    if (!pw) { showToast("발표자 창을 열 수 없는 환경이에요. N으로 노트를 켜 주세요."); return; }
    var d = pw.document;
    d.open();
    d.write('<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>발표자 화면 · AI 교무실 연수</title><style>' +
      "body{margin:0;background:#0b1626;color:#e8eef6;font-family:'Noto Sans KR','Apple SD Gothic Neo','Malgun Gothic',sans-serif;display:grid;grid-template-columns:1fr 340px;height:100vh}" +
      "main{padding:28px 32px;overflow:auto}aside{background:#0f1f35;padding:28px;display:flex;flex-direction:column;gap:18px;border-left:1px solid #22406a}" +
      ".lab{font-size:15px;color:#8fb0d6;letter-spacing:.04em}.cur{font-size:30px;font-weight:700;margin:6px 0 4px}.beat{color:#8fb0d6}" +
      ".notes{font-size:24px;line-height:1.7;margin-top:22px;max-width:46em}.notes b{color:#ffd27a}.nx{margin-top:26px;padding-top:16px;border-top:1px solid #22406a;color:#9fb6d2;font-size:18px}" +
      ".clock{font:600 46px 'IBM Plex Mono',Menlo,monospace}.small{font-size:14px;color:#8fb0d6}.tmr{font:600 40px 'IBM Plex Mono',Menlo,monospace;color:#ffd27a}" +
      "button{font:inherit;font-size:17px;padding:12px;border-radius:12px;border:1px solid #2c5384;background:#163055;color:#fff;cursor:pointer}button.big{font-size:22px;padding:18px}" +
      "</style></head><body><main><div class=lab id=part></div><div class=cur id=cur></div><div class=beat id=beat></div><div class=notes id=notes></div><div class=nx id=nx></div></main>" +
      "<aside><div><div class=small>경과</div><div class=clock id=el>00:00</div><div class=small>목표 약 50분 · 지금 <span id=now></span></div></div>" +
      "<div><div class=small>실습 타이머</div><div class=tmr id=tm>—</div></div>" +
      "<button class=big id=nb>다음 ▶</button><button id=pb>◀ 이전</button><button id=tb>타이머 시작/멈춤 (T)</button><div class=small>키: → 다음 · ← 이전 · T 타이머 · B 화면 가리기</div></aside></body></html>");
    d.close();
    d.getElementById("nb").onclick = next; d.getElementById("pb").onclick = prev; d.getElementById("tb").onclick = toggleTimer;
    d.addEventListener("keydown", onKey);
    presenterPaint();
  }
  function presenterPaint() {
    if (!pw || pw.closed) return;
    try {
      var d = pw.document, def = scenes[state.i], nx = scenes[state.i + 1];
      if (!d.getElementById("cur")) return;
      d.getElementById("part").textContent = (def.part ? def.part + "부 · " : "") + partOf(def).name + "  ·  " + (state.i + 1) + " / " + scenes.length;
      d.getElementById("cur").textContent = def.label;
      d.getElementById("beat").textContent = state.beats.length > 1 ? "단계 " + (state.beat + 1) + " / " + state.beats.length + (state.beat < state.beats.length - 1 ? " — 넘기면 화면 안에서 다음 단계" : " — 넘기면 다음 장면") : "";
      d.getElementById("notes").innerHTML = def.notes || "";
      d.getElementById("nx").textContent = nx ? "다음 장면 · " + nx.label : "마지막 장면입니다";
      var t = state.timer;
      d.getElementById("tm").textContent = t ? (t.left === 0 ? "시간 됐어요" : mmss(t.left) + (t.running ? "" : " (멈춤)")) : (def.practiceMin ? def.practiceMin + "분 · 첫 단계에서 시작" : "—");
    } catch (e) {}
  }
  setInterval(function () {
    if (!pw || pw.closed) return;
    try {
      var d = pw.document;
      d.getElementById("el").textContent = state.started ? mmss((Date.now() - state.started) / 1000) : "00:00";
      var n = new Date(); d.getElementById("now").textContent = String(n.getHours()).padStart(2, "0") + ":" + String(n.getMinutes()).padStart(2, "0");
    } catch (e) {}
  }, 1000);

  // ── 입력 ──
  var digits = "";
  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key;
    if (/^[0-9]$/.test(k)) { digits += k; clearTimeout(onKey.t); onKey.t = setTimeout(function () { digits = ""; }, 1500); showToast("장면 " + digits + " → Enter"); return; }
    if (k === "Enter" && digits) { var n = parseInt(digits, 10) - 1; digits = ""; go(clamp(n, 0, scenes.length - 1), 0, { dir: n >= state.i ? 1 : -1 }); return; }
    if (k === "ArrowRight" || k === "PageDown" || k === " " || k === "Enter") { e.preventDefault(); next(); }
    else if (k === "ArrowLeft" || k === "PageUp" || k === "Backspace") { e.preventDefault(); prev(); }
    else if (k === "Home") go(0, 0, { dir: -1, instant: true });
    else if (k === "End") go(scenes.length - 1, 0, { dir: 1 });
    else if (k === "f" || k === "F") toggleFull();
    else if (k === "n" || k === "N") { notesBox.hidden = !notesBox.hidden; }
    else if (k === "g" || k === "G" || k === "o" || k === "O") { overview.hidden = !overview.hidden; }
    else if (k === "p" || k === "P") openPresenter();
    else if (k === "t" || k === "T") toggleTimer();
    else if (k === "b" || k === "B" || k === ".") { blackout.hidden = !blackout.hidden; }
    else if (k === "m" || k === "M") soundCmd("toggle");
    else if (k === "j" || k === "J") soundCmd("bgm");
    else if (k === "[") soundCmd("down");
    else if (k === "]") soundCmd("up");
    else if (k === "?" || k === "h" || k === "H") { help.hidden = !help.hidden; }
    else if (k === "Escape") { overview.hidden = true; help.hidden = true; notesBox.hidden = true; blackout.hidden = true; }
  }
  function soundCmd(c) {
    var AU = window.AUDIO; if (!AU) return;
    AU.unlock();
    if (c === "toggle") { var on = AU.toggle(); showToast(on ? "소리 켬 · 크기 " + Math.round(AU.state.vol * 100) + "%" : "소리 끔"); if (on) sfx("pop"); }
    else if (c === "bgm") showToast(AU.toggleBgm() ? (AU.state.on ? "배경음 켬" : "배경음 켬 · 지금은 소리 전체가 꺼져 있어요(M)") : "배경음 끔");
    else { var v = AU.volume(c === "up" ? 0.1 : -0.1); showToast("소리 크기 " + Math.round(v * 100) + "%"); sfx("pop"); }
    paintSound();
  }
  function paintSound() {
    var AU = window.AUDIO, b = $("[data-cmd=sound]"), m = $("[data-cmd=bgm]");
    if (!AU || !b) return;
    b.textContent = (AU.state.on ? "소리 켬" : "소리 끔") + " M";
    if (m) m.textContent = (AU.state.bgmOn ? "배경음 켬" : "배경음 끔") + " J";
  }
  function toggleFull() {
    try {
      if (document.fullscreenElement) document.exitFullscreen();
      else { var p = document.documentElement.requestFullscreen(); if (p && p.catch) p.catch(function () { showToast("이 화면에서는 전체 화면을 쓸 수 없어요"); }); }
    } catch (e) { showToast("이 화면에서는 전체 화면을 쓸 수 없어요"); }
  }

  function start() {
    stage = $("#stage"); scenesBox = $("#scenes"); streaks = $("#streaks"); whipG = $("#whipg");
    hud = $("#hud"); bar = $("#bar i"); notesBox = $("#notes"); overview = $("#overview"); help = $("#help"); blackout = $("#black"); toast = $("#toast");
    fit(); window.addEventListener("resize", fit);
    try { new ResizeObserver(fit).observe(document.documentElement); } catch (e) {}
    document.addEventListener("fullscreenchange", function () { setTimeout(fit, 60); });
    document.addEventListener("keydown", onKey);
    var opened = false;
    var openSound = function () {
      if (!window.AUDIO) return;
      window.AUDIO.unlock();
      if (!opened) { opened = true; if (window.AUDIO.state.on) showToast("소리가 켜졌어요 · 끄기 M · 배경음 J · 크기 [ ]"); }
    };
    document.addEventListener("pointerdown", openSound, true);
    document.addEventListener("keydown", openSound, true);
    // 화면 누르기: 다음 / 오른쪽 클릭: 이전 / 밀기: 앞뒤
    var vp = $("#viewport"), sx = 0, sy = 0, down = false;
    vp.addEventListener("pointerdown", function (e) { down = true; sx = e.clientX; sy = e.clientY; });
    vp.addEventListener("pointerup", function (e) {
      if (!down) return; down = false;
      if (e.button === 2) return;
      var dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) { if (dx < 0) next(); else prev(); }
      else if (Math.abs(dx) < 10 && Math.abs(dy) < 10) next();
    });
    vp.addEventListener("contextmenu", function (e) { e.preventDefault(); prev(); });
    // 진행 표시는 마우스를 움직일 때만
    var idle;
    document.addEventListener("mousemove", function () { hud.classList.add("show"); clearTimeout(idle); idle = setTimeout(function () { hud.classList.remove("show"); }, 2600); });
    $("#hud-segs").innerHTML = scenes.map(function (s, i) { return '<i title="' + (i + 1) + ". " + s.label + '" data-go="' + i + '" style="--c:' + (PARTS[s.part] && PARTS[s.part].color || "#7cc8ff") + '"></i>'; }).join("");
    document.addEventListener("click", function (e) {
      var g = e.target.closest && e.target.closest("[data-go]");
      if (g) { var n = +g.getAttribute("data-go"); overview.hidden = true; go(n, 0, { dir: n >= state.i ? 1 : -1 }); return; }
      var c = e.target.closest && e.target.closest("[data-cmd]");
      if (c) {
        var cmd = c.getAttribute("data-cmd");
        if (cmd === "notes") notesBox.hidden = !notesBox.hidden;
        else if (cmd === "overview") overview.hidden = !overview.hidden;
        else if (cmd === "presenter") openPresenter();
        else if (cmd === "full") toggleFull();
        else if (cmd === "help") help.hidden = !help.hidden;
        else if (cmd === "sound") soundCmd("toggle");
        else if (cmd === "bgm") soundCmd("bgm");
        else if (cmd === "vol-") soundCmd("down");
        else if (cmd === "vol+") soundCmd("up");
      }
    });
    ["#hud", "#notes", "#overview", "#help", "#toast"].forEach(function (s) {
      var el = $(s);
      el.addEventListener("pointerdown", function (e) { e.stopPropagation(); });
      el.addEventListener("pointerup", function (e) { e.stopPropagation(); });
    });
    $("#black").addEventListener("click", function (e) { e.stopPropagation(); blackout.hidden = true; });
    buildOverview();
    paintSound();
    if (SHARE) setupShare();
    var startAt = 0;
    var m = /^#(\d+)$/.exec(location.hash || "");
    if (m) startAt = clamp(parseInt(m[1], 10) - 1, 0, scenes.length - 1);
    // 글꼴을 기다렸다가 시작(키네틱 글자가 대체 글꼴로 쪼개지지 않게)
    var begin = function () { go(startAt, 0, { dir: 1, cut: true }); };
    window.addEventListener("hashchange", function () {
      var mm = /^#(\d+)$/.exec(location.hash || ""); if (!mm) return;
      var n = clamp(parseInt(mm[1], 10) - 1, 0, scenes.length - 1);
      if (n !== state.i) { state.busy = false; go(n, 0, { dir: n >= state.i ? 1 : -1 }); }
    });
    if (document.fonts && document.fonts.ready) {
      var once = false, fire = function () { if (!once) { once = true; begin(); } };
      document.fonts.ready.then(fire); setTimeout(fire, 1800);
    } else begin();
  }

  // ── 공유 모드: 늘 보이는 이전·다음 단추, 세로 휴대폰 안내 ──
  function setupShare() {
    document.body.classList.add("share");
    var nav = h('<nav id="snav" aria-label="발표 넘기기">' +
      '<a href="index.html" class="home" aria-label="처음 화면">⌂</a>' +
      '<button type="button" data-s="prev" aria-label="이전">‹</button>' +
      '<button type="button" data-s="list" class="list"><span id="snav-count">1 / ' + scenes.length + '</span> 목록</button>' +
      '<button type="button" data-s="next" aria-label="다음">›</button></nav>');
    document.body.appendChild(nav);
    nav.addEventListener("pointerdown", function (e) { e.stopPropagation(); });
    nav.addEventListener("pointerup", function (e) { e.stopPropagation(); });
    nav.addEventListener("click", function (e) {
      var b = e.target.closest("[data-s]"); if (!b) return;
      var k = b.getAttribute("data-s");
      if (k === "prev") prev(); else if (k === "next") next(); else overview.hidden = !overview.hidden;
    });
    var tip = h('<div id="rotate" hidden><div><b>휴대폰을 가로로 돌려 보세요</b><p>발표 화면은 가로로 볼 때 글씨가 커집니다. 세로로 보기 편한 정리본도 있어요.</p>' +
      '<a href="guide.html">따라하기 안내로 보기</a><button type="button">그대로 보기</button></div></div>');
    document.body.appendChild(tip);
    var dismissed = false;
    tip.querySelector("button").addEventListener("click", function (e) { e.stopPropagation(); dismissed = true; tip.hidden = true; });
    ["pointerdown", "pointerup"].forEach(function (t) { tip.addEventListener(t, function (e) { e.stopPropagation(); }); });
    function check() { tip.hidden = dismissed || !(window.innerHeight > window.innerWidth && window.innerWidth < 760); }
    check(); window.addEventListener("resize", check);
    // 가만히 있으면 단추가 흐려져 화면을 덜 가린다
    var idle;
    function wake() { nav.classList.remove("idle"); clearTimeout(idle); idle = setTimeout(function () { nav.classList.add("idle"); }, 3200); }
    ["pointerdown", "pointermove", "keydown"].forEach(function (t) { document.addEventListener(t, wake, true); });
    wake();
  }

  window.DECK = {
    E: E, PARTS: PARTS,
    parts: function (list) { list.forEach(function (p) { PARTS[p.n] = p; }); },
    add: function (def) { scenes.push(def); },
    scenes: scenes, start: start, go: go, next: next, prev: prev, h: h, state: state
  };
})();

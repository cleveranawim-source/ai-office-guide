/* AI 교무실 짧은 연수(약 28분) — 전자칠판 · 분실물 함 · 넵 · AI 버튼
 * 연수 발표와 같은 엔진(deck.js)과 같은 화면 그림(img/*.jpg, 412×864 기준 좌표)을 쓴다. 동그라미 자리는 img/rects.js의 R(화면, 키).
 * 교실 칠판 그림은 img/board/*.jpg(1600×900). 발표 멘트(notes)는 N(노트)·P(발표자 창)에서 보인다.
 */
(function () {
  "use strict";
  var D = window.DECK, E = D.E, h = D.h;
  var R = window.R || function () { return null; };
  var TOTAL = 4;

  D.parts([
    { n: 0, name: "시작", color: "#8fd0ff" },
    { n: 1, name: "전자칠판", color: "#79c6d9" },
    { n: 2, name: "분실물 함", color: "#e59a7a" },
    { n: 3, name: "넵", color: "#9fb3f0" },
    { n: 4, name: "AI 버튼", color: "#b49cf2" },
    { n: 5, name: "마무리", color: "#8fd0ff" }
  ]);

  var css = document.createElement("style");
  css.textContent = `
  .cv-brand{left:140px;top:116px;display:flex;gap:22px;align-items:center}
  .cv-brand img{width:88px;height:88px;border-radius:24px;background:#fff;padding:12px}
  .cv-brand small{display:block;font:600 18px var(--mono);letter-spacing:.26em;color:var(--glow)}
  .cv-brand b{font:800 36px var(--display);letter-spacing:-.01em}
  .cv-kicker{left:140px;top:300px;font:700 30px var(--body);color:var(--glow);letter-spacing:.05em}
  .cv-title{left:130px;top:352px;font:900 132px/1.08 var(--display);letter-spacing:-.045em;color:#fff}
  .cv-title em{color:var(--glow)}
  .cv-three{left:140px;top:680px;display:flex;gap:14px}
  .cv-three span{display:flex;align-items:center;gap:12px;padding:12px 26px 12px 14px;border-radius:999px;background:rgba(14,34,60,.7);border:1.5px solid rgba(143,208,255,.32);font:700 28px var(--body);color:#e8eef6}
  .cv-three i{width:40px;height:40px;border-radius:50%;display:grid;place-items:center;font:700 20px var(--mono);font-style:normal;color:var(--night);background:var(--glow)}
  .cv-three span:last-child i{background:#c9b6ff}
  .cv-lead{left:140px;top:800px;font:500 32px/1.55 var(--body);color:#cfe0f3}
  .cv-lead b{color:#fff}
  .cv-qr{right:150px;top:250px;width:430px;padding:34px 34px 30px;border-radius:32px;background:#fff;color:var(--ink);text-align:center;box-shadow:0 40px 90px rgba(0,0,0,.45)}
  .cv-qr img{width:100%;display:block}
  .cv-qr p{font:600 25px var(--mono);margin-top:14px}
  .cv-qr small{font:500 20px var(--body);color:var(--muted)}

  .steps.tight{gap:8px}
  .steps.tight li{font-size:25px;padding:10px 18px 10px 12px}
  .steps.tight li::before{width:44px;height:44px;font-size:21px}
  .steps.xtight{gap:5px}
  .steps.xtight li{font-size:23px;line-height:1.36;padding:7px 16px 7px 10px}
  .steps.xtight li::before{width:40px;height:40px;font-size:19px}
  .steps li .aib{display:inline-block;padding:0 10px;border-radius:8px;background:var(--ai);color:#fff;font-weight:800;font-size:.82em;line-height:1.5;margin-right:6px}
  .steps li:not(.on) .aib{background:var(--ai-tint);color:var(--ai-ink)}
  .side-note .ag3{display:flex;flex-wrap:wrap;gap:8px 22px}
  .side-note .ag3 b{color:var(--brand-deep)}

  .steps.bt{width:780px}
  .steps.bt li b{color:inherit}
  .tv{left:960px;top:250px;width:860px;height:520px;border-radius:26px;background:#1c2431;padding:16px;box-shadow:0 40px 90px rgba(14,28,48,.35)}
  .tv::after{content:"";position:absolute;left:50%;bottom:-48px;width:190px;height:48px;margin-left:-95px;background:linear-gradient(#2a3446,#1c2431);clip-path:polygon(18% 0,82% 0,100% 100%,0 100%)}
  .tv .in{position:relative;width:100%;height:100%;border-radius:10px;overflow:hidden;background:#0d1520}
  .tv .in img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0}
  .tv-note{left:960px;top:850px;width:860px;text-align:center;font:500 20px var(--body);color:var(--muted)}

  .stu-h{position:absolute;top:300px;display:flex;align-items:center;gap:14px;font:800 30px var(--display);letter-spacing:-.02em}
  .stu-h i{width:44px;height:44px;border-radius:50%;background:var(--brand);color:#fff;display:grid;place-items:center;font:700 22px var(--mono);font-style:normal}
  .stu-tv{left:120px;top:370px;width:940px;height:540px}
  .stu-ph{left:1180px;top:366px;width:273px;height:553px}
  .stu-ph .phone{transform:scale(.62);transform-origin:0 0}
  .stu-ph .screen img{width:412px;height:864px;display:block}
  .stu-ls{left:1490px;top:380px;width:320px;display:grid;gap:12px}
  .stu-ls span{display:flex;gap:10px;align-items:flex-start;font:600 24px/1.4 var(--body);color:var(--ink)}
  .stu-ls span::before{content:"✓";flex:none;width:30px;height:30px;border-radius:50%;background:var(--ok-tint);color:var(--ok);display:grid;place-items:center;font:800 17px var(--body);margin-top:2px}
  .stu-ls span.no{color:#8f2e14}
  .stu-ls span.no::before{content:"✕";background:var(--warn-tint);color:var(--warn)}

  .askc{top:320px;width:520px;padding:34px;display:flex;flex-direction:column;gap:14px;min-height:470px}
  .askc .sn{font:600 26px var(--mono);color:var(--brand)}
  .askc h3{font:800 42px var(--display)}
  .askc p{font:500 25px/1.5 var(--body);color:var(--muted)}
  .askc p b{color:var(--ink)}
  .askc .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:6px}
  .askc .chips span{padding:8px 16px;border-radius:999px;background:var(--brand-tint);color:var(--brand-deep);font:600 20px var(--body)}
  .askc .chips span.hot{background:var(--new);color:var(--new-ink)}
  .askc.confirm{border-color:var(--brand);box-shadow:0 0 0 3px rgba(41,92,158,.14)}
  .askc .lim{margin-top:auto;display:grid;gap:8px;padding-top:16px;border-top:1px solid var(--line)}
  .askc .lim span{font:600 21px/1.4 var(--body);color:var(--muted)}
  .askc .lim span b{color:var(--ink)}
  .aibar{left:120px;top:840px;display:flex;align-items:center;gap:22px}
  .aibar .strip{width:412px;height:96px;border-radius:18px;overflow:hidden;background:url(img/ai-home.jpg) 0 -768px/412px 864px no-repeat;box-shadow:0 14px 34px rgba(14,28,48,.15);transform:scale(1.25);transform-origin:left center}
  .aibar p{font:600 26px var(--body);margin-left:110px}

  .ten{left:120px;top:300px;width:1680px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(5,auto);grid-auto-flow:column;gap:14px 28px}
  .ten .r{display:grid;grid-template-columns:52px minmax(0,1fr) auto;gap:18px;align-items:center;padding:16px 22px;border-radius:18px;background:var(--surface);border:1px solid var(--line);min-height:104px}
  .ten .n{font:600 26px var(--mono);color:var(--ai)}
  .ten .s{font:700 26px/1.38 var(--body);color:var(--ink)}
  .ten .c{padding:6px 14px;border-radius:999px;background:var(--ai-tint);color:var(--ai-ink);font:700 19px var(--body);white-space:nowrap}
  .ten .r.hot{border-color:var(--ai);box-shadow:0 0 0 3px rgba(109,79,216,.14)}
  .ten-foot{left:120px;top:924px;width:1680px;display:flex;gap:14px;flex-wrap:wrap;font:500 23px var(--body);color:var(--muted)}
  .ten-foot b{color:var(--ink)}

  .bw{left:120px;top:304px;width:840px;display:grid;gap:12px}
  .bw .r{display:grid;grid-template-columns:236px minmax(0,1fr);gap:20px;align-items:center;padding:15px 22px;border-radius:20px;background:var(--surface);border:1.5px solid var(--line);transition:opacity .4s,box-shadow .4s,border-color .4s,background .4s}
  .bw.focus .r:not(.on){filter:opacity(.42)}
  .bw .r.on{border-color:var(--brand);box-shadow:0 14px 34px rgba(14,28,48,.12)}
  .bw .r.on.warn{border-color:var(--warn);background:var(--warn-tint)}
  .bw .c{justify-self:start;display:inline-flex;align-items:center;gap:9px;padding:5px 16px;border-radius:999px;border:2px solid #d5dde8;background:#fff;font:500 25px var(--body);color:#12213a;white-space:nowrap}
  .bw .c b{font-weight:800}
  .bw .c.live span{color:#1fa855;font-weight:800}
  .bw .c.live i{width:13px;height:13px;border-radius:50%;background:#1fa855;box-shadow:0 0 0 4px #dcf3e4;animation:bwBlink 1.2s ease-in-out infinite}
  .bw .c.done span{color:#005fa3;font-weight:800}
  .bw .c.off span{color:#5b687c}
  .bw h4{font:800 29px/1.3 var(--display);letter-spacing:-.02em;color:var(--ink)}
  .bw p{font:500 22px/1.4 var(--body);color:var(--muted);margin-top:3px}
  .bw p b{color:var(--ink)}
  .bw-foot{left:120px;top:790px;width:840px;display:grid;gap:4px;font:500 23px/1.45 var(--body);color:var(--muted)}
  .bw-foot b{color:var(--ink)}
  @keyframes bwBlink{50%{opacity:.25}}

  .cl-title{left:132px;top:170px;font:900 120px/1.08 var(--display);letter-spacing:-.04em}
  .cl-title em{color:var(--glow)}
  .cl-do{left:140px;top:470px;width:1040px;display:grid;gap:14px}
  .cl-do div{display:grid;grid-template-columns:60px 1fr;gap:22px;align-items:center;padding:15px 24px;border-radius:22px;background:rgba(6,18,31,.72);border:1px solid rgba(143,208,255,.22);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px)}
  .cl-do i{width:60px;height:60px;border-radius:18px;background:var(--glow);color:var(--night);display:grid;place-items:center;font:700 30px var(--mono);font-style:normal}
  .cl-do div.ai i{background:#c9b6ff}
  .cl-do b{display:block;font:800 33px/1.25 var(--display);color:#fff;letter-spacing:-.02em}
  .cl-do span{display:block;font:500 22px/1.4 var(--body);color:#bcd2ea;margin-top:4px}
  .cl-ask{right:120px;top:560px;width:560px;text-align:right;padding:34px 40px;border-radius:28px;background:rgba(6,18,31,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(143,208,255,.25)}
  .cl-ask strong{color:var(--glow)}
  .cl-ask b{display:block;font:900 72px/1.1 var(--display);letter-spacing:-.03em}
  .cl-ask span{display:block;margin-top:18px;font:500 28px/1.5 var(--body);color:#cfe0f3}
  .n3{left:120px;top:250px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:40px}
  .n3 .c{display:flex;flex-direction:column;align-items:center;gap:22px}
  .n3 .ph{width:302px;height:630px;border-radius:40px;padding:9px;background:#0e1c30;box-shadow:0 40px 80px rgba(14,28,48,.32)}
  .n3 .ph img{width:100%;height:100%;object-fit:cover;object-position:top;border-radius:32px;display:block}
  .n3 .cap{display:flex;gap:16px;align-items:flex-start;width:470px}
  .n3 .no{flex:none;width:46px;height:46px;border-radius:50%;background:var(--brand);color:#fff;display:grid;place-items:center;font:700 24px var(--mono);margin-top:2px}
  .n3 h3{font:800 34px var(--display);letter-spacing:-.02em}
  .n3 h3 small{font:600 20px var(--body);color:var(--muted);margin-left:8px;letter-spacing:0}
  .n3 p{font:500 22px/1.45 var(--body);color:var(--muted);margin-top:6px}
  .n3 p b{color:var(--ink)}

  .nm{left:120px;top:300px;width:1080px;display:grid;gap:14px}
  .nm .r{display:grid;grid-template-columns:220px 56px 1fr auto;align-items:center;gap:10px;padding:18px 26px;border-radius:20px;background:var(--surface);border:1px solid var(--line)}
  .nm .old{position:relative;justify-self:start;font:600 30px var(--body);color:var(--faint)}
  .nm .old i{position:absolute;left:-6px;right:-6px;top:54%;height:4px;border-radius:2px;background:var(--warn);transform-origin:left}
  .nm .ar{font:700 30px var(--body);color:var(--faint);text-align:center}
  .nm .new{font:800 40px var(--display);letter-spacing:-.02em;color:var(--ink)}
  .nm .bt{justify-self:end;display:flex;gap:10px;align-items:center;font:500 21px var(--body);color:var(--muted)}
  .nm .bt b{padding:8px 18px;border-radius:12px;background:var(--brand);color:#fff;font:800 22px var(--body)}
  .nm .bt b.dn{background:var(--ok-tint);color:var(--ok)}
  .nm .r.plus{background:transparent;border-style:dashed;grid-template-columns:1fr auto}
  .nm .r.plus .new{font-size:30px}
  .nm .r.plus .new small{font:500 22px var(--body);color:var(--muted);margin-left:12px}
  .nkeep{left:1260px;top:300px;width:540px;padding:30px 32px;display:grid;gap:14px}
  .nkeep h3{font:800 30px var(--display)}
  .nkeep p{display:grid;grid-template-columns:150px 1fr;gap:12px;font:500 23px/1.4 var(--body);color:var(--muted)}
  .nkeep p b{color:var(--ink)}
  .nkeep p.warn b{color:var(--warn)}
  `;
  document.head.appendChild(css);

  // ── 부품 ──
  function scr(inner) { return '<div class="scr">' + inner + "</div>"; }
  function shot(name) { return scr('<img class="shot" src="img/' + name + '.jpg" alt="">'); }
  function cam(screens) { return '<div class="cam"><div class="rig"><div class="phone"><div class="screen">' + screens.join("") + '<div class="fx"></div></div></div></div></div>'; }
  function strip(s) { return String(s).replace(/<[^>]+>/g, ""); }
  function rectOf(el, scrEl) {
    var x = 0, y = 0, n = el;
    while (n && n !== scrEl) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return [x, y, el.offsetWidth, el.offsetHeight];
  }
  function darkBg(art, flip) {
    return '<div class="art-wrap' + (flip ? " flip" : "") + '"><img src="img/art/' + art + '.jpg" alt=""></div><div class="shade"></div><div class="grain"></div><div class="vignette"></div>';
  }

  // ── 부 시작 장면 ──
  function opener(o) {
    D.add({
      id: "op" + o.part, part: o.part, label: o.part + "부 시작 · " + D.PARTS[o.part].name, kind: "dark", min: 0.3, trans: "whip",
      notes: o.notes,
      html: darkBg(o.art, o.flip) +
        '<div class="op-num">' + String(o.part).padStart(2, "0") + "</div>" +
        '<p class="op-kicker"><span>' + o.part + "부 · " + D.PARTS[o.part].name + '</span><span class="pill">' + o.min + "분</span></p>" +
        '<h2 class="op-title">' + o.lines.map(function (l) { return '<span class="ln">' + l + "</span>"; }).join("") + "</h2>" +
        '<div class="op-ba"><div class="row was"><span class="lbl">전에는</span><span class="txt">' + o.was + '<i class="strike"></i></span></div>' +
        '<div class="row now"><span class="lbl">이제는</span><span class="txt">' + o.now + '<i class="hl"></i></span></div></div>' +
        '<p class="op-part">PART ' + String(o.part).padStart(2, "0") + " / " + String(TOTAL).padStart(2, "0") + "</p>",
      build: function (el, A) {
        return [function (A) {
          var f = o.flip ? "scaleX(-1) " : "";
          A.go(".art-wrap img", [{ transform: f + "scale(1.42) translate(3%, 2%)", filter: "brightness(.4) blur(6px)" }, { transform: f + "scale(1.16) translate(1.5%, 1%)", filter: "brightness(1) blur(0px)" }], { d: 1600, e: E.out });
          A.kenburns(".art-wrap img", { from: f + "scale(1.16) translate(1.5%, 1%)", to: f + "scale(1.06) translate(-1.5%, -1%)", d: 30000, delay: 1600 });
          A.sfx("riser", { d: 1.05, delay: 120 });
          A.go(".op-num", [{ transform: "translateX(320px)", opacity: 0 }, { transform: "none", opacity: 1 }], { d: 1800, e: E.out });
          A.wipe(".op-kicker > *", { delay: 250, each: 120 });
          var t = A.kinetic(".op-title", { delay: 380, each: 40 });
          A.rise(".op-ba .row", { delay: t + 150, each: 650, y: 30 });
          A.draw(".op-ba .strike", { delay: t + 650, d: 480 });
          A.sfx("scribble", { d: 0.45, delay: t + 650 });
          A.draw(".op-ba .hl", { delay: t + 1350, d: 520 });
          A.sfx("pop", { delay: t + 1400 });
          A.wipe(".op-part", { delay: t + 300 });
        }];
      }
    });
  }

  // ── 실습·둘러보기: 왼쪽 단계, 오른쪽 휴대폰(넘길 때마다 누를 곳으로 들어감) ──
  function practice(o) {
    D.add({
      id: o.id, part: o.part, label: o.label, kind: "light practice", min: o.min, practiceMin: o.practiceMin, isNew: o.isNew, notes: o.notes, trans: o.trans || "push",
      html: '<div class="chiprow">' + o.chips.map(function (c) { return '<span class="chip ' + (c.c || "") + '">' + c.t + "</span>"; }).join("") + "</div>" +
        '<h2 class="title">' + o.title + "</h2>" +
        '<ol class="steps">' + o.steps.map(function (s) { return "<li" + (s.warn ? ' class="warn"' : "") + "><span>" + s.t + "</span></li>"; }).join("") + "</ol>" +
        (o.note ? '<div class="side-note ' + (o.note.tone || "") + '">' + o.note.html + "</div>" : "") +
        cam(o.screens),
      build: function (el, A) {
        var P = null, lis = A.$$(".steps li"), wlt = null;
        function place() {
          var n = A.$(".side-note"), s = A.$(".steps");
          // 단계가 많아 아래 띠(928px~)에 닿으면 한 번 더 촘촘하게
          if (!n) { if (s.offsetTop + s.offsetHeight > 900) s.classList.add("tight"); if (s.offsetTop + s.offsetHeight > 912) s.classList.add("xtight"); return; }
          if (s.offsetTop + s.offsetHeight > 700) s.classList.add("tight");
          var top = s.offsetTop + s.offsetHeight + 22;
          n.style.top = Math.min(top, 912 - n.offsetHeight) + "px";
        }
        var beats = [function (A) {
          place();
          A.wipe(".chiprow > *", { each: 110 });
          A.kinetic(".title", { delay: 120, each: 22 });
          A.rise(".steps li", { delay: 420, each: 70, y: 26, snd: "pluck", v: 0.05 });
          if (A.$(".side-note")) A.rise(".side-note", { delay: 520 + lis.length * 70, y: 20 });
          P = A.phone(".cam", o.phone);
          P.enter({ delay: 160 });
          A.lt(Object.assign({ tag: o.num ? "실습 " + o.num : "둘러보기", title: o.ltTitle || strip(o.title), sub: o.sub || (o.practiceMin ? "휴대폰으로 함께 따라 해 보세요" : "화면을 보며 함께 확인해요"), timer: o.practiceMin, delay: 1000 }, o.lt || {}));
        }];
        o.steps.forEach(function (st, i) {
          beats.push(function (A) {
            lis.forEach(function (li, k) { li.classList.toggle("on", k === i); li.classList.toggle("done", k < i); });
            A.go(lis[i], [{ transform: "translateX(-16px)" }, { transform: "none" }], { d: 520, e: E.out });
            if (st.s != null) P.show(st.s);
            var r = st.r;
            if (typeof r === "string") { var tgt = P.el(st.s != null ? st.s : 0).querySelector(r); r = tgt ? rectOf(tgt, P.el(st.s != null ? st.s : 0)) : null; }
            if (r) P.focus(r, { z: st.z, tone: st.warn ? "warn" : (st.newf ? "new" : ""), label: st.label, fy: st.fy, d: st.s != null ? 900 : 820 });
            else P.wide();
            if (wlt) { A.ltOut(wlt); wlt = null; }
            if (st.warn) wlt = A.lt({ tone: "warn up", tag: "오늘은 누르지 않아요", title: st.warn, delay: 350 });
          });
        });
        beats.push(function (A) {
          lis.forEach(function (li) { li.classList.remove("on"); li.classList.add("done"); });
          P.wide();
          if (wlt) { A.ltOut(wlt); wlt = null; }
        });
        return beats;
      }
    });
  }

  // ── 「AI로 하면」: 같은 일을 메뉴로 한 번, AI 한 문장으로 한 번 ──
  function aiWay(o) {
    practice(Object.assign({
      num: null, trans: "zoom",
      chips: [{ t: "AI로 하면", c: "ai" }, { t: "보기만", c: "ghost" }],
      note: { tone: "ai", html: '<span class="vs"><b>메뉴로</b> ' + o.menu + '</span><span class="vs"><b>AI로</b> 「' + o.say + "」 한 문장</span>" },
      lt: { tag: "AI로 하면", title: "「" + o.say + "」", sub: "메뉴를 몰라도, 말하면 카드로 · 누르는 건 선생님", tone: "ai" }
    }, o));
  }

  // ── 교실 칠판 장면: 왼쪽 목록, 오른쪽 칠판 화면이 넘길 때마다 바뀜 ──
  function tvScene(o) {
    D.add({
      id: o.id, part: o.part, label: o.label, kind: "light", min: o.min, isNew: o.isNew, notes: o.notes, trans: o.trans || "push",
      html: '<div class="chiprow">' + o.chips.map(function (c) { return '<span class="chip ' + (c.c || "") + '">' + c.t + "</span>"; }).join("") + "</div>" +
        '<h2 class="title" style="width:820px">' + o.title + "</h2>" +
        '<ol class="steps bt">' + o.items.map(function (x) { return "<li><span><b>" + x[0] + "</b> · " + x[1] + "</span></li>"; }).join("") + "</ol>" +
        '<div class="abs tv"><div class="in">' + o.items.map(function (x) { return '<img src="img/board/' + x[2] + '.jpg" alt="">'; }).join("") + "</div></div>" +
        (o.foot ? '<p class="abs tv-note">' + o.foot + "</p>" : ""),
      build: function (el, A) {
        var imgs = A.$$(".tv img"), lis = A.$$(".steps.bt li"), cur = -1;
        function show(i) {
          lis.forEach(function (li, k) { li.classList.toggle("on", k === i); li.classList.toggle("done", k < i); });
          if (cur >= 0) A.go(imgs[cur], [{ opacity: 1 }, { opacity: 0 }], { d: 500, e: E.in });
          A.go(imgs[i], [{ opacity: 0, transform: "scale(1.04)" }, { opacity: 1, transform: "none" }], { d: 700, e: E.out });
          A.sfx(o.items[i][2] === "alert" ? "alert" : "pop");
          cur = i;
        }
        var beats = [function (A) {
          A.wipe(".chiprow > *"); A.kinetic(".title", { delay: 100, each: 26 });
          A.rise(".steps.bt li", { delay: 400, each: 70, y: 20 });
          A.go(".tv", [{ opacity: 0, transform: "translateY(60px) scale(.95)" }, { opacity: 1, transform: "none" }], { d: 1000, delay: 300, e: E.out });
          if (A.$(".tv-note")) A.rise(".tv-note", { delay: 900 });
          A.later(function () { show(0); }, 700);
        }];
        for (var i = 1; i < imgs.length; i++) (function (i) { beats.push(function () { show(i); }); })(i);
        if (o.end) beats.push(function (A) { lis.forEach(function (li) { li.classList.remove("on"); li.classList.add("done"); }); A.lt(o.end); });
        return beats;
      }
    });
  }

  // ════════════════════════════════════════════════════════════
  // 시작
  // ════════════════════════════════════════════════════════════
  D.add({
    id: "cover", part: 0, label: "표지 · 접속 안내", kind: "dark", min: 0.5, trans: "fade", bgm: "lobby",
    notes: "시작 전부터 이 화면을 띄워 둡니다. <b>휴대폰 카메라로 QR을 찍어 AI 교무실을 열어 두시라고</b> 안내합니다. 오늘은 짧게 네 가지 — <b>교실 전자칠판에 띄우기</b>, 새로 열린 <b>분실물 함</b>, 10월 18일에 메신저처럼 바뀐 <b>넵</b>, 그리고 아래 탭 가운데 <b>AI 버튼</b>입니다. 듣기만 하기보다 휴대폰으로 함께 눌러 보는 시간이라고 말씀드립니다.",
    html: darkBg("cover") +
      '<div class="abs cv-brand"><img src="img/symbol-128.png" alt=""><div><small>MYONGJI MIDDLE SCHOOL</small><b>AI 교무실</b></div></div>' +
      '<p class="abs cv-kicker">교직원 연수 · 10월 21일(수) · 약 25~30분</p>' +
      '<h1 class="abs cv-title"><span class="ln">칠판, 분실물, 넵,</span><span class="ln">그리고 <em>AI 버튼</em></span></h1>' +
      '<div class="abs cv-three"><span><i>1</i>전자칠판</span><span><i>2</i>분실물 함</span><span><i>3</i>넵</span><span><i>4</i>AI 버튼</span></div>' +
      '<p class="abs cv-lead">휴대폰 카메라로 오른쪽 <b>QR</b>을 찍어 열어 두세요.</p>' +
      '<div class="abs cv-qr"><img src="img/qr.svg" alt="mjms-office.vercel.app 주소 QR 코드"><p>mjms-office.vercel.app</p><small>카메라로 찍으면 바로 열립니다</small></div>',
    build: function (el, A) {
      return [function (A) {
        A.go(".art-wrap img", [{ transform: "scale(1.35)", filter: "brightness(.3)" }, { transform: "scale(1.12)", filter: "brightness(1)" }], { d: 2200, e: E.out });
        A.kenburns(".art-wrap img", { from: "scale(1.12)", to: "scale(1.03) translate(-1.5%, 0.8%)", d: 60000, delay: 2200 });
        A.pop(".cv-brand img", { delay: 200, s: 0.4 });
        A.wipe(".cv-brand div", { delay: 380 });
        A.wipe(".cv-kicker", { delay: 520 });
        var t = A.kinetic(".cv-title", { delay: 640, each: 44, punch: 2.1 });
        A.pop(".cv-three span", { delay: t + 60, each: 140, s: 0.7 });
        A.rise(".cv-lead", { delay: t + 500 });
        A.go(".cv-qr", [{ transform: "perspective(1200px) translateX(220px) rotateY(-38deg)", opacity: 0 }, { transform: "perspective(1200px) translateX(0px) rotateY(0deg)", opacity: 1 }], { d: 1300, delay: 700, e: E.out });
        A.later(function () { A.go(".cv-qr", [{ transform: "translateY(0)" }, { transform: "translateY(-12px)" }], { d: 2600, iter: Infinity, dir: "alternate", e: "ease-in-out", ambient: true }); }, 2000);
      }];
    }
  });

  practice({
    id: "map", part: 0, num: null, label: "오늘 볼 세 곳", min: 1, trans: "whip",
    chips: [{ t: "오늘 순서" }, { t: "약 25~30분", c: "ghost" }], title: "오늘은 <em>네 곳</em>만 기억하세요",
    steps: [
      { t: '더보기 → 도구의 <span class="k">전자칠판 알림</span> · 교실 칠판에 안내·쪽지·긴급', s: 0, r: R("more-tools", "board") },
      { t: '더보기 → 학생의 <span class="k">분실물 함</span> · 사진 한 장으로 넣고, 돌려주고', s: 0, r: R("more-tools", "lost") },
      { t: '아래 탭 둘째 칸 <span class="k">넵</span> · 10월 18일부터 메신저처럼', s: 0, r: R("home", "tabNep"), z: 1.8 },
      { t: '아래 탭 가운데 <span class="k">AI</span> · 말로 묻고, 부탁하면 카드로', s: 0, r: R("ai-home", "tab_ai"), z: 1.8 }
    ],
    note: { html: '<span class="ag3"><span><b>1부</b> 전자칠판 8분</span><span><b>2부</b> 분실물 함 5분</span><span><b>3부</b> 넵 6분</span><span><b>4부</b> AI 버튼 6분</span></span>' },
    lt: { tag: "오늘 순서", title: "더보기 두 곳, 아래 탭 넵과 AI", sub: "휴대폰으로 AI 교무실을 열고 함께 찾아 두세요" },
    screens: [shot("more-tools")],
    notes: "오늘 볼 곳은 네 군데뿐입니다. 아래 탭 <b>더보기</b>를 열면 「도구」 묶음에 <b>전자칠판 알림</b>, 바로 아래 「학생」 묶음에 <b>분실물 함</b>이 있습니다(10월 19일부터 「학생」 묶음이 「학교」보다 위로 올라왔습니다). 그리고 아래 탭 둘째 칸 <b>넵</b>과 가운데 볼록한 <b>AI</b> 버튼. 다 같이 더보기를 열어 두 메뉴가 어디 있는지 먼저 확인합니다."
  });

  // ════════════════════════════════════════════════════════════
  // 1부 · 전자칠판
  // ════════════════════════════════════════════════════════════
  opener({
    part: 1, art: "board", min: 8, lines: ["교실 칠판까지", "<em>휴대폰에서</em>"],
    was: "방송·쪽지·교실마다 직접 가서 전달", now: "무엇을 → 어디에 → 보내기, 교실 칠판에 바로",
    notes: "1부는 <b>전자칠판</b>입니다. 먼저 교실 칠판에 무엇이 어떻게 뜨는지 보고, 휴대폰에서 보내는 법을 함께 따라 해 봅니다(보내기 단추는 누르지 않습니다). 끝으로 칠판이 알아서 하는 일 — 아침 8시 45분 쪽지, 수업 중 숨기, 점심시간 분실물 띠 — 을 봅니다."
  });

  tvScene({
    id: "tv", part: 1, label: "교실 칠판에는 이렇게", min: 1.5, trans: "zoom",
    chips: [{ t: "교실 칠판" }, { t: "반·이름은 예시", c: "ghost" }], title: "교실 칠판에는 <em>이렇게</em> 뜹니다",
    items: [["평소", "반 이름과 큰 시계", "idle"], ["안내", "사진은 위에 크게, 글은 아래", "notice-photo"], ["링크", "QR과 [▶ 영상 틀기]", "youtube"], ["쪽지", "오른쪽 위 노란 쪽지, 수업 화면은 그대로", "tmemo"], ["긴급", "빨간 전체 화면과 경보음", "alert"], ["음성", "「띵」 뒤 두 번, [다시 듣기]", "voice"]],
    foot: "알림을 교실에서 누르면 보낸 선생님 화면에 「확인완료」",
    notes: "교실 칠판은 평소에 <b>반 이름과 큰 시계</b>만 보입니다. 휴대폰에서 보내면 바로 뜹니다. <b>안내</b>는 사진을 붙이면 위에 크게, 글은 아래. <b>링크</b>를 붙이면 학생이 찍을 QR과, 유튜브면 칠판에서 바로 트는 [▶ 영상 틀기]가 뜹니다. <b>쪽지</b>는 수업 화면을 가리지 않고 오른쪽 위에 노란 쪽지로(60자). <b>긴급</b>은 빨간 전체 화면과 경보음. <b>음성</b>은 「띵」 뒤 두 번 저절로 나오고 [다시 듣기]도 됩니다. 교실에서 알림을 누르면 보낸 선생님 화면에 「확인완료」로 바뀝니다. 학생들도 보는 화면이니 개인적인 내용은 넵으로 보내 주세요."
  });

  practice({
    id: "send", part: 1, num: 1, label: "실습 1 · 칠판에 보내기", min: 2.5, practiceMin: 2,
    chips: [{ t: "실습 1 · 전자칠판" }, { t: "보내지는 않아요", c: "ghost" }], title: "무엇을 → 어디에 → <em>보내기</em>",
    steps: [
      { t: '더보기 → <span class="k">전자칠판 알림</span>: 맨 위 <span class="q">안내 · 쪽지 · 긴급</span>', s: 0, r: R("board-send", "kinds") },
      { t: '<b>무엇을</b>: 칠판에 띄울 말, + 링크 · 사진 · 음성 · 예약 · 띄울 시간', s: 0, r: R("board-send", "options") },
      { t: '<b>어디에</b>: 담임은 <span class="q">「내 반」</span>이 기본, 단추에 <span class="q">「2학년 3반에 띄우기」</span>', s: 0, r: R("board-send", "mine"), z: 1.9 },
      { t: '학년 전체는 <b>여러 학년 함께</b> 눌러집니다', s: 1, r: R("board-grades", "g2"), z: 1.9 },
      { t: '<span class="k">직접 고르기</span>: 초록불은 지금 켜진 칠판, 특별실도', s: 2, r: R("board-pick", "grid") },
      { t: '보낸 뒤 <span class="q">「오늘 칠판에 나간 알림」</span>: 교실마다 상태가 한 단어로(다음 장면)', s: 3, r: R("board-sent", "liveChip"), z: 1.9 }
    ],
    note: { tone: "warn", html: "<span>오늘은 <b>보내기 단추를 누르지 않습니다</b>. 누르면 실제 교실 칠판에 뜹니다.</span>" },
    screens: [shot("board-send"), shot("board-grades"), shot("board-pick"), shot("board-sent")],
    notes: "다 같이 더보기 → <b>전자칠판 알림</b>을 엽니다. 보내기 화면은 <b>무엇을 → 어디에 → 보내기</b> 순서입니다. 담임 선생님은 「내 반」이 기본으로 골라져 있고, 보내기 단추에 「2학년 3반에 띄우기」처럼 어디로 가는지가 적힙니다. 학년 전체는 1·2학년처럼 <b>여러 학년을 함께</b> 고를 수 있고, 「직접 고르기」에서는 초록불로 지금 켜진 칠판이 보입니다(특별실 탭도 있습니다). 예약은 오늘이나 <b>내일</b>까지 — 전날 저녁에 내일 아침 안내를 걸어 둘 수 있습니다. 보낸 뒤에는 아래 「오늘 칠판에 나간 알림」에 교실마다 상태가 한 단어로 보이고(다음 장면에서 하나씩), [종료]로 바로 내릴 수 있습니다. <b>오늘은 보내기 단추를 누르지 않습니다.</b>"
  });

  // ── 보낸 뒤 교실마다 한 단어(앱 lib/board/status-word.ts의 말과 색) ──
  var BOARD_WORDS = [
    { c: "live", room: "2-3", w: "게시 중", h: "지금 그 교실 칠판에 떠 있어요", p: "초록불이 깜빡 · 위에 「24분 남음」 · 일찍 내리려면 <b>[종료]</b>", r: "liveChip" },
    { c: "done", room: "2-3", w: "확인완료", h: "교실에서 칠판 알림을 눌렀어요", p: "누르면 칠판에서 닫혀요 · 시간이 끝나도 <b>확인완료</b> 그대로", r: "done" },
    { c: "over", room: "2-1", w: "송출마감", h: "떴다가 시간이 다 됐어요", p: "또는 [종료]로 내림 · 떠 있었지만 <b>누른 사람은 없어요</b>", r: "over" },
    { c: "off", room: "2-8", w: "미표시종료", h: "칠판이 꺼져 있어 못 띄웠어요", p: "한 번도 안 뜨고 끝남 · 그 반에는 <b>넵이나 직접</b> 전해 주세요", r: "unshown", warn: true }
  ];
  D.add({
    id: "boardWords", part: 1, label: "보낸 뒤 · 게시 중 · 확인완료 · 송출마감 · 미표시종료", kind: "light practice", min: 1.2, trans: "push",
    notes: "보낸 알림은 보내기 화면 아래 <b>「오늘 칠판에 나간 알림」</b>에 교실마다 한 단어로 상태가 나옵니다. ① <b>게시 중</b>(초록, 앞에 초록불이 깜빡임) — 지금 그 교실 칠판에 떠 있습니다. 위에 남은 시간이 나오고, 일찍 내리려면 [종료]를 누릅니다. ② <b>확인완료</b>(파랑) — 떠 있는 동안 교실에서 누군가 칠판의 알림을 눌렀습니다. 누르면 칠판에서 닫히고, 시간이 끝나도 확인완료로 남습니다. ③ <b>송출마감</b>(검정) — 칠판에 떴지만 아무도 누르지 않은 채 정한 시간이 다 됐거나 [종료]로 내렸습니다. 학생들이 봤을 수는 있지만 누른 사람은 없습니다. ④ <b>미표시종료</b>(회색) — 그 교실 칠판이 꺼져 있어서 한 번도 띄우지 못하고 시간이 끝났습니다. 그 반에는 넵이나 직접 전해 주세요. 그 밖에 회색 <b>표시 대기중</b>은 칠판이 지금 꺼져 있어 켜지면 뜬다는 뜻이고, <b>예약</b>은 정한 시각 전입니다. <b>긴급</b>은 칠판에 누르는 단추가 없어서 떠 있는 동안 빨간 「긴급」, 끝나면 송출마감이 됩니다. 보내기 전 「직접 고르기」에서 초록불(켜진 칠판)을 보면 미표시종료를 미리 알 수 있습니다.",
    html: '<div class="chiprow"><span class="chip">전자칠판</span><span class="chip ghost">보낸 뒤 확인</span></div>' +
      '<h2 class="title">보낸 뒤, 교실마다 <em>한 단어</em></h2>' +
      '<div class="abs bw">' + BOARD_WORDS.map(function (b) {
        return '<div class="r' + (b.warn ? " warn" : "") + '"><span class="c ' + b.c + '"><b>' + b.room + "</b>" + (b.c === "live" ? "<i></i>" : "") + "<span>" + b.w + "</span></span>" +
          "<div><h4>" + b.h + "</h4><p>" + b.p + "</p></div></div>";
      }).join("") + "</div>" +
      '<div class="abs bw-foot"><span>회색 <b>표시 대기중</b> 칠판이 지금 꺼져 있음, 켜지면 떠요 · <b>예약</b> 정한 시각 전</span>' +
      '<span><b>긴급</b>은 누르는 단추가 없어 떠 있는 동안 빨간 「긴급」, 끝나면 송출마감</span></div>' +
      cam([shot("board-sent")]),
    build: function (el, A) {
      var P = null, box = A.$(".bw"), rows = A.$$(".bw .r");
      var beats = [function (A) {
        A.wipe(".chiprow > *", { each: 110 });
        A.kinetic(".title", { delay: 120, each: 22 });
        A.rise(".bw .r", { delay: 420, each: 90, y: 26, snd: "pluck", v: 0.05 });
        A.rise(".bw-foot > *", { delay: 900, each: 120, y: 14 });
        P = A.phone(".cam");
        P.enter({ delay: 160 });
      }];
      BOARD_WORDS.forEach(function (b, i) {
        beats.push(function (A) {
          box.classList.add("focus");
          rows.forEach(function (r, k) { r.classList.toggle("on", k === i); });
          A.go(rows[i], [{ transform: "translateX(-16px)" }, { transform: "none" }], { d: 520, e: E.out });
          P.focus(R("board-sent", b.r), { z: 2.2, tone: b.warn ? "warn" : "", d: 820 });
        });
      });
      beats.push(function (A) {
        box.classList.remove("focus");
        rows.forEach(function (r) { r.classList.remove("on"); });
        P.wide();
        A.lt({ tag: "한 줄로", title: "파랑은 눌렀음 · 검정은 떴다가 끝 · 회색은 못 띄움", sub: "초록불이 깜빡이면 지금 칠판에 떠 있어요" });
      });
      return beats;
    }
  });

  practice({
    id: "kinds", part: 1, num: null, label: "사진·쪽지·긴급·음성", min: 1.5,
    chips: [{ t: "둘러보기" }, { t: "보기만", c: "ghost" }], title: "쪽지는 귀퉁이에, 긴급은 <em>전체 화면</em>으로",
    steps: [
      { t: '안내에 <span class="k">+ 사진</span>: 칠판에 사진이 크게(학생 얼굴은 피해서)', s: 0, r: R("board-photo", "thumb") },
      { t: '<span class="k">쪽지</span>: 60자, 칠판 오른쪽 위 노란 쪽지(띵 한 번)', s: 1, r: R("board-memo", "body") },
      { t: '<span class="k">긴급</span>: 지진·화재·전시 대피·외부인 침입·교실 대기 문구', s: 2, r: R("board-alert", "presets") },
      { t: '보내기 전 <b>확인 창</b>: 몇 곳에 뜨는지, 꺼진 칠판은 몇 곳인지', s: 3, r: R("board-alert-confirm", "where"), warn: "긴급은 경보음과 함께 바로 뜹니다" },
      { t: '<span class="k">+ 음성</span>: 30초까지 녹음, 칠판에서 「띵」 뒤 두 번', s: 4, r: R("board-voice-rec", "status") }
    ],
    screens: [shot("board-photo"), shot("board-memo"), shot("board-alert"), shot("board-alert-confirm"), shot("board-voice-rec")],
    notes: "종류별로 짧게 봅니다. <b>사진</b>은 칠판에 크게 뜨니 학생 얼굴이 나온 사진은 피해 주세요. <b>쪽지</b>는 60자까지, 수업 화면을 가리지 않고 오른쪽 위에 노란 쪽지로 뜹니다. <b>긴급</b>은 정해 둔 대피 문구로 칠판 전체가 빨간 화면이 되고 경보음이 울립니다 — 보내기 전에 몇 곳에 뜨는지, 꺼진 칠판이 몇 곳인지 확인 창이 한 번 더 묻습니다. 실제 상황이나 훈련 때만 써 주세요. <b>음성</b>은 30초까지 녹음하면 칠판에서 「띵」 뒤 두 번 나옵니다. 교실 스피커가 꺼져 있을 수 있으니 중요한 내용은 글로도 적어 주세요. 목소리 파일은 하루 뒤 지워집니다."
  });

  tvScene({
    id: "auto", part: 1, label: "칠판이 알아서 하는 일", min: 1.2,
    chips: [{ t: "저절로" }, { t: "따로 할 일 없음", c: "ghost" }], title: "칠판이 <em>알아서</em> 하는 일",
    items: [["8:45 쪽지", "수업이 바뀐 반에 「오늘 바뀐 수업」", "memo"], ["수업 중", "시작 30초 뒤 숨고, 안내는 구석 포스트잇", "inclass-composite"], ["점심시간", "시계 아래 분실물 띠, 사진이 흘러가요", "lunch"], ["지난 알림", "왼쪽 아래 [지난 알림]으로 오늘 것 다시", "history"]],
    foot: "「수업 중」은 이해를 돕는 합성 그림 · 반·이름은 예시",
    end: { tone: "new", tag: "다음은", title: "점심시간 분실물 띠 — 2부 분실물 함으로", sub: "선생님이 사진 한 장 넣으면, 칠판에 저절로 뜹니다" },
    notes: "선생님이 따로 하지 않아도 칠판이 알아서 하는 일입니다. 아침 <b>8시 45분</b>, 그날 수업이 바뀐 반 칠판에는 「오늘 바뀐 수업」 쪽지가 저절로 붙습니다(교시·과목·교실만, 사유는 없음). 교실 PC에 칠판 창 프로그램이 깔린 교실은 <b>수업 시작 30초 뒤 칠판이 저절로 숨고</b>, 쉬는 시간에 돌아옵니다 — 학급자치 날 아침 학급자치 시간도 수업처럼 숨습니다. 수업 중에 온 안내는 구석에 작은 포스트잇으로만 뜨고, 긴급은 전체 화면입니다. 수업 중에 다시 보고 싶으면 바탕화면 아이콘으로 열면 그 교시 동안만 그대로 둡니다. <b>점심시간</b>에는 시계 아래에 분실물 띠가 붙습니다(듀얼 모니터면 두 화면 모두). 지나간 알림은 칠판 왼쪽 아래 <b>[지난 알림]</b>으로 다시 볼 수 있습니다. 마지막 단계에서 2부 분실물 함으로 넘어갑니다."
  });

  // ════════════════════════════════════════════════════════════
  // 2부 · 분실물 함
  // ════════════════════════════════════════════════════════════
  opener({
    part: 2, art: "closing", flip: true, min: 5, lines: ["주운 물건은", "<em>사진 한 장</em>으로"],
    was: "교무실 상자에 모아 두고, 학생은 교무실마다 물어보러", now: "사진 한 장 넣으면, 학생은 점심시간 칠판에서 봅니다",
    notes: "2부는 10월 17일에 모두에게 열린 <b>분실물 함</b>입니다. 주운 물건을 사진 한 장으로 넣으면, 학생들은 점심시간 교실 칠판과 학생용 보기로 사진과 찾으러 갈 곳을 봅니다. 넣기 → 돌려주기를 따라 해 보고, AI로 넣는 법도 봅니다."
  });

  practice({
    id: "lost", part: 2, num: 2, label: "실습 2 · 분실물 넣고 돌려주기", min: 2, practiceMin: 2, trans: "zoom",
    chips: [{ t: "실습 2 · 분실물 함" }, { t: "넣지는 않아요", c: "ghost" }], title: "분실물 함, <em>넣고 돌려주기</em>",
    steps: [
      { t: '더보기 → 학생의 <span class="k">분실물 함</span>', s: 0, r: R("more-tools", "lost") },
      { t: '보관 중인 물건 사진이 물 위에 뜬 듯 <b>둥둥</b> — 휴대폰을 기울이면 그쪽으로', s: 1, r: R("lost-found", "box") },
      { t: '<span class="k">분실물 넣기</span>: 사진 한 장 · 종류 · 발견 장소', s: 2, r: R("lost-found-add", "photo") },
      { t: '보관 장소는 <b>지난번 적은 곳</b>이 미리 들어가요 → <span class="k">함에 넣기</span>', s: 2, r: R("lost-found-add", "place") },
      { t: '사진을 누르면 상세 → 특징을 물어 확인하고 <span class="k">주인에게 돌려줬어요</span>', s: 3, r: R("lost-found-detail", "back") }
    ],
    note: { tone: "warn", html: "<span>사진에는 <b>학생 얼굴·이름표</b>가 나오지 않게 물건만 찍어 주세요.</span>" },
    screens: [shot("more-tools"), shot("lost-found"), shot("lost-found-add"), shot("lost-found-detail")],
    notes: "더보기 → 학생 묶음의 <b>분실물 함</b>을 엽니다. 보관 중인 물건 사진이 물 위에 뜬 것처럼 떠다니고, 휴대폰을 기울이면 그쪽으로 흘러갑니다(아이폰은 처음 한 번 「기울여서 움직이기」를 허용). 아래 <b>분실물 넣기</b>를 누르면 사진 한 장과 종류·발견 장소를 적습니다. 보관 장소는 <b>선생님이 계신 교무실</b> — 한 번 적으면 다음부터 미리 들어갑니다. <b>특징</b> 칸은 주인 확인용이라 학생 화면·칠판에는 나오지 않습니다. 주인이 찾아오면 사진을 눌러 특징을 물어 확인하고 <b>「주인에게 돌려줬어요」</b> — 그래야 칠판과 학생용 보기에서 빠집니다. 잘못 눌렀으면 「돌려준 물건」에서 다시 넣을 수 있습니다. 오늘은 넣지 않고 화면만 확인합니다."
  });

  D.add({
    id: "student", part: 2, label: "학생은 이렇게 봅니다", kind: "light", min: 1.2,
    notes: "학생들은 두 곳에서 봅니다. ① <b>점심시간 교실 칠판</b> — 시계 아래 분실물 띠에 보관 중인 물건 사진이 흘러가고, 사진 아래에 찾으러 갈 교무실이 보입니다. 일과 중에는 학생이 휴대폰이 없으니 칠판을 보고 바로 찾아옵니다. ② <b>학생용 보기</b> — 분실물 함 맨 아래 「학생용 보기」 주소입니다. QR은 칠판에 띄우지 않고 <b>인쇄해서 교실에 붙여</b> 두면 방과후에 휴대폰으로 봅니다(로그인 없음, 보기만). 두 곳 모두 <b>특징과 넣은 선생님 이름은 나오지 않습니다</b>. 찾으러 온 학생에게 특징을 물어 확인하고 돌려주시면 됩니다.",
    html: '<div class="chiprow"><span class="chip">학생 화면</span><span class="chip ghost">보기만</span></div><h2 class="title">학생은 <em>이렇게</em> 봅니다</h2>' +
      '<p class="stu-h a" style="left:120px"><i>1</i>점심시간, 교실 칠판</p>' +
      '<div class="abs tv stu-tv"><div class="in"><img src="img/board/lunch.jpg" alt="" style="opacity:1"></div></div>' +
      '<p class="stu-h b" style="left:1180px"><i>2</i>교실에 붙인 QR → 학생용 보기</p>' +
      '<div class="abs stu-ph"><div class="phone"><div class="screen"><img src="img/found.jpg" alt=""></div></div></div>' +
      '<div class="abs stu-ls"><span>로그인 없이</span><span>보관 중인 것만</span><span>사진 · 종류 · 발견 장소 · 날짜</span><span>찾으러 갈 교무실</span><span class="no">특징 · 넣은 선생님 이름</span></div>',
    build: function (el, A) {
      return [
        function (A) {
          A.wipe(".chiprow > *"); A.kinetic(".title", { delay: 100, each: 26 });
          A.hide(".stu-h, .stu-tv, .stu-ph, .stu-ls span");
          A.later(function () {
            A.go(".stu-h.a", [{ opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0 0 0 0)" }], { d: 650 });
            A.go(".stu-tv", [{ opacity: 0, transform: "translateY(60px) scale(.95)" }, { opacity: 1, transform: "none" }], { d: 1000, delay: 120, e: E.out });
            A.sfx("pop", { delay: 300 });
          }, 600);
        },
        function (A) {
          A.go(".stu-h.b", [{ opacity: 0, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0 0 0 0)" }], { d: 650 });
          A.go(".stu-ph", [{ opacity: 0, transform: "translateY(200px) rotate(5deg)" }, { opacity: 1, transform: "none" }], { d: 1000, delay: 100, e: E.out });
          A.sfx("rise", { delay: 100 });
          A.rise(".stu-ls span", { delay: 700, each: 120, y: 18, snd: "pluck", v: 0.05 });
        },
        function (A) {
          A.go(".stu-ls span.no", [{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }], { d: 600, e: E.out });
          A.lt({ tone: "warn", tag: "특징은 주인 확인용", title: "찾으러 온 학생에게 특징을 물어 확인하고 돌려주세요", sub: "학생 화면·칠판에는 특징과 선생님 이름이 나오지 않아요" });
        }
      ];
    }
  });

  aiWay({
    id: "aiLost", part: 2, label: "AI로 하면 · 분실물 넣기", min: 1,
    title: "분실물도 <em>사진 붙이고 말로</em>",
    menu: "분실물 함 → 분실물 넣기 → 사진·종류·장소",
    say: "2층 복도 정수기 옆에서 주웠어요, 분실물로 올려 줘",
    steps: [
      { t: '메뉴로는 <span class="k">분실물 넣기</span>에서 사진·종류·장소를 적기', s: 0, r: R("lost-found-add", "photo") },
      { t: 'AI에게 <b>📎 사진</b>을 붙이고 <span class="q">「2층 복도 정수기 옆에서 주웠어요, 분실물로 올려 줘」</span>', s: 1, r: R("ai-lost", "question") },
      { t: '종류·특징은 <b>사진을 보고</b>, 발견 장소는 말에서, 보관 장소는 지난번처럼', s: 1, r: R("ai-lost", "card") },
      { t: '확인하고 <span class="k">함에 넣기</span>', s: 1, r: R("ai-lost", "button"), z: 1.9 },
      { t: '<span class="q">「분실물 함에 우산 있어?」</span> <span class="q">「검정 안경 주인 찾아갔어」</span>도 됩니다', s: 1 }
    ],
    screens: [shot("lost-found-add"), shot("ai-lost")],
    notes: "같은 일을 AI로 하면 이렇습니다. 아래 탭 AI에서 <b>📎로 물건 사진을 붙이고</b> 「2층 복도 정수기 옆에서 주웠어요, 분실물로 올려 줘」라고 하면, 종류와 특징은 사진을 보고, 발견 장소는 말에서 채운 카드가 뜹니다. 보관 장소는 지난번 적은 곳으로 들어갑니다. 확인하고 <b>「함에 넣기」</b>를 눌러야 들어갑니다. 「분실물 함에 우산 있어?」처럼 묻거나 「검정 안경 주인 찾아갔어」라고 하면 돌려준 것으로 바꾸는 카드도 만듭니다. AI 버튼은 4부에서 더 봅니다."
  });

  // ════════════════════════════════════════════════════════════
  // 3부 · 넵 (10월 18일 메신저처럼, 19일 대화 비우기)
  // ════════════════════════════════════════════════════════════
  opener({
    part: 3, art: "nep", min: 6, lines: ["넵은 이제", "<em>메신저처럼</em>"],
    was: "넵 목록에서 제목을 찾아 하나씩 열기", now: "선생님별 방에서 주고받고, 카드 안 버튼 하나로",
    notes: "3부는 <b>넵</b>입니다. 10월 18일에 넵 화면이 <b>메신저처럼</b> 바뀌었습니다. 첫 화면이 조직도·받은·보낸 세 탭이 되었고, 받은 넵은 <b>보낸 선생님별 방</b>에 모입니다. 종류 이름도 바뀌었습니다. 받은 넵을 방에서 처리하고 답장하는 것을 함께 해 보고, 보내는 법과 19일에 새로 생긴 <b>대화 비우기</b>까지 봅니다. 배달 규칙(수업 중이면 교시가 끝난 뒤 도착)은 그대로입니다."
  });

  var NEP_TABS = [
    ["nep-org", "조직도", "처음 열면 여기", "<b>이름을 누르면</b> 그분과의 방, 오른쪽 <b>칸을 체크</b>하면 여러 분께"],
    ["nep-inbox", "받은", "선생님별 방", "보낸 분마다 한 줄. <b>안 읽은 수</b>(주황)와 처리할 칩 「넵 받기 1」"],
    ["nep-sent", "보낸", "처리 현황", "「4/9 완료」·「읽음 1」·「내일 08:00 도착」, 누르면 현황판"]
  ];
  D.add({
    id: "nepTabs", part: 3, label: "넵 첫 화면: 조직도 · 받은 · 보낸", kind: "light", min: 0.8, isNew: true, trans: "zoom",
    notes: "넵을 열면 맨 위에 탭이 셋입니다. <b>조직도</b>가 처음 열리는 탭으로, 전체 교직원·교장·교감·부서·교과 카드가 있습니다. 이름을 누르면 그 선생님과의 방이 열리고, 오른쪽 칸을 체크하면 여러 분께 한 번에 씁니다. <b>받은</b> 탭은 보낸 선생님마다 한 줄 — 카카오톡 대화 목록과 같습니다. 맨 위에는 늘 「나에게」가 있습니다. <b>보낸</b> 탭은 내가 보낸 넵마다 한 줄로, 누가 얼마나 처리했는지 숫자로 보입니다. 홈 맨 위 「처리할 넵」 줄을 누르면 받은 탭으로 옵니다.",
    html: '<div class="chiprow"><span class="chip new">NEW</span><span class="chip ghost">10월 18일 바뀜</span></div><h2 class="title">넵 첫 화면은 <em>세 탭</em></h2>' +
      '<div class="abs n3">' + NEP_TABS.map(function (t, i) {
        return '<div class="c"><div class="ph"><img src="img/' + t[0] + '.jpg" alt=""></div><div class="cap"><span class="no">' + (i + 1) + '</span><div><h3>' + t[1] + ' <small>' + t[2] + '</small></h3><p>' + t[3] + '</p></div></div></div>';
      }).join("") + '</div>',
    build: function (el, A) {
      return [function (A) {
        A.wipe(".chiprow > *", { each: 110 });
        A.kinetic(".title", { delay: 120, each: 26 });
        A.$$(".n3 .ph").forEach(function (p, i) {
          A.go(p, [{ opacity: 0, transform: "translateY(90px) rotate(" + (i - 1) * 2 + "deg)" }, { opacity: 1, transform: "rotate(" + (i - 1) * 1.2 + "deg)" }], { d: 900, delay: 450 + i * 220, e: E.out });
        });
        A.rise(".n3 .cap", { delay: 1100, each: 200, y: 24, snd: "pluck", v: 0.06 });
        A.pop(".n3 .no", { delay: 1150, each: 200, s: 0.4, snd: false });
      }];
    }
  });

  var NEP_NAMES = [
    ["알림", "메시지", "읽으면 끝", "", ""],
    ["확인요청", "넵 받기", "", "넵", "넵함 ✓"],
    ["업무요청", "완료 받기", "", "완료", "완료함 ✓"],
    ["제출요청", "파일 받기", "", "제출", "제출함 ✓"]
  ];
  D.add({
    id: "nepNames", part: 3, label: "이름이 바뀐 넵 네 가지", kind: "light", min: 1, isNew: true,
    notes: "종류 이름이 바뀌었습니다. 예전 <b>알림</b>은 <b>메시지</b>(읽으면 끝, 그래도 [넵]을 누르면 보낸 분 현황에 「넵」으로 셉니다), <b>확인요청</b>은 <b>넵 받기</b>, <b>업무요청</b>은 <b>완료 받기</b>, <b>제출요청</b>은 <b>파일 받기</b>입니다. 처리하면 단추가 초록 「넵함 ✓」「완료함 ✓」「제출함 ✓」로 바뀝니다. 새로 생긴 것은 교무부의 <b>보강 모집</b> 넵 — 그 교시 공강인 분께만 가고 [신청] 한 번이면 됩니다(결근 사유·선생님 이름은 싣지 않음). 그대로인 것: 받는 분이 <b>수업 중이면 교시가 끝난 뒤</b>, <b>근무 시간 밖이면 다음 근무일 아침</b>에 도착하고, 긴급만 바로 울립니다(한 달 횟수 제한). 나에게 보낸 메모는 바로 옵니다.",
    html: '<div class="chiprow"><span class="chip new">NEW</span><span class="chip ghost">예전 이름 → 지금 이름</span></div><h2 class="title">넵 네 가지, <em>이름이 바뀌었어요</em></h2>' +
      '<div class="abs nm">' + NEP_NAMES.map(function (n) {
        return '<div class="r"><span class="old">' + n[0] + '<i></i></span><span class="ar">→</span><span class="new">' + n[1] + '</span><span class="bt">' + (n[3] ? "<b>" + n[3] + '</b><span>→</span><b class="dn">' + n[4] + "</b>" : n[2]) + "</span></div>";
      }).join("") + '<div class="r plus"><span class="new">보강 모집<small>그 교시 공강인 분께만 · 사유·이름 없이</small></span><span class="bt"><b>신청</b></span></div></div>' +
      '<div class="abs card nkeep"><h3>그대로인 것</h3><p><b>수업 중</b><span>교시가 끝나면 도착</span></p><p><b>근무 시간 밖</b><span>다음 근무일 아침에</span></p><p><b>나에게</b><span>메모는 바로 도착</span></p><p class="warn"><b>긴급</b><span>바로 울림 · 한 달 횟수 제한</span></p></div>',
    build: function (el, A) {
      return [
        function (A) {
          A.wipe(".chiprow > *"); A.kinetic(".title", { delay: 100, each: 24 });
          A.hide(".nm .new, .nm .bt, .nm .ar, .nm .r.plus, .nkeep");
          A.rise(".nm .r:not(.plus)", { delay: 500, each: 110, y: 24, snd: "pluck", v: 0.05 });
        },
        function (A) {
          A.draw(".nm .old i", { each: 140, d: 420 });
          A.sfx("scribble", { d: 0.5 });
          A.stagger(".nm .ar", [{ opacity: 0, transform: "translateX(-14px)" }, { opacity: 1, transform: "none" }], { delay: 200, each: 140, d: 400 });
          A.pop(".nm .r:not(.plus) .new", { delay: 300, each: 140, s: 0.7 });
          A.stagger(".nm .bt", [{ opacity: 0 }, { opacity: 1 }], { delay: 600, each: 140, d: 500 });
        },
        function (A) {
          A.go(".nm .r.plus", [{ opacity: 0, transform: "translateY(24px)" }, { opacity: 1, transform: "none" }], { d: 700, e: E.out });
          A.go(".nm .r.plus .new, .nm .r.plus .bt", [{ opacity: 1 }, { opacity: 1 }], { d: 1 });
          A.go(".nkeep", [{ opacity: 0, transform: "translateX(50px)" }, { opacity: 1, transform: "none" }], { d: 800, delay: 400, e: E.out });
          A.sfx("pop", { delay: 450 });
        }
      ];
    }
  });

  practice({
    id: "nepRoom", part: 3, num: 3, label: "실습 3 · 선생님별 방에서 처리·답장", min: 2, practiceMin: 2,
    chips: [{ t: "실습 3 · 넵" }, { t: "2분", c: "ghost" }], title: "받은 넵은 <em>선생님별 방</em>에서",
    steps: [
      { t: '아래 탭 <span class="k">넵</span> → <span class="q">「받은」</span>: 보낸 분마다 한 줄, <b>안 읽은 수</b>와 처리할 칩', s: 0, r: R("nep-inbox", "row") },
      { t: '맨 위 <span class="q">「나에게」</span> 방은 내 메모장 — <b>첫 줄이 제목</b>, 바로 도착', s: 0, r: R("nep-inbox", "me") },
      { t: '줄을 누르면 그 선생님과의 방 — 왼쪽 카드가 받은 넵', s: 1, r: R("nep-room", "card") },
      { t: '카드 안 <span class="k">완료</span> → 초록 <span class="q">「완료함 ✓」</span>(넵 받기는 [넵], 파일 받기는 [제출])', s: 2, r: R("nep-room-done", "done"), z: 1.9 },
      { t: '아래 칸에 쓰면 <b>그 선생님 한 분께 답장</b> — 오른쪽 남색 말풍선', s: 3, r: R("nep-room-reply", "input") }
    ],
    note: { html: "<span>전체 공지도 <b>보낸 선생님 방</b>에 카드로 들어옵니다. 답장은 <b>그 선생님 한 분께만</b> 가요.</span>" },
    screens: [shot("nep-inbox"), shot("nep-room"), shot("nep-room-done"), shot("nep-room-reply")],
    notes: "다 같이 아래 탭 <b>넵</b> → <b>받은</b> 탭을 엽니다. 메신저 대화 목록처럼 <b>보낸 선생님마다 한 줄</b>이고, 안 읽은 것이 있으면 주황 숫자, 처리할 것이 있으면 「넵 받기 1」「완료 받기 1」 칩이 붙습니다(마감이 오늘이거나 지났으면 칩이 주황). 줄을 누르면 그 선생님과의 방 — 왼쪽은 받은 카드, 오른쪽 남색 말풍선은 내가 그분께 보낸 것입니다. 카드 안 [완료]를 누르면 「완료함 ✓」. <b>아래 칸에 쓰면 그 선생님 한 분께만 답장</b>이 갑니다 — 전체 공지에 답장해도 모두에게 가지 않습니다. 맨 위 「나에게」 방은 내 메모장으로, 제목 칸 없이 첫 줄이 제목이 되고 바로 도착합니다. 옆 선생님 이름을 눌러 방을 열고 메시지를 주고받아 보셔도 좋습니다."
  });

  practice({
    id: "nepSend", part: 3, num: null, label: "조직도에서 보내고 현황 보기", min: 1.5,
    chips: [{ t: "둘러보기" }, { t: "보내지는 않아요", c: "ghost" }], title: "보낼 때는 <em>조직도</em>에서 체크",
    steps: [
      { t: '<span class="q">「조직도」</span>: 부서를 펼쳐 <b>이름을 누르면 그분과의 방</b>, 오른쪽 칸은 체크', s: 0, r: R("nep-org-open", "name"), z: 1.8 },
      { t: '체크하면 아래 막대 <span class="k">3명에게 쓰기</span> · 부서·교과는 머리 칸으로 통째로', s: 1, r: R("nep-org-picked", "bar"), z: 1.8 },
      { t: '쓰기 창 <span class="q">「새 메시지」</span>: 제목 칸이 없어요 — <b>첫 줄이 제목</b>', s: 2, r: R("nep-compose", "text") },
      { t: '<span class="k">+</span> 「더 넣기」: 사진·파일 · 넵/완료/파일 받기 · 보낼 시각 · 긴급', s: 3, r: [12, 430, 388, 424] },
      { t: '<span class="q">「보낸」</span>: 「4/9 완료」·「읽음 1」처럼 숫자로', s: 4, r: R("nep-sent", "progress") },
      { t: '눌러 현황판: <span class="q">「아직 5명」</span> → <span class="k">5명에게 다시 알림</span>', s: 5, r: R("nep-board", "remind") }
    ],
    note: { tone: "warn", html: "<span><b>20명 이상</b>이거나 학년 담임이 들어가면 보내기 전에 한 번 더 묻습니다. 보낸 뒤에는 거둘 수 없어요.</span>" },
    screens: [shot("nep-org-open"), shot("nep-org-picked"), shot("nep-compose"), shot("nep-plus"), shot("nep-sent"), shot("nep-board")],
    notes: "보낼 때는 <b>조직도</b>에서 고릅니다. 부서 카드를 펼치면 한 분씩 보이고, 이름을 누르면 그분과의 방, 오른쪽 칸을 누르면 체크입니다. 체크하면 아래 남색 막대 「3명에게 쓰기」가 뜹니다. 부서·교과·부장단은 카드 머리 칸으로 통째로 고르고, 돋보기로 이름·초성 찾기도 됩니다. 쓰기 창에는 <b>제목 칸이 없고 첫 줄이 제목</b>입니다. <b>+</b>를 누르면 예전 종류 고르기가 여기 있습니다 — 넵 받기·완료 받기·파일 받기, 그리고 사진·파일, 보낼 시각(예약), 긴급. 20명 넘게 보내거나 학년 담임이 들어가면 보내기 전에 한 번 더 묻습니다. 보낸 뒤에는 <b>보낸</b> 탭에서 「4/9 완료」처럼 숫자로 보이고, 눌러서 「아직 5명」에게 다시 알림을 보내거나 받은 답장을 모아 봅니다."
  });

  practice({
    id: "nepClear", part: 3, num: null, label: "대화 비우기 (10월 19일)", min: 0.8, isNew: true,
    chips: [{ t: "NEW", c: "new" }, { t: "10월 19일", c: "ghost" }], title: "지난 대화는 <em>비우기</em>",
    steps: [
      { t: '<span class="q">「받은」</span> 탭 줄을 <b>왼쪽으로 밀면</b> <span class="k">비우기</span>', s: 0, r: R("nep-swipe", "row"), newf: true },
      { t: '방 안에서는 머리 오른쪽 <span class="k">···</span> → <span class="q">「대화 비우기」</span>(PC도)', s: 1, r: R("nep-room-menu", "item"), z: 1.9, newf: true },
      { t: '<b>내 화면에서만</b> 사라지고, 그 선생님 쪽에는 그대로 남아요', s: 1 },
      { t: '아직 처리하지 않은 <b>넵 받기·완료 받기·파일 받기는 남겨</b> 둡니다', s: 1 }
    ],
    screens: [shot("nep-swipe"), shot("nep-room-menu")],
    lt: { tag: "NEW", title: "대화 비우기", sub: "줄을 밀거나 방 「···」 · 내 화면에서만 · 할 일은 남아요", tone: "new" },
    notes: "10월 19일에 생긴 <b>대화 비우기</b>입니다. 받은 탭에서 줄을 <b>왼쪽으로 밀면</b> 「비우기」가 나오고, 방 안에서는 머리 오른쪽 「···」 → 「대화 비우기」입니다(PC에서는 이쪽으로). 확인 창이 한 번 묻고, 비우면 <b>내 화면에서만</b> 사라집니다 — 그 선생님 쪽 방이나 보낸 분 현황은 그대로입니다. <b>아직 처리하지 않은 넵 받기·완료 받기·파일 받기는 남겨 두니</b>, 할 일이 사라질 걱정은 없습니다. 비운 뒤 새로 오가는 것은 그대로 보입니다."
  });

  // ════════════════════════════════════════════════════════════
  // 4부 · AI 버튼
  // ════════════════════════════════════════════════════════════
  opener({
    part: 4, art: "ai", min: 6, lines: ["메뉴를 몰라도", "<em>말하면</em> 됩니다"],
    was: "메뉴를 찾고, 양식을 찾아 처음부터 직접", now: "말로 부탁하면 카드로 초안까지, 누르는 건 선생님",
    notes: "4부는 아래 탭 가운데 <b>AI 버튼</b>입니다. 학교 자료를 찾아 답하고, 부탁하면 <b>확인 카드</b>로 초안까지 만듭니다. 카드는 누르기 전까지 선생님만 보는 초안입니다. 쉬운 질문 하나를 함께 해 보고, 카드가 되는 부탁을 봅니다."
  });

  D.add({
    id: "aiIntro", part: 4, label: "말하기 → 카드 → 누르기", kind: "light", min: 1, trans: "zoom",
    notes: "AI 버튼은 세 박자입니다. <b>묻기</b> — 시간표·급식·학사일정·주간소식은 물론 자료실 파일과 <b>학교 공유 드라이브</b> 문서의 본문까지 찾아 답하고 출처를 붙입니다. 📎로 붙인 PDF·사진·한글·엑셀 파일과 웹 주소도 읽습니다. <b>부탁하기</b> — 수리 요청·가정통신문·진도표·분실물·넵 초안처럼 말로 부탁하면 필요한 것만 되묻고 카드를 만듭니다. <b>누르는 건 선생님</b> — 카드에서 고친 뒤 [등록]·[넣기]·[보내기]를 눌러야 실제로 적히거나 갑니다. 질문은 하루 60개, 어려운 일은 「깊게 생각하기」(하루 5번). 학생 이름이나 실제 생기부 문장은 넣지 마세요 — 질문은 외부 AI로 보내집니다.",
    html: '<div class="chiprow"><span class="chip ai">AI 버튼</span></div><h2 class="title">말하면, <em>카드로</em>. 누르는 건 선생님</h2>' +
      '<div class="abs card askc" style="left:120px"><span class="sn">1</span><h3>묻기</h3><p>자료실·공유 드라이브 파일의 <b>본문까지</b> 찾아 답하고, 출처를 붙입니다.</p><div class="chips"><span>학사일정</span><span>급식</span><span>빈 교실</span><span>담임</span><span>자료실·양식</span><span>공유 드라이브</span><span>📎 파일·사진·웹 주소</span></div></div>' +
      '<div class="abs card askc" style="left:700px"><span class="sn">2</span><h3>부탁하기</h3><p>말로 부탁하면 <b>필요한 것만</b> 되묻고 초안 카드를 만듭니다.</p><div class="chips"><span class="hot">칠판 수리 요청</span><span class="hot">분실물 넣기</span><span>가정통신문</span><span>진도표 적기</span><span>넵 초안</span><span>회의 서명부</span><span>수업교체 계산</span><span>학습지·퀴즈</span></div></div>' +
      '<div class="abs card askc confirm" style="left:1280px"><span class="sn">3</span><h3>누르는 건 선생님</h3><p>카드에서 고친 뒤 <b>[등록]</b>을 눌러야 실제로 적힙니다. 누르기 전 초안은 나만 봅니다.</p><div class="lim"><span>질문 <b>하루 60개</b></span><span>깊게 생각하기 <b>하루 5번</b></span><span>학생 이름·생기부 문장은 <b>넣지 않기</b></span></div></div>' +
      '<div class="abs aibar"><div class="strip"></div><p>아래 탭 가운데 볼록한 <b>AI</b> 버튼</p></div>',
    build: function (el, A) {
      return [
        function (A) {
          A.wipe(".chiprow > *"); A.kinetic(".title", { delay: 100, each: 24 });
          A.hide(".askc");
          A.hide(".aibar");
          A.go(".aibar", [{ opacity: 0, transform: "translateY(30px)" }, { opacity: 1, transform: "none" }], { d: 700, delay: 600 });
          A.later(function () { reveal(0); }, 900);
        },
        function (A) { reveal(1); },
        function (A) { reveal(2); A.rise(".askc .lim span", { delay: 500, each: 120, y: 14 }); }
      ];
      function reveal(i) {
        var c = el.querySelectorAll(".askc")[i];
        A.go(c, [{ opacity: 0, transform: "translateY(50px) scale(.96)" }, { opacity: 1, transform: "none" }], { d: 800, e: E.out });
        A.pop(c.querySelectorAll(".chips span"), { delay: 300, each: 60 });
      }
    }
  });

  practice({
    id: "first", part: 4, num: 4, label: "실습 4 · AI에게 첫 질문", min: 2, practiceMin: 2, trans: "zoom",
    chips: [{ t: "실습 4 · AI" }, { t: "2분", c: "ghost" }], title: "첫 질문은 <em>쉬운 것부터</em>",
    steps: [
      { t: '아래 탭 가운데 <span class="k">AI</span>', s: 0, r: R("ai-home", "tab_ai"), z: 1.8 },
      { t: '<b>추천 질문</b>은 그날 나에게 맞춰 바뀝니다(처리 안 한 넵·마감·시간대)', s: 0, r: R("ai-home", "chips") },
      { t: '입력칸에 <span class="q">「이번 주 학사일정 알려 줘」</span> → <span class="k">보내기</span>', s: 0, r: R("ai-home", "input") },
      { t: '요일별로 정리한 답. 급식·담임·빈 교실도 이렇게 묻습니다', s: 1, r: R("ai-week", "answer") },
      { t: '자료를 물으면 답 끝에 <b>출처</b>와 <span class="k">열기 ›</span>', s: 2, r: R("ai-library", "links"), z: 1.95 },
      { t: '답이 좋았는지 <b>👍 👎</b> — 대화 내용은 담기지 않아요', s: 2, r: R("ai-library", "feedback"), z: 1.95 }
    ],
    note: { tone: "warn", html: "<span>학생 이름·실제 생기부 문장은 넣지 마세요. 질문은 외부 AI로 전송되고, <b>하루 60개</b>까지 묻습니다.</span>" },
    screens: [shot("ai-home"), shot("ai-week"), shot("ai-library")],
    notes: "모두 아래 탭 가운데 <b>AI</b>를 누르고 「<b>이번 주 학사일정 알려 줘</b>」를 보내 봅니다. 요일별로 정리된 답이 오면 성공입니다. 위의 추천 질문은 그날 선생님의 넵·마감·시간대에 맞춰 바뀌니 눌러 봐도 됩니다. 「수행평가 못 본 학생은 어떻게 처리해?」처럼 자료실에 있는 것을 물으면 파일 본문을 읽고 답 끝에 출처와 <b>열기 ›</b>를 붙입니다. 👍👎에는 대화 내용이 담기지 않고, 👎 뒤 「관리자에게 보내기」를 누른 때만 그 대화를 보냅니다. 대화는 본인만 보고 「대화 기록 지우기」로 언제든 지웁니다."
  });

  practice({
    id: "cards", part: 4, num: null, label: "부탁하면 카드로", min: 2,
    chips: [{ t: "둘러보기" }, { t: "카드까지만", c: "ghost" }], title: "부탁하면 <em>카드로</em>, 누르는 건 선생님",
    steps: [
      { t: '<span class="q">「2-3 교실 전자칠판 터치가 자꾸 안 돼요. 수리 요청해 줘」</span>', s: 0, r: R("ai-repair", "question") },
      { t: '장소·기기는 <b>시트 목록에서</b> 골라 채우고, 신청자는 저절로', s: 0, r: R("ai-repair", "card") },
      { t: '<span class="k">시트에 등록</span> → 수리 맡은 분께 알림', s: 0, r: R("ai-repair", "button"), z: 1.9, warn: "누르면 수리 요청 시트에 실제로 적힙니다" },
      { t: '<span class="q">「오늘 2-2반이랑 2-3반 5단원 했어, 진도표에 적어 줘」</span> → 진도표 카드', s: 1, r: R("ai-progress", "card") },
      { t: '<span class="q">「11월 3일~5일 공개수업 가정통신문 초안 써 줘」</span> → 통신문 카드', s: 2, r: R("ai-letter", "head") },
      { t: '<span class="q">「2학년 담임께 상담 기록 금요일까지 내 달라고 넵 보내 줘」</span> → 넵 초안, <b>AI는 보내지 않아요</b>', s: 3, r: R("ai-nep", "card") }
    ],
    screens: [shot("ai-repair"), shot("ai-progress"), shot("ai-letter"), shot("ai-nep")],
    notes: "부탁은 카드로 돌아옵니다. 교실 <b>전자칠판이 고장 나면</b> 「2-3 교실 전자칠판 터치가 자꾸 안 돼요, 수리 요청해 줘」 — 장소와 기기는 수리 요청 시트의 목록에서 골라 채우고(목록에 없는 기기는 「기타」로, 기기 이름은 요청 사항에), 신청자는 선생님 이름으로 들어갑니다. <b>「시트에 등록」</b>을 누르면 시트에 적히고 수리 맡은 분께 알림이 갑니다. 진도표도 「오늘 2-2반이랑 2-3반 5단원 했어, 진도표에 적어 줘」 하면 그날 실제 수업 칸을 찾아 카드로 만들고, 가정통신문은 학교 양식 첫 문장을 지킨 초안 카드가 됩니다. 3부에서 본 <b>넵도 말로</b> — 「2학년 담임 선생님들께 상담 기록 금요일까지 내 달라고 넵 보내 줘」 하면 종류(파일 받기)·제목·본문·마감과 받는 분 명단이 채워진 넵 초안이 뜹니다. <b>AI는 넵을 바로 보내지 않고</b>, 이름까지 확인한 뒤 「넵 보내기」는 선생님이 누릅니다. 모두 <b>누르기 전까지는 나만 보는 초안</b>입니다."
  });

  D.add({
    id: "tenAsks", part: 4, label: "해 볼 부탁 열 문장", kind: "light", min: 1, trans: "whip",
    notes: "따라 말할 수 있는 열 문장입니다. 왼쪽 위 두 줄은 묻기, 나머지는 카드가 되는 부탁입니다. 오늘 본 <b>칠판 수리 요청과 넵 초안</b>도 들어 있습니다(보라 테두리). 사진으로 분실물 넣기는 아래 줄에 있습니다. 이 목록은 AI 교무실 연수 자료 첫 화면에도 있으니, 내일 아침 하나만 골라 해 보시라고 권해 주세요.",
    html: '<div class="chiprow"><span class="chip ai">가져가기</span><span class="chip ghost">연수 자료 첫 화면에도 있어요</span></div><h2 class="title">내일 해 볼 <em>부탁 열 문장</em></h2>' +
      '<div class="abs ten">' + (window.ASKS || []).map(function (a, i) { return '<div class="r' + (/수리|넵/.test(a.got) ? " hot" : "") + '"><span class="n">' + String(i + 1).padStart(2, "0") + '</span><span class="s">「' + a.say + '」</span><span class="c">' + a.got + "</span></div>"; }).join("") + "</div>" +
      '<p class="abs ten-foot"><span>' + (window.ASKS_MORE || "") + '</span><span>·</span><span><b>누르기 전까지는 초안</b> — 등록·넣기·보내기는 선생님이</span></p>',
    build: function (el, A) {
      return [function (A) {
        A.wipe(".chiprow > *", { each: 120 });
        A.kinetic(".title", { delay: 100, each: 26 });
        A.rise(".ten .r", { delay: 500, each: 90, y: 24, snd: "pluck", v: 0.06 });
        A.pop(".ten .c", { delay: 800, each: 90, s: 0.7, snd: false });
        A.wipe(".ten-foot", { delay: 1600 });
      }];
    }
  });

  // ════════════════════════════════════════════════════════════
  // 마무리
  // ════════════════════════════════════════════════════════════
  var DO = [
    ["1", "칠판에 쪽지 하나", "더보기 → 전자칠판 알림 → 쪽지 → 「내 반」", ""],
    ["2", "주운 물건은 사진 한 장으로", "분실물 함 → 분실물 넣기, 돌려주면 「돌려줬어요」", ""],
    ["3", "받은 넵은 방에서 버튼 하나로", "넵 → 받은 → [넵]·[완료], 아래 칸은 그분께 답장", ""],
    ["4", "AI에게 한 문장", "「이번 주 학사일정 알려 줘」부터", "ai"]
  ];
  D.add({
    id: "closing", part: 5, label: "마무리 · 질문", kind: "dark", min: 1.5, trans: "whip", bgm: "end",
    notes: "오늘 본 네 가지를 하나씩 해 보시라고 권합니다. 담임 선생님은 <b>내 반 칠판에 쪽지 하나</b>, 물건을 주우면 <b>사진 한 장으로 분실물 함에</b>, 받은 넵은 <b>선생님별 방에서 버튼 하나로</b>, 그리고 <b>AI에게 한 문장</b>. 질문을 받고, 막히거나 궁금한 점은 언제든 <b>교목실</b>로 오시면 된다고 말씀드립니다. 칠판이 꺼져 있거나 안 뜨는 교실은 따로 알려 달라고 부탁합니다.",
    html: darkBg("closing") +
      '<h2 class="abs cl-title"><span class="ln">내일은,</span><span class="ln"><em>하나씩</em> 해 보세요</span></h2>' +
      '<div class="abs cl-do">' + DO.map(function (d) { return "<div" + (d[3] ? ' class="' + d[3] + '"' : "") + "><i>" + d[0] + "</i><p><b>" + d[1] + "</b><span>" + d[2] + "</span></p></div>"; }).join("") + "</div>" +
      '<p class="abs cl-ask"><b>질문 받겠습니다</b><span>막히거나 궁금하면<br><strong>교목실</strong>로 오세요</span></p>',
    build: function (el, A) {
      return [
        function (A) {
          A.go(".art-wrap img", [{ transform: "scale(1.3) translate(2%,2%)", filter: "brightness(.35)" }, { transform: "scale(1.1)", filter: "brightness(1)" }], { d: 2000, e: E.out });
          A.kenburns(".art-wrap img", { from: "scale(1.1)", to: "scale(1.03) translate(-1.2%, -0.8%)", d: 45000, delay: 2000 });
          A.kinetic(".cl-title", { delay: 400, each: 40, punch: 2.2 });
          A.hide(".cl-do div");
          A.hide(".cl-ask");
        },
        function (A) {
          A.rise(".cl-do div", { each: 160, y: 30, snd: "pluck", v: 0.07, lead: 200 });
          A.pop(".cl-do i", { delay: 200, each: 160, s: 0.3, snd: false });
        },
        function (A) {
          A.go(".cl-ask", [{ opacity: 0, transform: "translateX(60px)" }, { opacity: 1, transform: "none" }], { d: 900, e: E.out });
        }
      ];
    }
  });
})();

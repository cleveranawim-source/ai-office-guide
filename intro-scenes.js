/* AI 교무실 소개 발표(다른 학교 선생님께) — 장면 데이터
 * 연수 발표와 같은 엔진(deck.js)을 쓴다. 휴대폰 화면은 실제 앱을 예시 데이터(지어낸 학교·이름)로 띄워 찍은 것(img/*.jpg, 412×864 기준 좌표).
 * 화면 위 동그라미 자리는 img/rects.js의 R("화면", "키")에서 온다(찍을 때 잰 값). 발표 멘트(notes)는 N·P에서 보인다.
 * tour.html(휴대폰으로 읽는 소개)도 이 파일을 읽어 같은 내용을 세로로 보여 준다.
 */
(function () {
  "use strict";
  var D = window.DECK, E = D.E, h = D.h;
  var R = window.R || function () { return null; };

  D.parts([
    { n: 0, name: "시작", color: "#8fd0ff" },
    { n: 1, name: "매일 여는 화면", color: "#6fb6ea" },
    { n: 2, name: "함께 일하기", color: "#9fb3f0" },
    { n: 3, name: "수업", color: "#7fc8a9" },
    { n: 4, name: "AI와 일하기", color: "#b49cf2" },
    { n: 5, name: "학교 생활", color: "#f5a524" },
    { n: 6, name: "지키는 것", color: "#e59a7a" },
    { n: 7, name: "마무리", color: "#8fd0ff" }
  ]);

  var css = document.createElement("style");
  css.textContent = `
  .cv-brand{left:140px;top:116px;display:flex;gap:22px;align-items:center}
  .cv-brand img{width:88px;height:88px;border-radius:24px;background:#fff;padding:12px}
  .cv-brand small{display:block;font:600 18px var(--mono);letter-spacing:.26em;color:var(--glow)}
  .cv-brand b{font:800 36px var(--display);letter-spacing:-.01em}
  .cv-kicker{left:140px;top:300px;font:700 30px var(--body);color:var(--glow);letter-spacing:.05em}
  .cv-title{left:130px;top:352px;font:900 150px/1.06 var(--display);letter-spacing:-.045em;color:#fff}
  .cv-title em{color:var(--glow)}
  .cv-lead{left:140px;top:730px;font:500 34px/1.6 var(--body);color:#cfe0f3}
  .cv-lead b{color:#fff}
  .cv-ph{right:150px;top:150px;width:352px;height:714px;transform:rotate(4deg)}
  .cv-ph .phone{transform:scale(.8);transform-origin:0 0}

  .hk-bg{position:absolute;inset:0;background:radial-gradient(60% 60% at 50% 50%,#10294a 0%,var(--night) 70%)}
  .hk-bg::after{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(143,208,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(143,208,255,.06) 1px,transparent 1px);background-size:80px 80px;mask-image:radial-gradient(closest-side,#000,transparent);-webkit-mask-image:radial-gradient(closest-side,#000,transparent)}
  .hk-word{position:absolute;white-space:nowrap;padding:12px 26px;border-radius:999px;border:1.5px solid rgba(143,208,255,.3);background:rgba(14,34,60,.6);color:#dfe9f5;font-weight:700}
  .hk-say{left:0;right:0;top:430px;text-align:center;font:900 100px/1.16 var(--display);letter-spacing:-.035em;color:#fff}
  .hk-say em{color:var(--glow)}
  .hk-icon{left:50%;top:330px;width:230px;height:230px;margin-left:-115px;border-radius:58px;background:#fff;display:grid;place-items:center;box-shadow:0 30px 90px rgba(0,0,0,.55)}
  .hk-icon img{width:156px}
  .hk-ring{left:50%;top:445px;width:230px;height:230px;margin:-115px 0 0 -115px;border-radius:50%;border:3px solid var(--glow)}
  .hk-one{left:0;right:0;top:640px;text-align:center;font:900 92px/1.15 var(--display);letter-spacing:-.035em;color:#fff}
  .hk-one em{color:var(--glow)}

  .wh{left:120px;top:330px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:26px}
  .wh .c{padding:38px 36px 40px;display:flex;flex-direction:column;gap:16px;min-height:470px}
  .wh .ic{width:84px;height:84px;border-radius:24px;display:grid;place-items:center;background:var(--brand-tint)}
  .wh .ic svg{width:46px;height:46px;stroke:var(--brand);stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
  .wh h3{font:800 40px/1.25 var(--display);letter-spacing:-.025em}
  .wh p{font:500 26px/1.55 var(--body);color:var(--muted)}
  .wh p b{color:var(--ink)}
  .wh-foot{left:120px;top:870px;font:600 28px var(--body);color:var(--brand-deep)}

  .nb{left:140px;top:290px;width:1640px;display:grid;grid-template-columns:repeat(4,1fr);gap:28px}
  .nb .t{padding:34px 32px;border-radius:28px;background:rgba(9,24,44,.72);border:1px solid rgba(143,208,255,.22);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px)}
  .nb .v{font:600 112px/1 var(--mono);letter-spacing:-.04em;color:#fff;display:flex;align-items:baseline;gap:8px}
  .nb .v small{font:700 34px var(--body);color:var(--glow);letter-spacing:0}
  .nb .k{margin-top:18px;font:700 28px var(--body);color:#e6eef8}
  .nb .s{margin-top:8px;font:500 21px/1.5 var(--body);color:#a9bfd9}
  .nb-title{left:140px;top:120px;font:900 76px/1.15 var(--display);letter-spacing:-.035em;color:#fff}
  .nb-title em{color:var(--glow)}
  .nb-foot{left:140px;top:760px;width:1640px;font:500 30px/1.6 var(--body);color:#cfe0f3}
  .nb-foot b{color:#fff}

  .mp{left:120px;top:300px;width:1680px;display:grid;grid-template-columns:repeat(5,1fr);gap:18px}
  .mp .g{padding:26px 22px 24px;display:flex;flex-direction:column;gap:12px}
  .mp .g h3{font:800 30px var(--display);letter-spacing:-.02em;display:flex;align-items:center;gap:10px}
  .mp .g h3 i{width:14px;height:14px;border-radius:50%;background:var(--c)}
  .mp .g p{font:500 20px/1.4 var(--body);color:var(--muted);margin-bottom:4px}
  .mp .f{display:block;padding:12px 16px;border-radius:14px;background:var(--paper);font:700 23px var(--body);border-left:6px solid var(--c)}
  .mp .f small{display:block;font:500 17px/1.35 var(--body);color:var(--muted);margin-top:3px}

  .dy-line{left:150px;top:560px;width:1620px;height:6px;border-radius:3px;background:linear-gradient(90deg,#ffd27a,var(--brand) 55%,#7a5af5);transform-origin:left}
  .dy{left:120px;top:300px;width:1680px;height:640px}
  .dy .st{position:absolute;width:205px;display:flex;flex-direction:column;gap:8px}
  .dy .st.up{top:0;height:240px;justify-content:flex-end}
  .dy .st.dn{top:300px}
  .dy .st .tm{font:600 34px var(--mono);color:var(--brand-deep)}
  .dy .st b{font:800 26px/1.25 var(--display);letter-spacing:-.02em}
  .dy .st span{font:500 19px/1.45 var(--body);color:var(--muted)}
  .dy .dot{position:absolute;top:248px;width:30px;height:30px;margin-left:-15px;border-radius:50%;background:#fff;border:6px solid var(--brand);box-shadow:0 6px 16px rgba(41,92,158,.3)}
  .dy .st .ch{align-self:flex-start;padding:3px 12px;border-radius:999px;background:var(--brand-tint);color:var(--brand-deep);font:700 16px var(--body)}

  .pr{left:120px;top:300px;width:1680px;display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
  .pr .c{padding:30px 28px 32px;display:flex;flex-direction:column;gap:14px}
  .pr .tg{align-self:flex-start;padding:6px 16px;border-radius:999px;font:700 20px var(--body);background:var(--brand-tint);color:var(--brand-deep)}
  .pr h3{font:800 34px/1.25 var(--display);letter-spacing:-.02em}
  .pr ul{display:grid;gap:12px}
  .pr li{position:relative;padding-left:26px;font:500 21px/1.5 var(--body);color:var(--muted)}
  .pr li::before{content:"";position:absolute;left:4px;top:.62em;width:10px;height:10px;border-radius:50%;background:var(--brand)}
  .pr li b{color:var(--ink)}

  .sk{left:120px;top:300px;width:1680px;height:620px}
  .sk .bx{position:absolute;padding:24px 28px;display:flex;flex-direction:column;gap:8px}
  .sk .bx h3{font:800 30px var(--display);letter-spacing:-.02em}
  .sk .bx p{font:500 20px/1.45 var(--body);color:var(--muted)}
  .sk .bx .ch{display:flex;flex-wrap:wrap;gap:8px;margin-top:6px}
  .sk .bx .ch span{padding:5px 12px;border-radius:999px;background:var(--paper);border:1px solid var(--line);font:600 17px var(--body);color:var(--ink)}
  .sk .core{left:600px;top:150px;width:480px;height:320px;border:3px solid var(--brand);box-shadow:0 0 0 6px rgba(41,92,158,.12),0 24px 60px rgba(41,92,158,.18)}
  .sk .core h3{font-size:40px}
  .sk .wire{position:absolute;height:4px;background:repeating-linear-gradient(90deg,var(--brand) 0 16px,transparent 16px 26px);transform-origin:left}

  .ls{left:120px;top:300px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
  .ls .c{padding:28px 30px;display:flex;flex-direction:column;gap:12px}
  .ls q{font:800 28px/1.4 var(--display);letter-spacing:-.02em;quotes:"“" "”"}
  .ls q::before{content:open-quote;color:var(--brand)}
  .ls q::after{content:close-quote;color:var(--brand)}
  .ls .ar{font:700 20px var(--body);color:var(--brand)}
  .ls p{font:500 21px/1.5 var(--body);color:var(--muted)}
  .ls small{font:600 17px var(--mono);color:var(--faint)}

  .stt{left:120px;top:300px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:18px 40px}
  .stt .r{display:grid;grid-template-columns:76px 1fr;gap:22px;align-items:start;padding:24px 28px}
  .stt .n{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:var(--brand);color:#fff;font:600 30px var(--mono)}
  .stt h3{font:800 31px/1.3 var(--display);letter-spacing:-.02em}
  .stt p{margin-top:6px;font:500 21px/1.5 var(--body);color:var(--muted)}

  .cl-title{left:132px;top:220px;font:900 120px/1.08 var(--display);letter-spacing:-.04em}
  .cl-title em{color:var(--glow)}
  .cl-lead{left:140px;top:520px;width:1000px;font:500 32px/1.6 var(--body);color:#cfe0f3}
  .cl-lead b{color:#fff}
  .cl-qr{right:150px;top:240px;width:440px;padding:34px 34px 30px;border-radius:32px;background:#fff;color:var(--ink);text-align:center;box-shadow:0 40px 90px rgba(0,0,0,.45)}
  .cl-qr img{width:100%;display:block}
  .cl-qr p{font:700 26px var(--body);margin-top:16px}
  .cl-qr small{font:500 19px var(--body);color:var(--muted)}

  .tv{left:960px;top:250px;width:860px;height:520px;border-radius:26px;background:#1c2431;padding:16px;box-shadow:0 40px 90px rgba(14,28,48,.35)}
  .tv::after{content:"";position:absolute;left:50%;bottom:-48px;width:190px;height:48px;margin-left:-95px;background:linear-gradient(#2a3446,#1c2431);clip-path:polygon(18% 0,82% 0,100% 100%,0 100%)}
  .tv .in{position:relative;width:100%;height:100%;border-radius:10px;overflow:hidden;background:#0d1520}
  .tv .in img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0}
  .tv-cap{left:960px;top:860px;width:860px;display:flex;flex-wrap:wrap;gap:10px}
  .tv-cap span{padding:8px 18px;border-radius:999px;background:var(--surface);border:2px solid var(--line);font:700 22px var(--body);color:var(--muted);transition:all .4s}
  .tv-cap span.on{background:var(--brand);border-color:var(--brand);color:#fff}
  .tv-ph{position:absolute;left:330px;top:300px;width:330px;height:669px}
  .tv-ph .phone{transform:scale(.75);transform-origin:0 0}
  .tv-pkt{left:700px;top:520px;width:220px;height:6px;background:repeating-linear-gradient(90deg,var(--brand) 0 16px,transparent 16px 26px);transform-origin:left}
  `;
  document.head.appendChild(css);

  // ── 부품 ──
  var CHECK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  function scr(inner) { return '<div class="scr">' + inner + "</div>"; }
  function shot(name) { return scr('<img class="shot" src="img/' + name + '.jpg" alt="">'); }
  function cam(screens) { return '<div class="cam"><div class="rig"><div class="phone"><div class="screen">' + screens.join("") + '<div class="fx"></div></div></div></div></div>'; }
  function strip(s) { return String(s).replace(/<[^>]+>/g, ""); }
  function darkBg(art, flip) {
    return '<div class="art-wrap' + (flip ? " flip" : "") + '"><img src="img/art/' + art + '.jpg" alt=""></div><div class="shade"></div><div class="grain"></div><div class="vignette"></div>';
  }
  function chips(list) { return '<div class="chiprow">' + list.map(function (c) { return '<span class="chip ' + (c.c || "") + '">' + c.t + "</span>"; }).join("") + "</div>"; }

  // 부분 시작
  function opener(o) {
    D.add({
      id: "op" + o.part, part: o.part, label: o.part + "부 · " + D.PARTS[o.part].name, kind: "dark", min: 0.3, trans: "whip", opener: o,
      notes: o.notes,
      html: darkBg(o.art, o.flip) +
        '<div class="op-num">' + String(o.part).padStart(2, "0") + "</div>" +
        '<p class="op-kicker"><span>' + o.part + "부 · " + D.PARTS[o.part].name + "</span></p>" +
        '<h2 class="op-title">' + o.lines.map(function (l) { return '<span class="ln">' + l + "</span>"; }).join("") + "</h2>" +
        '<div class="op-ba"><div class="row was"><span class="lbl">전에는</span><span class="txt">' + o.was + '<i class="strike"></i></span></div>' +
        '<div class="row now"><span class="lbl">이제는</span><span class="txt">' + o.now + '<i class="hl"></i></span></div></div>' +
        '<p class="op-part">PART ' + String(o.part).padStart(2, "0") + " / 06</p>",
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

  // 둘러보기: 왼쪽 요점, 오른쪽 휴대폰(넘길 때마다 요점 하나 · 화면 이동 · 동그라미)
  function show(o) {
    D.add({
      id: o.id, part: o.part, label: o.label, kind: "light practice", min: o.min, notes: o.notes, trans: o.trans || "push", guide: o,
      html: chips(o.chips || [{ t: D.PARTS[o.part].name }]) +
        '<h2 class="title' + (o.two ? " two" : "") + '">' + o.title + "</h2>" +
        '<ol class="steps">' + o.steps.map(function (s) { return "<li" + (s.warn ? ' class="warn"' : "") + "><span>" + s.t + "</span></li>"; }).join("") + "</ol>" +
        (o.note ? '<div class="side-note ' + (o.note.tone || "") + '">' + o.note.html + "</div>" : "") +
        cam(o.screens.map(shot)),
      build: function (el, A) {
        var P = null, lis = A.$$(".steps li");
        function place() {
          var n = A.$(".side-note"), s = A.$(".steps");
          if (!n) { if (s.offsetTop + s.offsetHeight > 900) s.classList.add("tight"); return; }
          if (s.offsetTop + s.offsetHeight > 700) s.classList.add("tight");
          n.style.top = Math.min(s.offsetTop + s.offsetHeight + 22, 912 - n.offsetHeight) + "px";
        }
        var beats = [function (A) {
          place();
          A.wipe(".chiprow > *", { each: 110 });
          A.kinetic(".title", { delay: 120, each: 22 });
          A.rise(".steps li", { delay: 420, each: 70, y: 26, snd: "pluck", v: 0.05 });
          if (A.$(".side-note")) A.rise(".side-note", { delay: 520 + lis.length * 70, y: 20 });
          P = A.phone(".cam", o.phone);
          P.enter({ delay: 160 });
          A.lt({ tag: "둘러보기", title: o.ltTitle || strip(o.title), sub: o.sub || "화면 속 이름·내용은 모두 예시입니다", delay: 1000, tone: "" });
        }];
        o.steps.forEach(function (st, i) {
          beats.push(function (A) {
            lis.forEach(function (li, k) { li.classList.toggle("on", k === i); li.classList.toggle("done", k < i); });
            A.go(lis[i], [{ transform: "translateX(-16px)" }, { transform: "none" }], { d: 520, e: E.out });
            if (st.s != null) P.show(st.s);
            var r = st.r;
            if (r) P.focus(r, { z: st.z, tone: st.newf ? "new" : (st.warn ? "warn" : ""), fy: st.fy, d: st.s != null ? 900 : 820 });
            else P.wide();
          });
        });
        beats.push(function (A) {
          lis.forEach(function (li) { li.classList.remove("on"); li.classList.add("done"); });
          P.wide();
        });
        return beats;
      }
    });
  }

  // __SCENES__
})();

/* AI 교무실 소개 발표(다른 학교 선생님께) — 장면 데이터
 * 연수 발표와 같은 엔진(deck.js)을 쓴다. 휴대폰 화면은 실제 앱을 예시 데이터(지어낸 학교·이름)로 띄워 찍은 것(img/*.jpg, 412×864 기준 좌표).
 * 화면 위 동그라미 자리는 img/rects.js의 R("화면", "키")에서 온다(찍을 때 잰 값). 발표 멘트(notes)는 N·P에서 보인다.
 * tour.html(휴대폰으로 읽는 소개)도 이 파일을 읽어 같은 내용을 세로로 보여 준다.
 */
(function () {
  "use strict";
  var D = window.DECK, E = D.E, h = D.h;
  // 장면을 모아 두었다가 맨 끝에서 체험판 미션 표시를 붙인다(아래 「체험판과 잇기」).
  var ALL = [], add0 = D.add;
  D.add = function (d) { ALL.push(d); return add0.apply(D, arguments); };
  var R = window.R || function () { return null; };

  D.parts([
    { n: 0, name: "시작", color: "#8fd0ff" },
    { n: 1, name: "AI와 일하기", color: "#b49cf2" },
    { n: 2, name: "매일 여는 화면", color: "#6fb6ea" },
    { n: 3, name: "함께 일하기", color: "#9fb3f0" },
    { n: 4, name: "수업", color: "#7fc8a9" },
    { n: 5, name: "학교 생활", color: "#f5a524" },
    { n: 6, name: "우리 학교에서도 하려면", color: "#e59a7a" },
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
  .wh .c{padding:40px 40px 44px;display:flex;flex-direction:column;gap:18px;min-height:440px}
  .wh .ic{width:84px;height:84px;border-radius:24px;display:grid;place-items:center;background:var(--brand-tint)}
  .wh .ic svg{width:46px;height:46px;stroke:var(--brand);stroke-width:2;fill:none;stroke-linecap:round;stroke-linejoin:round}
  .wh h3{font:800 46px/1.25 var(--display);letter-spacing:-.025em}
  .wh p{font:500 30px/1.55 var(--body);color:var(--muted)}
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
  .dy .st .tm{font:800 32px var(--display);font-variant-numeric:tabular-nums;color:var(--brand-deep);white-space:nowrap}
  .dy .st b{font:800 26px/1.25 var(--display);letter-spacing:-.02em}
  .dy .st span{font:500 19px/1.45 var(--body);color:var(--muted)}
  .dy .dot{position:absolute;top:248px;width:30px;height:30px;margin-left:-15px;border-radius:50%;background:#fff;border:6px solid var(--brand);box-shadow:0 6px 16px rgba(41,92,158,.3)}
  .dy .st .ch{align-self:flex-start;padding:3px 12px;border-radius:999px;background:var(--brand-tint);color:var(--brand-deep);font:700 16px var(--body)}

  .lead6{left:120px;top:252px;width:1680px;font:500 28px/1.45 var(--body);color:var(--muted)}
  .lead6 b{color:var(--ink)}
  .pr{left:120px;top:336px;width:1680px;display:grid;grid-template-columns:repeat(4,1fr);gap:22px}
  .pr .c{position:relative;padding:32px 30px 34px;display:flex;flex-direction:column;gap:16px;min-height:420px}
  .pr .tg{align-self:flex-start;padding:6px 16px;border-radius:999px;font:700 20px var(--body);background:var(--brand-tint);color:var(--brand-deep)}
  .pr .no{position:absolute;right:28px;top:24px;font:600 44px var(--mono);color:var(--line)}
  .pr h3{font:800 40px/1.25 var(--display);letter-spacing:-.025em;padding-bottom:16px;border-bottom:1px solid var(--line)}
  .pr ul{display:grid;gap:14px}
  .pr li{position:relative;padding-left:26px;font:500 25px/1.5 var(--body);color:var(--muted)}
  .pr li::before{content:"";position:absolute;left:4px;top:.62em;width:10px;height:10px;border-radius:50%;background:var(--brand)}
  .pr li b{color:var(--ink)}

  .need{left:120px;top:340px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:72px}
  .need .c{position:relative;padding:36px 36px 34px;display:flex;flex-direction:column;gap:14px;min-height:430px}
  .need .nn{width:72px;height:72px;border-radius:50%;background:var(--brand);color:#fff;display:grid;place-items:center;font:600 36px var(--mono)}
  .need h3{font:800 40px var(--display);letter-spacing:-.02em}
  .need p{font:500 25px/1.5 var(--body);color:var(--muted)}
  .need p b{color:var(--ink)}
  .need .ch{display:flex;flex-wrap:wrap;gap:8px;margin-top:auto}
  .need .ch span{padding:6px 14px;border-radius:999px;background:var(--paper);border:1px solid var(--line);font:600 19px var(--body);color:var(--ink)}
  .need .plus{position:absolute;top:180px;width:72px;height:72px;display:grid;place-items:center;font:800 60px/1 var(--display);font-style:normal;color:var(--brand)}
  .need-foot{left:120px;top:868px;width:1680px;display:flex;flex-wrap:wrap;gap:10px 12px;align-items:center;font:500 20px var(--body);color:var(--muted)}
  .need-foot b{font:700 17px var(--mono);letter-spacing:.08em;color:var(--faint);margin-right:6px}
  .need-foot span{padding:5px 12px;border-radius:8px;background:rgba(41,92,158,.07)}

  .ls{left:120px;top:332px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
  .ls .c{padding:30px 34px;display:flex;flex-direction:column;gap:14px;min-height:236px}
  .ls q{font:800 32px/1.4 var(--display);letter-spacing:-.02em;quotes:"“" "”"}
  .ls q::before{content:open-quote;color:var(--brand)}
  .ls q::after{content:close-quote;color:var(--brand)}
  .ls .ar{font:700 25px/1.45 var(--body);color:var(--brand)}
  .ls p{font:500 21px/1.5 var(--body);color:var(--muted)}
  .ls small{font:600 20px var(--mono);color:var(--faint)}

  .stt{left:120px;top:300px;width:1680px;display:grid;grid-template-columns:1fr 1fr;gap:18px 40px}
  .stt .r{display:grid;grid-template-columns:76px 1fr;gap:24px;align-items:start;padding:30px 34px;min-height:170px}
  .stt .n{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:var(--brand);color:#fff;font:600 30px var(--mono)}
  .stt h3{font:800 36px/1.3 var(--display);letter-spacing:-.02em}
  .stt p{margin-top:8px;font:500 25px/1.5 var(--body);color:var(--muted)}

  .cl-title{left:132px;top:220px;font:900 120px/1.08 var(--display);letter-spacing:-.04em}
  .cl-title em{color:var(--glow)}
  .cl-lead{left:140px;top:520px;width:1000px;font:500 32px/1.6 var(--body);color:#cfe0f3}
  .cl-lead b{color:#fff}
  .cl-qr{right:150px;top:240px;width:440px;padding:34px 34px 30px;border-radius:32px;background:#fff;color:var(--ink);text-align:center;box-shadow:0 40px 90px rgba(0,0,0,.45)}
  .cl-qr img{width:100%;display:block}
  .cl-qr p{font:700 26px var(--body);margin-top:16px}
  .cl-qr small{font:500 19px var(--body);color:var(--muted)}

  .try{left:120px;top:286px;width:1080px;display:flex;flex-direction:column;gap:16px}
  .try .r{display:grid;grid-template-columns:64px 1fr;gap:22px;align-items:start;padding:22px 30px}
  .try .n{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:var(--brand);color:#fff;font:600 26px var(--mono)}
  .try h3{font:800 32px/1.3 var(--display);letter-spacing:-.02em}
  .try p{margin-top:6px;font:500 23px/1.5 var(--body);color:var(--muted)}
  .try p b{color:var(--ink)}
  .try .pw{display:inline-block;margin-left:6px;padding:2px 16px;border-radius:10px;background:var(--ink);color:#fff;font:700 30px var(--mono);letter-spacing:.06em}
  .try-qr{left:1290px;top:286px;width:500px;padding:34px 34px 28px;border-radius:32px;background:#fff;text-align:center;box-shadow:0 30px 70px rgba(14,28,48,.18);border:2px solid var(--line)}
  .try-qr img{width:100%;display:block}
  .try-qr p{font:800 30px var(--mono);margin-top:18px;color:var(--brand);letter-spacing:-.01em}
  .try-qr small{display:block;margin-top:6px;font:500 20px var(--body);color:var(--muted)}
  .try-foot{left:120px;top:930px;width:1680px;display:flex;flex-wrap:wrap;gap:10px 12px;font:600 21px var(--body);color:var(--muted)}
  .try-foot span{padding:6px 14px;border-radius:999px;background:rgba(41,92,158,.07)}
  .chip.mission{background:var(--ai-tint);color:var(--ai-ink);font-weight:800}
  .chip.mission::before{content:"";width:12px;height:12px;border-radius:50%;background:var(--ai)}
  .chip.mission.no{background:#e9edf2;color:var(--muted)}
  .chip.mission.no::before{background:var(--faint)}
  .try-qr p.lbl{font-family:var(--body);letter-spacing:-.01em}

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
  .bw{border-radius:16px;overflow:hidden;background:#fff;box-shadow:0 30px 70px rgba(14,28,48,.25);border:1px solid var(--line)}
  .bw .bar{height:34px;background:#eef2f7;display:flex;gap:8px;align-items:center;padding:0 14px}
  .bw .bar i{width:12px;height:12px;border-radius:50%;background:#d6dde6}
  .bw img{display:block;width:100%}
  .ar5{left:120px;top:300px;width:1680px;display:grid;grid-template-columns:repeat(5,1fr);gap:18px}
  .ar5 .c{padding:32px 28px 34px;display:flex;flex-direction:column;gap:16px;min-height:500px}
  .ar5 .n{width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:var(--brand);color:#fff;font:600 26px var(--mono)}
  .ar5 h3{font:800 34px/1.25 var(--display);letter-spacing:-.02em}
  .ar5 p{font:500 25px/1.55 var(--body);color:var(--muted)}
  .tv-note{left:960px;top:850px;width:860px;text-align:center;font:500 20px var(--body);color:var(--muted)}

  .hk-icon.hk-ai{border-radius:50%;background:radial-gradient(circle at 35% 30%,#3a8ad8,#0b4a8f 72%);color:#fff;align-content:center;gap:2px}
  .hk-ai svg{width:96px;height:96px;display:block}
  .hk-ai b{font:800 46px var(--body);letter-spacing:.02em;line-height:1}
  .steps li .aib{display:inline-block;padding:0 10px;border-radius:8px;background:var(--ai);color:#fff;font-weight:800;font-size:.82em;line-height:1.5;margin-right:6px}
  .steps li:not(.on) .aib{background:var(--ai-tint);color:var(--ai-ink)}

  .hb{left:120px;top:290px;width:1680px;height:640px}
  .hb svg.ln{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  .hb svg.ln path{fill:none;stroke:var(--ai);stroke-width:3;stroke-dasharray:6 8;opacity:.55}
  .hb .core{position:absolute;left:660px;top:140px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#7b62e6,#4a2fb8 75%);color:#fff;display:grid;place-items:center;align-content:center;gap:8px;text-align:center;box-shadow:0 30px 80px rgba(74,47,184,.35)}
  .hb .core svg{width:70px;height:70px}
  .hb .core b{font:900 44px var(--display);letter-spacing:-.02em}
  .hb .core span{font:600 22px var(--body);color:#e6defd}
  .hb .sat{position:absolute;width:520px;height:132px;padding:16px 22px;display:grid;grid-template-columns:1fr auto;grid-template-rows:auto 1fr;gap:4px 14px;align-content:center}
  .hb .sat h3{font:800 28px var(--display);letter-spacing:-.02em}
  .hb .sat q{grid-column:1;font:600 21px/1.4 var(--body);color:var(--muted);quotes:"「" "」"}
  .hb .sat q::before{content:open-quote}.hb .sat q::after{content:close-quote}
  .hb .sat em{grid-row:1/3;grid-column:2;align-self:center;font-style:normal;padding:6px 14px;border-radius:999px;background:var(--ai-tint);color:var(--ai-ink);font:700 19px var(--body);white-space:nowrap}
  .hb-rest{left:120px;top:950px;width:1680px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;font:600 21px var(--body);color:var(--muted)}
  .hb-rest span{padding:6px 14px;border-radius:999px;background:var(--surface);border:1px solid var(--line);color:var(--ink)}

  .ten{left:120px;top:300px;width:1680px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(5,auto);grid-auto-flow:column;gap:14px 28px}
  .ten .r{display:grid;grid-template-columns:52px minmax(0,1fr) auto;gap:18px;align-items:center;padding:16px 22px;border-radius:18px;background:var(--surface);border:1px solid var(--line);min-height:104px}
  .ten .n{font:600 26px var(--mono);color:var(--ai)}
  .ten .s{font:700 26px/1.38 var(--body);color:var(--ink)}
  .ten .c{padding:6px 14px;border-radius:999px;background:var(--ai-tint);color:var(--ai-ink);font:700 19px var(--body);white-space:nowrap}
  .ten-foot{left:120px;top:924px;width:1680px;display:flex;gap:14px;flex-wrap:wrap;font:500 23px var(--body);color:var(--muted)}
  .ten-foot b{color:var(--ink)}
  .wh .c.ai{border-color:var(--ai);box-shadow:0 0 0 3px rgba(109,79,216,.16),0 18px 46px rgba(109,79,216,.12)}
  .wh .c.ai .ic{background:var(--ai-tint)}
  .wh .c.ai .ic svg{stroke:var(--ai)}
  `;
  document.head.appendChild(css);

  // ── 부품 ──
  var CHECK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  function scr(inner) { return '<div class="scr">' + inner + "</div>"; }
  // 이 사이트의 그림은 처음부터 다른 학교용(경건회 줄·교목실·종교 교과·종교 인사말을 지운 것)이다 — 따로 바꿀 이름이 없다.
  function ext(name) { return name; }
  function shot(name) { return scr('<img class="shot" src="img/' + ext(name) + '.jpg" alt="">'); }
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
        '<p class="op-part">PART ' + String(o.part).padStart(2, "0") + " / 07</p>",
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
    o.screens = o.screens.map(ext); // 둘러보기(tour.html)도 이 이름으로 그림을 연다
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

  // ════════════════════════════════════════════════════════════
  // 0 · 시작
  // ════════════════════════════════════════════════════════════
  D.add({
    id: "cover", part: 0, label: "표지", kind: "dark", min: 0.5, trans: "fade", bgm: "lobby",
    notes: "시작 전부터 띄워 둡니다. “명지중학교 교직원이 매일 쓰는 학교 앱, AI 교무실을 소개합니다. 오늘 하나만 기억하신다면 — <b>메뉴를 몰라도 AI에게 말로 부탁하면 된다</b>는 것입니다.” 오늘 보여 드리는 화면은 모두 <b>실제 앱을 예시 데이터로 띄운 것</b>이라 이름·내용은 지어낸 것이라고 먼저 말씀드립니다.",
    html: darkBg("cover") +
      '<div class="abs cv-brand"><img src="img/symbol-128.png" alt=""><div><small>MYONGJI MIDDLE SCHOOL</small><b>AI 교무실</b></div></div>' +
      '<p class="abs cv-kicker">학교 앱 소개 · 2026년 10월</p>' +
      '<h1 class="abs cv-title"><span class="ln">학교 일을,</span><span class="ln"><em>말로 부탁</em>하는 앱</span></h1>' +
      '<p class="abs cv-lead">메뉴를 몰라도, AI에게 말하면 카드로 초안까지<br>교직원 74명이 매일 여는 <b>AI 교무실</b>을 소개합니다</p>' +
      '<div class="abs cv-ph"><div class="phone"><div class="screen">' + shot("ai-swap") + "</div></div></div>",
    build: function (el, A) {
      return [function (A) {
        A.go(".art-wrap img", [{ transform: "scale(1.35)", filter: "brightness(.3)" }, { transform: "scale(1.12)", filter: "brightness(1)" }], { d: 2200, e: E.out });
        A.kenburns(".art-wrap img", { from: "scale(1.12)", to: "scale(1.03) translate(-1.5%, 0.8%)", d: 60000, delay: 2200 });
        A.pop(".cv-brand img", { delay: 200, s: 0.4 });
        A.wipe(".cv-brand div", { delay: 380 });
        A.wipe(".cv-kicker", { delay: 520 });
        var t = A.kinetic(".cv-title", { delay: 640, each: 46, punch: 2.1 });
        A.rise(".cv-lead", { delay: t + 100 });
        A.go(".cv-ph", [{ transform: "perspective(1200px) translate(160px,120px) rotateY(-30deg) rotate(4deg)", opacity: 0 }, { transform: "perspective(1200px) rotate(4deg)", opacity: 1 }], { d: 1400, delay: 800, e: E.out });
        A.later(function () { A.go(".cv-ph", [{ translate: "0 0" }, { translate: "0 -14px" }], { d: 2800, iter: Infinity, dir: "alternate", e: "ease-in-out", ambient: true }); }, 2300);
      }];
    }
  });

  var HOOK_WORDS = [
    ["이번 주 학사일정은?", 150, 150, 40, -4], ["등교지도 누구 차례?", 1240, 120, 44, 3], ["빈 교실 어디?", 680, 210, 52, -2],
    ["급식 메뉴", 1560, 300, 38, 5], ["평가계획서 제출했나요?", 120, 380, 46, 2], ["가정통신문 번호", 1290, 470, 42, -3],
    ["복합기 수리 요청", 200, 620, 40, 4], ["진도 어디까지 나갔지?", 1180, 690, 48, -2], ["회의 서명 받으러 한 바퀴", 140, 850, 42, -3],
    ["6교시 누가 들어가요?", 1380, 880, 44, 3], ["넵? 읽으셨어요?", 760, 900, 40, 2], ["그 자료 어느 폴더에?", 720, 60, 38, -5]
  ];
  D.add({
    id: "hook", part: 0, label: "여는 이야기", kind: "dark", min: 1, trans: "fade",
    notes: "1단계: 선생님 하루에 흩어진 질문들입니다. “이 질문들, 하루에 몇 번 하시나요?” 메신저·단체방·게시판·종이·엑셀에 흩어져 있습니다.<br>2단계: 넘기면 낱말이 아래 탭 가운데 <b>AI 단추</b>로 모입니다. <b>“이 일들을 이제 AI에게 말로 부탁합니다.”</b> 메뉴를 찾아 들어가지 않아도, 말하면 AI가 학교 자료를 찾아 답하고 카드로 초안까지 만듭니다. 다음 장면에서 실제 화면으로 보여 드립니다.",
    html: '<div class="hk-bg"></div><div class="grain"></div>' +
      HOOK_WORDS.map(function (w) { return '<span class="hk-word" style="left:' + w[1] + "px;top:" + w[2] + "px;font-size:" + w[3] + "px;transform:rotate(" + w[4] + 'deg)"><span class="in" style="display:inline-block">' + w[0] + "</span></span>"; }).join("") +
      '<h2 class="abs hk-say"><span class="ln">선생님의 하루는</span><span class="ln"><em>여기저기</em> 흩어져 있습니다</span></h2>' +
      '<div class="abs hk-ring"></div><div class="abs hk-icon hk-ai"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 2.5c.5 4.6 3.1 7.2 7.7 7.7-4.6.5-7.2 3.1-7.7 7.7-.5-4.6-3.1-7.2-7.7-7.7 4.6-.5 7.2-3.1 7.7-7.7z"/><path d="M18.5 13.5c.25 2.3 1.55 3.6 3.85 3.85-2.3.25-3.6 1.55-3.85 3.85-.25-2.3-1.55-3.6-3.85-3.85 2.3-.25 3.6-1.55 3.85-3.85z"/></svg><b>AI</b></div>' +
      '<h2 class="abs hk-one"><span class="ln">이 일들, 이제 <em>AI에게 말로.</em></span></h2>',
    build: function (el, A) {
      var words = A.$$(".hk-word");
      function $in(w) { return w.querySelector(".in"); }
      return [
        function (A) {
          A.hide(".hk-icon, .hk-ring, .hk-one");
          words.forEach(function (w, i) {
            var ang = (i * 137) % 360, dx = Math.cos(ang * Math.PI / 180) * 700, dy = Math.sin(ang * Math.PI / 180) * 500, rot = "rotate(" + HOOK_WORDS[i][4] + "deg)";
            A.sfx("pluck", { i: i % 8, v: 0.07, delay: 120 + i * 110 + 650 });
            A.go(w, [{ transform: "translate(" + dx + "px," + dy + "px) scale(1.6) " + rot, filter: "blur(18px)", opacity: 0 }, { transform: rot, filter: "blur(0px)", opacity: 1, offset: 0.7 }, { transform: rot, filter: "blur(0px)", opacity: 0.32 }], { d: 2400, delay: 120 + i * 110, e: E.out });
            A.later(function () { A.go($in(w), [{ translate: "0 0" }, { translate: (i % 2 ? 10 : -10) + "px " + (i % 3 ? -12 : 12) + "px" }], { d: 2400 + i * 170, iter: Infinity, dir: "alternate", e: "ease-in-out", ambient: true }); }, 1400 + i * 110);
          });
          A.kinetic(".hk-say", { delay: 1500, each: 36 });
        },
        function (A) {
          A.go(".hk-say", [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "scale(.92)" }], { d: 420, e: E.in });
          A.sfx("suck");
          words.forEach(function (w, i) {
            var cx = 960 - (w.offsetLeft + w.offsetWidth / 2), cy = 445 - (w.offsetTop + w.offsetHeight / 2);
            A.go(w, [{ transform: "rotate(" + HOOK_WORDS[i][4] + "deg)", opacity: 0.6 }, { transform: "translate(" + cx + "px," + cy + "px) scale(.15) rotate(0deg)", opacity: 0 }], { d: 760, delay: 150 + i * 45, e: E.in });
          });
          A.go(".hk-icon", [{ transform: "scale(3.2)", opacity: 0, filter: "blur(20px)" }, { transform: "scale(1)", opacity: 1, filter: "blur(0px)" }], { d: 900, delay: 900, e: E.spring });
          A.sfx("boom", { delay: 980 });
          A.go(".hk-ring", [{ transform: "scale(.9)", opacity: 0 }, { transform: "scale(1)", opacity: 0.8, offset: 0.08 }, { transform: "scale(2.6)", opacity: 0 }], { d: 1900, delay: 1200, iter: Infinity, e: "cubic-bezier(.2,.6,.3,1)", ambient: true });
          A.go(".hk-one", [{ opacity: 0 }, { opacity: 1 }], { d: 10, delay: 1200 });
          A.kinetic(".hk-one", { delay: 1250, each: 40 });
        }
      ];
    }
  });

  show({
    id: "s-demo", part: 0, label: "말하기 → 카드 → 누르기", min: 1.8, trans: "zoom",
    chips: [{ t: "한 문장이면", c: "ai" }, { t: "실제 화면", c: "ghost" }],
    title: "말하면, <em>카드로</em>. 누르는 건 선생님", ltTitle: "말하기 → 카드 → 누르기",
    steps: [
      { t: '<span class="aib">① 말하기</span> 「다음 주 목요일 4~7교시 출장, 교체해 줘」', s: 0, r: R("ai-swap", "question") },
      { t: '<span class="aib">② 카드</span> 그날 학사일정·시간표·이미 잡힌 교체를 보고 <b>교체안</b>까지', s: 0, r: [16, 326, 380, 130] },
      { t: '<span class="aib">③ 누르기</span> 「내 서명으로 이 안 요청」은 <b>선생님이</b>', s: 0, r: [31, 734, 236, 40], warn: true },
      { t: '같은 세 박자로 <b>넵 초안</b> — AI는 보내지 않습니다', s: 1, r: R("ai-nep", "people") },
      { t: '<b>회의 서명부</b>·가정통신문·수리 요청·학습지까지', s: 2, r: R("ai-sign", "card") }
    ],
    screens: ["ai-swap", "ai-nep", "ai-sign"],
    notes: "무엇이 다른지 2분 안에 보여 드립니다. 아래 탭 가운데 AI에게 <b>「다음 주 목요일 4~7교시 출장, 교체해 줘」</b> 한 문장. AI가 그날 학사일정(동아리활동으로 수업이 없는 교시)과 시간표, 이미 잡힌 다른 교체까지 읽어 <b>교체안 카드</b>를 만듭니다. 마지막 「내 서명으로 이 안 요청」은 <b>선생님이 누릅니다</b> — 누르기 전까지는 나만 보는 초안입니다. 넵도, 회의 서명부도, 가정통신문도 같은 세 박자입니다. <b>말하기 → 카드 → 누르기</b>, 오늘 발표는 이 세 박자를 중심으로 갑니다."
  });

  var ICON = {
    phone: '<svg viewBox="0 0 24 24"><rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M10.5 18.5h3"/></svg>',
    stack: '<svg viewBox="0 0 24 24"><path d="M12 3 3 7.5l9 4.5 9-4.5z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/></svg>',
    spark: '<svg viewBox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>'
  };
  D.add({
    id: "what", part: 0, label: "AI 교무실은", kind: "light", min: 1.2, trans: "whip", tour: { title: "교직원만 쓰는 학교 앱, 핵심은 AI에게 말로", html: '<div class="t-grid"><div class="t-box"><b>AI에게 말로 부탁</b><span>학교 자료를 찾아 답하고 가정통신문·수리 요청·넵·수업교체·학습지 초안까지 카드로. 누르는 건 늘 선생님.</span></div><div class="t-box"><b>학교 자료가 한곳에</b><span>학사일정·시간표·주간소식·급식·자료실·공유 드라이브를 읽어 오니, AI가 우리 학교 일로 답합니다.</span></div><div class="t-box"><b>휴대폰에서 바로</b><span>주소로 열고 홈 화면에 설치하면 앱처럼. 아침·점심 알림이 오고, 아래 탭 가운데에 AI.</span></div></div>' },
    notes: "세 가지로 말씀드립니다. ① 핵심은 <b>AI에게 말로 부탁하기</b>입니다. 학교 자료를 찾아 답하고 가정통신문·수리 요청·넵·수업교체·학습지 초안까지 카드로 만듭니다. 다만 보내기·등록·확정은 늘 선생님이 누릅니다. ② AI가 그렇게 할 수 있는 것은 학사일정·시간표·주간소식·자료실·공유 드라이브처럼 <b>학교에 이미 있는 자료를 읽어 와 한곳에</b> 모았기 때문입니다. ③ <b>교직원만 쓰는 웹앱</b>입니다. 앱 장터가 아니라 주소로 열고 홈 화면에 설치하면 앱처럼, 알림도 옵니다.",
    html: chips([{ t: "AI 교무실은" }]) + '<h2 class="title">교직원만 쓰는 학교 앱, 핵심은 <em>AI에게 말로</em></h2>' +
      '<div class="abs wh">' +
      '<div class="card c ai"><span class="ic">' + ICON.spark + '</span><h3>AI에게 말로 부탁</h3><p>학교 자료를 찾아 답하고 <b>가정통신문·수리 요청·넵·수업교체·학습지</b> 초안까지 카드로. <b>누르는 건 늘 선생님</b>.</p></div>' +
      '<div class="card c"><span class="ic">' + ICON.stack + '</span><h3>학교 자료가 한곳에</h3><p><b>학사일정·시간표·주간소식·급식·자료실·공유 드라이브</b>를 읽어 오니, AI가 우리 학교 일로 답합니다.</p></div>' +
      '<div class="card c"><span class="ic">' + ICON.phone + '</span><h3>휴대폰에서 바로</h3><p>주소로 열고 <b>홈 화면에 설치</b>하면 앱처럼. 아침·점심 <b>알림</b>이 오고, 아래 탭 가운데에 <b>AI</b>.</p></div>' +
      '</div><p class="abs wh-foot">명지중학교 교직원 74명 모두 계정이 있습니다 · 휴직 중인 선생님은 자료실만</p>',
    build: function (el, A) {
      return [function (A) {
        A.wipe(".chiprow > *");
        A.kinetic(".title", { delay: 100, each: 24 });
        A.pop(".wh .c", { delay: 500, each: 160, s: 0.85 });
        A.pop(".wh .ic", { delay: 700, each: 160, s: 0.4, snd: false });
        A.rise(".wh-foot", { delay: 1300 });
      }];
    }
  });

  D.add({
    id: "numbers", part: 0, label: "숫자로 보면", kind: "dark", min: 1, trans: "fade", tour: { title: "8주 동안, 매일 고친 학교 앱", html: '<div class="t-grid"><div class="t-box"><span class="t-num">8<small>주</small></span><span>9월 4일 첫 줄부터, 지금도 쓰면서 고치는 중</span></div><div class="t-box"><span class="t-num">600<small>번</small></span><span>고쳐서 내보낸 횟수(10월 30일까지 약 600번) — 선생님 의견은 대개 그날 반영</span></div><div class="t-box"><span class="t-num">74<small>명</small></span><span>교직원 모두 계정(교사·행정실·교육공무직)</span></div><div class="t-box"><span class="t-num">16<small>가지</small></span><span>저절로 도는 일 — 아침·점심 알림, 칠판 쪽지, 넵 배달, 드라이브 요약…</span></div></div>' },
    notes: "2026년 9월 4일에 첫 줄을 썼고, 8주 동안(10월 30일까지) <b>약 600번 고쳐서 내보냈습니다</b> — 하루 열 번꼴입니다. 선생님 한 분의 말이 대개 그날 반영됩니다. 교직원 74명 모두 계정이 있고, 아침 알림·교실 칠판 쪽지·드라이브 요약 같은 <b>저절로 도는 일이 16가지</b>입니다. 숫자보다 중요한 것은 “쓰는 사람의 말로 매일 고친다”는 점입니다.",
    html: darkBg("class") +
      '<h2 class="abs nb-title"><span class="ln">8주 동안, <em>매일 고친</em> 학교 앱</span></h2>' +
      '<div class="abs nb">' +
      '<div class="t"><div class="v"><span data-n="8">0</span><small>주</small></div><p class="k">9월 4일 첫 줄부터</p><p class="s">설계 9월 2일 · 지금도 쓰면서 고치는 중</p></div>' +
      '<div class="t"><div class="v"><span data-n="600">0</span><small>번</small></div><p class="k">고쳐서 내보낸 횟수</p><p class="s">10월 30일까지 · 의견은 대개 그날 반영</p></div>' +
      '<div class="t"><div class="v"><span data-n="74">0</span><small>명</small></div><p class="k">교직원 모두 계정</p><p class="s">교사·행정실·교육공무직</p></div>' +
      '<div class="t"><div class="v"><span data-n="16">0</span><small>가지</small></div><p class="k">저절로 도는 일</p><p class="s">아침·점심 알림, 칠판 쪽지, 넵 배달, 드라이브 요약…</p></div>' +
      '</div><p class="abs nb-foot">학교 안에서 쓰는 사람이 말하면, 만드는 사람이 바로 고칩니다.<br><b>“좋은 앱”보다 “우리 학교에 맞는 앱”</b>을 목표로 합니다.</p>',
    build: function (el, A) {
      return [function (A) {
        A.go(".art-wrap img", [{ transform: "scale(1.3)", filter: "brightness(.35)" }, { transform: "scale(1.1)", filter: "brightness(.85)" }], { d: 2000, e: E.out });
        A.kinetic(".nb-title", { delay: 200, each: 34 });
        A.rise(".nb .t", { delay: 700, each: 140, y: 40 });
        A.$$(".nb [data-n]").forEach(function (s, i) { A.later(function () { A.count(s, 0, +s.dataset.n, 1300); }, 900 + i * 140); });
        A.rise(".nb-foot", { delay: 1900 });
      }];
    }
  });


  // ════════════════════════════════════════════════════════════
  // 1 · AI와 일하기 (오늘의 핵심: 말하기 → 카드 → 누르기)
  // ════════════════════════════════════════════════════════════
  opener({
    part: 1, art: "ai", lines: ["메뉴를 몰라도", "<em>말하면</em> 됩니다"],
    was: "메뉴를 찾고, 양식을 찾아 처음부터 직접", now: "말로 부탁하면 카드로 초안까지, 누르는 건 선생님",
    notes: "첫 묶음이 이 앱의 핵심, <b>AI와 일하기</b>입니다. 아래 탭 가운데 AI 해죠는 학교 자료를 찾아 답하고, 부탁하면 확인 카드로 초안을 만듭니다. 먼저 AI로 무엇을 할 수 있는지 한 장으로 보고, 실제 화면과 <b>AI가 하지 않는 다섯 가지</b>를 봅니다. 원칙은 하나 — <b>AI는 초안까지, 누르는 건 선생님</b>."
  });

  var HUB = [
    ["학사일정·시간표·급식", "이번 주 학사일정 알려 줘", "요일별 답"],
    ["자료실·공유 드라이브", "상담 기록지 양식 어디 있어?", "출처와 함께 답"],
    ["수업교체", "목요일 4~7교시 출장, 교체해 줘", "교체안 카드"],
    ["넵", "2학년 담임께 상담 기록 넵 보내 줘", "넵 초안"],
    ["전자서명", "금요일 15:30 협의회 서명부 만들어 줘", "회의 서명부"],
    ["가정통신문", "공개수업 가정통신문 초안 써 줘", "초안·번호"],
    ["신청", "2-3 교실 전자칠판 수리 요청해 줘", "수리·도서관"],
    ["수업 자료", "논설문 근거 찾기 학습지 만들어 줘", "한글 파일"]
  ];
  var HUB_REST = ["홈·빼꼼·알림", "시간표·진도", "전자칠판", "분실물 함·구기대회·보건실", "세특 도우미(따로)"];
  D.add({
    id: "map", part: 1, label: "AI로 할 수 있는 것", kind: "light", min: 1.5,
    tour: { title: "가운데 AI, 둘레에 학교 일", html: '<p>아래 탭 가운데 AI에게 말하면, 학교 일마다 답이나 확인 카드가 됩니다.</p><div class="t-grid">' + HUB.map(function (x) { return '<div class="t-box"><b>' + x[0] + "</b><span>「" + x[1] + "」 → " + x[2] + "</span></div>"; }).join("") + '</div><p>그 밖에 매일 여는 화면: ' + HUB_REST.join(" · ") + "</p>" },
    notes: "AI 교무실의 기능을 <b>AI를 가운데 두고</b> 그렸습니다. 학사일정·자료실을 묻는 것부터 수업교체·넵·서명부·가정통신문·수리 신청·학습지까지, 둘레의 학교 일은 모두 <b>AI에게 한 문장</b>으로 시작할 수 있습니다. 오른쪽 알약은 그 결과 — 답이거나 확인 카드입니다. 아래 줄은 AI 없이 매일 여는 화면들로, 뒤에서 차례로 봅니다.",
    html: chips([{ t: "AI와 일하기", c: "ai" }, { t: "기능 한눈에", c: "ghost" }]) + '<h2 class="title">가운데 <em>AI</em>, 둘레에 학교 일</h2>' +
      '<div class="abs hb"><svg class="ln" viewBox="0 0 1680 640">' + HUB.map(function (x, i) { var L = i < 4, y = 66 + (i % 4) * 152; return '<path d="M' + (L ? 520 : 1160) + " " + y + " C " + (L ? 600 : 1080) + " " + y + ", " + (L ? 620 : 1060) + " 320, " + (L ? 680 : 1000) + ' 320"/>'; }).join("") + "</svg>" +
      HUB.map(function (x, i) { var L = i < 4; return '<div class="card sat" style="left:' + (L ? 0 : 1160) + "px;top:" + (i % 4) * 152 + 'px"><h3>' + x[0] + "</h3><q>" + x[1] + "</q><em>" + x[2] + "</em></div>"; }).join("") +
      '<div class="core"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 2.5c.5 4.6 3.1 7.2 7.7 7.7-4.6.5-7.2 3.1-7.7 7.7-.5-4.6-3.1-7.2-7.7-7.7 4.6-.5 7.2-3.1 7.7-7.7z"/><path d="M18.5 13.5c.25 2.3 1.55 3.6 3.85 3.85-2.3.25-3.6 1.55-3.85 3.85-.25-2.3-1.55-3.6-3.85-3.85 2.3-.25 3.6-1.55 3.85-3.85z"/></svg><b>AI에게 말하기</b><span>말하기 → 카드 → 누르기</span></div></div>' +
      '<p class="abs hb-rest">그리고 매일 여는 화면 ' + HUB_REST.map(function (t) { return "<span>" + t + "</span>"; }).join("") + "</p>",
    build: function (el, A) {
      return [function (A) {
        A.wipe(".chiprow > *", { each: 110 });
        A.kinetic(".title", { delay: 100, each: 24 });
        A.pop(".hb .core", { delay: 350, s: 0.6 });
        A.stagger(".hb svg.ln path", [{ opacity: 0 }, { opacity: 0.55 }], { delay: 700, each: 70, d: 500 });
        A.rise(".hb .sat", { delay: 700, each: 90, y: 24, snd: "pluck", v: 0.05 });
        A.pop(".hb .sat em", { delay: 1100, each: 90, s: 0.7, snd: false });
        A.wipe(".hb-rest", { delay: 1700 });
      }];
    }
  });

  show({
    id: "s-ai", part: 1, label: "AI 해죠", min: 1.6,
    title: "학교 자료를 <em>찾아 읽고</em> 답합니다",
    steps: [
      { t: '「○○ 선생님, 무엇을 도와드릴까요?」 — 추천 질문은 <b>그날 나에게</b> 맞춰(처리 안 한 넵·마감·시간대)', s: 0, r: R("ai-home", "chips") },
      { t: '자료실·<b>공유 드라이브</b> 파일 본문까지 — 답 끝에 <b>출처와 쪽수</b>', s: 1, r: R("ai-library", "answer") },
      { t: '글 칸 왼쪽 <span class="k">＋</span>: PDF·사진·한글·엑셀 붙이기, <span class="k">깊게 생각하기</span>(하루 5번)', s: 2, r: R("ai-plus", "menu") },
      { t: '긴 지침과 우리 학교 계획을 견줘 <b>손볼 곳</b>을 쪽수와 함께', s: 3, r: R("ai-deep", "answer") }
    ],
    screens: ["ai-home", "ai-library", "ai-plus", "ai-deep"],
    notes: "AI 해죠는 시간표·급식·학사일정·주간소식 같은 학교 데이터와, 자료실 파일·<b>학교 공유 드라이브</b> 문서 본문까지 찾아 읽고 출처를 붙여 답합니다. 첫 화면은 「○○ 선생님, 무엇을 도와드릴까요?」와 그날에 맞춘 추천 질문 몇 줄, 아래는 메신저처럼 <b>＋ · 글 칸 · 마이크</b> 한 줄입니다. ＋로 붙인 PDF·한글·엑셀·사진도 읽고(저장하지 않음), 마이크로 말하면 글로 적힙니다. 어려운 일은 ＋ 안의 「깊게 생각하기」를 켜면 더 큰 모델이 오래 생각하는데, 비용 때문에 <b>선생님마다 하루 5번</b>입니다. 질문은 하루 60개까지."
  });

  show({
    id: "s-cards", part: 1, label: "확인 카드", min: 1.8,
    title: "부탁하면 <em>확인 카드</em>로", ltTitle: "부탁하면 확인 카드, 누르는 건 선생님",
    steps: [
      { t: '「공개수업 가정통신문 초안 써 줘」 → <b>학교 양식</b> 초안', s: 0, r: R("ai-letter", "head") },
      { t: '「전자칠판 터치가 안 돼요, 수리 요청해 줘」 → 수리요청 카드', s: 1, r: R("ai-repair", "head") },
      { t: '「번호 받아 줘」 → 가정통신문 번호 카드, <span class="k">번호 받기</span>는 선생님이', s: 2, r: R("ai-number", "card") },
      { t: '「학습지 만들어 줘」 → 고친 뒤 <span class="k">한글 파일 받기</span>', s: 3, r: R("ai-lesson-2", "button"), z: 1.9 },
      { t: '넵·수업교체·회의 서명부·교과협의록, <b>진도표 적기·사진으로 분실물 넣기</b>도 같은 카드로', s: 3 }
    ],
    screens: ["ai-letter", "ai-repair", "ai-number", "ai-lesson-2"],
    notes: "부탁하면 AI가 <b>확인 카드</b>를 만듭니다: 가정통신문 초안과 번호, 기기 수리 요청, 넵, 회의 서명부, 학습지·퀴즈(한글 파일), 수업교체안. 묻기 전에 알아서 채우고(날짜를 말하지 않으면 그럴듯한 날을 넣고 밝힘), 선생님은 카드에서 고친 뒤 <b>직접 눌러야</b> 실제로 등록되거나 보내집니다. AI가 넵을 대신 보내는 길은 일부러 만들지 않았습니다."
  });

  var AIRULES = [
    ["대신 보내지 않습니다", "넵·신청·서명부는 확인 카드까지. 보내기·등록은 선생님이 누를 때만."],
    ["링크를 열지 않습니다", "선생님 글의 주소만 서버가 읽고(학교 내부 주소 차단), 답에는 바깥 링크·그림을 그리지 않아 숨은 지시로 정보가 새지 않게."],
    ["원문을 남기지 않습니다", "붙인 파일과 드라이브 글은 그 대화 동안만. 드라이브는 읽기 전용 계정, 사진·영상은 읽지 않음."],
    ["대화는 본인만", "👍👎 평가에는 대화 내용을 담지 않고, 선생님이 「보내기」를 누른 한 번만."],
    ["한도를 정합니다", "하루 60개, 깊게 생각하기 5번. 매일 도는 요약은 가벼운 모델로 비용을 아낍니다."]
  ];
  D.add({
    id: "airules", part: 1, label: "AI가 하지 않는 것", kind: "light", min: 1.2,
    tour: { title: "AI가 하지 않는 것", html: '<div class="t-grid">' + AIRULES.map(function (r) { return '<div class="t-box"><b>' + r[0] + "</b><span>" + r[1] + "</span></div>"; }).join("") + "</div>" },
    notes: "AI를 학교에 들이며 가장 먼저 정한 것은 <b>AI가 하지 않는 것</b>입니다. 대신 보내지 않고, 링크를 열지 않고, 원문을 남기지 않고, 대화는 본인만 보고, 한도를 둡니다. 특히 학생 정보를 다루는 도구와 바깥 자료가 한 AI에 같이 있으면 자료 속 숨은 지시로 정보가 샐 수 있어서, 이 다섯 가지를 느슨하게 하지 않습니다.",
    html: chips([{ t: "AI와 일하기" }, { t: "원칙", c: "ghost" }]) + '<h2 class="title">AI가 <em>하지 않는</em> 다섯 가지</h2>' +
      '<div class="abs ar5">' + AIRULES.map(function (r, i) { return '<div class="card c"><span class="n">' + (i + 1) + "</span><h3>" + r[0] + "</h3><p>" + r[1] + "</p></div>"; }).join("") + "</div>",
    build: function (el, A) {
      return [function (A) {
        A.wipe(".chiprow > *");
        A.kinetic(".title", { delay: 100, each: 24 });
        A.rise(".ar5 .c", { delay: 450, each: 140, y: 40, snd: "pluck", v: 0.06 });
      }];
    }
  });

  show({
    id: "s-record", part: 1, label: "세특 도우미", min: 1.2,
    title: "생기부 초안은 AI가, <em>이름은 기기 안에</em>",
    steps: [
      { t: '학생 이름·번호는 <b>기기 밖으로 나가지 않음</b> — 활동 내용만 전송', s: 0, r: R("record", "privacy") },
      { t: '과세특·동아리·행발·가정통신문, 글자수와 AI를 고르고 생성', s: 1, r: R("record-options", "generate") },
      { t: '초안 아래 <b>근거</b>: 기재요령 쪽수·교무부 Q&amp;A', s: 2, r: R("record-result", "basis") }
    ],
    screens: ["record", "record-options", "record-result"],
    notes: "세특 도우미는 학생부 문장 초안을 씁니다. 학생 이름과 번호는 기기 밖으로 나가지 않고 활동·관찰 내용만 AI로 보내며, 돌아온 초안에 기기 안에서 이름을 붙입니다. 기본 AI는 학교가 비용을 내는 모델이고, 선생님 개인 API 키를 넣으면 다른 회사 모델도 씁니다(키는 브라우저에만). 초안마다 <b>어떤 기재요령 쪽과 교무부 Q&amp;A를 기준으로 썼는지</b>가 붙습니다."
  });

  // ════════════════════════════════════════════════════════════
  // 2 · 매일 여는 화면
  // ════════════════════════════════════════════════════════════
  opener({
    part: 2, art: "basics", lines: ["열면, 오늘이", "<em>한눈에</em>"],
    was: "오늘 일정·당번·바뀐 수업을 여기저기서", now: "홈 한 화면과 아침 알림 한 번으로",
    notes: "AI 다음은 매일 여는 화면입니다. 선생님 하루를 따라가 본 뒤 홈, 빼꼼, 알림을 봅니다. 하루에 가장 많이 보는 곳이라, 여기서 매일 쓸 이유를 만들었습니다."
  });

  var DAY = [
    ["07:50", "아침 알림", "「내 줄」이 맨 위 — 내 당번·바뀐 내 수업·겹치는 일정·오늘 마감 넵", "자동"],
    ["08:45", "교실 칠판 쪽지", "수업이 바뀐 반 칠판 귀퉁이에 「오늘 바뀐 수업」", "자동"],
    ["수업 중", "시간표 「지금」", "빈 교실·공강인 선생님을 그 자리에서", ""],
    ["쉬는 시간", "넵 한 번", "보낸 선생님별 방에서 [넵]·[완료] 한 번", ""],
    ["11:30", "점심 알림", "급식지도 당번·오후 수업·남은 넵", "자동"],
    ["오후", "AI에게 부탁", "가정통신문 번호·학부모 답장 초안·학습지", ""],
    ["15:30", "새 문서 요약", "공유 드라이브에 새로 만든 문서를 한두 문장으로", "자동"],
    ["금 15:00", "다음 주 미리 보기", "마감 넵·수업 교체·나와 관련된 일정", "자동"]
  ];
  D.add({
    id: "day", part: 2, label: "선생님의 하루", kind: "light", min: 1.5, tour: { title: "아침 7시 50분부터, 금요일 오후까지", html: '<ol class="t-time">' + DAY.map(function (d) { return '<li><span class="tm">' + d[0] + "</span>" + (d[3] ? '<span class="ch">' + d[3] + "</span>" : "") + "<b>" + d[1] + "</b><span>" + d[2] + "</span></li>"; }).join("") + "</ol>" },
    notes: "선생님 하루를 따라가 보면 이렇습니다. <b>아침 7시 50분</b> 알림 맨 위에 “나에게만 해당하는 줄”이 옵니다. <b>8시 45분</b>에는 수업이 바뀐 반 교실 칠판에 쪽지가 저절로 붙습니다. 수업 중에는 시간표에서 빈 교실을, 쉬는 시간엔 넵을 한 번에. 점심 알림, 오후엔 AI에게 부탁, <b>3시 30분</b>엔 공유 드라이브 새 문서 요약, <b>금요일 3시</b>엔 다음 주 미리 보기. <b>‘자동’ 표시</b>는 선생님이 아무것도 안 해도 오는 것입니다.",
    html: chips([{ t: "매일 여는 화면" }, { t: "선생님의 하루", c: "ghost" }]) + '<h2 class="title">아침 7시 50분부터, <em>금요일 오후</em>까지</h2>' +
      '<div class="abs dy-line"></div><div class="abs dy">' + DAY.map(function (d, i) {
        var x = 30 + i * 212;
        return '<div class="st ' + (i % 2 ? "dn" : "up") + '" style="left:' + x + 'px"><span class="tm">' + d[0] + "</span><b>" + d[1] + "</b><span>" + d[2] + "</span>" + (d[3] ? '<span class="ch">' + d[3] + "</span>" : "") + '</div><i class="dot" style="left:' + (x + 30) + 'px"></i>';
      }).join("") + "</div>",
    build: function (el, A) {
      return [function (A) {
        A.wipe(".chiprow > *");
        A.kinetic(".title", { delay: 100, each: 22 });
        A.go(".dy-line", [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { d: 2600, delay: 400, e: E.cam });
        A.pop(".dy .dot", { delay: 500, each: 300, s: 0.2, snd: "pluck", v: 0.06 });
        A.rise(".dy .st", { delay: 600, each: 300, y: 24 });
      }];
    }
  });

  show({
    id: "s-home", part: 2, label: "홈", min: 1.5,
    title: "홈: 오늘 <em>나에게</em> 필요한 것만",
    steps: [
      { t: '큰 글씨는 <b>선생님마다 다른 한마디</b> — 교체로 수업을 맡아 준 날엔 “고마워요”', s: 0, r: R("home", "hero"), newf: true },
      { t: '<span class="q">「빼꼼 · 오늘 학교는」</span> 판: 오늘 일정·지도 당번과 공지·교체 수 — 누르면 빼꼼', s: 0, r: R("home", "peek"), newf: true, z: 1.6 },
      { t: '두 칸 <span class="q">내 수업 · 내 일정</span>(누르면 시간표·달력), 그 아래 <b>처리할 넵</b>', s: 0, r: R("home", "tiles"), newf: true, z: 1.9 },
      { t: '오른쪽 남색 기둥 = <b>내 바로가기</b>, <span class="k">톱니</span>로 최대 6개', s: 2, r: R("home-sheet", "pick"), newf: true },
      { t: '오늘 시간표: 지금 교시 <span class="q">「지금」</span>, 교체로 들어온 수업 <span class="q">「바뀜」</span>', s: 0, r: R("home", "now"), z: 1.9 },
      { t: '급식과 <span class="q">「다가오는 일정」</span>(오늘부터 7일)', s: 1, r: R("home-3", "upcoming") }
    ],
    screens: ["home", "home-3", "home-sheet"],
    notes: "앱을 열면 보이는 홈입니다. 위쪽 큰 글씨는 <b>선생님마다 다른 한마디</b>입니다. 오늘 동료 수업을 교체로 맡아 준 선생님에게는 “고마워요”, 급식지도 당번에게는 “점심 챙기세요”처럼, 그 선생님의 오늘에 맞춰 AI와 규칙이 함께 고릅니다(퇴근했다고 단정하거나 다그치는 말은 쓰지 않습니다). 그 아래 <b>빼꼼 판</b>에 오늘 일정과 등교·급식지도 당번, 공지·바뀐 수업 수가 모이고(누르면 빼꼼), 내 수업·내 일정 두 칸, 처리할 넵, 오늘 시간표, 급식, 다가오는 일정 순서입니다. 카드 오른쪽의 <b>남색 기둥</b>은 내 바로가기입니다 — 처음엔 전자칠판 알림·수업교체·분실물 함이 있고, 맨 아래 톱니로 자주 쓰는 도구를 최대 6개까지 골라 둡니다(그 기기에만 저장, 화면을 내려도 제자리). <b>저녁 7시부터는</b> 홈 전체가 내일 것으로 바뀌어 퇴근길에 내일을 봅니다."
  });

  show({
    id: "s-today", part: 2, label: "빼꼼", min: 1,
    title: "빼꼼: 오늘 <em>달라진 것만</em>",
    steps: [
      { t: '맨 위 <span class="q">「알림판」</span>에 공지', s: 0, r: R("today", "board") },
      { t: '요일을 눌러 이번 주 다른 날도', s: 0, r: R("today", "days") },
      { t: '<span class="q">「특별 일정」</span>: 학사일정과 교무부 <b>주간소식</b>을 한 목록으로', s: 1, r: R("today-2", "events") },
      { t: '<span class="q">「바뀐 수업」</span>: <b>선생님 이름 없이 과목만</b> — 사유도 싣지 않음', s: 1, r: R("today-2", "changes") }
    ],
    screens: ["today", "today-2"],
    notes: "「빼꼼」은 오늘 학교를 빼꼼 들여다본다는 뜻입니다. 평소 시간표와 <b>달라진 것만</b> 모읍니다. 바뀐 수업은 전교에 보이지만 <b>선생님 이름 없이 과목만</b> 나오고, 누가 왜 자리를 비우는지(출장·병가 등)는 싣지 않습니다. 이 원칙은 뒤의 ‘지키는 것’에서 다시 말씀드립니다."
  });

  show({
    id: "s-alerts", part: 2, label: "알림", min: 1,
    title: "알림: 맨 위엔 <em>「내 줄」</em>",
    steps: [
      { t: '평일 <b>7:50 아침 · 11:30 점심</b> 알림 — 맨 위에 나에게만 해당하는 줄', s: 0, r: R("notifications-on", "test") },
      { t: '보건실 입실 알림: <b>이름 없이 반·성별만</b>, 1분 안에', s: 0, r: R("notifications-on", "nurse"), z: 1.9 },
      { t: '놓친 알림은 홈 종 → <b>알림함</b>, 확인하면 지워짐', s: 1, r: [16, 150, 380, 130] },
      { t: '평일 3:30 <b>공유 드라이브 새 문서</b> 요약, 금요일 3시 <b>다음 주 미리 보기</b>', s: 1, r: [16, 380, 380, 330] }
    ],
    screens: ["notifications-on", "alerts"],
    notes: "알림은 모두에게 같은 글을 보내지 않습니다. 아침·점심 알림 맨 위에는 <b>그 선생님에게만 해당하는 줄</b> — 내 당번, 바뀐 내 수업, 내 수업과 겹치는 행사, 오늘 마감인 요청 — 이 오고, 학교 일정은 AI가 누구 일인지 읽어 관련 있는 분께만 보냅니다. 오후에는 공유 드라이브에 새로 만든 문서를 한두 문장으로 요약해 보내고, 금요일에는 다음 주 미리 보기를 보냅니다."
  });

  D.add({
    id: "s-desk", part: 2, label: "PC에서도", kind: "light", min: 0.6, tour: { title: "PC에서도 같은 화면", html: '<p>컴퓨터에서는 왼쪽 메뉴와 넓은 달력으로 보입니다. 휴대폰과 같은 주소, 같은 계정입니다. 교무실 PC에는 오른쪽에 좁은 창으로 두고 알림을 카드로 받는 <b>설치본</b>도 있습니다.</p><img src="img/desk/home.jpg" alt="PC 홈 화면" style="width:100%;border-radius:12px;border:1px solid var(--line)" loading="lazy"><img src="img/desk/calendar.jpg" alt="PC 일정 화면" style="width:100%;border-radius:12px;border:1px solid var(--line)" loading="lazy">' },
    notes: "같은 주소를 컴퓨터에서 열면 왼쪽 메뉴가 있는 넓은 화면입니다. 일정 달력은 넓은 화면에서 일정 이름까지 보입니다. 휴대폰을 먼저 설계했고, 컴퓨터는 같은 화면을 넓게 씁니다. 교무실 PC에는 <b>설치본</b>도 있습니다 — 사이트를 창 하나에 띄우는 작은 프로그램이라, 화면 오른쪽에 메신저처럼 좁은 창으로 두고 넵·알림을 화면 오른쪽 아래 알림 카드(「잎사귀 편지」)로 받습니다. 사이트를 고치면 설치본은 다시 나눠 주지 않아도 됩니다.",
    html: chips([{ t: "매일 여는 화면" }, { t: "PC", c: "ghost" }]) + '<h2 class="title">컴퓨터에서도 <em>같은 화면</em>, 넓게</h2>' +
      '<div class="abs bw" style="left:120px;top:300px;width:1040px"><div class="bar"><i></i><i></i><i></i></div><img src="img/desk/home.jpg" alt=""></div>' +
      '<div class="abs bw" style="left:820px;top:400px;width:980px"><div class="bar"><i></i><i></i><i></i></div><img src="img/desk/calendar.jpg" alt=""></div>',
    build: function (el, A) {
      return [function (A) {
        A.wipe(".chiprow > *");
        A.kinetic(".title", { delay: 100, each: 24 });
        A.go(A.$$(".bw")[0], [{ opacity: 0, transform: "translateY(60px) rotate(-1deg)" }, { opacity: 1, transform: "rotate(-1deg)" }], { d: 1000, delay: 300, e: E.out });
        A.go(A.$$(".bw")[1], [{ opacity: 0, transform: "translateY(80px) rotate(1.2deg)" }, { opacity: 1, transform: "rotate(1.2deg)" }], { d: 1000, delay: 700, e: E.out });
        A.sfx("rise", { delay: 300 });
      }];
    }
  });

  // ════════════════════════════════════════════════════════════
  // 3 · 함께 일하기
  // ════════════════════════════════════════════════════════════
  opener({
    part: 3, art: "nep", lines: ["읽었는지, 했는지", "<em>한눈에</em>"],
    was: "단체방에 올리고 “읽으셨어요?” 다시 묻기", now: "버튼 하나로 답하고, 처리 현황이 보이는 「넵」",
    notes: "다음은 함께 일하기입니다. 학교 업무 연락은 단체 메신저로 하면 누가 읽었는지, 했는지 알기 어렵습니다. 그래서 만든 것이 「넵」입니다. 그리고 회의 서명부, 자료실. 장면마다 끝에 <b>「AI로도」</b> 한 줄 — 같은 일을 AI에게 말로 하는 길을 붙여 두었습니다."
  });

  show({
    id: "s-nep", part: 3, label: "넵", min: 2.2,
    title: "넵: 메신저처럼, <em>답은 버튼 하나</em>",
    steps: [
      { t: '첫 화면 <b>조직도</b>: 체크한 만큼 <span class="k">3명에게 쓰기</span>', s: 0, r: R("nep-org-picked", "bar"), z: 1.8 },
      { t: '<b>첫 줄이 제목</b>, <span class="k">+</span>로 넵 받기·완료 받기·파일 받기', s: 1, r: [12, 430, 388, 424] },
      { t: '<b>받은</b> 탭 = 보낸 선생님별 방, 안 읽은 수·처리할 칩', s: 2, r: R("nep-inbox", "row") },
      { t: '카드에서 <span class="k">완료</span> 한 번, <b>아래 칸이 곧 답장</b>', s: 3, r: R("nep-room", "done"), z: 1.9 },
      { t: '보낸 분: 「4/9 완료」·「아직 5명」 → <span class="k">다시 알림</span>', s: 4, r: R("nep-board", "remind") },
      { t: '<span class="aib">AI로도</span> 「상담 기록 넵 보내 줘」 → 초안, <b>보내기는 선생님</b>', s: 5, r: R("ai-nep", "people") }
    ],
    screens: ["nep-org-picked", "nep-plus", "nep-inbox", "nep-room", "nep-board", "ai-nep"],
    notes: "넵은 교내 메시지입니다. 메신저처럼 생겼습니다 — 첫 화면은 <b>조직도</b>이고, 이름을 누르면 그 선생님과의 방, 칸을 체크하면 여러 분께 한 번에 씁니다. 종류는 <b>메시지 · 넵 받기 · 완료 받기 · 파일 받기</b> 네 가지라, 받는 분은 [넵]·[완료]·[제출] 버튼 하나로 답하고 보낸 분은 「4/9 완료」처럼 숫자로 봅니다. 받은 넵은 <b>보낸 선생님별 방</b>에 모이고, 방 아래 칸이 곧 그분께 가는 답장입니다. 일과 중에는 바로 도착하고, 근무 시간 밖에 보낸 것은 다음 근무일 아침에 도착하게 해서 <b>퇴근 뒤 시간을 지킵니다</b>(긴급만 예외). 글에 “23일까지”라고 쓰면 마감이 미리 채워지고, 그 마감은 받는 분의 일정에만 나타납니다. 학교가 보내는 자동 안내(등교지도·급식지도 당번, 보강 모집, 기기 수리 요청)는 사람 이름이 아니라 종 그림의 <b>「띵동」</b>이 보냅니다 — 누가 시킨 부탁이 아니라 공적인 알림이라는 것이 한눈에 보입니다. <b>AI에게 말로</b> 해도 받는 사람·마감까지 채운 초안이 뜨지만, <b>AI는 보내지 않습니다</b>."
  });

  show({
    id: "s-sign", part: 3, label: "전자서명", min: 1.2,
    title: "서명부 들고 <em>돌지 않아도</em>",
    steps: [
      { t: '내 서명은 <b>한 번 등록</b> — 손 서명이나 도장 사진', s: 0, r: R("signature", "hand") },
      { t: '회의 서명부: 받은 분은 <span class="k">내 서명으로 서명하기</span> 한 번', s: 1, r: R("sign-meeting", "sign") },
      { t: '명단에 서명 시각이 차고, 만든 분은 <b>PDF 한 장</b>으로', s: 1, r: R("sign-meeting", "roster") },
      { t: '계획서·동의서 파일의 <b>(서명)·(인) 자리</b>에도', s: 2, r: R("sign-file", "sign") },
      { t: '<span class="aib">AI로도</span> 「금요일 15:30 협의회 서명부 만들어 줘」 → 서명부 초안', s: 3, r: R("ai-sign", "card") }
    ],
    screens: ["signature", "sign-meeting", "sign-file", "ai-sign"],
    notes: "회의가 끝나면 서명부를 들고 교무실을 한 바퀴 도는 일이 있었습니다. 이제 서명은 <b>한 번 등록</b>해 두고, 회의 서명부·파일 서명·수업교체 신고서에 <b>한 번 눌러</b> 넣습니다. 서명 그림은 본인만 보고 바꿀 수 있고(관리자도 못 봄), 화면에는 보이지 않고 내려받는 PDF에만 들어갑니다. 학교 내부 문서용이고 공문 전자결재는 그대로입니다. 서명부도 AI에게 말로 만들 수 있고, 명단은 말한 대로(부서·교과·학년 담임) 맞춰집니다."
  });

  show({
    id: "s-library", part: 3, label: "자료실·신청", min: 0.8,
    title: "자료는 <em>한곳에</em>, 신청은 <em>한 화면에</em>",
    steps: [
      { t: '부서별 자료·양식, 위쪽 <b>검색</b>', s: 0, r: R("library", "search") },
      { t: '파일은 <span class="k">내려받기</span>, 링크는 앱 안에서 열기', s: 1, r: R("library-post", "download") },
      { t: '<b>신청</b>: 교외체험학습 서식 채우기·기기 수리·통신문 번호 등', s: 2, r: R("forms", "trip") },
      { t: '<span class="aib">AI로도</span> 「상담 기록지 양식 어디 있어?」 → 자료실·드라이브를 찾아 <b>열기 ›</b>', s: 3, r: R("ai-form", "links"), z: 1.95 }
    ],
    screens: ["library", "library-post", "forms", "ai-form"],
    notes: "자료실은 부서별 자료와 양식을 한곳에 모았고, 파일 본문은 뒤에서 볼 AI 해죠가 읽어 답합니다. 신청 메뉴는 구글 시트로 받던 신청(기기 수리·가정통신문 번호·물품 구입 등)을 한 화면에 모았습니다. 양식이 어디 있는지 몰라도 AI에게 물으면 자료실 글과 공유 드라이브 문서를 찾아 열기 링크로 붙여 줍니다."
  });

  // ════════════════════════════════════════════════════════════
  // 4 · 수업
  // ════════════════════════════════════════════════════════════
  opener({
    part: 4, art: "class", lines: ["시간표에서", "<em>교실 칠판까지</em>"],
    was: "빈 교실을 찾으러 교무실 시간표 앞으로", now: "빈 교실·공강·교체 계산을 휴대폰에서",
    notes: "다음은 수업입니다. 시간표, 수업교체(AI로도), 진도, 그리고 교실 전자칠판."
  });

  show({
    id: "s-timetable", part: 4, label: "시간표", min: 1.5,
    title: "시간표에 <em>그 주의 일</em>이 저절로",
    steps: [
      { t: '그 주 <b>수업교체</b>가 칸에: 초록 「바뀜」, 흐린 「교체」, 「수락 대기」', s: 0, r: R("tt-my", "changed"), z: 1.9 },
      { t: '수업과 겹치는 <b>학사일정·넵 일정</b>은 띠로, 누르면 전체 글', s: 1, r: R("tt-pop", "pop") },
      { t: '학급·교실 시간표에서도 바뀐 과목 — <b>선생님 이름은 빼고</b>', s: 2, r: R("tt-class", "tabs") },
      { t: '지금 <b>빈 교실</b>과 <b>공강인 선생님</b> — 이름을 누르면 그분께 넵', s: 3, r: R("tt-free", "teachers") }
    ],
    screens: ["tt-my", "tt-pop", "tt-class", "tt-free"],
    notes: "시간표는 학교 시간표 엑셀을 올려 만들고, 그 위에 <b>그 주의 일</b>이 저절로 얹힙니다: 확정된 수업교체, 수업 시간과 겹치는 학사일정, 넵 속 일정. 학급·교실 시간표에도 바뀐 과목은 보이지만 선생님 이름은 없고, <b>다른 선생님 개인 시간표에는 교체가 보이지 않습니다</b>. 지금 빈 교실과 공강인 선생님도 그날 실제 시간표로 셉니다."
  });

  show({
    id: "s-swap", part: 4, label: "수업교체", min: 1.8,
    title: "수업교체는 <em>계산</em>하고, <em>서명</em>으로",
    steps: [
      { t: '선생님·날짜·교시를 고르면 <b>그날 학사일정</b>이 바로', s: 0, r: R("sub-calc", "calendar") },
      { t: '교체안: 반영한 학사일정·이미 잡힌 교체, 상대 부담', s: 1, r: R("sub-result", "calendar") },
      { t: '갚는 수업 날짜 고르기 — 막힌 날은 <b>까닭</b>이 붙음', s: 2, r: R("sub-dates", "dates") },
      { t: '<span class="k">내 서명으로 이 안 요청</span> → 상대가 서명하고 수락', s: 2, r: R("sub-dates", "request") },
      { t: '교무부 <b>제출함</b>: 교실 정하기·고치기·신고서(한글)', s: 3, r: R("sub-inbox", "rooms") },
      { t: '<span class="aib">AI로도</span> 「목요일 4~7교시 출장, 교체해 줘」 → <b>같은 계산기</b>로 교체안', s: 4, r: R("ai-swap", "question") }
    ],
    screens: ["sub-calc", "sub-result", "sub-dates", "sub-inbox", "ai-swap"],
    notes: "출장이 잡히면 수업교체 계산부터 합니다. 그날 학사일정(동아리·행사로 수업이 없는 교시 등)과 이미 잡힌 다른 교체를 얹어 경우의 수를 찾고, 상대 선생님 부담이 적은 안을 추천합니다. 갚는 수업 날짜는 그 주·한 주 뒤·두 주 뒤에서 고르는데, 막힌 날은 까닭이 붙습니다. 요청과 수락은 <b>등록해 둔 서명으로 한 번에</b>, 신고서 한글 파일도 서명이 채워져 나옵니다. 화면과 알림에는 ‘결강’ 대신 ‘수업 교체’라는 말을 씁니다. 메뉴를 거치지 않고 AI에게 한 문장으로 말해도 같은 계산기가 돌아 교체안 카드가 뜹니다."
  });

  show({
    id: "s-progress", part: 4, label: "진도표", min: 1.4,
    title: "진도는 <em>한 줄</em>, 빠진 칸은 <em>도장판</em>",
    steps: [
      { t: '그날 <b>실제 수업</b>마다 한 줄, <span class="k">모두 저장</span> 한 번', s: 0, r: R("pg-today", "save"), z: 1.9 },
      { t: '<span class="q">「한 달」</span>: 이달 지난 수업 <b>45칸 중 40칸</b>, 「🔥 2주 연속」', s: 1, r: R("pg-month", "summary") },
      { t: '반마다 도장판: 적음 ✓ · 아직 점선 · 한 주 다 채우면 ⭐', s: 2, r: R("pg-month-2", "row") },
      { t: '<b>점선을 누르면</b> 그 반·그 주가 열려 바로 적기', s: 3, r: R("pg-month-pick", "slot") },
      { t: '<span class="q">「주별」</span>은 한 주씩, <b>학급별 보기</b>는 그 반의 내 과목', s: 4, r: [16, 258, 380, 340] },
      { t: '<span class="aib">AI로도</span> 「오늘 2-3반 5단원 했어」 → <span class="k">진도표에 적기</span>', s: 5, r: R("ai-progress", "card") }
    ],
    screens: ["pg-today", "pg-month", "pg-month-2", "pg-month-pick", "pg-week", "ai-progress"],
    notes: "진도표는 한 줄이면 됩니다. 칸은 원래 시간표가 아니라 그날 실제로 하는 수업(교체 반영)이고, 하루치를 한 번에 저장합니다. <b>한 달</b> 보기는 반마다 진도를 도장판처럼 보여 줍니다 — 적은 수업은 도장, 빠진 수업은 점선이라 한눈에 보이고, 점선을 누르면 그 주가 열려 바로 적습니다. 모든 반을 다 적은 주가 이어지면 「2주 연속」이 붙습니다. <b>주별</b> 보기는 한 주씩 넘기며 반마다 마지막 진도를, <b>학급별 보기</b>는 그 반의 내 과목 기록을 보여 줍니다(다른 과목은 보이지 않음). 진도 지도는 본인 기록만 봅니다. AI에게 「오늘 2-2반이랑 2-3반 5단원 했어」라고 해도 그날 시간표에서 교시를 찾아 카드로 만들어 줍니다."
  });

  show({
    id: "s-board", part: 4, label: "전자칠판 보내기", min: 1.5,
    title: "교실 칠판에, <em>휴대폰으로</em>",
    steps: [
      { t: '<b>무엇을 → 어디에 → 보내기</b>, 담임은 「내 반」이 기본', s: 0, r: R("board-send", "where") },
      { t: '여러 학년을 함께, 초록불은 지금 켜진 칠판', s: 1, r: R("board-pick", "grid") },
      { t: '긴급은 보내기 전 <b>몇 곳·꺼진 칠판</b>을 한 번 더', s: 2, r: R("board-alert-confirm", "where") },
      { t: '<b>음성 안내</b> 30초 — 목소리 파일은 하루 뒤 지움', s: 3, r: R("board-voice-rec", "status") }
    ],
    screens: ["board-send", "board-pick", "board-alert-confirm", "board-voice-rec"],
    notes: "교실마다 있는 전자칠판에 휴대폰으로 안내를 띄웁니다. 안내(사진·링크·영상), 칠판 귀퉁이에 붙는 쪽지, 전체 화면 긴급(대피 문구), 그리고 30초 음성 안내까지. 담임 선생님은 「내 반」이 기본이고, 보내기 단추에 어디로 가는지가 그대로 적힙니다."
  });

  D.add({
    id: "s-tv", part: 4, label: "교실 칠판 모습", kind: "light", min: 1.5,
    tour: { title: "교실 칠판에는 이렇게", html: '<div class="t-grid">' + [["idle", "평소 — 반 이름과 큰 시계, 왼쪽 아래 [지난 알림]·[작은 창]·[분실물 함]·[숨기기]"], ["lunch", "점심시간 — 큰 시계 아래 분실물 띠(사진이 흘러가고 찾으러 갈 교무실을 크게)"], ["notice-photo", "안내 — 사진은 크게, 글은 아래"], ["memo", "8:45 — 수업이 바뀐 반에 「오늘 바뀐 수업」 쪽지"], ["alert", "긴급 — 빨간 전체 화면과 경보음"], ["voice", "음성 — 「띵」 뒤 두 번, [다시 듣기]"], ["inclass-composite", "수업 중 — 30초 뒤 숨고 안내는 구석 포스트잇(합성 그림)"]].map(function (x) { return '<div class="t-box"><img src="img/board/' + x[0] + '.jpg" alt="" loading="lazy" style="width:100%;border-radius:8px"><span>' + x[1] + "</span></div>"; }).join("") + "</div>" },
    notes: "교실 칠판에는 이렇게 뜹니다. 평소엔 반 이름과 큰 시계. " + (window.BOARD_BTNS ? window.BOARD_BTNS.notes : "") + " <b>점심시간</b>에는 그 아래 <b>분실물 띠</b>가 붙어 보관 중인 물건 사진이 옆으로 흘러가고, 찾으러 갈 교무실이 크게 보입니다(학생용 QR은 교실에 인쇄해 붙입니다). 안내는 사진이 위에 크게. 아침 8시 45분에는 <b>수업이 바뀐 반 칠판 귀퉁이에 「오늘 바뀐 수업」 쪽지가 저절로</b> 붙습니다(사유 없이 교시·과목·교실만). 긴급은 빨간 전체 화면, 음성 안내에는 [다시 듣기]. 칠판 창 프로그램이 깔린 교실은 수업이 시작하면 30초 뒤 칠판이 저절로 숨고, 수업 중에 온 안내는 구석 포스트잇으로만 뜹니다(마지막 그림은 합성). 교실 PC 화면보호기도 학교 보안 점검 기준을 지키며 칠판을 띄웁니다.",
    html: chips([{ t: "수업" }, { t: "교실 칠판", c: "ghost" }]) + '<h2 class="title" style="width:860px">교실 칠판에는 <em>이렇게</em> 뜹니다</h2>' +
      '<ol class="steps bt">' + [["왼쪽 아래 단추", "지난 알림 · 작은 창 · 분실물 함 · 숨기기"], ["점심시간", "큰 시계 아래 분실물 띠(사진이 흘러가요)"], ["안내", "사진은 위에 크게, 글은 아래"], ["8:45 쪽지", "수업이 바뀐 반에 「오늘 바뀐 수업」"], ["긴급", "빨간 전체 화면과 경보음"], ["음성", "「띵」 뒤 두 번, [다시 듣기]"], ["수업 중", "30초 뒤 숨고, 안내는 구석 포스트잇"]].map(function (x) { return "<li><span><b>" + x[0] + "</b> · " + x[1] + "</span></li>"; }).join("") + "</ol>" +
      '<div class="abs tv"><div class="in">' + ["idle", "lunch", "notice-photo", "memo", "alert", "voice", "inclass-composite"].map(function (n) { return '<img src="img/board/' + n + '.jpg" alt="">'; }).join("") + "</div></div>" + (window.BOARD_BTNS ? window.BOARD_BTNS.html : "") +
      '<p class="abs tv-note">마지막 그림은 이해를 돕는 합성 그림 · 반·이름은 예시</p>',
    build: function (el, A) {
      var imgs = A.$$(".tv img"), lis = A.$$(".steps.bt li"), cur = -1;
      function showI(i) {
        lis.forEach(function (li, k) { li.classList.toggle("on", k === i); li.classList.toggle("done", k < i); });
        if (window.BOARD_BTNS) window.BOARD_BTNS.show(A, el, i === 0);
        if (cur >= 0) A.go(imgs[cur], [{ opacity: 1 }, { opacity: 0 }], { d: 500, e: E.in });
        A.go(imgs[i], [{ opacity: 0, transform: "scale(1.04)" }, { opacity: 1, transform: "none" }], { d: 700, e: E.out });
        A.sfx(/alert\.jpg$/.test(imgs[i].src) ? "alert" : "pop");
        cur = i;
      }
      var beats = [function (A) {
        A.wipe(".chiprow > *"); A.kinetic(".title", { delay: 100, each: 26 });
        A.rise(".steps.bt li", { delay: 400, each: 70, y: 20 });
        A.go(".tv", [{ opacity: 0, transform: "translateY(60px) scale(.95)" }, { opacity: 1, transform: "none" }], { d: 1000, delay: 300, e: E.out });
        A.rise(".tv-note", { delay: 900 });
        A.later(function () { showI(0); }, 700);
      }];
      for (var i = 1; i < imgs.length; i++) (function (i) { beats.push(function () { showI(i); }); })(i);
      return beats;
    }
  });

  // ════════════════════════════════════════════════════════════
  // 5 · 학교 생활
  // ════════════════════════════════════════════════════════════
  opener({
    part: 5, art: "closing", lines: ["학교라서", "<em>있는 것</em>"],
    was: "교무실 한쪽 분실물 상자, 종이 대진표", now: "사진이 떠다니는 분실물 함, 알림이 오는 대진표",
    notes: "다섯 번째는 학교라서 있는 작은 기능들입니다. 꼭 필요한 기능만큼이나, 쓰는 즐거움이 있어야 매일 엽니다."
  });

  show({
    id: "s-lost", part: 5, label: "분실물 함", min: 1.4,
    title: "선생님은 넣고, <em>학생은 보고</em>",
    steps: [
      { t: '사진만 물 위에 뜬 듯 <b>둥둥</b>, 기울이면 그쪽으로', s: 0, r: R("lost-found", "box") },
      { t: '폰을 <b>흔들면 날짜순</b>, 또 흔들면 <b>종류별</b>, 한 번 더면 다시 둥둥', s: 1, r: R("lost-date", "head"), newf: true },
      { t: '넣을 땐 사진·종류·장소 — <b>학생 얼굴은 찍지 않게</b>', s: 2, r: R("lost-found-add", "photo") },
      { t: '학생은 <b>점심시간 칠판 띠</b>와 교실에 붙인 QR로', s: 3, r: R("lost-found-2", "note") },
      { t: '학생 화면엔 사진·「찾으러 갈 곳」만, <b>특징은 없음</b>', s: 4, r: [16, 112, 380, 680] },
      { t: '<span class="aib">AI로도</span> 사진 붙이고 「분실물로 올려 줘」 → <span class="k">함에 넣기</span>', s: 5, r: R("ai-lost", "card") }
    ],
    screens: ["lost-found", "lost-date", "lost-found-add", "lost-found-2", "found", "ai-lost"],
    notes: "분실물 함은 선생님들이 함께 보는 함입니다. 사진만 둥둥 떠다니고, 폰을 흔들 때마다 날짜순 → 종류별 → 다시 떠다님으로 정리됩니다(컴퓨터는 빈 곳 두 번 클릭). 누르면 어디서 찾았는지, 주인에게 돌려주면 「돌려줬어요」. 보관 장소는 각자 계신 교무실로 적고, 한 번 적으면 다음부터 미리 들어갑니다. 학생들은 <b>점심시간 교실 칠판 아래 분실물 띠</b>와 교실에 붙인 QR(학생용 보기 — 같은 떠다니는 함, 보기만)로 사진과 찾으러 갈 곳을 봅니다. AI에게 물건 사진을 붙이고 「분실물로 올려 줘」라고 해도 카드로 넣습니다. 로그인 없이 열리는 대신 <b>특징 칸(주인 확인용)과 선생님 이름은 싣지 않습니다</b> — 찾으러 온 학생에게 특징을 물어보고 돌려줍니다."
  });

  show({
    id: "s-life", part: 5, label: "구기대회·보건실", min: 1.2,
    title: "구기대회와 <em>보건실</em>",
    steps: [
      { t: '<b>구기대회</b>: 학년별 월드컵식 대진표', s: 0, r: R("sports", "bracket") },
      { t: '점수를 적으면 이긴 반이 저절로 다음 경기로, <b>이긴 점수는 파랑</b>', s: 0, r: R("sports", "match") },
      { t: '홈 경기 카드 + 그 교시 수업 선생님·두 반 담임께 <b>경기 알림</b>', s: 1, r: R("home-sports", "card") },
      { t: '<b>보건실 입실 알림</b>: 이름 없이 반·성별만, 오후 4시 하루 정리', s: 2, r: R("nurse", "open") }
    ],
    screens: ["sports", "home-sports", "nurse"],
    notes: "구기대회 기간에는 대진표와 경기 알림이 오고, 우승 반 담임 선생님 홈에는 축하 꽃가루가 뜹니다. 보건실 입실 알림은 학생이 보건실에 들어오면 1분 안에 담임과 그 교시 교과 선생님께 반·성별만 알립니다."
  });

  // ════════════════════════════════════════════════════════════
  // 6 · 우리 학교에서도 하려면 — 먼저 정한 원칙 · 필요한 세 가지 · 매일 고치는 방식 · 정리
  // ════════════════════════════════════════════════════════════
  opener({
    part: 6, art: "basics", lines: ["우리 학교에서도", "<em>하려면</em>"],
    was: "좋아 보이지만, 무엇부터 해야 할지 막막", now: "먼저 정한 원칙 · 필요한 세 가지 · 매일 고치는 방식",
    notes: "여기서부터는 “우리 학교에서도 해 볼 수 있을까?”에 답합니다. 세 가지를 차례로 보여 드립니다. <b>먼저 정한 원칙</b>, 그리고 <b>필요한 것 세 가지</b>, 마지막으로 <b>어떻게 고쳐 왔는지</b>. 끝에 여섯 가지로 정리합니다."
  });

  var PRINC = [
    ["사생활", "자리를 비우는 까닭은 본인만", ["출장·연수 사유는 <b>그 선생님 화면에만</b>", "다른 선생님 화면엔 <b>이름 없이 과목만</b>"]],
    ["보안", "교직원만, 필요한 만큼만", ["학교가 만든 계정, <b>활동 중인 교직원만</b> 읽기", "교실 칠판마다 <b>다른 열쇠</b>"]],
    ["AI", "AI는 초안까지", ["보내기·등록은 <b>늘 선생님이</b> 누름", "붙인 파일 원문은 <b>저장하지 않음</b>"]],
    ["읽기 쉬움", "누구나 같은 정보를", ["휴대폰 먼저, 글자는 <b>네 단계로만</b>", "흐린 글씨도 <b>또렷하게</b>(대비 4.8 : 1 이상)"]]
  ];
  D.add({
    id: "principles", part: 6, label: "먼저 정한 네 가지", kind: "light", min: 1.5,
    tour: { title: "먼저 정한 네 가지 — 누가 무엇을 보는지부터", html: '<div class="t-grid">' + PRINC.map(function (p) { return '<div class="t-box"><b>' + p[0] + " · " + p[1] + "</b><ul>" + p[2].map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div>"; }).join("") + "</div>" },
    notes: "기능보다 먼저 <b>누가 무엇을 보는지</b>를 정했습니다. <b>사생활</b> — 출장·연수 같은 사유는 그 선생님 본인의 일정·홈에만, 다른 선생님 화면에는 이름 없이 과목만. 넵 마감도 보낸 분·받는 분에게만, 조직표는 연락처를 읽지 않습니다. <b>보안</b> — 학교가 만든 계정만, 데이터베이스가 활동 중인 교직원만 읽게 막고, 로그인 틀린 횟수도 제한합니다. <b>AI</b> — 초안까지만, 누르는 건 사람. 붙인 파일 원문은 저장하지 않고 답에 바깥 링크를 그리지 않습니다. <b>읽기 쉬움</b> — 휴대폰 먼저, 글자 크기와 대비 기준을 정해 지킵니다. 중요한 점은 이 원칙을 <b>화면에서만이 아니라 데이터베이스 권한에서도</b> 함께 지킨다는 것입니다.",
    html: chips([{ t: "우리 학교에서도" }, { t: "원칙", c: "ghost" }]) + '<h2 class="title">먼저 정한 <em>네 가지</em></h2>' +
      '<p class="abs lead6">기능보다 먼저 <b>「누가 무엇을 보는지」</b>를 정했습니다 — 화면과 데이터베이스가 함께 지킵니다.</p>' +
      '<div class="abs pr">' + PRINC.map(function (p, i) { return '<div class="card c"><span class="tg">' + p[0] + '</span><span class="no">0' + (i + 1) + "</span><h3>" + p[1] + "</h3><ul>" + p[2].map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul></div>"; }).join("") + "</div>",
    build: function (el, A) {
      return [function (A) {
        A.wipe(".chiprow > *", { each: 110 });
        A.kinetic(".title", { delay: 100, each: 26 });
        A.rise(".lead6", { delay: 400, y: 16 });
        A.rise(".pr .c", { delay: 600, each: 150, y: 40 });
        A.pop(".pr .no", { delay: 750, each: 150, s: 0.5, snd: false });
        A.rise(".pr li", { delay: 1000, each: 60, y: 12 });
      }];
    }
  });

  var NEED = [
    ["학교 계정과 웹앱", "앱 장터 없이 <b>주소로</b> 열고, 홈 화면에 설치하면 앱처럼", ["교직원 계정", "푸시 알림", "교실 칠판 화면"]],
    ["학교 자료 연결", "새로 적게 하지 않고 <b>이미 있는 자료를 읽어</b> 옵니다", ["구글 캘린더(학사일정)", "공유 드라이브(읽기만)", "주간소식 PDF", "NEIS 급식·날씨"]],
    ["AI", "매일 일은 가벼운 모델, 깊게 생각하기는 <b>하루 5번</b>으로 비용 관리", ["하루 질문 한도", "초안까지만", "학생 정보 넣지 않기"]]
  ];
  D.add({
    id: "stack", part: 6, label: "필요한 것은 세 가지", kind: "light", min: 1.3,
    tour: { title: "필요한 것은 세 가지", html: '<div class="t-grid">' + NEED.map(function (n, i) { return '<div class="t-box"><b>' + (i + 1) + ". " + n[0] + "</b><span>" + n[1] + "</span></div>"; }).join("") + '</div><p class="t-note">만든 재료: Next.js 웹앱 · Vercel(서울) · Supabase(데이터베이스·로그인·행 단위 권한) · Claude AI · 한글(HWPX) 서식 채우기</p>' },
    notes: "준비물은 세 가지입니다. ① <b>학교 계정과 웹앱</b> — 앱 장터에 올리지 않고 주소로 엽니다. 홈 화면에 설치하면 앱처럼 알림도 오고, 교실 칠판도 같은 주소의 화면을 띄웁니다. ② <b>학교 자료 연결</b> — 선생님들께 새로 적게 하지 않고, 학사일정은 구글 캘린더에서, 문서는 공유 드라이브에서 <b>읽기만</b> 해서, 급식·날씨는 공공 데이터에서 가져옵니다. ③ <b>AI</b> — 매일 도는 일은 가벼운 모델로, 비싼 모델은 하루 횟수를 정해 비용을 관리합니다. 아래 작은 글씨는 실제로 쓴 재료입니다 — 개발을 맡을 분께 그대로 전해 주시면 됩니다.",
    html: chips([{ t: "우리 학교에서도" }, { t: "준비물", c: "ghost" }]) + '<h2 class="title">필요한 것은 <em>세 가지</em></h2>' +
      '<p class="abs lead6">새 프로그램을 깔지 않습니다 — <b>주소로 여는 웹앱 하나</b>가 학교에 이미 있는 자료를 읽어 옵니다.</p>' +
      '<div class="abs need">' + NEED.map(function (n, i) { return '<div class="card c"><span class="nn">' + (i + 1) + "</span><h3>" + n[0] + "</h3><p>" + n[1] + '</p><div class="ch">' + n[2].map(function (x) { return "<span>" + x + "</span>"; }).join("") + "</div></div>"; }).join("") + '<i class="plus" style="left:512px">+</i><i class="plus" style="left:1096px">+</i></div>' +
      '<p class="abs need-foot"><b>만든 재료</b><span>Next.js 웹앱 · Vercel(서울)</span><span>Supabase — 데이터베이스·로그인·행 단위 권한</span><span>Claude AI</span><span>한글(HWPX) 서식 채우기</span></p>',
    build: function (el, A) {
      return [function (A) {
        A.wipe(".chiprow > *", { each: 110 });
        A.kinetic(".title", { delay: 100, each: 26 });
        A.rise(".lead6", { delay: 400, y: 16 });
        A.rise(".need .c", { delay: 600, each: 200, y: 40, snd: "pluck", v: 0.06 });
        A.pop(".need .nn", { delay: 750, each: 200, s: 0.4, snd: false });
        A.pop(".need .plus", { delay: 900, each: 200, s: 0.3, snd: false });
        A.rise(".need .ch span", { delay: 1100, each: 40, y: 10 });
        A.wipe(".need-foot", { delay: 1700 });
      }];
    }
  });

  var LESSONS = [
    ["저녁에 쓴 나에게 메모가 다음 날 아침에야 와요", "나에게 보낸 메모는 바로 도착", "10월 18일"],
    ["다시 보려고 눌렀더니 알림이 사라졌어요", "요약 알림은 「확인」을 눌러야만 지워지게", "10월 16일"],
    ["6교시 수업교체가 공강에 반영이 안 돼요", "빈 교실·공강을 그날 실제 시간표로 계산", "10월 16일"],
    ["같은 분께 받은 넵은 대화방처럼 보고 싶어요", "받은 넵을 보낸 선생님별 방으로", "10월 18일"],
    ["내일 출장인데 홈에 「수업 3시간」이래요", "내 출장·연수를 홈·일정 맨 앞에(나에게만)", "10월 12일"],
    ["AI한테 조건을 일일이 주고 있어요", "묻기 전에 알아서 채우고, 초안부터", "10월 14일"]
  ];
  D.add({
    id: "lessons", part: 6, label: "만드는 방식 · 말 한마디가 그날", kind: "light", min: 1.4, tour: { title: "만드는 방식 — 쓰면서 나온 말 한마디가 그날 바뀝니다", html: '<div class="t-grid">' + LESSONS.map(function (l) { return '<div class="t-box"><span class="t-q">' + l[0] + "</span><b>→ " + l[1] + "</b><span>" + l[2] + "</span></div>"; }).join("") + "</div>" },
    notes: "세 번째는 <b>만드는 방식</b>입니다. 쓰면서 실제로 나온 말과, 그래서 바뀐 것입니다. 날짜를 보시면 대개 <b>그날이나 다음 날</b> 바뀌었습니다. 처음부터 완성된 앱을 만들기보다, <b>작게 내놓고 쓰는 사람의 불편을 바로 고치는 것</b>이 쓰는 사람을 늘렸습니다.",
    html: chips([{ t: "우리 학교에서도" }, { t: "만드는 방식", c: "ghost" }]) + '<h2 class="title">쓰면서 나온 말 한마디가 <em>그날</em> 바뀝니다</h2>' +
      '<p class="abs lead6">처음부터 다 만들기보다 <b>작게 내놓고, 불편을 바로 고치기</b> — 그것이 쓰는 사람을 늘렸습니다.</p>' +
      '<div class="abs ls">' + LESSONS.map(function (l) { return '<div class="card c"><q>' + l[0] + '</q><span class="ar">→ ' + l[1] + "</span><small>" + l[2] + "</small></div>"; }).join("") + "</div>",
    build: function (el, A) {
      return [function (A) {
        A.wipe(".chiprow > *", { each: 110 });
        A.kinetic(".title", { delay: 100, each: 22 });
        A.rise(".lead6", { delay: 400, y: 16 });
        A.pop(".ls .c", { delay: 600, each: 130, s: 0.86 });
      }];
    }
  });

  var START = [
    ["매일 여는 것부터", "아침 알림·시간표·급식처럼 하루에 몇 번 여는 것을 먼저. 매일 열어야 다른 기능도 씁니다."],
    ["있는 자료를 읽어 오기", "학사일정(구글 캘린더)·공유 드라이브·주간소식을 새로 적게 하지 말고 읽어 옵니다."],
    ["원칙을 먼저 정하기", "사유·연락처·학생 정보를 누가 보는지 정하고, 화면과 데이터베이스가 함께 지키게."],
    ["AI에게 말로, 초안까지", "메뉴를 늘리기보다 말로 부탁하는 길을. 보내기·등록·확정은 늘 사람이 — 그래야 안심하고 맡깁니다."],
    ["의견 창구를 짧게", "말 한마디가 그날 반영되면 쓰는 사람이 늘어납니다."],
    ["연수는 휴대폰으로 함께", "따라하기 안내와 발표 다시 보기를 남겨, 나중에 혼자서도."]
  ];
  D.add({
    id: "start", part: 6, label: "정리 · 시작은 여섯 가지", kind: "light", min: 1.3, tour: { title: "정리하면, 시작은 여섯 가지", html: '<div class="t-grid">' + START.map(function (s, i) { return '<div class="t-box"><b>' + (i + 1) + ". " + s[0] + "</b><span>" + s[1] + "</span></div>"; }).join("") + "</div>" },
    notes: "6부를 정리하면, 다른 학교에서 시작하신다면 이 여섯 가지를 권합니다. 특히 <b>매일 여는 것부터</b>와 <b>원칙을 먼저</b>가 중요했습니다. 알림을 켠 선생님이 늘면서 넵·서명 같은 기능도 자연스럽게 쓰이기 시작했습니다.",
    html: chips([{ t: "우리 학교에서도" }, { t: "정리", c: "ghost" }]) + '<h2 class="title">정리하면, 시작은 <em>여섯 가지</em></h2>' +
      '<div class="abs stt">' + START.map(function (s, i) { return '<div class="card r"><span class="n">' + (i + 1) + "</span><div><h3>" + s[0] + "</h3><p>" + s[1] + "</p></div></div>"; }).join("") + "</div>",
    build: function (el, A) {
      return [function (A) {
        A.wipe(".chiprow > *");
        A.kinetic(".title", { delay: 100, each: 22 });
        A.rise(".stt .r", { delay: 450, each: 110, y: 30, snd: "pluck", v: 0.06 });
        A.pop(".stt .n", { delay: 600, each: 110, s: 0.3, snd: false });
      }];
    }
  });

  // ════════════════════════════════════════════════════════════
  // 7 · 마무리
  // ════════════════════════════════════════════════════════════
  opener({
    part: 7, art: "cover", lines: ["내일은,", "<em>말로 부탁</em>해 보세요"],
    was: "메뉴를 찾아 헤매기", now: "열 문장 가운데 하나를 AI에게 말해 보기",
    notes: "마지막입니다. 오늘 본 것을 한 장으로 가져가실 수 있게, 선생님들이 실제로 하는 부탁 열 문장으로 모았습니다."
  });

  D.add({
    id: "s-asks", part: 7, label: "이렇게 부탁합니다", kind: "light", min: 1.3, trans: "push",
    notes: "기억하실 한 장입니다. 선생님들이 실제로 AI에게 하는 부탁을 열 문장으로 모았습니다. 위 두 줄은 묻기, 나머지는 확인 카드가 되는 부탁입니다. 메뉴 이름을 몰라도 이 문장들로 시작할 수 있다는 것이 이 앱을 쓰는 사람을 늘린 가장 큰 이유였습니다.",
    html: chips([{ t: "마무리", c: "ai" }, { t: "기억하실 한 장", c: "ghost" }]) + '<h2 class="title">이렇게 <em>말로 부탁</em>합니다 — 열 문장</h2>' +
      '<div class="abs ten">' + (window.ASKS || []).map(function (a, i) { return '<div class="r"><span class="n">' + String(i + 1).padStart(2, "0") + '</span><span class="s">「' + a.say + '」</span><span class="c">' + a.got + "</span></div>"; }).join("") + "</div>" +
      '<p class="abs ten-foot"><span>' + (window.ASKS_MORE || "") + '</span><span>·</span><span><b>누르기 전까지는 초안</b> — 등록·보내기·요청은 선생님이</span></p>',
    build: function (el, A) {
      return [function (A) {
        A.wipe(".chiprow > *", { each: 120 });
        A.kinetic(".title", { delay: 100, each: 24 });
        A.rise(".ten .r", { delay: 500, each: 90, y: 24, snd: "pluck", v: 0.06 });
        A.pop(".ten .c", { delay: 800, each: 90, s: 0.7, snd: false });
        A.wipe(".ten-foot", { delay: 1600 });
      }];
    }
  });

  // 다른 학교 선생님이 직접 써 보는 체험판(별도 배포 mjms-demo, 지어낸 학교). 비밀번호는 저장소에 두지 않는다 —
  // 발표 때 intro.html?pw=… 로 열면 화면에 뜨고, 아니면 「발표자가 알려 드립니다」.
  var DEMO_PW = (new URLSearchParams(location.search).get("pw") || "").replace(/[^0-9A-Za-z_-]/g, "").slice(0, 24);
  D.add({
    id: "s-try", part: 7, label: "직접 써 보세요(체험판)", kind: "light", min: 1.5, trans: "push",
    notes: "오늘 보신 앱을 직접 써 보실 수 있게 <b>체험판</b>을 열어 두었습니다. 우리 학교와 완전히 떨어진 따로 된 앱이고, 학교·선생님·학생 이름은 모두 지어낸 것입니다. QR을 찍으면 <b>체험 안내</b>가 열립니다 — 맨 위 [체험판 열기], 그 아래 발표 순서대로 미션 여덟 가지. 명단에서 아무 선생님이나 고르시되 옆 분과 겹치지 않게 — 옆 분이 짝꿍이 되어 서로 넵을 주고받습니다. 짝꿍 이름을 체험 안내에 적어 두면 미션 문장에 들어갑니다. 체험판의 넵은 저녁·주말에도 바로 갑니다(실제 앱은 근무 밖에 보낸 넵을 다음 근무일 아침에 전합니다). 예시가 가장 많은 홍길동(2학년 3반 담임)은 발표자가 시연에 쓰니 고르지 말아 달라고 말씀해 주세요. 노트북이 있으면 맨 위 띠의 [교실 칠판 띄우기]로 칠판을 띄우고 휴대폰에서 보내 보세요. AI는 한 분에 하루 10번, 매일 밤 3시에 처음 상태로 돌아가며 11월 22일까지 열어 둡니다.",
    html: chips([{ t: "마무리", c: "ai" }, { t: "체험판", c: "ghost" }]) + '<h2 class="title">직접 <em>써 보세요</em> — 체험판</h2>' +
      '<div class="abs try">' +
      '<div class="r card"><span class="n">1</span><div><h3>휴대폰으로 QR → 체험 안내</h3><p>맨 위 <b>[체험판 열기]</b> · 체험판 주소는 <b>mjms-demo.vercel.app</b></p></div></div>' +
      '<div class="r card"><span class="n">2</span><div><h3>명단에서 아무 선생님이나</h3><p>옆 분과 겹치지 않게 — 옆 분이 짝꿍, 서로 넵을 주고받습니다 · <b>홍길동</b>은 발표자가 씁니다</p></div></div>' +
      '<div class="r card"><span class="n">3</span><div><h3>비밀번호' + (DEMO_PW ? ' <span class="pw">' + DEMO_PW + "</span>" : "") + '</h3><p>' + (DEMO_PW ? "모든 계정이 같은 비밀번호입니다" : "발표자가 알려 드립니다 · 모든 계정이 같은 비밀번호") + '</p></div></div>' +
      '<div class="r card"><span class="n">4</span><div><h3>미션 여덟 가지, 발표 순서대로</h3><p>AI에게 묻기 · 짝꿍과 넵 · 교체안 · 교실 칠판(노트북에 <b>[교실 칠판 띄우기]</b>) · 분실물 함</p></div></div>' +
      "</div>" +
      '<div class="abs try-qr"><img src="img/qr-visit.svg" alt="체험 안내 QR 코드"><p class="lbl">체험 안내 · 미션</p><small>체험판 열기 · 미션 여덟 가지 · 발표 다시 보기</small></div>' +
      '<p class="abs try-foot"><span>11월 22일까지</span><span>매일 밤 3시에 처음 상태로</span><span>학교·선생님·학생 이름은 모두 지어낸 것</span><span>AI는 한 분에 하루 10번</span><span>우리 학교 앱과 완전히 떨어진 따로 된 앱</span></p>',
    build: function (el, A) {
      return [function (A) {
        A.kinetic(".title", { delay: 100, each: 24 });
        A.rise(".try .r", { delay: 400, each: 140, y: 26, snd: "pluck", v: 0.06 });
        A.go(".try-qr", [{ transform: "perspective(1200px) translateX(160px) rotateY(-30deg)", opacity: 0 }, { transform: "none", opacity: 1 }], { d: 1100, delay: 600, e: E.out });
        A.wipe(".try-foot", { delay: 1300 });
      }];
    }
  });

  D.add({
    id: "closing", part: 7, label: "고맙습니다 · 질문", kind: "dark", min: 3, trans: "whip", bgm: "end",
    notes: "한 문장으로 마무리합니다 — <b>메뉴를 몰라도, AI에게 말하면 카드로. 누르는 건 선생님.</b> QR 하나에 체험판·미션·발표 다시 보기, 그리고 학교에 가져가실 「우리 학교에서 시작한다면」 한 장이 모두 있습니다. 질문을 받겠습니다.",
    html: darkBg("closing") +
      '<h2 class="abs cl-title"><span class="ln">고맙습니다.</span><span class="ln"><em>질문</em> 받겠습니다</span></h2>' +
      '<p class="abs cl-lead">메뉴를 몰라도, <b>말하면 카드로 — 누르는 건 선생님.</b><br>체험판·미션·발표 다시 보기는 QR 하나로.<br>화면 속 학교·이름·내용은 모두 예시입니다.</p>' +
      '<div class="abs cl-qr"><img src="img/qr-visit.svg" alt="체험 안내 QR 코드"><p>체험 · 다시 보기</p><small>체험판 · 미션 · 우리 학교에서 시작한다면</small></div>',
    build: function (el, A) {
      return [function (A) {
        A.go(".art-wrap img", [{ transform: "scale(1.3) translate(2%,2%)", filter: "brightness(.35)" }, { transform: "scale(1.1)", filter: "brightness(1)" }], { d: 2000, e: E.out });
        A.kenburns(".art-wrap img", { from: "scale(1.1)", to: "scale(1.03) translate(-1.2%, -0.8%)", d: 45000, delay: 2000 });
        var t = A.kinetic(".cl-title", { delay: 400, each: 40, punch: 2.2 });
        A.rise(".cl-lead", { delay: t });
        A.go(".cl-qr", [{ transform: "perspective(1200px) translateX(220px) rotateY(-38deg)", opacity: 0 }, { transform: "perspective(1200px) translateX(0px) rotateY(0deg)", opacity: 1 }], { d: 1300, delay: 700, e: E.out });
      }];
    }
  });


  // ════════════════════════════════════════════════════════════
  // 체험판과 잇기(missions.js): 체험 미션이 있는 장면 오른쪽 위에 「체험판 미션 N」, 체험판에 없는 장면은 회색 표시.
  // 둘러보기(tour.html)는 d.tryTag를 카드 머리에 붙인다.
  // ════════════════════════════════════════════════════════════
  var TRY = {};
  (window.MISSIONS || []).forEach(function (m) { (m.scenes || []).forEach(function (id) { (TRY[id] = TRY[id] || []).push(m.n); }); });
  var NOT_IN_DEMO = { "s-life": "체험판에는 없어요" };
  ALL.forEach(function (d) {
    var t = TRY[d.id] ? "체험판 미션 " + TRY[d.id].join("·") : NOT_IN_DEMO[d.id];
    if (!t || typeof d.html !== "string") return;
    d.tryTag = { t: t, no: !TRY[d.id] };
    // 장면 맨 위 칩 줄 끝에 하나 더(칩 줄이 없는 장면은 붙이지 않는다)
    var at = d.html.indexOf('<div class="chiprow">'), end = at < 0 ? -1 : d.html.indexOf("</div>", at);
    if (end > 0) d.html = d.html.slice(0, end) + '<span class="chip mission' + (TRY[d.id] ? "" : " no") + '">' + t + "</span>" + d.html.slice(end);
  });
  D.add = add0;

})();

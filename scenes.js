/* AI 교무실 사용연수 — 장면 데이터
 * 장면마다 html(무대 위 요소)과 build(박자 목록)를 둔다. 박자 0은 들어올 때, 그다음은 넘길 때마다.
 * 실제 앱 캡처는 img/*.jpg (412×864 화면 기준 좌표, 2배 해상도). 캡처가 없는 단계(브라우저 메뉴·시스템 창)는 모형(.mk)으로 그린다.
 * 발표 멘트(notes)는 N(노트)·P(발표자 창)에서 보인다.
 */
(function () {
  "use strict";
  var D = window.DECK, E = D.E, h = D.h;

  D.parts([
    { n: 0, name: "시작", color: "#8fd0ff" },
    { n: 1, name: "기본 설정", color: "#6fb6ea" },
    { n: 2, name: "시간표·진도표", color: "#7fc8a9" },
    { n: 3, name: "넵", color: "#9fb3f0" },
    { n: 4, name: "디지털 서명", color: "#f5a524", isNew: true },
    { n: 5, name: "AI에게 부탁하기", color: "#b49cf2" },
    { n: 6, name: "세특 도우미", color: "#e59a7a" },
    { n: 7, name: "전자칠판·자료실", color: "#79c6d9" },
    { n: 8, name: "마무리", color: "#8fd0ff" }
  ]);

  // ── 장면 전용 스타일 ──
  var css = document.createElement("style");
  css.textContent = `
  .cv-brand{left:140px;top:116px;display:flex;gap:22px;align-items:center}
  .cv-brand img{width:88px;height:88px;border-radius:24px;background:#fff;padding:12px}
  .cv-brand small{display:block;font:600 18px var(--mono);letter-spacing:.26em;color:var(--glow)}
  .cv-brand b{font:800 36px var(--display);letter-spacing:-.01em}
  .cv-kicker{left:140px;top:300px;font:700 30px var(--body);color:var(--glow);letter-spacing:.05em}
  .cv-title{left:130px;top:352px;font:900 156px/1.06 var(--display);letter-spacing:-.045em;color:#fff}
  .cv-title em{color:var(--glow)}
  .cv-lead{left:140px;top:730px;font:500 34px/1.6 var(--body);color:#cfe0f3}
  .cv-lead b{color:#fff}
  .cv-qr{right:150px;top:250px;width:430px;padding:34px 34px 30px;border-radius:32px;background:#fff;color:var(--ink);text-align:center;box-shadow:0 40px 90px rgba(0,0,0,.45)}
  .cv-qr img{width:100%;display:block}
  .cv-qr p{font:600 25px var(--mono);margin-top:14px}
  .cv-qr small{font:500 20px var(--body);color:var(--muted)}

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
  .hk-stat{left:0;right:0;top:250px;text-align:center}
  .hk-stat .cap{font:700 34px var(--body);color:#bcd2ea;letter-spacing:.02em}
  .hk-stat .num{font:600 300px/1 var(--mono);letter-spacing:-.04em;color:#fff;margin-top:24px;display:flex;justify-content:center;align-items:baseline;gap:30px}
  .hk-stat .num em{color:var(--glow)}
  .hk-stat .num small{font-size:120px;color:rgba(232,238,246,.5)}
  .hk-stat .src{font:500 20px var(--mono);color:rgba(232,238,246,.45);margin-top:18px}
  .hk-goal{left:0;right:0;top:800px;text-align:center;font:900 76px var(--display);letter-spacing:-.03em}
  .hk-goal em{color:var(--glow)}

  .ag{left:120px;top:300px;width:1680px;display:grid;gap:10px}
  .ag .r{display:grid;grid-template-columns:76px 330px 1fr 380px;align-items:center;gap:22px;padding:16px 26px;border-radius:18px;background:var(--surface);border:1px solid var(--line)}
  .ag .n{font:600 30px var(--mono);color:var(--brand)}
  .ag .nm{font:800 32px var(--display);letter-spacing:-.02em;display:flex;gap:12px;align-items:center}
  .ag .ds{font:500 23px/1.4 var(--body);color:var(--muted)}
  .ag .tm{display:flex;align-items:center;gap:14px}
  .ag .tm i{height:14px;border-radius:7px;background:var(--brand);transform-origin:left;display:block}
  .ag .tm span{font:600 22px var(--mono);color:var(--ink);white-space:nowrap}
  .ag .r.newr{border-color:var(--new);box-shadow:0 0 0 3px rgba(245,165,36,.18)}
  .ag .r.newr .tm i{background:var(--new)}
  .ag .r.qa{background:transparent;border-style:dashed}
  .ag-total{right:120px;top:186px;font:600 34px var(--mono);color:var(--muted)}
  .ag-total b{font-size:64px;color:var(--ink)}

  .nf{left:120px;top:330px;width:1680px;display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
  .nf .c{padding:30px 32px 32px;min-height:250px;display:flex;flex-direction:column;gap:12px;position:relative;overflow:hidden}
  .nf .where{align-self:flex-start;font:700 17px var(--mono);letter-spacing:.08em;background:var(--new);color:var(--new-ink);border-radius:6px;padding:3px 10px}
  .nf h3{font:800 38px/1.2 var(--display);letter-spacing:-.025em}
  .nf p{font:500 24px/1.5 var(--body);color:var(--muted)}
  .nf p b{color:var(--ink)}

  .nn{top:330px;width:350px;min-height:260px}
  .who{left:120px;top:660px;width:1110px;padding:30px 34px;display:grid;gap:16px}
  .who .r{display:grid;grid-template-columns:110px 1fr;gap:20px;align-items:center;font:500 28px/1.45 var(--body)}
  .who .r span{justify-self:start;padding:6px 18px;border-radius:999px;background:var(--warn-tint);color:var(--warn);font:700 22px var(--body)}
  .who .r b{color:var(--ink)}
  .who .note{font:500 22px/1.5 var(--body);color:var(--muted);border-top:1px solid var(--line);padding-top:14px}

  .ck{left:120px;top:330px;width:760px;display:grid;gap:18px}
  .ck .r{display:flex;align-items:center;gap:26px;padding:24px 28px;font:700 34px var(--body)}
  .ck .bx{width:56px;height:56px;border-radius:14px;border:3px solid var(--line);display:grid;place-items:center;flex:none;background:var(--surface)}
  .ck .bx svg{width:34px;height:34px;stroke:#fff;stroke-width:4;fill:none;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:40;stroke-dashoffset:40}
  .ck .r.on .bx{background:var(--ok);border-color:var(--ok)}
  .fix{left:960px;top:330px;width:840px;padding:34px 38px;display:grid;gap:22px}
  .fix h3{font:800 32px var(--display)}
  .fix .q{display:grid;gap:4px}
  .fix .q b{font:700 25px var(--body)}
  .fix .q span{font:500 23px/1.45 var(--body);color:var(--muted)}

  .nepts{left:120px;top:300px}
  .side{top:420px;width:520px;padding:30px 34px}
  .side .who2{font:700 20px var(--body);color:var(--muted);letter-spacing:.06em;margin-bottom:10px}
  .side h3{font:800 34px var(--display);margin-bottom:6px}
  .side p{font:500 23px var(--body);color:var(--muted)}
  .meter{margin-top:22px}
  .meter .lb{display:flex;justify-content:space-between;font:600 24px var(--mono)}
  .meter .tr{height:14px;border-radius:7px;background:var(--line);margin-top:10px;overflow:hidden}
  .meter .tr i{display:block;height:100%;background:var(--brand);transform-origin:left}
  .lane{left:660px;top:568px;width:600px;height:4px;background:repeating-linear-gradient(90deg,var(--faint) 0 14px,transparent 14px 26px)}
  .gate{left:900px;top:470px;width:130px;height:200px;border-radius:20px;background:var(--warn-tint);border:3px solid var(--warn);display:grid;place-items:center;text-align:center;font:800 24px/1.3 var(--body);color:var(--warn)}
  .gate.open{background:var(--ok-tint);border-color:var(--ok);color:var(--ok)}
  .env{left:640px;top:540px;width:80px;height:58px;border-radius:10px;background:var(--brand);box-shadow:0 12px 26px rgba(41,92,158,.35)}
  .env::before{content:"";position:absolute;inset:0;border-radius:10px;background:linear-gradient(155deg,transparent 48%,rgba(255,255,255,.35) 50%,transparent 52%),linear-gradient(25deg,transparent 48%,rgba(255,255,255,.35) 50%,transparent 52%)}
  .rbtn{margin-top:22px;height:68px;border-radius:16px;background:var(--brand);color:#fff;display:grid;place-items:center;font:800 28px var(--body);position:relative;overflow:hidden}
  .rbtn .dn{position:absolute;inset:0;display:grid;place-items:center;background:var(--ok);opacity:0}

  .hub{left:120px;top:330px;width:560px;padding:34px;display:grid;gap:18px}
  .hub h3{font:800 34px var(--display);display:flex;gap:12px;align-items:center}
  .hub .pad{position:relative;height:170px;border-radius:18px;border:2px dashed var(--line);background:repeating-conic-gradient(#f3f6fa 0% 25%,#fff 0% 50%) 0 0/28px 28px}
  .hub .pad .pen{left:60px;top:40px;font-size:96px}
  .hub .pad .stamp-mk{right:44px;top:30px;width:110px;height:110px;font-size:30px}
  .hub p{font:500 22px/1.5 var(--body);color:var(--muted)}
  .dest{left:1000px;width:800px;padding:24px 30px;display:grid;grid-template-columns:1fr auto;gap:6px 20px;align-items:center}
  .dest h3{font:800 30px var(--display)}
  .dest p{grid-column:1;font:500 22px/1.45 var(--body);color:var(--muted)}
  .dest .tapb{grid-row:1/3;grid-column:2;padding:12px 18px;border-radius:14px;background:var(--brand);color:#fff;font:700 20px var(--body);white-space:nowrap}
  .curve{position:absolute;left:680px;top:330px;width:320px;height:560px;overflow:visible}
  .curve path{fill:none;stroke:var(--brand);stroke-width:4;stroke-linecap:round;stroke-dasharray:100 120;stroke-dashoffset:101}

  .pdf{left:150px;top:250px;width:760px;height:780px;background:#fff;border-radius:6px;box-shadow:0 40px 90px rgba(14,28,48,.35);padding:56px 60px;z-index:20;transform:rotate(-2.5deg);color:#111}
  .pdf h4{font:800 34px var(--display);text-align:center;letter-spacing:.1em;margin-bottom:26px}
  .pdf table{width:100%;border-collapse:collapse;font:500 19px var(--body)}
  .pdf td,.pdf th{border:1.5px solid #333;padding:9px 12px;height:58px;text-align:center}
  .pdf th{background:#eef1f5;font-weight:700}
  .pdf .info td{height:46px;text-align:left}
  .pdf .info th{width:120px}
  .pdf .sig{position:relative}
  .pdf .sig .pen{position:static;font-size:42px;display:inline-block}
  .pdf .foot{display:flex;justify-content:space-between;font:500 15px var(--body);color:#666;margin-top:16px}
  .pdf .ex{position:absolute;right:36px;top:30px;font:800 18px var(--mono);color:var(--warn);border:2px solid var(--warn);border-radius:6px;padding:2px 10px;transform:rotate(8deg)}

  .doc{position:absolute;left:150px;top:140px;width:620px;height:800px;background:#fff;border-radius:6px;box-shadow:0 40px 90px rgba(14,28,48,.3);padding:54px 56px;color:#111;font:500 21px/1.7 var(--body);z-index:7}
  .doc h4{font:800 32px var(--display);text-align:center;margin-bottom:24px;letter-spacing:.06em}
  .doc .ln2{height:14px;border-radius:7px;background:#eceff3;margin:12px 0}
  .doc .sl{display:flex;justify-content:flex-end;align-items:center;gap:10px;margin-top:22px;font-size:23px}
  .doc .mk2{position:relative;display:inline-grid;place-items:center;min-width:120px;height:56px}
  .doc .mk2 .t{font-weight:700}
  .doc .mk2 .pen{position:absolute;left:50%;top:50%;transform:translate(-50%,-52%);font-size:46px;opacity:0;white-space:nowrap}
  .doc .mk2 .rg{position:absolute;inset:-4px -8px;border:3px solid var(--new);border-radius:10px;opacity:0}
  .doc .who3{position:absolute;left:100%;margin-left:14px;top:50%;transform:translateY(-50%);white-space:nowrap;font:700 16px var(--body);background:var(--new);color:var(--new-ink);border-radius:999px;padding:4px 12px;opacity:0}
  .doc .done{position:absolute;left:40px;right:40px;bottom:40px;padding:16px 20px;border-radius:14px;background:var(--ok-tint);color:var(--ok);font:700 22px var(--body);display:flex;justify-content:space-between;opacity:0}

  .askc{top:320px;width:520px;padding:34px;display:flex;flex-direction:column;gap:14px;min-height:470px}
  .askc .sn{font:600 26px var(--mono);color:var(--brand)}
  .askc h3{font:800 42px var(--display)}
  .askc p{font:500 25px/1.5 var(--body);color:var(--muted)}
  .askc .chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:6px}
  .askc .chips span{padding:8px 16px;border-radius:999px;background:var(--brand-tint);color:var(--brand-deep);font:600 20px var(--body)}
  .askc.confirm{border-color:var(--brand);box-shadow:0 0 0 3px rgba(41,92,158,.14)}
  .aibar{left:120px;top:840px;display:flex;align-items:center;gap:22px}
  .aibar .strip{width:412px;height:96px;border-radius:18px;overflow:hidden;background:url(img/ai.jpg) 0 -768px/412px 864px no-repeat;box-shadow:0 14px 34px rgba(14,28,48,.15);transform:scale(1.25);transform-origin:left center}
  .aibar p{font:600 26px var(--body);margin-left:110px}

  .fl{top:360px;width:296px;min-height:300px;padding:26px 24px}
  .fl h3{font-size:30px}
  .fl p{font-size:22px}
  .fl .pen{position:static;display:block;font-size:46px;margin-top:10px;opacity:0;color:var(--brand-deep)}

  .dev{left:120px;top:340px;width:760px;padding:34px;display:grid;gap:16px}
  .dev .hd{font:700 22px var(--body);color:var(--muted);letter-spacing:.06em}
  .dev .it{display:grid;grid-template-columns:1fr auto;align-items:center;gap:16px;padding:20px 24px;border-radius:16px;background:var(--paper);font:700 30px var(--body)}
  .dev .it small{font:500 21px var(--body);color:var(--muted)}
  .dev .it.lock{background:var(--ok-tint)}
  .dev .it.lock small{color:var(--ok);font-weight:700}
  .cloud{left:1240px;top:400px;width:560px;padding:34px;display:grid;gap:10px}
  .cloud b{font:800 34px var(--display)}
  .cloud span{font:500 23px/1.5 var(--body);color:var(--muted)}
  .pkt{position:absolute;padding:12px 22px;border-radius:999px;font:700 22px var(--body);color:#fff;background:var(--brand);box-shadow:0 12px 26px rgba(41,92,158,.3);z-index:5}
  .pkt.back{background:var(--ok)}
  .wire{left:880px;top:560px;width:360px;height:4px;background:repeating-linear-gradient(90deg,var(--faint) 0 14px,transparent 14px 26px)}

  .cl-done{left:140px;top:560px;width:1100px;display:grid;grid-template-columns:1fr 1fr;gap:14px 40px}
  .cl-done div{display:flex;align-items:center;gap:16px;font:600 29px var(--body);color:#e8eef6}
  .cl-done i{width:38px;height:38px;border-radius:10px;background:var(--glow);display:grid;place-items:center;flex:none}
  .cl-done i svg{width:24px;height:24px;stroke:var(--night);stroke-width:4;fill:none;stroke-linecap:round;stroke-linejoin:round}
  .cl-title{left:132px;top:230px;font:900 128px/1.08 var(--display);letter-spacing:-.04em}
  .cl-title em{color:var(--glow)}
  .cl-ask{right:120px;top:540px;width:560px;text-align:right;padding:34px 40px;border-radius:28px;background:rgba(6,18,31,.78);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(143,208,255,.25)}
  .cl-ask strong{color:var(--glow)}
  .cl-ask b{display:block;font:900 72px/1.1 var(--display);letter-spacing:-.03em}
  .cl-ask span{display:block;margin-top:18px;font:500 28px/1.5 var(--body);color:#cfe0f3}

  .steps.tight{gap:8px}
  .steps.tight li{font-size:25px;padding:10px 18px 10px 12px}
  .steps.tight li::before{width:44px;height:44px;font-size:21px}
  `;
  document.head.appendChild(css);

  // ── 부품 ──
  var CHECK = '<svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
  function scr(inner) { return '<div class="scr">' + inner + "</div>"; }
  function shot(name) { return scr('<img class="shot" src="img/' + name + '.jpg" alt="">'); }
  function mk(inner, extra) { return scr('<div class="mk"' + (extra ? " " + extra : "") + ">" + inner + "</div>"); }
  function cam(screens) { return '<div class="cam"><div class="rig"><div class="phone"><div class="screen">' + screens.join("") + '<div class="fx"></div></div></div></div></div>'; }
  function strip(s) { return String(s).replace(/<[^>]+>/g, ""); }
  // 화면(.scr) 안 요소의 412×864 좌표
  function rectOf(el, scrEl) {
    var x = 0, y = 0, n = el;
    while (n && n !== scrEl) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return [x, y, el.offsetWidth, el.offsetHeight];
  }
  // 입력칸 위에 글자를 타자 치듯
  function typeOver(A, P, s, r, text, o) {
    o = o || {};
    var box = h('<div class="over" style="left:' + r[0] + "px;top:" + r[1] + "px;width:" + r[2] + "px;height:" + r[3] + "px;background:" + (o.bg || "#fff") + ";border-radius:" + (o.radius != null ? o.radius : 16) + "px;padding:" + (o.pad || "14px 18px") + ';font:400 17px/1.45 var(--body);color:#1c2533"><span class="tx"></span><i class="caret" style="display:inline-block;width:2px;height:1.1em;background:#295c9e;vertical-align:-3px;margin-left:1px"></i></div>');
    P.el(s).appendChild(box);
    A.go(box.querySelector(".caret"), [{ opacity: 1 }, { opacity: 0 }], { d: 500, iter: Infinity, dir: "alternate", e: "steps(2)", ambient: true });
    A.later(function () { A.type(box.querySelector(".tx"), text, o.cps || 16); }, o.delay || 500);
    return box;
  }
  // 펜 글씨로 쓰기(왼쪽에서 오른쪽으로 닦아 드러냄)
  function write(A, sel, o) {
    o = o || {};
    A.$$(sel).forEach(function (el, i) {
      A.sfx("scribble", { d: (o.d || 1100) / 1000, delay: (o.delay || 0) + i * (o.each || 260) });
      A.go(el, [{ opacity: 1, clipPath: "inset(0 100% 0 0)" }, { opacity: 1, clipPath: "inset(0 0% 0 0)" }], { d: o.d || 1100, delay: (o.delay || 0) + i * (o.each || 260), e: "cubic-bezier(.45,.05,.55,.95)" });
    });
  }
  function stampIn(A, sel, o) {
    o = o || {};
    A.$$(sel).forEach(function (el, i) {
      var d = (o.delay || 0) + i * (o.each || 200);
      A.go(el, [{ transform: (o.rot || "rotate(-6deg)") + " scale(2.4)", opacity: 0 }, { transform: (o.rot || "rotate(-6deg)") + " scale(1)", opacity: 1 }], { d: 520, delay: d, e: E.back });
      A.later(function () { A.sfx("stamp"); }, d + 300);
    });
  }

  // ── 어두운 장면 바탕 ──
  function darkBg(art, flip) {
    return '<div class="art-wrap' + (flip ? " flip" : "") + '"><img src="img/art/' + art + '.jpg" alt=""></div><div class="shade"></div><div class="grain"></div><div class="vignette"></div>';
  }

  // ── 파트 시작 장면 ──
  function opener(o) {
    D.add({
      id: "op" + o.part, part: o.part, label: o.part + "부 시작 · " + D.PARTS[o.part].name, kind: "dark", min: 0.3, trans: "whip", isNew: o.isNew, opener: { was: o.was, now: o.now, min: o.min },
      notes: o.notes,
      html: darkBg(o.art, o.flip) +
        '<div class="op-num">' + String(o.part).padStart(2, "0") + "</div>" +
        '<p class="op-kicker"><span>' + o.part + "부 · " + D.PARTS[o.part].name + '</span><span class="pill">' + o.min + "분</span>" + (o.isNew ? '<span class="newflag">NEW</span>' : "") + "</p>" +
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

  // ── 실습·둘러보기 장면 ──
  function practice(o) {
    D.add({
      id: o.id, part: o.part, label: o.label, kind: "light practice", min: o.min, practiceMin: o.practiceMin, isNew: o.isNew, notes: o.notes, trans: o.trans || "push", guide: o,
      html: '<div class="chiprow">' + o.chips.map(function (c) { return '<span class="chip ' + (c.c || "") + '">' + c.t + "</span>"; }).join("") + "</div>" +
        '<h2 class="title">' + o.title + "</h2>" +
        '<ol class="steps">' + o.steps.map(function (s) { return "<li" + (s.warn ? ' class="warn"' : "") + "><span>" + s.t + "</span></li>"; }).join("") + "</ol>" +
        (o.note ? '<div class="side-note ' + (o.note.tone || "") + '">' + o.note.html + "</div>" : "") +
        (o.extra || "") +
        cam(o.screens),
      build: function (el, A) {
        var P = null, lis = A.$$(".steps li"), wlt = null;
        function place() {
          var n = A.$(".side-note"), s = A.$(".steps");
          if (!n) return;
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
          A.lt(Object.assign({ tag: o.num ? "실습 " + o.num : "둘러보기", title: o.ltTitle || strip(o.title), sub: o.sub || (o.practiceMin ? "휴대폰으로 함께 따라 해 보세요 · 다음 단계로 넘기면 타이머가 갑니다" : "화면을 보며 함께 확인해요"), timer: o.practiceMin, delay: 1000, tone: o.isNew && !o.practiceMin ? "new" : "" }, o.lt || {}));
          if (o.enter) o.enter(A, P, el);
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
            if (st.fn) st.fn(A, P, el);
          });
        });
        beats.push(function (A) {
          lis.forEach(function (li) { li.classList.remove("on"); li.classList.add("done"); });
          P.wide();
          if (wlt) { A.ltOut(wlt); wlt = null; }
          if (o.finale) o.finale(A, P, el);
        });
        return beats;
      }
    });
  }

  // ── 모형 화면 ──
  var SYM = "img/symbol-128.png";
  var LOCK = '<svg width="13" height="15" viewBox="0 0 13 15" fill="#5f6368"><rect x="1" y="6" width="11" height="9" rx="2"/><path d="M3.5 6V4.5a3 3 0 0 1 6 0V6" fill="none" stroke="#5f6368" stroke-width="1.6"/></svg>';
  function chromeTop() {
    return '<div class="ctop"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3c4350" stroke-width="2"><path d="M3 11 12 4l9 7v9H3z"/></svg><div class="omni">' + LOCK + 'mjms-office.vercel.app</div><div class="tabs">1</div><div class="dots" data-t="dots">⋮</div></div>';
  }
  var M = {};
  M.chromeLogin = mk(chromeTop() + '<img class="shotbg" src="img/login.jpg" style="top:56px" alt="">');
  M.chromeMenu = mk(chromeTop() + '<img class="shotbg" src="img/login.jpg" style="top:56px" alt=""><div class="menu" style="height:auto">' +
    ["새 탭", "새 시크릿 탭", "기록", "다운로드", "북마크", "최근 탭"].map(function (t) { return '<div style="height:44px;display:flex;align-items:center;padding:0 20px">' + t + "</div>"; }).join("") +
    '<hr><div style="height:44px;display:flex;align-items:center;padding:0 20px">공유…</div><div style="height:44px;display:flex;align-items:center;padding:0 20px">페이지에서 찾기</div><div style="height:44px;display:flex;align-items:center;padding:0 20px">번역…</div>' +
    '<div class="hot" data-t="install" style="height:44px;display:flex;align-items:center;padding:0 20px">앱 설치</div><div style="height:44px;display:flex;align-items:center;padding:0 20px">데스크톱 사이트</div></div>');
  M.chromeInstall = mk(chromeTop() + '<img class="shotbg" src="img/login.jpg" style="top:56px" alt=""><div class="dim"></div>' +
    '<div class="dialog" style="height:220px"><h4>앱을 설치할까요?</h4><div style="display:flex;gap:14px;align-items:center;margin-top:14px"><img src="' + SYM + '" style="width:52px;height:52px;border-radius:12px;box-shadow:0 0 0 1px #e3e6ea;padding:6px;background:#fff" alt=""><div><b style="font-size:18px">AI 교무실</b><div class="muted">mjms-office.vercel.app</div></div></div>' +
    '<div style="position:absolute;right:18px;bottom:16px;display:flex;gap:6px"><span style="display:grid;place-items:center;width:64px;height:40px;font-weight:700;color:#1a73e8">취소</span><span data-t="ok" style="display:grid;place-items:center;width:64px;height:40px;font-weight:700;color:#fff;background:#1a73e8;border-radius:20px">설치</span></div></div>');
  function homeScreen(ios) {
    var names = ios ? ["전화", "메시지", "카메라", "사진", "설정", "캘린더", "메모", "시계", "지도", "날씨", "Safari", "AI 교무실"] : ["전화", "메시지", "카메라", "갤러리", "Chrome", "Play 스토어", "설정", "캘린더", "AI 교무실", "시계", "메모", "날씨"];
    var colors = ["#34c759", "#30b0c7", "#8e8e93", "#ff9f0a", "#5e5ce6", "#ff375f", "#64d2ff", "#ffd60a", "#32d74b", "#0a84ff", "#bf5af2", "#ff453a"];
    var out = '<div class="home' + (ios ? " ios" : "") + '"><div class="clock">10:12</div>';
    names.forEach(function (n, k) {
      var r = Math.floor(k / 4), c = k % 4, me = n === "AI 교무실";
      out += '<div class="app' + (me ? " me" : "") + '" ' + (me ? 'data-t="icon" ' : "") + 'style="position:absolute;left:' + (30 + c * 92) + "px;top:" + (190 + r * 112) + 'px;width:62px">' +
        "<i" + (me ? "" : ' style="background:' + colors[k] + ';opacity:.9"') + ">" + (me ? '<img src="' + SYM + '" alt="">' : "") + '</i><span style="white-space:nowrap">' + n + "</span></div>";
    });
    return out + "</div>";
  }
  M.androidHome = mk(homeScreen(false));
  M.iosHome = mk(homeScreen(true));
  var SHARE = '<svg width="22" height="26" viewBox="0 0 22 26" fill="none" stroke="#0a7aff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 2v15M6 7l5-5 5 5"/><path d="M7 11H3v13h16V11h-4"/></svg>';
  function safariBar() {
    var ic = ["‹", "›", SHARE, "▢", "⧉"], xs = [52, 129, 206, 283, 360];
    return '<div class="safari"><div class="url">' + LOCK + "&nbsp;mjms-office.vercel.app</div></div>" +
      ic.map(function (g, k) { return '<span ' + (k === 2 ? 'data-t="share" ' : "") + 'style="position:absolute;left:' + (xs[k] - 20) + 'px;top:810px;width:40px;height:40px;display:grid;place-items:center;color:#0a7aff;font:600 26px var(--body)">' + g + "</span>"; }).join("");
  }
  M.safariLogin = mk('<img class="shotbg" src="img/login.jpg" style="top:-20px" alt="">' + safariBar());
  M.safariShare = mk('<img class="shotbg" src="img/login.jpg" style="top:-20px" alt="">' + safariBar() + '<div class="dim"></div>' +
    '<div class="sheet" style="top:384px;padding:16px">' +
    '<div class="apphead" style="height:70px"><img src="' + SYM + '" alt="" style="background:#fff;padding:6px"><div><b>AI 교무실</b><div class="muted">mjms-office.vercel.app</div></div></div>' +
    '<div class="apps" style="height:86px;align-items:center"><i style="background:#0a84ff"></i><i style="background:#34c759"></i><i style="background:#5ac8fa"></i><i style="background:#ffd60a"></i></div>' +
    '<div class="list"><div style="height:48px;align-items:center">복사</div><div style="height:48px;align-items:center">읽기 목록에 추가</div><div style="height:48px;align-items:center">즐겨찾기에 추가</div><div class="hot" data-t="add" style="height:48px;align-items:center">홈 화면에 추가 <span>＋</span></div><div style="height:48px;align-items:center">페이지에서 찾기</div></div></div>');
  M.iosAdd = mk('<div style="position:absolute;inset:0;background:#f2f2f6"></div>' +
    '<div style="position:absolute;left:0;right:0;top:0;height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;font-size:17px;background:#f9f9fb;border-bottom:1px solid #dcdce2"><span style="color:#0a7aff">취소</span><b>홈 화면에 추가</b><span data-t="add" style="color:#0a7aff;font-weight:700;width:56px;height:36px;display:grid;place-items:center">추가</span></div>' +
    '<div style="position:absolute;left:16px;right:16px;top:80px;background:#fff;border-radius:14px;padding:16px;display:flex;gap:14px;align-items:center"><img src="' + SYM + '" alt="" style="width:64px;height:64px;border-radius:15px;box-shadow:0 0 0 1px #e3e3e8;padding:8px;background:#fff"><div style="flex:1"><div style="border-bottom:1px solid #e5e5ea;padding:6px 0;font-size:18px">AI 교무실</div><div class="muted" style="padding-top:6px">mjms-office.vercel.app</div></div></div>' +
    '<p class="muted" style="position:absolute;left:24px;right:24px;top:200px">홈 화면에 아이콘이 추가되어 이 웹사이트를 빠르게 열 수 있습니다.</p>');
  function notiPage(on, extra) {
    return mk('<div class="top"><b>알림</b><span>평일 7시 50분 아침 · 11시 30분 점심 요약 푸시</span></div>' +
      '<div class="card"><div class="row"><h4 style="margin:0">푸시 알림</h4><span class="pill' + (on ? " ok" : "") + '">' + (on ? "켜짐" : "꺼짐") + "</span></div>" +
      '<p class="muted" style="margin-top:6px">' + (on ? "이 기기로 아침·점심 요약과 새 공지·넵·서명 요청이 옵니다." : "평일 7시 50분 아침, 11시 30분 점심 요약을 받아보세요.") + "</p>" +
      (on ? '<div class="btn ghost" data-t="test">내 기기로 시험 발송</div>' : '<div class="btn" data-t="on">켜기</div>') + "</div>" +
      '<div class="card"><div class="row"><h4 style="margin:0">보건실 입실 알림</h4><i class="sw"></i></div><p class="muted" style="margin-top:6px">우리 반 학생이 보건실에 들어오면(담임), 또는 내 수업 중에 그 반 학생이 들어오면(교과) 알립니다. 이름 없이 반과 성별만.</p></div>' +
      (extra || ""));
  }
  M.notiOff = notiPage(false);
  M.notiAsk = notiPage(false, '<div class="dim"></div><div class="dialog" style="top:300px"><h4>AI 교무실에서 알림을 보내도록 허용할까요?</h4><p class="muted">알림은 설정에서 언제든 바꿀 수 있습니다.</p>' +
    '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:20px"><span style="padding:10px 14px;font-weight:700;color:#1a73e8">허용 안 함</span><span data-t="allow" style="padding:10px 18px;font-weight:700;color:#fff;background:#1a73e8;border-radius:20px">허용</span></div></div>');
  M.notiOn = notiPage(true);
  function nepTop(tab) {
    return '<div class="top"><b>넵</b><span>' + (tab === 0 ? "처리할 것 1건" : "보낸 요청 현황") + "</span></div>" +
      '<div style="margin:6px 16px 10px;background:#e9eef4;border-radius:14px;padding:4px;display:grid;grid-template-columns:1fr 1fr;text-align:center;font-weight:700"><span style="padding:9px;border-radius:11px;' + (tab === 0 ? "background:#fff" : "color:#6b7a90") + '">받은</span><span style="padding:9px;border-radius:11px;' + (tab === 1 ? "background:#fff" : "color:#6b7a90") + '">보낸</span></div>';
  }
  M.nepRecv = mk(nepTop(0) + '<div class="card" data-t="item"><span class="pill">업무요청</span><h4 style="margin-top:8px">연수 실습: 진도 적기</h4><p class="muted">나 · 마감 10월 9일 (금) 16:30</p></div>');
  M.nepDetail = mk('<div class="top"><b style="font-size:20px">‹&nbsp; 넵</b></div><div class="card"><span class="pill">업무요청</span><h4 style="font-size:22px;margin-top:10px">연수 실습: 진도 적기</h4><p class="muted">보낸 사람 나 · 마감 10월 9일 (금) 16:30</p><p style="margin-top:12px">오늘 수업 진도를 진도표에 한 줄 적어 주세요.</p>' +
    '<div class="btn" data-t="done" style="position:relative;overflow:hidden">완료<span class="dn" style="position:absolute;inset:0;display:grid;place-items:center;background:#1f8a5a;opacity:0">넵 처리했습니다 · 16:42</span></div></div>');
  M.nepSent = mk(nepTop(1) + '<div class="card"><span class="pill">확인요청</span><h4 style="margin-top:8px">2학기 평가계획서 확인</h4><div class="row"><span class="muted">처리</span><b>5 / 7</b></div><div class="bar2"><i style="width:71%"></i></div>' +
    '<div class="person"><span>○○○</span><span class="muted">도착 · 아직</span></div><div class="person"><span>○○○</span><span class="muted">도착 · 아직</span></div><div class="person"><span class="muted">처리 5명</span><span class="muted">펼치기 ›</span></div>' +
    '<div class="btn ghost" data-t="remind">다시 알림</div></div>');
  M.signTap = mk('<div class="top"><b style="font-size:21px">‹&nbsp; 종교과 교과협의회</b><span>10월 7일 (수) 7교시 · 아가페교실</span></div>' +
    '<div class="card"><div class="row"><span class="muted">만든 사람 홍길동</span><span class="pill">서명 받는 중</span></div></div>' +
    '<div style="margin:14px 20px 4px;font:600 13px var(--body);color:#6b7a90">명단</div>' +
    '<div class="card" style="padding:4px 18px"><div class="person" style="border:0"><span>1&nbsp; 김하늘 · 교과</span><b style="color:#1f8a5a">✓ 15:42</b></div><div class="person"><span>2&nbsp; 나 · 교목실</span><span class="muted st">아직</span></div><div class="person"><span>3&nbsp; 박서준 · 교과</span><span class="muted">아직</span></div></div>' +
    '<div style="position:absolute;left:16px;right:16px;top:430px"><div class="btn" data-t="sign" style="position:relative;overflow:hidden">내 서명으로 서명하기<span class="dn" style="position:absolute;inset:0;display:grid;place-items:center;background:#1f8a5a;opacity:0">✓ 서명했습니다</span></div><p style="text-align:center;margin-top:10px;color:#295c9e;font-weight:700">이번만 손으로</p></div>');

  // ════════════════════════════════════════════════════════════
  // 0부 · 시작
  // ════════════════════════════════════════════════════════════
  D.add({
    id: "cover", part: 0, label: "표지 · 접속 안내", kind: "dark", min: 0.5, trans: "fade", bgm: "lobby",
    notes: "연수 시작 전부터 이 화면을 띄워 둡니다. <b>휴대폰 카메라로 QR을 찍어 AI 교무실을 열고, 처음 받은 비밀번호를 준비</b>해 달라고 안내합니다. 오늘은 듣기보다 <b>휴대폰으로 함께 해 보는</b> 연수라는 점을 먼저 말씀드립니다.",
    html: darkBg("cover") +
      '<div class="abs cv-brand"><img src="img/symbol-128.png" alt=""><div><small>MYONGJI MIDDLE SCHOOL</small><b>AI 교무실</b></div></div>' +
      '<p class="abs cv-kicker">교직원 연수 · 약 50분 · 휴대폰과 함께</p>' +
      '<h1 class="abs cv-title"><span class="ln">AI 교무실,</span><span class="ln">함께 <em>써 봅니다</em></span></h1>' +
      '<p class="abs cv-lead">휴대폰 카메라로 오른쪽 <b>QR</b>을 찍어 주세요.<br>처음 받은 <b>비밀번호</b>도 준비해 주세요.</p>' +
      '<div class="abs cv-qr"><img src="img/qr.svg" alt="mjms-office.vercel.app 주소 QR 코드"><p>mjms-office.vercel.app</p><small>카메라로 찍으면 바로 열립니다</small></div>',
    build: function (el, A) {
      return [function (A) {
        A.go(".art-wrap img", [{ transform: "scale(1.35)", filter: "brightness(.3)" }, { transform: "scale(1.12)", filter: "brightness(1)" }], { d: 2200, e: E.out });
        A.kenburns(".art-wrap img", { from: "scale(1.12)", to: "scale(1.03) translate(-1.5%, 0.8%)", d: 60000, delay: 2200 });
        A.pop(".cv-brand img", { delay: 200, s: 0.4 });
        A.wipe(".cv-brand div", { delay: 380 });
        A.wipe(".cv-kicker", { delay: 520 });
        var t = A.kinetic(".cv-title", { delay: 640, each: 46, punch: 2.1 });
        A.rise(".cv-lead", { delay: t + 100 });
        A.go(".cv-qr", [{ transform: "perspective(1200px) translateX(220px) rotateY(-38deg)", opacity: 0 }, { transform: "perspective(1200px) translateX(0px) rotateY(0deg)", opacity: 1 }], { d: 1300, delay: 700, e: E.out });
        A.later(function () { A.go(".cv-qr", [{ transform: "translateY(0)" }, { transform: "translateY(-12px)" }], { d: 2600, iter: Infinity, dir: "alternate", e: "ease-in-out", ambient: true }); }, 2000);
      }];
    }
  });

  var HOOK_WORDS = [
    ["오늘 경건회 인도는?", 150, 150, 40, -4], ["등교지도 누구 차례?", 1240, 120, 44, 3], ["빈 교실 어디?", 680, 210, 52, -2],
    ["급식 메뉴", 1560, 300, 38, 5], ["평가계획서 제출했나요?", 120, 380, 46, 2], ["가정통신문 번호", 1290, 470, 42, -3],
    ["복합기 수리 요청", 200, 620, 40, 4], ["진도 어디까지 나갔지?", 1180, 690, 48, -2], ["회의 서명 받으러 한 바퀴", 140, 850, 42, -3],
    ["보건실 간 학생은?", 1380, 880, 44, 3], ["넵? 읽으셨어요?", 760, 900, 40, 2], ["자료는 어느 폴더에?", 720, 60, 38, -5]
  ];
  D.add({
    id: "hook", part: 0, label: "여는 이야기", kind: "dark", min: 1, trans: "fade",
    notes: "1단계: 선생님들 하루에 흩어진 일들을 보여 줍니다. “이 질문들, 하루에 몇 번 하시나요?”<br>2단계: 넘기면 낱말들이 휴대폰 하나로 모입니다. <b>“흩어진 일을 휴대폰 하나로 모은 것이 AI 교무실입니다.”</b><br>3단계: 10월 2일 기준으로 <b>아침 알림을 켠 계정은 71명 중 10명</b>입니다. 탓하는 말이 아니라 “오늘 끝날 때는 모두 켜 두자”는 목표로 말씀해 주세요.",
    html: '<div class="hk-bg"></div><div class="grain"></div>' +
      HOOK_WORDS.map(function (w) { return '<span class="hk-word" style="left:' + w[1] + "px;top:" + w[2] + "px;font-size:" + w[3] + "px;transform:rotate(" + w[4] + 'deg)"><span class="in" style="display:inline-block">' + w[0] + "</span></span>"; }).join("") +
      '<h2 class="abs hk-say"><span class="ln">선생님의 하루는</span><span class="ln"><em>여기저기</em> 흩어져 있습니다</span></h2>' +
      '<div class="abs hk-ring"></div><div class="abs hk-icon"><img src="img/symbol-128.png" alt="AI 교무실"></div>' +
      '<h2 class="abs hk-one"><span class="ln">휴대폰 하나로, <em>한 곳에서.</em></span></h2>' +
      '<div class="abs hk-stat"><p class="cap">지금 아침 알림을 받는 선생님</p><div class="num"><em class="n10">0</em><small>/ 71명</small></div><p class="src">10월 2일 기준 · 알림을 켠 계정</p></div>' +
      '<h2 class="abs hk-goal"><span class="ln">오늘 연수가 끝나면, <em>71명 모두.</em></span></h2>',
    build: function (el, A) {
      var words = A.$$(".hk-word");
      return [
        function (A) {
          A.hide(".hk-icon, .hk-ring, .hk-one, .hk-stat, .hk-goal");
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
            var rot = "rotate(" + HOOK_WORDS[i][4] + "deg)";
            A.go(w, [{ transform: rot, opacity: 0.6 }, { transform: "translate(" + cx + "px," + cy + "px) scale(.15) rotate(0deg)", opacity: 0 }], { d: 760, delay: 150 + i * 45, e: E.in });
          });
          A.go(".hk-icon", [{ transform: "scale(3.2)", opacity: 0, filter: "blur(20px)" }, { transform: "scale(1)", opacity: 1, filter: "blur(0px)" }], { d: 900, delay: 900, e: E.spring });
          A.sfx("boom", { delay: 980 });
          A.go(".hk-ring", [{ transform: "scale(.9)", opacity: 0 }, { transform: "scale(1)", opacity: 0.8, offset: 0.08 }, { transform: "scale(2.6)", opacity: 0 }], { d: 1900, delay: 1200, iter: Infinity, e: "cubic-bezier(.2,.6,.3,1)", ambient: true });
          A.go(".hk-one", [{ opacity: 0 }, { opacity: 1 }], { d: 10, delay: 1200 });
          A.kinetic(".hk-one", { delay: 1250, each: 40 });
        },
        function (A) {
          A.go(".hk-icon", [{ transform: "none", opacity: 1 }, { transform: "translateY(-80px) scale(.5)", opacity: 0 }], { d: 600, e: E.in });
          A.go(".hk-ring", [{ opacity: 0 }, { opacity: 0 }], { d: 10, fill: "forwards" });
          A.go(".hk-one", [{ opacity: 1 }, { opacity: 0 }], { d: 400, e: E.in });
          A.go(".hk-stat", [{ opacity: 0, transform: "translateY(40px)" }, { opacity: 1, transform: "none" }], { d: 800, delay: 450, e: E.out });
          A.later(function () { A.count(".n10", 0, 10, 1400); }, 700);
          A.go(".hk-stat .num em", [{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }], { d: 500, delay: 2150, e: E.out });
          A.go(".hk-goal", [{ opacity: 0 }, { opacity: 1 }], { d: 10, delay: 2400 });
          A.kinetic(".hk-goal", { delay: 2450, each: 40, punch: 2.2 });
        }
      ];
      function $in(w) { return w.querySelector(".in"); }
    }
  });

  var AGENDA = [
    [1, "기본 설정", "로그인·비밀번호, 앱 설치, 알림 켜기, 보건실 알림, 새 홈 화면", 9],
    [2, "시간표·진도표", "빈 교실 찾기, 오늘 진도 한 줄, 「한 달」 도장판", 5],
    [3, "넵", "나에게 업무요청, 받는 사람 고르기, 받은 넵 처리", 6],
    [4, "디지털 서명", "내 서명 등록, 회의 서명부(AI로도), 파일로 서명 받기", 8, true],
    [5, "AI에게 부탁하기", "자료실 묻기, 가정통신문·수리 요청 카드, 수업교체", 8],
    [6, "세특 도우미", "과세특 초안 한 명 만들어 보기", 5],
    [7, "전자칠판·자료실", "칠판 알림 화면 둘러보기, 자료 찾고 올리기", 4]
  ];
  D.add({
    id: "agenda", part: 0, label: "오늘 순서", kind: "light", min: 0.5, trans: "whip",
    notes: "일곱 부분으로 나눠 <b>화면을 보며 휴대폰으로 하나씩 따라 합니다.</b> 4부 디지털 서명은 이번 주에 새로 생긴 기능이라 조금 더 시간을 씁니다. 막히는 분은 손을 들어 주시면 옆 선생님이나 제가 도와드린다고 안내합니다.",
    html: '<div class="chiprow"><span class="chip">오늘 순서</span></div><h2 class="title">화면을 보며, 휴대폰으로 <em>하나씩</em> 따라 합니다</h2>' +
      '<p class="abs ag-total">여는 이야기까지 약 <b class="mono" data-total>0</b>분</p>' +
      '<div class="abs ag">' + AGENDA.map(function (a) {
        return '<div class="r' + (a[4] ? " newr" : "") + '"><span class="n">0' + a[0] + '</span><span class="nm">' + a[1] + (a[4] ? ' <span class="badge-new">NEW</span>' : "") + '</span><span class="ds">' + a[2] + '</span><span class="tm"><i style="width:' + a[3] * 30 + 'px"></i><span>' + a[3] + "분</span></span></div>";
      }).join("") + '<div class="r qa"><span class="n">+</span><span class="nm">질문</span><span class="ds">막혔던 곳, 궁금한 것</span><span class="tm"><i style="width:90px;background:var(--faint)"></i><span>3분</span></span></div></div>',
    build: function (el, A) {
      return [function (A) {
        A.wipe(".chiprow > *");
        A.kinetic(".title", { delay: 100, each: 22 });
        A.rise(".ag .r", { delay: 500, each: 90, y: 30, snd: "pluck", v: 0.07 });
        A.stagger(".ag .tm i", [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { delay: 800, each: 90, d: 900, e: E.out });
        A.wipe(".ag-total", { delay: 600 });
        A.later(function () { A.count("[data-total]", 0, 50, 1500); }, 800);
      }];
    }
  });

  var NEWF = [
    ["4부", "디지털 서명", "<b>내 서명</b>을 한 번 등록하면 회의 서명부·파일 서명·수업교체 신고서에 <b>한 번 누르기</b>로. 회의 서명부는 <b>AI에게 말로</b>도 만듭니다."],
    ["3부", "받는 사람 고르기", "넵·서명을 <b>부서·교과·직책</b>(부장단·교과 주임단)으로 보내고, 고르면 <b>이름이 펼쳐져</b> 보입니다."],
    ["2부", "진도 「한 달」 도장판", "반마다 이달 수업이 <b>동그라미</b>로. 빈 동그라미를 누르면 그 주를 바로 적습니다."],
    ["1부 · 5부", "가운데 AI 버튼", "아래 탭 가운데 <b>볼록한 AI 버튼</b> 하나로 묻고 부탁합니다. 「일정」은 더보기로 옮겼습니다."],
    ["1부", "홈 날씨·퇴근 인사", "날짜 옆에 <b>지금 날씨·미세먼지</b>. 오후 4시 20분이 지나면 <b>수고 인사와 내일 미리보기</b>."],
    ["1부", "할 일 숫자", "넵·수업교체·서명 할 일이 <b>더보기 탭과 앱 아이콘에 숫자</b>로 뜹니다."]
  ];
  D.add({
    id: "whatsnew", part: 0, label: "이번 주 새 기능", kind: "light", min: 1, isNew: true,
    notes: "지난주에 미리 써 보신 분도 계시니, <b>이번 주에 새로 들어온 여섯 가지</b>를 먼저 짚습니다. 각 기능이 몇 부에서 나오는지 오른쪽 위 표시를 가리키며 “뒤에서 직접 해 봅니다” 정도로 짧게 넘깁니다.",
    html: '<div class="chiprow"><span class="chip new">NEW</span><span class="chip ghost">10월 첫 주</span></div><h2 class="title">이번 주에 <em>새로 들어온</em> 여섯 가지</h2>' +
      '<div class="abs nf">' + NEWF.map(function (f) { return '<div class="card c"><span class="where">' + f[0] + "에서</span><h3>" + f[1] + "</h3><p>" + f[2] + "</p></div>"; }).join("") + "</div>",
    build: function (el, A) {
      return [function (A) {
        A.wipe(".chiprow > *", { each: 120 });
        A.kinetic(".title", { delay: 120, each: 26 });
        A.pop(".nf .c", { delay: 600, each: 110, s: 0.82 });
        A.stagger(".nf .c h3", [{ transform: "translateY(20px)", opacity: 0 }, { transform: "none", opacity: 1 }], { delay: 800, each: 110, d: 700 });
      }];
    }
  });

  // ════════════════════════════════════════════════════════════
  // 1부 · 기본 설정
  // ════════════════════════════════════════════════════════════
  opener({
    part: 1, art: "basics", min: 9, lines: ["한 번 켜 두면", "<em>아침마다</em> 옵니다"],
    was: "오늘 일정·경건회·등교지도를 여기저기서 확인", now: "평일 아침 7시 50분, 알림 한 번으로",
    notes: "1부는 <b>로그인 → 앱 설치 → 알림 켜기</b>까지 함께 합니다. 이 세 가지만 해 두면 내일 아침부터 7시 50분에 오늘 일정이 휴대폰으로 옵니다."
  });

  practice({
    id: "p1", part: 1, num: 1, label: "실습 1 · 로그인과 비밀번호", min: 2.5, practiceMin: 3, trans: "zoom",
    chips: [{ t: "실습 1 · 기본 설정" }, { t: "3분", c: "ghost" }], title: "로그인하고 비밀번호 바꾸기",
    steps: [
      { t: "카메라로 QR을 찍어 AI 교무실을 엽니다", s: 0 },
      { t: '<span class="q">「이름」</span> 칸에 이름을 적습니다. 한 명으로 좁혀지면 <span class="q">「선택됨」</span>', s: 0, r: [58, 293, 296, 48] },
      { t: '받은 비밀번호를 넣고 <span class="k">로그인</span>', s: 0, r: [58, 489, 296, 50] },
      { t: '처음이면 새 비밀번호를 정합니다. <b>8자 이상, 영문과 숫자</b>를 함께', s: 1, r: [31, 117, 350, 48] },
      { t: '<span class="k">비밀번호 변경</span>을 누르면 끝', s: 1, r: [31, 288, 350, 50] },
      { t: "홈 화면: 오늘 내 수업·공지·급식이 한눈에", s: 2 }
    ],
    note: { html: '<img src="img/qr.svg" alt="" style="width:76px;height:76px;flex:none;border-radius:8px"><span>이름이 안 나오면 <b>초성(ㅇㅅㅇ)</b>으로도 찾습니다. 비밀번호를 잊으셨으면 <b>교목실</b>에서 바로 맞춰 드립니다.</span>' },
    screens: [shot("login"), shot("password"), shot("home")],
    notes: "QR로 열고 이름을 적으면 한 사람으로 좁혀질 때 「선택됨」이 뜹니다. <b>처음 로그인하면 비밀번호를 꼭 바꾸게</b> 되어 있습니다(8자 이상, 영문+숫자). 첫 단계로 넘기면 오른쪽 아래 <b>실습 타이머 3분</b>이 시작됩니다. 다 되신 분은 옆 선생님을 도와 달라고 부탁하세요."
  });

  practice({
    id: "p2a", part: 1, num: "2", label: "실습 2 · 앱 설치(안드로이드)", min: 1.5, practiceMin: 2,
    chips: [{ t: "실습 2 · 안드로이드" }, { t: "2분", c: "ghost" }], title: "크롬에서 앱으로 설치하기",
    steps: [
      { t: '크롬으로 연 AI 교무실에서 오른쪽 위 <b>⋮</b> 메뉴', s: 0, r: "[data-t=dots]", z: 1.9 },
      { t: '<span class="q">「앱 설치」</span> (크롬 버전에 따라 <span class="q">「홈 화면에 추가」</span>)', s: 1, r: "[data-t=install]" },
      { t: '창이 뜨면 <span class="k">설치</span>', s: 2, r: "[data-t=ok]", z: 1.9 },
      { t: '이제 홈 화면의 <b>AI 교무실</b> 아이콘으로 엽니다', s: 3, r: "[data-t=icon]", z: 1.8 }
    ],
    note: { html: '<span>아래쪽에 「앱 설치」 안내가 먼저 뜨면 그걸 눌러도 됩니다. <b>PC 크롬</b>은 주소창 오른쪽 설치 아이콘 → 「설치」. 아이폰은 다음 장면에서.</span>' },
    screens: [M.chromeLogin, M.chromeMenu, M.chromeInstall, M.androidHome],
    lt: { sub: "안드로이드·갤럭시는 크롬에서 · 아이폰은 다음 장면" },
    notes: "안드로이드는 <b>크롬</b>에서 ⋮ → 「앱 설치」입니다. 삼성 인터넷으로 열린 분은 주소를 크롬에 붙여 넣어 주세요. 설치하면 홈 화면 아이콘으로 열리고, 그래야 알림이 안정적으로 옵니다."
  });

  practice({
    id: "p2i", part: 1, num: "2", label: "실습 2 · 홈 화면 추가(아이폰)", min: 1, practiceMin: 2,
    chips: [{ t: "실습 2 · 아이폰" }, { t: "2분", c: "ghost" }], title: "아이폰은 사파리에서 홈 화면에 추가",
    steps: [
      { t: '사파리 아래쪽 <b>공유 버튼</b>', s: 0, r: "[data-t=share]", z: 1.9 },
      { t: '목록에서 <span class="q">「홈 화면에 추가」</span>', s: 1, r: "[data-t=add]" },
      { t: '오른쪽 위 <span class="k">추가</span>', s: 2, r: "[data-t=add]", z: 1.9 },
      { t: '이제 홈 화면의 <b>AI 교무실</b> 아이콘으로 엽니다', s: 3, r: "[data-t=icon]", z: 1.8 }
    ],
    note: { tone: "warn", html: "<span><b>아이폰은 꼭</b> 이 홈 화면 아이콘으로 열어야 알림을 받을 수 있습니다. 사파리 창에서는 알림 켜기가 되지 않습니다.</span>" },
    screens: [M.safariLogin, M.safariShare, M.iosAdd, M.iosHome],
    lt: { sub: "카카오톡·네이버 앱 안에서 열렸다면 사파리로 다시 열어 주세요" },
    notes: "아이폰은 <b>사파리</b>에서만 됩니다. QR을 찍었는데 다른 앱 안에서 열렸다면 사파리로 다시 열어 주세요. <b>아이폰은 홈 화면 아이콘으로 열어야 알림이 옵니다.</b> 이 부분에서 가장 많이 막히니 천천히 돌아봐 주세요."
  });

  practice({
    id: "p3", part: 1, num: 3, label: "실습 3 · 알림 켜기", min: 1.5, practiceMin: 2,
    chips: [{ t: "실습 3 · 기본 설정" }, { t: "2분", c: "ghost" }], title: "알림 켜기",
    steps: [
      { t: '홈 화면 아이콘으로 열고, 아래 <span class="k">더보기</span>', s: 0, r: [327, 797, 81, 55], z: 1.8 },
      { t: '<span class="q">「도구」</span> 묶음의 <span class="k">알림</span>', s: 1, r: [17, 417, 378, 56] },
      { t: '<span class="k">켜기</span>', s: 2, r: "[data-t=on]" },
      { t: '휴대폰이 물으면 <span class="q">「허용」</span>', s: 3, r: "[data-t=allow]", z: 1.9 },
      { t: '<span class="k">내 기기로 시험 발송</span> → 알림이 오면 끝', s: 4, r: "[data-t=test]", fn: function (A, P) { A.later(function () { P.wide(); A.banner(P.el(4), { title: "시험 알림", body: "이 기기로 알림이 잘 옵니다." }); }, 1300); } }
    ],
    note: { html: "<span>평일 <b>7시 50분</b> 아침 요약, <b>11시 30분</b> 점심 요약. 새 공지·넵·서명 요청·<b>보건실 입실</b>도 알림으로 옵니다.</span>" },
    screens: [shot("home"), shot("more-bottom"), M.notiOff, M.notiAsk, M.notiOn],
    notes: "오늘 연수에서 <b>가장 중요한 실습</b>입니다. 지금 알림을 켠 계정이 열 분 남짓이에요. 「허용」을 실수로 거절하셨으면 휴대폰 설정 → 알림 → AI 교무실에서 허용합니다. <b>시험 발송까지 해서 알림이 오는 것을 꼭 확인</b>해 주세요."
  });

  D.add({
    id: "nurse", part: 1, label: "보건실 입실 알림", kind: "light", min: 1,
    notes: "학생이 보건실 키오스크에 접수하면 <b>1분 안에</b> 담임과 그 교시 교과 선생님께 알림이 갑니다. <b>이름 없이 반·성별만</b> 갑니다. 교과 선생님께는 수업 중이거나 수업 시작 5분 안에 들어온 경우만 보냅니다 — 쉬는 시간 초반에 간 학생은 대개 종 치기 전에 돌아오기 때문입니다.",
    html: '<div class="chiprow"><span class="chip watch">보건실 입실 알림</span></div><h2 class="title" style="width:860px">보건실 입실, <em>1분 안에</em> 알려 드립니다</h2>' +
      '<div class="card node nn" style="left:120px;top:400px;width:250px"><span class="tag">입실</span><h3>보건실 접수</h3><p>키오스크(스마일보건)</p></div>' +
      '<i class="arrow" style="left:384px;top:520px;width:44px"></i>' +
      '<div class="card node nn" style="left:440px;top:400px;width:250px"><span class="tag">1분마다</span><h3>AI 교무실</h3><p>공유 화면을 읽음</p></div>' +
      '<i class="arrow" style="left:704px;top:520px;width:44px"></i>' +
      '<div class="card node nn hot" style="left:760px;top:400px;width:250px"><span class="tag">알림</span><h3>선생님 휴대폰</h3><p>이름 없이 <b>반·성별</b>만</p></div>' +
      '<div class="abs card who" style="width:890px;top:700px"><div class="r"><span>담임</span><p>우리 반 학생이면 <b>언제나</b></p></div><div class="r"><span>교과</span><p>내 수업 <b>중</b>이거나 수업 <b>시작 5분 안</b></p></div></div>' +
      cam([shot("home")]),
    build: function (el, A) {
      var P, lt;
      return [
        function (A) {
          A.wipe(".chiprow > *"); A.kinetic(".title", { delay: 100, each: 26 });
          A.rise(".nn", { delay: 500, each: 160 });
          A.draw(".arrow", { delay: 900, each: 160 });
          P = A.phone(".cam"); P.enter({ delay: 300 });
          A.hide(".who");
        },
        function (A) {
          A.banner(P.el(0), { title: "[보건실 입실] 2-3 남학생", body: "10:12 · 3교시 수업 중에 보건실에 들어왔습니다.", delay: 200 });
          P.focus([10, 12, 392, 96], { z: 1.6, ringDelay: 900 });
        },
        function (A) {
          P.wide();
          A.go(".who", [{ opacity: 0, transform: "translateY(30px)" }, { opacity: 1, transform: "none" }], { d: 700, e: E.out });
          A.rise(".who .r", { delay: 150, each: 160, y: 18 });
        },
        function (A) {
          lt = A.lt({ tag: "꼭", title: "알림 켜기를 해 두어야 옵니다", sub: "끄기: 더보기 → 알림 → 「보건실 입실 알림」 · 현황: 더보기 → 보건실" });
        }
      ];
    }
  });

  practice({
    id: "home", part: 1, num: null, label: "새 홈 화면 둘러보기", min: 0.7, isNew: true,
    chips: [{ t: "NEW", c: "new" }, { t: "둘러보기", c: "ghost" }], title: "홈 화면이 이렇게 바뀌었어요",
    steps: [
      { t: '날짜 옆에 <b>지금 날씨·미세먼지</b>', s: 0, r: [205, 66, 197, 34], newf: true, z: 1.85 },
      { t: '<b>오후 4시 20분</b>이 지나면 수고 인사와 내일 미리보기', s: 0, r: [16, 96, 380, 70], newf: true },
      { t: '오늘 시간표 카드에서 바로 <span class="k">진도 기록</span>', s: 0, r: [17, 309, 378, 124] },
      { t: '아래 탭 가운데 볼록한 <span class="k">AI</span> 버튼. 「일정」은 더보기로 옮겼습니다', s: 0, r: [158, 768, 96, 88], newf: true, z: 1.8 },
      { t: '할 일이 생기면 <b>더보기 탭·앱 아이콘에 숫자</b> (넵·수업교체·서명)', s: 0, r: [327, 790, 81, 62], newf: true, z: 1.8, fn: function (A, P) {
        var b = h('<div class="over" style="left:371px;top:796px;min-width:24px;height:24px;padding:0 7px;border-radius:12px;background:#e5484d;color:#fff;font:700 14px/24px var(--body);text-align:center;box-shadow:0 0 0 2px #fff">3</div>');
        P.el(0).appendChild(b); A.pop(b, { delay: 500, s: 0.2 });
      } }
    ],
    screens: [shot("home")],
    lt: { tag: "NEW", title: "새 홈 화면", sub: "10월 첫 주에 바뀐 것들" },
    notes: "이번 주에 바뀐 홈 화면입니다. 날씨·미세먼지, 퇴근 시간 뒤의 수고 인사, 가운데 AI 버튼, 할 일 숫자를 짚어 줍니다. <b>할 일 숫자</b>는 넵·수업교체·서명할 것이 남아 있을 때만 뜹니다(지금 화면의 빨간 숫자는 예시입니다)."
  });

  D.add({
    id: "check", part: 1, label: "점검 · 여기까지 됐나요?", kind: "light", min: 0.5,
    notes: "한 줄씩 넘기며 손을 들어 확인합니다. 넘길 때마다 체크 표시가 됩니다. <b>안 된 분이 있으면 여기서 잠깐 멈추고</b> 오른쪽 「안 될 때」를 보며 같이 해결합니다.",
    html: '<div class="chiprow"><span class="chip">점검</span></div><h2 class="title">여기까지 됐나요?</h2>' +
      '<div class="abs ck">' + ["새 비밀번호로 로그인", "홈 화면에 AI 교무실 아이콘", "시험 알림 받기", "보건실 입실 알림 켜짐"].map(function (t) { return '<div class="card r"><span class="bx">' + CHECK + "</span>" + t + "</div>"; }).join("") + "</div>" +
      '<div class="abs card fix"><h3>안 될 때</h3>' +
      '<div class="q"><b>“그 이름을 찾지 못했습니다”</b><span>띄어쓰기 없이 이름만, 또는 초성(ㅎㄱㄷ)으로 찾습니다</span></div>' +
      '<div class="q"><b>“비밀번호가 맞지 않습니다”</b><span>교목실에서 바로 맞춰 드립니다</span></div>' +
      '<div class="q"><b>아이폰에서 [켜기] 대신 안내문이 떠요</b><span>사파리 말고 홈 화면 아이콘으로 열어 주세요</span></div>' +
      '<div class="q"><b>“알림 권한이 거부되어 있습니다”</b><span>휴대폰 설정 → 알림 → AI 교무실을 허용합니다</span></div></div>',
    build: function (el, A) {
      var rows = A.$$(".ck .r");
      var beats = [function (A) {
        A.wipe(".chiprow > *"); A.kinetic(".title", { delay: 100, each: 34 });
        A.rise(".ck .r", { delay: 400, each: 100 });
        A.go(".fix", [{ opacity: 0, transform: "translateX(60px)" }, { opacity: 1, transform: "none" }], { d: 900, delay: 700 });
        A.rise(".fix .q", { delay: 900, each: 100, y: 16 });
      }];
      rows.forEach(function (r) {
        beats.push(function (A) {
          r.classList.add("on");
          A.go(r.querySelector(".bx"), [{ transform: "scale(.6)" }, { transform: "scale(1)" }], { d: 520, e: E.back });
          A.go(r.querySelector("svg"), [{ strokeDashoffset: 40 }, { strokeDashoffset: 0 }], { d: 420, delay: 120, e: E.out });
          A.sfx("check");
        });
      });
      return beats;
    }
  });

  // ════════════════════════════════════════════════════════════
  // 2부 · 시간표·진도표
  // ════════════════════════════════════════════════════════════
  opener({
    part: 2, art: "class", min: 5, lines: ["빈 교실도, 진도도", "<em>휴대폰 하나로</em>"],
    was: "빈 교실을 찾으러 교무실 시간표 앞으로", now: "지금 빈 교실과 공강 선생님을 바로",
    notes: "2부는 매일 쓰는 두 가지, <b>시간표</b>와 <b>진도표</b>입니다. 진도표에는 이번 주에 「한 달」 도장판이 새로 생겼습니다."
  });

  practice({
    id: "p4", part: 2, num: 4, label: "실습 4 · 시간표와 빈 교실", min: 2, practiceMin: 2, trans: "zoom",
    chips: [{ t: "실습 4 · 시간표" }, { t: "2분", c: "ghost" }], title: "내 시간표와 지금 빈 교실",
    steps: [
      { t: '아래 <span class="k">시간표</span> 탭: 내 시간표가 먼저, 오늘 요일이 표시됩니다', s: 0, r: [85, 797, 81, 55], z: 1.8 },
      { t: '위쪽 <span class="q">「교사 · 학급 · 교실 · 전체」</span>로 보는 기준을 바꿉니다', s: 0, r: [19, 79, 376, 44] },
      { t: '아래로 내리면 <span class="q">「빈 교실」</span>. 수업 시간엔 지금 교시로 보여 줍니다', s: 0, r: [17, 637, 378, 147] },
      { t: '<span class="q">「학급」</span>에서 반을 고르면 그 반 시간표와 담임 선생님', s: 1, r: [16, 134, 380, 44] }
    ],
    note: { html: "<span>수업 시간이 아닐 때는 <b>월요일 1교시</b>를 보여 줍니다. 요일·교시를 골라 다른 시간의 빈 교실과 공강인 선생님도 봅니다.</span>" },
    screens: [shot("timetable"), shot("timetable-class")],
    notes: "시간표 탭은 <b>내 시간표</b>부터 보여 줍니다. 「교실」로 바꾸면 특별실이 언제 비는지, 아래 「빈 교실」에서는 지금 쓸 수 있는 교실을 바로 봅니다. 결강·보강 때 가장 많이 쓰시는 화면입니다."
  });

  practice({
    id: "p5", part: 2, num: 5, label: "실습 5 · 진도표와 「한 달」 도장판", min: 2.7, practiceMin: 3,
    chips: [{ t: "실습 5 · 진도표" }, { t: "NEW 한 달 보기", c: "new" }], title: "진도는 한 줄로,<br>한 달은 <em>도장판으로</em>",
    steps: [
      { t: '홈 <span class="q">「오늘 시간표」</span> 카드의 <span class="k">진도 기록</span>', s: 0, r: [270, 316, 62, 32], z: 1.9 },
      { t: '오늘 수업마다 칸이 하나. 한 줄 적습니다', s: 1, r: [31, 284, 350, 70], fn: function (A, P) { typeOver(A, P, 1, [33, 286, 346, 66], "2단원 3차시 p.32~35, 모둠 나눔", { radius: 14, delay: 700 }); } },
      { t: '<span class="k">저장</span> → <span class="q">「저장됨」</span>', s: 1, r: [324, 362, 57, 44], z: 1.9, fn: function (A, P) {
        var b = h('<div class="over" style="left:31px;top:370px;width:200px;height:28px;background:#fff;font:700 15px/28px var(--body);color:#1f8a5a">저장됨 · 16:42</div>');
        P.el(1).appendChild(b); A.go(b, [{ opacity: 0 }, { opacity: 1 }], { d: 300, delay: 600 });
      } },
      { t: '<span class="q">「진도 지도」</span> → <span class="q">「한 달」</span>: 반마다 이달 수업이 동그라미로 <span class="nw">NEW</span>', s: 2, r: [17, 249, 378, 118], newf: true },
      { t: '점선 동그라미를 누르면 <b>그 주를 바로</b> 적습니다. 한 주를 다 채우면 ⭐', s: 2, r: [27, 508, 28, 28], newf: true, z: 1.95 }
    ],
    note: { html: "<span>지난 수업은 위쪽 날짜의 ‹ ›로 옮겨 가며 적습니다. 진도 지도는 <b>본인 것만</b> 보입니다(관리자도 다른 선생님 진도를 열지 않습니다).</span>" },
    screens: [shot("home"), shot("progress"), shot("progress-month")],
    notes: "진도는 <b>한 줄이면 충분</b>합니다. 이번 주에 생긴 <b>「한 달」 보기</b>는 반마다 이달 수업을 동그라미로 보여 주고, 아직 안 적은 칸은 점선입니다. 누르면 그 주를 바로 적을 수 있어서 밀린 기록을 채우기 편합니다. 진도 지도는 본인만 봅니다."
  });

  // ════════════════════════════════════════════════════════════
  // 3부 · 넵
  // ════════════════════════════════════════════════════════════
  opener({
    part: 3, art: "nep", min: 6, lines: ["읽었는지, 했는지", "<em>한눈에</em> 보입니다"],
    was: "부탁하고 나서 읽었는지 몰라 다시 묻기", now: "버튼 하나로 답하고, 처리 현황이 보입니다",
    notes: "3부는 업무 연락 도구 <b>넵</b>입니다. 메신저와 다른 점은 <b>받는 사람이 버튼 하나로 답하고, 보낸 사람은 누가 했는지 바로 본다</b>는 것입니다."
  });

  D.add({
    id: "nepIntro", part: 3, label: "넵 알아보기", kind: "light", min: 1, trans: "zoom",
    notes: "넵은 네 가지입니다. <b>알림</b>은 읽으면 끝, <b>확인요청</b>은 [넵], <b>업무요청</b>은 [완료], <b>제출요청</b>은 [제출]. 보내는 시각도 배려합니다 — 받는 분이 <b>수업 중이면 교시가 끝난 뒤</b>, <b>근무 시간 밖이면 다음 근무일 아침</b>에 도착합니다. 긴급만 바로 울리고 한 달 5번까지입니다.",
    html: '<div class="chiprow"><span class="chip">넵</span></div><h2 class="title">요청은 넵으로 보내고, <em>답은 버튼 하나로</em></h2>' +
      '<div class="pills nepts"><span class="p"><b>알림</b>읽으면 끝</span><span class="p"><b>확인요청</b>[넵]</span><span class="p"><b>업무요청</b>[완료] · 마감</span><span class="p"><b>제출요청</b>[제출] · 마감</span></div>' +
      '<div class="card side abs" style="left:120px"><p class="who2">보내는 사람</p><h3>2학기 평가계획서 제출</h3><p>제출요청 · 2학년 담임 10명</p><div class="meter"><div class="lb"><span>처리</span><span><b class="mtr">3</b> / 10</span></div><div class="tr"><i style="width:100%"></i></div></div></div>' +
      '<i class="abs lane"></i><div class="abs gate"><span class="gt">3교시<br>수업 중</span></div><div class="abs env"></div>' +
      '<div class="card side abs" style="left:1280px"><p class="who2">받는 사람</p><h3>2학기 평가계획서 제출</h3><p>제출요청 · 마감 10월 9일(금)</p><div class="rbtn">제출<span class="dn">넵 처리했습니다</span></div></div>' +
      '<div class="pills rules" style="left:120px;top:800px"><span class="p"><b>수업 중</b>교시가 끝나면 도착</span><span class="p"><b>근무 시간 밖</b>다음 근무일 아침</span><span class="p warn">긴급 · 바로 울림 (한 달 5번)</span></div>',
    build: function (el, A) {
      return [
        function (A) {
          A.wipe(".chiprow > *"); A.kinetic(".title", { delay: 100, each: 24 });
          A.pop(".nepts .p", { delay: 500, each: 90 });
          A.rise(".side", { delay: 800, each: 200 });
          A.go(".meter .tr i", [{ transform: "scaleX(0)" }, { transform: "scaleX(.3)" }], { d: 900, delay: 1200 });
          A.go(".lane", [{ opacity: 0 }, { opacity: 1 }], { d: 500, delay: 1000 });
          A.go(".gate", [{ opacity: 0, transform: "scale(.8)" }, { opacity: 1, transform: "none" }], { d: 600, delay: 1100, e: E.back });
          A.go(".env", [{ opacity: 0 }, { opacity: 1 }], { d: 400, delay: 1200 });
          A.hide(".rules");
        },
        function (A) {
          A.go(".env", [{ transform: "none" }, { transform: "translateX(170px)" }], { d: 900, e: E.cam });
          A.sfx("swish", { v: 0.1 }); A.sfx("swish", { v: 0.1, delay: 1900, pan: 0.4 });
          A.go(".gate", [{ transform: "scale(1)" }, { transform: "scale(1.08)" }, { transform: "scale(1)" }], { d: 400, delay: 900 });
          A.later(function () { el.querySelector(".gate").classList.add("open"); el.querySelector(".gt").innerHTML = "교시<br>끝"; A.sfx("pop"); }, 1700);
          A.go(".env", [{ transform: "translateX(170px)" }, { transform: "translateX(560px)", opacity: 1 }, { transform: "translateX(640px) scale(.4)", opacity: 0 }], { d: 1100, delay: 1900, e: E.cam });
          A.later(function () { el.querySelectorAll(".side")[1].classList.add("hot"); }, 2900);
        },
        function (A) {
          var b = el.querySelector(".rbtn");
          A.go(b, [{ transform: "scale(1)" }, { transform: "scale(.94)" }, { transform: "scale(1)" }], { d: 360, e: E.out });
          A.go(".rbtn .dn", [{ opacity: 0 }, { opacity: 1 }], { d: 300, delay: 200 });
          A.sfx("check", { delay: 200 });
          A.later(function () { A.count(".mtr", 3, 4, 500); }, 600);
          A.go(".meter .tr i", [{ transform: "scaleX(.3)" }, { transform: "scaleX(.4)" }], { d: 700, delay: 600, e: E.back });
        },
        function (A) {
          A.go(".rules", [{ opacity: 1 }, { opacity: 1 }], { d: 1 });
          A.pop(".rules .p", { each: 120 });
          A.lt({ tag: "넵", title: "받는 분의 수업 시간을 피해 도착합니다", sub: "긴급만 바로 울림 · 한 달 5번까지", delay: 400, style: "left:auto;right:120px;bottom:60px" });
        }
      ];
    }
  });

  practice({
    id: "p6", part: 3, num: 6, label: "실습 6 · 나에게 업무요청", min: 2, practiceMin: 2,
    chips: [{ t: "실습 6 · 넵" }, { t: "2분", c: "ghost" }], title: "나에게 업무요청 보내기",
    steps: [
      { t: '<span class="k">더보기</span> → <span class="q">「학교」</span> 묶음의 <span class="k">넵</span>', s: 0, r: [17, 269, 378, 56] },
      { t: '<span class="k">나에게</span>: 나에게 보내는 할 일 메모', s: 1, r: [322, 665, 73, 45], z: 1.9 },
      { t: '유형은 <span class="q">「업무요청」</span> (받으면 <span class="k">완료</span>를 누름)', s: 2, r: [178, 117, 80, 44], z: 1.9 },
      { t: '제목 <span class="q">「연수 실습: 진도 적기」</span>, 마감 날짜 고르기', s: 2, r: [31, 224, 350, 48] },
      { t: '맨 아래로 내려 <span class="k">보내기</span>', s: 2 }
    ],
    note: { tone: "warn", html: "<span><b>근무시간이 끝난 뒤</b>에 보내면 다음 근무일 아침에 도착합니다. 도착하면 [완료]를 눌러 보세요.</span>" },
    screens: [shot("more-bottom"), shot("nep"), shot("nep-new")],
    notes: "「나에게」는 <b>나에게 보내는 할 일 메모</b>입니다. 밤에 써 두면 다음 근무일 아침에 도착하고, [완료]를 누를 때까지 남습니다. 지금 직접 한 건 보내 보세요."
  });

  practice({
    id: "audience", part: 3, num: null, label: "받는 사람 고르기", min: 0.7, isNew: true,
    chips: [{ t: "NEW", c: "new" }, { t: "넵·서명 공통", c: "ghost" }], title: "받는 사람을 <em>부서·교과·직책</em>으로",
    steps: [
      { t: '<span class="q">전체 · 부서 · 교과 · 직책 · 학년 담임 · 개인</span> 여섯 가지로 고릅니다', s: 0, r: [31, 293, 350, 94], newf: true },
      { t: '<span class="k">직책</span> → <span class="q">부장단 12</span> · <span class="q">교과 주임단 14</span>', s: 0, r: [31, 397, 196, 44], newf: true, z: 1.9 },
      { t: '고르면 <b>이름이 펼쳐져</b> 누구에게 가는지 바로 보입니다', s: 0, r: [31, 473, 350, 98], newf: true },
      { t: '나는 빼고 <b>11명에게</b>', s: 0, r: [31, 575, 120, 28], z: 1.9 },
      { t: '같은 고르기를 <b>회의 서명부·파일 서명</b>에서도 씁니다', s: 0 }
    ],
    note: { html: "<span><b>부서</b> = 업무부서 9곳 + 1·2·3학년부 + 행정실 · <b>학년부</b> = 학년부장과 담임 · <b>교과</b> = 국어과처럼 교과별</span>" },
    screens: [shot("nep-roles")],
    lt: { tag: "NEW", title: "받는 사람 고르기", sub: "2학기 업무분장·명렬표로 만든 교직원 조직표" },
    notes: "이번 주에 <b>교직원 조직표</b>(2학기 업무분장·명렬표)를 넣어서, 받는 사람을 부서·교과·직책으로 고를 수 있습니다. 고르면 <b>이름이 펼쳐져</b> 잘못 보낼 걱정이 줄어듭니다. 연락처는 담지 않았습니다."
  });

  practice({
    id: "p7", part: 3, num: 7, label: "실습 7 · 받은 넵 처리", min: 2, practiceMin: 2,
    chips: [{ t: "실습 7 · 넵" }, { t: "짝 실습", c: "ghost" }], title: "받은 넵 처리하기",
    steps: [
      { t: '알림을 누르거나 <span class="k">넵</span> → <span class="q">「받은」</span>에서 엽니다', s: 0, r: "[data-t=item]" },
      { t: '버튼은 하나: 확인요청 <span class="k">넵</span> · 업무요청 <span class="k">완료</span> · 제출요청 <span class="k">제출</span>', s: 1, r: "[data-t=done]" },
      { t: '<span class="q">「넵 처리했습니다」</span> — 보낸 사람 화면에 바로 반영', s: 1, fn: function (A, P) { var b = P.el(1).querySelector("[data-t=done] .dn"); A.go(b, [{ opacity: 0 }, { opacity: 1 }], { d: 360, delay: 300 }); A.sfx("check", { delay: 300 }); } },
      { t: '(보낸 사람) <span class="q">「보낸」</span>에서 누가 아직인지 보고 <span class="k">다시 알림</span>', s: 2, r: "[data-t=remind]" }
    ],
    note: { html: "<span><b>짝 실습</b> 옆 선생님께 「확인요청」을 보내고 서로 [넵]을 눌러 봅니다. 받는 사람: 「개인」 → 이름 찾기</span>" },
    screens: [M.nepRecv, M.nepDetail, M.nepSent],
    notes: "짝 실습입니다. 옆 선생님께 확인요청을 보내고 서로 [넵]을 눌러 보면, 보낸 쪽 「보낸」 탭 숫자가 바로 올라가는 걸 볼 수 있습니다. 다시 알림은 아직 안 한 분께만 갑니다."
  });

  // ════════════════════════════════════════════════════════════
  // 4부 · 디지털 서명 (NEW)
  // ════════════════════════════════════════════════════════════
  opener({
    part: 4, art: "record", min: 8, isNew: true, lines: ["서명 받으러", "<em>다니지 않아도</em> 됩니다"],
    was: "회의 서명부·신고서를 들고 교무실을 한 바퀴", now: "내 서명 한 번 등록, 문서마다 한 번 누르기",
    notes: "4부는 <b>이번 주에 새로 생긴 디지털 서명</b>입니다. 내 서명을 한 번만 등록해 두면 회의 서명부, 파일 서명, 수업교체 신고서에서 버튼 한 번으로 서명합니다. 회의 서명부는 <b>AI에게 말로</b>도 만들 수 있습니다."
  });

  D.add({
    id: "signIntro", part: 4, label: "디지털 서명 한눈에", kind: "light", min: 1, isNew: true, trans: "zoom",
    notes: "핵심은 <b>한 번 등록, 한 번 누르기</b>입니다. 서명은 <b>본인만 보고 바꿀 수 있고 관리자도 못 봅니다.</b> 문서에는 선생님이 그 문서에서 직접 누를 때만 들어가고, 누른 순간의 그림을 문서에 따로 남겨서 나중에 서명을 바꿔도 낸 문서는 그대로입니다. 그림 서명이라 학교 내부 문서용이며 <b>에듀파인 전자결재는 그대로</b>입니다.",
    html: '<div class="chiprow"><span class="chip new">NEW</span><span class="chip">디지털 서명</span></div><h2 class="title">한 번 등록하고, <em>문서마다 한 번 누르기</em></h2>' +
      '<div class="abs card hub"><h3>내 서명 <span class="badge-new">한 번만</span></h3><div class="pad"><span class="pen" style="opacity:0">홍길동</span><span class="stamp-mk" style="opacity:0">홍길<br>동인</span></div><p>손가락으로 그린 손 서명, 또는 종이 도장 사진. 하나를 기본으로.</p></div>' +
      '<svg class="curve" viewBox="0 0 320 560"><path pathLength="100" d="M0 120 C 160 120, 160 70, 320 70"/><path pathLength="100" d="M0 120 C 160 120, 160 270, 320 270"/><path pathLength="100" d="M0 120 C 160 120, 160 470, 320 470"/></svg>' +
      '<div class="abs card dest" style="top:340px"><h3>회의 서명부</h3><p>참석자에게 알림 → 서명 → <b>PDF</b> 한 장</p><span class="tapb">내 서명으로 서명하기</span></div>' +
      '<div class="abs card dest" style="top:540px"><h3>파일로 서명 받기</h3><p>서식의 (서명)·(인) 자리에 여러 선생님 서명</p><span class="tapb">내 서명으로 서명하기</span></div>' +
      '<div class="abs card dest" style="top:740px"><h3>수업교체 신고서</h3><p>신청할 때 내 서명, 상대는 <b>수락 = 서명</b></p><span class="tapb">내 서명으로 이 안 요청</span></div>' +
      '<div class="pills sgp" style="left:120px;top:870px;width:860px"><span class="p">본인만 보고 바꿈 (관리자도 못 봄)</span><span class="p">내가 누를 때만 문서에 들어감</span></div>',
    build: function (el, A) {
      return [
        function (A) {
          A.wipe(".chiprow > *"); A.kinetic(".title", { delay: 100, each: 24 });
          A.rise(".hub", { delay: 450 });
          write(A, ".hub .pen", { delay: 1100, d: 1300 });
          stampIn(A, ".hub .stamp-mk", { delay: 2300 });
          A.hide(".dest");
          A.hide(".sgp");
        },
        function (A) {
          A.stagger(".curve path", [{ strokeDashoffset: 101 }, { strokeDashoffset: 0 }], { d: 700, each: 160, e: E.cam });
          A.stagger(".dest", [{ opacity: 0, transform: "translateX(60px)" }, { opacity: 1, transform: "none" }], { d: 760, delay: 350, each: 160 });
          A.pop(".dest .tapb", { delay: 800, each: 160 });
        },
        function (A) {
          A.go(".sgp", [{ opacity: 1 }, { opacity: 1 }], { d: 1 });
          A.pop(".sgp .p", { each: 120 });
          A.lt({ tag: "약속", title: "서명은 선생님이 누를 때만 들어갑니다", sub: "그림 서명 · 학교 내부 문서용 · 에듀파인 전자결재는 그대로", delay: 300, style: "left:auto;right:120px;bottom:40px" });
        }
      ];
    }
  });

  practice({
    id: "p8", part: 4, num: 8, label: "실습 8 · 내 서명 등록", min: 3, practiceMin: 3, isNew: true,
    chips: [{ t: "실습 8 · 디지털 서명" }, { t: "NEW", c: "new" }], title: "내 서명 등록하기",
    steps: [
      { t: '<span class="k">더보기</span> → <span class="q">「도구」</span> 묶음의 <span class="k">내 서명</span>', s: 0, r: [17, 473, 378, 56] },
      { t: '<span class="q">「손 서명」</span> 칸에 손가락으로 이름을 쓰고 <span class="k">저장</span>. 휴대폰을 가로로 돌리면 넓게', s: 1, r: [33, 128, 346, 128], fn: function (A, P) {
        var p = h('<span class="pen over" style="left:120px;top:150px;font-size:80px;opacity:0">홍길동</span>'); P.el(1).appendChild(p); write(A, p, { delay: 700, d: 1500 });
      } },
      { t: '마음에 안 들면 <span class="k">다시 그리기</span>. 빨리 그으면 가늘게, 천천히 그으면 굵게', s: 1, r: [33, 312, 100, 44], z: 1.9 },
      { t: '(선택) <span class="q">「도장」</span>: 종이에 찍은 도장을 사진으로. 흰 바탕은 저절로 지워집니다', s: 1, r: [33, 436, 346, 128], fn: function (A, P) {
        var s = h('<span class="stamp-mk over" style="left:162px;top:456px;width:88px;height:88px;font-size:24px;opacity:0">홍길<br>동인</span>'); P.el(1).appendChild(s); stampIn(A, s, { delay: 700 });
      } },
      { t: '둘 다 있으면 하나를 <span class="k">기본으로 쓰기</span>', s: 1, r: [141, 312, 112, 44], z: 1.9 }
    ],
    note: { html: "<span>서명은 <b>본인만</b> 보고 바꿀 수 있습니다(관리자도 볼 수 없습니다). 문서에는 선생님이 그 문서에서 누를 때만 들어갑니다.</span>" },
    screens: [shot("more-bottom"), shot("signature")],
    notes: "모두 지금 <b>손 서명을 하나 등록</b>해 주세요. 손가락으로 쓰면 되고, 휴대폰을 가로로 돌리면 칸이 넓어집니다. 도장 사진은 선택입니다 — 종이에 찍은 도장을 찍어 올리면 흰 바탕을 지워 깔끔하게 만들어 줍니다. <b>화면의 「홍길동」은 예시</b>입니다."
  });

  practice({
    id: "sheet", part: 4, num: null, label: "회의 서명부 (보기만)", min: 1.5, isNew: true,
    chips: [{ t: "NEW", c: "new" }, { t: "보기만 · 회의 서명부", c: "watch" }], title: "회의 서명부: <em>알림 한 번, 서명 한 번</em>",
    steps: [
      { t: '<span class="k">더보기</span> → <span class="k">서명</span> → <span class="q">「회의 서명부」</span>', s: 0, r: [212, 76, 184, 69], z: 1.9 },
      { t: '<span class="q">교과협의회 명단 불러오기</span>에서 교과를 고르면 명단과 회의 이름이 저절로', s: 1, r: [31, 96, 350, 216], newf: true },
      { t: '날짜·시간·장소를 적고 <span class="k">서명부 만들고 알림 보내기</span>', s: 1, r: [31, 500, 350, 140] },
      { t: '참석자는 알림을 받고 <span class="k">내 서명으로 서명하기</span> 한 번', s: 2, r: "[data-t=sign]", fn: function (A, P) { var b = P.el(2).querySelector("[data-t=sign] .dn"); A.go(b, [{ opacity: 0 }, { opacity: 1 }], { d: 360, delay: 1300 }); A.later(function () { A.sfx("stamp"); }, 1300); } },
      { t: '만든 사람은 <span class="k">PDF 내려받기</span>: 연번·소속·성명·서명·서명 시각', s: 2, fn: function (A, P, el) {
        var pdf = el.querySelector(".pdf");
        A.sfx("swish", { v: 0.14, delay: 200 });
        A.go(pdf, [{ transform: "translateY(900px) rotate(8deg)", opacity: 1 }, { transform: "rotate(-2.5deg)", opacity: 1 }], { d: 1000, delay: 200, e: E.out });
        write(A, el.querySelectorAll(".pdf .sig .pen"), { delay: 1200, d: 650, each: 380 });
        A.stagger(el.querySelectorAll(".pdf .tm2"), [{ opacity: 0 }, { opacity: 1 }], { delay: 1500, each: 380, d: 200 });
      } }
    ],
    note: { html: "<span>교과협의록 화면의 <b>[참석 서명부 만들기]</b>, AI 협의록 카드의 <b>[참석 서명 받기]</b>, <b>AI에게 말로</b>도 만듭니다(다음 장면). 같은 교과·같은 날 서명부는 하나만.</span>" },
    extra: '<div class="abs pdf" style="opacity:0"><span class="ex">예시</span><h4>회의 참석 서명부</h4>' +
      '<table class="info"><tr><th>회의명</th><td>종교과 교과협의회</td></tr><tr><th>일시</th><td>2026. 10. 7.(수) 7교시</td></tr><tr><th>장소</th><td>아가페교실</td></tr></table>' +
      '<table style="margin-top:18px"><tr><th style="width:70px">연번</th><th>소속</th><th>성명</th><th>서명</th><th style="width:120px">서명 시각</th></tr>' +
      [["1", "교과", "김하늘", "15:42"], ["2", "교목실", "홍길동", "15:44"], ["3", "교과", "박서준", "15:47"], ["4", "교과", "이지민", "15:51"]].map(function (r) {
        return "<tr><td>" + r[0] + "</td><td>" + r[1] + "</td><td>" + r[2] + '</td><td class="sig"><span class="pen" style="opacity:0">' + r[2] + '</span></td><td class="tm2 mono" style="opacity:0">' + r[3] + "</td></tr>";
      }).join("") + '</table><div class="foot"><span>AI 교무실 · 명지중학교</span><span>1 / 1</span></div></div>',
    screens: [shot("sign"), shot("sign-meeting"), M.signTap],
    lt: { tag: "보기만", title: "회의 서명부", sub: "만들면 참석자에게 실제 알림이 가요 · 오늘은 화면으로만", tone: "warn" },
    notes: "회의 서명부는 <b>만드는 순간 참석자에게 알림이 가기 때문에 오늘은 화면으로만</b> 봅니다. 교과를 고르면 교과협의록의 명단을 불러와 이름과 회의 이름을 채워 줍니다. 서명 그림은 화면에는 보이지 않고 <b>PDF에만</b> 들어갑니다. 서명 안 한 분께 [알림 다시 보내기], 다 끝나면 [마감]도 있습니다."
  });

  practice({
    id: "aiSheet", part: 4, num: null, label: "AI에게 서명부 부탁하기 (보기만)", min: 1, isNew: true,
    chips: [{ t: "NEW", c: "new" }, { t: "보기만 · AI로 회의 서명부", c: "watch" }], title: "회의 서명부도 <em>AI에게 말로</em>",
    steps: [
      { t: '<span class="k">AI</span>에게 말로: <span class="q">「…10월 교직원 협의회 해. 전체 교직원 참석 서명부 만들어 줘」</span>', s: 0, r: [16, 352, 303, 112], fn: function (A, P) {
        // 긴 말이라 입력칸을 아래로 늘려 보여 준다(넘친 글자가 화면 글씨와 겹치지 않게)
        typeOver(A, P, 0, [16, 352, 303, 112], "10월 14일 15시 30분 본관 3층 회의실에서 10월 교직원 협의회 해. 전체 교직원 참석 서명부 만들어 줘", { delay: 600, cps: 24, bg: "#fff;border:1px solid #dbe2ea" });
      } },
      { t: '<span class="q">「회의 서명부 초안」</span> 카드: 이름·날짜·시간·장소를 바로 고칩니다', s: 1, r: [27, 229, 358, 201] },
      { t: '<span class="q">「서명할 사람 74명」</span> → <span class="k">명단 보기</span>로 누가 들어가는지 확인', s: 1, r: [31, 437, 350, 120], newf: true },
      { t: '서명할 사람: 전체·부서·교과·부장단·담임·이름. 교과협의회는 <b>교과협의록 명단</b> 그대로', s: 1 },
      { t: '<b>오늘은 <span class="k">서명부 만들고 알림 보내기</span>를 누르지 않습니다</b>', g: '<span class="k">서명부 만들고 알림 보내기</span>를 누르면 서명부가 만들어지고 참석자에게 서명 요청 알림이 갑니다', s: 1, r: [31, 568, 169, 40], warn: "참석자에게 실제 서명 요청 알림이 갑니다", z: 1.9 }
    ],
    note: { html: "<span>회의 이름·날짜·서명할 사람 중 <b>빠진 것만</b> AI가 되묻습니다. 만든 뒤 현황·다시 알림·PDF는 <b>「서명」 메뉴</b>에서.</span>" },
    screens: [shot("ai"), shot("ai-sign")],
    lt: { tag: "보기만", title: "AI에게 서명부 부탁하기", sub: "카드의 버튼을 누르면 참석자에게 실제 알림이 가요", tone: "warn" },
    notes: "같은 회의 서명부를 <b>AI에게 말로</b> 부탁할 수도 있습니다. 회의 이름, 날짜, 누가 서명할지만 말하면 카드가 뜨고, 빠진 것이 있으면 AI가 그것만 되묻습니다. 카드에서 이름·날짜·시간·장소를 고치고 <b>[명단 보기]로 누가 들어가는지 꼭 확인</b>한 뒤 [서명부 만들고 알림 보내기]를 누릅니다. AI가 혼자 만들거나 알림을 보내는 일은 없습니다. 오늘은 실제 알림이 가니 <b>누르지 않습니다</b>."
  });

  practice({
    id: "signfile", part: 4, num: null, label: "파일로 서명 받기 (보기만)", min: 1.2, isNew: true,
    chips: [{ t: "NEW", c: "new" }, { t: "보기만 · 파일 서명", c: "watch" }], title: "서식 파일에 <em>여러 선생님 서명</em> 받기",
    steps: [
      { t: '<span class="k">서명</span> → <span class="q">「파일로 서명 받기」</span>', s: 0, r: [16, 76, 185, 69], z: 1.9 },
      { t: '서식 파일 올리기: <b>PDF·한글(hwpx)</b>, 20MB까지', s: 1, r: [31, 133, 350, 48] },
      { t: '서명할 사람을 고르고 <span class="k">다음: 서명 자리 확인</span>', s: 1, r: [31, 556, 350, 44] },
      { t: '문서의 <span class="q">(서명)</span>·<span class="q">(인)</span> 자리를 찾아 <b>이름 가까운 분께 저절로</b> 배정', s: 1, fn: function (A, P, el) {
        A.sfx("swish", { v: 0.12, pan: 0.5 }); A.sfx("swish", { v: 0.12, pan: -0.4, delay: 380 });
        [0, 1, 2].forEach(function (k) { A.sfx("pluck", { i: 3 + k, v: 0.08, delay: 1250 + k * 260 }); });
        A.go(el.querySelector(".cam .phone"), [{ transform: "none", opacity: 1 }, { transform: "translateX(560px) rotate(8deg)", opacity: 0 }], { d: 700, e: E.in });
        var doc = el.querySelector(".doc");
        A.go(doc, [{ transform: "translateX(-140px) rotate(-6deg)", opacity: 0 }, { transform: "rotate(-1.5deg)", opacity: 1 }], { d: 900, delay: 350, e: E.out });
        A.stagger(el.querySelectorAll(".doc .rg"), [{ opacity: 0, transform: "scale(1.4)" }, { opacity: 1, transform: "none" }], { d: 500, delay: 1200, each: 260, e: E.back });
        A.stagger(el.querySelectorAll(".doc .who3"), [{ opacity: 0, transform: "translate(-12px,-50%)" }, { opacity: 1, transform: "translate(0,-50%)" }], { d: 500, delay: 1500, each: 260 });
      } },
      { t: '모두 서명하면 <span class="q">「모두 서명했습니다」</span> → <span class="k">서명된 파일 받기</span>', s: 1, fn: function (A, P, el) {
        A.stagger(el.querySelectorAll(".doc .mk2 .t"), [{ opacity: 1 }, { opacity: 0 }], { d: 260, each: 420 });
        A.stagger(el.querySelectorAll(".doc .rg, .doc .who3"), [{ opacity: 1 }, { opacity: 0 }], { d: 260, each: 140 });
        write(A, el.querySelectorAll(".doc .mk2 .pen"), { delay: 150, d: 700, each: 420 });
        A.sfx("check", { delay: 1750 });
        A.go(el.querySelector(".doc .done"), [{ opacity: 0, transform: "translateY(20px)" }, { opacity: 1, transform: "none" }], { d: 600, delay: 1700, e: E.back });
      } }
    ],
    note: { html: "<span>옛 한글 파일(.hwp)은 한글에서 <b>「다른 이름으로 저장 → HWPX」</b>로 올립니다. 서명은 순서 없이 동시에, 완성 파일은 <b>요청한 분과 관리자만</b> 받습니다.</span>" },
    extra: "",
    screens: [shot("sign"), shot("sign-file")],
    enter: function (A, P, el) {
      var doc = h('<div class="doc" style="opacity:0"><h4>교내 행사 협조 확인서</h4><div class="ln2" style="width:92%"></div><div class="ln2" style="width:84%"></div><div class="ln2" style="width:88%"></div><div class="ln2" style="width:60%"></div>' +
        '<p style="margin-top:26px;text-align:center">위 내용을 확인합니다.</p><p style="text-align:center;color:#555">2026년 10월 7일</p>' +
        '<div class="sl">담당교사 김하늘 <span class="mk2"><span class="t">(인)</span><span class="pen">김하늘</span><i class="rg"></i><b class="who3">김하늘 ▾</b></span></div>' +
        '<div class="sl">학년부장 박서준 <span class="mk2"><span class="t">(서명)</span><span class="pen">박서준</span><i class="rg"></i><b class="who3">박서준 ▾</b></span></div>' +
        '<div class="sl">교감 <span class="mk2"><span class="t">(서명 또는 인)</span><span class="pen">이지민</span><i class="rg"></i><b class="who3">이지민 ▾</b></span></div>' +
        '<div class="done"><span>✓ 모두 서명했습니다</span><span class="mono">협조확인서_서명.hwpx</span></div></div>');
      el.querySelector(".cam").appendChild(doc);
    },
    lt: { tag: "보기만", title: "파일로 서명 받기", sub: "요청하면 서명할 분들께 실제 알림이 가요", tone: "warn" },
    notes: "새 서명 일이 생길 때마다 기능을 따로 만들지 않도록, <b>아무 서식 파일에나</b> 서명을 받을 수 있게 했습니다. 문서에서 「(서명)」 「(인)」 같은 표시를 찾아 그 앞의 이름과 짝지어 주고, 자리마다 누구인지 고칠 수 있습니다. 완성 파일은 <b>원래 형식 그대로</b>(PDF는 PDF, 한글은 한글) 받습니다. 화면의 문서와 이름은 예시입니다."
  });

  // ════════════════════════════════════════════════════════════
  // 5부 · AI에게 부탁하기
  // ════════════════════════════════════════════════════════════
  opener({
    part: 5, art: "ai", min: 8, lines: ["묻고,", "<em>부탁하세요</em>"],
    was: "자료실 파일을 열어 찾고, 신청 시트를 열어 직접 적기", now: "말로 묻고 부탁하면, 확인 카드로 처리",
    notes: "5부는 <b>AI 도우미</b>입니다. 이번 주부터 아래 탭 가운데의 볼록한 AI 버튼으로 바로 엽니다."
  });

  D.add({
    id: "aiIntro", part: 5, label: "AI에게 부탁하기 알아보기", kind: "light", min: 1, trans: "zoom",
    notes: "세 단계입니다. <b>묻기</b> — 시간표·급식·학사일정은 물론 자료실 한글·PDF 파일 본문까지 찾아 답하고 출처를 붙입니다. <b>부탁하기</b> — 가정통신문, 기기 수리 같은 신청을 말로 하면 필요한 것만 되묻습니다. <b>확인 카드</b> — 카드에서 고친 뒤 [등록]을 눌러야 실제로 적힙니다. <b>오늘 실습은 카드가 뜨는 데까지만</b> 합니다.",
    html: '<div class="chiprow"><span class="chip">AI에게 부탁하기</span></div><h2 class="title">묻고, 부탁하고, <em>확인 카드에서 정합니다</em></h2>' +
      '<div class="abs card askc" style="left:120px"><span class="sn">1</span><h3>묻기</h3><p>자료실의 한글·PDF <b>본문까지</b> 찾아 답하고, 답 끝에 출처 링크가 붙습니다.</p><div class="chips"><span>빈 교실</span><span>급식</span><span>학사일정</span><span>담임</span><span>자료실 내용</span><span>생기부 기재요령</span></div></div>' +
      '<div class="abs card askc" style="left:700px"><span class="sn">2</span><h3>부탁하기</h3><p>말로 부탁하면 AI가 <b>필요한 것만</b> 되묻고 초안을 만듭니다.</p><div class="chips"><span>가정통신문</span><span>통신문 번호</span><span>기기 수리</span><span>도서관 이용</span><span>희망도서</span><span>교과협의록</span><span>회의 서명부</span><span>수업교체</span></div></div>' +
      '<div class="abs card askc confirm" style="left:1280px"><span class="sn">3</span><h3>확인 카드</h3><p>카드에서 고친 뒤 <b>[등록]</b>을 눌러야 실제로 적힙니다. 누르기 전 초안은 나만 봅니다.</p></div>' +
      '<div class="abs aibar"><div class="strip"></div><p><span class="badge-new">NEW</span>&nbsp; 아래 탭 가운데 볼록한 AI 버튼</p></div>',
    build: function (el, A) {
      return [
        function (A) {
          A.wipe(".chiprow > *"); A.kinetic(".title", { delay: 100, each: 24 });
          A.hide(".askc");
          A.hide(".aibar");
          A.later(function () { reveal(0); }, 700);
        },
        function (A) { reveal(1); },
        function (A) { reveal(2); A.go(".aibar", [{ opacity: 0, transform: "translateY(30px)" }, { opacity: 1, transform: "none" }], { d: 700, delay: 500 }); },
        function (A) { A.lt({ tone: "warn", tag: "오늘 실습은", title: "카드가 뜨는 데까지만 합니다", sub: "등록·번호 받기·요청 단추는 누르면 실제 시트·번호·선생님께 반영됩니다", style: "left:auto;right:120px" }); }
      ];
      function reveal(i) {
        var c = el.querySelectorAll(".askc")[i];
        A.go(c, [{ opacity: 0, transform: "translateY(50px) scale(.96)" }, { opacity: 1, transform: "none" }], { d: 800, e: E.out });
        A.pop(c.querySelectorAll(".chips span"), { delay: 300, each: 60 });
      }
    }
  });

  practice({
    id: "p9", part: 5, num: 9, label: "실습 9 · 자료실 내용 묻기", min: 2, practiceMin: 2,
    chips: [{ t: "실습 9 · AI에게 부탁하기" }, { t: "2분", c: "ghost" }], title: "자료실 내용을 AI에게 묻기",
    steps: [
      { t: '아래 탭 가운데 <span class="k">AI</span> 버튼 <span class="nw">NEW</span>', s: 0, r: [158, 768, 96, 88], newf: true, z: 1.8 },
      { t: '칸에 묻습니다: <span class="q">「2학기 평가계획 수정은 어떻게 해?」</span>', s: 0, r: [16, 352, 303, 70], fn: function (A, P) { typeOver(A, P, 0, [18, 354, 299, 66], "2학기 평가계획 수정은 어떻게 해?", { delay: 700 }); } },
      { t: 'AI가 자료실 파일의 <b>본문까지</b> 찾아 읽고 답합니다', s: 1 },
      { t: '답 끝의 <span class="q">「자료 제목(부서) N쪽」</span> 링크로 원문을 바로 엽니다', s: 1, r: [40, 640, 160, 50] },
      { t: '대화는 본인만 보고, <span class="k">대화 기록 지우기</span>로 언제든 지웁니다', s: 1 }
    ],
    note: { tone: "warn", html: "<span><b>학생 이름·실제 기록 문장은 넣지 않습니다.</b> 질문은 외부 AI로 전송되고, 하루 60개까지입니다.</span>" },
    screens: [shot("ai"), shot("ai-ask")],
    notes: "자료실에 올라온 한글·PDF 파일의 <b>본문까지</b> 읽고 답하기 때문에, 어느 폴더에 있었는지 몰라도 찾을 수 있습니다. 답 끝 출처 링크로 원문을 꼭 확인하시라고 말씀드립니다. <b>학생 이름이나 실제 생기부 문장은 넣지 않습니다.</b>"
  });

  practice({
    id: "p10", part: 5, num: 10, label: "실습 10 · 가정통신문 부탁하기", min: 2.2, practiceMin: 2,
    chips: [{ t: "실습 10 · AI에게 부탁하기" }, { t: "2분", c: "ghost" }], title: "가정통신문을 부탁하기",
    steps: [
      { t: '추천 칩 <span class="q">「가정통신문 초안 써 줘」</span>를 누르거나 직접 말합니다', s: 0, r: [31, 231, 131, 36], z: 1.9 },
      { t: 'AI가 묻는 대로 주무부서·내용을 답하면 <span class="q">「가정통신문 초안」</span> 카드', s: 1, r: [20, 205, 372, 40] },
      { t: '제목·발송일·본문을 카드에서 바로 고칩니다. 양식의 첫 문장은 저절로', s: 1, r: [31, 521, 350, 225] },
      { t: '<b>오늘은 <span class="k">번호 받고 문서 만들기</span>를 누르지 않습니다</b>', g: '<span class="k">번호 받고 문서 만들기</span>를 누르면 실제 가정통신문 번호가 하나 쓰이고 학교 양식 한글 파일이 만들어집니다', s: 1, r: [31, 756, 146, 40], warn: "실제 가정통신문 번호가 하나 쓰입니다", z: 1.9 },
      { t: '(실제로 쓸 때) 번호가 붙은 학교 양식 <b>한글 파일</b>을 받습니다', s: 1 }
    ],
    screens: [shot("ai"), shot("ai-letter")],
    notes: "가정통신문은 주무부서와 일시·대상·신청 방법만 말하면 학교 양식대로 초안을 씁니다. 실제로 쓸 때 [번호 받고 문서 만들기]를 누르면 <b>통신문 번호를 받고 한글 파일(.hwpx)</b>까지 만들어 줍니다. 오늘은 번호가 실제로 쓰이니 누르지 않습니다."
  });

  practice({
    id: "p11", part: 5, num: 11, label: "실습 11 · 기기 수리 요청", min: 1.5, practiceMin: 2,
    chips: [{ t: "실습 11 · AI에게 부탁하기" }, { t: "2분", c: "ghost" }], title: "기기 수리를 말로 요청하기",
    steps: [
      { t: '말로 알립니다: <span class="q">「3층 교무실 복합기에 용지가 자주 걸려요. 수리 요청해 줘」</span>', s: 0, r: [16, 352, 303, 70], fn: function (A, P) { typeOver(A, P, 0, [18, 354, 299, 66], "3층 교무실 복합기에 용지가 자주 걸려요. 수리 요청해 줘", { delay: 600, cps: 22 }); } },
      { t: '<span class="q">「디지털 기기 수리요청」</span> 카드: 이름은 저절로, 빠진 칸은 AI가 다시 묻습니다', s: 1, r: [20, 180, 372, 40] },
      { t: '장소·기기·요청 사항을 카드에서 고칩니다', s: 1, r: [31, 254, 350, 35] },
      { t: '<b>오늘은 <span class="k">시트에 등록</span>을 누르지 않습니다</b>', g: '<span class="k">시트에 등록</span>을 누르면 실제 수리 시트에 한 줄이 적힙니다', s: 1, r: [31, 485, 93, 40], warn: "실제 수리 시트에 한 줄이 적힙니다", z: 1.9 },
      { t: '같은 방식으로: 통신문 번호 · 도서관 이용 · 희망도서 · 교과협의록 · 회의 서명부', s: 1 }
    ],
    note: { html: "<span>시트가 아직 연결되지 않은 요청은 <b>[복사하고 시트 열기]</b>로 빈 줄에 붙여 넣습니다. 희망도서는 신청 기간에만 됩니다.</span>" },
    screens: [shot("ai"), shot("ai-repair")],
    notes: "구글 시트를 열어 빈 줄을 찾을 필요 없이 <b>말로 요청하면 카드가 뜨고, [등록]하면 시트에 한 줄</b>이 적힙니다. 이름은 저절로 들어갑니다. 「회의 메모 정리해 줘」라고 하면 교과협의록 초안도 만들어 줍니다."
  });

  D.add({
    id: "swap", part: 5, label: "수업교체 신청 (보기만)", kind: "light", min: 1, isNew: true,
    notes: "결강이면 AI에게 말로 알리면 됩니다. 사유와 비는 시간을 확인한 뒤 교체안을 추천하고, 고른 안으로 상대 선생님께 요청합니다. 이번 주부터 <b>신청할 때 내 서명이 함께 들어가고, 상대 선생님은 「수락」이 곧 서명</b>입니다. 모두 수락하면 교체 수업 신고서가 교무부 제출함으로 갑니다. <b>누르면 실제 선생님께 알림이 가니 오늘은 보기만</b> 합니다.",
    html: '<div class="chiprow"><span class="chip watch">보기만 · 수업교체 신청</span><span class="chip new">NEW 서명</span></div><h2 class="title">결강이면 말로, <em>교체는 상대 수락까지</em> 한 번에</h2>' +
      [["말하기", "결강 알리기", "「다음 주 화요일 1·3교시 출장이에요」", 120],
        ["조건 확인", "되묻기", "사유와 비는 시간을 AI가 확인합니다", 456],
        ["교체안 카드", "1안 · 추천", "부담 낮음·전부 해결 같은 표시로 고릅니다", 792],
        ["요청 + 서명", "내 서명으로 이 안 요청", "신청할 때 신고 교사 서명이 함께", 1128, true, "홍길동"],
        ["수락 = 서명", "상대 선생님 수락", "모두 수락하면 신고서가 교무부 제출함으로", 1464, true, "김하늘"]].map(function (n, k) {
        return '<div class="card node fl' + (n[4] ? " sw" : "") + '" style="left:' + n[3] + 'px"><span class="tag"' + (n[4] ? ' style="background:var(--new);color:var(--new-ink)"' : "") + ">" + n[0] + "</span><h3>" + n[1] + "</h3><p>" + n[2] + "</p>" + (n[5] ? '<span class="pen">' + n[5] + "</span>" : "") + "</div>" + (k < 4 ? '<i class="arrow" style="left:' + (n[3] + 300) + 'px;top:510px;width:28px"></i>' : "");
      }).join("") +
      '<div class="pills swp" style="left:120px;top:770px"><span class="p">신청은 결강하는 선생님 본인만</span><span class="p">진행 상황은 수업교체 → 「요청」</span><span class="p">계정 없는 분은 그 칸이 「(서명 또는 인)」으로 남음</span></div>',
    build: function (el, A) {
      return [
        function (A) {
          A.wipe(".chiprow > *", { each: 120 }); A.kinetic(".title", { delay: 100, each: 24 });
          A.rise(".fl", { delay: 500, each: 150 });
          A.draw(".arrow", { delay: 800, each: 150 });
          A.hide(".swp");
        },
        function (A) {
          el.querySelectorAll(".fl.sw").forEach(function (n) { n.classList.add("newb"); });
          write(A, ".fl.sw .pen", { delay: 300, d: 900, each: 700 });
          A.later(function () { A.sfx("stamp"); }, 900);
        },
        function (A) {
          A.go(".swp", [{ opacity: 1 }, { opacity: 1 }], { d: 1 });
          A.pop(".swp .p", { each: 110 });
          A.lt({ tone: "warn", tag: "오늘은 보기만", title: "요청을 누르면 실제 선생님께 알림이 갑니다", sub: "결강할 때 직접 써 보세요", delay: 300 });
        }
      ];
    }
  });

  // ════════════════════════════════════════════════════════════
  // 6부 · 세특 도우미
  // ════════════════════════════════════════════════════════════
  opener({
    part: 6, art: "record", flip: true, min: 5, lines: ["초안은 빠르게,", "<em>마무리는 선생님이</em>"],
    was: "빈 화면에서 첫 문장부터 고민", now: "활동 한 줄로 초안, 선생님이 다듬기",
    notes: "6부는 <b>세특 도우미</b>입니다. AI가 초안을 쓰지만, 학생 이름은 기기 밖으로 나가지 않고 마무리는 선생님이 하십니다."
  });

  D.add({
    id: "recIntro", part: 6, label: "세특 도우미 알아보기", kind: "light", min: 1, trans: "zoom",
    notes: "개인정보가 어떻게 다뤄지는지 먼저 보여 드립니다. <b>학생 이름·번호는 기기 밖으로 나가지 않고</b>, 활동·관찰 내용만 AI로 보냅니다. 돌아온 초안에 기기 안에서 이름을 붙여 보여 줍니다. 기본 AI는 학교가 제공하는 Upstage이고, 개인 키를 넣으면 OpenAI나 Anthropic도 쓸 수 있습니다. 이 사이트에는 저장되지 않습니다.",
    html: '<div class="chiprow"><span class="chip">세특 도우미</span><span class="chip ghost">과세특 · 동아리 세특 · 행발 · 가정통신문</span></div><h2 class="title">초안은 AI가 쓰고, <em>학생 이름은 기기 안에</em></h2>' +
      '<div class="abs card dev"><p class="hd">선생님 휴대폰·PC</p>' +
      '<div class="it lock"><span>학생 이름·번호</span><small>기기 밖으로 나가지 않음</small></div>' +
      '<div class="it act"><span>활동·관찰 내용</span><small>AI로 보냄</small></div>' +
      '<div class="it draft"><span>초안 문장</span><small>이름을 붙여 보여 줌</small></div></div>' +
      '<i class="abs wire"></i><span class="pkt p1" style="left:880px;top:534px;opacity:0">활동 내용</span><span class="pkt back p2" style="left:1110px;top:534px;opacity:0">초안</span>' +
      '<div class="abs card cloud"><b>AI 회사</b><span>기본은 <b>Upstage</b> (학교 제공)<br>개인 키를 넣으면 OpenAI 또는 Anthropic</span></div>' +
      '<div class="pills rcp" style="left:120px;top:880px"><span class="p">이 사이트에는 저장되지 않습니다</span><span class="p">근거: 기재요령 쪽수 · 교무부 Q&amp;A</span><span class="p warn">생성 문장은 초안 — 읽고 고쳐 씁니다</span></div>',
    build: function (el, A) {
      return [
        function (A) {
          A.wipe(".chiprow > *", { each: 120 }); A.kinetic(".title", { delay: 100, each: 24 });
          A.rise(".dev", { delay: 500 }); A.rise(".dev .it", { delay: 700, each: 120, y: 20 });
          A.go(".wire", [{ opacity: 0 }, { opacity: 1 }], { d: 500, delay: 900 });
          A.rise(".cloud", { delay: 900 });
          A.hide(".rcp");
        },
        function (A) {
          A.go(".dev .it.lock", [{ transform: "none" }, { transform: "translateX(10px)" }, { transform: "translateX(-10px)" }, { transform: "none" }], { d: 420 });
          A.sfx("swish", { v: 0.1, pan: 0.5, delay: 350 });
          A.go(".p1", [{ opacity: 0, transform: "translateX(-60px)" }, { opacity: 1, transform: "translateX(40px)", offset: 0.2 }, { opacity: 1, transform: "translateX(300px)", offset: 0.85 }, { opacity: 0, transform: "translateX(330px)" }], { d: 1700, delay: 300, e: E.cam });
        },
        function (A) {
          A.sfx("swish", { v: 0.1, pan: -0.5 });
          A.sfx("pop", { delay: 1400 });
          A.go(".p2", [{ opacity: 0, transform: "translateX(60px)" }, { opacity: 1, transform: "translateX(0)", offset: 0.2 }, { opacity: 1, transform: "translateX(-230px)", offset: 0.85 }, { opacity: 0, transform: "translateX(-250px)" }], { d: 1700, e: E.cam });
          A.go(".dev .it.draft", [{ background: "var(--paper)" }, { background: "var(--brand-tint)" }], { d: 500, delay: 1400 });
        },
        function (A) {
          A.go(".rcp", [{ opacity: 1 }, { opacity: 1 }], { d: 1 });
          A.pop(".rcp .p", { each: 120 });
        }
      ];
    }
  });

  practice({
    id: "p12", part: 6, num: 12, label: "실습 12 · 과세특 초안", min: 2.7, practiceMin: 4,
    chips: [{ t: "실습 12 · 세특 도우미" }, { t: "4분", c: "ghost" }], title: "과세특 초안 한 명 만들어 보기",
    steps: [
      { t: '<span class="k">더보기</span> → <span class="q">「도구」</span> 묶음의 <span class="k">세특 도우미</span>', s: 0, r: [17, 529, 378, 56] },
      { t: '과세특 카드의 <span class="k">바로가기 →</span>', s: 1, r: [31, 696, 66, 20], z: 1.95 },
      { t: '학생 수는 1, 과목명과 수업 활동을 한 줄 적습니다', s: 2, r: [31, 405, 350, 52] },
      { t: 'AI 모델은 기본값 <span class="q">(학교 제공 Upstage)</span> 그대로', s: 3, r: [31, 528, 350, 48] },
      { t: '학생 칸에 개별 활동 한 줄 → <span class="k">전체 생성 (1명)</span>', s: 4, r: [31, 490, 350, 50] },
      { t: '초안과 근거를 읽고 고친 뒤 <span class="k">복사</span>', s: 4 }
    ],
    note: { html: "<span>입력한 내용은 <b>이 기기에만</b> 저장됩니다. 공용 PC에서는 끝나고 [전체 지우기].</span>" },
    screens: [shot("more-bottom"), shot("record"), shot("record-input"), shot("record-options"), shot("record-students")],
    notes: "실제 학생 대신 <b>가상의 학생 한 명</b>으로 해 봅니다. 활동 한 줄만 적어도 기재요령에 맞춘 초안과 근거(기재요령 쪽수·교무부 Q&A)가 나옵니다. <b>초안은 초안입니다</b> — 반드시 읽고 우리 반 학생에 맞게 고쳐 쓰시라고 강조합니다."
  });

  D.add({
    id: "recClass", part: 6, label: "반 전체 쓰기", kind: "light", min: 1,
    notes: "반 전체를 쓸 때는 <b>NEIS 엑셀을 그대로</b> 씁니다. NEIS 세특 입력 화면에서 받은 엑셀을 올리면 학생마다 개별 활동 한 줄씩 받아 5명씩 동시에 쓰고, 빈 열이 채워진 엑셀로 돌려줍니다. 개인 키는 선택이며 요금은 선생님 계정으로 나갑니다.",
    html: '<div class="chiprow"><span class="chip">세특 도우미</span></div><h2 class="title">반 전체를 쓸 때는 <em>NEIS 엑셀을 그대로</em></h2>' +
      [["NEIS", "엑셀 내려받기", "세특 입력 화면에서 학생 명단 엑셀을 받습니다", 120],
        ["세특 도우미", "명렬표 올리기", "파일은 <b>이 기기에서만</b> 읽습니다", 540],
        ["생성", "전체 생성", "학생마다 개별 활동 한 줄, <b>5명씩 동시에</b>", 960],
        ["내려받기", "엑셀로 내려받기", "빈 열이 채워진 파일을 확인하고 NEIS에 반영", 1380]].map(function (n, k) {
        return '<div class="card node rn" style="left:' + n[3] + 'px;top:330px;width:400px;min-height:280px"><span class="tag">' + n[0] + "</span><h3>" + n[1] + "</h3><p>" + n[2] + "</p></div>" + (k < 3 ? '<i class="arrow" style="left:' + (n[3] + 404) + 'px;top:470px;width:14px"></i>' : "");
      }).join("") +
      '<div class="abs card node rt" style="left:120px;top:660px;width:800px"><span class="tag">개인 키 (선택)</span><p>GPT나 Claude로 쓰려면 AI 모델에서 고르고 개인 API 키를 넣습니다. 요금은 선생님 계정으로 나가고, 공용 PC에서는 「이 기기에 기억」을 체크하지 않습니다.</p></div>' +
      '<div class="abs card node rt" style="left:980px;top:660px;width:820px;border-color:var(--warn)"><span class="tag" style="background:var(--warn-tint);color:var(--warn)">초안은 초안입니다</span><p>문장마다 근거(기재요령 쪽수·교무부 Q&amp;A)가 붙습니다. <b>반드시 읽고 우리 반 학생에 맞게 고쳐 씁니다.</b></p></div>',
    build: function (el, A) {
      return [
        function (A) {
          A.wipe(".chiprow > *"); A.kinetic(".title", { delay: 100, each: 24 });
          A.rise(".rn", { delay: 500, each: 160 });
          A.hide(".rt");
        },
        function (A) { A.rise(".rt", { each: 180 }); }
      ];
    }
  });

  // ════════════════════════════════════════════════════════════
  // 7부 · 전자칠판·자료실
  // ════════════════════════════════════════════════════════════
  opener({
    part: 7, art: "board", min: 4, lines: ["교실에는 한 번에,", "<em>자료는 한 곳에</em>"],
    was: "반마다 다니며 안내, 자료는 여기저기", now: "모든 교실 칠판에 한 번에, 자료는 자료실에",
    notes: "마지막 7부는 <b>전자칠판 알림</b>과 <b>자료실</b>입니다. 전자칠판은 실제 교실에 바로 뜨기 때문에 오늘은 둘러보기만 합니다."
  });

  practice({
    id: "p13", part: 7, num: 13, label: "실습 13 · 전자칠판 알림 둘러보기", min: 1.7, practiceMin: 1, trans: "zoom",
    chips: [{ t: "실습 13 · 전자칠판 알림" }, { t: "둘러보기 1분", c: "ghost" }], title: "전자칠판 알림 화면 둘러보기",
    steps: [
      { t: '<span class="k">더보기</span> → <span class="q">「학생」</span> 묶음의 <span class="k">전자칠판 알림</span>', s: 0, r: [17, 471, 378, 56] },
      { t: '<span class="q">「안내 | 긴급」</span>. 긴급은 경보음과 함께 뜹니다', s: 1, r: [32, 136, 349, 49] },
      { t: '대상은 전체·학년, 또는 <span class="q">「교실 고르기」</span>로 반을 고릅니다', s: 1, r: [284, 230, 92, 38], z: 1.9 },
      { t: '글과 <span class="q">「유지 시간」</span>(안내 3~30분). 링크를 넣으면 칠판에 큰 QR', s: 2, r: [28, 560, 290, 40] },
      { t: '<b>오늘은 <span class="k">…곳에 띄우기</span>를 누르지 않습니다</b>', g: '<span class="k">…곳에 띄우기</span>를 누르면 고른 교실 칠판에 바로 뜹니다', s: 2, r: [31, 650, 350, 50], warn: "실제 교실 칠판에 바로 뜹니다" },
      { t: '<span class="q">「오늘 칠판에 나간 알림」</span>: 점 색으로 도착·확인을 봅니다', s: 2, r: [16, 735, 380, 44] }
    ],
    note: { html: '<span><span class="badge-new">NEW</span> 쉬는 시간(수업 시작 10분 전~1분 전)에 띄운 안내는 <b>수업 시작 1분 전까지</b> 칠판에서 닫히지 않습니다. 긴급 경보음은 <b>보낸 사람이</b> 끕니다.</span>' },
    screens: [shot("more-top"), shot("board-v2"), shot("board-sent")],
    notes: "전자칠판 알림은 교실 칠판에 안내·긴급을 띄웁니다. 이번 주 바뀐 점: 쉬는 시간에 띄운 안내는 학생이 터치로 닫지 못하게 <b>수업 시작 1분 전까지</b> 유지되고, 긴급 경보음은 <b>보낸 선생님이</b> 끕니다. 오늘은 [띄우기]를 누르지 않습니다."
  });

  practice({
    id: "p14", part: 7, num: 14, label: "실습 14 · 자료실", min: 2, practiceMin: 2,
    chips: [{ t: "실습 14 · 자료실" }, { t: "2분", c: "ghost" }], title: "자료실에서 찾고 올리기",
    steps: [
      { t: '아래 <span class="k">자료실</span> 탭', s: 0, r: [246, 797, 81, 55], z: 1.8 },
      { t: '검색칸에 <span class="q">「평가계획」</span>. 섹션 칩으로 좁힐 수도 있습니다', s: 1, r: [40, 155, 350, 40] },
      { t: '카드를 누르고 <span class="k">열기</span> 또는 <span class="k">내려받기</span>', s: 1, r: [16, 280, 380, 72] },
      { t: '올릴 때는 <span class="k">+ 게시</span> → 섹션·제목 → 링크나 파일(20MB 이하) → <span class="k">게시</span>', s: 2, r: [31, 593, 350, 50] }
    ],
    note: { html: "<span>자료실에 올린 한글·PDF 파일은 AI가 읽어 두어서, <b>AI 도우미가 본문까지</b> 찾아 답합니다.</span>" },
    screens: [shot("home"), shot("library"), shot("library-new")],
    notes: "자료실은 부서별 자료와 양식을 모은 곳입니다. <b>올린 파일은 AI가 읽어 두기</b> 때문에 5부에서 본 것처럼 AI 도우미가 본문까지 찾아 줍니다. 20MB가 넘는 파일은 드라이브 링크로 올립니다."
  });

  // ════════════════════════════════════════════════════════════
  // 마무리
  // ════════════════════════════════════════════════════════════
  var DONE = ["로그인·앱 설치", "알림·보건실 알림", "시간표·빈 교실", "진도 한 줄·한 달 도장판", "넵 보내고 처리", "내 서명 등록", "AI에게 묻고 부탁하기", "과세특 초안", "전자칠판 둘러보기", "자료실 찾기·올리기"];
  D.add({
    id: "closing", part: 8, label: "마무리 · 질문", kind: "dark", min: 3, trans: "whip", bgm: "end",
    notes: "오늘 해 본 열 가지를 짚고 질문을 받습니다. <b>알림을 아직 못 켜신 분은 지금 바로</b> 도와드리겠다고 말씀하세요. 막히거나 궁금한 점은 언제든 <b>교목실</b>로 오시면 됩니다. 수고 많으셨습니다.",
    html: darkBg("closing") +
      '<h2 class="abs cl-title"><span class="ln">이제, 휴대폰에서</span><span class="ln"><em>바로</em> 쓰시면 됩니다</span></h2>' +
      '<div class="abs cl-done">' + DONE.map(function (t) { return "<div><i>" + CHECK + "</i>" + t + "</div>"; }).join("") + "</div>" +
      '<p class="abs cl-ask"><b>질문 받겠습니다</b><span>막히거나 궁금하면<br><strong>교목실</strong>로 오세요</span></p>',
    build: function (el, A) {
      return [
        function (A) {
          A.go(".art-wrap img", [{ transform: "scale(1.3) translate(2%,2%)", filter: "brightness(.35)" }, { transform: "scale(1.1)", filter: "brightness(1)" }], { d: 2000, e: E.out });
          A.kenburns(".art-wrap img", { from: "scale(1.1)", to: "scale(1.03) translate(-1.2%, -0.8%)", d: 45000, delay: 2000 });
          A.kinetic(".cl-title", { delay: 400, each: 40, punch: 2.2 });
          A.hide(".cl-done");
          A.hide(".cl-ask");
        },
        function (A) {
          A.go(".cl-done", [{ opacity: 1 }, { opacity: 1 }], { d: 1 });
          A.rise(".cl-done div", { each: 110, y: 24, snd: "pluck", v: 0.07, lead: 200 });
          A.pop(".cl-done i", { delay: 200, each: 110, s: 0.3, snd: false });
        },
        function (A) {
          A.go(".cl-ask", [{ opacity: 0, transform: "translateX(60px)" }, { opacity: 1, transform: "none" }], { d: 900, e: E.out });
        }
      ];
    }
  });
})();

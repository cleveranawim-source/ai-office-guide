/* AI 교무실 사용연수 — 장면 데이터
 * 장면마다 html(무대 위 요소)과 build(박자 목록)를 둔다. 박자 0은 들어올 때, 그다음은 넘길 때마다.
 * 휴대폰 화면은 실제 앱을 예시 데이터(지어낸 학교·이름)로 띄워 찍은 img/*.jpg(412×864 기준 좌표, 2배 해상도). 동그라미 자리는 img/rects.js의 R(화면, 키).
 * 캡처가 없는 단계(브라우저 메뉴·시스템 창)는 모형(.mk)으로 그린다.
 * 발표 멘트(notes)는 N(노트)·P(발표자 창)에서 보인다.
 */
(function () {
  "use strict";
  var D = window.DECK, E = D.E, h = D.h;
  var R = window.R || function () { return null; };

  D.parts([
    { n: 0, name: "시작", color: "#8fd0ff" },
    { n: 1, name: "기본 설정", color: "#6fb6ea" },
    { n: 2, name: "AI에게 부탁하기", color: "#b49cf2", isNew: true },
    { n: 3, name: "홈·시간표·교체", color: "#7fc8a9" },
    { n: 4, name: "넵", color: "#9fb3f0" },
    { n: 5, name: "디지털 서명", color: "#f5a524" },
    { n: 6, name: "AI 더 깊게·세특", color: "#e59a7a" },
    { n: 7, name: "전자칠판·자료실", color: "#79c6d9" },
    { n: 8, name: "학교 생활·마무리", color: "#8fd0ff" }
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
  .hk-icon.hk-ai{border-radius:50%;background:radial-gradient(circle at 35% 30%,#3a8ad8,#0b4a8f 72%);color:#fff;align-content:center;gap:2px}
  .hk-ai svg{width:96px;height:96px;display:block}
  .hk-ai b{font:800 46px var(--body);letter-spacing:.02em;line-height:1}
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

  .nf{left:120px;top:310px;width:1680px;display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
  .nf .c{padding:26px 26px 28px;min-height:300px;display:flex;flex-direction:column;gap:10px;position:relative;overflow:hidden}
  .nf .where{align-self:flex-start;font:700 17px var(--mono);letter-spacing:.08em;background:var(--new);color:var(--new-ink);border-radius:6px;padding:3px 10px}
  .nf h3{font:800 33px/1.2 var(--display);letter-spacing:-.025em}
  .nf p{font:500 22px/1.5 var(--body);color:var(--muted)}
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
  .askc .chips span.nwc{background:var(--new);color:var(--new-ink)}
  .askc.confirm{border-color:var(--brand);box-shadow:0 0 0 3px rgba(41,92,158,.14)}
  .aibar{left:120px;top:840px;display:flex;align-items:center;gap:22px}
  .aibar .strip{width:412px;height:96px;border-radius:18px;overflow:hidden;background:url(img/ai-home.jpg) 0 -768px/412px 864px no-repeat;box-shadow:0 14px 34px rgba(14,28,48,.15);transform:scale(1.25);transform-origin:left center}
  .aibar p{font:600 26px var(--body);margin-left:110px}


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

  .bnl{left:120px;top:300px;width:800px;display:grid;grid-template-columns:1fr 1fr;gap:14px}
  .bnl .c{padding:16px 20px 18px;display:flex;flex-direction:column;gap:6px;transition:box-shadow .4s,border-color .4s}
  .bnl .c.on{border-color:var(--new);box-shadow:0 0 0 3px rgba(245,165,36,.2),0 18px 46px rgba(245,165,36,.12)}
  .bnl .tg{align-self:flex-start;padding:4px 12px;border-radius:999px;background:var(--brand-tint);color:var(--brand-deep);font:700 17px var(--body)}
  .bnl .tg.w{background:var(--warn-tint);color:var(--warn)}
  .bnl .tg.n{background:#fff4d6;color:#7a4b00}
  .bnl b{font:800 27px var(--display);letter-spacing:-.02em}
  .bnl p{font:500 19px/1.45 var(--body);color:var(--muted)}
  .bnl p b{font:700 19px var(--body);color:var(--ink);letter-spacing:0}
  .bnl .pre{display:flex;flex-wrap:wrap;gap:6px}
  .bnl .pre i{font-style:normal;padding:2px 9px;border-radius:10px;border:2px solid #d9c7a8;background:#faf6ef;color:#7a4b00;font:700 15px var(--body)}
  .bnl .pre i:nth-child(2){border-color:#e8b4a0;color:#b4400c;background:#fdf1ec}
  .bnl .pre i:nth-child(3){border-color:#b9bfa6;color:#4d5b2a;background:#f2f3ee}
  .bnl .pre i:nth-child(4){border-color:#c9b3f0;color:#6d28d9;background:#f5f0fd}
  .bnl .pre i:nth-child(5){border-color:#b3c3f0;color:#1d4ed8;background:#eef2fd}
  .bdx{left:960px;top:330px;width:840px;height:500px;border-radius:24px;background:#1c2431;padding:16px;box-shadow:0 40px 90px rgba(14,28,48,.35)}
  .bdx::after{content:"";position:absolute;left:50%;bottom:-46px;width:180px;height:46px;margin-left:-90px;background:linear-gradient(#2a3446,#1c2431);clip-path:polygon(18% 0,82% 0,100% 100%,0 100%)}
  .bdx .scr2{position:relative;width:100%;height:100%;border-radius:10px;background:#0d1520;overflow:hidden;color:#fff;font-family:var(--body)}
  .bdx .st{position:absolute;inset:0;opacity:0}
  .bdx .idle,.bdx .sch{display:grid;place-items:center;align-content:center;gap:6px}
  .bdx .rm{position:absolute;left:26px;top:20px;font:700 24px var(--body);color:#c9d6e6}
  .bdx .idle b,.bdx .sch b{font:600 150px/1 var(--mono);letter-spacing:-.03em}
  .bdx .idle small{font:500 24px var(--body);color:#9fb3c8}
  .bdx .chipy{margin-top:14px;padding:8px 18px;border-radius:999px;background:var(--new);color:var(--new-ink);font:800 22px var(--body)}
  .bdx .note{background:#14532d;display:flex;flex-direction:column;align-items:center;padding:22px 30px;gap:12px}
  .bdx .hd{align-self:flex-start;font:800 24px var(--body);padding:4px 14px;border-radius:8px;background:rgba(255,255,255,.16)}
  .bdx .ph{display:flex;gap:12px;width:100%;height:190px}
  .bdx .ph i{flex:1;border-radius:10px;background:linear-gradient(160deg,#9cc6e8 0%,#5f9fd0 45%,#6f9b5a 46%,#4f7a3c 100%);position:relative;overflow:hidden}
  .bdx .ph i::after{content:"";position:absolute;right:22%;top:18%;width:34px;height:34px;border-radius:50%;background:#fff3c4}
  .bdx .note p{font:700 30px/1.35 var(--body);text-align:center}
  .bdx .note small,.bdx .urg small{font:500 18px var(--body);opacity:.8}
  .bdx .note .hd,.bdx .vid .hd{background:rgba(253,224,71,.2);color:#fde047}
  .bdx .note small,.bdx .vid small{color:#fde047;opacity:1}
  .bdx .memo{background:#f6f3ea;color:#1c2533}
  .bdx .memo .ls{position:absolute;left:44px;top:40px;right:360px;display:grid;gap:16px}
  .bdx .memo .ls b{font:800 34px var(--body)}
  .bdx .memo .ls i{display:block;height:16px;border-radius:8px;background:#ddd6c4}
  .bdx .memo .yn{position:absolute;right:20px;top:20px;width:290px;padding:14px 16px;border-radius:10px;background:#fde047;color:#3b2600;box-shadow:0 12px 28px rgba(0,0,0,.28);transform:rotate(1.5deg)}
  .bdx .memo .yn small{display:block;font:700 15px var(--body);opacity:.75;margin-bottom:6px}
  .bdx .memo .yn p{font:800 23px/1.35 var(--body)}
  .bdx .vid{background:#14532d;display:grid;grid-template-columns:230px 1fr;gap:28px;align-items:center;padding:56px 36px 24px}
  .bdx .vid .hd{position:absolute;left:30px;top:18px}
  .bdx .vid .qrw{display:grid;gap:12px;justify-items:center}
  .bdx .vid .qrw img{width:190px;height:190px;background:#fff;padding:10px;border-radius:12px;display:block}
  .bdx .vid .play{padding:10px 18px;border-radius:12px;background:#fff;color:#14532d;font:800 22px var(--body);white-space:nowrap}
  .bdx .vid p{font:700 30px/1.4 var(--body)}
  .bdx .vid small{display:block;margin-top:14px;font:500 18px var(--body)}
  .bdx .exam .box i{font-style:normal}
  .bdx .exam .box .t-ab{color:#fca5a5}
  .bdx .exam .box .t-sep{color:#7dd3fc}
  .bdx .urg{background:#b91c1c;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:22px;padding:30px 40px;text-align:center}
  .bdx .urg .hd{align-self:center;font-size:44px;padding:6px 26px;background:rgba(255,255,255,.2)}
  .bdx .urg p{font:800 36px/1.4 var(--body)}
  .bdx .exam{padding:22px 30px;display:flex;flex-direction:column;gap:14px;background:#0b1626}
  .bdx .exam .top{display:flex;justify-content:space-between;align-items:baseline;font:700 28px var(--body)}
  .bdx .exam .top em{color:#fde047}
  .bdx .exam .top small{font-size:20px;opacity:.85}
  .bdx .exam .box{border:2px solid rgba(255,255,255,.4);border-radius:14px;padding:12px;text-align:center;display:grid;gap:4px}
  .bdx .exam .box b{font:800 30px var(--body)}
  .bdx .exam .box .pk{color:#fca5a5}
  .bdx .exam .box span{font:600 21px var(--body)}
  .bdx .exam .box b .pk{font:inherit}
  .bdx .exam .tt{display:grid;gap:8px}
  .bdx .exam .r{display:grid;grid-template-columns:90px 170px 1fr 180px;align-items:center;padding:8px 14px;border-radius:10px;background:rgba(255,255,255,.06);font:600 21px var(--body)}
  .bdx .exam .r b{font:800 28px var(--body)}
  .bdx .exam .r.done{opacity:.5}
  .bdx .exam .r.on{background:rgba(253,224,71,.16);box-shadow:inset 0 0 0 2px rgba(253,224,71,.6)}
  .bdx .exam .r.on span:last-child{color:#fde047}
  .steps.tight{gap:8px}
  .steps.tight li{font-size:25px;padding:10px 18px 10px 12px}
  .steps.tight li::before{width:44px;height:44px;font-size:21px}
  .tv{left:960px;top:250px;width:860px;height:520px;border-radius:26px;background:#1c2431;padding:16px;box-shadow:0 40px 90px rgba(14,28,48,.35)}
  .tv::after{content:"";position:absolute;left:50%;bottom:-48px;width:190px;height:48px;margin-left:-95px;background:linear-gradient(#2a3446,#1c2431);clip-path:polygon(18% 0,82% 0,100% 100%,0 100%)}
  .tv .in{position:relative;width:100%;height:100%;border-radius:10px;overflow:hidden;background:#0d1520}
  .tv .in img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0}
  .tv-note{left:960px;top:850px;width:860px;text-align:center;font:500 20px var(--body);color:var(--muted)}

  .hk-flowh{left:0;right:0;top:150px;text-align:center;font:900 84px/1.15 var(--display);letter-spacing:-.035em;color:#fff}
  .hk-flowh em{color:var(--glow)}
  .hk-flow{left:150px;top:380px;width:1620px;display:grid;grid-template-columns:1fr 80px 1fr 80px 1fr;align-items:start}
  .hk-flow .st{display:grid;gap:22px;justify-items:center;text-align:center}
  .hk-flow .lb{font:800 30px var(--body);color:var(--glow);letter-spacing:.04em}
  .hk-flow .cap{font:500 25px/1.45 var(--body);color:#bcd2ea}
  .hk-flow .ar{position:relative;height:4px;margin-top:190px;background:var(--glow);opacity:.75;transform-origin:left}
  .hk-flow .ar::after{content:"";position:absolute;right:-2px;top:50%;width:16px;height:16px;border-top:4px solid var(--glow);border-right:4px solid var(--glow);transform:translateY(-50%) rotate(45deg)}
  .hk-bub{width:440px;min-height:236px;display:flex;align-items:center;padding:26px 32px;border-radius:30px 30px 8px 30px;background:#e3edf8;color:#163d73;font:700 36px/1.4 var(--body);text-align:left}
  .hk-card{width:440px;min-height:236px;border-radius:22px;background:#fff;color:#1c2533;overflow:hidden;text-align:left;box-shadow:0 30px 70px rgba(0,0,0,.45)}
  .hk-card .hd{display:flex;justify-content:space-between;align-items:baseline;padding:16px 22px;background:#e3edf8;font:800 28px var(--body);color:#163d73}
  .hk-card .hd small{font:500 18px var(--body);color:#5b6b80}
  .hk-card .bd{padding:16px 22px 20px;display:grid;gap:10px;font:500 21px/1.4 var(--body);color:#3c4a5c}
  .hk-card .bd b{color:#1c2533}
  .hk-card .bd i{font-style:normal;padding:2px 10px;border-radius:999px;background:#e2f3ea;color:#1f8a5a;font-weight:700;font-size:18px}
  .hk-btnw{height:236px;display:grid;place-items:center}
  .hk-btn{position:relative;padding:26px 34px;border-radius:20px;background:linear-gradient(90deg,#163d73,#295c9e);color:#fff;font:800 32px var(--body);white-space:nowrap;box-shadow:0 24px 60px rgba(0,0,0,.45)}
  .hk-btn .rg{position:absolute;inset:-14px;border:4px solid var(--new);border-radius:30px;opacity:0}
  .hk-flowf{left:0;right:0;top:820px;text-align:center;font:900 62px var(--display);letter-spacing:-.03em;color:#fff}
  .hk-flowf em{color:var(--glow)}

  .ag .ds em.ai{font-style:normal;font-weight:700;color:var(--ai)}
  .ag .r.air{border-color:var(--ai);box-shadow:0 0 0 3px rgba(109,79,216,.16)}
  .ag .r.air .tm i{background:var(--ai)}
  .ag .r.air .badge-new{background:var(--ai);color:#fff}
  .cl-done div.ai i{background:#c9b6ff}
  .cl-done div.ai{color:#fff;font-weight:700}

  .ten{left:120px;top:300px;width:1680px;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:repeat(5,auto);grid-auto-flow:column;gap:14px 28px}
  .ten .r{display:grid;grid-template-columns:52px minmax(0,1fr) auto;gap:18px;align-items:center;padding:16px 22px;border-radius:18px;background:var(--surface);border:1px solid var(--line);min-height:104px}
  .ten .n{font:600 26px var(--mono);color:var(--ai)}
  .ten .s{font:700 26px/1.38 var(--body);color:var(--ink)}
  .ten .c{padding:6px 14px;border-radius:999px;background:var(--ai-tint);color:var(--ai-ink);font:700 19px var(--body);white-space:nowrap}
  .ten-foot{left:120px;top:924px;width:1680px;display:flex;gap:14px;flex-wrap:wrap;font:500 23px var(--body);color:var(--muted)}
  .ten-foot b{color:var(--ink)}
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
        '<p class="op-kicker"><span>' + o.part + "부 · " + D.PARTS[o.part].name + '</span><span class="pill">' + o.min + "분</span>" + (o.isNew ? '<span class="newflag">' + (o.flag || "NEW") + "</span>" : "") + "</p>" +
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
      id: o.id, deck: o.deck, part: o.part, label: o.label, kind: "light practice", min: o.min, practiceMin: o.practiceMin, isNew: o.isNew, notes: o.notes, trans: o.trans || "push", guide: o,
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
          if (!n) { if (s.offsetTop + s.offsetHeight > 900) s.classList.add("tight"); return; }
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

  // ── 「AI로 하면」: 부마다 끝에, 같은 일을 메뉴로 한 번·AI 한 문장으로 한 번 ──
  function aiWay(o) {
    practice(Object.assign({
      num: null, trans: "zoom",
      chips: [{ t: "AI로 하면", c: "ai" }, { t: "보기만", c: "ghost" }],
      note: { tone: "ai", html: '<span class="vs"><b>메뉴로</b> ' + o.menu + '</span><span class="vs"><b>AI로</b> 「' + o.say + "」 한 문장</span>" },
      lt: { tag: "AI로 하면", title: "「" + o.say + "」", sub: "메뉴를 몰라도, 말하면 카드로 · 누르는 건 선생님", tone: "ai" }
    }, o));
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
  // 실제 앱 화면(예시 데이터)으로 바꾼 모형: 알림 허용 창
  M.notiAsk = mk('<img class="shotbg" src="img/notifications-off.jpg" style="top:0" alt=""><div class="dim"></div><div class="dialog" style="top:300px"><h4>AI 교무실에서 알림을 보내도록 허용할까요?</h4><p class="muted">알림은 설정에서 언제든 바꿀 수 있습니다.</p>' +
    '<div style="display:flex;justify-content:flex-end;gap:8px;margin-top:20px"><span style="padding:10px 14px;font-weight:700;color:#1a73e8">허용 안 함</span><span data-t="allow" style="padding:10px 18px;font-weight:700;color:#fff;background:#1a73e8;border-radius:20px">허용</span></div></div>');

  // ════════════════════════════════════════════════════════════
  // 0부 · 시작
  // ════════════════════════════════════════════════════════════
  D.add({
    id: "cover", part: 0, label: "표지 · 접속 안내", kind: "dark", min: 0.5, trans: "fade", bgm: "lobby",
    notes: "연수 시작 전부터 이 화면을 띄워 둡니다. <b>휴대폰 카메라로 QR을 찍어 AI 교무실을 열고, 처음 받은 비밀번호를 준비</b>해 달라고 안내합니다. 오늘은 듣기보다 <b>휴대폰으로 함께 해 보는</b> 연수이고, 오늘 가져가실 것은 하나 — <b>AI에게 말로 부탁하는 법</b>이라고 먼저 말씀드립니다.",
    html: darkBg("cover") +
      '<div class="abs cv-brand"><img src="img/symbol-128.png" alt=""><div><small>MYONGJI MIDDLE SCHOOL</small><b>AI 교무실</b></div></div>' +
      '<p class="abs cv-kicker">교직원 연수 · 약 60분 · 휴대폰과 함께</p>' +
      '<h1 class="abs cv-title"><span class="ln">AI에게,</span><span class="ln"><em>말로</em> 부탁하기</span></h1>' +
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
  var SPARK = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 2.5c.5 4.6 3.1 7.2 7.7 7.7-4.6.5-7.2 3.1-7.7 7.7-.5-4.6-3.1-7.2-7.7-7.7 4.6-.5 7.2-3.1 7.7-7.7z"/><path d="M18.5 13.5c.25 2.3 1.55 3.6 3.85 3.85-2.3.25-3.6 1.55-3.85 3.85-.25-2.3-1.55-3.6-3.85-3.85 2.3-.25 3.6-1.55 3.85-3.85z"/></svg>';
  D.add({
    id: "hook", part: 0, label: "여는 이야기", kind: "dark", min: 1.5, trans: "fade",
    notes: "1단계: 선생님들 하루에 흩어진 일들을 보여 줍니다. “이 질문들, 하루에 몇 번 하시나요?”<br>2단계: 넘기면 낱말들이 아래 탭 가운데 <b>AI 단추</b>로 빨려 들어갑니다. <b>“이 일들, 이제 AI에게 말로 부탁합니다.”</b><br>3단계: 오늘의 한 문장입니다. <b>“메뉴를 몰라도 됩니다. AI에게 말하면, 카드로 만들어 드립니다. 누르는 건 선생님.”</b> 말하기 → 카드 → 누르기, 오늘 연수 내내 이 세 박자를 부마다 다시 봅니다. 카드는 누르기 전까지 선생님만 보는 초안이고, AI가 혼자 보내거나 적는 일은 없다는 점을 꼭 짚어 주세요.<br>4단계: 10월 12일 기준으로 <b>아침 알림을 켠 선생님은 74명 중 34명</b>입니다. 탓하는 말이 아니라 “오늘 끝날 때는 모두 알림을 켜고, AI에게 첫 부탁까지 해 보자”는 목표로 말씀해 주세요.",
    html: '<div class="hk-bg"></div><div class="grain"></div>' +
      HOOK_WORDS.map(function (w) { return '<span class="hk-word" style="left:' + w[1] + "px;top:" + w[2] + "px;font-size:" + w[3] + "px;transform:rotate(" + w[4] + 'deg)"><span class="in" style="display:inline-block">' + w[0] + "</span></span>"; }).join("") +
      '<h2 class="abs hk-say"><span class="ln">선생님의 하루는</span><span class="ln"><em>여기저기</em> 흩어져 있습니다</span></h2>' +
      '<div class="abs hk-ring"></div><div class="abs hk-icon hk-ai">' + SPARK + "<b>AI</b></div>" +
      '<h2 class="abs hk-one"><span class="ln">이 일들, 이제 <em>AI에게 말로.</em></span></h2>' +
      '<h2 class="abs hk-flowh"><span class="ln">메뉴를 몰라도, <em>말하면 카드로</em></span></h2>' +
      '<div class="abs hk-flow">' +
      '<div class="st"><span class="lb">① 말하기</span><div class="hk-bub"><span class="tx">다음 주 목요일 4~7교시 출장, 교체해 줘</span></div><span class="cap">메뉴를 찾지 않고, 평소 말로</span></div>' +
      '<i class="ar"></i>' +
      '<div class="st"><span class="lb">② 카드</span><div class="hk-card"><div class="hd">수업 교체안<small>10/29(목) · 출장</small></div><div class="bd"><span><b>반영한 학사일정</b> 동아리활동 6~7교시</span><span><b>1안 · 추천</b> 부담 낮음 <i>전부 해결</i></span><span>2학년 4반 · 3반 두 수업 맞교환</span></div></div><span class="cap">학사일정·시간표를 보고 초안까지</span></div>' +
      '<i class="ar"></i>' +
      '<div class="st"><span class="lb">③ 누르기</span><div class="hk-btnw"><span class="hk-btn">내 서명으로 이 안 요청<i class="rg"></i></span></div><span class="cap">누르기 전까지는 나만 보는 초안</span></div>' +
      "</div>" +
      '<h2 class="abs hk-flowf"><span class="ln">누르는 건, <em>선생님</em>입니다</span></h2>' +
      '<div class="abs hk-stat"><p class="cap">지금 아침 알림을 받는 선생님</p><div class="num"><em class="n10">0</em><small>/ 74명</small></div><p class="src">10월 12일 기준 · 알림을 켠 선생님</p></div>' +
      '<h2 class="abs hk-goal"><span class="ln">오늘 끝나면, 모두 <em>알림 켜고 첫 부탁까지.</em></span></h2>',
    build: function (el, A) {
      var words = A.$$(".hk-word");
      return [
        function (A) {
          A.hide(".hk-icon, .hk-ring, .hk-one, .hk-flowh, .hk-flow .st, .hk-flow .ar, .hk-flowf, .hk-stat, .hk-goal");
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
          A.go(".hk-flowh", [{ opacity: 0 }, { opacity: 1 }], { d: 10, delay: 450 });
          var t = A.kinetic(".hk-flowh", { delay: 500, each: 34 });
          var sts = A.$$(".hk-flow .st"), ars = A.$$(".hk-flow .ar"), d0 = 900;
          A.go(sts[0], [{ opacity: 0, transform: "translateY(40px)" }, { opacity: 1, transform: "none" }], { d: 700, delay: d0, e: E.out });
          A.later(function () { A.type(".hk-bub .tx", "다음 주 목요일 4~7교시 출장, 교체해 줘", 20); }, d0 + 300);
          A.go(ars[0], [{ opacity: 0, transform: "scaleX(0)" }, { opacity: .75, transform: "scaleX(1)" }], { d: 500, delay: d0 + 2400, e: E.cam });
          A.go(sts[1], [{ opacity: 0, transform: "translateY(40px) scale(.92)" }, { opacity: 1, transform: "none" }], { d: 800, delay: d0 + 2800, e: E.spring });
          A.sfx("pop", { delay: d0 + 2900 });
          A.go(ars[1], [{ opacity: 0, transform: "scaleX(0)" }, { opacity: .75, transform: "scaleX(1)" }], { d: 500, delay: d0 + 3700, e: E.cam });
          A.go(sts[2], [{ opacity: 0, transform: "translateY(40px)" }, { opacity: 1, transform: "none" }], { d: 700, delay: d0 + 4100, e: E.out });
          A.go(".hk-btn", [{ transform: "scale(1)" }, { transform: "scale(.94)" }, { transform: "scale(1)" }], { d: 420, delay: d0 + 4900, e: E.out });
          A.go(".hk-btn .rg", [{ opacity: 0, transform: "scale(1.15)" }, { opacity: 1, transform: "scale(1)" }], { d: 500, delay: d0 + 4900, e: E.out, fill: "forwards" });
          A.sfx("check", { delay: d0 + 5000 });
          A.go(".hk-flowf", [{ opacity: 0 }, { opacity: 1 }], { d: 10, delay: d0 + 5400 });
          A.kinetic(".hk-flowf", { delay: d0 + 5450, each: 40, punch: 2 });
        },
        function (A) {
          A.fadeOut(".hk-flowh, .hk-flowf", { d: 400 });
          A.fadeOut(".hk-flow .st, .hk-flow .ar", { d: 400 });
          A.go(".hk-stat", [{ opacity: 0, transform: "translateY(40px)" }, { opacity: 1, transform: "none" }], { d: 800, delay: 450, e: E.out });
          A.later(function () { A.count(".n10", 0, 34, 1400); }, 700);
          A.go(".hk-stat .num em", [{ transform: "scale(1)" }, { transform: "scale(1.12)" }, { transform: "scale(1)" }], { d: 500, delay: 2150, e: E.out });
          A.go(".hk-goal", [{ opacity: 0 }, { opacity: 1 }], { d: 10, delay: 2400 });
          A.kinetic(".hk-goal", { delay: 2450, each: 40, punch: 2.2 });
        }
      ];
      function $in(w) { return w.querySelector(".in"); }
    }
  });

  var AGENDA = [
    [1, "기본 설정", "로그인·앱 설치·알림 켜기, 보건실 입실 알림", 8],
    [2, "AI에게 부탁하기", "<em class=\"ai\">첫 부탁</em>: 묻기, 가정통신문·기기 수리를 말로, 카드에서 확인", 6, true],
    [3, "홈·시간표·교체", "새 홈·빼꼼·알림함, 공강 선생님께 넵, 진도 저장, <em class=\"ai\">AI로 수업교체</em>", 8],
    [4, "넵", "나에게 업무요청, 조직도로 받는 사람, 받은 넵 처리, <em class=\"ai\">AI로 넵 초안</em>", 8],
    [5, "디지털 서명", "내 서명 등록, 회의 서명부·파일 서명, <em class=\"ai\">AI로 서명부</em>", 6],
    [6, "AI 더 깊게·세특", "<em class=\"ai\">학습지 한글 파일, 깊게 생각하기, 학부모 답장</em>, 과세특 초안", 7],
    [7, "전자칠판·자료실", "칠판 보내기, 교실 칠판 모습, 자료 찾기, <em class=\"ai\">AI로 양식 찾기</em>", 6]
  ];
  D.add({
    id: "agenda", part: 0, label: "오늘 순서", kind: "light", min: 0.5, trans: "whip",
    notes: "오늘은 <b>AI부터</b> 합니다. 1부에서 로그인과 알림만 켜고 바로 2부에서 <b>AI에게 첫 부탁</b>을 해 봅니다. 그 뒤로는 부마다 끝에 <b>「AI로 하면」</b> 한 장이 있어서, 같은 일을 메뉴로 한 번·AI 한 문장으로 한 번 봅니다(보라색 글씨). 6부는 학습지·깊게 생각하기·세특처럼 AI를 더 깊게 쓰는 부분입니다. 마지막엔 <b>내일 해 볼 부탁 열 문장</b>을 가져가십니다. 막히는 분은 손을 들어 주시면 옆 선생님이나 제가 도와드린다고 안내합니다.",
    html: '<div class="chiprow"><span class="chip">오늘 순서</span></div><h2 class="title">AI에게 첫 부탁부터, 부마다 <em>「AI로 하면」</em></h2>' +
      '<p class="abs ag-total">여는 이야기까지 약 <b class="mono" data-total>0</b>분</p>' +
      '<div class="abs ag">' + AGENDA.map(function (a) {
        return '<div class="r' + (a[4] ? " air" : "") + '"><span class="n">0' + a[0] + '</span><span class="nm">' + a[1] + (a[4] ? ' <span class="badge-new">핵심</span>' : "") + '</span><span class="ds">' + a[2] + '</span><span class="tm"><i style="width:' + a[3] * 30 + 'px"></i><span>' + a[3] + "분</span></span></div>";
      }).join("") + '<div class="r qa"><span class="n">+</span><span class="nm">마무리</span><span class="ds"><em class="ai">내일 해 볼 부탁 열 문장</em>, 질문</span><span class="tm"><i style="width:150px;background:var(--faint)"></i><span>5분</span></span></div></div>',
    build: function (el, A) {
      return [function (A) {
        A.wipe(".chiprow > *");
        A.kinetic(".title", { delay: 100, each: 22 });
        A.rise(".ag .r", { delay: 500, each: 90, y: 30, snd: "pluck", v: 0.07 });
        A.stagger(".ag .tm i", [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { delay: 800, each: 90, d: 900, e: E.out });
        A.wipe(".ag-total", { delay: 600 });
        A.later(function () { A.count("[data-total]", 0, 58, 1500); }, 800);
      }];
    }
  });

  var NEWF = [
    ["모든 화면", "글자·아래 탭", "글꼴이 <b>프리텐다드</b>로, 글자는 한 단계 크게. 아래 탭 둘째 칸이 <b>넵</b>, 가운데 <b>AI</b>."],
    ["6부", "AI 학습지·깊게 생각", "<b>학습지·퀴즈를 한글 파일</b>로, <b>깊게 생각하기</b>(하루 5번), 학부모 답장 초안."],
    ["3부", "AI가 먼저 챙겨요", "금요일 3시 <b>다음 주 미리 보기</b>, 평일 3시 반 <b>공유 드라이브 새 문서</b> 요약."],
    ["3부", "홈 정리", "<b>처리할 넵</b> 줄이 맨 위, 시간표 <b>「지금」·「다음」</b>, 맨 아래 <b>다가오는 일정</b>."],
    ["3부", "공강 → 넵 · 모두 저장", "공강인 선생님 이름을 누르면 <b>바로 넵</b>. 진도는 하루치를 <b>「모두 저장」</b> 한 번에."],
    ["4부", "조직도로 받는 사람", "메신저처럼 <b>부서·학년부·교과 나무</b>. 20명 넘게 보낼 땐 <b>한 번 더 확인</b>."],
    ["7부", "칠판 음성·자동 숨김", "<b>30초 음성 안내</b>, 여러 학년 함께, 수업 시작 30초 뒤 <b>칠판이 저절로 숨기</b>."],
    ["따라하기 안내", "분실물 함·구기대회", "<b>둥둥 떠다니는</b> 분실물 함, 학생은 <b>칠판·QR</b>로. 대진표와 <b>경기 알림</b>."]
  ];
  D.add({
    id: "whatsnew", part: 0, label: "10월 셋째 주 새 기능", kind: "light", min: 1.2, isNew: true,
    notes: "10월 셋째 주(10/13~10/17)에 화면이 크게 바뀌었습니다. 먼저 <b>글꼴과 글자 크기</b>: 프리텐다드로 바뀌고 글자가 한 단계 커졌습니다. <b>아래 탭</b> 둘째 칸이 시간표에서 <b>넵</b>으로 바뀌었고(시간표는 더보기 「도구」와 홈 카드에), 가운데에 <b>AI</b> 단추가 솟아 있습니다 — 오늘 가장 많이 누르실 단추입니다. 나머지는 각 부에서 직접 봅니다(분실물 함·구기대회는 따라하기 안내에). 왼쪽 위 표시를 가리키며 “뒤에서 직접 봅니다” 정도로 짧게 넘깁니다.",
    html: '<div class="chiprow"><span class="chip new">NEW</span><span class="chip ghost">10월 13일 ~ 17일</span></div><h2 class="title">이번 주에 <em>새로 바뀐</em> 여덟 가지</h2>' +
      '<div class="abs nf">' + NEWF.map(function (f) { return '<div class="card c"><span class="where">' + f[0] + "</span><h3>" + f[1] + "</h3><p>" + f[2] + "</p></div>"; }).join("") + "</div>",
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
    part: 1, art: "basics", min: 8, lines: ["한 번 켜 두면", "<em>아침마다</em> 옵니다"],
    was: "오늘 일정·경건회·등교지도를 여기저기서 확인", now: "평일 아침 7시 50분, 알림 한 번으로",
    notes: "1부는 <b>로그인 → 앱 설치 → 알림 켜기</b>까지 함께 합니다. 이 세 가지만 해 두면 내일 아침부터 7시 50분에 오늘 일정이 휴대폰으로 옵니다. 끝나면 <b>바로 2부에서 AI에게 첫 부탁</b>을 해 봅니다. 홈 화면·빼꼼·알림함은 3부에서 둘러봅니다."
  });

  practice({
    id: "p1", part: 1, num: 1, label: "실습 1 · 로그인과 비밀번호", min: 2.5, practiceMin: 3, trans: "zoom",
    chips: [{ t: "실습 1 · 기본 설정" }, { t: "3분", c: "ghost" }], title: "로그인하고 비밀번호 바꾸기",
    steps: [
      { t: "카메라로 QR을 찍어 AI 교무실을 엽니다", s: 0 },
      { t: '<span class="q">「이름」</span> 칸에 이름을 적고, 아래에서 <b>내 이름을 고르면</b> <span class="q">「선택됨」</span>', s: 0, r: R("login", "name") },
      { t: '받은 비밀번호를 넣고 <span class="k">로그인</span>', s: 0, r: R("login", "go") },
      { t: '처음이면 새 비밀번호를 정합니다. <b>8자 이상, 영문과 숫자</b>를 함께', s: 1, r: R("password", "new") },
      { t: '<span class="k">비밀번호 변경</span>을 누르면 끝', s: 1, r: R("password", "go") },
      { t: '홈 화면: 오늘 내 수업·<span class="q">처리할 넵</span>·<span class="q">「오늘 알림」</span>이 한눈에', s: 2 }
    ],
    note: { html: '<img src="img/qr.svg" alt="" style="width:76px;height:76px;flex:none;border-radius:8px"><span>이름이 안 나오면 <b>초성(ㅎㄱㄷ)</b>으로도 찾습니다. 비밀번호를 잊으셨으면 <b>교목실</b>에서 바로 맞춰 드립니다.</span>' },
    screens: [shot("login"), shot("password"), shot("home")],
    notes: "QR로 열고 이름을 적으면 아래에 이름이 뜨고, 고르면 「○○○ · 부서 선택됨」이 됩니다. <b>처음 로그인하면 비밀번호를 꼭 바꾸게</b> 되어 있습니다(8자 이상, 영문+숫자). 첫 단계로 넘기면 오른쪽 아래 <b>실습 타이머 3분</b>이 시작됩니다. 다 되신 분은 옆 선생님을 도와 달라고 부탁하세요."
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
      { t: '홈 화면 아이콘으로 열고, 아래 <span class="k">더보기</span>', s: 0, r: R("home", "tabMore"), z: 1.8 },
      { t: '맨 아래 <span class="q">「설정」</span> 묶음의 <span class="k">알림 설정</span>', s: 1, r: R("more-2", "noti") },
      { t: '<span class="k">켜기</span>', s: 2, r: R("notifications-off", "on") },
      { t: '휴대폰이 물으면 <span class="q">「허용」</span>', s: 3, r: "[data-t=allow]", z: 1.9 },
      { t: '<span class="k">내 기기로 시험 발송</span> → 알림이 오면 끝', s: 4, r: R("notifications-on", "test"), fn: function (A, P) { A.later(function () { P.wide(); A.banner(P.el(4), { title: "시험 알림", body: "이 기기로 알림이 잘 옵니다." }); }, 1300); } }
    ],
    note: { html: "<span>평일 <b>7시 50분</b> 아침, <b>11시 30분</b> 점심 알림. 맨 위에는 선생님마다 <b>「내 줄」</b>(내 당번·바뀐 내 수업·겹치는 일정·오늘 마감 넵)이 옵니다.</span>" },
    gnote: { html: "<span>평일 <b>7시 50분</b> 아침, <b>11시 30분</b> 점심 알림. 맨 위에는 선생님마다 <b>「내 줄」</b>(내 당번·바뀐 내 수업·내 수업과 겹치는 일정·오늘 마감 넵)이 옵니다. 넵·서명 요청·수업 교체·<b>보건실 입실</b>, 금요일 3시 <b>다음 주 미리 보기</b>도 알림으로 옵니다. 아이폰은 <b>홈 화면 아이콘으로 열어야</b> 켜기 단추가 나옵니다.</span>" },
    screens: [shot("home"), shot("more-2"), shot("notifications-off"), M.notiAsk, shot("notifications-on")],
    notes: "오늘 연수에서 <b>가장 중요한 실습</b>입니다. 10월 12일 기준 알림을 켠 선생님이 74명 중 34명이에요. 아침·점심 알림 맨 위에는 선생님마다 다른 <b>「내 줄」</b>이 옵니다 — 내 당번(등교지도·경건회 인도·급식지도), 바뀐 내 수업, 내 수업 시간과 겹치는 일정, 오늘 마감인 넵, 그리고 AI가 학사일정을 읽어 고른 <b>나와 관련된 일정</b>입니다. 「허용」을 실수로 거절하셨으면 휴대폰 설정 → 알림 → AI 교무실에서 허용합니다. <b>시험 발송까지 해서 알림이 오는 것을 꼭 확인</b>해 주세요."
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
          lt = A.lt({ tag: "꼭", title: "알림 켜기를 해 두어야 옵니다", sub: "끄기: 더보기 → 알림 설정 → 「보건실 입실 알림」 · 현황: 더보기 → 보건실" });
        }
      ];
    }
  });

  D.add({
    id: "check", part: 1, label: "점검 · 여기까지 됐나요?", kind: "light", min: 0.5,
    notes: "한 줄씩 넘기며 손을 들어 확인합니다. 넘길 때마다 체크 표시가 됩니다. <b>안 된 분이 있으면 여기서 잠깐 멈추고</b> 오른쪽 「안 될 때」를 보며 같이 해결합니다. 다 되면 바로 오늘의 핵심, <b>AI</b>로 넘어갑니다.",
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
  // 2부 · AI에게 부탁하기 (오늘의 핵심: 말하기 → 카드 → 누르기)
  // ════════════════════════════════════════════════════════════
  opener({
    part: 2, art: "ai", min: 6, isNew: true, flag: "핵심", lines: ["메뉴를 몰라도", "<em>말하면</em> 됩니다"],
    was: "메뉴를 찾고, 양식을 찾아 처음부터 직접", now: "말로 부탁하면 AI가 카드로 초안까지, 누르는 건 선생님",
    notes: "2부가 오늘 연수의 <b>핵심</b>입니다. 아래 탭 가운데 <b>AI</b>에게 말로 묻고 부탁하면, 학교 자료를 찾아 답하고 필요한 것은 <b>확인 카드</b>로 초안까지 만듭니다. 카드는 누르기 전까지 선생님만 보는 초안입니다. 여기서 첫 부탁을 해 보고, 3부부터는 부마다 끝에 <b>「AI로 하면」</b>으로 다시 봅니다."
  });

  D.add({
    id: "aiIntro", part: 2, label: "말하기 → 카드 → 누르기", kind: "light", min: 1, trans: "zoom",
    notes: "오늘의 세 박자입니다. <b>묻기</b> — 시간표·급식·학사일정·주간소식은 물론 자료실 한글·PDF 파일 본문까지 찾아 답하고 출처를 붙입니다. 자료실에 없으면 <b>학교 공유 드라이브</b>(부서 자료·교육계획서·교과 자료 등)도 찾아 읽습니다. <b>📎로 붙인 파일(PDF·사진·한글·엑셀)과 붙여 넣은 웹 주소</b>도 읽습니다. <b>부탁하기</b> — 가정통신문, 기기 수리 같은 신청을 말로 하면 필요한 것만 되묻습니다. 넵도 초안 카드로 만들어 [넵 보내기]를 누르면 갑니다. <b>확인 카드</b> — 카드에서 고친 뒤 [등록]을 눌러야 실제로 적힙니다. <b>오늘 실습은 카드가 뜨는 데까지만</b> 합니다. 질문은 하루 60개까지, 어려운 일은 「깊게 생각하기」(하루 5번). 이 세 박자를 3부부터 부마다 「AI로 하면」으로 다시 봅니다.",
    html: '<div class="chiprow"><span class="chip">AI에게 부탁하기</span></div><h2 class="title">말하면, <em>카드로</em>. 누르는 건 선생님</h2>' +
      '<div class="abs card askc" style="left:120px"><span class="sn">1</span><h3>묻기</h3><p>자료실·공유 드라이브 파일의 <b>본문까지</b> 찾아 답하고, 출처 링크를 붙입니다.</p><div class="chips"><span>빈 교실</span><span>급식</span><span>학사일정·주간소식</span><span>담임</span><span>자료실 내용</span><span>생기부 기재요령</span><span class="nwc">공유 드라이브</span><span class="nwc">📎 파일·웹 주소</span></div></div>' +
      '<div class="abs card askc" style="left:700px"><span class="sn">2</span><h3>부탁하기</h3><p>말로 부탁하면 AI가 <b>필요한 것만</b> 되묻고 초안을 만듭니다.</p><div class="chips"><span>가정통신문</span><span>통신문 번호</span><span>기기 수리</span><span>도서관 이용</span><span>희망도서</span><span>교과협의록</span><span>회의 서명부</span><span class="nwc">넵 보내기</span><span class="nwc">수업교체 계산</span><span class="nwc">학습지·퀴즈</span></div></div>' +
      '<div class="abs card askc confirm" style="left:1280px"><span class="sn">3</span><h3>누르는 건 선생님</h3><p>확인 카드에서 고친 뒤 <b>[등록]</b>을 눌러야 실제로 적힙니다. 누르기 전 초안은 나만 봅니다.</p></div>' +
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
    id: "p9", part: 2, num: 4, label: "실습 4 · AI에게 첫 부탁", min: 2, practiceMin: 2, trans: "zoom",
    chips: [{ t: "실습 4 · AI" }, { t: "2분", c: "ghost" }], title: "첫 부탁은 <em>쉬운 것부터</em>",
    steps: [
      { t: '아래 탭 가운데 <span class="k">AI</span>', s: 0, r: R("ai-home", "tab_ai"), z: 1.8 },
      { t: '<b>추천 질문</b>은 그날 나에게 맞춰 바뀝니다(처리 안 한 넵·마감·시간대)', s: 0, r: R("ai-home", "chips") },
      { t: '입력칸에 <span class="q">「이번 주 학사일정 알려 줘」</span> → <span class="k">보내기</span>', s: 0, r: R("ai-home", "input") },
      { t: '요일별로 정리한 답. 시간표·급식·담임·빈 교실도 이렇게 묻습니다', s: 1, r: R("ai-week", "answer") },
      { t: '두 번째: <span class="q">「수행평가 못 본 학생은 어떻게 처리해?」</span> → 답 끝에 <b>출처</b>와 <span class="k">열기 ›</span>', s: 2, r: R("ai-library", "links"), z: 1.95 },
      { t: '답이 좋았는지 <b>👍 👎</b> — 대화 내용은 담기지 않아요', s: 2, r: R("ai-library", "feedback"), z: 1.95 }
    ],
    note: { tone: "warn", html: "<span>학생 이름·실제 생기부 문장은 넣지 마세요. 질문은 외부 AI로 전송되고, <b>하루 60개</b>까지 묻습니다.</span>" },
    gnote: { tone: "warn", html: "<span>AI는 자료실 파일의 <b>본문까지</b> 읽고, 자료실에 없으면 <b>학교 공유 드라이브</b>에서도 찾습니다. <b>📎</b>로 PDF·사진·한글(hwpx)·엑셀 파일이나 웹 주소를 붙여도 읽고 답합니다(붙인 것은 이 대화에서만 씀). 학생 이름·실제 생기부 문장은 넣지 마세요. 질문은 외부 AI로 전송되고, <b>하루 60개</b>까지 묻습니다.</span>" },
    screens: [shot("ai-home"), shot("ai-week"), shot("ai-library")],
    notes: "이제 <b>첫 부탁</b>입니다. 모두 아래 탭 가운데 AI를 누르고, 쉬운 것부터 — <b>「이번 주 학사일정 알려 줘」</b>를 보내 봅니다. 요일별로 정리된 답이 오면 성공입니다. 두 번째로 자료실에 있는 것을 물어봅니다. AI는 시간표·급식·학사일정·주간소식은 물론 <b>자료실 파일 본문과 학교 공유 드라이브</b>까지 찾아 읽고, 답 끝에 출처를 붙입니다. 추천 질문은 그날 선생님의 넵·마감·시간대에 맞춰 바뀝니다. 👍👎에는 대화 내용이 담기지 않고, 👎 뒤 「관리자에게 보내기」를 누른 때만 그 대화를 보냅니다."
  });

  practice({
    id: "p10", part: 2, num: 5, label: "실습 5 · 가정통신문 부탁하기", min: 1.5, practiceMin: 2,
    chips: [{ t: "실습 5 · AI" }, { t: "2분", c: "ghost" }], title: "가정통신문, <em>말로 부탁하기</em>",
    steps: [
      { t: '「11월 3일부터 5일까지 학부모 공개수업 가정통신문 초안 써 줘」', s: 0, r: R("ai-letter", "question") },
      { t: '<span class="q">「가정통신문 초안」</span> 카드: 주무부서·제목·발송일·본문', s: 0, r: R("ai-letter", "head") },
      { t: '카드에서 고친 뒤 <span class="k">번호 받고 문서 만들기</span>', s: 1, r: R("ai-letter-2", "button"), warn: "누르면 번호 시트에 실제로 적힙니다" },
      { t: '번호만 필요하면 「번호 받아 줘」 → <span class="q">「가정통신문 번호 등록」</span>', s: 2, r: R("ai-number", "card") }
    ],
    screens: [shot("ai-letter"), shot("ai-letter-2"), shot("ai-number")],
    notes: "가정통신문은 말로 부탁하면 학교 양식의 첫 문장을 지킨 초안 카드가 뜹니다. 날짜를 말하지 않으면 그럴듯한 날을 넣고 그렇게 넣었다고 밝힙니다. <b>오늘은 카드가 뜨는 데까지만</b> — 「번호 받고 문서 만들기」를 누르면 번호 시트에 실제로 적힙니다."
  });

  practice({
    id: "p11", part: 2, num: 6, label: "실습 6 · 기기 수리 요청", min: 1, practiceMin: 1,
    chips: [{ t: "실습 6 · AI" }, { t: "1분", c: "ghost" }], title: "고장 난 기기, <em>한 문장으로</em>",
    steps: [
      { t: '「2-3 교실 프로젝터가 자꾸 꺼져요. 수리 요청해 줘」', s: 0, r: R("ai-repair", "question") },
      { t: '<span class="q">「디지털 기기 수리요청」</span> 카드: 장소·기기·요청 사항, 신청자는 저절로', s: 0, r: R("ai-repair", "head") },
      { t: '확인 뒤 <span class="k">시트에 등록</span>', s: 0, r: R("ai-repair", "button"), warn: "누르면 수리 요청 시트에 실제로 적힙니다" }
    ],
    gnote: { html: "<span>같은 방식으로 카드가 되는 것: 가정통신문·통신문 번호·<b>도서관 이용</b>·<b>희망도서</b>·교과협의록·회의 서명부·넵·수업 자료·수업 교체. 신청자 이름은 저절로 들어가고, 빠진 칸은 AI가 다시 묻습니다.</span>" },
    screens: [shot("ai-repair")],
    notes: "기기 수리는 한 문장이면 됩니다. 장소·기기·증상을 읽어 카드를 채우고, 신청자는 선생님 이름으로 들어갑니다. 오늘은 카드까지만 봅니다."
  });

  // ════════════════════════════════════════════════════════════
  // 3부 · 홈·시간표·교체
  // ════════════════════════════════════════════════════════════
  opener({
    part: 3, art: "class", min: 8, lines: ["오늘이 한눈에,", "<em>교체는 말로</em>"],
    was: "빈 교실·바꿀 수업을 찾으러 교무실 시간표 앞으로", now: "홈에서 오늘이 한눈에, 수업교체는 AI 한 문장으로 계산까지",
    notes: "3부는 매일 보는 <b>홈 화면·빼꼼·알림함</b>, 그리고 <b>시간표·진도</b>입니다. 시간표는 이제 아래 탭이 아니라 <b>홈의 「오늘 시간표」 카드</b>나 더보기 「도구」에서 엽니다. 끝에는 첫 <b>「AI로 하면」</b> — 수업교체를 AI 한 문장으로 계산합니다."
  });

  practice({
    id: "home", part: 3, num: null, label: "새 홈 화면 둘러보기", min: 1, isNew: true,
    chips: [{ t: "NEW", c: "new" }, { t: "둘러보기", c: "ghost" }], title: "홈 화면, 이렇게 <em>정리됐어요</em>",
    steps: [
      { t: '큰 글씨는 <b>선생님마다 다른 한마디</b>. 오른쪽 위 <span class="k">종</span>은 나에게 온 알림', g: '큰 글씨는 <b>선생님마다 다른 한마디</b>(AI가 그날 내 수업·당번·교체를 보고 씁니다). 오른쪽 위 <span class="k">종</span>은 나에게 온 알림 모음', s: 0, r: R("home", "hero"), newf: true },
      { t: '세 칸 <span class="q">수업 · 일정 · 빼꼼</span>: 누르면 나오는 화면과 <b>같은 숫자</b>', g: '세 칸 <span class="q">수업 · 일정 · 빼꼼</span>: 누르면 나오는 화면과 <b>같은 숫자</b>. 일정은 「일정 3 · 넵 2」처럼 나눠 세고, 빼꼼은 「공지 N · 교체 N」', s: 0, r: R("home", "tiles"), z: 1.9 },
      { t: '<span class="q">「처리할 넵 5건 · 새 알림 1건」</span> 줄이 맨 위에 가장 크게', s: 0, r: R("home", "nep"), newf: true, z: 1.8 },
      { t: '오늘 시간표: 지금 교시에 <span class="q">「지금」</span>, 지난 교시는 흐리게, 교체는 「바뀜」', g: '오늘 시간표: 지금 교시에 노란 칸 <span class="q">「지금」</span>(쉬는 시간엔 점선 「다음」), 지난 교시는 흐리게. 교체로 들어온 수업은 초록 「바뀜」, 넘긴 교시는 「교체」. 칸의 점은 그 교시에 겹친 일정', s: 0, r: R("home", "now"), newf: true, z: 1.9 },
      { t: '<span class="q">「오늘 알림」</span>: 공지·오늘 바뀐 수업·넵 일정·특별 일정, 그 아래 <b>급식</b>', s: 1, r: R("home-3", "alerts") },
      { t: '맨 아래 <span class="q">「다가오는 일정」</span>: 오늘부터 7일, 누르면 그날 달력', s: 1, r: R("home-3", "upcoming"), newf: true }
    ],
    gnote: { html: "<span>날짜 옆에는 지금 <b>날씨·미세먼지</b>. 할 일이 있으면 <b>넵 탭·더보기 탭·앱 아이콘에 숫자</b>가 붙습니다. 급식이 없는 날은 급식 카드가 숨고, 주말에는 다음 등교일 수업·일정이 보입니다. 화면 속 이름·일정은 예시입니다.</span>" },
    screens: [shot("home"), shot("home-3")],
    lt: { tag: "NEW", title: "새 홈 화면", sub: "10월 16~17일 정리 · 글자 한 단계 크게" },
    notes: "이번 주에 홈 화면을 정리했습니다. 큰 글씨 한마디는 <b>선생님마다</b> 다릅니다 — 오늘 교체로 수업을 맡아 준 선생님께는 “고마워요”, 급식지도 당번에게는 “점심 챙기세요”처럼요(규칙과 AI가 함께 고르고, 퇴근했다고 단정하거나 다그치는 말은 쓰지 않습니다). 세 칸 숫자는 <b>누르면 나오는 화면과 같은 셈</b>으로 맞췄고, <b>처리할 넵</b> 줄을 가장 크게 올렸습니다. 오늘 시간표는 지금 교시에 「지금」, 쉬는 시간엔 다음 교시에 「다음」. 맨 아래는 주간소식 대신 내용대로 <b>「다가오는 일정」</b>입니다. 화면 속 이름·일정은 예시입니다."
  });

  practice({
    id: "today", part: 3, num: null, label: "빼꼼 둘러보기", min: 0.6,
    chips: [{ t: "둘러보기" }, { t: "옛 현황판", c: "ghost" }], title: "오늘 달라진 것은 <em>빼꼼</em>",
    steps: [
      { t: '홈의 <span class="q">「빼꼼」</span> 칸이나 더보기 맨 위 <span class="k">빼꼼</span>', s: 0, r: R("home", "tiles"), z: 1.9 },
      { t: '맨 위 <span class="q">「알림판」</span>: 고정 공지와 올린 지 하루 안 된 공지', s: 1, r: R("today", "board") },
      { t: '요일을 눌러 이번 주 다른 날도 봅니다', s: 1, r: R("today", "days") },
      { t: '<span class="q">「특별 일정」</span>: 학사일정과 <b>주간소식</b>을 한 목록으로', s: 2, r: R("today-2", "events") },
      { t: '<span class="q">「바뀐 수업」</span>: 이름 없이 <b>과목만</b>, 「수락 대기」·「보강 필요」·「교실 배정 필요」도', s: 2, r: R("today-2", "changes") }
    ],
    gnote: { html: "<span>그날 마감인 넵과 넵 속 일정은 <b>「내 넵」</b> 칸에 나에게만 보이고, 구기대회 기간에는 경기 카드도 붙습니다. 교체 사유(출장·연수 등)는 보이지 않습니다. 열어 두면 1분마다 새로 읽습니다.</span>" },
    screens: [shot("home"), shot("today"), shot("today-2")],
    lt: { title: "빼꼼", sub: "오늘 학교를 빼꼼 — 공지와 평소 시간표에서 달라진 것" },
    notes: "빼꼼은 <b>평소와 달라진 것만</b> 모은 화면입니다. 맨 위 알림판에 공지, 그 아래 요일 칸, 그날 나의 넵(「내 넵」, 나에게만), 특별 일정, 바뀐 수업 순서입니다. 바뀐 수업은 <b>선생님 이름 없이 과목만</b> 보이고, 상대 수락을 기다리는 교체는 「수락 대기」, 교실이 아직 안 정해졌으면 「교실 배정 필요」가 붙습니다. 누가 왜 자리를 비우는지는 싣지 않습니다."
  });

  practice({
    id: "info", deck: false, part: 3, num: null, label: "일정·주간소식·급식", min: 0.8,
    chips: [{ t: "둘러보기" }], title: "일정·주간소식·급식도 <em>한곳에</em>",
    steps: [
      { t: '더보기 → <span class="k">일정</span>: 학사일정 달력, 휴대폰에선 점으로', s: 0, r: R("calendar", "today"), z: 1.9 },
      { t: '<span class="q">「주간」</span>: 넵 마감·넵 일정, 내 출장·교체 수업은 <b>나에게만</b> 겹쳐 보여요', s: 1 },
      { t: '<span class="k">주간소식</span>: 교무부 주간소식을 날짜별 표 그대로', s: 2 },
      { t: '<span class="k">급식</span>: 이번 주 중식과 알레르기 번호', s: 3 }
    ],
    gnote: { html: "<span>학사일정은 학교 구글 캘린더에서 저절로 들어옵니다. 넵 마감·넵 속 일정·내 수업교체 표시는 학교 달력에 들어가지 않고 그 선생님 화면에만 보입니다.</span>" },
    screens: [shot("calendar"), shot("calendar-list"), shot("weekly"), shot("meals")],
    notes: "일정은 학교 구글 캘린더의 학사일정을 그대로 보여 주고, 그 위에 <b>나에게만</b> 넵 마감·넵 속 일정·내 출장과 교체 수업이 겹쳐 보입니다(주간 목록에서 「수업 교체 · 들어가는 수업」처럼). 주간소식은 교무부가 내는 주간소식 PDF를 날짜별 표로, 급식은 NEIS 급식을 그대로 보여 줍니다."
  });

  practice({
    id: "alerts", part: 3, num: null, label: "알림함과 「AI가 먼저 챙기기」", min: 0.7, isNew: true,
    chips: [{ t: "NEW", c: "new" }, { t: "둘러보기", c: "ghost" }], title: "놓친 알림은 <em>종</em>에, 요약은 <em>남겨 둡니다</em>",
    steps: [
      { t: '홈 오른쪽 위 <span class="k">종</span>: 빨간 점이 있으면 확인 안 한 알림', s: 0, r: R("home", "bell"), z: 1.9 },
      { t: '눌러 그 화면으로 가거나 <span class="k">확인</span>을 누르면 지워집니다', s: 1, r: [16, 270, 380, 120] },
      { t: '평일 <b>3시 30분</b>: 공유 드라이브에 <b>새로 만든 문서</b>를 한두 문장으로', s: 1, r: [16, 520, 380, 300], newf: true },
      { t: '금요일 <b>3시</b>: <span class="q">「다음 주 미리 보기」</span> — 마감 넵·수업 교체·나와 관련된 일정', s: 1, newf: true }
    ],
    gnote: { html: "<span>요약 알림(드라이브 새 문서·다음 주 미리 보기)은 <b>눌러 열어도 남고</b> 「확인」을 눌러야 사라집니다. 확인하지 않은 알림은 30일 뒤 지워집니다. 공지·주간소식처럼 모두에게 가는 알림은 알림함에 쌓이지 않습니다.</span>" },
    screens: [shot("home"), shot("alerts")],
    lt: { tag: "NEW", title: "알림함", sub: "AI가 먼저 챙겨 주는 두 가지 요약" },
    notes: "오른쪽 위 종은 <b>나에게만 온 알림</b>을 모아 둡니다. 확인하면 지워집니다. 새로 생긴 두 가지 요약이 있습니다. 평일 <b>3시 30분</b>에는 학교 공유 드라이브에 새로 만든 문서를 AI가 한두 문장으로 요약해 관련 있는 선생님께 보내고, 금요일 <b>3시</b>에는 다음 주에 마감인 넵, 수업 교체, 나와 관련된 학교 일정을 묶어 「다음 주 미리 보기」를 보냅니다. 이 둘은 다시 보시라고 눌러도 남겨 둡니다."
  });

  practice({
    id: "p4", part: 3, num: 7, label: "실습 7 · 시간표와 빈 교실", min: 2, practiceMin: 2, trans: "zoom",
    chips: [{ t: "실습 7 · 시간표" }, { t: "2분", c: "ghost" }], title: "내 시간표와 지금 빈 교실",
    steps: [
      { t: '홈 <span class="q">「오늘 시간표」</span>의 <span class="k">전체 보기</span>(또는 더보기 → 시간표)', s: 0, r: R("home", "tt"), z: 1.8 },
      { t: '<span class="q">「교사 · 학급 · 교실 · 전체」</span>로 보는 기준을 바꿉니다', s: 1, r: R("tt-my", "tabs") },
      { t: '이번 주 칸에 <b>학사일정·넵 일정</b> 띠, 누르면 <b>전체 글</b>', s: 2, r: R("tt-pop", "pop") },
      { t: '그 주 <b>수업교체</b>가 저절로: 초록 「바뀜」·흐린 「교체」·「수락 대기」', s: 1, r: R("tt-my", "changed"), z: 1.9 },
      { t: '아래로 내리면 <span class="q">「빈 교실」</span>과 <span class="q">「공강인 선생님」</span>', s: 3, r: R("tt-free", "rooms") },
      { t: '공강인 선생님 <b>이름을 누르면 그분께 넵</b> <span class="nw">NEW</span>', s: 4, r: [31, 91, 350, 83], newf: true }
    ],
    note: { html: "<span>빈 교실·공강은 <b>그날 실제 시간표</b>(학사일정·확정된 교체 반영)로 셉니다. 수업교체는 다른 선생님 개인 시간표에는 보이지 않습니다.</span>" },
    gnote: { html: "<span>띠와 수업교체는 <b>이번 주(주말이면 다음 주) 그 날짜에만</b> 붙습니다. 학급·교실 시간표에는 바뀐 과목만(선생님 이름 없이) 보이고, <b>다른 선생님 개인 시간표에는 수업교체가 보이지 않습니다</b>. 요일·교시를 골라 다른 시간의 빈 교실·공강도 봅니다. 화면 속 시간표·이름은 예시입니다.</span>" },
    screens: [shot("home"), shot("tt-my"), shot("tt-pop"), shot("tt-free"), shot("tt-free-nep")],
    notes: "시간표는 <b>내 시간표</b>부터 보여 줍니다. 수업 시간과 겹치는 학사일정·주간소식·넵 일정이 그 칸에 띠로 붙고, 띠를 누르면 전체 글이 뜹니다. 그 주 수업교체도 저절로 얹힙니다 — 새로 맡은 칸은 초록 「바뀜」, 넘겨 준 칸은 흐리게 「교체」, 못 메운 칸은 「보강」, 상대가 아직 수락하지 않았으면 「수락 대기」. 아래 「빈 교실」·「공강인 선생님」은 이번 주 그 요일의 <b>실제 시간표</b>로 셉니다(10/16부터). <b>공강인 선생님 이름을 누르면 그분께 넵 쓰기가 열립니다.</b>"
  });

  practice({
    id: "p5", part: 3, num: 8, label: "실습 8 · 오늘 진도와 「한 달」 도장판", min: 2.5, practiceMin: 3,
    chips: [{ t: "실습 8 · 진도표" }, { t: "3분", c: "ghost" }], title: "진도는 한 줄로, <em>모두 저장</em> 한 번",
    steps: [
      { t: '홈 <span class="q">「오늘 시간표」</span>의 <span class="k">진도 기록</span>', s: 0, r: [246, 569, 62, 21], z: 1.9 },
      { t: '오늘 <b>실제로 하는 수업</b>마다 칸이 하나(교체로 들어온 수업은 「바뀜」)', s: 1, r: R("pg-today", "card") },
      { t: '적은 뒤 화면 아래 <span class="k">모두 저장</span> 한 번', s: 1, r: R("pg-today", "save"), newf: true, z: 1.9 },
      { t: '<span class="q">「진도 지도」</span> → <span class="q">「한 달」</span>: 반마다 이달 수업이 도장으로', s: 2, r: R("pg-month", "summary") },
      { t: '점선 동그라미를 누르면 <b>그 주를 바로</b> 적습니다. 한 주를 다 채우면 ⭐', s: 2, r: R("pg-month", "row") }
    ],
    note: { html: "<span>저장 안 한 칸이 있으면 다른 날짜·메뉴로 갈 때 <b>한 번 물어봅니다</b>. 진도는 <b>본인 것만</b> 보입니다.</span>" },
    screens: [shot("home"), shot("pg-today"), shot("pg-month")],
    notes: "진도는 <b>한 줄이면 충분</b>합니다. 이번 주부터 칸마다 저장하지 않고 <b>하루치를 「모두 저장」 한 번</b>에 저장합니다. 칸은 원래 시간표가 아니라 <b>그날 실제로 하는 수업</b>(학사일정·확정된 교체 반영)이라, 교체로 들어온 수업도 칸이 생깁니다. 「한 달」 보기는 반마다 이달 수업을 도장처럼 보여 주고, 점선 동그라미를 누르면 그 주를 바로 적습니다."
  });

  practice({
    id: "swap", deck: false, part: 3, num: null, label: "수업교체 계산하기 (보기만)", min: 2,
    chips: [{ t: "보기만 · 수업교체" }, { t: "학사일정 반영", c: "ghost" }], title: "수업교체는 <em>계산부터</em>",
    steps: [
      { t: '더보기 → <span class="k">수업교체</span> → <span class="q">「계산하기」</span>', s: 0, r: R("sub-calc", "tabs") },
      { t: '선생님·날짜·사유·교시를 고르면 <b>그날 학사일정</b>이 바로 보입니다', s: 0, r: R("sub-calc", "calendar") },
      { t: '<span class="k">경우의 수 찾기</span> → <b>반영한 학사일정</b>과 교체안', s: 1, r: R("sub-result", "calendar") },
      { t: '갚는 수업 날짜는 <b>그 주·한 주 뒤·두 주 뒤</b>에서. 막힌 날은 까닭이 붙어요', s: 2, r: R("sub-dates", "dates") },
      { t: '<span class="k">내 서명으로 이 안 요청</span> → 상대 선생님께 알림', s: 2, r: R("sub-dates", "request"), warn: "요청은 상대 선생님께 실제로 갑니다" },
      { t: '받은 쪽은 <span class="q">「요청」</span>에서 <span class="k">서명하고 수락</span>', s: 3, r: R("sub-requests", "accept") }
    ],
    note: { html: "<span>모두 수락하면 <b>교무부 제출함</b>으로. 신고서(한글)는 서명이 채워져 나옵니다.</span>" },
    gnote: { html: "<span>모두 수락하면 <b>교무부 제출함</b>으로 들어가고, 신고서(한글)는 서명이 채워져 나옵니다. 교무부는 제출함에서 <b>교실 정하기</b>·<b>고치기</b>·구두 동의 뒤 <b>관리자 대신 수락</b>을 할 수 있고, 날짜가 지난 교체는 저절로 빠집니다. 내 출장·연수는 <b>내 일정·홈에만</b> 「출장 · 5~7교시」로 보입니다. 화면의 이름·시간표는 예시입니다.</span>" },
    screens: [shot("sub-calc"), shot("sub-result"), shot("sub-dates"), shot("sub-requests")],
    lt: { sub: "AI에게 「목요일 4~7교시 출장, 교체해 줘」라고 해도 같은 계산(다음 장면)" },
    notes: "수업교체는 계산부터 합니다. 날짜를 고르면 그날 학사일정(「동아리활동6-7 — 6~7교시 수업 없음」 같은 것)이 바로 보이고, 이미 잡힌 다른 교체도 얹어서 계산합니다. 교체안마다 상대 선생님 부담이 보이고, 갚는 수업 날짜는 그 주·한 주 뒤·두 주 뒤에서 고르는데 학사일정이나 다른 교체와 겹치는 날은 까닭과 함께 막힙니다. <b>요청 단추는 상대 선생님께 실제로 갑니다</b>. 화면·알림에는 「결강」이라는 말 대신 「수업 교체」를 씁니다."
  });

  aiWay({
    id: "aiSwap", part: 3, label: "AI로 하면 · 수업교체", min: 1.3,
    title: "수업교체도 <em>한 문장으로</em>",
    menu: "더보기 → 수업교체 → 계산하기 → 선생님·날짜·사유·교시 고르기",
    say: "다음 주 목요일 4~7교시 출장, 교체해 줘",
    steps: [
      { t: '메뉴로는 <span class="k">수업교체</span> → <span class="q">「계산하기」</span>에서 날짜·사유·교시를 하나씩', s: 0, r: R("sub-calc", "calendar") },
      { t: 'AI에게: <span class="q">「다음 주 목요일 4~7교시 출장, 교체해 줘」</span>', s: 1, r: R("ai-swap", "question") },
      { t: '<b>같은 계산기</b>로 그날 학사일정·이미 잡힌 교체까지 반영한 <span class="q">「수업 교체안」</span>', s: 1, r: [16, 326, 380, 130] },
      { t: '<span class="q">「1안 · 추천」</span>이 상대 선생님 부담이 가장 적은 안. 갚는 날짜를 고르고', s: 1, r: [31, 458, 350, 34] },
      { t: '<span class="k">내 서명으로 이 안 요청</span>은 선생님이 누릅니다', s: 1, r: [31, 734, 236, 40], warn: "누르면 상대 선생님께 실제로 요청이 갑니다" }
    ],
    gnote: { html: "<span>AI도 메뉴의 「계산하기」와 <b>같은 계산기</b>를 씁니다 — 그날 학사일정과 이미 잡힌 교체까지 반영합니다. 카드에서 갚는 날짜를 고르고 「내 서명으로 이 안 요청」을 눌러야 상대 선생님께 갑니다. 받은 쪽은 수업교체 「요청」에서 서명하고 수락합니다.</span>" },
    screens: [shot("sub-calc"), shot("ai-swap")],
    notes: "첫 <b>「AI로 하면」</b>입니다. 같은 수업교체를 <b>메뉴로 한 번, AI로 한 번</b> 봅니다. 메뉴로는 더보기 → 수업교체 → 계산하기에서 선생님·날짜·사유·교시를 고릅니다. AI에게는 「다음 주 목요일 4~7교시 출장, 교체해 줘」 한 문장이면, <b>같은 계산기</b>로 그날 학사일정(동아리활동 같은 것)과 이미 잡힌 교체까지 반영해 교체안 카드를 만듭니다. 1안이 상대 선생님 부담이 가장 적은 안입니다. <b>요청 단추는 선생님이 누르고, 누르면 상대 선생님께 실제로 갑니다.</b> 화면·알림에는 「결강」 대신 「수업 교체」를 씁니다."
  });

  // ════════════════════════════════════════════════════════════
  // 4부 · 넵
  // ════════════════════════════════════════════════════════════
  opener({
    part: 4, art: "nep", min: 8, lines: ["읽었는지, 했는지", "<em>한눈에</em> 보입니다"],
    was: "부탁하고 나서 읽었는지 몰라 다시 묻기", now: "버튼 하나로 답하고, 처리 현황이 보입니다",
    notes: "3부는 업무 연락 도구 <b>넵</b>입니다. 이제 <b>아래 탭 둘째 칸이 넵</b>이라 처리할 넵 수가 탭에 바로 붙습니다. 받는 사람은 메신저 같은 <b>조직도 나무</b>로 고르고, 마감과 글 속 일정은 받는 분 일정에 저절로 들어갑니다. 끝에는 <b>AI로 넵 초안</b>을 만들어 봅니다."
  });

  D.add({
    id: "nepIntro", part: 4, label: "넵 알아보기", kind: "light", min: 1, trans: "zoom",
    notes: "넵은 네 가지입니다. <b>알림</b>은 읽으면 끝, <b>확인요청</b>은 [넵](마감은 넣어도 되고 안 넣어도 됩니다), <b>업무요청</b>은 [완료], <b>제출요청</b>은 [제출]. 마감은 이제 <b>받는 분의 일정·빼꼼에도</b> 뜹니다. 보내는 시각도 배려합니다 — 받는 분이 <b>수업 중이면 교시가 끝난 뒤</b>, <b>근무 시간 밖이면 다음 근무일 아침</b>에 도착합니다. 긴급만 바로 울리고 한 달에 정해진 횟수까지입니다(넵 쓰기 화면에 「이번 달 N회」로 남은 횟수가 보입니다).",
    html: '<div class="chiprow"><span class="chip">넵</span></div><h2 class="title">요청은 넵으로 보내고, <em>답은 버튼 하나로</em></h2>' +
      '<div class="pills nepts"><span class="p"><b>알림</b>읽으면 끝</span><span class="p"><b>확인요청</b>[넵] · 마감(선택)</span><span class="p"><b>업무요청</b>[완료] · 마감</span><span class="p"><b>제출요청</b>[제출] · 마감</span></div>' +
      '<div class="card side abs" style="left:120px"><p class="who2">보내는 사람</p><h3>2학기 평가계획서 제출</h3><p>제출요청 · 2학년 담임 10명</p><div class="meter"><div class="lb"><span>처리</span><span><b class="mtr">3</b> / 10</span></div><div class="tr"><i style="width:100%"></i></div></div></div>' +
      '<i class="abs lane"></i><div class="abs gate"><span class="gt">3교시<br>수업 중</span></div><div class="abs env"></div>' +
      '<div class="card side abs" style="left:1280px"><p class="who2">받는 사람</p><h3>2학기 평가계획서 제출</h3><p>제출요청 · 마감 10월 9일(금)</p><div class="rbtn">제출<span class="dn">넵 처리했습니다</span></div></div>' +
      '<div class="pills rules" style="left:120px;top:800px"><span class="p"><b>수업 중</b>교시가 끝나면 도착</span><span class="p"><b>근무 시간 밖</b>다음 근무일 아침</span><span class="p warn">긴급 · 바로 울림 (한 달 횟수 제한)</span></div>',
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
          A.lt({ tag: "넵", title: "받는 분의 수업 시간을 피해 도착합니다", sub: "긴급만 바로 울림 · 한 달 횟수 제한(남은 횟수가 화면에)", delay: 400, style: "left:auto;right:120px;bottom:60px" });
        }
      ];
    }
  });

  practice({
    id: "p6", part: 4, num: 9, label: "실습 9 · 나에게 업무요청", min: 2, practiceMin: 2,
    chips: [{ t: "실습 9 · 넵" }, { t: "2분", c: "ghost" }], title: "나에게 업무요청 보내 보기",
    steps: [
      { t: '아래 탭 <span class="k">넵</span> → 오른쪽 아래 <span class="k">+ 넵 보내기</span>', s: 0, r: R("nep-inbox", "fab"), z: 1.9 },
      { t: '<span class="q">「+ 받는 사람 고르기」</span> → 칩 <span class="k">나</span> → 완료', s: 1, r: R("nep-picker", "chips"), z: 1.95 },
      { t: '<span class="q">「업무요청」</span>을 고르고 제목·본문', s: 2, r: R("nep-me-new", "kind"), z: 1.9 },
      { t: '본문에 「10월 23일까지」라고 쓰면 <b>마감 칸에 저절로</b>', s: 3, r: R("nep-me-bottom", "due"), newf: true },
      { t: '<span class="k">나에게 업무요청 보내기</span>', s: 3, r: R("nep-me-bottom", "send") }
    ],
    note: { tone: "warn", html: "<span>근무 시간 밖이면 <b>다음 근무일 아침</b>에 도착합니다. 받은 넵은 다음 실습 10에서 처리해요.</span>" },
    screens: [shot("nep-inbox"), shot("nep-picker"), shot("nep-me-new"), shot("nep-me-bottom")],
    notes: "아래 탭 넵 → 「+ 넵 보내기」. 받는 사람 창에서 맨 앞 칩 <b>「나」</b>를 누르고 완료하면 「나에게 보내기」가 됩니다. 업무요청을 고르고 본문에 날짜를 쓰면 <b>마감 칸이 저절로 채워지고</b> 「글에서 찾은 날짜를 마감으로 넣었어요」 안내가 뜹니다. 시각을 안 쓰면 16시 30분입니다. 보내기 단추에 <b>누구에게 무엇을 보내는지</b>가 그대로 적혀 있습니다."
  });

  practice({
    id: "audience", part: 4, num: null, label: "받는 사람 고르기 (조직도)", min: 1.2, isNew: true,
    chips: [{ t: "NEW", c: "new" }, { t: "둘러보기", c: "ghost" }], title: "받는 사람은 <em>조직도 나무</em>로",
    steps: [
      { t: '맨 위 <b>찾기</b>: 이름 일부·초성(ㅂㅈㅁ)·부서·교과', s: 0, r: R("nep-picker", "search") },
      { t: '칩 <span class="q">나 · 교직원 전체 · 부장단 · 교과 주임단</span>', s: 0, r: R("nep-picker", "chipAll"), z: 1.9 },
      { t: '<span class="q">「최근 보낸 분」</span>, 그 아래 교장·교감과 부서 나무', s: 0, r: R("nep-picker", "recent") },
      { t: '부서를 펼쳐 한 분씩, 또는 <b>부서 통째로 체크</b>', s: 1, r: R("nep-picker-tree", "dept"), z: 1.9 },
      { t: '초성으로 찾아 바로 고르기', s: 2, r: R("nep-picker-search", "found") },
      { t: '고른 분은 맨 위 이름표 <b>×</b>로 빼고, <span class="k">완료</span>', s: 3, r: R("nep-picker-picked", "tokens"), newf: true }
    ],
    gnote: { html: "<span>부서를 통째로 체크하면 묶음으로 보내고(예약 넵은 보낼 때 명단), 한 분이라도 빼면 남은 분 이름으로 풀립니다. 여러 부서에 계신 분은 어디서나 같이 체크됩니다. 연락처는 싣지 않습니다. <b>20명 이상</b>에게 보내면 보내기 전에 받는 분·제목을 한 번 더 확인합니다. 회의 서명부·파일 서명도 같은 고르기를 씁니다. 화면 속 이름은 예시입니다.</span>" },
    screens: [shot("nep-picker"), shot("nep-picker-tree"), shot("nep-picker-search"), shot("nep-picker-picked")],
    lt: { tag: "NEW", title: "받는 사람 고르기", sub: "메신저처럼 부서·학년부·교과 나무 · 넵·서명부가 함께 씀" },
    notes: "받는 사람 고르기가 메신저처럼 <b>조직도 나무</b>로 바뀌었습니다. 찾기 칸은 이름 일부·초성·부서·교과로 찾고, 칩으로 나·교직원 전체·부장단·교과 주임단을 한 번에 고릅니다. 부서를 통째로 체크하면 묶음으로, 한 분을 빼면 이름으로 풀립니다. 내 자리에는 「(나)」가 붙습니다. <b>20명 넘게 보낼 때는 보내기 전에 한 번 더 확인 창</b>이 뜹니다 — 보낸 뒤에는 알림을 거둘 수 없어서입니다."
  });

  practice({
    id: "nepDue", part: 4, num: null, label: "넵 마감·넵 속 일정", min: 0.8,
    chips: [{ t: "둘러보기" }, { t: "나에게만 보여요", c: "ghost" }], title: "마감과 넵 속 일정은 <em>내 일정에</em>",
    steps: [
      { t: '글 속 날짜가 <b>마감 칸에 저절로</b>, 다른 날짜는 단추로', s: 0, r: R("nep-new-due", "hint"), newf: true },
      { t: '보내면 AI가 글에서 <b>일정</b>을 찾아 <span class="q">「넵 속 일정」</span>으로', s: 1, r: R("nep-detail-sent", "events") },
      { t: '받는 분 화면: 점선 일정, <b>내 일정·시간표·빼꼼·아침 알림</b>에', s: 2, r: R("nep-detail-ack", "events") }
    ],
    gnote: { html: "<span>넵 마감과 넵 속 일정은 <b>보낸 분과 받는 분에게만</b> 보이고 학교 학사일정·구글 캘린더에는 들어가지 않습니다. 보낸 분은 「고치기·빼기·+ 더하기·AI로 다시 찾기」를 할 수 있습니다. 확인요청은 마감이 「마감 (선택)」이라, 필요 없으면 「마감 빼기」.</span>" },
    screens: [shot("nep-new-due"), shot("nep-detail-sent"), shot("nep-detail-ack")],
    notes: "넵을 보내면 AI가 제목·본문을 읽어 <b>날짜·교시가 있는 일정</b>을 따로 적어 둡니다(넵 속 일정). 받는 분에게는 일정·시간표·빼꼼·아침 알림에 점선으로 보이고, 보낸 분은 고치거나 뺄 수 있습니다. 학교 달력에는 들어가지 않고 <b>보낸 분과 받는 분에게만</b> 보입니다."
  });

  practice({
    id: "p7", part: 4, num: 10, label: "실습 10 · 받은 넵 처리", min: 2, practiceMin: 2,
    chips: [{ t: "실습 10 · 넵" }, { t: "옆 선생님과", c: "ghost" }], title: "받은 넵은 <em>오늘 할 일</em>처럼",
    steps: [
      { t: '<span class="q">「처리할 것」</span>이 마감 가까운 순. 「지남·오늘·내일」 띠', s: 0, r: R("nep-inbox", "todo") },
      { t: '확인요청은 목록에서 바로 <span class="k">넵</span> → 처리함으로', s: 0, r: R("nep-inbox", "ackButton"), z: 1.9 },
      { t: '업무·제출은 열어서 내용 확인 → 아래 <span class="k">완료</span>', s: 1, r: R("nep-detail-recv", "done") },
      { t: '보낸 넵은 <span class="q">「보낸 넵함」</span>: 진행 막대·마감·미처리 수', s: 2, r: R("nep-sent", "firstActive") },
      { t: '<span class="q">「아직 N명」</span> → <span class="k">N명에게 다시 알림</span>', s: 3, r: R("nep-detail-sent-board", "remind") },
      { t: '제출요청은 <span class="k">모두 받기</span>로 파일을 한 번에', s: 3, r: R("nep-detail-sent-board", "downloadAll"), z: 1.9 }
    ],
    note: { html: "<span>옆 선생님과 확인요청을 주고받아 보세요. 받은 쪽은 <b>목록에서 [넵]</b>, 보낸 쪽은 <b>보낸 넵함</b>에서 막대가 차는 걸 봅니다.</span>" },
    screens: [shot("nep-inbox"), shot("nep-detail-recv"), shot("nep-sent"), shot("nep-detail-sent-board")],
    notes: "받은 넵함은 <b>오늘 할 일</b>처럼 묶입니다: 처리할 것(마감 가까운 순) · 새 알림 · 처리함(접힘). <b>확인요청은 목록에서 바로 [넵]</b>, 업무·제출은 열어서 내용을 보고 [완료]·[제출]. 보낸 넵함은 보낼 예정 · 진행 중 · 끝난 것으로 나뉘고, 진행 중인 넵은 처리 막대와 「미처리 N명」이 보입니다. 열어서 「아직 N명」 이름을 보고 다시 알림(하루 한 번)을 보내고, 제출요청은 「모두 받기」로 파일을 zip 하나로 받습니다."
  });

  aiWay({
    id: "aiNep", part: 4, label: "AI로 하면 · 넵 초안", min: 1,
    title: "넵도 <em>말로 쓰고</em>, 보내기는 직접",
    menu: "넵 → + 넵 보내기 → 받는 사람·종류·제목·본문·마감",
    say: "2학년 담임 선생님들께 상담 기록 금요일까지 내 달라고 넵 보내 줘",
    lt: { tag: "AI로 하면", title: "「2학년 담임께 상담 기록, 넵 보내 줘」", sub: "AI는 보내지 않아요 · 넵 보내기는 선생님이", tone: "ai" },
    steps: [
      { t: '메뉴로는 <span class="k">+ 넵 보내기</span>에서 받는 사람·종류·제목·마감을 하나씩', s: 0, r: R("nep-me-new", "kind") },
      { t: 'AI에게: <span class="q">「2학년 담임 선생님들께 상담 기록 금요일까지 내 달라고 넵 보내 줘」</span>', s: 1, r: R("ai-nep", "question") },
      { t: '<span class="q">「넵 초안 · 제출요청」</span>: 제목·본문·마감까지', s: 1, r: [16, 298, 380, 300] },
      { t: '받는 사람은 말한 대로 <b>2학년부 9명</b>, 이름까지 확인', s: 1, r: R("ai-nep", "people") },
      { t: 'AI는 보내지 않아요. <span class="k">넵 보내기</span>는 선생님이', s: 1, r: [31, 712, 350, 52], warn: "누르면 받는 분들께 실제로 넵이 갑니다" }
    ],
    gnote: { html: "<span>마감 시각을 말하지 않으면 16:30처럼 그럴듯한 값을 넣고 그렇게 넣었다고 밝힙니다. 알림은 넵 화면처럼 받는 분의 수업·근무 시간을 피해 갑니다. 긴급·예약 보내기·첨부 파일은 넵 화면에서 합니다.</span>" },
    screens: [shot("nep-me-new"), shot("ai-nep")],
    notes: "넵도 <b>메뉴로 한 번, AI로 한 번</b>입니다. 메뉴로는 받는 사람을 고르고 종류·제목·본문·마감을 적습니다. AI에게 「2학년 담임 선생님들께 상담 기록 금요일까지 내 달라고 넵 보내 줘」라고 하면 종류(제출요청)·제목·본문·마감이 채워진 <b>넵 초안</b> 카드가 뜨고, 받는 사람은 말한 대로 2학년부 담임으로 맞춰집니다. <b>AI는 넵을 바로 보내지 않습니다</b> — 이름까지 확인하고 「넵 보내기」는 선생님이 누릅니다."
  });

  // ════════════════════════════════════════════════════════════
  // 5부 · 디지털 서명
  // ════════════════════════════════════════════════════════════
  opener({
    part: 5, art: "record", min: 6, lines: ["서명 받으러", "<em>돌지 않아도</em> 됩니다"],
    was: "회의 서명부를 들고 교무실 한 바퀴", now: "내 서명 한 번 등록, 문서마다 한 번 누르기",
    notes: "4부는 <b>디지털 서명</b>입니다. 내 서명을 한 번 등록해 두면 회의 서명부·파일 서명·수업교체 신고서에 <b>한 번 눌러</b> 서명합니다. 끝에는 <b>AI로 회의 서명부</b>를 만듭니다."
  });

  D.add({
    id: "signIntro", part: 5, label: "디지털 서명 한눈에", kind: "light", min: 1, trans: "zoom",
    notes: "핵심은 <b>한 번 등록, 한 번 누르기</b>입니다. 서명은 <b>본인만 보고 바꿀 수 있고 관리자도 못 봅니다.</b> 문서에는 선생님이 그 문서에서 직접 누를 때만 들어가고, 누른 순간의 그림을 문서에 따로 남겨서 나중에 서명을 바꿔도 낸 문서는 그대로입니다. 그림 서명이라 학교 내부 문서용이며 <b>에듀파인 전자결재는 그대로</b>입니다.",
    html: '<div class="chiprow"><span class="chip">디지털 서명</span></div><h2 class="title">한 번 등록하고, <em>문서마다 한 번 누르기</em></h2>' +
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
    id: "p8", part: 5, num: 11, label: "실습 11 · 내 서명 등록", min: 1.5, practiceMin: 2,
    chips: [{ t: "실습 11 · 서명" }, { t: "2분", c: "ghost" }], title: "내 서명 등록하기",
    steps: [
      { t: '더보기 맨 아래 <span class="q">「설정」</span>의 <span class="k">내 서명</span>', s: 0, r: R("more-2", "signature") },
      { t: '<span class="k">서명 그리기</span>를 누르고', s: 1, r: R("signature-empty", "draw"), z: 1.9 },
      { t: '손가락으로 그리고 <span class="k">저장</span>(가로로 돌리면 넓게)', s: 2, r: R("signature-draw", "pad") },
      { t: '도장이 있으면 <span class="k">도장 사진 올리기</span>(흰 바탕은 저절로 지워짐)', s: 1, r: R("signature-empty", "stamp"), z: 1.9 },
      { t: '<span class="q">「문서에 기본으로 씀」</span>이 붙은 것이 서명란에 들어갑니다', s: 3, r: R("signature", "default"), z: 1.95 }
    ],
    note: { html: "<span>서명은 <b>본인만</b> 보고 바꿀 수 있습니다(관리자도 못 봄). 서명부 화면에는 그림이 보이지 않고, 받는 PDF에만 들어갑니다.</span>" },
    gnote: { html: "<span>빨리 그으면 가늘게, 천천히 그으면 굵게 남습니다. 마음에 안 들면 <b>「다시 그리기」</b>. 서명은 <b>본인만</b> 보고 바꿀 수 있습니다(관리자도 못 봄). 서명부 화면에는 그림이 보이지 않고, 받는 PDF에만 들어갑니다.</span>" },
    screens: [shot("more-2"), shot("signature-empty"), shot("signature-draw"), shot("signature")],
    notes: "더보기 → 내 서명. 손 서명을 그려 저장하고, 도장이 있으면 종이에 찍은 도장을 사진으로 올립니다. 둘 중 「문서에 기본으로 씀」이 붙은 것이 문서에 들어갑니다. 서명 그림은 <b>본인만 보고 바꿀 수 있고</b>, 서명부 화면에도 보이지 않고 내려받는 PDF에만 들어갑니다."
  });

  practice({
    id: "sheet", part: 5, num: null, label: "회의 서명부 (보기만)", min: 1.3,
    chips: [{ t: "보기만 · 회의 서명부" }], title: "회의 서명부, <em>만들고·받고·내려받기</em>",
    steps: [
      { t: '더보기 → <span class="k">전자서명</span> → <span class="k">회의 서명부</span>', s: 0, r: R("sign-list", "meeting"), z: 1.9 },
      { t: '회의 이름·날짜·시간·장소, 참석자는 <b>조직도</b>로(교과협의회는 <span class="q">「교과협의회 명단 불러오기」</span>)', s: 1, r: R("sign-meeting-new", "picker") },
      { t: '<span class="k">서명부 만들고 알림 보내기</span>', s: 2, r: R("sign-meeting-new-bottom", "submit"), warn: "누르면 참석자께 실제로 알림이 갑니다" },
      { t: '받은 분은 <span class="k">내 서명으로 서명하기</span> 한 번', s: 3, r: R("sign-meeting", "sign") },
      { t: '만든 분은 <span class="k">PDF 내려받기</span>·안 한 분께 알림·마감', s: 4, r: [31, 172, 350, 44] }
    ],
    gnote: { html: "<span>내 서명이 없거나 이번만 다르게 하려면 <b>「이번만 손으로」</b>. AI 도우미에게 말로 부탁해도 됩니다(이 부 마지막 장면). 화면 속 이름은 예시입니다.</span>" },
    screens: [shot("sign-list"), shot("sign-meeting-new"), shot("sign-meeting-new-bottom"), shot("sign-meeting"), shot("sign-mine")],
    notes: "회의 서명부는 만들 때 참석자를 넵과 같은 조직도로 고르고, 「나도 명단에 넣기」를 켜 둘 수 있습니다. 받은 분은 알림을 눌러 <b>내 서명으로 서명하기</b> 한 번이면 끝, 만든 분은 명단에 서명 시각이 차는 것을 보고 PDF를 내려받습니다. 안 한 분께 다시 알림, 마감도 여기서 합니다."
  });

  practice({
    id: "signfile", part: 5, num: null, label: "파일로 서명 받기 (보기만)", min: 1.2,
    chips: [{ t: "보기만 · 파일 서명" }], title: "PDF·한글 파일의 <em>(서명)·(인)</em> 자리에",
    steps: [
      { t: '전자서명 → <span class="k">파일로 서명 받기</span>', s: 0, r: R("sign-list", "file"), z: 1.9 },
      { t: '서명 받을 파일: <b>PDF·한글(hwpx)</b>, 20MB까지. 제목과 서명할 사람(조직도)', s: 1, r: R("sign-file-new", "file") },
      { t: '<span class="k">다음: 서명 자리 확인</span> — (서명)·(인) 자리를 찾고, 이름이 적힌 자리는 그 선생님으로', s: 2, r: R("sign-file-new-bottom", "next"), warn: "자리를 확인한 뒤 「서명 요청 보내기」를 누르면 실제로 알림이 갑니다" },
      { t: '받은 분은 <span class="k">문서 보기</span>로 확인하고', s: 3, r: R("sign-file", "doc"), z: 1.95 },
      { t: '<span class="k">내 서명으로 서명하기</span>. 모두 서명하면 만든 분이 <span class="k">서명된 파일 받기</span>', s: 3, r: R("sign-file", "sign") }
    ],
    gnote: { html: "<span>옛 한글 파일(.hwp)은 한글에서 「다른 이름으로 저장 → HWPX」로 저장해 올립니다. 자리가 없는 분은 파일 맨 뒤 「서명 확인」 쪽에 서명이 들어갑니다.</span>" },
    screens: [shot("sign-list"), shot("sign-file-new"), shot("sign-file-new-bottom"), shot("sign-file")],
    notes: "계획서·동의서처럼 이미 있는 파일에 서명을 받을 때는 「파일로 서명 받기」입니다. PDF나 한글(hwpx) 파일을 올리고 서명할 사람을 고른 뒤 「다음: 서명 자리 확인」을 누르면, 파일 속 (서명)·(인) 자리를 찾아 이름이 적힌 자리는 그 선생님으로 정해 둡니다. 받은 분은 문서를 보고 내 서명으로 서명하고, 모두 서명하면 요청한 분이 「서명된 파일 받기」로 받습니다."
  });

  aiWay({
    id: "aiSheet", part: 5, num: null, label: "AI로 하면 · 회의 서명부", min: 1,
    menu: "전자서명 → 회의 서명부 → 이름·날짜·시간·장소·참석자 고르기",
    say: "금요일 15:30 연구부 협의회 서명부 만들어 줘",
    title: "회의 서명부도 <em>AI에게 말로</em>",
    steps: [
      { t: 'AI에게: <span class="q">「금요일 15:30 연구부 협의회 서명부 만들어 줘. 장소는 본관 3층 회의실」</span>', s: 0, r: R("ai-sign", "question") },
      { t: '<span class="q">「회의 서명부 초안」</span> 카드: 이름·날짜·시간·장소를 카드에서 바로 고칩니다', s: 0, r: R("ai-sign", "card") },
      { t: '<span class="q">「서명할 사람 5명」</span> → <span class="k">명단 보기</span>로 누가 들어가는지, 「나도 명단에 넣기」', s: 0, r: R("ai-sign", "people") },
      { t: '서명할 사람은 말한 대로: 전체·부서·학년부·교과·부장단·교과 주임단·학년 담임·이름', s: 0 },
      { t: '<span class="k">서명부 만들고 알림 보내기</span>', s: 0, r: R("ai-sign", "button"), warn: "누르면 서명할 분들께 실제로 알림이 갑니다" }
    ],
    gnote: { html: "<span>교과협의회 서명부는 <b>교과협의록의 그 교과 참석자 명단</b>을 그대로 씁니다. 명단은 만든 뒤 서명부 화면에서 더하거나 뺄 수 있습니다. AI는 보내지 않고, 카드의 단추는 선생님이 누릅니다.</span>" },
    screens: [shot("ai-sign")],
    notes: "앞에서 메뉴로 본 회의 서명부를 <b>AI에게 말로</b> 만들 수도 있습니다. 「금요일 15시 30분 연구부 협의회 서명부 만들어 줘」처럼 말하면 「회의 서명부 초안」 카드가 뜨고, 이름·날짜·시간·장소를 카드에서 고칩니다. 「명단 보기」로 누가 들어가는지 꼭 확인하세요. 전체·부서·교과·부장단·담임·이름 무엇이든 말한 대로 고르고, 교과협의회는 교과협의록 명단을 그대로 씁니다. <b>오늘은 「서명부 만들고 알림 보내기」를 누르지 않습니다</b> — 누르면 실제로 알림이 갑니다."
  });

  // ════════════════════════════════════════════════════════════
  // 6부 · AI 더 깊게·세특 도우미
  // ════════════════════════════════════════════════════════════
  opener({
    part: 6, art: "record", flip: true, min: 7, lines: ["어려운 일도", "<em>AI와 함께</em>"],
    was: "학습지·긴 지침·세특 첫 문장 앞에서 처음부터", now: "학습지는 한글 파일로, 긴 자료는 깊게, 세특은 초안까지",
    notes: "6부는 AI를 <b>더 깊게</b> 씁니다. 이번 주에 생긴 <b>학습지·퀴즈 한글 파일</b>, 긴 자료를 견주는 <b>깊게 생각하기</b>, <b>학부모 답장 초안</b>을 보고, <b>세특 도우미</b>로 과세특 초안을 만들어 봅니다. 세특 도우미는 학생 이름이 기기 밖으로 나가지 않고, 활동 내용만으로 기재요령에 맞춘 초안을 만듭니다."
  });

  practice({
    id: "aiLesson", part: 6, num: null, label: "학습지·퀴즈 만들기", min: 1, isNew: true, trans: "zoom",
    chips: [{ t: "NEW", c: "new" }, { t: "보기만", c: "ghost" }], title: "학습지·퀴즈는 <em>한글 파일로</em>",
    steps: [
      { t: '「논설문 주장과 근거 찾기 학습지 만들어 줘」 → <span class="q">수업 자료 · 학습지</span>', s: 0, r: R("ai-lesson", "head"), newf: true },
      { t: '문항·본문은 카드에서 바로 고칩니다', s: 0, r: [31, 518, 350, 330] },
      { t: '<span class="k">한글 파일 받기</span>: 학교 양식 한글 파일로', s: 1, r: R("ai-lesson-2", "button"), newf: true, z: 1.9 }
    ],
    gnote: { html: "<span>학습지·퀴즈·채점기준표·활동지를 만들 수 있습니다. 학년·반·번호·이름 칸은 학습지·퀴즈·활동지에 붙습니다. 회의 서명부·교과협의록도 같은 카드로 만듭니다.</span>" },
    screens: [shot("ai-lesson"), shot("ai-lesson-2")],
    notes: "이번 주에 생긴 <b>수업 자료</b>입니다. 「논설문 주장과 근거 찾기 학습지 만들어 줘」처럼 말하면 학습지 카드가 뜨고, 카드에서 고친 뒤 「한글 파일 받기」를 누르면 <b>학교 양식 한글 파일</b>로 받습니다. 학습지·퀴즈·채점기준표·활동지를 만들 수 있습니다."
  });

  practice({
    id: "aiDeep", part: 6, num: null, label: "깊게 생각하기·학부모 답장", min: 1.2, isNew: true,
    chips: [{ t: "NEW", c: "new" }, { t: "보기만", c: "ghost" }], title: "어려운 일엔 <em>깊게 생각하기</em>",
    steps: [
      { t: '📎로 PDF를 붙이고 <span class="k">깊게 생각하기</span>를 켭니다(하루 5번)', s: 0, r: R("ai-deep-ready", "deep"), newf: true, z: 1.9 },
      { t: '붙인 자료는 <b>이 대화에서만</b> 씁니다. 저장하지 않아요', s: 0, r: R("ai-deep-ready", "file") },
      { t: '긴 지침과 우리 학교 계획을 견줘 <b>쪽수와 함께</b> 정리', s: 1, r: R("ai-deep", "answer") },
      { t: '학부모 문자 답장 초안: 확인 안 된 일은 인정·사과하지 않게', s: 2, r: R("ai-parent", "answer"), newf: true }
    ],
    gnote: { html: "<span>깊게 생각하기는 더 똑똑한 AI가 오래 생각합니다. 켜고 보낸 <b>그 질문 하나만</b>이고, 다 쓰면 막지 않고 보통으로 답합니다. 학부모 답장은 다른 학생 이야기를 넣지 않고, 폭언·위협이면 교감·교권보호 담당과 먼저 상의를 권합니다.</span>" },
    screens: [shot("ai-deep-ready"), shot("ai-deep"), shot("ai-parent")],
    notes: "<b>깊게 생각하기</b>는 긴 PDF 분석·계획서·수업 자료처럼 어려운 일에 씁니다. 켜고 보낸 한 질문만 더 똑똑한 AI가 오래 생각하고, <b>선생님마다 하루 5번</b>입니다. 붙인 파일은 이 대화에서만 쓰고 저장하지 않습니다. <b>학부모 답장 초안</b>은 확인되지 않은 일을 인정·사과하지 않고, 처분·성적처럼 절차로 정할 일은 약속하지 않게 씁니다."
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
    id: "p12", part: 6, num: 12, label: "실습 12 · 과세특 초안", min: 2.5, practiceMin: 3,
    chips: [{ t: "실습 12 · 세특" }, { t: "3분", c: "ghost" }], title: "과세특 초안 한 명 만들어 보기",
    steps: [
      { t: '더보기 → <span class="k">세특 도우미</span> → 과세특 <span class="k">바로가기</span>', s: 0, r: R("record-kinds", "gwasetuk"), z: 1.9 },
      { t: '학생 수를 정하거나 NEIS 명렬표 엑셀을 올립니다', s: 1, r: R("record-input", "count") },
      { t: '과목명과 모두가 함께한 <b>활동 내용</b>', s: 2, r: R("record-activities", "activities") },
      { t: '글자수(1000byte 등)를 고르고 <span class="k">아직 안 쓴 학생 생성</span>', s: 3, r: R("record-options", "generate") },
      { t: '초안 아래 <span class="q">「이 기준으로 썼습니다」</span>: 기재요령 쪽수·교무부 Q&amp;A', s: 4, r: R("record-result", "basis") }
    ],
    note: { html: "<span>학생 이름은 지어낸 이름으로 연습하세요. 생성된 문장은 <b>초안</b>이니 실제 활동에 맞는지 꼭 고쳐 씁니다.</span>" },
    screens: [shot("record-kinds"), shot("record-input"), shot("record-activities"), shot("record-options"), shot("record-result")],
    notes: "과세특을 한 명 만들어 봅니다. 학생 수를 정하고 공통 활동을 적은 뒤 학생마다 개별 활동과 성취도를 적고 생성합니다. 기본 AI는 학교가 제공하는 Upstage Solar이고, 활동·관찰 내용만 전송됩니다. 초안 아래에 <b>어느 기재요령 쪽과 교무부 Q&amp;A를 기준으로 썼는지</b>가 붙습니다."
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
    part: 7, art: "board", min: 6, lines: ["교실 칠판까지", "<em>휴대폰에서</em>"],
    was: "방송·쪽지·교실마다 직접 가서 전달", now: "보낼 말 → 어디에 → 보내기, 교실 칠판에 바로",
    notes: "7부는 <b>전자칠판 알림</b>과 <b>자료실</b>입니다. 휴대폰에서 교실 칠판에 안내·쪽지·긴급·음성을 띄우고, 교실 칠판에 어떻게 뜨는지 봅니다. 끝으로 <b>AI로 양식 찾기</b>를 봅니다."
  });

  practice({
    id: "p13", part: 7, num: 13, label: "실습 13 · 전자칠판 보내기 둘러보기", min: 2, practiceMin: 2,
    chips: [{ t: "실습 13 · 전자칠판" }, { t: "보내지는 않아요", c: "ghost" }], title: "무엇을 → 어디에 → <em>보내기</em>",
    steps: [
      { t: '더보기 → <span class="k">전자칠판 알림</span>: <span class="q">안내 · 쪽지 · 긴급</span>', s: 0, r: R("board-send", "kinds") },
      { t: '<b>무엇을</b>: 글, + 링크 · 사진 · <b>음성</b> · 예약 · 띄울 시간', s: 0, r: R("board-send", "options") },
      { t: '<b>어디에</b>: 담임은 <span class="q">「내 반」</span>이 기본', s: 0, r: R("board-send", "mine"), z: 1.9 },
      { t: '학년 전체는 <b>여러 학년 함께</b> 눌러집니다 <span class="nw">NEW</span>', s: 1, r: R("board-grades", "g2"), newf: true, z: 1.9 },
      { t: '<span class="k">직접 고르기</span>: 초록불은 지금 켜진 칠판', s: 2, r: R("board-pick", "grid") },
      { t: '보낸 뒤 <span class="q">「오늘 칠판에 나간 알림」</span>: 게시 중·확인완료·송출마감', s: 3, r: R("board-sent", "live"), z: 1.9 }
    ],
    note: { tone: "warn", html: "<span>오늘은 <b>보내기 단추를 누르지 않습니다</b>. 누르면 실제 교실 칠판에 뜹니다.</span>" },
    screens: [shot("board-send"), shot("board-grades"), shot("board-pick"), shot("board-sent")],
    notes: "보내기 화면은 <b>무엇을 → 어디에 → 보내기</b> 순서입니다. 담임 선생님은 「내 반」이 기본으로 골라져 있고, 보내기 단추에 「2학년 3반에 띄우기」처럼 어디로 가는지가 적힙니다. 학년 전체는 <b>여러 학년을 함께</b> 고를 수 있고, 직접 고르기 창에서는 초록불로 지금 켜진 칠판이 보입니다. 보낸 뒤에는 교실마다 「게시 중·확인완료·송출마감·미표시종료·표시 대기중」이 말로 보입니다."
  });

  practice({
    id: "boardKinds", deck: false, part: 7, num: null, label: "쪽지·긴급·음성 (보기만)", min: 1.5, isNew: true,
    chips: [{ t: "NEW", c: "new" }, { t: "보기만", c: "ghost" }], title: "쪽지는 귀퉁이에, 긴급은 <em>전체 화면</em>으로",
    steps: [
      { t: '<span class="k">쪽지</span>: 60자, 칠판 오른쪽 위 노란 쪽지(띵 한 번)', s: 0, r: R("board-memo", "body") },
      { t: '<span class="k">긴급</span>: 지진·화재·전시 대피·외부인 침입·교실 대기 문구', s: 1, r: R("board-alert", "presets") },
      { t: '보내기 전 <b>확인 창</b>: 몇 곳에 뜨는지, 꺼진 칠판은 몇 곳인지', s: 2, r: R("board-alert-confirm", "where"), warn: "긴급은 경보음과 함께 바로 뜹니다" },
      { t: '<span class="k">+ 음성</span>: 30초까지 녹음, 칠판에서 두 번 울립니다 <span class="nw">NEW</span>', s: 3, r: R("board-voice-rec", "status"), newf: true }
    ],
    gnote: { html: "<span>음성 파일은 하루 뒤 지워집니다(목소리도 개인정보). 교실 컴퓨터 스피커가 꺼져 있을 수 있으니 중요한 내용은 글로도 적어 주세요. 관리자는 안내를 <b>「공지사항」</b> 이름으로 보낼 수 있습니다.</span>" },
    screens: [shot("board-memo"), shot("board-alert"), shot("board-alert-confirm"), shot("board-voice-rec")],
    notes: "쪽지는 수업 화면을 가리지 않고 칠판 오른쪽 위에 노란 쪽지로 뜹니다(60자, 학생도 보니 민감한 내용은 쓰지 않기). 긴급은 정해 둔 대피 문구로 칠판 전체에 빨간 화면과 경보음이 뜹니다 — 보내기 전 확인 창이 몇 곳에 뜨는지, 꺼진 칠판이 몇 곳인지 보여 줍니다. 새로 생긴 <b>음성</b>은 30초까지 녹음하고, 칠판에서 「띵」 뒤 두 번 울리며 [다시 듣기]도 됩니다."
  });

  D.add({
    id: "boardTV", part: 7, label: "교실 칠판에는 이렇게", kind: "light", min: 1.2, isNew: true,
    notes: "교실 칠판에는 이렇게 뜹니다. 평소엔 <b>반 이름과 큰 시계</b>, 그 아래 <b>분실물 띠</b>(보관 중인 물건 사진과 찾으러 갈 곳, 학생용 QR — 특징은 안 나옴). 안내는 사진이 위에 크게, 글은 아래. 아침 <b>8시 45분</b>에는 수업이 바뀐 반 칠판 귀퉁이에 「오늘 바뀐 수업」 쪽지가 저절로 붙습니다(사유 없이 교시·과목·교실만). 긴급은 빨간 전체 화면, 음성 안내에는 [다시 듣기]. 칠판 창 프로그램이 깔린 교실은 <b>수업 시작 30초 뒤 칠판이 저절로 숨고</b>, 수업 중에 온 안내는 구석 포스트잇으로만 뜹니다(마지막 그림은 이해를 돕는 합성 그림입니다).",
    html: '<div class="chiprow"><span class="chip new">NEW</span><span class="chip ghost">교실 칠판</span></div><h2 class="title" style="width:860px">교실 칠판에는 <em>이렇게</em> 뜹니다</h2>' +
      '<ol class="steps bt">' + [["평소", "반 이름·큰 시계, 아래 분실물 띠"], ["안내", "사진은 위에 크게, 글은 아래"], ["8:45 쪽지", "수업이 바뀐 반에 「오늘 바뀐 수업」"], ["긴급", "빨간 전체 화면과 경보음"], ["음성", "「띵」 뒤 두 번, [다시 듣기]"], ["수업 중", "30초 뒤 숨고, 안내는 구석 포스트잇"]].map(function (x) { return "<li><span><b>" + x[0] + "</b> · " + x[1] + "</span></li>"; }).join("") + "</ol>" +
      '<div class="abs tv"><div class="in">' + ["idle", "notice-photo", "memo", "alert", "voice", "inclass-composite"].map(function (n) { return '<img src="img/board/' + n + '.jpg" alt="">'; }).join("") + "</div></div>" +
      '<p class="abs tv-note">마지막 그림은 이해를 돕는 합성 그림 · 반·이름은 예시</p>',
    build: function (el, A) {
      var imgs = A.$$(".tv img"), lis = A.$$(".steps.bt li"), cur = -1;
      function show(i) {
        lis.forEach(function (li, k) { li.classList.toggle("on", k === i); li.classList.toggle("done", k < i); });
        if (cur >= 0) A.go(imgs[cur], [{ opacity: 1 }, { opacity: 0 }], { d: 500, e: E.in });
        A.go(imgs[i], [{ opacity: 0, transform: "scale(1.04)" }, { opacity: 1, transform: "none" }], { d: 700, e: E.out });
        A.sfx(i === 3 ? "alert" : "pop");
        cur = i;
      }
      var beats = [function (A) {
        A.wipe(".chiprow > *"); A.kinetic(".title", { delay: 100, each: 26 });
        A.rise(".steps.bt li", { delay: 400, each: 70, y: 20 });
        A.go(".tv", [{ opacity: 0, transform: "translateY(60px) scale(.95)" }, { opacity: 1, transform: "none" }], { d: 1000, delay: 300, e: E.out });
        A.rise(".tv-note", { delay: 900 });
        A.later(function () { show(0); }, 700);
      }];
      for (var i = 1; i < imgs.length; i++) (function (i) { beats.push(function () { show(i); }); })(i);
      return beats;
    }
  });

  practice({
    id: "p14", part: 7, num: 14, label: "실습 14 · 자료실", min: 1.5, practiceMin: 2,
    chips: [{ t: "실습 14 · 자료실" }, { t: "2분", c: "ghost" }], title: "자료는 <em>찾아서</em>, 올릴 땐 <em>게시</em>",
    steps: [
      { t: '아래 탭 <span class="k">자료실</span>: 위쪽 검색과 부서 칩', s: 0, r: R("library", "search") },
      { t: '「양식」처럼 찾으면 제목·설명에서 바로', s: 1, r: R("library-search", "result") },
      { t: '글을 열어 <span class="k">내려받기</span>(링크는 앱 안에서 열기)', s: 2, r: R("library-post", "download") },
      { t: '올릴 땐 <span class="k">+ 게시</span>: 섹션·제목·설명, 링크 또는 파일(20MB까지)', s: 3, r: R("library-new", "submit") }
    ],
    note: { html: "<span>자료실 파일 본문은 <b>AI 도우미가 읽고 답</b>합니다. 휴직 중인 선생님도 자료실은 볼 수 있습니다.</span>" },
    screens: [shot("library"), shot("library-search"), shot("library-post"), shot("library-new")],
    notes: "자료실은 부서별 자료와 양식을 모아 둔 곳입니다. 검색은 제목·설명에서 찾고, 파일 본문은 AI 도우미가 읽어 답합니다. 올릴 때는 섹션·제목·설명과 링크 또는 파일(최대 20MB)."
  });

  aiWay({
    id: "aiLib", part: 7, label: "AI로 하면 · 양식 찾기", min: 1,
    title: "양식 찾기도 <em>물어보면</em>",
    menu: "자료실 → 검색 → 글 열기 → 내려받기",
    say: "학부모 상담 기록지 양식 어디 있어?",
    steps: [
      { t: '메뉴로는 <span class="k">자료실</span>에서 찾아 글을 열고 내려받기', s: 0, r: R("library-search", "result") },
      { t: 'AI에게: <span class="q">「학부모 상담 기록지 양식 어디 있어?」</span>', s: 1, r: R("ai-form", "question") },
      { t: '자료실 글과 <b>공유 드라이브</b> 문서를 찾아 <span class="k">열기 ›</span>로', s: 1, r: R("ai-form", "links"), z: 1.95 },
      { t: '파일 <b>본문까지</b> 읽으니 「누구에게 내?」처럼 이어서 물어도 됩니다', s: 1, r: R("ai-form", "answer") }
    ],
    gnote: { html: "<span>AI는 자료실에 없으면 학교 공유 드라이브(부서 자료·교육계획서·교과 자료 등)에서도 찾아 읽고, 어느 파일 몇 쪽인지 붙입니다.</span>" },
    screens: [shot("library-search"), shot("ai-form")],
    notes: "마지막 <b>「AI로 하면」</b>입니다. 자료실에서 검색해 글을 열어도 되지만, AI에게 「학부모 상담 기록지 양식 어디 있어?」라고 물으면 자료실 글과 공유 드라이브 문서를 찾아 <b>열기 링크</b>로 붙여 줍니다. 파일 본문까지 읽기 때문에 「언제까지 누구에게 내?」처럼 이어서 물어도 됩니다."
  });

  // ════════════════════════════════════════════════════════════
  // 8부 · 마무리 (분실물 함·구기대회는 따라하기 안내에만)
  // ════════════════════════════════════════════════════════════
  practice({
    id: "school", deck: false, part: 8, num: null, label: "학교 생활: 분실물 함", min: 1.3, isNew: true, trans: "whip",
    chips: [{ t: "NEW", c: "new" }, { t: "둘러보기", c: "ghost" }], title: "분실물 함, <em>선생님은 넣고 학생은 보고</em>",
    steps: [
      { t: '더보기 → <span class="k">분실물 함</span>: 사진이 물 위에 뜬 듯 <b>둥둥</b>', s: 0, r: R("lost-found", "box") },
      { t: '<span class="k">분실물 넣기</span>: 사진 한 장·종류·발견 장소. 보관 장소는 <b>지난번 적은 곳</b>이 미리 들어감', s: 1, r: R("lost-found-add", "place") },
      { t: '사진을 누르면 상세 → <span class="k">주인에게 돌려줬어요</span>', s: 2, r: R("lost-found-detail", "back") },
      { t: '학생은 <b>교실 칠판의 분실물 띠</b>(QR)와 <span class="k">학생용 보기</span>로', s: 3, r: R("lost-found-2", "note") },
      { t: '학생 화면엔 사진·장소·<span class="q">「찾으러 갈 곳」</span>만 — <b>특징은 안 보임</b>', s: 4, r: R("found", "first") }
    ],
    gnote: { html: "<span>사진에는 학생 얼굴·이름표가 나오지 않게 물건만 찍어 주세요. <b>특징 칸</b>은 주인 확인용이라 학생 화면·칠판에는 나오지 않습니다 — 찾으러 온 학생에게 특징을 물어보고 돌려주세요. 휴대폰을 기울이면 사진이 그쪽으로 흘러갑니다.</span>" },
    screens: [shot("lost-found"), shot("lost-found-add"), shot("lost-found-detail"), shot("lost-found-2"), shot("found")],
    notes: "<b>분실물 함</b>은 10월 17일부터 모두에게 열렸습니다. 사진이 물 위에 뜬 것처럼 떠다니고, 휴대폰을 기울이면 그쪽으로 흘러갑니다. 넣을 때는 사진 한 장과 종류·발견 장소, 보관 장소는 <b>선생님이 계신 교무실</b> — 한 번 적으면 다음부터 미리 들어갑니다. 돌려주면 「주인에게 돌려줬어요」. 학생들은 <b>교실 칠판 대기 화면 아래 분실물 띠</b>와 QR(학생용 보기)로 사진과 찾으러 갈 곳을 봅니다. 로그인 없이 열리지만 <b>특징 칸과 선생님 이름은 싣지 않으니</b>, 찾으러 온 학생에게 특징을 물어 확인하고 돌려주시면 됩니다."
  });

  practice({
    id: "sports", deck: false, part: 8, num: null, label: "학교 생활: 구기대회", min: 1, isNew: true,
    chips: [{ t: "NEW", c: "new" }, { t: "둘러보기", c: "ghost" }], title: "구기대회, <em>대진표와 경기 알림</em>",
    steps: [
      { t: '대회 기간엔 <span class="k">구기대회</span>: 학년별 월드컵식 대진표', s: 0, r: R("sports", "bracket") },
      { t: '경기 카드: <b>이긴 반 점수는 파랑</b>, 체육과 선생님이 적으면 다음 경기로 저절로', s: 0, r: R("sports", "match") },
      { t: '홈에도 오늘 경기 카드(교시 알약)와 어제 결과', s: 1, r: R("home-sports", "card") },
      { t: '그 교시 수업 선생님·두 반 담임께 <b>경기 알림</b>', s: 1, r: R("home-sports", "card") }
    ],
    gnote: { html: "<span>구기대회 메뉴는 대회가 있는 동안만 보입니다. 우승 반 담임 선생님 홈에는 사흘 동안 축하 꽃가루가 뜹니다.</span>" },
    screens: [shot("sports"), shot("home-sports")],
    notes: "<b>구기대회</b>는 대회 기간에만 보입니다. 체육과 선생님이 점수를 적으면 이긴 반이 다음 경기로 저절로 올라가고, 이긴 반 점수는 파랗게 보입니다. 홈에는 오늘 경기 카드가 뜨고, 경기 교시에 수업이 있는 선생님과 두 반 담임께 알림이 갑니다. 우승 반 담임 선생님 홈에는 축하 꽃가루가 뜹니다."
  });

  D.add({
    id: "tenAsks", part: 8, label: "내일 해 볼 부탁 열 문장", kind: "light", min: 1.5, trans: "whip",
    notes: "오늘 본 것을 <b>따라 말할 수 있는 열 문장</b>으로 정리했습니다. 왼쪽 위 두 줄은 묻기, 나머지는 카드가 되는 부탁입니다. 이 목록은 <b>따라하기 안내 맨 위와 첫 화면</b>에도 있으니, 내일 아침 하나만 골라 해 보시라고 권해 주세요. 카드는 누르기 전까지 선생님만 보는 초안이고, 등록·보내기·요청은 선생님이 누릅니다. 분실물 함·구기대회는 따라하기 안내 8부에 있습니다.",
    html: '<div class="chiprow"><span class="chip ai">가져가기</span><span class="chip ghost">따라하기 안내 맨 위에도 있어요</span></div><h2 class="title">내일 해 볼 <em>부탁 열 문장</em></h2>' +
      '<div class="abs ten">' + (window.ASKS || []).map(function (a, i) { return '<div class="r"><span class="n">' + String(i + 1).padStart(2, "0") + '</span><span class="s">「' + a.say + '」</span><span class="c">' + a.got + "</span></div>"; }).join("") + "</div>" +
      '<p class="abs ten-foot"><span>' + (window.ASKS_MORE || "") + '</span><span>·</span><span><b>누르기 전까지는 초안</b> — 등록·보내기·요청은 선생님이</span></p>',
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

  var DONE = [["로그인·앱 설치", 0], ["알림 켜기·알림함", 0], ["AI에게 첫 부탁", 1], ["가정통신문·수리를 말로", 1], ["시간표·진도 모두 저장", 0], ["AI로 수업교체·넵 초안", 1], ["넵 보내고 처리", 0], ["내 서명·AI로 서명부", 1], ["학습지·과세특 초안", 1], ["칠판 보내기·AI로 양식 찾기", 1]];

  D.add({
    id: "closing", part: 8, label: "마무리 · 질문", kind: "dark", min: 3, trans: "whip", bgm: "end",
    notes: "오늘 해 본 열 가지를 짚고 질문을 받습니다. 보라색은 AI로 해 본 것입니다. <b>알림을 아직 못 켜신 분은 지금 바로</b> 도와드리겠다고 말씀하세요. 내일은 열 문장 가운데 <b>하나만 골라 AI에게 부탁</b>해 보시라고 권합니다. 막히거나 궁금한 점은 언제든 <b>교목실</b>로 오시면 됩니다. 수고 많으셨습니다.",
    html: darkBg("closing") +
      '<h2 class="abs cl-title"><span class="ln">내일은, AI에게</span><span class="ln"><em>말로</em> 부탁해 보세요</span></h2>' +
      '<div class="abs cl-done">' + DONE.map(function (t) { return "<div" + (t[1] ? ' class="ai"' : "") + "><i>" + CHECK + "</i>" + t[0] + "</div>"; }).join("") + "</div>" +
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

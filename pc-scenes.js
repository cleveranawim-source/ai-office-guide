/* PC 설치본(윈도우·맥 프로그램) 두 장면 — 연수 발표(scenes.js)와 짧은 연수(mini-scenes.js)가 함께 쓴다.
 * 그림은 이해를 돕는 합성(img/pc/desktop.jpg·install.jpg, 1920×1080). 창 안 화면은 실제 앱을 설치본 모드로 찍은 것.
 * 앱 쪽 정본: mjms-office tools/desktop(Tauri), docs/features.md 「윈도우 설치본」. 사용: window.PC_SCENES(D, { part: 1 }) */
(function () {
  "use strict";
  var css = document.createElement("style");
  css.textContent = `
  .pc-ls{left:120px;top:290px;width:740px;display:grid;gap:10px}
  .pc-ls .r{display:grid;grid-template-columns:46px minmax(0,1fr);gap:16px;align-items:center;padding:12px 18px;border-radius:18px;border:1.5px solid transparent;transition:background .4s,border-color .4s,box-shadow .4s,filter .4s}
  .pc-ls.focus .r:not(.on){filter:opacity(.45)}
  .pc-ls .r.on{background:var(--surface);border-color:var(--brand);box-shadow:0 12px 30px rgba(14,28,48,.1)}
  .pc-ls i{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font:700 22px var(--mono);font-style:normal;color:#fff;background:var(--brand)}
  .pc-ls h4{font:800 28px/1.3 var(--display);letter-spacing:-.02em;color:var(--ink)}
  .pc-ls p{font:500 21px/1.4 var(--body);color:var(--muted);margin-top:2px}
  .pc-ls p b{color:var(--ink)}
  .pc-v{left:900px;top:276px;width:900px;height:506px;border-radius:18px;overflow:hidden;background:#16386e;box-shadow:0 34px 80px rgba(14,28,48,.3)}
  .pc-v img{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;max-width:none}
  .pc-ring{position:absolute;border:4px solid #f5a524;border-radius:12px;box-shadow:0 0 0 6px rgba(245,165,36,.25);opacity:0;pointer-events:none}
  .pc-cap{left:900px;top:798px;width:900px;text-align:center;font:500 19px var(--body);color:var(--muted)}
  .pc-fig{left:210px;top:232px;width:1500px;height:680px;border-radius:22px;overflow:hidden;box-shadow:0 30px 70px rgba(14,28,48,.18)}
  .pc-fig img{position:absolute;left:0;top:-70px;width:1500px;height:844px;max-width:none}
  .pc-dim{position:absolute;top:0;bottom:0;background:rgba(240,244,250,.78);opacity:0;pointer-events:none}
  `;
  document.head.appendChild(css);

  // 합성 그림 속 자리(1920×1080 기준) — 그림을 만들 때 잰 값
  var AT = {
    full: [0, 0, 1920, 1080],
    app: [1456, 36, 440, 800],
    toast: [1556, 859, 350, 169],
    tray: [1749, 1042, 30, 30],
    menu: [1090, 640, 330, 220],
    quit: [1098, 802, 314, 48],
    auto: [1098, 741, 314, 48],
    close: [1849, 37, 46, 34]
  };
  var VW = 900, VH = 506;
  function fit(r, maxS) {
    var pad = 40, s = Math.min(VW / (r[2] + pad * 2), VH / (r[3] + pad * 2), maxS || 1.15);
    s = Math.max(s, VW / 1920);
    var tx = VW / 2 - (r[0] + r[2] / 2) * s, ty = VH / 2 - (r[1] + r[3] / 2) * s;
    tx = Math.min(0, Math.max(VW - 1920 * s, tx)); ty = Math.min(0, Math.max(VH - 1080 * s, ty));
    return { s: s, tx: tx, ty: ty, css: "translate(" + tx.toFixed(1) + "px," + ty.toFixed(1) + "px) scale(" + s.toFixed(4) + ")" };
  }

  var ROWS = [
    { h: "오른쪽 가장자리, 좁은 창 하나", p: "창 안은 <b>휴대폰 화면과 같아요</b> · 크기·자리는 기억", z: "app", ring: "app" },
    { h: "넵·알림은 알림 카드로", p: "오른쪽 아래에 <b>누를 때까지</b> 남아요 · 누르면 그 화면이 열려요", z: "toast", ring: "toast" },
    { h: "✕는 끄기가 아니라 숨기기", p: "트레이에 남아 <b>알림을 계속</b> 받아요 · 끄려면 오른쪽 클릭 → 끝내기", z: "trayArea", ring: "quit" },
    { h: "켜면 저절로, 창은 하나", p: "<b>윈도우 시작 때 자동 실행</b>(메뉴에서 끄기) · 두 번 눌러도 같은 창", z: "trayArea", ring: "auto" },
    { h: "새 판도 저절로", p: "하루 한 번 확인 · 「새 판을 받았어요」 알림을 누르면 바로", z: "full" }
  ];
  AT.trayArea = [1090, 640, 700, 432];

  window.PC_SCENES = function (D, o) {
    var E = D.E;
    D.add({
      id: "pcWhat", part: o.part, label: "PC 설치본 · 이렇게 생겼어요", kind: "light", min: o.minWhat || 1.2, isNew: true, trans: "zoom",
      notes: "교무실 PC에는 이제 <b>AI 교무실 프로그램(설치본)</b>을 깔 수 있습니다(10월 19일). 브라우저 탭이 아니라 프로그램이라 ① 화면 <b>오른쪽 가장자리에 메신저처럼 좁은 창</b> 하나로 뜨고, 창 안은 휴대폰 화면과 같습니다. 크기와 자리는 끈 때 그대로 기억합니다. ② 넵·서명 요청 같은 알림이 오른쪽 아래에 <b>알림 카드(「잎사귀 편지」)</b>로 내려앉습니다(반짝 세 음). 카드는 누를 때까지 남고, 누르면 그 화면이 열립니다. 3개가 넘으면 「알림 N개 더 · 알림함 열기」로 묶이고, 남은 카드가 있으면 트레이 아이콘에 빨간 점이 붙습니다 — 휴대폰 알림과 같은 알림이 PC에도 오는 것입니다. ③ 창의 <b>✕는 끄기가 아니라 숨기기</b>입니다. 알림을 계속 받으려고 오른쪽 아래 트레이에 남아 있고, 완전히 끄려면 트레이 아이콘을 오른쪽 클릭해 「끝내기」를 누릅니다. ④ 처음 깔면 <b>윈도우 시작 때 저절로 켜지게</b> 되어 있고(같은 메뉴에서 끌 수 있음), 두 번 눌러도 창은 하나만 뜹니다. ⑤ 새 판이 나오면 하루 한 번 스스로 받아 두고 「새 판을 받았어요」 알림을 줍니다. 그림은 이해를 돕는 합성 그림입니다." + (o.notesExtra || ""),
      html: '<div class="chiprow"><span class="chip new">NEW</span><span class="chip ghost">교무실 PC · 윈도우</span></div>' +
        '<h2 class="title">교무실 PC에는 <em>프로그램으로</em></h2>' +
        '<div class="abs pc-ls">' + ROWS.map(function (r, i) { return '<div class="r"><i>' + (i + 1) + "</i><div><h4>" + r.h + "</h4><p>" + r.p + "</p></div></div>"; }).join("") + "</div>" +
        '<div class="abs pc-v"><img src="img/pc/desktop.jpg" alt="교무실 PC 바탕화면 오른쪽에 AI 교무실 창, 오른쪽 아래 알림 카드, 트레이 메뉴"><div class="pc-ring"></div></div>' +
        '<p class="abs pc-cap">이해를 돕는 합성 그림 · 창 안 화면은 실제 앱</p>',
      build: function (el, A) {
        var img = A.$(".pc-v img"), ring = A.$(".pc-ring"), box = A.$(".pc-ls"), rows = A.$$(".pc-ls .r");
        var cur = fit(AT.full);
        img.style.transform = cur.css;
        function go(z, rk) {
          var nx = fit(AT[z]);
          A.go(img, [{ transform: cur.css }, { transform: nx.css }], { d: 950, e: E.out });
          cur = nx;
          A.go(ring, [{ opacity: 1 }, { opacity: 0 }], { d: 200 });
          if (!rk) return;
          var r = AT[rk], p = 8;
          ring.style.left = (r[0] * nx.s + nx.tx - p) + "px"; ring.style.top = (r[1] * nx.s + nx.ty - p) + "px";
          ring.style.width = (r[2] * nx.s + p * 2) + "px"; ring.style.height = (r[3] * nx.s + p * 2) + "px";
          A.go(ring, [{ opacity: 0, transform: "scale(1.12)" }, { opacity: 1, transform: "none" }], { d: 500, delay: 800, e: E.out });
        }
        var beats = [function (A) {
          A.wipe(".chiprow > *", { each: 110 });
          A.kinetic(".title", { delay: 120, each: 24 });
          A.rise(".pc-ls .r", { delay: 420, each: 80, y: 24, snd: "pluck", v: 0.05 });
          A.go(".pc-v", [{ opacity: 0, transform: "translateY(60px) scale(.96)" }, { opacity: 1, transform: "none" }], { d: 1000, delay: 300, e: E.out });
          A.rise(".pc-cap", { delay: 900 });
        }];
        ROWS.forEach(function (r, i) {
          beats.push(function (A) {
            box.classList.add("focus");
            rows.forEach(function (x, k) { x.classList.toggle("on", k === i); });
            A.go(rows[i], [{ transform: "translateX(-14px)" }, { transform: "none" }], { d: 500, e: E.out });
            go(r.z, r.ring);
            A.sfx(i === 1 ? "pop" : "swish", { v: 0.08 });
          });
        });
        beats.push(function (A) {
          box.classList.remove("focus");
          rows.forEach(function (x) { x.classList.remove("on"); });
          go("full");
          A.lt({ tag: "PC 설치본", title: "알림이 중요한 분은 교무실 PC에 한 번", sub: "휴대폰 알림과 같은 알림이 PC에도 · 창 안은 휴대폰 화면 그대로" });
        });
        return beats;
      }
    });

    D.add({
      id: "pcInstall", part: o.part, label: "PC 설치본 · 깔기", kind: "light", min: o.minInstall || 1.2, isNew: true, trans: "push",
      notes: "까는 법은 세 단계입니다. ① <b>설치 파일을 받아 엽니다</b> — PC 브라우저로 AI 교무실에 들어와 더보기 → 알림 설정의 <b>「PC 프로그램 받기」</b>를 누르면 늘 지금 판을 받습니다(지금은 0.3.8, 윈도우·맥 PC에서만 보입니다). 학교 공유 드라이브 <b>「AI교무실 › PC 설치파일」</b> 폴더에도 같은 설치 파일이 있습니다(10월 27일). <b>관리자 권한 없이</b> 내 윈도우 계정에만 깔리고, 설치 화면은 한국어입니다. ② 학교에서 만든 프로그램이라 아직 서명 전이어서 처음 열 때 <b>「Windows의 PC 보호」</b>가 뜰 수 있습니다 — <b>「추가 정보」</b>를 누르면 나오는 <b>[실행]</b>을 누르면 됩니다. ③ 창이 뜨면 <b>이름·비밀번호로 한 번 더 로그인</b>합니다(브라우저 로그인과 따로). 그다음부터 이 PC로 알림 카드가 옵니다. 알림 설정 화면에는 「켜짐 · 설치한 프로그램은 알림이 늘 켜져 있습니다」가 보이고, 시험 발송으로 확인할 수 있습니다. 설치 직후 창이 검게만 보이면 <b>PC를 한 번 다시 시작</b>해 주세요. 맥은 같은 곳의 맥용 파일(dmg)을 열어 응용 프로그램 폴더로 끌어 넣고, 트레이 대신 화면 위 메뉴 막대에 아이콘이 생깁니다(⌘Q는 완전히 꺼서 알림도 멈춥니다). 예전 0.2.0을 깐 분은 새 판을 한 번만 다시 깔면 그다음부터 저절로 새 판을 받습니다." + (o.notesExtra2 || ""),
      html: '<div class="chiprow"><span class="chip">교무실 PC</span><span class="chip ghost">자리에서 해 보세요</span></div>' +
        '<h2 class="title">깔기는 <em>세 단계</em></h2>' +
        '<div class="abs pc-fig"><img src="img/pc/install.jpg" alt="설치 파일 받기, Windows의 PC 보호에서 실행, 창이 뜨면 로그인"><div class="pc-dim" style="left:0;width:486px"></div><div class="pc-dim" style="left:486px;width:484px"></div><div class="pc-dim" style="left:970px;width:530px"></div></div>',
      build: function (el, A) {
        var dims = A.$$(".pc-fig .pc-dim"), lt = null;
        function say(o) { if (lt) A.ltOut(lt); lt = A.lt(o); }
        function only(i) {
          dims.forEach(function (d, k) { A.go(d, [{ opacity: getComputedStyle(d).opacity }, { opacity: i < 0 || k === i ? 0 : 1 }], { d: 450 }); });
        }
        return [
          function (A) {
            A.wipe(".chiprow > *", { each: 110 });
            A.kinetic(".title", { delay: 120, each: 26 });
            A.go(".pc-fig", [{ opacity: 0, transform: "translateY(50px) scale(.97)" }, { opacity: 1, transform: "none" }], { d: 1000, delay: 300, e: E.out });
          },
          function (A) { only(0); A.sfx("pop"); say({ tag: "1", title: "설치 파일을 받아 열기", sub: "mjms-office.vercel.app/downloads/desktop/ · 관리자 권한 없이 내 계정에만" }); },
          function (A) { only(1); A.sfx("pop"); say({ tag: "2", title: "「PC 보호」가 뜨면 추가 정보 → 실행", sub: "학교에서 만든 프로그램이라 아직 서명 전이에요", tone: "warn" }); },
          function (A) { only(2); A.sfx("pop"); say({ tag: "3", title: "창이 뜨면 이름·비밀번호로 로그인", sub: "브라우저와 따로 한 번 · 그다음부터 이 PC로 알림 카드" }); },
          function (A) { only(-1); say({ tag: "안 될 때", title: "창이 검게만 보이면 PC를 한 번 다시 시작", sub: "맥은 .dmg를 응용 프로그램 폴더로 · 아이콘은 화면 위 메뉴 막대에" }); }
        ];
      }
    });
  };
})();

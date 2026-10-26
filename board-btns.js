/* 교실 칠판 왼쪽 아래 단추 줄을 크게 — 칠판 그림(1600×900)에서는 단추가 너무 작아 발표 화면에서 안 보여서.
 * img/board/buttons.png는 칠판 창 프로그램 화면(?app=1)을 2배로 찍은 조각, 설명 자리는 단추 자리 ×2.
 * 짧은 연수·연수 발표·소개 발표의 칠판 장면이 함께 쓴다: html을 .tv 옆에 넣고, 박자마다 show(A, el, 켤지). */
(function () {
  "use strict";
  var css = document.createElement("style");
  css.textContent = `
  .tv-btns{left:968px;top:560px;width:844px;padding:14px 16px 12px;border-radius:20px;background:#0d1a2e;border:3px solid #f5a524;box-shadow:0 24px 60px rgba(0,0,0,.45);opacity:0;z-index:5}
  .tv-btns small{display:block;font:700 18px var(--body);color:#f5c86a;margin:0 0 6px 4px}
  .tv-btns img{display:block;width:812px;height:128px}
  .tv-btns .bc{position:relative;height:52px}
  .tv-btns .bc span{position:absolute;top:4px;text-align:center;font:600 18px/1.3 var(--body);color:#dfe8f3}
  `;
  document.head.appendChild(css);
  var CAPS = [["오늘 뜬 알림<br>다시 보기", 20, 198], ["구석<br>작은 창으로", 234, 168], ["보관 중<br>물건 사진", 418, 198], ["칠판 숨기기<br>(알림 오면 다시)", 634, 170]];
  window.BOARD_BTNS = {
    html: '<div class="abs tv-btns"><small>칠판 왼쪽 아래 단추(크게)</small><img src="img/board/buttons.png" alt="지난 알림, 작은 창, 분실물 함, 숨기기 단추"><div class="bc">' +
      CAPS.map(function (c) { return '<span style="left:' + c[1] + "px;width:" + c[2] + 'px">' + c[0] + "</span>"; }).join("") + "</div></div>",
    /** 단추 줄을 켜거나 끈다(이미 그 상태면 그대로). */
    show: function (A, el, on) {
      var bt = el.querySelector(".tv-btns");
      if (!bt || bt._on === on) return;
      bt._on = on;
      A.go(bt, on ? [{ opacity: 0, transform: "translateY(24px) scale(.96)" }, { opacity: 1, transform: "none" }] : [{ opacity: 1 }, { opacity: 0 }], { d: on ? 650 : 300, delay: on ? 350 : 0 });
    },
    notes: "왼쪽 아래에는 단추가 넷 있습니다 — <b>[지난 알림]</b> 오늘 그 교실에 뜬 알림 다시 보기, <b>[작은 창]</b> 칠판을 구석 작은 창으로 줄여 PC 쓰기, <b>[분실물 함]</b> 보관 중인 물건 사진 바둑판(10월 20일 새로), <b>[숨기기]</b> 칠판 숨기기(알림이 오면 다시 뜨고, 다시 크게 보려면 바탕화면 「전자칠판」 아이콘, 수업 중에 누르면 그 수업 동안만). 듀얼 모니터 교실은 [화면 옮기기]도 있습니다."
  };
})();

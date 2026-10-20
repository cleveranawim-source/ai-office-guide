# AI 교무실 안내

명지중학교 AI 교무실 자료 — 교직원 연수(따라하기 · 발표 다시 보기)와 다른 학교 선생님께 드리는 소개.

- 첫 화면: `index.html`
- 교직원: 따라하기 `guide.html` · 연수 발표 `deck.html`(장면 데이터 `scenes.js`)
- 교직원 짧은 연수(약 30~35분, 전자칠판·분실물 함·넵·PC 설치본·AI 버튼): `mini.html`(장면 데이터 `mini-scenes.js` — 연수 발표와 같은 화면 그림·엔진, 칠판 쪽지 그림 `img/board/tmemo.jpg`, 더보기 메뉴 `img/more-tools.jpg`, 넵 대화 비우기 `img/nep-swipe.jpg`·`img/nep-room-menu.jpg`)
- PC 설치본 두 장면은 `pc-scenes.js` 하나를 연수 발표·짧은 연수가 함께 쓴다(그림 `img/pc/desktop.jpg`·`install.jpg`는 이해를 돕는 합성, 창 안 화면은 실제 앱을 설치본 모드로 찍은 것). 따라하기 안내 카드는 `scenes.js`의 `pc`
- 다른 학교 선생님: 소개 발표 `intro.html` · 휴대폰으로 읽는 둘러보기 `tour.html`(둘 다 `intro-scenes.js`)
- 발표 엔진 `deck.js`(1920×1080 무대, Web Animations), 휴대폰 틀 `phone.css`, 소리 `sound.js`, 글꼴은 앱과 같은 프리텐다드(`fonts/pretendard`, OFL)
- 휴대폰 화면 `img/*.jpg`(412×864 기준, 2배)은 **실제 앱을 예시 데이터(지어낸 학교·이름)로 띄워 찍은 것**이다. 실제 교직원·학생 이름은 없다. 동그라미 자리는 찍을 때 잰 값 `img/rects.js`(`R(화면, 키)`).
- 교실 칠판 그림 `img/board/*.jpg`(점심시간 분실물 띠는 `lunch.jpg`), PC 화면 `img/desk/*.jpg`(진도 지도 「한 달」·「주별 표」는 `pg-*.jpg` — 따라하기 안내 카드에는 `figs`로 붙인다). `img/board/inclass-composite.jpg`는 이해를 돕는 합성 그림이다.
- 가장 큰 핵심은 **AI에게 말로 부탁하기**(말하기 → 카드 → 누르기). 연수 발표는 기본 설정 다음 2부가 AI이고 부마다 끝에 「AI로 하면」 장면(`aiWay`)이 있다. `deck: false` 장면은 발표에서 빼고 따라하기 안내에만 싣는다. 소개 발표도 AI가 1부다.
- 「내일 해 볼 부탁 열 문장」은 `asks.js` 하나에서 — 연수 발표·소개 발표·따라하기·둘러보기·첫 화면이 같은 목록을 쓴다(앱에 실제로 있는 답·카드만).
- 넵은 10월 18일 개편(조직도·받은·보낸 탭, 보낸 선생님별 방, 메시지·넵 받기·완료 받기·파일 받기)에 맞춰 4부를 다시 짰다: 넵 네 가지 → 세 탭(`nepTabs`) → 실습 9 나에게 메모 → 조직도로 보내기 → 실습 10 방에서 처리·답장 → 보강 모집 → AI로 넵 초안.

# AI 교무실 소개 — 다른 학교 선생님용 사이트

**주소: https://ai-office-intro.vercel.app** (베르셀 프로젝트 `ai-office-intro`)

만든이: 명지중학교 이승열(Yeol). **새로 만드는 산출물(페이지·발표·포스터·인쇄물)에는 늘 서명을 넣는다**(2026-10-31 요청) — 흰 테두리를 지운 Yeol 스티커(`img/yeol.png` 웹용 171×192, 원본 `img/yeol-sticker.png`) + 「만든이 명지중학교 이승열」 한 줄(AI 교무실 자료는 격식 있게 이름만 — 「Yeol」 글자는 쓰지 않음, 2026-10-31). 페이지는 맨 아래 `.by`, 발표는 표지와 마지막 장 `.by-line`, HTML에는 `<meta name="author">`.

이 갈래(`intro`)는 다른 학교 연수에 쓰는 외부용 사이트만 담는다. 우리 학교 교직원 연수 사이트(`main` 갈래, GitHub Pages
https://cleveranawim-source.github.io/ai-office-guide/)와는 파일·주소·링크를 섞지 않는다(2026-10-26 사용자 요청 「아예 구분」).

- `index.html` 첫 화면 · `intro.html` 소개 발표(가로, `intro-scenes.js`) · `tour.html` 휴대폰으로 읽는 둘러보기
- `visit.html` 체험 안내와 미션(`missions.js`, QR `img/qr-visit.svg` = 이 사이트의 visit.html) · `host.html` 연수 진행 꾸러미
- 체험판: https://mjms-demo.vercel.app (운영 앱 저장소의 `demo` 갈래, 11월 22일까지). 체험판 비밀번호는 저장소에 두지 않는다 —
  `intro.html?pw=…`·`visit.html?pw=…`·`host.html?pw=…`로 열 때만 화면에 보인다.
- 그림은 처음부터 다른 학교용이다: 경건회 줄·교목실·종교 교과·종교 인사말을 지운 화면만 둔다(내부 연수 사이트의 원본을 옮기지 않는다).
  동그라미 자리 `img/rects.js`는 이 사이트에 있는 그림 것만.
- 올리기: 이 갈래에 커밋·푸시한 뒤 베르셀에 이 갈래의 커밋으로 production 배포(프로젝트는 저장소와 이어 두지 않아, main에 올린 것이 여기로 나가지 않는다).

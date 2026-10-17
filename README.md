# AI 교무실 안내

명지중학교 AI 교무실 자료 — 교직원 연수(따라하기 · 발표 다시 보기)와 다른 학교 선생님께 드리는 소개.

- 첫 화면: `index.html`
- 교직원: 따라하기 `guide.html` · 연수 발표 `deck.html`(장면 데이터 `scenes.js`)
- 다른 학교 선생님: 소개 발표 `intro.html` · 휴대폰으로 읽는 둘러보기 `tour.html`(둘 다 `intro-scenes.js`)
- 발표 엔진 `deck.js`(1920×1080 무대, Web Animations), 휴대폰 틀 `phone.css`, 소리 `sound.js`, 글꼴은 앱과 같은 프리텐다드(`fonts/pretendard`, OFL)
- 휴대폰 화면 `img/*.jpg`(412×864 기준, 2배)은 **실제 앱을 예시 데이터(지어낸 학교·이름)로 띄워 찍은 것**이다. 실제 교직원·학생 이름은 없다. 동그라미 자리는 찍을 때 잰 값 `img/rects.js`(`R(화면, 키)`).
- 교실 칠판 그림 `img/board/*.jpg`, PC 화면 `img/desk/*.jpg`. `img/board/inclass-composite.jpg`는 이해를 돕는 합성 그림이다.

/* 체험판 미션 — 소개 발표 순서대로. 체험 안내(visit.html)가 그리고, 진행자 꾸러미(host.html)·소개 발표(intro-scenes.js의 장면 표시)가 함께 읽는다.
 * 모두 체험판(mjms-demo)에서 실제로 눌러 확인한 흐름만 싣는다(2026-10-23). {pair}는 짝꿍 이름, 모르면 「짝꿍」.
 * scenes: 이 미션과 이어지는 소개 발표 장면 id. ai: 이 미션이 쓰는 AI 질문 수(한 분에 하루 10번). */
window.MISSIONS = [
  {
    n: 1, part: "AI와 일하기", title: "AI에게 묻기", min: 1, ai: 1, scenes: ["s-ai", "map"],
    steps: [
      '아래 탭 가운데 <span class="k">AI</span>',
      '아래 글 칸에 <span class="say">오늘 내 수업 알려 줘</span> → 오른쪽 파란 <span class="k">↑</span>(보내기)'
    ],
    see: "시간표를 읽고 교시·반·교실로 답합니다. 「이번 주 학사일정 알려 줘」, 「오늘 급식 뭐야?」도 같은 방법입니다."
  },
  {
    n: 2, part: "매일 여는 화면", title: "홈과 빼꼼 둘러보기", min: 2, ai: 0, scenes: ["s-home", "s-today"],
    steps: [
      '<span class="k">홈</span>: 위쪽 <span class="q">빼꼼</span>과 수업·일정 칸, <span class="q">오늘 시간표</span>, 급식, 다가오는 일정',
      '홈 위쪽 <span class="k">빼꼼</span>: 이번 주 날짜를 눌러 공지·특별 일정·바뀐 수업'
    ],
    see: "빼꼼의 바뀐 수업은 선생님 이름 없이 과목만 보입니다 — 사유는 그 선생님 본인에게만."
  },
  {
    n: 3, part: "함께 일하기", title: "짝꿍과 넵 주고받기", min: 3, ai: 0, pair: true, scenes: ["s-nep"],
    steps: [
      '<span class="k">넵</span> → <span class="q">조직도</span>에서 <b>{pair}</b> 선생님 이름(돋보기로 찾아도 됩니다) → 그분과의 방',
      '아래 칸에 한두 줄 → 왼쪽 <span class="k">+</span> → <span class="q">넵 받기</span> → <span class="k">보내기</span>',
      '받은 분: <span class="k">넵</span> → <span class="q">받은</span> → 보낸 분 줄 → 카드의 <span class="k">넵</span>',
      '보낸 분: <span class="q">보낸</span>에 <span class="q">1/1 넵</span>'
    ],
    see: "누가 읽고 눌렀는지 보낸 사람이 바로 압니다. 글 속 날짜는 AI가 찾아 「넵 속 일정」으로 보낸 분·받은 분 일정에만 넣습니다. 받은 탭에 종 그림 「띵동」 방이 있으면 학교 자동 안내(당번·보강 모집)입니다."
  },
  {
    n: 4, part: "AI와 일하기", title: "AI가 넵 초안을", min: 2, ai: 1, pair: true, scenes: ["s-cards", "airules"],
    steps: [
      '<span class="k">AI</span>에 <span class="say">{pair} 선생님께 내일 회의 자료 미리 봐 달라고 넵 보내 줘</span>',
      '<span class="q">넵 초안</span> 카드: 종류·제목·본문·받는 분을 보고, 고칠 곳은 고쳐서 <span class="k">넵 보내기</span>'
    ],
    see: "AI는 초안까지만 만들고 보내지 않습니다. 보내기는 늘 선생님이 누릅니다."
  },
  {
    n: 5, part: "수업", title: "수업 교체안 받기", min: 2, ai: 1, scenes: ["s-swap"],
    steps: [
      '<span class="k">AI</span>에 <span class="say">다음 주 목요일 4~7교시 출장, 교체해 줘</span> (요일·교시는 바꿔도 됩니다)',
      '<span class="q">수업 교체안</span> 카드: 반영한 학사일정, <span class="q">1안 · 추천</span>, 상대 선생님과 갚는 날짜',
      '<span class="k">계산하기에서 자세히</span>로 다른 안도 비교'
    ],
    see: "학사일정(행사·쉬는 날)과 이미 잡힌 교체를 반영해 계산합니다. 체험판에서는 「이 안으로 상대 선생님께 요청」을 눌러 봐도 됩니다."
  },
  {
    n: 6, part: "수업", title: "교실 칠판에 띄우기", min: 3, ai: 0, laptop: true, scenes: ["s-board", "s-tv"],
    steps: [
      '노트북·태블릿: 체험판 맨 위 띠 <span class="k">교실 칠판 띄우기</span> → 교실을 눌러 새 창 → 칠판의 <span class="k">시작</span>',
      '휴대폰: <span class="k">더보기</span> → <span class="k">전자칠판 알림</span> → <span class="q">안내</span>에 한 줄',
      '어디에: 담임이면 <span class="q">내 반</span>, 아니면 <span class="k">직접 고르기</span>로 띄운 교실 → <span class="k">…에 띄우기</span>'
    ],
    see: "몇 초 안에 칠판에 뜹니다. AI로도: 「지금 우리 반 칠판에 5분 뒤 강당으로 모이라고 띄워 줘」. 「긴급」·「전교실」은 다른 분이 띄운 칠판에도 뜨니 체험은 안내·쪽지로."
  },
  {
    n: 7, part: "수업", title: "진도 한 줄 적기", min: 1, ai: 0, scenes: ["s-progress"],
    steps: [
      '<span class="k">홈</span> <span class="q">오늘 시간표</span> 머리 오른쪽 <span class="k">진도</span>',
      '오늘 수업 칸에 한 줄(예: 3단원 2차시 토의) → 아래 <span class="k">모두 저장</span>'
    ],
    see: "오늘 실제로 하는 수업마다 칸이 하나 — 교체로 바뀐 수업도 반영됩니다. 아래 「학급별 보기」에서 반마다 기록."
  },
  {
    n: 8, part: "학교 생활", title: "분실물 함에 넣기", min: 2, ai: 0, photo: true, scenes: ["s-lost"],
    steps: [
      '<span class="k">더보기</span> → <span class="k">분실물 함</span> → <span class="k">분실물 넣기</span>',
      '주변 물건(필통·텀블러) 사진 한 장 → 종류·발견 장소·보관 장소 → <span class="k">함에 넣기</span>',
      '함에 뜬 사진을 누르면 상세, 함 아래 안내 글의 <span class="k">학생용 보기</span>로 학생 화면'
    ],
    see: "함을 보는 채로 폰을 흔들면 날짜순 → 종류별로 정리됩니다(아이폰은 처음 한 번 「기울여서 움직이기」). 학생은 사진·장소만 봅니다(특징 칸은 주인 확인용이라 안 보임). 사진에는 사람 얼굴·이름이 나오지 않게 물건만 찍어 주세요."
  }
];
window.MISSIONS_MORE = [
  {
    title: "회의 서명부", pair: true, ai: 1, scenes: ["s-sign"],
    steps: [
      '<span class="k">AI</span>에 <span class="say">다음 주 수요일 15:30 협의회 서명부 만들어 줘. {pair} 선생님도 넣어 줘</span>',
      '카드에 장소를 적고 <span class="k">서명부 만들고 알림 보내기</span>',
      '짝꿍: <span class="k">더보기</span> → <span class="k">전자서명</span> → <span class="q">서명할 것</span> → <span class="k">서명하기</span>(손가락으로)'
    ]
  },
  {
    title: "가정통신문 초안", ai: 1, scenes: [],
    steps: [
      '<span class="k">AI</span>에 <span class="say">다음 달 학부모 공개수업 가정통신문 초안 써 줘</span>',
      '카드에서 본문을 고친 뒤 <span class="k">번호 받고 문서 만들기</span> → 한글 파일'
    ]
  }
];

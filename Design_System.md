# Design System

이 파일은 Neurous 프로토타입의 시각적 설계 규칙을 정의한다.
기능 요구사항은 포함하지 않는다.

---

## 디자인 원칙

- iOS 앱의 시각적 패턴을 기본 기준으로 한다.
- 캐릭터와 배경 이미지를 중심으로 한 감성적 경험을 제공한다.
- 단일 크로스 플랫폼 UX를 유지한다.
- 완성도보다 사용자 검증 가능성을 우선한다.

---

## 컬러

| 용도 | 값 |
|---|---|
| 페이지 배경 | `#FFFFFF` |
| 서브 배경 | `#F6F7F9` |
| 카드 배경 | `#FFFFFF` |
| 주요 텍스트 | `#19181E` |
| 보조 텍스트 | `#767C91` |
| 흐린 텍스트(서브타이틀, 잠금 라벨) | `#9EA5BB` |
| **브랜드 메인** | **`#6F44F5`** |
| 브랜드 라이트(배지, 강조 배경) | `#EDECFC` |
| 브랜드 그라디언트 | `from-[#9B7BFF] to-[#6F44F5]` |
| 성공 (초록) | `#34C759` |
| 위험 (빨강) | `#FF3B30` |
| 구분선 / 보더 | `#D9DCE5` |
| 비활성 아이콘(잠금 등) | `#CACED9` |
| 비활성 배지 배경 | `#E8E9EF` |

### 컬러 적용 원칙

- 모든 포인트 컬러는 `#6F44F5`를 기준으로 사용한다.
- 주요 CTA 버튼은 `from-[#9B7BFF] to-[#6F44F5]` 그라디언트를 적용한다.
- 강조 배경(뱃지, 안내 박스 등)은 `#EDECFC`를 사용한다.
- 기존 `#007AFF`(iOS 블루)는 사용하지 않는다.

---

## 타이포그래피

| 용도 | 크기 | 굵기 |
|---|---|---|
| 페이지 제목 | 24px | Bold (700) |
| 섹션 제목 | 17px | Semibold (600) |
| 카드 제목 | 15px | Semibold (600) |
| 본문 | 16px | Regular (400) |
| 보조 텍스트 | 13px | Regular (400) |
| 캡션 | 11–12px | Medium (500) |

폰트 패밀리 (기본): `'Pretendard', -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif`
- CDN: jsDelivr `pretendard@v1.3.9` 정적 빌드 (`index.html`에 `<link>`로 로드)

폰트 패밀리 (타이틀): `'Nanum Square Round', -apple-system, BlinkMacSystemFont, sans-serif`
- CSS 클래스: `.font-title`
- 적용 대상: 오늘의 미션, 오늘의 추천 글 섹션 타이틀 / 레벨 화면 레벨명 태그 / 성장 단계 화면 캐릭터명
- CDN: Google Fonts `Nanum+Square+Round` (wght 400/700/800)

---

## 스페이싱

- 페이지 좌우 패딩: `20px`
- 카드 내부 패딩: `20px`
- 카드 간격 (미션 카드): `16px`
- 카드 간격 (추천 글 카드): `24px`
- 섹션 간격 (홈): `48px`
- 섹션 간격 (기타): `24px`

---

## 컴포넌트 규칙

### 카드

| 유형 | 스타일 |
|---|---|
| 기본 카드 (목록형, 미션 카드 등) | `bg-white border border-[#D9DCE5] rounded-2xl px-5 py-6` |
| 글래스모피즘 카드 (히어로 위 Floating 카드) | `bg-white/70~75 backdrop-blur-sm border-[2~3px] border-white rounded-2xl/rounded-full` |
| 서브 카드 (주간 출석 등) | `bg-[#F6F7F9] rounded-2xl px-6 py-[30px]` |

### 버튼

| 유형 | 스타일 |
|---|---|
| 주요 버튼 | `bg-gradient(135deg, #9B7BFF, #6F44F5) text-white rounded-2xl py-4 text-[17px] font-semibold` |
| 보조 버튼 | `bg-[#EDECFC] text-[#6F44F5] rounded-2xl py-4 text-[16px] font-semibold` |
| 회색 필 버튼 (예: 성장 단계 보기) | `bg-[#E8E9EF] text-[#767C91] rounded-[30px] px-3 py-1.5 text-[12px] font-medium` |
| 텍스트 버튼 | `text-[#767C91] py-3 text-[15px]` |

### 배지 / 상태 태그

| 유형 | 스타일 |
|---|---|
| 진행 중 | `text-[#6F44F5] bg-[#EDECFC] text-[12px] font-semibold leading-none px-2 py-[6px] rounded-[30px] inline-flex items-center` |
| 완료 | `text-[#9EA5BB] bg-[#E8E9EF] text-[12px] font-semibold leading-none px-2 py-[6px] rounded-[30px] inline-flex items-center` |
| 현재 레벨 (나의 레벨 화면) | `text-[#6F44F5] bg-[#EDECFC] text-[12px] font-semibold leading-none px-2 py-[6px] rounded-[30px] inline-flex items-center` |
| 잠금 (미션 카드) | 텍스트 `opacity-30` + 카드 중앙에 `/assets/Lock.png` 오버레이, 배경 `linear-gradient(90deg, #FBFBFC 0%, #FBFBFC 100%)`, 고정 높이 `h-[72px]` |

### 미션 카드 상태별 텍스트 색상

| 상태 | 텍스트 색상 |
|---|---|
| 진행 중 | `#19181E` |
| 완료 | `#767C91` |
| 잠금 | `#19181E opacity-30` |

---

## 레벨 시각 자산

### 배경 이미지

| 레벨 | 파일 |
|---|---|
| Lv.1 | `/assets/bg_lv1.png` |
| Lv.2 | `/assets/bg_lv2.png` |
| Lv.3 | `/assets/bg_lv3.png` |
| Lv.4~5 | `/assets/bg_lv3.png` (fallback) |

### 캐릭터 이미지

| 레벨 | 파일 |
|---|---|
| Lv.1 아메바 | `/assets/character_lv1.png` |
| Lv.2 꼬물 물고기 | `/assets/character_lv2.png` |
| Lv.3 리틀 몽키 | `/assets/character_lv3.png` |
| Lv.4 꼬마 원시인 | `/assets/character_lv4.png` |
| Lv.5 아인슈타인 | `/assets/character_lv5.png` |

---

## 레벨 화면 레이아웃 규칙

- 배경 이미지는 Safe Area(상단 상태바)까지 자연스럽게 이어지는 하나의 연속된 영역으로 구성한다.
- 별도 헤더를 두지 않는다. 레벨 태그(`Lv.n 이름`)는 히어로 상단 중앙에 배치한다.
- 히어로 하단은 흰색(`#FFFFFF`)으로 그라디언트 페이드 처리한다.
- XP 카드, 주간 출석 기록 카드는 모두 히어로 하단부에 절대 배치(Floating)로 페이드 영역 위에 위치한다.
- XP 표기 형식: `경험치 n / nnn` (현재 XP / 다음 레벨 최소 XP)
- 히어로 아래 흰색 섹션에는 오늘의 미션 카드를 배치한다.

## 홈 화면 레이아웃 규칙

- 별도 헤더(사용자 인사, XP 정보 등)를 두지 않는다.
- 섹션 제목: `font-title text-[24px] text-[#19181E]` (NanumSquareRound ExtraBold)
- 오늘의 미션 섹션: 카드 1개씩 보이는 카루셀, CSS scroll snap 적용
  - 진입 시 현재 진행 중인 미션 위치로 자동 스크롤
  - 도트 인디케이터: 원형, 활성 `12px bg-[#6F44F5]`, 비활성 `8px bg-[#D9DCE5]`
- 추천 글 섹션: 아티클 카드 세로 목록, 부제목 `text-[16px] font-medium text-[#ADB3C5]`
- 섹션 간격: `48px`
- 아티클 카드 배지 (카테고리 · n분): `bg-black/50 rounded-full px-2.5 py-[8px] flex items-center`, 텍스트 `text-[11px] font-semibold text-white leading-none`

## 아티클 카드 규칙

- 썸네일 우측 상단에 `카테고리 · n분` 형식의 오버레이 배지 표시
  - 배지 스타일: 반투명 어두운 배경 (`bg-black/50`), 흰색 텍스트
  - 읽기 시간 계산: `Math.max(1, Math.ceil(body.length / 300))` 분
- 카드 본문 영역에서 카테고리 텍스트는 제거한다
- 읽음 표시: 썸네일 중앙에 흰색 원형 배경 + 체크 아이콘 (`bg-white/80` 원 + `#6F44F5` 체크)

---

## 성장 단계 화면 규칙

- 흰색(`#FFFFFF`) 배경에 목록 형식으로 구성한다.
- 상단: 현재 XP 카드 (`border border-[#D9DCE5] rounded-2xl p-5`) + XP 아이콘 (`/assets/XP.png`, 92px)
- XP 카드 하단에 안내 문구 표시: "단세포 생물인 아메바가 똑똑한 인간으로 성장하는 과정이에요!" (강조 단어 `#6F44F5`)
- 각 레벨 아이템: `110×130px bg-[#F6F7F9] rounded-2xl` 캐릭터 카드 + 우측 레벨명/달성 조건 텍스트
- 구분선 사용하지 않는다.
- 미달성 레벨 캐릭터도 정상 컬러로 표시한다. 회색 처리하지 않는다.
- 현재 레벨에만 "내 레벨" 배지를 표시한다 (`bg-[#EDECFC] text-[#6F44F5]`).

---

## 보상 팝업 규칙

- XP 획득 팝업 이미지: `/assets/xp_celebration.png`, `w-[260px] h-auto`
- 레벨업 팝업 캐릭터 이미지: `w-[260px] h-[164px] object-contain`
- XP 획득 내역 표시 형식: `{항목명} +nXP`

### 항목명 통일 규칙

| 원본 라벨 | 표시 라벨 |
|---|---|
| 읽기 완료 | 글 읽기 |
| 퀴즈 정답 / 퀴즈 참여 | 퀴즈 참여 |
| 미션: {미션명} | 미션 완료 |
| 전체 미션 완료 보너스 | 전체 미션 완료 |
| 데일리 출석 | 데일리 출석 |
| 위클리 출석 | 위클리 출석 |

---

## 인터랙션

- 탭 피드백: `active:opacity-70` 또는 `active:scale-[0.98]`
- 트랜지션: `transition-all duration-500` (XP 프로그레스바 등)
- 팝업: 하단 시트 방식, `rounded-t-3xl`

---

## 모바일 UX 규칙

- 기준 너비: 390px (360px~430px 범위 지원)
- Safe Area: `env(safe-area-inset-top)` / `env(safe-area-inset-bottom)` 적용
- 최소 터치 영역: 44×44px
- 하단 탭 바: 고정(`fixed bottom-0`), Safe Area 하단 여백 포함
- 하단 탭 바에 의해 가려지는 콘텐츠: `pb-24` 이상 확보

### iOS Safari 상태바 색상 규칙

- `<meta name="theme-color">` 태그로 Safari 크롬(상태바 배경) 색상 제어
- 화면별로 `useEffect`에서 동적으로 `theme-color`와 `document.body.style.backgroundColor`를 동시 업데이트
- 컴포넌트 언마운트 시 이전 값으로 복원 (cleanup 필수)
- 나의 레벨 화면 상단 배경 색상 (레벨별 픽셀 샘플):
  - Lv.1: `#BDD7FB`
  - Lv.2: `#CDE8EF`
  - Lv.3: `#DAE6B9`

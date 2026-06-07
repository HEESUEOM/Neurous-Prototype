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
| 서브 배경 | `#F2F2F7` |
| 카드 배경 | `#FFFFFF` |
| 주요 텍스트 | `#1C1C1E` |
| 보조 텍스트 | `#8E8E93` |
| 중간 텍스트 | `#636366` |
| **브랜드 메인** | **`#6F44F5`** |
| 브랜드 라이트 | `#F0ECFF` |
| 브랜드 그라디언트 | `from-[#7C55F6] to-[#6F44F5]` |
| 성공 (초록) | `#34C759` |
| 위험 (빨강) | `#FF3B30` |
| 구분선 | `#E5E5EA` |

### 컬러 적용 원칙

- 모든 포인트 컬러는 `#6F44F5`를 기준으로 사용한다.
- 주요 CTA 버튼은 `from-[#7C55F6] to-[#6F44F5]` 그라디언트를 적용한다.
- 강조 배경(뱃지, 안내 박스 등)은 `#F0ECFF`를 사용한다.
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

폰트 패밀리 (기본): `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif`

폰트 패밀리 (타이틀): `'Nanum Square Round', -apple-system, BlinkMacSystemFont, sans-serif`
- CSS 클래스: `.font-title`
- 적용 대상: 오늘의 미션, 오늘의 추천 글 섹션 타이틀 / 레벨 화면 레벨명 태그 / 성장 단계 화면 캐릭터명
- CDN: Google Fonts `Nanum+Square+Round` (wght 400/700/800)

---

## 스페이싱

- 페이지 좌우 패딩: `16px`
- 카드 내부 패딩: `20px`
- 카드 간격: `12px`
- 섹션 간격: `16px`

---

## 컴포넌트 규칙

### 카드

| 유형 | 스타일 |
|---|---|
| 기본 카드 | `bg-white rounded-2xl shadow-sm` |
| 글래스모피즘 카드 | `bg-white/60 backdrop-blur-md rounded-2xl border border-white/70 shadow-sm` |

### 버튼

| 유형 | 스타일 |
|---|---|
| 주요 버튼 | `bg-gradient(135deg, #7C55F6, #6F44F5) text-white rounded-2xl py-4 text-[17px] font-semibold` |
| 보조 버튼 | `bg-[#F0ECFF] text-[#6F44F5] rounded-2xl py-4 text-[16px] font-semibold` |
| 텍스트 버튼 | `text-[#8E8E93] py-3 text-[15px]` |

### 배지

| 유형 | 스타일 |
|---|---|
| 진행 중 | `text-[#6F44F5] bg-[#F0ECFF] text-[11px] font-semibold px-2 py-0.5 rounded-full` |
| 완료 | `text-[#34C759] bg-green-50 text-[11px] font-semibold px-2 py-0.5 rounded-full` |
| 현재 레벨 | `text-white bg-[#6F44F5] text-[11px] font-bold px-2 py-0.5 rounded-full` |

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
- XP 카드는 히어로 하단부 절대 배치로 페이드 영역 위에 위치한다.
- XP 표기 형식: `n / nnn XP` (현재 XP / 다음 레벨 최소 XP)
- 히어로 아래 흰색 섹션에 주간 출석, 미션 카드를 배치한다.

## 홈 화면 레이아웃 규칙

- 별도 헤더(사용자 인사, XP 정보 등)를 두지 않는다.
- 섹션 제목은 큰 타이틀(`text-[22px] font-bold`) 형식으로 표시한다.
- 오늘의 미션 섹션: 카드 1개씩 보이는 카루셀, CSS scroll snap 적용
  - 카루셀 하단에 5개 도트 인디케이터 표시 (`●●●●●`)
  - 활성 도트: `#6F44F5`, 비활성 도트: `#E5E5EA`
- 오늘의 추천 글 섹션: 아티클 카드 세로 목록

## 아티클 카드 규칙

- 썸네일 우측 상단에 `카테고리 · n분` 형식의 오버레이 배지 표시
  - 배지 스타일: 반투명 어두운 배경 (`bg-black/50`), 흰색 텍스트
  - 읽기 시간 계산: `Math.max(1, Math.ceil(body.length / 300))` 분
- 카드 본문 영역에서 카테고리 텍스트는 제거한다
- 읽음 표시: 썸네일 중앙에 흰색 원형 배경 + 체크 아이콘 (`bg-white/80` 원 + `#6F44F5` 체크)

---

## 성장 단계 화면 규칙

- 흰색(`#FFFFFF`) 배경에 목록 형식으로 구성한다. 카드 래퍼를 사용하지 않는다.
- 각 레벨 아이템은 구분선(`border-b border-[#E5E5EA]`)으로 분리한다.
- 각 레벨 아이템에 `character_lv{n}.png` 이미지를 원형 컨테이너 없이 그대로 표시한다.
- 미달성 레벨 캐릭터도 정상 컬러로 표시한다. 회색 처리하지 않는다.
- 현재 레벨에만 "내 레벨" 배지를 표시한다.
- 미달성 레벨에는 잠금 아이콘만 표시한다. XP 수치는 표시하지 않는다.

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

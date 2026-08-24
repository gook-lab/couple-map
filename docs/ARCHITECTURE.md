# Couple App — 아키텍처

> 기능 개요와 실행법은 [`../README.md`](../README.md).
> 디자인 토큰 전체 표는 [`../.claude/rules/design-system.md`](../.claude/rules/design-system.md).

---

## 0. 큰 그림

서버가 없습니다. Firebase가 백엔드 전체고, **보안은 Firestore 규칙이 담당합니다.**

```
   ┌──────────────────────────────────────────────────────────┐
   │ React 19 + Vite  (모바일 PWA, 최대 폭 430px)               │
   │                                                          │
   │   pages/ ── components/ ── contexts/(Theme·Auth)         │
   │      │                                                   │
   │      └── services/  ← Firebase 접근은 전부 여기를 통과      │
   └──────┬───────────────────────────────────────────────────┘
          │
   ┌──────▼──────────┐  ┌──────────────┐  ┌──────────────────┐
   │ Firebase Auth   │  │ Firestore    │  │ Storage (사진)    │
   └─────────────────┘  │ + rules      │  └──────────────────┘
                        └──────────────┘
   ┌─────────────────────────────────────┐
   │ Kakao Maps SDK (핀 지도)             │
   │ d3-geo (한국/서울 지역 채우기 지도)    │
   └─────────────────────────────────────┘
```

**규칙 하나**: 컴포넌트가 Firebase SDK를 직접 부르지 않습니다. 전부 `src/services/`를 거쳐야 합니다.
`src/lib/`은 반대로 Firebase를 모르는 순수 유틸만 담습니다.

---

## 1. 데이터 모델과 보안 경계

핵심 개념은 **커플(couple)**입니다. 두 사용자가 하나의 `couples/{id}` 문서를 공유하고,
그 아래 기록이 달려 있습니다.

```
users/{userId}                 본인만 read/write
couples/{coupleId}             users 배열에 본인 uid가 있어야 read/update
                               create는 users.size() == 2 여야 함
inviteCodes/{code}             페어링 플로우
  · 생성자: 생성 / 조회 / 삭제
  · 참여자: get 후 소비 전이(used:false → true + coupleId 기록)만 허용
            변경 가능한 키를 ['used','coupleId']로 제한
… (기록 컬렉션들)              isCoupleMember(coupleId) 게이트
```

`isCoupleMember(coupleId)`는 `couples/{id}.users` 배열에 요청자 uid가 있는지 확인합니다.

> **초대 코드 전이 규칙이 핵심 방어선입니다.** 참여자는 코드를 "소비"만 할 수 있고,
> 생성자로 위장하거나 다른 필드를 건드릴 수 없습니다(`affectedKeys().hasOnly`).
> 이 규칙들은 `npm run test:rules`(Firebase 에뮬레이터 + Vitest)로 테스트합니다.

### 서비스 레이어

| 서비스 | 담당 |
|---|---|
| `firebase.ts` | SDK 초기화 |
| `couple.ts` | 페어링 · 커플 문서 |
| `places.ts` · `memories.ts` | 장소 핀 · 기록 |
| `comments.ts` · `reactions.ts` | 댓글 · 리액션 |
| `chat.ts` · `letters.ts` · `daily-question.ts` | 채팅 · 편지 · 오늘의 질문 |
| `anniversaries.ts` · `challenges.ts` · `expenses.ts` | 기념일 · 챌린지 · 비용 |
| `travelogues.ts` · `stickers.ts` | 여행기 · 스티커 |
| `upload.ts` | Storage 업로드 |
| `notifications.ts` | 알림 |
| `account.ts` · `data-export.ts` | 계정 · 데이터 내보내기 |

---

## 2. 지도 두 종류

지도가 두 개인 이유는 **역할이 다르기 때문**입니다.

| | KakaoMapView | KoreaGeoMap / SeoulGeoMap |
|---|---|---|
| 기술 | Kakao Maps SDK | d3-geo + SVG |
| 목적 | **점** — 개별 장소에 핀 |
| | | **면** — 다녀온 지역을 색으로 채움 |
| 상호작용 | 장소 검색 · 핀 추가 · 상세 | 지역 클릭 → RegionDetail |

장소 추가 플로우(`pages/add/`)는 **국가 → 지역 → 장소 검색 → 핀 폼** 4단계입니다.
지역 정보가 먼저 확정되어야 지역 채우기 지도가 갱신되기 때문에 순서가 고정되어 있습니다.

---

## 3. 테마 시스템 — 프리셋 × 팔레트 × 모드

`ThemeContext`가 세 축을 독립적으로 관리합니다.

```
팔레트 6종  coral(기본) · sage · blue · purple · yellow · black   → --accent-*
모드 3종    light · dark · system                                 → 색 계열
폰트 프리셋 2종  clean(Pretendard) · sketch(개구쟁이 손글씨)        → --app-* 전체
```

**폰트 프리셋은 글꼴만 바꾸는 게 아니라 조형 언어 전체를 바꿉니다.**
`<html>`의 `data-font` 속성 하나로 토큰이 통째로 달라집니다.

| 토큰 | clean | sketch |
|---|---|---|
| `--app-font` | Pretendard | Gaegu (손글씨) |
| `--app-radius` | 14px | 6px |
| `--app-radius-lg` | 20px | 10px |
| `--app-stroke` | 1px | 1.6px |
| `--app-shadow` | 부드러운 드롭섀도 | 3px 3px 하드 섀도 |
| `--app-bg` | `#f5f5f4` | `#fbf8f1` (크림) |
| `--app-card` | `#ffffff` | `#fffdf6` (웜 화이트) |
| `--app-line` | `#e7e5e4` | `#2a241d` (진한 선) |
| `--app-btn-ghost-border` | solid | dashed |

접근은 `useTheme()` — `palette` · `mode` · `modePreference` · `font` + 각 setter.

> 이 설계의 대가로 **하드코딩된 색/모서리/그림자는 전부 금지**입니다.
> 하나라도 리터럴을 쓰면 sketch 프리셋에서 그 요소만 튀어납니다.

---

## 4. 컴포넌트 계약

**"직접 만들지 말고 있는 걸 쓴다"**가 이 프로젝트의 UI 규칙입니다.

| 상황 | 반드시 쓸 것 |
|---|---|
| 제목/본문 텍스트 | `H1` `H2` `H3` `Body` `Meta` `Tiny` `Emphasis` (`@/components/ui/typography`) |
| 카드 | `glass-card` 유틸 |
| 그룹 리스트(설정·메뉴·장소 목록) | `GlassList` + `ListRow` |
| 숫자 + 라벨 통계 | `StatCard` |
| 프로필 카드 | `ProfileCard` |
| 빈 상태 | `EmptyState` (`actionLabel` + `onAction`) |
| 필터 태그 | `Pill` (`primary` / `secondary`) |
| 촉각 피드백 버튼 | `PressButton` |
| 글래스 표면 | `glass` · `glass-pill` · `glass-card` · `glass-bar` |

버튼은 전부 `rounded-full`입니다.

### 레이아웃 계약

앱 최대 폭은 **430px 중앙 정렬**(모바일 PWA)입니다. 그래서 `fixed` 요소는
뷰포트가 아니라 **앱 폭**에 맞춰야 합니다.

```
fixed 요소:  left-1/2 -translate-x-1/2 w-full max-w-[430px]
본문:        pb-20  (BottomNav + FAB 공간)
```

BottomNav는 인증된 모든 페이지에서 항상 보입니다.

---

## 5. 마이크로 인터랙션 (`components/micro/`)

기록 앱에서 "쌓이는 느낌"을 만드는 작은 연출들을 컴포넌트로 분리했습니다.

| 컴포넌트 | 연출 |
|---|---|
| `PinDrop` | 핀이 떨어지는 모션 |
| `RegionFill` | 지역이 색으로 채워지는 모션 |
| `DDayCounter` | 기념일 카운터 |
| `PartnerSync` | 상대와 동기화되는 표시 |
| `PressButton` | 눌림 피드백 |
| `TabIndicator` | 탭 전환 인디케이터 |

---

## 6. 오프라인 · 단독 사용

| 상황 | 처리 |
|---|---|
| 네트워크 끊김 | `OfflineBanner` |
| 아직 커플 페어링 전 | `SoloModeBanner` — 혼자서도 기록은 가능 |
| 실패 | `ErrorModal` + Sentry 보고 |

---

## 7. 문서 상태에 대한 주의

`docs/PROJECT_OVERVIEW.md`는 **초기 기획 문서**입니다. 스택 설명(Next.js 14 App Router)이
현재 구현(React 19 + Vite)과 달라서 구조에 대한 현행 기준은
이 문서와 [`../README.md`](../README.md)입니다.

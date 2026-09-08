# couple-map

**한국어** | [English](README.en.md)

함께 다닌 장소와 추억을 지도와 타임라인에 기록하는 모바일 PWA입니다.

맛집·카페·데이트 장소를 카카오 지도에 저장하고, 방문한 국내외 지역을 지도에서 확인할 수 있습니다. 두 사용자가 같은 기록을 공유하며 기념일·편지·대화·타임캡슐을 한곳에서 관리하도록 구성했습니다.

## 주요 경험

- **장소 기록**: 장소 검색부터 지도 핀, 사진과 메모 저장까지 하나의 흐름으로 연결했습니다.
- **추억 탐색**: 지도·지역·타임라인·캘린더에서 같은 기록을 서로 다른 기준으로 찾아볼 수 있습니다.
- **함께 쓰는 데이터**: 커플 단위 권한으로 기록과 반응을 공유하고 Firestore 보안 규칙을 별도로 검증합니다.
- **모바일 사용성**: 430px 앱 영역을 기준으로 내비게이션과 고정 UI를 배치하고 오프라인·저장 상태를 안내합니다.

---

## 스크린샷

<img src="docs/screenshots/01-welcome.png" width="280">

## 실행

```bash
npm install
npm run dev          # http://localhost:6173
npm run build       # tsc -b && vite build
npm run lint
npm test            # Vitest
npm run test:rules  # Firestore 보안 규칙 테스트 (firebase 에뮬레이터)
```

### 환경 변수

```
VITE_KAKAO_APP_KEY=       # Kakao Maps JavaScript 키
VITE_KAKAO_REST_API_KEY=  # Kakao REST API 키
VITE_FIREBASE_*=          # Firebase 설정
```

---

## 기술 스택

| 영역 | 사용 기술 |
|---|---|
| 프레임워크 | React 19 + Vite + TypeScript |
| 스타일 | Tailwind CSS 4 (`global.css`의 `@theme` 토큰) |
| UI | Radix UI + 자체 공통 컴포넌트 |
| 상태 | Zustand (`use-auth-store`) + Context (Theme / Auth) |
| 백엔드 | Firebase — Auth · Firestore · Storage |
| 지도 | Kakao Maps SDK (`react-kakao-maps-sdk`) + d3-geo (지역 지도) |
| 애니메이션 | Framer Motion |
| 폼 | react-hook-form + zod |
| 에러 | Sentry |

---

## 주요 기능

| 영역 | 페이지 |
|---|---|
| **기록** | Today(오늘의 기록) · Travel(지도) · Timeline · MemoryDetail · Compose · PhotoEditor · VoiceMemo |
| **지도** | KakaoMapView(핀) · KoreaGeoMap / SeoulGeoMap(지역 채우기) · RegionDetail · Explore |
| **관계** | Chat · DailyQuestion · CoupleChallenge · Anniversary · TimeCapsule · LocationShare |
| **정리** | Calendar · Stats · Search · Travelogue(여행기) · Print · ShareCard · Stickers |
| **기타** | DateRoulette(데이트 룰렛) · DateExpenses(데이트 비용) · Notifications · Profile · Onboarding |

`pages/add/`는 장소 추가 플로우다: 국가 선택 → 지역 선택 → 장소 검색 → 핀 폼.

---

## 프로젝트 구조

```
src/
├── components/
│   ├── ui/        공통 UI — typography · pill · list-row · glass-list
│   │              stat-card · profile-card · empty-state
│   ├── maps/      KoreaGeoMap · SeoulGeoMap · KakaoMapView
│   ├── layout/    MainLayout · BottomNav
│   ├── shared/    AddSheet · OfflineBanner · SoloModeBanner · ErrorModal
│   ├── micro/     PinDrop · RegionFill · DDayCounter · PartnerSync
│   │              PressButton · TabIndicator
│   └── auth/
├── contexts/      ThemeContext(팔레트/모드/폰트) · AuthContext
├── services/      Firebase API — firebase · places · couple · memories · comments
│                  reactions · notifications · anniversaries · letters · chat
│                  challenges · daily-question · expenses · stickers · travelogues
│                  upload · account · data-export
├── lib/           순수 유틸 — animations · countries · regions · toast · utils
├── pages/         화면 (+ pages/add/ 장소 추가 플로우)
├── store/         use-auth-store (zustand)
├── types/         place · kakao
└── styles/        global.css (디자인 토큰 + glass 유틸) · font.css

firestore.rules      보안 규칙 (테스트: npm run test:rules)
firestore.indexes.json
```

---

## 디자인 시스템

상세 규칙은 **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)**와 `.claude/rules/design-system.md`에서 확인할 수 있습니다. 화면마다 다른 스타일을 추가하기보다 공통 토큰과 UI 컴포넌트를 조합합니다.

- **테마**: 팔레트 6종(coral 기본 · sage · blue · purple · yellow · black) ×
  모드 3종(light / dark / system) × 폰트 2종(Pretendard / 개구쟁이 손글씨)
- **토큰**: `--app-font` · `--app-radius` · `--app-stroke` · `--app-shadow` ·
  `--app-card` · `--app-line` · `--app-line-soft` · `--accent-*`
- **글래스 유틸**: `glass` · `glass-pill` · `glass-card` · `glass-bar`
- **타이포**: `<H1> <H2> <H3> <Body> <Meta> <Tiny> <Emphasis>` 컴포넌트로만
- **레이아웃**: 앱 최대 폭 **430px 중앙 정렬**(모바일 PWA).
  모든 `fixed` 요소는 `left-1/2 -translate-x-1/2 w-full max-w-[430px]`

### 사용 기준

| 하지 말 것 | 대신 |
|---|---|
| 생 텍스트 클래스 | Typography 컴포넌트 |
| 인라인 글래스 스타일 | glass CSS 유틸 |
| 하드코딩 색상 | CSS 변수 (`--accent-*`, `--app-*`) |
| `border-couple-gray-*` 구분선 | `var(--app-line-soft)` |
| 애드혹 리스트/빈 상태 | `GlassList` + `ListRow`, `EmptyState` |

모든 버튼은 `rounded-full`이고 모든 카드는 `glass-card` 유틸을 씁니다.

---

## 문서

| 문서 | 내용 |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 아키텍처 · 데이터 모델 · 디자인 시스템 |
| [CLAUDE.md](CLAUDE.md) | 작업 규칙 (디자인 시스템 전체 표 포함) |
| `.claude/rules/design-system.md` | 토큰 전체 표 |
| [TODOS.md](TODOS.md) | 남은 작업 |

`docs/PROJECT_OVERVIEW.md`는 초기 기획 기록으로 보관하고 있습니다. 현재 구현과 기술 구성은 이 README와 `docs/ARCHITECTURE.md`를 기준으로 합니다.

---

## 라이선스

**Source-available — 오픈소스가 아닙니다.** 코드를 읽을 수 있게 공개했을 뿐,
사용 권한을 드린 것은 아닙니다. 다른 프로젝트에 가져다 쓰거나 재배포·상업적 이용을
하려면 사전 서면 허락이 필요합니다. 전문은 [LICENSE](LICENSE), 한국어 안내는 [LICENSE.ko.md](LICENSE.ko.md) 참조.

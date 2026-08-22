# TODOS — Couple App Revised Plan

> ⚠️ **이 문서의 아래 체크박스는 초기 기획안이며 현재 상태와 불일치합니다.**
> 아래 "현재 구현 상태 요약" 표 기준 대부분 80%+ 구현 완료.
> 실제 남은 작업은 이 섹션을 참조하세요 ↓

## 실제 남은 작업 (2026-07-10 eng-review 기준)

> 로드맵: `~/.gstack/projects/couple-app/kyb-ontact-unknown-design-20260710-105613.md` (APPROVED)

**현재 작업 — Stage 1: 실사용 진입 (이번 주)**
- [ ] T1: `places.ts` coupleId 필드 + 쿼리 스코프 + `mapPlaceDoc()` 헬퍼 + `firestore.indexes.json` 복합 인덱스 (⚠️ 규칙보다 선행 — 기존 개발 데이터는 초기화)
- [ ] T2: `firebase init` (firebase.json: hosting + rules + indexes)
- [ ] T3: 규칙 강화 — 구세대 6컬렉션(savedPlaces/memories read/anniversaries/letters/chat/wishlists)에 `isCoupleMember()` 확장 + inviteCodes 조이기
- [ ] T4: @firebase/rules-unit-testing 에뮬레이터 테스트 (커플 허용/제3자 거부/코드 변조 거부)
- [ ] T5: Hosting 배포 + 2계정 페어링 E2E + 파트너 PWA 설치
- [ ] T6: iOS 웹푸시 실측 스파이크 (Spark 범위, Blaze 전환 전) — 부정적이면 Stage 2를 인앱 카드 중심으로 전환

**다음 — Stage 2 (스파이크 긍정 시)**: Blaze + functions/ + FCM 트리거 + notifications coupleId + sw.js 병합
**그 다음 — Stage 3**: Date DNA 히트맵 → (반응 확인 후) Passport 배지

**명시적 보류 (디자인 문서 컷 — 미완성 작업 아님)**
- Explore 소셜 피드 백엔드 / Print 결제(PG) / LocationShare 실시간(<5초) — 니치 리서치 결과 뷔페 기능으로 판정
- VoiceMemo, PhotoEditor 잔여 도구, Travelogue 발행 — 실사용 후 필요 확인되면 재개

**추후 (Blaze 전환 후)**
- Firestore 백업/규칙 롤백 SOP — 실사용 기록이 쌓이면 유일본이 됨. gcloud firestore export 주기화 + 규칙 이전 버전 보관. 지금은 데이터 0이라 불필요, Stage 2~3 사이가 적기

**품질**
- 테스트: countries/regions 외 services·페이지 커버리지 0 → T4가 첫 확장, Stage 3 순수함수(밀도 집계/배지 판정)도 단위 테스트 필수

---

## 현재 구현 상태 요약

| 영역 | 상태 | 진행률 |
|------|------|--------|
| 온보딩 | ✅ 스플래시+웰컴+로그인+프로필+파트너연결+완료 8스텝 | **90%** |
| 홈 (Today) | ✅ 피드/지도/카드 3탭 전환 | **85%** |
| 지도 (Travel) | ✅ 국가선택+시도맵+장소검색+핀폼+저장 플로우 | **80%** |
| 작성 (Compose) | ✅ 일기+태그+기분+날씨+공개범위 3스텝 | **75%** |
| 타임라인 | ✅ 다이어리+폴라로이드 2탭+필터+데이터연동 | **80%** |
| 캘린더 | ✅ 월별+D-day+준비메뉴+위시리스트+편지 | **80%** |
| 프로필 | ✅ MY+프로필수정+커플정보+알림토글7개+테마(모드/컬러/폰트) | **85%** |
| 파트너 상호작용 | ✅ 알림페이지+하트버스트+리액션피커+댓글+채팅 | **70%** |
| 위치 공유 | ✅ 안내+공유맵+가는중+지오펜스+같은장소+일시정지 6스텝 UI | **70%** |
| 알림 | ✅ 알림 리스트+읽음/안읽음+빈상태 | **60%** |
| 에러/엣지 | ✅ 오프라인배너+솔로모드배너+에러모달 | **50%** |
| 마이크로인터랙션 | ✅ PinDrop+RegionFill+DDayCounter+PartnerSync+PressButton+TabIndicator | **80%** |
| 지도 SVG | ✅ GeoJSON 지형 맵 (한국 17시도 + 서울 25구 드릴다운) + 시도/구 라벨 | **90%** |
| 탐색 (Explore) | ✅ 피드+안전안내+상세+복제+신고 6스텝 | **80%** |
| 인쇄 (Print) | ✅ 상점+옵션+미리보기+주소+결제+완료+배송추적 7스텝 | **80%** |
| 스티커 (Stickers) | ✅ 그리드+새생성+사진선택+디자인+저장+캐러셀 7스텝 | **80%** |
| 여행기 (Travelogue) | ✅ 진입+추억선택+정렬+캡션+커버+발행 6스텝 | **80%** |

---

## Phase 2: 핵심 플로우 완성 (+ 버튼 → 추억 추가)

> 와이어프레임 ② + ③ 에 해당. 앱의 핵심 루프.

### 2-1. + 버튼 → 추가 타입 시트 (MA_02)
- [ ] BottomSheet 컴포넌트로 4가지 옵션: 추억 핀 / 여행 계획 / 버킷 리스트 / 기념일
- [ ] Compose 페이지 대신 시트에서 분기
- **Files**: `src/components/shared/AddSheet.tsx`, `src/components/layout/BottomNav.tsx` 수정

### 2-2. 국가 선택 → 지역 맵 (MA_03, MA_04)
- [ ] 국가 선택 시트 (한국/일본/대만/유럽/미국 + 추가)
- [ ] 각 국가별 진행률 표시 (X/17 시도, X/47 도도부현)
- [ ] 한국 17개 시도 SVG 맵 — 방문/미방문 색칠, 선택시 하이라이트
- [ ] 범례 (선택/방문/아직)
- **Files**: `src/components/maps/CountryPicker.tsx`, `src/components/maps/KoreaMap.tsx` 리팩터

### 2-3. 장소 검색 + 핀 폼 (MA_05, MA_06)
- [ ] 지역 내 장소 검색 (카카오 API 연동)
- [ ] 검색 결과 → 선택 → 핀 작성 폼
- [ ] 폼: 날짜 / 사진 (최대 9장) / 일기 / 태그
- [ ] 임시저장 기능
- **Files**: `src/components/maps/PlaceSearch.tsx` 리팩터, `src/pages/PinForm.tsx`

### 2-4. 저장 플로우 (MA_07, MA_08, MA_09)
- [ ] 저장 중 모달 (스피너 + 사진 업로드 진행률)
- [ ] 저장 성공 토스트 + 지도에 새 핀 표시
- [ ] 추억 상세 화면 (이미지 + 일기 + 태그 + 좋아요/댓글)
- [ ] 사진 한도 초과 에러 모달 (MA_10)
- **Files**: `src/components/shared/SavingModal.tsx`, `src/pages/MemoryDetail.tsx`

### 2-5. 추억 작성 확장 (MM_02~MM_07)
- [ ] 사진 멀티 선택 (3열 그리드, 선택 배지)
- [ ] 위치/날짜 자동 인식 (EXIF 메타데이터)
- [ ] 태그 입력 + 추천 태그
- [ ] 기분(9개 이모지) + 날씨(5개) 선택
- [ ] 공개 범위 (둘만/나만/친구) + 파트너 알림 토글
- [ ] 업로드 진행률 모달
- **Files**: `src/pages/Compose.tsx` 전면 리팩터

---

## Phase 3: 온보딩 강화

> 와이어프레임 ① 에 해당. 첫인상 결정.

### 3-1. 스플래시 + 웰컴 (OB_01, OB_02)
- [ ] 스플래시 화면 (앱 아이콘 + "둘 사이" + 로딩 애니메이션)
- [ ] 웰컴 화면 ("둘만의 지도를 그려볼까요" + 시작하기 CTA)

### 3-2. 로그인 선택 (OB_03)
- [ ] 4가지 로그인: Apple / Google / 카카오 / 전화번호
- [ ] 현재 Login.tsx를 이 디자인으로 교체
- [ ] 이용약관 + 개인정보처리방침 링크

### 3-3. 전화번호 인증 (OB_04, OB_05)
- [ ] 국가코드 선택 + 전화번호 입력
- [ ] 6자리 OTP 코드 입력 UI (개별 셀)
- [ ] 타이머 + 재전송

### 3-4. 프로필 설정 (OB_06)
- [ ] 아바타 업로드 (카메라 배지)
- [ ] 이름 / 생일 / 성별 입력 폼
- [ ] 진행 표시 "4 / 6"

### 3-5. 파트너 연결 개선 (OB_07~OB_12)
- [ ] 3가지 선택 카드: 코드 만들기 / 코드 입력 / 나중에
- [ ] 코드 공유 화면: 대형 코드 표시 + 만료 타이머 + 복사/공유 + 대기 애니메이션
- [ ] 코드 입력: 커스텀 키패드 (숫자+문자)
- [ ] 연결 중 애니메이션 (두 아바타 + 하트)
- [ ] 연결 실패 화면 (에러 아이콘 + 사유 + 재시도)
- [ ] 연결 성공 + 완료 (커플 카드 + 온보딩 체크리스트)

---

## Phase 4: 지도 상세 + 타임라인

> 와이어프레임 지도색칠 플로우 + 타임라인 변형.

### 4-1. 지역 상세 화면 (MapStep3)
- [ ] 지역 히어로 카드 (SVG + 방문일수 + 방문횟수)
- [ ] 필터 필: 전체/맛집/카페/풍경/숙소
- [ ] 핀 리스트 (이모지 + 카테고리 + 날짜 + 사진수 + 별점)
- [ ] 추억 그리드 (3열 사진)
- [ ] 일기 엔트리 (날짜배지 + 제목 + 작성자)
- **Files**: `src/pages/RegionDetail.tsx`

### 4-2. 타임라인 변형
- [ ] A: 세로 다이어리 (현재 기반 개선)
- [ ] B: 폴라로이드 그리드 (월별 섹션, 기울어진 카드)
- [ ] C: 듀얼 레인 — 같은날 다른 기억 (지영/지민 시점)
- [ ] 탭으로 변형 전환
- **Files**: `src/pages/Timeline.tsx` 리팩터

### 4-3. 홈 변형
- [ ] A: 지도 중심 (미니맵 + 최근 핀 + 지역 필터)
- [ ] B: 위젯 카드 (D-day 프로그레스 + 다음데이트 + 파트너기분 + 데이트비)
- [ ] C: 오늘의 피드 (현재 기반 개선)
- **Files**: `src/pages/Today.tsx` 리팩터

---

## Phase 5: 파트너 상호작용

> 와이어프레임 ④ 에 해당. 커플 앱의 감성 핵심.

### 5-1. 알림 시스템
- [ ] 알림 페이지 (리스트형)
- [ ] 알림 타입: 새추억 / 기념일 / 댓글 / 좋아요 / 위치
- [ ] 읽음/안읽음 상태
- [ ] 빈 상태 화면 (NotifC_Empty)
- **Files**: `src/pages/Notifications.tsx`, `src/types/notification.ts`

### 5-2. 추억 반응
- [ ] 더블탭 좋아요 + 하트 버스트 애니메이션
- [ ] 롱프레스 리액션 피커 (6개 이모지)
- [ ] 좋아요/리액션 카운트 표시
- **Files**: `src/components/memory/HeartBurst.tsx`, `src/components/memory/ReactionPicker.tsx`

### 5-3. 댓글 + 사진 답장
- [ ] 댓글 입력 (아바타 + 텍스트 + 전송)
- [ ] 사진으로 답장 (사진 + 캡션 + 위치/음악 태그)
- [ ] 댓글 리스트
- **Files**: `src/components/memory/CommentThread.tsx`, `src/pages/PhotoReply.tsx`

### 5-4. 채팅 스레드 (PR_07)
- [ ] 1:1 채팅 UI (좌/우 버블, 시간 구분선)
- [ ] 이미지 메시지
- [ ] 리액션 배지
- [ ] 타이핑 인디케이터
- [ ] 음성 메시지 버튼
- **Files**: `src/pages/Chat.tsx` (이미 파일 있음, 리팩터)

---

## Phase 6: 기념일 시스템

> 와이어프레임 ⑤ 에 해당.

### 6-1. D-day 카운트다운 (AN_02)
- [ ] 메인 카운트다운 카드 (큰 D-day 숫자 + 아바타 쌍)
- [ ] 다가오는 일정 리스트
- [ ] "특별한 하루 준비하기" CTA

### 6-2. 준비 메뉴 (AN_03)
- [ ] 5가지 옵션: 위시리스트 / 편지 / 데이트코스 / 추억되돌아보기 / 서프라이즈예약
- [ ] 파트너 모르게 준비 가능 표시

### 6-3. 위시리스트 (AN_04)
- [ ] 파트너 위시리스트 그리드 (상품 카드 + 가격 + 인기도)
- [ ] 필터: 전체 / 구매한것 / 받고싶어요

### 6-4. 편지 (AN_05, AN_07)
- [ ] 편지 작성 (예약 발송, 노란 카드 UI, 사진/노래/음성 첨부)
- [ ] 편지 열람 (다크 모드, 로테이션 카드, 리액션 버튼)

### 6-5. 기념일 당일 + 연간 회고 (AN_06, AN_08)
- [ ] 당일 축하 화면 (이모지 + 큰 텍스트 + 아바타 쌍)
- [ ] 1년 회고 슬라이드쇼 (진행 바 + 날짜 태그 + 배경음악)

---

## Phase 7: 설정 강화

> 와이어프레임 ⑦ 에 해당.

### 7-1. MY 페이지 리팩터 (SE_01)
- [ ] 프로필 카드 (아바타 + 이름 + 아이디 + D+일수)
- [ ] 통계 3열: 추억 / 시도 / 사진
- [ ] 메뉴 리스트: 프로필수정/우리정보/알림/개인정보/테마/도움말/로그아웃

### 7-2. 프로필 수정 (SE_02)
- [ ] 아바타 편집 (카메라 오버레이)
- [ ] 이름 / 아이디(사용가능 체크) / 생일 / 자기소개(멀티라인) 폼

### 7-3. 커플 정보 (SE_03)
- [ ] 커플 카드 (두 아바타 + 하트 + 이름 + D+일수)
- [ ] 편집: 만난날/커플이름/커플사진/배경음악/커플이모지
- [ ] 커플 끊기 (확인 다이얼로그 + 텍스트 확인 입력)

### 7-4. 알림 설정 (SE_04)
- [ ] 7개 토글: 새추억/댓글좋아요/기념일/위치/추억회상/주간리포트/광고

### 7-5. 테마 설정 (SE_05)
- [ ] 모드: 라이트/다크/시스템
- [ ] 액센트 컬러 6종: coral/blue/sage/purple/yellow/black
- [ ] 폰트: 깔끔(시스템)/스케치(손글씨)

---

## Phase 8: 에러 핸들링 + 엣지케이스

> 와이어프레임 ⑧ 에 해당.

- [ ] ED_01: 오프라인 배너 (재시도 버튼)
- [ ] ED_02: 파트너 떠남 (30일 보관 안내 + 백업/새연결)
- [ ] ED_03: 초대코드 만료 (새코드 받기/내가 만들기)
- [ ] ED_04: 저장공간 부족 (프로그레스 바 + 정리/프리미엄)
- [ ] ED_05: 업로드 실패 (재시도/이대로저장)
- [ ] ED_06: 빈 타임라인 (EmptyState + 첫추억추가 CTA)
- [ ] ED_07: 솔로 모드 배너 (코드입력/초대하기)
- [ ] ED_08: 파트너 위치 꺼짐 (마지막위치/메시지보내기)
- [ ] ED_09: 앱 업데이트 (신규기능 목록 + 업데이트/나중에)
- [ ] ED_10: 서버 점검 (예상종료시간 + 카운트다운)

---

## Phase 9: 위치 공유 (선택)

> 와이어프레임 ⑥. 네이티브 기능 의존도 높아 PWA 한계 고려.

- [ ] LO_01: 위치공유 안내 화면
- [ ] LO_02: OS 권한 다이얼로그
- [ ] LO_03: 실시간 위치 맵 (두 핀 + 거리 + 경로)
- [ ] LO_04: 가는 중 (ETA + 프로그레스)
- [ ] LO_05: 도착 알림 설정 (500m전/도착시/5분후)
- [ ] LO_06: 도착 푸시
- [ ] LO_07: 같은 장소 발견 (추억 만들기 CTA)
- [ ] LO_08: 일시 정지 옵션

---

## Phase 10: 마이크로 인터랙션 + 폴리시

> 와이어프레임 ⑨. 전체 UX 품질 향상.

- [ ] MI_01: 버튼 프레스 피드백 (scale + bounce)
- [ ] MI_02: 당겨서 새로고침
- [ ] MI_03: 하트 버스트 (5~7개 파티클)
- [ ] MI_04: 핀 드롭 애니메이션 (400ms cubic-bezier)
- [ ] MI_05: 지역 색칠 잉크 효과 (radial gradient)
- [ ] MI_06: D-day 숫자 카운트 (초단위 플립)
- [ ] MI_07: 탭 전환 인디케이터 (슬라이딩 필)
- [ ] MI_08: 파트너 실시간 표시 (온라인 dot + 타이핑)

---

## 데이터 모델 변경 필요

### Firestore Collections 추가/수정

```
memories/{id}
  coupleId, authorId, title, diary, photos[], tags[],
  mood, weather, privacy, location{name, lat, lng, region, country},
  date, createdAt, reactions{}, commentCount

comments/{memoryId}/items/{id}
  authorId, text, photo?, createdAt

reactions/{memoryId}/items/{userId}
  type (heart/emoji), emoji, createdAt

notifications/{userId}/items/{id}
  type, title, body, read, data{}, createdAt

anniversaries/{coupleId}/items/{id}
  title, date, type, wishlist[]

letters/{coupleId}/items/{id}
  authorId, recipientId, content, attachments[],
  scheduledAt, deliveredAt, read

wishlists/{coupleId}/items/{id}
  authorId, title, price?, url?, purchased

chat/{coupleId}/messages/{id}
  authorId, text, photo?, reaction?, createdAt
```

### User Profile 확장
```
users/{uid}
  displayName, avatar, birthday, gender, bio, interests[],
  notificationSettings{}, themeSettings{font, accentColor}
```

### Couples 확장
```
couples/{id}
  users[], createdAt, coupleName, coupleEmoji, couplePhoto,
  firstMetDate, backgroundMusic
```

---

## 우선순위 근거

1. **Phase 2 (추억 추가)** — 앱의 핵심 루프. 이게 없으면 앱 의미 없음
2. **Phase 3 (온보딩)** — 첫인상. 기존 코드 있어서 확장 용이
3. **Phase 4 (지도상세+타임라인)** — 저장된 추억을 보는 경험
4. **Phase 5 (파트너 상호작용)** — 커플 앱 정체성. 감성 핵심
5. **Phase 6 (기념일)** — 리텐션 드라이버
6. **Phase 7 (설정)** — 폴리시
7. **Phase 8 (에러)** — 프로덕션 품질
8. **Phase 9 (위치)** — PWA 한계로 후순위
9. **Phase 10 (마이크로)** — 마지막 터치

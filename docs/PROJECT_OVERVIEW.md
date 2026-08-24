# 커플 여행 기록 웹 애플리케이션

## 프로젝트 개요

커플이 함께 여행을 기록하고 공유할 수 있는 웹 앱이에요.

## 기술 스택

- **Framework**: Next.js 14 (App Router)
- **스타일링**: Tailwind CSS (couple Design System v3)
- **언어**: TypeScript
- **패키지 매니저**: npm

## 주요 기능

### 1. 인증

- 로그인 페이지 (지금은 API 연동 없이 만들었어요)
- 로그인 버튼 클릭하면 메인 페이지로 이동해요

### 2. 메인 네비게이션

하단 탭 네비게이션 (3개 탭):

- **오늘의 여행**: 오늘 날짜 기준 여행 기록
- **나의 여행**: 지도 기반 여행 기록 관리
- **My**: 프로필 및 설정

### 3. 나의 여행 기능

- 지도 선택 인터페이스
  - 대한민국 전체 지도
  - 전국 시도 (광역 단위)
  - 전국 시도 (상세)
  - 서울 지도
  - 미국 지도
  - 세계 지도
  - 일본 지도
- 지역별 클릭 가능한 버튼 형태
- 지역 클릭 시 상세 기능:
  - 사진 업로드
  - 글 작성
  - 캘린더 연동

## 디렉토리 구조

```
couple-app/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   ├── (main)/
│   │   │   ├── today/
│   │   │   ├── travel/
│   │   │   └── profile/
│   │   └── globals.css
│   ├── components/
│   │   ├── layout/
│   │   │   └── BottomNav.tsx
│   │   └── maps/
│   └── lib/
├── public/
├── docs/
└── package.json
```

## 컴포넌트 구조

### Layout Components

- `BottomNav`: 하단 탭 네비게이션

### Map Components

- `MapSelector`: 지도 선택 UI
- `KoreaMap`: 대한민국 지도 컴포넌트
- `WorldMap`: 세계 지도 컴포넌트
- `MapDetail`: 지역 상세 정보 입력

### Travel Components

- `TravelCard`: 여행 기록 카드
- `PhotoUploader`: 사진 업로드
- `TravelCalendar`: 캘린더 뷰

## 스타일 가이드

couple Design System v3를 기반으로 한 일관된 디자인:

- 색상: couple-blue, couple-gray 계열
- 타이포그래피: couple-title, couple-text 클래스
- 그라디언트: couple-badge-gradient

## 개발 로드맵

- [x] 프로젝트 초기 설정
- [x] 문서화
- [ ] global.css 설정
- [ ] 로그인 페이지
- [ ] 하단 네비게이션
- [ ] 오늘의 여행 페이지
- [ ] 나의 여행 페이지 (지도)
- [ ] My 페이지
- [ ] 지도 상호작용
- [ ] 사진 업로드 기능
- [ ] 캘린더 기능

## 설치 및 실행

```bash
npm install
npm run dev
```

## 라이브러리

### 지도 관련

- react-simple-maps: 인터랙티브 SVG 지도
- @svgr/webpack: SVG 컴포넌트 변환

### UI/UX

- framer-motion: 애니메이션
- react-calendar: 캘린더 컴포넌트
- react-dropzone: 파일 업로드

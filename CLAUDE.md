# Couple App

커플 여행 지도 앱 — 맛집, 카페, 데이트 장소를 기록하고 공유하는 PWA.

## Stack
- React 19 + Vite + TypeScript
- Tailwind CSS 4 (global.css @theme tokens)
- Firebase (Auth, Firestore, Storage)
- Kakao Maps SDK (react-kakao-maps-sdk)
- framer-motion (animations)

## Design System

### Theme Presets
- 6 palettes: coral (default), sage, blue, purple, yellow, black
- 3 modes: light, dark, system
- 2 font presets: clean (Pretendard), sketch (Gaegu handwriting)
- Theme context: `src/contexts/ThemeContext.tsx` — `useTheme()`
- CSS tokens: `--app-font`, `--app-radius`, `--app-stroke`, `--app-shadow`, `--app-card`, `--app-line`, `--app-line-soft`
- See `.claude/rules/design-system.md` for full token table

### Typography — use shared components
| Component | Size | Weight | Use for |
|-----------|------|--------|---------|
| `<H1>` | 28px | 700 | Page hero titles |
| `<H2>` | 21px | 600 | Section headers |
| `<H3>` | 17px | 600 | Card titles, list headers |
| `<Body>` | 15px | 400 | Body text |
| `<Meta>` | 13px | 400 | Secondary info, timestamps |
| `<Tiny>` | 11px | 400 | Labels, uppercase tags |
| `<Emphasis>` | inherit | 700 | Accent-colored emphasis |

Import from `@/components/ui/typography`. All accept `style` + `className`.

### Glass Effects — CSS utilities (preset-aware)
- `glass` — card with `--app-radius` + `--app-shadow`
- `glass-pill` — pill shape (r:9999px)
- `glass-card` — card shape (`--app-radius-lg`) + `--app-line-soft` border
- `glass-bar` — header/footer bar

### Shared Components — MUST use these
| Component | Import | Use for |
|-----------|--------|---------|
| `Pill` | `@/components/ui/pill` | Filter tags (variant: primary/secondary) |
| `ListRow` | `@/components/ui/list-row` | iOS-style menu rows (emoji + title + detail + chevron) |
| `GlassList` | `@/components/ui/glass-list` | Grouped list in glass card (wraps ListRow) |
| `StatCard` | `@/components/ui/stat-card` | Number + label stat display |
| `ProfileCard` | `@/components/ui/profile-card` | User profile card (avatar + name) |
| `EmptyState` | `@/components/ui/empty-state` | Empty states (actionLabel + onAction) |
| `PressButton` | `@/components/micro/PressButton` | Tactile button press feedback |

### Layout Rules
- App max-width: **430px** centered (mobile PWA)
- All `fixed` elements: `left-1/2 -translate-x-1/2 w-full max-w-[430px]`
- Main content: `pb-20` (BottomNav + FAB space)
- BottomNav always visible on all authenticated pages

### Rules
- NEVER use raw text classes — use Typography components
- NEVER inline glass styles — use glass CSS utilities
- NEVER hardcode colors — use CSS variables (`--accent-*`, `--app-*`)
- NEVER use `border-couple-gray-*` for dividers — use `var(--app-line-soft)`
- ALL buttons: `rounded-full` (pill shape)
- ALL cards: `glass-card` utility
- ALL lists: `GlassList` + `ListRow`
- Empty states: `EmptyState` with icon + title + description + CTA

## File Structure
```
src/
  components/
    ui/          — shared UI: typography, pill, list-row, glass-list, stat-card, profile-card, empty-state
    maps/        — KoreaGeoMap, SeoulGeoMap, KakaoMapView
    layout/      — MainLayout, BottomNav
    shared/      — AddSheet, OfflineBanner, SoloModeBanner, ErrorModal
    micro/       — PinDrop, RegionFill, DDayCounter, PartnerSync, PressButton, TabIndicator
  contexts/      — ThemeContext (palette/mode/font), AuthContext
  services/      — Firebase API: firebase, places, couple, memories, comments, reactions,
                   notifications, anniversaries, letters, chat, wishlist, upload, user-profile
  lib/           — pure utils: animations, countries, regions, toast, utils
  pages/         — Today, Travel, Profile, Calendar, Timeline, Compose, Chat, etc.
  pages/add/     — CountrySelect, RegionSelect, PlaceSearchPage, PinForm
  store/         — use-auth-store (zustand)
  types/         — place, kakao
  styles/        — global.css (design tokens + glass utilities), font.css
```

## Env Variables
```
VITE_KAKAO_APP_KEY=      # Kakao Maps JavaScript key
VITE_KAKAO_REST_API_KEY= # Kakao REST API key
VITE_FIREBASE_*=         # Firebase config (optional for now)
```

## Skill routing

When the user's request matches an available skill, invoke it via the Skill tool. When in doubt, invoke the skill.

Key routing rules:
- Product ideas/brainstorming → invoke /office-hours
- Strategy/scope → invoke /plan-ceo-review
- Architecture → invoke /plan-eng-review
- Design system/plan review → invoke /design-consultation or /plan-design-review
- Full review pipeline → invoke /autoplan
- Bugs/errors → invoke /investigate
- QA/testing site behavior → invoke /qa or /qa-only
- Code review/diff check → invoke /review
- Visual polish → invoke /design-review
- Ship/deploy/PR → invoke /ship or /land-and-deploy
- Save progress → invoke /context-save
- Resume context → invoke /context-restore

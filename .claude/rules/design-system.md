# Design System Rules

## Design Presets (Clean / Sketch)

The app supports two visual presets controlled by `data-font` attribute on `<html>`:

| Token | Clean | Sketch |
|-------|-------|--------|
| `--app-font` | Pretendard (system) | Gaegu (handwriting) |
| `--app-radius` | 14px | 6px |
| `--app-radius-lg` | 20px | 10px |
| `--app-stroke` | 1px | 1.6px |
| `--app-shadow` | soft drop shadow | 3px 3px hard shadow |
| `--app-bg` | #f5f5f4 | #fbf8f1 (cream) |
| `--app-card` | #ffffff | #fffdf6 (warm white) |
| `--app-line` | #e7e5e4 | #2a241d (dark line) |
| `--app-line-soft` | #f1f0ee | rgba(42,36,29,0.25) |
| `--app-btn-ghost-border` | solid | dashed |

Access via `useTheme().font` — values: `"clean"` | `"sketch"`

## Component Usage (mandatory)

### Typography
- NEVER use raw Tailwind text classes for headings or body text
- ALWAYS import from `@/components/ui/typography`: H1, H2, H3, Body, Meta, Tiny, Emphasis
- All typography components accept `style` and `className` props

### Cards & Lists
- ALWAYS use `glass-card` CSS utility for card containers — it uses `--app-*` tokens
- Use `GlassList` + `ListRow` for iOS-style grouped lists (menus, settings, place lists)
- Use `StatCard` for number + label stat displays
- Use `ProfileCard` for user/couple profile cards
- Use `EmptyState` for any empty/zero-data state (accepts `actionLabel` + `onAction`)

### ListRow API
```tsx
<ListRow
  emoji="👤"        // or icon={<Component />}
  title="프로필 수정"
  detail="서브텍스트"  // optional, right side
  chevron={true}     // default true, shows ›
  isLast={false}     // hides bottom border on last item
  destructive={false} // red text for danger actions
  onClick={() => {}}
/>
```

### Buttons
- ALL buttons must be `rounded-full` (pill shape)
- Primary: `style={{ background: "rgb(var(--accent-070))" }}` + white text
- Ghost: `glass-pill` + text color
- Use `PressButton` from `@/components/micro/PressButton` for tactile feedback

### Pills/Tags
- Use `Pill` component — supports `variant="primary"` | `variant="secondary"`

### Glass Effects
- Use CSS utilities: `glass`, `glass-pill`, `glass-card`, `glass-bar`
- These automatically adapt to clean/sketch preset via `--app-*` tokens
- NEVER inline border/shadow styles — use the utilities

### Theme
- Access via `useTheme()` from `@/contexts/ThemeContext`
- Available: `palette`, `mode`, `modePreference`, `font`, `setPalette`, `setModePreference`, `setFont`
- 6 palettes: coral, sage, blue, purple, yellow, black
- 3 modes: light, dark, system
- 2 fonts: clean, sketch
- NEVER hardcode colors — use CSS variables

### Layout
- App max-width: 430px (mobile PWA frame), centered on desktop
- All `fixed` elements MUST use `left-1/2 -translate-x-1/2 w-full max-w-[430px]`
- Bottom padding: `pb-20` on main content (space for BottomNav + FAB)

### Bottom Navigation
- 5 tabs: 홈, 지도, +, 타임라인, MY
- Center tab (+) floats above bar as FAB
- Active tab uses accent color via `--accent-070`
- BottomNav always visible on all authenticated pages (all routes inside MainLayout)

### Borders & Dividers
- Card borders: `var(--app-line-soft)` (light, subtle)
- List row dividers: `var(--app-line-soft)`
- Input focus borders: `var(--accent-070)`
- NEVER use `border-couple-gray-020` directly — use `glass-card` or `var(--app-line-soft)`

# LOGOS Toss Mini App - Design System

## Color System (3 Colors Only)

| Token | Value | Usage |
|-------|-------|-------|
| Brand | `#6B5CE7` | CTA buttons, active states, links, brand accents |
| Black | `#000000` | Primary text, user message bubbles, dark cards |
| White | `#FFFFFF` | Backgrounds, text on dark surfaces |

### Opacity Scale (Black only)
- `black/60` — Secondary text
- `black/40` — Tertiary text, descriptions
- `black/30` — Labels, placeholders, hints
- `black/20` — Dividers, subtle separators
- `black/15` — Inactive borders (radio, checkbox)
- `black/10` — Active card rings
- `black/6` — Border default (`--color-border`)

### Surfaces
- `--color-surface`: `#FFFFFF`
- `--color-surface-secondary`: `#F7F7F7`

### CSS Variables
```css
--color-brand: #6B5CE7;
--color-foreground: #000000;
--color-background: #FFFFFF;
--color-surface: #FFFFFF;
--color-surface-secondary: #F7F7F7;
--color-border: rgba(0, 0, 0, 0.06);
```

## Typography

- Font: Pretendard Variable (CDN)
- Letter spacing: `-0.03em` (global)
- Labels/Hints: `text-[11px] font-medium uppercase tracking-wider`
- Body: `text-[13px]` or `text-[14px]`
- Titles: `text-[15px]` or `text-[16px] font-bold`
- Hero: `text-[24px] font-bold tracking-tight`

## Spacing

- Page padding: `px-5`
- Section gaps: `mb-6` or `mb-8`
- Card padding: `p-4` or `p-5`
- List item gaps: `space-y-2`
- Element gaps: `gap-2.5` or `gap-3`

## Border Radius

- Cards: `rounded-xl` (12px)
- Buttons: `rounded-lg` (8px)
- Inputs: `rounded-lg` (8px)
- Small elements: `rounded-lg` (8px)
- Avatars/Icons: `rounded-full` or `rounded-lg`
- Tags: `rounded-full`

## Components

### Header
- Height: `h-[52px]`
- Border bottom: `border-b border-[var(--color-border)]`
- Background: `bg-white` (solid, no blur)
- Left: Menu button (hamburger) + Logo + "LOGOS" text
- Right: Credit badge (border pill)

### Input Bar
- Background: `bg-[var(--color-surface-secondary)]`
- Border radius: `rounded-lg`
- Height: `py-2.5`
- Placeholder: `text-black/30`
- Focus: `ring-1 ring-[var(--color-brand)]`

### Send Button
- Size: `w-10 h-10`
- Background: `bg-[var(--color-brand)]`
- Border radius: `rounded-lg`
- Icon: white arrow

### CTA Button
- Height: `h-[48px]`
- Background: `bg-[var(--color-brand)]`
- Text: `text-white text-[15px] font-bold`
- Border radius: `rounded-lg`
- Disabled: `opacity-40`

### Cards
- Background: `bg-white`
- Border: `border border-[var(--color-border)]`
- Border radius: `rounded-xl`
- No shadows
- Selected state: `bg-[var(--color-surface-secondary)] ring-1 ring-black/10`

### Radio/Checkbox
- Size: `w-5 h-5`
- Border: `border-[1.5px] border-black/15`
- Active: `border-[var(--color-brand)] bg-[var(--color-brand)]`
- Check icon: white SVG

### Message Bubbles
- User: `bg-black text-white rounded-[16px_16px_2px_16px]`
- AI: `bg-[var(--color-surface-secondary)] rounded-[2px_16px_16px_16px]`

### Sidebar
- Width: `w-[280px]`
- Background: `bg-white`
- Border right: `border-r border-[var(--color-border)]`
- Overlay: `bg-black/20`

### Tags/Chips
- Border: `border border-[var(--color-border)]`
- Text: `text-[11px] font-medium text-black/30`
- Padding: `px-2.5 py-1`
- Border radius: `rounded-full`

## Icons

- All icons are **monochrome black** with opacity for inactive states
- No colored platform icons (YouTube, Instagram use black fill/stroke)
- Icon sizes: 14px (small), 16-18px (medium), 20px (large)
- Stroke width: `1.5` (default)

## Animations

- Fade in up: `0.35s cubic-bezier(0.33, 1, 0.68, 1)`
- Press effect: `scale(0.97) opacity(0.7)` on `:active`
- Transitions: `0.12s` duration
- No floating animations, no gradient animations

## Rules

1. **NO gradients** — anywhere
2. **NO colored icons** — all monochrome
3. **NO shadows** — use borders only
4. **NO extra colors** — only brand, black, white with opacity
5. **NO rounded-2xl** — max is `rounded-xl`
6. Labels use `uppercase tracking-wider` style
7. Prefer `border` over `bg-*` for card containers
8. Use `black/XX` opacity for all gray tones

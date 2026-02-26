# Finary Prototype — Session State

## Project
Finary Design Manager case study — hi-fi interactive prototype.
Stack: Next.js 16 + Tailwind v4 (`@theme inline` in CSS, NOT tailwind.config) + Framer Motion + Inter font.

## Current State (2026-02-25)

### Completed
- Visual references gathered (30 iOS + 37 web screenshots in `/references/`)
- Next.js project initialized at `/Users/olivierguerin/Projects/Finary/prototype/`
- Design tokens written in `globals.css` (warm grays confirmed: `#8E8E93`, `#7A7A80`)
- Phone frame: 393×852px, rounded-[44px], ambient blue glow at top
- StatusBar (iOS 15 Pro style, pt-[14px])
- TopBar: profile icon (outline person with bottom line) in 40×40 translucent circle, clock icon with gold notification dot + eye icon at white/50, gap-2 between right icons
- Screen title "Investir": 22px semibold, `text-white/75`, part of scrollable content (not nav bar)
- InvestScreen content: objectives nudge, "Pour vous" AI picks (3 ETFs with sparklines), "Tendances Finary" (Apple/LVMH/NVIDIA), "Marchés aujourd'hui" (3 indices), category chips, escape hatch CTA
- BottomTabBar: 5 tabs (Synthèse, Patrimoine, Budget, Analyses, Investir), 18px icons, warm near-black bg (#0C0C0E), active=brand-gold, inactive=text-tertiary

### In Progress — TWO BUGS TO FIX FIRST
1. **Scroll bug (FIXED in page.tsx, NEEDS InvestScreen.tsx update)**:
   - `page.tsx` already updated: phone-frame now uses `flex flex-col`, content wrapper has `flex-1 min-h-0`, top chrome has `shrink-0`
   - `InvestScreen.tsx`: replaced `style={{ height: "calc(100% - 100px)" }}` with `h-full` class (edit succeeded)
   - `BottomTabBar.tsx`: STILL NEEDS edit — change from `absolute bottom-0 left-0 right-0` to `relative shrink-0` (edit failed due to "file not read" error)

2. **Bottom tab bar too tall**:
   - Current: `pt-3 pb-9` — too much vertical padding vs real Finary (see screenshot reference)
   - Target: reduce to approximately `pt-2.5 pb-6` or similar, compare with screenshot where iOS home indicator sits just below the labels
   - Reference screenshot shows compact bar: icon → small gap → label → home indicator

### Pending Refinements for Invest Tab
- Review all content sections for visual fidelity (card styling, spacing, typography)
- Compare each section against Finary screenshots
- User hasn't reviewed content sections yet (objectives card, Pour vous, Tendances, etc.)

### Remaining Screens to Build
- Dashboard / Synthèse
- Asset Detail
- Order flow
- Post-Trade celebration
- Objectives Setup
- Order Review

### Design Decisions Log
- Warm grays everywhere (not cool blue-grays) — confirmed by user
- Icons: 40×40 touch targets, stroke-width 1.3-1.4, consistent style family
- Screen titles: scrollable, 22px semibold, slightly dimmed white (75%)
- Finary uses gold accent sparingly, pure black bg, generous whitespace, flat cards
- Gradient (blue→gold) is for text/accents only, NOT card backgrounds
- SF Pro → Inter font substitution for web

### Dev Server
- Config in `.claude/launch.json` (name: "dev", port: 3000)
- Run: `npm run dev` from project root

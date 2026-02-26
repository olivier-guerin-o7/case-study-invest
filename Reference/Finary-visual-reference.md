# Finary — Visual Reference & Design Tokens

> **Created**: 2026-02-25
> **Updated**: 2026-02-25 — V3 with iOS app (30 screenshots) + web marketing screenshots (37 files, AVIF+JPG)
> **Purpose**: Design reference for building the prototype. Extracted from finary.com, product updates, community feedback, Dribbble, actual iOS app, and marketing materials.
> **Status**: V3 — fully confirmed ✅

---

## 1. Color Palette

### Confirmed from Website Source Code + App Screenshots

| Token | Hex | Usage | Source |
|---|---|---|---|
| **Primary Blue** | `#5682F2` | Gradient start, interactive elements, links | Website CSS |
| **Golden Accent** | `#F9D09F` / `#FDBC71` / `#F1C086` | Gradient end, CTAs, highlights, selected states | Website + App |
| **CTA Orange (fill)** | Warm gold ~`#F1C086` | Primary CTA buttons ("Commencer", "Suivant", "Compléter mon patrimoine") | App ✅ |
| **CTA Orange (hover)** | `#EDB068` | Button hover state | Website CSS |
| **Dark BG (primary)** | `#000000` / near-black | Primary background throughout the app | App ✅ |
| **Dark BG (surface)** | ~`#1A1A2E` / `#1C1C2E` | Card surfaces, elevated areas (budget cards, connected accounts) | App ✅ |
| **Dark BG (elevated)** | ~`#2A2A3E` | Secondary button fills, input surfaces, modal backgrounds | App ✅ |
| **Text Primary** | `#FFFFFF` / near-white | Headings, primary values, names | App ✅ |
| **Text Secondary** | ~`#959BA4` / light gray | Descriptions, labels, inactive text | App ✅ |
| **Text Muted** | ~`#6B7280` | Tertiary text, placeholders | App ✅ |
| **Text Gold** | ~`#F1C086` | Selected states, active tab labels, accent text, empty state messages | App ✅ |
| **Border Gold** | ~`#F1C086` | Selected card borders (onboarding), outlined buttons | App ✅ |
| **Border Subtle** | ~`#2A2A3E` / `#333` | Card borders, dividers, inactive states | App ✅ |
| **Green (verified)** | ~`#4ADE80` range | "VÉRIFIÉ" badge, gain indicators | App ✅ |
| **Blue (info/link)** | ~`#5682F2` | Active tab underline (Family screen), info icons | App ✅ |

### Primary Gradient
```css
/* The signature Finary gradient — used everywhere */
linear-gradient(116deg, #5682F2 -36.05%, #F9D09F 100.05%)
/* Alternative angles */
linear-gradient(167deg, #5682F2, #FDBC71)
```

### Secondary Gradients
```css
/* Purple variant — seen in budget promo cards, Invest tab */
linear-gradient(167deg, #7A2D8D, #DCBFDE)
/* Blue-pink */
linear-gradient(167deg, #6897FE, #DCBFDE)
/* Dark navy gradient — background ambient glow (top-center of many screens) */
radial-gradient(ellipse at top center, rgba(86, 130, 242, 0.15), transparent 60%)
```

### Status Colors (Fully Confirmed ✅)
| Token | Hex (approximate) | Usage | Source |
|---|---|---|---|
| **Gain / Positive** | ~`#22C55E` / `#4ADE80` (bright green) | "+7 815 €", "+14,36%", "+8,38%", "+3 186€", "+21.24%", sparkline charts | Web screenshots + App ✅ |
| **Loss / Negative** | ~`#EF4444` (red) | "-123%", red bars in bar chart, "-1 001 €" (Compte titre) | Web dashboard screenshot ✅ |
| **Expenses (negative)** | ~`#F1C086` (gold) | "-2 604€" expenses shown in gold, not red (budget view) | App budget screenshot ✅ |
| **Warning** | Amber (same gold range) | Attention needed | Estimated |
| **Info** | ~`#5682F2` (blue) | Active tabs, info badges | App ✅ |
| **Green pill badge** | Green bg + white text | "+8,38%" in crypto variation cards | Crypto buy screen ✅ |

> ℹ️ **Key insight**: Gains are ALWAYS green. Losses in portfolio are red. But in the Budget view, expenses are shown in gold/amber — NOT red. This is a deliberate design choice: red = investment loss (bad), gold = money spent (neutral/expected).

---

## 2. Typography

### Confirmed from App Screenshots

| Font | Weight Range | Usage | Source |
|---|---|---|---|
| **SF Pro** (system) | Regular, Medium, Semibold, Bold | Primary font throughout iOS app | App ✅ |
| **Inter** | 300–700 | Website, potentially web app | Website CSS |
| **Telegraf** | 500 | Display headings on marketing site only | Website CSS |

> ⚠️ **Key finding**: The iOS app uses **SF Pro** (Apple's system font), NOT Inter. For our prototype targeting mobile, we should use **Inter** as a close cross-platform equivalent (both are geometric sans-serifs). This is standard practice — native apps use system fonts, web apps use Inter.

### Typography Scale (from iOS App)

| Element | Approximate Size | Weight | Context |
|---|---|---|---|
| **Onboarding heading** | ~28–32px | Semibold | "Commençons simplement, quel est votre prénom?" |
| **Screen title** | ~20–22px | Semibold | "Mon compte", "Notifications", "Comptes synchronisés" |
| **Section heading** | ~22–24px | Bold | "Mon Finary", "Budget", "Apprendre" |
| **Card title / Name** | ~17–18px | Semibold | "Olivier Guerin", "Finary Invest" |
| **Body text** | ~15–16px | Regular | Descriptions, explanations |
| **Secondary text** | ~13–14px | Regular | Labels, metadata, dates |
| **Caption / Badge** | ~11–12px | Medium/Semibold | "APPAREIL ACTUEL", "VÉRIFIÉ", "BANQUE", "PLUS" |
| **Tab bar labels** | ~10px | Medium | "Synthèse", "Patrimoine", "Budget", "Analyse", "Investir" |
| **Amount (widget)** | ~24–28px | Bold | "€345,478" |
| **Empty state message** | ~22–24px | Medium (gold text) | "Bienvenue Olivier, commencez par ajouter un investissement" |

### Font Rendering
```css
-webkit-font-smoothing: antialiased;
-moz-osx-font-smoothing: grayscale;
```

---

## 3. Component Styles

### Buttons (from App)

| Type | Style | Example |
|---|---|---|
| **Primary CTA** | Full-width pill, warm gold fill (`~#F1C086`), dark text, ~48–52px height, rounded-full | "Commencer", "Suivant", "Compléter mon patrimoine", "S'abonner" |
| **Secondary CTA** | Full-width pill, dark gray fill (`~#2A2A3E`), white text, rounded-full | "Réinitialiser les filtres", "Valider" (disabled state) |
| **Outlined button** | Pill shape, gold border, transparent bg, gold text | "CONNEXION SÉCURISÉE" badge, notification create button |
| **Text link** | No border, gold or muted text, arrow icon | "J'ai déjà un compte", "En savoir plus", "Plus tard" |
| **Small pill** | Compact, ~32px height, rounded-full | "Essayer gratuitement" (in promo cards), filter chips ("Communauté", "Guides", "Vidéos") |
| **Icon button** | Circular, ~44px, dark bg | Action icons ("Voir tout", "Détails", "Créer", "Plus") |

### Cards (from App)

| Type | Style | Example |
|---|---|---|
| **Promo card** | Rounded-xl (~16px), gradient bg (navy/purple), image overlay | "LE MEILLEUR DE PLUS" upsell cards |
| **Selection card** | Rounded-lg (~12px), dark border, gold border when selected | Onboarding survey options |
| **Info card** | Rounded-lg (~12px), slightly elevated bg | Security info ("Aucun identifiant stocké"), referral card |
| **List item** | No border-radius, separated by subtle dividers | Bank list, settings list, community posts |
| **Product card** | Rounded-xl (~16px), dark elevated bg, product image | "Finary Invest", "Finary Crypto" on Invest tab |

### Badges / Tags

| Type | Style |
|---|---|
| **PLUS badge** | Small pill, gradient fill (gold/holographic), "≡ PLUS" text |
| **BANQUE tag** | Small pill, dark fill, white text, right-aligned |
| **Status badge** | Small pill, green text + checkmark ("✓ VÉRIFIÉ"), outlined |
| **Section label** | Uppercase, small caps, gold text ("LE MEILLEUR DE ≡ PLUS") |

### Form Inputs (from App)

| Element | Style |
|---|---|
| **Text input** | Underline style (no border, just bottom gold line when active) |
| **Search field** | Full-width, placeholder text, magnifying glass icon right |
| **PIN input** | 4 circles (gold outline, empty), custom numeric keypad |
| **Toggle switch** | iOS-standard, gold tint when on, gray when off |
| **Segmented control** | Tabs with underline indicator (gold gradient for active) |

### Navigation Patterns

| Pattern | Style |
|---|---|
| **Back button** | Left arrow (←), top-left, no text label |
| **Close button** | X icon, top-right |
| **Top-right action** | Text links: "Plus tard", "Passer", "Besoin d'aide ⓘ" |
| **Date navigation** | Left/right arrows + date range dropdown in center |

---

## 4. Layout & Navigation (Confirmed from App)

### Bottom Tab Bar ✅

| Position | Icon | Label | Notes |
|---|---|---|---|
| 1 (left) | Grid (4 squares) | **Synthèse** | Dashboard/Home |
| 2 | Building columns | **Patrimoine** | Portfolio |
| 3 (center) | Notebook/ledger | **Budget** | Budget tracking |
| 4 | Circle/compass | **Analyse** | Analysis tools |
| 5 (right) | Temple/building | **Investir** | Investment products — **THIS IS OUR TAB** |

**Tab bar styling:**
- Background: near-black, subtle top border/separator
- Active state: gold icon + gold label text
- Inactive state: gray icon + gray label text
- Icon size: ~24px
- Label size: ~10px
- Height: standard iOS (~49px + safe area)
- No center FAB or special treatment — all tabs equal

### Top Bar
- **Left**: Avatar circle (initials "OG" on dark gray circle, or person icon outline)
- **Right**: "≡ PLUS" gradient badge (upsell)
- **No title** on main tabs — the content starts directly below
- **Detail screens**: "← Title" pattern (back arrow left, centered title)

### Screen Structure
- Pure black background
- Content starts below status bar
- Generous vertical spacing between sections
- Bottom safe area respected
- Modal/sheet patterns: handle bar at top (gray dash), X close top-right

---

## 5. Icon Style (Confirmed from App)

### Current Icon System
- **Abstract / 3D rendered objects** for decorative illustrations:
  - Crystal/gem cluster (welcome/empty state — screenshot 12)
  - 3D temple building (synchronized accounts — screenshot 15)
  - 3D padlock/shield (security — screenshot 24)
  - 3D magnifying glass (search/analysis — budget promo cards)
  - 3D golden coin (Finary Crypto — screenshot 30)
- **Line/outline icons** for functional UI:
  - Tab bar icons (grid, columns, notebook, compass, temple)
  - Action icons (arrow, X, +, chevron, lock, shield, person, bell)
  - Settings icons (person, sync, Finary logo, people, bell)
- **Filled circle icons** for list items:
  - Bank logos (actual brand logos — Crédit Agricole, BoursoBank, etc.)
  - User avatars (colored circle + initial letter — community posts)
  - Add action (gold filled circle with + icon)

### Icon Notes for Prototype
- Use **outline style** for all functional/navigation icons
- Use abstract decorative illustrations sparingly (empty states only)
- Gold accent color for interactive/add icons
- Bank/institution icons are full-color brand logos

---

## 6. Empty States & Onboarding Patterns (from Free Account)

### Empty State Pattern
1. **Centered 3D illustration** (decorative, abstract)
2. **Gold gradient text** — friendly message ("Bienvenue Olivier, commencez par ajouter un investissement")
3. **Subtitle** in muted gray — brief explanation
4. **Primary CTA** — full-width gold pill button

### Onboarding Flow
1. Splash → Survey (what interests you?) → Name input → Signup → Account created → PIN → Notifications → Widget → Connect bank → Paywall
2. Survey uses **selection cards** with gold border on select
3. Name input uses **underline field** style
4. Success states: gold-outlined circle with checkmark icon
5. PIN: custom 4-digit numeric pad with gold circle indicators

### Invest Tab (Screenshot 30)
- Header: "Découvrez nos produits Finary Invest"
- Product cards: "Finary Invest" (stocks), "Finary Crypto"
- Each card has: title, description, feature bullets (with checkmarks), two CTAs ("C'est parti" primary, "En savoir plus" secondary)
- Finary Invest card uses purple gradient accent
- **This is the tab we're redesigning** — currently a product showcase for non-investors

---

## 7. Data Visualization (from App)

### Chart Types Observed
- **Donut/ring chart**: Budget "Répartition" view (screenshot 28) — dark stroke on dark bg, minimal
- **Sparkline**: Widget preview small line chart (screenshot 09/19) — thin, single color
- **Segmented bar**: Budget "Entrées / Sorties / Récurrents" — horizontal segments with gold accent

### Dataviz Style
- **Minimal**: thin strokes, no heavy fills
- **Dark-on-dark**: chart elements are subtle, not screaming
- **Gold accent** for the primary/active data series
- **Gray** for inactive/empty states
- No gridlines visible in mobile charts
- Numbers are the hero — charts are supporting visuals

---

## 8. Design DNA Summary (Updated with App Findings)

### What Makes It "Finary" — Confirmed ✅
1. **Gold accent color** — THE dominant brand color in the app (not blue-to-gold gradient in-app, just gold). Used for CTAs, selected states, accent text, badges, icons, active tabs
2. **Pure black background** — the app IS essentially pure black (`#000000`), not navy. Navy is used only on marketing site and subtle ambient glows
3. **SF Pro / Inter font** — system font in-app, clean and readable
4. **Full-width pill buttons** — rounded CTAs with warm gold fill are the signature interaction pattern
5. **3D abstract illustrations** — new design direction with rendered crystal/gem/temple objects for empty states
6. **Data-first** — numbers are large and prominent, UI is minimal around them
7. **Gold text for empty states** — friendly, warm messaging in gold gradient text
8. **Minimal chrome** — almost no visual decoration, content-first
9. **PLUS upsell** — gradient holographic badge, present on many screens as top-right pill

### Key Design Differences: Marketing Site vs iOS App
| Aspect | Marketing Site | iOS App |
|---|---|---|
| Background | Navy/dark blue tones | Pure black |
| Gradient | Blue-to-gold used extensively | Gold dominant, blue minimal |
| Cards | Glassmorphic, radial gradients | Flat, subtle elevation only |
| Typography | Inter + Telegraf | SF Pro (system) |
| Illustrations | 2D/vector | 3D rendered abstract objects |
| Overall feel | Rich, layered, premium | Clean, flat, utilitarian |

### What We Should Capture for Prototype
- **Gold as the primary accent** — this is the in-app reality (not the blue-gold gradient which is more website)
- **Pure black backgrounds** with very subtle elevation for surfaces
- **Full-width pill CTAs** in warm gold
- **Inter** as our font (closest web equivalent to SF Pro)
- **Clean, flat cards** with subtle borders (not glassmorphic)
- **Generous spacing** — the app breathes
- The gradient CAN appear for special moments (success, highlights) but the day-to-day is gold-on-black

---

## 9. Proposed Design Tokens (for Tailwind) — UPDATED

```js
// tailwind.config.js — confirmed with app screenshots
colors: {
  // Backgrounds
  bg: {
    primary: '#000000',      // Pure black — confirmed from app ✅
    secondary: '#0A0A0F',    // Near-black with slight warmth
    surface: '#1A1A2E',      // Card/surface backgrounds
    elevated: '#2A2A3E',     // Elevated surfaces, secondary buttons
    input: '#1C1C2E',        // Input field backgrounds
  },
  // Text
  text: {
    primary: '#FFFFFF',      // Main headings, values — confirmed ✅
    secondary: '#EDF0F5',    // Body text on dark
    muted: '#959BA4',        // Secondary labels, descriptions — confirmed ✅
    tertiary: '#6B7280',     // Subtle text, placeholders
  },
  // Brand
  brand: {
    blue: '#5682F2',         // Primary blue (more website than app)
    gold: '#F1C086',         // THE brand color in-app — CTAs, accents ✅
    goldLight: '#FDBC71',    // Lighter gold variant
    goldWarm: '#F9D09F',     // Warmest gold (gradient end)
    goldDark: '#EDB068',     // Hover/pressed state
  },
  // Status
  status: {
    gain: '#4ADE80',         // Positive / gain — confirmed from widget ✅
    loss: '#EF4444',         // Negative / loss — confirmed from web dashboard ✅
    warning: '#FBBF24',      // Attention
    info: '#5682F2',         // Info, active tabs
    verified: '#4ADE80',     // Verified badge
  },
  // Borders
  border: {
    subtle: '#2A2A3E',       // Default card/divider borders
    active: '#F1C086',       // Selected state borders (gold)
    muted: '#333333',        // Barely visible separators
  },
}

fontFamily: {
  sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
  display: ['Inter', 'sans-serif'],  // Using Inter for all (no Telegraf in prototype)
}

fontSize: {
  // Mapped from iOS app observations
  'xs': ['10px', { lineHeight: '14px' }],    // Tab labels
  'sm': ['12px', { lineHeight: '16px' }],    // Badges, captions
  'base': ['14px', { lineHeight: '20px' }],  // Secondary text, metadata
  'md': ['16px', { lineHeight: '24px' }],    // Body text
  'lg': ['18px', { lineHeight: '26px' }],    // Card titles
  'xl': ['20px', { lineHeight: '28px' }],    // Screen titles
  '2xl': ['24px', { lineHeight: '32px' }],   // Section headings, amounts
  '3xl': ['28px', { lineHeight: '36px' }],   // Large amounts, welcome text
  '4xl': ['32px', { lineHeight: '40px' }],   // Hero numbers
}

fontWeight: {
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
}

borderRadius: {
  'card': '12px',        // Standard cards
  'card-lg': '16px',     // Promo cards, product cards
  'button': '9999px',    // Pill shape (full-round)
  'badge': '9999px',     // Tags, badges
  'input': '12px',       // Input fields
  'tag': '9999px',       // Filter chips
}

spacing: {
  // App uses generous spacing
  'screen-x': '20px',    // Horizontal page padding (confirmed)
  'section-y': '32px',   // Vertical space between sections
  'card-inner': '16px',  // Card internal padding
  'list-gap': '12px',    // Gap between list items
}
```

---

## 10. Screenshot Index

| # | Screen | Key Observations |
|---|---|---|
| 01 | Splash/Welcome | Dark bg, Finary logo, gold "Commencer" pill CTA |
| 02 | Onboarding survey (unselected) | Selection cards with gray border, outlined icons |
| 03 | Onboarding survey (selected) | Gold border + gold text on selection, gold "Suivant" CTA |
| 04 | Signup/Login | Social auth buttons (Apple white, Google dark, Email dark) |
| 05 | Account created | Success: gold circle + checkmark, "Votre compte a été créé" |
| 06 | PIN setup | Custom 4-digit keypad, gold circle indicators, lock icon |
| 07 | First name input | Underline text field, gold line, warm heading text |
| 08 | Notifications prompt | Push notification preview, 91% stat, "ANALYSE" tag |
| 09 | Widget promo | iOS widget preview (€345,478, +10%), gold CTA |
| 10 | Connect bank | Bank list with logos, search, security badges |
| 11 | Paywall (PLUS) | Feature comparison, pricing, gold "S'abonner" CTA |
| 12 | **Dashboard (empty)** ⭐ | Bottom tab bar visible, 3D crystal illustration, gold welcome text, "Compléter mon patrimoine" CTA |
| 13 | Profile/Settings | Avatar (OG), referral card, settings list with chevrons |
| 14 | Account details | Form with underline fields, green "VÉRIFIÉ" badge |
| 15 | Synced accounts (empty) | 3D temple illustration, gold empty state text |
| 16 | Paywall v2 | Feature comparison grid, trial offer |
| 17 | Family & Companies | Segmented tabs (blue active underline), user list |
| 18 | Notifications settings | Toggles (gold/gray), section headings, outlined card |
| 19 | Widget promo (variant) | Same widget preview, slightly different layout |
| 20 | App icon selector | App icon thumbnail, "Classique" option, gold radio button |
| 21 | Help/Support (Intercom) | White modal overlay, Intercom chat widget |
| 22 | Chart cleanup | Settings screen, red destructive text, outlined button |
| 23 | Connected devices | Card with device illustration, metadata, badge |
| 24 | Password/PIN change | Bottom sheet, 3D lock/shield illustrations, arrow CTAs |
| 25 | Referral | Promo card, referral code, stats |
| 26 | **Community/Learn** | Filter chips (gold active), post list with avatars, emojis, metadata |
| 27 | **Budget tab** ⭐ | Bottom bar visible (Budget active), date nav, segmented control, action icons, promo card |
| 28 | Budget breakdown | Donut chart (empty), gold empty state text, secondary CTA |
| 29 | Transactions (empty) | Date nav, empty state, promo card |
| 30 | **Invest tab** ⭐ | Bottom bar (Investir active), product cards (Finary Invest, Finary Crypto), CTAs |

---

## 11. Key Patterns from Web/Marketing Screenshots

### Stock & Fund Cards (Stock & Funds screenshot)
- **Card layout**: Dark rounded card, company logo (circular, actual brand logo), company name + ticker
- **Value**: Large white number (e.g., "62 230 €")
- **Gain/loss**: Green text below value ("+7 815 € +14,36%") — percentage in a subtle rounded badge
- **Sparkline**: Small green line chart (right side of card) — thin stroke, no axes, no labels
- **Card stacking**: Full-width cards stacked vertically

### Crypto Buy Screen (Achat Instantané)
- **Bottom sheet** with drag handle
- **"Plus fortes variations (24h)"** — horizontal scroll of gradient cards (pink/purple gradients)
- Each variation card: crypto icon, name, ticker, price, green badge "+X%"
- **"Toutes les cryptos"** — vertical list: circular icon + name/ticker + price + dot indicator
- Pattern maps directly to our "Browse all" escape hatch

### Auto-Pilot / Collections (Auto-Pilote)
- **Bottom sheet** pattern again
- **"Collections Finary"** — horizontal carousel with gradient cards
- Cards have: badge ("DÉBUTANT"), performance stat, title, subtitle, "+ Sélectionner" CTA
- **Curated + Browse** pattern: collections on top, full list below — exactly our Objectives → suggestions model

### Web Dashboard (a0b3f6cf JPG) — THE reference for populated data
- **Top bar**: Finary logo | Dashboard / Portfolio tabs | "Mettre à niveau" upgrade CTA | sync + add icons | Account
- **3 stat cards**: "Patrimoine brut", "Patrimoine net", "Patrimoine financier" — each with value + gain/loss
- **Line chart**: Gold line on dark bg, dot indicators, tooltip showing date + exact value
- **Bar chart**: Green (positive) and red (negative) bars — weekly performance
- **Donut chart**: "Assets distribution" — multi-color segments (orange, blue, pink, teal)

### Web Portfolio (Portfolio 2 FR screenshot) — Asset breakdown
- **Left sidebar**: Finary logo, Dashboard, Portfolio (expanded with sub-items), Comptes bancaires, Crowdlending, Crypto, Fonds euros, Métaux précieux, Immobilier, Livrets, Emprunts, Insights, Communauté
- **Table layout**: Category | Répartition (%) | Value (€) | +/- value (green/red)
- **Account icons**: Colored circles with institution logos
- **Right donut**: Large donut chart with center value ("398 060 € Real Estate • 58%")
- **Green** for gains, **red** for losses — confirmed here: `-1 001 €` shown in red for "Compte titre"

### Budget/Expenses (expenses-fr screenshot) — Populated mobile view
- **Donut chart** with colorful segments (pink, green, blue, gold, orange) — very vibrant
- **Center text**: "Dépenses totales -2 604€"
- **Expense summary bar**: "Dépenses -2 604€" | "Revenus +3 955€" | "Restant +1 349€"
- **Category list**: icon + name + amount + percentage
- **Date swiper**: "Sep. 2023 | **Oct. 2023** | Nov. 2023" — horizontal scroll

### Diversification Analysis
- **Score system**: "Équitable 4/10" with ring progress indicator
- **Horizontal bars**: Percentage + label + colored bar
- **ETF recommendation card**: Fund logo, "MOST POPULAR" badge, full name, ISIN, ranking

### Success State (Onboarding Success - Staking)
- **Blue gradient background** (not black!) — for special moments/celebrations
- **Floating icons**: Scattered related icons (ETH diamonds) in varying sizes/opacity
- **Center element**: Large icon in gold-bordered circle + green checkmark
- **Bold headline**: "Staking de 1 ETH demandé !"
- **Subtitle**: Muted text with next steps

### Finary Life (Dec 2025)
- **Web sidebar visible**: Same nav pattern as Portfolio view
- **Account detail**: Date, large value, green gain + percentage badge
- **Line chart**: Gold/white line on dark bg with subtle grid

---

## 12. What's Still Missing

| # | Item | Status |
|---|---|---|
| 1 | ~~Actual app screenshots~~ | ✅ Done — 30 iOS + 37 web screenshots analyzed |
| 2 | ~~Exact loss/negative color~~ | ✅ Red confirmed from web dashboard: `-1 001 €` in red |
| 3 | ~~Bottom tab bar styling~~ | ✅ Confirmed from screenshots 12, 27, 30 |
| 4 | ~~Card/surface backgrounds in-app~~ | ✅ Confirmed — flat, dark, subtle borders |
| 5 | ~~Font in-app~~ | ✅ SF Pro (system), using Inter as web equivalent |
| 6 | ~~Icon style~~ | ✅ Outline for UI, 3D rendered for decorative |
| 7 | ~~Populated dashboard~~ | ✅ Web dashboard JPG shows full data (line chart, bar chart, donut, stats) |
| 8 | ~~Chart styles with data~~ | ✅ Confirmed: gold line charts, green/red bars, multi-color donuts, sparklines |
| 9 | **ALL ITEMS RESOLVED** | 🎉 Visual reference is complete. Ready to build. |

---

## 13. Reference Sources

- [Finary Homepage CSS](https://finary.com/en) — primary gradient, colors, fonts
- [Finary Wealth Tracking](https://finary.com/en/wealth-tracking) — gradients, slider styles
- [Finary Budget](https://finary.com/en/budget) — color palette, typography
- [Finary Web Redesign](https://finary.com/en/product-updates/the-web-is-getting-a-makeover) — dashboard layout, sidebar, charts, button styles
- [Finary Dec 2025 Update](https://finary.com/en/product-updates/december-2025) — latest UI patterns, budget redesign
- [Community — iOS Redesign Thread](https://community.finary.com/t/nouvelle-apparence-app-ios/5225) — user feedback on visual direction
- [Dribbble — Dark & Light UI](https://dribbble.com/shots/16549733-Finary-Dark-and-Light-UI) — original Pelostudio design
- [Dribbble — Dashboard Web](https://dribbble.com/shots/16549476-Finary-Dashboard-web-app) — early web design
- [Alexis Boyer Portfolio](https://hexagon-cylinder-s9nt.squarespace.com/finary) — Head of Design's Finary work
- **iOS App Screenshots** (30 images in `Reference/Finary-ios-app-screenshots/`) — February 2026 free account

# Finary — Project Constitution

> **Version**: 1.0
> **Created**: 2026-02-25
> **Authors**: Olivier Guerin (OG) + Claude Code (CC)
> **Status**: APPROVED — Ready for execution
> **Source**: Consolidated from Rounds 1-3 of OG initial research + CC deep research

---

## 1. Mission Statement

Build a **high-fidelity, mobile-first, interactive prototype** and **presentation deliverable** for Finary's Design Manager case study. The challenge: design the experience for a user's **first investment** — from opening the app to completing their first trade on Finary's upcoming brokerage account.

This is not hypothetical. Finary is actively building this product after a €25M Series B (Sep 2025, led by PayPal Ventures). Our work could genuinely influence their thinking.

---

## 2. The Assignment (Verbatim)

> Design the experience for a user's **first investment**; from the moment they open the app to completing their first trade.
>
> You are designing for a specific user: someone who is ready to invest, but hasn't taken the leap yet. They're not disengaged; they're hesitant. Your job is to design an experience that earns their trust and gets them to that first trade.

### Required Deliverables
1. **User flow** (1 page): key screens and decision points
2. **High-fidelity designs** (3-5 screens): show your craft
3. **Design rationale** (1 page): choices, trade-offs, connection to company priorities
4. **Team delegation plan** (1 page): 4 designers — Anna, Marc, Sophie, Vijay

### Constraints
- Mobile-first
- Should feel like Finary (without access to their DS)
- KYC is out of scope (already completed)
- Consider trust, clarity, and regulatory requirements

### Bonus
- Where would you use AI to improve this experience?

---

## 3. Persona

### Jane Moreau

| Attribute | Value |
|---|---|
| **Name** | Jane Moreau |
| **Age** | 32 |
| **Profile** | Young professional, digital native, comfortable savings |
| **Finary usage** | Active tracker — syncs bank accounts, follows portfolio, reads insights |
| **Knowledge** | Knows what ETFs and stocks are. Watches Mounir's YouTube. Has done research. |
| **Mindset** | Ready to invest but **hesitant**. Not disengaged — cautious. |
| **Fears** | Making a mistake. Unknown mechanics. Commitment. Losing money. |
| **Needs** | Confidence, clarity, control, reversibility. To feel like SHE made the decision. |

### The Core Insight
Jane doesn't need education. She needs **permission** — the feeling that investing is safe, understandable, and within her control. Every design decision must reduce friction AND build confidence simultaneously.

---

## 4. Design Philosophy

### Guiding Principles

1. **"You can visit the house even if you're not yet the owner."**
   No gates, no wizards, no forced funnels. The app presents itself fully from day 1. Users explore freely. Commitment happens when THEY decide.

2. **The Dashboard IS the onboarding.**
   No intermediate steps, no setup wizards. New users land on a live dashboard with 2-3 contextual onboarding cards mixed with real content. Counter to fintech convention — deliberately opinionated.

3. **AI as atmosphere, not as feature.**
   AI is the quiet guide — subtle, invisible scaffolding. NOT a chatbot. It manifests as:
   - Text that "composes" itself (subtle typing animation on AI driven insights)
   - Personalized suggestions that feel curated, not commanded
   - Data that contextualizes itself ("outperforming 78% of similar funds")
   - Smart defaults that feel like the app "knows" you

4. **"Without Objectives, AI means nothing."**
   (Head of Product's philosophy, from interview.) Objectives provide the context that makes AI useful. Our design demonstrates this by connecting Objectives → AI suggestions → first trade.

5. **Every curated list has an escape hatch.**
   When we present AI-curated suggestions, the last item is always a subtle tertiary link: "Browse all ETFs →". Respects both the guided user and the autonomous user.

6. **Show what you chose NOT to do.**
   The Design Manager superpower: deliberate restraint. Our rationale explicitly documents trade-offs and cuts.

---

## 5. Emotional Arc

Each screen is designed to progressively build confidence:

| Step | Screen | Emotion | User Thought |
|---|---|---|---|
| 1 | Dashboard | Curiosity + gentle FOMO | "Others are investing. Should I?" |
| 2 | Invest tab | Interest + reassurance | "These are curated for ME." |
| 3 | Asset Detail | Understanding + confidence | "I see exactly what I'm buying." |
| 4 | Order Screen | Focus + control | "I choose the amount. I see the fees." |
| 5 | Confirmation | Pride + momentum | "I did it. What's next?" |

---

## 6. User Flow

### Golden Path (Objectives → Trade)
```
Dashboard
  └→ "Set your investment objective" card
      └→ Objectives bottom sheet (Goal → Risk → Amount)
          └→ Dashboard updates with AI suggestions
              └→ Tap suggested ETF
                  └→ Asset Detail screen
                      └→ "Buy" CTA
                          └→ Order Screen (amount, fees, confirm)
                              └→ Order Review (MiFID legal step)
                                  └→ Post-Trade Confirmation (success + next steps)
```

### Alternative Path (Direct Browse)
```
Dashboard (or any screen)
  └→ Tap "Invest" in bottom bar
      └→ Invest screen (browse, search, trending)
          └→ Tap any asset
              └→ Asset Detail → Buy → Order → Review → Confirmation
```

Both paths converge at Asset Detail. Freedom. No gates.

### Post-Trade Loop
After confirmation, the Dashboard reflects the trade:
- Health bar updates (investment portion appears)
- New insight: "Your portfolio is now X% closer to your target allocation"
- This builds confidence for trade #2

---

## 7. Screen Inventory

### Tier 1 — Hi-Fi (Prototype + Figma + Presentation)

| # | Screen | Type | Key Elements |
|---|---|---|---|
| 1 | **Dashboard** | Full screen | Health bar — the compact dataviz (tappable → Objectives), smart feed (insight cards, market updates, AI suggestions) |
| 2 | **Invest** | Full screen (bottom tab) | Objectives nudge (if unset), "For you" AI picks with sparklines, "Trending on Finary" with social proof, "Markets today" indices, categories, browse all (escape hatch) |
| 3 | **Asset Detail** | Push from right | Performance chart, key info, risk level (1-7), fee breakdown, Clarity tooltips on technical terms, social proof, "Buy" CTA |
| 4 | **Order Screen** | Push from right | Pre-filled amount (from Objectives or manual), order type (market), fee transparency, total cost, "Confirm" CTA |
| 5 | **Post-Trade Confirmation** | Full screen | Subtle success animation (checkmark morph + portfolio value pulse), portfolio impact summary, AI reinforcement ("X% closer to goal"), "What's next" suggestions |
| 6 | **Objectives Setup** | Bottom sheet (3 steps) | Step 1: Investment goal (4 options), Step 2: Risk comfort (3 options with visual), Step 3: Starting amount (suggested presets + custom) |
| 7 | **Order Review (Legal)** | Push from right | MiFID II compliance: KID summary, risk classification, cost transparency, terms checkbox. Hi-fi in prototype (no immersion break), but NOT a hero presentation screen. |

### Tier 2 — Wireframe (Figma only)

| # | Screen | Purpose |
|---|---|---|
| 8 | **Desktop Layout** | 3-panel concept (left nav + center list + right detail) showing how mobile architecture maps to desktop. Bonus deliverable. |

### Tier 3 — Out of Scope (Rationale mentions only)

| Item | Notes |
|---|---|
| Clarity full panel | BONUS — promote to Tier 3 if ahead of schedule |
| Watchers management | Mentioned as future capability |
| Dashboard item management (dismiss/pin/watch) | Mentioned in rationale as capability |
| Portfolio tab content | Placeholder in prototype (tappable but shows "coming soon" or Finary-like) |
| Budget tab content | Placeholder in prototype |
| Settings / Profile | Not addressed |

---

## 8. Navigation & Layout

### Bottom Bar (5 tabs)

| Position | Tab | Icon | Status |
|---|---|---|---|
| 1 (left) | **Home** | Dashboard/grid | Designed — hi-fi |
| 2 | **Portfolio** | Chart/pie | Placeholder |
| 3 (center) | **Invest** | Plus or arrow | Designed — hi-fi. **NEW tab** (doesn't exist in current Finary). Center position = first-class action. Serves Priority #1 (AuM). |
| 4 | **Budget** | Wallet | Placeholder |
| 5 (right) | **More** | Menu/dots | Placeholder |

### Top Bar (minimal)
- **Left**: Profile avatar (→ settings, account, Finary One)
- **Center**: Screen title or Finary logo (Dashboard only)
- **Right**: Notifications bell + Search icon

### Spatial Model (Mobile)
- **Bottom drawer** = Knowledge layer (Clarity). Slides up partially from the bottom edge, can be pulled taller or dismissed. The content behind it stays visible (dimmed). Think Apple Maps or Google Maps — the drawer "peeks" and can be expanded. Persistent feel — it's a layer you open and browse within while keeping spatial context.
- **Bottom sheet** = Task-focused overlay (Objectives setup). Also slides up from bottom, but it's modal — it demands attention, has discrete steps, and closes when done. Think "confirm payment" sheets. The difference from a drawer: a sheet is a focused task with a beginning and end; a drawer is a browsable reference panel.
- **Right push** = Navigation deeper (detail screens). Standard iOS navigation pattern. Full-screen replacement with back gesture.

In short: **drawer = reference layer (browse), sheet = task overlay (complete), push = navigate deeper (go).**

### Spatial Model (Desktop — Wireframe Bonus)
- **Left panel** = Navigation (equivalent to hamburger on mobile)
- **Center panel** = Main content (dashboard feed, invest browse)
- **Right panel** = Detail (what pushes from right on mobile)
- Mobile is the collapsed version of the same architecture.

---

## 9. Trust Signals Inventory

| Signal | Screens |
|---|---|
| Real numbers, not marketing copy | Dashboard, Asset Detail, Order |
| Fee transparency before committing | Asset Detail, Order, Order Review |
| Cancel/back always visible | Every screen |
| AMF regulatory badge (subtle) | Order Review, footer |
| Social proof ("120K Finary users invest in this") | Invest tab, Asset Detail |
| Clarity tooltips on unfamiliar terms | Asset Detail, Order Review |
| Risk level classification (1-7 MiFID scale) | Asset Detail |
| "You can change this anytime" reassurance | Objectives, Order |

---

## 10. "First 3 Seconds" — Above the Fold

| Screen | What the user sees first |
|---|---|
| **Dashboard** | Health bar + top insight card ("Your first step: set an investment objective") |
| **Invest** | "For you" section with 3 personalized ETF picks (or Objectives nudge if unset) |
| **Asset Detail** | Asset name + price + 24h change + mini performance chart |
| **Order** | Asset name + amount input (pre-filled if from Objectives) + total cost |
| **Confirmation** | Checkmark + "Your first investment is live" + portfolio value updated |

---

## 11. Content Decisions

| Element | Value | Rationale |
|---|---|---|
| **Featured ETF** | Amundi MSCI World (CW8) | #1 ETF in France, recommended by Mounir on YouTube, globally diversified, low-cost, aligns with "long-term wealth" objective |
| **Secondary ETFs** | iShares Core S&P 500 (SXR8), Amundi STOXX Europe 600 | Geographic variety for AI suggestion list |
| **Investment amount** | €1,000 | Meaningful first investment. Pre-filled from Objectives Step 3. |
| **Success animation** | Subtle checkmark morph + gentle pulse on portfolio value updating | No confetti. Understated. The number changing IS the celebration. |
| **Market indices shown** | CAC 40, S&P 500, MSCI World | Recognizable to French audience |

---

## 12. Key Features Detail

### Health Bar (Compact Dataviz)
Progressive states:
- **State 1** (bank only): Single bar showing bank account health. Green/amber/red.
- **State 2** (bank + investments): Dual or stacked bar. Bank + Investment proportion visible. Appears AFTER first trade — the bar growing is a micro-celebration.
- **State 3** (with Objectives): Progress bar toward goal with breakdown.

Triggered by tapping → opens Objectives bottom sheet. The bar IS the persistent visual link to Objectives.

**Accessibility:** Colors alone are not sufficient. Each state must include a supporting icon or symbol (e.g. checkmark for healthy, warning triangle for attention, arrow for trend) so that color-blind users can read the bar without relying on green/amber/red.

Design target: clean for v1, beautiful and sophisticated if time (v1.5).

### Objectives Setup (Bottom Sheet)
- **Step 1**: "What's your investment goal?" — 4 choices (long-term wealth, retirement, passive income, short-term)
- **Step 2**: "How comfortable are you with risk?" — 3 choices with visual metaphors (calm line, gentle curve, dynamic wave)
- **Step 3**: "How much would you like to invest to start?" — Preset amounts (€100/€500/€1,000/Custom) + "You can change this anytime"
- Total interaction: ~15 seconds. Sheet closes → Dashboard/Invest update with AI suggestions.

**V2 vision** (rationale only): time horizon, monthly contribution target, asset exclusions, target allocation.

### Invest Tab — "Alive" Design
- AI-curated "For you" picks with mini sparklines + one-line rationale
- "Trending on Finary" — community social proof with real activity numbers
- "Markets today" — key indices with live % change
- Category chips (ETFs, Stocks, Crypto)
- Browse all catalog (escape hatch)
- Objectives nudge banner if not set

### Dashboard — Smart Feed
- NOT an asset list (that's Portfolio tab)
- NOT the browse screen (that's Invest tab)
- A prioritized, AI-curated feed of what matters NOW
- Max 2-3 onboarding items for new users, mixed with real content
- **Visual format: TBD at design stage.** Two options to evaluate:
  - **Cards** — each insight as a distinct card. More visual weight, easier to differentiate item types with distinct card styles.
  - **Clean list with subtle dividers** — closer to Things/productivity apps. More minimalist, more modern, higher density. Fits the "mainly text, but alive" vision better.
  - Likely a hybrid: list as the base rhythm, with occasional promoted cards (e.g. the Objectives setup card or a key AI insight). To be resolved during design.
- Items tappable → push to detail (right)
- Swipe actions (dismiss/pin/watch) mentioned in rationale, not designed

### Clarity (Bonus)
- Contextual knowledge base — definitions, explanations for non-expert users
- Inline triggers: dashed-underline terms that open Clarity on tap
- Bottom drawer on mobile (consistent with spatial model)
- Content depends on current screen context
- Search, related topics (tags), link to full FAQ
- If built: hi-fi. If not: mentioned in rationale + "Where This Goes" section.

---

## 13. Regulatory Requirements (MiFID II)

Integrated into Order Review screen:
- **Key Information Document (KID/DICI)** summary for the selected product
- **Risk level classification** (1-7 scale for UCITS/ETFs)
- **Cost transparency** (TER, transaction fees, spread)
- **Order confirmation** with all terms before execution
- **Appropriateness check** assumed completed in KYC (out of scope)

Design approach: elegant integration, not a compliance dump. Clarity tooltips explain each regulatory element.

---

## 14. Delivery Format

### Primary: HTML Presentation Shell
A **single web app** — one URL, seamless experience. The reviewer navigates through the entire case study.

**Routes:**
- `/` → Presentation shell (the case study walkthrough)
- `/prototype` → Standalone prototype
  - On mobile: full-screen, no frame (native feel)
  - On desktop: auto-wrapped in iPhone 15 device frame (393×852 viewport)

**Presentation Structure:**
```
0. Cover / Introduction
1. The User — Persona + Context + Emotional Arc overview
2. The Journey — User Flow (blueprint wireframe storyboard)
3. The Design:
   ├── 3a. Dashboard — hero screen + rationale
   ├── 3b. Invest — hero screen + rationale
   ├── 3c. Asset Detail — hero screen + rationale
   ├── 3d. Order — hero screen + rationale
   └── 3e. Post-Trade — hero screen + rationale
4. Experience It — Prototype (embedded in mobile frame)
5. The Team — Delegation Plan
6. Where This Goes — Vision (desktop wireframe, Clarity, future)
7. Appendix — Design Principles, Decisions Log
```

**User flow storyboard** uses **blueprint wireframes** (dedicated CSS theme):
- White/light blue outlines on dark blue background
- No fills, no photos — just structure, with ACTUAL text (not placeholder labels)
- Clickable → transition to full-color hi-fi version
- Annotated with emotion tags, "first 3 seconds" notes, trust signals, decision arrows

**Rationale** is per-screen alongside each hero screen (not a separate page at the end). Overarching philosophy lives in section 1.

### Secondary: Figma File
Supporting artifact linked from the presentation shell:
- Hero screens (inspectable)
- User flow page
- Desktop wireframe (bonus)
- Clean, organized file structure

### Device Frame
**iPhone 15 standard** — 393×852 logical points. The current design baseline. Middle ground, safe choice.

---

## 15. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Viewport | Mobile-first (390px wide) |
| Theme | Dark mode only |
| Blueprint mode | Dedicated Tailwind color palette (outline-only variant) |
| Deployment | Vercel (one-click preview URL) |
| Design | Figma (supporting artifact) |

---

## 16. Visual Identity Approach

### Strategy
Reproduce Finary's design DNA as closely as possible, then refine where we can justify improvements.

### Sources to Extract From
- Finary iOS/Android app (live)
- finary.com website
- Dribbble shots by Pelostudio / Clemence Taillez (original design work)
- App Store / Google Play screenshots (via SCRNSHTS.club)

### Mini Design System (for efficiency, not deliverable)
Build a minimal Tailwind token set BEFORE starting hi-fi:
- Color palette (backgrounds, surfaces, text, accents, success/error)
- Typography (font family, sizes, weights)
- Spacing scale
- Border radius
- Shadows / elevation
- Chart/dataviz colors

### Art Direction Notes
- **Dark-first** — dark backgrounds, light text, accent colors for actions
- **Data-dense but clean** — Bloomberg meets Things app
- **Finance-serious but accessible** — not playful, not intimidating
- **Lightweight dataviz** — NOT chart-heavy. Dataviz should feel minimalist and focused:
  - **Mobile**: glanceable, "at a glance" data — trends, key metrics, comparisons. Inline bars that integrate into lists or tables. Tags, inline elements, compact indicators. Closer to Markdown-style data than heavy charts. Progressive disclosure: tap for more.
  - **Desktop** (extended detail view): can lean toward richer, heavier dataviz when the context demands it — full charts, allocation breakdowns, historical performance.
  - Think: the most important info in the least visual weight. Sparklines yes. Full-page charts only when explicitly requested by the user.
- **Minimalist** — the less on screen, the more focused and accessible

---

## 17. Micro-Interactions (Prototype)

| Interaction | Screen | Purpose |
|---|---|---|
| AI text "composing" animation | Dashboard insights | Subtle AI presence — atmosphere, not feature |
| Smooth push transitions | All screen changes | Right-push for navigation, bottom-sheet for overlays |
| Buy button state change | Order Screen | Idle → loading → confirmed (implies haptic feedback) |
| Number input animation | Order Screen | Counting up to target amount |
| Success checkmark morph | Post-Trade | Understated celebration |
| Portfolio value pulse | Post-Trade | The number changing IS the celebration |
| Health bar growth | Post-Trade | Investment portion appears for first time |
| Sparkline animations | Invest tab | "Alive" market data |

---

## 18. Team Delegation Plan (Framework)

**Role: Design Manager (Olivier)**
- Owns: vision, rationale, user flow, final review, stakeholder alignment
- Involves engineering + product early

**Anna** (Senior Product Designer — flows + interaction):
- Owns: detailed interaction flows, edge cases, error states
- Collaborates with Marc on transition specs

**Marc** (Design Engineer — code + micro-interactions):
- Owns: prototype build, micro-interactions, the "feel"
- Implements animations, transitions, responsive behavior

**Sophie** (Junior Brand Designer — new joiner):
- Owns: a real piece with mentorship — educational/Clarity content design, or illustration system
- Paired with Anna for guidance

**Vijay** (System Designer — tokens + components):
- Owns: component library, design tokens, consistency audit
- Builds the systematic foundation everyone else uses

*Full delegation plan will be written in the presentation, framed as a real sprint plan from kickoff to ship.*

---

## 19. Decisions Log

Deliberate choices made and documented for the rationale:

| # | Decision | Chose | Rejected | Why |
|---|---|---|---|---|
| D1 | Onboarding approach | Dashboard IS the onboarding (no wizard) | Step-by-step setup wizard | Respects both experts and newcomers. "Visit the house." Counter-convention = differentiator. |
| D2 | AI presence | Subtle atmosphere (typing animation, smart defaults, contextual data) | Chatbot / AI assistant panel | More sophisticated. Keeps user in control. "Feel like AI without being a chatbot." |
| D3 | Dashboard filters | Skipped — smart AI curation | Manual domain filters (Bank/Budget/Invest) | Bottom tabs already handle domain switching. Filters = cognitive redundancy. Dashboard should be smart by default. |
| D4 | Invest tab position | Center (3rd position) in bottom bar | Edge position or buried in menu | Center = thumb's resting position. Signals investing is now first-class. Serves AuM priority. |
| D5 | Objectives complexity | 3 simple steps (goal + risk + amount) | Full financial planning questionnaire | Assignment is about first trade, not Objectives system. 3 steps enough to demonstrate concept. V2 in rationale. |
| D6 | Color mode | Dark only | Dark + Light | Finary is dark-first. Light mode doubles work for minimal signal. |
| D7 | Desktop view | Wireframe bonus only | Full hi-fi desktop | Mobile-first per assignment. Desktop wireframe shows system thinking without splitting energy. |
| D8 | Delivery format | HTML presentation shell + embedded prototype + Figma | PDF + separate prototype link + Figma | One URL. Matches their Claude Code culture. Demonstrates technical capability. |
| D9 | Post-trade screen | Included (beyond strict scope) | Stop at order confirmation | Shows retention thinking, not just conversion. Serves NPS + AuM. Differentiator. |
| D10 | Objectives → AI → Trade | Golden path: Objectives trigger personalized suggestions | Generic catalog-first approach | Demonstrates Head of Product's philosophy. Most elegant path for hesitant user. |
| D11 | Regulatory integration | Elegant inline (Clarity tooltips, dedicated review step) | Hidden in fine print / compliance dump | Shows we understand MiFID II AND can design it beautifully. |
| D12 | Blueprint wireframes | Dedicated CSS blueprint theme with real text | Mini screen thumbnails / generic boxes-and-arrows | Visual impact in presentation. Blueprint → Hi-fi transition tells the story. |

---

## 20. Company Priorities Mapping

How our design serves Finary's three goals:

| Priority | How We Serve It |
|---|---|
| **Increase AuM** | Invest tab center-positioned. Objectives → AI suggestions → frictionless first trade. Post-trade reinforcement encourages trade #2. |
| **Grow ARR** | Premium features visible but not pushy: advanced insights, Clarity depth, Watchers — teased in the experience, naturally driving subscription curiosity. |
| **Ensure high NPS** | Trust-first design. No dark patterns. Escape hatches everywhere. User feels in control. Post-trade builds confidence. Emotional arc designed for delight, not anxiety. |

The "healthy tension": our design serves the user first. The business metrics follow naturally from a world-class experience.

---

## 21. Meta Objectives Checklist

What this project must demonstrate about Olivier:

| # | Objective | How We Achieve It |
|---|---|---|
| 1 | Ideas > Design | Objectives framework, AI atmosphere philosophy, "house you can visit", escape hatch pattern, blueprint wireframes |
| 2 | Storytelling | HTML presentation shell with narrative arc. Per-screen rationale. Emotional journey. Blueprint → Hi-fi transitions. |
| 3 | Team leadership | Delegation plan framed as real sprint. Shows empowerment, growth (Sophie), cross-functional collaboration. |
| 4 | Product understanding | References Series B, Objectives framework, Clarity concept, Head of Product philosophy, Mounir's content strategy |
| 5 | Controlled ambition | 5 hero screens + prototype + presentation shell. More than expected, but scoped and coherent. |
| 6 | Craft | Hi-fi screens + Figma file. Dark mode. Design tokens. Micro-interactions. |
| 7 | "Cannot be unseen" | The prototype + HTML presentation combo. No other candidate will deliver this. |
| 8 | AI (mandatory, not bonus) | AI suggestions, typing animation, smart defaults, Objectives-powered personalization |
| 9 | Hard decisions | Decisions log with explicit trade-offs and rejected alternatives |

---

## 22. Timeline

| Day | Focus | Outputs |
|---|---|---|
| **Day 1** (Feb 25) | Research + Decisions + Constitution | This document. Research archive. CLAUDE.md. |
| **Day 2** (Feb 26) | Visual references + Tech setup + User flow | Mini DS tokens. Next.js project init. User flow storyboard (text). Start hi-fi screens. |
| **Day 3** (Feb 27) | Hi-fi screens + Prototype core | 5 hero screens coded. Navigation working. Animations started. |
| **Day 4** (Feb 28) | Prototype polish + Presentation shell | Prototype complete. Shell structure + content. Blueprint mode. |
| **Day 5** (Mar 1) | Figma + Delegation plan + Polish + Test on mobile | Figma file clean. Delegation plan written. Deployed to Vercel. Mobile tested. |
| **Buffer** (Mar 2) | Final review + Submit | Package. Report ~20 hours. Submit. |

---

## 23. File Structure

```
/Finary/
├── .obsidian/                  ← Obsidian vault config
├── Archive/                    ← Completed research docs
│   ├── OG - initial research.md
│   └── Finary-initial-deep-search.md
├── Reference/                  ← Active reference material (screenshots, etc.)
├── Source/                     ← Source assets
├── prototype/                  ← Next.js project (TBD)
│   ├── src/
│   │   ├── components/         ← Shared UI components
│   │   ├── screens/            ← Screen-level components
│   │   ├── presentation/       ← Presentation shell pages
│   │   └── styles/             ← Tailwind config, tokens
│   └── public/                 ← Static assets
├── Project Constitution.md     ← THIS FILE (single source of truth)
└── CLAUDE.md                   ← Claude session context
```

---

## 24. Open Items (Post-Constitution)

| # | Item | Priority | When |
|---|---|---|---|
| 1 | Gather Finary visual references (screenshots, colors, fonts) | 🔴 CRITICAL | Day 2 — before any hi-fi work |
| 2 | Init Next.js + Tailwind project | 🔴 CRITICAL | Day 2 |
| 3 | Build mini design token set | 🔴 CRITICAL | Day 2 |
| 4 | Clarity panel design | 🟡 BONUS | Day 4 — only if ahead |
| 5 | Desktop wireframe | 🟡 BONUS | Day 4-5 |
| 6 | Health bar v1.5 (beautiful dataviz) | 🟡 BONUS | Day 4-5 |
| 7 | Video walkthrough | 🟢 OPTIONAL | Only after everything else secured |

---

*This document is the single source of truth for the Finary project. All decisions are final unless explicitly reopened. Any new Claude session should read this file first.*

# Finary Project — Claude Context

## CRITICAL: Read This First
**The single source of truth is `Project Constitution.md` at the project root.**
Read it before doing anything. It contains ALL decisions, screen specs, design philosophy, content, delivery format, and timeline.

**This project is INDEPENDENT from the DS project. Never mix them.**

## Working Directory
`/Users/olivierguerin/Projects/Finary` — this is also the Obsidian vault root.

## Quick Reference

### What We're Building
A Design Manager case study for Finary: the **first investment experience** (brokerage account, buy stocks/ETFs). Delivered as an **HTML presentation shell** with an **embedded interactive prototype**.

### Persona
**Jane Moreau**, 32. Ready to invest, hesitant. Tracks portfolio on Finary, knows ETFs, hasn't traded yet.

### Core Design Philosophy
- "You can visit the house even if you're not yet the owner" — no gates, no wizards
- Dashboard IS the onboarding
- AI as atmosphere, not chatbot
- "Without Objectives, AI means nothing" (from Head of Product interview)
- Every curated list has an escape hatch

### Screens (Tier 1 — Hi-Fi)
1. Dashboard (health bar = compact dataviz, smart feed, objectives card)
2. Invest tab (AI picks, trending, markets, browse — "alive" feel)
3. Asset Detail (chart, risk, fees, Clarity tooltips, Buy CTA)
4. Order Screen (amount, fees, confirm)
5. Post-Trade Confirmation (success, portfolio impact, AI reinforcement)
6. Objectives Setup (bottom sheet, 3 steps: goal + risk + amount)
7. Order Review / Legal (MiFID — in prototype only, not hero)

### Navigation
- **Bottom bar**: Home | Portfolio | **Invest** (center, NEW) | Budget | More
- **Top bar**: Avatar | Title | Notifications + Search
- **Spatial**: Bottom drawer = Clarity, Right push = detail navigation

### Content
- ETF: Amundi MSCI World (CW8), €1,000 investment
- Device: iPhone 15 standard (393×852)
- Theme: Dark only

### Delivery
- `/` → HTML presentation shell (case study walkthrough)
- `/prototype` → Standalone prototype (auto-detects mobile vs desktop frame)
- Figma file as supporting artifact
- Deployed on Vercel

### Tech
Next.js + Tailwind CSS + Framer Motion. Blueprint CSS theme for user flow wireframes.

### Key Decisions (see Constitution §19 for full log)
- Filters: SKIPPED (bottom tabs handle domain switching)
- Desktop: wireframe bonus only
- Light mode: SKIPPED
- Post-trade: INCLUDED (beyond strict scope — retention differentiator)
- Blueprint wireframes: dedicated CSS theme with real text (not placeholders)
- Rationale: per-screen alongside hero screens (not separate page)

## File Structure
```
/Finary/
├── .obsidian/
├── Archive/                    ← Completed research (Rounds 1-3 discussion + deep search)
├── Reference/                  ← Active reference material
├── Source/                     ← Source assets
├── prototype/                  ← Next.js project
├── Project Constitution.md     ← SINGLE SOURCE OF TRUTH
└── CLAUDE.md                   ← This file
```

## Context from Interviews
- Team uses Claude Code for design. They embrace "Design with AI."
- "Objectives" framework planned — AI uses user objectives for support
- "Clarity" = internal/upcoming knowledge base for non-experts
- Head of Product values minimalism. AI terminal aesthetic as trend.
- Dataviz: glanceable on mobile, detailed on desktop.
- Tech: React (web), React Native (mobile), Rails, Node, Python, Rust, AWS
- 60% mobile / 40% desktop sessions

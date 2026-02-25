# Finary — Initial Deep Research

> Last updated: 2026-02-25
> Purpose: Reference document for high-fidelity mobile-first prototype project

---

## 1. Company Overview

| Field | Detail |
|---|---|
| **Name** | Finary |
| **Founded** | May 2020 |
| **HQ** | Paris, France |
| **Founders** | Mounir Laggoune (CEO), Julien Blancher (CTO) |
| **Mission** | Democratize wealth management — enable everyone to centralize, optimize, and grow their investments |
| **Stage** | Series B (profitable since Q4 2024) |
| **Users** | 600,000+ |
| **AUM Target** | €5B within 3 years |
| **Registered** | French Financial Markets Authority (AMF); CIF & COA certified |

### Funding History

| Round | Date | Amount | Lead Investor | Notable Participants |
|---|---|---|---|---|
| Seed | ~2021 | Undisclosed | Y Combinator | Upfront Ventures, angels |
| Series A | ~2023 | Undisclosed | Speedinvest | Y Combinator |
| **Series B** | **Sep 2025** | **€25M** | **PayPal Ventures** | LocalGlobe, Hedosophia, Shapers, Y Combinator, Speedinvest, Axel Weber (ex-UBS chairman), Harsh Sinha (CTO Wise) |

### First Acquisition

- **Affluent** (Oct 2025) — founded by Thomas Vuchot & Thomas Brach (ex-Qonto). Financial planning & AI features to be integrated into Finary; Affluent app retired.

---

## 2. Product & Value Proposition

Finary is an **all-in-one wealth management platform** that lets users:

- **Centralize** all assets in one place (banks, brokers, crypto, real estate, alternatives)
- **Track** net worth evolution and portfolio performance in real-time
- **Optimize** with AI-driven insights, fee scanning, and diversification analysis
- **Budget** with automatic expense tracking and categorization
- **Invest** directly via the platform (crypto, upcoming brokerage account)
- **Plan** with wealth simulation tools and financial projections
- **Learn** through integrated content (YouTube, blog, community)

### Core Problem Solved

French/European investors have assets scattered across many accounts (banks, brokers, life insurance, crypto, real estate) with no unified view. Finary consolidates everything and provides actionable insights.

---

## 3. Platforms & Availability

| Platform | Available | Notes |
|---|---|---|
| **iOS** | Yes | App Store — "Finary: Budget & Money Tracker" |
| **Android** | Yes | Google Play — "Finary: Budget & Money Tracker" |
| **Web** | Yes | finary.com — full desktop experience |

- Mobile app uses **React Native**
- Web uses **React**
- Supports **Dark & Light modes**
- iOS/Android widget for quick net worth glance

---

## 4. Features & Capabilities (Exhaustive)

### 4.1 Account Connections & Sync

- 20,000+ banks & institutions worldwide
- Automatic synchronization (via aggregation partners)
- Manual asset entry supported
- Multi-entity support (personal + professional — Pro tier)

### 4.2 Asset Types Tracked

| Category | Examples |
|---|---|
| Bank accounts | Checking, savings |
| Investment accounts | PEA, CTO, brokerage, 401k, IRA, Roth IRA |
| Life insurance | French assurance-vie, euro funds |
| Retirement | PER, pension plans |
| Real estate | Primary residence, rental properties |
| Cryptocurrency | Exchanges (Binance, Coinbase, Kraken), wallet addresses (BTC, ETH) |
| Precious metals | Gold, silver, palladium |
| Startups & VC | Private equity investments |
| Crowdfunding | Crowdlending platforms |
| Employee savings | Company benefit accounts |
| Collectibles | Sneakers, watches, luxury cars |
| Loans & mortgages | Debt tracking |

### 4.3 Dashboard & Analytics

- **Net worth evolution** — historical chart
- **Daily performance** — today's gain/loss + cumulative
- **Best/worst investments** — filterable by 24h, 7d, 1m, all time
- **3 dashboard views** — swipeable on mobile
- **Diversification score** — actionable optimization tips
- **Geographic allocation** breakdown
- **Sector allocation** breakdown
- **Asset class allocation** breakdown

### 4.4 Investment Tools

- **Fee scanner** — detects hidden fees on life insurance, brokers, ETFs, crypto; suggests cheaper alternatives
- **Dividend tracker** — projected annual income, upcoming payments, history
- **Investment leaderboard** — popular community investments
- **Performance reports** — portfolio-level reporting
- **Investor profile** — allocation analysis, risk level, debt ratio
- **Wealth simulator** — 30-year projection aligned with goals
- **Monthly reports** (Plus)

### 4.5 Budget & Cashflow

- Automatic income/expense categorization (AI-powered)
- **Expense categories**: Auto & Transport, Subscriptions, Cash, Business, Food & Drink, Investment, Health, Loan Repayment, Refunds, Taxes, Transfers, Essential Needs
- **Custom smart rules** for categorization
- **Recurring expense scanner** — subscriptions, bank fees, taxes
- Calendar view + list view for expense timeline
- Flow diagrams with distribution percentages
- Transaction search & batch multi-selection
- 6-month AI analysis of spending patterns

### 4.6 Crypto Features

- Buy/sell 25+ cryptocurrencies
- Competitive fees (0.99% for Plus, 1.29% Lite, 1.49% Free)
- Earn up to 10% APY
- Automated investment plans (daily, weekly, monthly — DCA)
- Real-time crypto price tracking

### 4.7 Finary One (Private Wealth — €250K+ assets)

- Dedicated team of former private bankers
- Luxembourg life insurance, Private Equity, SCPI, Lombard Credit
- Passive management via ETFs, structured products, crypto
- Fee-based or classical remuneration model
- Launched September 2024

### 4.8 Other Features

- **Family mode** — organize shared finances
- **Wealth statement** generation
- **Priority/VIP support** (paid tiers)
- **Exclusive investment opportunities** (Plus members)
- **Wealth tracking widget** (iOS — square and rectangular)

---

## 5. Pricing Tiers

| Plan | Price | Syncs | Crypto Fees | Key Features |
|---|---|---|---|---|
| **Free** | €0 | 2 accounts | 1.49% | Basic wealth tracking |
| **Lite** | €54.99/yr | Unlimited | 1.29% | Priority support, budgeting, fee scanner, dividend tracker, diversification score |
| **Plus** _(most popular)_ | €149.99/yr | Unlimited | 0.99% | All Lite + wealth simulator, leaderboard, investor profile, monthly reports, family mode, wealth statements |
| **Pro** | €349.99/yr | Unlimited | 0.99% | All Plus + professional accounts, multi-entity holding mode |

- 14-day free trial on Free & Plus
- 3-day free trial on Lite
- Occasional promotions (Black Friday: €50 off Plus/Pro)

---

## 6. UI/UX Design Patterns

### Visual Identity

- **Dark & Light mode** — both fully designed (featured on Dribbble by Pelostudio / Clemence Taillez)
- Clean, modern fintech aesthetic — dark mode is primary in marketing
- Heavy use of charts and data visualizations
- Color-coded asset categories

### Mobile Navigation

- **Bottom tab bar** — primary navigation pattern
- Dashboard accessible via bottom nav
- Swipeable dashboard cards (3 views)
- Icon-based category system for budget

### Key Screens (inferred from features)

1. **Dashboard** — net worth, performance, asset breakdown
2. **Portfolio** — detailed asset list, performance per asset
3. **Budget** — income/expenses, categories, subscriptions
4. **Insights** — fee scanner, diversification, recommendations
5. **Invest** — crypto buy/sell, DCA plans
6. **Profile/Settings** — account management, subscriptions

### Design Agency

- Designed by **Pelostudio** (Clemence Taillez) — early design work (2021)

---

## 7. Tech Stack

| Layer | Technology |
|---|---|
| Web frontend | React |
| Mobile | React Native |
| Backend | Ruby on Rails, Node.js, Python, Rust |
| Cloud | AWS |
| Security | SHA-256 + AES-256 encryption (at rest & in transit) |

### Active Hiring (Dec 2025)

- VP Engineering
- Senior Software Engineer (Rust)
- VP Marketing
- 15+ open positions total; targeting ~50 new hires

---

## 8. Community & Content

| Channel | Details |
|---|---|
| **YouTube** | France's #1 personal finance channel — 600K subscribers, 75M+ views. Mounir analyzes real user portfolios live. |
| **Community Forum** | community.finary.com — one of France's most active finance forums |
| **Blog** | finary.com/blog — authored by Mounir and team |
| **Twitter/X** | @moonlaggoune (Mounir personal) |
| **LinkedIn** | Company page + Mounir Laggoune personal |
| **TV** | Mounir appears weekly on BFM Business "Tout pour Votre Argent" |
| **Book** | Mounir is a best-selling author (personal finance) |
| **Trustpilot** | Reviews at trustpilot.com/review/finary.com |

### Content Strategy

YouTube is the growth engine — Mounir's portfolio review videos bridge education, entertainment, and product awareness. This is deeply integrated with the product (users submit portfolios for review).

---

## 9. Roadmap & Direction (2025-2026)

### Confirmed / In Progress

- **AI agents** for wealth management (accelerated by Affluent acquisition)
- **Tax management** features
- **Brokerage account** (upcoming — direct stock/ETF investing)
- **PEA** (Plan d'Epargne en Actions — highly anticipated by community)
- **Finary Life self-directed management**
- **European expansion** (post-Series B priority)
- **Data reliability improvements** — 9 dedicated team members on sync quality
- **Asset class portfolio views** — new portfolio breakdowns
- **Investment performance tracking** — separate from contributions

### Strategic Direction

- From tracker → full wealth management platform
- AI-first approach to financial planning
- Lower barrier to private banking via Finary One
- B2C focus with community flywheel

---

## 10. Market & Competitors

### Direct Competitors (Wealth Tracking / Aggregation)

| Competitor | Country | Focus | Notes |
|---|---|---|---|
| **Bankin'** | France | Bank aggregation, budgeting | Acquired by Bridge (Bankin' more budget-focused) |
| **Linxo** | France | Bank aggregation | Similar to Bankin' |
| **Sharesight** | Australia/Global | Portfolio tracking | Strong on tax reporting |
| **Portfolio Performance** | Germany | Open-source portfolio tracker | Desktop app, very detailed |
| **Ghostfolio** | Switzerland | Open-source wealth tracker | Privacy-focused |
| **getquin** | Germany | Portfolio tracking + community | Social investing angle |
| **Kubera** | US | Net worth tracker | Multi-asset, premium pricing |
| **Wealthica** | Canada | Portfolio aggregation | Canadian market focus |
| **Findex** | Sweden | Portfolio management | Nordic market |
| **Exirio** | Global | Multi-currency wealth tracking | Free app |
| **Strabo** | UK | Investment dashboard | Cloud-based |

### Adjacent Competitors (Wealth Management / Robo-advisors — France)

| Competitor | Focus |
|---|---|
| **Yomoni** | Robo-advisor, life insurance, PER, PEA |
| **Nalo** | Robo-advisor, life insurance |
| **Ramify** | Digital private banking |
| **Climb** (ex-Tacotax) | Tax optimization, investment |
| **Mon Petit Placement** | Investment advisory |
| **Goodvest** | ESG-focused robo-advisor |

### Finary's Differentiation

1. **All-in-one** — tracking + investing + budgeting in single platform
2. **Community-driven** — forum, YouTube, portfolio reviews drive product feedback
3. **Modern UX** — best-in-class design vs. legacy banking apps
4. **Transparency** — fee scanning exposes hidden costs
5. **Content moat** — YouTube + BFM presence = massive organic acquisition
6. **European scope** — 20K+ bank connections across EU

---

## 11. User Reviews Summary

### Strengths (from Trustpilot, App Store, forums)

- Unified, clear view of all assets
- Modern, intuitive interface
- Powerful investment tracking (stocks, crypto, real estate)
- Active community and responsive roadmap
- Educational value (YouTube integration)

### Pain Points

- Sync reliability issues with some banks/brokers
- Customer support responsiveness (occasional complaints)
- Some features locked behind higher tiers
- Missing PEA and brokerage account (in development)

---

## 12. Sources

### Official

- [Finary Homepage](https://finary.com/en)
- [Finary App Page](https://finary.com/en/app)
- [Finary Pricing](https://finary.com/en/pricing)
- [Finary Plus Features](https://finary.com/en/finary-plus)
- [Finary Lite](https://finary.com/en/finary-lite)
- [Finary One (Private Wealth)](https://finary.com/en/finary-one)
- [Finary One Solutions](https://finary.com/en/finary-one-solutions)
- [Finary One Team](https://finary.com/en/team-finary-one)
- [Product Updates Hub](https://finary.com/en/product-updates)
- [December 2025 Product Update](https://finary.com/en/product-updates/december-2025)
- [June 2025 Product Update](https://finary.com/en/product-updates/june-2025)
- [Finary on iOS](https://finary.com/en/product-updates/finary-on-ios)
- [Finary 1.0 Launch](https://finary.com/en/product-updates/the-best-portfolio-tracker-is-here)
- [Wealth Tracking](https://finary.com/en/wealth-tracking)
- [Budget & Cashflow](https://finary.com/en/budget)
- [Expenses Scanner](https://finary.com/en/budget/expenses-scanner)
- [Fee Scanner](https://finary.com/en/insights/fees-scanner)
- [MoneyTime (Real-Time Tracker)](https://finary.com/en/moneytime)
- [Affluent Acquisition Announcement](https://finary.com/en/product-updates/le-premier-rachat-de-lhistoire-de-finary-bienvenue-affluent)
- [Help Center — Widget](https://help.finary.com/en/articles/10458079-how-to-use-the-finary-wealth-tracking-widget)
- [Help Center — Budget Scanner](https://help.finary.com/en/articles/10279144-use-the-budget-scanner)
- [Help Center — Subscribe](https://help.finary.com/en/articles/6525572-subscribe-to-finary)

### App Stores

- [iOS App Store](https://apps.apple.com/us/app/finary-budget-money-tracker/id1569413444)
- [Google Play Store](https://play.google.com/store/apps/details?id=com.finary.main&hl=en_US)
- [App Store Screenshots (SCRNSHTS)](https://scrnshts.club/finary-budget-money-tracker/)
- [Portfolio Tracker Screenshots (SCRNSHTS)](https://scrnshts.club/finary-portfolio-tracker/)

### Press & Funding

- [EU-Startups — Series B](https://www.eu-startups.com/2025/09/finary-gets-serious-paris-fintech-lands-e25-million-for-ai-powered-wealth-tools-and-expand-across-europe/)
- [PayPal Newsroom — Series B](https://newsroom.paypal-corp.com/2025-09-22-PayPal-Ventures-leads-Finarys-Series-B-funding-round)
- [The SaaS News — Series B](https://www.thesaasnews.com/news/finary-raises-25-million-in-series-b)
- [Tech.eu — Series B](https://tech.eu/2025/09/18/shapers-launches-75m-fintech-fund-i-as-finary-hits-eur25m-series-b/)
- [Fintech Global — Series B](https://fintech.global/2025/09/22/wealth-app-finary-raises-e25m-in-series-b-led-by-paypal/)
- [StartupHub.ai — Series B](https://www.startuphub.ai/ai-news/funding-round/2025/finary-lands-e25m-series-b-for-ai-wealth-tools-europe-growth/)
- [VentureBurn — Series B](https://ventureburn.com/finary-raises-29m-series-b-to-build-ai-money-management/)
- [French Tech Journal — Funding Wire](https://www.frenchtechjournal.com/french-tech-funding-wire-september-19-genomines-la-fourche-finary-more/)
- [Maddyness — Affluent Acquisition](https://www.maddyness.com/2025/10/03/deux-semaines-apres-sa-serie-b-finary-boucle-sa-toute-premiere-acquisition/)
- [Finyear — Affluent Acquisition](https://finyear.com/finary-annonce-lacquisition-de-la-plateforme-de-gestion-de-patrimoine-affluent/)
- [Finyear — Gestion Privee](https://finyear.com/La-fintech-Finary-fait-aussi-de-la-gestion-privee_a51352.html)
- [Profession CGP — Gestion Privee](https://www.professioncgp.com/article/les-acteurs/actu/cette-fintech-qui-veut-disrupter-la-gestion-privee.html)

### Competitor & Market Analysis

- [CB Insights — Competitors](https://www.cbinsights.com/company/finary-1/alternatives-competitors)
- [Product Hunt — Alternatives](https://www.producthunt.com/products/finary/alternatives)
- [AlternativeTo — Finary](https://alternativeto.net/software/finary/)
- [SaaSHub — Alternatives](https://www.saashub.com/finary-alternatives)
- [Craft.co — Competitors](https://craft.co/finary/competitors)
- [Similarweb — Traffic Competitors](https://www.similarweb.com/website/finary.com/competitors/)
- [Findex Comparison](https://www.findex.se/knowledge-base/portfolio-management/portfolio-management-kubera-wealthica-finary-findex)
- [Ghostfolio — OSS Alternative](https://ghostfol.io/en/resources/personal-finance-tools/open-source-alternative-to-finary)

### Company Data

- [Crunchbase — Finary](https://www.crunchbase.com/organization/finary-9c9e)
- [Crunchbase — Mounir Laggoune](https://www.crunchbase.com/person/mounir-laggoune)
- [Tracxn — Finary](https://tracxn.com/d/companies/finary/___evq3xU2kBSAdZjM78d9slI3y61Q1xDQL7EczP6eu18)
- [LeadIQ — Finary](https://leadiq.com/c/finary/60ab9f483b112d2d98950b24)
- [Growjo — Finary](https://growjo.com/company/Finary)
- [PitchBook — Finary](https://pitchbook.com/profiles/company/462040-30)
- [Y Combinator — Finary](https://www.ycombinator.com/companies/finary-com)
- [Wikipedia — Finary](https://fr.wikipedia.org/wiki/Finary)

### Reviews & Community

- [Trustpilot — Finary](https://www.trustpilot.com/review/finary.com)
- [Finary Community Forum](https://community.finary.com)
- [Forum — Feature Requests](https://community.finary.com/t/amelioration-scanner-intelligent-des-depenses-recurrentes/24257)
- [Forum — User Feedback](https://community.finary.com/t/vos-retours-sur-finary-ameliorations-et-perspectives-par-un-utilisateur/19599)
- [OOInvestir — Avis](https://www.ooinvestir.fr/avis-gestion-investissement/avis-finary.html)
- [Le Bon Investisseur — Avis](https://leboninvestisseur.com/finary/)
- [Le Media de l'Investisseur — Avis & Reduction](https://lemediadelinvestisseur.fr/avis-et-test/finary-reduction-et-avis-sur-les-abonnements)
- [Culture Financiere — Fiche Pratique](https://culture-financiere.com/avis/finary/)

### Design & Tech

- [Dribbble — Dark/Light UI](https://dribbble.com/shots/16549733-Finary-Dark-and-Light-UI)
- [Dribbble — Dashboard Web App](https://dribbble.com/shots/16549476-Finary-Dashboard-web-app)
- [Speedinvest — YouTube Growth Strategy](https://www.speedinvest.com/knowledge/how-finary-turned-youtube-into-its-growth-engine)
- [Speedinvest Blog — YouTube Engine](https://speedinvest.ghost.io/how-finary-turned-youtube-into-a-scaling-engine/)
- [Speedinvest Job Board — Lead Web Engineer](https://careers.speedinvest.com/companies/finary/jobs/40747668-lead-web-engineer)
- [Startup.jobs — Full Stack Engineer](https://startup.jobs/full-stack-engineer-finary-2357827)

### Social

- [Mounir Laggoune — X/Twitter](https://x.com/moonlaggoune)
- [Mounir Laggoune — LinkedIn](https://www.linkedin.com/in/mounirlaggoune/)
- [Mounir — Finary AI announcement (LinkedIn)](https://www.linkedin.com/posts/mounirlaggoune_introducing-finary-ai-the-worlds-most-activity-7072094392307568640-vb4i)
- [Affluent joining Finary](https://withaffluent.com/en/playbook/articles/affluent-is-joining-finary)
- [No Cap Blog — Mounir](https://nocap.blog/founder/mounir-laggoune/)

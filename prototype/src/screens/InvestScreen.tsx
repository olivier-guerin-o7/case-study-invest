"use client";

import { motion } from "framer-motion";
import Sparkline from "@/components/Sparkline";

/* ============================================
   DATA — Real content per Constitution §11
   ============================================ */

const forYouPicks = [
  {
    name: "Amundi MSCI World",
    ticker: "CW8",
    price: "491,32 €",
    change: "+18,24%",
    positive: true,
    rationale: "Diversification mondiale",
    fees: "Frais 0,38%",
    sparkline: [40, 42, 41, 44, 46, 45, 48, 50, 49, 52, 55, 58],
  },
  {
    name: "iShares Core S&P 500",
    ticker: "SXR8",
    price: "523,10 €",
    change: "+21,07%",
    positive: true,
    rationale: "Top entreprises US",
    fees: "Frais 0,07%",
    sparkline: [30, 32, 35, 33, 37, 40, 38, 42, 44, 46, 48, 50],
  },
  {
    name: "Amundi STOXX Europe 600",
    ticker: "MEUD",
    price: "234,85 €",
    change: "+8,42%",
    positive: true,
    rationale: "Exposition européenne",
    fees: "Frais 0,18%",
    sparkline: [25, 26, 24, 27, 26, 28, 29, 27, 30, 31, 30, 32],
  },
];

const trendingAssets = [
  { name: "Apple", ticker: "AAPL", price: "198,50 €", change: "+2,34%", positive: true, investors: "12,4K" },
  { name: "LVMH", ticker: "MC", price: "824,60 €", change: "-0,82%", positive: false, investors: "8,7K" },
  { name: "NVIDIA", ticker: "NVDA", price: "876,30 €", change: "+4,12%", positive: true, investors: "15,2K" },
];

const marketIndices = [
  { name: "CAC 40", value: "7 932,42", change: "+0,64%", positive: true },
  { name: "S&P 500", value: "5 248,10", change: "+1,12%", positive: true },
  { name: "MSCI World", value: "3 412,88", change: "+0,38%", positive: true },
];

const categories = ["ETFs", "Actions", "Crypto", "Obligations"];

/* ============================================
   ANIMATION VARIANTS
   ============================================ */

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

/* ============================================
   COMPONENT
   ============================================ */

export default function InvestScreen() {
  return (
    <motion.div
      className="no-scrollbar flex flex-col gap-8 overflow-y-auto px-6 pt-1 pb-28 h-full"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ── Screen title — part of scrollable content, not top bar ── */}
      <motion.h1
        variants={fadeUp}
        className="text-[22px] font-semibold leading-7 text-white/75"
      >
        Investir
      </motion.h1>

      {/* ── Section: Objectives Nudge ── */}
      <motion.div variants={fadeUp}>
        <button className="w-full rounded-card-lg bg-white/[0.08] p-4 text-left transition-colors active:bg-white/[0.12]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gold/10">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7" stroke="#F1C086" strokeWidth="1.5" />
                <circle cx="10" cy="10" r="3" stroke="#F1C086" strokeWidth="1.5" />
                <circle cx="10" cy="10" r="1" fill="#F1C086" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-text-primary">
                Définir un objectif
              </p>
              <p className="mt-0.5 text-xs text-text-muted">
                Personnalisez votre investissement
              </p>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-text-tertiary">
              <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>
      </motion.div>

      {/* ── Section: Pour vous (AI picks) ── */}
      <motion.section variants={fadeUp}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold text-text-primary">Pour vous</h2>
            <div className="rounded-full bg-brand-blue/15 px-2 py-0.5">
              <span className="text-[10px] font-semibold text-brand-blue">IA</span>
            </div>
          </div>
          <button className="text-xs font-medium text-text-muted transition-colors hover:text-text-secondary">
            Tout voir
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {forYouPicks.map((asset, i) => (
            <motion.button
              key={asset.ticker}
              variants={fadeUp}
              className="flex items-center gap-3 rounded-card-lg bg-white/[0.06] p-4 text-left transition-colors active:bg-white/[0.10]"
            >
              {/* Logo placeholder */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/[0.08]">
                <span className="text-[10px] font-bold text-white/90">
                  {asset.ticker.slice(0, 2)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-1.5">
                  <p className="text-sm font-semibold text-text-primary truncate">
                    {asset.name}
                  </p>
                  <span className="text-xs text-text-tertiary">{asset.ticker}</span>
                </div>
                <p className="mt-0.5 text-xs text-text-muted truncate">
                  {asset.rationale}
                </p>
                <p className="mt-0.5 text-[11px] text-text-tertiary">
                  {asset.fees}
                </p>
              </div>

              {/* Sparkline + price */}
              <div className="flex shrink-0 flex-col items-end gap-1">
                <Sparkline data={asset.sparkline} color="#22C55E" width={48} height={24} />
                <p className="text-sm font-semibold text-text-primary">{asset.price}</p>
                <p className={`text-xs font-medium ${asset.positive ? "text-status-gain" : "text-status-loss"}`}>
                  {asset.change}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* ── Section: Trending on Finary ── */}
      <motion.section variants={fadeUp}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Tendances Finary</h2>
          <button className="text-xs font-medium text-text-muted transition-colors hover:text-text-secondary">
            Tout voir
          </button>
        </div>

        <div className="flex flex-col">
          {trendingAssets.map((asset, i) => (
            <motion.button
              key={asset.ticker}
              variants={fadeUp}
              className="flex items-center gap-3 border-b border-border-subtle py-3.5 text-left last:border-0 transition-colors active:bg-bg-surface/50"
            >
              {/* Rank */}
              <span className="w-5 text-center text-xs font-semibold text-text-tertiary">
                {i + 1}
              </span>

              {/* Logo placeholder */}
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-bg-elevated">
                <span className="text-[10px] font-bold text-text-muted">
                  {asset.ticker.slice(0, 2)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-primary">{asset.name}</p>
                <p className="text-xs text-text-muted">
                  {asset.investors} investisseurs
                </p>
              </div>

              {/* Price */}
              <div className="flex shrink-0 flex-col items-end">
                <p className="text-sm font-semibold text-text-primary">{asset.price}</p>
                <p className={`text-xs font-medium ${asset.positive ? "text-status-gain" : "text-status-loss"}`}>
                  {asset.change}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* ── Section: Marchés aujourd'hui ── */}
      <motion.section variants={fadeUp}>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          Marchés aujourd'hui
        </h2>

        <div className="flex gap-2.5">
          {marketIndices.map((index) => (
            <div
              key={index.name}
              className="flex-1 rounded-card bg-bg-surface p-3"
            >
              <p className="text-[11px] font-medium text-text-muted">{index.name}</p>
              <p className="mt-1 text-sm font-semibold text-text-primary">
                {index.value}
              </p>
              <p className={`mt-0.5 text-xs font-medium ${index.positive ? "text-status-gain" : "text-status-loss"}`}>
                {index.change}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ── Section: Categories ── */}
      <motion.section variants={fadeUp}>
        <h2 className="mb-4 text-lg font-semibold text-text-primary">
          Catégories
        </h2>

        <div className="flex gap-2">
          {categories.map((cat, i) => (
            <button
              key={cat}
              className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                i === 0
                  ? "bg-brand-gold/15 text-brand-gold"
                  : "bg-bg-elevated text-text-muted hover:text-text-secondary"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.section>

      {/* ── Escape hatch ── */}
      <motion.div variants={fadeUp} className="pb-4">
        <button className="w-full text-center text-sm font-medium text-text-muted transition-colors hover:text-brand-gold">
          Parcourir tous les actifs →
        </button>
      </motion.div>
    </motion.div>
  );
}

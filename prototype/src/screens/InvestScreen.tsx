"use client";

import { useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import Sparkline from "@/components/Sparkline";
import ObjectivesIndicator from "@/components/ObjectivesIndicator";
import type { ObjectivesData } from "@/components/ObjectivesSheet";

/* Drag-to-scroll — simulates touch scrolling on desktop */
function useDragScroll(axis: "x" | "y" | "both" = "x") {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ isDown: false, startX: 0, startY: 0, scrollLeft: 0, scrollTop: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    state.current = {
      isDown: true,
      startX: e.pageX,
      startY: e.pageY,
      scrollLeft: el.scrollLeft,
      scrollTop: el.scrollTop,
    };
  }, []);

  const onMouseUp = useCallback(() => {
    state.current.isDown = false;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!state.current.isDown || !ref.current) return;
    e.preventDefault();
    const dx = e.pageX - state.current.startX;
    const dy = e.pageY - state.current.startY;
    if (axis === "x" || axis === "both") {
      ref.current.scrollLeft = state.current.scrollLeft - dx;
    }
    if (axis === "y" || axis === "both") {
      ref.current.scrollTop = state.current.scrollTop - dy;
    }
  }, [axis]);

  return { ref, onMouseDown, onMouseUp, onMouseLeave: onMouseUp, onMouseMove };
}

interface InvestScreenProps {
  objectives?: ObjectivesData | null;
  objectivesRevision?: number;
  onOpenSheet?: () => void;
  onSelectAsset?: (ticker: string) => void;
  isTouch?: boolean;
  onToast?: (msg?: string) => void;
  scrollKey?: number;
}

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
  { name: "S&P 500", value: "5 248,10", change: "-0,42%", positive: false },
  { name: "MSCI World", value: "3 412,88", change: "+0,38%", positive: true },
];

const filters = ["Sélection", "Tous", "ETFs", "Actions", "Crypto", "Obligations"];

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

export default function InvestScreen({ objectives = null, objectivesRevision = 0, onOpenSheet, onSelectAsset, isTouch = false, onToast, scrollKey = 0 }: InvestScreenProps) {
  const dragScrollX = useDragScroll("x");
  const dragScrollY = useDragScroll("y");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset scroll position when returning to this screen
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [scrollKey]);

  return (
    <motion.div
      ref={(el: HTMLDivElement | null) => {
        (scrollRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
        if (!isTouch) (dragScrollY.ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
      }}
      onMouseDown={!isTouch ? dragScrollY.onMouseDown : undefined}
      onMouseUp={!isTouch ? dragScrollY.onMouseUp : undefined}
      onMouseLeave={!isTouch ? dragScrollY.onMouseLeave : undefined}
      onMouseMove={!isTouch ? dragScrollY.onMouseMove : undefined}
      className="no-scrollbar flex flex-col gap-8 overflow-y-auto px-6 pt-1 pb-28 h-full"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ── Screen title ── */}
      <motion.h1
        variants={fadeUp}
        className="text-[22px] font-semibold leading-7 text-white/60"
      >
        Investir
      </motion.h1>

      {/* ── Objectives: Nudge (State 1) or Indicator (State 3) ── */}
      <motion.div variants={fadeUp} className={objectives ? "-mt-5" : "-mt-4"}>
        {objectives ? (
          <ObjectivesIndicator key={objectivesRevision} objectives={objectives} onEdit={() => onOpenSheet?.()} />
        ) : (
          <button
            onClick={() => onOpenSheet?.()}
            className="w-full rounded-card-lg border border-brand-gold/30 p-4 text-left transition-colors active:bg-surface-subtle"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gold/10">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="#F1C086" strokeWidth="1.5" />
                  <circle cx="10" cy="10" r="3" stroke="#F1C086" strokeWidth="1.5" />
                  <circle cx="10" cy="10" r="1" fill="#F1C086" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-semibold text-text-primary">
                  Définir un objectif
                </p>
                <p className="mt-0.5 text-xs text-text-muted">
                  Personnalisez votre investissement
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-brand-gold">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
        )}
      </motion.div>

      {/* ── Filter pills (inline — no section title) ── */}
      <motion.div variants={fadeUp} className="relative -mx-6">
        <div
          ref={!isTouch ? dragScrollX.ref : undefined}
          onMouseDown={!isTouch ? dragScrollX.onMouseDown : undefined}
          onMouseUp={!isTouch ? dragScrollX.onMouseUp : undefined}
          onMouseLeave={!isTouch ? dragScrollX.onMouseLeave : undefined}
          onMouseMove={!isTouch ? dragScrollX.onMouseMove : undefined}
          className="no-scrollbar flex gap-2.5 overflow-x-auto px-6"
          style={!isTouch ? { cursor: "grab" } : undefined}
        >
          {filters.map((filter, i) => (
            <button
              key={filter}
              onClick={i !== 0 ? () => onToast?.() : undefined}
              className={`shrink-0 rounded-full px-4 py-2.5 text-xs font-medium transition-colors ${
                i === 0
                  ? "bg-brand-gold/15 text-brand-gold"
                  : "bg-surface-prominent text-text-muted active:text-text-secondary"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        {/* Fade-out hint for horizontal scroll */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black to-transparent" />
      </motion.div>

      {/* ── "Sélection" content: Pour vous (AI picks) ── */}
      <motion.section variants={fadeUp}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold leading-tight text-text-primary">Pour vous</h2>
            <div className="flex h-5 w-7 translate-y-px items-center justify-center rounded-full bg-brand-blue/15">
              <span className="text-[10px] font-semibold text-brand-blue">IA</span>
            </div>
          </div>
          <button onClick={() => onToast?.()} className="pr-1 text-xs font-medium text-text-muted transition-colors active:text-text-secondary">
            Tout voir
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {forYouPicks.map((asset) => (
            <motion.button
              key={asset.ticker}
              variants={fadeUp}
              onClick={() => onSelectAsset?.(asset.ticker)}
              className="flex items-center gap-3 rounded-card-lg bg-surface-default px-4 py-5 text-left transition-colors active:bg-surface-prominent"
            >
              {/* Logo placeholder */}
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-prominent">
                <span className="text-[10px] font-bold text-white/90">
                  {asset.ticker.slice(0, 2)}
                </span>
              </div>

              {/* Info + Price — grid ensures row alignment */}
              <div className="grid flex-1 min-w-0 grid-cols-[1fr_auto] items-center gap-x-3">
                {/* Row 1: rationale + sparkline */}
                <p className="text-[11px] text-text-muted truncate">
                  {asset.ticker} · {asset.rationale}
                </p>
                <div className="flex items-end justify-end mb-1">
                  <Sparkline data={asset.sparkline} color="#22C55E" width={48} height={12} />
                </div>

                {/* Row 2: name + price — guaranteed horizontal alignment */}
                <p className="text-[15px] font-semibold text-text-primary truncate">
                  {asset.name}
                </p>
                <p className="text-[15px] font-semibold text-text-primary text-right">{asset.price}</p>

                {/* Row 3: fees + change */}
                <p className="text-[11px] text-text-tertiary">
                  {asset.fees}
                </p>
                <p className={`text-[11px] font-medium text-right ${asset.positive ? "text-status-gain" : "text-status-loss"}`}>
                  {asset.change}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* ── "Sélection" content: Tendances ── */}
      <motion.section variants={fadeUp}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Tendances</h2>
          <button onClick={() => onToast?.()} className="pr-1 text-xs font-medium text-text-muted transition-colors active:text-text-secondary">
            Tout voir
          </button>
        </div>

        <div className="flex flex-col">
          {trendingAssets.map((asset, i) => (
            <motion.button
              key={asset.ticker}
              variants={fadeUp}
              onClick={() => onSelectAsset?.(asset.ticker)}
              className="flex items-center gap-3 border-b border-border-subtle py-3.5 text-left last:border-0 transition-colors active:bg-surface-subtle"
            >
              {/* Rank + Logo */}
              <div className="flex items-center gap-2">
                <span className="w-4 text-center text-xs font-semibold text-text-tertiary">
                  {i + 1}
                </span>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white">
                  <span className="text-[10px] font-bold text-black">
                    {asset.ticker.slice(0, 2)}
                  </span>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-text-primary">{asset.name}</p>
                <p className="mt-0.5 text-[11px] text-text-muted">
                  {asset.investors} investisseurs
                </p>
              </div>

              {/* Price */}
              <div className="flex shrink-0 flex-col items-end">
                <p className="text-[15px] font-semibold text-text-primary">{asset.price}</p>
                <p className={`mt-0.5 text-[11px] font-medium ${asset.positive ? "text-status-gain" : "text-status-loss"}`}>
                  {asset.change}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {/* ── Advisor Upsell ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }}
        viewport={{ once: true }}
        className="-mt-2 flex flex-col items-center gap-4"
      >
        <p className="text-center text-xs leading-relaxed text-text-muted">
          Envie de conseils pour
          <br />
          vos investissements ?
        </p>
        <button onClick={() => onToast?.()} className="rounded-full bg-brand-gold px-6 py-3 text-[15px] font-semibold text-black transition-opacity active:opacity-80">
          Découvrir Premium
        </button>
      </motion.div>
    </motion.div>
  );
}

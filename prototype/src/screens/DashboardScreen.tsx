"use client";

import { useState, useRef, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import ObjectivesIndicator from "@/components/ObjectivesIndicator";
import type { ObjectivesData } from "@/components/ObjectivesSheet";

/* ============================================
   DRAG-TO-SCROLL (desktop — same as InvestScreen)
   ============================================ */

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
    const dy = e.pageY - state.current.startY;
    if (axis === "y" || axis === "both") {
      ref.current.scrollTop = state.current.scrollTop - dy;
    }
  }, [axis]);

  return { ref, onMouseDown, onMouseUp, onMouseLeave: onMouseUp, onMouseMove };
}

/* ============================================
   TYPES
   ============================================ */

interface DashboardScreenProps {
  objectives: ObjectivesData | null;
  objectivesRevision: number;
  onOpenSheet: () => void;
  isTouch: boolean;
  onToast: (msg?: string) => void;
  onNavigateToInvest: () => void;
  hasCompletedTrade: boolean;
  tradeAmount: number;
}

type InnerTab = "feed" | "insights" | "support";

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
   PULSE LINE DATAVIZ
   ============================================ */

// Deterministic bank data — gentle upward trend (no Math.random to avoid hydration mismatch)
const BANK_DATA = [
  11_800, 11_830, 11_810, 11_870, 11_900, 11_880, 11_920, 11_960, 11_940, 11_980,
  12_010, 12_040, 12_020, 12_060, 12_090, 12_070, 12_110, 12_140, 12_120, 12_160,
  12_190, 12_170, 12_210, 12_250, 12_230, 12_280, 12_320, 12_360, 12_400, 12_450,
];

function PulseLine({
  hasCompletedTrade,
  tradeAmount,
}: {
  hasCompletedTrade: boolean;
  tradeAmount: number;
}) {
  const W = 360;
  const H = 120;
  const PAD_TOP = 12;
  const PAD_BOTTOM = 8;

  const bankData = BANK_DATA;

  const totalData = useMemo(() => {
    if (!hasCompletedTrade) return bankData;
    // Add investment in last 8 points (gradual ramp, wider spread)
    return bankData.map((v, i) => {
      if (i < 22) return v;
      const progress = (i - 21) / 8;
      return v + Math.round(tradeAmount * progress);
    });
  }, [bankData, hasCompletedTrade, tradeAmount]);

  const investData = useMemo(() => {
    if (!hasCompletedTrade) return null;
    return bankData.map((_v, i) => {
      if (i < 22) return 0;
      const progress = (i - 21) / 8;
      return Math.round(tradeAmount * progress);
    });
  }, [bankData, hasCompletedTrade, tradeAmount]);

  // Scale to SVG coordinates
  const allValues = totalData;
  const minVal = Math.min(...allValues) * 0.97;
  const maxVal = Math.max(...allValues) * 1.03;
  const range = maxVal - minVal || 1;

  const toX = (i: number) => (i / (totalData.length - 1)) * W;
  const toY = (val: number) => PAD_TOP + (1 - (val - minVal) / range) * (H - PAD_TOP - PAD_BOTTOM);

  // Grid lines (3 horizontal)
  const gridYs = [0.25, 0.5, 0.75].map((p) => PAD_TOP + p * (H - PAD_TOP - PAD_BOTTOM));

  // Bank area path
  const bankPoints = bankData.map((v, i) => `${toX(i)},${toY(v)}`).join(" L");
  const bankArea = `M0,${H} L0,${toY(bankData[0])} L${bankPoints} L${W},${toY(bankData[bankData.length - 1])} L${W},${H} Z`;

  // Investment area path (gold, stacked on top of bank)
  let investArea: string | null = null;
  if (investData) {
    const investPoints: string[] = [];
    const bankReverse: string[] = [];
    for (let i = 22; i < 30; i++) {
      investPoints.push(`${toX(i)},${toY(bankData[i] + investData[i])}`);
      bankReverse.unshift(`${toX(i)},${toY(bankData[i])}`);
    }
    investArea = `M${investPoints.join(" L")} L${bankReverse.join(" L")} Z`;
  }

  // Total line points
  const totalPoints = totalData.map((v, i) => `${toX(i)},${toY(v)}`).join(" ");

  // Last point position for animated dot
  const lastX = toX(totalData.length - 1);
  const lastY = toY(totalData[totalData.length - 1]);

  // Estimate path length for draw-in animation
  const totalLength = useMemo(() => {
    let len = 0;
    for (let i = 1; i < totalData.length; i++) {
      const dx = toX(i) - toX(i - 1);
      const dy = toY(totalData[i]) - toY(totalData[i - 1]);
      len += Math.sqrt(dx * dx + dy * dy);
    }
    return Math.ceil(len);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalData]);

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-[120px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="bankGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5682F2" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#5682F2" stopOpacity="0.03" />
          </linearGradient>
          <linearGradient id="investGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F1C086" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#F1C086" stopOpacity="0.03" />
          </linearGradient>
          <filter id="lineGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Horizontal grid lines */}
        {gridYs.map((y, i) => (
          <line key={i} x1="0" y1={y} x2={W} y2={y} stroke="white" opacity="0.04" strokeWidth="1" />
        ))}

        {/* Bank area (blue) */}
        <motion.path
          d={bankArea}
          fill="url(#bankGrad)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Investment area (gold, post-trade only) */}
        {investArea && (
          <motion.path
            d={investArea}
            fill="url(#investGrad)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          />
        )}

        {/* Total line (white, glowing) */}
        <motion.polyline
          points={totalPoints}
          stroke="rgba(255,255,255,0.9)"
          strokeWidth="2"
          fill="none"
          filter="url(#lineGlow)"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ strokeDasharray: totalLength, strokeDashoffset: totalLength }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        />

        {/* Animated end dot */}
        <motion.circle
          cx={lastX}
          cy={lastY}
          r="4"
          fill="white"
          stroke="#F1C086"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: [1, 1.3, 1] }}
          transition={{
            opacity: { duration: 0.3, delay: 1.4 },
            scale: { duration: 2, delay: 1.4, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      </svg>
    </div>
  );
}

/* ============================================
   SHARED ICONS
   ============================================ */

const chevronSvg = (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 text-text-tertiary">
    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* ============================================
   COMPONENT
   ============================================ */

export default function DashboardScreen({
  objectives,
  objectivesRevision,
  onOpenSheet,
  isTouch,
  onToast,
  onNavigateToInvest,
  hasCompletedTrade,
  tradeAmount,
}: DashboardScreenProps) {
  const dragScrollY = useDragScroll("y");
  const [activeInnerTab, setActiveInnerTab] = useState<InnerTab>("feed");

  /* Portfolio values */
  const bankValue = 12_450;
  const investmentValue = hasCompletedTrade ? tradeAmount : 0;
  const totalValue = bankValue + investmentValue;
  const changePercent = hasCompletedTrade ? "+8,42%" : "+0,36%";
  const investPercent = hasCompletedTrade ? Math.round((investmentValue / totalValue) * 100) : 0;
  const bankPercent = 100 - investPercent;

  /* Inner tab config */
  const innerTabs: { id: InnerTab; label: string }[] = [
    { id: "feed", label: "Activité" },
    { id: "insights", label: "Insights" },
    { id: "support", label: "Découverte" },
  ];

  return (
    <motion.div
      ref={!isTouch ? dragScrollY.ref : undefined}
      onMouseDown={!isTouch ? dragScrollY.onMouseDown : undefined}
      onMouseUp={!isTouch ? dragScrollY.onMouseUp : undefined}
      onMouseLeave={!isTouch ? dragScrollY.onMouseLeave : undefined}
      onMouseMove={!isTouch ? dragScrollY.onMouseMove : undefined}
      className="no-scrollbar flex flex-col gap-6 overflow-y-auto px-6 pt-1 pb-28 h-full"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ══════════════════════════════════════════
          1. AT-A-GLANCE HERO
          ══════════════════════════════════════════ */}
      <motion.div variants={fadeUp}>
        {/* Mood greeting */}
        <p className="text-[13px] text-text-muted mb-1">
          {hasCompletedTrade ? "Votre patrimoine s\u2019enrichit" : "Belle dynamique, Jane"}
        </p>

        {/* Patrimoine value */}
        <p className="text-[28px] font-bold text-text-primary leading-tight">
          {totalValue.toLocaleString("fr-FR")},00&nbsp;€
        </p>

        {/* Directional indicator — PERCENTAGE */}
        <div className="mt-1 flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 9V3M6 3L3.5 5.5M6 3L8.5 5.5" stroke="#22C55E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="text-[13px] text-status-gain">
            {changePercent} ce mois
          </span>
        </div>

        {/* PulseLine dataviz */}
        <button onClick={onOpenSheet} className="mt-3 w-full active:opacity-80 transition-opacity">
          <PulseLine hasCompletedTrade={hasCompletedTrade} tradeAmount={tradeAmount} />

          {/* Thin health bar — integrated with dataviz */}
          <div className="mt-1 flex items-center gap-3">
            <div className="h-1 flex-1 rounded-full bg-surface-subtle overflow-hidden flex gap-px">
              <div
                className="rounded-full bg-brand-blue transition-all duration-700"
                style={{ width: `${bankPercent}%` }}
              />
              {hasCompletedTrade && (
                <motion.div
                  className="rounded-full bg-brand-gold transition-all duration-700"
                  style={{ width: `${investPercent}%` }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              )}
            </div>
            {/* Inline dot labels */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
                <span className="text-[10px] text-text-tertiary">
                  {bankValue.toLocaleString("fr-FR")}&nbsp;€
                </span>
              </div>
              {hasCompletedTrade && (
                <motion.div
                  className="flex items-center gap-1"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                  <span className="text-[10px] text-text-tertiary">
                    {investmentValue.toLocaleString("fr-FR")}&nbsp;€
                  </span>
                </motion.div>
              )}
            </div>
          </div>
        </button>
      </motion.div>

      {/* ══════════════════════════════════════════
          2. OBJECTIVES INDICATOR (only if set — no nudge card)
          ══════════════════════════════════════════ */}
      {objectives && (
        <motion.div variants={fadeUp} className="-mt-3">
          <ObjectivesIndicator key={objectivesRevision} objectives={objectives} onEdit={() => onOpenSheet()} />
        </motion.div>
      )}

      {/* ══════════════════════════════════════════
          3. INNER TAB BAR — Golden segmented control
          ══════════════════════════════════════════ */}
      <motion.div variants={fadeUp} className={objectives ? "-mt-2" : "-mt-2"}>
        <div className="flex items-center rounded-full bg-surface-prominent">
          {innerTabs.map((tab, idx) => {
            const isActive = activeInnerTab === tab.id;
            return (
              <div key={tab.id} className="flex items-center flex-1">
                {/* Vertical separator before tab index 2 (between Insights and Découverte) */}
                {idx === 2 && !isActive && activeInnerTab !== "insights" && (
                  <div className="w-px h-3 bg-white/10 shrink-0" />
                )}
                <button
                  onClick={() => setActiveInnerTab(tab.id)}
                  className={`relative flex-1 rounded-full px-3 py-2 text-[13px] font-medium transition-colors ${
                    isActive
                      ? "bg-brand-gold/15 text-brand-gold font-semibold"
                      : "text-text-muted"
                  }`}
                >
                  {tab.label}
                </button>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ══════════════════════════════════════════
          4. TAB CONTENT
          ══════════════════════════════════════════ */}
      <motion.div variants={fadeUp} className="-mt-2">
        {activeInnerTab === "feed" && (
          <FeedTab
            hasCompletedTrade={hasCompletedTrade}
            tradeAmount={tradeAmount}
            investPercent={investPercent}
            onNavigateToInvest={onNavigateToInvest}
            onOpenSheet={onOpenSheet}
            onToast={onToast}
          />
        )}
        {activeInnerTab === "insights" && (
          <InsightsTab
            hasCompletedTrade={hasCompletedTrade}
            onNavigateToInvest={onNavigateToInvest}
            onOpenSheet={onOpenSheet}
            onToast={onToast}
          />
        )}
        {activeInnerTab === "support" && (
          <DecouverteTab
            hasCompletedTrade={hasCompletedTrade}
            tradeAmount={tradeAmount}
            objectives={objectives}
            onNavigateToInvest={onNavigateToInvest}
            onOpenSheet={onOpenSheet}
            onToast={onToast}
          />
        )}
      </motion.div>
    </motion.div>
  );
}

/* ============================================
   PRIORITY TAG
   ============================================ */

function PriorityTag({ type }: { type: "urgent" | "action" }) {
  if (type === "urgent") {
    return (
      <span className="inline-flex items-center rounded-full bg-status-loss/15 px-1.5 py-0.5 text-[10px] font-semibold text-status-loss mr-1">
        Urgent
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-brand-gold/15 px-1.5 py-0.5 text-[10px] font-semibold text-brand-gold mr-1">
      Action
    </span>
  );
}

/* ============================================
   FEED TAB
   ============================================ */

function FeedTab({
  hasCompletedTrade,
  tradeAmount,
  investPercent,
  onNavigateToInvest,
  onOpenSheet,
  onToast,
}: {
  hasCompletedTrade: boolean;
  tradeAmount: number;
  investPercent: number;
  onNavigateToInvest: () => void;
  onOpenSheet: () => void;
  onToast: (msg?: string) => void;
}) {
  const items = useMemo(() => {
    type FeedItem = {
      key: string;
      color: "gold" | "blue" | "green" | "red";
      icon: React.ReactNode;
      title: string;
      subtitle: string;
      priority?: "urgent" | "action";
      action?: () => void;
      hasChevron?: boolean;
    };

    const result: FeedItem[] = [];

    // Item 1 — Sleeping money / Post-trade: investment active
    if (hasCompletedTrade) {
      result.push({
        key: "invest-active",
        color: "green",
        icon: (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M4 8l3 3 5-6" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        title: "CW8 \u00b7 Investissement actif",
        subtitle: `${tradeAmount.toLocaleString("fr-FR")} € \u00b7 Diversifié sur 1 500+ entreprises`,
        action: onNavigateToInvest,
        hasChevron: true,
      });
    } else {
      result.push({
        key: "sleeping-money",
        color: "gold",
        icon: (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1l1.5 3.5L12 7l-3.5 1.5L7 12l-1.5-3.5L2 7l3.5-2.5L7 1z" stroke="#F1C086" strokeWidth="1" strokeLinejoin="round" />
          </svg>
        ),
        title: "Épargne dormante détectée",
        subtitle: "3 200 € dépassent votre épargne de précaution",
        priority: "action",
        action: onNavigateToInvest,
        hasChevron: true,
      });
    }

    // Item 2 — Budget alert (always present)
    result.push({
      key: "budget-alert",
      color: "red",
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M4 2v4c0 1.1.9 2 2 2h.5V12M10 2v10M10 2c0 2-1.5 3-1.5 4.5c0 .8.7 1.5 1.5 1.5" stroke="#EF4444" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Budget restaurants : 85% atteint",
      subtitle: "340 € \u00b7 il reste 60 € ce mois",
      priority: "urgent",
      action: () => onToast(),
      hasChevron: true,
    });

    // Item 3 — Subscription detection
    result.push({
      key: "subscription",
      color: "blue",
      icon: (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <rect x="2.5" y="4" width="11" height="8" rx="1.5" stroke="#5682F2" strokeWidth="1.2" />
          <path d="M5 7.5h6M5 9.5h3" stroke="#5682F2" strokeWidth="1" strokeLinecap="round" />
        </svg>
      ),
      title: "Nouvel abonnement détecté",
      subtitle: "Netflix 17,99 €/mois",
      action: () => onToast(),
      hasChevron: true,
    });

    // Item 4 — Savings opportunity / Post-trade: allocation
    if (hasCompletedTrade) {
      result.push({
        key: "allocation",
        color: "gold",
        icon: (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 11l3-3 2.5 2.5L13 4" stroke="#F1C086" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        title: `Allocation : ${investPercent}% investi`,
        subtitle: "Objectif recommandé : 20-30%",
        priority: "action",
        action: onOpenSheet,
        hasChevron: true,
      });
    } else {
      result.push({
        key: "savings-opportunity",
        color: "green",
        icon: (
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M2 11l3-3 2.5 2.5L13 4" stroke="#22C55E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        title: "Dépenses en baisse de 12%",
        subtitle: "Ce mois vs votre moyenne",
        action: () => onToast(),
        hasChevron: true,
      });
    }

    // Item 5 — Account health
    result.push({
      key: "account-health",
      color: "green",
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2C5.5 2 3 3.5 3 6c0 2.8 4 5 4 5s4-2.2 4-5c0-2.5-2.5-4-4-4z" stroke="#22C55E" strokeWidth="1.2" strokeLinejoin="round" />
        </svg>
      ),
      title: "Épargne de précaution OK",
      subtitle: "3 mois de dépenses couverts",
      action: () => onToast(),
      hasChevron: true,
    });

    // Item 6 — Salary received
    result.push({
      key: "salary",
      color: "blue",
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M7 2v10M4.5 4.5L7 2l2.5 2.5" stroke="#5682F2" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 8h10" stroke="#5682F2" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      ),
      title: "Virement reçu · Salaire",
      subtitle: "2 450 € · Boursorama",
      action: () => onToast(),
      hasChevron: true,
    });

    // Item 7 — Livret A rate info
    result.push({
      key: "livret-a",
      color: "gold",
      icon: (
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="5" stroke="#F1C086" strokeWidth="1.2" />
          <path d="M7 4.5v3l2 1.5" stroke="#F1C086" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ),
      title: "Livret A : taux en baisse",
      subtitle: "2,4% depuis février · 880 € d'intérêts/an",
      action: () => onToast(),
      hasChevron: true,
    });

    return result;
  }, [hasCompletedTrade, tradeAmount, investPercent, onNavigateToInvest, onOpenSheet, onToast]);

  const colorMap = {
    gold: "bg-brand-gold/15",
    blue: "bg-brand-blue/15",
    green: "bg-status-gain/15",
    red: "bg-status-loss/15",
  };

  return (
    <div className="rounded-card-lg bg-surface-default overflow-hidden">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const Wrapper = item.action ? "button" : "div";
        return (
          <Wrapper
            key={item.key}
            {...(item.action ? { onClick: item.action } : {})}
            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
              item.action ? "active:bg-surface-subtle" : ""
            } ${!isLast ? "border-b border-white/5" : ""}`}
          >
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${colorMap[item.color]}`}>
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-text-primary truncate">{item.title}</p>
              <p className="mt-0.5 text-[12px] text-text-muted truncate">
                {item.priority && <PriorityTag type={item.priority} />}
                {item.subtitle}
              </p>
            </div>
            {item.hasChevron && chevronSvg}
          </Wrapper>
        );
      })}
    </div>
  );
}

/* ============================================
   INSIGHTS TAB
   ============================================ */

function InsightsTab({
  hasCompletedTrade,
  onNavigateToInvest,
  onOpenSheet,
  onToast,
}: {
  hasCompletedTrade: boolean;
  onNavigateToInvest: () => void;
  onOpenSheet: () => void;
  onToast: (msg?: string) => void;
}) {
  const items = useMemo(() => {
    type InsightItem = {
      key: string;
      tag: string;
      title: string;
      body: string;
      action: () => void;
    };

    const result: InsightItem[] = [];

    if (hasCompletedTrade) {
      result.push({
        key: "portfolio",
        tag: "Analyse",
        title: "Votre portefeuille",
        body: "CW8 vous expose à 1 500+ entreprises dans 23 pays. Diversification optimale pour un premier investissement.",
        action: onNavigateToInvest,
      });
      result.push({
        key: "performance",
        tag: "Comparaison",
        title: "Performance vs profils similaires",
        body: "Votre portefeuille surperforme 68% des profils similaires sur Finary. Bon début.",
        action: () => onToast(),
      });
      result.push({
        key: "next-step",
        tag: "Stratégie",
        title: "Prochaine étape",
        body: "8% de votre patrimoine est investi. Les experts recommandent 20-30% pour une croissance optimale.",
        action: onOpenSheet,
      });
      result.push({
        key: "fees",
        tag: "Optimisation",
        title: "Optimisation des frais",
        body: "En passant par Finary Brokerage, vous économisez jusqu'à 45 €/an en frais de transaction.",
        action: () => onToast(),
      });
    } else {
      result.push({
        key: "sleeping-money",
        tag: "Opportunité",
        title: "Épargne dormante",
        body: "3 200 € sur votre compte courant dépassent votre épargne de précaution. C'est le moment de les faire travailler.",
        action: onNavigateToInvest,
      });
      result.push({
        key: "market-context",
        tag: "Marchés",
        title: "Marchés européens au plus haut",
        body: "Les marchés européens au plus haut depuis 18 mois. Ce que ça signifie pour votre épargne et vos investissements.",
        action: () => onToast(),
      });
      result.push({
        key: "similar-profiles",
        tag: "Comparaison",
        title: "Profil similaire au vôtre",
        body: "73% des utilisateurs avec un patrimoine comparable investissent régulièrement via un ETF monde.",
        action: onNavigateToInvest,
      });
      result.push({
        key: "fees",
        tag: "Optimisation",
        title: "Optimisation des frais",
        body: "En passant par Finary Brokerage, vous économisez jusqu'à 45 €/an en frais de transaction.",
        action: () => onToast(),
      });
    }

    return result;
  }, [hasCompletedTrade, onNavigateToInvest, onOpenSheet, onToast]);

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <button
          key={item.key}
          onClick={item.action}
          className="w-full rounded-card-lg bg-surface-default p-4 text-left transition-colors active:bg-surface-subtle"
        >
          <p className="text-[10px] font-medium uppercase tracking-wider text-text-tertiary mb-1">{item.tag}</p>
          <p className="text-[15px] font-semibold text-text-primary">{item.title}</p>
          <p className="mt-1 text-[13px] text-text-muted leading-relaxed">{item.body}</p>
        </button>
      ))}
    </div>
  );
}

/* ============================================
   DÉCOUVERTE TAB (was Support/Accompagnement)
   ============================================ */

function DecouverteTab({
  hasCompletedTrade,
  tradeAmount,
  objectives,
  onNavigateToInvest,
  onOpenSheet,
  onToast,
}: {
  hasCompletedTrade: boolean;
  tradeAmount: number;
  objectives: ObjectivesData | null;
  onNavigateToInvest: () => void;
  onOpenSheet: () => void;
  onToast: (msg?: string) => void;
}) {
  type SupportItem = {
    key: string;
    done: boolean;
    title: string;
    subtitle: string;
    action?: () => void;
    hasChevron: boolean;
  };

  const items: SupportItem[] = [
    {
      key: "accounts",
      done: true,
      title: "Comptes synchronisés",
      subtitle: "Boursorama \u00b7 Livret A",
      hasChevron: false,
    },
    {
      key: "first-invest",
      done: hasCompletedTrade,
      title: "Premier investissement",
      subtitle: hasCompletedTrade ? `CW8 \u00b7 ${tradeAmount.toLocaleString("fr-FR")} €` : "Commencez avec un ETF",
      action: hasCompletedTrade ? undefined : onNavigateToInvest,
      hasChevron: !hasCompletedTrade,
    },
    {
      key: "objectives",
      done: !!objectives,
      title: "Objectifs définis",
      subtitle: objectives ? "Recommandations actives" : "Personnalisez vos recommandations",
      action: objectives ? undefined : onOpenSheet,
      hasChevron: !objectives,
    },
    {
      key: "learn-etf",
      done: false,
      title: "Comprendre les ETF",
      subtitle: "Les bases en 2 minutes",
      action: () => onToast(),
      hasChevron: true,
    },
    {
      key: "referral",
      done: false,
      title: "Inviter un proche",
      subtitle: "2 mois offerts pour vous deux",
      action: () => onToast(),
      hasChevron: true,
    },
  ];

  return (
    <div className="rounded-card-lg bg-surface-default overflow-hidden">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const Wrapper = item.action ? "button" : "div";
        return (
          <Wrapper
            key={item.key}
            {...(item.action ? { onClick: item.action } : {})}
            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
              item.action ? "active:bg-surface-subtle" : ""
            } ${!isLast ? "border-b border-white/5" : ""}`}
          >
            {/* Completion circle */}
            <div
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                item.done ? "border-status-gain bg-status-gain/20" : "border-white/20"
              }`}
            >
              {item.done && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2.5 5l2 2 3-3.5" stroke="#22C55E" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[14px] font-medium truncate ${item.done ? "text-text-muted" : "text-text-primary"}`}>
                {item.title}
              </p>
              <p className="text-[12px] text-text-muted truncate">{item.subtitle}</p>
            </div>
            {item.hasChevron && chevronSvg}
          </Wrapper>
        );
      })}
    </div>
  );
}

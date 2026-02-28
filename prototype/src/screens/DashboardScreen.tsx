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
   HEALTH BOXES DATAVIZ (4 square cards)
   ============================================ */

// Mini sparkline — 7 data points, line draws in
function MiniSparkline({ data, animate, delay = 0 }: { data: number[]; animate: boolean; delay?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 44;
  const h = 18;
  const points = data
    .map((v, i) => {
      const x = 1 + (i / (data.length - 1)) * (w - 2);
      const y = h - 1 - ((v - min) / range) * (h - 2);
      return `${Math.round(x * 10) / 10},${Math.round(y * 10) / 10}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <motion.polyline
        points={points}
        stroke="#F1C086"
        strokeOpacity="0.65"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        initial={animate ? { pathLength: 0 } : undefined}
        animate={animate ? { pathLength: 1 } : undefined}
        transition={{ duration: 0.7, delay, ease: "easeInOut" }}
      />
    </svg>
  );
}

// Circular arc gauge — arc sweeps in
function MiniGauge({ percent, animate, delay = 0 }: { percent: number; animate: boolean; delay?: number }) {
  const s = 22;
  const sw = 2;
  const r = (s - sw) / 2;
  const c = 2 * Math.PI * r;
  const fill = (percent / 100) * c;
  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
      <circle cx={s / 2} cy={s / 2} r={r} stroke="white" strokeOpacity="0.10" strokeWidth={sw} fill="none" />
      <motion.circle
        cx={s / 2} cy={s / 2} r={r}
        stroke="#F1C086" strokeOpacity="0.60" strokeWidth={sw} fill="none"
        strokeLinecap="round"
        transform={`rotate(-90 ${s / 2} ${s / 2})`}
        initial={animate ? { strokeDasharray: `0 ${Math.round(c * 10) / 10}` } : undefined}
        animate={animate ? { strokeDasharray: `${Math.round(fill * 10) / 10} ${Math.round((c - fill) * 10) / 10}` } : undefined}
        transition={{ duration: 0.7, delay, ease: "easeInOut" }}
      />
    </svg>
  );
}

// Vertical bars — grow up sequentially
function MiniBars({ filled, total, animate, delay = 0 }: { filled: number; total: number; animate: boolean; delay?: number }) {
  return (
    <div className="flex gap-[5px] items-end h-[18px]">
      {Array.from({ length: total }).map((_, i) => {
        const targetH = 6 + (i / (total - 1)) * 12;
        return (
          <motion.div key={i} className="w-[2px] rounded-[0.5px]"
            style={{
              backgroundColor: i < filled ? "rgba(241,192,134,0.60)" : "rgba(255,255,255,0.10)",
            }}
            initial={animate ? { height: 0 } : { height: targetH }}
            animate={{ height: targetH }}
            transition={{ duration: 0.45, delay: delay + i * 0.06, ease: "easeInOut" }}
          />
        );
      })}
    </div>
  );
}

// Horizontal stacked bar — fills from left
function MiniStackBar({ percent, animate, delay = 0 }: { percent: number; animate: boolean; delay?: number }) {
  return (
    <div className="relative w-10 h-[2px] rounded-full overflow-hidden bg-white/[0.12]">
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ backgroundColor: "rgba(241,192,134,0.65)" }}
        initial={animate ? { width: "0%" } : { width: `${percent}%` }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.6, delay, ease: "easeInOut" }}
      />
    </div>
  );
}

function HealthBoxes({ hasCompletedTrade, investPercent }: { hasCompletedTrade: boolean; investPercent: number }) {
  const sparkData = [9050, 9020, 9180, 9120, 9200, 9150, 9200];
  const budgetUsed = 72;
  const epargneMonths = 3;
  const epargneTotal = 6;
  const investPct = hasCompletedTrade ? investPercent : 25;

  const boxes = [
    { label: "Compte", viz: (d: number) => <MiniSparkline data={sparkData} animate delay={d} />, value: "9 200 €" },
    { label: "Budget", viz: (d: number) => <MiniGauge percent={budgetUsed} animate delay={d} />, value: `${budgetUsed}%` },
    { label: "Épargne", viz: (d: number) => <MiniBars filled={epargneMonths} total={epargneTotal} animate delay={d} />, value: `${epargneMonths} mois` },
    { label: "Invest.", viz: (d: number) => <MiniStackBar percent={investPct} animate delay={d} />, value: hasCompletedTrade ? `${investPct}%` : "3 800 €" },
  ];

  return (
    <div className="grid grid-cols-4 gap-2">
      {boxes.map((box, idx) => (
        <div
          key={box.label}
          className="flex flex-col items-center rounded-xl bg-white/[0.05] py-4 px-2"
        >
          <span className="text-[9px] font-medium tracking-wide uppercase text-white/40">{box.label}</span>
          <div className="flex-1 flex items-center justify-center py-2">
            {box.viz(0.3 + idx * 0.18)}
          </div>
          <p className="text-[11px] font-semibold text-white/80">{box.value}</p>
        </div>
      ))}
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
  // changePercent now inlined in JSX
  // Always show a visual split — fake 75/25 pre-trade, real ratio post-trade
  const investPercent = hasCompletedTrade ? Math.round((investmentValue / totalValue) * 100) : 25;
  const bankPercent = 100 - investPercent;

  /* Inner tab config */
  const innerTabs: { id: InnerTab; label: string }[] = [
    { id: "feed", label: "Activité" },
    { id: "insights", label: "Infos" },
    { id: "support", label: "À faire" },
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
          1. AT-A-GLANCE HERO — Text + Health Boxes
          ══════════════════════════════════════════ */}
      <motion.div variants={fadeUp} className="flex flex-col items-center">
        {/* Mood greeting */}
        <p className="text-[13px] text-white/35 mb-0.5">
          {hasCompletedTrade ? "Votre patrimoine s\u2019enrichit" : "Belle dynamique, Jane"}
        </p>

        {/* Patrimoine value */}
        <p className="text-[32px] font-bold text-white/90 leading-tight">
          {totalValue.toLocaleString("fr-FR")},00&nbsp;€
        </p>

        {/* Directional indicator — gold accent */}
        <span className="mt-0.5 text-[13px] text-brand-gold/70">
          {hasCompletedTrade ? "+8,42%" : "+3,4%"} ce mois
        </span>

        {/* Health Boxes */}
        <div className="mt-8 w-full">
          <HealthBoxes hasCompletedTrade={hasCompletedTrade} investPercent={investPercent} />
        </div>
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

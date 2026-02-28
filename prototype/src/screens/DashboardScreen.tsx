"use client";

import { useRef, useCallback } from "react";
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
   FEED ITEM DATA
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

  /* Portfolio values */
  const bankValue = 12_450;
  const investmentValue = hasCompletedTrade ? tradeAmount : 0;
  const totalValue = bankValue + investmentValue;
  const changeAmount = hasCompletedTrade ? 1_045 : 45;
  const changePercent = hasCompletedTrade ? "+8,42%" : "+0,36%";
  const investPercent = hasCompletedTrade ? Math.round((investmentValue / totalValue) * 100) : 0;
  const bankPercent = 100 - investPercent;

  return (
    <motion.div
      ref={!isTouch ? dragScrollY.ref : undefined}
      onMouseDown={!isTouch ? dragScrollY.onMouseDown : undefined}
      onMouseUp={!isTouch ? dragScrollY.onMouseUp : undefined}
      onMouseLeave={!isTouch ? dragScrollY.onMouseLeave : undefined}
      onMouseMove={!isTouch ? dragScrollY.onMouseMove : undefined}
      className="no-scrollbar flex flex-col gap-8 overflow-y-auto px-6 pt-1 pb-28 h-full"
      variants={stagger}
      initial="hidden"
      animate="show"
    >
      {/* ── Greeting ── */}
      <motion.h1
        variants={fadeUp}
        className="text-[22px] font-semibold leading-7 text-white/60"
      >
        Bonjour, Jane
      </motion.h1>

      {/* ── Patrimoine Value ── */}
      <motion.div variants={fadeUp} className="-mt-4">
        <p className="text-[28px] font-bold text-text-primary">
          {totalValue.toLocaleString("fr-FR")},00&nbsp;€
        </p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-[13px] text-status-gain">
            +{changeAmount.toLocaleString("fr-FR")},00&nbsp;€ ({changePercent})
          </span>
        </div>
        <p className="mt-0.5 text-[11px] text-text-tertiary">Depuis 30 jours</p>
      </motion.div>

      {/* ── Health Bar ── */}
      <motion.div variants={fadeUp} className="-mt-4">
        <button
          onClick={onOpenSheet}
          className="w-full text-left active:opacity-80 transition-opacity"
        >
          {/* Bar track */}
          <div className="h-2.5 w-full rounded-full bg-surface-subtle overflow-hidden flex gap-0.5">
            <div
              className="rounded-full bg-brand-blue transition-all duration-700"
              style={{ width: `${bankPercent}%` }}
            />
            {hasCompletedTrade && (
              <motion.div
                className="rounded-full bg-brand-gold"
                initial={{ width: 0 }}
                animate={{ width: `${investPercent}%` }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              />
            )}
          </div>

          {/* Legend */}
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-brand-blue" />
              <span className="text-[11px] text-text-muted">Comptes bancaires</span>
              <span className="text-[11px] text-text-secondary">
                {bankValue.toLocaleString("fr-FR")}&nbsp;€
              </span>
            </div>
            {hasCompletedTrade && (
              <motion.div
                className="flex items-center gap-2"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <div className="h-2 w-2 rounded-full bg-brand-gold" />
                <span className="text-[11px] text-text-muted">Investissements</span>
                <span className="text-[11px] text-text-secondary">
                  {investmentValue.toLocaleString("fr-FR")}&nbsp;€
                </span>
              </motion.div>
            )}
          </div>
        </button>
      </motion.div>

      {/* ── Objectives: Nudge or Indicator ── */}
      <motion.div variants={fadeUp} className={objectives ? "-mt-5" : "-mt-4"}>
        {objectives ? (
          <ObjectivesIndicator key={objectivesRevision} objectives={objectives} onEdit={() => onOpenSheet()} />
        ) : (
          <button
            onClick={() => onOpenSheet()}
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
                  Personnalisez vos recommandations
                </p>
              </div>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-brand-gold">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </button>
        )}
      </motion.div>

      {/* ── Smart Feed — "Votre fil" ── */}
      <motion.section variants={fadeUp}>
        <h2 className="mb-4 text-lg font-semibold leading-tight text-text-primary">
          Votre fil
        </h2>

        <div className="flex flex-col gap-3">
          {/* Item 1 — AI Insight (promoted) */}
          {hasCompletedTrade ? (
            /* Post-trade: success card */
            <button
              onClick={onNavigateToInvest}
              className="relative w-full rounded-card-lg border border-brand-gold/30 p-4 text-left transition-colors active:bg-surface-subtle"
            >
              {/* IA pill */}
              <div className="absolute top-3 right-3 rounded-full bg-brand-gold/15 px-2 py-0.5">
                <span className="text-[10px] font-semibold text-brand-gold">IA</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-status-gain/10">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M6 10l3 3 5-6" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <p className="text-[15px] font-semibold text-text-primary">
                    Votre premier investissement est actif
                  </p>
                  <p className="mt-1 text-[13px] text-text-muted leading-relaxed">
                    CW8 · Amundi MSCI World · {tradeAmount.toLocaleString("fr-FR")}&nbsp;€.
                    Votre portefeuille est diversifié sur 1&nbsp;500+ entreprises.
                  </p>
                </div>
              </div>
            </button>
          ) : (
            /* Pre-trade: AI insight */
            <button
              onClick={onNavigateToInvest}
              className="relative w-full rounded-card-lg bg-surface-default p-4 text-left transition-colors active:bg-surface-prominent"
            >
              {/* IA pill */}
              <div className="absolute top-3 right-3 rounded-full bg-brand-gold/15 px-2 py-0.5">
                <span className="text-[10px] font-semibold text-brand-gold">IA</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gold/10">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2l1.5 4.5L16 8l-4.5 1.5L10 14l-1.5-4.5L4 8l4.5-1.5L10 2z" stroke="#F1C086" strokeWidth="1.2" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <p className="text-[15px] font-semibold text-text-primary">
                    Le bon moment pour commencer
                  </p>
                  <p className="mt-1 text-[13px] text-text-muted leading-relaxed">
                    Les marchés européens ont gagné +8% cette année.
                    73% des utilisateurs Finary investissent régulièrement.
                  </p>
                </div>
              </div>
            </button>
          )}

          {/* Item 2 — Markets */}
          <button
            onClick={() => onToast()}
            className="flex w-full items-center gap-3 rounded-card-lg bg-surface-default px-4 py-3.5 text-left transition-colors active:bg-surface-prominent"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-prominent">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M2 14l4-4 3 3 7-8" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-medium text-text-primary">Marchés aujourd&apos;hui</p>
              <p className="text-[13px] text-text-muted">CAC 40 +0,64% · S&P 500 -0,42%</p>
            </div>
            {chevronSvg}
          </button>

          {/* Item 3 — Social proof / Post-trade portfolio insight */}
          {hasCompletedTrade ? (
            <button
              onClick={onOpenSheet}
              className="flex w-full items-center gap-3 rounded-card-lg bg-surface-default px-4 py-3.5 text-left transition-colors active:bg-surface-prominent"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gold/10">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <path d="M2 14l4-4 3 3 7-8" stroke="#F1C086" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium text-text-primary">
                  {investPercent}% de votre patrimoine est investi
                </p>
                <p className="text-[13px] text-text-muted">Objectif recommandé : 20-30%</p>
              </div>
              {chevronSvg}
            </button>
          ) : (
            <button
              onClick={onNavigateToInvest}
              className="flex w-full items-center gap-3 rounded-card-lg bg-surface-default px-4 py-3.5 text-left transition-colors active:bg-surface-prominent"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-prominent">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                  <circle cx="7" cy="8" r="3" stroke="white" strokeWidth="1.3" opacity="0.5" />
                  <circle cx="13" cy="8" r="3" stroke="white" strokeWidth="1.3" opacity="0.5" />
                  <path d="M2 16c0-2.5 2-4.5 5-4.5s5 2 5 4.5" stroke="white" strokeWidth="1.3" opacity="0.5" />
                  <path d="M13 16c0-2.5 2-4.5 5-4.5" stroke="white" strokeWidth="1.3" opacity="0.5" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium text-text-primary">2 847 premiers investissements ce mois</p>
                <p className="text-[13px] text-text-muted">Rejoignez la communauté Finary</p>
              </div>
              {chevronSvg}
            </button>
          )}

          {/* Item 4 — Educational */}
          <button
            onClick={() => onToast()}
            className="flex w-full items-center gap-3 rounded-card-lg bg-surface-default px-4 py-3.5 text-left transition-colors active:bg-surface-prominent"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-prominent">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M3 4h4c1.5 0 3 1 3 2.5V17c0-1-1-2-2.5-2H3V4z" stroke="white" strokeWidth="1.3" strokeLinejoin="round" opacity="0.5" />
                <path d="M17 4h-4c-1.5 0-3 1-3 2.5V17c0-1 1-2 2.5-2H17V4z" stroke="white" strokeWidth="1.3" strokeLinejoin="round" opacity="0.5" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-medium text-text-primary">ETF : comprendre en 2 minutes</p>
              <p className="text-[13px] text-text-muted">Le placement préféré des investisseurs</p>
            </div>
            {chevronSvg}
          </button>

          {/* Item 5 — Account health */}
          <div className="flex w-full items-center gap-3 rounded-card-lg bg-surface-default px-4 py-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-prominent">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="5" width="16" height="11" rx="2" stroke="white" strokeWidth="1.3" opacity="0.5" />
                <line x1="2" y1="9" x2="18" y2="9" stroke="white" strokeWidth="1.3" opacity="0.5" />
              </svg>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-medium text-status-gain">Épargne de précaution OK</p>
              <p className="text-[13px] text-text-muted">3 mois de dépenses couvertes</p>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}

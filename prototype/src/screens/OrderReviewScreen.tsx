"use client";

import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, type MotionValue } from "framer-motion";
import { assetDatabase } from "@/screens/AssetDetailScreen";

/* ============================================
   TYPES
   ============================================ */

interface OrderReviewScreenProps {
  ticker: string;
  amount: number;
  onBack: () => void;
  onConfirm: () => void;
  isTouch?: boolean;
  sharedDragX?: MotionValue<number>;
}

/* ============================================
   CLARITY TOOLTIP (dashed underline terms)
   ============================================ */

function ClarityTerm({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-white underline decoration-dotted decoration-white/40 underline-offset-2 cursor-help">
      {children}
    </span>
  );
}

/* ============================================
   SCREEN COMPONENT
   ============================================ */

export default function OrderReviewScreen({
  ticker,
  amount,
  onBack,
  onConfirm,
  isTouch = false,
  sharedDragX,
}: OrderReviewScreenProps) {
  const asset = assetDatabase[ticker];
  if (!asset) return null;

  const [accepted, setAccepted] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  /* Drag-to-go-back */
  const dragX = sharedDragX ?? useMotionValue(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDraggingX, setIsDraggingX] = useState(false);

  const handleBackButton = useCallback(() => {
    onBack();
  }, [onBack]);

  /* Swipe-right-to-go-back (same pattern as other screens) */
  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      setIsDraggingX(false);
      const { offset, velocity } = info;
      if (offset.x > 140 || (offset.x > 50 && velocity.x > 200)) {
        onBack();
      } else {
        dragX.set(0);
      }
    },
    [onBack, dragX],
  );

  /* Risk level from asset database */
  const riskLevel = asset.riskLevel ?? 4;

  /* Fee data */
  const terPercent = parseFloat(asset.ter?.replace(",", ".").replace("%", "") ?? "0.38");
  const terAmount = ((amount * terPercent) / 100).toFixed(2).replace(".", ",");
  const spreadEstimate = (amount * 0.001).toFixed(2).replace(".", ",");

  return (
    <motion.div
      className="absolute inset-0 flex flex-col bg-transparent"
      drag={!isTouch ? "x" : undefined}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={{ left: 0, right: 0.5 }}
      dragDirectionLock
      style={{ x: dragX }}
      onDragStart={() => setIsDraggingX(true)}
      onDragEnd={handleDragEnd}
    >
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 pb-2 pt-3">
        <button
          onClick={handleBackButton}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors active:bg-surface-subtle"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="text-[15px] font-semibold text-text-primary">Vérification</p>
        <div className="w-10" />
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className={`flex-1 min-h-0 overflow-y-auto px-6 pb-[104px] ${isDraggingX ? "overflow-hidden" : ""}`}
      >
        {/* Order summary card */}
        <div className="rounded-2xl bg-surface-default p-4">
          <p className="text-[15px] font-medium text-text-primary mb-3">Récapitulatif de l&apos;ordre</p>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-prominent">
              <span className="text-[10px] font-semibold text-white/90">
                {ticker.slice(0, 2).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <p className="text-[15px] font-medium text-text-primary">{asset.name}</p>
              <p className="text-[11px] text-text-muted">{asset.subtitle}</p>
            </div>
            <p className="text-[15px] font-semibold text-text-primary">
              {amount.toLocaleString("fr-FR")},00 €
            </p>
          </div>

          <div className="h-px bg-white/5" />

          <div className="flex items-center justify-between py-2">
            <span className="text-[13px] text-text-muted">Type d&apos;ordre</span>
            <span className="text-[13px] text-text-secondary">Ordre au marché</span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex items-center justify-between py-2">
            <span className="text-[13px] text-text-muted">Lieu d&apos;exécution</span>
            <span className="text-[13px] text-text-secondary">Euronext Paris</span>
          </div>
        </div>

        {/* KID / DICI Summary */}
        <div className="rounded-2xl bg-surface-default p-4 mt-3">
          <div className="flex items-center gap-2 mb-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="7" stroke="#8E8E93" strokeWidth="1.2" />
              <path d="M8 7v4" stroke="#8E8E93" strokeWidth="1.2" strokeLinecap="round" />
              <circle cx="8" cy="5" r="0.8" fill="#8E8E93" />
            </svg>
            <p className="text-[15px] font-medium text-text-primary">
              <ClarityTerm>Document d&apos;informations clés</ClarityTerm>
            </p>
          </div>

          <p className="text-[13px] text-text-muted leading-relaxed mb-3">
            Ce produit est un <ClarityTerm>ETF UCITS</ClarityTerm> qui réplique l&apos;indice MSCI World.
            Il est conçu pour les investisseurs qui acceptent un niveau de risque modéré à élevé
            sur un horizon de placement recommandé d&apos;au moins 5 ans.
          </p>

          {/* Risk indicator (SRI scale 1-7) */}
          <div className="mb-3">
            <p className="text-[13px] text-text-muted mb-2">
              <ClarityTerm>Indicateur de risque</ClarityTerm> (SRI)
            </p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((level) => (
                <div
                  key={level}
                  className={`flex-1 h-2 rounded-full ${
                    level <= riskLevel
                      ? level <= 2
                        ? "bg-emerald-500/80"
                        : level <= 4
                          ? "bg-amber-400/80"
                          : "bg-red-400/80"
                      : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-text-tertiary">Risque faible</span>
              <span className="text-[10px] text-text-tertiary">{riskLevel}/7</span>
              <span className="text-[10px] text-text-tertiary">Risque élevé</span>
            </div>
          </div>

          <p className="text-[13px] text-text-muted leading-relaxed">
            Vous pourriez perdre tout ou partie de votre investissement. Ce produit ne comporte aucune protection
            du capital.
          </p>
        </div>

        {/* Cost transparency */}
        <div className="rounded-2xl bg-surface-default p-4 mt-3">
          <p className="text-[15px] font-medium text-text-primary mb-3">
            <ClarityTerm>Transparence des coûts</ClarityTerm>
          </p>

          {[
            { label: "Frais de transaction", value: "0,00 €" },
            { label: "Frais courants (TER)", value: `${terAmount} € / an` },
            { label: "Spread estimé", value: `~${spreadEstimate} €` },
          ].map((row, i, arr) => (
            <div key={row.label}>
              <div className="flex items-center justify-between py-2">
                <span className="text-[13px] text-text-muted">{row.label}</span>
                <span className="text-[13px] text-text-secondary">{row.value}</span>
              </div>
              {i < arr.length - 1 && <div className="h-px bg-white/5" />}
            </div>
          ))}

          <div className="h-px bg-white/10 mt-1 mb-2" />
          <div className="flex items-center justify-between">
            <span className="text-[13px] font-medium text-text-primary">Coût total estimé la 1ère année</span>
            <span className="text-[13px] font-semibold text-text-primary">
              {terAmount} €
            </span>
          </div>
        </div>

        {/* Terms checkbox */}
        <div
          className={`flex items-start gap-3 mt-4 text-left rounded-2xl border p-4 transition-colors ${
            accepted
              ? "border-brand-gold/50 bg-brand-gold/5"
              : showWarning
                ? "bg-transparent animate-border-pulse"
                : "border-brand-gold/40 bg-transparent"
          }`}
        >
          <button
            onClick={() => {
              setAccepted(!accepted);
              if (!accepted) setShowWarning(false);
            }}
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
              accepted
                ? "border-brand-gold bg-brand-gold"
                : "border-brand-gold bg-transparent"
            }`}
          >
            {accepted && (
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2.5 6l2.5 2.5 4.5-5" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
          <p className="text-[13px] text-white/70 leading-relaxed">
            J&apos;ai lu le <ClarityTerm>Document d&apos;informations clés</ClarityTerm> et
            je comprends les risques associés à cet investissement. J&apos;accepte les{" "}
            <ClarityTerm>conditions générales</ClarityTerm> de Invest Brokerage.
          </p>
        </div>

        {/* Warning message — shown when tapping CTA without accepting */}
        {showWarning && (
          <p className="mt-4 text-[13px] text-status-warning text-center">
            Veuillez accepter les conditions avant de confirmer.
          </p>
        )}

        {/* CTA — always active, shows warning if not accepted */}
        <button
          onClick={() => {
            if (accepted) {
              onConfirm();
            } else {
              setShowWarning(true);
              // Scroll down so CTA stays in view after warning message appears
              setTimeout(() => {
                scrollRef.current?.scrollBy({ top: 60, behavior: "smooth" });
              }, 50);
            }
          }}
          className="mt-5 w-full rounded-full py-3.5 text-[15px] font-semibold bg-brand-gold text-black active:opacity-80 transition-all"
        >
          Confirmer et passer l&apos;ordre
        </button>
      </div>
    </motion.div>
  );
}

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useMotionValue, animate as fmAnimate, type MotionValue } from "framer-motion";
import { assetDatabase } from "@/screens/AssetDetailScreen";
import type { ObjectivesData } from "@/components/ObjectivesSheet";

/* ============================================
   TYPES
   ============================================ */

interface OrderScreenProps {
  ticker: string;
  onBack: () => void;
  isTouch?: boolean;
  sharedDragX?: MotionValue<number>;
  onToast?: (msg?: string) => void;
  objectives?: ObjectivesData | null;
  onConfirmOrder?: (amount: number) => void;
}

/* ============================================
   CONSTANTS
   ============================================ */

const presetAmounts = [100, 500, 1000];

/* ============================================
   SCREEN COMPONENT
   ============================================ */

export default function OrderScreen({ ticker, onBack, isTouch = false, sharedDragX, onToast, objectives, onConfirmOrder }: OrderScreenProps) {
  const asset = assetDatabase[ticker];
  if (!asset) return null;

  /* Amount state — pre-fill from objectives or default 1000 */
  const initialAmount = objectives?.amount ?? 1000;
  const [amount, setAmount] = useState(initialAmount);
  const [showCustom, setShowCustom] = useState(
    !presetAmounts.includes(initialAmount)
  );
  const [customAmount, setCustomAmount] = useState(
    !presetAmounts.includes(initialAmount) ? String(initialAmount) : ""
  );

  /* Drag-to-go-back */
  const dragX = sharedDragX ?? useMotionValue(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDraggingX, setIsDraggingX] = useState(false);

  const handleBackButton = useCallback(() => {
    onBack();
  }, [onBack]);

  /* Touch swipe-back (mobile) */
  useEffect(() => {
    if (!isTouch) return;
    const el = scrollRef.current;
    if (!el) return;

    let startX = 0;
    let startY = 0;
    let dragging = false;
    let decided = false;
    let velX = 0;
    let lastX = 0;
    let lastT = 0;

    const onStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dragging = false;
      decided = false;
      velX = 0;
      lastX = startX;
      lastT = performance.now();
    };

    const onMove = (e: TouchEvent) => {
      const cx = e.touches[0].clientX;
      const cy = e.touches[0].clientY;
      const dx = cx - startX;
      const dy = cy - startY;

      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) velX = ((cx - lastX) / dt) * 1000;
      lastX = cx;
      lastT = now;

      if (!decided && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        decided = true;
        dragging = dx > 0 && Math.abs(dx) > Math.abs(dy) * 1.2;
        if (dragging) setIsDraggingX(true);
      }

      if (dragging) {
        e.preventDefault();
        dragX.set(Math.max(0, dx));
      }
    };

    const onEnd = () => {
      if (dragging) {
        setIsDraggingX(false);
        const cx = dragX.get();
        if (cx > 140 || (cx > 50 && velX > 500)) {
          fmAnimate(dragX, 393, {
            type: "tween",
            duration: 0.2,
            ease: [0.32, 0.72, 0, 1],
            onComplete: () => onBack(),
          });
        } else {
          fmAnimate(dragX, 0, {
            type: "tween",
            duration: 0.25,
            ease: [0.32, 0.72, 0, 1],
          });
        }
      }
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });

    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, [isTouch, dragX, onBack]);

  /* Parse numeric price for fee calculation */
  const numericPrice = parseFloat(asset.price.replace(/[^\d,]/g, "").replace(",", "."));
  const terPercent = parseFloat(asset.ter.replace(",", ".").replace("%", ""));
  const estimatedTer = ((amount * terPercent) / 100).toFixed(2).replace(".", ",");
  const spreadPercent = 0.10;
  const estimatedSpread = ((amount * spreadPercent) / 100).toFixed(2).replace(".", ",");
  const totalCost = amount;

  const feeRows = [
    { label: "Frais de transaction", value: "0,00 €", muted: false },
    { label: "Frais de gestion (TER)", value: `${estimatedTer} € / an`, muted: false },
    { label: "Spread estimé", value: `~${estimatedSpread} €`, muted: false },
  ];

  return (
    <motion.div
      ref={scrollRef}
      className="relative flex h-full flex-col"
      style={{ x: dragX }}
    >

      {/* Header — fixed top */}
      <div className="shrink-0 flex items-center justify-between px-4 pb-2 pt-3">
        <button
          onClick={handleBackButton}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors active:bg-surface-subtle"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="text-[15px] font-semibold text-text-primary">Passer un ordre</p>
        <button
          onClick={handleBackButton}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors active:bg-surface-subtle"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4l10 10M14 4L4 14" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Content — bottom-up layout: CTA anchored → fees → amount → asset fills remaining */}
      <div className={`flex-1 min-h-0 overflow-y-auto ${isDraggingX ? "overflow-hidden" : ""}`}>
        <div className="flex min-h-full flex-col px-6 pb-[104px]">

          {/* ── Asset zone — fills remaining space, content centered ── */}
          <div className="flex-1 min-h-0 flex items-center justify-center">
            {/* Vertical (default — tall screens) */}
            <div className="flex-col items-center justify-center hidden tall:flex">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-prominent mb-3">
                <span className="text-[13px] font-semibold text-white/90">{asset.ticker.slice(0, 2).toUpperCase()}</span>
              </div>
              <p className="text-[17px] font-medium text-text-primary">{asset.name}</p>
              <p className="text-[12px] text-text-muted mt-0.5">{asset.subtitle}</p>
              <p className="text-[17px] font-semibold text-text-primary mt-1.5">{asset.price}</p>
            </div>
            {/* Horizontal compact (short screens like iPhone SE) */}
            <div className="flex w-full items-center gap-3 tall:hidden">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-prominent">
                <span className="text-[10px] font-semibold text-white/90">{asset.ticker.slice(0, 2).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-medium text-text-primary truncate">{asset.name}</p>
                <p className="text-[11px] text-text-muted">{asset.subtitle}</p>
              </div>
              <p className="text-[15px] font-semibold text-text-primary shrink-0">{asset.price}</p>
            </div>
          </div>

          {/* ── Bottom group — amount + fees + CTA, fixed spacing between them ── */}
          <div className="shrink-0">

            {/* Amount input — inset on tall screens, full width on short */}
            <div className="mb-5 tall:px-6">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    const next = Math.max(0, amount - 50);
                    setAmount(next);
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-gold/40 bg-black/30 text-brand-gold transition-colors active:bg-surface-prominent"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <div className="flex h-11 flex-1 items-center justify-center gap-1 rounded-xl border border-brand-gold/40 bg-black/40 px-4">
                  <input
                    type="number"
                    value={amount || ""}
                    onChange={(e) => {
                      const num = parseInt(e.target.value);
                      setAmount(!isNaN(num) && num > 0 ? num : 0);
                    }}
                    placeholder="0"
                    inputMode="numeric"
                    className="w-full bg-transparent text-center text-lg text-text-primary outline-none [appearance:textfield] placeholder:text-text-tertiary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="text-lg text-text-muted">€</span>
                </div>
                <button
                  onClick={() => {
                    setAmount(amount + 50);
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-brand-gold/40 bg-black/30 text-brand-gold transition-colors active:bg-surface-prominent"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Fee breakdown */}
            <div className="rounded-2xl bg-surface-default p-4">
              <p className="text-[15px] font-medium text-text-primary mb-3">Détail des frais</p>

              {feeRows.map((row, i) => (
                <div key={row.label}>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[13px] text-text-muted">{row.label}</span>
                    <span className="text-[13px] text-text-secondary">{row.value}</span>
                  </div>
                  {i < feeRows.length - 1 && (
                    <div className="h-px bg-white/5" />
                  )}
                </div>
              ))}

              <div className="h-px bg-white/10 mt-1 mb-2" />
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-medium text-text-primary">Coût total</span>
                <span className="text-[15px] font-semibold text-text-primary">
                  {amount.toLocaleString("fr-FR")},00 €
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={() => onConfirmOrder?.(amount)}
              disabled={amount <= 0}
              className={`mt-5 w-full rounded-full py-3.5 text-[15px] font-semibold transition-all ${
                amount > 0
                  ? "bg-brand-gold text-black active:opacity-80"
                  : "bg-surface-prominent text-text-tertiary"
              }`}
            >
              Confirmer l&apos;achat
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useMotionValue, animate as fmAnimate, type MotionValue } from "framer-motion";
import { assetDatabase } from "@/screens/AssetDetailScreen";

/* ============================================
   TYPES
   ============================================ */

interface PostTradeScreenProps {
  ticker: string;
  amount: number;
  onDone: () => void;
  isTouch?: boolean;
  sharedDragX?: MotionValue<number>;
  objectiveLabel?: string | null;
  objectiveAmount?: number | null;
  onToast?: () => void;
}

const goalLabels: Record<string, string> = {
  croissance: "Croissance",
  retraite: "Retraite",
  revenus: "Revenus",
  "court-terme": "Court terme",
};

/* ============================================
   ANIMATED COUNTER
   ============================================ */

function AnimatedCounter({ target, duration = 1.2 }: { target: number; duration?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start: number | null = null;
    let raf: number;

    const step = (ts: number) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / (duration * 1000), 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return <>{display.toLocaleString("fr-FR")}</>;
}

/* ============================================
   SCREEN COMPONENT
   ============================================ */

export default function PostTradeScreen({
  ticker,
  amount,
  onDone,
  isTouch = false,
  sharedDragX,
  objectiveLabel,
  objectiveAmount,
  onToast,
}: PostTradeScreenProps) {
  const asset = assetDatabase[ticker];
  if (!asset) return null;

  /* Drag-to-go-back (same pattern) */
  const dragX = sharedDragX ?? useMotionValue(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDraggingX, setIsDraggingX] = useState(false);

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
            onComplete: () => onDone(),
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
  }, [isTouch, dragX, onDone]);

  /* Swipe-right-to-go-back (desktop) */
  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      setIsDraggingX(false);
      const { offset, velocity } = info;
      if (offset.x > 140 || (offset.x > 50 && velocity.x > 200)) {
        onDone();
      } else {
        dragX.set(0);
      }
    },
    [onDone, dragX],
  );

  /* Fake portfolio value = previous + trade amount */
  const previousPortfolioValue = 12_450;
  const newPortfolioValue = previousPortfolioValue + amount;

  /* Objective progress — accurate % based on invested amount vs objective target */
  const progressPercent = objectiveAmount ? Math.min(100, Math.round((amount / objectiveAmount) * 100)) : 0;

  return (
    <motion.div
      ref={scrollRef}
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
        <div className="w-10" />
        <p className="text-[15px] font-semibold text-text-primary">Confirmation</p>
        <button
          onClick={onDone}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors active:bg-surface-subtle"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4l10 10M14 4L4 14" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Scrollable content */}
      <div className={`flex-1 min-h-0 overflow-y-auto px-6 pb-[104px] ${isDraggingX ? "overflow-hidden" : ""}`}>

        {/* Success hero */}
        <div className="flex flex-col items-center pt-8 pb-6">
          {/* Checkmark circle */}
          <motion.div
            className="flex h-20 w-20 items-center justify-center rounded-full bg-surface-prominent"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.15 }}
          >
            <motion.svg
              width="36"
              height="36"
              viewBox="0 0 36 36"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
            >
              <motion.path
                d="M10 18l6 6 10-12"
                stroke="oklch(0.795 0.121 86.1)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.4, ease: "easeOut" }}
              />
            </motion.svg>
          </motion.div>

          {/* Headline */}
          <motion.p
            className="mt-5 text-[20px] font-semibold text-text-primary text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            Votre investissement est en cours
          </motion.p>
          <motion.p
            className="mt-1.5 text-[13px] text-text-muted text-center"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
          >
            L&apos;ordre sera exécuté à l&apos;ouverture du marché
          </motion.p>
        </div>

        {/* Trade summary card */}
        <motion.div
          className="rounded-2xl bg-surface-default p-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <div className="flex items-center gap-3">
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
        </motion.div>

        {/* Portfolio impact card */}
        <motion.div
          className="rounded-2xl bg-surface-default p-4 mt-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.85 }}
        >
          <p className="text-[15px] font-medium text-text-primary mb-3">Impact sur votre patrimoine</p>

          <div className="flex items-center justify-between py-2">
            <span className="text-[13px] text-text-muted">Patrimoine avant</span>
            <span className="text-[13px] text-text-secondary">
              {previousPortfolioValue.toLocaleString("fr-FR")},00 €
            </span>
          </div>
          <div className="h-px bg-white/5" />
          <div className="flex items-center justify-between py-2">
            <span className="text-[13px] text-text-muted">Investissement</span>
            <span className="text-[13px] text-emerald-400">
              +{amount.toLocaleString("fr-FR")},00 €
            </span>
          </div>
          <div className="h-px bg-white/10 mt-1 mb-2" />
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium text-text-primary">Nouveau total</span>
            <span className="text-[15px] font-semibold text-text-primary">
              <AnimatedCounter target={newPortfolioValue} />,00 €
            </span>
          </div>
        </motion.div>

        {/* Objective progress — compact card */}
        {objectiveLabel && (
          <motion.div
            className="rounded-2xl bg-surface-default p-4 mt-3"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 1.0 }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-gold/10">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="7" stroke="#F1C086" strokeWidth="1.5" />
                  <circle cx="10" cy="10" r="3" stroke="#F1C086" strokeWidth="1.5" />
                  <circle cx="10" cy="10" r="1" fill="#F1C086" />
                </svg>
              </div>
              <p className="text-[15px] font-medium text-text-primary">
                {progressPercent}% de votre objectif {goalLabels[objectiveLabel] ?? objectiveLabel}
              </p>
            </div>
          </motion.div>
        )}

        {/* What's next */}
        <motion.div
          className="rounded-2xl bg-surface-default p-4 mt-3"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: objectiveLabel ? 1.15 : 1.0 }}
        >
          <p className="text-[15px] font-medium text-text-primary mb-3">Et maintenant ?</p>

          {[
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="6.5" stroke="oklch(0.795 0.121 86.1)" strokeWidth="1.2" />
                  <path d="M8 4.5v4l2.5 1.5" stroke="oklch(0.795 0.121 86.1)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              title: "Suivre votre investissement",
              subtitle: "Retrouvez vos positions dans l'onglet Patrimoine",
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 12l4-4 2.5 2.5L14 4" stroke="oklch(0.795 0.121 86.1)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ),
              title: "Diversifier votre portefeuille",
              subtitle: "Découvrez d'autres ETFs pour répartir le risque",
            },
            {
              icon: (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M4 8h8M4 5h8M4 11h5" stroke="oklch(0.795 0.121 86.1)" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              ),
              title: "Programmer un investissement",
              subtitle: "Automatisez vos achats récurrents",
            },
          ].map((item, i, arr) => (
            <div key={item.title}>
              <button
                onClick={() => onToast?.()}
                className="flex w-full items-center gap-3 py-2.5 text-left active:opacity-70 transition-opacity"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-prominent">
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-text-primary">{item.title}</p>
                  <p className="text-[11px] text-text-muted">{item.subtitle}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0 text-text-tertiary">
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {i < arr.length - 1 && <div className="h-px bg-white/5" />}
            </div>
          ))}
        </motion.div>

        {/* CTA — back to invest */}
        <motion.button
          onClick={onDone}
          className="mt-5 w-full rounded-full py-3.5 text-[15px] font-semibold bg-brand-gold text-black active:opacity-80 transition-all"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: objectiveLabel ? 1.3 : 1.15 }}
        >
          Retourner à vos investissements
        </motion.button>
      </div>
    </motion.div>
  );
}

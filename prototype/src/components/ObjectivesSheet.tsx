"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ============================================
   TYPES
   ============================================ */

export type ObjectivesData = {
  goal: "croissance" | "retraite" | "revenus" | "court-terme";
  risk: "prudent" | "equilibre" | "dynamique";
  amount: number;
};

interface ObjectivesSheetProps {
  initial?: ObjectivesData | null;
  onComplete: (data: ObjectivesData) => void;
  onClose: () => void;
}

/* ============================================
   DATA
   ============================================ */

const goals = [
  { key: "croissance" as const, label: "Croissance long terme", icon: "trending" },
  { key: "retraite" as const, label: "Retraite", icon: "sunset" },
  { key: "revenus" as const, label: "Revenus passifs", icon: "recurring" },
  { key: "court-terme" as const, label: "Court terme", icon: "clock" },
];

const risks = [
  {
    key: "prudent" as const,
    label: "Prudent",
    description: "Rendement stable, risque limité",
    points: [0, 2, 1, 3, 2, 3, 2, 4, 3, 4],
  },
  {
    key: "equilibre" as const,
    label: "Équilibré",
    description: "Croissance modérée, risque maîtrisé",
    points: [0, 4, 2, 6, 3, 7, 4, 5, 6, 8],
  },
  {
    key: "dynamique" as const,
    label: "Dynamique",
    description: "Rendement élevé, volatilité assumée",
    points: [0, 6, 2, 8, 1, 9, 3, 7, 8, 10],
  },
];

const presetAmounts = [100, 500, 1000];

/* ============================================
   ICONS
   ============================================ */

function GoalIcon({ type, active }: { type: string; active: boolean }) {
  const color = active ? "#F1C086" : "currentColor";
  const cls = active ? "text-brand-gold" : "text-text-muted";

  if (type === "trending")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={cls}>
        <path d="M3 17l6-6 4 4 8-8" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M17 7h4v4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (type === "sunset")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={cls}>
        <path d="M3 17h18" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 7v-3M5.6 13.4l-1.4-1.4M18.4 13.4l1.4-1.4" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M7 17a5 5 0 0 1 10 0" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  if (type === "recurring")
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={cls}>
        <path d="M17 1l4 4-4 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 11V9a4 4 0 0 1 4-4h14" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7 23l-4-4 4-4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M21 13v2a4 4 0 0 1-4 4H3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  // clock
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={cls}>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
      <path d="M12 7v5l3 3" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RiskLine({ points, active }: { points: number[]; active: boolean }) {
  const w = 48;
  const h = 20;
  const max = Math.max(...points);
  const step = w / (points.length - 1);
  const d = points
    .map((p, i) => `${i === 0 ? "M" : "L"}${i * step},${h - (p / max) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none">
      <path d={d} stroke={active ? "#F1C086" : "#7A7A80"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ============================================
   COMPONENT
   ============================================ */

export default function ObjectivesSheet({ initial, onComplete, onClose }: ObjectivesSheetProps) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back
  const [goal, setGoal] = useState<ObjectivesData["goal"] | null>(initial?.goal ?? null);
  const [risk, setRisk] = useState<ObjectivesData["risk"] | null>(initial?.risk ?? null);
  const [amount, setAmount] = useState<number | null>(initial?.amount ?? null);
  const [customAmount, setCustomAmount] = useState("");
  const [showCustom, setShowCustom] = useState(false);
  const [customFocused, setCustomFocused] = useState(false);

  const advance = (nextStep: number) => {
    setDirection(1);
    setTimeout(() => setStep(nextStep), 150);
  };

  const goBack = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const handleConfirm = () => {
    if (!goal || !risk || !amount) return;
    onComplete({ goal, risk, amount });
  };

  const stepVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 24 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir * -24 }),
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 z-30 bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-40 flex flex-col rounded-t-[20px] bg-[#1A1A1C]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="h-1 w-9 rounded-full bg-white/20" />
        </div>

        {/* Header: back arrow + step dots */}
        <div className="flex items-center px-6 pb-4">
          {/* Back arrow */}
          <div className="w-8">
            {step > 1 && (
              <button onClick={goBack} className="flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M12 4l-6 6 6 6" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>

          {/* Step dots */}
          <div className="flex flex-1 items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? "w-6 bg-brand-gold" : s < step ? "w-1.5 bg-brand-gold/40" : "w-1.5 bg-white/20"
                }`}
              />
            ))}
          </div>

          {/* Spacer for symmetry */}
          <div className="w-8" />
        </div>

        {/* Step content */}
        <div className="px-6 pb-10" style={{ minHeight: 340 }}>
          <AnimatePresence mode="wait" custom={direction}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.15 }}
              >
                <h2 className="mb-6 text-lg font-semibold text-text-primary">
                  Quel est votre objectif ?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {goals.map((g) => {
                    const active = goal === g.key;
                    return (
                      <motion.button
                        key={g.key}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => {
                          setGoal(g.key);
                          advance(2);
                        }}
                        className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-colors ${
                          active
                            ? "border-brand-gold/50 bg-brand-gold/8"
                            : "border-transparent bg-surface-default"
                        }`}
                      >
                        <GoalIcon type={g.icon} active={active} />
                        <p className={`mt-3 text-[15px] font-medium ${active ? "text-brand-gold" : "text-text-primary"}`}>
                          {g.label}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.15 }}
              >
                <h2 className="mb-6 text-lg font-semibold text-text-primary">
                  Quel est votre rapport au risque ?
                </h2>
                <div className="flex flex-col gap-3">
                  {risks.map((r) => {
                    const active = risk === r.key;
                    return (
                      <motion.button
                        key={r.key}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setRisk(r.key);
                          advance(3);
                        }}
                        className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition-colors ${
                          active
                            ? "border-brand-gold/50 bg-brand-gold/8"
                            : "border-transparent bg-surface-default"
                        }`}
                      >
                        <RiskLine points={r.points} active={active} />
                        <div className="flex-1">
                          <p className={`text-[15px] font-medium ${active ? "text-brand-gold" : "text-text-primary"}`}>
                            {r.label}
                          </p>
                          <p className="mt-0.5 text-[11px] text-text-muted">
                            {r.description}
                          </p>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={direction}
                variants={stepVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.15 }}
              >
                <h2 className="mb-6 text-lg font-semibold text-text-primary">
                  Combien souhaitez-vous investir ?
                </h2>

                {/* Preset pills */}
                <div className="flex gap-3">
                  {presetAmounts.map((a) => {
                    const active = amount === a && !showCustom;
                    return (
                      <button
                        key={a}
                        onClick={() => {
                          setAmount(a);
                          setShowCustom(false);
                        }}
                        className={`flex-1 rounded-full py-3 text-[15px] font-medium transition-colors ${
                          active
                            ? "bg-brand-gold text-black"
                            : "bg-surface-prominent text-text-secondary"
                        }`}
                      >
                        {a >= 1000 ? `${(a / 1000).toFixed(0)} 000` : a} €
                      </button>
                    );
                  })}
                  <button
                    onClick={() => {
                      setShowCustom(true);
                      setAmount(null);
                    }}
                    className={`flex-1 rounded-full py-3 text-[15px] font-medium transition-colors ${
                      showCustom
                        ? "bg-brand-gold text-black"
                        : "bg-surface-prominent text-text-secondary"
                    }`}
                  >
                    Autre
                  </button>
                </div>

                {/* Custom input */}
                {showCustom && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const current = amount ?? 0;
                          const next = Math.max(0, current - 50);
                          setAmount(next);
                          setCustomAmount(String(next));
                        }}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-default text-text-muted transition-colors active:bg-surface-prominent"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                      <div className="flex h-12 flex-1 items-center justify-center gap-1 rounded-xl bg-surface-default px-4">
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => {
                            setCustomAmount(e.target.value);
                            const num = parseInt(e.target.value);
                            if (!isNaN(num) && num > 0) setAmount(num);
                            else setAmount(null);
                          }}
                          onFocus={(e) => {
                            setCustomFocused(true);
                            if (e.target.value === "0") {
                              setCustomAmount("");
                              setAmount(null);
                            }
                          }}
                          onBlur={() => setCustomFocused(false)}
                          placeholder={customFocused ? "" : "0"}
                          className="w-full bg-transparent text-center text-lg text-text-primary outline-none [appearance:textfield] placeholder:text-text-tertiary [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                          autoFocus
                        />
                        <span className="text-lg text-text-muted">€</span>
                      </div>
                      <button
                        onClick={() => {
                          const current = amount ?? 0;
                          const next = current + 50;
                          setAmount(next);
                          setCustomAmount(String(next));
                        }}
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-default text-text-muted transition-colors active:bg-surface-prominent"
                      >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Reassurance */}
                <p className="mt-6 text-center text-xs text-text-muted">
                  Vous pouvez modifier à tout moment
                </p>

                {/* Confirm CTA */}
                <button
                  onClick={handleConfirm}
                  disabled={!amount}
                  className={`mt-6 w-full rounded-full py-3.5 text-[15px] font-semibold transition-all ${
                    amount
                      ? "bg-brand-gold text-black active:opacity-80"
                      : "bg-surface-prominent text-text-tertiary"
                  }`}
                >
                  Confirmer
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </>
  );
}

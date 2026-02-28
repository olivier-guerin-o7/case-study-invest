"use client";

import { motion } from "framer-motion";
import type { ObjectivesData } from "./ObjectivesSheet";

const goalLabels: Record<ObjectivesData["goal"], string> = {
  croissance: "Croissance",
  retraite: "Retraite",
  revenus: "Revenus",
  "court-terme": "Court terme",
};

const riskLabels: Record<ObjectivesData["risk"], string> = {
  prudent: "Prudent",
  equilibre: "Équilibré",
  dynamique: "Dynamique",
};

function formatAmount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `${n}`;
}

interface ObjectivesIndicatorProps {
  objectives: ObjectivesData;
  onEdit: () => void;
}

export default function ObjectivesIndicator({ objectives, onEdit }: ObjectivesIndicatorProps) {
  return (
    <button
      onClick={onEdit}
      className="flex w-full items-center gap-1.5 rounded-card-lg bg-surface-subtle px-4 py-3 text-left transition-colors active:bg-surface-default"
    >
      {/* Target icon — scales down on mount after sheet closes */}
      <motion.div
        className="flex shrink-0 items-center justify-center"
        initial={{ scale: 2.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          scale: { type: "spring", stiffness: 200, damping: 12, delay: 0.35 },
          opacity: { duration: 0.3, delay: 0.35 },
        }}
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
          <circle cx="10" cy="10" r="7" stroke="#F1C086" strokeWidth="1.5" opacity="0.6" />
          <circle cx="10" cy="10" r="3" stroke="#F1C086" strokeWidth="1.5" opacity="0.6" />
          <circle cx="10" cy="10" r="1" fill="#F1C086" opacity="0.6" />
        </svg>
      </motion.div>

      {/* Label + summary */}
      <div className="flex-1 min-w-0">
        <p className="truncate text-[13px] font-medium text-text-muted">
          Objectif<span className="inline-block w-2" /><span className="text-text-secondary">
            {goalLabels[objectives.goal]} · {riskLabels[objectives.risk]} · {formatAmount(objectives.amount)}&nbsp;€
          </span>
        </p>
      </div>

      {/* Edit chevron */}
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="shrink-0 text-text-tertiary">
        <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}

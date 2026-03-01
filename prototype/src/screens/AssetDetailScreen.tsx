"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, animate as fmAnimate, type MotionValue, PanInfo } from "framer-motion";

/* ============================================
   TYPES
   ============================================ */

export interface AssetData {
  name: string;
  ticker: string;
  price: string;
  change24h: string;
  positive: boolean;
  subtitle: string; // "ETF · CW8 · Euronext Paris"
  riskLevel: number; // 1-7 MiFID
  riskLabel: string;
  ter: string;
  annualReturn: string;
  annualReturnPositive: boolean;
  description: string;
  clarityTerms: string[]; // words to underline
  details: { label: string; value: string }[];
  investorCount: string;
  chartData: Record<string, number[]>; // keyed by time range
}

interface AssetDetailScreenProps {
  ticker: string;
  onBack: () => void;
  isTouch?: boolean;
  /** Shared motion value so parent can read drag offset for parallax */
  sharedDragX?: MotionValue<number>;
  onToast?: (msg?: string) => void;
  onBuy?: (ticker: string) => void;
}

/* ============================================
   DATA — keyed by ticker
   ============================================ */

export const assetDatabase: Record<string, AssetData> = {
  CW8: {
    name: "Amundi MSCI World",
    ticker: "CW8",
    price: "491,32 €",
    change24h: "+0,84%",
    positive: true,
    subtitle: "ETF · CW8 · Euronext Paris",
    riskLevel: 4,
    riskLabel: "Modéré",
    ter: "0,38%",
    annualReturn: "+18,24%",
    annualReturnPositive: true,
    description:
      "Le MSCI World est un indice qui suit la performance de plus de 1 500 entreprises dans 23 pays développés. C'est l'un des ETF les plus populaires pour une diversification mondiale.",
    clarityTerms: ["indice", "ETF", "diversification"],
    details: [
      { label: "Type", value: "ETF" },
      { label: "Indice suivi", value: "MSCI World" },
      { label: "Émetteur", value: "Amundi" },
      { label: "Encours", value: "4,2 Md €" },
      { label: "Devise", value: "EUR" },
      { label: "Éligibilité", value: "PEA ✓" },
    ],
    investorCount: "124 800",
    chartData: {
      "1J": [490, 490.5, 491, 490.8, 491.2, 491.5, 490.9, 491.1, 491.3, 491.0, 491.4, 491.32],
      "1S": [488, 489, 487, 490, 489, 491, 490, 491.5, 490.8, 491.32],
      "1M": [480, 482, 479, 484, 486, 483, 488, 490, 487, 491, 489, 491.32],
      "6M": [440, 445, 450, 442, 455, 460, 465, 458, 470, 475, 480, 485, 490, 491.32],
      "1A": [415, 420, 430, 425, 440, 435, 450, 460, 455, 465, 470, 480, 475, 485, 490, 491.32],
      Max: [100, 120, 150, 180, 200, 220, 250, 280, 300, 320, 350, 380, 400, 420, 450, 470, 491.32],
    },
  },
  SXR8: {
    name: "iShares Core S&P 500",
    ticker: "SXR8",
    price: "523,10 €",
    change24h: "+1,12%",
    positive: true,
    subtitle: "ETF · SXR8 · Xetra",
    riskLevel: 5,
    riskLabel: "Élevé",
    ter: "0,07%",
    annualReturn: "+21,07%",
    annualReturnPositive: true,
    description:
      "Cet ETF réplique l'indice S&P 500, composé des 500 plus grandes entreprises américaines. Avec des frais parmi les plus bas du marché, c'est un choix populaire pour une exposition aux États-Unis.",
    clarityTerms: ["ETF", "indice", "S&P 500"],
    details: [
      { label: "Type", value: "ETF" },
      { label: "Indice suivi", value: "S&P 500" },
      { label: "Émetteur", value: "iShares (BlackRock)" },
      { label: "Encours", value: "65,8 Md €" },
      { label: "Devise", value: "EUR" },
      { label: "Éligibilité", value: "CTO" },
    ],
    investorCount: "98 200",
    chartData: {
      "1J": [521, 521.5, 522, 522.3, 521.8, 522.5, 522.8, 523, 522.5, 523.1, 522.9, 523.1],
      "1S": [518, 519, 520, 519.5, 521, 522, 521.5, 523, 522.5, 523.1],
      "1M": [510, 512, 508, 514, 516, 513, 518, 520, 517, 521, 519, 523.1],
      "6M": [460, 468, 475, 465, 480, 488, 495, 485, 500, 505, 510, 515, 520, 523.1],
      "1A": [432, 440, 450, 445, 460, 455, 470, 480, 475, 490, 495, 505, 500, 510, 520, 523.1],
      Max: [80, 100, 130, 160, 190, 220, 260, 290, 320, 350, 380, 410, 440, 470, 500, 520, 523.1],
    },
  },
  MEUD: {
    name: "Amundi STOXX Europe 600",
    ticker: "MEUD",
    price: "234,85 €",
    change24h: "-0,32%",
    positive: false,
    subtitle: "ETF · MEUD · Euronext Paris",
    riskLevel: 4,
    riskLabel: "Modéré",
    ter: "0,18%",
    annualReturn: "+8,42%",
    annualReturnPositive: true,
    description:
      "Cet ETF offre une exposition large au marché européen en répliquant l'indice STOXX Europe 600, qui couvre 600 entreprises de 17 pays européens, offrant une diversification géographique et sectorielle.",
    clarityTerms: ["ETF", "indice", "diversification"],
    details: [
      { label: "Type", value: "ETF" },
      { label: "Indice suivi", value: "STOXX Europe 600" },
      { label: "Émetteur", value: "Amundi" },
      { label: "Encours", value: "1,8 Md €" },
      { label: "Devise", value: "EUR" },
      { label: "Éligibilité", value: "PEA ✓" },
    ],
    investorCount: "45 600",
    chartData: {
      "1J": [235.2, 235, 234.8, 235.1, 234.6, 234.9, 234.7, 235, 234.5, 234.8, 234.9, 234.85],
      "1S": [236, 235.5, 234, 235, 234.5, 235.2, 234.8, 235.1, 234.6, 234.85],
      "1M": [230, 231, 229, 232, 233, 231, 234, 235, 233, 235, 234, 234.85],
      "6M": [215, 218, 220, 217, 222, 225, 228, 224, 230, 232, 234, 233, 235, 234.85],
      "1A": [216, 218, 222, 220, 225, 223, 228, 230, 227, 232, 230, 234, 232, 235, 234, 234.85],
      Max: [80, 95, 110, 125, 140, 155, 170, 185, 200, 210, 220, 228, 230, 232, 234, 235, 234.85],
    },
  },
  /* Stocks from Tendances — simpler data */
  AAPL: {
    name: "Apple",
    ticker: "AAPL",
    price: "198,50 €",
    change24h: "+2,34%",
    positive: true,
    subtitle: "Action · AAPL · NASDAQ",
    riskLevel: 5,
    riskLabel: "Élevé",
    ter: "—",
    annualReturn: "+28,12%",
    annualReturnPositive: true,
    description:
      "Apple est l'une des plus grandes capitalisations boursières au monde. L'entreprise conçoit et commercialise des produits électroniques, logiciels et services en ligne.",
    clarityTerms: ["capitalisations boursières"],
    details: [
      { label: "Type", value: "Action" },
      { label: "Secteur", value: "Technologie" },
      { label: "Capitalisation", value: "3 040 Md $" },
      { label: "Dividende", value: "0,55%" },
      { label: "Devise", value: "USD" },
      { label: "Éligibilité", value: "CTO" },
    ],
    investorCount: "312 400",
    chartData: {
      "1J": [196, 196.5, 197, 196.8, 197.5, 198, 197.5, 198.2, 198, 198.3, 198.5, 198.5],
      "1S": [194, 195, 193, 196, 195, 197, 196, 198, 197.5, 198.5],
      "1M": [188, 190, 186, 192, 194, 191, 196, 198, 195, 198, 197, 198.5],
      "6M": [165, 170, 175, 168, 180, 185, 178, 190, 188, 195, 192, 198, 196, 198.5],
      "1A": [155, 160, 165, 158, 170, 175, 168, 180, 185, 190, 188, 195, 192, 198, 196, 198.5],
      Max: [20, 30, 45, 60, 80, 100, 120, 140, 155, 165, 175, 185, 190, 195, 198, 198.5],
    },
  },
  MC: {
    name: "LVMH",
    ticker: "MC",
    price: "824,60 €",
    change24h: "-0,82%",
    positive: false,
    subtitle: "Action · MC · Euronext Paris",
    riskLevel: 5,
    riskLabel: "Élevé",
    ter: "—",
    annualReturn: "-4,32%",
    annualReturnPositive: false,
    description:
      "LVMH est le leader mondial du luxe. Le groupe réunit plus de 75 maisons d'exception dans les secteurs des vins et spiritueux, de la mode, de la parfumerie et de l'horlogerie.",
    clarityTerms: [],
    details: [
      { label: "Type", value: "Action" },
      { label: "Secteur", value: "Luxe / Consommation" },
      { label: "Capitalisation", value: "412 Md €" },
      { label: "Dividende", value: "1,72%" },
      { label: "Devise", value: "EUR" },
      { label: "Éligibilité", value: "PEA ✓" },
    ],
    investorCount: "87 300",
    chartData: {
      "1J": [828, 827, 826, 827, 825, 826, 824, 825, 824.5, 825, 824.8, 824.6],
      "1S": [830, 828, 826, 829, 825, 827, 824, 826, 825, 824.6],
      "1M": [840, 838, 835, 838, 832, 835, 828, 830, 826, 828, 825, 824.6],
      "6M": [860, 855, 850, 858, 845, 840, 850, 835, 840, 830, 835, 825, 830, 824.6],
      "1A": [862, 870, 865, 860, 855, 862, 850, 845, 840, 850, 835, 840, 830, 828, 825, 824.6],
      Max: [200, 280, 350, 420, 500, 580, 650, 720, 780, 820, 860, 880, 870, 850, 830, 824.6],
    },
  },
  NVDA: {
    name: "NVIDIA",
    ticker: "NVDA",
    price: "876,30 €",
    change24h: "+4,12%",
    positive: true,
    subtitle: "Action · NVDA · NASDAQ",
    riskLevel: 6,
    riskLabel: "Élevé",
    ter: "—",
    annualReturn: "+185,40%",
    annualReturnPositive: true,
    description:
      "NVIDIA est le leader mondial des processeurs graphiques (GPU). L'entreprise est au cœur de la révolution de l'intelligence artificielle grâce à ses puces utilisées pour l'entraînement des modèles d'IA.",
    clarityTerms: ["GPU", "intelligence artificielle"],
    details: [
      { label: "Type", value: "Action" },
      { label: "Secteur", value: "Semi-conducteurs" },
      { label: "Capitalisation", value: "2 160 Md $" },
      { label: "Dividende", value: "0,03%" },
      { label: "Devise", value: "USD" },
      { label: "Éligibilité", value: "CTO" },
    ],
    investorCount: "215 700",
    chartData: {
      "1J": [842, 848, 855, 850, 860, 865, 858, 870, 868, 875, 874, 876.3],
      "1S": [820, 835, 840, 830, 855, 860, 850, 870, 865, 876.3],
      "1M": [760, 780, 770, 800, 810, 795, 830, 840, 820, 860, 850, 876.3],
      "6M": [480, 520, 560, 530, 600, 640, 610, 680, 720, 750, 800, 830, 860, 876.3],
      "1A": [307, 350, 400, 380, 450, 480, 520, 560, 600, 650, 700, 750, 800, 840, 870, 876.3],
      Max: [15, 25, 40, 60, 100, 150, 200, 280, 350, 450, 550, 650, 750, 830, 870, 876.3],
    },
  },
};

/* Fallback for unknown tickers */
const fallbackAsset: AssetData = {
  name: "Actif inconnu",
  ticker: "???",
  price: "—",
  change24h: "—",
  positive: true,
  subtitle: "",
  riskLevel: 0,
  riskLabel: "—",
  ter: "—",
  annualReturn: "—",
  annualReturnPositive: true,
  description: "",
  clarityTerms: [],
  details: [],
  investorCount: "—",
  chartData: { "1A": [0] },
};

/* ============================================
   CHART COMPONENT
   ============================================ */

const timeRanges = ["1J", "1S", "1M", "6M", "1A", "Max"];

interface AreaChartProps {
  data: number[];
  positive: boolean;
  animationKey?: string;
  scrubIndex?: number | null;
  scrubLabel?: string | null;
  defaultLabel?: string | null;
}

function AreaChart({ data, positive, animationKey, scrubIndex = null, scrubLabel = null, defaultLabel = null }: AreaChartProps) {
  const w = 361;
  const h = 184; // extra 24px top for time labels + gap
  const labelAreaH = 24; // reserved space at top for time labels + gap from dashed line
  const padY = 8; // vertical padding so dot/glow don't clip

  if (data.length < 2) return <div style={{ width: w, height: h }} />;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const padX = 16; // horizontal padding so chart isn't edge-to-edge
  const points = data.map((v, i) => ({
    x: padX + (i / (data.length - 1)) * (w - padX * 2),
    y: labelAreaH + padY + (1 - (v - min) / range) * (h - labelAreaH - padY * 2),
  }));

  // Straight line segments (angles kept — subtle curves were too wavy)
  const lineD = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(" ");
  const areaD = `${lineD} L${points[points.length - 1].x},${h} L${points[0].x},${h} Z`;

  // Estimate path length for draw-on animation
  let pathLen = 0;
  for (let i = 1; i < points.length; i++) {
    const dx = points[i].x - points[i - 1].x;
    const dy = points[i].y - points[i - 1].y;
    pathLen += Math.sqrt(dx * dx + dy * dy);
  }

  const color = "#F1C086";
  const last = points[points.length - 1];

  // Scrub point for crosshair (controlled by parent via scrubIndex prop)
  const scrubPoint = scrubIndex !== null && scrubIndex >= 0 && scrubIndex < points.length ? points[scrubIndex] : null;

  return (
    <svg
      key={animationKey}
      width={w} height={h} viewBox={`0 0 ${w} ${h}`}
      className="w-full overflow-visible"
    >
      <defs>
        {/* Glow filter */}
        <filter id="chartGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Vertical gradient for fill */}
        <linearGradient id="chartFillV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        {/* Horizontal mask — fade from left (transparent) to right (opaque) */}
        <linearGradient id="chartFadeH" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="white" stopOpacity="0" />
          <stop offset="50%" stopColor="white" stopOpacity="0.6" />
          <stop offset="100%" stopColor="white" stopOpacity="1" />
        </linearGradient>
        <mask id="chartMaskH">
          <rect width={w} height={h} fill="url(#chartFadeH)" />
        </mask>
      </defs>

      {/* CSS keyframes for draw-on + fade-in */}
      <style>{`
        @keyframes chartDraw { from { stroke-dashoffset: ${pathLen}; } to { stroke-dashoffset: 0; } }
        @keyframes chartFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes chartPulse { from { r: 4; opacity: 0.4; } to { r: 12; opacity: 0; } }
      `}</style>

      {/* Area fill — fades in after draw */}
      <path
        d={areaD} fill="url(#chartFillV)" mask="url(#chartMaskH)"
        style={{ opacity: 0, animation: "chartFadeIn 0.4s ease-out 0.5s forwards" }}
      />

      {/* Glow layer — draw-on animated */}
      <path
        d={lineD} fill="none"
        stroke={color} strokeWidth="3" opacity="0.35"
        filter="url(#chartGlow)"
        strokeLinecap="round" strokeLinejoin="round"
        style={{
          strokeDasharray: pathLen,
          strokeDashoffset: pathLen,
          animation: `chartDraw 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
        }}
      />

      {/* Crisp line — draw-on animated */}
      <path
        d={lineD} fill="none"
        stroke={color} strokeWidth="1.5"
        strokeLinecap="round" strokeLinejoin="round"
        style={{
          strokeDasharray: pathLen,
          strokeDashoffset: pathLen,
          animation: `chartDraw 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards`,
        }}
      />

      {/* Default vertical dashed line + label at last point — hidden during scrub */}
      {scrubIndex === null && (
        <>
          <line
            x1={last.x} y1={labelAreaH}
            x2={last.x} y2={h}
            stroke="white" strokeOpacity="0.3"
            strokeDasharray="2 3" strokeWidth="1"
            style={{ opacity: 0, animation: "chartFadeIn 0.3s ease-out 0.6s forwards" }}
          />
          {defaultLabel && (
            <text
              x={Math.max(padX + 12, Math.min(last.x, w - padX - 12))}
              y={11}
              fill="white"
              fillOpacity="0.5"
              fontSize="9"
              fontFamily="system-ui, -apple-system, sans-serif"
              textAnchor="middle"
              style={{ opacity: 0, animation: "chartFadeIn 0.3s ease-out 0.6s forwards" }}
            >
              {defaultLabel}
            </text>
          )}
        </>
      )}

      {/* Pulsing ring at current price */}
      <circle
        cx={last.x} cy={last.y} r="4" fill={color}
        style={{ opacity: 0, animation: "chartFadeIn 0.1s ease-out 0.7s forwards" }}
      />
      <circle
        cx={last.x} cy={last.y} r="4" fill={color}
        style={{ opacity: 0, animation: "chartPulse 2s ease-out 0.8s infinite" }}
      />
      {/* Solid dot */}
      <circle
        cx={last.x} cy={last.y} r="3" fill={color}
        style={{ opacity: 0, animation: "chartFadeIn 0.1s ease-out 0.7s forwards" }}
      />

      {/* Scrub crosshair */}
      {scrubPoint && (
        <>
          <line
            x1={scrubPoint.x} y1={labelAreaH}
            x2={scrubPoint.x} y2={h}
            stroke="white" strokeOpacity="0.3"
            strokeDasharray="2 3" strokeWidth="1"
          />
          {scrubLabel && (
            <text
              x={Math.max(padX + 16, Math.min(scrubPoint.x, w - padX - 16))}
              y={13}
              fill="white"
              fontSize="11"
              fontFamily="system-ui, -apple-system, sans-serif"
              textAnchor="middle"
            >
              {scrubLabel}
            </text>
          )}
          <circle cx={scrubPoint.x} cy={scrubPoint.y} r="4" fill={color} />
          <circle cx={scrubPoint.x} cy={scrubPoint.y} r="6" fill="none" stroke={color} strokeWidth="1.5" strokeOpacity="0.5" />
        </>
      )}
    </svg>
  );
}

/* ============================================
   SCRUB SLIDER — controls chart crosshair
   ============================================ */

interface ScrubSliderProps {
  dataLength: number;
  onScrub: (index: number) => void;
  onScrubEnd: () => void;
}

const ScrubSlider = ({ dataLength, onScrub, onScrubEnd }: ScrubSliderProps) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [thumbPct, setThumbPct] = useState(100); // default: last data point
  const animRef = useRef<number | null>(null);

  const scrubFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track || dataLength < 2) return;
      const rect = track.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      setThumbPct(ratio * 100);
      onScrub(Math.round(ratio * (dataLength - 1)));
    },
    [dataLength, onScrub],
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.stopPropagation(); // prevent swipe-back on desktop
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      setActive(true);
      scrubFromClientX(e.clientX);
    },
    [scrubFromClientX],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!active) return;
      scrubFromClientX(e.clientX);
    },
    [active, scrubFromClientX],
  );

  const handlePointerUp = useCallback(() => {
    setActive(false);
    onScrubEnd();
    // Animate thumb back to 100% with deceleration
    const startPct = thumbPct;
    const dist = 100 - startPct;
    if (Math.abs(dist) < 0.5) { setThumbPct(100); return; }
    const duration = 250; // ms
    const startTime = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - t, 3); // cubic ease-out (deceleration)
      setThumbPct(startPct + dist * ease);
      if (t < 1) animRef.current = requestAnimationFrame(tick);
    };
    if (animRef.current) cancelAnimationFrame(animRef.current);
    animRef.current = requestAnimationFrame(tick);
  }, [onScrubEnd, thumbPct]);

  return (
    <div
      ref={trackRef}
      className="relative h-10 flex items-center cursor-grab active:cursor-grabbing touch-none"
      style={{ padding: "0 16px" }} /* match chart padX for alignment */
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Track line */}
      <div className="w-full h-[2px] rounded-full bg-brand-gold/20" />
      {/* Thumb — always visible, rounded rect, opaque, clamped within track bounds */}
      <div
        className={`absolute top-1/2 pointer-events-none ${
          active
            ? "w-7 h-3.5 rounded-[4px] bg-brand-gold shadow-[0_0_8px_rgba(241,192,134,0.5)]"
            : "w-6 h-3 rounded-[4px]"
        }`}
        style={{
          left: `calc(16px + (100% - 32px) * ${thumbPct / 100})`,
          transform: "translate(-50%, -50%)",
          ...(!active ? { backgroundColor: "#A07A50" } : {}),
        }}
      />
    </div>
  );
};

/* ============================================
   RISK BAR
   ============================================ */

function RiskBar({ level }: { level: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5, 6, 7].map((i) => (
        <div
          key={i}
          className={`h-1 w-3 rounded-full ${i <= level ? "bg-brand-gold" : "bg-white/10"}`}
        />
      ))}
    </div>
  );
}

/* ============================================
   CLARITY TEXT — highlights terms with dashed underline
   ============================================ */

const clarityDefinitions: Record<string, string> = {
  indice: "Un indice boursier mesure la performance d'un groupe d'actions représentatif d'un marché.",
  etf: "Un ETF (Exchange Traded Fund) est un fonds qui réplique un indice et se négocie en bourse comme une action.",
  diversification: "Répartir ses investissements sur différents actifs pour réduire le risque global.",
  "s&p 500": "L'indice des 500 plus grandes entreprises américaines, référence du marché US.",
  "capitalisations boursières": "La valeur totale d'une entreprise en bourse (prix de l'action × nombre d'actions).",
  gpu: "Processeur graphique — puce spécialisée dans les calculs parallèles, clé pour l'IA.",
  "intelligence artificielle": "Technologie permettant aux machines d'apprendre et de résoudre des problèmes complexes.",
};

function ClarityText({ text, terms, onTapTerm }: { text: string; terms: string[]; onTapTerm?: (term: string) => void }) {
  if (terms.length === 0) return <span>{text}</span>;

  const pattern = new RegExp(`(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <span>
      {parts.map((part, i) => {
        const isTerm = terms.some((t) => t.toLowerCase() === part.toLowerCase());
        if (isTerm) {
          return (
            <span
              key={i}
              onClick={() => onTapTerm?.(part.toLowerCase())}
              className="cursor-help border-b border-dashed border-white/50 text-white"
            >
              {part}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}

/* Clarity Drawer — bottom sheet listing all flagged terms */
function ClarityDrawer({
  terms,
  activeTerm,
  onClose,
  onDeselect,
}: {
  terms: string[];
  activeTerm: string | null;
  onClose: () => void;
  onDeselect: () => void;
}) {
  const activeRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAutoScrolling = useRef(false);

  // Auto-scroll the active term into view when drawer opens (delay to let spring animation settle)
  useEffect(() => {
    if (activeTerm && activeRef.current && scrollRef.current) {
      isAutoScrolling.current = true;
      const scrollTimer = setTimeout(() => {
        activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }, 350);
      // Reset auto-scroll flag after scroll animation completes
      const resetTimer = setTimeout(() => { isAutoScrolling.current = false; }, 900);
      return () => { clearTimeout(scrollTimer); clearTimeout(resetTimer); };
    }
  }, [activeTerm]);

  // When user manually scrolls, deselect active term
  const handleScroll = useCallback(() => {
    if (!isAutoScrolling.current && activeTerm) {
      onDeselect();
    }
  }, [activeTerm, onDeselect]);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 z-40 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      {/* Drawer */}
      <motion.div
        className="absolute inset-x-0 bottom-0 z-50 max-h-[60%] rounded-t-2xl bg-[#1C1C1E] border-t border-border-subtle flex flex-col"
        initial={{ y: "100%" }}
        animate={{ y: 0, transition: { type: "spring", damping: 30, stiffness: 350 } }}
        exit={{ y: "100%", transition: { duration: 0.2 } }}
      >
        {/* Handle + header — drag to dismiss or tap to dismiss */}
        <div
          className="flex flex-col items-center pt-2 pb-3 px-5 shrink-0 cursor-pointer"
          onClick={onClose}
        >
          <div className="h-1 w-8 rounded-full bg-white/20 mb-3" />
          <div className="flex items-center gap-2 self-start">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-brand-gold">
              <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M7 4.5v3M7 9v.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <p className="text-[13px] font-semibold text-text-primary">Clarity</p>
            <p className="text-[11px] text-text-muted">·  {terms.length} termes</p>
          </div>
        </div>

        {/* Term list — scrollable, deselects on user scroll */}
        <div
          ref={scrollRef}
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-5 pb-24 flex flex-col gap-3"
          onScroll={handleScroll}
          onTouchMove={() => { if (activeTerm) { isAutoScrolling.current = false; } }}
        >
          {terms.map((term) => {
            const def = clarityDefinitions[term.toLowerCase()];
            const isActive = activeTerm === term.toLowerCase();
            return (
              <div
                key={term}
                ref={isActive ? activeRef : undefined}
                className="rounded-xl px-4 py-3 bg-white/[0.04]"
              >
                <p className="text-[13px] font-semibold text-white mb-1">
                  {term.charAt(0).toUpperCase() + term.slice(1)}
                </p>
                {def ? (
                  <p className="text-[12px] leading-relaxed text-white/60">{def}</p>
                ) : (
                  <p className="text-[12px] text-white/40 italic">Définition à venir</p>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </>
  );
}

/* ============================================
   DRAG-TO-SCROLL (reuse pattern from InvestScreen)
   ============================================ */

function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({ isDown: false, startY: 0, scrollTop: 0 });

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    state.current = { isDown: true, startY: e.pageY, scrollTop: el.scrollTop };
  }, []);

  const onMouseUp = useCallback(() => {
    state.current.isDown = false;
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!state.current.isDown || !ref.current) return;
    e.preventDefault();
    const dy = e.pageY - state.current.startY;
    ref.current.scrollTop = state.current.scrollTop - dy;
  }, []);

  return { ref, onMouseDown, onMouseUp, onMouseLeave: onMouseUp, onMouseMove };
}

/* ============================================
   ANIMATION VARIANTS
   ============================================ */

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

/* ============================================
   SCREEN COMPONENT
   ============================================ */

export default function AssetDetailScreen({ ticker, onBack, isTouch = false, sharedDragX, onToast, onBuy }: AssetDetailScreenProps) {
  const asset = assetDatabase[ticker] ?? fallbackAsset;
  const [activeRange, setActiveRange] = useState("1A");
  const dragScroll = useDragScroll();

  const chartData = asset.chartData[activeRange] ?? asset.chartData["1A"] ?? [0];
  // Determine if chart trend is positive for this range
  const chartPositive = chartData.length >= 2 ? chartData[chartData.length - 1] >= chartData[0] : true;

  // Time labels per range — fake but plausible values shown at top of scrub dashed line
  const rangeTimeLabels: Record<string, string[]> = {
    "1J": ["9h", "9h30", "10h", "10h30", "11h", "12h", "13h", "14h", "15h", "15h30", "16h", "17h"],
    "1S": ["17 fév", "18 fév", "19 fév", "20 fév", "21 fév", "24 fév", "25 fév", "26 fév", "27 fév", "28 fév"],
    "1M": ["1 fév", "3 fév", "6 fév", "9 fév", "11 fév", "14 fév", "17 fév", "19 fév", "21 fév", "24 fév", "26 fév", "28 fév"],
    "6M": ["Sep", "Sep", "Oct", "Oct", "Nov", "Nov", "Déc", "Déc", "Jan", "Jan", "Fév", "Fév", "Fév", "Fév"],
    "1A": ["Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc", "Jan", "Fév", "Mar", "Avr", "Mai", "Fév"],
    Max: ["2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
  };

  // Scrubbing state — controlled by ScrubSlider, passed to AreaChart (reset on range change)
  const [scrubIndex, setScrubIndex] = useState<number | null>(null);
  useEffect(() => { setScrubIndex(null); }, [activeRange]);
  const scrubValue = scrubIndex !== null ? { price: chartData[scrubIndex], index: scrubIndex } : null;
  const scrubLabel = scrubIndex !== null ? (rangeTimeLabels[activeRange]?.[scrubIndex] ?? null) : null;
  const defaultTimeLabel = rangeTimeLabels[activeRange]?.[chartData.length - 1] ?? null;
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const scrubSliderRef = useRef<HTMLDivElement>(null);

  // Clarity drawer state
  const [clarityOpen, setClarityOpen] = useState(false);
  const [clarityActiveTerm, setClarityActiveTerm] = useState<string | null>(null);
  const handleClarityTap = (term: string) => {
    setClarityActiveTerm(term);
    setClarityOpen(true);
  };

  /* Swipe-right-to-go-back — use shared value so parent can drive side-by-side */
  const internalDragX = useMotionValue(0);
  const dragX = sharedDragX ?? internalDragX;
  const [isDraggingX, setIsDraggingX] = useState(false);

  // Native touch-driven swipe-back (mobile only) — Framer drag="x" blocks native scroll
  const dragContainerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isTouch) return;
    const el = dragContainerRef.current;
    if (!el) return;

    let startX = 0, startY = 0;
    let dragging = false, decided = false;
    let lastX = 0, lastT = 0, velX = 0;

    const onStart = (e: TouchEvent) => {
      // Skip if touch is on slider (slider handles its own pointer events)
      if (scrubSliderRef.current?.contains(e.target as Node)) {
        decided = true; dragging = false; return;
      }
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      lastX = startX; lastT = performance.now();
      dragging = false; decided = false; velX = 0;
    };

    const onMove = (e: TouchEvent) => {
      if (decided && !dragging) return; // vertical scroll — don't interfere
      const cx = e.touches[0].clientX;
      const cy = e.touches[0].clientY;
      const dx = cx - startX;
      const dy = cy - startY;

      // Track velocity
      const now = performance.now();
      const dt = now - lastT;
      if (dt > 0) velX = ((cx - lastX) / dt) * 1000;
      lastX = cx; lastT = now;

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
            type: "tween", duration: 0.2, ease: [0.32, 0.72, 0, 1],
            onComplete: () => onBack(),
          });
        } else {
          fmAnimate(dragX, 0, {
            type: "tween", duration: 0.25, ease: [0.32, 0.72, 0, 1],
          });
        }
      }
      dragging = false; decided = false;
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

  const handleDragStart = () => setIsDraggingX(true);

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    setIsDraggingX(false);
    // Trigger at ~60% of screen width OR with a fast flick
    if (info.offset.x > 140 || (info.offset.x > 50 && info.velocity.x > 200)) {
      // Animate to full exit, then unmount — same path as back button
      fmAnimate(dragX, 393, {
        type: "tween",
        duration: 0.2,
        ease: [0.32, 0.72, 0, 1],
        onComplete: () => onBack(),
      });
    }
  };

  // Back button: animate the shared drag value for iOS-style side-by-side motion
  const handleBackButton = useCallback(() => {
    fmAnimate(dragX, 393, {
      type: "tween",
      duration: 0.3,
      ease: [0.32, 0.72, 0, 1],
      onComplete: () => onBack(),
    });
  }, [dragX, onBack]);

  return (
    <div className="relative h-full overflow-hidden">
    <motion.div
      ref={dragContainerRef}
      className="flex h-full flex-col"
      style={{ x: dragX }}
      drag={isTouch || scrubIndex !== null ? false : "x"}
      dragConstraints={isTouch ? undefined : { left: 0, right: 0 }}
      dragElastic={isTouch ? undefined : { left: 0, right: 0.6 }}
      onDragStart={isTouch ? undefined : handleDragStart}
      onDragEnd={isTouch ? undefined : handleDragEnd}
      dragDirectionLock={isTouch ? undefined : true}
    >
      {/* ── Header bar ── */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button
          onClick={handleBackButton}
          className="flex h-10 w-10 items-center justify-center rounded-full transition-colors active:bg-surface-subtle"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12 4l-6 6 6 6" stroke="#8E8E93" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="text-[15px] font-semibold text-text-primary">{asset.name}</p>
        <button onClick={() => onToast?.()} className="flex h-10 w-10 items-center justify-center rounded-full transition-colors active:bg-surface-subtle">
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none" className="text-text-tertiary">
            <path d="M4 11v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2M9 2v9M6 5l3-3 3 3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* ── Scrollable content ── */}
      <motion.div
        ref={(node) => {
          scrollContainerRef.current = node as HTMLDivElement;
          if (!isTouch && dragScroll.ref) (dragScroll.ref as React.MutableRefObject<HTMLDivElement | null>).current = node as HTMLDivElement;
        }}
        onMouseDown={!isTouch ? dragScroll.onMouseDown : undefined}
        onMouseUp={!isTouch ? dragScroll.onMouseUp : undefined}
        onMouseLeave={!isTouch ? dragScroll.onMouseLeave : undefined}
        onMouseMove={!isTouch ? dragScroll.onMouseMove : undefined}
        className={`no-scrollbar flex-1 min-h-0 ${isDraggingX ? "overflow-hidden" : "overflow-y-auto"} overscroll-contain`}
        variants={stagger}
        initial="hidden"
        animate="show"
      >
        {/* ── Price hero ── */}
        <motion.div variants={fadeUp} className="px-6 pt-2 pb-4">
          {/* Price line + action buttons — icons aligned to price center */}
          <div className="flex items-center justify-between">
            {(() => {
              const displayPrice = scrubValue
                ? (scrubValue.price >= 1000
                    ? `${Math.round(scrubValue.price).toLocaleString("fr-FR")} €`
                    : `${scrubValue.price.toFixed(2).replace(".", ",")} €`)
                : asset.price;
              return (
                <p className="text-[28px] font-semibold text-text-primary leading-none">
                  {displayPrice}
                </p>
              );
            })()}
            {/* Action buttons */}
            <div className="flex gap-2">
              <button onClick={() => onToast?.()} className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-default transition-colors active:bg-surface-elevated">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="text-text-secondary">
                  <circle cx="4" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="16" cy="10" r="1.5" fill="currentColor" />
                </svg>
              </button>
              <button onClick={() => onBuy?.(ticker)} className="flex h-10 items-center rounded-xl bg-brand-gold px-3.5 transition-opacity active:opacity-80">
                <span className="text-[15px] font-semibold text-black">Acheter</span>
              </button>
            </div>
          </div>
          {/* Change badge — scrub: vs first data point / default: range performance */}
          <div className="mt-1 flex items-center gap-2">
            {(() => {
              const openPrice = chartData[0];
              const refPrice = scrubValue ? scrubValue.price : chartData[chartData.length - 1];
              const pctChange = ((refPrice - openPrice) / openPrice) * 100;
              const pctStr = `${pctChange >= 0 ? "+" : ""}${pctChange.toFixed(2).replace(".", ",")}%`;
              const pctPositive = pctChange >= 0;
              const rangeLabels: Record<string, string> = {
                "1J": "Aujourd'hui",
                "1S": "Cette semaine",
                "1M": "Ce mois",
                "6M": "6 mois",
                "1A": "1 an",
                Max: "Historique",
              };
              const label = scrubValue
                ? `vs ouverture ${rangeLabels[activeRange]?.toLowerCase() ?? ""}`
                : rangeLabels[activeRange] ?? "";
              return (
                <>
                  <span className={`inline-block rounded-md px-1.5 py-0.5 text-sm font-semibold ${pctPositive ? "bg-status-gain/12 text-status-gain" : "bg-status-loss/12 text-status-loss"}`}>
                    {pctStr}
                  </span>
                  <span className="text-[11px] text-text-muted">{label}</span>
                </>
              );
            })()}
          </div>
          <p className="mt-1 text-[11px] text-text-tertiary">{asset.subtitle}</p>
        </motion.div>

        {/* ── Chart (passive — no interaction handlers) ── */}
        <motion.div variants={fadeUp} className="px-4 overflow-hidden">
          <AreaChart
            data={chartData}
            positive={chartPositive}
            animationKey={activeRange}
            scrubIndex={scrubIndex}
            scrubLabel={scrubLabel}
            defaultLabel={defaultTimeLabel}
          />
        </motion.div>

        {/* ── Scrub slider ── */}
        <motion.div variants={fadeUp} className="px-4 -mt-1" ref={scrubSliderRef}>
          <ScrubSlider
            dataLength={chartData.length}
            onScrub={(idx) => setScrubIndex(idx)}
            onScrubEnd={() => setScrubIndex(null)}
          />
        </motion.div>

        {/* ── Time range pills ── */}
        <motion.div variants={fadeUp} className="flex gap-1 px-6 pt-3 pb-6">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`flex-1 rounded-full py-1.5 text-xs font-medium transition-colors ${
                activeRange === range
                  ? "bg-brand-gold/15 text-brand-gold"
                  : "text-text-muted"
              }`}
            >
              {range}
            </button>
          ))}
        </motion.div>

        {/* ── Key metrics row ── */}
        <motion.div variants={fadeUp} className="grid grid-cols-3 gap-2 px-6 pb-6">
          <div className="flex flex-col items-center rounded-xl bg-surface-default py-3 gap-1">
            <p className="text-[11px] text-text-muted">Rendement 1A</p>
            <p className={`text-[15px] font-semibold ${asset.annualReturnPositive ? "text-status-gain" : "text-status-loss"}`}>
              {asset.annualReturn}
            </p>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-surface-default py-3 gap-1">
            <p className="text-[11px] text-text-muted">Risque</p>
            <p className="text-[15px] font-semibold text-text-secondary" style={{ fontVariantNumeric: "tabular-nums" }}>
              {asset.riskLevel} / 7
            </p>
          </div>
          <div className="flex flex-col items-center rounded-xl bg-surface-default py-3 gap-1">
            <p className="text-[11px] text-text-muted">Frais</p>
            <p className="text-[15px] font-semibold text-text-primary">{asset.ter}</p>
          </div>
        </motion.div>

        {/* ── À propos ── */}
        <motion.section variants={fadeUp} className="px-6 pb-3">
          <p className="text-[13px] leading-relaxed text-text-muted">
            <ClarityText text={asset.description} terms={asset.clarityTerms} onTapTerm={handleClarityTap} />
          </p>
        </motion.section>

        {/* ── Détails ── */}
        <motion.section variants={fadeUp} className="px-6 pb-6">
          <div className="flex flex-col">
            {asset.details.map((row, i) => (
              <div
                key={row.label}
                className={`flex items-center justify-between py-3 ${
                  i < asset.details.length - 1 ? "border-b border-border-subtle" : ""
                }`}
              >
                <span className="text-[13px] text-text-muted">{row.label}</span>
                <span className="text-[13px] font-medium text-text-primary">{row.value}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Social proof ── */}
        <motion.div variants={fadeUp} className="flex items-center gap-2 px-6 pb-6">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0 text-text-tertiary">
            <path d="M8 1a4 4 0 0 1 4 4c0 2-1.5 3.5-4 5-2.5-1.5-4-3-4-5a4 4 0 0 1 4-4z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 14c0-2.5 2.5-4 6-4s6 1.5 6 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
          <p className="text-[11px] text-text-muted">
            {asset.investorCount} investisseurs suivent cet actif
          </p>
        </motion.div>

        {/* Bottom spacing for tab bar */}
        <div className="pb-28" />
      </motion.div>

    </motion.div>

      {/* ── Clarity drawer (outside drag container so it can scroll independently) ── */}
      <AnimatePresence>
        {clarityOpen && (
          <ClarityDrawer
            terms={asset.clarityTerms}
            activeTerm={clarityActiveTerm}
            onClose={() => { setClarityOpen(false); setClarityActiveTerm(null); }}
            onDeselect={() => setClarityActiveTerm(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

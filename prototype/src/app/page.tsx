"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion, useMotionValue, useTransform, animate as fmAnimate } from "framer-motion";
import StatusBar from "@/components/StatusBar";
import TopBar from "@/components/TopBar";
import BottomTabBar from "@/components/BottomTabBar";
import ObjectivesSheet from "@/components/ObjectivesSheet";
import type { ObjectivesData } from "@/components/ObjectivesSheet";
import InvestScreen from "@/screens/InvestScreen";
import AssetDetailScreen from "@/screens/AssetDetailScreen";
import OrderScreen from "@/screens/OrderScreen";
import OrderReviewScreen from "@/screens/OrderReviewScreen";
import PostTradeScreen from "@/screens/PostTradeScreen";
import DashboardScreen from "@/screens/DashboardScreen";

/* ============================================
   AMBIENT GLOW SYSTEM — 3 intensity tiers
   ============================================ */

type GlowLevel = "low" | "medium" | "high";

const GLOW = {
  low: {
    height: "h-64",
    background: [
      "radial-gradient(ellipse 80% 70% at 35% -5%, rgba(86, 130, 242, 0.35) 0%, transparent 60%)",
      "radial-gradient(ellipse 80% 70% at 65% -5%, rgba(241, 192, 134, 0.30) 0%, transparent 60%)",
    ].join(", "),
  },
  medium: {
    height: "h-[500px]",
    background: [
      "radial-gradient(ellipse 140% 120% at 55% 2%, rgba(70, 120, 255, 0.08) 0%, transparent 65%)",
      "radial-gradient(ellipse 120% 110% at 70% 0%, rgba(100, 70, 240, 0.06) 0%, transparent 65%)",
      "radial-gradient(ellipse 130% 110% at 85% 4%, rgba(140, 70, 210, 0.08) 0%, transparent 60%)",
      "radial-gradient(ellipse 100% 90% at 90% 2%, rgba(255, 200, 80, 0.06) 0%, transparent 60%)",
      "radial-gradient(ellipse 90% 80% at 92% 10%, rgba(255, 185, 60, 0.04) 0%, transparent 55%)",
      "radial-gradient(ellipse 80% 70% at 65% 8%, rgba(120, 90, 230, 0.04) 0%, transparent 60%)",
    ].join(", "),
  },
  high: {
    height: "h-[700px]",
    background: [
      "radial-gradient(ellipse 140% 120% at 55% 2%, rgba(70, 120, 255, 0.15) 0%, transparent 65%)",
      "radial-gradient(ellipse 120% 110% at 70% 0%, rgba(100, 70, 240, 0.12) 0%, transparent 65%)",
      "radial-gradient(ellipse 130% 110% at 85% 4%, rgba(140, 70, 210, 0.15) 0%, transparent 60%)",
      "radial-gradient(ellipse 100% 90% at 90% 2%, rgba(255, 200, 80, 0.12) 0%, transparent 60%)",
      "radial-gradient(ellipse 90% 80% at 92% 10%, rgba(255, 185, 60, 0.08) 0%, transparent 55%)",
      "radial-gradient(ellipse 80% 70% at 65% 8%, rgba(120, 90, 230, 0.08) 0%, transparent 60%)",
    ].join(", "),
  },
} as const;

/** Map each screen to a glow intensity — easy to swap */
const SCREEN_GLOW: Record<Screen, GlowLevel> = {
  invest: "low",
  assetDetail: "low",
  orderScreen: "high",
  orderReview: "medium",
  postTrade: "high",
};

/* ============================================
   SHARED APP CONTENT
   ============================================ */

type Screen = "invest" | "assetDetail" | "orderScreen" | "orderReview" | "postTrade";

function AppContent({
  objectives,
  objectivesRevision,
  onOpenSheet,
  sheetOpen,
  onComplete,
  onCloseSheet,
  isTouch,
  activeTab,
  onTabChange,
  activeScreen,
  selectedAsset,
  onSelectAsset,
  onBack,
  onBuy,
  onBackFromOrder,
  onConfirmOrder,
  onBackFromReview,
  onExecuteOrder,
  onDonePostTrade,
  investScrollKey,
  dismissing,
  orderAmount,
  hasCompletedTrade,
  dashboardKey,
  onToast,
  toast,
}: {
  objectives: ObjectivesData | null;
  objectivesRevision: number;
  onOpenSheet: () => void;
  sheetOpen: boolean;
  onComplete: (data: ObjectivesData) => void;
  onCloseSheet: () => void;
  isTouch: boolean;
  activeTab: "synthese" | "investir";
  onTabChange: (tab: "synthese" | "investir") => void;
  activeScreen: Screen;
  selectedAsset: string | null;
  onSelectAsset: (ticker: string) => void;
  onBack: () => void;
  onBuy: (ticker: string) => void;
  onBackFromOrder: () => void;
  onConfirmOrder: (amount: number) => void;
  onBackFromReview: () => void;
  onExecuteOrder: () => void;
  onDonePostTrade: () => void;
  investScrollKey: number;
  dismissing: boolean;
  orderAmount: number;
  hasCompletedTrade: boolean;
  dashboardKey: number;
  onToast: (msg?: string) => void;
  toast: string | null;
}) {
  /* Shared drag values for iOS-style side-by-side swipe-back */
  const detailDragX = useMotionValue(0);
  const orderDragX = useMotionValue(0);
  const reviewDragX = useMotionValue(0);
  const postTradeDragX = useMotionValue(0);
  // Invest screen sits to the LEFT of detail — slides in side-by-side
  const investX = useTransform(detailDragX, (v) => `calc(-100% + ${v}px)`);
  // Opacity ramps from 0.5 → 1 as user swipes back (0 → 393px drag)
  const investOpacity = useTransform(detailDragX, [0, 393], [0.5, 1]);

  // Animate invest screen in during dismiss (drive detailDragX 0→393 so investX tweens -100%→0)
  useEffect(() => {
    if (dismissing) {
      fmAnimate(detailDragX, 393, {
        type: "tween",
        duration: 0.35,
        ease: [0.32, 0.72, 0, 1],
      });
      return;
    }
  }, [dismissing, detailDragX]);

  // Reset dragX after render removes the style binding
  useEffect(() => {
    if (activeScreen === "invest" && !dismissing) detailDragX.set(0);
    if (activeScreen !== "orderScreen" && activeScreen !== "orderReview" && activeScreen !== "postTrade" && !dismissing) orderDragX.set(0);
    if (activeScreen !== "orderReview" && activeScreen !== "postTrade" && !dismissing) reviewDragX.set(0);
    if (activeScreen !== "postTrade" && !dismissing) postTradeDragX.set(0);
  }, [activeScreen, dismissing, detailDragX, orderDragX, reviewDragX, postTradeDragX]);

  return (
    <>
      {/* Ambient glow — 3-tier system (low / medium / high) per screen */}
      {(() => {
        const glowLevel = activeTab === "synthese" ? "medium" : SCREEN_GLOW[activeScreen];
        const glow = GLOW[glowLevel];
        return (
          <div
            className={`absolute inset-x-0 top-0 z-0 pointer-events-none transition-[height] duration-300 ${glow.height}`}
            style={{ background: glow.background }}
          />
        );
      })()}

      {/* Top chrome — StatusBar only (desktop), always visible */}
      {!isTouch && (
        <div className="relative z-10 shrink-0">
          <StatusBar />
        </div>
      )}

      {/* Screen content with iOS push/pop transitions */}
      <div className="relative z-10 flex-1 min-h-0 overflow-hidden select-none">

        {/* Dashboard screen — visible when synthese tab active */}
        {activeTab === "synthese" && (
          <div className="absolute inset-0 flex flex-col">
            <div className="shrink-0">
              <TopBar onToast={onToast} />
            </div>
            <div className="flex-1 min-h-0">
              <DashboardScreen
                key={dashboardKey}
                objectives={objectives}
                objectivesRevision={objectivesRevision}
                onOpenSheet={onOpenSheet}
                isTouch={isTouch}
                onToast={onToast}
                onNavigateToInvest={() => onTabChange("investir")}
                hasCompletedTrade={hasCompletedTrade}
                tradeAmount={orderAmount}
              />
            </div>
          </div>
        )}

        {/* Invest flow — all screens hidden when on synthese tab */}
        <div className="absolute inset-0" style={activeTab !== "investir" ? { display: "none" } : undefined}>
          {/* Invest screen — always mounted, slides side-by-side with detail */}
          <motion.div
            className="absolute inset-0 flex flex-col"
            style={
              activeScreen !== "invest" || dismissing
                ? { x: investX, opacity: investOpacity }
                : undefined
            }
            animate={
              activeScreen === "invest" && !dismissing
                ? { x: 0, opacity: 1 }
                : { x: "-100%", opacity: 0.5 }
            }
            transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            {/* TopBar slides with invest screen — no pop-in on back */}
            <div className="shrink-0">
              <TopBar onToast={onToast} />
            </div>
            <div className="flex-1 min-h-0">
              <InvestScreen
                objectives={objectives}
                objectivesRevision={objectivesRevision}
                onOpenSheet={onOpenSheet}
                onSelectAsset={onSelectAsset}
                isTouch={isTouch}
                onToast={onToast}
                scrollKey={investScrollKey}
              />
            </div>
          </motion.div>

          {/* Asset detail screen — stays mounted when deeper screens are open, or during dismiss */}
          <AnimatePresence initial={false}>
            {(activeScreen === "assetDetail" || activeScreen === "orderScreen" || activeScreen === "orderReview" || activeScreen === "postTrade" || dismissing) && selectedAsset && (
              <motion.div
                key="assetDetail"
                className="absolute inset-0 overflow-hidden"
                initial={{ x: "100%" }}
                animate={
                  dismissing
                    ? { x: "-100%", opacity: 0 }
                    : activeScreen !== "assetDetail"
                      ? { x: "-100%", opacity: 0.5 }
                      : { x: 0, opacity: 1 }
                }
                exit={{ x: "100%", opacity: 1, transition: { duration: 0 } }}
                transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              >
                <AssetDetailScreen
                  ticker={selectedAsset}
                  onBack={onBack}
                  isTouch={isTouch}
                  sharedDragX={detailDragX}
                  onToast={onToast}
                  onBuy={onBuy}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Order screen — stays mounted when deeper screens are open, or during dismiss */}
          <AnimatePresence initial={false}>
            {(activeScreen === "orderScreen" || activeScreen === "orderReview" || activeScreen === "postTrade" || dismissing) && selectedAsset && (
              <motion.div
                key="orderScreen"
                className="absolute inset-0 overflow-hidden"
                initial={{ x: "100%" }}
                animate={
                  dismissing
                    ? { x: "-100%", opacity: 0 }
                    : activeScreen === "orderReview" || activeScreen === "postTrade"
                      ? { x: "-100%", opacity: 0.5 }
                      : { x: 0, opacity: 1 }
                }
                exit={{ x: "-100%", transition: { duration: 0 } }}
                transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              >
                <OrderScreen
                  ticker={selectedAsset}
                  onBack={onBackFromOrder}
                  isTouch={isTouch}
                  sharedDragX={orderDragX}
                  onToast={onToast}
                  objectives={objectives}
                  onConfirmOrder={onConfirmOrder}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Order review screen — stays mounted when postTrade is open, or during dismiss */}
          <AnimatePresence initial={false}>
            {(activeScreen === "orderReview" || activeScreen === "postTrade" || dismissing) && selectedAsset && (
              <motion.div
                key="orderReview"
                className="absolute inset-0 overflow-hidden"
                initial={{ x: "100%" }}
                animate={
                  dismissing
                    ? { x: "-100%", opacity: 0 }
                    : activeScreen === "postTrade"
                      ? { x: "-100%", opacity: 0.5 }
                      : { x: 0, opacity: 1 }
                }
                exit={{ x: "-100%", transition: { duration: 0 } }}
                transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              >
                <OrderReviewScreen
                  ticker={selectedAsset}
                  amount={orderAmount}
                  onBack={onBackFromReview}
                  onConfirm={onExecuteOrder}
                  isTouch={isTouch}
                  sharedDragX={reviewDragX}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Post-trade confirmation */}
          <AnimatePresence initial={false}>
            {(activeScreen === "postTrade" || dismissing) && selectedAsset && (
            <motion.div
              key="postTrade"
              className="absolute inset-0 overflow-hidden"
              initial={{ x: "100%" }}
              animate={
                dismissing
                  ? { x: "100%", opacity: 0 }
                  : { x: 0, opacity: 1 }
              }
              exit={{ x: "100%", transition: { duration: 0 } }}
              transition={{ type: "tween", duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            >
              <PostTradeScreen
                ticker={selectedAsset}
                amount={orderAmount}
                onDone={onDonePostTrade}
                isTouch={isTouch}
                sharedDragX={postTradeDragX}
                objectiveLabel={objectives?.goal ?? null}
                objectiveAmount={objectives?.amount ?? null}
                onToast={onToast}
              />
            </motion.div>
          )}
          </AnimatePresence>
        </div>{/* end invest flow wrapper */}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-x-0 top-16 z-30 flex justify-center pointer-events-none"
          >
            <div className="rounded-full bg-brand-gold px-5 py-2.5 shadow-lg">
              <p className="text-[13px] font-medium text-black">{toast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom tab bar */}
      <BottomTabBar
        activeTab={activeTab}
        onTabPress={(id) => {
          if (id === "synthese") onTabChange("synthese");
          else if (id === "investir") onTabChange("investir");
          else onToast();
        }}
      />

      {/* Objectives bottom sheet */}
      <AnimatePresence>
        {sheetOpen && (
          <ObjectivesSheet
            initial={objectives}
            onComplete={onComplete}
            onClose={onCloseSheet}
          />
        )}
      </AnimatePresence>
    </>
  );
}

/* ============================================
   PAGE
   ============================================ */

export default function Home() {
  const [objectives, setObjectives] = useState<ObjectivesData | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [objectivesRevision, setObjectivesRevision] = useState(0);
  const [activeTab, setActiveTab] = useState<"synthese" | "investir">("synthese");
  const [activeScreen, setActiveScreen] = useState<Screen>("invest");
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null);
  const [hasCompletedTrade, setHasCompletedTrade] = useState(false);
  const [dashboardKey, setDashboardKey] = useState(0);
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [zoom, setZoom] = useState(1);
  const [bgLightness, setBgLightness] = useState(50);

  /* Detect touch device */
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  /* Build QR URL — use network IP in dev so phones on same WiFi can reach it */
  useEffect(() => {
    const origin = window.location.origin;
    if (origin.includes("localhost") || origin.includes("127.0.0.1")) {
      fetch("/api/network-ip")
        .then((r) => r.json())
        .then((data) => {
          if (data.ip) {
            setQrUrl(`http://${data.ip}:${window.location.port}`);
          } else {
            setQrUrl(origin);
          }
        })
        .catch(() => setQrUrl(origin));
    } else {
      setQrUrl(origin);
    }
  }, []);

  /* Touch cursor for phone frame (desktop only) */
  const cursorRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const [cursorVisible, setCursorVisible] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cursorRef.current || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    cursorRef.current.style.left = `${(e.clientX - rect.left) / zoom}px`;
    cursorRef.current.style.top = `${(e.clientY - rect.top) / zoom}px`;
  }, [zoom]);

  const handleComplete = useCallback((data: ObjectivesData) => {
    setObjectives(data);
    setObjectivesRevision((r) => r + 1);
    setSheetOpen(false);
  }, []);

  const handleCloseSheet = useCallback(() => setSheetOpen(false), []);
  const handleOpenSheet = useCallback(() => setSheetOpen(true), []);

  const handleSelectAsset = useCallback((ticker: string) => {
    setSelectedAsset(ticker);
    setActiveScreen("assetDetail");
  }, []);
  const handleBack = useCallback(() => setActiveScreen("invest"), []);
  const handleBuy = useCallback((ticker: string) => {
    setSelectedAsset(ticker);
    setActiveScreen("orderScreen");
  }, []);
  const handleBackFromOrder = useCallback(() => setActiveScreen("assetDetail"), []);
  const [orderAmount, setOrderAmount] = useState(1000);
  const handleConfirmOrder = useCallback((amount: number) => {
    setOrderAmount(amount);
    setActiveScreen("orderReview");
  }, []);
  const handleBackFromReview = useCallback(() => setActiveScreen("orderScreen"), []);

  /* Toast */
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleToast = useCallback((msg?: string) => {
    setToast(msg ?? "Hors scope proto");
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1500);
  }, []);

  const handleExecuteOrder = useCallback(() => {
    setActiveScreen("postTrade");
  }, []);
  const [dismissing, setDismissing] = useState(false);
  const [investScrollKey, setInvestScrollKey] = useState(0);
  const handleDonePostTrade = useCallback(() => {
    setDismissing(true);
    setActiveScreen("invest");
    setHasCompletedTrade(true);
    setInvestScrollKey((k) => k + 1);
    // Delay unmount so exit animations play (300ms transition)
    setTimeout(() => {
      setSelectedAsset(null);
      setDismissing(false);
    }, 350);
  }, []);

  /* ── Mobile: fullscreen, no frame ── */
  if (isTouch) {
    return (
      <div className="fixed inset-0 flex flex-col bg-black overflow-hidden" style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}>
        <AppContent
          objectives={objectives}
          objectivesRevision={objectivesRevision}
          onOpenSheet={handleOpenSheet}
          sheetOpen={sheetOpen}
          onComplete={handleComplete}
          onCloseSheet={handleCloseSheet}
          isTouch={isTouch}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeScreen={activeScreen}
          selectedAsset={selectedAsset}
          onSelectAsset={handleSelectAsset}
          onBack={handleBack}
          onBuy={handleBuy}
          onBackFromOrder={handleBackFromOrder}
          onConfirmOrder={handleConfirmOrder}
          onBackFromReview={handleBackFromReview}
          onExecuteOrder={handleExecuteOrder}
          onDonePostTrade={handleDonePostTrade}
          investScrollKey={investScrollKey}
          dismissing={dismissing}
          orderAmount={orderAmount}
          hasCompletedTrade={hasCompletedTrade}
          dashboardKey={dashboardKey}
          onToast={handleToast}
          toast={toast}
        />
      </div>
    );
  }

  /* ── Desktop: presentation shell with phone frame ── */
  return (
    <div className="flex min-h-screen items-center justify-center p-8" style={{ backgroundColor: `hsl(240, 4%, ${bgLightness}%)` }}>
      {/* Presentation controls */}
      {(() => {
        const light = bgLightness >= 50;
        const labelCls = `text-center text-[9px] font-medium uppercase tracking-wider ${light ? "text-black/70" : "text-white"}`;
        const btnCls = `flex h-9 w-9 items-center justify-center rounded-full transition-colors ${light ? "bg-black/8 text-black/75 hover:bg-black/12 hover:text-black/90" : "bg-white/8 text-white/75 hover:bg-white/12 hover:text-white/90"}`;
        const valCls = `flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-medium transition-colors ${light ? "text-black/70 hover:text-black/90" : "text-white hover:text-white"}`;
        const divCls = `mx-auto h-px w-5 ${light ? "bg-black/20" : "bg-white/20"}`;
        return (
      <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
        {/* Reset label + button */}
        <p className={labelCls}>Reset</p>
        <button
          onClick={() => {
            setObjectives(null);
            setSheetOpen(false);
            setActiveScreen("invest");
            setSelectedAsset(null);
            setActiveTab("synthese");
            setHasCompletedTrade(false);
            setDashboardKey(k => k + 1);
          }}
          className={btnCls}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.5 7A6 6 0 1 1 3.8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Divider */}
        <div className={divCls} />

        {/* QR label + button */}
        <p className={labelCls}>QR</p>
        <button
          onClick={() => setShowQR((v) => !v)}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            showQR
              ? light ? "bg-black/25 text-black/90" : "bg-white/25 text-white/90"
              : light ? "bg-black/8 text-black/75 hover:bg-black/12 hover:text-black/90" : "bg-white/8 text-white/75 hover:bg-white/12 hover:text-white/90"
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <rect x="9" y="1" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <rect x="1" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
            <rect x="3" y="3" width="2" height="2" fill="currentColor" />
            <rect x="11" y="3" width="2" height="2" fill="currentColor" />
            <rect x="3" y="11" width="2" height="2" fill="currentColor" />
            <rect x="9" y="9" width="2" height="2" fill="currentColor" />
            <rect x="13" y="9" width="2" height="2" fill="currentColor" />
            <rect x="9" y="13" width="2" height="2" fill="currentColor" />
            <rect x="13" y="13" width="2" height="2" fill="currentColor" />
            <rect x="11" y="11" width="2" height="2" fill="currentColor" />
          </svg>
        </button>

        {/* Zoom divider + label */}
        <div className={divCls} />
        <p className={labelCls}>Zoom</p>

        {/* Zoom out */}
        <button onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.05).toFixed(2)))} className={btnCls}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Zoom value — click to reset */}
        <button onClick={() => setZoom(1)} className={valCls} title="Reset zoom">
          {Math.round(zoom * 100)}%
        </button>

        {/* Zoom in */}
        <button onClick={() => setZoom((z) => Math.min(1.2, +(z + 0.05).toFixed(2)))} className={btnCls}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Light divider + label */}
        <div className={divCls} />
        <p className={labelCls}>Light</p>

        {/* Darker */}
        <button onClick={() => setBgLightness((l) => Math.max(0, l - 5))} className={btnCls} title="Darker background">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Light value — click to reset */}
        <button onClick={() => setBgLightness(50)} className={valCls} title="Reset lightness">
          {bgLightness}%
        </button>

        {/* Lighter */}
        <button onClick={() => setBgLightness((l) => Math.min(100, l + 5))} className={btnCls} title="Lighter background">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>
        );
      })()}

      {/* QR code modal */}
      <AnimatePresence>
        {showQR && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowQR(false)}
            />
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="relative pointer-events-auto w-[340px] rounded-2xl bg-[#1C1C1E] p-6 shadow-2xl">
                {/* Close button */}
                <button
                  onClick={() => setShowQR(false)}
                  className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/15 hover:text-white/90 transition-colors"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 1l12 12M13 1L1 13"/></svg>
                </button>

                {/* Title */}
                <h2 className="text-[17px] font-semibold text-white/90 mb-5">Ouvrir sur iPhone</h2>

                {/* QR code */}
                <div className="flex flex-col items-center gap-2 mb-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrUrl)}&bgcolor=ffffff&color=000000&margin=0`}
                    alt="QR Code"
                    width={180}
                    height={180}
                    className="rounded-xl"
                  />
                  <p className="text-[11px] text-white/30 font-mono">{qrUrl}</p>
                </div>

                {/* Divider */}
                <div className="h-px bg-white/10 mb-4" />

                {/* Instructions */}
                <p className="text-[13px] font-medium text-white/60 mb-3">Pour une expérience plein écran :</p>
                <ol className="space-y-2 text-[12px] text-white/45 leading-relaxed">
                  <li className="flex gap-2.5">
                    <span className="shrink-0 text-white/25">1.</span>
                    <span>Scanner le QR code avec l&apos;appareil photo</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="shrink-0 text-white/25">2.</span>
                    <span>Appuyer sur <span className="inline-flex align-text-bottom mx-0.5"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></span> Partager dans Safari</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="shrink-0 text-white/25">3.</span>
                    <span>Choisir « Sur l&apos;écran d&apos;accueil »</span>
                  </li>
                  <li className="flex gap-2.5">
                    <span className="shrink-0 text-white/25">4.</span>
                    <span>Ouvrir l&apos;app depuis le raccourci sur l&apos;écran d&apos;accueil</span>
                  </li>
                </ol>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* iPhone 15 Pro frame — wrapper sizes to scaled dimensions so flexbox centers correctly */}
      <div
        className="flex items-center justify-center transition-[height] duration-200 ease-out"
        style={{ height: 852 * zoom }}
      >
      <div
        ref={frameRef}
        className="phone-frame flex flex-col rounded-[44px] border border-white/25 overflow-hidden cursor-none transition-transform duration-200 ease-out"
        style={{
          transform: zoom !== 1 ? `scale(${zoom})` : undefined,
          transformOrigin: "center center",
          boxShadow: "0 4px 24px rgba(0, 0, 0, 0.3), 0 1px 8px rgba(0, 0, 0, 0.2)",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setCursorVisible(true)}
        onMouseLeave={() => setCursorVisible(false)}
      >
        {/* Touch cursor */}
        <div
          ref={cursorRef}
          className="pointer-events-none absolute z-50 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-150"
          style={{ opacity: cursorVisible ? 1 : 0 }}
        >
          <div className="h-10 w-10 rounded-full border border-white/25 bg-white/8" />
        </div>

        <AppContent
          objectives={objectives}
          objectivesRevision={objectivesRevision}
          onOpenSheet={handleOpenSheet}
          sheetOpen={sheetOpen}
          onComplete={handleComplete}
          onCloseSheet={handleCloseSheet}
          isTouch={false}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activeScreen={activeScreen}
          selectedAsset={selectedAsset}
          onSelectAsset={handleSelectAsset}
          onBack={handleBack}
          onBuy={handleBuy}
          onBackFromOrder={handleBackFromOrder}
          onConfirmOrder={handleConfirmOrder}
          onBackFromReview={handleBackFromReview}
          onExecuteOrder={handleExecuteOrder}
          onDonePostTrade={handleDonePostTrade}
          investScrollKey={investScrollKey}
          dismissing={dismissing}
          orderAmount={orderAmount}
          hasCompletedTrade={hasCompletedTrade}
          dashboardKey={dashboardKey}
          onToast={handleToast}
          toast={toast}
        />
      </div>
      </div>
    </div>
  );
}

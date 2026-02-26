"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StatusBar from "@/components/StatusBar";
import TopBar from "@/components/TopBar";
import BottomTabBar from "@/components/BottomTabBar";
import ObjectivesSheet from "@/components/ObjectivesSheet";
import type { ObjectivesData } from "@/components/ObjectivesSheet";
import InvestScreen from "@/screens/InvestScreen";

/* ============================================
   SHARED APP CONTENT
   ============================================ */

function AppContent({
  objectives,
  objectivesRevision,
  onOpenSheet,
  sheetOpen,
  onComplete,
  onCloseSheet,
  isTouch,
}: {
  objectives: ObjectivesData | null;
  objectivesRevision: number;
  onOpenSheet: () => void;
  sheetOpen: boolean;
  onComplete: (data: ObjectivesData) => void;
  onCloseSheet: () => void;
  isTouch: boolean;
}) {
  return (
    <>
      {/* Ambient glow — dual blue/gold gradient */}
      <div
        className="absolute inset-x-0 top-0 z-0 h-64 pointer-events-none"
        style={{
          background: [
            "radial-gradient(ellipse 80% 70% at 35% -5%, rgba(86, 130, 242, 0.20) 0%, transparent 60%)",
            "radial-gradient(ellipse 80% 70% at 65% -5%, rgba(241, 192, 134, 0.18) 0%, transparent 60%)",
          ].join(", "),
        }}
      />

      {/* Top chrome */}
      <div className="relative z-10 shrink-0">
        {!isTouch && <StatusBar />}
        <TopBar />
      </div>

      {/* Scrollable content */}
      <div className="relative z-10 flex-1 min-h-0">
        <InvestScreen
          objectives={objectives}
          objectivesRevision={objectivesRevision}
          onOpenSheet={onOpenSheet}
          isTouch={isTouch}
        />
      </div>

      {/* Bottom tab bar */}
      <BottomTabBar activeTab="investir" />

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
  const [showQR, setShowQR] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [zoom, setZoom] = useState(1);

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
    cursorRef.current.style.left = `${e.clientX - rect.left}px`;
    cursorRef.current.style.top = `${e.clientY - rect.top}px`;
  }, []);

  const handleComplete = useCallback((data: ObjectivesData) => {
    setObjectives(data);
    setObjectivesRevision((r) => r + 1);
    setSheetOpen(false);
  }, []);

  const handleCloseSheet = useCallback(() => setSheetOpen(false), []);
  const handleOpenSheet = useCallback(() => setSheetOpen(true), []);

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
        />
      </div>
    );
  }

  /* ── Desktop: presentation shell with phone frame ── */
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1C1C1E] p-8">
      {/* Presentation controls */}
      <div className="fixed left-6 top-6 z-50 flex flex-col gap-3">
        {/* Reset button */}
        <button
          onClick={() => {
            setObjectives(null);
            setSheetOpen(false);
          }}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/40 transition-colors hover:bg-white/12 hover:text-white/60"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 2v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.5 7A6 6 0 1 1 3.8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* QR code button */}
        <button
          onClick={() => setShowQR((v) => !v)}
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            showQR
              ? "bg-white/20 text-white/70"
              : "bg-white/8 text-white/40 hover:bg-white/12 hover:text-white/60"
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

        {/* Zoom divider */}
        <div className="mx-auto h-px w-5 bg-white/10" />

        {/* Zoom out */}
        <button
          onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.05).toFixed(2)))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/40 transition-colors hover:bg-white/12 hover:text-white/60"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Zoom label */}
        <button
          onClick={() => setZoom(1)}
          className="flex h-9 w-9 items-center justify-center rounded-full text-[10px] font-medium text-white/40 transition-colors hover:text-white/60"
          title="Reset zoom"
        >
          {Math.round(zoom * 100)}%
        </button>

        {/* Zoom in */}
        <button
          onClick={() => setZoom((z) => Math.min(1.2, +(z + 0.05).toFixed(2)))}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-white/40 transition-colors hover:bg-white/12 hover:text-white/60"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 3v8M3 7h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* QR code overlay */}
      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed left-6 top-[7.5rem] z-50 flex flex-col items-center gap-3 rounded-2xl bg-white p-4 shadow-2xl"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(qrUrl)}&bgcolor=ffffff&color=000000&margin=0`}
              alt="QR Code"
              width={160}
              height={160}
              className="rounded-lg"
            />
            <p className="max-w-[160px] text-center text-[10px] leading-tight text-black/50">
              Ouvrir sur mobile
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iPhone 15 Pro frame */}
      <div
        ref={frameRef}
        className="phone-frame flex flex-col rounded-[44px] border border-white/25 overflow-hidden cursor-none transition-transform duration-200 ease-out"
        style={{
          transform: zoom !== 1 ? `scale(${zoom})` : undefined,
          boxShadow: "0 0 80px 20px rgba(0, 0, 0, 0.5), 0 0 160px 60px rgba(0, 0, 0, 0.3)",
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
        />
      </div>
    </div>
  );
}

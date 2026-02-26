"use client";

import StatusBar from "@/components/StatusBar";
import TopBar from "@/components/TopBar";
import BottomTabBar from "@/components/BottomTabBar";
import InvestScreen from "@/screens/InvestScreen";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-secondary p-8">
      {/* iPhone 15 Pro frame */}
      <div className="phone-frame flex flex-col rounded-[44px] border border-border-subtle shadow-2xl overflow-hidden">
        {/* Ambient glow — subtle gradient behind top area, fades to black */}
        <div
          className="absolute inset-x-0 top-0 z-0 h-64 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 50% -5%, rgba(100, 140, 240, 0.22) 0%, rgba(90, 130, 230, 0.10) 45%, transparent 100%)",
          }}
        />

        {/* Top chrome — sits above the glow */}
        <div className="relative z-10 shrink-0">
          <StatusBar />
          <TopBar />
        </div>

        {/* Scrollable content — fills remaining space */}
        <div className="relative z-10 flex-1 min-h-0">
          <InvestScreen />
        </div>

        {/* Bottom tab bar */}
        <BottomTabBar activeTab="investir" />
      </div>
    </div>
  );
}

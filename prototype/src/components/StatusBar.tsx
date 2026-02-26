"use client";

// iPhone 15 Pro: status bar content sits ~14pt from top edge
// Using pt-[14px] for accurate placement, pb-2 (8px) before top bar
export default function StatusBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-[14px] pb-2">
      <span className="text-sm font-semibold text-text-primary">9:41</span>
      <div className="flex items-center gap-1.5">
        {/* Signal bars */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor" className="text-text-primary">
          <rect x="0" y="8" width="3" height="4" rx="0.5" />
          <rect x="4.5" y="5" width="3" height="7" rx="0.5" />
          <rect x="9" y="2" width="3" height="10" rx="0.5" />
          <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.3" />
        </svg>
        {/* WiFi */}
        <svg width="14" height="12" viewBox="0 0 14 12" fill="currentColor" className="text-text-primary">
          <path d="M7 10.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3z" />
          <path d="M3.5 8.5a5 5 0 017 0" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M1 5.5a8 8 0 0112 0" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
        {/* Battery */}
        <div className="flex items-center">
          <div className="h-3 w-6 rounded-[2px] border border-text-primary/40 p-[1.5px]">
            <div className="h-full w-3/4 rounded-[1px] bg-text-primary" />
          </div>
          <div className="ml-[1px] h-1.5 w-[1.5px] rounded-r-sm bg-text-primary/40" />
        </div>
      </div>
    </div>
  );
}

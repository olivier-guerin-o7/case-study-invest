"use client";

// Spacing: 8px top (from status bar pb-2), 16px bottom before content
// Right icons gap: 16px (2 grid units)
// All icons: 22px inside flex-aligned containers
export default function TopBar() {
  return (
    <div className="flex items-center justify-between px-6 pt-1 pb-4">
      {/* Profile icon — outline person with bottom line, on translucent bg */}
      {/* 40px circle, 22px icon centered inside */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/8">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary/80">
          <circle cx="9" cy="5" r="2.8" />
          <path d="M3 14.5c0-2.8 2.7-5 6-5s6 2.2 6 5" />
          <line x1="3" y1="15.5" x2="15" y2="15.5" />
        </svg>
      </div>

      {/* Right icons — 22px each, aligned to center of the 40px profile circle */}
      {/* Wrapped in same-height containers so icon centers align horizontally */}
      <div className="flex items-center gap-2">
        {/* Clock / Recent — with small notification dot */}
        <div className="relative flex h-10 w-10 items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
            <circle cx="11" cy="11" r="8.5" />
            <polyline points="11,6 11,11 14,13" />
          </svg>
          {/* Gold notification dot — small, clearly offset from icon */}
          <div className="absolute top-1.5 right-1.5 h-[5px] w-[5px] rounded-full bg-brand-gold" />
        </div>

        {/* Eye / Visibility */}
        <div className="flex h-10 w-10 items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="text-white/50">
            <path d="M2 11s3.8-6.5 9-6.5S20 11 20 11s-3.8 6.5-9 6.5S2 11 2 11z" />
            <circle cx="11" cy="11" r="3" />
          </svg>
        </div>
      </div>
    </div>
  );
}

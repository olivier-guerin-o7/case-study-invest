"use client";

interface BottomTabBarProps {
  activeTab?: string;
}

const tabs = [
  {
    id: "synthese",
    label: "Synthèse",
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="2" y="2" width="6.5" height="6.5" rx="1.5" />
        <rect x="11.5" y="2" width="6.5" height="6.5" rx="1.5" />
        <rect x="2" y="11.5" width="6.5" height="6.5" rx="1.5" />
        <rect x="11.5" y="11.5" width="6.5" height="6.5" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "patrimoine",
    label: "Patrimoine",
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <line x1="4" y1="17" x2="4" y2="9" />
        <line x1="8" y1="17" x2="8" y2="5" />
        <line x1="12" y1="17" x2="12" y2="11" />
        <line x1="16" y1="17" x2="16" y2="7" />
      </svg>
    ),
  },
  {
    id: "budget",
    label: "Budget",
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="2" width="14" height="16" rx="2" />
        <line x1="7" y1="6" x2="13" y2="6" />
        <line x1="7" y1="9.5" x2="13" y2="9.5" />
        <line x1="7" y1="13" x2="11" y2="13" />
      </svg>
    ),
  },
  {
    id: "analyse",
    label: "Analyses",
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="10" cy="10" r="8" />
        <path d="M10 6v4l2.5 2.5" />
      </svg>
    ),
  },
  {
    id: "investir",
    label: "Investir",
    icon: () => (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 2L3 6.5h14L10 2z" />
        <line x1="5" y1="6.5" x2="5" y2="15" />
        <line x1="8.3" y1="6.5" x2="8.3" y2="15" />
        <line x1="11.7" y1="6.5" x2="11.7" y2="15" />
        <line x1="15" y1="6.5" x2="15" y2="15" />
        <line x1="2" y1="15" x2="18" y2="15" />
        <line x1="1.5" y1="17.5" x2="18.5" y2="17.5" />
      </svg>
    ),
  },
];

export default function BottomTabBar({ activeTab = "investir" }: BottomTabBarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/5 bg-[#0C0C0E]">
      <div className="flex items-end justify-around px-2 pt-4 pb-7">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              className={`flex flex-col items-center gap-1.5 transition-colors ${
                isActive ? "text-brand-gold" : "text-text-tertiary"
              }`}
            >
              {tab.icon()}
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

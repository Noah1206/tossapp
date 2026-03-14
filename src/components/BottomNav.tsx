"use client";

import Link from "next/link";

interface BottomNavProps {
  active: "home" | "history" | "credits";
}

const navItems = [
  {
    key: "home" as const,
    label: "홈",
    href: "/",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"
          fill={active ? "var(--color-brand)" : "none"}
          stroke={active ? "var(--color-brand)" : "#999999"}
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        {!active && <path d="M9 21V14h6v7" stroke="#999999" strokeWidth="1.8" strokeLinejoin="round"/>}
      </svg>
    ),
  },
  {
    key: "history" as const,
    label: "내역",
    href: "/history",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="18" height="17" rx="2" stroke={active ? "var(--color-brand)" : "#999999"} strokeWidth="1.8"/>
        <path d="M8 2v4M16 2v4M3 9h18" stroke={active ? "var(--color-brand)" : "#999999"} strokeWidth="1.8" strokeLinecap="round"/>
        {active && <rect x="7" y="12" width="4" height="4" rx="1" fill="var(--color-brand)"/>}
      </svg>
    ),
  },
  {
    key: "credits" as const,
    label: "충전",
    href: "/credits",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={active ? "var(--color-brand)" : "#999999"} strokeWidth="1.8"/>
        <path d="M12 7v10M9 12h6" stroke={active ? "var(--color-brand)" : "#999999"} strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
];

export default function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="bg-white border-t border-[var(--color-border)]">
      <div className="flex items-center justify-around h-[52px]">
        {navItems.map((item) => {
          const isActive = active === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              className="flex flex-col items-center gap-0.5 py-1 px-5 press-effect"
            >
              {item.icon(isActive)}
              <span
                className={`text-[10px] font-semibold ${
                  isActive ? "text-[var(--color-brand)]" : "text-[var(--color-text-tertiary)]"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="safe-area-bottom" />
    </nav>
  );
}

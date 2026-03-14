"use client";

import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
  credits: number;
  title?: string;
  showBack?: boolean;
  onMenuClick?: () => void;
}

export default function Header({ credits, title, showBack, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between h-[52px] px-5">
        <div className="flex items-center gap-2.5">
          {showBack ? (
            <button
              onClick={() => window.history.back()}
              className="w-8 h-8 flex items-center justify-center -ml-2 press-effect"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M15 19l-7-7 7-7" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ) : (
            <>
              {onMenuClick && (
                <button
                  onClick={onMenuClick}
                  className="w-8 h-8 flex items-center justify-center -ml-2 press-effect"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M4 7h16M4 12h16M4 17h16" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              )}
              <Image src="/logo.png" alt="LOGOS" width={24} height={24} className="w-6 h-6" />
              <span className="text-[16px] font-bold tracking-tight">LOGOS</span>
            </>
          )}
          {title && (
            <span className="text-[16px] font-bold">{title}</span>
          )}
        </div>

        <Link
          href="/credits"
          className="flex items-center gap-1.5 h-7 px-2.5 rounded-full border border-[var(--color-border)] press-effect"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-[var(--color-brand)] flex items-center justify-center">
            <span className="text-[7px] font-black text-white leading-none">C</span>
          </div>
          <span className="text-[13px] font-semibold tabular-nums">{credits}</span>
        </Link>
      </div>
    </header>
  );
}

"use client";

import { useEffect } from "react";

interface HistoryItem {
  id: string;
  platform: "youtube" | "instagram";
  title: string;
  createdAt: Date;
}

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const sampleHistory: HistoryItem[] = [
  {
    id: "1",
    platform: "youtube",
    title: "이런 꿀팁 몰랐죠? 지금 바로 확인하세요!",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    platform: "instagram",
    title: "매일 아침 이것만 하면 달라져요",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: "3",
    platform: "youtube",
    title: "이 운동 루틴 따라만 하세요",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

const formatTime = (date: Date) => {
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
};

export default function HistorySidebar({ isOpen, onClose }: HistorySidebarProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/20 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 left-0 z-[70] h-full w-[280px] max-w-[80vw] bg-white border-r border-[var(--color-border)] transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-[52px] px-5 border-b border-[var(--color-border)]">
          <span className="text-[15px] font-bold">내역</span>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center press-effect">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="px-3 py-3">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-black text-white press-effect">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span className="text-[13px] font-semibold">새 변환</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 pb-8">
          <p className="text-[11px] font-medium text-black/30 uppercase tracking-wider mb-1.5 px-2">
            최근
          </p>
          <div className="space-y-0.5">
            {sampleHistory.map((item) => (
              <button
                key={item.id}
                className="w-full flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg text-left hover:bg-[var(--color-surface-secondary)] press-effect transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 opacity-30">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="black" strokeWidth="1.5"/>
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium truncate">{item.title}</p>
                  <p className="text-[11px] text-black/30 mt-0.5">{formatTime(item.createdAt)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

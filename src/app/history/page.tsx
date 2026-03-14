"use client";

import { useState } from "react";
import Header from "@/components/Header";

interface HistoryItem {
  id: string;
  platform: "youtube" | "instagram";
  title: string;
  preview: string;
  createdAt: Date;
}

const sampleHistory: HistoryItem[] = [
  {
    id: "1",
    platform: "youtube",
    title: "이런 꿀팁 몰랐죠? 지금 바로 확인하세요!",
    preview: "안녕하세요 여러분! 오늘은 정말 유용한 정보를 가져왔어요...",
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: "2",
    platform: "instagram",
    title: "매일 아침 이것만 하면 달라져요",
    preview: "최근 많은 분들이 물어보신 루틴을 정리해봤어요...",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
  },
  {
    id: "3",
    platform: "youtube",
    title: "이 운동 루틴 따라만 하세요",
    preview: "헬스장 안가도 집에서 충분히 할 수 있는 루틴...",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
];

export default function HistoryPage() {
  const [history] = useState<HistoryItem[]>(sampleHistory);
  const credits = 3;

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  return (
    <div className="flex flex-col h-dvh bg-white">
      <Header credits={credits} title="변환 내역" showBack />

      <main className="flex-1 overflow-y-auto">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full px-8">
            <p className="text-[15px] font-bold">아직 내역이 없어요</p>
            <p className="text-[13px] text-black/40 mt-1 text-center">
              영상 링크를 보내서 첫 변환을 해보세요
            </p>
          </div>
        ) : (
          <div className="px-5 py-4">
            <p className="text-[11px] font-medium text-black/30 mb-3 uppercase tracking-wider">
              최근 변환 {history.length}건
            </p>
            <div className="space-y-2">
              {history.map((item) => (
                <button
                  key={item.id}
                  className="w-full border border-[var(--color-border)] rounded-xl p-4 text-left press-effect"
                >
                  <div className="flex items-start gap-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5 opacity-30">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="black" strokeWidth="1.5"/>
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold truncate">{item.title}</p>
                      <p className="text-[12px] text-black/40 mt-1 line-clamp-1">{item.preview}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[11px] text-black/30">{item.platform === "youtube" ? "YouTube" : "Instagram"}</span>
                        <span className="text-[11px] text-black/20">·</span>
                        <span className="text-[11px] text-black/30">{formatTime(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

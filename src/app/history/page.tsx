"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

interface HistoryItem {
  id: string;
  platform: "youtube" | "instagram";
  title: string | null;
  preview: string | null;
  sourceUrl: string;
  createdAt: string;
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("toss_user_id");
    if (!userId) {
      setLoading(false);
      return;
    }
    fetch(`/api/history?userId=${userId}&sort=newest`)
      .then((r) => r.json())
      .then((data) => setHistory(data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const formatTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 60) return `${minutes}분 전`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}시간 전`;
    const days = Math.floor(hours / 24);
    return `${days}일 전`;
  };

  const userId = typeof window !== "undefined" ? localStorage.getItem("toss_user_id") : null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#FFFFFF' }}>
      <Header title="변환 내역" showBack />

      <main style={{ flex: 1, overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        ) : !userId ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0 32px' }}>
            <p style={{ fontSize: 15, fontWeight: 700 }}>로그인이 필요해요</p>
            <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', marginTop: 4, textAlign: 'center' }}>
              변환 내역을 보려면 로그인해주세요
            </p>
          </div>
        ) : history.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0 32px' }}>
            <p style={{ fontSize: 15, fontWeight: 700 }}>아직 내역이 없어요</p>
            <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', marginTop: 4, textAlign: 'center' }}>
              영상 링크를 보내서 첫 변환을 해보세요
            </p>
          </div>
        ) : (
          <div style={{ padding: '16px 20px' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.3)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              최근 변환 {history.length}건
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.map((item) => (
                <button
                  key={item.id}
                  className="press-effect"
                  onClick={() => router.push(`/result?url=${encodeURIComponent(item.sourceUrl)}`)}
                  style={{
                    width: '100%',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 14,
                    padding: 16,
                    textAlign: 'left',
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    letterSpacing: 'inherit',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'start', gap: 12 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2, opacity: 0.3 }}>
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="black" strokeWidth="1.5"/>
                    </svg>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title || "제목 없음"}</p>
                      <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.preview || item.sourceUrl}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.3)' }}>{item.platform === "youtube" ? "유튜브" : "인스타그램"}</span>
                        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.2)' }}>·</span>
                        <span style={{ fontSize: 11, color: 'rgba(0,0,0,0.3)' }}>{formatTime(item.createdAt)}</span>
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

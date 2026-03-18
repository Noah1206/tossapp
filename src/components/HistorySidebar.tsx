"use client";

import { useEffect, useState, useCallback } from "react";

interface HistoryItem {
  id: string;
  platform: "youtube" | "instagram";
  title: string;
  preview?: string;
  sourceUrl: string;
  createdAt: string;
}

type SortOption = "newest" | "oldest" | "alpha";

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: string | null;
  onItemClick?: (item: HistoryItem) => void;
  refreshKey?: number;
}

const SORT_LABELS: Record<SortOption, string> = {
  newest: "최근순",
  oldest: "오래된순",
  alpha: "가나다순",
};

const formatTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / (1000 * 60));
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  return `${days}일 전`;
};

export default function HistorySidebar({ isOpen, onClose, userId, onItemClick, refreshKey }: HistorySidebarProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [sort, setSort] = useState<SortOption>("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const fetchHistory = useCallback(async (sortOption: SortOption) => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/history?userId=${userId}&sort=${sortOption}&limit=30`);
      if (!res.ok) return;
      const { data } = await res.json();
      setHistory(data || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (isOpen && userId) {
      fetchHistory(sort);
    }
  }, [isOpen, userId, sort, fetchHistory, refreshKey]);

  const handleSortChange = (option: SortOption) => {
    setSort(option);
    setShowSortMenu(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          background: 'rgba(0,0,0,0.2)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 0.3s',
        }}
      />

      {/* Sidebar */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 70,
        height: '100%',
        width: 280,
        maxWidth: '80vw',
        background: '#FFFFFF',
        borderRight: '1px solid rgba(0,0,0,0.06)',
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.33, 1, 0.68, 1)',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: 52,
          padding: '0 20px',
          borderBottom: 'none',
        }}>
          <span style={{ fontSize: 15, fontWeight: 700 }}>히스토리</span>
          <button
            onClick={onClose}
            className="press-effect"
            style={{ width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* New button */}
        <div style={{ padding: 12 }}>
          <button
            className="press-effect"
            onClick={() => { onClose(); window.location.href = "/"; }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '10px 16px',
              borderRadius: 12,
              background: '#6B5CE7',
              color: '#FFFFFF',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              letterSpacing: 'inherit',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <span style={{ fontSize: 13, fontWeight: 600 }}>새 변환</span>
          </button>
        </div>

        {/* 비로그인 상태 */}
        {!userId ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px' }}>
            <div style={{ textAlign: 'center' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 12px', opacity: 0.15 }}>
                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="black" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.3)', lineHeight: 1.5 }}>
                로그인하면 변환 기록을<br />확인할 수 있어요
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Sort */}
            <div style={{ padding: '0 12px 4px', position: 'relative' }}>
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '4px 8px',
                  fontSize: 11,
                  color: 'rgba(0,0,0,0.3)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: 'inherit',
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {SORT_LABELS[sort]}
              </button>
              {showSortMenu && (
                <>
                  <div onClick={() => setShowSortMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
                  <div className="animate-fade-in-scale" style={{
                    position: 'absolute',
                    left: 12,
                    top: '100%',
                    background: '#FFFFFF',
                    border: '1px solid rgba(0,0,0,0.08)',
                    borderRadius: 10,
                    padding: 4,
                    zIndex: 20,
                    minWidth: 100,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    transformOrigin: 'top left',
                  }}>
                    {(["newest", "oldest", "alpha"] as SortOption[]).map((option) => (
                      <button
                        key={option}
                        onClick={() => handleSortChange(option)}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: '8px 12px',
                          fontSize: 12,
                          fontWeight: sort === option ? 600 : 400,
                          color: sort === option ? '#6B5CE7' : 'rgba(0,0,0,0.6)',
                          background: sort === option ? 'rgba(107,92,231,0.06)' : 'transparent',
                          border: 'none',
                          borderRadius: 8,
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          letterSpacing: 'inherit',
                        }}
                      >
                        {SORT_LABELS[option]}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* History list */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 32px' }}>
              {loading && history.length === 0 ? (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 40 }}>
                  <div style={{
                    width: 20, height: 20,
                    border: '2px solid rgba(0,0,0,0.08)',
                    borderTopColor: '#6B5CE7',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite',
                  }} />
                </div>
              ) : history.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: 40 }}>
                  <p style={{ fontSize: 13, color: 'rgba(0,0,0,0.2)' }}>변환 기록이 없습니다</p>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, padding: '0 8px' }}>
                    최근
                  </p>
                  <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {history.map((item) => (
                      <button
                        key={item.id}
                        className="press-effect"
                        onClick={() => onItemClick?.(item)}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 10px',
                          borderRadius: 10,
                          textAlign: 'left',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          fontFamily: 'inherit',
                          letterSpacing: 'inherit',
                          transition: 'background 0.12s',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.04)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.25 }}>
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="black" strokeWidth="1.5"/>
                        </svg>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontSize: 13, fontWeight: 500, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {item.title || (item.sourceUrl?.includes("instagram") ? "인스타그램 변환" : item.sourceUrl?.includes("youtube") || item.sourceUrl?.includes("youtu.be") ? "유튜브 변환" : "변환 결과")}
                          </p>
                          <p suppressHydrationWarning style={{ fontSize: 11, color: 'rgba(0,0,0,0.3)', marginTop: 2 }}>
                            {formatTime(item.createdAt)}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* Spinner keyframes */}
      <style jsx global>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

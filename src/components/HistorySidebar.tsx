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

        {/* History list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px 32px' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, padding: '0 8px' }}>
            최근
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sampleHistory.map((item) => (
              <button
                key={item.id}
                className="press-effect"
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
                  <p style={{ fontSize: 13, fontWeight: 500, color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                  <p suppressHydrationWarning style={{ fontSize: 11, color: 'rgba(0,0,0,0.3)', marginTop: 2 }}>{formatTime(item.createdAt)}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

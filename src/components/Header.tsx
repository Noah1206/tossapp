"use client";

import { useState, useRef, useEffect } from "react";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onMenuClick?: () => void;
  selectedPlatform?: string | null;
  onPlatformChange?: (platform: string | null) => void;
  userName?: string | null;
}

const PLATFORMS = [
  { key: "youtube", label: "유튜브 쇼츠", color: "#FF0000" },
  { key: "instagram-reels", label: "인스타그램 릴스", color: "#E1306C" },
  { key: "instagram-feed", label: "인스타그램 피드", color: "#E1306C" },
] as const;

export default function Header({ title, showBack, onMenuClick, selectedPlatform, onPlatformChange, userName }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentPlatform = PLATFORMS.find(p => p.key === selectedPlatform);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: '#FFFFFF',
      borderBottom: '1px solid rgba(0,0,0,0.06)',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 72,
        padding: '0 20px',
      }}>
        {/* Left side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {showBack ? (
            <button
              onClick={() => window.history.back()}
              className="press-effect"
              style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer' }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M15 19l-7-7 7-7" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ) : (
            <>
              {onMenuClick && (
                <button
                  onClick={onMenuClick}
                  className="press-effect"
                  style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer' }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 7h16M4 12h16M4 17h16" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              )}

              {/* Platform Dropdown Selector */}
              {onPlatformChange && (
                <div ref={dropdownRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="press-effect"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '6px 10px',
                      borderRadius: 10,
                      border: 'none',
                      background: dropdownOpen ? 'rgba(0,0,0,0.05)' : 'transparent',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      letterSpacing: 'inherit',
                      transition: 'background 0.15s',
                    }}
                  >
                    <span style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: '#000',
                      whiteSpace: 'nowrap',
                    }}>
                      {currentPlatform ? currentPlatform.label : "플랫폼 선택"}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{
                      transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s',
                    }}>
                      <path d="M6 9l6 6 6-6" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="animate-fade-in-scale" style={{
                      position: 'absolute',
                      top: 'calc(100% + 8px)',
                      left: 0,
                      background: '#FFFFFF',
                      border: '1px solid rgba(0,0,0,0.08)',
                      borderRadius: 16,
                      padding: 6,
                      minWidth: 220,
                      boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                      zIndex: 100,
                      transformOrigin: 'top left',
                    }}>
                      {PLATFORMS.map((p) => (
                        <button
                          key={p.key}
                          onClick={() => {
                            onPlatformChange(selectedPlatform === p.key ? null : p.key);
                            setDropdownOpen(false);
                          }}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            width: '100%',
                            padding: '12px 14px',
                            borderRadius: 12,
                            border: 'none',
                            background: selectedPlatform === p.key ? 'rgba(0,0,0,0.04)' : 'transparent',
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                            letterSpacing: 'inherit',
                            transition: 'background 0.12s',
                          }}
                        >
                          <span style={{
                            flex: 1,
                            fontSize: 14,
                            fontWeight: 600,
                            color: '#000',
                            textAlign: 'left',
                          }}>
                            {p.label}
                          </span>
                          {selectedPlatform === p.key && (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                              <path d="M5 12l5 5L20 7" stroke={p.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Title fallback */}
              {!onPlatformChange && (
                <span style={{ fontSize: 18, fontWeight: 700 }}>LOGOS</span>
              )}
            </>
          )}
          {title && (
            <span style={{ fontSize: 18, fontWeight: 700 }}>{title}</span>
          )}
        </div>

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {!showBack && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 9999,
                background: 'rgba(0,0,0,0.04)',
                border: '1px solid rgba(0,0,0,0.06)',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="4" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5"/>
                <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.45)' }}>{userName || '게스트'}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

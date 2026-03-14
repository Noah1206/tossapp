"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import HistorySidebar from "@/components/HistorySidebar";
import { requestTossLogin, type TossUser } from "@/lib/toss-bridge";

type Platform = PlatformKey | null;
type PlatformKey = "youtube" | "instagram-reels" | "instagram-feed";

const PLATFORM_CONFIG: Record<PlatformKey, { title: string; placeholder: string; color: string; label: string }> = {
  youtube: {
    title: "유튜브 쇼츠를\n블로그로 변환해요",
    placeholder: "유튜브 쇼츠 링크를 붙여넣으세요",
    color: "#FF0000",
    label: "유튜브 쇼츠",
  },
  "instagram-reels": {
    title: "인스타그램 릴스를\n블로그로 변환해요",
    placeholder: "인스타그램 릴스 링크를 붙여넣으세요",
    color: "#E1306C",
    label: "인스타그램 릴스",
  },
  "instagram-feed": {
    title: "인스타그램 피드를\n블로그로 변환해요",
    placeholder: "인스타그램 피드 링크를 붙여넣으세요",
    color: "#E1306C",
    label: "인스타그램 피드",
  },
};

export default function Home() {
  const router = useRouter();
  const [inputUrl, setInputUrl] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [credits, setCredits] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(null);
  const [uploadedImages, setUploadedImages] = useState<{ file: File; preview: string }[]>([]);
  const [linkChip, setLinkChip] = useState<{ platform: "youtube" | "instagram"; title: string; url: string } | null>(null);
  const [user, setUser] = useState<TossUser | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const YOUTUBE_RE = /https?:\/\/(?:www\.)?(?:youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const INSTAGRAM_RE = /https?:\/\/(?:www\.)?instagram\.com\/(reel|reels|p)\/([a-zA-Z0-9_-]+)/;

  const detectLink = (text: string): boolean => {
    const trimmed = text.trim();
    const ytMatch = trimmed.match(YOUTUBE_RE);
    if (ytMatch) {
      setLinkChip({ platform: "youtube", title: `youtube.com/shorts/${ytMatch[1]}`, url: trimmed });
      setInputUrl("");
      return true;
    }
    const igMatch = trimmed.match(INSTAGRAM_RE);
    if (igMatch) {
      setLinkChip({ platform: "instagram", title: `instagram.com/${igMatch[1]}/${igMatch[2]}`, url: trimmed });
      setInputUrl("");
      return true;
    }
    return false;
  };

  const clearLinkChip = () => {
    setLinkChip(null);
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        if (!detectLink(text)) {
          setInputUrl(text);
        }
        textareaRef.current?.focus();
      }
    } catch {
      textareaRef.current?.focus();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputUrl(e.target.value);
  };

  const handleTextareaPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const text = e.clipboardData.getData("text");
    if (text && (YOUTUBE_RE.test(text) || INSTAGRAM_RE.test(text))) {
      e.preventDefault();
      detectLink(text);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setUploadedImages((prev) => [...prev, ...newImages]);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleLogin = async () => {
    const result = await requestTossLogin();
    if (result) {
      setUser(result);
      setShowLoginModal(false);
    }
  };

  const handleConvert = async () => {
    const url = linkChip?.url || inputUrl.trim();
    if (!url || isConverting) return;

    // 로그인 필요
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    setIsConverting(true);
    setCredits((prev) => Math.max(0, prev - 1));
    router.push(`/result?url=${encodeURIComponent(url)}`);
    setIsConverting(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleConvert();
    }
  };

  const handlePlatformSelect = (platform: Platform) => {
    setSelectedPlatform(platform);
    textareaRef.current?.focus();
  };

  const currentTitle = selectedPlatform
    ? PLATFORM_CONFIG[selectedPlatform].title
    : "무엇을 변환할까요?";

  const currentPlaceholder = selectedPlatform
    ? PLATFORM_CONFIG[selectedPlatform].placeholder
    : "영상 링크를 붙여넣으세요";

  // ── Input View ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#FFFFFF' }}>
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        selectedPlatform={selectedPlatform}
        onPlatformChange={(p) => handlePlatformSelect(p as Platform)}
      />
      <HistorySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* ── Plan Badge ── */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 100 }}>
            <div className="plan-badge">
              <span className="plan-badge__label">{user ? `${user.name} · 무료 플랜` : "무료 플랜"}</span>
              <span className="plan-badge__divider" />
              <a href="/credits" className="plan-badge__action">업그레이드</a>
            </div>
          </div>

          {/* ── Title Section ── */}
          <div style={{ padding: '80px 24px 28px' }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', color: '#000', whiteSpace: 'pre-line', lineHeight: 1.35 }}>
              {currentTitle}
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(0,0,0,0.35)', marginTop: 10 }}>
              영상 링크를 넣으면 네이버 블로그 글로 변환해드려요
            </p>
          </div>

          {/* ── Input Card ── */}
          <div style={{ padding: '0 20px 16px' }}>
            <div className="input-card">
              {/* Link Chip + Images */}
              {(linkChip || uploadedImages.length > 0) && (
                <div style={{ padding: '16px 16px 0', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  {linkChip && (
                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '8px 12px',
                      background: 'rgba(0,0,0,0.04)',
                      borderRadius: 9999,
                      border: '1px solid rgba(0,0,0,0.06)',
                      maxWidth: '100%',
                    }}>
                      {linkChip.platform === "youtube" ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                          <rect x="2" y="4" width="20" height="16" rx="4" fill="#FF0000"/>
                          <path d="M10 8.5l6 3.5-6 3.5V8.5z" fill="#fff"/>
                        </svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                          <rect x="2" y="2" width="20" height="20" rx="6" stroke="#E1306C" strokeWidth="1.5"/>
                          <circle cx="12" cy="12" r="5" stroke="#E1306C" strokeWidth="1.5"/>
                          <circle cx="18" cy="6" r="1.5" fill="#E1306C"/>
                        </svg>
                      )}
                      <span style={{
                        fontSize: 13,
                        fontWeight: 500,
                        color: 'rgba(0,0,0,0.7)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>
                        {linkChip.title}
                      </span>
                      <button
                        onClick={clearLinkChip}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          width: 18, height: 18, border: 'none', background: 'none',
                          cursor: 'pointer', flexShrink: 0, padding: 0,
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  )}
                  {uploadedImages.map((img, i) => (
                    <div key={i} style={{ position: 'relative', width: 80, height: 80, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={img.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        onClick={() => removeImage(i)}
                        style={{
                          position: 'absolute', top: 4, right: 4, width: 22, height: 22,
                          borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: 'none',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <textarea
                ref={textareaRef}
                value={inputUrl}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onPaste={handleTextareaPaste}
                placeholder={linkChip ? "추가 메모를 입력하세요" : currentPlaceholder}
                disabled={isConverting}
                rows={linkChip ? 1 : 1}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <div className="input-toolbar">
                <div className="toolbar-group">
                  <button className="toolbar-circle" onClick={() => fileInputRef.current?.click()}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="#000" strokeWidth="1.8" strokeLinecap="round" opacity="0.3"/>
                    </svg>
                  </button>
                  <button className="toolbar-circle" onClick={handlePaste}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#000" strokeWidth="1.8" strokeLinecap="round" opacity="0.3"/>
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#000" strokeWidth="1.8" strokeLinecap="round" opacity="0.3"/>
                    </svg>
                  </button>
                </div>
                <div className="toolbar-group">
                  <button
                    className="send-btn"
                    onClick={handleConvert}
                    disabled={(!inputUrl.trim() && !linkChip) || isConverting || credits <= 0}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 19V5M5 12l7-7 7 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Quick Links ── */}
          <div style={{ padding: '0 20px 20px' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              <a href="/convert" className="action-chip">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.4"/>
                </svg>
                톤 설정
              </a>
            </div>
          </div>
        </div>
      </main>

      {/* ── Login Modal ── */}
      {showLoginModal && (
        <div
          onClick={() => setShowLoginModal(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 200,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: 480,
              background: '#FFFFFF',
              borderRadius: '24px 24px 0 0',
              padding: '32px 24px',
              paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <div style={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'rgba(107,92,231,0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" stroke="#6B5CE7" strokeWidth="1.5"/>
                  <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="#6B5CE7" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <p style={{ fontSize: 18, fontWeight: 800, color: '#000', marginBottom: 6 }}>
                로그인이 필요해요
              </p>
              <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', lineHeight: 1.5 }}>
                변환 기능을 사용하려면<br />토스 계정으로 로그인해주세요
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="press-effect"
              style={{
                width: '100%',
                height: 52,
                borderRadius: 14,
                background: '#0064FF',
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: 'inherit',
                marginBottom: 10,
              }}
            >
              토스로 로그인
            </button>
            <button
              onClick={() => setShowLoginModal(false)}
              className="press-effect"
              style={{
                width: '100%',
                height: 44,
                borderRadius: 14,
                background: 'rgba(0,0,0,0.04)',
                color: 'rgba(0,0,0,0.4)',
                fontSize: 14,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: 'inherit',
              }}
            >
              나중에 할게요
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


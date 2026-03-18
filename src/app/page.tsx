"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import HistorySidebar from "@/components/HistorySidebar";
import Onboarding from "@/components/Onboarding";
import { requestTossLogin, type TossUser } from "@/lib/toss-bridge";

type Platform = PlatformKey | null;
type PlatformKey = "youtube" | "instagram-reels" | "instagram-feed";

const TONE_MAP: Record<string, { label: string; color: string }> = {
  friendly: { label: "친근한", color: "#FF6B6B" },
  professional: { label: "전문적인", color: "#4DABF7" },
  casual: { label: "가벼운", color: "#51CF66" },
  energetic: { label: "활기찬", color: "#FFB43A" },
};

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
  // 유료화 시 복원
  // const [credits, setCredits] = useState<number | null>(null);
  // const [plan, setPlan] = useState("free");
  // const [trial, setTrial] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(null);
  const [uploadedImages, setUploadedImages] = useState<{ file: File; preview: string }[]>([]);
  const [linkChip, setLinkChip] = useState<{ platform: "youtube" | "instagram"; title: string; url: string } | null>(null);
  const [user, setUser] = useState<TossUser | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [selectedTone, setSelectedTone] = useState("friendly");
  // 유료화 시 복원
  // const [showPricingModal, setShowPricingModal] = useState(false);
  // const [pricingClosing, setPricingClosing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [refreshKey, setRefreshKey] = useState(0);
  const [typedText, setTypedText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState<boolean | null>(null);

  /* 유료화 시 복원
  const fetchCredits = (userId: string) => {
    fetch(`/api/credits?userId=${userId}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.data) {
          setCredits(res.data.credits);
          setPlan(res.data.plan);
          setTrial(res.data.trial === true);
        }
      })
      .catch(() => {});
  };
  */

  // 페이지 진입 시: 온보딩 체크 + 로그인 + 톤 복원
  useEffect(() => {
    try {
      const done = localStorage.getItem("logos_onboarding_done");
      setShowOnboarding(!done);
    } catch {
      setShowOnboarding(false);
    }

    const restore = () => {
      try {
        const savedId = localStorage.getItem("toss_user_id");
        const savedName = localStorage.getItem("toss_user_name");
        if (savedId) {
          setUser({ id: savedId, name: savedName || "사용자" });
          setRefreshKey((k) => k + 1);
        }
        const savedTone = localStorage.getItem("logos_tone");
        if (savedTone && TONE_MAP[savedTone]) {
          setSelectedTone(savedTone);
        }
      } catch {}
    };
    restore();
    // /convert에서 돌아왔을 때 톤 갱신
    const onVisible = () => {
      if (document.visibilityState === "visible") {
        const t = localStorage.getItem("logos_tone");
        if (t && TONE_MAP[t]) setSelectedTone(t);
      }
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, []);

  // 타이핑 애니메이션
  const prevTitleRef = useRef("");
  useEffect(() => {
    const title = selectedPlatform
      ? PLATFORM_CONFIG[selectedPlatform].title
      : "무엇을 변환할까요?";
    if (title === prevTitleRef.current) return;
    prevTitleRef.current = title;
    setTypedText("");
    setShowCursor(true);
    let i = 0;
    const id = setInterval(() => {
      i++;
      setTypedText(title.slice(0, i));
      if (i >= title.length) {
        clearInterval(id);
        setTimeout(() => setShowCursor(false), 600);
      }
    }, 45);
    return () => clearInterval(id);
  }, [selectedPlatform]);

  /* 유료화 시 복원
  const closePricing = (cb?: () => void) => {
    setPricingClosing(true);
    setTimeout(() => {
      setShowPricingModal(false);
      setPricingClosing(false);
      cb?.();
    }, 300);
  };
  */

  const handleHistoryItemClick = useCallback((item: { id: string; sourceUrl: string }) => {
    setSidebarOpen(false);
    router.push(`/result?historyId=${item.id}`);
  }, [router]);

  const YOUTUBE_RE = /https?:\/\/(?:www\.)?(?:youtube\.com\/shorts\/|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const INSTAGRAM_RE = /https?:\/\/(?:www\.)?instagram\.com\/(reel|reels|p)\/([a-zA-Z0-9_-]+)/;

  const detectLink = (text: string): boolean => {
    if (linkChip) return false; // 이미 링크가 있으면 추가 불가
    const trimmed = text.trim();
    const ytMatch = trimmed.match(YOUTUBE_RE);
    if (ytMatch) {
      setLinkChip({ platform: "youtube", title: `youtube.com/shorts/${ytMatch[1]}`, url: trimmed });
      setSelectedPlatform("youtube");
      setInputUrl("");
      return true;
    }
    const igMatch = trimmed.match(INSTAGRAM_RE);
    if (igMatch) {
      const igType = igMatch[1] === "p" ? "instagram-feed" : "instagram-reels";
      setLinkChip({ platform: "instagram", title: `instagram.com/${igMatch[1]}/${igMatch[2]}`, url: trimmed });
      setSelectedPlatform(igType);
      setInputUrl("");
      return true;
    }
    return false;
  };

  const clearLinkChip = () => {
    setLinkChip(null);
    setSelectedPlatform(null);
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
      // fetchCredits(result.id); // 유료화 시 복원
      try {
        localStorage.setItem("toss_user_id", result.id);
        localStorage.setItem("toss_user_name", result.name);
      } catch {}
    }
  };

  const handleConvert = async () => {
    const url = linkChip?.url || inputUrl.trim();
    if (!url || isConverting) return;

    if (!user) {
      setShowLoginModal(true);
      return;
    }

    /* 유료화 시 복원 - 크레딧 차감 로직
    if (plan !== "pro") {
      if (!trial && credits !== null && credits <= 0) {
        router.push("/credits");
        return;
      }
      if (!trial && credits !== null && credits > 0) {
        setIsConverting(true);
        try {
          const res = await fetch("/api/credits", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id, amount: -1, reason: "convert" }),
          });
          const result = await res.json();
          if (!res.ok) {
            alert(result.message || "크레딧이 부족합니다");
            setIsConverting(false);
            return;
          }
          setCredits(result.data.credits);
        } catch {
          setIsConverting(false);
          return;
        }
      }
    }
    */

    setIsConverting(true);
    const savedTone = localStorage.getItem("logos_tone") || "friendly";
    router.push(`/result?url=${encodeURIComponent(url)}&tone=${savedTone}`);
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

  const handleOnboardingComplete = useCallback(() => {
    try { localStorage.setItem("logos_onboarding_done", "1"); } catch {}
    setShowOnboarding(false);
  }, []);

  // 온보딩 로딩 중 (검은 화면으로 대기)
  if (showOnboarding === null) return <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 9999 }} />;

  // 온보딩 표시
  if (showOnboarding) return <Onboarding onComplete={handleOnboardingComplete} />;

  // ── Input View ──
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#FFFFFF' }}>
      <Header
        onMenuClick={() => setSidebarOpen(true)}
        selectedPlatform={selectedPlatform}
        onPlatformChange={(p) => handlePlatformSelect(p as Platform)}
        userName={user?.name}
      />
      <HistorySidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userId={user?.id}
        onItemClick={handleHistoryItemClick}
        refreshKey={refreshKey}
      />

      <main style={{ flex: 1, overflowY: 'auto' }}>
        <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>

          {/* spacer */}
          <div style={{ paddingTop: 80 }} />

          {/* ── Title Section ── */}
          <div style={{ padding: '40px 24px 28px' }}>
            <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.02em', color: '#000', whiteSpace: 'pre-line', lineHeight: 1.35, minHeight: '1.35em' }}>
              {typedText}
              {showCursor && (
                <span style={{
                  display: 'inline-block',
                  width: 2,
                  height: '0.9em',
                  background: '#6B5CE7',
                  marginLeft: 2,
                  borderRadius: 1,
                  verticalAlign: 'baseline',
                  animation: 'cursorBlink 0.6s step-end infinite',
                }} />
              )}
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(0,0,0,0.35)', marginTop: 10 }}>
              영상 링크를 넣으면 네이버 블로그 글로 변환해드려요
            </p>
          </div>

          {/* ── Input Card ── */}
          <div style={{ padding: '0 20px 16px' }}>
            <div className="input-card" style={linkChip ? { borderColor: '#6B5CE7', boxShadow: '0 0 0 3px rgba(107,92,231,0.1)' } : undefined}>
              {/* Link Chip + Images */}
              {(linkChip || uploadedImages.length > 0) && (
                <div style={{ padding: '16px 16px 12px', display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                  {linkChip && (
                    <div className="animate-fade-in-scale" style={{
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
              {linkChip && (
                <p className="animate-fade-in" style={{
                  padding: '20px 20px 28px',
                  fontSize: 16,
                  fontWeight: 700,
                  color: 'rgba(0,0,0,0.3)',
                  lineHeight: 1.5,
                  textAlign: 'center',
                }}>
                  이 링크를 블로그 글로 변환할게요 ✨
                </p>
              )}
              <textarea
                ref={textareaRef}
                value={inputUrl}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onPaste={handleTextareaPaste}
                placeholder={linkChip ? "" : currentPlaceholder}
                disabled={isConverting || !!linkChip}
                rows={1}
                style={linkChip ? { display: 'none' } : undefined}
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14M5 12h14" stroke="#000" strokeWidth="1.8" strokeLinecap="round" opacity="0.3"/>
                    </svg>
                  </button>
                  <button className="toolbar-circle" onClick={handlePaste}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#000" strokeWidth="1.8" strokeLinecap="round" opacity="0.3"/>
                      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#000" strokeWidth="1.8" strokeLinecap="round" opacity="0.3"/>
                    </svg>
                  </button>
                  <a href="/convert" className="press-effect" style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '6px 12px',
                    borderRadius: 9999,
                    border: `1px solid ${TONE_MAP[selectedTone]?.color || '#6B5CE7'}20`,
                    background: `${TONE_MAP[selectedTone]?.color || '#6B5CE7'}0A`,
                    textDecoration: 'none',
                    cursor: 'pointer',
                  }}>
                    <span style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: TONE_MAP[selectedTone]?.color || '#6B5CE7',
                      flexShrink: 0,
                    }} />
                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: TONE_MAP[selectedTone]?.color || '#6B5CE7',
                      whiteSpace: 'nowrap',
                    }}>
                      {TONE_MAP[selectedTone]?.label || "친근한"}
                    </span>
                  </a>
                </div>
                <div className="toolbar-group">
                  <button
                    className="send-btn"
                    onClick={handleConvert}
                    disabled={(!inputUrl.trim() && !linkChip) || isConverting}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M12 19V5M5 12l7-7 7 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>



        </div>
      </main>

      {/* ── Pricing Modal - 유료화 시 복원 ── */}

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
            animation: 'loginBackdropIn 0.3s ease-out',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="stagger-children"
            style={{
              width: '100%',
              maxWidth: 480,
              background: '#FFFFFF',
              borderRadius: '24px 24px 0 0',
              padding: '32px 24px',
              paddingBottom: 'calc(32px + env(safe-area-inset-bottom, 0px))',
              animation: 'loginSheetUp 0.35s cubic-bezier(0.33, 1, 0.68, 1)',
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


"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";

const TONE_ICONS: Record<string, string> = {
  friendly: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  professional: "M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2zM16 3H8l-2 4h12l-2-4z",
  casual: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-1-1 3-3-3-3 1-1 4 4-4 4zm4 0l4-4-4-4-1 1 3 3-3 3 1 1z",
  energetic: "M13 2L3 14h9l-1 10 10-12h-9l1-10z",
};

function ConvertContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url") || "";
  const [tone, setTone] = useState("friendly");

  // localStorage에서 톤 복원 (클라이언트 only)
  useEffect(() => {
    const saved = localStorage.getItem("logos_tone");
    if (saved) setTone(saved);
  }, []);

  // 톤 변경 시 저장
  useEffect(() => {
    localStorage.setItem("logos_tone", tone);
  }, [tone]);

  const handleSelect = () => {
    if (url) {
      router.push(`/result?url=${encodeURIComponent(url)}&tone=${tone}`);
    } else {
      router.back();
    }
  };

  const tones = [
    { key: "friendly", label: "친근한", desc: "편안하고 다가가기 쉬운 톤", color: "#FF6B6B" },
    { key: "professional", label: "전문적인", desc: "신뢰감 있고 깔끔한 톤", color: "#4DABF7" },
    { key: "casual", label: "가벼운", desc: "재밌고 가볍게 읽히는 톤", color: "#51CF66" },
    { key: "energetic", label: "활기찬", desc: "에너지 넘치고 역동적인 톤", color: "#FFB43A" },
  ];

  return (
    <div className="page-transition" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#FFFFFF' }}>
      <Header title="변환 설정" showBack />

      <main style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {/* Tone Selection */}
        <div className="animate-fade-in-up">
          <p style={{ fontSize: 24, fontWeight: 800, color: '#000', marginBottom: 8 }}>
            글 톤을 선택해주세요
          </p>
          <p style={{ fontSize: 16, color: 'rgba(0,0,0,0.4)', marginBottom: 28, lineHeight: 1.5 }}>
            타겟 고객에 맞는 톤으로 변환해드려요
          </p>
          <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {tones.map((t) => {
              const isSelected = tone === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTone(t.key)}
                  className="press-effect"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '16px 14px',
                    borderRadius: 16,
                    border: isSelected ? `1.5px solid ${t.color}` : '1px solid rgba(0,0,0,0.07)',
                    background: isSelected ? `${t.color}08` : 'rgba(0,0,0,0.015)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    letterSpacing: 'inherit',
                    transition: 'all 0.15s',
                    textAlign: 'left',
                  }}
                >
                  <div style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: isSelected ? t.color : 'rgba(0,0,0,0.06)',
                    marginBottom: 12,
                    transition: 'all 0.15s',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill={isSelected ? '#FFFFFF' : 'rgba(0,0,0,0.3)'}>
                      <path d={TONE_ICONS[t.key]} />
                    </svg>
                  </div>
                  <p style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: isSelected ? t.color : '#000',
                    transition: 'color 0.15s',
                  }}>
                    {t.label}
                  </p>
                  <p style={{
                    fontSize: 11,
                    color: 'rgba(0,0,0,0.35)',
                    marginTop: 3,
                    lineHeight: 1.4,
                  }}>
                    {t.desc}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* CTA */}
      <div style={{ background: '#FFFFFF', padding: '16px 20px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <button
          onClick={handleSelect}
          className="press-effect"
          style={{
            width: '100%',
            height: 48,
            borderRadius: 14,
            background: '#6B5CE7',
            color: '#FFFFFF',
            fontSize: 15,
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: 'inherit',
          }}
        >
          선택하기
        </button>
        <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.3)', textAlign: 'center', marginTop: 8 }}>
          무료 이용 중
        </p>
      </div>
    </div>
  );
}

export default function ConvertPage() {
  return (
    <Suspense>
      <ConvertContent />
    </Suspense>
  );
}

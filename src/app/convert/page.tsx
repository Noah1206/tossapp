"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";

function ConvertContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";
  const [tone, setTone] = useState("friendly");
  const credits = 3;

  const tones = [
    { key: "friendly", label: "친근한", desc: "편안하고 다가가기 쉬운" },
    { key: "professional", label: "전문적인", desc: "신뢰감 있고 깔끔한" },
    { key: "casual", label: "가벼운", desc: "재밌고 가볍게 읽히는" },
    { key: "energetic", label: "활기찬", desc: "에너지 넘치고 역동적인" },
  ];

  return (
    <div className="flex flex-col h-dvh bg-white">
      <Header credits={credits} title="변환 설정" showBack />

      <main className="flex-1 overflow-y-auto px-5 py-5">
        {/* URL Card */}
        <div className="border border-[var(--color-border)] rounded-xl p-4 mb-6">
          <p className="text-[11px] font-medium text-black/30 mb-2 uppercase tracking-wider">변환할 영상</p>
          <div className="flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 opacity-30">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="black" strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="black" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            <p className="text-[13px] break-all flex-1 leading-relaxed">
              {url || "URL을 입력해주세요"}
            </p>
          </div>
        </div>

        {/* Tone Selection */}
        <div className="mb-6">
          <p className="text-[14px] font-bold mb-3">글 톤 선택</p>
          <div className="space-y-2">
            {tones.map((t) => (
              <button
                key={t.key}
                onClick={() => setTone(t.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all press-effect ${
                  tone === t.key
                    ? "bg-[var(--color-surface-secondary)] ring-1 ring-black/10"
                    : "bg-white border border-[var(--color-border)]"
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[13px] ${
                  tone === t.key
                    ? "bg-[var(--color-brand)] text-white"
                    : "bg-[var(--color-surface-secondary)] text-black/40"
                }`}>
                  {t.label.charAt(0)}
                </div>
                <div className="text-left flex-1">
                  <p className="text-[14px] font-semibold">{t.label}</p>
                  <p className="text-[12px] text-black/40 mt-0.5">{t.desc}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center ${
                    tone === t.key
                      ? "border-[var(--color-brand)] bg-[var(--color-brand)]"
                      : "border-black/15"
                  }`}
                >
                  {tone === t.key && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="border border-[var(--color-border)] rounded-xl p-4">
          <p className="text-[12px] font-semibold text-black/40 mb-1">TIP</p>
          <p className="text-[12px] text-black/40 leading-relaxed">
            AI가 영상을 분석하여 네이버 블로그에 최적화된 글을 작성해요. SEO 키워드, 이모지, 해시태그가 자동 포함됩니다.
          </p>
        </div>
      </main>

      {/* CTA */}
      <div className="bg-white px-5 py-4 border-t border-[var(--color-border)]">
        <button className="w-full h-[48px] rounded-lg bg-[var(--color-brand)] text-white text-[15px] font-bold press-effect flex items-center justify-center gap-2">
          변환하기
        </button>
        <p className="text-[11px] text-black/30 text-center mt-2">
          1 크레딧 차감
        </p>
        <div className="safe-area-bottom" />
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

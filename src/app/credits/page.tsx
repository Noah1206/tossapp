"use client";

import { useRouter } from "next/navigation";
import Header from "@/components/Header";

/* 유료화 시 복원 - 기존 요금제 카드 및 결제 로직
import { useState, useEffect } from "react";
import { requestTossPayment } from "@/lib/toss-bridge";

interface Plan {
  id: string;
  name: string;
  price: string;
  amount: number;
  period: string;
  desc: string;
  features: string[];
  credits: number;
  recommended?: boolean;
}

const plans: Plan[] = [
  {
    id: "free",
    name: "무료 테스터",
    price: "₩0",
    amount: 0,
    period: "신용카드 불필요",
    desc: "성능을 직접 확인해보세요",
    credits: 1,
    features: [
      "최초 가입 시 1회 무료 변환",
      "유튜브 쇼츠 지원",
      "네이버 블로그 SEO 글 생성",
      "결과물 복사 기능",
    ],
  },
  {
    id: "starter",
    name: "스타터 팩",
    price: "₩9,900",
    amount: 9900,
    period: "월 구독",
    desc: "가볍게 시작하는 블로그 마케팅",
    credits: 100,
    features: [
      "블로그 변환 월 100회",
      "AI 학습 노트 월 50회",
      "SEO 키워드 최적화",
      "변환 히스토리 영구 보관",
      "유튜브 쇼츠 지원",
    ],
    recommended: true,
  },
  {
    id: "pro",
    name: "프로 팩",
    price: "₩29,000",
    amount: 29000,
    period: "월 구독",
    desc: "매출을 만드는 사장님들의 선택",
    credits: -1,
    features: [
      "블로그 변환 무제한",
      "AI 학습 노트 무제한",
      "고급 SEO + 톤/스타일 커스터마이징",
      "변환 히스토리 영구 보관",
      "우선 지원 + 신기능 먼저 체험",
    ],
  },
];
*/

const freeFeatures = [
  { icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2", label: "블로그 변환 무제한" },
  { icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253", label: "AI 학습 노트 무제한" },
  { icon: "M13 10V3L4 14h7v7l9-11h-7z", label: "SEO 키워드 최적화" },
  { icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z", label: "변환 히스토리 영구 보관" },
  { icon: "M15 10l-4 4l6 6l4-16l-18 7l4 2l2 6l3-4", label: "유튜브 쇼츠 + 인스타 릴스 지원" },
];

export default function CreditsPage() {
  const router = useRouter();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#FFFFFF' }}>
      <Header title="서비스 안내" showBack />

      <main style={{ flex: 1, overflowY: 'auto' }}>
        {/* 타이틀 */}
        <div style={{ padding: '24px 20px 8px' }}>
          <p style={{ fontSize: 22, fontWeight: 700, color: '#000', lineHeight: 1.4 }}>
            현재 모든 기능을<br />무제한 무료로 이용 가능해요
          </p>
          <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', marginTop: 8 }}>
            오픈 기념 무제한 무료 이용 중
          </p>
        </div>

        {/* 무료 카드 */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div
            style={{
              position: 'relative',
              padding: '24px',
              borderRadius: 16,
              border: '2px solid #6B5CE7',
              background: '#fff',
            }}
          >
            <span style={{
              position: 'absolute',
              top: -9,
              left: 20,
              padding: '3px 10px',
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 600,
              background: '#22C55E',
              color: '#FFFFFF',
            }}>
              무료 이용 중
            </span>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                <span style={{ fontSize: 32, fontWeight: 700, color: '#000', letterSpacing: '-0.02em' }}>₩0</span>
                <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.35)' }}>무제한</span>
              </div>
              <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.45)', marginTop: 6 }}>로그인만 하면 모든 기능을 무제한 이용</p>
            </div>

            <button
              className="press-effect"
              onClick={() => router.push("/")}
              style={{
                width: '100%',
                height: 44,
                borderRadius: 10,
                background: '#6B5CE7',
                color: '#fff',
                fontSize: 14,
                fontWeight: 600,
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                letterSpacing: 'inherit',
                marginBottom: 20,
              }}
            >
              지금 무료로 시작하기
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {freeFeatures.map((f) => (
                <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                    <path d={f.icon} stroke="#6B5CE7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span style={{ fontSize: 14, color: 'rgba(0,0,0,0.6)' }}>{f.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Value prop */}
        <div style={{ padding: '0 20px 32px' }}>
          <div style={{
            padding: '16px',
            background: 'rgba(0,0,0,0.02)',
            borderRadius: 14,
          }}>
            <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.4)', lineHeight: 1.7, textAlign: 'center' }}>
              현재 오픈 기념 무제한 무료 이용 중입니다.<br />
              로그인만 하면 모든 기능을 제한 없이 사용할 수 있습니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

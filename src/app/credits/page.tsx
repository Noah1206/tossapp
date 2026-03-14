"use client";

import { useState } from "react";
import Header from "@/components/Header";

interface Plan {
  id: string;
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  recommended?: boolean;
  buttonLabel: string;
  buttonStyle: "dark" | "brand";
}

const plans: Plan[] = [
  {
    id: "free",
    name: "무료 테스터",
    price: "₩0",
    period: "신용카드 불필요",
    desc: "서비스를 먼저 체험해보세요",
    features: [
      "가입 시 1회 무료 변환",
      "유튜브 쇼츠 지원",
      "네이버 블로그 SEO 생성",
      "결과 클립보드 복사",
    ],
    buttonLabel: "현재 플랜",
    buttonStyle: "dark",
  },
  {
    id: "starter",
    name: "스타터 팩",
    price: "₩9,900",
    period: "월 구독",
    desc: "가볍게 시작하는 블로그 마케팅",
    features: [
      "블로그 변환 월 100회",
      "AI 학습 노트 월 50회",
      "SEO 키워드 최적화",
      "변환 이력 영구 보관",
      "유튜브 쇼츠 지원",
    ],
    buttonLabel: "알림 받기",
    buttonStyle: "brand",
  },
  {
    id: "pro",
    name: "프로 팩",
    price: "₩29,000",
    period: "월 구독",
    desc: "매출을 만드는 사장님들의 선택",
    features: [
      "블로그 변환 무제한",
      "AI 학습 노트 무제한",
      "고급 SEO + 톤 커스터마이징",
      "변환 이력 영구 보관",
      "우선 지원 + 얼리 액세스",
    ],
    recommended: true,
    buttonLabel: "알림 받기",
    buttonStyle: "brand",
  },
];

export default function CreditsPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#FFFFFF' }}>
      <Header title="요금제" showBack />

      <main style={{ flex: 1, overflowY: 'auto' }}>
        {/* Title */}
        <div style={{ padding: '24px 20px 8px' }}>
          <p style={{ fontSize: 22, fontWeight: 800, color: '#000', lineHeight: 1.4 }}>
            나에게 맞는 플랜을 선택하세요
          </p>
          <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', marginTop: 6 }}>
            결제 시스템 준비 중이에요. 알림을 받아보세요.
          </p>
        </div>

        {/* Plans */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const isRecommended = plan.recommended;
            return (
              <button
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  position: 'relative',
                  width: '100%',
                  padding: '20px 18px',
                  borderRadius: 18,
                  border: isSelected
                    ? '1.5px solid #6B5CE7'
                    : '1px solid rgba(0,0,0,0.08)',
                  background: isSelected ? 'rgba(107,92,231,0.03)' : '#FFFFFF',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: 'inherit',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                }}
              >
                {isRecommended && (
                  <span style={{
                    position: 'absolute',
                    top: -9,
                    left: 16,
                    padding: '3px 10px',
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 700,
                    background: '#6B5CE7',
                    color: '#FFFFFF',
                  }}>
                    추천
                  </span>
                )}

                {/* Plan header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 700, color: '#000' }}>{plan.name}</p>
                    <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)', marginTop: 2 }}>{plan.desc}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: 20, fontWeight: 800, color: isSelected ? '#6B5CE7' : '#000' }}>
                      {plan.price}
                    </p>
                    <p style={{ fontSize: 11, color: 'rgba(0,0,0,0.3)' }}>{plan.period}</p>
                  </div>
                </div>

                {/* Features */}
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {plan.features.map((f) => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                        <path
                          d="M20 6L9 17l-5-5"
                          stroke={plan.id === "free" ? "rgba(0,0,0,0.25)" : "#6B5CE7"}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)' }}>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Button */}
                <div
                  className="press-effect"
                  style={{
                    marginTop: 16,
                    width: '100%',
                    height: 42,
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: plan.id === "free"
                      ? 'rgba(0,0,0,0.06)'
                      : '#6B5CE7',
                    color: plan.id === "free" ? 'rgba(0,0,0,0.35)' : '#FFFFFF',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: plan.id === "free" ? 'default' : 'pointer',
                  }}
                >
                  {plan.buttonLabel}
                </div>
              </button>
            );
          })}
        </div>

        {/* Value prop */}
        <div style={{ padding: '0 20px 32px' }}>
          <div style={{
            padding: '16px',
            background: 'rgba(107,92,231,0.04)',
            borderRadius: 14,
            border: '1px solid rgba(107,92,231,0.08)',
          }}>
            <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', lineHeight: 1.7, textAlign: 'center' }}>
              블로그 대행사 월 수십만 원 vs LOGOS.ai 건당 <span style={{ fontWeight: 700, color: '#6B5CE7' }}>₩580~990</span>
              <br />
              사장님들께 가장 합리적인 선택입니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import Header from "@/components/Header";

interface CreditPlan {
  id: string;
  credits: number;
  price: number;
  pricePerCredit: number;
  popular?: boolean;
  save?: string;
}

const plans: CreditPlan[] = [
  {
    id: "starter",
    credits: 10,
    price: 9900,
    pricePerCredit: 990,
  },
  {
    id: "pro",
    credits: 50,
    price: 29000,
    pricePerCredit: 580,
    popular: true,
    save: "41%",
  },
  {
    id: "business",
    credits: 150,
    price: 69000,
    pricePerCredit: 460,
    save: "53%",
  },
];

export default function CreditsPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>("pro");
  const [isPurchasing, setIsPurchasing] = useState(false);
  const credits = 3;

  const handlePurchase = async () => {
    setIsPurchasing(true);
    setTimeout(() => {
      setIsPurchasing(false);
      alert("토스 결제 연동 예정");
    }, 1000);
  };

  const selected = plans.find((p) => p.id === selectedPlan);

  return (
    <div className="flex flex-col h-dvh bg-white">
      <Header credits={credits} title="크레딧" showBack />

      <main className="flex-1 overflow-y-auto">
        {/* Balance */}
        <div className="px-5 pt-6 pb-5">
          <div className="bg-black rounded-xl p-5">
            <p className="text-[11px] font-medium text-white/40 uppercase tracking-wider">보유 크레딧</p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-[36px] font-bold text-white tracking-tight tabular-nums">{credits}</span>
              <span className="text-[13px] text-white/30 font-medium">크레딧</span>
            </div>
            <p className="text-[11px] text-white/30 mt-2">1 크레딧 = 영상 1개 변환</p>
          </div>
        </div>

        {/* Plans */}
        <div className="px-5 pb-5">
          <p className="text-[14px] font-bold mb-3">충전 패키지</p>
          <div className="space-y-2">
            {plans.map((plan) => {
              const isSelected = selectedPlan === plan.id;
              return (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full relative flex items-center justify-between p-4 rounded-xl transition-all press-effect ${
                    isSelected
                      ? "bg-[var(--color-surface-secondary)] ring-1 ring-black/10"
                      : "bg-white border border-[var(--color-border)]"
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-2 left-4 px-2 py-0.5 rounded text-[9px] font-bold bg-[var(--color-brand)] text-white uppercase tracking-wider">
                      추천
                    </span>
                  )}

                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <p className="text-[15px] font-bold">{plan.credits}건</p>
                      {plan.save && (
                        <span className="text-[10px] font-bold text-[var(--color-brand)]">
                          -{plan.save}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-black/30 mt-0.5">
                      건당 {plan.pricePerCredit.toLocaleString()}원
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[16px] font-bold tabular-nums">
                      {plan.price.toLocaleString()}원
                    </span>
                    <div
                      className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center ${
                        isSelected
                          ? "border-[var(--color-brand)] bg-[var(--color-brand)]"
                          : "border-black/15"
                      }`}
                    >
                      {isSelected && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Features */}
        <div className="px-5 pb-6">
          <p className="text-[12px] font-medium text-black/30 mb-3 uppercase tracking-wider">포함 기능</p>
          <div className="space-y-2.5">
            {[
              "유튜브 쇼츠 & 인스타 릴스",
              "네이버 블로그 SEO 최적화",
              "톤/스타일 커스터마이징",
              "변환 이력 무제한 보관",
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-2.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                  <path d="M20 6L9 17l-5-5" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[13px] text-black/60">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* CTA */}
      <div className="bg-white px-5 py-4 border-t border-[var(--color-border)]">
        <button
          onClick={handlePurchase}
          disabled={isPurchasing}
          className="w-full h-[48px] rounded-lg bg-[var(--color-brand)] text-white text-[15px] font-bold press-effect disabled:opacity-40 flex items-center justify-center"
        >
          {isPurchasing ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>{selected?.price.toLocaleString()}원 결제하기</>
          )}
        </button>
        <div className="safe-area-bottom" />
      </div>
    </div>
  );
}

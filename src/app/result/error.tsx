"use client";

import { useRouter } from "next/navigation";

export default function ResultError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100dvh',
      padding: '0 32px',
      textAlign: 'center',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'rgba(0,0,0,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 20,
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5"/>
          <path d="M12 8v4M12 16h.01" stroke="rgba(0,0,0,0.3)" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </div>
      <p style={{ fontSize: 17, fontWeight: 700, color: '#000', marginBottom: 6 }}>
        변환에 실패했어요
      </p>
      <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', lineHeight: 1.5, marginBottom: 24 }}>
        {error.message || "링크를 확인하고 다시 시도해주세요"}
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={reset}
          className="press-effect"
          style={{
            height: 44, padding: '0 24px', borderRadius: 12,
            background: '#000', color: '#fff',
            fontSize: 14, fontWeight: 600, border: 'none',
            cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 'inherit',
          }}
        >
          다시 시도
        </button>
        <button
          onClick={() => router.push("/")}
          className="press-effect"
          style={{
            height: 44, padding: '0 24px', borderRadius: 12,
            background: 'rgba(0,0,0,0.04)', color: 'rgba(0,0,0,0.5)',
            fontSize: 14, fontWeight: 600, border: '1px solid rgba(0,0,0,0.08)',
            cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 'inherit',
          }}
        >
          홈으로
        </button>
      </div>
    </div>
  );
}

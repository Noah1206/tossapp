"use client";

interface QuickActionsProps {
  onSelect: (url: string) => void;
}

export default function QuickActions({ onSelect }: QuickActionsProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <button
        onClick={() => onSelect("https://youtube.com/shorts/")}
        className="w-full flex items-center gap-3.5 p-4 bg-white border border-[var(--color-border)] rounded-2xl press-effect overflow-hidden"
      >
        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
            <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[14px] font-semibold">YouTube Shorts</p>
          <p className="text-[12px] text-black/35 mt-0.5">shorts 링크 붙여넣기</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 opacity-15">
          <path d="M9 6l6 6-6 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      <button
        onClick={() => onSelect("https://instagram.com/reel/")}
        className="w-full flex items-center gap-3.5 p-4 bg-white border border-[var(--color-border)] rounded-2xl press-effect overflow-hidden"
      >
        <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="2" width="20" height="20" rx="6" stroke="white" strokeWidth="1.8"/>
            <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.8"/>
            <circle cx="18" cy="6" r="1.5" fill="white"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0 text-left">
          <p className="text-[14px] font-semibold">Instagram Reels</p>
          <p className="text-[12px] text-black/35 mt-0.5">릴스 or 피드 링크</p>
        </div>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 opacity-15">
          <path d="M9 6l6 6-6 6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

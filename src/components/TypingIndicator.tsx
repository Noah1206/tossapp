import Image from "next/image";

export default function TypingIndicator() {
  return (
    <div className="flex gap-2.5 items-start">
      <Image src="/logo.png" alt="AI" width={28} height={28} className="w-7 h-7 rounded-full flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-[11px] font-semibold text-black/30 mb-1.5 uppercase tracking-wider">LOGOS</p>
        <div className="message-ai px-4 py-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex gap-1">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
            <span className="text-[13px] text-black/40">분석 중...</span>
          </div>
        </div>
      </div>
    </div>
  );
}

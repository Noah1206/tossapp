"use client";

import { useState } from "react";
import Image from "next/image";

interface Message {
  id: string;
  type: "user" | "ai" | "system";
  content: string;
  timestamp: Date;
  blogResult?: string;
}

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const handleCopy = async () => {
    if (!message.blogResult) return;
    try {
      await navigator.clipboard.writeText(message.blogResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  if (message.type === "user") {
    return (
      <div className="flex justify-end">
        <div className="message-user px-4 py-2.5 max-w-[80%]">
          <p className="text-[14px] leading-relaxed break-all">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2.5 items-start">
      <Image src="/logo.png" alt="AI" width={28} height={28} className="w-7 h-7 rounded-full flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-semibold text-black/30 mb-1.5 uppercase tracking-wider">LOGOS</p>

        <div className="message-ai px-4 py-3">
          <p className="text-[14px] leading-[1.6]">
            {message.content}
          </p>
        </div>

        {message.blogResult && (
          <div className="mt-2 border border-[var(--color-border)] rounded-xl overflow-hidden">
            <button
              onClick={() => setExpanded(!expanded)}
              className="w-full flex items-center justify-between px-4 py-3"
            >
              <span className="text-[13px] font-semibold">블로그 글 완성</span>
              <svg
                width="16" height="16" viewBox="0 0 24 24" fill="none"
                className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
              </svg>
            </button>

            {expanded && (
              <div className="px-4 pb-4">
                <div className="bg-[var(--color-surface-secondary)] rounded-lg p-4">
                  <div className="blog-result whitespace-pre-wrap">{message.blogResult}</div>
                </div>
              </div>
            )}

            <div className="flex border-t border-[var(--color-border)]">
              <button
                onClick={handleCopy}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 press-effect"
              >
                <span className={`text-[13px] font-semibold ${copied ? "text-[var(--color-brand)]" : "text-black/50"}`}>
                  {copied ? "복사됨" : "복사"}
                </span>
              </button>
              <div className="w-px bg-[var(--color-border)]" />
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 press-effect">
                <span className="text-[13px] font-semibold text-black/50">공유</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import HistorySidebar from "@/components/HistorySidebar";
import MessageBubble from "@/components/MessageBubble";
import TypingIndicator from "@/components/TypingIndicator";

interface Message {
  id: string;
  type: "user" | "ai" | "system";
  content: string;
  timestamp: Date;
  isLoading?: boolean;
  blogResult?: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", type: "system", content: "", timestamp: new Date() },
  ]);
  const [inputUrl, setInputUrl] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [credits, setCredits] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleConvert = async () => {
    if (!inputUrl.trim() || isConverting) return;
    const url = inputUrl.trim();
    setInputUrl("");

    const userMsg: Message = { id: Date.now().toString(), type: "user", content: url, timestamp: new Date() };
    const loadingMsg: Message = { id: (Date.now() + 1).toString(), type: "ai", content: "", timestamp: new Date(), isLoading: true };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setIsConverting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const blogContent = generateSampleBlog();
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMsg.id
            ? { ...msg, isLoading: false, content: "변환이 완료됐어요! 아래에서 결과를 확인하세요.", blogResult: blogContent }
            : msg
        )
      );
      setCredits((prev) => Math.max(0, prev - 1));
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === loadingMsg.id
            ? { ...msg, isLoading: false, content: "변환 중 문제가 생겼어요. 다시 시도해주세요." }
            : msg
        )
      );
    } finally {
      setIsConverting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleConvert();
    }
  };

  const hasMessages = messages.filter((m) => m.type !== "system").length > 0;

  return (
    <div className="flex flex-col h-dvh bg-white">
      <Header credits={credits} onMenuClick={() => setSidebarOpen(true)} />
      <HistorySidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto">
        {!hasMessages ? (
          <div className="flex flex-col h-full animate-fade-in-up">
            {/* Plan Badge */}
            <div className="flex justify-center pt-8 pb-5">
              <div className="inline-flex items-center border border-black/12 rounded-full overflow-hidden">
                <span className="pl-4 pr-2 py-2 text-[13px] text-black/50 font-medium">무료 {credits}회</span>
                <span className="w-px h-3.5 bg-black/15" />
                <a href="/credits" className="pl-2 pr-4 py-2 text-[13px] text-[var(--color-brand)] font-bold">
                  충전하기
                </a>
              </div>
            </div>

            {/* Title */}
            <div className="text-center px-5 pb-6">
              <h1 className="text-[28px] font-extrabold tracking-tight leading-tight">
                무엇을 변환할까요?
              </h1>
            </div>

            {/* Input Card */}
            <div className="px-5 pb-4">
              <div className="border border-black/15 rounded-2xl bg-white overflow-hidden" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <textarea
                  ref={textareaRef}
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="작업을 할당하거나 무엇이든 질문하세요"
                  disabled={isConverting}
                  rows={4}
                  className="w-full px-5 pt-5 pb-3 text-[15px] placeholder:text-black/30 focus:outline-none resize-none disabled:opacity-40 bg-transparent leading-relaxed"
                />
                <div className="flex items-center justify-between px-3 pb-3">
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={() => setInputUrl("https://youtube.com/shorts/")}
                      className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/5 press-effect transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14M5 12h14" stroke="black" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
                      </svg>
                    </button>
                    <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/5 press-effect transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="black" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
                        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="black" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-black/5 press-effect transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" stroke="black" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
                        <path d="M19 10v2a7 7 0 01-14 0v-2" stroke="black" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
                        <path d="M12 19v4M8 23h8" stroke="black" strokeWidth="1.8" strokeLinecap="round" opacity="0.35"/>
                      </svg>
                    </button>
                    <button
                      onClick={handleConvert}
                      disabled={!inputUrl.trim() || isConverting || credits <= 0}
                      className="w-10 h-10 rounded-xl bg-[var(--color-brand)] flex items-center justify-center press-effect disabled:opacity-20 transition-opacity"
                    >
                      {isConverting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                          <path d="M12 19V5M5 12l7-7 7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Chips */}
            <div className="px-5 pb-5">
              <div className="flex flex-wrap gap-2.5 justify-center">
                <button
                  onClick={() => setInputUrl("https://youtube.com/shorts/")}
                  className="inline-flex items-center gap-2.5 px-5 py-3 border border-black/10 bg-black/4 rounded-full press-effect hover:bg-black/8 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="black" opacity="0.5">
                    <path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/>
                  </svg>
                  <span className="text-[14px] font-semibold">YouTube Shorts</span>
                </button>
                <button
                  onClick={() => setInputUrl("https://instagram.com/reel/")}
                  className="inline-flex items-center gap-2.5 px-5 py-3 border border-black/10 bg-black/4 rounded-full press-effect hover:bg-black/8 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" opacity="0.5">
                    <rect x="2" y="2" width="20" height="20" rx="6" stroke="black" strokeWidth="2"/>
                    <circle cx="12" cy="12" r="5" stroke="black" strokeWidth="2"/>
                  </svg>
                  <span className="text-[14px] font-semibold">Instagram Reels</span>
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5 justify-center mt-2.5">
                <a
                  href="/convert"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-black/10 bg-black/4 rounded-full press-effect hover:bg-black/8 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" opacity="0.5">
                    <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" stroke="black" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-[14px] font-semibold">톤 설정</span>
                </a>
                <a
                  href="/credits"
                  className="inline-flex items-center gap-2 px-5 py-3 border border-black/10 bg-black/4 rounded-full press-effect hover:bg-black/8 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" opacity="0.5">
                    <circle cx="12" cy="12" r="10" stroke="black" strokeWidth="1.8"/>
                    <path d="M12 6v12M6 12h12" stroke="black" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  <span className="text-[14px] font-semibold">크레딧 충전</span>
                </a>
                <button className="inline-flex items-center px-5 py-3 border border-black/10 bg-black/4 rounded-full press-effect hover:bg-black/8 transition-colors">
                  <span className="text-[14px] font-semibold text-black/40">더보기</span>
                </button>
              </div>
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Bottom Banner */}
            <div className="px-5 pb-6">
              <div className="rounded-2xl p-5" style={{ backgroundColor: '#ECECEC' }}>
                <p className="text-[11px] font-bold text-black/30 uppercase tracking-widest mb-2">TIP</p>
                <p className="text-[15px] font-bold leading-relaxed">
                  유튜브 쇼츠 · 인스타 릴스 링크를<br/>
                  붙여넣으면 AI가 네이버 블로그<br/>
                  SEO 최적화 글로 변환해요
                </p>
                <div className="flex items-center gap-2 mt-3">
                  {["SEO", "이모지", "해시태그"].map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-bold text-[var(--color-brand)] px-2.5 py-1 rounded-md"
                      style={{ backgroundColor: 'rgba(107, 92, 231, 0.08)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="px-5 py-4 space-y-5">
            {messages
              .filter((m) => m.type !== "system")
              .map((message, index) => (
                <div
                  key={message.id}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {message.isLoading ? <TypingIndicator /> : <MessageBubble message={message} />}
                </div>
              ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Input bar for message mode */}
      {hasMessages && (
        <div className="bg-white px-5 py-3 border-t border-black/8">
          <div className="flex items-center gap-2.5">
            <input
              type="url"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="영상 링크를 붙여넣으세요"
              disabled={isConverting}
              className="flex-1 bg-[var(--color-surface-secondary)] rounded-xl px-4 py-3 text-[15px] placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)]/30 transition-all disabled:opacity-40"
            />
            <button
              onClick={handleConvert}
              disabled={!inputUrl.trim() || isConverting || credits <= 0}
              className="flex-shrink-0 w-11 h-11 rounded-xl bg-[var(--color-brand)] flex items-center justify-center press-effect disabled:opacity-20"
            >
              {isConverting ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M12 19V5M5 12l7-7 7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function generateSampleBlog(): string {
  return `## 이런 꿀팁 몰랐죠? 지금 바로 확인하세요! 🔥

안녕하세요 여러분! 오늘은 정말 유용한 정보를 가져왔어요.
최근에 화제가 된 영상을 보고, 꼭 공유하고 싶었거든요 😊

### 핵심 포인트 정리 📌

영상에서 다룬 핵심 내용을 정리해봤어요.
하나하나 따라하면 여러분도 충분히 할 수 있답니다!

1. **첫 번째 포인트** - 시작이 반이에요
2. **두 번째 포인트** - 꾸준함이 중요해요
3. **세 번째 포인트** - 작은 습관이 큰 변화를 만들어요

### 실전 적용 방법 💡

이론만으로는 부족하죠!
실제로 어떻게 적용하면 되는지 알려드릴게요.

매일 10분만 투자해보세요.
한 달 후면 확실한 변화를 느끼실 거예요 ✨

### 마무리 한마디 🎯

오늘 공유한 내용이 도움이 되셨다면
좋아요와 이웃 추가 부탁드려요!

궁금한 점은 댓글로 남겨주세요 💬

#꿀팁 #정보공유 #일상 #추천 #트렌드`;
}

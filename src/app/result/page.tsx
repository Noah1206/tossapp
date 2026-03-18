"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import BlogResult from "@/components/BlogResult";
import HistorySidebar from "@/components/HistorySidebar";

interface BlogSection {
  emoji: string;
  title: string;
  content: string;
  frame_index?: number | null;
}

interface ResultData {
  blogTitle: string;
  summary: string;
  sections: BlogSection[];
  hashtags: string[];
  frameUrls: string[];
  closingCta: string;
  rawContent?: string;
}

// FastAPI 응답 → 프론트엔드 형식 변환 (웹 버전과 동일)
function mapResponseToResultData(data: any): ResultData {
  const structure = data.blog_structure;
  const keywords = data.seo_keywords;

  const sections: BlogSection[] = (structure.sections ?? []).map((s: any) => ({
    emoji: s.emoji ?? "📌",
    title: s.title ?? "",
    content: s.content ?? "",
    frame_index: s.frame_index ?? null,
  }));

  const hashtags = (keywords?.hashtags ?? []).map((tag: string) =>
    tag.startsWith("#") ? tag : `#${tag}`
  );

  return {
    blogTitle: structure.title,
    summary: structure.introduction,
    sections,
    hashtags,
    frameUrls: (data.frame_urls ?? []).map((u: string) =>
      u.startsWith("/") ? `${process.env.NEXT_PUBLIC_FASTAPI_URL || ""}${u}` : u
    ),
    closingCta: structure.closing_cta ?? "",
    rawContent: data.blog_content,
  };
}

// ResultData → 마크다운 문자열 변환 (BlogResult 컴포넌트용)
function resultToMarkdown(data: ResultData): string {
  let md = `## ${data.blogTitle}\n\n`;
  md += `${data.summary}\n\n`;

  for (const section of data.sections) {
    md += `### ${section.emoji} ${section.title}\n\n`;
    md += `${section.content}\n\n`;
  }

  if (data.closingCta) {
    md += `${data.closingCta}\n\n`;
  }

  if (data.hashtags.length > 0) {
    md += data.hashtags.join(" ");
  }

  return md;
}

const LOADING_MESSAGES = [
  "영상을 다운로드하고 있어요...",
  "영상 열심히 보는 중이에요 👀",
  "귀 쫑긋 세우고 듣고 있어요 🐰",
  "핵심만 쏙쏙 뽑아내는 중이에요",
  "블로그 뼈대를 쌓고 있어요 🏗️",
  "글재주 200% 발휘 중이에요 ✍️",
  "소제목 센스있게 다듬는 중이에요",
  "이모지 적재적소에 배치 중 😎",
  "SEO 키워드 자연스럽게 녹이는 중...",
  "마지막 퇴고 중이에요, 거의 다 왔어요!",
];

const TIPS = [
  "영상이 길수록 더 풍성한 글이 나와요 🍖",
  "네이버가 좋아하는 구조로 자동 세팅돼요",
  "복사해서 바로 블로그에 붙여넣기만 하면 끝!",
  "사장님 매출 올리는 블로그, AI가 대신 써드려요",
];

function ResultContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url") || "";
  const tone = searchParams.get("tone") || "";
  const historyId = searchParams.get("historyId") || "";

  const [progress, setProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [sseMessage, setSseMessage] = useState("");
  const [resultData, setResultData] = useState<ResultData | null>(null);
  const [historySourceUrl, setHistorySourceUrl] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();

  // Loading UI states
  const [messageIndex, setMessageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [messageFade, setMessageFade] = useState(true);
  const [tipFade, setTipFade] = useState(true);
  const [dots, setDots] = useState("");

  const hasStarted = useRef(false);

  // 히스토리에서 저장된 결과 바로 로드
  useEffect(() => {
    if (!historyId || hasStarted.current) return;
    hasStarted.current = true;

    (async () => {
      try {
        const res = await fetch(`/api/history?id=${historyId}`);
        if (!res.ok) throw new Error("not found");
        const { data } = await res.json();
        if (data.resultJson) {
          const mapped = mapResponseToResultData(data.resultJson);
          setResultData(mapped);
          setHistorySourceUrl(data.sourceUrl || "");
          setProgress(100);
          setDisplayProgress(100);
          setIsComplete(true);
        } else if (data.sourceUrl) {
          // resultJson이 없으면 sourceUrl로 다시 변환
          window.location.replace(`/result?url=${encodeURIComponent(data.sourceUrl)}`);
        } else {
          setErrorMessage("저장된 결과를 찾을 수 없습니다.");
          setIsError(true);
        }
      } catch {
        setErrorMessage("히스토리를 불러올 수 없습니다.");
        setIsError(true);
      }
    })();
  }, [historyId]);

  // Dots animation
  useEffect(() => {
    if (isComplete) return;
    const id = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);
    return () => clearInterval(id);
  }, [isComplete]);

  // Message rotation
  useEffect(() => {
    if (isComplete) return;
    const id = setInterval(() => {
      setMessageFade(false);
      setTimeout(() => {
        setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
        setMessageFade(true);
      }, 300);
    }, 2800);
    return () => clearInterval(id);
  }, [isComplete]);

  // Tip rotation
  useEffect(() => {
    if (isComplete) return;
    const id = setInterval(() => {
      setTipFade(false);
      setTimeout(() => {
        setTipIndex(prev => (prev + 1) % TIPS.length);
        setTipFade(true);
      }, 300);
    }, 4500);
    return () => clearInterval(id);
  }, [isComplete]);

  // displayProgress smooth animation
  useEffect(() => {
    if (isComplete || isError) return;
    const timer = setInterval(() => {
      setDisplayProgress(prev => {
        if (prev < progress) {
          const gap = progress - prev;
          return prev + Math.max(0.5, gap * 0.15);
        }
        if (prev < 90) {
          return prev + 0.1;
        }
        return prev;
      });
    }, 100);
    return () => clearInterval(timer);
  }, [progress, isComplete, isError]);

  // 백그라운드 변환 트리거 + SSE 스트림 연결
  useEffect(() => {
    if (historyId) return; // 히스토리 로드 시 스킵
    if (!url || hasStarted.current) return;
    hasStarted.current = true;

    let cancelled = false;
    const controller = new AbortController();

    // 1) 백그라운드 변환 트리거 (서버 사이드, 페이지 이탈해도 계속 처리됨)
    const userId = localStorage.getItem("toss_user_id") || "anonymous";
    fetch("/api/convert/background", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, tone: tone || undefined, userId }),
    }).catch(() => {});

    // 5분 타임아웃
    const timeout = setTimeout(() => {
      if (!cancelled) {
        cancelled = true;
        controller.abort();
        setErrorMessage("변환 시간이 너무 오래 걸려요. 다시 시도해주세요.");
        setIsError(true);
      }
    }, 300_000);

    // 2) SSE 스트림 (실시간 진행률 표시용, 페이지에 있을 때만)
    const callSSE = async () => {
      try {
        const res = await fetch("/api/convert/stream", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url,
            ...(tone && { tone }),
          }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          setErrorMessage(data.error ?? "변환 중 오류가 발생했습니다.");
          setIsError(true);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let gotResult = false;

        const processLines = (lines: string[]) => {
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6).trim();
            if (!jsonStr) continue;

            try {
              const event = JSON.parse(jsonStr);

              if (event.error) {
                clearTimeout(timeout);
                setErrorMessage(event.message ?? "변환에 실패했습니다.");
                setIsError(true);
                setProgress(0);
                setDisplayProgress(0);
                gotResult = true;
                return;
              }

              if (event.message) {
                setSseMessage(event.message);
              }

              if (event.progress !== undefined && event.progress >= 0) {
                setProgress(event.progress);
              }

              if (event.result) {
                clearTimeout(timeout);
                gotResult = true;
                const mapped = mapResponseToResultData(event.result);
                setResultData(mapped);
                setProgress(100);
                setDisplayProgress(100);
                setTimeout(() => setIsComplete(true), 400);
                // 히스토리 저장은 백그라운드 API가 처리하므로 여기서는 생략
                return;
              }
            } catch {
              // JSON 파싱 실패 무시
            }
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done || cancelled) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          processLines(lines);
          if (gotResult) return;
        }

        if (buffer.trim()) {
          processLines([buffer]);
        }

        if (!gotResult && !cancelled) {
          clearTimeout(timeout);
          setErrorMessage("변환이 완료되지 않았어요. 다시 시도해주세요.");
          setIsError(true);
        }
      } catch {
        if (!cancelled) {
          clearTimeout(timeout);
          setErrorMessage("서버에 연결할 수 없습니다.");
          setIsError(true);
        }
      }
    };

    callSSE();
    return () => { cancelled = true; clearTimeout(timeout); controller.abort(); hasStarted.current = false; };
  }, [url, tone, historyId]);

  // 에러 상태
  if (isError) {
    return (
      <div className="page-transition" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#FFFFFF' }}>
        <Header title="변환 결과" showBack />
        <main className="animate-fade-in-scale" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 32px', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,59,48,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4M12 17h.01" stroke="#FF3B30" strokeWidth="2" strokeLinecap="round"/>
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#FF3B30" strokeWidth="1.5"/>
            </svg>
          </div>
          <p style={{ fontSize: 16, fontWeight: 700, color: '#000' }}>변환에 실패했어요</p>
          <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', textAlign: 'center', lineHeight: 1.5 }}>{errorMessage}</p>
          <button
            onClick={() => window.history.back()}
            className="press-effect"
            style={{ marginTop: 8, padding: '12px 32px', borderRadius: 12, background: '#000', color: '#fff', fontSize: 14, fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
          >
            다시 시도하기
          </button>
        </main>
      </div>
    );
  }

  // 변환 완료 → 결과 표시
  if (isComplete && resultData) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#FFFFFF' }}>
        {/* 커스텀 헤더: 히스토리 버튼 + 새로 만들기 버튼 */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 50,
          background: '#FFFFFF', borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            height: 72, padding: '0 20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* 히스토리 버튼 */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="press-effect"
                style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: 'none', cursor: 'pointer' }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="#000" strokeWidth="1.8"/>
                  <polyline points="12,7 12,12 15.5,14" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <span style={{ fontSize: 18, fontWeight: 700 }}>변환 결과</span>
            </div>

            {/* 새로 만들기 버튼 */}
            <button
              onClick={() => router.push('/')}
              className="press-effect"
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 14px', borderRadius: 9999,
                background: 'none', border: 'none',
                cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 'inherit',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path d="M12 5v14M5 12h14" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: '#000' }}>새 변환</span>
            </button>
          </div>
        </header>

        <main className="animate-fade-in-up" style={{ flex: 1, overflowY: 'auto' }}>
          <BlogResult data={resultData} sourceUrl={historySourceUrl || url} onBack={() => router.push('/')} />
        </main>

        <HistorySidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          userId={typeof window !== 'undefined' ? localStorage.getItem('toss_user_id') : null}
          onItemClick={(item) => {
            setSidebarOpen(false);
            router.push(`/result?historyId=${item.id}`);
          }}
        />
      </div>
    );
  }

  // 로딩 상태
  const progressThresholds = [0, 20, 40, 60, 80];
  const displayMessage = sseMessage || LOADING_MESSAGES[messageIndex];

  return (
    <div className="page-transition" style={{ display: 'flex', flexDirection: 'column', height: '100dvh', background: '#FFFFFF' }}>
      <Header title="변환 중" showBack />
      <main className="animate-fade-in-scale" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 32px',
        gap: 24,
      }}>
        {/* Status Message */}
        <p style={{
          fontSize: 17,
          fontWeight: 700,
          color: '#000',
          textAlign: 'center',
          lineHeight: 1.5,
          opacity: messageFade ? 1 : 0,
          transform: messageFade ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.3s, transform 0.3s',
          minHeight: 26,
        }}>
          {displayMessage}{dots}
        </p>

        {/* Progress Percentage */}
        <p style={{ fontSize: 14, fontWeight: 700, color: '#6B5CE7' }}>
          {Math.min(Math.round(displayProgress), 100)}%
        </p>

        {/* Progress Bar */}
        <div style={{ width: '100%', maxWidth: 260 }}>
          <div style={{
            width: '100%',
            height: 6,
            borderRadius: 3,
            background: 'rgba(0,0,0,0.06)',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${displayProgress}%`,
              height: '100%',
              borderRadius: 3,
              background: 'linear-gradient(90deg, #6B5CE7, #9B8FFF)',
              transition: 'width 0.3s ease-out',
            }} />
          </div>

          {/* Progress Dots */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 8,
            padding: '0 2px',
          }}>
            {progressThresholds.map((threshold) => (
              <div
                key={threshold}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: displayProgress >= threshold ? '#6B5CE7' : 'rgba(0,0,0,0.1)',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
        </div>

        {/* Source URL */}
        <p style={{
          fontSize: 11,
          color: 'rgba(0,0,0,0.2)',
          textAlign: 'center',
          wordBreak: 'break-all',
          maxWidth: 260,
          lineHeight: 1.4,
        }}>
          {url}
        </p>

        {/* TIP Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 16px',
          background: 'rgba(107, 92, 231, 0.06)',
          borderRadius: 9999,
          marginTop: 8,
        }}>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#6B5CE7' }}>TIP</span>
          <span style={{
            fontSize: 12,
            color: 'rgba(0,0,0,0.4)',
            fontWeight: 500,
            opacity: tipFade ? 1 : 0,
            transition: 'opacity 0.3s',
          }}>
            {TIPS[tipIndex]}
          </span>
        </div>
      </main>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense>
      <ResultContent />
    </Suspense>
  );
}

"use client";

import { useState, useCallback } from "react";

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
}

interface BlogResultProps {
  data: ResultData;
  sourceUrl: string;
  onBack: () => void;
}

async function downloadImage(url: string, filename: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  } catch {
    window.open(url, "_blank");
  }
}

export default function BlogResult({ data, sourceUrl, onBack }: BlogResultProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // 프레임 매칭 로직 (웹 버전과 동일)
  const hasFrameMatching = data.sections.some(
    (s) => s.frame_index != null && s.frame_index >= 0
  );
  const usedIndices = new Set(
    data.sections
      .map((s) => s.frame_index)
      .filter((fi): fi is number => fi != null && fi >= 0)
  );
  const introIndex = data.frameUrls.findIndex((_, i) => !usedIndices.has(i));
  const introUrl = data.frameUrls.length > 0
    ? data.frameUrls[introIndex >= 0 ? introIndex : 0]
    : undefined;
  const introActualIdx = data.frameUrls.length > 0 ? (introIndex >= 0 ? introIndex : 0) : -1;

  const handleCopy = async () => {
    // 텍스트 + 이미지 포함 복사
    let text = `${data.blogTitle}\n\n${data.summary}\n\n`;
    for (const s of data.sections) {
      text += `${s.emoji} ${s.title}\n\n${s.content}\n\n`;
    }
    if (data.closingCta) text += `${data.closingCta}\n\n`;
    if (data.hashtags.length > 0) text += data.hashtags.join(" ");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleDownloadAll = useCallback(async () => {
    if (data.frameUrls.length === 0 || downloading) return;
    setDownloading(true);
    for (let i = 0; i < data.frameUrls.length; i++) {
      await downloadImage(data.frameUrls[i], `blog_image_${i + 1}.jpg`);
      if (i < data.frameUrls.length - 1) await new Promise(r => setTimeout(r, 300));
    }
    setDownloading(false);
  }, [data.frameUrls, downloading]);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Source URL */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', background: 'rgba(0,0,0,0.025)',
          borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)',
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, opacity: 0.25 }}>
            <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" stroke="#000" strokeWidth="1.8" strokeLinecap="round"/>
            <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" stroke="#000" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
          <p style={{ fontSize: 12, color: 'rgba(0,0,0,0.35)', wordBreak: 'break-all', lineHeight: 1.4 }}>
            {sourceUrl}
          </p>
        </div>
      </div>

      {/* Blog Content */}
      <div style={{ padding: '24px 20px 20px' }}>
        {/* 제목 */}
        <h2 style={{
          fontSize: 20, fontWeight: 800, color: '#000',
          margin: '0 0 20px', lineHeight: 1.4, letterSpacing: '-0.02em',
        }}>
          {data.blogTitle}
        </h2>

        {/* 도입부 */}
        <p style={{ fontSize: 15, color: 'rgba(0,0,0,0.65)', lineHeight: 2, margin: '4px 0' }}>
          {data.summary}
        </p>

        {/* 도입부 이미지 */}
        {introUrl && (
          <div style={{ margin: '16px 0', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
            <img src={introUrl} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
            <button
              onClick={() => downloadImage(introUrl, 'blog_image_intro.jpg')}
              className="press-effect"
              style={{
                position: 'absolute', top: 10, right: 10,
                width: 34, height: 34, borderRadius: 10,
                background: 'rgba(0,0,0,0.5)', border: 'none',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v13M5 12l7 7 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M5 21h14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        )}

        {/* 섹션들 */}
        {data.sections.map((section, idx) => {
          // 섹션 이미지 매칭
          let frameUrl: string | undefined;
          if (hasFrameMatching) {
            if (section.frame_index != null && section.frame_index >= 0 && section.frame_index < data.frameUrls.length && section.frame_index !== introActualIdx) {
              frameUrl = data.frameUrls[section.frame_index];
            }
          } else {
            const fallbackIdx = idx + 1;
            if (fallbackIdx !== introActualIdx && fallbackIdx < data.frameUrls.length) {
              frameUrl = data.frameUrls[fallbackIdx];
            }
          }

          return (
            <div key={idx}>
              {/* 소제목 */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '28px 0 14px' }}>
                <span style={{ width: 3, height: 20, background: '#6B5CE7', borderRadius: 2, flexShrink: 0 }} />
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#000', lineHeight: 1.4 }}>
                  {section.emoji} {section.title}
                </h3>
              </div>

              {/* 본문 */}
              <p style={{ fontSize: 15, color: 'rgba(0,0,0,0.65)', lineHeight: 2, margin: '4px 0', whiteSpace: 'pre-line' }}>
                {section.content}
              </p>

              {/* 섹션 이미지 */}
              {frameUrl && (
                <div style={{ margin: '16px 0', borderRadius: 12, overflow: 'hidden', position: 'relative' }}>
                  <img src={frameUrl} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  <button
                    onClick={() => downloadImage(frameUrl, `blog_image_${idx + 1}.jpg`)}
                    className="press-effect"
                    style={{
                      position: 'absolute', top: 10, right: 10,
                      width: 34, height: 34, borderRadius: 10,
                      background: 'rgba(0,0,0,0.5)', border: 'none',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3v13M5 12l7 7 7-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 21h14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* 마무리 CTA */}
        {data.closingCta && (
          <p style={{ fontSize: 15, color: 'rgba(0,0,0,0.65)', lineHeight: 2, margin: '20px 0 4px' }}>
            {data.closingCta}
          </p>
        )}

        {/* 해시태그 */}
        {data.hashtags.length > 0 && (
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: 13, color: '#6B5CE7', lineHeight: 1.8, fontWeight: 500 }}>
              {data.hashtags.join(" ")}
            </p>
          </div>
        )}
      </div>

      {/* Sticky Action Bar */}
      <div style={{
        position: 'sticky', bottom: 0, background: '#FFFFFF',
        borderTop: '1px solid rgba(0,0,0,0.06)', padding: '12px 20px',
        display: 'flex', gap: 10,
      }}>
        <button
          onClick={handleCopy}
          className="press-effect"
          style={{
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 8, height: 48, borderRadius: 14,
            background: copied ? '#6B5CE7' : '#000', color: '#fff',
            border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            letterSpacing: 'inherit', transition: 'background 0.2s',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            {copied ? (
              <path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            ) : (
              <>
                <rect x="9" y="9" width="13" height="13" rx="2" stroke="#fff" strokeWidth="1.5"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="#fff" strokeWidth="1.5"/>
              </>
            )}
          </svg>
          <span style={{ fontSize: 15, fontWeight: 700 }}>
            {copied ? "복사 완료!" : "복사하기"}
          </span>
        </button>
        {data.frameUrls.length > 0 && (
          <button
            onClick={handleDownloadAll}
            className="press-effect"
            style={{
              width: 48, height: 48, borderRadius: 14,
              background: downloading ? 'rgba(107,92,231,0.1)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${downloading ? 'rgba(107,92,231,0.2)' : 'rgba(0,0,0,0.08)'}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            title="사진 전체 저장"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v13M5 12l7 7 7-7" stroke={downloading ? '#6B5CE7' : 'rgba(0,0,0,0.4)'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 21h14" stroke={downloading ? '#6B5CE7' : 'rgba(0,0,0,0.4)'} strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        <button
          onClick={onBack}
          className="press-effect"
          style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

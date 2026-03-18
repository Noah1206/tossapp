"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { share } from "@/lib/toss-bridge";

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
    const proxyUrl = `/api/download-image?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error("download failed");
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

type TextAlign = 'left' | 'center' | 'right';
type FontWeightOption = 'Light' | 'Regular' | 'Medium' | 'Bold';
const fontWeightMap: Record<FontWeightOption, number> = { Light: 300, Regular: 400, Medium: 500, Bold: 700 };

export default function BlogResult({ data, sourceUrl, onBack }: BlogResultProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // 편집 가능한 콘텐츠 상태
  const [editTitle, setEditTitle] = useState(data.blogTitle);
  const [editSummary, setEditSummary] = useState(data.summary);
  const [editSections, setEditSections] = useState(
    data.sections.map(s => ({ ...s }))
  );
  const [editClosingCta, setEditClosingCta] = useState(data.closingCta);
  const [editHashtags, setEditHashtags] = useState(data.hashtags.join(" "));

  // 스타일 커스터마이징 상태
  const [showToolbar, setShowToolbar] = useState(false);
  const [includeEmoji, setIncludeEmoji] = useState(true);
  const [separateSubtitles, setSeparateSubtitles] = useState(true);
  const [showToc, setShowToc] = useState(false);
  const [textAlign, setTextAlign] = useState<TextAlign>('left');
  const [fontSize, setFontSize] = useState(16);
  const [fontWeight, setFontWeight] = useState<FontWeightOption>('Regular');
  const [hashtagCount, setHashtagCount] = useState<number | null>(null);

  const updateSection = (idx: number, field: 'title' | 'content', value: string) => {
    setEditSections(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], [field]: value };
      return next;
    });
  };

  // 프레임 매칭 로직
  const hasFrameMatching = editSections.some(
    (s) => s.frame_index != null && s.frame_index >= 0
  );
  const usedIndices = new Set(
    editSections
      .map((s) => s.frame_index)
      .filter((fi): fi is number => fi != null && fi >= 0)
  );
  const introIndex = data.frameUrls.findIndex((_, i) => !usedIndices.has(i));
  const introUrl = data.frameUrls.length > 0
    ? data.frameUrls[introIndex >= 0 ? introIndex : 0]
    : undefined;
  const introActualIdx = data.frameUrls.length > 0 ? (introIndex >= 0 ? introIndex : 0) : -1;

  // 편집된 해시태그 파싱
  const parsedHashtags = editHashtags
    .split(/[\s,]+/)
    .map(t => t.trim())
    .filter(t => t.length > 0);

  const handleCopy = async () => {
    let text = `${editTitle}\n\n${editSummary}\n\n`;
    for (const s of editSections) {
      const emoji = includeEmoji ? `${s.emoji} ` : '';
      text += `${emoji}${s.title}\n\n${s.content}\n\n`;
    }
    if (editClosingCta) text += `${editClosingCta}\n\n`;
    const visibleTags = hashtagCount != null ? parsedHashtags.slice(0, hashtagCount) : parsedHashtags;
    if (visibleTags.length > 0) text += visibleTags.join(" ");

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
    try {
      const res = await fetch("/api/download-images", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: data.frameUrls }),
      });
      if (!res.ok) throw new Error("zip failed");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = "blog_images.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch {
      for (let i = 0; i < data.frameUrls.length; i++) {
        await downloadImage(data.frameUrls[i], `blog_image_${i + 1}.jpg`);
      }
    }
    setDownloading(false);
  }, [data.frameUrls, downloading]);

  // 편집 가능 스타일
  const editableStyle: React.CSSProperties = {
    outline: 'none',
    borderRadius: 6,
    transition: 'background 0.15s',
    cursor: 'text',
  };

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
        {/* 제목 (편집 가능) */}
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setEditTitle(e.currentTarget.textContent || '')}
          style={{
            ...editableStyle,
            fontSize: 20, fontWeight: 800, color: '#000',
            lineHeight: 1.4, letterSpacing: '-0.02em',
            padding: '2px 4px', margin: '0 -4px 12px',
          }}
        >
          {data.blogTitle}
        </div>

        {/* 적용 버튼 */}
        <button
          onClick={() => setShowToolbar(v => !v)}
          className="press-effect"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', borderRadius: 9999,
            background: showToolbar ? 'rgba(107,92,231,0.08)' : 'rgba(0,0,0,0.04)',
            border: `1px solid ${showToolbar ? 'rgba(107,92,231,0.18)' : 'rgba(0,0,0,0.08)'}`,
            cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 'inherit',
            marginBottom: showToolbar ? 0 : 20,
          }}
        >
          <span style={{ fontSize: 12 }}>&#x2726;</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: showToolbar ? '#6B5CE7' : 'rgba(0,0,0,0.5)' }}>
            적용
          </span>
          <svg width="10" height="10" viewBox="0 0 10 10" style={{ transform: showToolbar ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
            <path d="M2 3.5L5 6.5L8 3.5" stroke={showToolbar ? '#6B5CE7' : 'rgba(0,0,0,0.3)'} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
          </svg>
        </button>

        {/* 스타일 툴바 */}
        {showToolbar && (
          <div style={{
            margin: '10px 0 20px', padding: 16,
            background: 'rgba(0,0,0,0.02)', borderRadius: 16,
            border: '1px solid rgba(0,0,0,0.06)',
            display: 'flex', flexDirection: 'column', gap: 16,
            animation: 'fadeIn 0.2s ease-out',
          }}>
            {/* 토글 옵션들 */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {([
                { label: '이모지 포함', active: includeEmoji, toggle: () => setIncludeEmoji(v => !v) },
                { label: '소제목 분리', active: separateSubtitles, toggle: () => setSeparateSubtitles(v => !v) },
                { label: '목차', active: showToc, toggle: () => setShowToc(v => !v) },
              ] as const).map(opt => (
                <button
                  key={opt.label}
                  onClick={opt.toggle}
                  className="press-effect"
                  style={{
                    padding: '6px 14px', borderRadius: 9999,
                    background: opt.active ? '#000' : 'rgba(0,0,0,0.04)',
                    border: `1px solid ${opt.active ? '#000' : 'rgba(0,0,0,0.08)'}`,
                    color: opt.active ? '#fff' : 'rgba(0,0,0,0.5)',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'inherit', letterSpacing: 'inherit',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* 정렬 */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.3)', marginBottom: 8, letterSpacing: '0.03em' }}>정렬</p>
              <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.04)', borderRadius: 10, padding: 3 }}>
                {(['left', 'center', 'right'] as const).map(align => (
                  <button
                    key={align}
                    onClick={() => setTextAlign(align)}
                    className="press-effect"
                    style={{
                      flex: 1, padding: '7px 0', borderRadius: 8,
                      background: textAlign === align ? '#fff' : 'transparent',
                      border: textAlign === align ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent',
                      boxShadow: textAlign === align ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                      cursor: 'pointer', fontFamily: 'inherit', letterSpacing: 'inherit',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      {align === 'left' && (
                        <>
                          <line x1="1" y1="3" x2="13" y2="3" stroke={textAlign === align ? '#000' : 'rgba(0,0,0,0.3)'} strokeWidth="1.4" strokeLinecap="round"/>
                          <line x1="1" y1="6.5" x2="9" y2="6.5" stroke={textAlign === align ? '#000' : 'rgba(0,0,0,0.3)'} strokeWidth="1.4" strokeLinecap="round"/>
                          <line x1="1" y1="10" x2="11" y2="10" stroke={textAlign === align ? '#000' : 'rgba(0,0,0,0.3)'} strokeWidth="1.4" strokeLinecap="round"/>
                        </>
                      )}
                      {align === 'center' && (
                        <>
                          <line x1="1" y1="3" x2="13" y2="3" stroke={textAlign === align ? '#000' : 'rgba(0,0,0,0.3)'} strokeWidth="1.4" strokeLinecap="round"/>
                          <line x1="3" y1="6.5" x2="11" y2="6.5" stroke={textAlign === align ? '#000' : 'rgba(0,0,0,0.3)'} strokeWidth="1.4" strokeLinecap="round"/>
                          <line x1="2" y1="10" x2="12" y2="10" stroke={textAlign === align ? '#000' : 'rgba(0,0,0,0.3)'} strokeWidth="1.4" strokeLinecap="round"/>
                        </>
                      )}
                      {align === 'right' && (
                        <>
                          <line x1="1" y1="3" x2="13" y2="3" stroke={textAlign === align ? '#000' : 'rgba(0,0,0,0.3)'} strokeWidth="1.4" strokeLinecap="round"/>
                          <line x1="5" y1="6.5" x2="13" y2="6.5" stroke={textAlign === align ? '#000' : 'rgba(0,0,0,0.3)'} strokeWidth="1.4" strokeLinecap="round"/>
                          <line x1="3" y1="10" x2="13" y2="10" stroke={textAlign === align ? '#000' : 'rgba(0,0,0,0.3)'} strokeWidth="1.4" strokeLinecap="round"/>
                        </>
                      )}
                    </svg>
                  </button>
                ))}
              </div>
            </div>

            {/* 크기 */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.03em' }}>크기</p>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#000' }}>{fontSize}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button
                  onClick={() => setFontSize(v => Math.max(12, v - 1))}
                  className="press-effect"
                  style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.4)', fontFamily: 'inherit',
                  }}
                >-</button>
                <div style={{ flex: 1, position: 'relative', height: 4, background: 'rgba(0,0,0,0.08)', borderRadius: 2 }}>
                  <div style={{
                    position: 'absolute', left: 0, top: 0, height: '100%', borderRadius: 2,
                    background: '#000', width: `${((fontSize - 12) / 12) * 100}%`,
                  }} />
                </div>
                <button
                  onClick={() => setFontSize(v => Math.min(24, v + 1))}
                  className="press-effect"
                  style={{
                    width: 30, height: 30, borderRadius: 8,
                    background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 600, color: 'rgba(0,0,0,0.4)', fontFamily: 'inherit',
                  }}
                >+</button>
              </div>
            </div>

            {/* 굵기 */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.3)', marginBottom: 8, letterSpacing: '0.03em' }}>굵기</p>
              <div style={{ display: 'flex', gap: 4, background: 'rgba(0,0,0,0.04)', borderRadius: 10, padding: 3 }}>
                {(['Light', 'Regular', 'Medium', 'Bold'] as const).map(w => (
                  <button
                    key={w}
                    onClick={() => setFontWeight(w)}
                    className="press-effect"
                    style={{
                      flex: 1, padding: '7px 0', borderRadius: 8,
                      background: fontWeight === w ? '#fff' : 'transparent',
                      border: fontWeight === w ? '1px solid rgba(0,0,0,0.08)' : '1px solid transparent',
                      boxShadow: fontWeight === w ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                      cursor: 'pointer', fontSize: 11, fontFamily: 'inherit', letterSpacing: 'inherit',
                      fontWeight: fontWeightMap[w], color: fontWeight === w ? '#000' : 'rgba(0,0,0,0.4)',
                    }}
                  >
                    {w}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 목차 */}
        {showToc && editSections.length > 0 && (
          <div style={{
            margin: '0 0 24px', padding: 16,
            background: 'rgba(0,0,0,0.02)', borderRadius: 14,
            border: '1px solid rgba(0,0,0,0.06)',
          }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(0,0,0,0.35)', marginBottom: 10, letterSpacing: '0.02em' }}>
              목차
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {editSections.map((s, i) => (
                <p key={i} style={{ fontSize: 13, color: 'rgba(0,0,0,0.55)', fontWeight: 500, lineHeight: 1.5 }}>
                  {i + 1}. {includeEmoji ? `${s.emoji} ` : ''}{s.title}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* 도입부 (편집 가능) */}
        <div
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => setEditSummary(e.currentTarget.textContent || '')}
          style={{
            ...editableStyle,
            fontSize, fontWeight: fontWeightMap[fontWeight],
            color: 'rgba(0,0,0,0.65)', lineHeight: 2, margin: '4px 0',
            textAlign, padding: '2px 4px',
          }}
        >
          {data.summary}
        </div>

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
        {editSections.map((section, idx) => {
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
              {/* 소제목 (편집 가능) */}
              {separateSubtitles && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '28px 0 14px', justifyContent: textAlign === 'center' ? 'center' : textAlign === 'right' ? 'flex-end' : 'flex-start' }}>
                  <span style={{ width: 3, height: 20, background: '#6B5CE7', borderRadius: 2, flexShrink: 0 }} />
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => updateSection(idx, 'title', e.currentTarget.textContent || '')}
                    style={{
                      ...editableStyle,
                      fontSize: Math.max(fontSize, 16), fontWeight: 700, color: '#000', lineHeight: 1.4,
                      padding: '2px 4px',
                    }}
                  >
                    {includeEmoji ? `${section.emoji} ` : ''}{section.title}
                  </div>
                </div>
              )}

              {/* 본문 (편집 가능) */}
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => {
                  const text = e.currentTarget.innerText || '';
                  if (separateSubtitles) {
                    updateSection(idx, 'content', text);
                  } else {
                    // 인라인 소제목 모드: 첫 줄은 제목, 나머지는 본문
                    const lines = text.split('\n');
                    const titleLine = lines[0] || '';
                    const content = lines.slice(1).join('\n').trim();
                    // 이모지+제목에서 이모지 제거
                    const cleanTitle = titleLine.replace(/^[^\w가-힣]*\s*/, '');
                    updateSection(idx, 'title', cleanTitle);
                    updateSection(idx, 'content', content);
                  }
                }}
                style={{
                  ...editableStyle,
                  fontSize, fontWeight: fontWeightMap[fontWeight],
                  color: 'rgba(0,0,0,0.65)', lineHeight: 2,
                  margin: separateSubtitles ? '4px 0' : '20px 0 4px',
                  whiteSpace: 'pre-wrap', textAlign, padding: '2px 4px',
                }}
              >
                {!separateSubtitles && (
                  <span style={{ fontWeight: 700 }}>
                    {includeEmoji ? `${section.emoji} ` : ''}{section.title}{'\n'}
                  </span>
                )}
                {section.content}
              </div>

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

        {/* 마무리 CTA (편집 가능) */}
        {editClosingCta && (
          <div
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => setEditClosingCta(e.currentTarget.textContent || '')}
            style={{
              ...editableStyle,
              fontSize, fontWeight: fontWeightMap[fontWeight],
              color: 'rgba(0,0,0,0.65)', lineHeight: 2, margin: '20px 0 4px',
              textAlign, padding: '2px 4px',
            }}
          >
            {data.closingCta}
          </div>
        )}

        {/* 해시태그 (편집 가능) */}
        {parsedHashtags.length > 0 && (() => {
          const max = parsedHashtags.length;
          const count = hashtagCount ?? max;
          const visible = parsedHashtags.slice(0, count);
          return (
            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.3)', letterSpacing: '0.03em' }}>
                  해시태그 {count}/{max}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <button
                    onClick={() => setHashtagCount(Math.max(1, count - 1))}
                    className="press-effect"
                    style={{
                      width: 26, height: 26, borderRadius: 7,
                      background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.4)', fontFamily: 'inherit',
                    }}
                  >-</button>
                  <button
                    onClick={() => setHashtagCount(Math.min(max, count + 1))}
                    className="press-effect"
                    style={{
                      width: 26, height: 26, borderRadius: 7,
                      background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 600, color: 'rgba(0,0,0,0.4)', fontFamily: 'inherit',
                    }}
                  >+</button>
                  {hashtagCount !== null && (
                    <button
                      onClick={() => setHashtagCount(null)}
                      className="press-effect"
                      style={{
                        padding: '4px 10px', borderRadius: 7,
                        background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)',
                        cursor: 'pointer', fontSize: 10, fontWeight: 600,
                        color: 'rgba(0,0,0,0.35)', fontFamily: 'inherit', letterSpacing: 'inherit',
                      }}
                    >전체</button>
                  )}
                </div>
              </div>
              <div
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setEditHashtags(e.currentTarget.textContent || '')}
                style={{
                  ...editableStyle,
                  fontSize: 13, color: '#6B5CE7', lineHeight: 1.8, fontWeight: 500,
                  padding: '2px 4px',
                }}
              >
                {visible.join(" ")}
              </div>
            </div>
          );
        })()}
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
              background: downloading ? 'rgba(107,92,231,0.08)' : 'transparent',
              border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            title="사진 전체 저장"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 3v13M5 12l7 7 7-7" stroke={downloading ? '#6B5CE7' : '#000'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 21h14" stroke={downloading ? '#6B5CE7' : '#000'} strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        )}
        <button
          onClick={() => share(editTitle, editSummary, sourceUrl)}
          className="press-effect"
          style={{
            width: 48, height: 48, borderRadius: 14,
            background: 'transparent', border: 'none',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
          title="공유하기"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

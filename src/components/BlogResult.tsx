"use client";

import { useState } from "react";

interface BlogResultProps {
  content: string;
  sourceUrl: string;
  onBack: () => void;
}

function parseBlogContent(raw: string) {
  const lines = raw.split("\n");
  const sections: { type: "title" | "subtitle" | "text" | "list" | "hashtags"; content: string }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("## ")) {
      sections.push({ type: "title", content: trimmed.replace("## ", "") });
    } else if (trimmed.startsWith("### ")) {
      sections.push({ type: "subtitle", content: trimmed.replace("### ", "") });
    } else if (/^\d+\.\s\*\*/.test(trimmed)) {
      sections.push({ type: "list", content: trimmed.replace(/^\d+\.\s/, "").replace(/\*\*/g, "") });
    } else if (trimmed.startsWith("#") && trimmed.includes(" #")) {
      sections.push({ type: "hashtags", content: trimmed });
    } else {
      sections.push({ type: "text", content: trimmed.replace(/\*\*/g, "") });
    }
  }

  return sections;
}

export default function BlogResult({ content, sourceUrl, onBack }: BlogResultProps) {
  const [copied, setCopied] = useState(false);
  const sections = parseBlogContent(content);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', minHeight: '100%' }}>
      {/* Source URL */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 14px',
          background: 'rgba(0,0,0,0.025)',
          borderRadius: 12,
          border: '1px solid rgba(0,0,0,0.06)',
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
        {sections.map((section, i) => {
          if (section.type === "title") {
            return (
              <h2 key={i} style={{
                fontSize: 20,
                fontWeight: 800,
                color: '#000',
                margin: i === 0 ? '0 0 20px' : '32px 0 20px',
                lineHeight: 1.4,
                letterSpacing: '-0.02em',
              }}>
                {section.content}
              </h2>
            );
          }
          if (section.type === "subtitle") {
            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                margin: '28px 0 14px',
              }}>
                <span style={{
                  width: 3,
                  height: 20,
                  background: '#6B5CE7',
                  borderRadius: 2,
                  flexShrink: 0,
                }} />
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#000',
                  lineHeight: 1.4,
                }}>
                  {section.content}
                </h3>
              </div>
            );
          }
          if (section.type === "list") {
            return (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 10,
                padding: '6px 0',
                marginLeft: 6,
              }}>
                <span style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: '#6B5CE7',
                  flexShrink: 0,
                  marginTop: 9,
                  opacity: 0.5,
                }} />
                <p style={{
                  fontSize: 15,
                  color: 'rgba(0,0,0,0.7)',
                  lineHeight: 2,
                }}>
                  {section.content}
                </p>
              </div>
            );
          }
          if (section.type === "hashtags") {
            return (
              <div key={i} style={{
                marginTop: 28,
                paddingTop: 20,
                borderTop: '1px solid rgba(0,0,0,0.06)',
              }}>
                <p style={{
                  fontSize: 13,
                  color: '#6B5CE7',
                  lineHeight: 1.8,
                  fontWeight: 500,
                }}>
                  {section.content}
                </p>
              </div>
            );
          }
          // text
          return (
            <p key={i} style={{
              fontSize: 15,
              color: 'rgba(0,0,0,0.65)',
              lineHeight: 2,
              margin: '4px 0',
            }}>
              {section.content}
            </p>
          );
        })}
      </div>

      {/* Sticky Action Bar */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        background: '#FFFFFF',
        borderTop: '1px solid rgba(0,0,0,0.06)',
        padding: '12px 20px',
        display: 'flex',
        gap: 10,
      }}>
        <button
          onClick={handleCopy}
          className="press-effect"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            height: 48,
            borderRadius: 14,
            background: copied ? '#6B5CE7' : '#000',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontFamily: 'inherit',
            letterSpacing: 'inherit',
            transition: 'background 0.2s',
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
        <button
          className="press-effect"
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.08)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M16 6l-4-4-4 4M12 2v13" stroke="rgba(0,0,0,0.4)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={onBack}
          className="press-effect"
          style={{
            width: 48,
            height: 48,
            borderRadius: 14,
            background: 'rgba(0,0,0,0.04)',
            border: '1px solid rgba(0,0,0,0.08)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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

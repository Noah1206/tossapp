"use client";

import { useState } from "react";

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

export default function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

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
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div className="message-user" style={{ padding: '10px 16px', maxWidth: '80%' }}>
          <p style={{ fontSize: 14, lineHeight: 1.6, wordBreak: 'break-all' }}>{message.content}</p>
        </div>
      </div>
    );
  }

  // Blog result — full page style like web version
  if (message.blogResult) {
    const sections = parseBlogContent(message.blogResult);

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {/* Status message */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: '#6B5CE7', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, marginTop: 2,
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.5)', lineHeight: 1.6, paddingTop: 4 }}>
            {message.content}
          </p>
        </div>

        {/* Blog content card */}
        <div style={{
          border: '1px solid rgba(0,0,0,0.08)',
          borderRadius: 20,
          overflow: 'hidden',
          background: '#FFFFFF',
        }}>
          {/* Blog body */}
          <div style={{ padding: '24px 20px 20px' }}>
            {sections.map((section, i) => {
              if (section.type === "title") {
                return (
                  <h2 key={i} style={{
                    fontSize: 18, fontWeight: 800, color: '#000',
                    margin: i === 0 ? '0 0 16px' : '28px 0 16px',
                    lineHeight: 1.4,
                  }}>
                    {section.content}
                  </h2>
                );
              }
              if (section.type === "subtitle") {
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    margin: '24px 0 12px',
                  }}>
                    <span style={{ width: 3, height: 18, background: '#6B5CE7', borderRadius: 2, flexShrink: 0 }} />
                    <h3 style={{ fontSize: 15, fontWeight: 700, color: '#000', lineHeight: 1.4 }}>
                      {section.content}
                    </h3>
                  </div>
                );
              }
              if (section.type === "list") {
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                    padding: '6px 0', marginLeft: 4,
                  }}>
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(0,0,0,0.25)', flexShrink: 0, marginTop: 8 }} />
                    <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.7)', lineHeight: 1.8 }}>
                      {section.content}
                    </p>
                  </div>
                );
              }
              if (section.type === "hashtags") {
                return (
                  <div key={i} style={{
                    marginTop: 24, paddingTop: 16,
                    borderTop: '1px solid rgba(0,0,0,0.06)',
                  }}>
                    <p style={{ fontSize: 13, color: '#6B5CE7', lineHeight: 1.8, fontWeight: 500 }}>
                      {section.content}
                    </p>
                  </div>
                );
              }
              // text
              return (
                <p key={i} style={{
                  fontSize: 14, color: 'rgba(0,0,0,0.7)',
                  lineHeight: 1.9, margin: '4px 0',
                }}>
                  {section.content}
                </p>
              );
            })}
          </div>

          {/* Action bar */}
          <div style={{
            display: 'flex',
            borderTop: '1px solid rgba(0,0,0,0.06)',
          }}>
            <button
              onClick={handleCopy}
              className="press-effect"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '13px 0',
                border: 'none', background: 'none', cursor: 'pointer',
                fontFamily: 'inherit', letterSpacing: 'inherit',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <rect x="9" y="9" width="13" height="13" rx="2" stroke={copied ? '#6B5CE7' : 'rgba(0,0,0,0.35)'} strokeWidth="1.5"/>
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke={copied ? '#6B5CE7' : 'rgba(0,0,0,0.35)'} strokeWidth="1.5"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: copied ? '#6B5CE7' : 'rgba(0,0,0,0.4)' }}>
                {copied ? "복사됨" : "복사하기"}
              </span>
            </button>
            <div style={{ width: 1, background: 'rgba(0,0,0,0.06)' }} />
            <button
              className="press-effect"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 6, padding: '13px 0',
                border: 'none', background: 'none', cursor: 'pointer',
                fontFamily: 'inherit', letterSpacing: 'inherit',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M16 6l-4-4-4 4M12 2v13" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'rgba(0,0,0,0.4)' }}>공유하기</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Regular AI message (no blog result)
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 2,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3" stroke="#000" strokeWidth="1.5" opacity="0.4"/>
          <path d="M12 2v4m0 12v4m10-10h-4M6 12H2m15.07-7.07l-2.83 2.83M9.76 14.24l-2.83 2.83m12.14 0l-2.83-2.83M9.76 9.76L6.93 6.93" stroke="#000" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
        </svg>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>LOGOS</p>
        <div className="message-ai" style={{ padding: '12px 16px' }}>
          <p style={{ fontSize: 14, lineHeight: 1.6 }}>{message.content}</p>
        </div>
      </div>
    </div>
  );
}
